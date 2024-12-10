import {configureStore} from '@reduxjs/toolkit';
import userSlice from './slices/userSlice';
import movieSlice from './slices/Movies';

export const store = configureStore({
  reducer: {
    user: userSlice,
    movies: movieSlice,
  },
});
