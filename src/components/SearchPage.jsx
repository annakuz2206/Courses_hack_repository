import React, { useEffect, useState } from 'react';
import './SearchPage.css';

const SearchPage = ({ currentUser, onBackgroundChange, onSwipeLeft, onSwipeRight, hasMore, selectedRoles = [], onRolesChange }) => {
    const [showFilterModal, setShowFilterModal] = useState(false);

    const roles = ['Frontend', 'Backend', 'Design', 'Mobile', 'QA', 'Manager', 'Fullstack'];

    const toggleRole = (role) => {
        if (selectedRoles.includes(role)) {
            onRolesChange(selectedRoles.filter(r => r !== role));
        } else {
            onRolesChange([...selectedRoles, role]);
        }
    };

    const clearFilters = () => {
        onRolesChange([]);
    };
    // Функция для вычисления цвета фона на основе скилла (0-100)
    const calculateBackgroundColor = (score) => {
        // Начальный цвет (черный)
        const startR = 0, startG = 0, startB = 0;
        // Конечный цвет (насыщенный фиолетовый)
        const endR = 139, endG = 92, endB = 246;

        // Интерполяция каждого канала
        const newR = Math.round(startR + (endR - startR) * (score / 100));
        const newG = Math.round(startG + (endG - startG) * (score / 100));
        const newB = Math.round(startB + (endB - startB) * (score / 100));

        return `rgb(${newR}, ${newG}, ${newB})`;
    };

    // Преобразуем confidence (0-1) в skillScore (0-100)
    const skillScore = currentUser ? Math.round(currentUser.confidence * 100) : 0;

    // Формируем данные пользователя для отображения
    const displayUser = currentUser ? {
        name: currentUser.name,
        age: currentUser.age,
        role: currentUser.role,
        photo: currentUser.photo,
        status: "Есть команда",
        skills: currentUser.hardSkills || ["Python", "TypeScript", "React", "Node.js"],
        description: currentUser.about || "Описание отсутствует"
    } : null;

    // Обновляем фон родительского компонента при изменении пользователя
    useEffect(() => {
        const backgroundColor = calculateBackgroundColor(skillScore);
        if (onBackgroundChange) {
            onBackgroundChange(backgroundColor);
        }
    }, [skillScore]);

    return (
        <div className="app-container">
            <div className="search-header">
                <h2 className="search-page-title">Поиск участников</h2>
                <button className="filter-button" onClick={() => setShowFilterModal(true)}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22 3H2L10 12.46V19L14 21V12.46L22 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Фильтры
                    {selectedRoles.length > 0 && <span className="filter-badge">{selectedRoles.length}</span>}
                </button>
            </div>
            {!currentUser ? (
                <div className="no-more-cards">
                    <p className="no-more-text">Больше анкет<br />пока что нету</p>
                    <p className="no-more-subtext">Попробуйте позже</p>
                </div>
            ) : (
                <>
                    {/* Обертка для карточки и кнопок */}
                    <div className="card-wrapper">
                        {/* Главная карточка */}
                        <div className="main-card">
                            {/* Верхняя секция - Фотография с градиентом */}
                            <div className="photo-section">
                                <img
                                    src={displayUser.photo}
                                    alt={displayUser.name}
                                    className="user-photo-bg"
                                />

                                {/* Темный градиент поверх фото */}
                                <div className="photo-gradient"></div>

                                {/* Текст на фото (левый нижний угол) */}
                                <div className="photo-text-overlay">
                                    <h2 className="user-name-overlay">{displayUser.name}, {displayUser.age}</h2>
                                    <p className="user-role-overlay">{displayUser.role}</p>
                                </div>
                            </div>

                            {/* Нижняя секция - Информация (белый фон, скругленные углы) */}
                            <div className="info-section">
                                <div className="status-badge">
                                    {displayUser.status}
                                </div>

                                <div className="info-block">
                                    <h3 className="info-title">Навыки/Стек:</h3>
                                    <div className="skills-tags">
                                        {displayUser.skills.map((skill, index) => (
                                            <span key={index} className="skill-tag">{skill}</span>
                                        ))}
                                    </div>
                                </div>

                                <div className="info-block">
                                    <h3 className="info-title">Описание:</h3>
                                    <p className="info-description">
                                        {displayUser.description}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Кнопки свайпа (вынесены за пределы карточки) */}
                        <button className="swipe-button-external swipe-button-left" onClick={onSwipeLeft}>
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                                <path d="M18 6L6 18M6 6L18 18" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                            </svg>
                        </button>
                        <button className="swipe-button-external swipe-button-right" onClick={onSwipeRight}>
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                                <path d="M20 6L9 17L4 12" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                    </div>
                </>
            )}

            {/* Модальное окно фильтров */}
            {showFilterModal && (
                <div className="filter-modal-overlay" onClick={() => setShowFilterModal(false)}>
                    <div className="filter-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="filter-modal-header">
                            <h3 className="filter-modal-title">Кто нужен вашей команде?</h3>
                            <button className="filter-close-btn" onClick={() => setShowFilterModal(false)}>✕</button>
                        </div>

                        <div className="filter-roles-list">
                            {roles.map((role) => (
                                <button
                                    key={role}
                                    className={`filter-role-item ${selectedRoles.includes(role) ? 'selected' : ''}`}
                                    onClick={() => toggleRole(role)}
                                >
                                    <span className="filter-role-checkbox">
                                        {selectedRoles.includes(role) && '✓'}
                                    </span>
                                    <span className="filter-role-text">{role}</span>
                                </button>
                            ))}
                        </div>

                        <div className="filter-modal-actions">
                            <button className="filter-clear-btn" onClick={clearFilters}>
                                Сбросить
                            </button>
                            <button className="filter-apply-btn" onClick={() => setShowFilterModal(false)}>
                                Применить
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SearchPage;
