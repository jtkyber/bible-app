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
        const { username, password } = req.body;
        await connectMongo();
        
        const user = await User.findOne({ username: username })
        if (!user) throw new Error('Could not find user')
        else {
            const pwMatch = await bcrypt.compare(password, user.password);
            if (pwMatch) {
                res.json(user)
            } else throw new Error('Incorrect password')
        }
    } catch(err) {
        console.log(err)
        res.status(400).end(err)
    }
}