import React, { useEffect } from "react";
import NavBar from "./NavBar"
import Footer from "./Footer"
import layoutStyles from '../styles/layoutStyles/Layout.module.scss'
import { useAppSelector } from "../redux/hooks";
import { useRouter } from "next/router";

const Layout = ({ children }: {children: React.ReactNode}) => {
    const user = useAppSelector(state => state.user)
    const router = useRouter()

    useEffect(() => {
        if (!user.id.length) router.replace('/login')
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