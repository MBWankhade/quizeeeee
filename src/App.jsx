import React from 'react';
import Createquiz from './Createquiz';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Signup from './Signup';
import Dashboard from './Dashboard';
import Quizanalysis from './Quizanalysis';
import Questionanalytics from './Questionanalytics';
import Livequiz from './Livequiz';

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path='/create-quiz' element={<Createquiz />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/livequiz/:quizId' element={<Livequiz />} />
          <Route path='/quizanalysis' element={<Quizanalysis />} />
          <Route path='/question-analysis/:quizId' element={<Questionanalytics />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
