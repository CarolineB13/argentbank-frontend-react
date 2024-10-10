import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Action asynchrone pour l'appel API (login)
export const login = createAsyncThunk('auth/login', async ({ username, password }) => {
  const response = await fetch('http://localhost:3001/api/v1/user/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email: username, password }),
  });

  const data = await response.json();
  if (response.ok) {
    return { token: data.body.token, profile: data.body };
  } else {
    throw new Error(data.message || 'Failed to login');
  }
});

// Action asynchrone pour récupérer le profil de l'utilisateur
export const fetchUserProfile = createAsyncThunk('auth/fetchUserProfile', async (token) => {
  const response = await fetch('http://localhost:3001/api/v1/user/profile', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  const data = await response.json();
  if (response.ok) {
    return data.body;
  } else {
    throw new Error('Failed to fetch user profile');
  }
});

// Action asynchrone pour mettre à jour le username
export const updateUsername = createAsyncThunk('auth/updateUsername', async ({ token, newUsername }) => {
  const response = await fetch('http://localhost:3001/api/v1/user/profile', {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userName: newUsername }),
  });

  const data = await response.json();
  if (response.ok) {
    return data.body;
  } else {
    throw new Error('Failed to update username');
  }
});

// Création du slice pour gérer l'authentification
// `authSlice` contient l'état de l'authentification, les reducers, et les extraReducers pour gérer les actions asynchrones.
const authSlice = createSlice({
  name: 'auth',
  initialState: { token: null, profile: null, status: 'idle', error: null },
  reducers: {
    // Action pour déconnecter l'utilisateur
    logout: (state) => {
      state.token = null;
      state.profile = null;
      // Supprime le token et le profil de sessionStorage
      sessionStorage.removeItem('token');  
      sessionStorage.removeItem('profile');
      state.status = 'idle';
      state.error = null;
    },
    // Action pour restaurer l'état d'authentification à partir du sessionStorage
    restoreAuth: (state, action) => {
      state.token = action.payload.token;
      state.profile = action.payload.profile;
    },
  },
  extraReducers: (builder) => {
    builder
    .addCase(login.fulfilled, (state, action) => {
      state.token = action.payload.token;
      // Si le token est valide, on le stocke dans sessionStorage pour maintenir la session active même après un rafraîchissement de la page.
      if (action.payload.token) {
      sessionStorage.setItem('token', action.payload.token);
      
      }else{
      console.error ('Erreur : le token est null ou undefined');
      }
     
    })
    .addCase(fetchUserProfile.fulfilled, (state, action) => {
      state.profile = action.payload;
      // Met à jour le profil dans sessionStorage pour conserver les informations après un rafraîchissement de la page.
      sessionStorage.setItem('profile', JSON.stringify(action.payload));
    })
    .addCase(updateUsername.fulfilled, (state, action) => {
      // Met à jour le nom d'utilisateur dans le store tout en conservant les autres informations de profil.
      state.profile = { ...state.profile, userName: action.payload.userName };
      // Met également à jour le profil dans sessionStorage pour maintenir la cohérence.
      sessionStorage.setItem('profile', JSON.stringify(state.profile));
    })
    .addCase(login.rejected, (state, action) => {
      state.status = 'failed';
      // Enregistre l'erreur dans l'état pour l'afficher éventuellement à l'utilisateur.
      state.error = action.error.message;
    });
  },
});

// Exportation des actions et du reducer pour utilisation dans le store Redux.
export const { logout, restoreAuth } = authSlice.actions;
export default authSlice.reducer;