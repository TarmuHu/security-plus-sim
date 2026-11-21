export type DomainId = 1 | 2 | 3 | 4 | 5;

export type QuestionType =
  | "mcq_single"
  | "mcq_multi"
  | "pbq_match"
  | "pbq_firewall"
  | "pbq_log_triage"
  | "pbq_sequence"
  | "pbq_topology";

export type Difficulty = "easy" | "medium" | "hard";

export interface Choice {
  id: string;
  text: string;
}

export interface McqQuestion {
  id: string;
  type: "mcq_single" | "mcq_multi";
  domain: DomainId;
  objective: string;
  stem: string;
  choices: Choice[];
  /** Choice ids that are correct */
  answer: string[];
  explanation: string;
  difficulty: Difficulty;
}

export interface MatchPair {
  leftId: string;
  left: string;
  rightId: string;
  right: string;
}

export interface PbqMatchQuestion {
  id: string;
  type: "pbq_match";
  domain: DomainId;
  objective: string;
  stem: string;
  scenario: string;
  pairs: MatchPair[];
  /** distractor rights that do not match any left */
  distractors?: string[];
  explanation: string;
  difficulty: Difficulty;
}

export interface FirewallRule {
  action: "allow" | "deny";
  protocol: "tcp" | "udp" | "icmp" | "any";
  source: string;
  destination: string;
  port: string;
}

export interface PbqFirewallQuestion {
  id: string;
  type: "pbq_firewall";
  domain: DomainId;
  objective: string;
  stem: string;
  scenario: string;
  existingRules: FirewallRule[];
  /** Rules the candidate should end with (order-sensitive for first-match) */
  answer: FirewallRule[];
  explanation: string;
  difficulty: Difficulty;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  host: string;
  message: string;
}

export interface PbqLogTriageQuestion {
  id: string;
  type: "pbq_log_triage";
  domain: DomainId;
  objective: string;
  stem: string;
  scenario: string;
  logs: LogEntry[];
  /** Host names that are compromised / require action */
  answer: string[];
  explanation: string;
  difficulty: Difficulty;
}

export interface SequenceStep {
  id: string;
  text: string;
}

export interface PbqSequenceQuestion {
  id: string;
  type: "pbq_sequence";
  domain: DomainId;
  objective: string;
  stem: string;
  scenario: string;
  steps: SequenceStep[];
  /** Correct order of step ids */
  answer: string[];
  explanation: string;
  difficulty: Difficulty;
}

export interface TopologySlot {
  id: string;
  label: string;
  options: string[];
  answer: string;
}

export interface PbqTopologyQuestion {
  id: string;
  type: "pbq_topology";
  domain: DomainId;
  objective: string;
  stem: string;
  scenario: string;
  slots: TopologySlot[];
  explanation: string;
  difficulty: Difficulty;
}

export type Question =
  | McqQuestion
  | PbqMatchQuestion
  | PbqFirewallQuestion
  | PbqLogTriageQuestion
  | PbqSequenceQuestion
  | PbqTopologyQuestion;

export type ResponseValue =
  | string[]
  | Record<string, string>
  | FirewallRule[]
  | string
  | null;

export interface ExamBlueprint {
  id: string;
  title: string;
  mode: "full" | "drill";
  durationMs: number;
  itemCount: number;
  domainWeights: Record<DomainId, number>;
  passScaled: number;
  maxScaled: number;
  pbqCount: number;
  domainFilter?: DomainId;
}

export interface Attempt {
  id: string;
  blueprintId: string;
  questionIds: string[];
  responses: Record<string, ResponseValue>;
  flags: Record<string, boolean>;
  /** When true, show Check Answer + immediate explanation */
  practiceMode?: boolean;
  /** Items the user has already revealed feedback for (practice mode) */
  revealed?: Record<string, boolean>;
  currentIndex: number;
  startedAt: number;
  endsAt: number;
  finishedAt?: number;
  ndaAccepted: boolean;
  tutorialSeen: boolean;
}

export interface DomainScore {
  domain: DomainId;
  correct: number;
  total: number;
  percent: number;
}

export interface ScoreReport {
  attemptId: string;
  rawCorrect: number;
  rawTotal: number;
  scaledScore: number;
  /** 0–100 unweighted percent correct */
  rawPercent: number;
  /** Weighted points earned / possible (PBQs count more) */
  weightedEarned: number;
  weightedPossible: number;
  /** Short note describing the practice scoring model */
  scoringModel: string;
  passed: boolean;
  domainScores: DomainScore[];
  itemResults: {
    questionId: string;
    correct: boolean;
    /** 0–1 credit earned on this item (partial credit allowed) */
    credit: number;
    domain: DomainId;
    objective: string;
  }[];
}
