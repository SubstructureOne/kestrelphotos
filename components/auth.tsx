import { Dispatch, FunctionComponent, SetStateAction, useState } from 'react'
import React from "react"
import { supabase } from '../utils/supabase'
import { Session } from '@supabase/supabase-js'

type LogoutProperties = {
    setSession: Dispatch<SetStateAction<Session|null>>
    hamburger: boolean
}

export const LogoutButton: FunctionComponent<LogoutProperties> = ({setSession, hamburger}) => {
    const className = hamburger ? "navigation-link w-nav-link bm-item" : "navigation-link w-nav-link"
    return <a
        className={className}
        style={hamburger ? {display: "block"} : {}}
        onClick={async e=>{
            console.log("Signing out")
            await supabase.auth.signOut()
            setSession(null)
        }}
        href="#"
    >
        Logout
    </a>
}

type AuthProperties = {
    setSession: Dispatch<SetStateAction<Session|null>>
}

const Auth: FunctionComponent<AuthProperties> = ({setSession}) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const onSubmitHandler = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const {session, error} = await supabase.auth.signIn(
            {email, password},
            {redirectTo: "#"}
        )
        if (error) {
            throw error
        }
        setSession(session)
    }
    return (
        <div className="w-container">
            <form
                id="login-form"
                name="login-form"
                onSubmit={onSubmitHandler}
            >
                <label htmlFor="email">Email</label>
                <input
                    type="text"
                    className="w-input"
                    maxLength={256}
                    name="email"
                    id="email"
                    value={email}
                    onChange={e=>setEmail(e.target.value)}
                />
                <label htmlFor="password">Password</label>
                <input
                    type="password"
                    className="w-input"
                    maxLength={256}
                    name="password"
                    id="password"
                    value={password}
                    onChange={e=>setPassword(e.target.value)}
                />
                <input type="submit" value="Submit" className="w-button" />
            </form>
        </div>
    )
}

export default Auth