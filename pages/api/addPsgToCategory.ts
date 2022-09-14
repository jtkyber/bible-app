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
        const { username, selectedPsgs, catName } = req.body
        await connectMongo()
        
        const data = await User.findOne({ username: username }).select('categories')
        const cats = data.categories

        for (let i = 0; i < cats.length; i++) {
            if (cats[i].name == catName) {
                for (const psg of selectedPsgs) {
                    await User.updateOne(
                        { username: username }, 
                        { $push: { [`categories.${i}.passageIDs`]: psg.id } },
                        { new: true }
                    )
                }
            }
        }

        const user = await User.findOne({ username: username })
        if (user?._id) res.json(user)
        else throw new Error('Could not add passage')
    } catch(err) {
        res.status(400).end(err)
        console.log(err)
    }
}