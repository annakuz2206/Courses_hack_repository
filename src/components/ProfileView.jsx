import React, { useState } from 'react';
import './ProfileView.css';

const ProfileView = ({ user, onLike, onDislike }) => {
    const [currentStory, setCurrentStory] = useState(0);
    const totalStories = 6;

    // Функция для получения сплошного цвета на основе выбранного оттенка (0-1)
    const getColorByConfidence = (confidence) => {
        const purpleR = 174;
        const purpleG = 0;
        const purpleB = 255;

        const r = Math.floor(purpleR * confidence);
        const g = Math.floor(purpleG * confidence);
        const b = Math.floor(purpleB * confidence);

        return `rgb(${r}, ${g}, ${b})`;
    };

    const backgroundColor = getColorByConfidence(user.confidence || 0.5);

    return (
        <div className="profile-view" style={{ background: backgroundColor }}>
            {/* Контент профиля */}
            <div className="profile-content">
                {/* Верхняя секция с цветным фоном */}
                <div className="colored-section">
                    {/* Информация о пользователе */}
                    <div className="user-info-section">
                        <h1 className="user-name">{user.name}</h1>
                        <p className="user-role">{user.role}</p>
                    </div>
                </div>

                {/* Фото профиля (наполовину на цветном, наполовину на белом) */}
                <div className="profile-avatar-container">
                    <img src={user.photo} alt={user.name} className="profile-avatar" />

                    {/* Кнопки действий по бокам фото */}
                    <button className="action-btn dislike-btn" onClick={onDislike} aria-label="Dislike">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                    <button className="action-btn like-btn" onClick={onLike} aria-label="Like">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M20.84 4.61C20.3292 4.099 19.7228 3.69365 19.0554 3.41708C18.3879 3.14052 17.6725 2.99817 16.95 2.99817C16.2275 2.99817 15.5121 3.14052 14.8446 3.41708C14.1772 3.69365 13.5708 4.099 13.06 4.61L12 5.67L10.94 4.61C9.9083 3.57831 8.50903 2.99871 7.05 2.99871C5.59096 2.99871 4.19169 3.57831 3.16 4.61C2.1283 5.64169 1.54871 7.04097 1.54871 8.5C1.54871 9.95903 2.1283 11.3583 3.16 12.39L4.22 13.45L12 21.23L19.78 13.45L20.84 12.39C21.351 11.8792 21.7563 11.2728 22.0329 10.6053C22.3095 9.93789 22.4518 9.22248 22.4518 8.5C22.4518 7.77752 22.3095 7.06211 22.0329 6.39467C21.7563 5.72723 21.351 5.12087 20.84 4.61V4.61Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                </div>

                {/* Белый блок с информацией */}
                <div className="white-info-block">
                    {/* Навыки/Стек */}
                    {(user.hardSkills || user.softSkills) && (
                        <div className="skills-block">
                            <h3 className="section-title">Навыки/Стек</h3>
                            <div className="skills-list">
                                {user.hardSkills?.map((skill, index) => (
                                    <span key={`hard-${index}`} className="skill-tag">
                                        {skill}
                                    </span>
                                ))}
                                {user.softSkills?.map((skill, index) => (
                                    <span key={`soft-${index}`} className="skill-tag">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Описание */}
                    {user.about && (
                        <div className="about-block">
                            <h3 className="section-title">Описание</h3>
                            <p className="about-text">{user.about}</p>
                        </div>
                    )}

                    {/* Telegram */}
                    {user.telegram && (
                        <div className="telegram-block">
                            <h3 className="section-title">Telegram</h3>
                            <p className="telegram-value">{user.telegram}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfileView;
