import { NextResponse } from 'next/server';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const appKey = searchParams.get('appKey');

    if (!appKey) {
        return NextResponse.json({ error: 'appKey obrigatório.' }, { status: 400 });
    }

    try {
        const response = await fetch(
        `${process.env.LICENSE_API_URL}/api/license/validate/${appKey}`
        );
        const data = await response.json();
        return NextResponse.json(data, { status: response.status });
    } catch {
        return NextResponse.json({ error: 'Erro ao validar licença.' }, { status: 500 });
    }
}