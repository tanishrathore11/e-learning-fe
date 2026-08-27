import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getCourses } from '../api/courses';
import { Course } from '../types/course';
import CourseList from '../components/organisms/CourseList/CourseList';

const CoursesPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const topicId = searchParams.get('topicId');
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    getCourses(topicId || undefined)
      .then(setCourses)
      .catch(() => setError('Failed to load courses. Please try again.'))
      .finally(() => setLoading(false));
  }, [topicId]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">All Courses</h1>
        <p className="text-sm text-gray-500 mt-1">
          {!loading && !error && `${courses.length} course${courses.length !== 1 ? 's' : ''} available`}
        </p>
      </div>
      <CourseList courses={courses} loading={loading} error={error} />
    </div>
  );
};

export default CoursesPage;
