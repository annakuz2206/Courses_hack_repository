import React, { useState, useEffect } from 'react';
import './TeamManagement.css';

const TeamManagement = ({ onBackgroundChange, userSkillScore = 75 }) => {
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

    // Устанавливаем фон при монтировании компонента
    useEffect(() => {
        const backgroundColor = calculateBackgroundColor(userSkillScore);
        if (onBackgroundChange) {
            onBackgroundChange(backgroundColor);
        }
    }, [userSkillScore, onBackgroundChange]);

    const [teamName, setTeamName] = useState("Dream Team");
    const [isEditingName, setIsEditingName] = useState(false);
    const [newTeamName, setNewTeamName] = useState("");
    const [showInviteModal, setShowInviteModal] = useState(false);
    const [inviteLink, setInviteLink] = useState("");
    const [selectedMember, setSelectedMember] = useState(null);
    const [isLeader, setIsLeader] = useState(true); // Текущий пользователь - капитан
    const [showLeaveModal, setShowLeaveModal] = useState(false);
    const [showTransferModal, setShowTransferModal] = useState(false);
    const [showRemoveModal, setShowRemoveModal] = useState(false);
    const [memberToTransfer, setMemberToTransfer] = useState(null);
    const [memberToRemove, setMemberToRemove] = useState(null);

    const [teamMembers, setTeamMembers] = useState([
        {
            id: 1,
            name: "Вася",
            age: 22,
            role: "UX UI дизайнер",
            telegram: "@vasya_designer",
            photo: "https://i.pravatar.cc/200?img=12",
            isLeader: true,
            skills: ["Figma", "Adobe XD", "Sketch"],
            description: "Опытный дизайнер с фокусом на UX. Создаю интуитивные интерфейсы."
        },
        {
            id: 2,
            name: "Лена",
            age: 24,
            role: "Backend-разработчик",
            telegram: "@lena_backend",
            photo: "https://i.pravatar.cc/200?img=45",
            isLeader: false,
            skills: ["Python", "Django", "PostgreSQL"],
            description: "Backend разработчик. Специализируюсь на создании API и работе с базами данных."
        },
        {
            id: 3,
            name: "Ваня",
            age: 21,
            role: "Frontend-разработчик",
            telegram: "@vanya_frontend",
            photo: null,
            isLeader: false,
            skills: ["React", "TypeScript", "CSS"],
            description: "Frontend разработчик. Люблю создавать красивые и функциональные интерфейсы."
        }
    ]);

    const handleRemoveMember = (memberId, e) => {
        e.stopPropagation();
        setMemberToRemove(memberId);
        setShowRemoveModal(true);
    };

    const confirmRemoveMember = () => {
        setTeamMembers(teamMembers.filter(m => m.id !== memberToRemove));
        setShowRemoveModal(false);
        setMemberToRemove(null);
        setSelectedMember(null);
    };

    const handleTransferLeadership = (memberId, e) => {
        e.stopPropagation();
        setMemberToTransfer(memberId);
        setShowTransferModal(true);
    };

    const confirmTransferLeadership = () => {
        setTeamMembers(teamMembers.map(m => ({
            ...m,
            isLeader: m.id === memberToTransfer
        })));
        setIsLeader(false);
        setShowTransferModal(false);
        setMemberToTransfer(null);
        setSelectedMember(null);
    };

    const handleLeaveTeam = () => {
        setShowLeaveModal(true);
    };

    const confirmLeaveTeam = () => {
        // Проверяем, является ли пользователь капитаном
        if (isLeader) {
            alert('Вы капитан команды! Сначала передайте капитанство другому участнику.');
            setShowLeaveModal(false);
            return;
        }

        // Логика выхода из команды
        console.log('Покинуть команду');
        setShowLeaveModal(false);
    };

    const handleEditName = () => {
        setNewTeamName(teamName);
        setIsEditingName(true);
    };

    const handleSaveName = () => {
        if (newTeamName.trim()) {
            setTeamName(newTeamName.trim());
            setIsEditingName(false);
        }
    };

    const handleCancelEdit = () => {
        setIsEditingName(false);
        setNewTeamName("");
    };

    const handleInvite = () => {
        // Генерация уникальной ссылки
        const uniqueId = Math.random().toString(36).substr(2, 9);
        const link = `itamhack.ru/invite/${uniqueId}`;
        setInviteLink(link);
        setShowInviteModal(true);
    };

    const handleCopyLink = () => {
        navigator.clipboard.writeText(inviteLink);
    };

    const handleMemberClick = (member) => {
        setSelectedMember(member);
    };

    return (
        <div className="team-management-container">
            {/* Заголовок страницы */}
            <h1 className="page-title">Моя команда</h1>

            {/* Название команды */}
            <div className="team-name-section">
                {!isEditingName ? (
                    <div className="team-name-display">
                        <h2 className="team-name-title">{teamName}</h2>
                        {isLeader && (
                            <button className="edit-name-icon-btn" onClick={handleEditName} title="Изменить название">
                                ✏️
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="team-name-edit">
                        <input
                            type="text"
                            className="team-name-input"
                            value={newTeamName}
                            onChange={(e) => setNewTeamName(e.target.value)}
                            placeholder="Введите название команды"
                            autoFocus
                        />
                        <div className="edit-buttons">
                            <button className="save-name-btn" onClick={handleSaveName}>✓</button>
                            <button className="cancel-name-btn" onClick={handleCancelEdit}>✕</button>
                        </div>
                    </div>
                )}
            </div>

            {/* Список участников */}
            <div className="team-members-list">
                {teamMembers.map((member) => (
                    <div key={member.id} className="member-card-item" onClick={() => handleMemberClick(member)}>
                        {/* Фото участника */}
                        <div className="member-photo-container">
                            {member.photo ? (
                                <img src={member.photo} alt={member.name} className="member-photo-img" />
                            ) : (
                                <div className="member-photo-placeholder">
                                    <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                            )}
                        </div>

                        {/* Информация об участнике */}
                        <div className="member-info-section">
                            <div className="member-name-row">
                                <h3 className="member-name-text">{member.name},</h3>
                                {member.isLeader && (
                                    <span className="crown-icon">👑</span>
                                )}
                            </div>
                            <p className="member-role-text">{member.role}</p>
                            <p className="member-telegram-text">{member.telegram}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Кнопки действий */}
            {isLeader && (
                <button className="invite-team-button" onClick={handleInvite}>
                    Пригласить в команду
                </button>
            )}

            <button className="leave-team-button" onClick={handleLeaveTeam}>
                Покинуть команду
            </button>

            {/* Модальное окно подтверждения выхода */}
            {showLeaveModal && (
                <div className="modal-overlay" onClick={() => setShowLeaveModal(false)}>
                    <div className="modal-content leave-modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="warning-icon-large">⚠️</div>
                        <h3 className="modal-title">Покинуть команду?</h3>
                        <p className="modal-description">
                            {isLeader
                                ? "Вы капитан команды! Сначала передайте капитанство другому участнику."
                                : "Вы уверены, что хотите покинуть команду? Это действие нельзя отменить."
                            }
                        </p>
                        <div className="modal-buttons">
                            {!isLeader && (
                                <button className="confirm-leave-button" onClick={confirmLeaveTeam}>
                                    Да, покинуть
                                </button>
                            )}
                            <button className="cancel-leave-button" onClick={() => setShowLeaveModal(false)}>
                                {isLeader ? "Понятно" : "Отмена"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Модальное окно приглашения */}
            {showInviteModal && (
                <div className="modal-overlay" onClick={() => setShowInviteModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h3 className="modal-title">Ссылка-приглашение</h3>
                        <p className="modal-description">Отправьте эту ссылку друзьям в Telegram</p>
                        <div className="invite-link-container">
                            <input
                                type="text"
                                className="invite-link-input"
                                value={inviteLink}
                                readOnly
                            />
                        </div>
                        <button className="copy-link-button" onClick={handleCopyLink}>
                            Скопировать ссылку
                        </button>
                        <button className="close-modal-button" onClick={() => setShowInviteModal(false)}>
                            Закрыть
                        </button>
                    </div>
                </div>
            )}

            {/* Модальное окно передачи капитанства */}
            {showTransferModal && (
                <div className="modal-overlay" onClick={() => setShowTransferModal(false)}>
                    <div className="modal-content leave-modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="warning-icon-large">👑</div>
                        <h3 className="modal-title">Передать капитанство?</h3>
                        <p className="modal-description">
                            Вы уверены, что хотите передать капитанство этому участнику?
                        </p>
                        <div className="modal-buttons">
                            <button className="confirm-leave-button" onClick={confirmTransferLeadership}>
                                Да
                            </button>
                            <button className="cancel-leave-button" onClick={() => setShowTransferModal(false)}>
                                Нет
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Модальное окно удаления участника */}
            {showRemoveModal && (
                <div className="modal-overlay" onClick={() => setShowRemoveModal(false)}>
                    <div className="modal-content leave-modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="warning-icon-large">⚠️</div>
                        <h3 className="modal-title">Удалить участника?</h3>
                        <p className="modal-description">
                            Вы уверены, что хотите удалить этого участника из команды?
                        </p>
                        <div className="modal-buttons">
                            <button className="confirm-leave-button" onClick={confirmRemoveMember}>
                                Да
                            </button>
                            <button className="cancel-leave-button" onClick={() => setShowRemoveModal(false)}>
                                Нет
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Модальное окно профиля участника */}
            {selectedMember && (
                <div className="modal-overlay" onClick={() => setSelectedMember(null)}>
                    <div className="member-profile-modal" onClick={(e) => e.stopPropagation()}>
                        <button className="close-profile-btn" onClick={() => setSelectedMember(null)}>✕</button>

                        {selectedMember.photo ? (
                            <img src={selectedMember.photo} alt={selectedMember.name} className="profile-photo-large" />
                        ) : (
                            <div className="profile-photo-placeholder-large">
                                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                        )}

                        <div className="profile-name-row">
                            <h2 className="profile-name">{selectedMember.name}, {selectedMember.age}</h2>
                            {selectedMember.isLeader && <span className="profile-crown-badge">👑</span>}
                        </div>
                        <p className="profile-role">{selectedMember.role}</p>

                        <div className="profile-skills-section">
                            <h4 className="profile-section-title">Навыки:</h4>
                            <div className="profile-skills-list">
                                {selectedMember.skills.map((skill, index) => (
                                    <span key={index} className="profile-skill-tag">{skill}</span>
                                ))}
                            </div>
                        </div>

                        <div className="profile-description-section">
                            <h4 className="profile-section-title">Описание:</h4>
                            <p className="profile-description-text">{selectedMember.description}</p>
                        </div>

                        {/* Кнопки действий для капитана */}
                        {isLeader && !selectedMember.isLeader && (
                            <div className="profile-action-buttons">
                                <button
                                    className="profile-transfer-btn"
                                    onClick={(e) => handleTransferLeadership(selectedMember.id, e)}
                                >
                                    👑 Сделать капитаном
                                </button>
                                <button
                                    className="profile-remove-btn"
                                    onClick={(e) => handleRemoveMember(selectedMember.id, e)}
                                >
                                    Удалить из команды
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default TeamManagement;
