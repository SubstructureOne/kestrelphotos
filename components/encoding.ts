export function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(<string>reader.result);
        reader.onerror = error => reject(error);
    })
}

export function toBase64(buffer: ArrayBuffer) {
    return Buffer.from(buffer).toString('base64')
}

export function fromBase64(file_b64: string): ArrayBuffer {
    return Buffer.from(file_b64, 'base64')
}
