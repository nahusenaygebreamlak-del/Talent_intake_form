import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gbfhvfadnfnswhamwkec.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdiZmh2ZmFkbmZuc3doYW13a2VjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA4OTE3MTQsImV4cCI6MjA4NjQ2NzcxNH0.A4Cjq8pRXbhj24etWrndBwsME_XBoR2CPNgQlNhzZCs';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testUpdate() {
    console.log('Testing Rating Update...');

    // 1. Fetch any application to get an ID
    const { data: apps, error: fetchError } = await supabase
        .from('job_applications')
        .select('id, full_name, rating')
        .limit(1);

    if (fetchError) {
        console.error('❌ Error fetching applications:', fetchError);
        return;
    }

    if (!apps || apps.length === 0) {
        console.log('⚠️ No applications found to test update on.');
        return;
    }

    const app = apps[0];
    console.log(`Found application: ${app.full_name} (ID: ${app.id}, Current Rating: ${app.rating})`);

    // 2. Try to update the rating
    const newRating = 5;
    console.log(`Attempting to update rating to ${newRating}...`);

    const { data: updateData, error: updateError } = await supabase
        .from('job_applications')
        .update({ rating: newRating })
        .eq('id', app.id)
        .select();

    if (updateError) {
        console.error('❌ Update failed:', updateError);
        console.log('\nPossible Cause: Missing RLS Policy for UPDATE.');
    } else {
        console.log('✅ Update successful:', updateData);

        // Check if it actually updated (sometimes RLS silently ignores if using returning without select policy)
        if (updateData && updateData.length > 0) {
            console.log('Verified updated data:', updateData[0]);
        } else {
            console.warn('⚠️ Update reported success but returned no data. Check if the row was actually modified.');

            // Double check by fetching again
            const { data: verifyData } = await supabase
                .from('job_applications')
                .select('rating')
                .eq('id', app.id)
                .single();
            console.log('Re-fetched rating:', verifyData?.rating);
        }
    }
}

testUpdate();
