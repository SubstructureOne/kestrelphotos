import { createClient, Session } from '@supabase/supabase-js'
import { Dispatch, SetStateAction, useEffect } from 'react'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ""

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export function checkSession(
    setSession: Dispatch<SetStateAction<Session|null>>,
) {
    useEffect(
        () => setSession(supabase.auth.session()),
        []
    )
}