import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getCourses } from '../../api/courses';
import { deleteCourse } from '../../api/courses';
import { Course } from '../../types/course';
import { User } from '../../types/auth';
import Badge from '../../components/atoms/Badge/Badge';
import Button from '../../components/atoms/Button/Button';
import Spinner from '../../components/atoms/Spinner/Spinner';
import { formatPrice } from '../../utils/format';

interface InstructorMyCoursesPageProps {
  user: User;
}

const InstructorMyCoursesPage: React.FC<InstructorMyCoursesPageProps> = ({ user }) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteError, setDeleteError] = useState('');

  const fetchCourses = () => {
    setLoading(true);
    getCourses()
      .then((all) => {
        // Filter to only instructor's courses (for INSTRUCTOR role)
        if (user.role === 'INSTRUCTOR') {
          setCourses(all.filter((c) => c.instructor?.id === user.id));
        } else {
          setCourses(all);
        }
      })
      .catch(() => setError('Failed to load courses.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchCourses(); }, []);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    setDeleteError('');
    try {
      await deleteCourse(id);
      setCourses((prev) => prev.filter((c) => c.id !== id));
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setDeleteError(message ?? 'Failed to delete course.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Courses</h1>
          <p className="text-sm text-gray-500 mt-1">
            {!loading && `${courses.length} course${courses.length !== 1 ? 's' : ''}`}
          </p>
        </div>
        <Link to="/instructor/courses/create">
          <Button size="sm">+ New Course</Button>
        </Link>
      </div>

      {deleteError && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2 rounded-lg mb-4">
          {deleteError}
        </div>
      )}

      {loading && <div className="py-16"><Spinner size="lg" className="justify-center" /></div>}
      {error && <p className="text-red-600 text-sm">{error}</p>}

      {!loading && !error && courses.length === 0 && (
        <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
          <p className="text-gray-500 text-sm">No courses yet.</p>
          <Link to="/instructor/courses/create" className="mt-3 inline-block text-indigo-600 text-sm font-medium hover:underline">
            Create your first course →
          </Link>
        </div>
      )}

      {!loading && courses.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-500">Course</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 hidden sm:table-cell">Topic</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 hidden md:table-cell">Price</th>
                <th className="px-5 py-3 text-right text-xs font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => (
                <tr key={course.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50">
                  <td className="px-5 py-3">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{course.title}</p>
                      {course.description && (
                        <p className="text-xs text-gray-500 truncate max-w-xs">{course.description}</p>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-3 hidden sm:table-cell">
                    {course.topic && <Badge variant="indigo">{course.topic.name}</Badge>}
                  </td>
                  <td className="px-5 py-3 hidden md:table-cell">
                    <span className="text-sm text-gray-700">{formatPrice(course.price)}</span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Link to={`/instructor/courses/${course.id}/lessons`}>
                        <Button variant="secondary" size="sm">Add Lesson</Button>
                      </Link>
                      <Link to={`/instructor/courses/${course.id}/edit`}>
                        <Button variant="secondary" size="sm">Edit</Button>
                      </Link>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDelete(course.id, course.title)}
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default InstructorMyCoursesPage;
