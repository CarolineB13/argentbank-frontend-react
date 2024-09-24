import './App.css';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Home from '../pages/Home/Home';
import SignIn from '../pages/SignIn/SignIn';
import User from '../pages/User/User';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';


function App() {


  return (
    <Router>
    <Header />
    <Routes>
      <Route path="/" element={<Home/>} />
      <Route path="/sign-in" element={<SignIn/>} />
      <Route path="/user" element={<User />} />
    </Routes>
    <Footer />
  </Router>
  );
}

export default App;
