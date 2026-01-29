import { NextRequest, NextResponse } from 'next/server';
import { paystackPayments } from '@/lib/payments/paystack';
import { emailService } from '@/lib/email';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { client_name, client_email, amount, description, invoice_number } = body;

        // 1. Generate Payment Link via Paystack
        // We use the initializeTransaction but we might not need to store it in our DB immediately 
        // if this is a "Quick Invoice". But for safety, we should prob treat it like a generic transaction.
        // For simplicity towards the User Request (speed), we'll just generate the link.
        // Paystack initialize returns { authorization_url, access_code, reference }

        const paystackResponse = await paystackPayments.initializeTransaction(
            client_email,
            Number(amount), // Paystack expects KES
            undefined, // Use default callback
            {
                custom_fields: [
                    { display_name: "Invoice Number", variable_name: "invoice_number", value: invoice_number },
                    { display_name: "Client Name", variable_name: "client_name", value: client_name }
                ],
                invoice_number, // Root level metadata
                description
            }
        );

        if (!paystackResponse || !paystackResponse.data) {
            throw new Error('Failed to generate payment link from Paystack');
        }

        const paymentUrl = paystackResponse.data.authorization_url;

        // 2. Send Premium Email
        await emailService.sendInvoice(
            client_email,
            client_name,
            amount,
            description,
            invoice_number,
            paymentUrl
        );

        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error('Invoice API Error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to process invoice' },
            { status: 500 }
        );
    }
}
