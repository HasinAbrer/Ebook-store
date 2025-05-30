import { Routes, Route } from 'react-router-dom';
import { FC } from 'react';
import Home from './views/Home';
import SignUp from './views/SignUp';
import Container from "./components/common/Container";

const App: FC = () => {
    return (
        <container>
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/Signup" element={<SignUp/>} />
        </Routes>
        </container>
    );
};

export default App;