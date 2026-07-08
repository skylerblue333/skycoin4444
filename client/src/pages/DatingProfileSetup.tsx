import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Upload, ChevronRight, Check } from 'lucide-react';

interface ProfileFormData {
  displayName: string;
  bio: string;
  age: number;
  location: string;
  interests: string[];
  photos: File[];
  verificationStatus: 'unverified' | 'email' | 'phone' | 'id';
  lookingFor: string;
  height?: string;
  bodyType?: string;
  education?: string;
  occupation?: string;
}

export default function DatingProfileSetup() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<ProfileFormData>({
    displayName: '',
    bio: '',
    age: 18,
    location: '',
    interests: [],
    photos: [],
    verificationStatus: 'unverified',
    lookingFor: 'relationship',
  });
  const [interestInput, setInterestInput] = useState('');
  const [completeness, setCompleteness] = useState(0);

  const totalSteps = 5;
  const interestOptions = [
    'Travel', 'Sports', 'Music', 'Art', 'Technology', 'Cooking',
    'Reading', 'Gaming', 'Fitness', 'Photography', 'Movies', 'Hiking',
    'Yoga', 'Dancing', 'Volunteering', 'Fashion', 'Pets', 'Gardening'
  ];

  const calculateCompleteness = () => {
    let completed = 0;
    if (formData.displayName) completed += 20;
    if (formData.photos.length > 0) completed += 20;
    if (formData.bio) completed += 20;
    if (formData.interests.length > 0) completed += 20;
    if (formData.verificationStatus !== 'unverified') completed += 20;
    setCompleteness(completed);
  };

  const handleAddInterest = () => {
    if (interestInput && !formData.interests.includes(interestInput)) {
      setFormData({
        ...formData,
        interests: [...formData.interests, interestInput]
      });
      setInterestInput('');
      calculateCompleteness();
    }
  };

  const handleRemoveInterest = (interest: string) => {
    setFormData({
      ...formData,
      interests: formData.interests.filter(i => i !== interest)
    });
    calculateCompleteness();
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newPhotos = Array.from(e.target.files);
      setFormData({
        ...formData,
        photos: [...formData.photos, ...newPhotos].slice(0, 6)
      });
      calculateCompleteness();
    }
  };

  const handleNextStep = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = () => {
    console.log('Profile data:', formData);
    // TODO: Send to backend
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Your Profile</h1>
          <p className="text-gray-600">Step {step} of {totalSteps}</p>
          <div className="mt-4 bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-pink-500 to-purple-500 h-full transition-all duration-300"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Completeness Score */}
        <Card className="mb-6 p-4 bg-white border-pink-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Profile Completeness</p>
              <p className="text-2xl font-bold text-pink-600">{completeness}%</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">Complete your profile to</p>
              <p className="text-xs text-gray-500">increase match visibility</p>
            </div>
          </div>
        </Card>

        {/* Step 1: Basic Info */}
        {step === 1 && (
          <Card className="p-6 space-y-4">
            <h2 className="text-xl font-semibold">Basic Information</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Display Name</label>
              <Input
                type="text"
                placeholder="Your name"
                value={formData.displayName}
                onChange={(e) => {
                  setFormData({ ...formData, displayName: e.target.value });
                  calculateCompleteness();
                }}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                <Input
                  type="number"
                  min="18"
                  max="120"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <Input
                  type="text"
                  placeholder="City, Country"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Looking For</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={formData.lookingFor}
                onChange={(e) => setFormData({ ...formData, lookingFor: e.target.value })}
              >
                <option value="relationship">Relationship</option>
                <option value="casual">Casual Dating</option>
                <option value="friendship">Friendship</option>
                <option value="networking">Networking</option>
              </select>
            </div>
          </Card>
        )}

        {/* Step 2: Photos */}
        {step === 2 && (
          <Card className="p-6 space-y-4">
            <h2 className="text-xl font-semibold">Add Photos</h2>
            <p className="text-sm text-gray-600">Add up to 6 photos. First photo will be your main profile picture.</p>
            
            <div className="grid grid-cols-3 gap-4">
              {formData.photos.map((photo, idx) => (
                <div key={idx} className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={URL.createObjectURL(photo)}
                    alt={`Photo ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => setFormData({
                      ...formData,
                      photos: formData.photos.filter((_, i) => i !== idx)
                    })}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
                  >
                    ×
                  </button>
                </div>
              ))}
              
              {formData.photos.length < 6 && (
                <label className="aspect-square bg-pink-50 border-2 border-dashed border-pink-300 rounded-lg flex items-center justify-center cursor-pointer hover:bg-pink-100 transition">
                  <div className="text-center">
                    <Upload className="w-6 h-6 text-pink-500 mx-auto mb-2" />
                    <p className="text-xs text-pink-600">Add Photo</p>
                  </div>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </Card>
        )}

        {/* Step 3: Bio */}
        {step === 3 && (
          <Card className="p-6 space-y-4">
            <h2 className="text-xl font-semibold">About You</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
              <Textarea
                placeholder="Tell us about yourself... (max 500 characters)"
                value={formData.bio}
                onChange={(e) => {
                  setFormData({ ...formData, bio: e.target.value.slice(0, 500) });
                  calculateCompleteness();
                }}
                rows={5}
              />
              <p className="text-xs text-gray-500 mt-1">{formData.bio.length}/500</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Height</label>
                <Input
                  type="text"
                  placeholder="e.g., 5 feet 10 inches"
                  value={formData.height || ''}
                  onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Body Type</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={formData.bodyType || ''}
                  onChange={(e) => setFormData({ ...formData, bodyType: e.target.value })}
                >
                  <option value="">Select...</option>
                  <option value="slim">Slim</option>
                  <option value="athletic">Athletic</option>
                  <option value="average">Average</option>
                  <option value="curvy">Curvy</option>
                  <option value="muscular">Muscular</option>
                </select>
              </div>
            </div>
          </Card>
        )}

        {/* Step 4: Interests */}
        {step === 4 && (
          <Card className="p-6 space-y-4">
            <h2 className="text-xl font-semibold">Your Interests</h2>
            <p className="text-sm text-gray-600">Select interests that match your personality</p>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {formData.interests.map((interest) => (
                <Badge
                  key={interest}
                  variant="secondary"
                  className="cursor-pointer hover:bg-red-100"
                  onClick={() => handleRemoveInterest(interest)}
                >
                  {interest} ×
                </Badge>
              ))}
            </div>

            <div className="flex gap-2 mb-4">
              <Input
                type="text"
                placeholder="Add custom interest..."
                value={interestInput}
                onChange={(e) => setInterestInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddInterest()}
              />
              <Button onClick={handleAddInterest} className="bg-pink-500 hover:bg-pink-600">
                Add
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {interestOptions.map((interest) => (
                <button
                  key={interest}
                  onClick={() => {
                    if (!formData.interests.includes(interest)) {
                      setFormData({
                        ...formData,
                        interests: [...formData.interests, interest]
                      });
                      calculateCompleteness();
                    }
                  }}
                  className={`p-2 rounded-lg text-sm font-medium transition ${
                    formData.interests.includes(interest)
                      ? 'bg-pink-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {interest}
                </button>
              ))}
            </div>
          </Card>
        )}

        {/* Step 5: Verification */}
        {step === 5 && (
          <Card className="p-6 space-y-4">
            <h2 className="text-xl font-semibold">Verify Your Profile</h2>
            <p className="text-sm text-gray-600">Verified profiles get more matches and visibility</p>
            
            <div className="space-y-3">
              {[
                { status: 'email', label: 'Email Verification', icon: '✉️' },
                { status: 'phone', label: 'Phone Verification', icon: '📱' },
                { status: 'id', label: 'ID Verification', icon: '🆔' }
              ].map(({ status, label, icon }) => (
                <div
                  key={status}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition ${
                    formData.verificationStatus === status
                      ? 'border-pink-500 bg-pink-50'
                      : 'border-gray-200 hover:border-pink-200'
                  }`}
                  onClick={() => setFormData({ ...formData, verificationStatus: status as any })}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{icon}</span>
                      <span className="font-medium">{label}</span>
                    </div>
                    {formData.verificationStatus === status && (
                      <Check className="w-5 h-5 text-pink-500" />
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>Why verify?</strong> Verified profiles appear higher in search results and get 3x more matches.
              </p>
            </div>
          </Card>
        )}

        {/* Navigation Buttons */}
        <div className="flex gap-4 mt-8">
          <Button
            onClick={handlePrevStep}
            disabled={step === 1}
            variant="outline"
            className="flex-1"
          >
            Previous
          </Button>
          
          {step < totalSteps ? (
            <Button
              onClick={handleNextStep}
              className="flex-1 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
            >
              Next <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              className="flex-1 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
            >
              <Check className="w-4 h-4 mr-2" />
              Create Profile
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
