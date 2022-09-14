import React from 'react';
import { IPassages } from '../models/userModel';
import { useAppSelector } from '../redux/hooks';
import homeStyles from '../styles/home/Home.module.scss'

const Passage = ({ passage }: { passage: IPassages }) => {
    const categories = useAppSelector(state => state.categories)
    
    return (
        <div className={`${ homeStyles.passage } ${ categories.addingPassage ? homeStyles.addingPassage : null }`}>
            {
                categories.addingPassage
                ?
                <>
                    <input id={passage.id} type='checkbox'></input>
                    <h4>{passage.reference}</h4>
                    <div dangerouslySetInnerHTML={{__html: passage.content}} className={homeStyles.content}></div> 
                </>
                :
                <>
                    <h4>{passage.reference}</h4>
                    <div dangerouslySetInnerHTML={{__html: passage.content}} className={homeStyles.content}></div> 
                </>
            }
        </div>
    );
};

export default Passage;