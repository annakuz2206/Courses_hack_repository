import React, { useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import ProfileView from '../components/ProfileView';
import SearchPage from '../components/SearchPage';
import TeamManagement from '../components/TeamManagement';
import NotificationsPanel from '../components/NotificationsPanel';
import MatchesPage from '../components/MatchesPage';
import './HackathonDetailPage.css';

const HackathonDetailPage = () => {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('info');
    const [showWarning, setShowWarning] = useState(false);
    const [showParticipateNotification, setShowParticipateNotification] = useState(false);
    const [showCancelParticipationModal, setShowCancelParticipationModal] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [currentUserIndex, setCurrentUserIndex] = useState(0);
    const [backgroundColor, setBackgroundColor] = useState('#000000');
    const [selectedRoles, setSelectedRoles] = useState([]);

    // Получаем состояние активации поиска из localStorage для конкретного хакатона
    const [isSearchActive, setIsSearchActive] = useState(() => {
        const saved = localStorage.getItem(`searchActive_${id}`);
        return saved === 'true';
    });

    // Получаем состояние участия из localStorage для конкретного хакатона
    const [isParticipating, setIsParticipating] = useState(() => {
        const saved = localStorage.getItem(`participating_${id}`);
        return saved === 'true';
    });

    // Моковые данные пользователей для свайпа
    const mockUsers = [
        {
            id: 1,
            name: "Владимир",
            age: 20,
            role: "Frontend-разработчик",
            hardSkills: ["Python", "TypeScript", "React", "Node.js"],
            softSkills: ["Анализ", "Коммуникабельность"],
            about: "Backend/Fullstack dev. Ищу тиммейта для самого амбициозного хакатона. Опыт работы с React, Node.js и PostgreSQL. Участвовал в 3 хакатонах, одна победа.",
            telegram: "@vladimir_dev",
            photo: "https://i.pravatar.cc/600?img=12",
            confidence: 0.8
        },
        {
            id: 2,
            name: "Мария",
            age: 22,
            role: "UX/UI Designer",
            hardSkills: ["Figma", "Adobe XD", "Sketch", "Photoshop"],
            softSkills: ["Креативность", "Внимание к деталям"],
            about: "Дизайнер с опытом работы над стартапами. Создаю интуитивные интерфейсы, которые нравятся пользователям. Ищу команду для создания крутого продукта!",
            telegram: "@maria_design",
            photo: "https://i.pravatar.cc/600?img=45",
            confidence: 0.6
        },
        {
            id: 3,
            name: "Дмитрий",
            age: 25,
            role: "Backend Developer",
            hardSkills: ["Node.js", "Python", "PostgreSQL", "Docker"],
            softSkills: ["Системное мышление", "Ответственность"],
            about: "Специализируюсь на создании масштабируемых API и микросервисной архитектуре. Опыт работы 4 года. Готов взять на себя backend часть проекта.",
            telegram: "@dmitry_backend",
            photo: "https://i.pravatar.cc/600?img=33",
            confidence: 0.9
        },
        {
            id: 4,
            name: "Анна",
            age: 23,
            role: "Product Manager",
            hardSkills: ["Agile", "Jira", "Analytics", "Miro"],
            softSkills: ["Лидерство", "Организация"],
            about: "Помогу организовать работу команды и довести проект до победы! Опыт управления командами до 8 человек. Знаю, как превратить идею в продукт.",
            telegram: "@anna_pm",
            photo: "https://i.pravatar.cc/600?img=47",
            confidence: 0.4
        },
        {
            id: 5,
            name: "Алексей",
            age: 24,
            role: "Full-stack Developer",
            hardSkills: ["JavaScript", "Vue.js", "Express", "MongoDB"],
            softSkills: ["Адаптивность", "Командная работа"],
            about: "Универсальный разработчик с опытом создания веб-приложений от начала до конца. Люблю решать сложные задачи и учиться новому.",
            telegram: "@alex_fullstack",
            photo: "https://i.pravatar.cc/600?img=15",
            confidence: 0.75
        },
        {
            id: 6,
            name: "Екатерина",
            age: 21,
            role: "Data Scientist",
            hardSkills: ["Python", "TensorFlow", "Pandas", "SQL"],
            softSkills: ["Аналитическое мышление", "Внимательность"],
            about: "Специализируюсь на машинном обучении и анализе данных. Могу построить предиктивные модели и визуализировать результаты. Ищу команду для AI-проекта.",
            telegram: "@kate_data",
            photo: "https://i.pravatar.cc/600?img=48",
            confidence: 0.85
        },
        {
            id: 7,
            name: "Игорь",
            age: 26,
            role: "DevOps Engineer",
            hardSkills: ["Kubernetes", "AWS", "CI/CD", "Terraform"],
            softSkills: ["Проблемное мышление", "Автоматизация"],
            about: "Настраиваю инфраструктуру и автоматизирую процессы развертывания. Опыт работы с облачными платформами и контейнеризацией.",
            telegram: "@igor_devops",
            photo: "https://i.pravatar.cc/600?img=68",
            confidence: 0.7
        },
        {
            id: 8,
            name: "София",
            age: 22,
            role: "Mobile Developer",
            hardSkills: ["React Native", "Swift", "Kotlin", "Firebase"],
            softSkills: ["Креативность", "Пользовательский опыт"],
            about: "Разрабатываю мобильные приложения для iOS и Android. Фокусируюсь на производительности и удобстве использования. Участвовала в 5 хакатонах.",
            telegram: "@sofia_mobile",
            photo: "https://i.pravatar.cc/600?img=44",
            confidence: 0.95
        }
    ];

    // Получаем данные хакатона из state или используем заглушку
    const hackathon = location.state?.hackathon || {
        id: id,
        title: "Хакатон",
        fullDescription: "Описание хакатона",
        team: "2 - 4 участника",
        date: "01.01.26 - 03.01.26",
        status: "Регистрация открыта",
        img: "https://placehold.co/66x66/2a1b3d/FFF?text=H"
    };

    const handleTabChange = (tab) => {
        // Проверяем, нужна ли активация поиска для этой вкладки
        if ((tab === 'search' || tab === 'matches') && !isSearchActive) {
            setShowWarning(true);
            return;
        }
        setActiveTab(tab);
    };

    const handleCloseWarning = () => {
        setShowWarning(false);
    };

    const handleParticipate = () => {
        if (isParticipating) {
            setShowCancelParticipationModal(true);
        } else {
            setShowParticipateNotification(true);
        }
    };

    const handleCloseParticipateNotification = () => {
        setShowParticipateNotification(false);
        setIsParticipating(true);
        // Сохраняем состояние в localStorage для конкретного хакатона
        localStorage.setItem(`participating_${id}`, 'true');
    };

    const handleCancelParticipation = () => {
        setIsParticipating(false);
        localStorage.setItem(`participating_${id}`, 'false');
        setShowCancelParticipationModal(false);
    };

    const handleCloseCancelModal = () => {
        setShowCancelParticipationModal(false);
    };

    const handleLike = () => {
        console.log('Liked user:', mockUsers[currentUserIndex]);
        setCurrentUserIndex(currentUserIndex + 1);
    };

    const handleDislike = () => {
        console.log('Disliked user:', mockUsers[currentUserIndex]);
        setCurrentUserIndex(currentUserIndex + 1);
    };

    const toggleSearchMode = () => {
        const newState = !isSearchActive;
        setIsSearchActive(newState);
        // Сохраняем состояние в localStorage для конкретного хакатона
        localStorage.setItem(`searchActive_${id}`, newState.toString());
    };

    // Функция для обновления фона телефона
    const handleBackgroundChange = (color) => {
        setBackgroundColor(color);
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'info':
                return (
                    <div className="tab-content">
                        {/* Картинка хакатона */}
                        <div className="hackathon-image-container">
                            <img src={hackathon.img} alt={hackathon.title} className="hackathon-main-image" />
                        </div>

                        <div className="hackathon-info-section">
                            <div className="info-row">
                                <span className="info-label">Участники:</span>
                                <span className="info-value">{hackathon.team}</span>
                            </div>
                            <div className="info-row">
                                <span className="info-label">Даты:</span>
                                <span className="info-value">{hackathon.date}</span>
                            </div>
                            <div className="info-row">
                                <span className="info-label">Статус:</span>
                                <span className="info-status">{hackathon.status}</span>
                            </div>
                        </div>

                        <div className="hackathon-description-section">
                            <h3 className="section-title">Описание</h3>
                            <p className="description-text">{hackathon.fullDescription}</p>
                        </div>

                        {/* Кнопки действий */}
                        <div className="buttons-container">
                            <button
                                className={`btn-participate ${isParticipating ? 'participating' : ''}`}
                                onClick={handleParticipate}
                            >
                                {isParticipating ? 'Вы участник' : 'Хочу участвовать'}
                            </button>
                            <button
                                className={`btn-search ${isSearchActive ? 'active' : ''}`}
                                onClick={toggleSearchMode}
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                {isSearchActive ? 'Поиск активен' : 'Активировать поиск'}
                            </button>
                            <button className="btn-back" onClick={() => navigate('/hackathons')}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M19 12H5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                Назад к списку хакатонов
                            </button>
                        </div>
                    </div>
                );
            case 'search':
                // Фильтруем пользователей по выбранным ролям
                const filteredUsers = selectedRoles.length === 0
                    ? mockUsers
                    : mockUsers.filter(user => {
                        // Проверяем, содержит ли роль пользователя одну из выбранных ролей
                        return selectedRoles.some(role =>
                            user.role.toLowerCase().includes(role.toLowerCase())
                        );
                    });

                return <SearchPage
                    currentUser={currentUserIndex < filteredUsers.length ? filteredUsers[currentUserIndex] : null}
                    onBackgroundChange={handleBackgroundChange}
                    onSwipeLeft={handleDislike}
                    onSwipeRight={handleLike}
                    hasMore={currentUserIndex < filteredUsers.length - 1}
                    selectedRoles={selectedRoles}
                    onRolesChange={setSelectedRoles}
                />;
            case 'team':
                return <TeamManagement onBackgroundChange={handleBackgroundChange} userSkillScore={75} />;
            case 'matches':
                return <MatchesPage />;
            case 'profile':
                return (
                    <div className="tab-content">
                        <h2 className="tab-title">Настройки</h2>

                        <div className="settings-list">
                            <button className="settings-item" onClick={() => navigate('/profile')}>
                                <div className="settings-item-content">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    <span className="settings-item-text">Редактировать профиль</span>
                                </div>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>

                            <button className="settings-item">
                                <div className="settings-item-content">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    <span className="settings-item-text">Сменить тему</span>
                                </div>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>

                            <button className="settings-item">
                                <div className="settings-item-content">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M22 11.08V12C21.9988 14.1564 21.3005 16.2547 20.0093 17.9818C18.7182 19.709 16.9033 20.9725 14.8354 21.5839C12.7674 22.1953 10.5573 22.1219 8.53447 21.3746C6.51168 20.6273 4.78465 19.2461 3.61096 17.4371C2.43727 15.628 1.87979 13.4881 2.02168 11.3363C2.16356 9.18455 2.99721 7.13631 4.39828 5.49706C5.79935 3.85781 7.69279 2.71537 9.79619 2.24013C11.8996 1.76489 14.1003 1.98232 16.07 2.86" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M22 4L12 14.01L9 11.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    <span className="settings-item-text">Фильтр уведомлений</span>
                                </div>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="hackathon-detail-page" style={{ backgroundColor: (activeTab === 'search' || activeTab === 'team') ? backgroundColor : '#000000' }}>
            {/* Aurora эллипсы - фиксированный фон за всем (скрываем при свайпе и в команде, показываем когда анкеты закончились) */}
            <div className="aurora-background-fixed" style={{ display: (activeTab === 'search' && currentUserIndex < mockUsers.length) || activeTab === 'team' ? 'none' : 'block' }}>
                <div className="aurora-ellipse ellipse-orange-small-top"></div>
                <div className="aurora-ellipse ellipse-65-top"></div>
                <div className="aurora-ellipse ellipse-pink-top"></div>
                <div className="aurora-ellipse ellipse-66-top"></div>
                <div className="aurora-ellipse ellipse-64-top"></div>
                <div className="aurora-ellipse ellipse-68-top"></div>
                <div className="aurora-ellipse ellipse-68-top-right"></div>
                <div className="aurora-ellipse ellipse-orange-small-mid"></div>
                <div className="aurora-ellipse ellipse-65-mid"></div>
                <div className="aurora-ellipse ellipse-66-mid"></div>
                <div className="aurora-ellipse ellipse-64-mid"></div>
                <div className="aurora-ellipse ellipse-68-mid"></div>
                <div className="aurora-ellipse ellipse-orange-small-bot"></div>
                <div className="aurora-ellipse ellipse-68-bottom"></div>
                <div className="aurora-ellipse ellipse-65-bot"></div>
                <div className="aurora-ellipse ellipse-66-bot"></div>
                <div className="aurora-ellipse ellipse-67-bot"></div>
                <div className="aurora-ellipse ellipse-64-bot"></div>
                <div className="aurora-ellipse ellipse-68-bot"></div>
            </div>

            {/* Верхняя панель - приклеена к верху */}
            <div className="top-header">
                <h2 className="header-title">{hackathon.title}</h2>
                <button className="notifications-btn" aria-label="Уведомления" onClick={() => setShowNotifications(true)}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M13.73 21C13.5542 21.3031 13.3019 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6982 21.5547 10.4458 21.3031 10.27 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
            </div>

            {/* Скроллируемая область контента */}
            <div className="hackathon-detail-content">
                <div className="hackathon-detail-inner">
                    {renderContent()}
                </div>
            </div>

            {/* Предупреждение - модальное окно */}
            {showWarning && (
                <div className="warning-overlay" onClick={handleCloseWarning}>
                    <div className="warning-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="warning-icon">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M12 8V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M12 16H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <h3 className="warning-title">Активируйте режим поиска</h3>
                        <p className="warning-text">Чтобы участвовать в поиске команды и просматривать симпатии, активируйте режим поиска, нажав на "Активировать поиск"</p>
                        <button className="warning-ok-btn" onClick={handleCloseWarning}>
                            ОК
                        </button>
                    </div>
                </div>
            )}

            {/* Нижняя навигационная панель */}
            <div className="bottom-nav">
                <button
                    className={`nav-item ${activeTab === 'info' ? 'active' : ''}`}
                    onClick={() => handleTabChange('info')}
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M12 16V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M12 8H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
                <button
                    className={`nav-item ${activeTab === 'search' ? 'active' : ''} ${!isSearchActive ? 'disabled' : ''}`}
                    onClick={() => handleTabChange('search')}
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
                <button
                    className={`nav-item ${activeTab === 'team' ? 'active' : ''}`}
                    onClick={() => handleTabChange('team')}
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
                <button
                    className={`nav-item ${activeTab === 'matches' ? 'active' : ''} ${!isSearchActive ? 'disabled' : ''}`}
                    onClick={() => handleTabChange('matches')}
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20.84 4.61C20.3292 4.099 19.7228 3.69365 19.0554 3.41708C18.3879 3.14052 17.6725 2.99817 16.95 2.99817C16.2275 2.99817 15.5121 3.14052 14.8446 3.41708C14.1772 3.69365 13.5708 4.099 13.06 4.61L12 5.67L10.94 4.61C9.9083 3.57831 8.50903 2.99871 7.05 2.99871C5.59096 2.99871 4.19169 3.57831 3.16 4.61C2.1283 5.64169 1.54871 7.04097 1.54871 8.5C1.54871 9.95903 2.1283 11.3583 3.16 12.39L4.22 13.45L12 21.23L19.78 13.45L20.84 12.39C21.351 11.8792 21.7563 11.2728 22.0329 10.6053C22.3095 9.93789 22.4518 9.22248 22.4518 8.5C22.4518 7.77752 22.3095 7.06211 22.0329 6.39467C21.7563 5.72723 21.351 5.12087 20.84 4.61V4.61Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
                <button
                    className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
                    onClick={() => handleTabChange('profile')}
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <circle cx="12" cy="5" r="1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <circle cx="12" cy="19" r="1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
            </div>

            {/* Предупреждение - модальное окно */}
            {showWarning && (
                <div className="warning-overlay" onClick={handleCloseWarning}>
                    <div className="warning-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="warning-icon">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M12 8V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M12 16H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <h3 className="warning-title">Активируйте режим поиска</h3>
                        <p className="warning-text">Чтобы участвовать в поиске команды и просматривать симпатии, активируйте режим поиска, нажав на "Активировать поиск"</p>
                        <button className="warning-ok-btn" onClick={handleCloseWarning}>
                            ОК
                        </button>
                    </div>
                </div>
            )}

            {/* Уведомление об участии */}
            {showParticipateNotification && (
                <div className="warning-overlay" onClick={handleCloseParticipateNotification}>
                    <div className="warning-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="warning-icon">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M22 11.08V12C21.9988 14.1564 21.3005 16.2547 20.0093 17.9818C18.7182 19.709 16.9033 20.9725 14.8354 21.5839C12.7674 22.1953 10.5573 22.1219 8.53447 21.3746C6.51168 20.6273 4.78465 19.2461 3.61096 17.4371C2.43727 15.628 1.87979 13.4881 2.02168 11.3363C2.16356 9.18455 2.99721 7.13631 4.39828 5.49706C5.79935 3.85781 7.69279 2.71537 9.79619 2.24013C11.8996 1.76489 14.1003 1.98232 16.07 2.86" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M22 4L12 14.01L9 11.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <h3 className="warning-title">ITAM</h3>
                        <p className="warning-text">Вы занесены в базу как участник данного хакатона</p>
                        <button className="warning-ok-btn" onClick={handleCloseParticipateNotification}>
                            ОК
                        </button>
                    </div>
                </div>
            )}

            {/* Модальное окно отказа от участия */}
            {showCancelParticipationModal && (
                <div className="warning-overlay" onClick={handleCloseCancelModal}>
                    <div className="warning-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="warning-icon">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M12 8V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M12 16H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <h3 className="warning-title">Хотите отказаться от участия?</h3>
                        <div className="modal-buttons">
                            <button className="confirm-leave-button" onClick={handleCancelParticipation}>
                                Да
                            </button>
                            <button className="cancel-leave-button" onClick={handleCloseCancelModal}>
                                Нет
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* Панель уведомлений */}
            <NotificationsPanel isOpen={showNotifications} onClose={() => setShowNotifications(false)} />
        </div>
    );
};

export default HackathonDetailPage;
