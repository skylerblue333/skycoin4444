import { useState } from "react";
import { Heart, MessageCircleQuestion, Sparkles } from "lucide-react";
import DadsFieldGuide from "@/components/DadsFieldGuide";
import DadsToolkit from "@/components/DadsToolkit";
import DadsGameNight from "@/components/DadsGameNight";
import DadsAdventureDeck from "@/components/DadsAdventureDeck";
import DadsCoinJar from "@/components/DadsCoinJar";

const moments = [
  {
    title: "When your heart gets broken",
    message:
      "Do not beg someone to see your worth. Grieve what was real, learn what you can, keep your dignity, and remember that losing a relationship is not losing your future.",
  },
  {
    title: "When you mess up badly",
    message:
      "Tell the truth. Apologize without excuses. Repair what you can. Learn the lesson. Then let yourself move forward instead of turning one mistake into your identity.",
  },
  {
    title: "When you succeed",
    message:
      "Be proud of yourself. Thank the people who helped. Enjoy the moment before immediately chasing the next thing. You are allowed to celebrate what you worked for.",
  },
  {
    title: "When you feel alone",
    message:
      "Please reach toward somebody safe instead of disappearing into yourself. A hard night can lie about the future. Eat something, sleep, call somebody, and give tomorrow a chance to be different.",
  },
  {
    title: "When somebody treats you badly",
    message:
      "Love does not require you to accept cruelty. You can care about someone and still leave. Protect your peace, your safety, your future, and the person you are becoming.",
  },
  {
    title: "When you have to start over",
    message:
      "Starting over is not proof that the first attempt meant nothing. Take the useful parts with you. New cities, jobs, schools, friendships, and versions of yourself are allowed.",
  },
  {
    title: "When you fall in love",
    message:
      "Choose somebody who is kind when nobody is watching, who respects your no, who can apologize, who wants you to grow, and who makes ordinary life feel safe enough to be yourself.",
  },
  {
    title: "When you choose your work",
    message:
      "Money matters, but so do time, health, people, and meaning. Learn useful skills. Build a life you can afford. Do not confuse a job title with your value as a human being.",
  },
  {
    title: "When you become responsible for someone else",
    message:
      "You do not have to be perfect to care for people well. Be present. Listen. Keep promises you can keep. Admit when you are wrong. Make home feel safer than the outside world.",
  },
  {
    title: "When your sisters need you",
    message:
      "You do not have to agree about everything. Protect the bond without controlling each other. Show up when it matters, forgive what can be forgiven, and let each sister have her own life.",
  },
  {
    title: "When you are older than Dad was writing this",
    message:
      "I hope you can look back with compassion for the younger versions of all of us. Keep the good, learn from the painful parts, and make the next generation gentler where you can.",
  },
  {
    title: "On a completely ordinary Tuesday",
    message:
      "This one matters too. Get something good to eat. Send somebody a funny message. Go outside for a minute. Play a song you love. Most of a life is ordinary days, so make room to enjoy them.",
  },
] as const;

const questions = [
  "What song are you playing too much right now?",
  "What are you proud of that nobody else fully understands?",
  "Who makes you laugh the hardest?",
  "What did you believe a few years ago that you changed your mind about?",
  "What place feels most like home to you now?",
  "What are you learning just because you are curious?",
  "What kind of person makes you feel safe enough to be completely yourself?",
  "What do you want the next version of your life to have more of?",
] as const;

const permissionSlips = [
  "You have permission to change your mind.",
  "You have permission to leave situations that keep hurting you.",
  "You have permission to ask for help before things become unbearable.",
  "You have permission to choose a life that looks different from mine.",
  "You have permission to rest, laugh, play, and enjoy things that are not productive.",
  "You have permission to forgive yourself and try again.",
] as const;

