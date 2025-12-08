import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './TeamStatus.css';

const TeamStatus = () => {
    const navigate = useNavigate();
    const [hasTeam, setHasTeam] = useState(null);
    const [showTeamForm, setShowTeamForm] = useState(false);
    const [showChoiceForm, setShowChoiceForm] = useState(false);
    const [teamData, setTeamData] = useState({
        name: '',
        lookingFor: '',
        members: '',
    });

    const handleHasTeam = () => {
        setHasTeam(true);
        setShowTeamForm(true);
    };

    const handleNoTeam = () => {
        setHasTeam(false);
        setShowChoiceForm(true);
    };

    const handleTeamSubmit = (e) => {
        e.preventDefault();
        localStorage.setItem('teamData', JSON.stringify(teamData));
        localStorage.setItem('userRole', 'captain');
        navigate('/feed');
    };

    const handleSearchTeam = () => {
        localStorage.setItem('userRole', 'participant');
        navigate('/feed');
    };

    const handleCreateTeam = () => {
        localStorage.setItem('userRole', 'captain');
        navigate('/team-creation');
    };

    return (
        <div className="team-status-page">
            <div className="team-status-container">
                {!hasTeam && !showChoiceForm && (
                    <>
                        <h1>У тебя есть команда?</h1>
                        <p className="subtitle">Давай определимся с твоим статусом</p>

                        <div className="choice-buttons">
                            <button className="choice-btn yes" onClick={handleHasTeam}>
                                <div>
                                    <h3>Да, есть команда</h3>
                                    <p>Расскажу о своей команде</p>
                                </div>
                            </button>

                            <button className="choice-btn no" onClick={handleNoTeam}>
                                <div>
                                    <h3>Нет, я один</h3>
                                    <p>Хочу найти команду</p>
                                </div>
                            </button>
                        </div>
                    </>
                )}

                {showTeamForm && (
                    <div className="team-form-container">
                        <h1>Расскажи о команде</h1>
                        <p className="subtitle">Заполни информацию</p>

                        <form onSubmit={handleTeamSubmit} className="team-form">
                            <div className="form-group">
                                <label>Название команды</label>
                                <input
                                    type="text"
                                    value={teamData.name}
                                    onChange={(e) => setTeamData({ ...teamData, name: e.target.value })}
                                    placeholder="Например: Code Warriors"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Кого ищем? (через запятую)</label>
                                <input
                                    type="text"
                                    value={teamData.lookingFor}
                                    onChange={(e) => setTeamData({ ...teamData, lookingFor: e.target.value })}
                                    placeholder="Frontend, Designer"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Кто уже в команде? (через запятую)</label>
                                <input
                                    type="text"
                                    value={teamData.members}
                                    onChange={(e) => setTeamData({ ...teamData, members: e.target.value })}
                                    placeholder="Иван (Backend), Петр (ML)"
                                    required
                                />
                            </div>

                            <button type="submit" className="btn-submit">
                                Начать поиск →
                            </button>
                        </form>
                    </div>
                )}

                {showChoiceForm && (
                    <div className="choice-form-container">
                        <h1>Что хочешь сделать?</h1>
                        <p className="subtitle">Выбери свой путь</p>

                        <div className="choice-buttons">
                            <button className="choice-btn" onClick={handleSearchTeam}>
                                <div>
                                    <h3>Искать команду</h3>
                                    <p>Найду готовую команду</p>
                                </div>
                            </button>

                            <button className="choice-btn" onClick={handleCreateTeam}>
                                <div>
                                    <h3>Создать команду</h3>
                                    <p>Буду капитаном</p>
                                </div>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TeamStatus;
