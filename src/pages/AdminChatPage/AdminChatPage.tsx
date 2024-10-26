import React, { useEffect, useRef, useState } from "react";
import { ChatResponse } from "../../commonComponents/interfaces/Chat/ChatResponse";
import { getChats, getMessagesInChat } from "../../http/chatApi";
import './AdminChatPage.css';
import { GetStoryResponse } from "../../commonComponents/interfaces/Chat/GetStoryResponse";
import { GetStoryResponseItem } from "../../commonComponents/interfaces/Chat/GetStoryResponseItem";
import ChatMessage from "../../commonComponents/Chat/Component/ChatMessage";
import { getImage } from "../../http/fileApi";
import { useWebSocket } from "../../hub/WebSocketProvider";
import { observer } from "mobx-react-lite";

const AdminChatPage: React.FC = observer(() => {
    const { sendMessage, messages, updateMessages } = useWebSocket();
    const [selectedChat, setSelectedChat] = useState<string>("");
    const [chatList, setChatList] = useState<ChatResponse | undefined>({ entities: [], totalCount: 0 });
    const [newMessage, setNewMessage] = useState<string>("");
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        getChats()
            .then(x => {
                if (x.status !== 200) {
                    alert(x.message);
                } else {
                    setChatList(x.value);
                }
            });
    }, []);

    useEffect(() => {
        if (selectedChat) {
            getMessagesInChat(selectedChat)
                .then(x => {
                    if (x.status !== 200) {
                        alert(x.message);
                    } else {
                        updateMessages(x.value);
                    }
                });
        }
    }, [selectedChat]);

    const handleChatClick = (chatId: string) => {
        setSelectedChat(chatId);
    };

    useEffect(() => {
        if (messagesEndRef.current && (messages?.entities.length || 0) > 0) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages?.entities.length, selectedChat]);

    const handleSendMessage = () => {
        if (newMessage.trim() !== "") {
            sendMessage(newMessage, selectedChat);
            setNewMessage("");
        }
    };

    return (
        <div className="chat-page">
            <div className="chat-list">
                {chatList?.entities.map((chat) => (
                    <div
                        key={chat.id}
                        className={`chat-item ${selectedChat === chat.id ? 'selected' : ''}`}
                        onClick={() => handleChatClick(chat.id)}
                    >
                        <img 
                            src={chat.imageId === null || chat.imageId === undefined ? `https://www.kurin.com/wp-content/uploads/placeholder-square.jpg` : getImage(chat.imageId)}
                            alt={`${chat}'s avatar`} 
                            className="avatar" 
                        />
                        <div className="chat-info">
                            <div className="chat-name">{chat.chatName}</div>
                            <div className="chat-last-message">{chat.lastMessage?.slice(0, 10)}</div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="chat-window">
                {selectedChat ? (
                    <ChatMessage 
                        messages={messages} // Используем сообщения из контекста
                        selectedChat={selectedChat}
                        newMessage={newMessage}
                        chatList={chatList}
                        setNewMessage={setNewMessage}
                        sendMessage={handleSendMessage}
                        messagesEndRef={messagesEndRef}
                    />
                ) : (
                    <div className="no-chat-selected">Select a chat to start messaging</div>
                )}
            </div>
        </div>
    );
});

export default AdminChatPage;
