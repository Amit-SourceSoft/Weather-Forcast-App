import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans'; // Correct import path for Geist Sans
import './globals.css';
import { Toaster } from "@/components/ui/toaster"; // Import the Toaster

const geistSans = GeistSans({
  variable: '--font-geist-sans',
  // subsets are not applicable for Geist directly this way
});

// No need for Geist Mono unless specifically required elsewhere

export const metadata: Metadata = {
  title: 'Forecast Frontier', // Updated App Name
  description: 'Your 15-day weather forecast companion.', // Updated Description
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* Apply the font variable to the body */}
      <body className={`${geistSans.variable} font-sans antialiased`}>
        {children}
        <Toaster /> {/* Add Toaster here, outside the main content */}
      </body>
    </html>
  );
}
