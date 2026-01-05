
const { createClient } = require('@supabase/supabase-js');

// Use hardcoded values as fallback or from env
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://fxpniulamlfrhghuymva.supabase.co';
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ4cG5pdWxhbWxmcmhnaHV5bXZhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc1NDg1NDIsImV4cCI6MjA4MzEyNDU0Mn0.y8W8npZr1rbSPPsaQqEcZ_xpwncdUz1P9Vzd6zKKYDM';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkAdminSetup() {
    console.log('Testing connection to Supabase...');

    // 1. Check if 'admins' table exists and is accessible
    try {
        const { data, error } = await supabase
            .from('admins')
            .select('*')
            .limit(1);

        if (error) {
            console.error('ERROR: Could not fetch from "admins" table.');
            console.error('Details:', error.message);
            if (error.code === '42P01') {
                console.log('\nDIAGNOSIS: The "admins" table does not exist.');
                console.log('ACTION REQUIRED: You need to run the SQL script in "supabase_admin_setup.sql" in your Supabase Dashboard SQL Editor.');
            }
            return;
        }
        console.log('SUCCESS: "admins" table exists and is accessible.');

        // 2. Check if the specific admin user exists
        const email = 'oooomar123450@gmail.com';
        const { data: user, error: userError } = await supabase
            .from('admins')
            .select('*')
            .eq('email', email)
            .single();

        if (userError || !user) {
            console.log(`WARNING: Admin user '${email}' not found.`);
            // Try to create it (only works if table exists and RLS allows it)
            console.log('Attempting to create admin user...');
            const { error: insertError } = await supabase
                .from('admins')
                .insert([
                    { email: email, password: 'Omar@2597798', role: 'super_admin' }
                ]);

            if (insertError) {
                console.error('FAILED to create admin user:', insertError.message);
            } else {
                console.log('SUCCESS: Admin user created.');
            }
        } else {
            console.log('SUCCESS: Admin user found.');
            console.log('Login should work with:', email);
        }

    } catch (err) {
        console.error('Unexpected error:', err);
    }
}

checkAdminSetup();
