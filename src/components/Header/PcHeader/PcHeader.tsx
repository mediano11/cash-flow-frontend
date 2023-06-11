import React, {FC, useCallback, MouseEvent, useState} from 'react';

//UI
import classes from './PcHeader.module.css'
import Logo from "@assets/Header/logo.svg";
import ProfileIcon from "@assets/user-icon.svg"
import {ThemeButton} from '@components/ThemeButtons/ThemeButtons';
import DesktopNotifications from '@components/Header/Notifications/DesktopNotifications/DesktopNotifications';

import Breadcrumbs from '@components/Breadcrumbs/Breadcrumbs';
import { breadcrumbs } from './breadcrumbs';


const HeaderSite: FC = () => {

    const [isNotificationsOpen = false, setIsNotificationsOpen] = useState<boolean>();

    const getNotifications = (e: MouseEvent<HTMLButtonElement>) => {
        setIsNotificationsOpen(true)
    }
    return (<>
        {isNotificationsOpen && 
        <DesktopNotifications 
        closeNotifications={() => setIsNotificationsOpen(false)}
        animation={isNotificationsOpen}/>}

        <header className={classes.header}>
            <div className={classes.header__container}>
                <div className={classes.header__top}>
                    <div className={classes.header__logo}>
                        <img src={Logo} alt="logo" />
                        <h1 className={classes.title}>Cash<span>Flow</span></h1>
                    </div>
                    <div className={classes.header__menu}>
                        <ThemeButton />
                        <button onClick={e => getNotifications(e)} className={classes.header__notifications}>
                            <i className="bi bi-bell"></i>
                        </button>
                    </div>
                    <div className={classes.header__profile}>
                        <img src={ProfileIcon} alt="icon" />
                        <div className={classes.profile__inner}>
                            <div className={classes.profile__main}>
                                <h4 className={classes.profile__name}>John Doe</h4>
                                <p className={classes.profile__email}>johndoee@gmail.com</p>
                            </div>
                            <i className="bi bi-chevron-down"></i>
                        </div>
                   </div>
                    <nav className={classes.breadcrumbs}>
                        <Breadcrumbs breadcrumbs={breadcrumbs} />
                    </nav>
                </div>
            </div>
        </header>
    </>);
};

export default HeaderSite;