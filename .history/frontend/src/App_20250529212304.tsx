import { BrowserRouter as Router,Routes, Route } from 'react-router-dom';
import { FC } from 'react';


interface Props {}

const App: FC<Props> = () => {
    return (
        <Router>
        <Routes>
            <Route path="/"element ={<Home/>}/>
        </Routes>
        </Router>
    );
};

export default App;