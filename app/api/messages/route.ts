import { createClient } from '@supabase/supabase-js';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { NextResponse } from 'next/server';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const conversationId = searchParams.get('conversationId');

    try {
        if (conversationId) {
            // Get messages for a specific conversation
            const { data, error } = await supabase
                .from('messages')
                .select(`
                    *,
                    sender:users(full_name, role)
                `)
                .eq('conversation_id', conversationId)
                .order('created_at', { ascending: true });

            if (error) throw error;
            return NextResponse.json({ success: true, data });
        } else {
            // Get conversations for the current user
            const { data, error } = await supabase
                .from('conversation_participants')
                .select(`
                    conversation:conversations(
                        *,
                        participants:conversation_participants(
                            user:users(id, full_name, role)
                        )
                    )
                `)
                .eq('user_id', (session.user as any).id);

            if (error) throw error;
            return NextResponse.json({ success: true, data: data.map(item => item.conversation) });
        }
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const body = await req.json();
        const { conversationId, content, recipientId, projectId } = body;
        const userId = (session.user as any).id;

        let activeConvId = conversationId;

        // If no conversationId, create one (direct or project-based)
        if (!activeConvId) {
            const { data: newConv, error: convError } = await supabase
                .from('conversations')
                .insert([{ project_id: projectId || null, title: projectId ? 'Project Discussion' : 'Direct Message' }])
                .select()
                .single();

            if (convError) throw convError;
            activeConvId = newConv.id;

            // Add participants
            const participants = [
                { conversation_id: activeConvId, user_id: userId },
                { conversation_id: activeConvId, user_id: recipientId }
            ].filter(p => p.user_id); // Ensure recipientId exists

            const { error: partError } = await supabase
                .from('conversation_participants')
                .insert(participants);

            if (partError) throw partError;
        }

        // Insert message
        const { data, error } = await supabase
            .from('messages')
            .insert([{
                conversation_id: activeConvId,
                sender_id: userId,
                content
            }])
            .select()
            .single();

        if (error) throw error;

        // Update conversation updated_at
        await supabase
            .from('conversations')
            .update({ updated_at: new Date().toISOString() })
            .eq('id', activeConvId);

        return NextResponse.json({ success: true, data });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
