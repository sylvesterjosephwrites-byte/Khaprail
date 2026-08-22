import { createClient } from "@supabase/supabase-js"

const url = import.meta.env.VITE_SUPABASE_URL
const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

/**
 * Null until the Khaprail Supabase project is provisioned (see
 * 00-PROGRESS.md). Callers must handle the null case rather than
 * assuming a connection — do not fall back to hardcoded/fake data.
 */
export const supabase = url && publishableKey ? createClient(url, publishableKey) : null
