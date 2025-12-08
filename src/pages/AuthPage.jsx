import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import './AuthPage.css';

const AuthPage = () => {
    const navigate = useNavigate();
    const { login } = useApp();
    const [code, setCode] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (code.trim()) {
            login(code);
            navigate('/profile');
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                {/* Заголовок */}
                <h1 className="auth-title">Cntrl+team</h1>

                {/* Контейнер-обертка для формы и пятен */}
                <div className="form-container">
                    {/* ГРУППА 1 (Верхняя) - Aurora эффект */}
                    <div className="aurora-ellipse ellipse-68-top"></div>
                    <div className="aurora-ellipse ellipse-64-top"></div>
                    <div className="aurora-ellipse ellipse-66-top"></div>
                    <div className="aurora-ellipse ellipse-65-top"></div>

                    {/* ГРУППА 2 (Средняя) */}
                    <div className="aurora-ellipse ellipse-68-mid"></div>
                    <div className="aurora-ellipse ellipse-64-mid"></div>
                    <div className="aurora-ellipse ellipse-66-mid"></div>
                    <div className="aurora-ellipse ellipse-65-mid"></div>

                    {/* ГРУППА 3 (Нижняя) */}
                    <div className="aurora-ellipse ellipse-68-bot"></div>
                    <div className="aurora-ellipse ellipse-64-bot"></div>
                    <div className="aurora-ellipse ellipse-67-bot"></div>
                    <div className="aurora-ellipse ellipse-66-bot"></div>
                    <div className="aurora-ellipse ellipse-65-bot"></div>
                    <div className="aurora-ellipse ellipse-pink-bot"></div>

                    {/* Стеклянная карточка поверх всех пятен */}
                    <div className="glass-card">
                        <h2 className="auth-form-title">Вход</h2>

                        <form onSubmit={handleSubmit} className="auth-form-wrapper">
                            <label className="auth-form-label">Код от бота</label>
                            <input
                                type="text"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                placeholder="Введите код"
                                className="auth-input"
                                required
                            />

                            <button type="submit" className="auth-submit-btn">
                                Войти
                            </button>
                        </form>

                        <a
                            href="https://t.me/very_cool_hack_bot"
                            className="auth-bot-link"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            t.me/very_cool_hack_bot
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;
