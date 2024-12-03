import { configureStore } from '@reduxjs/toolkit';
import searchReducer from './slices/cashbackSlice';

const store = configureStore({
  reducer: {
    search: searchReducer,
  },
});

export default store;
