import Link from 'next/link';
import { Radio, ShieldCheck, Zap, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white/70 backdrop-blur-sm mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <Radio className="w-4 h-4" />
              </div>
              <span className="text-base font-bold text-gray-900">
                TapReview Platform
              </span>
            </div>
            <p className="text-sm text-gray-600 max-w-sm leading-relaxed">
              Sistem Pengalihan Dinamis & Aktivasi Mandiri untuk Kartu Ulasan Google berbasis NFC & QR Code. Fleksibel, aman, dan tanpa perlu cetak ulang.
            </p>
            <div className="flex items-center gap-3 pt-1 text-xs text-gray-500">
              <span className="flex items-center gap-1 text-emerald-600 font-medium">
                <ShieldCheck className="w-4 h-4" /> PIN Secured
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-blue-600 font-medium">
                <Zap className="w-4 h-4" /> Instant 302 Redirect
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-3">
              Navigasi Cepat
            </h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <Link href="/" className="hover:text-blue-600 transition-colors">
                  Beranda
                </Link>
              </li>
              <li>
                <Link href="/activate" className="hover:text-blue-600 transition-colors">
                  Aktivasi Mandiri
                </Link>
              </li>
              <li>
                <Link href="/activate?id=c0001" className="hover:text-blue-600 transition-colors">
                  Demo Kartu c0001
                </Link>
              </li>
              <li>
                <Link href="/c/c0002" className="hover:text-blue-600 transition-colors">
                  Uji Coba Pengalihan
                </Link>
              </li>
            </ul>
          </div>

          {/* Bantuan */}
          <div>
            <h4 className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-3">
              Panduan & Dukungan
            </h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <span className="text-gray-500">Cara dapat link Google Review:</span>
              </li>
              <li className="text-xs text-gray-500 leading-normal">
                Buka profil bisnis Google Anda &rarr; Klik &apos;Minta Ulasan&apos; &rarr; Salin tautan ulasan pendek.
              </li>
              <li className="pt-2 text-xs text-gray-400">
                Powered by Next.js 14 &amp; Supabase
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-3">
          <p>© {new Date().getFullYear()} TapReview Platform. Hak Cipta Dilindungi.</p>
          <p className="flex items-center gap-1">
            Dirancang untuk efisiensi bisnis &amp; toko lokal Indonesia
          </p>
        </div>
      </div>
    </footer>
  );
}
