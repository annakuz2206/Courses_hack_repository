import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './Chat.css';

const Chat = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([
        { text: 'Привет! Рады, что ты с нами!', sender: 'team', time: '10:30' },
        { text: 'Привет! Когда начинаем?', sender: 'me', time: '10:32' },
        { text: 'Встречаемся завтра в 10:00', sender: 'team', time: '10:35' },
    ]);

    const handleSend = (e) => {
        e.preventDefault();
        if (message.trim()) {
            const newMessage = {
                text: message,
                sender: 'me',
                time: new Date().toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' })
            };
            setMessages([...messages, newMessage]);
            setMessage('');
        }
    };

    return (
        <div className="chat-page">
            <div className="chat-container">
                <div className="chat-header">
                    <button onClick={() => navigate('/matches')} className="back-btn">
                        ← Назад
                    </button>
                    <div className="chat-title">
                        <h2>AI Ninjas</h2>
                        <span>3 участника</span>
                    </div>
                </div>

                <div className="messages-container">
                    {messages.map((msg, index) => (
                        <div key={index} className={`message ${msg.sender}`}>
                            <div className="message-bubble">
                                <p>{msg.text}</p>
                                <span className="message-time">{msg.time}</span>
                            </div>
                        </div>
                    ))}
                </div>

                <form onSubmit={handleSend} className="chat-input-form">
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Введите сообщение..."
                        className="chat-input"
                    />
                    <button type="submit" className="send-btn">
                        ➤
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Chat;
