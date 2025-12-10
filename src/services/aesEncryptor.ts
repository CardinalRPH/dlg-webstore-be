import crypto from 'crypto'
import processEnv from '../../env'

const key = crypto
    .createHash('sha512')
    .update(processEnv.ENCYRPTION_KEY)
    .digest('hex')
    .substring(0, 32)
const encryptionIV = crypto
    .createHash('sha512')
    .update(processEnv.ENCYRPTION_IV)
    .digest('hex')
    .substring(0, 16)

// encrypt data
export const encryptData = (data: string) => {
    const cipher = crypto.createCipheriv(processEnv.ENCYRPTION_METHOD, key, encryptionIV)
    return Buffer.from(
        cipher.update(data, 'utf8', 'hex') + cipher.final('hex')
    ).toString('base64') // Encrypts data and converts to hex and base64
}

// Decrypt data
export const decryptData = (encryptedData: string) => {
    const buff = Buffer.from(encryptedData, 'base64')
    const decipher = crypto.createDecipheriv(processEnv.ENCYRPTION_METHOD, key, encryptionIV)
    return (
        decipher.update(buff.toString('utf8'), 'hex', 'utf8') +
        decipher.final('utf8')
    )
}