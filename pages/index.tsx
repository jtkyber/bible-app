import axios from 'axios'
import type { NextPage } from 'next'
import { useEffect, useRef } from 'react'
import { IUserState, setUser } from '../redux/userSlice'
import { initialState as initialCatState, setPassagesNotInCat, setSelectedCat, setSelectedCatPassages } from '../redux/categoriesSlice'
import { useAppDispatch, useAppSelector } from '../redux/hooks'
import Passage from '../components/Passage'
import CatNav from '../components/CatNav'
import FlashCards from '../components/FlashCards'
import homeStyles from '../styles/home/Home.module.scss'
import { disableFlashCardMode } from '../redux/flashCardSlice'

const Home: NextPage = () => {
  const user = useAppSelector(state => state.user)
  const categories = useAppSelector(state => state.categories)
  const flashCards = useAppSelector(state => state.flashCards)
  const addCatBtnRef: React.MutableRefObject<any> = useRef(null)
  const dispatch = useAppDispatch()

  useEffect(() => {
    const passagesNotInCat = user.passages.filter(psg => {
      for (const catPsg of categories.selectedCatPassages) {
        if (catPsg.id == psg.id) return false
      }
      return true
    })
    
    dispatch(setPassagesNotInCat(passagesNotInCat))
  }, [categories.selectedCatPassages])

  //-----Fetch passages-----
  const fetchPassages = async (e) => {
    try {
      if (categories.addingPassage) return
      dispatch(disableFlashCardMode())
      const catName = e.target?.innerText
      let catObject: any = {}
      
      for (const cat of user.categories) {
        if (cat.name == catName) {
          catObject = cat
          break
        }
      }
      
      if (!catObject?._id) return
      dispatch(setSelectedCat(catObject))

      const queryParams = `username=${user.username}&catName=${catName}`
      const res = await axios.get(`/api/getPassages?${queryParams}`)

      if (res?.data?.[0]?._id) {
        dispatch(setSelectedCatPassages(res.data))
      } else dispatch(setSelectedCatPassages([]))
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

  const handleAllPsgClick = () => {
    if (categories.addingPassage) return
    dispatch(setSelectedCatPassages([]))
    dispatch(setSelectedCat(initialCatState.selectedCat))
  }
  
  return (
    <div className={homeStyles.container}>
      <div className={homeStyles.categories}>
        <button onClick={handleAllPsgClick} className={homeStyles.categoryBtn}>All Passages</button>
        {
          user?.categories.map((cat, i) => <button onClick={fetchPassages} key={i} className={homeStyles.categoryBtn}>{cat.name}</button>)
        }
        <div className={homeStyles.addCatContainer}>
          <input ref={addCatBtnRef} type='text' placeholder='Enter Category Name' className={homeStyles.addCatInput}></input>
          <button onClick={createCategory} className={homeStyles.addCatBtn}>+</button>
        </div>
      </div>
      
      <div className={homeStyles.passageContainer}>
        <div className={homeStyles.passagesHeader}>
          <CatNav />
          <h1 className={homeStyles.selectedPsgName}>{categories.selectedCat.name || 'All Passages'}</h1>
        </div>

        {
          !flashCards.inFlashCardMode
          ?
            <div className={homeStyles.passages}>
              {
                categories.addingPassage 
                ?
                  categories.passagesNotInCat.map((psg, i) => <Passage key={i} passage={psg}/>)
                :
                  categories.selectedCat.name.length 
                  ? categories.selectedCatPassages.map((psg, i) => <Passage key={i} passage={psg}/>)
                  : user?.passages.map((psg, i) => <Passage key={i} passage={psg}/>)
              }
            </div>
          : <FlashCards/>
        }
      </div>
    </div>
  )
}

export default Home
