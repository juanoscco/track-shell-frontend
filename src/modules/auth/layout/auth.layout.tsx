import React from 'react'
import "./auth.layout.css"
export function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <main className='min-h-screen main flex items-center justify-center'>{children}</main>
    )
}
