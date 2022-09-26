import { decrementIndex, incrementIndex } from '../redux/flashCardSlice'
import { useAppDispatch, useAppSelector } from '../redux/hooks'
import flashCardStyles from '../styles/flashCards/FlashCards.module.scss'

const FlashCards: React.FC = () => {
    const flashCards = useAppSelector(state => state.flashCards)
    const dispatch = useAppDispatch()
    const halfFlipTime = 800
    const flipTimingFirstHalf = 'cubic-bezier(.5,0,1,1)'
    const flipTimingSecondHalf = 'cubic-bezier(0,0,.5,1)'

    // const flipTimingFirstHalf = 'ease-in'
    // const flipTimingSecondHalf = 'ease-out'

    const flipCard = (e) => {
        const psgReference = e.target.childNodes[0]
        const psgContent = e.target.childNodes[1]
        
        if (psgReference.getBoundingClientRect().width < psgContent.getBoundingClientRect().width) {
            psgContent.style.setProperty('transition', `transform ${halfFlipTime}ms ${flipTimingFirstHalf}`);
            psgReference.style.setProperty('transition', `transform ${halfFlipTime}ms ${flipTimingSecondHalf}`);

            psgContent.style.setProperty('transform', 'rotateY(90deg)');
            setTimeout(() => {
                psgReference.style.setProperty('transform', 'rotateY(0deg)');
            }, halfFlipTime);
        } else if (psgContent.getBoundingClientRect().width < psgReference.getBoundingClientRect().width) {
            psgReference.style.setProperty('transition', `transform ${halfFlipTime}ms ${flipTimingFirstHalf}`);
            psgContent.style.setProperty('transition', `transform ${halfFlipTime}ms ${flipTimingSecondHalf}`);

            psgReference.style.setProperty('transform', 'rotateY(-90deg)');
            setTimeout(() => {
                psgContent.style.setProperty('transform', 'rotateY(0deg)');
            }, halfFlipTime);
        }
    }

    const changeCard = (dir) => {
        const psgReference: (HTMLElement | null) = document.querySelector(`.${flashCardStyles.psgRef}`)
        const psgContent: (HTMLElement | null) = document.querySelector(`.${flashCardStyles.psgContent}`)

        if (psgReference?.getBoundingClientRect().width === 0) {
            psgContent?.style.setProperty('transition', `transform ${halfFlipTime}ms ${flipTimingFirstHalf}`);
            psgReference.style.setProperty('transition', `transform ${halfFlipTime}ms ${flipTimingSecondHalf}`);

            psgContent?.style.setProperty('transform', 'rotateY(90deg)');
            setTimeout(() => {
                psgReference?.style.setProperty('transform', 'rotateY(0deg)');

                if (dir === 'left') {
                    dispatch(decrementIndex())
                } else {
                    dispatch(incrementIndex())
                }
            }, halfFlipTime);
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