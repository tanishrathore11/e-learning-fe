import React from 'react';
import { Link } from 'react-router-dom';
import { Course } from '../../../types/course';
import Badge from '../../atoms/Badge/Badge';
import Button from '../../atoms/Button/Button';
import { formatPrice } from '../../../utils/format';

interface CourseCardProps {
  course: Course;
  actionLabel?: string;
  onAction?: (courseId: string) => void;
  to?: string;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, to }) => {
  const viewHref = to ?? `/courses/${course.id}`;

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col gap-3 hover:border-indigo-300 hover:shadow-sm transition-all">
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-gray-900 text-base leading-snug">{course.title}</h3>
        <span className="text-indigo-600 font-semibold text-sm whitespace-nowrap">
          {formatPrice(course.price)}
        </span>
      </div>

      {course.description && (
        <p className="text-sm text-gray-500 line-clamp-2">{course.description}</p>
      )}

      <div className="flex flex-wrap gap-2 mt-auto">
        {course.topic && (
          <Badge variant="indigo">{course.topic.name}</Badge>
        )}
        <Badge variant="gray">{course.instructor?.name}</Badge>
      </div>

      <Link to={viewHref}>
        <Button variant="secondary" size="sm" className="w-full mt-1">
          View Course
        </Button>
      </Link>
    </div>
  );
};

export default CourseCard;
