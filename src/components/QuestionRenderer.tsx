"use client";

import type { Question, ResponseValue } from "@/lib/types";
import { McqItem } from "./McqItem";
import { PbqMatch } from "./PbqMatch";
import { PbqFirewall } from "./PbqFirewall";
import { PbqLogTriage } from "./PbqLogTriage";
import { PbqSequence } from "./PbqSequence";
import { PbqTopology } from "./PbqTopology";

export function QuestionRenderer({
  question,
  value,
  onChange,
  hideScenario = false,
}: {
  question: Question;
  value: ResponseValue | undefined;
  onChange: (v: ResponseValue) => void;
  hideScenario?: boolean;
}) {
  switch (question.type) {
    case "mcq_single":
    case "mcq_multi":
      return (
        <McqItem
          question={question}
          value={value}
          onChange={(v) => onChange(v)}
        />
      );
    case "pbq_match":
      return (
        <PbqMatch
          question={question}
          value={value}
          onChange={(v) => onChange(v)}
          hideScenario={hideScenario}
        />
      );
    case "pbq_firewall":
      return (
        <PbqFirewall
          question={question}
          value={value}
          onChange={(v) => onChange(v)}
          hideScenario={hideScenario}
        />
      );
    case "pbq_log_triage":
      return (
        <PbqLogTriage
          question={question}
          value={value}
          onChange={(v) => onChange(v)}
          hideScenario={hideScenario}
        />
      );
    case "pbq_sequence":
      return (
        <PbqSequence
          question={question}
          value={value}
          onChange={(v) => onChange(v)}
          hideScenario={hideScenario}
        />
      );
    case "pbq_topology":
      return (
        <PbqTopology
          question={question}
          value={value}
          onChange={(v) => onChange(v)}
          hideScenario={hideScenario}
        />
      );
    default:
      return <p>Unsupported item type.</p>;
  }
}
