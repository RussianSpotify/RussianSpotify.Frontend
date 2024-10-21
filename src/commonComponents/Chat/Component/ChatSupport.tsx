import React, { useState } from 'react';
import './ChatSupport.css'; // Подключаем стили для компонента
import { ChatResponse } from '../../interfaces/Chat/ChatResponse';

const ChatSupport: React.FC<{
    chats: ChatResponse | undefined,
    isAdmin: boolean,
    userChatId: string,
}> = ({ chats, isAdmin, userChatId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedChat, setSelectedChat] = useState<string | null>(isAdmin ? null : userChatId);
  const [messages, setMessages] = useState<{ id: number; text: string; sender: string }[]>([]);
  const [inputValue, setInputValue] = useState('');

  const toggleChat = () => {
    setIsOpen(prev => !prev);
    if (isOpen) {
      setSelectedChat(null);
      setMessages([]); // Сброс истории сообщений при закрытии чата
    }
  };

  const handleChatSelect = (chatId: string) => {
    setSelectedChat(chatId);
    setIsOpen(true);

    // Здесь можно загрузить историю сообщений для выбранного чата (замените на ваш API вызов)
    const chatMessages = [
      { id: 1, text: 'Привет, как мы можем помочь?', sender: 'support' },
      { id: 2, text: 'У меня проблема с заказом.', sender: 'user' },
      { id: 3, text: 'Мы готовы помочь!', sender: 'support' },
    ];
    setMessages(chatMessages); // Подмените это на реальные данные из API
  };

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      const newMessage = {
        id: messages.length + 1,
        text: inputValue,
        sender: isAdmin ? 'support' : 'user', // Определяем отправителя
      };
      setMessages(prev => [...prev, newMessage]);
      setInputValue(''); // Очищаем поле ввода
    }
  };

  return (
    <div className="chat-support">
      <button className="chat-toggle" onClick={toggleChat}>
        {isOpen ? 'Скрыть чат' : isAdmin ? 'Список чатов' : 'Чат поддержки'}
      </button>
      {isOpen && (
        <div className="chat-window">
          <div className="chat-header">
            <h4>{isAdmin ? 'Список чатов' : 'Чат поддержки'}</h4>
          </div>
          <div className="chat-body">
            {isAdmin && selectedChat == null ? (
              <div className="chat-list">
                {chats?.entities.map(chat => (
                  <div
                    key={chat.id}
                    className={`chat-item ${selectedChat === chat.id ? 'active' : ''}`}
                    onClick={() => handleChatSelect(chat.id)}
                  >
                    {chat.chatName}
                  </div>
                ))}
              </div>
            ) : (
              <div className="chat-messages">
                {messages.map(msg => (
                  <div key={msg.id} className={`chat-message ${msg.sender}`}>
                    {msg.text}
                  </div>
                ))}
                <div className="chat-input">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Введите ваше сообщение..."
                  />
                  <button onClick={handleSendMessage}>Отправить</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatSupport;
