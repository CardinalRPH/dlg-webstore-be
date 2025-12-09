import bcrypt from 'bcrypt'
import processEnv from '../../env'

export const hashPass = async (pass:string): Promise<string> => {
    const saltRound = processEnv.SALT_ROUND

    const hashedPass:string = await new Promise ((resolve, reject)=> {
        bcrypt.hash(pass, saltRound, (err, hashed)=> {
            if(err) {
                reject(err)
            }
            resolve(hashed)
        })
    })
    return hashedPass
}

export const comparePass = async (pass:string, hashedPasss:string): Promise<boolean> => {
    const comparerPass: boolean = await new Promise ((resolve, reject)=> {
        bcrypt.compare(pass, hashedPasss, (err, result)=> {
            if(err) {
                reject(err)
            }
            resolve(result)
        })
    })

    return comparerPass
}