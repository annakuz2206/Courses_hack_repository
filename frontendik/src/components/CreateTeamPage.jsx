import React, { useState } from 'react';
import './CreateTeamPage.css';

const CreateTeamPage = () => {
    const [teamName, setTeamName] = useState('');
    const [memberTelegrams, setMemberTelegrams] = useState(['']);
    const [teamMembers, setTeamMembers] = useState([]);
    const [isTeamCreated, setIsTeamCreated] = useState(false);

    const addTelegramField = () => {
        setMemberTelegrams([...memberTelegrams, '']);
    };

    const updateTelegram = (index, value) => {
        const updated = [...memberTelegrams];
        updated[index] = value;
        setMemberTelegrams(updated);
    };

    const removeTelegramField = (index) => {
        const updated = memberTelegrams.filter((_, i) => i !== index);
        setMemberTelegrams(updated);
    };

    const handleCreateTeam = () => {
        if (!teamName.trim()) {
            alert('Введите название команды');
            return;
        }

        // Фильтруем пустые поля
        const validTelegrams = memberTelegrams.filter(t => t.trim());

        if (validTelegrams.length === 0) {
            alert('Добавьте хотя бы одного участника');
            return;
        }

        // Имитация загрузки участников
        const members = validTelegrams.map((telegram, index) => {
            // Случайно определяем, зарегистрирован ли пользователь
            const isRegistered = Math.random() > 0.3;

            return {
                id: index,
                telegram: telegram,
                isRegistered: isRegistered,
                name: isRegistered ? `Участник ${index + 1}` : null,
                photo: isRegistered ? `https://i.pravatar.cc/100?img=${index + 10}` : null,
                role: isRegistered ? 'Разработчик' : null
            };
        });

        setTeamMembers(members);
        setIsTeamCreated(true);
    };

    const handleSendInvitations = () => {
        alert('Приглашения отправлены всем участникам!');
    };

    // Если команда создана, показываем другой интерфейс
    if (isTeamCreated) {
        return (
            <div className="create-team-container">
                <div className="create-team-card">
                    <h1 className="create-team-title">Моя команда</h1>

                    <div className="team-info-section">
                        <h2 className="team-name-display">{teamName}</h2>
                    </div>

                    <div className="team-members-section">
                        <h3 className="section-label">Участники</h3>
                        <div className="members-list">
                            {teamMembers.map((member) => (
                                <div key={member.id} className="member-card">
                                    {member.isRegistered ? (
                                        <>
                                            <img
                                                src={member.photo}
                                                alt={member.name}
                                                className="member-photo"
                                            />
                                            <div className="member-info">
                                                <p className="member-name">{member.name}</p>
                                                <p className="member-role">{member.role}</p>
                                                <p className="member-telegram">{member.telegram}</p>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="member-photo-placeholder">
                                                <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                                                    <circle cx="12" cy="8" r="4" stroke="#9CA3AF" strokeWidth="2" />
                                                    <path d="M4 20C4 16.6863 6.68629 14 10 14H14C17.3137 14 20 16.6863 20 20" stroke="#9CA3AF" strokeWidth="2" />
                                                </svg>
                                            </div>
                                            <div className="member-info">
                                                <p className="member-name">Не зарегистрирован</p>
                                                <p className="member-telegram">{member.telegram}</p>
                                            </div>
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <button className="invite-btn" onClick={handleSendInvitations}>
                        Отправить приглашение на вступление в команду
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="create-team-container">
            <div className="create-team-card">
                <h1 className="create-team-title">Создать команду</h1>

                <div className="form-section">
                    <label className="form-label">Название команды</label>
                    <input
                        type="text"
                        className="form-input"
                        placeholder="Введите название команды"
                        value={teamName}
                        onChange={(e) => setTeamName(e.target.value)}
                    />
                </div>

                <div className="form-section">
                    <label className="form-label">Участники команды</label>
                    {memberTelegrams.map((telegram, index) => (
                        <div key={index} className="telegram-input-row">
                            <input
                                type="text"
                                className="form-input telegram-input"
                                placeholder="@username"
                                value={telegram}
                                onChange={(e) => updateTelegram(index, e.target.value)}
                            />
                            {memberTelegrams.length > 1 && (
                                <button
                                    className="remove-btn"
                                    onClick={() => removeTelegramField(index)}
                                >
                                    ✕
                                </button>
                            )}
                        </div>
                    ))}
                    <button className="add-member-btn" onClick={addTelegramField}>
                        + Добавить участника
                    </button>
                </div>

                <button className="create-btn" onClick={handleCreateTeam}>
                    Создать команду
                </button>
            </div>
        </div>
    );
};

export default CreateTeamPage;
