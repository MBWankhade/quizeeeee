import React, { useState } from 'react';
import axios from 'axios';

const Createquiz = () => {
  
  const [quizData, setQuizData] = useState({
    userId: localStorage.getItem('userId'),
    quizName: '',
    quizType: '',
    numQuestions: 1,
    questions: [{ question: '', options: ['', ''], correctOption: null, optionType: '', timer: '' ,impressionofQuestion:0}],
    quizId: null, // New field to store the unique ID
    impressionofQuiz:0,
  });

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showQuizDetails, setShowQuizDetails] = useState(true);
  const [quizPublished, setQuizPublished] = useState(false);

  const handleQuizNameChange = (e) => {
    setQuizData({ ...quizData, quizName: e.target.value });
  };

  const handleQuizTypeChange = (e) => {
    setQuizData({ ...quizData, quizType: e.target.value });
  };

  const handleOptionTypeChange = (questionIndex, e) => {
    const updatedQuestions = [...quizData.questions];
    if (!updatedQuestions[questionIndex]) {
      updatedQuestions[questionIndex] = { question: '', options: ['', ''], correctOption: null, optionType: '', timer: '' };
    }
    updatedQuestions[questionIndex].optionType = e.target.value;

    // Clear existing option values if option type is changed
    updatedQuestions[questionIndex].options = ['', ''];
    updatedQuestions[questionIndex].correctOption = null;

    setQuizData({ ...quizData, questions: updatedQuestions });
  };

  const handleTimerChange = (questionIndex, e) => {
    const updatedQuestions = [...quizData.questions];
    updatedQuestions[questionIndex].timer = e.target.value;
    setQuizData({ ...quizData, questions: updatedQuestions });
  };

  const handleQuestionChange = (index, e) => {
    const updatedQuestions = [...quizData.questions];
    updatedQuestions[index] = { ...updatedQuestions[index], question: e.target.value };
    setQuizData({ ...quizData, questions: updatedQuestions });
  };

  const handleOptionChange = (questionIndex, optionIndex, e) => {
    const updatedQuestions = [...quizData.questions];
    updatedQuestions[questionIndex].options[optionIndex] = e.target.value;
    setQuizData({ ...quizData, questions: updatedQuestions });
  };

  const handleCorrectAnswerChange = (questionIndex, optionIndex) => {
    const updatedQuestions = [...quizData.questions];
    updatedQuestions[questionIndex].correctOption = optionIndex;
    setQuizData({ ...quizData, questions: updatedQuestions });
  };

  const handleAddQuestion = () => {
    setCurrentQuestionIndex(quizData.numQuestions);
    setQuizData({
      ...quizData,
      numQuestions: quizData.numQuestions + 1,
      questions: [
        ...quizData.questions,
        { question: '', options: ['', ''], correctOption: null, optionType: '', timer: '' },
      ],
    });
  };

  const handleRemoveQuestion = (index) => {
    if (index > 0 && index <= quizData.numQuestions - 1) {
      const updatedQuestions = [...quizData.questions];
      updatedQuestions.splice(index, 1);
      setQuizData({ ...quizData, numQuestions: quizData.numQuestions - 1, questions: updatedQuestions });
      setCurrentQuestionIndex(Math.min(currentQuestionIndex, quizData.numQuestions - 2));
    }
  };

  const handleContinue = () => {
    // Check for required fields before continuing
    if (quizData.quizName.trim() === '' || quizData.quizType.trim() === '') {
      alert('Please fill in all required fields.');
      return;
    }

    setShowQuizDetails(false);
  };

  const handleTabClick = (index) => {
    // Check if index is within the valid range
    if (index >= 0 && index < quizData.numQuestions) {
      setCurrentQuestionIndex(index);
    }
  };

  const handleAddOption = (questionIndex) => {
    if (quizData.questions[questionIndex].options.length < 4) {
      const updatedQuestions = [...quizData.questions];
      updatedQuestions[questionIndex].options.push('');
      setQuizData({ ...quizData, questions: updatedQuestions });
    }
  };

  const handleRemoveOption = (questionIndex, optionIndex) => {
    if (quizData.questions[questionIndex].options.length > 2) {
      const updatedQuestions = [...quizData.questions];
      updatedQuestions[questionIndex].options.splice(optionIndex, 1);
      setQuizData({ ...quizData, questions: updatedQuestions });
    }
  };

  const handleSubmit = async () => {
    // Check for required fields before submitting
    const currentQuestion = quizData.questions[currentQuestionIndex];
    if (
      currentQuestion.question.trim() === '' ||
      currentQuestion.options.some((option) => option.trim() === '') ||
      (quizData.quizType === 'qa' && currentQuestion.correctOption === null) ||
      currentQuestion.optionType.trim() === '' ||
      (quizData.quizType === 'qa' && currentQuestion.timer.trim() === '')
    ) {
      alert('Please fill in all required fields for the current question.');
      return;
    }

    try {
      console.log(quizData)
      const response = await axios.post('http://localhost:3000/api/saveQuiz', quizData);

      if (response.data.success) {
        setQuizData({ ...quizData, quizId: response.data.quizId });
        setQuizPublished(true);
      } else {
        alert(`Error: ${response.data.error}`);
      }
    } catch (error) {
      console.error('Error submitting quiz:', error);
      alert('An error occurred while submitting the quiz.');
    }
  };

  return (
    <div>
      {showQuizDetails && (
        <>
          <label>
            Quiz Name:
            <input type="text" value={quizData.quizName} onChange={handleQuizNameChange} />
          </label>

          <br />

          <label>
            Quiz Type:
            <select value={quizData.quizType} onChange={handleQuizTypeChange}>
              <option value="">Select Type</option>
              <option value="poll">Poll</option>
              <option value="qa">Q&A</option>
            </select>
          </label>

          <br />

          <button onClick={handleContinue}>Continue</button>
        </>
      )}

      {!showQuizDetails && !quizPublished && (
        <>
          <button onClick={handleAddQuestion}>+ Add Question</button>

          <div style={{ border: '1px solid #ccc', padding: '10px', margin: '10px 0' }}>
            {quizData.questions.map((question, index) => (
              <div key={index}>
                <button onClick={() => handleTabClick(index)}>
                  Question {index + 1}
                </button>
                {index > 0 && index <= quizData.numQuestions - 1 && (
                  <button onClick={() => handleRemoveQuestion(index)}>
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>

          <div style={{ border: '1px solid #ccc', padding: '10px', margin: '10px 0' }}>
            <label>
              Option Type:
              <div>
                <label>
                  <input
                    type="radio"
                    value="text"
                    checked={quizData.questions[currentQuestionIndex].optionType === 'text'}
                    onChange={(e) => handleOptionTypeChange(currentQuestionIndex, e)}
                  />
                  Text
                </label>

                <label>
                  <input
                    type="radio"
                    value="image"
                    checked={quizData.questions[currentQuestionIndex].optionType === 'image'}
                    onChange={(e) => handleOptionTypeChange(currentQuestionIndex, e)}
                  />
                  Image
                </label>

                <label>
                  <input
                    type="radio"
                    value="both"
                    checked={quizData.questions[currentQuestionIndex].optionType === 'both'}
                    onChange={(e) => handleOptionTypeChange(currentQuestionIndex, e)}
                  />
                  Text and Image
                </label>
              </div>
            </label>

            <br />

            <label>
              Question:
              <input
                type="text"
                value={quizData.questions[currentQuestionIndex].question}
                onChange={(e) => handleQuestionChange(currentQuestionIndex, e)}
                placeholder='Poll Question'
              />
            </label>

            <br />

            {[...Array(quizData.questions[currentQuestionIndex].options.length || 2)].map((_, optionIndex) => (
              <div key={optionIndex}>
                <input
                  type="text"
                  placeholder={quizData.questions[currentQuestionIndex].optionType === 'image' ? 'Image URL' : 'Option Text'}
                  value={quizData.questions[currentQuestionIndex].options[optionIndex] || ''}
                  onChange={(e) => handleOptionChange(currentQuestionIndex, optionIndex, e)}
                />

                {quizData.quizType === 'qa' && (
                  <input
                    type="radio"
                    name={`correctOption-${currentQuestionIndex}`}
                    checked={quizData.questions[currentQuestionIndex].correctOption === optionIndex}
                    onChange={() => handleCorrectAnswerChange(currentQuestionIndex, optionIndex)}
                  />
                )}

                {optionIndex > 1 && (
                  <button onClick={() => handleRemoveOption(currentQuestionIndex, optionIndex)}>
                    Delete Option
                  </button>
                )}
              </div>
            ))}

            <button onClick={() => handleAddOption(currentQuestionIndex)} disabled={quizData.questions[currentQuestionIndex].options.length >= 4}>
              Add Option
            </button>

            {quizData.quizType !== 'poll' && (
              <div>
                <label>
                  Timer:
                </label>
                <div>
                  <label>
                    <input
                      type="radio"
                      value="Off"
                      checked={quizData.questions[currentQuestionIndex].timer === 'Off'}
                      onChange={(e) => handleTimerChange(currentQuestionIndex, e)}
                    />
                    Off
                  </label>

                  <label>
                    <input
                      type="radio"
                      value="5s"
                      checked={quizData.questions[currentQuestionIndex].timer === '5s'}
                      onChange={(e) => handleTimerChange(currentQuestionIndex, e)}
                    />
                    5s
                  </label>

                  <label>
                    <input
                      type="radio"
                      value="10s"
                      checked={quizData.questions[currentQuestionIndex].timer === '10s'}
                      onChange={(e) => handleTimerChange(currentQuestionIndex, e)}
                    />
                    10s
                  </label>
                </div>
              </div>
            )}
          </div>

          <button onClick={handleSubmit}>Submit</button>
        </>
      )}

      {quizPublished && (
        <div>
          <p>Congrats! Your Quiz is Published!</p>
          <p>Your link is: <a href={`livequiz/${quizData.quizId}`}>{`/livequiz/${quizData.quizId}`}</a></p>
        </div>
      )}
    </div>
  );
};

export default Createquiz;
