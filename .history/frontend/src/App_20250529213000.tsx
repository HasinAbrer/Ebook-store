import { Routes, Route } from 'react-router-dom';
import { FC } from 'react';
import Home from './views/Home';
import SignUp from './views/SignUp';
import Login from './views/Login';

const App: FC = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
        </Routes>
    );
};

export default App;