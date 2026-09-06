import {
  BookOpenCheck,
  BriefcaseBusiness,
  Car,
  CircleDollarSign,
  HeartHandshake,
  Home,
  KeyRound,
  LifeBuoy,
  MessageCircleHeart,
  ShieldCheck,
  Sparkles,
  UsersRound,
} from "lucide-react";

const fieldGuideSections = [
  {
    title: "Your safety comes before being polite",
    icon: ShieldCheck,
    notes: [
      "If a place, person, ride, date, party, or situation feels wrong, you are allowed to leave without winning an argument first.",
      "Do not get in a car with an impaired driver. Call somebody, use a safe ride, or stay where you are.",
      "Meet new online people in public first and make sure somebody you trust knows where you are.",
      "Keep your phone charged when you travel, know how you are getting home, and keep enough money or another plan for an exit.",
      "If somebody threatens, stalks, traps, hits, coerces, or scares you, treat that as a safety problem—not a relationship puzzle you have to solve alone.",
      "If you are in immediate danger, contact local emergency services and get physically near safe people.",
    ],
  },
  {
    title: "Love should leave room for you to be yourself",
    icon: HeartHandshake,
    notes: [
      "A healthy partner can hear no without punishing you.",
      "Jealousy, checking your phone, isolating you from friends, controlling clothes, money, location, or passwords are not proof of love.",
      "An apology matters most when behavior changes afterward.",
      "Do not confuse intensity with compatibility. Peace can feel less dramatic and still be much healthier.",
      "You are allowed to leave a relationship that keeps hurting you even if the other person is hurting too.",
      "Consent is ongoing. You can change your mind at any point, and so can the other person.",
      "Choose somebody who respects your ambitions instead of shrinking them.",
    ],
  },
  {
    title: "Friendship is a real part of a good life",
    icon: UsersRound,
    notes: [
      "Keep at least a few people who knew you outside a romantic relationship.",
      "Celebrate your friends without turning everything into comparison.",
      "Do not weaponize somebody's secrets during an argument.",
      "If you disappear for a while, a simple honest message can repair more than shame and avoidance.",
      "Pay attention to who is kind when you have nothing useful to offer them.",
      "You can outgrow people without making them villains.",
    ],
  },
  {
    title: "Money is a tool, not your score as a person",
    icon: CircleDollarSign,
    notes: [
      "Try to spend less than you earn and build a small emergency cushion before chasing impressive purchases.",
      "Understand the total cost before signing debt, financing, subscriptions, leases, or payment plans.",
      "High-pressure money decisions are usually a reason to slow down.",
      "Do not lend money you cannot afford to never get back.",
      "Verify unexpected requests for money through a second channel, especially if somebody claims there is an emergency.",
      "Never share one-time verification codes, account passwords, recovery phrases, or private keys with somebody asking for them.",
      "A financial mistake is fixable. Hiding it usually makes it harder.",
      "Get qualified professional advice for legal, tax, investment, or major financial decisions when the stakes are high.",
    ],
  },
  {
    title: "Work is part of life, not the whole meaning of it",
    icon: BriefcaseBusiness,
    notes: [
      "Learn skills that make you useful, then keep learning because industries and jobs change.",
      "Get important promises about pay, duties, schedules, ownership, and benefits in writing.",
      "Save copies of your own employment records, contracts, reviews, and work you are legally allowed to keep.",
      "Ask questions before pretending you understand. Good professionals still ask basic questions.",
      "Do not stay in a dangerous or abusive workplace just to prove you can endure it.",
      "A layoff, firing, failed business, or career change can hurt without defining the rest of your life.",
      "Treat service workers, interns, assistants, and people with less power with the same respect you give executives.",
    ],
  },
  {
    title: "Your digital life deserves locks too",
    icon: KeyRound,
    notes: [
      "Use unique passwords and a reputable password manager instead of reusing the same password everywhere.",
      "Turn on multi-factor authentication for important accounts.",
      "Keep recovery methods current and make backups of things you would hate to lose.",
      "Assume anything sent digitally can eventually be copied or screenshotted.",
      "Do not send intimate pictures because somebody pressures, threatens, begs, or promises they will disappear.",
      "Verify links, payment requests, job offers, prizes, romances, and urgent account warnings before acting.",
      "Software updates are boring and useful. Install security updates rather than postponing them forever.",
      "Privacy settings help, but the safest secret is still the one you never upload.",
    ],
  },
  {
    title: "Take care of the body carrying you through life",
    icon: LifeBuoy,
    notes: [
      "Sleep, food, water, movement, medicine taken as prescribed, and routine care are not glamorous, but they change how problems feel.",
      "Do not ignore symptoms because you are embarrassed. Tell a qualified medical professional what is actually happening.",
      "Learn basic first aid and know where emergency information is kept.",
      "If your mind starts telling you that people would be better off without you or that you should hurt yourself, tell a real person immediately, get near safe people, and contact local crisis or emergency services. Do not carry that moment alone.",
      "Mental-health treatment is healthcare. Needing support is not a character failure.",
      "Avoid making permanent decisions during the worst hour of a temporary crisis.",
    ],
  },
  {
    title: "A home is mostly the small systems",
    icon: Home,
    notes: [
      "Learn how to shut off water, reset a breaker safely, use a fire extinguisher, and know where smoke and carbon-monoxide alarms are.",
      "Keep important documents somewhere secure and know how to replace them.",
      "A little cleaning, laundry, food planning, and maintenance done regularly is easier than rescuing everything at once.",
      "Before signing a lease, read the whole thing and document the condition of the place.",
      "Keep a basic emergency kit appropriate for where you live.",
      "Home should be a place where people can sleep without fear.",
    ],
  },
  {
    title: "Cars and travel reward boring preparation",
    icon: Car,
    notes: [
      "Wear the seat belt even on short drives.",
      "Do not drive impaired, exhausted, furious, or while staring at your phone.",
      "Keep up with tires, brakes, oil, lights, insurance, registration, and whatever maintenance your vehicle actually requires.",
      "When traveling, keep identification, medication, charging, a way to pay, and a backup plan accessible.",
      "Tell somebody trustworthy where you are going when a trip carries extra risk.",
      "Missing a flight or changing a plan is cheaper than ignoring a serious safety concern.",
    ],
  },
  {
    title: "Read before you sign; ask before you assume",
    icon: BookOpenCheck,
    notes: [
      "Contracts are easier to understand before you agree to them.",
      "If somebody refuses to let you read, think, verify, or get advice, that pressure is information.",
      "Keep receipts and written records for important purchases, agreements, repairs, and disputes.",
      "Search for primary sources when facts matter instead of trusting the loudest post.",
      "Being confident and being correct are different things.",
      "Changing your mind after learning something new is growth, not hypocrisy.",
    ],
  },
  {
    title: "If you care for children one day",
    icon: MessageCircleHeart,
    notes: [
      "Children need safety and consistency more than a perfect parent.",
      "Apologize to them when you are wrong. Repair teaches more than pretending parents never fail.",
      "Do not make a child your therapist, messenger, referee, or keeper of adult secrets.",
      "Do not ask children to choose sides in adult conflict.",
      "Listen to the boring stories too. That is often how they learn whether you are safe to tell the serious ones.",
      "Keep promises you can keep and explain honestly when plans change.",
      "Let them become different people than you expected.",
    ],
  },
  {
    title: "Keep some joy that does not need to earn anything",
    icon: Sparkles,
    notes: [
      "Take pictures of ordinary days, not only milestones.",
      "Keep music, games, jokes, food, holidays, little traditions, and ridiculous interests in your life.",
      "Celebrate birthdays and accomplishments without making happiness dependent on perfection.",
      "Go outside sometimes just because the sky looks good.",
      "Learn something useless and fascinating once in a while.",
      "Call your sisters for reasons that are not emergencies.",
      "A life can be meaningful even when nobody is applauding it.",
    ],
  },
] as const;

