import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user || (session.user as any).role !== 'commissioner') {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const userId = (session.user as any).id;

        // 1. Get current commissioner details
        const { data: me } = await supabaseAdmin
            .from('commissioners')
            .select('id, referral_code, tier, rate_percent')
            .eq('user_id', userId)
            .single();

        if (!me) {
            return NextResponse.json({ message: 'Commissioner profile not found' }, { status: 404 });
        }

        // 2. Fetch Downline (direct referrals)
        // We also want to know their revenue. For now, let's just get the list.
        // In a real app, we'd join with 'projects' or 'commissions' table to sum earnings.
        const { data: downline } = await supabaseAdmin
            .from('commissioners')
            .select(`
                id,
                tier,
                created_at,
                user:users (name, email)
            `)
            .eq('parent_commissioner_id', me.id);

        // 3. Mock revenue calculation for demo purposes
        const teamData = downline?.map((agent: any) => ({
            id: agent.id,
            name: agent.user?.name || 'Unknown',
            level: agent.tier || 'bronze',
            joined: new Date(agent.created_at).toLocaleDateString(),
            revenue: 0,
            my_earnings: 0
        })) || [];

        return NextResponse.json({
            referralCode: me.referral_code,
            level: me.tier,
            downline: teamData,
            stats: {
                totalAgents: teamData.length,
                teamRevenue: 0,
                lifetimeOverrides: 0
            }
        });

    } catch (error: any) {
        console.error('Team API Error:', error);
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
