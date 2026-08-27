import React from 'react';
import { Link } from 'react-router-dom';
import { StudentDashboardItem } from '../../../types/dashboard';
import ProgressBar from '../../atoms/ProgressBar/ProgressBar';
import Badge from '../../atoms/Badge/Badge';
import Spinner from '../../atoms/Spinner/Spinner';
import { formatPrice } from '../../../utils/format';

interface StudentDashboardProps {
  items: StudentDashboardItem[];
  loading?: boolean;
  error?: string;
}

const StudentDashboard: React.FC<StudentDashboardProps> = ({ items, loading, error }) => {
  if (loading) {
    return <div className="py-16"><Spinner size="lg" className="justify-center" /></div>;
  }
  if (error) {
    return <p className="text-red-600 text-sm py-4">{error}</p>;
  }
  if (items.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
        <p className="text-gray-500 text-sm">You haven't enrolled in any courses yet.</p>
        <Link to="/courses" className="mt-3 inline-block text-indigo-600 text-sm font-medium hover:underline">
          Browse Courses →
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map(({ enrollment, completedLessons }) => {
        const course = enrollment.course;
        const totalLessons = course.lessons?.length ?? 0;
        const percentage = totalLessons === 0 ? 0 : Math.round((completedLessons / totalLessons) * 100);

        return (
          <div key={enrollment.id} className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col gap-3">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-semibold text-gray-900 text-sm leading-snug">{course.title}</h3>
              <span className="text-indigo-600 font-semibold text-sm whitespace-nowrap">
                {formatPrice(course.price)}
              </span>
            </div>

            {course.topic && <Badge variant="indigo">{course.topic.name}</Badge>}

            <div className="mt-auto">
              <ProgressBar value={percentage} showLabel />
              <p className="text-xs text-gray-500 mt-1">
                {completedLessons} / {totalLessons} lessons complete
              </p>
            </div>

            <Link
              to={`/courses/${course.id}`}
              className="text-center text-sm text-indigo-600 font-medium border border-indigo-200 rounded-lg py-1.5 hover:bg-indigo-50 transition-colors"
            >
              {percentage === 100 ? 'Review Course' : 'Continue Learning'}
            </Link>
          </div>
        );
      })}
    </div>
  );
};

export default StudentDashboard;
