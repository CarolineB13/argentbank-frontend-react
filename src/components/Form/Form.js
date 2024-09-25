import React, {useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {login} from '../../app/redux/authSlice';
import { useNavigate } from 'react-router-dom'; // Importer le hook pour redirection
import './Form.css';


function Form() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate(); // Initialiser le hook pour redirection
    const error = useSelector((state) => state.auth.error); // Récupérer l'erreur de connexion

    const handleSubmit = (e) => {
        e.preventDefault();
        // Appel API pour connexion
        dispatch(login({username, password})).then ((action) => {
            if (action.type === login.fulfilled.type) {
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
            {error && <div className="error-message">Wrong username or password</div>}
            <div className="input-remember">
                <input type="checkbox" id="remember-me" /><label htmlFor="remember-me">Remember me</label>
            </div>
            <button className="sign-in-button">Sign In</button> 
        </form>
    );
}

export default Form;