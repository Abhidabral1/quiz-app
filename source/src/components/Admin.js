import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../authentication/AuthContext';
// import "../stylesheets/admin.css";
import "../stylesheets/style.css";

export const Admin = () => {
  const [question, setQuestion] = useState('');
  const [message, setMessage] = useState('');
  const [options, setOptions] = useState(['', '', '', '']); // Initialize with 4 empty options
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [questionType, setQuestionType] = useState('option'); // Default to option-based question type
  const { user } = useAuth();
  const location = useLocation();
  const questionData = location.state?.question;
 
  useEffect(() => {
    if (questionData) {
      setQuestion(questionData.question);
      setOptions(
        questionData.options && questionData.options.length === 4
          ? questionData.options
          : ['', '', '', ''] // Ensure exactly 4 options
      );
      setCorrectAnswer(questionData.correctAnswer.toLowerCase().trim());
      setQuestionType(questionData.options?.length > 0 ? 'option' : 'text');
    }
  }, [questionData]);

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Conditional validation for options
    if (questionType === 'option' && options.some((opt) => opt.trim() === '')) {
      setMessage("All 4 options must be filled out.");
      return;
    }
  
    try {
      const url = questionData
        ? `http://localhost:8000/api/questions/${questionData._id}`
        : "http://localhost:8000/api/questions";
      const method = questionData ? 'put' : 'post';
  
      const dataToSend = {
        question: question.trim(),
        correctAnswer: correctAnswer.trim(),
        ...(questionType === 'option' ? { options } : {}), // Include options only for option-based questions
      };
  
      const response = await axios({
        method,
        url,
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
        data: dataToSend,
      });
  
      setMessage(response.data.message || (questionData ? "Question updated successfully!" : "Question added successfully!"));
      setQuestion('');
      setOptions(['', '', '', '']); // Reset options to 4 empty strings
      setCorrectAnswer('');
      setQuestionType('option');
    } catch (error) {
      setMessage("Failed to save question: " + (error.response?.data?.message || error.message));
    }
  };
  

  return (
    <div className="admin-container">
      <form className="admin-form" onSubmit={handleSubmit}>
        <div className="quesContainer">
          <h2>{questionData ? "Edit Question" : "Create a Question"}</h2>
          <input
            type="text"
            placeholder="Question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="admin-quest"
            required
          />

          <label>Question Type:</label>
          <select value={questionType} onChange={(e) => setQuestionType(e.target.value)}>
            <option value="option">Option-based</option>
            <option value="text">Text-based</option>
          </select>

          {questionType === 'option' && (
            <>
              <h2>{questionData ? "Edit Options" : "Create Options"}</h2>
              <div className="admin-opt">
                {options.map((option, index) => (
                  <div key={index} className="option-item">
                    <input
                      type="text"
                      placeholder={`Option ${index + 1}`}
                      value={option}
                      onChange={(e) => handleOptionChange(index, e.target.value)}
                    />
                  </div>
                ))}
              </div>
            </>
          )}

          <h2>Enter Correct Answer</h2>
          <input
            type="text"
            placeholder="Correct Answer"
            value={correctAnswer}
            onChange={(e) => setCorrectAnswer(e.target.value)}
            required
          />
        </div>

        <div className="add-questions-btn">
          <button type="submit" disabled={ options.length !== 4}>
            {questionData ? "Update Question" : "Add Question"}
          </button>
          <Link id="v-q-btn" to="/ViewQuestions">
            <button type="button">View All Questions</button>
          </Link>
        </div>
        {message && <p className="alert-message">{message}</p>}
      </form>
    </div>
  );
};
