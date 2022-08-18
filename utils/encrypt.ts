import Dexie, { Table } from 'dexie'

export type KeysEntry = {
    name: string,
    key: CryptoKey
}

export type EncryptedData = {
    data: ArrayBuffer,
    iv: ArrayBuffer,
}

export class KeysDexie extends Dexie {
    keys!: Table<KeysEntry>;

    constructor() {
        super('kestrelphotos')
        this.version(1).stores({
            keys: '&name'
        })
    }
}

export const db = new KeysDexie();

export async function getPrivKey(name: string): Promise<CryptoKey> {
    const results = await db.keys.where('name').equals(name).first()
    if (results === undefined) {
        console.log("Private key not found; generating")
        const key = await generatePrivKey()
        db.keys.add({name, key})
        return key
    } else {
        console.log("Found key; returning")
        return results.key
    }
}

export async function generatePrivKey(): Promise<CryptoKey> {
    return await window.crypto.subtle.generateKey(
        {
            name: "AES-GCM",
            length: 256
        },
        true,
        ["encrypt", "decrypt"]
    )
}

export async function encrypt(filedata: ArrayBuffer, key: CryptoKey): Promise<EncryptedData> {
    const iv = window.crypto.getRandomValues(new Uint8Array(16));
    const data = await window.crypto.subtle.encrypt(
        {
            name: "AES-GCM",
            iv: iv
        },
        key,
        filedata
    )
    return {data, iv}
}

export async function decrypt(encrypted: EncryptedData, key: CryptoKey): Promise<ArrayBuffer> {
    return await window.crypto.subtle.decrypt(
        {
            name: "AES-GCM",
            iv: encrypted.iv,
        },
        key,
        encrypted.data
    ).catch(e => console.error(`Error decrypting: ${e}`))
}
