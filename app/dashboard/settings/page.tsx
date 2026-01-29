import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { redirect } from 'next/navigation';
import CommissionerProfileForm from '@/components/dashboard/settings/CommissionerProfileForm';
import DeveloperProfileForm from '@/components/dashboard/settings/DeveloperProfileForm';
import { User } from 'lucide-react';

export default async function SettingsPage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect('/login');
    }

    const user = session.user as any;

    // Fetch full profile data
    let profileData = null;
    let stats = null;

    if (user.role === 'commissioner') {
        const { data } = await db.supabaseAdmin
            .from('commissioners')
            .select('*')
            .eq('user_id', user.id)
            .single();
        profileData = data;
    } else if (user.role === 'developer') {
        const { data } = await db.supabaseAdmin
            .from('developers')
            .select('*')
            .eq('user_id', user.id)
            .single();
        profileData = data;
    }

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-8">
            <div className="flex items-center gap-4 border-b border-gray-100 pb-6">
                <div className="bg-blue-100 p-3 rounded-full">
                    <User className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
                    <p className="text-gray-500">Manage your public profile and verification details</p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                {user.role === 'commissioner' ? (
                    <CommissionerProfileForm initialData={profileData} userId={user.id} />
                ) : user.role === 'developer' ? (
                    <DeveloperProfileForm initialData={profileData} userId={user.id} />
                ) : (
                    <div className="text-center py-8">
                        <p className="text-gray-500">Admin profiles are managed by the system.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