const beforeYouCommit = [
  {
    title: "Before you sign something",
    checks: [
      "Read it all.",
      "Know the total cost and duration.",
      "Understand how to cancel or exit.",
      "Keep a copy.",
      "Ask an expert when you do not understand the stakes.",
    ],
  },
  {
    title: "Before you move in with somebody",
    checks: [
      "Talk about money.",
      "Talk about chores.",
      "Talk about privacy.",
      "Talk about guests and family.",
      "Know whose name is on the lease and utilities.",
    ],
  },
  {
    title: "Before you marry or make a major commitment",
    checks: [
      "Know how you handle conflict.",
      "Talk honestly about money and debt.",
      "Talk about children or not having them.",
      "Talk about faith, family boundaries, work, and where you want to live.",
      "Pay attention to behavior, not only promises.",
    ],
  },
  {
    title: "Before you quit a job",
    checks: [
      "Know what money covers the gap.",
      "Save important records you are entitled to keep.",
      "Understand insurance or benefits changes.",
      "Leave professionally when it is safe to do so.",
      "If the job is unsafe, safety can matter more than a perfect exit plan.",
    ],
  },
  {
    title: "Before you post something permanent",
    checks: [
      "Imagine your future self reading it.",
      "Remove private information.",
      "Do not post somebody else's vulnerability for entertainment.",
      "Cool down before posting from anger.",
      "Remember that delete does not guarantee gone.",
    ],
  },
  {
    title: "Before a big money move",
    checks: [
      "Sleep on it if you can.",
      "Verify who you are dealing with.",
      "Understand fees, downside, and exit terms.",
      "Never invest or spend because somebody promises guaranteed returns.",
      "Get independent advice when the amount could change your life.",
    ],
  },
] as const;

