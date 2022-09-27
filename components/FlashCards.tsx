import { useRef } from 'react'
import { decrementIndex, incrementIndex } from '../redux/flashCardSlice'
import { useAppDispatch, useAppSelector } from '../redux/hooks'
import flashCardStyles from '../styles/flashCards/FlashCards.module.scss'

const FlashCards: React.FC = () => {
    const flashCards = useAppSelector(state => state.flashCards)
    const dispatch = useAppDispatch()
    const flipTime = 500
    const flipTiming = 'ease-in-out'
    const cardRef = useRef<HTMLDivElement>(null)
    const psgReferenceRef = useRef<HTMLHeadingElement>(null)
    const psgContentRef = useRef<HTMLDivElement>(null)

    const flipCard = () => {
        if (!(cardRef.current && psgReferenceRef.current && psgContentRef.current)) return

        const psgRefStyle = getComputedStyle(psgReferenceRef.current)
        const psgContentStyle = getComputedStyle(psgContentRef.current)

        cardRef.current.style.setProperty('transition', `transform ${flipTime}ms ${flipTiming}`)

        if (psgRefStyle.display === 'none') {
            cardRef.current.style.setProperty('transform', 'rotateX(2deg) rotateY(180deg)')
            setTimeout(() => {
                if (psgReferenceRef.current && psgContentRef.current) {
                    psgReferenceRef.current.style.setProperty('display', 'flex')
                    psgContentRef.current.style.setProperty('display', 'none')
                }
            }, flipTime / 2)
        } else if (psgContentStyle.display === 'none') {
            cardRef.current.style.setProperty('transform', 'rotateX(2deg) rotateY(0deg)')
            setTimeout(() => {
                if (psgReferenceRef.current && psgContentRef.current) {
                    psgContentRef.current.style.setProperty('display', 'flex')
                    psgReferenceRef.current.style.setProperty('display', 'none')
                }
            }, flipTime / 2)
        }
    }

    const changeCard = (dir) => {
        if (!(cardRef.current && psgReferenceRef.current && psgContentRef.current)) return

        const psgRefStyle = getComputedStyle(psgReferenceRef.current)

        if (psgRefStyle.display === 'none') {
            cardRef.current.style.setProperty('transform', 'rotateX(3deg) rotateY(180deg)')
            setTimeout(() => {
                if (psgReferenceRef.current && psgContentRef.current) {
                    psgReferenceRef.current.style.setProperty('display', 'flex')
                    psgContentRef.current.style.setProperty('display', 'none')

                    if (dir === 'left') {
                        dispatch(decrementIndex())
                    } else {
                        dispatch(incrementIndex())
                    }
                }
            }, flipTime / 2)
        } else {
            if (dir === 'left') {
                dispatch(decrementIndex())
            } else {
                dispatch(incrementIndex())
            }
        }
    }

    return (
        <div className={flashCardStyles.flashCardSection}>
            <button onClick={() => changeCard('left')} className={`${flashCardStyles.arrow} ${flashCardStyles.left}`}>{'<'}</button>
            <div ref={cardRef} onClick={flipCard} className={flashCardStyles.flashCard}>
                <h3 ref={psgReferenceRef} className={flashCardStyles.psgRef}>{ flashCards?.shuffledCatPassages[flashCards.index].reference }</h3>
                <div ref={psgContentRef} className={flashCardStyles.psgContent} dangerouslySetInnerHTML={{__html: flashCards?.shuffledCatPassages[flashCards.index].content}}></div>
            </div>
            <button onClick={() => changeCard('right')} className={`${flashCardStyles.arrow} ${flashCardStyles.right}`}>{'>'}</button>
        </div>
    )
}

export default FlashCards;