import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ConfidenceSlider from '../components/ConfidenceSlider';
import './ProfilePage.css';

const ProfilePage = () => {
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
    const [showConfidenceModal, setShowConfidenceModal] = useState(false);

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
        navigate('/hackathons');
    };

    return (
        <div className="profile-page">
            <div className="profile-container">
                <div className="form-container-profile">
                    {/* Aurora эллипсы */}
                    <div className="aurora-ellipse ellipse-68-top-right"></div>
                    <div className="aurora-ellipse ellipse-68-top"></div>
                    <div className="aurora-ellipse ellipse-64-top"></div>
                    <div className="aurora-ellipse ellipse-66-top"></div>
                    <div className="aurora-ellipse ellipse-pink-top"></div>
                    <div className="aurora-ellipse ellipse-65-top"></div>
                    <div className="aurora-ellipse ellipse-orange-small-top"></div>
                    <div className="aurora-ellipse ellipse-68-mid"></div>
                    <div className="aurora-ellipse ellipse-64-mid"></div>
                    <div className="aurora-ellipse ellipse-66-mid"></div>
                    <div className="aurora-ellipse ellipse-65-mid"></div>
                    <div className="aurora-ellipse ellipse-orange-small-mid"></div>
                    <div className="aurora-ellipse ellipse-68-bot"></div>
                    <div className="aurora-ellipse ellipse-64-bot"></div>
                    <div className="aurora-ellipse ellipse-67-bot"></div>
                    <div className="aurora-ellipse ellipse-66-bot"></div>
                    <div className="aurora-ellipse ellipse-65-bot"></div>
                    <div className="aurora-ellipse ellipse-68-bottom"></div>
                    <div className="aurora-ellipse ellipse-orange-small-bot"></div>

                    <div className="glass-card-profile">
                        <h1 className="profile-title">Давай заполним анкету!</h1>

                        <form onSubmit={handleSubmit} className="profile-form">
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

                            {/* Telegram */}
                            <div className="form-field">
                                <label className="field-label">Telegram</label>
                                <input
                                    type="text"
                                    value={formData.telegram}
                                    onChange={(e) => setFormData({ ...formData, telegram: e.target.value })}
                                    placeholder="@username"
                                    className="glass-input"
                                    disabled
                                />
                            </div>

                            {/* Роль */}
                            <div className="form-field">
                                <label className="field-label">Роль в команде</label>
                                <div className="custom-select-wrapper">
                                    <select
                                        value={formData.role}
                                        onChange={(e) => {
                                            setFormData({ ...formData, role: e.target.value });
                                            if (e.target.value) {
                                                setShowConfidenceModal(true);
                                            }
                                        }}
                                        className="glass-input glass-select"
                                        required
                                    >
                                        <option value="">Выберите роль</option>
                                        {roles.map(role => (
                                            <option key={role} value={role}>{role}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Навыки */}
                            <div className="form-field">
                                <label className="field-label">Навыки/стек технологий</label>
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
                                <textarea
                                    value={currentSkill}
                                    onChange={(e) => setCurrentSkill(e.target.value)}
                                    onKeyDown={handleAddSkill}
                                    placeholder="Укажите свои навыки и стек (программы, которыми пользуетесь)"
                                    className="glass-input skills-input"
                                    rows="3"
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

            {/* Модальное окно слайдера уверенности */}
            {showConfidenceModal && formData.role && (
                <ConfidenceSlider
                    role={formData.role}
                    value={formData.confidence}
                    onChange={(value) => setFormData({ ...formData, confidence: value })}
                    onClose={() => setShowConfidenceModal(false)}
                />
            )}
        </div>
    );
};

export default ProfilePage;
