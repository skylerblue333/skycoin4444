import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "wouter";
import { toast } from "sonner";
import {
  AlertTriangle,
  Camera,
  Eye,
  Loader2,
  MessageCircle,
  Radio,
  Send,
  ShieldCheck,
  Trash2,
  Users,
  Video,
  VideoOff,
  Wifi,
  WifiOff,
} from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ExperienceShell, SurfaceCard } from "@/components/ecosystem/ExperienceShell";
import {
  liveRoomsApi,
  type LiveChatMessage,
  type LiveParticipantSession,
  type LiveRoomSummary,
  type LiveSignal,
} from "@/lib/liveRooms";

const CATEGORIES = ["Gaming", "Music", "Education", "Crypto", "Technology", "Community"] as const;
const SIGNAL_POLL_MS = 700;
const CHAT_POLL_MS = 1_200;
const ROOM_POLL_MS = 5_000;
const HEARTBEAT_MS = 12_000;
const CONFIGURED_STUN_URL = (import.meta.env.VITE_SKYLIVE_STUN_URL as string | undefined)?.trim() ?? "";

function peerConfig(): RTCConfiguration {
  return CONFIGURED_STUN_URL ? { iceServers: [{ urls: CONFIGURED_STUN_URL }] } : { iceServers: [] };
}

function messageFrom(error: unknown): string {
  return error instanceof Error ? error.message : "SkyLive request failed";
}

function mergeMessages(current: LiveChatMessage[], incoming: LiveChatMessage[]): LiveChatMessage[] {
  if (!incoming.length) return current;
  const merged = new Map(current.map(message => [message.id, message]));
  for (const message of incoming) merged.set(message.id, message);
  return [...merged.values()].sort((a, b) => a.sequence - b.sequence).slice(-100);
}

