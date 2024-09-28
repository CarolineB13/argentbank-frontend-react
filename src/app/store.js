import { configureStore } from '@reduxjs/toolkit';
import authReducer from './redux/authSlice'; // Importe le slice d'authentification

const saveToSessionStorage = (store) => (next) => (action) => {
  let result = next(action);
  const state = store.getState();
  sessionStorage.setItem('token', state.auth.token);
  sessionStorage.setItem('profile', JSON.stringify(state.auth.profile));
  return result;
};

const store = configureStore({
  reducer: {
    auth: authReducer, // Ajoute l'authentification au store
  },
   middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(saveToSessionStorage),
});

export default store;