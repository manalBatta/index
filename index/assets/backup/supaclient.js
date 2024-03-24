import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(
  "https://nuynsybvqehevqyeamol.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51eW5zeWJ2cWVoZXZxeWVhbW9sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDk0OTU5MjAsImV4cCI6MjAyNTA3MTkyMH0.kWza9pLgHbToOOLeTsirG4-UDoF0spOlghH3kxbacEc"
);
