import type { NextApiRequest, NextApiResponse } from 'next'
import connectMongo from '../../utils/connectDB'
import User from '../../models/userModel'
import { ICatState } from '../../redux/userSlice'

type Data = {
  name: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
  ) {
    try {
        const { userID, catID, psgID } = req.body
        await connectMongo()
        
        const user = await User.findById(userID)
        
        const removePsgRef = (cat) => {
            const psgIds = cat.passageIDs
            if (!psgIds) return
            
            for (let i = 0; i < psgIds.length; i++) {
                if (psgIds[i] == psgID) {
                    psgIds.splice(i, 1)
                    break
                }
            }
        }
        
        if (user?.categories) {
            const userCats: ICatState[] = user.categories
            for (let i = 0; i < userCats.length; i++) {
                if (userCats[i]._id == catID) {
                    removePsgRef(userCats[i])
                    user.save()
                    res.json(user)
                    break
                }
            }
        }
    } catch(err) {
        res.status(400).end(err)
        console.log(err)
    }
}