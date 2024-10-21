import React, { useContext, useEffect, useState } from 'react';
import * as signalR from '@microsoft/signalr';
import { observer } from 'mobx-react-lite';
import { UserContext } from '../../..';
import { getChats } from '../../../http/chatApi';
import { ChatResponse } from "../../interfaces/Chat/ChatResponse";
import './Chat.css';
import ChatSupport from './ChatSupport';

const Chat: React.FC = observer(() => {
    const userStore = useContext(UserContext);
    const defaultConnection = "https://localhost:7177/chat-hub";
    const [connection, setConnection] = useState<signalR.HubConnection>();
    const [messages, setMessages] = useState<{ [key: string]: string[] }>({});
    const [chatList, setChatList] = useState<ChatResponse | undefined>({ entities: [], totalCount: 0 });
    const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
    const [newMessage, setNewMessage] = useState<string>("");
    const [isChatOpen, setIsChatOpen] = useState<boolean>(false); // Состояние видимости чата

    useEffect(() => {
        const newConnection = new signalR.HubConnectionBuilder()
            .configureLogging(signalR.LogLevel.Debug)
            .withUrl(defaultConnection, {
                skipNegotiation: true,
                transport: signalR.HttpTransportType.WebSockets,
                accessTokenFactory: () => localStorage.getItem('token') ?? "default",
            })
            .withAutomaticReconnect()
            .build();

        setConnection(newConnection);
    }, []);

    useEffect(() => {
        if (userStore._isAdmin) {
            getChats()
                .then(x => {
                    if (x.status !== 200) {
                        alert(x.message);
                    } else {
                        setChatList(x.value);
                    }
                });
        }
    }, [userStore._isAdmin]);

    useEffect(() => {
        if (connection) {
            connection.start()
                .then(() => {
                    console.log("Соединение установлено");

                    connection.on("ReceiveMessage", (chatId: string, message: string) => {
                        setMessages(prev => ({
                            ...prev,
                            [chatId]: [...(prev[chatId] || []), message],
                        }));
                    });

                    connection.onclose((error) => {
                        console.error("Соединение закрыто с ошибкой: ", error);
                    });

                    connection.invoke("OnConnectedAsync");
                })
                .catch(error => console.error("Ошибка при подключении: ", error));
        }
    }, [connection]);

    const sendMessage = async () => {
        if (connection && newMessage && selectedChatId) {
            try {
                await connection.invoke("SendMessage", selectedChatId, newMessage);
                setNewMessage("");
            } catch (error) {
                console.error("Ошибка при отправке сообщения: ", error);
            }
        }
    };

    const handleChatSelect = (chatId: string) => {
        setSelectedChatId(chatId);
    };

    const toggleChat = () => {
        setIsChatOpen(!isChatOpen);
    };

    return (
        <ChatSupport 
        chats={chatList} 
        isAdmin={userStore._isAdmin} 
        userChatId={userStore._chatId}
        />
    );
});

export default Chat;
