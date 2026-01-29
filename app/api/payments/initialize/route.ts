import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const { projectId, amount, email } = await req.json();

        if (!projectId || !amount || !email) {
            return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
        }

        // Paystack expects amount in Kobo/Cents
        const paystackAmount = Math.round(amount * 100);
        const secretKey = process.env.PAYSTACK_SECRET_KEY;

        if (!secretKey) {
            console.error('PAYSTACK_SECRET_KEY is missing');
            return NextResponse.json({ message: 'Server configuration error' }, { status: 500 });
        }

        const response = await fetch('https://api.paystack.co/transaction/initialize', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${secretKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email,
                amount: paystackAmount,
                reference: `DEP_${projectId}_${Date.now()}`,
                callback_url: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/dashboard/client`,
                metadata: { projectId, type: 'deposit' }
            }),
        });

        const data = await response.json();

        if (!data.status) {
            return NextResponse.json({ message: data.message || 'Paystack error' }, { status: 400 });
        }

        return NextResponse.json(data.data);
    } catch (error: any) {
        console.error('Payment Init Error:', error);
        return NextResponse.json({ message: error.message || 'Internal server error' }, { status: 500 });
    }
}
