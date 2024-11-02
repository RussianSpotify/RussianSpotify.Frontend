import React, {createContext} from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import UserStore from "./stores/userStore";
import PlayerStore from "./stores/playerStore";
import { WebSocketProvider } from './hub/WebSocketProvider';

export const UserContext = createContext(new UserStore());

export const PlayerContext = createContext(new PlayerStore());

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
    // <React.StrictMode>
    <WebSocketProvider>
        <UserContext.Provider value={new UserStore()}>
            <PlayerContext.Provider value={new PlayerStore()}>
                <App/>
            </PlayerContext.Provider>
        </UserContext.Provider>
    </WebSocketProvider>
    // </React.StrictMode>
);
