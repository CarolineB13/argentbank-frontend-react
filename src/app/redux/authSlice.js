import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Action asynchrone pour l'appel API
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
    return data.body.token;
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
    // Renvoie les données du profil utilisateur
    return data.body;
  } else {
    throw new Error('Failed to fetch user profile');
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: { token: null, status: 'idle', error: null },
  reducers: {
    logout: (state) => {
      state.token = null; // Réinitialise le token pour déconnecter l'utilisateur
      state.profile = null; // Réinitialise le profil utilisateur
      state.status = 'idle'; // Réinitialise le status
      state.error = null; // Réinitialise les erreurs
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.token = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.profile = action.payload; // Stocke le profil utilisateur
      });
  },
});
export const { logout } = authSlice.actions;
export default authSlice.reducer;
