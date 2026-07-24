// .storybook/preview.tsx
//
// Global rules. Enforced once, so no story can accidentally preview
// on a white background or in the wrong typeface.

import type { Preview } from '@storybook/react';
import '../src/app/globals.css';

const preview: Preview = {
  parameters: {
    // SODA is dark-only. Make white a deliberate act, not a default.
    backgrounds: {
      default: 'canvas',
      values: [
        { name: 'canvas',  value: '#111111' },
        { name: 'card',    value: '#1a1a1a' },
        { name: 'surface', value: '#202220' },
      ],
    },
    // The phone frames people actually bring to a room.
    viewport: {
      viewports: {
        iphoneSE:  { name: 'iPhone SE',  styles: { width: '375px', height: '667px' } },
        iphone14:  { name: 'iPhone 14',  styles: { width: '390px', height: '844px' } },
        pixel7:    { name: 'Pixel 7',    styles: { width: '412px', height: '915px' } },
        opsLaptop: { name: 'Ops laptop', styles: { width: '1280px', height: '800px' } },
      },
      defaultViewport: 'iphone14',
    },
    a11y: { disable: false },   // catches contrast failures on the dark palette
  },

  // Public Sans, everywhere, always.
  decorators: [
    (Story) => (
      <div style={{ fontFamily: "'Public Sans', sans-serif", color: '#f5f5f5', padding: 16 }}>
        <Story />
      </div>
    ),
  ],
};

export default preview;
