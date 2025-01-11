import { configureStore } from '@reduxjs/toolkit';
import cashbackReducer from './slices/cashbackSlice'; // Cashback reducer
import authReducer from './slices/authSlice'; // Auth reducer
import userReducer from './slices/userSlice'; // User reducer
import monthlyCashbacksReducer from './slices/monthlyCashbacksSlice'; // MonthlyCashbacks reducer

const store = configureStore({
  reducer: {
    cashback: cashbackReducer,
    auth: authReducer,
    user: userReducer,
    cashbacks: monthlyCashbacksReducer, // Добавляем reducer для monthlyCashbacks
  },
});

export default store;

// Типы для использования в компонентах
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Типизированные хуки для использования в компонентах
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;



// import { configureStore } from '@reduxjs/toolkit';
// import searchReducer from './slices/cashbackSlice';

// const store = configureStore({
//   reducer: {
//     search: searchReducer,
//   },
// });

// export default store;