const greenFlags = [
  "They respect boundaries the first time.",
  "They are kind to people who cannot advance them.",
  "They can disagree without humiliating you.",
  "They apologize specifically and change behavior.",
  "They celebrate your growth.",
  "They do not require access to every password or conversation.",
  "You can be quiet around them without feeling punished.",
  "You feel more like yourself, not less.",
] as const;

const redFlags = [
  "Fear is becoming normal.",
  "They isolate you from friends or family.",
  "They threaten themselves or you to control your choices.",
  "They constantly monitor your location, devices, money, or communication.",
  "They punish boundaries.",
  "They break things, block exits, drive dangerously, or use intimidation.",
  "Every conflict somehow becomes entirely your fault.",
  "You keep hiding what happens because you know people who love you would be worried.",
] as const;

const familyReminders = [
  "You are sisters, not copies of each other.",
  "Do not keep score forever.",
  "Protect each other's dignity in public.",
  "Tell each other the truth privately and kindly.",
  "If one of you is in real trouble, show up before debating old arguments.",
  "Let each sister choose her own relationships, career, beliefs, style, and life.",
  "Share stories and pictures when you can. Family history disappears faster than people expect.",
  "Make new traditions instead of feeling obligated to reproduce every old one.",
] as const;

export default function DadsFieldGuide() {
  return (
    <section className="mt-6 rounded-3xl border border-sky-300/15 bg-sky-300/[0.02] p-5 sm:p-6">
      <div>
        <p className="text-[10px] font-black uppercase tracking-[0.24em] text-sky-100/45">
          Things I would rather teach you in person
        </p>
        <h3 className="mt-2 text-xl font-black text-white/85">
          Dad's Field Guide
        </h3>
        <p className="mt-2 max-w-3xl text-xs leading-6 text-white/40">
          Keep what helps. Ignore what does not fit the lives you build. None
          of this is a command to become like me; it is the kind of practical
          stuff I would want to talk through with you at a kitchen table, in a
          car, on a walk, or whenever you called.
        </p>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {fieldGuideSections.map(({ title, icon: Icon, notes }) => (
          <details
            key={title}
            className="rounded-2xl border border-white/[0.07] bg-black/15 p-4 open:bg-white/[0.025]"
          >
            <summary className="flex cursor-pointer list-none items-center gap-3 text-sm font-bold text-white/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300/50">
              <Icon className="h-4 w-4 shrink-0 text-sky-200/55" />
              {title}
            </summary>
            <ul className="mt-4 space-y-2">
              {notes.map(note => (
                <li
                  key={note}
                  className="flex gap-2 text-xs leading-6 text-white/42"
                >
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-sky-200/40" />
                  <span>{note}</span>
                </li>
              ))}
            </ul>
          </details>
        ))}
      </div>

      <div className="mt-6 rounded-2xl border border-violet-300/10 bg-violet-300/[0.02] p-5">
        <p className="text-[10px] font-black uppercase tracking-[0.24em] text-violet-100/40">
          Before you commit
        </p>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {beforeYouCommit.map(item => (
            <details
              key={item.title}
              className="rounded-2xl border border-white/[0.07] bg-black/15 p-4"
            >
              <summary className="cursor-pointer list-none text-sm font-bold text-white/65 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300/50">
                {item.title}
              </summary>
              <ol className="mt-3 space-y-2">
                {item.checks.map((check, index) => (
                  <li
                    key={check}
                    className="flex gap-3 text-xs leading-5 text-white/42"
                  >
                    <span className="font-black text-violet-200/50">
                      {index + 1}
                    </span>
                    <span>{check}</span>
                  </li>
                ))}
              </ol>
            </details>
          ))}
        </div>
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-2">
        <div className="rounded-2xl border border-emerald-300/10 bg-emerald-300/[0.02] p-5">
          <p className="text-[10px] font-black uppercase tracking-[0.24em] text-emerald-100/45">
            Green flags
          </p>
          <ul className="mt-4 space-y-2">
            {greenFlags.map(flag => (
              <li key={flag} className="text-xs leading-5 text-white/42">
                + {flag}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-rose-300/10 bg-rose-300/[0.02] p-5">
          <p className="text-[10px] font-black uppercase tracking-[0.24em] text-rose-100/45">
            Red flags
          </p>
          <ul className="mt-4 space-y-2">
            {redFlags.map(flag => (
              <li key={flag} className="text-xs leading-5 text-white/42">
                − {flag}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-amber-300/10 bg-amber-300/[0.02] p-5">
        <p className="text-[10px] font-black uppercase tracking-[0.24em] text-amber-100/45">
          About the three of you
        </p>
        <p className="mt-2 text-xs leading-5 text-white/35">
          I hope being sisters becomes something that gives you more support,
          not another obligation.
        </p>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2">
          {familyReminders.map(reminder => (
            <li
              key={reminder}
              className="rounded-xl border border-white/[0.06] bg-black/15 p-3 text-xs leading-5 text-white/42"
            >
              {reminder}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6 rounded-2xl border border-white/[0.07] bg-black/20 p-5">
        <p className="text-sm font-bold text-white/60">
          The rule underneath all the rules
        </p>
        <p className="mt-2 text-xs leading-6 text-white/40">
          Stay alive. Stay curious. Tell the truth. Get help early. Protect
          people without trying to own them. Build a life that belongs to you.
          Keep some humor. Call your sisters. And if I am lucky enough to be
          there when you need any of this, ignore the code and call me instead.
        </p>
      </div>

      <p className="mt-5 text-center text-[10px] leading-5 text-white/20">
        Dad's Field Guide is static, decorative content. It does not save which
        sections you open, collect answers, create child records, or send data
        anywhere.
      </p>
    </section>
  );
}
