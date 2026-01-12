// =============================================================================
// SubSense Popup Entry Point
// =============================================================================

import React from 'react';
import { createRoot } from 'react-dom/client';
import { PopupRouter } from './PopupRouter';
import '../styles/globals.css';

// Development: Seed fixtures
if (process.env.NODE_ENV === 'development') {
  import('../fixtures').then(({ seedFixtures }) => {
    // Check if already seeded
    const seeded = localStorage.getItem('subsense_fixtures_seeded');
    if (!seeded) {
      seedFixtures().then(() => {
        localStorage.setItem('subsense_fixtures_seeded', 'true');
      });
    }
  });
}

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <PopupRouter />
    </React.StrictMode>
  );
}
