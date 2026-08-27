import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getCourseById, updateCourse } from '../../api/courses';
import { getTopics } from '../../api/topics';
import { Course } from '../../types/course';
import { Topic } from '../../types/topic';
import CourseForm from '../../components/organisms/CourseForm/CourseForm';
import Spinner from '../../components/atoms/Spinner/Spinner';

const EditCoursePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [course, setCourse] = useState<Course | null>(null);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loadingCourse, setLoadingCourse] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    Promise.all([getCourseById(id), getTopics()])
      .then(([c, t]) => { setCourse(c); setTopics(t); })
      .catch(() => navigate('/instructor/my-courses'))
      .finally(() => setLoadingCourse(false));
  }, [id]);

  const handleSubmit = async (data: { title: string; description: string; topicId: string; price: number }) => {
    if (!id) return;
    setSaving(true);
    setError('');
    try {
      await updateCourse(id, data);
      navigate('/instructor/my-courses');
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(message ?? 'Failed to update course. Please try again.');
      setSaving(false);
    }
  };

  if (loadingCourse) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16">
        <Spinner size="lg" className="justify-center" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Edit Course</h1>
        <p className="text-sm text-gray-500 mt-1">Update the course details below.</p>
      </div>
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        {course && (
          <CourseForm
            onSubmit={handleSubmit}
            topics={topics}
            initialValues={course}
            submitLabel="Save Changes"
            isLoading={saving}
            error={error}
          />
        )}
      </div>
    </div>
  );
};

export default EditCoursePage;
