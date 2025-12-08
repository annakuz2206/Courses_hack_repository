import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { mockHackathons } from '../data/mockData';
import './HackathonsPage.css';

const HackathonsPage = () => {
    const navigate = useNavigate();
    const { selectHackathon, selectRole } = useApp();

    const [selectedHackathon, setSelectedHackathon] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const handleCardClick = (hackathon) => {
        if (hackathon.isActive) {
            setSelectedHackathon(hackathon);
            setShowModal(true);
        }
    };

    const handleSearchTeam = () => {
        // Функция отключена
        setShowModal(false);
    };

    const handleCreateTeam = () => {
        selectHackathon(selectedHackathon);
        setShowModal(false);
        navigate('/create-team');
    };

    return (
        <div className="hackathons-page gradient-blur-bg">
            <div className="hackathons-container">
                <h1 className="hackathons-title">Выбери хакатон</h1>

                <div className="hackathons-list">
                    {mockHackathons.map((hackathon) => (
                        <div
                            key={hackathon.id}
                            className={`glass-card hackathon-card ${hackathon.isActive ? 'active' : 'inactive'}`}
                            onClick={() => handleCardClick(hackathon)}
                        >
                            <div className="hackathon-content">
                                <div className="hackathon-emoji">{hackathon.emoji}</div>
                                <div className="hackathon-info">
                                    <h3 className="hackathon-name">
                                        {hackathon.name}
                                    </h3>
                                    <div className="hackathon-date">
                                        <span>📅</span>
                                        <span>{hackathon.date}</span>
                                    </div>
                                    {!hackathon.isActive && (
                                        <span className="hackathon-badge">
                                            Скоро
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {showModal && selectedHackathon && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="glass-card modal-content" onClick={(e) => e.stopPropagation()}>
                        <button
                            className="modal-close"
                            onClick={() => setShowModal(false)}
                        >
                            ✕
                        </button>

                        <div className="modal-emoji">{selectedHackathon.emoji}</div>

                        <h2 className="modal-title">
                            {selectedHackathon.name}
                        </h2>

                        <div className="modal-date">
                            <span>📅</span>
                            <span>{selectedHackathon.date}</span>
                        </div>

                        <p className="modal-description">
                            {selectedHackathon.description}
                        </p>

                        <div className="modal-buttons">
                            <button
                                className="btn-gradient"
                                onClick={handleSearchTeam}
                            >
                                Я ищу команду
                            </button>

                            <button
                                className="btn-secondary"
                                onClick={handleCreateTeam}
                            >
                                Создать команду
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HackathonsPage;