export default function DadForLater() {
  const [open, setOpen] = useState(false);

  return (
    <section className="mt-6 rounded-3xl border border-violet-300/15 bg-violet-300/[0.025] p-5 sm:p-6">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="dad-for-later"
        onClick={() => setOpen(current => !current)}
        className="flex w-full items-center justify-between gap-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300/50"
      >
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.24em] text-violet-100/45">
            Another pocket behind the stars
          </p>
          <h3 className="mt-2 text-lg font-black text-white/85">
            Dad for Later
          </h3>
          <p className="mt-1 text-xs leading-5 text-white/35">
            Not one goodbye. A bunch of check-ins for different versions of you.
          </p>
        </div>
        <Heart className="h-5 w-5 shrink-0 text-violet-200/60" />
      </button>

      {open ? (
        <div id="dad-for-later" className="mt-6 space-y-6">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.24em] text-sky-100/40">
              Open one when life gets there
            </p>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              {moments.map(moment => (
                <details
                  key={moment.title}
                  className="rounded-2xl border border-white/[0.07] bg-black/15 p-4 open:bg-white/[0.03]"
                >
                  <summary className="cursor-pointer list-none text-sm font-bold text-white/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300/50">
                    {moment.title}
                  </summary>
                  <p className="mt-3 text-xs leading-6 text-white/45">
                    {moment.message}
                  </p>
                </details>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-amber-300/15 bg-amber-300/[0.025] p-5 sm:p-6">
            <p className="text-[10px] font-black uppercase tracking-[0.24em] text-amber-100/45">
              What I was trying to build
            </p>
            <h3 className="mt-2 text-lg font-black text-white/85">
              I wanted more possibilities for your future
            </h3>
            <div className="mt-4 space-y-4 text-xs leading-6 text-white/45">
              <p>
                I worked very hard on ideas, software, businesses, learning,
                writing, and SKYCOIN4444 because I wanted to build something
                useful and create more possibilities for our family. A lot of
                that work came from wanting your future to have more choices,
                more opportunity, and more room to dream.
              </p>
              <p>
                I did not always get everything right, and hard work by itself
                does not make somebody a perfect dad. If there were moments
                when work, stress, distance, or adult problems took too much
                space, I am sorry. None of that ever meant you mattered less.
              </p>
              <p>
                The most important thing I was ever trying to build was not a
                company, a coin, an app, or a reputation. It was a future where
                you could grow up knowing you were loved and had choices.
              </p>
              <p>
                If something I built helps you someday, I will be happy. If you
                want nothing to do with any of it, that is completely okay too.
                You do not owe SKYCOIN4444 your career, your time, your money,
                your identity, or your future.
              </p>
              <p>
                I would rather see you build lives that fit who you become than
                spend your lives trying to finish mine. I hope I get to keep
                showing you that in person, not only leave it hidden in code.
              </p>
            </div>
          </div>

          <DadsGameNight />
          <DadsAdventureDeck />
          <DadsCoinJar />
          <DadsFieldGuide />
          <DadsToolkit />

          <div className="rounded-2xl border border-sky-300/10 bg-sky-300/[0.02] p-5">
            <div className="flex items-center gap-2">
              <MessageCircleQuestion className="h-4 w-4 text-sky-200/60" />
              <p className="text-[10px] font-black uppercase tracking-[0.24em] text-sky-100/40">
                Questions Dad would ask
              </p>
            </div>
            <p className="mt-2 text-xs leading-5 text-white/35">
              If I do not know the answers yet, I still care about them. Ask
              yourself these once in a while and imagine me listening.
            </p>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {questions.map(question => (
                <li
                  key={question}
                  className="rounded-xl border border-white/[0.06] bg-black/15 p-3 text-xs leading-5 text-white/45"
                >
                  {question}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-emerald-300/10 bg-emerald-300/[0.02] p-5">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-emerald-200/60" />
              <p className="text-[10px] font-black uppercase tracking-[0.24em] text-emerald-100/40">
                Permission slips from Dad
              </p>
            </div>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {permissionSlips.map(permission => (
                <p
                  key={permission}
                  className="rounded-xl border border-white/[0.06] bg-black/15 p-3 text-xs leading-5 text-white/45"
                >
                  {permission}
                </p>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-white/[0.07] bg-black/20 p-4 text-center">
            <p className="text-sm font-semibold text-white/55">
              You do not have to become a monument to my life. Build yours.
            </p>
            <p className="mt-2 text-xs leading-5 text-white/30">
              I would rather imagine you laughing on an ordinary day than
              carrying my story like a weight.
            </p>
          </div>

          <div className="rounded-2xl border border-white/[0.06] bg-black/15 p-4 text-center">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/25">
              If the website ever changes
            </p>
            <p className="mt-2 text-xs leading-5 text-white/35">
              The writing also lives as plain source text. Search the repository
              for FAMILY-TIME-CAPSULE-INDEX or Love, Dad and follow the map from
              there.
            </p>
          </div>

          <p className="text-center text-[10px] leading-5 text-white/20">
            Dad for Later is decorative, in-memory content only. It does not
            store answers, track opens, create profiles, or send data anywhere.
          </p>
        </div>
      ) : null}
    </section>
  );
}
