// app/api/projects/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db, supabaseAdmin } from '@/lib/db';

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const userId = (session.user as any).id;
        const role = (session.user as any).role;

        let projects = [];

        if (role === 'client') {
            const { data: client } = await supabaseAdmin
                .from('clients')
                .select('id')
                .eq('user_id', userId)
                .single();
            if (client) {
                projects = await db.getProjectsByClient(client.id);
            }
        } else if (role === 'developer') {
            const { data: developer } = await supabaseAdmin
                .from('developers')
                .select('id')
                .eq('user_id', userId)
                .single();
            if (developer) {
                projects = await db.getProjectsByDeveloper(developer.id);
            }
        } else if (role === 'admin') {
            const { data: allProjects } = await supabaseAdmin
                .from('projects')
                .select('*, milestones:project_milestones(*)')
                .order('created_at', { ascending: false });
            projects = allProjects || [];
        }

        return NextResponse.json({ success: true, data: projects });
    } catch (error: any) {
        console.error('Error fetching projects:', error);
        return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
    }
}
