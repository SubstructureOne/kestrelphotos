import {NextApiRequest, NextApiResponse} from "next";
import {JwtGenerator} from 'virgil-sdk'
import {initCrypto, VirgilCrypto, VirgilAccessTokenSigner} from 'virgil-crypto'

const VirgilJwt = async (req: NextApiRequest, res: NextApiResponse) => {
    await initCrypto()
    const virgilCrypto = new VirgilCrypto()
    const generator = new JwtGenerator({
        appId: process.env.KESTREL_E3_APP_ID ?? "",
        apiKeyId: process.env.KESTREL_E3_APP_KEY_ID ?? "",
        apiKey: virgilCrypto.importPrivateKey(process.env.KESTREL_E3_PRIVATE_APP_KEY ?? ""),
        accessTokenSigner: new VirgilAccessTokenSigner(virgilCrypto)
    })
    const token = generator.generateToken("abcd")
    res.status(200).json({token: token.toString()})
}

export default VirgilJwt
