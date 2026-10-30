import Link from 'next/link';
import { AlertCircle, ArrowLeft, Home, KeyRound } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex-1 flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full bg-white rounded-2xl border border-gray-200 p-8 text-center shadow-lg shadow-gray-200/50">
        <div className="w-16 h-16 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto mb-4 border border-red-100">
          <AlertCircle className="w-8 h-8" />
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">Halaman Tidak Ditemukan</h1>
        <p className="text-sm text-gray-600 mb-6 leading-relaxed">
          Halaman yang Anda cari tidak tersedia atau tautan kartu yang dimasukkan salah.
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/"
            className="flex-1 py-2.5 px-4 rounded-xl bg-gray-900 text-white hover:bg-gray-800 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>Beranda</span>
          </Link>
          <Link
            href="/activate"
            className="flex-1 py-2.5 px-4 rounded-xl bg-blue-600 text-white hover:bg-blue-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
          >
            <KeyRound className="w-4 h-4" />
            <span>Aktivasi Kartu</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
