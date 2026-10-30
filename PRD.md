# Product Requirement Document (PRD)
## Dynamic Google Review Card Platform (Redirect & Activation System)

| Metadata | Details |
| --- | --- |
| **Document Version** | 1.0.0 |
| **Status** | Approved / Ready for Development |
| **Author** | Senior Systems Architect & Product Manager |
| **Tech Stack Target** | Next.js 14 (App Router), Supabase (PostgreSQL), Vercel, Tailwind CSS |

---

## 1. Executive Summary & Objective

### 1.1 Problem Statement
Kartu ulasan Google berbasis QR Code / NFC konvensional yang dicetak dengan tautan statis (*hardcoded URL*) memiliki fleksibilitas nol. Jika lokasi/tautan ulasan toko berubah, atau jika kartu diproduksi secara massal untuk dijual kembali, kartu harus dicetak ulang atau diprogram ulang secara manual satu per satu.

### 1.2 Solution
Platform pengalihan dinamis (*Dynamic Redirect & Self-Activation Platform*) berbasis web serverless. Kartu diproduksi massal dengan ID unik pendek (contoh: `c0001`) dan PIN pengaman acak. Pembeli kartu dapat mengaktifkan kartu dan memperbarui tautan ulasan Google toko mereka sendiri secara mandiri tanpa campur tangan produsen kartu.

### 1.3 Key Business Metrics / OKRs
- **Latensi Pengalihan (Redirect Speed):** $< 200\text{ ms}$ dari pemindaian hingga pengalihan browser.
- **Kemudahan Pemindaian QR:** Kepadatan karakter URL pendek ($\le 30$ karakter) untuk memastikan pemindaian cepat oleh kamera HP.
- **Biaya Operasional:** Rp0 (Memanfaat versi *Free Tier* Vercel + Supabase).

---

## 2. System Architecture & Tech Stack

```
[ Pelanggan Tap NFC / Scan QR ]
               │
               ▼
   [ Vercel Edge Network ]
      URL: domain.com/c/c0001
               │
               ├─► Check DB Supabase (Table: cards)
               │
               ├───► Status: IS_ACTIVE == TRUE
               │      └──► HTTP 302 Direct Redirect ──► [ Formulir Google Review Toko ]
               │
               └───► Status: IS_ACTIVE == FALSE
                      └──► Redirect ──► [ Halaman Aktivasi Mandiri (/activate?id=c0001) ]
```

### 2.1 Technology Stack Details
- **Frontend & App Framework:** Next.js 14+ (App Router, Server Actions / Route Handlers).
- **Styling & UI:** Tailwind CSS, Lucide React (Icons).
- **Database & Auth:** Supabase (PostgreSQL + `@supabase/supabase-js`).
- **Hosting & Infrastructure:** Vercel Edge Infrastructure.

---

## 3. Database Schema & Data Models

### 3.1 Table Definition: `cards`

| Column Name | Data Type | Constraints | Description |
| --- | --- | --- | --- |
| `id` | `TEXT` | `PRIMARY KEY` | ID Unik Kartu (contoh: `c0001`, `c0002`) |
| `pin` | `TEXT` | `NOT NULL` | PIN pengaman 4-digit acak untuk autentikasi aktivasi/edit |
| `target_url` | `TEXT` | `NULLABLE` | Tautan formulir ulasan Google milik toko pembeli |
| `is_active` | `BOOLEAN` | `DEFAULT false` | Status keaktifan kartu |
| `created_at` | `TIMESTAMPTZ` | `DEFAULT now()` | Waktu pembuatan record kartu |
| `updated_at` | `TIMESTAMPTZ` | `DEFAULT now()` | Waktu terakhir tautan/status diperbarui |

### 3.2 SQL Setup & Auto-Generation Function Script

