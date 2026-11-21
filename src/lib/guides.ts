export interface GuideDoc {
  slug: string;
  title: string;
  minutes: number;
  summary: string;
  sections: { heading: string; body: string[] }[];
}

export const GUIDES: GuideDoc[] = [
  {
    slug: "exam-day-checklist",
    title: "Exam-Day Checklist",
    minutes: 6,
    summary: "What to do the morning of the test and how to pace the 90 minutes.",
    sections: [
      {
        heading: "Before you start",
        body: [
          "Confirm ID requirements for Pearson VUE / OnVUE and arrive early (or log in early for online).",
          "Close messaging apps, clear desk, and complete the room scan calmly if remote.",
          "Remember: this practice lab is unofficial — the live UI will look similar in flow, not identical in branding.",
        ],
      },
      {
        heading: "90-minute pacing",
        body: [
          "Expect a few PBQs early. Flag them and move on if they feel slow.",
          "Aim to finish the MCQ pass with ~20–25 minutes left for flagged PBQs and review.",
          "Do not leave items blank on purpose — unanswered items cannot help your score.",
        ],
      },
      {
        heading: "End game",
        body: [
          "Use Item Review: Incomplete first, then Flagged.",
          "Only End Review when you are done — you cannot go back after submitting.",
        ],
      },
    ],
  },
  {
    slug: "pbq-strategy",
    title: "PBQ Strategy Guide",
    minutes: 8,
    summary: "How to handle performance-based questions without burning the clock.",
    sections: [
      {
        heading: "Core rule",
        body: [
          "Simulation PBQs are usually skippable and save your work — use that.",
          "First pass: open, read the goal, flag, Next. Build MCQ points first.",
        ],
      },
      {
        heading: "Exhibit windows",
        body: [
          "Scenario/Exhibit panels often cover the workspace. Drag or close them, then reopen from Exhibit.",
          "Read the requirement twice: allow/deny order, which hosts, which sequence.",
        ],
      },
      {
        heading: "Common PBQ patterns",
        body: [
          "Firewall: specific allows before broad deny; first-match top-down.",
          "Logs: Office→PowerShell, encoded commands, rare outbound C2 beat boring events.",
          "Matching: lock definitions (control type / risk treatment) — ignore distractors.",
        ],
      },
    ],
  },
  {
    slug: "best-most-traps",
    title: "BEST / MOST Wording Traps",
    minutes: 7,
    summary: "How CompTIA-style stems trick you into picking a true-but-weak answer.",
    sections: [
      {
        heading: "Pick the direct fix",
        body: [
          "BEST usually means the option that most directly reduces the stated risk.",
          "A technically correct control that solves a different problem is still wrong.",
        ],
      },
      {
        heading: "Common traps",
        body: [
          "Availability problem → not answered by confidentiality controls (and vice versa).",
          "Identity risk → MFA/PAM/least privilege beat “longer passwords only.”",
          "Evidence / legal → chain of custody and documentation matter.",
        ],
      },
      {
        heading: "Process",
        body: [
          "Underline the goal verb in the stem (prevent, detect, recover, transfer risk).",
          "Eliminate options that don’t address that verb, then choose the strongest remaining.",
        ],
      },
    ],
  },
  {
    slug: "domain-priorities",
    title: "SY0-701 Domain Priorities",
    minutes: 5,
    summary: "Where to spend study time based on official exam weights.",
    sections: [
      {
        heading: "Weight order",
        body: [
          "4.0 Security Operations — 28% (largest).",
          "2.0 Threats, Vulnerabilities, and Mitigations — 22%.",
          "5.0 Security Program Management and Oversight — 20%.",
          "3.0 Security Architecture — 18%.",
          "1.0 General Security Concepts — 12%.",
        ],
      },
      {
        heading: "Study implication",
        body: [
          "If time is short, overweight Ops (IR, IAM, monitoring, hardening) and Threats.",
          "Use Mid-Review packs and domain drills to target weak areas after a full practice exam.",
        ],
      },
    ],
  },
  {
    slug: "control-and-crypto-basics",
    title: "Controls & Crypto Quick Guide",
    minutes: 8,
    summary: "Fast distinctions that keep showing up in stems.",
    sections: [
      {
        heading: "Control typing",
        body: [
          "Managerial = policies, risk assessments, training programs.",
          "Technical = firewalls, MFA, encryption, EDR.",
          "Operational = reviews, monitoring processes, configuration management work.",
          "Physical = locks, guards, bollards, cameras.",
        ],
      },
      {
        heading: "Crypto",
        body: [
          "Hashing = integrity (one-way). Encryption = confidentiality (reversible with key).",
          "Digital signatures = authenticity + integrity (+ non-repudiation).",
          "Symmetric (AES) for bulk data; asymmetric (RSA/ECC) for exchange/signing; TLS uses both.",
        ],
      },
    ],
  },
  {
    slug: "study-path-2-weeks",
    title: "2-Week Practice Path",
    minutes: 4,
    summary: "A simple plan using every product in this lab.",
    sections: [
      {
        heading: "Week 1",
        body: [
          "Day 1–2: Tips & Guides + Useful Links (orient).",
          "Day 3–4: Ports & Acronyms Drill daily (15 min).",
          "Day 5: PBQ Lab once.",
          "Day 6–7: Domain drills for your weakest two domains.",
        ],
      },
      {
        heading: "Week 2",
        body: [
          "Day 8: Full practice exam → review score report.",
          "Day 9–10: Matching Mid-Review packs to weak domains.",
          "Day 11: PBQ Lab + acronym drill.",
          "Day 12: Second full exam.",
          "Day 13: Exam-Day Checklist + light cram only.",
          "Day 14: Rest / light recall — don’t cram new rabbit holes.",
        ],
      },
    ],
  },
];

export function getGuide(slug: string): GuideDoc | undefined {
  return GUIDES.find((g) => g.slug === slug);
}
