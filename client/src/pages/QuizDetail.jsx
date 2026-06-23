import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { FiClock, FiUsers, FiTrendingUp, FiPlay, FiEdit, FiTrash2 } from 'react-icons/fi';

const QuizDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuiz();
  }, [id]);

  const fetchQuiz = async () => {
    try {
      const res = await axios.get(`/api/quizzes/${id}`);
      setQuiz(res.data);
    } catch (error) {
      console.error('Error fetching quiz:', error);
      if (error.response?.status === 404) {
        // Quiz not found, will be handled by the component
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this quiz? This action cannot be undone.')) return;

    try {
      await axios.delete(`/api/quizzes/${id}`);
      navigate('/quizzes');
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Error deleting quiz. You may not have permission to delete this quiz.';
      alert(errorMsg);
      console.error('Delete error:', error);
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
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
        <p className="text-gray-600 text-lg">Quiz not found</p>
      </div>
    );
  }

  // Check if current user is the creator of this quiz
  // Handle both string and number IDs for comparison
  const isCreator = user && quiz && (
    String(quiz.createdBy) === String(user.id) ||
    parseInt(quiz.createdBy) === parseInt(user.id) ||
    (quiz.creator && (
      String(quiz.creator.id) === String(user.id) ||
      parseInt(quiz.creator.id) === parseInt(user.id)
    ))
  );

  return (
    <div className="max-w-4xl mx-auto">
      <div className="card mb-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">{quiz.title}</h1>
            {quiz.description && (
              <p className="text-gray-600 text-lg mb-4">{quiz.description}</p>
            )}
          </div>
          <span className={`px-4 py-2 rounded-full text-sm font-medium ${getDifficultyColor(quiz.difficulty)}`}>
            {quiz.difficulty}
          </span>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div className="flex items-center text-gray-600">
            <FiClock className="mr-2 text-primary-600" />
            <span className="font-medium">Time Limit:</span>
            <span className="ml-2">{quiz.timeLimit} minutes</span>
          </div>
          <div className="flex items-center text-gray-600">
            <FiUsers className="mr-2 text-primary-600" />
            <span className="font-medium">Attempts:</span>
            <span className="ml-2">{quiz.totalAttempts}</span>
          </div>
          {quiz.averageScore > 0 && (
            <div className="flex items-center text-gray-600">
              <FiTrendingUp className="mr-2 text-primary-600" />
              <span className="font-medium">Avg Score:</span>
              <span className="ml-2">{Math.round(quiz.averageScore)}%</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-primary-600 font-semibold text-lg">{quiz.category}</span>
            <span className="text-gray-500 ml-2">• {quiz.questions?.length || 0} questions</span>
          </div>

          {isCreator ? (
            <div className="flex space-x-3">
              <Link to={`/quizzes/${id}/take`} className="btn-primary">
                <FiPlay className="inline mr-1" />
                Start Quiz
              </Link>
              <Link to={`/create-quiz?edit=${id}`} className="btn-secondary">
                <FiEdit className="inline mr-1" />
                Edit
              </Link>
              <button onClick={handleDelete} className="btn-secondary bg-red-100 text-red-700 hover:bg-red-200">
                <FiTrash2 className="inline mr-1" />
                Delete
              </button>
            </div>
          ) : user ? (
            <Link to={`/quizzes/${id}/take`} className="btn-primary">
              <FiPlay className="inline mr-1" />
              Start Quiz
            </Link>
          ) : (
            <Link to="/login" className="btn-primary">
              Login to Take Quiz
            </Link>
          )}
        </div>
      </div>

      {/* Question Preview */}
      <div className="card">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Questions Preview</h2>
        <div className="space-y-4">
          {quiz.questions?.slice(0, 3).map((question, index) => (
            <div key={index} className="border-l-4 border-primary-500 pl-4">
              <p className="font-medium text-gray-900 mb-2">
                {index + 1}. {question.questionText}
              </p>
              <p className="text-sm text-gray-500">
                Type: {question.questionType} • Points: {question.points}
              </p>
            </div>
          ))}
          {quiz.questions?.length > 3 && (
            <p className="text-gray-500 text-center">
              + {quiz.questions.length - 3} more questions
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizDetail;

