'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Radio,
  QrCode,
  ArrowRight,
  ShieldCheck,
  Zap,
  RotateCcw,
  Sparkles,
  Star,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ExternalLink,
  Search,
  Smartphone,
  ChevronDown,
} from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const [manualId, setManualId] = useState('');
  const [openFaq, setOpenFaq] = useState(null);

  const handleManualSearch = (e) => {
    e.preventDefault();
    if (!manualId.trim()) return;
    const cleanId = manualId.trim().toLowerCase();
    router.push(`/activate?id=${encodeURIComponent(cleanId)}`);
  };

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      q: 'Apa perbedaan kartu ulasan dinamis dengan kartu NFC biasa?',
      a: 'Kartu NFC biasa mencetak tautan permanen (statis). Jika Anda pindah alamat toko atau ingin mengubah tautan ulasan Google, kartu biasa menjadi sampah dan harus dicetak ulang. Dengan TapReview, kartu memiliki ID dinamis sehingga Anda dapat memperbarui tautan toko kapan saja secara mandiri menggunakan PIN pengaman.',
    },
    {
      q: 'Bagaimana cara pelanggan toko memberikan ulasan?',
      a: 'Sangat mudah! Pelanggan cukup menempelkan HP ber-NFC ke kartu atau memindai kode QR. Ponsel pelanggan akan langsung membuka formulir bintang 5 Google Review toko Anda dalam hitungan detik tanpa perlu mengetik apapun.',
    },
    {
      q: 'Di mana saya menemukan ID Kartu dan PIN Pengaman?',
      a: 'ID Kartu (misalnya c0001) tertera jelas di bagian belakang kartu atau di bawah kode QR. PIN pengaman 4-digit tertera pada label stiker segel pelindung di kemasan kartu Anda.',
    },
    {
      q: 'Apakah saya bisa mengganti tautan toko lebih dari satu kali?',
      a: 'Bisa! Anda dapat memperbarui tautan ulasan Google toko Anda berkali-kali tanpa batas dan tanpa biaya tambahan. Cukup buka portal aktivasi, masukkan ID Kartu serta PIN pengaman Anda.',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/80 via-white to-gray-50 pt-12 pb-20 sm:pt-16 sm:pb-28">
        {/* Decorative background glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-blue-400/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[300px] h-[300px] bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-5">
            {/* Top Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold tracking-wide shadow-sm border border-blue-200/60 animate-fade-in">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Generasi Baru Kartu Google Review Dinamis</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight leading-[1.15]">
              Satu Tap NFC &amp; QR,{' '}
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-800 bg-clip-text text-transparent">
                Panen Ulasan Bintang 5
              </span>{' '}
              untuk Toko Anda
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto">
              Tinggalkan kartu ulasan statis yang mudah usang. Platform pintar ini memungkinkan pemilik bisnis mengaktifkan dan memperbarui link Google Review secara mandiri kapan pun tanpa cetak ulang.
            </p>

            {/* MANUAL CARD LOOKUP / ACTIVATION INPUT FORM */}
            <div className="pt-4 max-w-md mx-auto">
              <div className="bg-white p-2 rounded-2xl border border-gray-200 shadow-lg shadow-blue-900/5 transition-all focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500">
                <form onSubmit={handleManualSearch} className="flex items-center gap-2">
                  <div className="relative flex-1 pl-3">
                    <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={manualId}
                      onChange={(e) => setManualId(e.target.value)}
                      placeholder="Masukkan ID Kartu (contoh: c0001)"
                      className="w-full pl-7 pr-3 py-2 text-sm font-medium text-gray-800 placeholder-gray-400 focus:outline-none uppercase font-mono"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm flex items-center gap-1.5 shadow-md shadow-blue-500/20 transition-all flex-shrink-0"
                  >
                    <span>Aktivasi Kartu</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Punya kartu fisik? Ketik ID kartu di atas atau pindai QR Code di kemasan kartu.
              </p>
            </div>
          </div>

          {/* INTERACTIVE CARD MOCKUP PREVIEW */}
          <div className="mt-14 max-w-4xl mx-auto">
            <div className="relative mx-auto max-w-md sm:max-w-lg p-6 rounded-3xl glass-card-dark text-white overflow-hidden shadow-2xl">
              {/* Card visual details */}
              <div className="absolute -top-12 -right-12 w-44 h-44 bg-blue-500/20 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute -bottom-10 -left-10 w-44 h-44 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none" />

              <div className="relative z-10 flex flex-col justify-between h-56 sm:h-64">
                {/* Header Mockup */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                      <Radio className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm tracking-wide">TAP REVIEW</h3>
                      <p className="text-[10px] text-gray-300">Smart Dynamic NFC Card</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-amber-400 bg-black/40 px-2.5 py-1 rounded-full border border-amber-400/20 text-xs font-semibold">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>5.0</span>
                  </div>
                </div>

                {/* Center NFC wave graphic */}
                <div className="flex items-center justify-center gap-3 text-center my-auto">
                  <Smartphone className="w-7 h-7 text-blue-300 animate-pulse" />
                  <div className="text-left">
                    <p className="text-xs font-semibold text-white">Dekatkan HP ke Sini</p>
                    <p className="text-[11px] text-blue-200">NFC &amp; QR Direct 302 Redirect</p>
                  </div>
                </div>

                {/* Footer Mockup */}
                <div className="flex items-end justify-between border-t border-white/10 pt-3">
                  <div>
                    <span className="text-[9px] uppercase tracking-wider text-gray-400 block">
                      Card Identification
                    </span>
                    <span className="font-mono text-xs font-bold text-blue-300 tracking-wider">
                      ID: c0001
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Dynamic Linked
                    </span>
                    <div className="w-7 h-7 rounded bg-white p-0.5 flex items-center justify-center text-gray-900">
                      <QrCode className="w-6 h-6" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* QUICK TEST DEMO SECTION (Card Samples) */}
      <section className="py-12 bg-white border-y border-gray-200/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              Uji Coba Alur Kerja Sistem (Simulator)
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Coba langsung skenario pemindaian kartu aktif vs belum aktif berikut:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
            {/* Demo Card 1: Belum Aktif */}
            <div className="p-5 rounded-2xl border border-gray-200 bg-gray-50/70 hover:border-blue-300 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono font-bold text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded">
                    ID: c0001
                  </span>
                  <span className="text-xs font-medium text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                    Status: Belum Aktif
                  </span>
                </div>
                <h3 className="font-semibold text-sm text-gray-900 mb-1">
                  Skenario Kartu Baru Dicetak
                </h3>
                <p className="text-xs text-gray-600 mb-4 leading-relaxed">
                  Jika kartu belum aktif atau belum memiliki link ulasan, sistem otomatis mengalihkan pembeli ke halaman aktivasi.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href="/c/c0001"
                  className="flex-1 text-center py-2 px-3 rounded-xl bg-white border border-gray-300 hover:bg-gray-100 text-xs font-semibold text-gray-800 transition-colors flex items-center justify-center gap-1.5"
                >
                  <QrCode className="w-3.5 h-3.5 text-blue-600" />
                  <span>Simulasi Scan QR /c/c0001</span>
                </Link>
                <Link
                  href="/activate?id=c0001"
                  className="py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-xs font-semibold text-white transition-colors flex items-center gap-1"
                >
                  <span>Aktivasi</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>

            {/* Demo Card 2: Sudah Aktif */}
            <div className="p-5 rounded-2xl border border-gray-200 bg-gray-50/70 hover:border-emerald-300 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono font-bold text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded">
                    ID: c0002
                  </span>
                  <span className="text-xs font-medium text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                    Status: Aktif (Terhubung)
                  </span>
                </div>
                <h3 className="font-semibold text-sm text-gray-900 mb-1">
                  Skenario Kartu Toko Siap Pakai
                </h3>
                <p className="text-xs text-gray-600 mb-4 leading-relaxed">
                  Jika kartu telah diaktifkan, pemindaian QR / tap NFC langsung melakukan Server Redirect (302) ke link Google Review.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href="/c/c0002"
                  className="flex-1 text-center py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-xs font-semibold text-white transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>Uji Direct Redirect /c/c0002</span>
                </Link>
                <Link
                  href="/activate?id=c0002"
                  className="py-2 px-3 rounded-xl bg-white border border-gray-300 hover:bg-gray-100 text-xs font-semibold text-gray-800 transition-colors flex items-center gap-1"
                >
                  <span>Edit URL</span>
                  <RotateCcw className="w-3 h-3 text-gray-500" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3 STEPS HOW IT WORKS */}
      <section className="py-16 sm:py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
              Alur Penggunaan
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-2">
              Mudah Digunakan dalam 3 Langkah
            </h2>
            <p className="text-sm text-gray-600 mt-2">
              Tanpa perlu aplikasi tambahan, pembeli kartu maupun pelanggan toko dapat langsung berinteraksi dengan mudah.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm relative hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 font-bold flex items-center justify-center mb-5 text-lg">
                1
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-2">
                Terima Kartu Fisik
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                Kartu diproduksi massal dengan ID unik (contoh: <code>c0001</code>) dan PIN pengaman 4-digit yang aman di balik stiker pelindung.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm relative hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 font-bold flex items-center justify-center mb-5 text-lg">
                2
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-2">
                Aktivasi Mandiri dalam 30 Detik
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                Pemilik toko scan QR kartu, masukkan PIN pengaman, dan tempelkan link ulasan Google Profil Bisnis. Kartu seketika aktif.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm relative hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 font-bold flex items-center justify-center mb-5 text-lg">
                3
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-2">
                Pelanggan Tap &amp; Beri Ulasan
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                Tempatkan kartu di meja kasir. Pelanggan cukup menempelkan smartphone, dan halaman review Google langsung terbuka otomatis.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* COMPARISON TABLE: STATIS VS DINAMIS */}
      <section className="py-16 bg-white border-t border-gray-200/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
              Mengapa Memilih Kartu Dinamis?
            </h2>
            <p className="text-sm text-gray-600 mt-2">
              Perbandingan langsung antara kartu ulasan konvensional vs TapReview Platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Kartu Konvensional Statis */}
            <div className="p-6 rounded-2xl border border-red-200 bg-red-50/40 space-y-4">
              <div className="flex items-center gap-2 text-red-700 font-bold text-base">
                <XCircle className="w-5 h-5 text-red-500" />
                <span>Kartu Ulasan Statis Biasa</span>
              </div>
              <ul className="space-y-3 text-xs sm:text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold">•</span>
                  <span>Link ulasan dicetak mati secara permanen di kartu.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold">•</span>
                  <span>Jika toko ganti link / nama, kartu harus dibuang dan dicetak ulang.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold">•</span>
                  <span>Produsen kartu harus meminta link toko sebelum mencetak satu per satu.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold">•</span>
                  <span>Biaya pemborosan tinggi jika ada kesalahan cetak URL.</span>
                </li>
              </ul>
            </div>

            {/* TapReview Dinamis */}
            <div className="p-6 rounded-2xl border-2 border-blue-500 bg-blue-50/30 space-y-4 relative shadow-sm">
              <div className="absolute -top-3 right-4 px-2.5 py-0.5 rounded-full bg-blue-600 text-white text-[10px] font-bold uppercase tracking-wider">
                Solusi Cerdas
              </div>
              <div className="flex items-center gap-2 text-blue-900 font-bold text-base">
                <CheckCircle2 className="w-5 h-5 text-blue-600" />
                <span>TapReview Dinamis (Next.js + Supabase)</span>
              </div>
              <ul className="space-y-3 text-xs sm:text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span>Dapat diproduksi massal dalam ribuan batch kartu dengan ID pendek.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span>Pembeli mengaktifkan kartu sendiri kapan pun dengan PIN pengaman.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span>Bisa ganti tautan Google Review berkali-kali tanpa cetak ulang.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span>Pengalihan server super cepat (&lt;200ms) dengan arsitektur serverless.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ ACCORDION SECTION */}
      <section className="py-16 bg-gray-50 border-t border-gray-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-900">Pertanyaan yang Sering Diajukan</h2>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">
              Semua hal yang perlu Anda ketahui mengenai kartu ulasan pintar kami.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-xl border border-gray-200 overflow-hidden transition-all duration-200"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(idx)}
                    className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 hover:bg-gray-50/80 transition-colors"
                  >
                    <span className="text-sm font-semibold text-gray-900">{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-gray-500 transition-transform duration-200 flex-shrink-0 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-4 pt-1 text-xs sm:text-sm text-gray-600 leading-relaxed border-t border-gray-100 bg-gray-50/40">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CALL TO ACTION BOTTOM BANNER */}
      <section className="py-12 bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 text-white text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Siap Mengaktifkan Kartu Ulasan Google Anda?
          </h2>
          <p className="text-sm sm:text-base text-blue-100 max-w-xl mx-auto">
            Hanya butuh waktu 30 detik untuk menghubungkan toko Anda dengan ribuan pelanggan baru melalui ulasan bintang 5.
          </p>
          <div className="pt-2">
            <Link
              href="/activate"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-blue-700 hover:bg-blue-50 font-bold text-sm shadow-lg shadow-black/10 transition-all hover:scale-105"
            >
              <span>Mulai Aktivasi Sekarang</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
