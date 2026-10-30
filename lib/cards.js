import { supabase, isSupabaseConfigured } from './supabase';

/**
 * Validasi format URL ulasan Google
 * Menerima tautan https standar, khususnya link ulasan Google Maps, g.page, goo.gl, search.google.com
 */
export function validateReviewUrl(url) {
  if (!url || typeof url !== 'string') {
    return {
      isValid: false,
      message: 'Tautan Google Review wajib diisi.',
    };
  }

  const trimmed = url.trim();

  // Cek skema https://
  try {
    const parsed = new URL(trimmed);
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return {
        isValid: false,
        message: 'Tautan harus menggunakan protokol https://',
      };
    }
  } catch {
    return {
      isValid: false,
      message: 'Format tautan tidak valid. Gunakan format URL lengkap (contoh: https://...)',
    };
  }

  // Rekomendasi pola domain Google Review yang lazim
  const isGoogleDomain = /(g\.page|maps\.app\.goo\.gl|google\.com|goo\.gl)/i.test(trimmed);

  return {
    isValid: true,
    isGoogleDomain,
    sanitizedUrl: trimmed,
    message: isGoogleDomain
      ? 'Tautan Google Review valid.'
      : 'Catatan: Pastikan tautan ini benar-benar mengarah ke halaman ulasan Google toko Anda.',
  };
}

/**
 * Mengambil data status kartu berdasarkan ID (tanpa memaparkan PIN)
 */
export async function getCardStatus(cardId) {
  if (!cardId) {
    return { success: false, error: 'ID Kartu tidak boleh kosong.' };
  }

  if (!isSupabaseConfigured()) {
    return {
      success: false,
      isConfigured: false,
      error: 'Supabase belum dikonfigurasi pada file .env.local',
    };
  }

  const cleanId = String(cardId).trim().toLowerCase();

  const { data, error } = await supabase
    .from('cards')
    .select('id, is_active, target_url, updated_at')
    .eq('id', cleanId)
    .maybeSingle();

  if (error) {
    return { success: false, error: error.message };
  }

  if (!data) {
    return { success: false, notFound: true, error: 'Kartu tidak terdaftar di sistem.' };
  }

  return { success: true, card: data };
}

/**
 * Verifikasi PIN dan perbarui / aktifkan kartu di Supabase
 */
export async function updateCardWithPin({ id, pin, targetUrl }) {
  if (!id || !pin || !targetUrl) {
    return { success: false, error: 'Semua kolom wajib diisi.' };
  }

  const cleanId = String(id).trim().toLowerCase();
  const cleanPin = String(pin).trim();
  const cleanUrl = String(targetUrl).trim();

  // Validasi URL
  const urlCheck = validateReviewUrl(cleanUrl);
  if (!urlCheck.isValid) {
    return { success: false, error: urlCheck.message };
  }

  if (!isSupabaseConfigured()) {
    return {
      success: false,
      error: 'Supabase belum dikonfigurasi. Silakan atur NEXT_PUBLIC_SUPABASE_URL dan NEXT_PUBLIC_SUPABASE_ANON_KEY di .env.local.',
    };
  }

  // 1. Cari kartu berdasarkan id di Supabase
  const { data: existingCard, error: fetchError } = await supabase
    .from('cards')
    .select('id, pin, is_active, target_url')
    .eq('id', cleanId)
    .maybeSingle();

  if (fetchError) {
    return { success: false, error: `Gagal memuat kartu: ${fetchError.message}` };
  }

  if (!existingCard) {
    return { success: false, error: 'ID Kartu tidak terdaftar di dalam sistem!' };
  }

  // 2. Verifikasi PIN. Jika PIN tidak cocok dengan database, tampilkan pesan error
  if (String(existingCard.pin).trim() !== cleanPin) {
    return {
      success: false,
      error: 'PIN Pengaman Salah! Silakan cek kembali 4 digit PIN di kartu Anda.',
    };
  }

  // 3. Jika PIN cocok, update record: set target_url, is_active = true, dan updated_at = new Date()
  const now = new Date().toISOString();
  let updatedCard = null;
  let updateError = null;

  const primaryResult = await supabase
    .from('cards')
    .update({
      target_url: cleanUrl,
      is_active: true,
      updated_at: now,
    })
    .eq('id', cleanId)
    .select()
    .single();

  if (primaryResult.error) {
    // Fallback jika kolom updated_at belum dibuat di tabel Supabase
    if (primaryResult.error.message && primaryResult.error.message.includes('updated_at')) {
      const fallbackResult = await supabase
        .from('cards')
        .update({
          target_url: cleanUrl,
          is_active: true,
        })
        .eq('id', cleanId)
        .select()
        .single();

      if (fallbackResult.error) {
        updateError = fallbackResult.error;
      } else {
        updatedCard = fallbackResult.data;
      }
    } else {
      updateError = primaryResult.error;
    }
  } else {
    updatedCard = primaryResult.data;
  }

  if (updateError) {
    return {
      success: false,
      error: `Gagal menyimpan pembaruan ke database: ${updateError.message}`,
    };
  }

  // 4. Return data sukses
  return {
    success: true,
    card: updatedCard,
    isGoogleDomain: urlCheck.isGoogleDomain,
    note: urlCheck.message,
  };
}