```sql
-- 1. Membuat Tabel Kartu
create table if not exists cards (
  id text primary key,
  pin text not null,
  target_url text,
  is_active boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2. Fungsi Otomatisasi Pembuatan Kartu Massal (Bulk Batch Generation)
create or replace function generate_cards(jumlah_kartu int, start_index int default 1)
returns void as $$
declare
  i int;
  new_id text;
  new_pin text;
begin
  for i in 0..(jumlah_kartu - 1) loop
    -- Format ID sekuensial dengan prefix 'c' dan 4 digit angka (c0001, c0002, dst)
    new_id := 'c' || lpad((start_index + i)::text, 4, '0');
    -- Format PIN 4 angka acak (1000 - 9999)
    new_pin := floor(random() * 8999 + 1000)::text;
    
    insert into cards (id, pin) 
    values (new_id, new_pin)
    on conflict (id) do nothing;
  end loop;
end;
$$ language plpgsql;

-- Contoh Eksekusi: Buat 100 kartu sekaligus dimulai dari c0001
-- select generate_cards(100, 1);
```

---

## 4. Feature Specifications & User Stories

### 4.1 Feature A: Dynamic Redirect Handler (`/c/[id]`)
- **User Story:** Sebagai pelanggan toko, saat saya men-tap kartu NFC / scan QR code di meja kasir, saya ingin langsung dialihkan ke halaman ulasan Google toko tersebut tanpa hambatan.
- **System Requirements:**
  - Route handler menangani method `GET`.
  - Mengambil parameter `id` dari path URL.
  - Melakukan pencarian data pada Supabase.
  - Jika `card.is_active == true` dan `card.target_url` tidak kosong: Kirim `HTTP 302 Redirect` ke `card.target_url`.
  - Jika `card.is_active == false` atau kartu belum terdaftar: Kirim `HTTP 302 Redirect` ke `/activate?id=[id]`.

### 4.2 Feature B: Self-Activation & Management Portal (`/activate`)
- **User Story:** Sebagai pembeli kartu (pemilik toko), saya ingin memasukkan PIN dari kemasan kartu dan menempelkan tautan ulasan Google saya agar kartu bisa langsung digunakan.
- **UI Components:**
  - Header & Card container yang responsif.
  - Tampilan ID Kartu aktif secara otomatis dari query parameter (`?id=c0001`).
  - Tab Switcher: **[Aktivasi Baru]** / **[Update Link]**.
  - Form Fields:
    - Input PIN Pengaman (masked / password field).
    - Input Link Google Review (`type="url"` dengan skema validation `https://...`).
  - Submit Button dengan status animasi `loading` / `spinner`.
  - Toast notification / Alert Box untuk feedback status.

### 4.3 Feature C: Landing Page & Manual Lookup (`/`)
- **User Story:** Sebagai pemilik kartu, jika QR Code tidak sengaja tidak dapat terbaca, saya ingin dapat mengakses halaman utama website untuk memasukkan ID Kartu secara manual dan mengaktifkannya.
- **UI Components:**
  - Banner Perkenalan Platform.
  - Input Pencarian ID Kartu Manual.
  - Tombol pengarah ke halaman aktivasi.

---

## 5. Non-Functional Requirements (NFRs)

1. **Performance:**
   - Halaman alih (`/c/[id]`) menggunakan server-side execution ringan tanpa render UI React berat untuk meminimalkan durasi *Time to First Byte* (TTFB).
2. **Security & Validation:**
   - Sanitasi input URL untuk mencegah *Open Redirect Vulnerability* atau *XSS*.
   - Verifikasi PIN pengaman wajib dilakukan di level backend sebelum mutasi database Supabase.
3. **Usability & Mobile-First:**
   - Tampilan UI dioptimalkan untuk layar ponsel (viewports $\le 430\text{px}$).
   - Ukuran font dan elemen tombol memenuhi standar tap target Google ($\ge 48\text{px}$).

---

## 6. Implementation Checklist & Environment Variables

### Environment Variables
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### File Structure
```text
├── app/
│   ├── activate/
│   │   └── page.jsx        # Halaman Aktivasi & Edit URL Toko
│   ├── c/
│   │   └── [id]/
│   │       └── route.js    # Edge Redirect Route Engine
│   ├── layout.jsx
│   └── page.jsx            # Landing Page & Manual ID Input
├── lib/
│   └── supabase.js         # Singleton Client Supabase
├── docs/
│   └── prd_dynamic_google_review_card.md
└── package.json
```