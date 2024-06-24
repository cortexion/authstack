import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import logo from './logo.svg';
import './App.css';
import AllDates from './AllDates'
import DateComponent from './DateComponent'
import { HomeLayout } from './HomeLayout';

const App = () => {

  return (
      <Routes>
          <Route element={<HomeLayout />}>
              <Route path="/" element={<AllDates />} />
              <Route path="/date/:id" element={<DateComponent />} />
          </Route>
      </Routes>)
};

export default App;
