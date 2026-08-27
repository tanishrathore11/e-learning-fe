import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User } from '../../../types/auth';
import { Topic } from '../../../types/topic';
import { getTopics } from '../../../api/topics';
interface NavbarProps {
  user: User | null;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [topics, setTopics] = useState<Topic[]>([]);

  useEffect(() => {
    getTopics().then(setTopics).catch(() => console.error('Failed to load topics'));
  }, []);

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  const navLinks = () => {
    if (!user) {
      return (
        <>
          <NavLink to="/">Home</NavLink>
          <TopicsDropdown topics={topics} />
          <NavLink to="/courses">Courses</NavLink>
          <NavLink to="/login">Login</NavLink>
          <NavLink to="/register">Register</NavLink>
        </>
      );
    }

    if (user.role === 'STUDENT') {
      return (
        <>
          <TopicsDropdown topics={topics} />
          <NavLink to="/courses">Courses</NavLink>
          <NavLink to="/student/dashboard">Dashboard</NavLink>
        </>
      );
    }

    if (user.role === 'INSTRUCTOR') {
      return (
        <>
          <TopicsDropdown topics={topics} />
          <NavLink to="/instructor/my-courses">My Courses</NavLink>
          <NavLink to="/instructor/courses/create">Create Course</NavLink>
          <NavLink to="/instructor/dashboard">Dashboard</NavLink>
        </>
      );
    }

    if (user.role === 'ADMIN') {
      return (
        <>
          <TopicsDropdown topics={topics} />
          <NavLink to="/admin/topics">Manage Topics</NavLink>
          <NavLink to="/courses">Courses</NavLink>
          <NavLink to="/admin/dashboard">Dashboard</NavLink>
        </>
      );
    }

    return null;
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link to="/" className="text-indigo-600 font-bold text-lg tracking-tight">
            ELearn
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks()}
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="relative group">
                <button className="flex items-center gap-1 text-sm text-gray-700 hover:text-indigo-600 font-medium transition-colors p-2 rounded-lg hover:bg-gray-50 focus:outline-none">
                  {user.name}
                  <svg className="w-4 h-4 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </button>
                <div className="absolute right-0 mt-1 w-48 bg-white border border-gray-100 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="p-1">
                    <Link to="/profile" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md">View Profile</Link>
                    <button onClick={handleLogout} className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md mt-1">Logout</button>
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded text-gray-600 hover:bg-gray-100"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-gray-100 py-2 flex flex-col gap-1 pb-3">
            {navLinks()}
            {user && (
              <button
                onClick={handleLogout}
                className="text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg"
              >
                Logout ({user.name})
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

const NavLink: React.FC<{ to: string; children: React.ReactNode }> = ({ to, children }) => (
  <Link
    to={to}
    className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
  >
    {children}
  </Link>
);

const TopicsDropdown: React.FC<{ topics: Topic[] }> = ({ topics }) => {
  return (
    <div className="relative group">
      <button className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors focus:outline-none">
        Topics
        <svg className="w-4 h-4 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
      </button>
      <div className="absolute left-0 mt-1 w-56 bg-white border border-gray-100 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 overflow-hidden">
        <div className="py-2 max-h-64 overflow-y-auto">
          {topics.length === 0 ? (
            <div className="px-4 py-2 text-sm text-gray-500">No topics found</div>
          ) : (
            topics.map((topic) => (
              <Link
                key={topic.id}
                to={`/courses?topicId=${topic.id}`}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
              >
                {topic.name}
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
