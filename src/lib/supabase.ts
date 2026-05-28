import { createClient } from '@supabase/supabase-js';


// Initialize database client
const supabaseUrl = 'https://rgrntdinnwywkvovmzyz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJncm50ZGlubnd5d2t2b3Ztenl6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk5NzIzODIsImV4cCI6MjA5NTU0ODM4Mn0.yb5yTBN48Du_hucF3-vvAFCexmpXlA6E-MK_k6wVvUg';
const supabase = createClient(supabaseUrl, supabaseKey);


export { supabase };
