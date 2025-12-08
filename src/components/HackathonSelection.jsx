import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './HackathonSelection.css';

const HackathonSelection = () => {
    const navigate = useNavigate();
    const [selectedHackathon, setSelectedHackathon] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const hackathons = [
        {
            id: 'h1',
            name: 'ITAM Hackathon 2025',
            participants: '2 - 4 участника',
            date: '5 декабря 2025',
            description: 'Главный хакатон года для студентов ИТАМ. Создай инновационный проект за 48 часов! Призовой фонд 500 000₽',
            isActive: true,
        },
        {
            id: 'h2',
            name: 'Tech Challenge',
            participants: '3 - 5 участников',
            date: '15 января 2026',
            description: 'Технологический челлендж для разработчиков. Реши реальные задачи бизнеса. Призы от партнеров!',
            isActive: true,
        },
        {
            id: 'h3',
            name: 'AI Hackathon',
            participants: '2 - 5 участников',
            date: 'Скоро...',
            description: 'Хакатон по искусственному интеллекту. Подробности скоро!',
            isActive: false,
        },
    ];

    const handleCardClick = (hackathon) => {
        if (hackathon.isActive) {
            setSelectedHackathon(hackathon);
            setShowModal(true);
        }
    };

    const handleParticipate = () => {
        localStorage.setItem('selectedHackathon', JSON.stringify(selectedHackathon));
        setShowModal(false);
        navigate('/team-status');
    };

    return (
        <div className="hackathon-page">
            <div className="hackathon-container">
                <h1>Выбери хакатон</h1>

                <div className="hackathon-list">
                    {hackathons.map((h) => (
                        <div
                            key={h.id}
                            className={`hackathon-card ${!h.isActive ? 'disabled' : ''}`}
                            onClick={() => handleCardClick(h)}
                        >
                            <h3>{h.name}</h3>
                            <div className="hackathon-info">
                                <span>{h.participants}</span>
                                <span>{h.date}</span>
                            </div>
                            {!h.isActive && <div className="badge">Скоро</div>}
                        </div>
                    ))}
                </div>
            </div>

            {showModal && selectedHackathon && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-close" onClick={() => setShowModal(false)}>
                            ✕
                        </button>

                        <h2>{selectedHackathon.name}</h2>

                        <div className="modal-info">
                            <div className="info-item">
                                <span>{selectedHackathon.participants}</span>
                            </div>
                            <div className="info-item">
                                <span>{selectedHackathon.date}</span>
                            </div>
                        </div>

                        <p className="modal-description">{selectedHackathon.description}</p>

                        <button className="btn-participate" onClick={handleParticipate}>
                            Хочу участвовать!
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HackathonSelection;
