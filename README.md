# TapReview - Dynamic Google Review Card Platform 🌟

Aplikasi web Full-Stack **Next.js 14 (App Router)** terintegrasi dengan **Supabase** untuk sistem pengalihan dinamis (*Dynamic Redirect*) dan aktivasi mandiri (*Self-Activation*) kartu ulasan Google berbasis **NFC & QR Code**.

---

## 🚀 Fitur Utama

1. **Pengalihan Super Cepat (`/c/[id]`)**:
   - HTTP 302 Server Redirect berlatensi rendah (< 200ms).
   - Pengalihan otomatis:
     - Jika kartu **aktif** dan **memiliki target URL** $\rightarrow$ Langsung diarahkan ke formulir ulasan resmi Google milik toko.
     - Jika kartu **belum aktif** atau **URL kosong** $\rightarrow$ Otomatis dialihkan ke halaman aktivasi `/activate?id=[id]`.
     - Jika kartu **tidak terdaftar** $\rightarrow$ Menampilkan halaman respons 404 HTML bertema profesional (*Kartu Tidak Terdaftar*).
   - Header `Cache-Control: no-store` untuk mencegah cache peramban jika toko memperbarui tautan ulasannya.

2. **Portal Aktivasi & Manajemen Mandiri (`/activate`)**:
   - Deteksi otomatis parameter `?id=...` dari URL hasil pindaian QR/NFC.
   - Pilihan mode: **Aktivasi Kartu Baru** dan **Perbarui Link Toko**.
   - Input PIN Pengaman 4-digit dengan verifikasi keamanan di level backend.
   - Validasi URL Google Review secara langsung (*real-time pattern check*).
   - Panduan cara mengambil tautan pendek ulasan Google Bisnisku.
   - Feedback alert interaktif dengan tombol **"Uji Coba Pengalihan Kartu"**.

3. **Landing Page Interaktif (`/`)**:
   - Formulir pencarian / aktivasi ID kartu manual bagi pengguna tanpa pemindaian QR.
   - Mockup visual kartu NFC interaktif.
   - Simulator kartu contoh (`c0001` - Belum Aktif, `c0002` - Aktif).
   - Komparasi kartu dinamis vs statis serta FAQ tanya jawab.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 14.2 (App Router, Server API & Client Components)
- **Database**: Supabase PostgreSQL (`@supabase/supabase-js`)
- **Styling**: Tailwind CSS & Lucide React Icons
- **Language**: JavaScript / React 18

---

## 📁 Struktur Direktori

```text
├── app/
│   ├── activate/
│   │   └── page.jsx             # Client Component - Halaman Aktivasi & Edit Link
│   ├── api/
│   │   └── cards/
│   │       └── activate/
│   │           └── route.js     # API Route verifikasi PIN & aktivasi
│   ├── c/
│   │   └── [id]/
│   │       └── route.js         # Server Redirect Engine (QR/NFC Scan Handler)
│   ├── globals.css              # Tailwind & Glassmorphism styles
│   ├── layout.jsx               # Root layout, metadata & typography
│   ├── not-found.jsx            # 404 page handler
│   └── page.jsx                 # Landing page & manual ID lookup
├── components/
│   ├── Navbar.jsx               # Header navigasi
│   └── Footer.jsx               # Footer informasi & hak cipta
├── lib/
│   ├── cards.js                 # Helper logic, URL validation & queries
│   └── supabase.js              # Singleton Supabase Client
├── supabase/
│   └── schema.sql               # Skrip DDL tabel cards, RLS & bulk generator
├── .env.local.example           # Template environment variables
├── package.json
└── tailwind.config.js
```

---

## ⚙️ Panduan Menjalankan Proyek

### 1. Salin Environment Variables
Salin file `.env.local.example` menjadi `.env.local`:
```bash
cp .env.local.example .env.local
```

Isi kredensial Supabase Anda di dalam `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://proyek-anda.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 2. Eksekusi Skrip Database di Supabase
Buka **SQL Editor** pada dashboard Supabase Anda, lalu jalankan seluruh isi file `supabase/schema.sql`.

Skrip tersebut akan:
1. Membuat tabel `cards` (`id`, `pin`, `target_url`, `is_active`, `created_at`, `updated_at`).
2. Menyetel indeks dan kebijakan *Row Level Security* (RLS).
3. Membuat *stored procedure* `generate_cards(jumlah_kartu, start_index)` untuk pencetakan kartu massal.
4. Memasukkan data uji coba awal:
   - `c0001` (PIN: `1234`, Belum aktif)
   - `c0002` (PIN: `5678`, Aktif dengan contoh ulasan Google Maps)

### 3. Jalankan Server Development
```bash
npm run dev
```
Buka peramban di [http://localhost:3000](http://localhost:3000).

### 4. Build untuk Production
```bash
npm run build
npm run start
```
