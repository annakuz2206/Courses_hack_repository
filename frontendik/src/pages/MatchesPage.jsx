import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { mockParticipants } from '../data/mockData';
import './MatchesPage.css';

const MatchesPage = () => {
    const navigate = useNavigate();
    const { matches } = useApp();

    const matchedParticipants = matches.map(match => {
        return mockParticipants.find(p => p.id === match.id);
    }).filter(Boolean);

    return (
        <div className="matches-page">
            <div className="tabs">
                <button className="tab" onClick={() => navigate('/swipe')}>
                    🔍 Поиск
                </button>
                <button className="tab active" onClick={() => navigate('/matches')}>
                    ❤️ Мэтчи
                </button>
                <button className="tab" onClick={() => navigate('/my-team')}>
                    👥 Моя команда
                </button>
            </div>

            <div className="matches-content gradient-blur-bg">
                <div className="matches-container">
                    <h1 className="matches-title">Мэтчи</h1>

                    {matchedParticipants.length === 0 ? (
                        <div className="glass-card empty-matches">
                            <div className="empty-icon">❤️</div>
                            <p>Пока нет мэтчей</p>
                            <span>Продолжай свайпать вправо, чтобы найти команду!</span>
                            <button
                                className="btn-gradient"
                                style={{ marginTop: '24px' }}
                                onClick={() => navigate('/swipe')}
                            >
                                Начать свайпать
                            </button>
                        </div>
                    ) : (
                        <div className="matches-list">
                            {matchedParticipants.map((participant) => (
                                <div key={participant.id} className="glass-card match-card">
                                    <div className="match-header">
                                        <h3 className="match-name">{participant.name}</h3>
                                        <p className="match-role">{participant.role}</p>
                                    </div>

                                    <div className="match-skills">
                                        {participant.skills.map((skill, index) => (
                                            <span key={index} className="match-skill">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>

                                    <p className="match-bio">{participant.bio}</p>

                                    <button
                                        className="btn-gradient"
                                        onClick={() => alert(`Связаться с ${participant.name} (функция в разработке)`)}
                                    >
                                        💬 Связаться
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MatchesPage;
