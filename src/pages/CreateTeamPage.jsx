import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import './CreateTeamPage.css';

const CreateTeamPage = () => {
    const navigate = useNavigate();
    const { createTeam } = useApp();

    const [teamName, setTeamName] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        createTeam({
            name: teamName,
        });
        navigate('/my-team');
    };

    return (
        <div className="create-team-page gradient-blur-bg">
            <div className="create-team-container">
                <button
                    className="back-btn"
                    onClick={() => navigate(-1)}
                >
                    ← Назад
                </button>

                <h1 className="create-team-title">Создание команды</h1>

                <form onSubmit={handleSubmit} className="create-team-form">
                    <div className="glass-card profile-field">
                        <div className="field-header">
                            <span className="field-icon">👥</span>
                            <label className="field-label">
                                Название команды
                            </label>
                        </div>
                        <input
                            type="text"
                            value={teamName}
                            onChange={(e) => setTeamName(e.target.value)}
                            placeholder="Например: Code Warriors"
                            className="input-field"
                            required
                        />
                    </div>

                    <button type="submit" className="btn-gradient">
                        Создать команду
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateTeamPage;
