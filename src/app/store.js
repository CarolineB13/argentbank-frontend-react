import { configureStore } from '@reduxjs/toolkit';
import authReducer from './redux/authSlice'; // Importe le slice d'authentification

const store = configureStore({
  reducer: {
    auth: authReducer, // Ajoute l'authentification au store
  },
});

export default store;