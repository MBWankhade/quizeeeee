// TakeQuiz.js

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const TakeQuiz = () => {
  const { quizId } = useParams();
  const [quizData, setQuizData] = useState(null);

  useEffect(() => {
    // Fetch quiz data based on quizId from the server
    const fetchQuizData = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/quiz/${quizId}`); // Replace with your actual API endpoint
        const data = await response.json();
        if (data.success) {
          setQuizData(data.quizData);
        } else {
          // Handle error
          console.error(data.error);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchQuizData();
  }, [quizId]);

  if (!quizData) {
    // Loading state
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{quizData.quizName}</h1>
      {/* Render quiz questions and form here */}
    </div>
  );
};

export default TakeQuiz;
