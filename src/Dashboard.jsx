// Dashboard.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [quizCount, setQuizCount] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);

  useEffect(() => {
    // Fetch quiz count and question count when the component mounts
    const fetchDashboardData = async () => {
      try {
        const userId = localStorage.getItem('userId'); // Assuming you store userId in localStorage

        // Fetch quiz count
        const quizResponse = await axios.get(`http://localhost:3000/api/quizCount/${userId}`);
        setQuizCount(quizResponse.data.quizCount);

        // Fetch question count
        const questionResponse = await axios.get(`http://localhost:3000/api/questionCount/${userId}`);
        setQuestionCount(questionResponse.data.questionCount);
      } catch (error) {
        console.error(error);
      }
    };

    fetchDashboardData();
  }, []); // Empty dependency array to run the effect only once

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Total quizzes created: {quizCount}</p>
      <p>Total questions: {questionCount}</p>
    </div>
  );
};

export default Dashboard;
