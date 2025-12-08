import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './TeamCreation.css';

const TeamCreation = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        teamName: '',
        description: '',
        lookingFor: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        const token = localStorage.getItem('token');
        const myId = localStorage.getItem('authCode');
        const rolesArray = formData.lookingFor.split(',').map(r => r.trim());

        fetch('http://localhost:8000/api/teams', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({
                name: formData.teamName,
                hackathonId: 'h1',
                captainId: myId,
                lookingForRoles: rolesArray,
                description: formData.description
            })
        })
            .then(res => res.json())
            .then(data => {
                localStorage.setItem('teamData', JSON.stringify(formData));
                localStorage.setItem('userRole', 'captain');
                navigate('/feed');
            })
            .catch(error => {
            });
    };

    return (
        <div className="team-creation-page">
            <div className="team-creation-container">
                <button onClick={() => navigate(-1)} className="back-btn">
                    ← Назад
                </button>

                <h1>Создание команды</h1>
                <p className="subtitle">Заполни информацию о команде</p>

                <form onSubmit={handleSubmit} className="team-form">
                    <div className="form-group">
                        <label>Название команды</label>
                        <input
                            type="text"
                            value={formData.teamName}
                            onChange={(e) => setFormData({ ...formData, teamName: e.target.value })}
                            placeholder="Например: Code Warriors"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Описание проекта/идеи</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Расскажи о вашей идее..."
                            rows={4}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Кого ищем? (через запятую)</label>
                        <input
                            type="text"
                            value={formData.lookingFor}
                            onChange={(e) => setFormData({ ...formData, lookingFor: e.target.value })}
                            placeholder="Frontend, Designer, Backend"
                            required
                        />
                    </div>

                    <button type="submit" className="btn-create">
                        Создать команду и начать поиск →
                    </button>
                </form>
            </div>
        </div>
    );
};

export default TeamCreation;
