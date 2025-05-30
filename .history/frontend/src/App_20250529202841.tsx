import { BrowserRouter as Router,Routes, Route } from 'react-router-dom';
import { FC } from 'react';
import Home from './views/Home';
import SignUp from './views/SignUp';

interface Props {}

const App: FC<Props> = () => {
    return (
        <Router>
        <Routes>
            <Route path="/"element ={<Home/>}/>
             <Route path="/SignUp"element ={<SignUp/>}/>
        </Routes>
        </Router>
    );
};

export default App;