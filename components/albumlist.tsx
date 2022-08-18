import { useEffect, useState } from 'react'
import { supabase } from '../utils/supabase'
import { decrypt, getPrivKey } from '../utils/encrypt'
import { fromBase64, toBase64 } from './encoding'
type Album = {
    albumName: string,
    url: string,
    iv_b64: string,
}

type AlbumUserData = {
    udataid: number,
    data: Album,
}

type DecryptedAlbumUserData = {
    udataid: number,
    albumName: string,
    decrypted_datauri: string
}

const AlbumList = () => {
    const [albumList, setAlbumList] = useState<DecryptedAlbumUserData[]>([])
    const updateAlbumList = async () => {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_KESTREL_WORKER_URL}/queryuserdata`,
            {
                headers: {'Content-Type': 'application/json'},
                method: 'POST',
                body: JSON.stringify({
                    jwt: supabase.auth.session()?.access_token,
                    userid: supabase.auth.user()?.id,
                    appid: 1,
                    column: 'data->>albumName',
                    operator: 'eq',
                    value: 'asdf',

                })
            }
        )
        const data = await response.json()
        const results: AlbumUserData[] = data.results
        console.log(JSON.stringify(results))
        const decrypted = await Promise.all(results.map(async udata => {
            const decrypted_datauri = await generateDataUri(udata)
            return {
                udataid: udata.udataid,
                albumName: udata.data.albumName,
                decrypted_datauri: decrypted_datauri
            }
        }))
        setAlbumList(decrypted)
    }
    async function generateDataUri(album: AlbumUserData) {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_KESTREL_WORKER_URL}/getfile`,
            {
                headers: {'Content-Type': 'application/json'},
                method: 'POST',
                body: JSON.stringify({
                    jwt: supabase.auth.session()?.access_token,
                    userid: supabase.auth.user()?.id,
                    appid: 1,
                    path: album.data.url
                })
            }
        )
        const encrypted = await response.arrayBuffer()
        const iv = fromBase64(album.data.iv_b64)
        const privkey = await getPrivKey("default")
        const decrypted = await decrypt({data: encrypted, iv: iv}, privkey)
        return `data:image/jpeg;base64,${toBase64(decrypted)}`
    }
    useEffect(
        () => { updateAlbumList().catch(console.error) },
        []
    )
    return <div role="list" className="w-dyn-items w-row">
        {
            albumList.map(album =>
                <div role="listitem" className="w-dyn-item w-col w-col-4" key={album.udataid}>
                    <a href="#" className="photo-link-block w-inline-block">
                        <img src={album.decrypted_datauri} alt="" />
                        <div className="title">
                            {album.albumName}
                        </div>
                    </a>
                </div>
            )
        }
    </div>
}

export default AlbumList
