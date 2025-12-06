import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './TeamSearch.css';

const TeamSearch = () => {
    const navigate = useNavigate();
    const [hasTeam, setHasTeam] = useState(false);

    return (
        <div className="team-search-page">
            <div className="team-search-container">
                <h1>Поиск команды</h1>
                <p className="team-search-subtitle">
                    Найди человека с командой или создай свою
                </p>

                <div className="team-search-actions">
                    <button
                        onClick={() => navigate('/feed')}
                        className="action-btn primary"
                    >
                        <span className="btn-icon">🔍</span>
                        <div>
                            <h3>Найти человека</h3>
                            <p>Присоединиться к существующей команде</p>
                        </div>
                    </button>

                    <button
                        onClick={() => navigate('/team-creation')}
                        className="action-btn secondary"
                    >
                        <span className="btn-icon">➕</span>
                        <div>
                            <h3>Создать команду</h3>
                            <p>Собрать свою команду с нуля</p>
                        </div>
                    </button>
                </div>

                <label className="checkbox-label">
                    <input
                        type="checkbox"
                        checked={hasTeam}
                        onChange={(e) => setHasTeam(e.target.checked)}
                    />
                    <span>У меня уже есть команда</span>
                </label>

                <button
                    onClick={() => navigate('/feed')}
                    className="btn-start"
                >
                    Начать поиск →
                </button>
            </div>
        </div>
    );
};

export default TeamSearch;
