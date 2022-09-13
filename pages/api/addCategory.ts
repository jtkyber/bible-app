import type { NextApiRequest, NextApiResponse } from 'next'
import connectMongo from '../../utils/connectDB'
import User, { ICategories } from '../../models/userModel'

type Data = {
  name: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
  ) {
    try {
        const { username, name } = req.body;
        await connectMongo();

        const newCat: ICategories = {
            name: name
        }
        
        const user = await User.findOneAndUpdate(
            { username: username }, 
            { $push: { categories: newCat }},
            { new: true }
        )

        if (user?._id) res.json(user)
        else throw new Error('Could not add passage')
    } catch(err) {
        res.status(400).end(err)
        console.log(err)
    }
}