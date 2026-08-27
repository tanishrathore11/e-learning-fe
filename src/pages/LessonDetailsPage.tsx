import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getCourseById } from '../api/courses';
import { getEnrolledCourses } from '../api/enrollment';
import { markLessonComplete, unmarkLessonComplete } from '../api/dashboard';
import { Course } from '../types/course';
import { Lesson } from '../types/lesson';
import { useAuth } from '../hooks/useAuth';
import Spinner from '../components/atoms/Spinner/Spinner';
import Button from '../components/atoms/Button/Button';
import Badge from '../components/atoms/Badge/Badge';
import ProgressBar from '../components/atoms/ProgressBar/ProgressBar';
import { ArrowLeft, ArrowRight, Play, FileText, CheckCircle2, ChevronLeft } from 'lucide-react';

const markdownComponents: any = {
  h1: (props: any) => <h1 className="text-2xl font-extrabold text-gray-900 mt-6 mb-3 border-b border-gray-100 pb-2" {...props} />,
  h2: (props: any) => <h2 className="text-xl font-bold text-gray-900 mt-5 mb-2.5" {...props} />,
  h3: (props: any) => <h3 className="text-lg font-bold text-gray-900 mt-4 mb-2" {...props} />,
  p: (props: any) => <p className="text-gray-700 leading-relaxed mb-4 text-sm md:text-base font-normal" {...props} />,
  ul: (props: any) => <ul className="list-disc pl-5 mb-4 text-gray-700 space-y-2 text-sm md:text-base" {...props} />,
  ol: (props: any) => <ol className="list-decimal pl-5 mb-4 text-gray-700 space-y-2 text-sm md:text-base" {...props} />,
  li: (props: any) => <li className="text-gray-700 font-normal" {...props} />,
  blockquote: (props: any) => <blockquote className="border-l-4 border-indigo-500 pl-4 italic my-4 text-gray-600 bg-indigo-50/40 py-2 pr-3 rounded-r text-sm md:text-base" {...props} />,
  a: (props: any) => <a className="text-indigo-600 hover:text-indigo-800 underline font-semibold transition-colors" target="_blank" rel="noopener noreferrer" {...props} />,
  hr: () => <hr className="my-6 border-gray-200" />,
  pre: (props: any) => <pre className="bg-gray-900 text-gray-100 p-4 rounded-xl overflow-x-auto text-xs md:text-sm font-mono my-4" {...props} />,
  code: ({ inline, ...props }: any) => 
    inline ? (
      <code className="bg-gray-100 text-indigo-600 px-1.5 py-0.5 rounded text-xs md:text-sm font-mono" {...props} />
    ) : (
      <code className="text-xs md:text-sm font-mono" {...props} />
    ),
  table: (props: any) => (
    <div className="overflow-x-auto my-6 border border-gray-200 rounded-xl">
      <table className="min-w-full divide-y divide-gray-200" {...props} />
    </div>
  ),
  thead: (props: any) => <thead className="bg-gray-50" {...props} />,
  tbody: (props: any) => <tbody className="bg-white divide-y divide-gray-100" {...props} />,
  tr: (props: any) => <tr className="hover:bg-gray-50/30 transition-colors" {...props} />,
  th: (props: any) => <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider" {...props} />,
  td: (props: any) => <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap" {...props} />,
  del: (props: any) => <del className="line-through text-gray-400" {...props} />,
  input: (props: any) => {
    if (props.type === 'checkbox') {
      return <input type="checkbox" className="h-4 w-4 text-indigo-600 rounded border-gray-300 mr-2 focus:ring-indigo-500 pointer-events-none" checked={props.checked} readOnly />;
    }
    return <input {...props} />;
  }
};

