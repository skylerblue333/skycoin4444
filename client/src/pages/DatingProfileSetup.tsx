import React, { useMemo, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Check, ChevronRight, ShieldCheck, Upload } from 'lucide-react';

type VerificationStatus = 'unverified' | 'email' | 'phone' | 'id';

type ProfileFormData = {
  displayName: string;
  bio: string;
  age: number;
  location: string;
  interests: string[];
  photos: File[];
  verificationStatus: VerificationStatus;
  lookingFor: 'relationship' | 'casual' | 'friendship' | 'networking';
  height: string;
  bodyType: string;
};

type SavedProfile = Omit<ProfileFormData, 'photos'> & {
  photoCount: number;
  savedAt: string;
  storage: 'browser-session';
};

const STORAGE_KEY = 'sky4444.dating-profile-beta';
const interestOptions = [
  'Travel', 'Sports', 'Music', 'Art', 'Technology', 'Cooking', 'Reading', 'Gaming',
  'Fitness', 'Photography', 'Movies', 'Hiking', 'Yoga', 'Dancing', 'Volunteering',
  'Fashion', 'Pets', 'Gardening',
];

const initialProfile: ProfileFormData = {
  displayName: '',
  bio: '',
  age: 18,
  location: '',
  interests: [],
  photos: [],
  verificationStatus: 'unverified',
  lookingFor: 'relationship',
  height: '',
  bodyType: '',
};

export function validateDatingProfile(profile: ProfileFormData) {
  const errors: string[] = [];
  if (profile.displayName.trim().length < 2) errors.push('Display name must be at least 2 characters.');
  if (!Number.isInteger(profile.age) || profile.age < 18 || profile.age > 120) errors.push('Age must be between 18 and 120.');
  if (profile.location.trim().length < 2) errors.push('Location is required.');
  if (profile.bio.trim().length < 10) errors.push('Bio must be at least 10 characters.');
  if (profile.interests.length < 1) errors.push('Choose at least one interest.');
  return errors;
}

export function toSavedDatingProfile(profile: ProfileFormData): SavedProfile {
  const { photos, ...persistable } = profile;
  return {
    ...persistable,
    photoCount: photos.length,
    savedAt: new Date().toISOString(),
    storage: 'browser-session',
  };
}

