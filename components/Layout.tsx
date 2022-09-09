import React, { useEffect } from "react"
import NavBar from "./NavBar"
import Footer from "./Footer"
import { useAppDispatch, useAppSelector } from "../redux/hooks"
import { useRouter } from "next/router"
import { setUser } from "../redux/userSlice"
import layoutStyles from '../styles/layoutStyles/Layout.module.scss' 

const Layout = ({ children }: {children: React.ReactNode}) => {
    const user = useAppSelector(state => state.user)
    const router = useRouter()
    const dispatch = useAppDispatch()

    useEffect(() => {
        const userFromStorage = localStorage.getItem('user')
        if (userFromStorage && JSON.parse(userFromStorage)?._id?.length) {
            dispatch(setUser(JSON.parse(userFromStorage)))
        }
    }, [])

    useEffect(() => {
        if (user?._id?.length) return
        const userFromStorage = localStorage.getItem('user')
        if (!userFromStorage) router.replace('/login')
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