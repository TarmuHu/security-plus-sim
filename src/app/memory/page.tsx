"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Suspense,
  useEffect,
  useMemo,
  useState,
  type CSSProperties,
} from "react";
import { ProductHeader } from "@/components/ProductHeader";
import {
  DRILL_META,
  drillHref,
  drillKindForSection,
  termAnchorId,
} from "@/lib/drills";
import {
  MEMORY_FREQ_META,
  MEMORY_GROUPS,
  MEMORY_SECTIONS,
  OFFICIAL_MEMORY_LINKS,
  memoryTotals,
  sectionsInGroup,
  sortRowsByFreq,
  type MemoryFreq,
  type MemoryGroupId,
  type MemorySectionId,
} from "@/lib/memory-list";

type Filter =
  | { mode: "all" }
  | { mode: "group"; group: MemoryGroupId }
  | { mode: "section"; section: MemorySectionId };

const FREQ_STYLE: Record<MemoryFreq, { bg: string; fg: string; border: string }> =
  {
    must: { bg: "#fee2e2", fg: "#991b1b", border: "#ef4444" },
    often: { bg: "#dbeafe", fg: "#1e40af", border: "#3b82f6" },
    useful: { bg: "#dcfce7", fg: "#166534", border: "#22c55e" },
    bonus: { bg: "#f4f4f5", fg: "#3f3f46", border: "#a1a1aa" },
  };

const SECTION_IDS = new Set(MEMORY_SECTIONS.map((s) => s.id));
const GROUP_IDS = new Set(MEMORY_GROUPS.map((g) => g.id));

/** Resolve `#ports` or `#term-control-types-firewall-acl` to a section id. */
function sectionIdFromHash(hash: string): MemorySectionId | null {
  if (SECTION_IDS.has(hash as MemorySectionId)) {
    return hash as MemorySectionId;
  }
  if (!hash.startsWith("term-")) return null;
  const rest = hash.slice("term-".length);
  let best: MemorySectionId | null = null;
  for (const id of SECTION_IDS) {
    if (rest === id || rest.startsWith(`${id}-`)) {
      if (!best || id.length > best.length) best = id;
    }
  }
  return best;
}

