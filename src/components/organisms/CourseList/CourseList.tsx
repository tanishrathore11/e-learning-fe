import React from 'react';
import { Course } from '../../../types/course';
import CourseCard from '../../molecules/CourseCard/CourseCard';
import Spinner from '../../atoms/Spinner/Spinner';

interface CourseListProps {
  courses: Course[];
  loading?: boolean;
  error?: string;
  emptyMessage?: string;
}

const CourseList: React.FC<CourseListProps> = ({
  courses,
  loading,
  error,
  emptyMessage = 'No courses found.',
}) => {
  if (loading) {
    return (
      <div className="py-16 flex justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-10 text-center">
        <p className="text-red-600 text-sm">{error}</p>
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="py-10 text-center">
        <p className="text-gray-500 text-sm">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {courses.map((course) => (
        <CourseCard key={course.id} course={course} />
      ))}
    </div>
  );
};

export default CourseList;
