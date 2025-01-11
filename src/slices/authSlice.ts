import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Api } from '../api/Api';

const api = new Api();

// Асинхронный thunk для логина
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await api.login.loginCreate(
        { email, password },
        { withCredentials: true }
      );

      if (response.data?.status === 'ok') {
        return {
          sessionId: response.data.session_id,
          userId: response.data.id,
          username: email,
        };
      } else {
        return rejectWithValue('Не удалось войти. Проверьте данные и попробуйте снова.');
      }
    } catch (error) {
      return rejectWithValue('Ошибка при аутентификации. Попробуйте позже.');
    }
  }
);

interface AuthState {
  isAuthenticated: boolean;
  user: { id?: string; username: string; email?: string } | null;
  sessionId: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  sessionId: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.sessionId = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Логин пользователя
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.user = { id: action.payload.userId, username: action.payload.username };
        state.sessionId = action.payload.sessionId;
        state.loading = false;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Ошибка при аутентификации.';
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;

// import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// interface AuthState {
//   isAuthenticated: boolean;
//   user: { id?: string; username: string; email?: string } | null; // Добавляем id в пользователя
//   sessionId: string | null; // Добавляем sessionId
// }

// const initialState: AuthState = {
//   isAuthenticated: false,
//   user: null,
//   sessionId: null, // Изначально sessionId отсутствует
// };

// const authSlice = createSlice({
//   name: 'auth',
//   initialState,
//   reducers: {
//     login: (
//       state,
//       action: PayloadAction<{ id: string; username: string; sessionId: string }>
//     ) => {
//       state.isAuthenticated = true;
//       state.user = { id: action.payload.id, username: action.payload.username };
//       state.sessionId = action.payload.sessionId;
//     },
//     logout: (state) => {
//       state.isAuthenticated = false;
//       state.user = null;
//       state.sessionId = null;
//     },
//     // Новый редьюсер для обновления информации пользователя
//     updateUserInfo: (state, action: PayloadAction<{ email: string }>) => {
//       if (state.user) {
//         state.user.email = action.payload.email; // Обновляем email
//       }
//     },
//   },
// });

// export const { login, logout, updateUserInfo } = authSlice.actions;
// export default authSlice.reducer;



















// import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// interface AuthState {
//   isAuthenticated: boolean;
//   user: { username: string; email?: string } | null; // Добавляем email в пользователя
//   sessionId: string | null; // Добавляем sessionId
// }

// const initialState: AuthState = {
//   isAuthenticated: false,
//   user: null,
//   sessionId: null, // Изначально sessionId отсутствует
// };

// const authSlice = createSlice({
//   name: 'auth',
//   initialState,
//   reducers: {
//     login: (state, action: PayloadAction<{ username: string; sessionId: string }>) => {
//       state.isAuthenticated = true;
//       state.user = { username: action.payload.username };
//       state.sessionId = action.payload.sessionId;
//     },
//     logout: (state) => {
//       state.isAuthenticated = false;
//       state.user = null;
//       state.sessionId = null;
//     },
//     // Новый редьюсер для обновления информации пользователя
//     updateUserInfo: (state, action: PayloadAction<{ email: string }>) => {
//       if (state.user) {
//         state.user.email = action.payload.email; // Обновляем email
//       }
//     },
//   },
// });

// export const { login, logout, updateUserInfo } = authSlice.actions;
// export default authSlice.reducer;

