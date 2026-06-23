import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiBook, FiAward, FiUsers, FiTrendingUp } from 'react-icons/fi';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-7xl mx-auto">
      {/* Hero Section */}
      <div className="text-center py-16">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          Welcome to <span className="text-primary-600">QuizMaster</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Test your knowledge, challenge yourself, and compete with others in our comprehensive quiz platform
        </p>
        <div className="flex justify-center space-x-4">
          {user ? (
            <>
              <Link to="/quizzes" className="btn-primary text-lg px-8 py-3">
                Browse Quizzes
              </Link>
              <Link to="/create-quiz" className="btn-secondary text-lg px-8 py-3">
                Create Quiz
              </Link>
            </>
          ) : (
            <>
              <Link to="/register" className="btn-primary text-lg px-8 py-3">
                Get Started
              </Link>
              <Link to="/quizzes" className="btn-secondary text-lg px-8 py-3">
                Browse Quizzes
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Features Section */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
        <div className="card text-center">
          <FiBook className="text-4xl text-primary-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Multiple Categories</h3>
          <p className="text-gray-600">Explore quizzes across various subjects and topics</p>
        </div>

        <div className="card text-center">
          <FiAward className="text-4xl text-primary-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Track Progress</h3>
          <p className="text-gray-600">Monitor your performance and improve over time</p>
        </div>

        <div className="card text-center">
          <FiUsers className="text-4xl text-primary-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Compete</h3>
          <p className="text-gray-600">See how you rank on the global leaderboard</p>
        </div>

        <div className="card text-center">
          <FiTrendingUp className="text-4xl text-primary-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Create & Share</h3>
          <p className="text-gray-600">Build your own quizzes and share with others</p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="mt-16 card">
        <h2 className="text-3xl font-bold text-center mb-8">Why Choose QuizMaster?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="text-4xl font-bold text-primary-600 mb-2">100+</div>
            <div className="text-gray-600">Available Quizzes</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-primary-600 mb-2">Real-time</div>
            <div className="text-gray-600">Instant Feedback</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-primary-600 mb-2">Multiple</div>
            <div className="text-gray-600">Question Types</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

