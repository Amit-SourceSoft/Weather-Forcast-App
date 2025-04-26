import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans'; // Correct import path for Geist Sans
import './globals.css';
import { Toaster } from "@/components/ui/toaster"; // Import the Toaster

// geistSans is imported directly and provides the variable property
// const geistSans = GeistSans({ // This was incorrect
//   variable: '--font-geist-sans',
// });

// No need for Geist Mono unless specifically required elsewhere

export const metadata: Metadata = {
  title: 'Weather Forecast', // Updated App Name
  description: 'Your 15-day weather forecast companion.', // Updated Description
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* Apply the font variable directly from the import */}
      <body className={`${GeistSans.variable} font-sans antialiased`}>
        {children}
        <Toaster /> {/* Add Toaster here, outside the main content */}
      </body>
    </html>
  );
}
