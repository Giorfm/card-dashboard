'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  CreditCard,
  KeyRound,
  Link2,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ExternalLink,
  Loader2,
  Eye,
  EyeOff,
  Copy,
  Check,
  Sparkles,
  HelpCircle,
  RefreshCw,
  Store,
} from 'lucide-react';
import { updateCardWithPin, getCardStatus, validateReviewUrl } from '@/lib/cards';
import { isSupabaseConfigured } from '@/lib/supabase';

function ActivationContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Ambil ID dari URL query param (?id=c0001)
  const initialId = searchParams.get('id') || '';

  const [cardId, setCardId] = useState(initialId);
  const [pin, setPin] = useState('');
  const [targetUrl, setTargetUrl] = useState('');
  const [activeTab, setActiveTab] = useState('activate'); // 'activate' | 'update'

  // UI States
  const [showPin, setShowPin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchingInfo, setFetchingInfo] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showHelper, setShowHelper] = useState(false);

  // Status feedback
  const [statusMessage, setStatusMessage] = useState(null); // { type: 'success'|'error'|'warning'|'info', text: string, data?: any }
  const [cardInfo, setCardInfo] = useState(null); // info kartu saat ini dari DB
  const [isConfigured, setIsConfigured] = useState(true);

  // Cek konfigurasi Supabase saat mount
  useEffect(() => {
    setIsConfigured(isSupabaseConfigured());
  }, []);

  // Sync saat searchParams berubah
  useEffect(() => {
    const idFromUrl = searchParams.get('id');
    if (idFromUrl) {
      setCardId(idFromUrl);
      fetchCardDetails(idFromUrl);
    }
  }, [searchParams]);

  // Ambil data status kartu secara otomatis
  const fetchCardDetails = async (idToFetch) => {
    if (!idToFetch || !isSupabaseConfigured()) return;
    setFetchingInfo(true);
    try {
      const res = await getCardStatus(idToFetch);
      if (res.success && res.card) {
        setCardInfo(res.card);
        if (res.card.is_active) {
          setActiveTab('update');
          if (res.card.target_url) {
            setTargetUrl(res.card.target_url);
          }
        } else {
          setActiveTab('activate');
        }
      } else if (res.notFound) {
        setCardInfo(null);
        setStatusMessage({
          type: 'error',
          text: `Kartu dengan ID "${idToFetch}" belum terdaftar di sistem.`,
        });
      }
    } catch (err) {
      console.error('Error fetching card:', err);
    } finally {
      setFetchingInfo(false);
    }
  };

  // Handler salin ID kartu
  const handleCopyId = () => {
    if (!cardId) return;
    navigator.clipboard.writeText(cardId.toUpperCase());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Validasi real-time URL saat diketik
  const urlValidation = targetUrl ? validateReviewUrl(targetUrl) : null;

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusMessage(null);

    const cleanId = cardId.trim().toLowerCase();
    const cleanPin = pin.trim();
    const cleanUrl = targetUrl.trim();

    if (!cleanId) {
      setStatusMessage({
        type: 'error',
        text: 'ID Kartu tidak boleh kosong. Periksa kartu fisik Anda.',
      });
      return;
    }

    if (!cleanPin) {
      setStatusMessage({
        type: 'error',
        text: 'PIN Pengaman wajib diisi untuk verifikasi keamanan.',
      });
      return;
    }

    if (!cleanUrl) {
      setStatusMessage({
        type: 'error',
        text: 'Link ulasan Google Review toko wajib diisi.',
      });
      return;
    }

    // Validasi URL
    const urlCheck = validateReviewUrl(cleanUrl);
    if (!urlCheck.isValid) {
      setStatusMessage({
        type: 'error',
        text: urlCheck.message,
      });
      return;
    }

    setLoading(true);

    try {
      // 1. Eksekusi verifikasi & update ke Supabase
      const result = await updateCardWithPin({
        id: cleanId,
        pin: cleanPin,
        targetUrl: cleanUrl,
      });

      if (!result.success) {
        setStatusMessage({
          type: 'error',
          text: result.error,
        });
        setLoading(false);
        return;
      }

      // 2. Berhasil diperbarui
      setCardInfo(result.card);
      setStatusMessage({
        type: 'success',
        text:
          activeTab === 'activate'
            ? 'Kartu berhasil diaktifkan! Pengalihan kini telah siap digunakan.'
            : 'Link ulasan toko berhasil diperbarui!',
        data: result.card,
      });

      // Clear pin setelah berhasil demi keamanan
      setPin('');
    } catch (err) {
      console.error('Submit error:', err);
      setStatusMessage({
        type: 'error',
        text: 'Terjadi kesalahan sistem saat menghubungi database. Silakan coba beberapa saat lagi.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-8 sm:py-12">
      {/* Peringatan jika Supabase belum diisi */}
      {!isConfigured && (
        <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-sm flex items-start gap-3 shadow-sm">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold mb-1">Konfigurasi Supabase Belum Terpasang</p>
            <p className="text-amber-800 text-xs leading-relaxed">
              Variabel lingkungan <code className="bg-amber-100 px-1 py-0.5 rounded font-mono text-[11px]">NEXT_PUBLIC_SUPABASE_URL</code> dan <code className="bg-amber-100 px-1 py-0.5 rounded font-mono text-[11px]">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> belum diisi pada file <code className="bg-amber-100 px-1 py-0.5 rounded font-mono text-[11px]">.env.local</code>. Pastikan Anda telah mengonfigurasinya dan menjalankan SQL Schema yang disediakan.
            </p>
          </div>
        </div>
      )}

      {/* Main Activation Card */}
      <div className="bg-white rounded-2xl border border-gray-200/90 shadow-xl shadow-blue-900/5 overflow-hidden transition-all duration-300">
        {/* Header Kartu */}
        <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-600 px-6 py-6 text-white relative">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-inner">
                <CreditCard className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight">
                  Pengaturan Kartu Ulasan
                </h1>
                <p className="text-blue-100 text-xs mt-0.5">
                  Platform Aktivasi &amp; Pengalihan Dinamis Google Review
                </p>
              </div>
            </div>

            {/* Status Keaktifan Badge */}
            {cardInfo && (
              <div
                className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-sm ${
                  cardInfo.is_active
                    ? 'bg-emerald-500/20 text-emerald-100 border border-emerald-400/30'
                    : 'bg-amber-400/20 text-amber-100 border border-amber-300/30'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    cardInfo.is_active ? 'bg-emerald-400 animate-pulse' : 'bg-amber-300'
                  }`}
                />
                {cardInfo.is_active ? 'Aktif' : 'Belum Aktif'}
              </div>
            )}
          </div>

          {/* ID Kartu Preview Display */}
          <div className="mt-5 p-3 rounded-xl bg-black/20 backdrop-blur-md border border-white/10 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-medium text-blue-200 uppercase tracking-wider">
                ID KARTU:
              </span>
              <span className="font-mono text-base font-bold text-white tracking-widest uppercase">
                {cardId || 'BELUM TERPILIH'}
              </span>
            </div>

            {cardId && (
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleCopyId}
                  className="px-2.5 py-1 text-xs rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center gap-1 transition-colors"
                  title="Salin ID"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-300" />
                      <span className="text-emerald-300 font-medium">Tersalin</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-blue-100" />
                      <span>Salin ID</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => fetchCardDetails(cardId)}
                  disabled={fetchingInfo}
                  className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-blue-100 transition-colors"
                  title="Segarkan Data"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${fetchingInfo ? 'animate-spin' : ''}`} />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Tab Switcher: Aktivasi Baru vs Update Link */}
        <div className="flex border-b border-gray-200 bg-gray-50/70 p-1.5 gap-1.5">
          <button
            type="button"
            onClick={() => {
              setActiveTab('activate');
              setStatusMessage(null);
            }}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
              activeTab === 'activate'
                ? 'bg-white text-blue-700 shadow-sm border border-gray-200/80'
                : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
            }`}
          >
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span>Aktivasi Kartu Baru</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('update');
              setStatusMessage(null);
            }}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
              activeTab === 'update'
                ? 'bg-white text-blue-700 shadow-sm border border-gray-200/80'
                : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
            }`}
          >
            <RefreshCw className="w-4 h-4 text-indigo-600" />
            <span>Perbarui Link Toko</span>
          </button>
        </div>

        {/* Form Isi */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-7 space-y-5">
          {/* Field 1: ID Kartu (Bisa diedit jika belum sesuai) */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
              ID Kartu (Dicetak pada Kartu / QR)
            </label>
            <div className="relative">
              <input
                type="text"
                value={cardId}
                onChange={(e) => setCardId(e.target.value.toLowerCase())}
                onBlur={(e) => {
                  if (e.target.value) fetchCardDetails(e.target.value);
                }}
                placeholder="Contoh: c0001"
                required
                className="w-full pl-4 pr-10 py-2.5 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 font-mono text-sm font-semibold uppercase text-gray-800 transition-all outline-none"
              />
              <CreditCard className="w-4 h-4 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
            </div>
            <p className="text-[11px] text-gray-500 mt-1">
              ID unik yang tertera pada bagian belakang fisik kartu atau kemasan Anda.
            </p>
          </div>

          {/* Field 2: PIN Pengaman */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                PIN Pengaman (4 Digit)
              </label>
              <span className="text-[11px] text-blue-600 font-medium">
                Kerahasiaan Terjaga
              </span>
            </div>
            <div className="relative">
              <input
                type={showPin ? 'text' : 'password'}
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={8}
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="••••"
                required
                className="w-full pl-10 pr-12 py-2.5 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-sm tracking-widest font-mono text-gray-900 transition-all outline-none"
              />
              <KeyRound className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                className="p-1 text-gray-400 hover:text-gray-600 absolute right-3 top-1/2 -translate-y-1/2 rounded-md transition-colors"
                title={showPin ? 'Sembunyikan PIN' : 'Tampilkan PIN'}
              >
                {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[11px] text-gray-500 mt-1">
              PIN acak yang tertera di label stiker atau kemasan pengaman kartu Anda.
            </p>
          </div>

          {/* Field 3: Link Google Review Toko */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Link Google Review Toko
              </label>
              <button
                type="button"
                onClick={() => setShowHelper(!showHelper)}
                className="text-[11px] text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 transition-colors"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>{showHelper ? 'Tutup Panduan' : 'Cara dapat link?'}</span>
              </button>
            </div>

            <div className="relative">
              <input
                type="url"
                value={targetUrl}
                onChange={(e) => setTargetUrl(e.target.value)}
                placeholder="https://g.page/r/... atau https://maps.app.goo.gl/..."
                required
                className={`w-full pl-10 pr-10 py-2.5 rounded-xl border text-sm transition-all outline-none ${
                  urlValidation && !urlValidation.isValid
                    ? 'border-red-300 focus:ring-2 focus:ring-red-100'
                    : urlValidation && urlValidation.isGoogleDomain
                    ? 'border-emerald-400 focus:ring-2 focus:ring-emerald-100'
                    : 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
                }`}
              />
              <Link2 className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              {urlValidation && urlValidation.isValid && urlValidation.isGoogleDomain && (
                <Check className="w-4 h-4 text-emerald-500 absolute right-3.5 top-1/2 -translate-y-1/2" />
              )}
            </div>

            {/* Helper URL Validation Text */}
            {urlValidation && (
              <p
                className={`text-[11px] mt-1 ${
                  !urlValidation.isValid
                    ? 'text-red-600 font-medium'
                    : urlValidation.isGoogleDomain
                    ? 'text-emerald-600'
                    : 'text-amber-600'
                }`}
              >
                {urlValidation.message}
              </p>
            )}

            {/* Panduan Mendapatkan Link (Toggleable) */}
            {showHelper && (
              <div className="mt-2.5 p-3 rounded-xl bg-blue-50/80 border border-blue-100 text-blue-900 text-xs space-y-1.5 animate-fadeIn">
                <p className="font-semibold flex items-center gap-1.5 text-blue-800">
                  <Store className="w-3.5 h-3.5" />
                  3 Langkah Mendapatkan Tautan Google Review Toko:
                </p>
                <ol className="list-decimal pl-4 space-y-1 text-blue-900/90 text-[11px]">
                  <li>Buka profil Google Bisnisku (Google Business Profile) atau cari nama toko Anda di Google Search.</li>
                  <li>Klik tombol <strong>&quot;Minta Ulasan&quot;</strong> atau <strong>&quot;Dapatkan Ulasan Lainnya&quot;</strong>.</li>
                  <li>Salin tautan pendek yang muncul (biasanya berformat <code className="bg-blue-100 px-1 rounded">g.page/r/...</code> atau <code className="bg-blue-100 px-1 rounded">maps.app.goo.gl/...</code>).</li>
                </ol>
              </div>
            )}
          </div>

          {/* Feedback Alert Box */}
          {statusMessage && (
            <div
              className={`p-4 rounded-xl border text-sm animate-fadeIn flex flex-col gap-2.5 ${
                statusMessage.type === 'success'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : 'bg-red-50 border-red-200 text-red-900'
              }`}
            >
              <div className="flex items-start gap-2.5">
                {statusMessage.type === 'success' ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                )}
                <div>
                  <p className="font-semibold text-sm">{statusMessage.text}</p>
                  {statusMessage.data?.target_url && (
                    <p className="text-xs text-emerald-700 mt-1 truncate max-w-md">
                      Tujuan Alih: <span className="font-mono">{statusMessage.data.target_url}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Tombol Uji Coba Pengalihan Kartu saat Sukses */}
              {statusMessage.type === 'success' && (
                <div className="pt-2 border-t border-emerald-200/70 flex flex-wrap gap-2">
                  <a
                    href={`/c/${cardId.trim().toLowerCase()}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs shadow-sm transition-all"
                  >
                    <span>Uji Coba Pengalihan Kartu</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <button
                    type="button"
                    onClick={() => {
                      setStatusMessage(null);
                    }}
                    className="px-3 py-2 rounded-lg bg-white text-gray-700 hover:bg-gray-100 font-medium text-xs border border-gray-200 transition-all"
                  >
                    Selesai
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-sm shadow-md shadow-blue-500/25 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Memproses Data &amp; Verifikasi PIN...</span>
              </>
            ) : (
              <>
                <span>
                  {activeTab === 'activate' ? 'Aktifkan Kartu Sekarang' : 'Simpan Perubahan Tautan'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer info kartu */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
          <Link href="/" className="hover:text-blue-600 transition-colors">
            &larr; Kembali ke Beranda
          </Link>
          <span>Keamanan Terenkripsi Supabase</span>
        </div>
      </div>

      {/* Info Tambahan di bawah kartu */}
      <div className="mt-8 text-center text-xs text-gray-500 space-y-1">
        <p>Lupa PIN atau kartu hilang? Hubungi administrator penyedia kartu.</p>
        <p>Tautan ulasan dapat diubah kapan saja tanpa batas jumlah perubahan.</p>
      </div>
    </div>
  );
}

export default function ActivatePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          <p className="text-sm text-gray-500 font-medium">Memuat portal aktivasi kartu...</p>
        </div>
      }
    >
      <ActivationContent />
    </Suspense>
  );
}
