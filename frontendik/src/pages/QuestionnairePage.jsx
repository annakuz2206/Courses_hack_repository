import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './QuestionnairePage.css';

const QuestionnairePage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        role: '',
        confidence: 0.5,
        skills: [],
        description: '',
        telegram: '',
        photo: null
    });
    const [currentSkill, setCurrentSkill] = useState('');

    const roles = ['Frontend', 'Backend', 'Design', 'Mobile', 'QA', 'Manager', 'Fullstack'];

    const handleAddSkill = (e) => {
        if ((e.key === 'Enter' || e.key === ',') && currentSkill.trim()) {
            e.preventDefault();
            if (!formData.skills.includes(currentSkill.trim())) {
                setFormData({ ...formData, skills: [...formData.skills, currentSkill.trim()] });
            }
            setCurrentSkill('');
        }
    };

    const handleRemoveSkill = (skillToRemove) => {
        setFormData({
            ...formData,
            skills: formData.skills.filter(skill => skill !== skillToRemove)
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Здесь отправка данных на бэкенд
        navigate('/hackathon-selection');
    };

    return (
        <div className="questionnaire-page">
            <div className="mesh-background">
                <div className="ellipse ellipse-64"></div>
                <div className="ellipse ellipse-65"></div>
                <div className="ellipse ellipse-66"></div>
                <div className="ellipse ellipse-68-big"></div>
                <div className="ellipse ellipse-67-bot"></div>
            </div>

            <div className="questionnaire-container">
                <div className="form-container-q">
                    {/* Aurora эллипсы */}
                    <div className="aurora-ellipse ellipse-68-top"></div>
                    <div className="aurora-ellipse ellipse-64-top"></div>
                    <div className="aurora-ellipse ellipse-66-top"></div>
                    <div className="aurora-ellipse ellipse-65-top"></div>
                    <div className="aurora-ellipse ellipse-68-mid"></div>
                    <div className="aurora-ellipse ellipse-64-mid"></div>
                    <div className="aurora-ellipse ellipse-66-mid"></div>
                    <div className="aurora-ellipse ellipse-65-mid"></div>
                    <div className="aurora-ellipse ellipse-68-bot"></div>
                    <div className="aurora-ellipse ellipse-64-bot"></div>
                    <div className="aurora-ellipse ellipse-67-bot"></div>
                    <div className="aurora-ellipse ellipse-66-bot"></div>
                    <div className="aurora-ellipse ellipse-65-bot"></div>

                    <div className="glass-card-q">
                        <h1 className="questionnaire-title">Давай заполним анкету!</h1>

                        <form onSubmit={handleSubmit} className="questionnaire-form">
                            {/* Имя */}
                            <div className="form-field">
                                <label className="field-label">Имя</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Введите ваше имя"
                                    className="glass-input"
                                    required
                                />
                            </div>

                            {/* Роль */}
                            <div className="form-field">
                                <label className="field-label">Роль в команде</label>
                                <select
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                    className="glass-input glass-select"
                                    required
                                >
                                    <option value="">Выберите роль</option>
                                    {roles.map(role => (
                                        <option key={role} value={role}>{role}</option>
                                    ))}
                                </select>

                                {/* Слайдер уверенности */}
                                {formData.role && (
                                    <div className="confidence-slider">
                                        <label className="slider-label">
                                            Уровень уверенности: {formData.confidence.toFixed(1)}
                                        </label>
                                        <input
                                            type="range"
                                            min="0"
                                            max="1"
                                            step="0.1"
                                            value={formData.confidence}
                                            onChange={(e) => setFormData({ ...formData, confidence: parseFloat(e.target.value) })}
                                            className="glass-slider"
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Навыки */}
                            <div className="form-field">
                                <label className="field-label">Навыки</label>
                                <div className="skills-container">
                                    {formData.skills.map(skill => (
                                        <div key={skill} className="skill-tag">
                                            {skill}
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveSkill(skill)}
                                                className="remove-skill"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                <input
                                    type="text"
                                    value={currentSkill}
                                    onChange={(e) => setCurrentSkill(e.target.value)}
                                    onKeyDown={handleAddSkill}
                                    placeholder="Введите навык и нажмите Enter"
                                    className="glass-input"
                                />
                            </div>

                            {/* Описание */}
                            <div className="form-field">
                                <label className="field-label">Описание</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Расскажите о себе"
                                    className="glass-input glass-textarea"
                                    rows="5"
                                />
                            </div>

                            {/* Telegram */}
                            <div className="form-field">
                                <label className="field-label">Telegram</label>
                                <input
                                    type="text"
                                    value={formData.telegram}
                                    onChange={(e) => setFormData({ ...formData, telegram: e.target.value })}
                                    placeholder="@username"
                                    className="glass-input"
                                />
                            </div>

                            {/* Фото */}
                            <div className="form-field">
                                <label className="field-label">Фото профиля</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setFormData({ ...formData, photo: e.target.files[0] })}
                                    className="glass-file-input"
                                    id="photo-upload"
                                />
                                <label htmlFor="photo-upload" className="file-upload-btn">
                                    Загрузить фото
                                </label>
                            </div>

                            <button type="submit" className="submit-btn">
                                Дальше
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuestionnairePage;
