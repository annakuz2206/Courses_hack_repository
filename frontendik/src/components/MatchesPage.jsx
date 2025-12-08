import React, { useState } from 'react';
import './MatchesPage.css';

const MatchesPage = () => {
    const [selectedMatch, setSelectedMatch] = useState(null);
    const [showTeamModal, setShowTeamModal] = useState(null);
    const [matches, setMatches] = useState([
        {
            id: 1,
            name: "Сергей",
            age: 23,
            role: "Backend Developer",
            telegram: "@sergey_dev",
            photo: "https://i.pravatar.cc/200?img=13",
            hardSkills: ["Python", "Django", "PostgreSQL"],
            softSkills: ["Командная работа", "Ответственность"],
            about: "Backend разработчик с опытом создания масштабируемых API. Ищу команду для участия в хакатоне.",
            confidence: 0.85,
            hasTeam: false
        },
        {
            id: 2,
            name: "Мария",
            age: 22,
            role: "UX/UI Designer",
            telegram: "@maria_design",
            photo: "https://i.pravatar.cc/200?img=45",
            hardSkills: ["Figma", "Adobe XD", "Sketch"],
            softSkills: ["Креативность", "Внимание к деталям"],
            about: "Дизайнер с опытом работы над стартапами. Создаю интуитивные интерфейсы.",
            confidence: 0.75,
            hasTeam: false
        },
        {
            id: 3,
            name: "Алексей",
            age: 25,
            role: "Full-stack Developer",
            telegram: "@alex_fullstack",
            photo: "https://i.pravatar.cc/200?img=15",
            hardSkills: ["JavaScript", "React", "Node.js"],
            softSkills: ["Адаптивность", "Лидерство"],
            about: "Универсальный разработчик. Люблю решать сложные задачи и учиться новому.",
            confidence: 0.9,
            hasTeam: true
        }
    ]);

    const handleMatchClick = (match) => {
        setSelectedMatch(match);
    };

    const handleTeamInvite = (match) => {
        setShowTeamModal(match);
    };

    const handleRemoveMatch = (matchId) => {
        setMatches(matches.filter(m => m.id !== matchId));
        setSelectedMatch(null);
    };

    const handleConfirmTeamInvite = () => {
        // Логика отправки приглашения
        console.log('Приглашение отправлено:', showTeamModal);
        setShowTeamModal(null);
        setSelectedMatch(null);
    };

    return (
        <div className="matches-page-container">
            <h2 className="matches-title">Мэтчи</h2>

            {matches.length === 0 ? (
                <div className="matches-empty">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20.84 4.61C20.3292 4.099 19.7228 3.69365 19.0554 3.41708C18.3879 3.14052 17.6725 2.99817 16.95 2.99817C16.2275 2.99817 15.5121 3.14052 14.8446 3.41708C14.1772 3.69365 13.5708 4.099 13.06 4.61L12 5.67L10.94 4.61C9.9083 3.57831 8.50903 2.99871 7.05 2.99871C5.59096 2.99871 4.19169 3.57831 3.16 4.61C2.1283 5.64169 1.54871 7.04097 1.54871 8.5C1.54871 9.95903 2.1283 11.3583 3.16 12.39L4.22 13.45L12 21.23L19.78 13.45L20.84 12.39C21.351 11.8792 21.7563 11.2728 22.0329 10.6053C22.3095 9.93789 22.4518 9.22248 22.4518 8.5C22.4518 7.77752 22.3095 7.06211 22.0329 6.39467C21.7563 5.72723 21.351 5.12087 20.84 4.61V4.61Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <p>Пока нет взаимных симпатий</p>
                </div>
            ) : (
                <div className="matches-grid">
                    {matches.map((match) => (
                        <div key={match.id} className="match-card" onClick={() => handleMatchClick(match)}>
                            <div className="match-photo">
                                {match.photo ? (
                                    <img src={match.photo} alt={match.name} />
                                ) : (
                                    <div className="match-photo-placeholder">
                                        <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                )}
                            </div>
                            <div className="match-info">
                                <h3 className="match-name">{match.name}</h3>
                                <p className="match-role">{match.role}</p>
                            </div>
                            <div className="match-actions">
                                <button
                                    className="match-team-btn"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleTeamInvite(match);
                                    }}
                                >
                                    Стать командой
                                </button>
                                <button
                                    className="match-remove-btn"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleRemoveMatch(match.id);
                                    }}
                                    title="Нет, спасибо"
                                >
                                    ✕
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Модальное окно профиля */}
            {selectedMatch && (
                <div className="modal-overlay" onClick={() => setSelectedMatch(null)}>
                    <div className="match-profile-modal" onClick={(e) => e.stopPropagation()}>
                        <button className="close-profile-btn" onClick={() => setSelectedMatch(null)}>✕</button>

                        <div className="match-profile-photo">
                            {selectedMatch.photo ? (
                                <img src={selectedMatch.photo} alt={selectedMatch.name} />
                            ) : (
                                <div className="match-profile-photo-placeholder">
                                    <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                            )}
                        </div>

                        <h2 className="match-profile-name">{selectedMatch.name}, {selectedMatch.age}</h2>
                        <p className="match-profile-role">{selectedMatch.role}</p>
                        {selectedMatch.hasTeam && <p className="match-has-team">✓ Есть команда</p>}
                        <p className="match-profile-telegram">{selectedMatch.telegram}</p>

                        <div className="match-profile-section">
                            <h4 className="match-profile-section-title">Навыки:</h4>
                            <div className="match-profile-skills">
                                {selectedMatch.hardSkills.map((skill, index) => (
                                    <span key={index} className="match-profile-skill-tag">{skill}</span>
                                ))}
                            </div>
                        </div>

                        <div className="match-profile-section">
                            <h4 className="match-profile-section-title">Описание:</h4>
                            <p className="match-profile-description">{selectedMatch.about}</p>
                        </div>

                        <div className="match-profile-actions">
                            <button
                                className="match-profile-team-btn"
                                onClick={() => handleTeamInvite(selectedMatch)}
                            >
                                Стать командой
                            </button>
                            <button
                                className="match-profile-remove-btn"
                                onClick={() => handleRemoveMatch(selectedMatch.id)}
                            >
                                Нет, спасибо
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Модальное окно подтверждения создания команды */}
            {showTeamModal && (
                <div className="modal-overlay" onClick={() => setShowTeamModal(null)}>
                    <div className="team-invite-modal" onClick={(e) => e.stopPropagation()}>
                        {showTeamModal.hasTeam ? (
                            <>
                                <div className="team-modal-icon">ℹ️</div>
                                <h3 className="team-modal-title">Ой!</h3>
                                <p className="team-modal-description">
                                    Кажется, у пользователя уже есть команда. Вы можете написать ему в TG: {showTeamModal.telegram}
                                </p>
                                <button className="team-modal-ok-btn" onClick={() => setShowTeamModal(null)}>
                                    OK
                                </button>
                            </>
                        ) : (
                            <>
                                <div className="team-modal-icon">👥</div>
                                <h3 className="team-modal-title">Стать командой?</h3>
                                <p className="team-modal-description">
                                    Отправить приглашение пользователю {showTeamModal.name} стать командой?
                                </p>
                                <div className="team-modal-buttons">
                                    <button className="team-modal-confirm-btn" onClick={handleConfirmTeamInvite}>
                                        Да, отправить
                                    </button>
                                    <button className="team-modal-cancel-btn" onClick={() => setShowTeamModal(null)}>
                                        Отмена
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default MatchesPage;
