
const { createClient } = require('@supabase/supabase-js');

// Use hardcoded values as fallback or from env
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://fxpniulamlfrhghuymva.supabase.co';
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ4cG5pdWxhbWxmcmhnaHV5bXZhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc1NDg1NDIsImV4cCI6MjA4MzEyNDU0Mn0.y8W8npZr1rbSPPsaQqEcZ_xpwncdUz1P9Vzd6zKKYDM';

const supabase = createClient(supabaseUrl, supabaseKey);

async function resetPassword() {
    console.log('Attempting to reset admin password...');

    const email = 'oooomar123450@gmail.com';
    const newPassword = 'Omar@2597798';

    try {
        // 1. First, check if user exists
        const { data: user, error: fetchError } = await supabase
            .from('admins')
            .select('*')
            .eq('email', email)
            .single();

        if (fetchError) {
            console.error('Error fetching user:', fetchError.message);
            if (fetchError.code === 'PGRST116') {
                console.log('User not found. Attempting to create...');
                const { error: insertError } = await supabase
                    .from('admins')
                    .insert([{ email, password: newPassword, role: 'super_admin' }]);

                if (insertError) {
                    console.error('Failed to create user:', insertError.message);
                } else {
                    console.log('User created successfully with correct password.');
                }
            }
            return;
        }

        // 2. User exists, force update password
        const { error: updateError } = await supabase
            .from('admins')
            .update({ password: newPassword })
            .eq('email', email);

        if (updateError) {
            console.error('Failed to update password:', updateError.message);
            console.log('POSSIBLE CAUSE: RLS Policies might be blocking updates.');
        } else {
            console.log('Password updated successfully to:', newPassword);
            console.log('Please try logging in now.');
        }

    } catch (err) {
        console.error('Unexpected error:', err);
    }
}

resetPassword();
