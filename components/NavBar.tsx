import React from 'react';
import { useRouter } from 'next/router'
import { useAppDispatch, useAppSelector } from '../redux/hooks'
import Link from 'next/link';
import navStyles from '../styles/nav/Nav.module.scss'
import { clearUser } from '../redux/userSlice';

const NavBar: React.FC = () => {
    const user = useAppSelector(state => state.user)
    const router = useRouter()
    const dispatch = useAppDispatch()

    const logOut = (): void => {
        dispatch(clearUser())
    }

    return (
        <div className={navStyles.container}>
            <div className={navStyles.left}>
                <h1 onClick={() => router.push('/')}>Bible App</h1>
            </div>
            <div className={navStyles.mid}>

            </div>
            <div className={navStyles.right}>
                {
                    !user.id.length 
                    ?
                        router.pathname === '/login'
                        ? <Link href='/register'><a>Register</a></Link>
                        : <Link href='/login'><a>Log In</a></Link>
                    : router.pathname === '/'
                    ?
                    <>
                        <Link href='/bible'><a>Find Passage</a></Link>
                        <Link href='/login'><a>Settings</a></Link>
                        <a onClick={logOut}>Log Out</a>
                    </>
                    : router.pathname === '/bible'
                    ? 
                    <>
                        <Link href='/'><a>Back</a></Link>
                        <a onClick={logOut}>Log Out</a>
                    </>
                    : null

                }
            </div>
        </div>
    );
};

export default NavBar;