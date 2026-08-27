import React, { useEffect, useState } from 'react';
import { getTopics } from '../../api/topics';
import { Topic } from '../../types/topic';
import TopicManagement from '../../components/organisms/TopicManagement/TopicManagement';

const TopicsPage: React.FC = () => {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getTopics()
      .then(setTopics)
      .catch(() => setError('Failed to load topics.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Topic Management</h1>
        <p className="text-sm text-gray-500 mt-1">Create and view course topics</p>
      </div>
      <TopicManagement
        topics={topics}
        loading={loading}
        error={error}
        onTopicCreated={(topic) => setTopics((prev) => [...prev, topic])}
      />
    </div>
  );
};

export default TopicsPage;
