import { Routes, Route } from 'react-router-dom';
import { FC } from 'react';
import Home from './views/Home';
import SignUp from './views/SignUp';
import Home from './views/Home';

const App: FC = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/Signup" element={<SignUp/>} />
        </Routes>
    );
};

export default App;