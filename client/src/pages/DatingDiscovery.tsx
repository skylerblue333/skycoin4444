import React, { useState, useEffect } from 'react';
import { Heart, X, MessageCircle, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/_core/hooks/useAuth';

interface Profile {
  id: string;
  displayName: string;
  age: number;
  location: string;
  bio: string;
  profileImageUrl: string;
  interests: string[];
  compatibility: number;
}

export default function DatingDiscovery() {
  const { user } = useAuth();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState<Set<string>>(new Set());
  const [superLiked, setSuperLiked] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadProfiles();
  }, []);

  const loadProfiles = async () => {
    setLoading(true);
    try {
      // Fetch recommended profiles
      const response = await fetch('/api/dating/discover');
      const data = await response.json();
      setProfiles(data.profiles || []);
    } catch (error) {
      console.error('Failed to load profiles:', error);
    } finally {
      setLoading(false);
    }
  };

  const currentProfile = profiles[currentIndex];

  const handleLike = async () => {
    if (!currentProfile) return;

    setLiked((prev) => new Set(prev).add(currentProfile.id));

    try {
      await fetch('/api/dating/like', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ toUserId: currentProfile.id, likeType: 'like' }),
      });
    } catch (error) {
      console.error('Failed to like profile:', error);
    }

    nextProfile();
  };

  const handleSuperLike = async () => {
    if (!currentProfile) return;

    setSuperLiked((prev) => new Set(prev).add(currentProfile.id));

    try {
      await fetch('/api/dating/like', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ toUserId: currentProfile.id, likeType: 'superlike' }),
      });
    } catch (error) {
      console.error('Failed to super like profile:', error);
    }

    nextProfile();
  };

  const handlePass = async () => {
    if (!currentProfile) return;

    try {
      await fetch('/api/dating/like', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ toUserId: currentProfile.id, likeType: 'pass' }),
      });
    } catch (error) {
      console.error('Failed to pass profile:', error);
    }

    nextProfile();
  };

  const nextProfile = () => {
    setCurrentIndex((prev) => (prev + 1) % profiles.length);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-600 flex items-center justify-center">
        <div className="text-white text-2xl">Loading matches...</div>
      </div>
    );
  }

  if (!currentProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-600 flex items-center justify-center">
        <div className="text-white text-center">
          <h2 className="text-3xl font-bold mb-4">No more profiles</h2>
          <Button onClick={loadProfiles} className="bg-white text-pink-600">
            Refresh Matches
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-600 p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-white text-center mb-8">
          <h1 className="text-3xl font-bold">Discover</h1>
          <p className="text-pink-100">Find your perfect match</p>
        </div>

        {/* Profile Card */}
        <Card className="relative overflow-hidden mb-6 shadow-2xl">
          {/* Profile Image */}
          <div className="relative h-96 bg-gray-200 overflow-hidden">
            <img
              src={currentProfile.profileImageUrl}
              alt={currentProfile.displayName}
              className="w-full h-full object-cover"
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />

            {/* Compatibility Badge */}
            <div className="absolute top-4 right-4 bg-pink-500 text-white px-4 py-2 rounded-full font-bold">
              {currentProfile.compatibility}% Match
            </div>

            {/* Profile Info */}
            <div className="absolute bottom-0 left-0 right-0 text-white p-6">
              <h2 className="text-3xl font-bold mb-2">
                {currentProfile.displayName}, {currentProfile.age}
              </h2>
              <p className="text-pink-100 mb-4">{currentProfile.location}</p>
              <p className="text-sm text-gray-200 line-clamp-3">{currentProfile.bio}</p>
            </div>
          </div>

          {/* Interests */}
          <div className="p-4 bg-white">
            <div className="flex flex-wrap gap-2">
              {currentProfile.interests.map((interest) => (
                <span
                  key={interest}
                  className="bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-sm"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-center gap-6 mb-8">
          {/* Pass Button */}
          <Button
            onClick={handlePass}
            className="w-16 h-16 rounded-full bg-white hover:bg-gray-100 shadow-lg flex items-center justify-center"
          >
            <X className="w-8 h-8 text-gray-600" />
          </Button>

          {/* Super Like Button */}
          <Button
            onClick={handleSuperLike}
            className="w-16 h-16 rounded-full bg-blue-500 hover:bg-blue-600 shadow-lg flex items-center justify-center"
          >
            <Star className="w-8 h-8 text-white" />
          </Button>

          {/* Like Button */}
          <Button
            onClick={handleLike}
            className="w-16 h-16 rounded-full bg-pink-500 hover:bg-pink-600 shadow-lg flex items-center justify-center"
          >
            <Heart className="w-8 h-8 text-white" />
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 text-white text-center">
          <div className="bg-white bg-opacity-20 rounded-lg p-4">
            <div className="text-2xl font-bold">{liked.size}</div>
            <div className="text-sm">Likes</div>
          </div>
          <div className="bg-white bg-opacity-20 rounded-lg p-4">
            <div className="text-2xl font-bold">{superLiked.size}</div>
            <div className="text-sm">Super Likes</div>
          </div>
          <div className="bg-white bg-opacity-20 rounded-lg p-4">
            <div className="text-2xl font-bold">{currentIndex + 1}</div>
            <div className="text-sm">Viewed</div>
          </div>
        </div>
      </div>
    </div>
  );
}
