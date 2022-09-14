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
        const { username, catName } = req.query
        await connectMongo()
        
        const user = await User.findOne({ username: username })
        let selectedCatPsgIDs: any[] = []
        
         for (const cat of user.categories) {
            if (cat.name == catName) {
                selectedCatPsgIDs = cat.passageIDs
                break
            }
        }

        const newPsgList = user.passages.filter(psg => {
            if (selectedCatPsgIDs.includes(psg.id)) return true
            return false
        })

        res.json(newPsgList)
    } catch(err) {
        res.status(400).end(err)
        console.log(err)
    }
}