import { useEffect, useState } from "react"
import { decrypt, getPrivKey } from "../utils/encrypt"
import { fromBase64, toBase64 } from "../utils/encoding"
import { Album, UserData } from "../utils/types/albums"
import { queryUserData, retrieveFile } from '../utils/kestrel'

export type DecryptedAlbumData = {
    udataid: number
    albumName: string
    albumId: string
    decrypted_datauri: string
}

const AlbumList = () => {
    const [albumList, setAlbumList] = useState<DecryptedAlbumData[]>([])
    const updateAlbumList = async () => {
        const results = await queryUserData<Album>([{
            column: "data->>dataType",
            operator: "eq",
            value: "Album"
        }])
        console.log(JSON.stringify(results))
        const decrypted = await Promise.all(
            results.map(async (udata) => {
                const decrypted_datauri = await generateDataUri(udata)
                return {
                    udataid: udata.udataid,
                    albumName: udata.data.value.albumName,
                    albumId: udata.data.value.albumId,
                    decrypted_datauri: decrypted_datauri,
                }
            })
        )
        setAlbumList(decrypted)
    }
    async function generateDataUri(album: UserData<Album>) {
        const encrypted = await retrieveFile(album.data.value.coverPath)
        const iv = fromBase64(album.data.value.iv_b64)
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
                    <a href={`album/viewalbum?albumId=${album.albumId}`} className="photo-link-block w-inline-block">
                        <img src={album.decrypted_datauri} alt="" />
                        <div className="title">{album.albumName}</div>
                    </a>
                </div>
            ))}
        </div>
    )
}

export default AlbumList
