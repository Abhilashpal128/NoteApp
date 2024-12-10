import {createSlice} from '@reduxjs/toolkit';

const movieSlice = createSlice({
  name: 'Movies',
  initialState: {
    movies: [],
  },
  reducers: {
    setMovies: (state, action) => {
      state.movies = action.payload;
    },
  },
});

export const {setMovies} = movieSlice.actions;

export default movieSlice.reducer;
