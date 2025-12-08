import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import './App.css';

import AuthPage from './pages/AuthPage';
import QuestionnairePage from './pages/QuestionnairePage';
import ProfilePage from './pages/ProfilePage';
import HackathonSelectionPage from './pages/HackathonSelectionPage';
import HackathonDetailPage from './pages/HackathonDetailPage';
import CreateTeamPage from './pages/CreateTeamPage';
import SwipePage from './pages/SwipePage';
import MatchesPage from './pages/MatchesPage';
import MyTeamPage from './pages/MyTeamPage';

function App() {
    return (
        <AppProvider>
            <Router>
                <div className="app-background">
                    <div className="iphone-container">
                        <Routes>
                            <Route path="/" element={<AuthPage />} />
                            <Route path="/questionnaire" element={<QuestionnairePage />} />
                            <Route path="/profile" element={<ProfilePage />} />
                            <Route path="/hackathons" element={<HackathonSelectionPage />} />
                            <Route path="/hackathon/:id" element={<HackathonDetailPage />} />
                            <Route path="/create-team" element={<CreateTeamPage />} />
                            <Route path="/swipe" element={<SwipePage />} />
                            <Route path="/matches" element={<MatchesPage />} />
                            <Route path="/my-team" element={<MyTeamPage />} />
                        </Routes>
                    </div>
                </div>
            </Router>
        </AppProvider>
    );
}

export default App;
