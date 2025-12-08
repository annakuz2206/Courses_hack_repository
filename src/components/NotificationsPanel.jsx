import React, { useState } from 'react';
import './NotificationsPanel.css';

const NotificationsPanel = ({ isOpen, onClose }) => {
    const [notifications] = useState([
        {
            id: 1,
            type: 'team_invite',
            title: 'Приглашение в команду',
            message: 'Вас пригласили в команду "Team A" пользователь Вася',
            time: '5 мин назад',
            read: false
        },
        {
            id: 2,
            type: 'team_join',
            title: 'Новый участник',
            message: 'Пользователь Вася хочет присоединиться к вашей команде',
            time: '10 мин назад',
            read: false
        },
        {
            id: 3,
            type: 'team_merge',
            title: 'Объединение команд',
            message: 'Пользователь Вася хочет объединиться с вами в команду',
            time: '15 мин назад',
            read: false
        },
        {
            id: 4,
            type: 'team_removed',
            title: 'Удаление из команды',
            message: 'Вас удалили из команды',
            time: '1 час назад',
            read: true
        },
        {
            id: 5,
            type: 'match',
            title: 'Новая симпатия',
            message: 'Пользователь Лена лайкнула вашу анкету',
            time: '2 часа назад',
            read: true
        }
    ]);

    if (!isOpen) return null;

    const getNotificationColor = (type) => {
        switch (type) {
            case 'team_invite':
                return '#8B5CF6'; // Фиолетовый - приглашение в команду
            case 'team_join':
                return '#3B82F6'; // Синий - запрос на вступление
            case 'team_merge':
                return '#10B981'; // Зеленый - объединение команд
            case 'team_removed':
                return '#EF4444'; // Красный - удаление
            case 'match':
                return '#EC4899'; // Розовый - симпатии
            default:
                return '#6B7280'; // Серый - общие
        }
    };

    return (
        <div className="notifications-overlay" onClick={onClose}>
            <div className="notifications-panel" onClick={(e) => e.stopPropagation()}>
                <div className="notifications-header">
                    <h2 className="notifications-title">Уведомления</h2>
                    <button className="notifications-close-btn" onClick={onClose}>✕</button>
                </div>

                <div className="notifications-list">
                    {notifications.length === 0 ? (
                        <div className="notifications-empty">
                            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M13.73 21C13.5542 21.3031 13.3019 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6982 21.5547 10.4458 21.3031 10.27 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <p>Нет уведомлений</p>
                        </div>
                    ) : (
                        notifications.map((notification) => (
                            <div
                                key={notification.id}
                                className={`notification-item ${notification.read ? 'read' : 'unread'}`}
                                style={{ borderLeftColor: getNotificationColor(notification.type) }}
                            >
                                <div className="notification-content">
                                    <h3 className="notification-title">{notification.title}</h3>
                                    <p className="notification-message">{notification.message}</p>
                                    <span className="notification-time">{notification.time}</span>
                                </div>
                                {!notification.read && <div className="notification-badge"></div>}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default NotificationsPanel;
