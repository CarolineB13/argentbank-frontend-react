import React from 'react';
import './Header.css';
import { Link, useNavigate} from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../app/redux/authSlice'; // Ajoute l'action logout

function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
   // Récupère le token et le profil utilisateur depuis le store
  const token = useSelector((state) => state.auth.token); 
  const profile = useSelector((state) => state.auth.profile);

  const handleLogout = () => {
    dispatch(logout()); // Déconnecte l'utilisateur
    localStorage.removeItem('token'); // Supprime le token de localStorage
    sessionStorage.removeItem('token'); // Supprime le token de sessionStorage
    navigate('/'); // Redirige vers la page d'accueil
  };

  return (
    <nav className="main-nav">
      <Link className="main-nav-logo" to="/">
        <img
          className="main-nav-logo-image"
          src="./img/argentBankLogo.png"
          alt="Argent Bank Logo"
        />
        <h1 className="sr-only">Argent Bank</h1>
      </Link>
      <div>
      {token ? ( 
        <>
  {/*Affiche le bouton de déconnexion et le prénom si l'utilisateur est connecté */}
  <Link className="main-nav-item" to="/user">
  <i className="fa fa-user-circle"></i>
  {profile ? profile.firstName : "User"}
</Link>
<Link className="main-nav-item" to="/" onClick={handleLogout}>
<i className="fa fa-sign-out"></i> Sign Out
</Link>
</>
) : ( 
  // Affiche le bouton de connexion si l'utilisateur n'est pas connecté
  <Link className="main-nav-item" to="/sign-in">
    <i className="fa fa-user-circle"></i> Sign In
  </Link>
)}
      </div>
    </nav>
  );
}

export default Header;
