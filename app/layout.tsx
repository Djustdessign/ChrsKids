import type {Metadata} from 'next';
import { Nunito } from 'next/font/google';
import './globals.css'; // Global styles
import { Providers } from '@/components/Providers';

const nunito = Nunito({
  subsets: ['latin'],
  variable: '--font-nunito',
});

export const metadata: Metadata = {
  title: 'Bible Quest: Kids Adventure',
  description: 'An interactive, gamified educational app that teaches children biblical stories, characters, and values.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={`${nunito.variable}`}>
      <body className="font-sans bg-neutral-50 text-neutral-800 antialiased" suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
