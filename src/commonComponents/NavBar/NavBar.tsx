// @ts-ignore
import arrow from "../../assets/arrow.png"
// @ts-ignore
import subscription_icon from "../../assets/subscription_icon.png";
// @ts-ignore
import payment_icon from "../../assets/payment-icon.png";
// @ts-ignore
import logout_icon from "../../assets/logout_icon.png"
import "./NavBar.css"
import React, {useContext, useState} from "react";
import {useNavigate} from "react-router-dom";
import wideOpenElements from "../../utils/navbar/wideOpenElements";
import routeNames from "../../utils/routeNames";
import {UserContext} from "../../index";
import {observer} from "mobx-react-lite";
import handleImageNotLoaded from "../../functions/handleImageNotLoaded";
import WideOpenElements from "../../utils/navbar/wideOpenElements";


const NavBar = observer((props: any) => {
    const userStore = useContext(UserContext)
    const {setShowSubModal} = props
    const [isOpen, setIsOpen] = useState(false)
    const navigate = useNavigate()
    let subscribedStyles = {
        border: "2px solid mediumpurple",
        padding: "2px"
    }

    return (
        userStore.isAuth &&
        <div
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
            onClick={() => setIsOpen(false)}
            className="navbar">
            <div className="navbar__account">
                <div
                    className="navbar__account__main">
                    <div
                        onClick={() => navigate(routeNames.ACCOUNT_PAGE)}
                        className="navbar__account__main__image__div">
                        <img
                            src={userStore.user.photoUrl}
                            alt={userStore.user.username}
                            onError={handleImageNotLoaded}
                            style={userStore.user.isSubscribed ? subscribedStyles : {}}
                            className="navbar__account__main__image"/>
                    </div>
                    <p
                        onClick={() => navigate(routeNames.ACCOUNT_PAGE)}
                        className="navbar__account__main__name">
                        {userStore.user.username}
                    </p>
                    <div className="navbar__account__main__arrow__div">
                        <img
                            src={arrow}
                            style={{rotate: isOpen ? '180deg' : '0deg'}}
                            alt="show"
                            className="navbar__account__main__arrow"/>
                    </div>
                </div>
                {
                    isOpen &&
                    <div className="navbar__account__wide">
                        {wideOpenElements.map(element => (
                            <WideOpenElement
                                onClickEvent={() => navigate(element.navigateTo)}
                                icon={element.icon}
                                title={element.title}
                                navigateTo={element.navigateTo}/>
                        ))}
                        <WideOpenElement
                            onClickEvent={() => {
                                userStore.logout()
                                localStorage.removeItem('token')
                                localStorage.removeItem('refresh');
                                navigate(routeNames.LOGIN_PAGE)
                            }}
                            icon={logout_icon}
                            title="Log out"
                        />
                        {
                            !userStore.user.isSubscribed &&
                            <WideOpenElement
                                onClickEvent={() => {
                                    setShowSubModal(true)
                                }}
                                icon={subscription_icon}
                                title="Subscribe"
                            />
                        }
                        {
                            <WideOpenElement
                                title="History Payments"
                                icon={payment_icon}
                                onClickEvent={() => navigate(routeNames.PAYMENT_HISTORY_PAGE)}
                                navigateTo={routeNames.PAYMENT_HISTORY_PAGE}
                            />
                        }
                    </div>
                }
            </div>
        </div>
    )
})

export default NavBar

function WideOpenElement(props: any) {
    const {onClickEvent, icon, title} = props

    return (
        <div
            onClick={onClickEvent}
            className="navbar__account__wide__element">
            <div className="navbar__account__wide__element__image__div">
                <img src={icon} alt={title}
                     className="navbar__account__wide__element__image"/>
            </div>
            <p className="navbar__account__wide__element__text">
                {title}
            </p>
        </div>
    )
}