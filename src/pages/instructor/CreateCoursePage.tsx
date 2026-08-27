import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTopics } from '../../api/topics';
import { createCourse } from '../../api/courses';
import { Topic } from '../../types/topic';
import CourseForm from '../../components/organisms/CourseForm/CourseForm';

const CreateCoursePage: React.FC = () => {
  const navigate = useNavigate();
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    getTopics().then(setTopics).catch(() => {});
  }, []);

  const handleSubmit = async (data: { title: string; description: string; topicId: string; price: number }) => {
    setLoading(true);
    setError('');
    try {
      await createCourse(data);
      navigate('/instructor/my-courses');
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(message ?? 'Failed to create course. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Create Course</h1>
        <p className="text-sm text-gray-500 mt-1">Fill in the details below to create a new course.</p>
      </div>
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <CourseForm
          onSubmit={handleSubmit}
          topics={topics}
          submitLabel="Create Course"
          isLoading={loading}
          error={error}
        />
      </div>
    </div>
  );
};

export default CreateCoursePage;
