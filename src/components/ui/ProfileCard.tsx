'use client';

import { useState, useEffect } from 'react';

import { animate } from 'animejs';
import { AppUser, AppUserPreferences, preferenceOptionLabels, defaultAppUserPreferences } from '@/types';

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
      return 'bg-gray-300';
    }
  };

  return (
    <div className="h-full flex flex-col items-center justify-center px-4 py-8">
      <div className="bg-white rounded-xl shadow-lg max-w-3xl p-6">
        <div className="flex flex-col justify-between items-center text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Your Profile</h1>
        </div>

        {profile && (
          <div className="flex flex-col md:flex-row gap-8">
          {/* Avatar Section */}
            <div className="flex flex-col items-center">
              <div className="relative">
                <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden border-2 border-indigo-100">
                  {profile.picture ? (
                    <img
                      src={profile.picture}
                      alt="Profile picture"
                      className="w-full h-full object-cover"
                    />
                  ) : profile.name ? (
                    <span className="text-4xl font-semibold text-gray-400">
                      {profile.name.charAt(0)}
                    </span>
                  ) : (
                    <span className="text-4xl font-semibold text-gray-400"></span>
                  )}
                </div>
              </div>
              <div className="mt-4 text-center">
                <h2 className="font-semibold text-xl text-gray-900">{profile.name}</h2>
                <p className="text-gray-500">{profile.email}</p>
              </div>
            </div>

            <div className="flex-1">
              <div>
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-700 mb-1">Bio</h3>
                  <p className="text-gray-900">{profile.bio || 'No bio set'}</p>
                </div>
                
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-700 mb-2">Preferences</h3>
                  <ul className="space-y-1">
                    {preferenceOptionLabels.map((option) => (
                      <li key={option.key} className="flex items-center gap-2 text-gray-900">
                        <span
                          className={`w-2 h-2 rounded-full ${getPreferenceDotClasses(
                            profile.preferences?.[option.key as keyof AppUserPreferences] ?? defaultAppUserPreferences[option.key as keyof AppUserPreferences]
                          )}`}
                        ></span>
                        {option.label}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
