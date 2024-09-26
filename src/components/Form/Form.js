import React, {useState, useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {login, fetchUserProfile} from '../../app/redux/authSlice';
import { useNavigate } from 'react-router-dom'; // Importer le hook pour redirection
import './Form.css';


function Form() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate(); // Initialiser le hook pour redirection

     // Récupérer l'erreur et l'état de l'authentification depuis le store Redux
  const { token, error } = useSelector((state) => state.auth);

   // Pré-remplir l'email si "Remember Me" avait été coché
   useEffect(() => {
    const savedUsername = localStorage.getItem('rememberedUsername');
    if (savedUsername) {
      setUsername(savedUsername);
      setRememberMe(true); // Cocher la case si l'email est mémorisé
    }
  }, []);

useEffect(() => {
    if (token) {
        // Appel API pour récupérer le profil utilisateur une fois connecté
        dispatch(fetchUserProfile(token)).then(() => {
          // Rediriger vers la page utilisateur après avoir récupéré le profil
          navigate('/user');
      });
  }
}, [token, navigate, dispatch]);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Appel API pour connexion
        dispatch(login({username, password})).then ((action) => {
            if (action.type === login.fulfilled.type) {
        sessionStorage.setItem('token', token); // Stocker le token pour la session active

        // Si "Remember Me" est coché, stocker l'email dans localStorage
        if (rememberMe) {
          localStorage.setItem('rememberedUsername', username);
        } else {
          localStorage.removeItem('rememberedUsername'); // Supprimer l'email si décoché
        } 
                // Rediriger vers la page user
                navigate('/user');
            };
        });
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="input-wrapper">
                <label htmlFor="username">Username</label>
                <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} />
            </div>
            <div className="input-wrapper">
                <label htmlFor="password">Password</label>
                <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <div className="input-remember">
                <input type="checkbox" id="remember-me" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} /><label htmlFor="remember-me">Remember me</label>
            </div>

            {error && <p className="error-message">Wrong username or password</p>}

            <button className="sign-in-button">Sign In</button> 
        </form>
    );
}

export default Form;