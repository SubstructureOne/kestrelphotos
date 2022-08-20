import React, { useEffect, useState } from 'react'
import {useRouter} from "next/router";
import { Session } from '@supabase/supabase-js'
import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'

import { Headers } from '../../components/headers'
import Footer from '../../components/footer'
import Navigation from '../../components/navigation'

import { checkSession } from '../../utils/supabase'
import { Album, AlbumImage } from '../../utils/types/albums'
import { fromBase64, toBase64 } from '../../utils/encoding'
import { decrypt, getPrivKey } from '../../utils/encrypt'
import { queryUserData, retrieveFile } from '../../utils/kestrel'


export type DecryptedImageData = {
    imageId: string
    decrypted_datauri: string
}

const AlbumImages = () => {
    const [session, setSession] = useState<Session|null>(null)
    checkSession(setSession)
    const [imageList, setImageList] = useState<DecryptedImageData[]>([]);
    const [albumName, setAlbumName] = useState('')
    const router = useRouter();
    const updateAlbumName = async () => {
        if (!router.isReady) return
        const userdata = await queryUserData<Album>([{
            column: "data->>dataType",
            operator: "eq",
            value: "Album",
        }])
        const albums = userdata.map(ud => ud.data.value)
        const filtered = albums.filter(album => album.albumId == router.query.albumId)
        if (filtered.length > 0) {
            setAlbumName(filtered[0].albumName)
        }
    }
    const updateImageList = async () => {
        if (!router.isReady) return
        // FIXME: need to filter by album ID here
        const userdata = await queryUserData<AlbumImage>([{
            column: "data->>dataType",
            operator: "eq",
            value: "AlbumImage",
        }])
        const images = userdata.map(ud => ud.data.value)
        console.log(`Filtering ${JSON.stringify(images)} on albumId == ${router.query.albumId}`)
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
        const encrypted = await retrieveFile(image.photoPath)
        const iv = fromBase64(image.iv_b64);
        const privkey = await getPrivKey("default");
        const decrypted = await decrypt({ data: encrypted, iv: iv }, privkey);
        return `data:image/jpeg;base64,${toBase64(decrypted)}`;
    }
    useEffect(() => {updateImageList().catch(console.error)}, [router.isReady])
    useEffect(() => {updateAlbumName().catch(console.error)}, [router.isReady])
    return <>
        <Headers title={`View Album: ${albumName}`}/>
        <Navigation session={session} setSession={setSession}/>
        <div className="section wf-section">
            <div className="w-container">
                {/*<h1>{albumName}</h1>*/}
                <div className="photo-page-title center">{albumName}</div>
                <div className="w-dyn-list">
                    <div role="list" className="w-dyn-items w-row">
                        {imageList.map((album) => (
                            <div
                                role="listitem"
                                className="w-dyn-item w-col w-col-4"
                                key={album.imageId}
                            >
                                <a href="#" className="photo-link-block w-inline-block">
                                    <Zoom>
                                        <img src={album.decrypted_datauri} alt="" />
                                    </Zoom>
                                </a>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
        <Footer/>
    </>
}

export default AlbumImages
