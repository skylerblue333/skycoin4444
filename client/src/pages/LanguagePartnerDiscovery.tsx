import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "wouter";
import {
  ArrowRight,
  CheckCircle2,
  Languages,
  MessageCircle,
  Mic,
  MicOff,
  Save,
  ShieldCheck,
  Sparkles,
  Users,
  Volume2,
} from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { PageHeader } from "@/components/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  buildLanguagePracticePlan,
  validateLanguageExchangeProfile,
  type LanguageExchangeProfile,
} from "@/lib/competitiveLabs";
import { trpc } from "@/lib/trpc";

type CorrectionPreference = "ask-first" | "gentle" | "direct";

type ProfileForm = LanguageExchangeProfile & {
  correctionPreference: CorrectionPreference;
  discoverable: boolean;
};

type CorrectionNote = {
  original: string;
  corrected: string;
  note: string;
};

const EMPTY_PROFILE: ProfileForm = {
  nativeLanguage: "",
  learningLanguage: "",
  level: "A1",
  sessionMinutes: 45,
  availability: "",
  goals: "",
  topics: "",
  correctionPreference: "ask-first",
  discoverable: false,
};

const CORRECTION_STORAGE_KEY = "sky4444.language-exchange.corrections";

function readCorrections(): CorrectionNote[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(CORRECTION_STORAGE_KEY) ?? "[]");
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(
        entry =>
          entry &&
          typeof entry.original === "string" &&
          typeof entry.corrected === "string" &&
          typeof entry.note === "string"
      )
      .slice(0, 20);
  } catch {
    return [];
  }
}

