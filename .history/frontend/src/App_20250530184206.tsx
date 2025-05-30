import { Routes, Route } from 'react-router-dom';
import { FC } from 'react';
import Home from './views/Home';


const App: FC = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/generate-link" element={<VerifyEmail />} />
        </Routes>
    );
};

export default App;