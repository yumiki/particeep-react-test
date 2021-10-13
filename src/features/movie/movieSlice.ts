import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppThunk } from '../../app/store';
import { fetchMovies } from './movieAPI';
import { MovieModel } from './MovieModel';

export interface MovieState {
  movies: MovieModel[];
  selectedCategories: string[]
  showFilteredView: boolean
  status: 'idle' | 'loading' | 'failed';
}

const initialState: MovieState = {
  movies: [],
  selectedCategories: [],
  showFilteredView: false,
  status: 'idle',
};

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched. Thunks are
// typically used to make async requests.
export const loadAsync = createAsyncThunk(
  'movie/fetchMovies',
  async () => {
    const response = await fetchMovies
    // The value we return becomes the `fulfilled` action payload
    return response;
  }
);

export const movieSlice = createSlice({
  name: 'movie',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    toggleLikeAction: (state, action: PayloadAction<string>) => {
      state.movies = state.movies.map((movie) => {
        if (movie.id === action.payload) {
          
          const updatedData = {
            ...movie,
            likes: movie.userAsLike ? movie.likes -1 : movie.likes +1,
            dislikes: !movie.userAsLike && movie.userAsDisLike? movie.dislikes - 1 : movie.dislikes,
            userAsLike: !movie.userAsLike,
            userAsDisLike: false 
          }

          return updatedData
        }
        return movie
      })
    },
    toggleDislikeAction: (state, action: PayloadAction<string>) => {
      state.movies = state.movies.map((movie) => {
        if (movie.id === action.payload) {          
          
          const updatedData = {
            ...movie,
            dislikes: movie.userAsDisLike ? movie.dislikes -1 : movie.dislikes +1,
            likes: !movie.userAsDisLike && movie.userAsLike? movie.likes - 1 : movie.likes,
            userAsLike: false,
            userAsDisLike: !movie.userAsDisLike 
          }

          return updatedData
        }
        return movie
      })
    },
    checkCategory: (state, action: PayloadAction<string>) => {
      state.selectedCategories = [...state.selectedCategories, action.payload]
      state.showFilteredView = state.selectedCategories.length !== 0
    },
    uncheckCategory: (state, action: PayloadAction<string>) => {
      state.selectedCategories = state.selectedCategories.filter((category) => {
        return category !== action.payload
      })
      state.showFilteredView = state.selectedCategories.length !== 0
    },
    deleteMovieById: (state, action: PayloadAction<string>) => {
      state.movies = state.movies.filter((movie)=> {
        const movieToRemove = movie.id === action.payload
        if (movieToRemove) {
          state.selectedCategories = state.selectedCategories.filter((category) => {
            return category !== movie.category
          })
          state.showFilteredView = state.selectedCategories.length !== 0
        }
        return movie.id !== action.payload;
      })
    },
  },
  // The `extraReducers` field lets the slice handle actions defined elsewhere,
  // including actions generated by createAsyncThunk or in other slices.
  extraReducers: (builder) => {
    builder
      .addCase(loadAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(loadAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.movies = state.movies.concat(action.payload);
      });
  },
});

export const { toggleLikeAction, toggleDislikeAction, checkCategory, uncheckCategory, deleteMovieById } = movieSlice.actions;

export const selectAllCategories = (state: RootState) => {
  const rawCategories = state.movie.movies.map((movie)=> {
    return movie.category
  })

  const uniqueCategories = new Set(rawCategories)

  return Array.from(uniqueCategories)
};

export const selectSelectedCategories = (state: RootState) => state.movie.selectedCategories

export const selectView = (state: RootState) => state.movie.showFilteredView

export const selectFilteredMovies = (state: RootState) => state.movie.movies.filter((movie) => {
  const isSelectedCategory = state.movie.selectedCategories.includes(movie.category)

  return isSelectedCategory ? movie : false
});

export const selectAllMovies = (state: RootState) => state.movie.movies;
// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const selectMovieByIndex = (state: RootState, index: number) => state.movie.movies[index];

export const selectMovieById = (state: RootState, id: string) => state.movie.movies.find((movie)=> {
  return movie.id === id ? movie : false
});

// We can also write thunks by hand, which may contain both sync and async logic.
// Here's an example of conditionally dispatching actions based on current state.
export const incrementIfOdd = (amount: number): AppThunk => (
  dispatch,
  getState
) => {
  /*const currentValue = selectCount(getState());
  if (currentValue % 2 === 1) {
    dispatch(incrementByAmount(amount));
  }*/
};

export default movieSlice.reducer;