export default function Live() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [rooms, setRooms] = useState<LiveRoomSummary[]>([]);
  const [roomsLoading, setRoomsLoading] = useState(true);
  const [roomError, setRoomError] = useState("");
  const [title, setTitle] = useState("SKYCOIN4444 live beta");
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>("Technology");
  const [session, setSession] = useState<LiveParticipantSession | null>(null);
  const [activeRoom, setActiveRoom] = useState<LiveRoomSummary | null>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [transportState, setTransportState] = useState("Idle");
  const [busy, setBusy] = useState(false);
  const [messages, setMessages] = useState<LiveChatMessage[]>([]);
  const [draft, setDraft] = useState("");

  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const hostPeersRef = useRef(new Map<string, RTCPeerConnection>());
  const viewerPeerRef = useRef<RTCPeerConnection | null>(null);
  const pendingIceRef = useRef(new Map<string, RTCIceCandidateInit[]>());
  const signalCursorRef = useRef(0);
  const chatCursorRef = useRef(0);

  const refreshRooms = useCallback(async () => {
    try {
      const next = await liveRoomsApi.list();
      setRooms(next);
      setRoomError("");
      if (activeRoom) {
        const refreshed = next.find(room => room.id === activeRoom.id);
        if (refreshed) setActiveRoom(refreshed);
      }
    } catch (error) {
      setRoomError(messageFrom(error));
    } finally {
      setRoomsLoading(false);
    }
  }, [activeRoom]);

  useEffect(() => {
    void refreshRooms();
    const timer = window.setInterval(() => void refreshRooms(), ROOM_POLL_MS);
    return () => window.clearInterval(timer);
  }, [refreshRooms]);

  useEffect(() => {
    if (localVideoRef.current) localVideoRef.current.srcObject = localStream;
  }, [localStream]);

  useEffect(() => {
    if (remoteVideoRef.current) remoteVideoRef.current.srcObject = remoteStream;
  }, [remoteStream]);

  const closePeerConnections = useCallback(() => {
    for (const peer of hostPeersRef.current.values()) peer.close();
    hostPeersRef.current.clear();
    viewerPeerRef.current?.close();
    viewerPeerRef.current = null;
    pendingIceRef.current.clear();
    setRemoteStream(null);
  }, []);

  const stopLocalMedia = useCallback(() => {
    localStreamRef.current?.getTracks().forEach(track => track.stop());
    localStreamRef.current = null;
    setLocalStream(null);
  }, []);

  const resetRoom = useCallback((stopMedia: boolean) => {
    closePeerConnections();
    if (stopMedia) stopLocalMedia();
    signalCursorRef.current = 0;
    chatCursorRef.current = 0;
    setSession(null);
    setActiveRoom(null);
    setMessages([]);
    setDraft("");
    setTransportState("Idle");
  }, [closePeerConnections, stopLocalMedia]);

  useEffect(() => () => {
    closePeerConnections();
    localStreamRef.current?.getTracks().forEach(track => track.stop());
  }, [closePeerConnections]);

  const queueOrAddIce = useCallback(async (
    peer: RTCPeerConnection,
    remotePeerId: string,
    candidate: RTCIceCandidateInit,
  ) => {
    if (peer.remoteDescription) {
      await peer.addIceCandidate(candidate);
      return;
    }
    const queued = pendingIceRef.current.get(remotePeerId) ?? [];
    queued.push(candidate);
    pendingIceRef.current.set(remotePeerId, queued);
  }, []);

  const flushIce = useCallback(async (peer: RTCPeerConnection, remotePeerId: string) => {
    const queued = pendingIceRef.current.get(remotePeerId) ?? [];
    pendingIceRef.current.delete(remotePeerId);
    for (const candidate of queued) await peer.addIceCandidate(candidate);
  }, []);

  const createHostPeer = useCallback(async (viewerPeerId: string, currentSession: LiveParticipantSession) => {
    if (hostPeersRef.current.has(viewerPeerId)) return hostPeersRef.current.get(viewerPeerId)!;
    const stream = localStreamRef.current;
    if (!stream) throw new Error("Camera and microphone are no longer available");

    const peer = new RTCPeerConnection(peerConfig());
    hostPeersRef.current.set(viewerPeerId, peer);
    for (const track of stream.getTracks()) peer.addTrack(track, stream);

    peer.onicecandidate = event => {
      if (!event.candidate) return;
      void liveRoomsApi.sendSignal(
        currentSession,
        viewerPeerId,
        "ice",
        JSON.stringify(event.candidate.toJSON()),
      ).catch(() => setTransportState("ICE signaling needs attention"));
    };
    peer.onconnectionstatechange = () => {
      const state = peer.connectionState;
      if (state === "connected") setTransportState("Broadcast connected");
      if (state === "failed") setTransportState("A viewer peer connection failed");
      if (state === "failed" || state === "closed") {
        hostPeersRef.current.delete(viewerPeerId);
        peer.close();
      }
    };

    const offer = await peer.createOffer();
    await peer.setLocalDescription(offer);
    await liveRoomsApi.sendSignal(currentSession, viewerPeerId, "offer", JSON.stringify(offer));
    setTransportState("Offer sent — negotiating viewer media");
    return peer;
  }, []);

  const createViewerPeer = useCallback((currentSession: LiveParticipantSession) => {
    if (viewerPeerRef.current) return viewerPeerRef.current;
    const peer = new RTCPeerConnection(peerConfig());
    viewerPeerRef.current = peer;

    peer.ontrack = event => {
      const stream = event.streams[0] ?? new MediaStream([event.track]);
      setRemoteStream(stream);
      setTransportState("Watching live peer media");
    };
    peer.onicecandidate = event => {
      if (!event.candidate) return;
      void liveRoomsApi.sendSignal(
        currentSession,
        currentSession.hostPeerId,
        "ice",
        JSON.stringify(event.candidate.toJSON()),
      ).catch(() => setTransportState("ICE signaling needs attention"));
    };
    peer.onconnectionstatechange = () => {
      const state = peer.connectionState;
      if (state === "connected") setTransportState("Watching live peer media");
      if (state === "failed") setTransportState("Peer media could not connect");
      if (state === "disconnected") setTransportState("Peer media disconnected");
    };
    return peer;
  }, []);

  const handleSignal = useCallback(async (signal: LiveSignal, currentSession: LiveParticipantSession) => {
    if (currentSession.role === "host") {
      if (signal.kind === "ready") {
        await createHostPeer(signal.fromPeerId, currentSession);
        return;
      }
      const peer = hostPeersRef.current.get(signal.fromPeerId);
      if (!peer) return;
      if (signal.kind === "answer") {
        await peer.setRemoteDescription(JSON.parse(signal.payload) as RTCSessionDescriptionInit);
        await flushIce(peer, signal.fromPeerId);
      } else if (signal.kind === "ice") {
        await queueOrAddIce(peer, signal.fromPeerId, JSON.parse(signal.payload) as RTCIceCandidateInit);
      }
      return;
    }

    if (signal.fromPeerId !== currentSession.hostPeerId) return;
    const peer = createViewerPeer(currentSession);
    if (signal.kind === "offer") {
      await peer.setRemoteDescription(JSON.parse(signal.payload) as RTCSessionDescriptionInit);
      await flushIce(peer, signal.fromPeerId);
      const answer = await peer.createAnswer();
      await peer.setLocalDescription(answer);
      await liveRoomsApi.sendSignal(currentSession, currentSession.hostPeerId, "answer", JSON.stringify(answer));
      setTransportState("Answer sent — negotiating peer media");
    } else if (signal.kind === "ice") {
      await queueOrAddIce(peer, signal.fromPeerId, JSON.parse(signal.payload) as RTCIceCandidateInit);
    }
  }, [createHostPeer, createViewerPeer, flushIce, queueOrAddIce]);

  useEffect(() => {
    if (!session) return;
    let cancelled = false;
    let running = false;

    const poll = async () => {
      if (cancelled || running) return;
      running = true;
      try {
        const signals = await liveRoomsApi.signals(session, signalCursorRef.current);
        for (const signal of signals) {
          await handleSignal(signal, session);
          signalCursorRef.current = Math.max(signalCursorRef.current, signal.sequence);
        }
      } catch (error) {
        if (!cancelled) setTransportState(messageFrom(error));
      } finally {
        running = false;
      }
    };

    void poll();
    const timer = window.setInterval(() => void poll(), SIGNAL_POLL_MS);
    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, [handleSignal, session]);

  useEffect(() => {
    if (!session) return;
    let cancelled = false;
    let running = false;

    const poll = async () => {
      if (cancelled || running) return;
      running = true;
      try {
        const incoming = await liveRoomsApi.chat(session, chatCursorRef.current);
        if (incoming.length) {
          chatCursorRef.current = Math.max(chatCursorRef.current, ...incoming.map(message => message.sequence));
          if (!cancelled) setMessages(current => mergeMessages(current, incoming));
        }
      } catch (error) {
        if (!cancelled) setRoomError(messageFrom(error));
      } finally {
        running = false;
      }
    };

    void poll();
    const timer = window.setInterval(() => void poll(), CHAT_POLL_MS);
    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, [session]);

  useEffect(() => {
    if (!session) return;
    let cancelled = false;
    const heartbeat = async () => {
      try {
        const room = await liveRoomsApi.heartbeat(session);
        if (!cancelled) {
          setActiveRoom(room);
          setRooms(current => current.map(item => item.id === room.id ? room : item));
        }
      } catch (error) {
        if (!cancelled) setRoomError(messageFrom(error));
      }
    };
    void heartbeat();
    const timer = window.setInterval(() => void heartbeat(), HEARTBEAT_MS);
    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, [session]);

  const requireSignedIn = () => {
    if (isAuthenticated) return true;
    toast("Sign in with an invited beta account to participate in a live room.");
    window.location.assign("/signin");
    return false;
  };

  const startBroadcast = async () => {
    if (!requireSignedIn() || busy) return;
    if (!navigator.mediaDevices?.getUserMedia) {
      toast.error("This browser does not expose camera/microphone capture in the current context.");
      return;
    }

    setBusy(true);
    setRoomError("");
    let captured: MediaStream | null = null;
    try {
      captured = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: { echoCancellation: true, noiseSuppression: true },
      });
      const created = await liveRoomsApi.create(title, category);
      localStreamRef.current = captured;
      setLocalStream(captured);
      setSession({
        roomId: created.roomId,
        peerId: created.peerId,
        hostPeerId: created.hostPeerId,
        role: created.role,
      });
      setActiveRoom(created.room);
      signalCursorRef.current = 0;
      chatCursorRef.current = 0;
      setMessages([]);
      setTransportState("Live room open — waiting for viewers");
      toast.success("SkyLive small-room broadcast is open.");
      await refreshRooms();
    } catch (error) {
      captured?.getTracks().forEach(track => track.stop());
      setRoomError(messageFrom(error));
      toast.error(messageFrom(error));
    } finally {
      setBusy(false);
    }
  };

  const joinRoom = async (room: LiveRoomSummary) => {
    if (!requireSignedIn() || busy) return;
    setBusy(true);
    setRoomError("");
    try {
      const joined = await liveRoomsApi.join(room.id);
      if (joined.role === "host") {
        throw new Error("Open your existing creator session instead of joining it as a viewer");
      }
      setSession(joined);
      setActiveRoom(room);
      signalCursorRef.current = 0;
      chatCursorRef.current = 0;
      setMessages([]);
      setTransportState("Joining room — requesting host media");
      await liveRoomsApi.sendSignal(joined, joined.hostPeerId, "ready", "");
    } catch (error) {
      setRoomError(messageFrom(error));
      toast.error(messageFrom(error));
    } finally {
      setBusy(false);
    }
  };

  const leaveOrEnd = async () => {
    if (!session || busy) return;
    setBusy(true);
    try {
      if (session.role === "host") await liveRoomsApi.end(session.roomId);
    } catch (error) {
      toast.error(messageFrom(error));
    } finally {
      resetRoom(session.role === "host");
      setBusy(false);
      void refreshRooms();
    }
  };

  const sendChat = async () => {
    const message = draft.trim();
    if (!session || !message) return;
    try {
      const sent = await liveRoomsApi.sendChat(session, message);
      chatCursorRef.current = Math.max(chatCursorRef.current, sent.sequence);
      setMessages(current => mergeMessages(current, [sent]));
      setDraft("");
    } catch (error) {
      toast.error(messageFrom(error));
    }
  };

  const shareRoom = async (room: LiveRoomSummary) => {
    const url = `${window.location.origin}/live?room=${encodeURIComponent(room.id)}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: room.title, text: `Join ${room.title} on SkyLive`, url });
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(url);
        toast.success("Live room link copied.");
      } else {
        toast(url);
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      toast.error("Room link could not be shared.");
    }
  };

  const moderateMessage = async (message: LiveChatMessage) => {
    if (!session || session.role !== "host") return;
    try {
      const deleted = await liveRoomsApi.deleteChat(session.roomId, message.id);
      if (deleted) setMessages(current => current.filter(item => item.id !== message.id));
    } catch (error) {
      toast.error(messageFrom(error));
    }
  };

  const liveCount = rooms.length;
  const totalViewers = useMemo(() => rooms.reduce((sum, room) => sum + room.viewerCount, 0), [rooms]);
  const hosting = session?.role === "host";
  const watching = session?.role === "viewer";

  return (
    <ExperienceShell
      title="SkyLive"
      subtitle="Small-room browser WebRTC broadcasting with authenticated signaling, presence, and live chat."
      icon={Radio}
      accent="indigo"
      badge="WebRTC beta"
      actions={isAuthenticated ? (
        <div className="flex items-center gap-2 text-xs text-emerald-700"><ShieldCheck className="h-4 w-4" /> Signed-in beta session</div>
      ) : (
        <Link href="/signin"><Button className="rounded-xl bg-indigo-600 hover:bg-indigo-700">Sign in to participate</Button></Link>
      )}
    >
      <SurfaceCard className="mb-5 border-indigo-200 bg-indigo-50/70 p-4">
        <div className="flex gap-3">
          <Radio className="mt-0.5 h-5 w-5 shrink-0 text-indigo-700" />
          <div>
            <div className="font-bold text-indigo-950">This beta now has a real peer-media path — not a simulated viewer counter.</div>
            <p className="mt-1 text-sm leading-6 text-indigo-800/80">
              A creator captures camera/microphone in the browser, the server coordinates authenticated room/signaling state, and viewers negotiate direct WebRTC media with the creator. This is deliberately a small-room engineering beta: no server media ingest, transcoding, TURN relay, CDN delivery, recording/VOD, subscriptions, payouts, or production-scale availability claim.
            </p>
          </div>
        </div>
      </SurfaceCard>

      {roomError ? (
        <SurfaceCard className="mb-5 border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          <div className="flex items-start gap-2"><AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" /><span>{roomError}</span></div>
        </SurfaceCard>
      ) : null}

      {!session ? (
        <div className="grid gap-5 xl:grid-cols-[420px_minmax(0,1fr)]">
          <SurfaceCard className="p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-black">Open a creator room</h2>
                <p className="mt-1 text-xs leading-5 text-slate-500">Camera/mic permission is requested before a room is created.</p>
              </div>
              <Camera className="h-6 w-6 text-indigo-600" />
            </div>

            <label className="mt-5 block text-xs font-bold uppercase tracking-wide text-slate-500">Stream title</label>
            <Input value={title} onChange={event => setTitle(event.target.value)} maxLength={100} className="mt-2 rounded-xl border-slate-200" />
            <label className="mt-4 block text-xs font-bold uppercase tracking-wide text-slate-500">Category</label>
            <select value={category} onChange={event => setCategory(event.target.value as (typeof CATEGORIES)[number])} className="mt-2 h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-indigo-400">
              {CATEGORIES.map(item => <option key={item} value={item}>{item}</option>)}
            </select>

            <Button onClick={() => void startBroadcast()} disabled={busy || authLoading || !title.trim()} className="mt-5 w-full rounded-xl bg-indigo-600 hover:bg-indigo-700">
              {busy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Video className="mr-2 h-4 w-4" />}
              Start small-room live beta
            </Button>
            {!isAuthenticated && !authLoading ? <p className="mt-3 text-center text-xs text-slate-500">Invitation sign-in is required to host or join.</p> : null}
          </SurfaceCard>

          <div>
            <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 className="text-lg font-black">Live rooms</h2>
                <p className="mt-1 text-xs text-slate-500">{liveCount} active room{liveCount === 1 ? "" : "s"} · {totalViewers} active viewer{totalViewers === 1 ? "" : "s"}</p>
              </div>
              <Button variant="outline" onClick={() => void refreshRooms()} disabled={roomsLoading} className="rounded-xl border-slate-200">
                {roomsLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Radio className="mr-2 h-4 w-4" />} Refresh
              </Button>
            </div>

            {roomsLoading ? (
              <SurfaceCard className="grid min-h-56 place-items-center"><Loader2 className="h-6 w-6 animate-spin text-indigo-600" /></SurfaceCard>
            ) : rooms.length === 0 ? (
              <SurfaceCard className="grid min-h-56 place-items-center p-8 text-center">
                <div><VideoOff className="mx-auto h-10 w-10 text-slate-300" /><h3 className="mt-3 font-bold text-slate-700">No creator is live yet</h3><p className="mt-1 max-w-sm text-sm leading-6 text-slate-500">Start the first small-room beta broadcast from this deployment.</p></div>
              </SurfaceCard>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {rooms.map(room => (
                  <SurfaceCard key={room.id} className="overflow-hidden">
                    <div className="aspect-video bg-gradient-to-br from-indigo-700 via-violet-700 to-sky-500 p-4 text-white">
                      <div className="flex items-center justify-between"><span className="rounded-full bg-red-500 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider">Live beta</span><span className="flex items-center gap-1 rounded-full bg-black/25 px-2.5 py-1 text-xs"><Eye className="h-3.5 w-3.5" /> {room.viewerCount}</span></div>
                      <div className="flex h-[calc(100%-2rem)] items-end"><div><div className="text-xs font-bold uppercase tracking-[0.16em] text-white/60">{room.category}</div><h3 className="mt-1 text-xl font-black">{room.title}</h3></div></div>
                    </div>
                    <div className="flex items-center justify-between gap-3 p-4"><div className="text-xs text-slate-500">Direct browser peer media</div><div className="flex gap-2"><Button variant="outline" onClick={() => void shareRoom(room)} className="rounded-xl border-slate-200">Share</Button><Button onClick={() => void joinRoom(room)} disabled={busy} className="rounded-xl bg-indigo-600 hover:bg-indigo-700"><Wifi className="mr-2 h-4 w-4" /> Join</Button></div></div>
                  </SurfaceCard>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_380px]">
          <div className="space-y-5">
            <SurfaceCard className="overflow-hidden bg-slate-950">
              <div className="relative aspect-video min-h-[320px] bg-black">
                {hosting ? (
                  <video ref={localVideoRef} autoPlay muted playsInline className="h-full w-full object-cover" />
                ) : remoteStream ? (
                  <video ref={remoteVideoRef} autoPlay playsInline controls className="h-full w-full object-contain" />
                ) : (
                  <div className="absolute inset-0 grid place-items-center text-center text-white">
                    <div><Loader2 className="mx-auto h-9 w-9 animate-spin text-indigo-300" /><h3 className="mt-3 font-bold">Negotiating WebRTC media</h3><p className="mt-1 max-w-md text-sm text-white/50">The room is real; media appears after the browser peer connection succeeds.</p></div>
                  </div>
                )}

                <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-red-500 px-3 py-1.5 text-xs font-black uppercase tracking-wide text-white shadow-lg"><Radio className="h-3.5 w-3.5" /> Live beta</div>
                <div className="absolute right-4 top-4 rounded-full bg-black/60 px-3 py-1.5 text-xs text-white backdrop-blur"><Users className="mr-1 inline h-3.5 w-3.5" /> {activeRoom?.viewerCount ?? 0} viewer{activeRoom?.viewerCount === 1 ? "" : "s"}</div>
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent p-5 pt-20 text-white"><div className="text-xs font-bold uppercase tracking-[0.16em] text-white/50">{activeRoom?.category ?? "SkyLive"}</div><h2 className="mt-1 text-2xl font-black">{activeRoom?.title ?? "Live room"}</h2><p className="mt-1 flex items-center gap-2 text-xs text-white/60">{transportState.includes("failed") || transportState.includes("disconnected") ? <WifiOff className="h-3.5 w-3.5" /> : <Wifi className="h-3.5 w-3.5" />} {transportState}</p></div>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 bg-slate-950 p-4 text-white">
                <div className="text-xs text-white/45">{hosting ? "Your browser sends one peer stream per connected viewer." : "Media travels browser-to-browser after signaling."}</div>
                <Button onClick={() => void leaveOrEnd()} disabled={busy} variant="outline" className="rounded-xl border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white">{hosting ? "End broadcast" : "Leave room"}</Button>
              </div>
            </SurfaceCard>

            <SurfaceCard className="p-5">
              <div className="flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-indigo-600" /><h2 className="font-black">Engineering-beta transport boundary</h2></div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {[
                  ["Media path", "Direct WebRTC browser peer"],
                  ["Room state", "Process-local server memory"],
                  ["Viewer cap", "12 peers per creator room"],
                  ["NAT traversal", CONFIGURED_STUN_URL ? "Configured STUN discovery; no TURN relay" : "Host ICE candidates only; no STUN/TURN configured"],
                  ["Persistence", "Room/chat reset on server restart"],
                  ["Not included", "Transcoding, CDN, VOD, payouts, SLA"],
                ].map(([label, value]) => <div key={label} className="rounded-xl bg-slate-50 p-3"><div className="text-[10px] font-black uppercase tracking-wide text-slate-400">{label}</div><div className="mt-1 text-sm font-semibold text-slate-700">{value}</div></div>)}
              </div>
            </SurfaceCard>
          </div>

          <SurfaceCard className="overflow-hidden xl:sticky xl:top-5 xl:h-fit">
            <div className="flex items-center justify-between border-b border-slate-100 p-4"><div><h2 className="font-black">Live room chat</h2><p className="text-xs text-slate-400">Authenticated, process-local beta chat</p></div><MessageCircle className="h-5 w-5 text-indigo-600" /></div>
            <div className="h-96 space-y-3 overflow-y-auto bg-slate-50/70 p-4">
              {messages.length === 0 ? <div className="grid h-full place-items-center text-center"><div><MessageCircle className="mx-auto h-8 w-8 text-slate-300" /><p className="mt-2 text-sm font-medium text-slate-500">No messages yet</p><p className="mt-1 text-xs text-slate-400">Say hello when another beta tester joins.</p></div></div> : messages.map(message => (
                <div key={message.id} className="rounded-xl border border-slate-200 bg-white p-3">
                  <div className="flex items-start justify-between gap-3"><div><div className={`text-xs font-black ${message.role === "host" ? "text-indigo-700" : "text-slate-500"}`}>{message.role === "host" ? "Host" : "Viewer"}</div><p className="mt-1 break-words text-sm text-slate-700">{message.message}</p></div>{hosting ? <button type="button" onClick={() => void moderateMessage(message)} className="rounded-lg p-1.5 text-slate-300 hover:bg-red-50 hover:text-red-600" aria-label="Delete chat message"><Trash2 className="h-3.5 w-3.5" /></button> : null}</div>
                </div>
              ))}
            </div>
            <div className="border-t border-slate-100 p-3">
              <div className="flex gap-2"><Input value={draft} maxLength={500} onChange={event => setDraft(event.target.value)} onKeyDown={event => { if (event.key === "Enter" && !event.shiftKey) void sendChat(); }} className="rounded-xl border-slate-200" placeholder="Message the live room" /><Button onClick={() => void sendChat()} disabled={!draft.trim()} aria-label="Send live chat message" className="rounded-xl bg-indigo-600 px-3 hover:bg-indigo-700"><Send className="h-4 w-4" /></Button></div>
              <p className="mt-2 text-[11px] leading-5 text-slate-400">Chat is bounded to signed-in room participants. Host deletion is moderation only; there is no automated safety classification in this beta.</p>
            </div>
          </SurfaceCard>
        </div>
      )}
    </ExperienceShell>
  );
}
