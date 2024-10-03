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

const authSlice = createSlice({
  name: 'auth',
  initialState: { token: null, profile: null, status: 'idle', error: null },
  reducers: {
    logout: (state) => {
      state.token = null;
      state.profile = null;
      // Supprime le token et le profil de sessionStorage
      sessionStorage.removeItem('token');  
      sessionStorage.removeItem('profile');
      state.status = 'idle';
      state.error = null;
    },
    restoreAuth: (state, action) => {
      state.token = action.payload.token;
      state.profile = action.payload.profile;
    },
  },
  extraReducers: (builder) => {
    builder
    .addCase(login.fulfilled, (state, action) => {
      state.token = action.payload.token;
      

      if (action.payload.token) {
      sessionStorage.setItem('token', action.payload.token);
      
      }else{
      console.error ('Erreur : le token est null ou undefined');
      }
     
    })
    .addCase(fetchUserProfile.fulfilled, (state, action) => {
      state.profile = action.payload;
      sessionStorage.setItem('profile', JSON.stringify(action.payload));  // Met à jour le profil dans sessionStorage
    })
    .addCase(updateUsername.fulfilled, (state, action) => {
      state.profile = { ...state.profile, userName: action.payload.userName };  // Met à jour le username dans le store
      sessionStorage.setItem('profile', JSON.stringify(state.profile));  // Met à jour également dans sessionStorage
    })
    .addCase(login.rejected, (state, action) => {
      state.status = 'failed';
      state.error = action.error.message; // Enregistre l'erreur en cas d'échec de la connexion
    });
  },
});

export const { logout, restoreAuth } = authSlice.actions;
export default authSlice.reducer;
