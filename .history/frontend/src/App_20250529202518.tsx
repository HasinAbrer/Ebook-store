import { BrowserRouter as Router,Routes, Route } from 'react-router-dom';
import { FC } from 'react';
import Home from './views/Home';

interface Props {}

const App: FC<Props> = () => {
    return (
        <Routes>
            <Route path="/"element ={<Home/>}/>
             <Route path="/SignUp"element ={<Home/>}/>
        </Routes>
    );
};

export default App;