import { Routes, Route } from 'react-router-dom';
import { FC } from 'react';
import Home from './views/Home';
import SignUp from './views/SignUp';
import Container from "./components/common/container";

const App: FC = () => {
    return (
        <Container>
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/Signup" element={<SignUp/>} />
        </Routes>
        </Container>
    );
};

export default App;