export default function LanguagePartnerDiscovery() {
  const { user, isAuthenticated, loading } = useAuth();
  const [profile, setProfile] = useState<ProfileForm>(EMPTY_PROFILE);
  const [errors, setErrors] = useState<string[]>([]);
  const [tab, setTab] = useState("discover");
  const [selectedPartnerId, setSelectedPartnerId] = useState<string>();
  const [messageDraft, setMessageDraft] = useState("");
  const [originalText, setOriginalText] = useState("");
  const [correctedText, setCorrectedText] = useState("");
  const [correctionNote, setCorrectionNote] = useState("");
  const [corrections, setCorrections] = useState<CorrectionNote[]>(readCorrections);
  const [recording, setRecording] = useState(false);
  const [voiceUrl, setVoiceUrl] = useState<string>();
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const utils = trpc.useUtils();

  const profileQuery = trpc.languageExchange.profile.useQuery(undefined, {
    enabled: isAuthenticated,
    retry: false,
  });
  const partnersQuery = trpc.languageExchange.partners.useQuery(
    { limit: 24 },
    { enabled: isAuthenticated && Boolean(profileQuery.data), retry: false }
  );
  const communitiesQuery = trpc.community.list.useQuery(
    { limit: 30 },
    { retry: false }
  );
  const messagesQuery = trpc.dm.messages.useQuery(
    { userId: selectedPartnerId ?? "", limit: 100 },
    { enabled: isAuthenticated && Boolean(selectedPartnerId), retry: false }
  );

  const saveProfile = trpc.languageExchange.upsertProfile.useMutation({
    onSuccess: async () => {
      setErrors([]);
      await Promise.all([
        utils.languageExchange.profile.invalidate(),
        utils.languageExchange.partners.invalidate(),
      ]);
    },
  });

  const sendMessage = trpc.dm.send.useMutation({
    onSuccess: async () => {
      setMessageDraft("");
      if (selectedPartnerId) {
        await utils.dm.messages.invalidate({ userId: selectedPartnerId, limit: 100 });
      }
      await utils.dm.conversations.invalidate();
    },
  });

  useEffect(() => {
    if (!profileQuery.data) return;
    setProfile({
      nativeLanguage: profileQuery.data.nativeLanguage,
      learningLanguage: profileQuery.data.learningLanguage,
      level: profileQuery.data.level as ProfileForm["level"],
      sessionMinutes: profileQuery.data.sessionMinutes as ProfileForm["sessionMinutes"],
      availability: profileQuery.data.availability ?? "",
      goals: profileQuery.data.goals,
      topics: profileQuery.data.topics ?? "",
      correctionPreference: profileQuery.data.correctionPreference as CorrectionPreference,
      discoverable: Boolean(profileQuery.data.discoverable),
    });
  }, [profileQuery.data]);

  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach(track => track.stop());
      if (voiceUrl) URL.revokeObjectURL(voiceUrl);
    };
  }, [voiceUrl]);

  const practicePlan = useMemo(() => {
    if (validateLanguageExchangeProfile(profile).length) return null;
    return buildLanguagePracticePlan(profile);
  }, [profile]);

  const partnerById = useMemo(
    () => new Map((partnersQuery.data ?? []).map(partner => [partner.userId, partner])),
    [partnersQuery.data]
  );
  const selectedPartner = selectedPartnerId
    ? partnerById.get(selectedPartnerId)
    : undefined;

  const relevantCommunities = useMemo(() => {
    const terms = [profile.nativeLanguage, profile.learningLanguage]
      .map(value => value.trim().toLowerCase())
      .filter(Boolean);
    if (!terms.length) return [];
    return (communitiesQuery.data ?? [])
      .filter(community => {
        const haystack = `${community.name} ${community.description ?? ""} ${community.category ?? ""}`.toLowerCase();
        return terms.some(term => haystack.includes(term));
      })
      .slice(0, 6);
  }, [communitiesQuery.data, profile.nativeLanguage, profile.learningLanguage]);

  function updateProfile(patch: Partial<ProfileForm>) {
    setProfile(current => ({ ...current, ...patch }));
    setErrors([]);
  }

  function persistProfile() {
    const nextErrors = validateLanguageExchangeProfile(profile);
    if (nextErrors.length) {
      setErrors(nextErrors);
      return;
    }
    saveProfile.mutate(profile);
  }

  function openConversation(userId: string) {
    setSelectedPartnerId(userId);
    setTab("chat");
  }

  function submitMessage() {
    if (!selectedPartnerId || !messageDraft.trim()) return;
    sendMessage.mutate({
      recipientId: selectedPartnerId,
      content: messageDraft.trim(),
    });
  }

  function saveCorrection() {
    if (!originalText.trim() || !correctedText.trim()) return;
    const next = [
      {
        original: originalText.trim(),
        corrected: correctedText.trim(),
        note: correctionNote.trim(),
      },
      ...corrections,
    ].slice(0, 20);
    setCorrections(next);
    try {
      localStorage.setItem(CORRECTION_STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Keep the current-session notebook usable when storage is unavailable.
    }
    setOriginalText("");
    setCorrectedText("");
    setCorrectionNote("");
  }

  async function startRecording() {
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") return;
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    streamRef.current = stream;
    chunksRef.current = [];
    const recorder = new MediaRecorder(stream);
    recorderRef.current = recorder;
    recorder.ondataavailable = event => {
      if (event.data.size) chunksRef.current.push(event.data);
    };
    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: recorder.mimeType || "audio/webm" });
      setVoiceUrl(current => {
        if (current) URL.revokeObjectURL(current);
        return URL.createObjectURL(blob);
      });
      stream.getTracks().forEach(track => track.stop());
      streamRef.current = null;
      setRecording(false);
    };
    recorder.start();
    setRecording(true);
  }

  function stopRecording() {
    recorderRef.current?.stop();
  }

  if (loading) {
    return <main className="min-h-screen bg-background p-8">Loading language exchange…</main>;
  }

  return (
    <div className="min-h-screen bg-background">
      <PageHeader
        icon={Languages}
        title="Language Exchange"
        subtitle="Find reciprocal practice partners, talk in beta DMs, and build a correction notebook"
      />

      <main className="mx-auto max-w-7xl space-y-6 px-4 py-8">
        <Card className="overflow-hidden border-amber-400/20 bg-gradient-to-br from-amber-500/[0.08] via-background to-sky-500/[0.05]">
          <CardContent className="grid gap-5 p-6 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="border-emerald-400/40 text-emerald-600 dark:text-emerald-200">
                  Persisted beta profiles
                </Badge>
                <Badge variant="outline" className="border-sky-400/40 text-sky-600 dark:text-sky-200">
                  Real beta DMs
                </Badge>
                <Badge variant="outline">Opt-in discovery</Badge>
              </div>
              <h2 className="mt-4 text-2xl font-bold">Conversation-first language practice</h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
                Built around the useful parts of language-exchange apps: reciprocal-language matching,
                conversation, correction preferences, communities, balanced sessions, and voice rehearsal.
                No synthetic people, fake presence, invented ratings, or claimed AI translation are shown.
              </p>
            </div>
            <ShieldCheck className="h-10 w-10 text-emerald-500" />
          </CardContent>
        </Card>

        {!isAuthenticated || !user ? (
          <Card className="mx-auto max-w-xl">
            <CardHeader>
              <CardTitle>Sign in to join Language Exchange</CardTitle>
              <CardDescription>
                Browsing this explanation is public. Partner discovery and messaging are account-owned beta actions.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/signin">
                <Button className="w-full">
                  Open invitation sign in
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <Tabs value={tab} onValueChange={setTab} className="space-y-6">
            <TabsList className="grid h-auto w-full grid-cols-3">
              <TabsTrigger value="discover">Discover</TabsTrigger>
              <TabsTrigger value="chat">Talk</TabsTrigger>
              <TabsTrigger value="practice">Practice</TabsTrigger>
            </TabsList>

            <TabsContent value="discover" className="space-y-6">
              <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
                <Card>
                  <CardHeader>
                    <CardTitle>Your exchange profile</CardTitle>
                    <CardDescription>
                      Saved to your beta account. Discovery is off until you explicitly opt in.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field label="I speak">
                        <Input
                          value={profile.nativeLanguage}
                          onChange={event => updateProfile({ nativeLanguage: event.target.value })}
                          placeholder="English"
                        />
                      </Field>
                      <Field label="I am learning">
                        <Input
                          value={profile.learningLanguage}
                          onChange={event => updateProfile({ learningLanguage: event.target.value })}
                          placeholder="Chinese"
                        />
                      </Field>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field label="Level">
                        <select
                          className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                          value={profile.level}
                          onChange={event => updateProfile({ level: event.target.value as ProfileForm["level"] })}
                        >
                          {["A1", "A2", "B1", "B2", "C1", "C2"].map(level => (
                            <option key={level} value={level}>{level}</option>
                          ))}
                        </select>
                      </Field>
                      <Field label="Ideal session">
                        <select
                          className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                          value={profile.sessionMinutes}
                          onChange={event => updateProfile({ sessionMinutes: Number(event.target.value) as ProfileForm["sessionMinutes"] })}
                        >
                          <option value={30}>30 minutes</option>
                          <option value={45}>45 minutes</option>
                          <option value={60}>60 minutes</option>
                        </select>
                      </Field>
                    </div>

                    <Field label="Correction style">
                      <select
                        className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                        value={profile.correctionPreference}
                        onChange={event => updateProfile({ correctionPreference: event.target.value as CorrectionPreference })}
                      >
                        <option value="ask-first">Ask before correcting</option>
                        <option value="gentle">Correct gently</option>
                        <option value="direct">Direct corrections welcome</option>
                      </select>
                    </Field>

                    <Field label="Availability">
                      <Input
                        value={profile.availability}
                        onChange={event => updateProfile({ availability: event.target.value })}
                        placeholder="Weeknights after 7 PM Central"
                      />
                    </Field>
                    <Field label="Practice goal">
                      <Textarea
                        rows={3}
                        value={profile.goals}
                        onChange={event => updateProfile({ goals: event.target.value })}
                        placeholder="Hold a 15-minute everyday conversation without switching languages."
                      />
                    </Field>
                    <Field label="Topics">
                      <Input
                        value={profile.topics}
                        onChange={event => updateProfile({ topics: event.target.value })}
                        placeholder="music, software, travel, food"
                      />
                    </Field>

                    <label className="flex items-start gap-3 rounded-xl border p-4">
                      <input
                        type="checkbox"
                        className="mt-1"
                        checked={profile.discoverable}
                        onChange={event => updateProfile({ discoverable: event.target.checked })}
                      />
                      <span>
                        <span className="block font-medium">Let other language learners find me</span>
                        <span className="mt-1 block text-xs leading-5 text-muted-foreground">
                          Only opted-in language profiles are returned by partner discovery. Private base profiles stay excluded.
                        </span>
                      </span>
                    </label>

                    {errors.length ? (
                      <ul className="list-disc rounded-xl border border-destructive/30 bg-destructive/5 p-4 pl-8 text-sm text-destructive">
                        {errors.map(error => <li key={error}>{error}</li>)}
                      </ul>
                    ) : null}

                    {saveProfile.error ? (
                      <p className="rounded-xl border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive" role="alert">
                        The profile could not be saved. Check the form and try again.
                      </p>
                    ) : null}

                    {saveProfile.isSuccess ? (
                      <p className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-200" role="status">
                        <CheckCircle2 className="h-4 w-4" /> Profile saved.
                      </p>
                    ) : null}

                    <Button onClick={persistProfile} disabled={saveProfile.isPending}>
                      <Save className="mr-2 h-4 w-4" />
                      {saveProfile.isPending ? "Saving…" : "Save exchange profile"}
                    </Button>
                  </CardContent>
                </Card>

                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-primary" />
                        Practice partners
                      </CardTitle>
                      <CardDescription>
                        Reciprocal pairs are ranked first: they speak what you are learning and learn what you speak.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {!profileQuery.data ? (
                        <EmptyState
                          title="Save your profile first"
                          text="Partner matching needs your language pair before it can compare opted-in beta accounts."
                        />
                      ) : partnersQuery.isLoading ? (
                        <p className="text-sm text-muted-foreground">Looking for opted-in language partners…</p>
                      ) : partnersQuery.isError ? (
                        <p className="text-sm text-destructive" role="alert">Partner discovery could not be loaded.</p>
                      ) : !partnersQuery.data?.length ? (
                        <EmptyState
                          title="No compatible opted-in partners yet"
                          text="That is a real empty state, not a fake population. Keep your profile discoverable and invite beta testers with the reciprocal language pair."
                        />
                      ) : (
                        partnersQuery.data.map(partner => (
                          <article key={partner.userId} className="rounded-2xl border bg-muted/20 p-4">
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                              <div>
                                <div className="flex flex-wrap items-center gap-2">
                                  <h3 className="font-semibold">{partner.name || partner.username || "Language learner"}</h3>
                                  <Badge variant={partner.kind === "reciprocal" ? "default" : "secondary"}>
                                    {partner.kind === "reciprocal" ? "Reciprocal pair" : partner.kind === "teaches-your-language" ? "Speaks your target" : "Learning your language"}
                                  </Badge>
                                </div>
                                {partner.username ? <p className="mt-1 text-xs text-muted-foreground">@{partner.username}</p> : null}
                                <p className="mt-3 text-sm">
                                  <strong>{partner.nativeLanguage}</strong> → learning <strong>{partner.learningLanguage}</strong> · {partner.level}
                                </p>
                                <p className="mt-1 text-sm text-muted-foreground">{partner.goals}</p>
                                {partner.topics ? <p className="mt-2 text-xs text-muted-foreground">Topics: {partner.topics}</p> : null}
                                {partner.sharedTopics.length ? (
                                  <p className="mt-1 text-xs text-emerald-600 dark:text-emerald-200">
                                    Shared topics: {partner.sharedTopics.join(", ")}
                                  </p>
                                ) : null}
                                {partner.availability ? <p className="mt-1 text-xs text-muted-foreground">Availability: {partner.availability}</p> : null}
                              </div>
                              <Button className="shrink-0" onClick={() => openConversation(partner.userId)}>
                                <MessageCircle className="mr-2 h-4 w-4" />
                                Talk
                              </Button>
                            </div>
                          </article>
                        ))
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Language communities</CardTitle>
                      <CardDescription>
                        Real public beta communities whose name, category, or description matches your language pair.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {relevantCommunities.length ? relevantCommunities.map(community => (
                        <div key={community.id} className="rounded-xl border p-4">
                          <div className="flex items-center justify-between gap-3">
                            <div>
                              <p className="font-medium">{community.name}</p>
                              <p className="mt-1 text-xs text-muted-foreground">{community.description || community.category}</p>
                            </div>
                            <Badge variant="outline">{community.memberCount ?? 0} members</Badge>
                          </div>
                        </div>
                      )) : (
                        <EmptyState
                          title="No matching language community yet"
                          text="The community list is persisted beta data. A future tester can create a public language community instead of this page inventing one."
                        />
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="chat" className="space-y-6">
              {!selectedPartner ? (
                <Card>
                  <CardContent className="p-8">
                    <EmptyState
                      title="Choose a practice partner"
                      text="Open Discover and select Talk on an opted-in profile. Messages here use the existing persisted beta DM service."
                    />
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageCircle className="h-5 w-5" />
                      {selectedPartner.name || selectedPartner.username || "Language partner"}
                    </CardTitle>
                    <CardDescription>
                      {selectedPartner.nativeLanguage} ↔ {selectedPartner.learningLanguage}. Correction preference: {selectedPartner.correctionPreference}.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="max-h-[28rem] min-h-64 space-y-3 overflow-y-auto rounded-2xl border bg-muted/10 p-4">
                      {messagesQuery.isLoading ? <p className="text-sm text-muted-foreground">Loading conversation…</p> : null}
                      {messagesQuery.isError ? <p className="text-sm text-destructive">Conversation could not be loaded.</p> : null}
                      {!messagesQuery.isLoading && !messagesQuery.data?.length ? (
                        <p className="text-center text-sm text-muted-foreground">No messages yet. Start with a simple introduction and your practice goal.</p>
                      ) : null}
                      {[...(messagesQuery.data ?? [])].reverse().map(message => {
                        const mine = message.senderId === user.id;
                        return (
                          <div key={message.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                            <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${mine ? "bg-primary text-primary-foreground" : "border bg-background"}`}>
                              {message.content}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="flex flex-col gap-2 sm:flex-row">
                      <Textarea
                        value={messageDraft}
                        onChange={event => setMessageDraft(event.target.value)}
                        maxLength={255}
                        rows={2}
                        placeholder={`Say hello in ${profile.learningLanguage || "your target language"}…`}
                      />
                      <Button className="sm:self-end" disabled={!messageDraft.trim() || sendMessage.isPending} onClick={submitMessage}>
                        {sendMessage.isPending ? "Sending…" : "Send"}
                      </Button>
                    </div>
                    {sendMessage.error ? <p className="text-sm text-destructive" role="alert">Message was not saved. Try again.</p> : null}

                    <div className="rounded-xl border border-amber-400/20 bg-amber-400/[0.04] p-4 text-xs leading-5 text-muted-foreground">
                      This beta does not claim end-to-end encryption, identity verification, online presence, delivery receipts, live voice calls, or automated translation on this screen.
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="practice" className="space-y-6">
              <div className="grid gap-6 lg:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5" />
                      Balanced session plan
                    </CardTitle>
                    <CardDescription>
                      Split the session so both people get equal learner time.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {practicePlan ? (
                      <div className="space-y-3">
                        {practicePlan.steps.map((step, index) => (
                          <div key={step.label} className="flex gap-3 rounded-xl border p-4">
                            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary text-sm font-bold text-primary-foreground">{index + 1}</span>
                            <div>
                              <p className="font-medium">{step.label} · {step.minutes} min</p>
                              <p className="mt-1 text-sm leading-6 text-muted-foreground">{step.detail}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <EmptyState title="Complete your profile" text="A valid language pair and practice goal are required to build the session plan." />
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Volume2 className="h-5 w-5" />
                      Voice rehearsal
                    </CardTitle>
                    <CardDescription>
                      Record yourself locally, play it back, and retry before a real conversation.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {!recording ? (
                        <Button variant="outline" onClick={() => void startRecording()}>
                          <Mic className="mr-2 h-4 w-4" /> Start recording
                        </Button>
                      ) : (
                        <Button variant="destructive" onClick={stopRecording}>
                          <MicOff className="mr-2 h-4 w-4" /> Stop
                        </Button>
                      )}
                    </div>
                    {voiceUrl ? <audio className="w-full" controls src={voiceUrl} /> : null}
                    <p className="text-xs leading-5 text-muted-foreground">
                      Audio stays in this browser tab as an object URL. It is not uploaded or sent to another user.
                    </p>
                  </CardContent>
                </Card>

                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle>Correction notebook</CardTitle>
                    <CardDescription>
                      A HelloTalk-style correction workflow without pretending an AI or tutor supplied the correction.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-5 lg:grid-cols-[1fr_1fr]">
                    <div className="space-y-3">
                      <Field label="Original">
                        <Textarea rows={3} value={originalText} onChange={event => setOriginalText(event.target.value)} placeholder="The sentence you wrote or heard" />
                      </Field>
                      <Field label="Corrected version">
                        <Textarea rows={3} value={correctedText} onChange={event => setCorrectedText(event.target.value)} placeholder="A corrected sentence" />
                      </Field>
                      <Field label="Why">
                        <Input value={correctionNote} onChange={event => setCorrectionNote(event.target.value)} placeholder="Grammar, word choice, tone, pronunciation note…" />
                      </Field>
                      <Button onClick={saveCorrection} disabled={!originalText.trim() || !correctedText.trim()}>
                        <Save className="mr-2 h-4 w-4" /> Save correction
                      </Button>
                    </div>
                    <div className="space-y-3">
                      {!corrections.length ? (
                        <EmptyState title="No corrections saved" text="Corrections are device-local in this iteration." />
                      ) : corrections.map((entry, index) => (
                        <div key={`${entry.original}-${index}`} className="rounded-xl border p-4 text-sm">
                          <p className="text-muted-foreground line-through">{entry.original}</p>
                          <p className="mt-2 font-medium">{entry.corrected}</p>
                          {entry.note ? <p className="mt-2 text-xs text-muted-foreground">{entry.note}</p> : null}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </main>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-2 text-sm font-medium">
      <span>{label}</span>
      {children}
    </label>
  );
}

function EmptyState({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-2xl border border-dashed p-6 text-center">
      <p className="font-medium">{title}</p>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p>
    </div>
  );
}
