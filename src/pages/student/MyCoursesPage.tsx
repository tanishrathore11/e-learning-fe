import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getEnrolledCourses } from '../../api/enrollment';
import { Enrollment } from '../../types/enrollment';
import Badge from '../../components/atoms/Badge/Badge';
import Spinner from '../../components/atoms/Spinner/Spinner';
import Button from '../../components/atoms/Button/Button';
import { formatPrice } from '../../utils/format';

const StudentMyCoursesPage: React.FC = () => {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getEnrolledCourses()
      .then(setEnrollments)
      .catch(() => setError('Failed to load your courses.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Courses</h1>
        <p className="text-sm text-gray-500 mt-1">
          {!loading && !error && `${enrollments.length} enrolled course${enrollments.length !== 1 ? 's' : ''}`}
        </p>
      </div>

      {loading && <div className="py-16"><Spinner size="lg" className="justify-center" /></div>}
      {error && <p className="text-red-600 text-sm">{error}</p>}

      {!loading && !error && enrollments.length === 0 && (
        <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
          <p className="text-gray-500 text-sm">You haven't enrolled in any courses yet.</p>
          <Link to="/courses" className="mt-3 inline-block text-indigo-600 text-sm font-medium hover:underline">
            Browse Courses →
          </Link>
        </div>
      )}

      {!loading && enrollments.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {enrollments.map(({ id, course }) => (
            <div key={id} className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col gap-3">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold text-gray-900 text-sm leading-snug">{course.title}</h3>
                <span className="text-indigo-600 font-semibold text-sm">{formatPrice(course.price)}</span>
              </div>
              {course.topic && <Badge variant="indigo">{course.topic.name}</Badge>}
              <p className="text-xs text-gray-500">By {course.instructor?.name}</p>
              <Link to={`/courses/${course.id}`}>
                <Button variant="secondary" size="sm" className="w-full">
                  Continue Learning
                </Button>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentMyCoursesPage;
