import type { NextApiRequest, NextApiResponse } from 'next'
import connectMongo from '../../utils/connectDB'
import User, { IPassages } from '../../models/userModel'

type Data = {
  name: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
  ) {
    try {
        const { username, content, psgID, reference } = req.body;
        await connectMongo();

        const newPsg: IPassages = {
            content: content,
            id: psgID,
            reference: reference,
            notes: ''
        }
        
        const user = await User.findOneAndUpdate(
            { username: username }, 
            { $push: { passages: newPsg }},
            { new: true }
        )

        if (user?._id) res.json(user)
        else throw new Error('Could not add passage')
    } catch(err) {
        res.status(400).end(err)
        console.log(err)
    }
}