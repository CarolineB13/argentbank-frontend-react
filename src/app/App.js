import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from '../pages/Home/Home';
import SignIn from '../pages/SignIn/SignIn';
import User from '../pages/User/User';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { restoreAuth, fetchUserProfile } from '../app/redux/authSlice';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedProfile = JSON.parse(localStorage.getItem('profile'));

    if (savedToken && savedProfile) {
      dispatch(restoreAuth({ token: savedToken, profile: savedProfile }));
    }
     // Si un token est restauré, on récupère le profil utilisateur
     if (savedToken) {
      dispatch(fetchUserProfile(savedToken));
    }
  }, [dispatch]);

  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/user" element={<User />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