const LessonDetailsPage: React.FC = () => {
  const { courseId, lessonId } = useParams<{ courseId: string; lessonId: string }>();
  const { user } = useAuth();

  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [enrollmentId, setEnrollmentId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [markingComplete, setMarkingComplete] = useState(false);
  const [error, setError] = useState('');

  const isStudent = user?.role === 'STUDENT';

  // Helper to extract clean embed URL for YouTube/Vimeo or return URL directly
  const getEmbedUrl = (url: string | null | undefined): string => {
    if (!url) return '';
    const youtubeReg = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const youtubeMatch = url.match(youtubeReg);
    if (youtubeMatch && youtubeMatch[2].length === 11) {
      return `https://www.youtube.com/embed/${youtubeMatch[2]}?autoplay=0&rel=0`;
    }
    const vimeoReg = /vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|video\/|)(\d+)(?:$|\/|\?)/;
    const vimeoMatch = url.match(vimeoReg);
    if (vimeoMatch && vimeoMatch[3]) {
      return `https://player.vimeo.com/video/${vimeoMatch[3]}`;
    }
    return url;
  };

  useEffect(() => {
    if (!courseId) return;

    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        const courseData = await getCourseById(courseId);
        setCourse(courseData);
        setLessons(courseData.lessons ?? []);

        if (isStudent) {
          const enrollments = await getEnrolledCourses();
          const match = enrollments.find((e) => e.course.id === courseId);
          if (match) {
            setEnrollmentId(match.id);
          }
        }
      } catch (err: any) {
        console.error(err);
        setError('Failed to load course details. Make sure you are enrolled.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [courseId, isStudent]);

  // Sync current lesson when lessonId or lessons array changes
  useEffect(() => {
    if (!lessonId || lessons.length === 0) return;
    const found = lessons.find((l) => l.id === lessonId);
    if (found) {
      setCurrentLesson(found);
    } else {
      setError('Lesson not found.');
    }
  }, [lessonId, lessons]);

  const handleMarkComplete = async () => {
    if (!enrollmentId || !lessonId || !currentLesson) return;
    setMarkingComplete(true);
    try {
      await markLessonComplete({ enrollmentId, lessonId });
      // Update local state to reflect completion
      setLessons((prev) =>
        prev.map((l) => (l.id === lessonId ? { ...l, isCompleted: true } : l))
      );
      setCurrentLesson((prev) => prev ? { ...prev, isCompleted: true } : null);
    } catch (err) {
      console.error(err);
    } finally {
      setMarkingComplete(false);
    }
  };

  const handleMarkIncomplete = async () => {
    if (!enrollmentId || !lessonId || !currentLesson) return;
    setMarkingComplete(true);
    try {
      await unmarkLessonComplete({ enrollmentId, lessonId });
      // Update local state to reflect incomplete
      setLessons((prev) =>
        prev.map((l) => (l.id === lessonId ? { ...l, isCompleted: false } : l))
      );
      setCurrentLesson((prev) => prev ? { ...prev, isCompleted: false } : null);
    } catch (err) {
      console.error(err);
    } finally {
      setMarkingComplete(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !course || !currentLesson) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-4">
          {error || 'An error occurred while loading this lesson.'}
        </div>
        <Link to={`/courses/${courseId}`}>
          <Button variant="secondary">Back to Course Details</Button>
        </Link>
      </div>
    );
  }

  const currentIndex = lessons.findIndex((l) => l.id === currentLesson.id);
  const prevLesson = currentIndex > 0 ? lessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null;

  const totalLessons = lessons.length;
  const completedLessons = lessons.filter((l) => l.isCompleted).length;
  const progressPercent = totalLessons === 0 ? 0 : Math.round((completedLessons / totalLessons) * 100);

  const embedUrl = getEmbedUrl(currentLesson.videoUrl);
  const isYoutubeOrVimeo = embedUrl.includes('youtube.com') || embedUrl.includes('vimeo.com');

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Sidebar: Lessons List */}
      <aside className="w-full md:w-80 bg-white border-r border-gray-200 flex flex-col shrink-0 md:max-h-[calc(100vh-64px)] md:sticky md:top-16">
        <div className="p-5 border-b border-gray-100 bg-gray-50/50">
          <Link to={`/courses/${courseId}`} className="inline-flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 font-semibold mb-3">
            <ChevronLeft className="w-3.5 h-3.5" /> Back to Course
          </Link>
          <h2 className="font-bold text-gray-900 text-base leading-snug truncate">
            {course.title}
          </h2>
          {isStudent && enrollmentId && (
            <div className="mt-3">
              <div className="flex justify-between text-xs text-gray-500 font-medium mb-1">
                <span>Course Progress</span>
                <span>{progressPercent}%</span>
              </div>
              <ProgressBar value={progressPercent} />
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-gray-50 p-2">
          {lessons.map((lesson) => {
            const isActive = lesson.id === currentLesson.id;
            return (
              <Link
                key={lesson.id}
                to={`/courses/${courseId}/lessons/${lesson.id}`}
                className={`flex items-start gap-3 p-3 rounded-lg text-left transition-all ${
                  isActive
                    ? 'bg-indigo-50/80 text-indigo-900 border-l-4 border-indigo-600 font-medium pl-2.5'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {lesson.isCompleted ? (
                  <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                ) : lesson.type === 'VIDEO' ? (
                  <Play className={`w-4 h-4 shrink-0 mt-0.5 ${isActive ? 'text-indigo-600' : 'text-gray-400'}`} />
                ) : (
                  <FileText className={`w-4 h-4 shrink-0 mt-0.5 ${isActive ? 'text-indigo-600' : 'text-gray-400'}`} />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-400 font-medium">
                    Lesson {lesson.position ?? 0}
                  </p>
                  <p className="text-sm font-semibold truncate leading-tight mt-0.5">
                    {lesson.title}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 max-w-4xl mx-auto w-full">
        {/* Course Breadcrumbs */}
        <nav className="mb-6">
          <ol className="flex items-center space-x-2 text-xs text-gray-500 font-medium">
            <li>
              <Link to="/courses" className="hover:text-indigo-600">Courses</Link>
            </li>
            <li>/</li>
            <li>
              <Link to={`/courses/${courseId}`} className="hover:text-indigo-600 max-w-[150px] truncate block">{course.title}</Link>
            </li>
            <li>/</li>
            <li className="text-gray-900 font-bold truncate max-w-[200px]">
              {currentLesson.title}
            </li>
          </ol>
        </nav>

        {/* Active Lesson Frame */}
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
          {/* Video Player */}
          {currentLesson.type === 'VIDEO' && currentLesson.videoUrl && (
            <div className="aspect-video bg-black w-full relative">
              {isYoutubeOrVimeo ? (
                <iframe
                  src={embedUrl}
                  title={currentLesson.title}
                  className="absolute inset-0 w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
              ) : (
                <video
                  src={currentLesson.videoUrl}
                  controls
                  className="absolute inset-0 w-full h-full object-contain"
                >
                  Your browser does not support the video tag.
                </video>
              )}
            </div>
          )}

          {/* Lesson Details */}
          <div className="p-6 md:p-8">
            <div className="flex items-start justify-between gap-4 flex-wrap mb-4">
              <div>
                <span className="text-xs text-indigo-600 font-bold uppercase tracking-wider">
                  Lesson {currentLesson.position ?? 0} &bull; {currentLesson.type}
                </span>
                <h1 className="text-2xl font-extrabold text-gray-900 mt-1">
                  {currentLesson.title}
                </h1>
              </div>

              {isStudent && enrollmentId && (
                <div>
                  {currentLesson.isCompleted ? (
                    <div className="flex items-center gap-2">
                      <Badge variant="green" className="flex items-center gap-1 py-1.5 px-3 rounded-full text-xs font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Completed
                      </Badge>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={handleMarkIncomplete}
                        isLoading={markingComplete}
                        className="rounded-full shadow-sm border bg-white"
                      >
                        Mark as Incomplete
                      </Button>
                    </div>
                  ) : (
                    <Button
                      size="sm"
                      onClick={handleMarkComplete}
                      isLoading={markingComplete}
                      className="rounded-full shadow-sm"
                    >
                      Mark as Completed
                    </Button>
                  )}
                </div>
              )}
            </div>

            {/* Notes / Text content */}
            {currentLesson.content ? (
              <div className="border-t border-gray-100 pt-6">
                <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                  {currentLesson.content}
                </ReactMarkdown>
              </div>
            ) : currentLesson.type === 'NOTES' ? (
              <p className="text-gray-400 italic border-t border-gray-100 pt-6">No content notes provided for this lesson.</p>
            ) : null}
          </div>
        </div>

        {/* Prev / Next Navigation Buttons */}
        <div className="flex items-center justify-between mt-8 gap-4">
          {prevLesson ? (
            <Link to={`/courses/${courseId}/lessons/${prevLesson.id}`} className="flex-1 max-w-[240px]">
              <div className="flex items-center gap-2 p-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors shadow-sm">
                <ArrowLeft className="w-4 h-4 text-gray-500 shrink-0" />
                <div className="min-w-0">
                  <p className="text-[10px] text-gray-400 font-bold uppercase">Previous</p>
                  <p className="text-xs font-semibold text-gray-800 truncate">{prevLesson.title}</p>
                </div>
              </div>
            </Link>
          ) : (
            <div className="flex-1 max-w-[240px] invisible" />
          )}

          {nextLesson ? (
            <Link to={`/courses/${courseId}/lessons/${nextLesson.id}`} className="flex-1 max-w-[240px] text-right">
              <div className="flex items-center justify-between gap-2 p-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors shadow-sm">
                <div className="min-w-0 text-left">
                  <p className="text-[10px] text-gray-400 font-bold uppercase">Next</p>
                  <p className="text-xs font-semibold text-gray-800 truncate">{nextLesson.title}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-500 shrink-0" />
              </div>
            </Link>
          ) : (
            <div className="flex-1 max-w-[240px] invisible" />
          )}
        </div>
      </main>
    </div>
  );
};

export default LessonDetailsPage;
