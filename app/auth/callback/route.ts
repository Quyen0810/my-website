import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get('code')
    const error = requestUrl.searchParams.get('error')
    const error_description = requestUrl.searchParams.get('error_description')

    if (error) {
        console.error('OAuth error:', error, error_description)
        return NextResponse.redirect(
            new URL(`/sign-in?error=${error}&description=${error_description || ''}`, request.url)
        )
    }

    if (code) {
        try {
            const supabase = createRouteHandlerClient({ cookies })
            const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

            if (exchangeError) {
                console.error('Error exchanging code for session:', exchangeError)
                return NextResponse.redirect(
                    new URL(`/sign-in?error=exchange_failed&description=${exchangeError.message}`, request.url)
                )
            }
        } catch (err) {
            console.error('Unexpected error during code exchange:', err)
            return NextResponse.redirect(
                new URL('/sign-in?error=unexpected_failure', request.url)
            )
        }
    }

    return NextResponse.redirect(new URL('/', request.url))
}
