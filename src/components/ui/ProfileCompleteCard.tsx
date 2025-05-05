'use client';

import { useState, useEffect } from 'react';
import { parseNameFromEmail } from '@/utils'
import { useRouter, useSearchParams } from 'next/navigation';
import { animate } from 'animejs';
import { AppUser } from '@/types';
import { User } from '@auth0/nextjs-auth0/types';
import { createUser, setCookieAndRedirect } from '@/services/userService';

interface CompleteProfileCardProps {
  initialUser: User;
}

export default function CompleteProfileCard({ initialUser }: CompleteProfileCardProps) {
  const [user, ] = useState(initialUser);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect');
  
  type PreferenceKey = keyof NonNullable<AppUser['preferences']>;
  type FormPreferences = NonNullable<AppUser['preferences']>;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<Partial<AppUser>>({
    name: '',
    bio: '',
    preferences: {
      notifyOnShare: true,
      publicProfile: false,
      hideReservedItems: false
    }
  });

  useEffect(() => {
    if (user) {
      if (user.name && user.name !== user.email) {
        router.push(redirect || '/dashboard')
      }

      setFormData(prev => ({
        ...prev,
        name: user.name && user.name !== user.email ? user.name : parseNameFromEmail(user.email??''),
        email: user.email,
        picture: user.picture,
        preferences: prev.preferences ?? {
          notifyOnShare: true,
          publicProfile: false,
          hideReservedItems: false
        }
      }));
    }

    animate('.pulsing-dot', {
      '--glow-opacity': [0.3, 0.7],
      duration: 1500,
      ease: 'inOutSine',
      direction: 'alternate',
      loop: true
    });
  }, [user, router, redirect]); 

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePreferenceChange = (preferenceName: PreferenceKey) => {
    setFormData(prev => {
      const currentPreferences = prev.preferences ?? {} as FormPreferences;
      return {
        ...prev,
        preferences: {
          ...currentPreferences,
          [preferenceName]: !currentPreferences[preferenceName]
        }
      };
    });
  };

  const getPreferenceDotClasses = (isActive: boolean): string => {
    if (isActive) {
      return 'bg-green-500 shadow-[0_0_6px_1px_rgba(34,197,94,var(--glow-opacity,0.5))] pulsing-dot';
    } else {
      return 'bg-gray-300';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const user = await createUser(formData);
      
      if (user) {
        await setCookieAndRedirect(redirect || '/dashboard');
        // router.push(redirect || '/dashboard');
      } else {
        console.error('Error saving profile');
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      setIsSubmitting(false);
    }
  };

  const getPreferenceValue = (key: PreferenceKey): boolean => {
    return formData.preferences?.[key] ?? false; // Default to false if undefined
  };

  return (
    <div className="h-full flex flex-col items-center justify-center px-4 py-8">
      <div className="bg-white rounded-xl shadow-lg max-w-3xl p-6 w-full">
        <div className="flex flex-col justify-between items-center text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Complete Your Profile</h1>
          <p className="text-gray-600 mt-2">Please provide some information to set up your account</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="flex flex-col md:flex-row gap-8">
            {/* Avatar Section */}
            <div className="flex flex-col items-center">
              <div className="relative">
                <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden border-2 border-indigo-100">
                  {formData.picture ? (
                    <img
                      src={formData.picture}
                      alt="Profile picture"
                      className="w-full h-full object-cover"
                    />
                  ) : formData.name ? (
                    <span className="text-4xl font-semibold text-gray-400">
                      {formData.name.charAt(0)}
                    </span>
                  ) : (
                    <span className="text-4xl font-semibold text-gray-400"></span>
                  )}
                </div>
              </div>
              <div className="mt-4 text-center">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Your Name"
                  required
                  className="font-semibold text-xl text-gray-900 text-center border-b border-gray-300 focus:border-indigo-500 focus:outline-none w-full"
                />
                <p className="text-gray-500">{user.email}</p>
              </div>
            </div>

            <div className="flex-1">
              <div>
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-700 mb-1">Bio</h3>
                  <textarea
                    name="bio"
                    value={formData.bio || ''}
                    onChange={handleInputChange}
                    placeholder="Tell us a bit about yourself"
                    className="w-full p-2 border border-gray-300 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 h-24"
                  />
                </div>
                
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-700 mb-2">Preferences</h3>
                  <ul className="space-y-3">
                    <li 
                      className="flex items-center gap-2 text-gray-900 cursor-pointer"
                      onClick={() => handlePreferenceChange('notifyOnShare')}
                    >
                      <span className={`w-2 h-2 rounded-full ${getPreferenceDotClasses(getPreferenceValue('notifyOnShare'))}`}></span>
                      Notifications for shared wishlists
                    </li>
                    <li 
                      className="flex items-center gap-2 text-gray-900 cursor-pointer"
                      onClick={() => handlePreferenceChange('publicProfile')}
                    >
                      <span className={`w-2 h-2 rounded-full ${getPreferenceDotClasses(getPreferenceValue('publicProfile'))}`}></span>
                      Public profile
                    </li>
                    <li 
                      className="flex items-center gap-2 text-gray-900 cursor-pointer"
                      onClick={() => handlePreferenceChange('hideReservedItems')}
                    >
                      <span className={`w-2 h-2 rounded-full ${getPreferenceDotClasses(getPreferenceValue('hideReservedItems'))}`}></span>
                      Hide reserved items
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-center">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-indigo-400 transition-colors"
            >
              {isSubmitting ? 'Saving...' : 'Complete Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
