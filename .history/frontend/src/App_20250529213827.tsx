import { Routes, Route } from 'react-router-dom';
import { FC } from 'react';
import Home from './views/Home';
import Login from './views/Login';
import VerifyEmail from './views/VerifyEmail.tsx';

const App: FC = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/verify" element={<VerifyEmail />} />
        </Routes>
    );
};

export default App;