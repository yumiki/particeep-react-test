import React from 'react';
import { FilterView, MovieGrid } from './features/movie/MovieGrid';
import './App.css';
import { useEffect } from 'react';
import { useAppDispatch } from './app/hooks'
import { loadAsync } from './features/movie/movieSlice'

function App() {
  const dispatch = useAppDispatch();

  useEffect(()=> {
    dispatch(loadAsync())
  })

  return (
    <div className="App">
      <header className="App-header">
        <h1 className="Title"> Particeep / react-interview </h1>
      </header>
      <div className="Content">
        <aside className="Sidebar"><FilterView></FilterView></aside>
        <section className="Movie-section"><MovieGrid /></section>
      </div>
    </div>
  );
}

export default App;
