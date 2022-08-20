import { supabase } from './supabase'
import { KPhotoData, UserData } from './types/albums'
import { toBase64 } from './encoding'

export type QueryFilter = {
    column: string
    operator: string
    value: string
}

export async function queryUserData<T>(filters: QueryFilter[]): Promise<UserData<T>[]> {
    const response = await fetch(
        `${process.env.NEXT_PUBLIC_KESTREL_WORKER_URL}/queryuserdata`,
        {
            headers: { "Content-Type": "application/json" },
            method: "POST",
            body: JSON.stringify({
                jwt: supabase.auth.session()?.access_token,
                userid: supabase.auth.user()?.id,
                appid: process.env.NEXT_PUBLIC_KESTREL_APPID,
                filters: filters
            }),
        }
    )
    const data = await response.json()
    return data.results
}

export async function addUserData<T>(newData: KPhotoData<T>) {
    await fetch(
        `${process.env.NEXT_PUBLIC_KESTREL_WORKER_URL}/adduserdata`,
        {
            headers: {"Content-TYpe": 'application/json'},
            method: 'POST',
            body: JSON.stringify({
                jwt: supabase.auth.session()?.access_token,
                userid: supabase.auth.session()?.user?.id,
                appid: process.env.NEXT_PUBLIC_KESTREL_APPID,
                data: newData
            })
        }
    )
}

export async function uploadFile(path: string, filedata: ArrayBuffer) {
    const filedata_b64 = toBase64(filedata)
    await fetch(
        `${process.env.NEXT_PUBLIC_KESTREL_WORKER_URL}/uploadfile`,
        {
            headers: {'Content-Type': 'application/json'},
            method: 'POST',
            body: JSON.stringify({
                jwt: supabase.auth.session()?.access_token,
                userid: supabase.auth.session()?.user?.id,
                appid: process.env.NEXT_PUBLIC_KESTREL_APPID,
                path: path,
                filedata_b64: filedata_b64
            })
        }
    )
}

export async function retrieveFile(path: string): Promise<ArrayBuffer> {
    const response = await fetch(
        `${process.env.NEXT_PUBLIC_KESTREL_WORKER_URL}/getfile`,
        {
            headers: { "Content-Type": "application/json" },
            method: "POST",
            body: JSON.stringify({
                jwt: supabase.auth.session()?.access_token,
                userid: supabase.auth.user()?.id,
                appid: process.env.NEXT_PUBLIC_KESTREL_APPID,
                path: path,
            }),
        }
    )
    return await response.arrayBuffer()
}