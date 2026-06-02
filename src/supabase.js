import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://bpmostdxlhutvhnxxycu.supabase.co'
const SUPABASE_KEY = 'sb_publishable_D4Uk8c2qKxT2v4Rdqu7UVg_4Oj4X6jh'

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)
