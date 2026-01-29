import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/db';

// GET: List invoices (Admin or Commissioner)
export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { searchParams } = new URL(req.url);
        const status = searchParams.get('status');

        let query = supabaseAdmin
            .from('invoices')
            .select(`
                *,
                client:clients(name, email),
                project:projects(title)
            `)
            .order('created_at', { ascending: false });

        if (status) {
            query = query.eq('status', status);
        }

        // If not admin, maybe filter by their projects? 
        // For now assuming this endpoint is primarily for the Admin Dashboard

        const { data, error } = await query;
        if (error) throw error;

        return NextResponse.json({ success: true, data });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

// POST: Create a new Invoice Request (Pending Approval)
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const body = await request.json();
        const {
            client_id,
            project_id,
            amount,
            description,
            invoice_number,
            commissioner_id // Optional: who created it
        } = body;

        // Create invoice in DB with 'pending_approval' status
        const { data: invoice, error } = await supabaseAdmin
            .from('invoices')
            .insert({
                client_id,
                project_id,
                commissioner_id: commissioner_id || (session.user as any).id, // Fallback to current user
                amount,
                description,
                invoice_number,
                status: 'pending_approval',
                currency: 'KES'
            })
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json({
            success: true,
            data: invoice,
            message: 'Invoice request submitted for admin approval.'
        });

    } catch (error: any) {
        console.error('Invoice Creation Error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to create invoice request' },
            { status: 500 }
        );
    }
}
