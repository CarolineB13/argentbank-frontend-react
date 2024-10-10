import { configureStore } from '@reduxjs/toolkit';
import authReducer from './redux/authSlice'; // Importe le slice d'authentification

// Middleware personnalisé pour enregistrer les données d'authentification dans le sessionStorage
const saveToSessionStorage = (store) => (next) => (action) => {
  // Passe l'action au middleware suivant et exécute l'action (cela met à jour l'état Redux)
  let result = next(action);
  // Récupère l'état actuel après que l'action ait été traitée
  const state = store.getState();
  // Enregistre le token dans le sessionStorage pour persister les informations de connexion
  sessionStorage.setItem('token', state.auth.token);
  // Enregistre le profil de l'utilisateur dans le sessionStorage pour les restaurer après un rechargement de page
  sessionStorage.setItem('profile', JSON.stringify(state.auth.profile));
 
  return result;
};
// Configure le store Redux
const store = configureStore({
  reducer: {
    // Associe le reducer de l'authentification au slice 'auth'
    auth: authReducer, 
  },
  // Ajoute le middleware personnalisé à la liste des middlewares par défaut
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(saveToSessionStorage),
  // `getDefaultMiddleware()` configure les middlewares par défaut de Redux Toolkit (comme `redux-thunk`)
  // `.concat(saveToSessionStorage)` ajoute notre middleware personnalisé pour gérer le sessionStorage.
});

// Exporte le store configuré pour être utilisé dans l'application
export default store;