import 'dotenv/config'
import bcript from 'bcrypt'

export class Password {
    static async toHash(password: string): Promise<string> {
        const saltRounds: number = parseInt(process.env.SALT as string)
        const salt = await bcript.genSalt(saltRounds)
        return await bcript.hash(password, salt)
    }

    static async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
        return await bcript.compare(password, hashedPassword)
    }
}