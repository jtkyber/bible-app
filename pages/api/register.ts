// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
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
        bcrypt.genSalt(10, (err, salt): void => {
            bcrypt.hash(password, salt, async (err, hash) => {
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
                            res.status(400).end('Username already exists')
                        } else res.status(400).end('Unable to add user')
                    }
                });
            })
        })
    } catch(err) {
        console.log(err)
        res.status(400).end(err)
    }
}