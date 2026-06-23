import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { FiStar, FiAward, FiTrendingUp } from 'react-icons/fi';

const Leaderboard = () => {
  const { quizId } = useParams();
  const [leaderboard, setLeaderboard] = useState([]);
  const [type, setType] = useState(quizId ? 'quiz' : 'global');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, [type, quizId]);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      let res;
      if (type === 'quiz' && quizId) {
        res = await axios.get(`/api/results/quiz/${quizId}/leaderboard`);
      } else {
        res = await axios.get('/api/results/leaderboard/global');
      }
      setLeaderboard(res.data);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <FiStar className="text-yellow-500 text-2xl" />;
      case 2:
        return <FiStar className="text-gray-400 text-2xl" />;
      case 3:
        return <FiAward className="text-orange-600 text-2xl" />;
      default:
        return <span className="text-gray-500 font-bold">#{rank}</span>;
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-4xl font-bold text-gray-900 flex items-center">
          <FiTrendingUp className="mr-3" />
          Leaderboard
        </h1>
        {!quizId && (
          <div className="flex space-x-2">
            <button
              onClick={() => setType('global')}
              className={`px-4 py-2 rounded-lg ${
                type === 'global' ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-700'
              }`}
            >
              Global
            </button>
          </div>
        )}
      </div>

      {leaderboard.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-600 text-lg">No leaderboard data available yet</p>
        </div>
      ) : (
        <div className="card">
          <div className="space-y-4">
            {leaderboard.map((entry, index) => {
              const rank = index + 1;
              const isGlobal = type === 'global';
              const userData = isGlobal ? entry : (entry.user || entry.userId || {});
              const score = isGlobal ? parseFloat(entry.averageScore || 0) : parseFloat(entry.percentage || 0);
              const displayData = isGlobal
                ? { 
                    username: userData.username || 'Unknown', 
                    score, 
                    quizzes: entry.totalQuizzesTaken || 0 
                  }
                : { 
                    username: userData.username || 'Unknown', 
                    score, 
                    time: entry.timeTaken || 0 
                  };

              return (
                <div
                  key={entry.id || index}
                  className={`flex items-center justify-between p-4 rounded-lg ${
                    rank <= 3 ? 'bg-primary-50 border-2 border-primary-200' : 'bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="w-12 text-center">{getRankIcon(rank)}</div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-lg">{displayData.username}</h3>
                      {isGlobal && (
                        <p className="text-sm text-gray-600">{displayData.quizzes} quizzes taken</p>
                      )}
                      {!isGlobal && (
                        <p className="text-sm text-gray-600">
                          {Math.floor(displayData.time / 60)}m {displayData.time % 60}s
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary-600">
                      {Math.round(displayData.score)}%
                    </div>
                    {!isGlobal && (
                      <div className="text-sm text-gray-600">
                        {entry.score} / {entry.totalPoints} pts
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;

