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
    return data.token;
  } else {
    throw new Error(data.message || 'Failed to login');
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: { token: null, status: 'idle', error: null },
  reducers: {},
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
      });
  },
});

export default authSlice.reducer;
