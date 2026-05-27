import { createClient } from '@supabase/supabase-js';


// Initialize database client
const supabaseUrl = 'https://qukkolsfjxptxktgcvjt.databasepad.com';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjI5MDRmNWZiLWY5MDctNGJiNC1iMDFmLTY0MTllZWY4ZWM1MiJ9.eyJwcm9qZWN0SWQiOiJxdWtrb2xzZmp4cHR4a3RnY3ZqdCIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzY2MjUxMzgzLCJleHAiOjIwODE2MTEzODMsImlzcyI6ImZhbW91cy5kYXRhYmFzZXBhZCIsImF1ZCI6ImZhbW91cy5jbGllbnRzIn0.uz_BCa63l6N1MYj4J8J-cVbcUdAYsAb8OzUxv_4KCmE';
const supabase = createClient(supabaseUrl, supabaseKey);


export { supabase };