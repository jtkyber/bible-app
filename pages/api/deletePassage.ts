import type { NextApiRequest, NextApiResponse } from 'next'
import connectMongo from '../../utils/connectDB'
import User from '../../models/userModel'
import { ICatState, IPassageState } from '../../redux/userSlice'

type Data = {
  name: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
  ) {
    try {
        const { userID, psgID } = req.body
        await connectMongo()
        
       const user = await User.findById(userID)

       const deleteFromCategories = (id) => {
        const userCats: ICatState[] = user.categories
        for (let i = 0; i < userCats.length; i++) {
            const psgIds = userCats[i].passageIDs
            if (!psgIds) continue
            loop2:
            for (let j = 0; j < psgIds.length; j++) {
                if (psgIds[j] == id) {
                    psgIds.splice(j, 1)
                    break loop2
                }
            }
        }
       }
       
        if (user?.passages) {
            const userPsgs: IPassageState[] = user.passages
            for (let i = 0; i < userPsgs.length; i++) {
                if (userPsgs[i]._id == psgID) {
                    deleteFromCategories(userPsgs[i].id)
                    userPsgs.splice(i, 1)
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