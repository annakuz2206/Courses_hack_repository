import React from 'react';
import './ConfidenceSlider.css';

// Функция для интерполяции цвета между черным и фиолетовым
const calculateColor = (value) => {
    // value от 0 до 1
    const percentage = value;

    // Черный: #000000 (0, 0, 0)
    // Фиолетовый: #AE00FF (174, 0, 255)
    const r = Math.round(174 * percentage);
    const g = 0;
    const b = Math.round(255 * percentage);

    return `rgb(${r}, ${g}, ${b})`;
};

const ConfidenceSlider = ({ role, value, onChange, onClose }) => {
    const currentColor = calculateColor(value);
    const percentage = Math.round(value * 100);

    const handleConfirm = () => {
        onClose();
    };

    return (
        <div className="confidence-modal-overlay" onClick={onClose}>
            <div className="confidence-modal" onClick={(e) => e.stopPropagation()}>
                <div className="confidence-slider-container">
                    <h3 className="confidence-title">Насколько ты уверен в своих способностях?</h3>

                    <div className="role-indicator">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M16.6667 5L7.50004 14.1667L3.33337 10" stroke="#AE00FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span className="role-text">{role}</span>
                    </div>

                    <div className="slider-wrapper">
                        <div className="slider-track-container">
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.01"
                                value={value}
                                onChange={(e) => onChange(parseFloat(e.target.value))}
                                className="confidence-range"
                                style={{
                                    background: `linear-gradient(to right, #000000 0%, ${currentColor} ${percentage}%, rgba(255, 255, 255, 0.1) ${percentage}%)`
                                }}
                            />
                        </div>

                        <div className="percentage-display">{percentage}%</div>
                    </div>

                    <button onClick={handleConfirm} className="confirm-button">
                        Подтвердить
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfidenceSlider;
