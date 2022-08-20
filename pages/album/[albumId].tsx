import React, { useEffect, useState } from 'react'
import {useRouter} from "next/router";
import { Session } from '@supabase/supabase-js'

import { Headers } from '../../components/headers'
import Footer from '../../components/footer'
import Navigation from '../../components/navigation'

import { checkSession, supabase } from '../../utils/supabase'
import { AlbumImage, UserData } from '../../utils/types/albums'
import { fromBase64, toBase64 } from '../../utils/encoding'
import { decrypt, getPrivKey } from '../../utils/encrypt'


export type DecryptedImageData = {
    imageId: string
    decrypted_datauri: string
}

const AlbumImages = () => {
    const [session, setSession] = useState<Session|null>(null)
    checkSession(setSession)
    const [imageList, setImageList] = useState<DecryptedImageData[]>([]);
    const router = useRouter();
    const updateImageList = async () => {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_KESTREL_WORKER_URL}/queryuserdata`,
            {
                headers: { "Content-Type": "application/json" },
                method: "POST",
                body: JSON.stringify({
                    jwt: supabase.auth.session()?.access_token,
                    userid: supabase.auth.user()?.id,
                    appid: process.env.NEXT_PUBLIC_KESTREL_APPID,
                    // FIXME: need to filter by album ID here
                    column: "data->>dataType",
                    operator: "eq",
                    value: "AlbumImage",
                }),
            }
        );
        const data = await response.json();
        console.log(`${JSON.stringify(router.query.albumId)}: ${JSON.stringify(data)}`)
        const userdata: UserData<AlbumImage>[] = data.results
        const images = userdata.map(ud => ud.data.data)
        const filtered = images.filter(img => img.albumId == router.query.albumId)
        const decrypted = await Promise.all(
            filtered.map(async (image) => {
                const decrypted_datauri = await generateDataUri(image);
                return {
                    imageId: image.imageId,
                    decrypted_datauri: decrypted_datauri,
                };
            })
        );
        console.log(`Image list length: ${decrypted.length}`)
        setImageList(decrypted)
    }

    async function generateDataUri(image: AlbumImage) {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_KESTREL_WORKER_URL}/getfile`,
            {
                headers: { "Content-Type": "application/json" },
                method: "POST",
                body: JSON.stringify({
                    jwt: supabase.auth.session()?.access_token,
                    userid: supabase.auth.user()?.id,
                    appid: process.env.NEXT_PUBLIC_KESTREL_APPID,
                    path: image.photoPath,
                }),
            }
        );
        const encrypted = await response.arrayBuffer();
        const iv = fromBase64(image.iv_b64);
        const privkey = await getPrivKey("default");
        const decrypted = await decrypt({ data: encrypted, iv: iv }, privkey);
        return `data:image/jpeg;base64,${toBase64(decrypted)}`;
    }
    useEffect(() => {
        updateImageList().catch(console.error)
    }, [])
    return <>
        <Headers title="View Album"/>
        <Navigation session={session} setSession={setSession}/>
        <div role="list" className="w-dyn-items w-row">
            {imageList.map((album) => (
                <div
                    role="listitem"
                    className="w-dyn-item w-col w-col-4"
                    key={album.imageId}
                >
                    <a href="#" className="photo-link-block w-inline-block">
                        <img src={album.decrypted_datauri} alt="" />
                    </a>
                </div>
            ))}
        </div>
        <Footer/>
    </>
}

export default AlbumImages
