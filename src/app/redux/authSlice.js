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
    return { token: data.body.token, firstName: data.body.firstName, lastName: data.body.lastName };
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
  initialState: { token: null, profile: null, status: 'idle', error: null },
  reducers: {
    logout: (state) => {
      state.token = null;
      state.profile = null;
      localStorage.removeItem('token');
      localStorage.removeItem('profile');
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
        state.profile = { firstName: action.payload.firstName, lastName: action.payload.lastName };
        localStorage.setItem('token', action.payload.token);
        localStorage.setItem('profile', JSON.stringify({ firstName: action.payload.firstName, lastName: action.payload.lastName }));
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.profile = action.payload;
      });
  },
});

export const { logout, restoreAuth } = authSlice.actions;
export default authSlice.reducer;