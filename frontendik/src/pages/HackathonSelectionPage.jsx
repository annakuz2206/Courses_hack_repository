import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HackathonSelectionPage.css';

const HackathonSelectionPage = () => {
    const navigate = useNavigate();

    const hackathons = [
        {
            id: 1,
            title: "Премия хакатоны России",
            fullDescription: "Всероссийский конкурс инновационных проектов для студентов и молодых специалистов. Создайте решение, которое изменит будущее России!",
            team: "2 - 4 участника",
            date: "05.12.25 - 07.12.25",
            status: "Регистрация открыта",
            img: "https://placehold.co/66x66/2a1b3d/FFF?text=X"
        },
        {
            id: 2,
            title: "Хакатон Курсов",
            fullDescription: "Разработайте инновационную образовательную платформу, которая сделает обучение доступным и интересным для всех.",
            team: "3 - 5 участников",
            date: "10.01.26 - 12.01.26",
            status: "Скоро начало",
            img: "https://placehold.co/66x66/2a1b3d/FFF?text=K"
        },
        {
            id: 3,
            title: "Urban Tech",
            fullDescription: "Создайте технологическое решение для умных городов. IoT, AI, Big Data - используйте все возможности современных технологий!",
            team: "1 - 3 участника",
            date: "15.02.26 - 17.02.26",
            status: "Регистрация открыта",
            img: "https://placehold.co/66x66/2a1b3d/FFF?text=U"
        },
        {
            id: 4,
            title: "AI Challenge 2026",
            fullDescription: "Разработайте AI-решение для реальных бизнес-задач. Машинное обучение, нейросети, компьютерное зрение - покажите свои навыки!",
            team: "2 - 5 участников",
            date: "20.03.26 - 22.03.26",
            status: "Регистрация открыта",
            img: "https://placehold.co/66x66/2a1b3d/FFF?text=AI"
        },
        {
            id: 5,
            title: "FinTech Hackathon",
            fullDescription: "Создайте инновационное финтех-решение. Блокчейн, криптовалюты, цифровые платежи - будущее финансов в ваших руках!",
            team: "2 - 4 участника",
            date: "05.04.26 - 07.04.26",
            status: "Регистрация открыта",
            img: "https://placehold.co/66x66/2a1b3d/FFF?text=FT"
        },
        {
            id: 6,
            title: "Green Tech",
            fullDescription: "Разработайте решение для защиты окружающей среды. Возобновляемая энергия, переработка отходов, умное потребление.",
            team: "1 - 4 участника",
            date: "15.05.26 - 17.05.26",
            status: "Скоро начало",
            img: "https://placehold.co/66x66/2a1b3d/FFF?text=GT"
        },
        {
            id: 7,
            title: "GameDev Jam",
            fullDescription: "Создайте игру с нуля за 48 часов! Unity, Unreal Engine, Godot - выбирайте свой инструмент и творите!",
            team: "1 - 5 участников",
            date: "01.06.26 - 03.06.26",
            status: "Регистрация открыта",
            img: "https://placehold.co/66x66/2a1b3d/FFF?text=GD"
        }
    ];

    const handleCardClick = (hackathon) => {
        // Переход на страницу конкретного хакатона
        navigate(`/hackathon/${hackathon.id}`, { state: { hackathon } });
    };

    return (
        <div className="hackathon-selection-page">
            <div className="hackathon-container">
                <div className="hackathon-content">
                    {/* Aurora эллипсы */}
                    <div className="aurora-ellipse ellipse-orange-small-top"></div>
                    <div className="aurora-ellipse ellipse-65-top"></div>
                    <div className="aurora-ellipse ellipse-pink-top"></div>
                    <div className="aurora-ellipse ellipse-66-top"></div>
                    <div className="aurora-ellipse ellipse-64-top"></div>
                    <div className="aurora-ellipse ellipse-68-top"></div>
                    <div className="aurora-ellipse ellipse-68-top-right"></div>
                    <div className="aurora-ellipse ellipse-orange-small-mid"></div>
                    <div className="aurora-ellipse ellipse-65-mid"></div>
                    <div className="aurora-ellipse ellipse-66-mid"></div>
                    <div className="aurora-ellipse ellipse-64-mid"></div>
                    <div className="aurora-ellipse ellipse-68-mid"></div>


                    <div className="hackathon-inner">
                        <h1 className="hackathon-title">Выбери хакатон</h1>

                        <div className="hackathon-list">
                            {hackathons.map((hackathon) => (
                                <div
                                    key={hackathon.id}
                                    className="hackathon-card"
                                    onClick={() => handleCardClick(hackathon)}
                                >
                                    <img
                                        src={hackathon.img}
                                        alt={hackathon.title}
                                        className="hackathon-logo"
                                    />
                                    <div className="hackathon-content-wrapper">
                                        <h3 className="hackathon-name">{hackathon.title}</h3>
                                        <div className="hackathon-meta">
                                            <span className="hackathon-team">{hackathon.team}</span>
                                            {hackathon.date && (
                                                <span className="hackathon-date-inline">{hackathon.date}</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HackathonSelectionPage;
