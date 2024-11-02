import React, { useContext, useEffect, useRef, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { UserContext } from '../../..';
import { getChats, getMessagesInChat } from '../../../http/chatApi';
import './Chat.css';
import { useWebSocket } from '../../../hub/WebSocketProvider';
import { getImage } from '../../../http/fileApi';

const Chat: React.FC = observer(() => {
    const { sendMessage, updateMessages, messages } = useWebSocket();
    const [selectedChatId, setSelectedChatId] = useState<string>('');
    const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
    const userStore = useContext(UserContext);
    const [newMessage, setNewMessage] = useState<string>('');
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        getChats().then((x) => {
            if (x.status !== 200) {
                alert(x.message);
            } else {
                if (!userStore._isAdmin && x.value.entities.length > 0) {
                    setSelectedChatId(x.value.entities[0].id.toString());
                }
            }
        });
    }, []);

    useEffect(() => {
        if (selectedChatId) {
            getMessagesInChat(selectedChatId).then((x) => {
                if (x.status !== 200) {
                    alert(x.message);
                } else {
                    updateMessages(x.value);
                }
            });
        }
    }, [selectedChatId]);

    const toggleChat = () => {
        setIsChatOpen(!isChatOpen);
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNewMessage(event.target.value);
    };

    const handleSendMessage = () => {
        if (newMessage.trim() === '') {
            return;
        }

        sendMessage(newMessage, selectedChatId);
        setNewMessage('');
    };

    useEffect(() => {
        if (messagesEndRef.current && (messages?.entities.length || 0) > 0) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages?.entities.length, selectedChatId, isChatOpen]);

    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            handleSendMessage();
        }
    };

    return (
        <>
            <button onClick={toggleChat} className="support-button">
                Тех. поддержка
            </button>
            {isChatOpen && (
                <div className="support-window">
                    <div className="support-header">
                        <h3>Техническая поддержка</h3>
                        <button onClick={toggleChat} className="close-button">×</button>
                    </div>
                    <div className="support-content">
                        <div className="chat-messages">
                            {messages?.entities?.length || 0 > 0 ? (
                                messages?.entities.map((message, index) => (
                                    <div
                                        key={index}
                                        className={`message-container ${
                                            message.senderId === userStore.user.id
                                                ? 'my-message'
                                                : 'other-message'
                                        }`}
                                    >
                                        <img
                                            src={message.senderImageId === null || message.senderImageId === undefined
                                                 ? `https://www.kurin.com/wp-content/uploads/placeholder-square.jpg`
                                                 : getImage(message.senderImageId)}
                                            alt={`${message.sender}'s avatar`}
                                            className="user-photo"
                                        />
                                        <div className="message-content">
                                            <div className="message-text">{message.message}</div>
                                            <div className="message-info">
                                                <span className="user-name">{message.sender}</span>
                                                <span className="message-date">{new Date(message.sentDate).toLocaleString()}</span>
                                            </div>
                                        </div>
                                        <div ref={messagesEndRef} />
                                    </div>
                                ))
                            ) : (
                                <p className="no-messages">Пока нет сообщений.</p>
                            )}
                        </div>
                        <div className="message-input">
                            <input
                                type="text"
                                placeholder="Введите сообщение..."
                                value={newMessage}
                                onChange={handleInputChange}
                                onKeyPress={handleKeyPress}
                            />
                            <button onClick={handleSendMessage}>Отправить</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
});

export default Chat;
