import { NextResponse } from 'next/server';
import { updateCardWithPin } from '@/lib/cards';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const body = await request.json();
    const { id, pin, target_url } = body || {};

    if (!id || !pin || !target_url) {
      return NextResponse.json(
        { success: false, error: 'Parameter id, pin, dan target_url wajib disertakan.' },
        { status: 400 }
      );
    }

    const result = await updateCardWithPin({
      id,
      pin,
      targetUrl: target_url,
    });

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: result.error.includes('PIN') ? 401 : 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Kartu berhasil diaktifkan/diperbarui.',
      card: {
        id: result.card.id,
        is_active: result.card.is_active,
        target_url: result.card.target_url,
        updated_at: result.card.updated_at,
      },
    });
  } catch (err) {
    console.error('[API Activate] Error:', err);
    return NextResponse.json(
      { success: false, error: 'Terjadi kesalahan internal pada server.' },
      { status: 500 }
    );
  }
}
