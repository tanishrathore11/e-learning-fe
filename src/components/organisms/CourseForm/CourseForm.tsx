import React, { useState } from 'react';
import { Topic } from '../../../types/topic';
import { Course } from '../../../types/course';
import Input from '../../atoms/Input/Input';
import Button from '../../atoms/Button/Button';

interface CourseFormProps {
  onSubmit: (data: { title: string; description: string; topicId: string; price: number }) => Promise<void>;
  topics: Topic[];
  initialValues?: Partial<Course>;
  submitLabel?: string;
  isLoading?: boolean;
  error?: string;
}

const CourseForm: React.FC<CourseFormProps> = ({
  onSubmit,
  topics,
  initialValues,
  submitLabel = 'Save Course',
  isLoading,
  error,
}) => {
  const [title, setTitle] = useState(initialValues?.title ?? '');
  const [description, setDescription] = useState(initialValues?.description ?? '');
  const [topicId, setTopicId] = useState(initialValues?.topic?.id ?? '');
  const [price, setPrice] = useState(initialValues?.price?.toString() ?? '0');
  const [formError, setFormError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!title.trim()) { setFormError('Title is required.'); return; }
    if (!topicId) { setFormError('Please select a topic.'); return; }
    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum < 0) { setFormError('Price must be a valid non-negative number.'); return; }

    await onSubmit({ title: title.trim(), description: description.trim(), topicId, price: priceNum });
  };

  const displayError = error || formError;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label htmlFor="cf-title" className="text-sm font-medium text-gray-700">Course Title *</label>
        <Input
          id="cf-title"
          type="text"
          placeholder="e.g. Node.js Masterclass"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="cf-desc" className="text-sm font-medium text-gray-700">Description</label>
        <textarea
          id="cf-desc"
          rows={3}
          placeholder="What will students learn?"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="cf-topic" className="text-sm font-medium text-gray-700">Topic *</label>
        <select
          id="cf-topic"
          value={topicId}
          onChange={(e) => setTopicId(e.target.value)}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">Select a topic...</option>
          {topics.map((t) => (
            <option key={t.id} value={t.id}>{t.name}</option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="cf-price" className="text-sm font-medium text-gray-700">Price (USD) *</label>
        <Input
          id="cf-price"
          type="number"
          min="0"
          step="0.01"
          placeholder="0.00"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />
      </div>

      {displayError && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2 rounded-lg">
          {displayError}
        </div>
      )}

      <Button type="submit" isLoading={isLoading} className="mt-1">
        {submitLabel}
      </Button>
    </form>
  );
};

export default CourseForm;