function MemoryListInner() {
  const totals = memoryTotals();
  const searchParams = useSearchParams();
  const [filter, setFilter] = useState<Filter>({ mode: "all" });
  const [freqFilter, setFreqFilter] = useState<MemoryFreq | "all">("all");
  const [sortByFreq, setSortByFreq] = useState(true);
  const [q, setQ] = useState("");
  const [highlightTerm, setHighlightTerm] = useState<string | null>(null);
  /** Section ids that are collapsed (absent / false = expanded). */
  const [collapsed, setCollapsed] = useState<
    Partial<Record<MemorySectionId, boolean>>
  >({});

  function expandSection(id: MemorySectionId) {
    setCollapsed((c) => (c[id] ? { ...c, [id]: false } : c));
  }

  function toggleSection(id: MemorySectionId) {
    setCollapsed((c) => ({ ...c, [id]: !c[id] }));
  }

  // Deep links: ?section=symmetric&q=AES  or  ?group=crypto
  useEffect(() => {
    const section = searchParams.get("section");
    const group = searchParams.get("group");
    const query = searchParams.get("q");
    // Legacy deep link from before type/function split
    const resolvedSection =
      section === "controls" ? "control-types" : section;
    if (
      resolvedSection &&
      SECTION_IDS.has(resolvedSection as MemorySectionId)
    ) {
      const id = resolvedSection as MemorySectionId;
      setFilter({ mode: "section", section: id });
      expandSection(id);
    } else if (group && GROUP_IDS.has(group as MemoryGroupId)) {
      setFilter({ mode: "group", group: group as MemoryGroupId });
    }
    if (query) {
      setQ(query);
      setHighlightTerm(query);
    }
  }, [searchParams]);

  useEffect(() => {
    const hash = window.location.hash.replace(/^#/, "");
    if (!hash) return;
    const sectionFromHash = sectionIdFromHash(hash);
    if (sectionFromHash) expandSection(sectionFromHash);
    const t = window.setTimeout(() => {
      document.getElementById(hash)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 80);
    return () => window.clearTimeout(t);
  }, [filter, q, searchParams]);

  // Searching should reveal matches — don't leave sections collapsed.
  useEffect(() => {
    if (q.trim()) setCollapsed({});
  }, [q]);

  const sections = useMemo(() => {
    let base = MEMORY_SECTIONS;
    if (filter.mode === "group") {
      base = sectionsInGroup(filter.group);
    } else if (filter.mode === "section") {
      base = MEMORY_SECTIONS.filter((s) => s.id === filter.section);
    }
    const needle = q.trim().toLowerCase();
    return base
      .map((s) => {
        let rows = s.rows;
        if (freqFilter !== "all") {
          rows = rows.filter((r) => r.freq === freqFilter);
        }
        if (needle) {
          rows = rows.filter(
            (r) =>
              r.term.toLowerCase().includes(needle) ||
              r.value.toLowerCase().includes(needle) ||
              (r.note?.toLowerCase().includes(needle) ?? false)
          );
        }
        if (sortByFreq) rows = sortRowsByFreq(rows);
        return { ...s, rows };
      })
      .filter((s) => s.rows.length > 0);
  }, [filter, freqFilter, q, sortByFreq]);

  const activeGroup: MemoryGroupId | "all" =
    filter.mode === "all"
      ? "all"
      : filter.mode === "group"
        ? filter.group
        : MEMORY_SECTIONS.find((s) => s.id === filter.section)?.group ?? "all";

  const sectionChips =
    activeGroup === "all" ? MEMORY_SECTIONS : sectionsInGroup(activeGroup);

  const allSectionsExpanded =
    sections.length > 1 && sections.every((s) => !collapsed[s.id]);
  const allSectionsCollapsed =
    sections.length > 1 && sections.every((s) => !!collapsed[s.id]);
  const showExpandAll = sections.length > 1 && !allSectionsExpanded;
  const showCollapseAll = sections.length > 1 && !allSectionsCollapsed;

  return (
    <div className="lobby-shell min-h-screen">
      <ProductHeader
        backHref="/certs/security-plus"
        backLabel="← Security+ products"
        activeCertId="security-plus"
        eyebrow="Reference"
        title="Memory List"
        subtitle={`${totals.total} items with exam-frequency tags (practice estimate — not official CompTIA stats).`}
        background="linear-gradient(135deg, #134e4a 0%, #0f766e 55%, #14b8a6 100%)"
      />

      <main className="mx-auto max-w-5xl px-6 py-8 space-y-6">
        <section className="panel p-4 space-y-3">
          <h2 className="text-base font-semibold m-0">Official CompTIA lists</h2>
          <p className="text-sm m-0" style={{ color: "var(--muted)" }}>
            This site is a curated, topic-split study list. CompTIA’s official
            acronym appendix is larger (~312 unique / ~319 rows) — use the PDF
            as the source of truth for full coverage.
          </p>
          <ul className="m-0 pl-5 space-y-2 text-sm">
            {OFFICIAL_MEMORY_LINKS.map((link) => (
              <li key={link.url}>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#1e40af", fontWeight: 600 }}
                >
                  {link.title} ↗
                </a>
                <span style={{ color: "var(--muted)" }}> — {link.note}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="panel p-4 space-y-3">
          <div className="flex flex-wrap items-end gap-3">
            <label className="flex-1 min-w-[200px] text-sm">
              <span className="block mb-1" style={{ color: "var(--muted)" }}>
                Search
              </span>
              <input
                className="w-full px-3 py-2 border bg-white"
                style={{ borderColor: "var(--line)" }}
                placeholder="e.g. AES, LDAPS, DMARC…"
                value={q}
                onChange={(e) => {
                  setQ(e.target.value);
                  setHighlightTerm(null);
                }}
              />
            </label>
            <label className="text-sm flex items-center gap-2 pb-2">
              <input
                type="checkbox"
                checked={sortByFreq}
                onChange={(e) => setSortByFreq(e.target.checked)}
              />
              Sort Must → Bonus
            </label>
            <Link href="/drills" className="btn btn-primary">
              Flash drills
            </Link>
          </div>
          <p className="text-xs m-0" style={{ color: "var(--muted)" }}>
            Frequency: Must {totals.byFreq.must} · Often {totals.byFreq.often} ·
            Useful {totals.byFreq.useful} · Bonus {totals.byFreq.bonus}
          </p>
        </section>

        <div>
          <p
            className="text-xs uppercase tracking-wide mb-2"
            style={{ color: "var(--muted)" }}
          >
            Frequency
          </p>
          <div className="flex flex-wrap gap-2">
            <FilterChip
              label="All freqs"
              on={freqFilter === "all"}
              onClick={() => setFreqFilter("all")}
            />
            {(Object.keys(MEMORY_FREQ_META) as MemoryFreq[]).map((f) => (
              <FilterChip
                key={f}
                label={`${MEMORY_FREQ_META[f].label} (${totals.byFreq[f]})`}
                on={freqFilter === f}
                onClick={() => setFreqFilter(f)}
                style={
                  freqFilter === f
                    ? {
                        background: FREQ_STYLE[f].bg,
                        color: FREQ_STYLE[f].fg,
                        borderColor: FREQ_STYLE[f].border,
                        borderWidth: 2,
                      }
                    : undefined
                }
              />
            ))}
          </div>
        </div>

        <div>
          <p
            className="text-xs uppercase tracking-wide mb-2"
            style={{ color: "var(--muted)" }}
          >
            Category
          </p>
          <div className="flex flex-wrap gap-2">
            <FilterChip
              label={`All (${totals.total})`}
              on={filter.mode === "all"}
              onClick={() => setFilter({ mode: "all" })}
            />
            {MEMORY_GROUPS.map((g) => (
              <FilterChip
                key={g.id}
                label={`${g.title} (${totals.byGroup[g.id]})`}
                on={activeGroup === g.id && filter.mode !== "all"}
                onClick={() => setFilter({ mode: "group", group: g.id })}
              />
            ))}
          </div>
        </div>

        <div>
          <p
            className="text-xs uppercase tracking-wide mb-2"
            style={{ color: "var(--muted)" }}
          >
            Topic
          </p>
          <div className="flex flex-wrap gap-2">
            {activeGroup !== "all" && (
              <FilterChip
                label="All in category"
                on={filter.mode === "group"}
                onClick={() =>
                  setFilter({ mode: "group", group: activeGroup })
                }
              />
            )}
            {sectionChips.map((s) => (
              <FilterChip
                key={s.id}
                label={`${s.title} (${s.rows.length})`}
                on={filter.mode === "section" && filter.section === s.id}
                onClick={() => {
                  setFilter({ mode: "section", section: s.id });
                  expandSection(s.id);
                }}
              />
            ))}
          </div>
        </div>

        {sections.length === 0 ? (
          <p className="panel p-6 text-sm" style={{ color: "var(--muted)" }}>
            No matches. Clear a filter or shorten the search.
          </p>
        ) : (
          <div className="space-y-4">
            {(showExpandAll || showCollapseAll) && (
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm font-semibold">
                {showExpandAll && (
                  <button
                    type="button"
                    className="bg-transparent border-0 p-0 cursor-pointer hover:underline"
                    style={{ color: "#0f766e" }}
                    onClick={() => setCollapsed({})}
                  >
                    Expand all
                  </button>
                )}
                {showExpandAll && showCollapseAll && (
                  <span style={{ color: "var(--line)" }} aria-hidden>
                    |
                  </span>
                )}
                {showCollapseAll && (
                  <button
                    type="button"
                    className="bg-transparent border-0 p-0 cursor-pointer hover:underline"
                    style={{ color: "#0f766e" }}
                    onClick={() =>
                      setCollapsed(
                        Object.fromEntries(
                          sections.map((s) => [s.id, true])
                        ) as Partial<Record<MemorySectionId, boolean>>
                      )
                    }
                  >
                    Collapse all
                  </button>
                )}
              </div>
            )}
            {sections.map((section) => {
              const drillKind = drillKindForSection(section.id);
              const isCollapsed = !!collapsed[section.id];
              return (
                <section
                  key={section.id}
                  id={section.id}
                  className="panel overflow-hidden scroll-mt-4"
                >
                  <div
                    className="px-4 py-3 flex flex-wrap items-start justify-between gap-3"
                    style={{
                      borderColor: "var(--line)",
                      background: "#f7f3ea",
                      borderBottom: isCollapsed
                        ? undefined
                        : "1px solid var(--line)",
                    }}
                  >
                    <button
                      type="button"
                      className="flex-1 min-w-[200px] text-left bg-transparent border-0 p-0 cursor-pointer"
                      onClick={() => toggleSection(section.id)}
                      aria-expanded={!isCollapsed}
                      aria-controls={`section-body-${section.id}`}
                    >
                      <p
                        className="text-xs uppercase tracking-wide m-0 mb-1"
                        style={{ color: "#0f766e" }}
                      >
                        {MEMORY_GROUPS.find((g) => g.id === section.group)
                          ?.title}
                      </p>
                      <h2 className="text-lg font-semibold m-0 flex items-center gap-2">
                        <span
                          className="inline-block text-sm font-normal tabular-nums w-4"
                          style={{ color: "var(--muted)" }}
                          aria-hidden
                        >
                          {isCollapsed ? "▸" : "▾"}
                        </span>
                        {section.title}
                      </h2>
                      <p
                        className="text-sm m-0 mt-1 pl-6"
                        style={{ color: "var(--muted)" }}
                      >
                        {section.blurb}
                      </p>
                    </button>
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <span
                        className="text-sm tabular-nums"
                        style={{ color: "var(--muted)" }}
                      >
                        {section.rows.length} shown
                      </span>
                      {drillKind && (
                        <Link
                          href={drillHref(drillKind)}
                          className="btn text-sm"
                          title={`Flash: ${DRILL_META[drillKind].title}`}
                        >
                          Flash this topic →
                        </Link>
                      )}
                    </div>
                  </div>
                  {!isCollapsed && (
                    <div
                      id={`section-body-${section.id}`}
                      className="overflow-x-auto"
                    >
                      <table className="w-full text-sm">
                        <thead>
                          <tr
                            className="text-left"
                            style={{
                              background: "#faf8f3",
                              color: "var(--muted)",
                            }}
                          >
                            <th className="px-4 py-2 font-medium w-[12%]">
                              Freq
                            </th>
                            <th className="px-4 py-2 font-medium w-[22%]">
                              Term
                            </th>
                            <th className="px-4 py-2 font-medium w-[38%]">
                              Remember
                            </th>
                            <th className="px-4 py-2 font-medium">Note</th>
                          </tr>
                        </thead>
                        <tbody>
                          {section.rows.map((r) => {
                            const lit =
                              !!highlightTerm &&
                              r.term
                                .toLowerCase()
                                .includes(highlightTerm.toLowerCase());
                            return (
                              <tr
                                key={`${section.id}-${r.term}`}
                                id={termAnchorId(section.id, r.term)}
                                className="border-t align-top scroll-mt-4"
                                style={{
                                  borderColor: "var(--line)",
                                  background: lit ? "#ecfdf5" : undefined,
                                }}
                              >
                                <td className="px-4 py-2.5">
                                  <FreqBadge freq={r.freq} />
                                </td>
                                <td className="px-4 py-2.5 font-medium">
                                  {r.term}
                                </td>
                                <td className="px-4 py-2.5">{r.value}</td>
                                <td
                                  className="px-4 py-2.5"
                                  style={{ color: "var(--muted)" }}
                                >
                                  {r.note ?? "—"}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </section>
              );
            })}
          </div>
        )}

        <p className="text-xs" style={{ color: "var(--muted)" }}>
          Frequency tags are a study heuristic from public SY0-701 patterns — not
          CompTIA official weights. Prefer Must → Often before Bonus.
        </p>
      </main>
    </div>
  );
}

export default function MemoryListPage() {
  return (
    <Suspense
      fallback={
        <div className="lobby-shell p-8 text-sm" style={{ color: "var(--muted)" }}>
          Loading memory list…
        </div>
      }
    >
      <MemoryListInner />
    </Suspense>
  );
}

function FreqBadge({ freq }: { freq: MemoryFreq }) {
  const meta = MEMORY_FREQ_META[freq];
  const style = FREQ_STYLE[freq];
  return (
    <span
      className="inline-block text-xs font-semibold px-2 py-0.5"
      style={{
        background: style.bg,
        color: style.fg,
        border: `1px solid ${style.border}`,
      }}
      title={meta.blurb}
    >
      {meta.short}
    </span>
  );
}

function FilterChip({
  label,
  on,
  onClick,
  style,
}: {
  label: string;
  on: boolean;
  onClick: () => void;
  style?: CSSProperties;
}) {
  return (
    <button
      type="button"
      className="btn text-sm"
      onClick={onClick}
      style={
        style ??
        (on
          ? { background: "#0f766e", color: "#fff", borderColor: "#0f766e" }
          : undefined)
      }
    >
      {label}
    </button>
  );
}
