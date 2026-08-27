import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { getUserProfile, updateUserProfile } from '../api/auth';
import Button from '../components/atoms/Button/Button';
import Input from '../components/atoms/Input/Input';
import Spinner from '../components/atoms/Spinner/Spinner';
import { UserCircle, Mail, User, FileText, CheckCircle2 } from 'lucide-react';

const ProfilePage: React.FC = () => {
  const { user: authUser, updateUser } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchProfile = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getUserProfile();
      setName(data.name);
      setEmail(data.email);
      setBio(data.bio ?? '');
    } catch (err: any) {
      console.error(err);
      setError('Failed to fetch profile details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleCancel = () => {
    setIsEditing(false);
    setError('');
    setSuccess('');
    if (authUser) {
      setName(authUser.name);
      setBio(authUser.bio ?? '');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!name.trim()) {
      setError('Name is required.');
      return;
    }

    setSaving(true);
    try {
      const updatedUser = await updateUserProfile({
        name: name.trim(),
        bio: bio.trim() || null,
      });
      // Sync global auth context (e.g. for Navbar name)
      updateUser(updatedUser);
      setSuccess('Profile updated successfully!');
      setIsEditing(false);
    } catch (err: any) {
      console.error(err);
      const message = err.response?.data?.message;
      setError(message ?? 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 relative z-10">
      {/* Background blobs for a premium look */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[400px] overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-10 right-10 w-72 h-72 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-60"></div>
        <div className="absolute bottom-10 left-10 w-72 h-72 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-60"></div>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 md:p-8">
        {/* Header */}
        <div className="flex items-center gap-4 border-b border-gray-100 pb-6 mb-6">
          <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 shrink-0">
            <UserCircle className="w-10 h-10" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">Account Profile</h1>
            <p className="text-sm text-gray-500 mt-0.5">Manage your public bio and personal details.</p>
          </div>
        </div>

        {/* Status Alerts */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl mb-6">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-xl mb-6 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            {success}
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          {/* Email (Read-Only) */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Mail className="w-4 h-4 text-gray-400" /> Email Address
            </label>
            <Input
              id="profile-email"
              type="email"
              value={email}
              disabled
              className="bg-gray-50 border-gray-200 text-gray-500 cursor-not-allowed"
            />
            <p className="text-xs text-gray-400">Email cannot be modified.</p>
          </div>


          {/* Full Name */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="profile-name" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <User className="w-4 h-4 text-gray-400" /> Full Name *
            </label>
            <Input
              id="profile-name"
              type="text"
              placeholder="Your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={!isEditing}
              required
              className={!isEditing ? "bg-gray-50/50 cursor-not-allowed" : ""}
            />
          </div>

          {/* Bio */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="profile-bio" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <FileText className="w-4 h-4 text-gray-400" /> Short Bio
            </label>
            <textarea
              id="profile-bio"
              rows={4}
              placeholder="Tell us a bit about yourself..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              disabled={!isEditing}
              className={`w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none ${
                !isEditing ? "bg-gray-50/50 text-gray-500 cursor-not-allowed border-gray-200" : ""
              }`}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            {!isEditing ? (
              <Button
                type="button"
                onClick={() => setIsEditing(true)}
                className="px-6 rounded-lg shadow-sm"
              >
                Edit Profile
              </Button>
            ) : (
              <>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleCancel}
                  className="px-6 rounded-lg"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  isLoading={saving}
                  className="px-6 rounded-lg shadow-sm animate-pulse-once"
                >
                  Save Changes
                </Button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
