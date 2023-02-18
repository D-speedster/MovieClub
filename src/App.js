
import './App.css';
import { useRoutes, createBrowserRouter, createRoutesFromElements, Route, RouterProvider, Router, Routes } from "react-router-dom";
import React from 'react';
import Pageroutes from './components/Routes';

function App() {
  let router = useRoutes(Pageroutes)
  return (

    <div>
      {router}
    </div>

  );

}

export default App;
