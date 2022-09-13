import type { NextApiRequest, NextApiResponse } from 'next'
import connectMongo from '../../utils/connectDB'
import User from '../../models/userModel'

type Data = {
  name: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
  ) {
    try {
        const { username, selectedCat, categories, allPassages = false } = req.query;
        await connectMongo();
        console.log(username)

        if (!allPassages && typeof categories === 'string') {
            const passageList: any = []

            for (const cat of JSON.parse(categories)) {
                if (cat.name === selectedCat) {
                    for (const id of cat.passageIDs) {
                        const passage = await User.findOne({ _id: id})
                        if (passage._id) passageList.push(passage)
                    }
                }
                break
            }

            if (passageList.length) {
                res.json(passageList)
            } else res.end(false)
        }
        
    } catch(err) {
        res.status(400).end(err)
        console.log(err)
    }
}