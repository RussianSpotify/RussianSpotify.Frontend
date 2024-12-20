import {Route, Routes} from "react-router-dom";
import {authRoutes, notAuthRoutes} from "../../utils/routes";
import {useContext} from "react";
import {UserContext} from "../../index";
import {observer} from "mobx-react-lite";
import HomePage from "../../pages/HomePage/HomePage";
import LoginPage from "../../pages/LoginPage/LoginPage";


const AppRouter = observer(() => {
    const userStore = useContext(UserContext)

    return (
        <Routes>
            {
                !userStore.isAuth && notAuthRoutes.map(({path, Component}) => (
                    <Route path={path} element={<Component/>} key={path}/>
                ))
            }
            {
                userStore.isAuth && authRoutes.map(({path, Component, adminRequired}) => (
                    adminRequired
                     ? userStore._isAdmin && <Route path={path} element=<Component/> key={path}/>
                     : <Route path={path} element=<Component/> key={path}/>
                ))
            }
            {
                userStore.isAuth
                    ? <Route path="*" element=<HomePage/>/>
                    : <Route path="*" element=<LoginPage/>/>
            }
        </Routes>
    )
})

export default AppRouter