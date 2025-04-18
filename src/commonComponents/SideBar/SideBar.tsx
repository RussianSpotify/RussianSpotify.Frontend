import './SideBar.css'
import navigationElementsProps from "../../utils/sidebar/navigationElementsProps";
// @ts-ignore
import create_playlist from '../../assets/sidebar/create_playlist.png'
// @ts-ignore
import liked_songs from '../../assets/sidebar/like.png'
// @ts-ignore
import author_icon from '../../assets/sidebar/author_icon.png'
import {useNavigate} from "react-router-dom";
import routeNames from "../../utils/routeNames";
import {useContext} from "react";
import {UserContext} from "../../index";
import roles from "../../utils/roles";
// @ts-ignore
import adminChatImage from '../../assets/sidebar/chat.png'

const SideBar = (props: any) => {
    const {setShowCreatePlaylistModal} = props
    const {setShowCreateSongModal} = props
    const userStore = useContext(UserContext)
    const navigate = useNavigate();

    return (
        <div className="sidebar-wrapper">
            <div className="sidebar">
                <div className="sidebar__nav">
                    <div className="sidebar__nav__main">
                    {
                        userStore._isAdmin && <div className="sidebar__nav__admin">
                            <NavigationElement 
                                title={`Support Chat`}
                                image={adminChatImage}
                                onClick={() => navigate(routeNames.ADMIN_CHAT_PAGE)}/>
                        </div>
                    }
                        {
                            navigationElementsProps.map((i, idx) => (
                                <NavigationElement key={idx} image={i.icon} title={i.title}
                                                   onClick={() => navigate(i.navigateTo)}/>
                            ))
                        }
                    </div>
                    <div className="sidebar__nav__playlists">
                        <PlaylistElement image={create_playlist} title={'create playlist'}
                                         onClick={() => setShowCreatePlaylistModal(true)}/>
                        <PlaylistElement image={liked_songs} title={'liked songs'}
                                         onClick={() => navigate(routeNames.FAVORITE_SONGS)}/>
                    </div>
                    <div className="sidebar__nav__songs">
                        {
                            userStore.user.roles.includes(roles.Author) &&
                            <PlaylistElement image={create_playlist} title={'upload song'}
                                             onClick={() => setShowCreateSongModal(true)}/>
                        }
                        {
                            userStore.user.roles.includes(roles.Author) &&
                            <PlaylistElement
                                image={author_icon} title={'author profile'}
                                onClick={() => navigate(routeNames.AUTHOR_PAGE_NAV + userStore.user.username)}/>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SideBar

const NavigationElement = (props: any) => {
    const {image, title, onClick} = props

    return (
        <div
            onClick={onClick}
            className="sidebar__nav__main__element">
            <img src={image} alt={title}/>
            <p>{title}</p>
        </div>
    )
}

const PlaylistElement = (props: any) => {
    const {image, title, onClick} = props

    return (
        <div
            onClick={onClick}
            className="sidebar__nav__playlists__element">
            <img src={image} alt={title}/>
            <p>{title}</p>
        </div>
    )
}