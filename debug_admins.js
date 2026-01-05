
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://fxpniulamlfrhghuymva.supabase.co';
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ4cG5pdWxhbWxmcmhnaHV5bXZhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc1NDg1NDIsImV4cCI6MjA4MzEyNDU0Mn0.y8W8npZr1rbSPPsaQqEcZ_xpwncdUz1P9Vzd6zKKYDM';

const supabase = createClient(supabaseUrl, supabaseKey);

async function debugAdmins() {
    console.log('--- DEBUGGING ADMINS TABLE ---');

    // 1. Fetch ALL admins
    const { data, error } = await supabase
        .from('admins')
        .select('*');

    if (error) {
        console.error('ERROR fetching admins:', error.message);
        return;
    }

    console.log(`Found ${data.length} admin(s) in the database:`);

    if (data.length === 0) {
        console.log('!!! THE TABLE IS EMPTY !!!');
        console.log('Attempting to create the admin user now...');

        const { error: insertError } = await supabase
            .from('admins')
            .insert([
                {
                    email: 'oooomar123450@gmail.com',
                    password: 'Omar@2597798',
                    role: 'super_admin'
                }
            ]);

        if (insertError) {
            console.error('Failed to create admin:', insertError.message);
        } else {
            console.log('>>> Admin user created successfully.');
        }
    } else {
        data.forEach((admin, index) => {
            console.log(`[${index + 1}] ID: ${admin.id}`);
            console.log(`    Email:    '${admin.email}'`);
            console.log(`    Password: '${admin.password}'`); // Showing plain text for debugging only
            console.log(`    Role:     ${admin.role}`);
            console.log('-----------------------------------');
        });
    }
}

debugAdmins();
