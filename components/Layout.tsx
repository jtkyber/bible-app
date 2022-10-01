import React, { useEffect } from "react"
import NavBar from "./NavBar"
import Footer from "./Footer"
import { useAppDispatch, useAppSelector } from "../redux/hooks"
import { useRouter } from "next/router"
import { IUserState, setUser } from "../redux/userSlice"
import layoutStyles from '../styles/layoutStyles/Layout.module.scss' 
import { setIsMobile } from "../redux/deviceSlice"

const Layout = ({ children }: {children: React.ReactNode}) => {
    const user: IUserState = useAppSelector(state => state.user)
    const router = useRouter()
    const dispatch = useAppDispatch()
    
    useEffect(() => {
        const mobile: boolean = (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || (window.innerWidth < window.innerHeight))
        dispatch(setIsMobile(mobile))

        const userFromStorage: (string | null) = localStorage.getItem('user')
        if (userFromStorage && JSON.parse(userFromStorage)?._id?.length) {
            dispatch(setUser(JSON.parse(userFromStorage)))
        }
    }, [])

    useEffect(() => {
        if (user?._id?.length) {
            localStorage.setItem('user', JSON.stringify(user))
        } else {
            const userFromStorage = localStorage.getItem('user')
            if (!userFromStorage) router.replace('/login')
        }
    }, [user])

    return (
        <div className={layoutStyles.container}>
            <NavBar />
            <main>{children}</main>
            <Footer />
        </div>
    );
};

export default Layout;