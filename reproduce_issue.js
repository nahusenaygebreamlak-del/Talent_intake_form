import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gbfhvfadnfnswhamwkec.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdiZmh2ZmFkbmZuc3doYW13a2VjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA4OTE3MTQsImV4cCI6MjA4NjQ2NzcxNH0.A4Cjq8pRXbhj24etWrndBwsME_XBoR2CPNgQlNhzZCs';

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
    console.log('Testing Supabase Connection...');

    // 1. List Buckets
    console.log('\n1. Listing Buckets...');
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();

    if (listError) {
        console.error('❌ Error listing buckets:', listError);
        return;
    }

    console.log('Buckets found:', buckets.map(b => b.name));

    const cvsBucket = buckets.find(b => b.name === 'cvs');
    if (!cvsBucket) {
        console.error('❌ "cvs" bucket NOT found. This is likely the issue.');
        return;
    }
    console.log('✅ "cvs" bucket found.');

    // 2. Try to upload a dummy file
    console.log('\n2. Attempting dummy upload...');
    const fileName = `test_${Date.now()}.txt`;
    const fileBody = 'This is a test file to verify upload permissions.';

    const { data: uploadData, error: uploadError } = await supabase.storage
        .from('cvs')
        .upload(fileName, fileBody);

    if (uploadError) {
        console.error('❌ Upload failed:', uploadError);
    } else {
        console.log('✅ Upload successful:', uploadData);

        // Cleanup
        console.log('Cleaning up test file...');
        const { error: removeError } = await supabase.storage
            .from('cvs')
            .remove([fileName]);

        if (removeError) {
            console.warn('⚠️ Failed to remove test file:', removeError);
        } else {
            console.log('✅ Test file removed.');
        }
    }
}

test();
