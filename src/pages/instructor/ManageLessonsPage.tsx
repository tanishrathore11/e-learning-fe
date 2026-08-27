import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getCourseById } from '../../api/courses';
import { createLesson, updateLesson, deleteLesson } from '../../api/lessons';
import { Course } from '../../types/course';
import { Lesson, CreateLessonPayload, UpdateLessonPayload } from '../../types/lesson';
import LessonForm from '../../components/organisms/LessonForm/LessonForm';
import LessonItem from '../../components/molecules/LessonItem/LessonItem';
import Button from '../../components/atoms/Button/Button';
import Spinner from '../../components/atoms/Spinner/Spinner';

const ManageLessonsPage: React.FC = () => {
  const { id: courseId } = useParams<{ id: string }>();

  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [lessonToDelete, setLessonToDelete] = useState<Lesson | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [deleteError, setDeleteError] = useState('');

  const fetchCourse = async () => {
    if (!courseId) return;
    setLoading(true);
    try {
      const data = await getCourseById(courseId);
      setCourse(data);
      setLessons(data.lessons ?? []);
    } catch {
      setError('Failed to load course.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCourse(); }, [courseId]);

  const handleAdd = async (data: CreateLessonPayload | (UpdateLessonPayload & { id: string })) => {
    setSaving(true);
    setError('');
    try {
      const newLesson = await createLesson(data as CreateLessonPayload);
      setLessons((prev) => [...prev, newLesson]);
      setShowAddForm(false);
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(message ?? 'Failed to add lesson.');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = async (data: CreateLessonPayload | (UpdateLessonPayload & { id: string })) => {
    const editData = data as UpdateLessonPayload & { id: string };
    setSaving(true);
    setError('');
    try {
      const updated = await updateLesson(editData.id, editData);
      setLessons((prev) => prev.map((l) => (l.id === editData.id ? updated : l)));
      setEditingLesson(null);
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(message ?? 'Failed to update lesson.');
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!lessonToDelete) return;
    setDeleteError('');
    try {
      await deleteLesson(lessonToDelete.id);
      setLessons((prev) => prev.filter((l) => l.id !== lessonToDelete.id));
      setLessonToDelete(null);
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setDeleteError(message ?? 'Failed to delete lesson.');
      setLessonToDelete(null);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16">
        <Spinner size="lg" className="justify-center" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-2">
        <div>
          <Link to="/instructor/my-courses" className="text-sm text-indigo-600 hover:underline">
            ← Back to My Courses
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 mt-1">
            {course?.title ?? 'Manage Lessons'}
          </h1>
          <p className="text-sm text-gray-500">{lessons.length} lesson{lessons.length !== 1 ? 's' : ''}</p>
        </div>
        {!showAddForm && (
          <Button size="sm" onClick={() => { setShowAddForm(true); setEditingLesson(null); }}>
            + Add Lesson
          </Button>
        )}
      </div>

      {deleteError && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2 rounded-lg mb-4">
          {deleteError}
        </div>
      )}

      {/* Add lesson form */}
      {showAddForm && courseId && (
        <div className="bg-white border border-gray-200 rounded-xl p-5 mb-4 mt-4">
          <h2 className="font-semibold text-gray-900 text-sm mb-3">New Lesson</h2>
          <LessonForm
            courseId={courseId}
            onSubmit={handleAdd}
            initialValues={{ position: lessons.length + 1 } as Lesson}
            onCancel={() => setShowAddForm(false)}
            isLoading={saving}
            error={error}
          />
        </div>
      )}

      {/* Lessons list */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden mt-4">
        <div className="px-5 py-3 border-b border-gray-100 bg-gray-50">
          <h2 className="font-semibold text-gray-900 text-sm">Lessons</h2>
        </div>

        {lessons.length === 0 ? (
          <p className="px-5 py-4 text-sm text-gray-500">No lessons added yet.</p>
        ) : (
          lessons.map((lesson) => (
            <div key={lesson.id}>
              {editingLesson?.id === lesson.id && courseId ? (
                <div className="px-5 py-4 border-b border-gray-100">
                  <LessonForm
                    courseId={courseId}
                    onSubmit={handleEdit}
                    initialValues={lesson}
                    onCancel={() => setEditingLesson(null)}
                    isLoading={saving}
                    error={error}
                  />
                </div>
              ) : (
                <div className="flex items-start border-b border-gray-50 last:border-0 animate-fade-in">
                  <div className="flex-1">
                    <LessonItem lesson={lesson} courseId={courseId} isStudent={false} />
                  </div>
                  <div className="flex items-center gap-2 px-4 py-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => { setEditingLesson(lesson); setShowAddForm(false); }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => setLessonToDelete(lesson)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Custom Confirmation Modal */}
      {lessonToDelete && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-opacity duration-200">
          <div className="bg-white border border-gray-200 rounded-2xl max-w-sm w-full p-6 shadow-xl transform transition-transform duration-200 scale-100">
            <h3 className="text-base font-bold text-gray-900 mb-2">Delete Lesson</h3>
            <p className="text-sm text-gray-500 mb-5 leading-relaxed">
              Are you sure you want to delete <span className="font-semibold text-gray-800">"{lessonToDelete.title}"</span>? This will permanently remove it.
            </p>
            <div className="flex justify-end gap-2.5">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setLessonToDelete(null)}
                className="rounded-lg"
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={confirmDelete}
                className="rounded-lg shadow-sm"
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageLessonsPage;
