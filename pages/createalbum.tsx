import type { NextPage } from 'next'
import React, { useState } from "react";
import { createClient, Session } from '@supabase/supabase-js'

import Auth from "../components/auth"
import Footer from '../components/footer'
import { Headers } from '../components/headers'
import Navigation from '../components/navigation'

import { fileToBase64, fromBase64, toBase64 } from '../utils/encoding'
import { encrypt, getPrivKey } from '../utils/encrypt'
import { checkSession } from '../utils/supabase'
import { Album, AlbumImage, KPhotoData } from '../utils/types/albums'


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
        const albumId = window.crypto.randomUUID()
        let uploaded: AlbumImage[] = []
        const filehandler = async (file: File) => {
            const filedata_datauri: string = await fileToBase64(file)
            const filedata_b64 = filedata_datauri.substring(
                filedata_datauri.indexOf("base64") + 7
            )
            const filedata = fromBase64(filedata_b64)
            const key = await getPrivKey("default")
            const encrypted = await encrypt(filedata, key)
            const encrypted_b64 = Buffer.from(encrypted.data).toString('base64')
            const iv_b64 = toBase64(encrypted.iv)
            const userid = client.auth.user()?.id
            const imageId = window.crypto.randomUUID()
            const path = `${userid}/${albumId}/${imageId}`
            const newData: KPhotoData<AlbumImage> = {
                dataType: "AlbumImage",
                data: {
                    albumId: albumId,
                    imageId: imageId,
                    photoPath: path,
                    iv_b64: iv_b64,
                }
            }
            await fetch(
                `${process.env.NEXT_PUBLIC_KESTREL_WORKER_URL}/uploadfile`,
                {
                    headers: {'Content-Type': 'application/json'},
                    method: 'POST',
                    body: JSON.stringify({
                        jwt: client.auth.session()?.access_token,
                        userid: userid,
                        appid: process.env.NEXT_PUBLIC_KESTREL_APPID,
                        path: path,
                        filedata_b64: encrypted_b64
                    })
                }
            )
            await fetch(
                `${process.env.NEXT_PUBLIC_KESTREL_WORKER_URL}/adduserdata`,
                {
                    headers: {'Content-Type': 'application/json'},
                    method: 'POST',
                    body: JSON.stringify({
                        jwt: client.auth.session()?.access_token,
                        userid: client.auth.session()?.user?.id,
                        appid: 1,
                        data: newData,
                    })
                }
            )
            uploaded.push({imageId: imageId, albumId: albumId, photoPath: path, iv_b64: iv_b64})
        }
        const promises = files.map(async file => filehandler(file))
        // wait for at least one photo to upload and use it as the
        // cover photo for the album
        await Promise.any(promises)
        const coverPhoto = uploaded[0]
        const newData: KPhotoData<Album> = {
            dataType: "Album",
            data: {
                albumId: albumId,
                albumName: albumName,
                coverPath: coverPhoto.photoPath,
                iv_b64: coverPhoto.iv_b64
            }
        }
        await fetch(
            `${process.env.NEXT_PUBLIC_KESTREL_WORKER_URL}/adduserdata`,
            {
                headers: {"Content-TYpe": 'application/json'},
                method: 'POST',
                body: JSON.stringify({
                    jwt: client.auth.session()?.access_token,
                    userid: client.auth.session()?.user?.id,
                    appid: process.env.NEXT_PUBLIC_KESTREL_APPID,
                    data: newData
                })
            }
        )
        await Promise.all(promises)
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
    checkSession(setSession)
    return <>
        <Headers title="Create Album"/>
        <Navigation session={session} setSession={setSession}/>
        {!session ? <Auth setSession={setSession}/> : <CreateAlbumComponent/>}
        <Footer/>
    </>
}

export default CreateAlbum
