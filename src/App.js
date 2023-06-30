import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import NavigationBar from './components/NavigationBar';
import ReportCard from './pages/ReportCard';
import Home from './pages/Home';
import './css/App.css';
import PersonalData from './pages/PersonalData';
import Evaluations from './pages/Evaluatiions';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Navigate replace to='/login' />} />
        <Route path='/login' element={<Login />} />
        <Route path='/*' element={<Navigate replace to='/login' />} />
        <Route element={<NavigationBar />}>
          <Route path='/home' element={<Home />} />
          <Route path='/reportCard' element={<ReportCard />} />
          <Route path='/personalData' element={<PersonalData />} />
          <Route path='/evaluationsPage' element={<Evaluations />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
