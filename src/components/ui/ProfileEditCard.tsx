'use client';

import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { AppUser, AppUserPreferences, defaultAppUserPreferences, preferenceOptionLabels } from '@/types';
import { FaUpload, FaUserCircle } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { updateCurrentUser } from '@/services/userService';
import { Switch } from '@headlessui/react';
import GenericToast from '@/components/ui/GenericToast';

interface ProfileEditFormProps {
  initialProfile: AppUser;
}

export default function ProfileEditForm({ initialProfile }: ProfileEditFormProps) {
  const router = useRouter();
  const [name, setName] = useState<string>(initialProfile.name || '');
  const [bio, setBio] = useState<string>(initialProfile.bio || '');
  const [picture, setPicture] = useState<string>(initialProfile.picture || '');
  const [preferences, setPreferences] = useState<AppUserPreferences>(
    initialProfile.preferences ?? defaultAppUserPreferences
  );

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const TOAST_DURATION = 4000;

  // Reset form state if initialProfile changes (though unlikely on edit page)
  useEffect(() => {
    setName(initialProfile.name || '');
    setBio(initialProfile.bio || '');
    setPicture(initialProfile.picture || '');
    setPreferences(
      initialProfile.preferences ?? defaultAppUserPreferences
    );

  }, [initialProfile]);

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleBioChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setBio(e.target.value);
  };

  const handlePreferenceChange = (key: keyof AppUserPreferences, value: boolean) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  // Placeholder for avatar upload handling - requires backend setup
  const handleAvatarChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    toast.custom(
      (t) => (
        <GenericToast
          t={t}
          duration={TOAST_DURATION}
          variant="error"
          headerText="Avatar upload not implemented yet."
        />
      ),
      {
        id: 'avatar-upload-not-allowed-notification',
        duration: TOAST_DURATION,
      }
    );
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    // Basic validation
    if (!name.trim()) {
      setError('Name cannot be empty.');
      setIsSubmitting(false);
      return;
    }

    try {
      const updatedData: Partial<AppUser> = {
        name: name.trim(),
        bio: bio.trim(),
        preferences: preferences,
      };

      // Call your update function (Server Action or API call)
      const updateSuccess = await updateCurrentUser(updatedData);

      if (!updateSuccess) {
        toast.custom(
          (t) => (
            <GenericToast
              t={t}
              duration={TOAST_DURATION}
              variant="error"
              headerText="Unable to update profile!"
              bodyContent="Please try again later."
            />
          ),
          {
            id: 'profile-not-updated-notification',
            duration: TOAST_DURATION,
          }
        );
        return;
      }

      toast.custom(
        (t) => (
          <GenericToast
            t={t}
            duration={TOAST_DURATION}
            variant="success"
            headerText="Profile updated!"
          />
        ),
        {
          id: 'profile-updated-notification',
          duration: TOAST_DURATION,
        }
      );

      router.push('/user/profile');
      router.refresh();
    } catch (err) {
      console.error('Profile update failed:', err);
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(`Failed to update profile: ${errorMessage}`);
      toast.custom(
        (t) => (
          <GenericToast
            t={t}
            duration={TOAST_DURATION}
            variant="error"
            headerText={errorMessage}
            bodyContent="Please try again later."
          />
        ),
        {
          id: 'profile-not-updated-notification',
          duration: TOAST_DURATION,
        }
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    // Navigate back to the profile view page
    router.push('/user/profile');
  };

  return (
    <div className="h-full flex flex-col items-center justify-center px-4 py-8">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg lg:w-1/2 md:w-3/4 w-11/12 max-w-6xl overflow-hidden">
        <div className="bg-indigo-600 flex justify-between items-center px-6 py-5 mb-6">
          <h1 className="text-2xl font-bold text-gray-100">Edit Profile</h1>
        </div>
        {error && (
          <div className="bg-red-100 dark:bg-red-900 border-l-4 border-red-500 dark:border-red-700 text-red-700 dark:text-red-200 p-4 rounded-md mb-6" role="alert">
            <p className="font-bold">Error</p> {/* Consider dark:text-red-100 for better contrast if needed */}
            <p>{error}</p>
          </div>
        )}
        <form onSubmit={handleSubmit} className="w-full p-6">
          <div className="flex flex-col md:flex-row gap-8 w-full">
            {/* Avatar Section */}
            <div className="flex flex-col md:w-1/2 space-y-5">
              <div className="flex flex-col items-center">
                <div className="relative mb-4">
                  <div className="w-32 h-32 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center overflow-hidden border-2 border-indigo-100 dark:border-indigo-800">
                    {picture ? (
                      <img src={picture} alt="User Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <FaUserCircle className="w-full h-full text-gray-400 dark:text-gray-500" />
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-center">
                  <label htmlFor="avatar-upload" className="cursor-not-allowed bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-400 font-semibold py-2 px-4 rounded inline-flex items-center gap-2 text-sm opacity-50">
                    <FaUpload />
                    <span>Upload Avatar</span>
                  </label>
                  <input id="avatar-upload" type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} disabled />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Upload not implemented</p>
                </div>
              </div>

              <div className="w-full">
                <label htmlFor="name" className="block font-semibold text-gray-700 dark:text-gray-300 mb-1 text-left">Name</label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={handleNameChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50 dark:disabled:bg-gray-600"
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div className="w-full">
                <label htmlFor="email" className="block font-semibold text-gray-700 dark:text-gray-300 mb-1 text-left">Email</label>
                <input type="email" id="email" value={initialProfile.email || 'No email found'} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-400 dark:text-gray-500 rounded-md bg-gray-100 dark:bg-gray-700 cursor-not-allowed" disabled />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-left">Email cannot be changed.</p>
              </div>
            </div>

            {/* Form Fields (Bio and Preferences) */}
            <div className="flex-1 space-y-4">
              <div>
                <label htmlFor="bio" className="font-bold text-gray-700 dark:text-gray-300 mb-1">Bio</label>
                <textarea
                  id="bio"
                  rows={4}
                  value={bio}
                  onChange={handleBioChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50 dark:disabled:bg-gray-600"
                  placeholder="Tell us a little about yourself..."
                  disabled={isSubmitting}
                />
              </div>
              {/* Preferences Section */}
              <div>
                <h2 className="font-bold text-gray-700 dark:text-gray-300 mb-3">Preferences</h2>
                {preferenceOptionLabels.map((option) => {
                  const isEnabled = preferences[option.key as keyof AppUserPreferences] || false;
                  
                  return (
                    <div key={option.key} className="flex items-center justify-between py-1">
                      <span className="text-gray-900 dark:text-gray-100">{option.label}</span>
                      <Switch
                        checked={isEnabled}
                        onChange={(checked) => handlePreferenceChange(option.key as keyof AppUserPreferences, checked)}
                        disabled={isSubmitting}
                        className={`group inline-flex h-5 w-9 items-center rounded-full bg-gray-200 dark:bg-gray-600 transition data-checked:bg-indigo-700 dark:data-checked:bg-indigo-500 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-indigo-400 ${
                          isSubmitting ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'
                        }`}
                      >
                        <span className="sr-only">Enable {option.label}</span>
                        <span className="size-3.5 translate-x-1 rounded-full bg-white dark:bg-gray-300 transition group-data-checked:translate-x-5"/>
                      </Switch>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 mt-8 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button type="button" onClick={handleCancel} disabled={isSubmitting} className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md cursor-pointer text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-indigo-600 cursor-pointer hover:bg-indigo-700 text-white rounded-md disabled:opacity-50">
              {isSubmitting ? 'Saving' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
