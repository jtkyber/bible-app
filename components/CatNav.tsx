import React, { useEffect, useRef } from 'react';
import homeStyles from '../styles/home/Home.module.scss'
import { useAppDispatch, useAppSelector } from '../redux/hooks'
import { IUserState, setUser } from '../redux/userSlice'
import { initialState as initialCatState, ICat, setAddingPassage, setSelectedCat, setSelectedCatPassages } from '../redux/categoriesSlice'
import { toggleInFlashCardMode, setShuffledCatPassages, IFlash } from '../redux/flashCardSlice'
import { IPassages } from '../models/userModel'
import axios from 'axios';

const CatNav: React.FC = () => {
    const user: IUserState = useAppSelector(state => state.user)
    const categories: ICat = useAppSelector(state => state.categories)
    const flashCards: IFlash = useAppSelector(state => state.flashCards)
    const dispatch = useAppDispatch()
    const confirmationRef = useRef<HTMLDivElement>(null)
    const catDeleteBtnRef = useRef<HTMLButtonElement>(null)
    const cancelBtnRef = useRef<HTMLButtonElement>(null)

    useEffect(() =>{
        document.addEventListener('click', hideConfirmation)

        return () => {
            document.removeEventListener('click', hideConfirmation)
        }
    }, [])

    const addPassagesToCategory = async (selectedPsgs: IPassages[]): Promise<void> => {
        const res = await axios.post('/api/addPsgToCategory', {
            username: user.username,
            selectedPsgs: selectedPsgs,
            catName: categories.selectedCat.name
        })

        if (res.data._id) {
            dispatch(setUser(res.data))
            dispatch(setAddingPassage(false))

            const queryParams: string = `username=${user.username}&catName=${categories.selectedCat.name}`
            const res2 = await axios.get(`/api/getPassages?${queryParams}`)

            if (res2?.data?.[0]?._id) {
            dispatch(setSelectedCatPassages(res2.data))
            } else dispatch(setSelectedCatPassages([]))
        }
    }

    const handleAddPsgClick = (): void => {
        if (categories.addingPassage) {
            const inputs = document.querySelectorAll(`.${homeStyles.passage} > input`)
            const selectedPsgsTemp: IPassages[] = []
            
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

    const shufflePassages = (): void => {
        if (!categories.selectedCatPassages.length) return

        let shuffledArray: IPassages[] = [...categories.selectedCatPassages]

        for (let i = shuffledArray.length -  1; i > 0; i--) {
            const j: number = Math.floor(Math.random() * (i + 1))
            const temp: IPassages = shuffledArray[i]
            shuffledArray[i] = shuffledArray[j]
            shuffledArray[j] = temp
        }

        dispatch(setShuffledCatPassages(shuffledArray))
        dispatch(toggleInFlashCardMode())
    }

    const deleteCategory = async (): Promise<void> => {
        const res = await axios.put('/api/deleteCategory', {
            userID: user._id,
            catID: categories.selectedCat._id
        })

        if (res.data._id) {
            if (confirmationRef.current) confirmationRef.current.style.display = 'none'
            dispatch(setUser(res.data))
            dispatch(setSelectedCat(initialCatState.selectedCat))
        }
    }

    const showConfirmation = (): void => {
        if (confirmationRef.current) {
            confirmationRef.current.style.display = 'flex'
        }
    }
    
    const hideConfirmation = (e): void => {
        if (!confirmationRef.current) return
        if (e.target === cancelBtnRef.current || (!confirmationRef.current.contains(e.target) && e.target !== catDeleteBtnRef.current)) {
            confirmationRef.current.style.display = 'none'
        }
    }
      
    return (
        <div className={homeStyles.optionContainer}>
        {
            categories.selectedCat.name.length 
            ? 
            <>
                {
                    !flashCards.inFlashCardMode && !categories.addingPassage ? 
                        <>
                            <button onClick={ handleAddPsgClick }>Add Passages</button>  
                            <button onClick={ shufflePassages }>Flash Cards</button>
                            <button ref={catDeleteBtnRef} className={homeStyles.catDeleteBtn} onClick={showConfirmation}>Delete</button>
                        </>
                        : flashCards.inFlashCardMode ? 
                            <button onClick={shufflePassages}>Back</button>
                            : categories.addingPassage ?
                                <button onClick={ handleAddPsgClick }>Save</button>  
                                : null

                }
            </>
            : null

        }
            <div ref={confirmationRef} className={homeStyles.deleteCatConfirmationContainer}>
                <div className={homeStyles.deleteCatConfirmationWindow}>
                    <h5>Are you sure you want to delete <span>{categories.selectedCat.name}</span>?</h5>
                    <button onClick={deleteCategory} className={homeStyles.confirmDeleteCatBtn}>Delete</button>
                    <button ref={cancelBtnRef} className={homeStyles.cancelDeleteCatBtn}>Cancel</button>
                </div>
            </div>
        </div>
    )
}

export default CatNav