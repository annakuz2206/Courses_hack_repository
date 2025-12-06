import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthForm from './components/AuthForm';
import Questionnaire from './components/Questionnaire';
import HackathonSelection from './components/HackathonSelection';
import TeamStatus from './components/TeamStatus';
import TeamCreation from './components/TeamCreation';
import Feed from './components/Feed';
import CardDetails from './components/CardDetails';
import MatchList from './components/MatchList';
import Chat from './components/Chat';
import Settings from './components/Settings';
import AdminPanel from './components/AdminPanel';
import Search from './components/Search';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<AuthForm />} />
                <Route path="/questionnaire" element={<Questionnaire />} />
                <Route path="/hackathon-selection" element={<HackathonSelection />} />
                <Route path="/team-status" element={<TeamStatus />} />
                <Route path="/team-creation" element={<TeamCreation />} />
                <Route path="/feed" element={<Feed />} />
                <Route path="/card/:id" element={<CardDetails />} />
                <Route path="/matches" element={<MatchList />} />
                <Route path="/chat/:id" element={<Chat />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/admin" element={<AdminPanel />} />
                <Route path="/search" element={<Search />} />
            </Routes>
        </Router>
    );
}

export default App;
