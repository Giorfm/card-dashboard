'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Radio, Sparkles, KeyRound, ExternalLink, HelpCircle } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full glass-panel border-b border-gray-200/80 bg-white/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform duration-200">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <span className="text-lg font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-blue-700 bg-clip-text text-transparent">
              TapReview
            </span>
            <span className="hidden sm:inline-block ml-1.5 px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase bg-blue-100 text-blue-700 rounded-full">
              Dynamic NFC
            </span>
          </div>
        </Link>

        {/* Navigation Items */}
        <nav className="flex items-center gap-2 sm:gap-4">
          <Link
            href="/"
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              pathname === '/'
                ? 'text-blue-600 bg-blue-50'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            Beranda
          </Link>

          <Link
            href="/activate"
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all shadow-sm ${
              pathname.startsWith('/activate')
                ? 'bg-blue-600 text-white shadow-blue-500/25'
                : 'bg-gray-900 text-white hover:bg-gray-800'
            }`}
          >
            <KeyRound className="w-4 h-4" />
            <span>Aktivasi Kartu</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
