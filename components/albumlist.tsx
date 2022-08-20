import { useEffect, useState } from "react"
import { supabase } from "../utils/supabase"
import { decrypt, getPrivKey } from "../utils/encrypt"
import { fromBase64, toBase64 } from "../utils/encoding"
import { Album, UserData } from "../utils/types/albums"

export type DecryptedAlbumData = {
    udataid: number
    albumName: string
    albumId: string
    decrypted_datauri: string
}

const AlbumList = () => {
    const [albumList, setAlbumList] = useState<DecryptedAlbumData[]>([])
    const updateAlbumList = async () => {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_KESTREL_WORKER_URL}/queryuserdata`,
            {
                headers: { "Content-Type": "application/json" },
                method: "POST",
                body: JSON.stringify({
                    jwt: supabase.auth.session()?.access_token,
                    userid: supabase.auth.user()?.id,
                    appid: 1,
                    column: "data->>dataType",
                    operator: "eq",
                    value: "Album",
                }),
            }
        )
        const data = await response.json()
        const results: UserData<Album>[] = data.results
        console.log(JSON.stringify(results))
        const decrypted = await Promise.all(
            results.map(async (udata) => {
                const decrypted_datauri = await generateDataUri(udata)
                return {
                    udataid: udata.udataid,
                    albumName: udata.data.data.albumName,
                    albumId: udata.data.data.albumId,
                    decrypted_datauri: decrypted_datauri,
                }
            })
        )
        setAlbumList(decrypted)
    }
    async function generateDataUri(album: UserData<Album>) {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_KESTREL_WORKER_URL}/getfile`,
            {
                headers: { "Content-Type": "application/json" },
                method: "POST",
                body: JSON.stringify({
                    jwt: supabase.auth.session()?.access_token,
                    userid: supabase.auth.user()?.id,
                    appid: 1,
                    path: album.data.data.coverPath,
                }),
            }
        )
        const encrypted = await response.arrayBuffer()
        const iv = fromBase64(album.data.data.iv_b64)
        const privkey = await getPrivKey("default")
        const decrypted = await decrypt({ data: encrypted, iv: iv }, privkey)
        return `data:image/jpeg;base64,${toBase64(decrypted)}`
    }
    useEffect(() => {
        updateAlbumList().catch(console.error)
    }, [])
    return (
        <div role="list" className="w-dyn-items w-row">
            {albumList.map((album) => (
                <div
                    role="listitem"
                    className="w-dyn-item w-col w-col-4"
                    key={album.udataid}
                >
                    <a href={`album/${album.albumId}`} className="photo-link-block w-inline-block">
                        <img src={album.decrypted_datauri} alt="" />
                        <div className="title">{album.albumName}</div>
                    </a>
                </div>
            ))}
        </div>
    )
}

export default AlbumList
