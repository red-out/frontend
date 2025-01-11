import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Api } from '../api/Api';

const api = new Api();

// Асинхронный thunk для обновления данных пользователя
export const updateUserDetails = createAsyncThunk(
  'user/updateUserDetails',
  async ({ userId, userData }: { userId: string; userData: { email: string; password?: string } }, { rejectWithValue }) => {
    try {
      const response = await api.user.userUpdatePartialUpdate(userId, userData);

      if (response) {
        return response.data; // Assuming API returns the updated data
      } else {
        return rejectWithValue('Не удалось обновить данные пользователя.');
      }
    } catch (error) {
      return rejectWithValue('Ошибка при обновлении данных пользователя.');
    }
  }
);

// Асинхронный thunk для регистрации пользователя
export const registerUser = createAsyncThunk(
  'user/registerUser',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await api.api.apiUserCreate({ email, password });

      if (response.status === 200) {
        return response.data; // Возвращаем данные пользователя после регистрации
      } else {
        return rejectWithValue('Не удалось зарегистрировать пользователя.');
      }
    } catch (error) {
      return rejectWithValue('Ошибка при регистрации. Попробуйте позже.');
    }
  }
);

interface UserState {
  user: { id: string; username: string; email: string } | null;
  loading: boolean;
  error: string | null;
  registrationError: string | null; // Для ошибки регистрации
  registrationSuccess: boolean; // Для отслеживания успешной регистрации
}

const initialState: UserState = {
  user: null,
  loading: false,
  error: null,
  registrationError: null,
  registrationSuccess: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // Редьюсеры для работы с данными пользователя
    setUser: (state, action) => {
      state.user = action.payload;
    },
    clearUser: (state) => {
      state.user = null;
    },
    clearRegistrationError: (state) => {
      state.registrationError = null;
    },
    clearRegistrationSuccess: (state) => {
      state.registrationSuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Обновление данных пользователя
      .addCase(updateUserDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserDetails.fulfilled, (state, action) => {
        state.user = { ...state.user, ...action.payload };
        state.loading = false;
      })
      .addCase(updateUserDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Ошибка при обновлении данных.';
      })
      // Регистрация пользователя
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.registrationError = null;
        state.registrationSuccess = false;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload; // Сохраняем данные пользователя
        state.registrationSuccess = true;
        state.loading = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.registrationError = action.payload || 'Ошибка при регистрации.';
        state.registrationSuccess = false;
        state.loading = false;
      });
  },
});

export const { setUser, clearUser, clearRegistrationError, clearRegistrationSuccess } = userSlice.actions;
export default userSlice.reducer;

// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import { Api } from '../api/Api';

// const api = new Api();

// // Асинхронный thunk для обновления данных пользователя
// export const updateUserDetails = createAsyncThunk(
//   'user/updateUserDetails',
//   async ({ userId, userData }: { userId: string; userData: { email: string; password?: string } }, { rejectWithValue }) => {
//     try {
//       const response = await api.user.userUpdatePartialUpdate(userId, userData);

//       if (response) {
//         return response.data; // Assuming API returns the updated data
//       } else {
//         return rejectWithValue('Не удалось обновить данные пользователя.');
//       }
//     } catch (error) {
//       return rejectWithValue('Ошибка при обновлении данных пользователя.');
//     }
//   }
// );

// interface UserState {
//   user: { id: string; username: string; email: string } | null;
//   loading: boolean;
//   error: string | null;
// }

// const initialState: UserState = {
//   user: null,
//   loading: false,
//   error: null,
// };

// const userSlice = createSlice({
//   name: 'user',
//   initialState,
//   reducers: {
//     // Можно добавить дополнительные редьюсеры для работы с данными пользователя
//     setUser: (state, action) => {
//       state.user = action.payload;
//     },
//     clearUser: (state) => {
//       state.user = null;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       // Обновление данных пользователя
//       .addCase(updateUserDetails.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(updateUserDetails.fulfilled, (state, action) => {
//         state.user = { ...state.user, ...action.payload };
//         state.loading = false;
//       })
//       .addCase(updateUserDetails.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload || 'Ошибка при обновлении данных.';
//       });
//   },
// });

// export const { setUser, clearUser } = userSlice.actions;
// export default userSlice.reducer;
