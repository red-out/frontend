import { configureStore } from '@reduxjs/toolkit';
import searchReducer from './slices/cashbackSlice'; // Ваш текущий редьюсер
import authReducer from './slices/authSlice'; // Добавляем authSlice

const store = configureStore({
  reducer: {
    search: searchReducer, // Сохраняем текущий редьюсер
    auth: authReducer, // Добавляем редьюсер для авторизации
  },
});

export default store;

// Типы для использования в компонентах
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;








// import { configureStore } from '@reduxjs/toolkit';
// import searchReducer from './slices/cashbackSlice';

// const store = configureStore({
//   reducer: {
//     search: searchReducer,
//   },
// });

// export default store;
