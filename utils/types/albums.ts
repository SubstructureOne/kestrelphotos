export type Album = {
    albumId: string
    albumName: string
    coverPath: string
    iv_b64: string
}

export type UserData<T> = {
    udataid: number
    data: KPhotoData<T>
}

export type KPhotoData<T> = {
    dataType: string
    value: T
}

export type AlbumImage = {
    imageId: string
    albumId: string
    photoPath: string
    iv_b64: string
}
