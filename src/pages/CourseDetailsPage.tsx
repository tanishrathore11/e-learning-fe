import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCourseById } from '../api/courses';
import { purchaseCourse } from '../api/purchase';
import { Course } from '../types/course';
import { User } from '../types/auth';
import { Lesson } from '../types/lesson';
import { markLessonComplete, unmarkLessonComplete } from '../api/dashboard';
import { getEnrolledCourses } from '../api/enrollment';
import LessonItem from '../components/molecules/LessonItem/LessonItem';
import Badge from '../components/atoms/Badge/Badge';
import Button from '../components/atoms/Button/Button';
import Spinner from '../components/atoms/Spinner/Spinner';
import ProgressBar from '../components/atoms/ProgressBar/ProgressBar';
import { formatPrice } from '../utils/format';

interface CourseDetailsPageProps {
  user: User | null;
}

const CourseDetailsPage: React.FC<CourseDetailsPageProps> = ({ user }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [accessDenied, setAccessDenied] = useState(false);
  const [publicCourse, setPublicCourse] = useState<Course | null>(null);
  const [enrollmentId, setEnrollmentId] = useState<string | null>(null);
  const [purchasing, setPurchasing] = useState(false);
  const [purchaseError, setPurchaseError] = useState('');
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);
  const [lessons, setLessons] = useState<Lesson[]>([]);

  const isStudent = user?.role === 'STUDENT';

  const fetchEnrollmentId = async (courseId: string) => {
    try {
      const enrollments = await getEnrolledCourses();
      const match = enrollments.find((e) => e.course.id === courseId);
      if (match) setEnrollmentId(match.id);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    if (!id) return;

    const fetchCourse = async () => {
      setLoading(true);
      try {
        const data = await getCourseById(id);
        setCourse(data);
        setLessons(data.lessons ?? []);
        if (isStudent) await fetchEnrollmentId(id);
      } catch (err: unknown) {
        const status = (err as { response?: { status?: number; data?: { message?: string } } })?.response?.status;
        if (status === 403) {
          setAccessDenied(true);
          // Try to get course info from the list
        } else {
          navigate('/courses');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id, purchaseSuccess]);

  // If access denied, show purchase prompt using info from courses list
  useEffect(() => {
    if (!accessDenied || !id) return;
    import('../api/courses').then(({ getCourses }) => {
      getCourses().then((all) => {
        const found = all.find((c) => c.id === id);
        if (found) setPublicCourse(found);
      }).catch(() => {});
    });
  }, [accessDenied, id]);

  const handlePurchase = async () => {
    if (!id) return;
    setPurchaseError('');
    setPurchasing(true);
    try {
      await purchaseCourse(id);
      setPurchaseSuccess(true);
      setAccessDenied(false);
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setPurchaseError(message ?? 'Purchase failed. Please try again.');
    } finally {
      setPurchasing(false);
    }
  };

  const handleToggleComplete = async (lessonId: string, eid: string, currentCompleted: boolean) => {
    if (!eid) return;
    try {
      if (currentCompleted) {
        await unmarkLessonComplete({ enrollmentId: eid, lessonId });
        setLessons((prev) =>
          prev.map((l) => (l.id === lessonId ? { ...l, isCompleted: false } : l))
        );
      } else {
        await markLessonComplete({ enrollmentId: eid, lessonId });
        setLessons((prev) =>
          prev.map((l) => (l.id === lessonId ? { ...l, isCompleted: true } : l))
        );
      }
    } catch {
      // ignore
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16">
        <Spinner size="lg" className="justify-center" />
      </div>
    );
  }

  // Access denied — show purchase prompt
  if (accessDenied) {
    const displayCourse = publicCourse;
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          {displayCourse ? (
            <>
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <h1 className="text-xl font-bold text-gray-900">{displayCourse.title}</h1>
                  <p className="text-sm text-gray-500 mt-1">By {displayCourse.instructor?.name}</p>
                </div>
                <span className="text-2xl font-bold text-indigo-600">{formatPrice(displayCourse.price)}</span>
              </div>
              {displayCourse.description && (
                <p className="text-sm text-gray-600 mb-4">{displayCourse.description}</p>
              )}
              <div className="flex gap-2 mb-6">
                {displayCourse.topic && <Badge variant="indigo">{displayCourse.topic.name}</Badge>}
              </div>
            </>
          ) : (
            <h1 className="text-xl font-bold text-gray-900 mb-4">Course</h1>
          )}

          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 mb-4">
            <p className="text-sm text-indigo-800 font-medium">
              Purchase this course to access all lessons and content.
            </p>
          </div>

          {purchaseError && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2 rounded-lg mb-3">
              {purchaseError}
            </div>
          )}

          {isStudent ? (
            <Button onClick={handlePurchase} isLoading={purchasing} className="w-full">
              {displayCourse ? `Enroll for ${formatPrice(displayCourse.price)}` : 'Enroll Now'}
            </Button>
          ) : (
            <p className="text-sm text-gray-500">Only students can purchase courses.</p>
          )}
        </div>
      </div>
    );
  }

  if (!course) return null;

  const totalLessons = lessons.length;
  const completedLessons = lessons.filter((l) => l.isCompleted).length;
  const progress = totalLessons === 0 ? 0 : Math.round((completedLessons / totalLessons) * 100);
  const isEnrolled = !!enrollmentId;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Course header */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-xl font-bold text-gray-900">{course.title}</h1>
            <p className="text-sm text-gray-500 mt-1">By {course.instructor?.name}</p>
          </div>
          <span className="text-2xl font-bold text-indigo-600">{formatPrice(course.price)}</span>
        </div>

        {course.description && (
          <p className="text-sm text-gray-600 mt-3">{course.description}</p>
        )}

        <div className="flex gap-2 mt-4 flex-wrap">
          {course.topic && <Badge variant="indigo">{course.topic.name}</Badge>}
          {isEnrolled && <Badge variant="green">Enrolled</Badge>}
        </div>

        {/* Progress for enrolled students */}
        {isStudent && isEnrolled && totalLessons > 0 && (
          <div className="mt-4">
            <ProgressBar value={progress} showLabel />
            <p className="text-xs text-gray-500 mt-1">{completedLessons} / {totalLessons} lessons complete</p>
          </div>
        )}
      </div>

      {/* Lessons */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-100 bg-gray-50">
          <h2 className="font-semibold text-gray-900 text-sm">
            Lessons ({totalLessons})
          </h2>
        </div>

        {totalLessons === 0 ? (
          <p className="px-5 py-4 text-sm text-gray-500">No lessons added yet.</p>
        ) : (
          lessons.map((lesson) => (
            <LessonItem
              key={lesson.id}
              lesson={lesson}
              courseId={course.id}
              enrollmentId={enrollmentId ?? undefined}
              onToggleComplete={handleToggleComplete}
              isStudent={isStudent && isEnrolled}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default CourseDetailsPage;
