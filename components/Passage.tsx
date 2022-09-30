import axios from 'axios';
import { useDispatch } from 'react-redux';
import { ICat } from '../redux/categoriesSlice';
import { useAppSelector } from '../redux/hooks';
import { IPassageState, IUserState, setUser } from '../redux/userSlice';
import homeStyles from '../styles/home/Home.module.scss'
import OptionsDots from './OptionsDots';

const Passage = ({ passage, fetchPassages }: { passage: IPassageState, fetchPassages: (catName: any) => Promise<void> }) => {
    const categories: ICat = useAppSelector(state => state.categories)
    const user: IUserState = useAppSelector(state => state.user)
    const dispatch = useDispatch()

    const deletePassage = async (): Promise<void> => {
        const res = await axios.put('/api/deletePassage', {
            userID: user._id,
            psgID: passage._id
        })
        
        if (res.data._id) {
            dispatch(setUser(res.data))
            fetchPassages(categories.selectedCat.name)
        }
    }

    const removePsgFromCat = async (): Promise<void> => {
        const res = await axios.put('/api/removePsgFromCat', {
            userID: user._id,
            catID: categories.selectedCat._id,
            psgID: passage.id
        })
        
        if (res.data._id) {
            dispatch(setUser(res.data))
            fetchPassages(categories.selectedCat.name)
        }
    }
    
    return (
        <div className={`${ homeStyles.passage } ${ categories.addingPassage ? homeStyles.addingPassage : null }`}>
            {
                categories.addingPassage
                ?
                <>
                    <input id={passage.id} type='checkbox'></input>
                    <label htmlFor={passage.id}>
                        <h4>{passage.reference}</h4>
                        <div dangerouslySetInnerHTML={{__html: passage.content}} className={homeStyles.content}></div> 
                    </label>
                </>
                :
                <>
                    <h4>{passage.reference}</h4>
                    <div dangerouslySetInnerHTML={{__html: passage.content}} className={homeStyles.content}></div> 
                </>
            }
            <div className={homeStyles.psgOptionsContainer}>
                <OptionsDots />
                <div className={homeStyles.psgOptions}>
                    {
                        categories.selectedCat.name.length
                        ? <button onClick={removePsgFromCat} className={`${homeStyles.optionsBtn} ${homeStyles.removeFromCatBtn}`}>Remove From Category</button>
                        : null
                    }
                    <button onClick={deletePassage} className={`${homeStyles.optionsBtn} ${homeStyles.deletePsgBtn}`}>Delete Passage</button>
                </div>
            </div>
        </div>
    )
}

export default Passage;