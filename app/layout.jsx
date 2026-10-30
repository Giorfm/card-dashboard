import './globals.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export const metadata = {
  title: 'TapReview - Dynamic Google Review Card Platform',
  description:
    'Sistem pengalihan dinamis dan aktivasi mandiri untuk kartu ulasan Google Review berbasis NFC dan QR Code. Fleksibel, cepat, dan aman.',
  keywords: [
    'Google Review Card',
    'NFC Google Review',
    'Kartu Ulasan Google',
    'Dynamic QR Code',
    'TapReview',
  ],
  authors: [{ name: 'TapReview Systems' }],
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" className="h-full">
      <body className="flex flex-col min-h-screen bg-gray-50 text-gray-900 antialiased font-sans">
        <Navbar />
        <main className="flex-1 flex flex-col">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
