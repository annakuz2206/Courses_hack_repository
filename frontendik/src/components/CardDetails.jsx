import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './CardDetails.css';

const CardDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // Моковые данные
    const cardData = {
        name: 'AI Ninjas',
        description: 'Делаем AI-сервис для студентов, который поможет с учебой',
        lookingFor: ['Frontend', 'Designer'],
        members: ['Илья (Backend)', 'Дима (ML)'],
        skills: ['Python', 'PyTorch', 'Node.js', 'PostgreSQL'],
    };

    return (
        <div className="card-details-page">
            <div className="card-details-container">
                <button onClick={() => navigate(-1)} className="back-btn">
                    ← Назад
                </button>

                <div className="card-details-content">
                    <div className="card-details-header">
                        <h1>{cardData.name}</h1>
                    </div>

                    <div className="card-section">
                        <h3>О команде</h3>
                        <p>{cardData.description}</p>
                    </div>

                    <div className="card-section">
                        <h3>Ищут</h3>
                        <div className="tags">
                            {cardData.lookingFor.map((role, i) => (
                                <span key={i} className="tag">{role}</span>
                            ))}
                        </div>
                    </div>

                    <div className="card-section">
                        <h3>Участники</h3>
                        <ul className="members-list">
                            {cardData.members.map((member, i) => (
                                <li key={i}>{member}</li>
                            ))}
                        </ul>
                    </div>

                    <div className="card-section">
                        <h3>Технологии</h3>
                        <div className="tags">
                            {cardData.skills.map((skill, i) => (
                                <span key={i} className="tag-skill">{skill}</span>
                            ))}
                        </div>
                    </div>

                    <button className="btn-like">
                        Отправить заявку
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CardDetails;
