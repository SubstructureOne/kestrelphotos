import { NextPage } from 'next'
import AlbumList from '../components/albumlist'
import Navigation from '../components/navigation'
import Footer from '../components/footer'
import { useState } from 'react'
import { Session } from '@supabase/supabase-js'
import { checkSession } from '../utils/supabase'

const Home: NextPage = () => {
    const [session, setSession] = useState<Session|null>(null)
    checkSession(setSession)
    return <>
        <meta charSet="utf-8" />
        <title>Kestrel Photos</title>
        <meta content="width=device-width, initial-scale=1" name="viewport" />
        <meta content="Webflow" name="generator" />
        <link href="css/normalize.css" rel="stylesheet" type="text/css" />
        <link href="css/webflow.css" rel="stylesheet" type="text/css" />
        <link href="css/kestrelphotos.webflow.css" rel="stylesheet" type="text/css" />
        <link href="images/favicon.ico" rel="shortcut icon" type="image/x-icon" />
        <link href="images/webclip.png" rel="apple-touch-icon" />
        <Navigation session={session} setSession={setSession}/>
        <div className="section wf-section">
            <div className="w-container">
                <div className="w-dyn-list">
                    <AlbumList/>
                </div>
            </div>
        </div>
        <Footer/>
    </>
}

export default Home