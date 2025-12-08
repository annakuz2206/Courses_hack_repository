import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import './MyTeamPage.css';

const MyTeamPage = () => {
    const navigate = useNavigate();
    const { myTeam, role, removeMemberFromTeam, leaveTeam } = useApp();

    const handleRemoveMember = (memberId) => {
        if (window.confirm('Удалить участника из команды?')) {
            removeMemberFromTeam(memberId);
        }
    };

    const handleLeaveTeam = () => {
        const message = role === 'captain'
            ? 'Вы уверены, что хотите распустить команду?'
            : 'Вы уверены, что хотите покинуть команду?';

        if (window.confirm(message)) {
            leaveTeam();
            navigate('/swipe');
        }
    };

    return (
        <div className="team-page">
            <div className="tabs">
                <button className="tab" onClick={() => navigate('/swipe')}>
                    🔍 Поиск
                </button>
                <button className="tab" onClick={() => navigate('/matches')}>
                    ❤️ Мэтчи
                </button>
                <button className="tab active" onClick={() => navigate('/my-team')}>
                    👥 Моя команда
                </button>
            </div>

            <div className="team-content gradient-blur-bg">
                <div className="team-container">
                    {!myTeam ? (
                        <div className="glass-card no-team">
                            <div className="no-team-icon">👥</div>
                            <h1>У вас нет команды</h1>
                            <p>Создайте команду или найдите существующую</p>
                            <button
                                className="btn-gradient"
                                onClick={() => navigate('/create-team')}
                            >
                                Создать команду
                            </button>
                        </div>
                    ) : (
                        <div className="team-sections">
                            <div className="glass-card team-header-card">
                                <h1 className="team-name">{myTeam.name}</h1>

                                {role === 'captain' && (
                                    <div className="captain-badge">
                                        <span>👑</span>
                                        <span>Вы капитан</span>
                                    </div>
                                )}
                            </div>

                            <div className="glass-card members-card">
                                <h2 className="members-title">Участники команды</h2>

                                <div className="members-list">
                                    {myTeam.members.map((member) => (
                                        <div key={member.id} className="member-item">
                                            <div className="member-info">
                                                <h3 className="member-name">
                                                    {member.name}
                                                    {member.isCaptain && <span>👑</span>}
                                                </h3>
                                                <p className="member-role">{member.role}</p>
                                            </div>

                                            {role === 'captain' && !member.isCaptain && (
                                                <button
                                                    className="remove-btn"
                                                    onClick={() => handleRemoveMember(member.id)}
                                                >
                                                    Удалить
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <button
                                className="leave-btn"
                                onClick={handleLeaveTeam}
                            >
                                {role === 'captain' ? '🚪 Распустить команду' : '🚪 Покинуть команду'}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MyTeamPage;
