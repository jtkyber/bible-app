import { decrementIndex, incrementIndex } from '../redux/flashCardSlice'
import { useAppDispatch, useAppSelector } from '../redux/hooks'
import flashCardStyles from '../styles/flashCards/FlashCards.module.scss'

const FlashCards: React.FC = () => {
    const flashCards = useAppSelector(state => state.flashCards)
    const dispatch = useAppDispatch()

    const flipCard = (e) => {
        const psgReference = e.target.childNodes[0]
        const psgContent = e.target.childNodes[1]
        
        if (psgReference.getBoundingClientRect().width === 0) {
            psgContent.style.setProperty('transform', 'rotateY(90deg)');
            setTimeout(() => {
                psgReference.style.setProperty('transform', 'rotateY(0deg)');
            }, 150);
        } else if (psgContent.getBoundingClientRect().width === 0) {
            psgReference.style.setProperty('transform', 'rotateY(-90deg)');
            setTimeout(() => {
                psgContent.style.setProperty('transform', 'rotateY(0deg)');
            }, 150);
        }
    }

    const changeCard = (dir) => {
        const psgReference: (HTMLElement | null) = document.querySelector(`.${flashCardStyles.psgRef}`)
        const psgContent: (HTMLElement | null) = document.querySelector(`.${flashCardStyles.psgContent}`)

        if (psgReference?.getBoundingClientRect().width === 0) {
            psgContent?.style.setProperty('transform', 'rotateY(90deg)');
            setTimeout(() => {
                psgReference?.style.setProperty('transform', 'rotateY(0deg)');
                if (dir === 'left') {
                    dispatch(decrementIndex())
                } else {
                    dispatch(incrementIndex())
                }
            }, 150);
        } else {
            if (dir === 'left') {
                dispatch(decrementIndex())
            } else {
                dispatch(incrementIndex())
            }
        }

    }

    return (
        <>
        <div className={flashCardStyles.flashCardSection}>
            <button onClick={() => changeCard('left')} className={`${flashCardStyles.arrow} ${flashCardStyles.left}`}>{'<'}</button>
            <div onClick={flipCard} className={flashCardStyles.flashCard}>
                <h3 className={flashCardStyles.psgRef}>{ flashCards?.shuffledCatPassages[flashCards.index].reference }</h3>
                <div className={flashCardStyles.psgContent} dangerouslySetInnerHTML={{__html: flashCards?.shuffledCatPassages[flashCards.index].content}}></div>
            </div>
            <button onClick={() => changeCard('right')} className={`${flashCardStyles.arrow} ${flashCardStyles.right}`}>{'>'}</button>
        </div>
        </>
    )
}

export default FlashCards;