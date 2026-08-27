import React, { useState } from 'react';
import { Topic } from '../../../types/topic';
import { createTopic } from '../../../api/topics';
import Input from '../../atoms/Input/Input';
import Button from '../../atoms/Button/Button';
import Spinner from '../../atoms/Spinner/Spinner';

interface TopicManagementProps {
  topics: Topic[];
  loading?: boolean;
  error?: string;
  onTopicCreated: (topic: Topic) => void;
}

const TopicManagement: React.FC<TopicManagementProps> = ({
  topics,
  loading,
  error,
  onTopicCreated,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState('');

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError('');
    if (!name.trim()) { setCreateError('Topic name is required.'); return; }

    setCreating(true);
    try {
      const newTopic = await createTopic({ name: name.trim(), description: description.trim() || undefined });
      onTopicCreated(newTopic);
      setName('');
      setDescription('');
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setCreateError(message ?? 'Failed to create topic.');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Create form */}
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <h2 className="font-semibold text-gray-900 text-sm mb-4">Create New Topic</h2>
        <form onSubmit={handleCreate} className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <label htmlFor="topic-name" className="text-sm font-medium text-gray-700">Name *</label>
            <Input
              id="topic-name"
              type="text"
              placeholder="e.g. Web Development"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="topic-desc" className="text-sm font-medium text-gray-700">Description</label>
            <Input
              id="topic-desc"
              type="text"
              placeholder="Optional description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          {createError && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2 rounded-lg">
              {createError}
            </div>
          )}
          <div className="flex justify-end">
            <Button type="submit" isLoading={creating} size="sm">
              Create Topic
            </Button>
          </div>
        </form>
      </div>

      {/* Topics list */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-100 bg-gray-50">
          <h2 className="font-semibold text-gray-900 text-sm">All Topics</h2>
        </div>

        {loading ? (
          <div className="py-8"><Spinner size="md" className="justify-center" /></div>
        ) : error ? (
          <p className="px-5 py-4 text-sm text-red-600">{error}</p>
        ) : topics.length === 0 ? (
          <p className="px-5 py-4 text-sm text-gray-500">No topics created yet.</p>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="px-5 py-2 text-left text-xs font-medium text-gray-500">Name</th>
                <th className="px-5 py-2 text-left text-xs font-medium text-gray-500">Description</th>
              </tr>
            </thead>
            <tbody>
              {topics.map((topic) => (
                <tr key={topic.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50">
                  <td className="px-5 py-3 text-sm font-medium text-gray-800">{topic.name}</td>
                  <td className="px-5 py-3 text-sm text-gray-500">{topic.description ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default TopicManagement;
