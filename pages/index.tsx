import axios from 'axios'
import type { NextPage } from 'next'
import { useEffect, useRef } from 'react'
import { IPassageState, IUserState, setUser } from '../redux/userSlice'
import { ICat, initialState as initialCatState, setPassagesNotInCat, setSelectedCat, setSelectedCatPassages } from '../redux/categoriesSlice'
import { useAppDispatch, useAppSelector } from '../redux/hooks'
import Passage from '../components/Passage'
import CatNav from '../components/CatNav'
import FlashCards from '../components/FlashCards'
import homeStyles from '../styles/home/Home.module.scss'
import { disableFlashCardMode, IFlash } from '../redux/flashCardSlice'

const Home: NextPage = () => {
  const user: IUserState = useAppSelector(state => state.user)
  const categories: ICat = useAppSelector(state => state.categories)
  const flashCards: IFlash = useAppSelector(state => state.flashCards)
  const addCatBtnRef: React.MutableRefObject<any> = useRef(null)
  const dispatch = useAppDispatch()

  useEffect(() => {
    const passagesNotInCat: IPassageState[] = user.passages.filter(psg => {
      for (const catPsg of categories.selectedCatPassages) {
        if (catPsg.id == psg.id) return false
      }
      return true
    })
    
    dispatch(setPassagesNotInCat(passagesNotInCat))
  }, [categories.selectedCatPassages])

  //-----Fetch passages-----
  const fetchPassages = async (catName) => {
    try {
      if (categories.addingPassage) return
      dispatch(disableFlashCardMode())
      let catObject: any = {}
      
      for (const cat of user.categories) {
        if (cat.name == catName) {
          catObject = cat
          break
        }
      }
      
      if (!catObject?._id) return
      dispatch(setSelectedCat(catObject))

      const queryParams: string = `username=${user.username}&catName=${catName}`
      const res = await axios.get(`/api/getPassages?${queryParams}`)

      if (res?.data?.[0]?._id) {
        dispatch(setSelectedCatPassages(res.data))
      } else dispatch(setSelectedCatPassages([]))

      hideCategories()
    } catch (err) {
      console.log(err)
    }
  }

  const createCategory = async (): Promise<void> => {
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
      } finally {
        input.value = ''
      }
    }
  }

  const handleAllPsgClick = (): void => {
    if (categories.addingPassage) return
    dispatch(disableFlashCardMode())
    dispatch(setSelectedCatPassages([]))
    dispatch(setSelectedCat(initialCatState.selectedCat))
    hideCategories()
  }

  const toggleCategories = (): void => {
    const catList = document.querySelector(`.${homeStyles.categories}`)
    catList?.classList.toggle(homeStyles.show)
  }

  const hideCategories = (): void => {
    const catList = document.querySelector(`.${homeStyles.categories}`)
    catList?.classList.remove(homeStyles.show)
  }
  
  return (
    <div className={homeStyles.container}>
      <div className={homeStyles.categories}>
        <button onClick={handleAllPsgClick} className={homeStyles.categoryBtn}>All Passages</button>
        {
          user?.categories.map((cat, i) => <button onClick={() => fetchPassages(cat.name)} key={i} className={homeStyles.categoryBtn}>{cat.name}</button>)
        }
        <div className={homeStyles.addCatContainer}>
          <input ref={addCatBtnRef} type='text' placeholder='Enter Category Name' className={homeStyles.addCatInput}></input>
          <button onClick={createCategory} className={homeStyles.addCatBtn}>+</button>
        </div>
      </div>
      
      <div className={homeStyles.passageContainer}>
        { !categories.addingPassage ? <button onClick={toggleCategories} className={homeStyles.catDropdownBtn}>Categories</button> : null }
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
                  categories.passagesNotInCat.map((psg, i) => <Passage key={i} passage={psg} fetchPassages={fetchPassages} />)
                :
                  categories.selectedCat.name.length 
                  ? categories.selectedCatPassages.map((psg, i) => <Passage key={i} passage={psg} fetchPassages={fetchPassages} />)
                  : user?.passages.map((psg, i) => <Passage key={i} passage={psg} fetchPassages={fetchPassages} />)
              }
            </div>
          : <FlashCards/>
        }
      </div>
    </div>
  )
}

export default Home
