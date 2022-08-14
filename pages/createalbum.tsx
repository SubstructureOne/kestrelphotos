import type { NextPage } from 'next'
import Navigation from '../components/navigation'
import Footer from '../components/footer'
import React, {useState, useEffect} from "react";
import {toBase64} from '../components/encoding'
import { createClient, Session } from '@supabase/supabase-js'
import Auth from "../components/auth"

const CreateAlbumComponent = () => {
    const [albumName, setAlbumName] = useState('')
    const [fileinfo, setFileinfo] = useState<FileList|null>(null)
    const onSubmitHanlder = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const files = Array.from(fileinfo??[])
        console.log(`Supabase URL: ${process.env.NEXT_PUBLIC_SUPABASE_URL}`)
        const client = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ""
        )
        const { error } = await client.auth.signIn({
            email: process.env.NEXT_PUBLIC_KESTREL_USER,
            password: process.env.NEXT_PUBLIC_KESTREL_PASSWORD
        })
        if (error) {
            console.log(error)
        }
        const filehandler = async (file: File) => {
            const filedata_datauri: string = await toBase64(file)
            const filedata_b64 = filedata_datauri.substring(
                filedata_datauri.indexOf("base64") + 7
            )
            await fetch(
                `${process.env.NEXT_PUBLIC_KESTREL_WORKER_URL}/uploadfile`,
                {
                    headers: {'Content-Type': 'application/json'},
                    method: 'POST',
                    body: JSON.stringify({
                        jwt: client.auth.session()?.access_token,
                        userid: client.auth.user()?.id,
                        appid: "myapp",
                        path: "my/path",
                        filedata_b64: filedata_b64
                    })
                }
            ).then(() => alert("File uploaded: "))
        }
        files.forEach(file => filehandler(file))
    }

    return <div className="w-container">
        <h1>Create Album</h1>
        <div className="w-form">
            <form
                id="createalbum-form"
                name="createalbum-form"
                data-name="Create Album"
                method="get"
                onSubmit={onSubmitHanlder}
            >
                <label htmlFor="name">Album Name</label>
                <input type="text"
                       className="w-input"
                       maxLength={256}
                       name="name"
                       data-name="Name"
                       placeholder=""
                       id="name"
                       value={albumName}
                       onChange={e=>setAlbumName(e.target.value)}
                />
                <label htmlFor="photos">Photos:</label>
                <input
                    type="file"
                    id="photos"
                    className="w-input"
                    multiple={true}
                    onChange={(e) => {setFileinfo(e.target.files)}}
                />
                <input type="submit" value="Submit" data-wait="Please wait..." className="w-button"/>
            </form>
        </div>
    </div>
}

const CreateAlbum: NextPage = () => {
    const [session, setSession] = useState<Session|null>(null)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ""
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ""
    const supabase = createClient(supabaseUrl, supabaseAnonKey)
    useEffect(() => setSession(supabase.auth.session()), [])
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
        {!session ? <Auth setSession={setSession}/> : <CreateAlbumComponent/>}
        <Footer/>
    </>
}

export default CreateAlbum
