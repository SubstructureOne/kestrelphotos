import { NextPage } from 'next'
import AlbumList from '../components/albumlist'
import Navigation from '../components/navigation'
import Footer from '../components/footer'
import React, { useState } from 'react'
import { Session } from '@supabase/supabase-js'
import { checkSession } from '../utils/supabase'
import { Headers } from '../components/headers'
import Auth from '../components/auth'

const Home: NextPage = () => {
    const [session, setSession] = useState<Session|null>(null)
    checkSession(setSession)
    return <>
        <Headers title="Kestrel Photos"/>
        <Navigation session={session} setSession={setSession}/>
        {!session ? <Auth setSession={setSession}/> :
            <div className="section wf-section">
                <div className="w-container">
                    <div className="w-dyn-list">
                        <AlbumList/>
                    </div>
                </div>
            </div>
        }
        <Footer/>
    </>
}

export default Home