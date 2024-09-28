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
    const savedToken = sessionStorage.getItem('token');
    const savedProfile = JSON.parse(sessionStorage.getItem('profile'));

    if (savedToken && savedToken !== "null" && savedProfile) {
      console.log("Restauration du token et du profil depuis sessionStorage...");
      console.log("Token:", savedToken);
      dispatch(restoreAuth({ token: savedToken, profile: savedProfile }));
      console.log('Profil restauré depuis sessionStorage :', savedProfile);
      dispatch(fetchUserProfile(savedToken));
    } else {
      console.error('Token manquant ou invalide lors de la restauration');
    
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
