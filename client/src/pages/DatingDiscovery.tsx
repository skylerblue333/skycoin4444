import React, { useState, useEffect, useMemo } from 'react';
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
  const [minAge, setMinAge] = useState(18);
  const [maxAge, setMaxAge] = useState(80);
  const [locationFilter, setLocationFilter] = useState('');
  const [interestFilter, setInterestFilter] = useState('');
  const [dragStart, setDragStart] = useState<number | null>(null);

  const filteredProfiles = useMemo(() => profiles.filter(profile => {
    const locationMatches = !locationFilter.trim() || profile.location.toLowerCase().includes(locationFilter.trim().toLowerCase());
    const interestMatches = !interestFilter.trim() || profile.interests.some(interest => interest.toLowerCase().includes(interestFilter.trim().toLowerCase()));
    return profile.age >= minAge && profile.age <= maxAge && locationMatches && interestMatches;
  }), [profiles, minAge, maxAge, locationFilter, interestFilter]);

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

  const currentProfile = filteredProfiles[currentIndex];

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
    setCurrentIndex((prev) => filteredProfiles.length ? (prev + 1) % filteredProfiles.length : 0);
  };

  const handleSwipeEnd = (endX: number) => {
    if (dragStart === null) return;
    const delta = endX - dragStart;
    setDragStart(null);
    if (Math.abs(delta) < 70) return;
    if (delta > 0) void handleLike();
    else void handlePass();
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
          <p className="text-pink-100">Find meaningful connections at your pace</p>
        </div>

        <div className="mb-5 rounded-2xl bg-white/15 p-4 text-white backdrop-blur">
          <div className="mb-3 flex items-center justify-between"><strong>Match filters</strong><span className="text-xs text-pink-100">{filteredProfiles.length} candidates</span></div>
          <div className="grid grid-cols-2 gap-2">
            <label className="text-xs">Min age<input type="number" min={18} max={80} value={minAge} onChange={event => { setMinAge(Math.max(18, Number(event.target.value))); setCurrentIndex(0); }} className="mt-1 w-full rounded-lg border-0 bg-white/90 px-2 py-2 text-slate-900" /></label>
            <label className="text-xs">Max age<input type="number" min={18} max={80} value={maxAge} onChange={event => { setMaxAge(Math.min(80, Number(event.target.value))); setCurrentIndex(0); }} className="mt-1 w-full rounded-lg border-0 bg-white/90 px-2 py-2 text-slate-900" /></label>
            <label className="text-xs">Location<input value={locationFilter} onChange={event => { setLocationFilter(event.target.value); setCurrentIndex(0); }} placeholder="City or region" className="mt-1 w-full rounded-lg border-0 bg-white/90 px-2 py-2 text-slate-900" /></label>
            <label className="text-xs">Interest<input value={interestFilter} onChange={event => { setInterestFilter(event.target.value); setCurrentIndex(0); }} placeholder="Music, hiking…" className="mt-1 w-full rounded-lg border-0 bg-white/90 px-2 py-2 text-slate-900" /></label>
          </div>
        </div>

        {/* Profile Card */}
          <Card className="relative mb-6 overflow-hidden shadow-2xl" onMouseDown={event => setDragStart(event.clientX)} onMouseUp={event => handleSwipeEnd(event.clientX)} onTouchStart={event => setDragStart(event.touches[0]?.clientX ?? null)} onTouchEnd={event => handleSwipeEnd(event.changedTouches[0]?.clientX ?? 0)}>
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

        <p className="mb-4 text-center text-sm text-white/80">Swipe right to like, left to pass, or use the buttons below.</p>

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
