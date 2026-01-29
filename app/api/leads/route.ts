// API Route: Create Lead & Fetch Public Leads
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, db } from '@/lib/db';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        let { commissioner_id, user_id, client_name, client_phone, client_email, project_summary, budget } = body;

        // Smart Lookup: If no commissioner_id, try to find it via user_id
        if (!commissioner_id && user_id) {
            const { data: comm } = await supabaseAdmin
                .from('commissioners')
                .select('id')
                .eq('user_id', user_id)
                .single();

            if (comm) {
                commissioner_id = comm.id;
            }
        }

        // Validate required fields
        if (!commissioner_id || !client_name) {
            return NextResponse.json(
                { error: 'Commissioner ID (or valid User ID) and client name are required' },
                { status: 400 }
            );
        }

        // Generate unique intake token (Required by DB Schema)
        const intakeToken = crypto.randomBytes(32).toString('hex');
        const intakeLink = `${process.env.NEXTAUTH_URL}/intake/${intakeToken}`;

        // Create lead
        const { data: lead, error } = await supabaseAdmin
            .from('leads')
            .insert({
                commissioner_id,
                client_name,
                client_phone,
                client_email,
                project_summary,
                budget,
                intake_token: intakeToken,
                intake_link: intakeLink,
                status: 'created'
            })
            .select('*, commissioner:commissioners(*,user:users(*))')
            .single();

        if (error) throw error;

        // Audit Log
        await db.createAuditLog(
            commissioner_id,
            'commissioner',
            'lead_created',
            { lead_id: lead.id, client_name, note: 'Public Pool Lead' }
        );

        // NOTE: Email sending removed as per "No Link Generation/Email" requirement.
        // The link is generated for the record but not sent.

        return NextResponse.json({
            success: true,
            data: {
                lead_id: lead.id,
                message: 'Lead added to Public Pool successfully.'
            }
        });
    } catch (error: any) {
        console.error('Error creating lead:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to create lead' },
            { status: 500 }
        );
    }
}

export async function GET(request: NextRequest) {
    try {
        // Public Pool Logic: Fetch ALL leads, regardless of commissioner.
        // In a real app, you might valid auth here, but for now we assume middleware handles session protection.

        const { data: leads, error } = await supabaseAdmin
            .from('leads')
            .select(`
                *,
                commissioner:commissioners (
                    id,
                    user:users (
                        name,
                        email,
                        avatar_url
                    )
                )
            `)
            .order('created_at', { ascending: false });

        if (error) throw error;

        return NextResponse.json({ success: true, data: leads });
    } catch (error: any) {
        console.error('Error fetching leads:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to fetch leads' },
            { status: 500 }
        );
    }
}
try {
    const body = await request.json();
    let { commissioner_id, user_id, client_name, client_phone, client_email, project_summary, budget } = body;

    // Smart Lookup: If no commissioner_id, try to find it via user_id
    if (!commissioner_id && user_id) {
        const { data: comm } = await supabaseAdmin
            .from('commissioners')
            .select('id')
            .eq('user_id', user_id)
            .single();

        if (comm) {
            commissioner_id = comm.id;
        }
    }

    // Validate required fields
    if (!commissioner_id || !client_name) {
        return NextResponse.json(
            { error: 'Commissioner ID (or valid User ID) and client name are required' },
            { status: 400 }
        );
    }

    // Generate unique intake token and link
    const intakeToken = crypto.randomBytes(32).toString('hex');
    const intakeLink = `${process.env.NEXTAUTH_URL}/intake/${intakeToken}`;

    // Create lead
    const { data: lead, error } = await supabaseAdmin
        .from('leads')
        .insert({
            commissioner_id,
            client_name,
            client_phone,
            client_email,
            project_summary,
            budget,
            intake_token: intakeToken,
            intake_link: intakeLink,
            status: 'created'
        })
        .select('*, commissioner:commissioners(*,user:users(*))')
        .single();

    if (error) throw error;

    // Create audit log
    await db.createAuditLog(
        commissioner_id,
        'commissioner',
        'lead_created',
        { lead_id: lead.id, client_name }
    );

    // Send email if client email provided
    if (client_email && lead.commissioner?.user) {
        await emailService.sendIntakeLink(
            client_email,
            lead.commissioner.user.name,
            intakeLink
        );
    }

    return NextResponse.json({
        success: true,
        data: {
            lead_id: lead.id,
            intake_link: intakeLink,
            intake_token: intakeToken
        }
    });
} catch (error: any) {
    console.error('Error creating lead:', error);
    return NextResponse.json(
        { error: error.message || 'Failed to create lead' },
        { status: 500 }
    );
}
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const commissionerId = searchParams.get('commissioner_id');

        if (!commissionerId) {
            return NextResponse.json(
                { error: 'Commissioner ID required' },
                { status: 400 }
            );
        }

        const leads = await db.getLeadsByCommissioner(commissionerId);

        return NextResponse.json({ success: true, data: leads });
    } catch (error: any) {
        console.error('Error fetching leads:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to fetch leads' },
            { status: 500 }
        );
    }
}
