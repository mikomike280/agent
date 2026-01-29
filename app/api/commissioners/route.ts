import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const minBudget = searchParams.get('minBudget');
    const maxBudget = searchParams.get('maxBudget');
    const search = searchParams.get('search');

    try {
        let query = supabase
            .from('commissioners')
            .select(`
                *,
                user:users(id, name, avatar_url)
            `);

        if (category) {
            query = query.contains('specialties', [category]);
        }

        // Note: Budget filtering would typically require a defined range column or logic
        // For now, we'll return all and let frontend filter if complex logic is needed, 
        // or assume 'average_price_range' is text we can't easily range-query without parsing.
        // If we had a numeric 'min_project_size' column, we'd use that.

        if (search) {
            // Search by bio or user name via join is tricky in simple Supabase queries without RPC or specific setup.
            // We'll filter by bio here if possible, or relying on frontend for deep text search if dataset is small.
            query = query.ilike('bio', `%${search}%`);
        }

        const { data, error } = await query;

        if (error) throw error;

        // Transform data for the frontend card
        const commissioners = data.map(comm => ({
            id: comm.id,
            user_id: comm.user_id,
            name: comm.user?.name || 'Commissioner',
            avatar: comm.user?.avatar_url,
            bio: comm.bio,
            specialties: comm.specialties || [],
            price_range: comm.average_price_range || 'Negotiable',
            delivery_time: comm.delivery_time_range || 'Varies',
            rating: comm.rating || 5.0,
            completed_projects: comm.completed_count || 0,
            availability: comm.availability_status || 'available'
        }));

        return NextResponse.json({ success: true, data: commissioners });

    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
