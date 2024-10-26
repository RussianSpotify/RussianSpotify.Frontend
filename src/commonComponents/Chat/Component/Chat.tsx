import React, { useContext, useEffect, useRef, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { UserContext } from '../../..';
import { getChats } from '../../../http/chatApi';
import './Chat.css';
import { GetStoryResponseItem } from '../../interfaces/Chat/GetStoryResponseItem';
import { GetStoryResponse } from '../../interfaces/Chat/GetStoryResponse';
import { useWebSocket } from '../../../hub/WebSocketProvider';

const Chat: React.FC = observer(() => {
    const { sendMessage, connection } = useWebSocket();
    const [selectedChatId, setSelectedChatId] = useState<string>("");
    const [isChatOpen, setIsChatOpen] = useState<boolean>(false);

    const userStore = useContext(UserContext);

    const [messages, setMessages] = useState<GetStoryResponse | null>({ entities: [], totalCount: 0 });
    const [newMessage, setNewMessage] = useState<string>("");

    // useEffect(() => {
    //     if (connection) {
    //     connection.on("ReceiveMessage", ({ message, whoSentUsername, senderId }) => {
    //         console.log(`message received: ${message}`)
    //         setMessages(prevMessages => ({
    //             ...prevMessages,
    //             entities: [
    //                 ...(prevMessages?.entities || []),
    //                 {
    //                     id: new Date().getTime().toString(),
    //                     message,
    //                     sender: whoSentUsername,
    //                     sentDate: new Date().toISOString(),
    //                     senderId: senderId,
    //                     senderAvatar: "",
    //                 } as GetStoryResponseItem
    //             ],
    //             totalCount: (prevMessages?.totalCount || 0) + 1,
    //         }));
    //     });

    //     connection.onclose((error) => {
    //         console.error("Соединение закрыто с ошибкой: ", error);
    //     });
    //     }
    // }, [connection]);


    useEffect(() => {
        getChats()
            .then(x => {
                if (x.status !== 200) {
                    alert(x.message);
                } else {
                    if (!userStore._isAdmin && x.value.entities.length > 0) {
                        setSelectedChatId(x.value.entities[0].id.toString());
                        console.log(selectedChatId)
                    }
                }
            });
    }, []);

    const toggleChat = () => {
        setIsChatOpen(!isChatOpen);
    };

    return (
        <>
            <button onClick={toggleChat} className="chat-toggle-button">
                {isChatOpen ? 'Закрыть чат' : 'Открыть чат'}
            </button>
            {isChatOpen && (
                    <div className="chat-input">
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Введите ваше сообщение"
                        />
                        <button onClick={() => sendMessage(newMessage, selectedChatId)}>Отправить</button>
                    </div>
            )}
        </>
    );
});

export default Chat;
