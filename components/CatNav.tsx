import React from 'react';
import homeStyles from '../styles/home/Home.module.scss'
import { useAppDispatch, useAppSelector } from '../redux/hooks'
import { setUser } from '../redux/userSlice'
import { setAddingPassage, setSelectedCatPassages } from '../redux/categoriesSlice'
import { toggleInFlashCardMode, setShuffledCatPassages } from '../redux/flashCardSlice'
import { IPassages } from '../models/userModel'
import axios from 'axios';

const CatNav: React.FC = () => {
    const user = useAppSelector(state => state.user)
    const categories = useAppSelector(state => state.categories)
    const flashCards = useAppSelector(state => state.flashCards)
    const dispatch = useAppDispatch()

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

    const shufflePassages = () => {
        if (!categories.selectedCatPassages.length) return

        let shuffledArray = [...categories.selectedCatPassages]

        for (let i = shuffledArray.length -  1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1))
            const temp = shuffledArray[i]
            shuffledArray[i] = shuffledArray[j]
            shuffledArray[j] = temp
        }

        dispatch(setShuffledCatPassages(shuffledArray))
        dispatch(toggleInFlashCardMode())
    }
      
    return (
        <div className={homeStyles.optionContainer}>
        {
            categories.selectedCat.name.length 
            ? 
            <>
                {
                    !flashCards.inFlashCardMode
                    ? <button onClick={ handleAddPsgClick }>{ !categories.addingPassage ? 'Add Passages' : 'Save' }</button>  
                    : null
                }
                {
                    !categories.addingPassage
                    ? 
                    <>
                        <button onClick={shufflePassages}>{ !flashCards.inFlashCardMode ? 'Flash Cards' : 'Back' }</button>
                    </>
                    : null
                }
            </>
            : null

        }
        </div>
    );
};

export default CatNav;