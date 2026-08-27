import React from 'react';
import { Link } from 'react-router-dom';
import { User } from '../types/auth';
import Button from '../components/atoms/Button/Button';
import { BookOpen, TrendingUp, MonitorPlay } from 'lucide-react';

interface HomePageProps {
  user: User | null;
}

const HomePage: React.FC<HomePageProps> = ({ user }) => {
  return (
    <div className="relative min-h-screen bg-gray-50 overflow-hidden">
      {/* Background blobs for a lively, modern feel */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-40 -right-20 w-96 h-96 bg-indigo-200 rounded-lg mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
        <div className="absolute top-20 -left-20 w-72 h-72 bg-blue-200 rounded-lg mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-20 left-1/3 w-80 h-80 bg-red-200 rounded-lg mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pt-32 pb-20 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight leading-tight">
            Learn at your own <span className="text-indigo-600">pace</span>.
          </h1>
          <p className="mt-6 text-xl text-gray-600 max-w-2xl mx-auto">
            Access high-quality courses from expert instructors. Track your progress, grow your skills, and achieve your goals with our premium platform.
          </p>
          <div className="mt-10 flex gap-4 justify-center flex-wrap">
            {user ? (
              <>
                <Link to="/courses">
                  <Button size="lg" className="px-8 py-3 text-lg rounded-lg shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5">
                    Browse Courses
                  </Button>
                </Link>
                {user.role === 'STUDENT' && (
                  <Link to="/student/dashboard">
                    <Button variant="secondary" size="lg" className="px-8 py-3 text-lg rounded-lg shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 bg-white border-2">
                      My Dashboard
                    </Button>
                  </Link>
                )}
                {user.role === 'INSTRUCTOR' && (
                  <Link to="/instructor/dashboard">
                    <Button variant="secondary" size="lg" className="px-8 py-3 text-lg rounded-lg shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 bg-white border-2">
                      My Dashboard
                    </Button>
                  </Link>
                )}
                {user.role === 'ADMIN' && (
                  <Link to="/admin/dashboard">
                    <Button variant="secondary" size="lg" className="px-8 py-3 text-lg rounded-lg shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 bg-white border-2">
                      My Dashboard
                    </Button>
                  </Link>
                )}
              </>
            ) : (
              <>
                <Link to="/register">
                  <Button size="lg" className="px-8 py-3 text-lg rounded-lg shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5">
                    Get Started
                  </Button>
                </Link>
                <Link to="/login">
                  <Button variant="secondary" size="lg" className="px-8 py-3 text-lg rounded-lg shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 bg-white border-2">
                    Sign In
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Feature grid */}
        <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard
            icon={<BookOpen className="w-6 h-6 text-indigo-600" />}
            title="Expert Instructors"
            description="Learn from professionals with real-world experience. Every course is curated for quality."
          />
          <FeatureCard
            icon={<TrendingUp className="w-6 h-6 text-indigo-600" />}
            title="Track Progress"
            description="Monitor your completion rate lesson by lesson. Stay motivated and hit your milestones."
          />
          <FeatureCard
            icon={<MonitorPlay className="w-6 h-6 text-indigo-600" />}
            title="Flexible Learning"
            description="Video lessons and reading notes available 24/7. Learn anywhere, anytime — your choice."
          />
        </div>
      </div>
    </div>
  );
};

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({ icon, title, description }) => (
  <div className="bg-white/80 backdrop-blur-sm border border-gray-100 rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
    <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-indigo-100 transition-all duration-300">
      {icon}
    </div>
    <h3 className="font-bold text-gray-900 text-lg mb-2">{title}</h3>
    <p className="text-gray-600 leading-relaxed">{description}</p>
  </div>
);

export default HomePage;
