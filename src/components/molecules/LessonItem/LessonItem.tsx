import React from 'react';
import { Link } from 'react-router-dom';
import { Lesson } from '../../../types/lesson';
import Badge from '../../atoms/Badge/Badge';

interface LessonItemProps {
  lesson: Lesson;
  courseId?: string;
  enrollmentId?: string;
  onToggleComplete?: (lessonId: string, enrollmentId: string, isCompleted: boolean) => void;
  isStudent?: boolean;
}

const lessonTypeBadge = (type: string) => {
  switch (type) {
    case 'VIDEO': return <Badge variant="indigo">Video</Badge>;
    case 'NOTES': return <Badge variant="green">Notes</Badge>;
    default: return <Badge>{type}</Badge>;
  }
};

const LessonItem: React.FC<LessonItemProps> = ({ lesson, courseId, enrollmentId, onToggleComplete, isStudent }) => {
  const handleCheck = () => {
    if (isStudent && enrollmentId && onToggleComplete) {
      onToggleComplete(lesson.id, enrollmentId, !!lesson.isCompleted);
    }
  };

  const renderContent = () => (
    <>
      <div className="flex items-center gap-2 flex-wrap">
        <span className={`text-sm font-semibold transition-colors ${
          lesson.isCompleted 
            ? 'line-through text-gray-400' 
            : courseId 
              ? 'text-gray-900 group-hover:text-indigo-600' 
              : 'text-gray-900'
        }`}>
          {lesson.position != null ? `${lesson.position}. ` : ''}{lesson.title}
        </span>
        {lessonTypeBadge(lesson.type)}
      </div>
      {lesson.content && (
        <p className="text-xs text-gray-500 mt-1 truncate max-w-md">{lesson.content}</p>
      )}
    </>
  );

  return (
    <div className={`flex items-start gap-3 py-3.5 px-5 border-b border-gray-100 last:border-0 hover:bg-gray-50/50 transition-colors ${lesson.isCompleted ? 'bg-green-50/40 hover:bg-green-50/60' : ''}`}>
      {isStudent && (
        <input
          type="checkbox"
          checked={!!lesson.isCompleted}
          onChange={handleCheck}
          className="mt-0.5 h-4 w-4 text-indigo-600 rounded border-gray-300 cursor-pointer"
          aria-label={`Toggle completion of "${lesson.title}"`}
        />
      )}
      <div className="flex-1 min-w-0">
        {courseId ? (
          <Link to={`/courses/${courseId}/lessons/${lesson.id}`} className="block group cursor-pointer">
            {renderContent()}
          </Link>
        ) : (
          <div>
            {renderContent()}
          </div>
        )}
      </div>
    </div>
  );
};

export default LessonItem;
