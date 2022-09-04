import React from "react";
import { Provider } from 'react-redux'
import store from '../redux/store'
import NavBar from "./NavBar"
import Footer from "./Footer"
import layoutStyles from '../styles/layoutStyles/Layout.module.scss'

const Layout = ({ children }: {children: React.ReactNode}) => {
    return (
        <Provider store={store}>
            <div className={layoutStyles.container}>
                <NavBar />
                <main>{children}</main>
                <Footer />
            </div>
        </Provider>
    );
};

export default Layout;