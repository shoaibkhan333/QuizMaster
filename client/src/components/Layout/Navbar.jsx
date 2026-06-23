import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiHome, FiBook, FiPlusCircle, FiBarChart2, FiUser, FiLogOut, FiLogIn, FiUserPlus } from 'react-icons/fi';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <FiBook className="text-primary-600 text-2xl" />
            <span className="text-xl font-bold text-gray-800">QuizMaster</span>
          </Link>

          <div className="flex items-center space-x-6">
            <Link to="/" className="flex items-center space-x-1 text-gray-700 hover:text-primary-600 transition">
              <FiHome />
              <span>Home</span>
            </Link>
            <Link to="/quizzes" className="flex items-center space-x-1 text-gray-700 hover:text-primary-600 transition">
              <FiBook />
              <span>Quizzes</span>
            </Link>
            <Link to="/leaderboard" className="flex items-center space-x-1 text-gray-700 hover:text-primary-600 transition">
              <FiBarChart2 />
              <span>Leaderboard</span>
            </Link>

            {user ? (
              <>
                <Link to="/create-quiz" className="flex items-center space-x-1 text-primary-600 hover:text-primary-700 transition">
                  <FiPlusCircle />
                  <span>Create Quiz</span>
                </Link>
                <Link to="/results" className="flex items-center space-x-1 text-gray-700 hover:text-primary-600 transition">
                  <FiBarChart2 />
                  <span>My Results</span>
                </Link>
                <Link to="/profile" className="flex items-center space-x-1 text-gray-700 hover:text-primary-600 transition">
                  <FiUser />
                  <span>{user.username}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-red-600 hover:text-red-700 transition"
                >
                  <FiLogOut />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="flex items-center space-x-1 text-gray-700 hover:text-primary-600 transition">
                  <FiLogIn />
                  <span>Login</span>
                </Link>
                <Link to="/register" className="btn-primary">
                  <FiUserPlus className="inline mr-1" />
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

