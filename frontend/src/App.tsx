import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import logo from './logo.svg';
import './App.css';
import AllMovies from './AllMovies'
import AddNew from './AddNew'
import { HomeLayout } from './HomeLayout';

const App = () => {

  return (
      <Routes>
          <Route element={<HomeLayout />}>
              <Route path="/" element={<AllMovies />} />
              <Route path="/addnew" element={<AddNew />} />
          </Route>
      </Routes>)
};

export default App;
