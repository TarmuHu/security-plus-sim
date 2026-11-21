export interface LinkItem {
  title: string;
  url: string;
  note: string;
}

export interface LinkGroup {
  id: string;
  title: string;
  items: LinkItem[];
}

export const LINK_GROUPS: LinkGroup[] = [
  {
    id: "official",
    title: "Official CompTIA / exam blueprint",
    items: [
      {
        title: "CompTIA Security+ V7 (SY0-701) exam page",
        url: "https://www.comptia.org/en-us/certifications/security/v7/",
        note: "Official exam details, domains, retirement date, and CompTIA products.",
      },
      {
        title: "CompTIA Security+ certification hub",
        url: "https://www.comptia.org/en-us/certifications/security/",
        note: "Current Security+ landing page (V7 available; V8 announced).",
      },
      {
        title: "SY0-701 Exam Objectives PDF (includes Acronym List)",
        url: "https://comptiacdn.azureedge.net/webcontent/docs/default-source/exam-objectives/comptia-security-sy0-701-exam-objectives-%286-0%29.pdf",
        note: "Primary study map. Near the end: full official SY0-701 Acronym List (300+).",
      },
      {
        title: "CompTIA Performance-Based Questions explained",
        url: "https://www.comptia.org/en/resources/test-policies/exam-development/performance-based-questions-explained/",
        note: "How simulation vs virtual PBQs behave (skip/save rules).",
      },
    ],
  },
  {
    id: "delivery",
    title: "Testing delivery (Pearson VUE)",
    items: [
      {
        title: "Pearson VUE — CompTIA",
        url: "https://home.pearsonvue.com/comptia",
        note: "Schedule, test center / OnVUE options.",
      },
      {
        title: "OnVUE online proctoring overview",
        url: "https://home.pearsonvue.com/Test-takers/OnVUE-online-proctoring.aspx",
        note: "Environment and ID expectations for remote exams.",
      },
    ],
  },
  {
    id: "ethics",
    title: "Integrity & legal study",
    items: [
      {
        title: "CompTIA Candidate Agreement (overview via CompTIA)",
        url: "https://www.comptia.org/en/resources/test-policies/",
        note: "No braindumps. Violations can void certifications.",
      },
    ],
  },
  {
    id: "concepts",
    title: "Concept references (public)",
    items: [
      {
        title: "NIST SP 800-61 — Incident handling (public)",
        url: "https://csrc.nist.gov/pubs/sp/800/61/r2/final",
        note: "IR lifecycle language that maps well to Domain 4.",
      },
      {
        title: "NIST Cybersecurity Framework",
        url: "https://www.nist.gov/cyberframework",
        note: "Helpful governance / function vocabulary.",
      },
      {
        title: "OWASP Top 10",
        url: "https://owasp.org/www-project-top-ten/",
        note: "Web app risk categories (injection, XSS, etc.).",
      },
    ],
  },
];
