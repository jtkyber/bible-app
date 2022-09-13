import type { NextApiRequest, NextApiResponse } from 'next'
import connectMongo from '../../utils/connectDB'
import User from '../../models/userModel'
import bcrypt from 'bcrypt'

type Data = {
  name: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
  ) {
    try {
        const { username, password, language, version } = req.body;
        await connectMongo();
        bcrypt.genSalt(10, (_err, salt): void => {
            bcrypt.hash(password, salt, async (_err, hash) => {
                User.create({
                  "username": username, 
                  "password": hash,
                  "language": language,
                  "bibleVersion": version
                }, (error, newUser) => {
                    if (newUser?._id) {
                        res.json(newUser)
                    } else {
                        if (error.code === 11000) {
                            throw new Error('Username already exists')
                        } else {
                            throw new Error(error)
                        }
                    }
                });
            })
        })
    } catch(err) {
        console.log(err)
        res.status(400).end(err)
    }
}