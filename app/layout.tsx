import type { Metadata } from 'next';
import '../styles.css';

export const metadata: Metadata = {
  title: 'RESOLVE AI — Human-Governed Support',
  description:
    'A human-governed AI support operations product prototype with transparent tools, approvals, action provenance and recoverable decisions.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
