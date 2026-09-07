import {
  CircleHelp,
  HandHeart,
  MessageSquareText,
  Route,
  ShieldAlert,
  Sparkles,
} from "lucide-react";

const scripts = [
  {
    title: "How to apologize",
    icon: HandHeart,
    lines: [
      "Say what you did without minimizing it.",
      "Acknowledge how it affected the other person.",
      "Do not turn the apology into a list of what they did wrong.",
      "Ask what repair would actually help.",
      "Change the behavior. That is the part people remember.",
    ],
    example:
      "I was wrong when I did ___. I can see that it affected you by ___. I am sorry. I want to repair this, and I am going to change ___ going forward.",
  },
  {
    title: "How to set a boundary",
    icon: ShieldAlert,
    lines: [
      "Keep it short enough that it cannot become a courtroom argument.",
      "Describe what you will do, not only what the other person must do.",
      "You do not need everybody to agree that your boundary is reasonable.",
      "If somebody repeatedly tests the same boundary, pay attention to the pattern.",
    ],
    example:
      "I am not okay with ___. If it happens again, I am going to ___. I am not asking you to agree; I am telling you what I need to stay in this situation.",
  },
  {
    title: "How to ask for help",
    icon: CircleHelp,
    lines: [
      "Name the problem before it becomes a perfect explanation.",
      "Say what you need right now: company, a ride, advice, money guidance, a doctor, a safe place, or just somebody to listen.",
      "If the first person cannot help, ask a second person.",
      "Being specific makes it easier for people to show up.",
    ],
    example:
      "I am having a hard time and I do not want to handle it alone. Can you stay with me, call me, or help me figure out the next safe step?",
  },
  {
    title: "How to have a hard conversation",
    icon: MessageSquareText,
    lines: [
      "Choose a time when neither person is trapped, driving, exhausted, or already exploding.",
      "Talk about the behavior and impact instead of diagnosing the other person's character.",
      "Ask one honest question and listen to the answer.",
      "If the conversation becomes threatening, humiliating, or unsafe, end it and return only if safety is possible.",
    ],
    example:
      "When ___ happened, I felt ___. What I need going forward is ___. How did you experience it?",
  },
  {
    title: "How to make a big decision",
    icon: Route,
    lines: [
      "Ask what happens if you say yes.",
      "Ask what happens if you say no.",
      "Ask what happens if you wait.",
      "Separate what you want from what you are afraid other people will think.",
      "Look for the reversible option when you do not have enough information.",
      "For high-stakes legal, medical, or financial decisions, get qualified advice.",
    ],
    example:
      "If nobody were watching and I did not have to prove anything, which option would I choose—and what facts still need verifying?",
  },
  {
    title: "How to leave an unsafe situation",
    icon: ShieldAlert,
    lines: [
      "Prioritize getting physically safe over finishing the argument.",
      "Move toward public, staffed, or trusted places when possible.",
      "Contact a trusted person or local emergency service when danger is immediate.",
      "Do not announce every part of a safety plan to somebody who may interfere with it.",
      "Afterward, document important facts and get qualified help when needed.",
    ],
    example:
      "I am leaving now. I will talk about this later if and when it is safe.",
  },
] as const;

const decisionQuestions = [
  "Am I choosing this because I want it, or because I am afraid of disappointing somebody?",
  "What fact would change my mind?",
  "What is the worst realistic downside, and can I survive or reduce it?",
  "What would I tell one of my sisters if she were making this choice?",
  "Does this make my life larger or smaller over time?",
  "Am I being rushed on purpose?",
  "Who benefits if I stop asking questions?",
  "What would this decision look like after one year, not only one week?",
] as const;

const neverBelieve = [
  "That you have to be useful to deserve love.",
  "That staying in pain proves loyalty.",
  "That asking for help makes you weak.",
  "That one mistake ruins your whole future.",
  "That somebody else's anger automatically means you did something wrong.",
  "That being alone for a while means you will always be alone.",
  "That your body, job, grades, income, followers, relationship status, or productivity measure your worth.",
  "That you owe anyone access to you because they spent money, helped you, dated you, raised you, or share your last name.",
] as const;

const tinyReset = [
  "Drink water.",
  "Eat something simple.",
  "Take prescribed medicine as directed.",
  "Charge your phone.",
  "Take a shower or wash your face.",
  "Step outside or change rooms.",
  "Tell one safe person what kind of day you are having.",
  "Do the next small task, not all of life at once.",
  "Sleep before deciding something permanent when you safely can.",
] as const;

export default function DadsToolkit() {
  return (
    <section className="mt-6 rounded-3xl border border-emerald-300/15 bg-emerald-300/[0.02] p-5 sm:p-6">
      <div>
        <p className="text-[10px] font-black uppercase tracking-[0.24em] text-emerald-100/45">
          Words for the moments when your mind goes blank
        </p>
        <h3 className="mt-2 text-xl font-black text-white/85">
          Dad's Pocket Toolkit
        </h3>
        <p className="mt-2 max-w-3xl text-xs leading-6 text-white/40">
          You do not have to remember the perfect words. These are starting
          points. Change them until they sound like you.
        </p>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {scripts.map(({ title, icon: Icon, lines, example }) => (
          <details
            key={title}
            className="rounded-2xl border border-white/[0.07] bg-black/15 p-4 open:bg-white/[0.025]"
          >
            <summary className="flex cursor-pointer list-none items-center gap-3 text-sm font-bold text-white/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300/50">
              <Icon className="h-4 w-4 shrink-0 text-emerald-200/55" />
              {title}
            </summary>
            <ul className="mt-4 space-y-2">
              {lines.map(line => (
                <li key={line} className="flex gap-2 text-xs leading-6 text-white/42">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-emerald-200/40" />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 rounded-xl border border-white/[0.06] bg-black/20 p-3">
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/25">
                Starting words
              </p>
              <p className="mt-2 text-xs leading-5 text-white/45">{example}</p>
            </div>
          </details>
        ))}
      </div>

      <div className="mt-6 grid gap-3 lg:grid-cols-3">
        <div className="rounded-2xl border border-sky-300/10 bg-sky-300/[0.02] p-5">
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-sky-100/45">
            Before a big decision
          </p>
          <ul className="mt-4 space-y-2">
            {decisionQuestions.map(question => (
              <li key={question} className="text-xs leading-5 text-white/42">
                • {question}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-violet-300/10 bg-violet-300/[0.02] p-5">
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-violet-100/45">
            Things I hope you never believe
          </p>
          <ul className="mt-4 space-y-2">
            {neverBelieve.map(item => (
              <li key={item} className="text-xs leading-5 text-white/42">
                • {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-amber-300/10 bg-amber-300/[0.02] p-5">
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-amber-100/45">
            Tiny reset for a terrible day
          </p>
          <ul className="mt-4 space-y-2">
            {tinyReset.map(item => (
              <li key={item} className="text-xs leading-5 text-white/42">
                • {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-6 flex items-start gap-3 rounded-2xl border border-white/[0.07] bg-black/20 p-4">
        <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-emerald-200/55" />
        <p className="text-xs leading-6 text-white/40">
          The point is not to say everything perfectly. The point is to stay
          honest, stay safe, keep talking, and give yourself another chance to
          handle the next part better.
        </p>
      </div>

      <p className="mt-5 text-center text-[10px] leading-5 text-white/20">
        Dad's Pocket Toolkit is static, decorative content. It stores no
        responses and sends no data anywhere.
      </p>
    </section>
  );
}
