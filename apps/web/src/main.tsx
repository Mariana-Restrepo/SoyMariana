import '@fontsource/caveat/latin-500.css';
import '@fontsource-variable/dm-sans/index.css';
import '@fontsource/instrument-serif/latin-400-italic.css';
import '@fontsource/instrument-serif/latin-400.css';
import './styles/index.css';

import { legalSlugFromPath } from '@soymariana/core';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { App } from './App';
import { stripBase } from './lib/base';

const root = createRoot(document.getElementById('root')!);
const legalSlug = legalSlugFromPath(stripBase(window.location.pathname));

if (legalSlug) {
  // /privacidad y /terminos: se cargan aparte para no engordar la página principal.
  void import('./LegalApp').then(({ LegalApp }) =>
    root.render(
      <StrictMode>
        <LegalApp slug={legalSlug} />
      </StrictMode>,
    ),
  );
} else {
  root.render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
