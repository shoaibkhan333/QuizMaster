import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { FiUser, FiAward, FiTrendingUp, FiBook, FiBarChart2 } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const Profile = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalQuizzes: 0,
    totalResults: 0,
    averageScore: 0,
    categoryStats: {}
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchStats();
    }
  }, [user]);

  const fetchStats = async () => {
    try {
      const res = await axios.get(`/api/users/${user.id}/stats`);
      setStats(res.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
      setStats({
        totalQuizzes: 0,
        totalResults: 0,
        averageScore: 0,
        categoryStats: {}
      });
    } finally {
      setLoading(false);
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
    <div className="max-w-6xl mx-auto">
      <div className="card mb-6">
        <div className="flex items-center space-x-6">
          <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center">
            <FiUser className="text-4xl text-primary-600" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-gray-900">{user.username}</h1>
            <p className="text-gray-600 mt-1">{user.email}</p>
            <p className="text-sm text-gray-500 mt-2">
              Member since {new Date(user.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      {stats && (
        <>
          {/* Overall Stats */}
          <div className="grid md:grid-cols-3 gap-6 mb-6">
            <div className="card text-center">
              <FiBook className="text-4xl text-primary-600 mx-auto mb-3" />
              <div className="text-3xl font-bold text-gray-900">{stats.totalQuizzes}</div>
              <div className="text-gray-600">Quizzes Created</div>
            </div>

            <div className="card text-center">
              <FiAward className="text-4xl text-primary-600 mx-auto mb-3" />
              <div className="text-3xl font-bold text-gray-900">{stats.totalResults}</div>
              <div className="text-gray-600">Quizzes Taken</div>
            </div>

            <div className="card text-center">
              <FiTrendingUp className="text-4xl text-primary-600 mx-auto mb-3" />
              <div className="text-3xl font-bold text-gray-900">
                {Math.round(stats.averageScore)}%
              </div>
              <div className="text-gray-600">Average Score</div>
            </div>
          </div>

          {/* Category Stats */}
          {Object.keys(stats.categoryStats).length > 0 && (
            <div className="card">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <FiBarChart2 className="mr-2" />
                Performance by Category
              </h2>
              <div className="space-y-4">
                {Object.entries(stats.categoryStats).map(([category, catStats]) => (
                  <div key={category}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-gray-900">{category}</span>
                      <span className="text-gray-600">
                        {catStats.count} attempts • {Math.round(catStats.average)}% avg
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary-600 h-2 rounded-full"
                        style={{ width: `${catStats.average}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6 flex space-x-4">
            <Link to="/results" className="btn-primary">
              View All Results
            </Link>
            <Link to="/create-quiz" className="btn-secondary">
              Create New Quiz
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default Profile;

