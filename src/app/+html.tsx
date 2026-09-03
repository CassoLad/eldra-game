import { ScrollViewStyleReset } from 'expo-router/html';
import type { PropsWithChildren } from 'react';

export default function Root({ children }: PropsWithChildren) {
  return <html lang="en"><head><meta charSet="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
    <ScrollViewStyleReset /><style>{`html, body, #root { margin: 0; width: 100%; height: 100%; overflow: hidden; overscroll-behavior: none; background: #f4eedc; }`}</style>
  </head><body>{children}</body></html>;
}
