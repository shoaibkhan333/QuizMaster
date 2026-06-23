import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { FiCheck, FiX, FiClock, FiAward, FiTrendingUp } from 'react-icons/fi';

const Results = () => {
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quizResult, setQuizResult] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const quizId = searchParams.get('quiz');
    if (quizId) {
      // Show results immediately from URL params
      const score = searchParams.get('score');
      const total = searchParams.get('total');
      const percentage = searchParams.get('percentage');
      
      if (score && total && percentage) {
        // Set basic result immediately for fast display
        setQuizResult({
          quiz: { 
            id: quizId,
            title: 'Loading quiz details...', 
            questions: [],
            category: 'Loading...'
          },
          result: null,
          score: parseInt(score) || 0,
          totalPoints: parseInt(total) || 0,
          percentage: parseFloat(percentage) || 0
        });
        setLoading(false);
      } else {
        // If no URL params, still try to load
        setLoading(true);
      }
      
      // Fetch detailed quiz data in background
      fetchQuizResult(quizId);
    } else {
      setLoading(true);
      fetchMyResults();
    }
  }, [searchParams]);

  const fetchMyResults = async () => {
    try {
      const res = await axios.get('/api/results/my-results');
      setResults(res.data.results || []);
    } catch (error) {
      console.error('Error fetching results:', error);
      setError(error.response?.data?.message || 'Error loading results');
    } finally {
      setLoading(false);
    }
  };

  const fetchQuizResult = async (quizId) => {
    try {
      // Fetch quiz with answers
      const quizRes = await axios.get(`/api/quizzes/${quizId}/with-answers`);
      
      // Parse questions if stored as JSON string
      let quizData = quizRes.data;
      if (typeof quizData.questions === 'string') {
        try {
          quizData.questions = JSON.parse(quizData.questions);
        } catch (parseError) {
          console.error('Error parsing quiz questions:', parseError);
        }
      }
      
      // Ensure questions is an array
      if (!quizData.questions || !Array.isArray(quizData.questions)) {
        quizData.questions = [];
      }
      
      // Fetch the latest result for this quiz
      try {
        const resultsRes = await axios.get('/api/results/my-results');
        const quizIdNum = parseInt(quizId);
        const latestResult = resultsRes.data.results?.find(r => {
          const rQuizId = r.quizId || r.quiz?.id;
          return rQuizId === quizIdNum || rQuizId?.id === quizIdNum;
        });
        
        if (latestResult) {
          setQuizResult({
            quiz: quizData,
            result: latestResult,
            score: parseFloat(latestResult.score || 0),
            totalPoints: parseFloat(latestResult.totalPoints || 0),
            percentage: parseFloat(latestResult.percentage || 0)
          });
          return;
        }
      } catch (resultError) {
        console.error('Error fetching result details:', resultError);
        // Continue with quiz data only
      }
      
      // Use URL params for score if result not found
      const score = searchParams.get('score');
      const total = searchParams.get('total');
      const percentage = searchParams.get('percentage');
      
      setQuizResult({
        quiz: quizData,
        result: null,
        score: parseInt(score) || 0,
        totalPoints: parseInt(total) || 0,
        percentage: parseFloat(percentage) || 0
      });
    } catch (error) {
      console.error('Error fetching quiz result:', error);
      // Don't set error state if we already have URL param data
      if (!quizResult) {
        const errorMsg = error.response?.data?.message || 'Unable to load quiz details. Basic results shown.';
        setError(errorMsg);
      }
    }
  };

  const getScoreColor = (percentage) => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
      </div>
    );
  }

  if (error && !quizResult) {
    return (
      <div className="card text-center py-12">
        <p className="text-red-600 text-lg mb-4">{error}</p>
        <Link to="/quizzes" className="btn-primary">
          Browse Quizzes
        </Link>
      </div>
    );
  }

  if (quizResult && quizResult.quiz) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="card mb-6 text-center">
          <FiAward className="text-6xl text-primary-600 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Quiz Completed!</h1>
          <h2 className="text-2xl text-gray-600 mb-6">{quizResult.quiz?.title || 'Quiz'}</h2>
          
          <div className="grid md:grid-cols-4 gap-6 mb-6">
            <div>
              <div className={`text-5xl font-bold ${getScoreColor(quizResult.percentage)}`}>
                {Math.round(quizResult.percentage)}%
              </div>
              <div className="text-gray-600 mt-2">Score</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-gray-900">
                {quizResult.score} / {quizResult.totalPoints}
              </div>
              <div className="text-gray-600 mt-2">Points</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-gray-900">
                {quizResult.quiz.questions?.length || 0}
              </div>
              <div className="text-gray-600 mt-2">Questions</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-gray-900">
                {quizResult.result?.timeTaken ? (
                  <>
                    {Math.floor(quizResult.result.timeTaken / 60)}:
                    {(quizResult.result.timeTaken % 60).toString().padStart(2, '0')}
                  </>
                ) : (
                  'N/A'
                )}
              </div>
              <div className="text-gray-600 mt-2">Time Taken</div>
            </div>
          </div>

          <Link to="/results" className="btn-primary">
            View All Results
          </Link>
        </div>

        {quizResult.quiz.questions && quizResult.quiz.questions.length > 0 && (
        <div className="card">
          <h2 className="text-2xl font-bold mb-4">Question Review</h2>
          <div className="space-y-6">
            {quizResult.quiz.questions.map((question, index) => {
                const answerData = quizResult.result?.answers?.find(a => {
                  const aId = typeof a.questionId === 'number' ? a.questionId : parseInt(a.questionId);
                  return aId === index;
                }) || null;
                const userAnswer = answerData?.userAnswer || '';
                const isCorrect = answerData?.isCorrect || false;
                const hasAnswerData = answerData !== null;

              return (
                <div key={index} className="border-l-4 border-gray-200 pl-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {index + 1}. {question.questionText}
                    </h3>
                    {hasAnswerData && (
                      isCorrect ? (
                        <FiCheck className="text-green-600 text-2xl flex-shrink-0" />
                      ) : (
                        <FiX className="text-red-600 text-2xl flex-shrink-0" />
                      )
                    )}
                  </div>

                  {question.questionType === 'multiple-choice' && (
                    <div className="space-y-2 mt-3">
                      {question.options.map((option, oIndex) => (
                        <div
                          key={oIndex}
                          className={`p-2 rounded ${
                            option.isCorrect
                              ? 'bg-green-100 border-2 border-green-500'
                              : hasAnswerData && option.text === userAnswer
                              ? 'bg-red-100 border-2 border-red-500'
                              : 'bg-gray-50'
                          }`}
                        >
                          {option.text}
                          {option.isCorrect && <span className="ml-2 text-green-700 font-semibold">✓ Correct</span>}
                          {hasAnswerData && option.text === userAnswer && !option.isCorrect && (
                            <span className="ml-2 text-red-700 font-semibold">Your Answer</span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {question.questionType === 'true-false' && (
                    <div className="space-y-2 mt-3">
                      {question.options.map((option, oIndex) => (
                        <div
                          key={oIndex}
                          className={`p-2 rounded ${
                            option.isCorrect
                              ? 'bg-green-100 border-2 border-green-500'
                              : hasAnswerData && option.text === userAnswer
                              ? 'bg-red-100 border-2 border-red-500'
                              : 'bg-gray-50'
                          }`}
                        >
                          {option.text}
                          {option.isCorrect && <span className="ml-2 text-green-700 font-semibold">✓ Correct</span>}
                          {hasAnswerData && option.text === userAnswer && !option.isCorrect && (
                            <span className="ml-2 text-red-700 font-semibold">Your Answer</span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {question.questionType === 'short-answer' && (
                    <div className="mt-3 space-y-2">
                      <div className="p-3 bg-gray-50 rounded">
                        <span className="text-sm text-gray-600">Your answer: </span>
                        <span className="font-medium">{userAnswer || 'No answer provided'}</span>
                      </div>
                      <div className="p-3 bg-green-50 rounded border-2 border-green-500">
                        <span className="text-sm text-gray-600">Correct answer: </span>
                        <span className="font-medium">{question.correctAnswer}</span>
                      </div>
                    </div>
                  )}

                  {question.explanation && (
                    <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-gray-700">{question.explanation}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
        {(!quizResult.quiz.questions || quizResult.quiz.questions.length === 0) && (
          <div className="card">
            <p className="text-gray-500 text-center py-8">Question review will be available once quiz details are loaded.</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold text-gray-900 mb-6">My Results</h1>

      {results.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-600 text-lg mb-4">No results yet</p>
          <Link to="/quizzes" className="btn-primary">
            Browse Quizzes
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {results.map((result) => {
            const quizData = result.quiz || {};
            const quizId = quizData.id || result.quizId;
            const percentageValue = parseFloat(result.percentage || 0);

            return (
              <Link
                key={result.id}
                to={`/results?quiz=${quizId}`}
                className="block card bg-gradient-to-r from-white via-white to-primary-50/40 hover:shadow-xl hover:-translate-y-1 transition-all duration-200 cursor-pointer"
              >
                <div className="flex items-center justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">
                        {quizData.title || 'Unknown Quiz'}
                      </h3>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-primary-100 text-primary-700">
                        {quizData.category || 'Uncategorized'}
                      </span>
                    </div>

                    <div className="flex items-center flex-wrap gap-4 text-sm text-gray-600 mb-3">
                      <span className="inline-flex items-center">
                        <FiTrendingUp className="mr-1" />
                        {Math.round(percentageValue)}%
                      </span>
                      <span className="inline-flex items-center">
                        <FiAward className="mr-1" />
                        {result.score} / {result.totalPoints} points
                      </span>
                      <span className="inline-flex items-center">
                        <FiClock className="mr-1" />
                        {result.completedAt ? new Date(result.completedAt).toLocaleDateString() : 'N/A'}
                      </span>
                    </div>

                    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${
                          percentageValue >= 80
                            ? 'bg-green-500'
                            : percentageValue >= 60
                            ? 'bg-yellow-400'
                            : 'bg-red-500'
                        }`}
                        style={{ width: `${Math.min(Math.max(percentageValue, 0), 100)}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="hidden sm:flex flex-col items-end justify-center">
                    <span className={`text-3xl font-extrabold ${getScoreColor(percentageValue)}`}>
                      {Math.round(percentageValue)}%
                    </span>
                    <span className="text-xs text-gray-500 mt-1">Click to view details</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Results;


