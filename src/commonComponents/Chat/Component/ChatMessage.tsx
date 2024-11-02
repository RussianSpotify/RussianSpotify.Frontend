import React, { LegacyRef, useContext } from "react";
import { ChatResponse } from "../../interfaces/Chat/ChatResponse";
import { GetStoryResponse } from "../../../commonComponents/interfaces/Chat/GetStoryResponse";
import { UserContext } from "../../..";
import Message from "./Message";

interface ChatMessageProps {
    messages: GetStoryResponse | null;
    selectedChat: string;
    chatList: ChatResponse | undefined
    newMessage: string;
    setNewMessage: React.Dispatch<React.SetStateAction<string>>;
    sendMessage: () => void;
    messagesEndRef: LegacyRef<HTMLDivElement> | null
}

const ChatMessage: React.FC<ChatMessageProps> = ({ messages, selectedChat, newMessage, chatList, setNewMessage, sendMessage, messagesEndRef }) => {

    const userStore = useContext(UserContext);

    return (
        <div className="chat-content">
            <h2>Chat: {(messages?.entities.length || 0) > 0 && chatList?.entities.find(x => x.id === selectedChat)?.chatName}</h2>
            <div className="messages">
                {messages?.entities.map(message => (
                    <Message message={message} currentUserId={`${userStore._user._id}`}/>             
                ))}
                <div ref={messagesEndRef} />
            </div>
            <div className="message-input">
                <input
                    type="text"
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                />
                <button onClick={(e) => sendMessage()}>Send</button>
            </div>
        </div>
    )
}

export default ChatMessage;
