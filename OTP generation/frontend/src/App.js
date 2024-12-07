import logo from './logo.svg';
import './App.css';
import Login from './login';
import { Route, Routes } from 'react-router-dom';
import Otp from './Otp';

function App() {
  return (<>
    
    <Routes>
      <Route path='/' element={<Login />}/>
      <Route path='otp' element={<Otp/>}/>
      <Route path='dashboard' element={<Otp/>}/>
    </Routes>
  </>
  );
}

export default App;
