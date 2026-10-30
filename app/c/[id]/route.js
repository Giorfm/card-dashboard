import { NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

// Memastikan route ini selalu dieksekusi secara dinamis tanpa static caching
export const dynamic = 'force-dynamic';
export const revalidate = 0;

/**
 * Helper untuk merender halaman HTML 404 bertema profesional
 */
function renderNotFoundHtml(cardId) {
  return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Kartu Tidak Terdaftar | TapReview</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Inter', system-ui, -apple-system, sans-serif;
      background-color: #f9fafb;
      color: #111827;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1.5rem;
    }
    .card {
      background: #ffffff;
      border: 1px solid #e5e7eb;
      border-radius: 1.25rem;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01);
      max-width: 440px;
      width: 100%;
      padding: 2.25rem 2rem;
      text-align: center;
    }
    .icon-wrapper {
      width: 4rem;
      height: 4rem;
      border-radius: 9999px;
      background-color: #fee2e2;
      color: #ef4444;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 1.5rem auto;
    }
    .icon-wrapper svg {
      width: 2rem;
      height: 2rem;
    }
    .badge {
      display: inline-block;
      background: #f3f4f6;
      color: #4b5563;
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
      font-size: 0.85rem;
      font-family: monospace;
      font-weight: 600;
      margin-bottom: 0.75rem;
      border: 1px solid #e5e7eb;
    }
    h1 {
      font-size: 1.5rem;
      font-weight: 700;
      color: #111827;
      margin-bottom: 0.75rem;
    }
    p {
      font-size: 0.95rem;
      color: #4b5563;
      line-height: 1.5;
      margin-bottom: 1.75rem;
    }
    .actions {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 0.75rem 1.25rem;
      border-radius: 0.75rem;
      font-size: 0.95rem;
      font-weight: 600;
      text-decoration: none;
      transition: all 0.15s ease-in-out;
    }
    .btn-primary {
      background-color: #2563eb;
      color: #ffffff;
      box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.2);
    }
    .btn-primary:hover {
      background-color: #1d4ed8;
    }
    .btn-secondary {
      background-color: #f3f4f6;
      color: #374151;
    }
    .btn-secondary:hover {
      background-color: #e5e7eb;
    }
    .footer-note {
      margin-top: 1.5rem;
      font-size: 0.78rem;
      color: #9ca3af;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="icon-wrapper">
      <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
      </svg>
    </div>
    
    <div class="badge">ID: ${cardId || 'UNKNOWN'}</div>
    <h1>Kartu Tidak Terdaftar</h1>
    
    <p>
      Kartu dengan ID ini belum terdata di dalam sistem database TapReview. 
      Silakan periksa kembali tautan atau hubungi penyedia kartu Anda.
    </p>

    <div class="actions">
      <a href="/" class="btn btn-primary">
        Kembali ke Beranda
      </a>
      <a href="/activate" class="btn btn-secondary">
        Input ID Kartu Manual
      </a>
    </div>

    <div class="footer-note">
      TapReview Dynamic NFC & QR Platform
    </div>
  </div>
</body>
</html>`;
}

/**
 * Route handler untuk GET /c/[id]
 * Menangani pindaian QR / NFC kartu
 */
export async function GET(request, { params }) {
  try {
    const resolvedParams = await Promise.resolve(params);
    const cardId = resolvedParams?.id ? String(resolvedParams.id).trim().toLowerCase() : '';

    if (!cardId) {
      return new NextResponse(renderNotFoundHtml('KOSONG'), {
        status: 404,
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'no-store, no-cache, must-revalidate',
        },
      });
    }

    // Jika Supabase belum dikonfigurasi, arahkan pengguna ke halaman aktivasi dengan pesan peringatan
    if (!isSupabaseConfigured()) {
      console.warn(`[TapReview] Supabase belum dikonfigurasi. Mengalihkan ID: ${cardId} ke /activate`);
      const activateUrl = new URL(`/activate?id=${encodeURIComponent(cardId)}&status=env_missing`, request.url);
      return NextResponse.redirect(activateUrl, {
        status: 302,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        },
      });
    }

    // Query ke tabel 'cards' berdasarkan ID
    const { data: card, error } = await supabase
      .from('cards')
      .select('id, target_url, is_active')
      .eq('id', cardId)
      .maybeSingle();

    if (error) {
      console.error(`[TapReview] Database error saat query card ID ${cardId}:`, error);
      // Tetap kembalikan 404 cantik jika data tidak dapat ditemukan
      return new NextResponse(renderNotFoundHtml(cardId), {
        status: 404,
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'no-store, no-cache, must-revalidate',
        },
      });
    }

    // 1. Jika card tidak ada di database, kembalikan Response 404 HTML cantik
    if (!card) {
      return new NextResponse(renderNotFoundHtml(cardId), {
        status: 404,
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'no-store, no-cache, must-revalidate',
        },
      });
    }

    // 2. Jika card.is_active TRUE dan card.target_url ADA -> Server Redirect HTTP 302 ke target_url
    if (card.is_active === true && card.target_url && card.target_url.trim() !== '') {
      let finalUrl = card.target_url.trim();

      // Sanitasi & pastikan URL memiliki protokol http:// atau https://
      if (!/^https?:\/\//i.test(finalUrl)) {
        finalUrl = `https://${finalUrl}`;
      }

      return NextResponse.redirect(finalUrl, {
        status: 302,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          Pragma: 'no-cache',
          Expires: '0',
        },
      });
    }

    // 3. Jika card.is_active FALSE atau target_url KOSONG -> Redirect ke /activate?id=${id}
    const activateUrl = new URL(`/activate?id=${encodeURIComponent(card.id)}`, request.url);
    return NextResponse.redirect(activateUrl, {
      status: 302,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        Pragma: 'no-cache',
        Expires: '0',
      },
    });
  } catch (err) {
    console.error('[TapReview] Exception in GET /c/[id]:', err);
    return new NextResponse(renderNotFoundHtml('ERROR'), {
      status: 500,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    });
  }
}
