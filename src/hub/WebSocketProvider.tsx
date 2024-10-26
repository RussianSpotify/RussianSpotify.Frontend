import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import * as signalR from '@microsoft/signalr';
import { GetStoryResponseItem } from '../commonComponents/interfaces/Chat/GetStoryResponseItem';
import { GetStoryResponse } from '../commonComponents/interfaces/Chat/GetStoryResponse';

const WebSocketContext = createContext<{
    connection: signalR.HubConnection | null;
    sendMessage: (message: string, chatId: string) => Promise<void>;
    messages: GetStoryResponse | null;
    updateMessages: (newMessages: GetStoryResponse | undefined) => void;
}>({ connection: null, sendMessage: async () => {}, messages: null, updateMessages: () => {} });

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const connectionRef = useRef<signalR.HubConnection | null>(null);
    const [messages, setMessages] = useState<GetStoryResponse>({entities: [], totalCount: 0});

    useEffect(() => {
        const newConnection = new signalR.HubConnectionBuilder()
            .withUrl(`${process.env.REACT_APP_SPOTIFY_API}chat-hub`, {
                skipNegotiation: true,
                transport: signalR.HttpTransportType.WebSockets,
                accessTokenFactory: () => localStorage.getItem('token') ?? "default",
            })
            .withAutomaticReconnect()
            .build();

        connectionRef.current = newConnection;

        newConnection.start()
            .then(() => {
                console.log("Соединение установлено");

                newConnection.on("ReceiveMessage", ({ message, whoSentUsername, senderId }) => {
                    console.log('Получено сообщение:', message);
                    setMessages(prevMessages => ({
                        ...prevMessages,
                        entities: [
                            ...(prevMessages?.entities || []),
                            {
                                id: new Date().getTime().toString(),
                                message,
                                sender: whoSentUsername,
                                sentDate: new Date().toISOString(),
                                senderId: senderId,
                                senderAvatar: "",
                            } as GetStoryResponseItem
                        ],
                        totalCount: (prevMessages?.totalCount || 0) + 1,
                    }));
                });

                newConnection.onclose((error) => {
                    console.error("Соединение закрыто с ошибкой: ", error);
                });
            })
            .catch(error => console.error("Ошибка при подключении: ", error));

        return () => {
            newConnection.stop();
        };
    }, []);

    const updateMessages = (newMessages: GetStoryResponse | undefined) => {
        if (newMessages === undefined)
            return;

        setMessages(newMessages)
    };

    const sendMessage = async (message: string, chatId: string) => {
        if (connectionRef.current && message) {
            try {
                await connectionRef.current.invoke("SendMessage", { message, chatId });
            } catch (error) {
                console.error("Ошибка при отправке сообщения: ", error);
            }
        }
    };

    return (
        <WebSocketContext.Provider value={{ connection: connectionRef.current, sendMessage, messages, updateMessages }}>
            {children}
        </WebSocketContext.Provider>
    );
};

export const useWebSocket = () => useContext(WebSocketContext);
