import React, { useEffect } from "react";
import { getImage } from "../../../http/fileApi";

interface MessageProps {
    message: {
        id: string;
        senderId: string;
        sender: string;
        message: string;
        sentDate: string;
        senderImageId: string;
    };
    currentUserId: string;
}

const Message: React.FC<MessageProps> = ({ message, currentUserId }) => {
    return (
        <div className={`message ${message.senderId === currentUserId ? 'my-message' : 'other-message'}`}>
            <img style={{maxWidth: '20px', borderRadius: 10}} src={message.senderImageId === null || message.senderImageId === undefined ? `https://www.kurin.com/wp-content/uploads/placeholder-square.jpg` : getImage(message.senderImageId)} alt={`${message.sender}'s avatar`} />
            <div className="message-body">
                <div className="message-content">{message.message}</div>
                <div className="message-meta">
                    <span className="sender-name">{message.sender}</span> | 
                    <span className="sent-date">{new Date(message.sentDate).toLocaleString()}</span>
                </div>
            </div>
        </div>
    );
};

export default Message;
