import axios from 'axios'
import type { NextPage } from 'next'
import { useRef } from 'react'
import { setSelectedCatPassages } from '../redux/catPassageSlice'
import {  useAppDispatch, useAppSelector } from '../redux/hooks'
import { IUserState, setUser } from '../redux/userSlice'
import homeStyles from '../styles/home/Home.module.scss'

const Home: NextPage = () => {
  const user = useAppSelector(state => state.user)
  const selectedCatPassages = useAppSelector(state => state.catPassage.selectedCatPassages)
  const addCatBtnRef: React.MutableRefObject<any> = useRef(null)
  const dispatch = useAppDispatch()

   //-----Fetch passages-----
    const fetchPassages = async (e) => {
      try {
        const catName = e.target?.innerText
        const queryParams = `username=${user.username}&selectedCat=${catName}&categories=${JSON.stringify(user.categories)}`
        const res = await axios.get(`/api/getPassages?${queryParams}`)

        if (res.data?._id) {
          setSelectedCatPassages(res.data)
          console.log(res)
        }
      } catch (err) {
        console.log(err)
      }
    }

  const createCategory = async () => {
    const input = addCatBtnRef.current
    if (!input.classList.contains(homeStyles.show)) {
      input.classList.add(homeStyles.show)
    } else {
      try {
        if (input.value === '') {
          input.classList.remove(homeStyles.show)
          return
        }
        
        const res = await axios.post('/api/addCategory', {
          username: user.username,
          name: input.value
        })

        const UpdatedUser: IUserState = res.data
        
        if (UpdatedUser?._id) {
          input.classList.remove(homeStyles.show)
          dispatch(setUser(UpdatedUser))
        }
      } catch (err) {
        console.log(err)
      }
    }
  }

  return (
    <div className={homeStyles.container}>
      <div className={homeStyles.categories}>
        <button onClick={() => dispatch(setSelectedCatPassages([]))} className={homeStyles.categoryBtn}>All Passages</button>
        {
          user?.categories.map((cat, i) => (
            <button onClick={fetchPassages} key={i} className={homeStyles.categoryBtn}>{cat.name}</button>
          ))
        }
        <div className={homeStyles.addCatContainer}>
          <input ref={addCatBtnRef} type='text' placeholder='Enter Category Name' className={homeStyles.addCatInput}></input>
          <button onClick={createCategory} className={homeStyles.addCatBtn}>+</button>
        </div>
      </div>
      
      <div className={homeStyles.passages}>
        {
          selectedCatPassages.length 
          ?
            selectedCatPassages.map((psg, i) => (
              <div key={i} className={homeStyles.passage}>
                <h4>{psg.reference}</h4>
                <div dangerouslySetInnerHTML={{__html: psg.content}} className={homeStyles.content}></div> 
              </div>
            ))
          : 
              user?.passages.map((psg, i) => (
                <div key={i} className={homeStyles.passage}>
                  <h4>{psg.reference}</h4>
                  <div dangerouslySetInnerHTML={{__html: psg.content}} className={homeStyles.content}></div> 
                </div>
              ))
        }
      </div>
    </div>
  )
}

export default Home
