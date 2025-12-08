import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { mockParticipants } from '../data/mockData';
import './SwipePage.css';

const SwipePage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { addSwipe, swipes } = useApp();

    const [currentIndex, setCurrentIndex] = useState(0);
    const [availableParticipants, setAvailableParticipants] = useState([]);

    useEffect(() => {
        const swipedIds = swipes.map(s => s.participantId);
        const notSwipedYet = mockParticipants.filter(p => !swipedIds.includes(p.id));

        if (notSwipedYet.length > 0) {
            setAvailableParticipants(notSwipedYet);
        } else {
            setAvailableParticipants(mockParticipants);
        }
    }, [swipes]);

    const currentCard = availableParticipants[currentIndex];

    const handleSwipe = (direction) => {
        if (!currentCard) return;

        addSwipe(currentCard.id, direction);

        if (direction === 'right' && Math.random() > 0.7) {
            setTimeout(() => {
                alert(`🎉 Мэтч с ${currentCard.name}!`);
            }, 300);
        }

        if (currentIndex < availableParticipants.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else {
            setCurrentIndex(0);
        }
    };

    // Разделяем навыки на технические и мягкие
    const hardSkills = currentCard?.skills?.slice(0, Math.ceil(currentCard.skills.length / 2)) || [];
    const softSkills = currentCard?.skills?.slice(Math.ceil(currentCard.skills.length / 2)) || [];
    const hasTeam = Math.random() > 0.5;
    const age = 20 + Math.floor(Math.random() * 10);

    if (!currentCard) {
        return (
            <div className="app-container">
                <div className="header">
                    <div className="header-left">
                        <h1 className="header-title">Хакатон Курсов</h1>
                    </div>
                    <div className="header-right">
                        <div className="header-logo"></div>
                        <div className="header-bell">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                    </div>
                </div>
                <div className="progress-stripes">
                    <div className="stripe"></div>
                    <div className="stripe"></div>
                    <div className="stripe"></div>
                </div>
                <div className="empty-message">
                    <p>Нет доступных участников</p>
                </div>
                <div className="footer-navbar">
                    <div
                        className={`nav-icon ${location.pathname === '/swipe' ? 'nav-icon-active' : ''}`}
                        onClick={() => navigate('/swipe')}
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="11" cy="11" r="8" stroke="white" strokeWidth="2" />
                            <path d="m21 21-4.35-4.35" stroke="white" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                    </div>
                    <div
                        className={`nav-icon ${location.pathname === '/matches' ? 'nav-icon-active' : ''}`}
                        onClick={() => navigate('/matches')}
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M20.84 4.61C20.3292 4.099 19.7228 3.69365 19.0554 3.41708C18.3879 3.14052 17.6725 2.99817 16.95 2.99817C16.2275 2.99817 15.5121 3.14052 14.8446 3.41708C14.1772 3.69365 13.5708 4.099 13.06 4.61L12 5.67L10.94 4.61C9.9083 3.57831 8.50903 2.99871 7.05 2.99871C5.59096 2.99871 4.19169 3.57831 3.16 4.61C2.1283 5.64169 1.54871 7.04097 1.54871 8.5C1.54871 9.95903 2.1283 11.3583 3.16 12.39L4.22 13.45L12 21.23L19.78 13.45L20.84 12.39C21.351 11.8792 21.7563 11.2728 22.0329 10.6053C22.3095 9.93789 22.4518 9.22248 22.4518 8.5C22.4518 7.77752 22.3095 7.06211 22.0329 6.39467C21.7563 5.72723 21.351 5.12087 20.84 4.61V4.61Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                    <div
                        className={`nav-icon ${location.pathname === '/my-team' ? 'nav-icon-active' : ''}`}
                        onClick={() => navigate('/my-team')}
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <circle cx="9" cy="7" r="4" stroke="white" strokeWidth="2" />
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M16 3.13a4 4 0 0 1 0 7.75" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                    <div className="nav-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M3 12h18M3 6h18M3 18h18" stroke="white" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="app-container">
            {/* Шапка */}
            <div className="header">
                <div className="header-left">
                    <h1 className="header-title">Хакатон Курсов</h1>
                </div>
                <div className="header-right">
                    <div className="header-logo"></div>
                    <div className="header-bell">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Полоски прогресса */}
            <div className="progress-stripes">
                {availableParticipants.map((_, index) => (
                    <div
                        key={index}
                        className={`stripe ${index === currentIndex ? 'stripe-active' : ''}`}
                    />
                ))}
            </div>

            {/* Главная карточка */}
            <div className="main-card">
                {/* Верхняя часть с фото */}
                <div className="photo-container">
                    <img
                        src={currentCard.photo || `https://i.pravatar.cc/400?img=${currentIndex + 1}`}
                        alt={currentCard.name}
                        className="photo-image"
                    />

                    {/* Теги поверх фото */}
                    {hardSkills.length > 0 && (
                        <div className="tag-purple">
                            {hardSkills.join(', ')}
                        </div>
                    )}
                    {softSkills.length > 0 && (
                        <div className="tag-beige">
                            {softSkills.join(', ')}
                        </div>
                    )}

                    {/* Имя и роль внизу фото */}
                    <div className="name-role-text">
                        <div className="name-text">{currentCard.name}, {age}</div>
                        <div className="role-text">{currentCard.role}</div>
                    </div>

                    {/* Кнопки свайпа по бокам */}
                    <button
                        className="red-button-cross"
                        onClick={() => handleSwipe('left')}
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M18 6L6 18" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M6 6L18 18" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                    <button
                        className="green-button-check"
                        onClick={() => handleSwipe('right')}
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M20 6L9 17L4 12" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                </div>

                {/* Нижняя белая часть карточки */}
                <div className="card-info-white">
                    {hasTeam && (
                        <div className="team-status-text">Есть команда</div>
                    )}
                    <div className="about-section">
                        <div className="about-title">О себе:</div>
                        <div className="about-description">{currentCard.bio}</div>
                    </div>
                </div>
            </div>

            {/* Подвал с навигацией */}
            <div className="footer-navbar">
                <div
                    className={`nav-icon ${location.pathname === '/swipe' ? 'nav-icon-active' : ''}`}
                    onClick={() => navigate('/swipe')}
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="11" cy="11" r="8" stroke="white" strokeWidth="2" />
                        <path d="m21 21-4.35-4.35" stroke="white" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                </div>
                <div
                    className={`nav-icon ${location.pathname === '/matches' ? 'nav-icon-active' : ''}`}
                    onClick={() => navigate('/matches')}
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20.84 4.61C20.3292 4.099 19.7228 3.69365 19.0554 3.41708C18.3879 3.14052 17.6725 2.99817 16.95 2.99817C16.2275 2.99817 15.5121 3.14052 14.8446 3.41708C14.1772 3.69365 13.5708 4.099 13.06 4.61L12 5.67L10.94 4.61C9.9083 3.57831 8.50903 2.99871 7.05 2.99871C5.59096 2.99871 4.19169 3.57831 3.16 4.61C2.1283 5.64169 1.54871 7.04097 1.54871 8.5C1.54871 9.95903 2.1283 11.3583 3.16 12.39L4.22 13.45L12 21.23L19.78 13.45L20.84 12.39C21.351 11.8792 21.7563 11.2728 22.0329 10.6053C22.3095 9.93789 22.4518 9.22248 22.4518 8.5C22.4518 7.77752 22.3095 7.06211 22.0329 6.39467C21.7563 5.72723 21.351 5.12087 20.84 4.61V4.61Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
                <div
                    className={`nav-icon ${location.pathname === '/my-team' ? 'nav-icon-active' : ''}`}
                    onClick={() => navigate('/my-team')}
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <circle cx="9" cy="7" r="4" stroke="white" strokeWidth="2" />
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
                <div className="nav-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3 12h18M3 6h18M3 18h18" stroke="white" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                </div>
            </div>
        </div>
    );
};

export default SwipePage;
