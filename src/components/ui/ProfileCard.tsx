'use client';

import { useState, useEffect } from 'react';

import { animate } from 'animejs';
import Link from 'next/link';
import { AppUser, AppUserPreferences, preferenceOptionLabels, defaultAppUserPreferences } from '@/types';
import ThemeToggle from '@/components/ui/ThemeToggle';

interface ProfileCardProps {
  initialProfile: AppUser;
}

export default function ProfileCard({ initialProfile }: ProfileCardProps) {
  const [profile, ] = useState(initialProfile);

  useEffect(() => {
    if (profile) {
      animate('.pulsing-dot', {
        '--glow-opacity': [0.3, 0.7],
        duration: 1500,
        ease: 'inOutSine',
        direction: 'alternate',
        loop: true
      });
    }
    return undefined;
  }, [profile]);

  const getPreferenceDotClasses = (isActive: boolean): string => {
    if (isActive) {
      return 'bg-green-500 shadow-[0_0_6px_1px_rgba(34,197,94,var(--glow-opacity,0.5))] pulsing-dot';
    } else {
      return 'bg-gray-300 dark:bg-gray-600';
    }
  };

  return (
    <div className="h-full flex flex-col items-center justify-center px-4 py-8">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg w-full max-w-lg overflow-hidden">
        {/* Header */}
        <div className="bg-indigo-600 px-6 py-5 text-white flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-100">Profile</h1>
          <Link
            href="/user/profile/edit"
            className="bg-white dark:bg-indigo-500 text-indigo-600 dark:text-white ont-semibold px-4 py-2 rounded-md hover:bg-gray-50 dark:hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-600 transition-colors text-sm"
          >
            Edit
          </Link>
        </div>
        
        {profile && (
          <div className="p-6">
            {/* Profile Info */}
            <div className="flex flex-col sm:flex-row gap-5 mb-6 sm:items-center">
              <div className="w-32 h-32 bg-gray-200 dark:bg-gray-700 rounded-full flex justify-center items-center text-white text-4xl font-semibold flex-shrink-0 mx-auto sm:mx-0 overflow-hidden border-2 border-indigo-100 dark:border-indigo-800">
                {profile.picture ? (
                  <img
                    src={profile.picture}
                    alt="Profile picture"
                    className="w-full h-full object-cover"
                  />
                ) : profile.name ? (
                  <span className="text-4xl font-semibold text-gray-900 dark:text-gray-100">
                    {profile.name.charAt(0)}
                  </span>
                ) : (
                  <span className="text-4xl font-semibold text-gray-900 dark:text-gray-100"></span>
                )}
              </div>
              <div className="flex flex-col justify-center text-center sm:text-left">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{profile.name}</h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm">{profile.email}</p>
              </div>
            </div>
            
            {/* Bio */}
            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Bio</h3>
              <p className="text-gray-900 dark:text-gray-100">{profile.bio || 'No bio set'}</p>
            </div>
            
            {/* Preferences */}
            <div>
              <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-3">Preferences</h3>
              <ul className="space-y-2">
                {preferenceOptionLabels.map((option) => {
                  const isActive = profile.preferences?.[option.key as keyof AppUserPreferences] ?? 
                                  defaultAppUserPreferences[option.key as keyof AppUserPreferences];
                  
                  return (
                    <li key={option.key} className="flex items-center text-gray-700 dark:text-gray-300">
                      <span
                        className={`w-2 h-2 rounded-full mr-3 ${getPreferenceDotClasses(isActive)}`}
                      ></span>
                      {option.label}
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="flex items-center justify-between py-2 mt-4 border-t border-gray-200 dark:border-gray-700">
              <span className="text-gray-900 dark:text-gray-100">Theme</span>
              <ThemeToggle />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
