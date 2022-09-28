import React from 'react';
import { useRouter } from 'next/router'
import { useAppDispatch, useAppSelector } from '../redux/hooks'
import Link from 'next/link';
import navStyles from '../styles/nav/Nav.module.scss'
import { clearUser, IUserState } from '../redux/userSlice';
import { clearBible } from '../redux/bibleSlice';
import { disableFlashCardMode } from '../redux/flashCardSlice';
import { initialState as initialCatState, setAddingPassage, setSelectedCat, setSelectedCatPassages } from '../redux/categoriesSlice';

const NavBar: React.FC = () => {
    const user: IUserState = useAppSelector(state => state.user)
    const router = useRouter()
    const dispatch = useAppDispatch()

    const logOut = (): void => {
        localStorage.setItem('user', '')
        dispatch(clearUser())
        dispatch(clearBible())
    }

    const goHome = (): void => {
        router.push('/')
        dispatch(disableFlashCardMode())
        dispatch(setAddingPassage(false))
        dispatch(setSelectedCatPassages([]))
        dispatch(setSelectedCat(initialCatState.selectedCat))
    }

    return (
        <div className={navStyles.container}>
            <div className={navStyles.left}>
                <h1 onClick={goHome}>Bible App</h1>
            </div>
            <div className={navStyles.mid}>

            </div>
            <div className={navStyles.right}>
                {
                    !user?._id?.length 
                    ?
                        router.pathname === '/login'
                        ? <Link href='/register'><a>Register</a></Link>
                        : <Link href='/login'><a>Log In</a></Link>
                    : router.pathname === '/'
                    ?
                    <>
                        <Link href='/bible'><a className={navStyles.findPsgBtn}>Find Passage</a></Link>
                        <Link href='/'><a>Settings</a></Link>
                        <a onClick={logOut}>Log Out</a>
                    </>
                    : router.pathname === '/bible'
                    ? 
                    <>
                        <Link href='/'><a>Back</a></Link>
                        <Link href='/'><a>Settings</a></Link>
                        <a onClick={logOut}>Log Out</a>
                    </>
                    : null

                }
            </div>
        </div>
    );
};

export default NavBar;