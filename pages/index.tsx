import axios from 'axios'
import type { NextPage } from 'next'
import { useEffect, useRef } from 'react'
import { IUserState, setUser } from '../redux/userSlice'
import { initialState as initialCatState ,setAddingPassage, setPassagesNotInCat, setSelectedCat, setSelectedCatPassages } from '../redux/categoriesSlice'
import { useAppDispatch, useAppSelector } from '../redux/hooks'
import Passage from '../components/Passage'
import homeStyles from '../styles/home/Home.module.scss'
import { IPassages } from '../models/userModel'

const Home: NextPage = () => {
  const user = useAppSelector(state => state.user)
  const categories = useAppSelector(state => state.categories)
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
  
  const addPassagesToCategory = async (selectedPsgs) => {
    const res = await axios.post('/api/addPsgToCategory', {
      username: user.username,
      selectedPsgs: selectedPsgs,
      catName: categories.selectedCat.name
    })

    if (res.data._id) {
      dispatch(setUser(res.data))
      dispatch(setAddingPassage(false))

      const queryParams = `username=${user.username}&catName=${categories.selectedCat.name}`
      const res2 = await axios.get(`/api/getPassages?${queryParams}`)

      if (res2?.data?.[0]?._id) {
        dispatch(setSelectedCatPassages(res2.data))
      } else dispatch(setSelectedCatPassages([]))
    }
  }

  const handleAddPsgClick = () => {
    if (categories.addingPassage) {
      const inputs = document.querySelectorAll(`.${homeStyles.passage} > input`)
      const selectedPsgsTemp: (IPassages | any[]) = []
      
      for (let i = 0; i < inputs.length; i++) {
        const input = inputs[i] as HTMLInputElement  | null
        if (input?.checked) {
          for (const psg of categories.passagesNotInCat) {
            if (input.id == psg.id) {
              selectedPsgsTemp.push(psg)
            }
          }
        }
      }

      addPassagesToCategory(selectedPsgsTemp)

    } else dispatch(setAddingPassage(true))
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
      
      <div className={homeStyles.passages}>
        <div className={homeStyles.passagesHeader}>
          <div className={homeStyles.optionContainer}>
          {
            categories.selectedCat.name.length ? <button onClick={handleAddPsgClick}>{ !categories.addingPassage ? 'Add Passages' : 'Save' }</button> : null
          }
          </div>
          <h1 className={homeStyles.selectedPsgName}>{categories.selectedCat.name || 'All Passages'}</h1>
        </div>

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
    </div>
  )
}

export default Home
