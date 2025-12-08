import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Questionnaire.css';

const Questionnaire = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        telegram: '',
        role: '',
        skills: '',
        bio: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        const token = localStorage.getItem('token');
        const skillsArray = formData.skills.split(',').map(s => s.trim());

        fetch('http://localhost:8000/api/participants/me', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({
                role: formData.role,
                skills: skillsArray,
                bio: formData.bio,
                hackathonId: 'h1',
                experienceHackathons: 0,
                telegram: formData.telegram
            })
        })
            .then(res => res.json())
            .then(data => {
                localStorage.setItem('username', formData.name);
                localStorage.setItem('profile', JSON.stringify(formData));
                navigate('/hackathon-selection');
            })
            .catch(error => {
            });
    };

    return (
        <div className="questionnaire-page">
            <div className="questionnaire-container">
                <h1>Давай заполним анкету</h1>

                <form onSubmit={handleSubmit} className="questionnaire-form">
                    <div className="form-group">
                        <label>Имя</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Например: Иван"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Telegram</label>
                        <input
                            type="text"
                            value={formData.telegram}
                            onChange={(e) => setFormData({ ...formData, telegram: e.target.value })}
                            placeholder="@username"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Твоя роль в команде</label>
                        <select
                            value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                            required
                        >
                            <option value="">Выбери роль</option>
                            <option value="Frontend">Frontend разработчик</option>
                            <option value="Backend">Backend разработчик</option>
                            <option value="Designer">Дизайнер</option>
                            <option value="Mobile">Mobile разработчик</option>
                            <option value="QA">QA инженер</option>
                            <option value="Manager">Менеджер</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Стеки, навыки</label>
                        <input
                            type="text"
                            value={formData.skills}
                            onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                            placeholder="React, TypeScript, CSS"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Описание</label>
                        <textarea
                            value={formData.bio}
                            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                            placeholder="Расскажи о своем опыте..."
                            rows={4}
                            required
                        />
                    </div>

                    <button type="submit" className="btn-submit">
                        Продолжить →
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Questionnaire;
