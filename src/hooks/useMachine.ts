// =============================================================================
// SubSense State Machine React Hook
// =============================================================================

import { useState, useEffect, useCallback, useRef } from 'react';
import { createMachine, type PopupMachine } from '../state-machine/machine';
import { storage } from '../storage/adapter';
import type { MachineState, PopupEvent, StateId } from '../state-machine/types';

export function useMachine() {
  const machineRef = useRef<PopupMachine | null>(null);
  const [state, setState] = useState<MachineState | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function init() {
      // Load counts from storage
      const { scoreReportCount, subscriptionCount } = await storage.getCounts();
      const settings = await storage.getUserSettings();

      // Determine initial state based on persistence rules
      let initialState: StateId = 'Home';
      if (settings.lastTab === 'subscriptions') {
        initialState = 'Subscriptions';
      } else if (scoreReportCount > 0 && settings.lastState === 'MyScores') {
        initialState = 'MyScores';
      }

      // Create machine with loaded context
      const machine = createMachine(initialState, {
        scoreReportCount,
        subscriptionCount,
        activeTab: settings.lastTab ?? 'scores',
      });

      machineRef.current = machine;
      setState(machine.getState());

      // Subscribe to state changes
      const unsubscribe = machine.subscribe((newState) => {
        setState(newState);
        // Persist last tab/state for popup lifecycle
        storage.updateUserSettings({
          lastTab: newState.context.activeTab,
          lastState: newState.current,
        });
      });

      setIsReady(true);

      return unsubscribe;
    }

    const cleanup = init();
    return () => {
      cleanup.then((unsub) => unsub?.());
    };
  }, []);

  const send = useCallback((event: PopupEvent) => {
    machineRef.current?.send(event);
  }, []);

  const canGoBack = useCallback(() => {
    return machineRef.current?.canGoBack() ?? false;
  }, []);

  return {
    state,
    send,
    canGoBack,
    isReady,
    currentState: state?.current ?? 'Home',
    context: state?.context ?? null,
  };
}