export default function DatingProfileSetup() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<ProfileFormData>(initialProfile);
  const [interestInput, setInterestInput] = useState('');
  const [submitErrors, setSubmitErrors] = useState<string[]>([]);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const totalSteps = 5;

  const completeness = useMemo(() => {
    const checks = [
      formData.displayName.trim().length >= 2,
      formData.location.trim().length >= 2,
      formData.bio.trim().length >= 10,
      formData.interests.length > 0,
      formData.photos.length > 0,
    ];
    return Math.round((checks.filter(Boolean).length / checks.length) * 100);
  }, [formData]);

  const update = (patch: Partial<ProfileFormData>) => {
    setFormData((current) => ({ ...current, ...patch }));
    setSubmitErrors([]);
    setSavedAt(null);
  };

  const handleAddInterest = (value = interestInput) => {
    const normalized = value.trim();
    if (!normalized || formData.interests.some((item) => item.toLowerCase() === normalized.toLowerCase())) return;
    update({ interests: [...formData.interests, normalized].slice(0, 12) });
    setInterestInput('');
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newPhotos = Array.from(event.target.files ?? []).filter((file) => file.type.startsWith('image/'));
    update({ photos: [...formData.photos, ...newPhotos].slice(0, 6) });
  };

  const handleSubmit = () => {
    const errors = validateDatingProfile(formData);
    if (errors.length) {
      setSubmitErrors(errors);
      return;
    }

    const saved = toSavedDatingProfile(formData);
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
    setSavedAt(saved.savedAt);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 p-4">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8">
          <Badge variant="outline" className="mb-3">Engineering beta · browser-session save</Badge>
          <h1 className="mb-2 text-3xl font-bold text-gray-900">Create Your Profile</h1>
          <p className="text-gray-600">Step {step} of {totalSteps}</p>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-gray-200">
            <div className="h-full bg-gradient-to-r from-pink-500 to-purple-500 transition-all" style={{ width: `${(step / totalSteps) * 100}%` }} />
          </div>
        </div>

        <Card className="mb-6 border-pink-200 bg-white p-4">
          <div className="flex items-center justify-between gap-4">
            <div><p className="text-sm text-gray-600">Profile completeness</p><p className="text-2xl font-bold text-pink-600">{completeness}%</p></div>
            <p className="max-w-xs text-right text-xs text-gray-500">Profile data is saved only in this browser session. No server persistence or identity verification is claimed.</p>
          </div>
        </Card>

        {step === 1 && <Card className="space-y-4 p-6">
          <h2 className="text-xl font-semibold">Basic Information</h2>
          <Field label="Display Name"><Input value={formData.displayName} onChange={(event) => update({ displayName: event.target.value })} placeholder="Your name" /></Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Age"><Input type="number" min={18} max={120} value={formData.age} onChange={(event) => update({ age: Number(event.target.value) })} /></Field>
            <Field label="Location"><Input value={formData.location} onChange={(event) => update({ location: event.target.value })} placeholder="City, region" /></Field>
          </div>
          <Field label="Looking For"><select className="w-full rounded-md border border-gray-300 px-3 py-2" value={formData.lookingFor} onChange={(event) => update({ lookingFor: event.target.value as ProfileFormData['lookingFor'] })}><option value="relationship">Relationship</option><option value="casual">Casual Dating</option><option value="friendship">Friendship</option><option value="networking">Networking</option></select></Field>
        </Card>}

        {step === 2 && <Card className="space-y-4 p-6">
          <h2 className="text-xl font-semibold">Photos</h2>
          <p className="text-sm text-gray-600">Choose up to six local images. Images are previewed in-memory and are not uploaded by this engineering-beta flow.</p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {formData.photos.map((photo, index) => <PhotoPreview key={`${photo.name}-${index}`} photo={photo} onRemove={() => update({ photos: formData.photos.filter((_, itemIndex) => itemIndex !== index) })} />)}
            {formData.photos.length < 6 && <label className="flex aspect-square cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-pink-300 bg-pink-50 hover:bg-pink-100"><div className="text-center"><Upload className="mx-auto mb-2 h-6 w-6 text-pink-500" /><p className="text-xs text-pink-600">Add Photo</p></div><input type="file" multiple accept="image/*" className="hidden" onChange={handlePhotoUpload} /></label>}
          </div>
        </Card>}

        {step === 3 && <Card className="space-y-4 p-6">
          <h2 className="text-xl font-semibold">About You</h2>
          <Field label="Bio"><Textarea value={formData.bio} onChange={(event) => update({ bio: event.target.value.slice(0, 500) })} rows={5} placeholder="Tell people what matters to you..." /><p className="mt-1 text-xs text-gray-500">{formData.bio.length}/500</p></Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Height (optional)"><Input value={formData.height} onChange={(event) => update({ height: event.target.value })} placeholder="e.g. 5 ft 10 in" /></Field>
            <Field label="Body Type (optional)"><select className="w-full rounded-md border border-gray-300 px-3 py-2" value={formData.bodyType} onChange={(event) => update({ bodyType: event.target.value })}><option value="">Prefer not to say</option><option value="slim">Slim</option><option value="athletic">Athletic</option><option value="average">Average</option><option value="curvy">Curvy</option><option value="muscular">Muscular</option></select></Field>
          </div>
        </Card>}

        {step === 4 && <Card className="space-y-4 p-6">
          <h2 className="text-xl font-semibold">Interests</h2>
          <div className="flex flex-wrap gap-2">{formData.interests.map((interest) => <Badge key={interest} variant="secondary" className="cursor-pointer" onClick={() => update({ interests: formData.interests.filter((item) => item !== interest) })}>{interest} ×</Badge>)}</div>
          <div className="flex gap-2"><Input value={interestInput} onChange={(event) => setInterestInput(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') { event.preventDefault(); handleAddInterest(); } }} placeholder="Add custom interest" /><Button type="button" onClick={() => handleAddInterest()}>Add</Button></div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">{interestOptions.map((interest) => <Button type="button" key={interest} variant={formData.interests.includes(interest) ? 'default' : 'outline'} onClick={() => formData.interests.includes(interest) ? update({ interests: formData.interests.filter((item) => item !== interest) }) : handleAddInterest(interest)}>{interest}</Button>)}</div>
        </Card>}

        {step === 5 && <Card className="space-y-4 p-6">
          <h2 className="text-xl font-semibold">Verification Preference</h2>
          <p className="text-sm text-gray-600">These controls record a preference only. They do not perform email, phone, or government-ID verification.</p>
          <div className="grid gap-3">{(['unverified', 'email', 'phone', 'id'] as VerificationStatus[]).map((status) => <Button type="button" key={status} variant={formData.verificationStatus === status ? 'default' : 'outline'} onClick={() => update({ verificationStatus: status })}>{status === 'unverified' ? 'Skip verification' : `Prefer ${status} verification`}</Button>)}</div>
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800"><ShieldCheck className="mb-2 h-5 w-5" />A production verification provider and server-side profile store remain separate integrations.</div>
          {submitErrors.length > 0 && <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800"><strong>Complete these fields:</strong><ul className="mt-2 list-disc pl-5">{submitErrors.map((error) => <li key={error}>{error}</li>)}</ul></div>}
          {savedAt && <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-800"><Check className="mr-2 inline h-4 w-4" />Profile draft saved for this browser session at {new Date(savedAt).toLocaleTimeString()}.</div>}
        </Card>}

        <div className="mt-8 flex gap-4">
          <Button type="button" onClick={() => setStep((current) => Math.max(1, current - 1))} disabled={step === 1} variant="outline" className="flex-1">Previous</Button>
          {step < totalSteps ? <Button type="button" onClick={() => setStep((current) => Math.min(totalSteps, current + 1))} className="flex-1">Next <ChevronRight className="ml-2 h-4 w-4" /></Button> : <Button type="button" onClick={handleSubmit} className="flex-1"><Check className="mr-2 h-4 w-4" />Save Profile Draft</Button>}
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><label className="mb-2 block text-sm font-medium text-gray-700">{label}</label>{children}</div>;
}

function PhotoPreview({ photo, onRemove }: { photo: File; onRemove: () => void }) {
  const url = useMemo(() => URL.createObjectURL(photo), [photo]);
  return <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100"><img src={url} alt={photo.name || 'Profile preview'} className="h-full w-full object-cover" /><button type="button" aria-label={`Remove ${photo.name}`} onClick={onRemove} className="absolute right-2 top-2 rounded-full bg-red-600 px-2 py-1 text-white">×</button></div>;
}