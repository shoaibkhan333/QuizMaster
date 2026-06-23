import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiClock, FiCheck, FiX } from 'react-icons/fi';

const TakeQuiz = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchQuiz();
  }, [id]);

  useEffect(() => {
    if (quiz && timeLeft > 0 && !submitting) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            // Auto-submit when time runs out
              const submitQuiz = async () => {
              if (submitting) return;
              setSubmitting(true);
              setError(null);
              const timeTaken = Math.floor((Date.now() - startTime) / 1000);

              try {
                const res = await axios.post(`/api/quizzes/${id}/submit`, {
                  answers,
                  timeTaken
                });

                navigate(`/results?quiz=${id}&score=${res.data.score}&total=${res.data.totalPoints}&percentage=${res.data.percentage}`);
              } catch (error) {
                const errorMsg = error.response?.data?.message || 'An error occurred while submitting your quiz. Please try again.';
                setError(errorMsg);
                console.error('Error submitting quiz:', error);
                setSubmitting(false);
              }
            };
            submitQuiz();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [quiz, timeLeft, id, answers, startTime, submitting, navigate]);

  const fetchQuiz = async () => {
    try {
      setError(null);
      const res = await axios.get(`/api/quizzes/${id}`);
      
      // Ensure questions is an array
      const quizData = res.data;
      if (typeof quizData.questions === 'string') {
        try {
          quizData.questions = JSON.parse(quizData.questions);
        } catch (parseError) {
          console.error('Error parsing quiz questions:', parseError);
          setError('Unable to load quiz questions. Please try again or contact the quiz creator.');
          setLoading(false);
          return;
        }
      }
      
      if (!quizData.questions || !Array.isArray(quizData.questions) || quizData.questions.length === 0) {
        setError('This quiz appears to be incomplete and has no questions. Please contact the quiz creator.');
        setLoading(false);
        return;
      }
      
      setQuiz(quizData);
      setAnswers(new Array(quizData.questions.length).fill(null));
      setTimeLeft(quizData.timeLimit * 60);
      setStartTime(Date.now());
    } catch (error) {
      console.error('Error fetching quiz:', error);
      const errorMsg = error.response?.data?.message || 'Unable to load quiz. Please try again.';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (answer) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = { answer };
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = async () => {
    if (submitting) return;

    setSubmitting(true);
    setError(null);
    const timeTaken = Math.floor((Date.now() - startTime) / 1000);

    try {
      const res = await axios.post(`/api/quizzes/${id}/submit`, {
        answers,
        timeTaken
      });

      // Navigate with result data in URL params as fallback
      navigate(`/results?quiz=${id}&score=${res.data.score}&total=${res.data.totalPoints}&percentage=${res.data.percentage}`);
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'An error occurred while submitting your quiz. Please try again.';
      setError(errorMsg);
      console.error('Error submitting quiz:', error);
      setSubmitting(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="card text-center py-12">
        {error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-4">
            <div className="flex items-center justify-center mb-2">
              <FiX className="text-red-600 text-2xl mr-2" />
              <h3 className="text-red-800 font-semibold text-lg">Error Loading Quiz</h3>
            </div>
            <p className="text-red-700">{error}</p>
          </div>
        ) : (
          <p className="text-gray-600 text-lg">Quiz not found</p>
        )}
      </div>
    );
  }

  const question = quiz.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;
  const answeredCount = answers.filter(a => a !== null).length;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Error Message */}
      {error && (
        <div className="card mb-6 bg-red-50 border-2 border-red-200">
          <div className="flex items-start">
            <FiX className="text-red-600 text-xl mr-3 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="text-red-800 font-semibold mb-1">Submission Error</h3>
              <p className="text-red-700">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-red-600 hover:text-red-800 ml-4"
              aria-label="Dismiss error"
            >
              ×
            </button>
          </div>
        </div>
      )}
      {/* Header */}
      <div className="card mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900">{quiz.title}</h1>
          <div className="flex items-center space-x-4">
            <div className="flex items-center text-red-600">
              <FiClock className="mr-1" />
              <span className="font-mono font-bold">{formatTime(timeLeft)}</span>
            </div>
            <div className="text-gray-600">
              {answeredCount} / {quiz.questions.length} answered
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-primary-600 h-2 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Question */}
      <div className="card mb-6">
        <div className="mb-4">
          <span className="text-sm text-gray-500">Question {currentQuestion + 1} of {quiz.questions.length}</span>
          <span className="text-sm text-gray-500 ml-4">• {question.points} point{question.points !== 1 ? 's' : ''}</span>
        </div>

        <h2 className="text-2xl font-semibold text-gray-900 mb-6">{question.questionText}</h2>

        {question.questionType === 'multiple-choice' && (
          <div className="space-y-3">
            {question.options.map((option, index) => (
              <label
                key={index}
                className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition ${
                  answers[currentQuestion]?.answer === option.text
                    ? 'border-primary-600 bg-primary-50'
                    : 'border-gray-200 hover:border-primary-300'
                }`}
              >
                <input
                  type="radio"
                  name="answer"
                  value={option.text}
                  checked={answers[currentQuestion]?.answer === option.text}
                  onChange={() => handleAnswerChange(option.text)}
                  className="mr-3"
                />
                <span className="text-gray-900">{option.text}</span>
              </label>
            ))}
          </div>
        )}

        {question.questionType === 'true-false' && (
          <div className="space-y-3">
            {['True', 'False'].map((option) => (
              <label
                key={option}
                className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition ${
                  answers[currentQuestion]?.answer === option
                    ? 'border-primary-600 bg-primary-50'
                    : 'border-gray-200 hover:border-primary-300'
                }`}
              >
                <input
                  type="radio"
                  name="answer"
                  value={option}
                  checked={answers[currentQuestion]?.answer === option}
                  onChange={() => handleAnswerChange(option)}
                  className="mr-3"
                />
                <span className="text-gray-900">{option}</span>
              </label>
            ))}
          </div>
        )}

        {question.questionType === 'short-answer' && (
          <input
            type="text"
            value={answers[currentQuestion]?.answer || ''}
            onChange={(e) => handleAnswerChange(e.target.value)}
            className="input-field"
            placeholder="Enter your answer..."
          />
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
          className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>

        <div className="flex space-x-2">
          {quiz.questions.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentQuestion(index)}
              className={`w-10 h-10 rounded-lg ${
                answers[index] !== null
                  ? 'bg-green-500 text-white'
                  : index === currentQuestion
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>

        {currentQuestion === quiz.questions.length - 1 ? (
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="btn-primary"
          >
            {submitting ? 'Submitting...' : 'Submit Quiz'}
          </button>
        ) : (
          <button onClick={handleNext} className="btn-primary">
            Next
          </button>
        )}
      </div>
    </div>
  );
};

export default TakeQuiz;

