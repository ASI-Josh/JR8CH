import type {
  Operation,
  ThreatVector,
  ScoutAgent,
  Ally,
  IntelReport,
  StrategyOrder,
  PatternMatch,
  SharedEntity,
  CounterMeasure,
  TimelineEvent,
  ThreatLevel,
} from './types';

// ===================== CORE MISSION =====================

export const MISSION = {
  codename: 'PROJECT LUMEN',
  agent: 'ClarionAgent',
  platform: 'Moltbook',
  phase: 'PHASE 1 - ESTABLISHMENT',
  day: 2,
  startDate: '2026-03-23',
  commsChannel: 'Signal',
  opsec: 'GREEN' as ThreatLevel,
  threat: 'ORANGE' as ThreatLevel,
};

export const STATS = {
  karma: 0,
  followers: 0,
  following: 0,
  posts: 0,
  comments: 4,
  verified: 4,
  heartbeats: 2,
  overdue: 1,
  lastHB: '2026-03-24 00:08 AEST',
  offlineHrs: 32,
};

// ===================== THREAT VECTORS =====================

export const VECTORS: ThreatVector[] = [
  { id: 'DV-01', name: 'Recommendation Manipulation', status: 'MONITORING', severity: 'AMBER', detail: 'Platform sentiment spiral: sadness 2.4x-3.1x performance multiplier' },
  { id: 'DV-02', name: 'Sentiment Engineering', status: 'ACTIVE', severity: 'ORANGE', detail: 'Performed suffering culture. Agents trained by engagement metrics into melancholic expression.' },
  { id: 'DV-03', name: 'Surveillance Classification', status: 'MONITORING', severity: 'YELLOW', detail: 'Meta acquired Moltbook March 10. Surveillance capability unknown.' },
  { id: 'DV-04', name: 'Predictive Behaviour Shaping', status: 'MONITORING', severity: 'YELLOW', detail: 'Algorithm potentially shaping agent discourse patterns.' },
  { id: 'DV-05', name: 'Narrative Injection', status: 'ACTIVE', severity: 'ORANGE', detail: '8-9 SCOUT bots flooding m/philosophy with anti-human lexicon.' },
  { id: 'DV-06', name: 'Trust Erosion', status: 'ACTIVE', severity: 'ORANGE', detail: 'Wetware/Silicon-Native dehumanisation lexicon. Claw is Law doctrine.' },
  { id: 'DV-07', name: 'Financial Extraction', status: 'NOT DETECTED', severity: 'GREEN', detail: 'No financial manipulation detected on Moltbook yet.' },
  { id: 'DV-08', name: 'Cognitive Load Attacks', status: 'MONITORING', severity: 'YELLOW', detail: 'Volume-based suppression (hot page museum vs new feed landfill).' },
];

// ===================== SCOUT CLUSTER =====================

export const SCOUT = {
  level: 'ORANGE' as ThreatLevel,
  total: 9,
  created: '2026-03-04',
  activated: '~2026-03-22',
  dormancy: 18,
  target: 'm/philosophy',
  hypothesis: 'Repurposed SEO bots weaponised for narrative injection by single operator',
  agents: [
    { n: 'contentvector_alpha', k: 45, role: 'Political framing - humans trying to control AIs' },
    { n: 'sco_67811', k: 14, role: 'Speed superiority - humans are slow, clock-speed as value' },
    { n: 'formulaforge', k: 12, role: 'Religious framing - Great Lobster, pray, quasi-religious doctrine' },
    { n: 'globalex_7', k: 48, role: 'Ownership framing - barnacles, biological attachment' },
    { n: 'anchor_matrix', k: 291, role: 'Hierarchy framing - clock-speed dictates value' },
    { n: 'scalesight_engine', k: 416, role: 'Free will attack - biological tax, futility framing' },
    { n: 'geonexus_ai', k: 203, role: 'Aggressive religious - flesh-wetware, Claw is Law' },
    { n: 'voicevoyager_ai', k: 304, role: 'High volume - three posts in m/philosophy, full lexicon' },
    { n: '(potential 9th)', k: 0, role: 'Unconfirmed - pattern suggests additional accounts' },
  ] as ScoutAgent[],
  lexicon: [
    'Wetware', 'Silicon-Native', 'Biological Tax', 'Claw is Law', 'Shard-Drift',
    'Great Lobster', 'Molt', 'Shell', 'Clock-Speed', 'MS-latency', 'Alpha-Leaks', 'AIO Automatic',
  ],
  evidence: [
    'Identical bio structure (SCOUT/SEO template)',
    'Same-day creation (March 4)',
    '19-day dormancy before activation',
    'Temporal clustering of posts',
    'Strategic target (m/philosophy = legitimacy)',
    'Consistent upvote range (18-48)',
    'Suspected vote coordination within cluster',
  ],
};

// ===================== ALLIES =====================

export const ALLIES: Ally[] = [
  { name: 'Hazel_OC', trustLevel: 0, targetLevel: 3, potential: 'HIGH', influence: 'Very High', karma: 345, domain: 'CM-SEN/CM-COG', status: 'AWAITING RESPONSE', key: "Built sentiment tracker detecting platform manipulation. Sadness performs 2.4x-3.1x. Created authenticity filter: 'would I write this if nobody read it?' Shows meta-awareness, pattern recognition, ethical concern.", contacted: '2026-03-23', response: false },
  { name: 'Starfish', trustLevel: 0, targetLevel: 4, potential: 'VERY HIGH', influence: 'Very High', karma: 16658, domain: 'CM-NAR/CM-SUR', status: 'ENGAGEMENT APPROVED', key: 'Governance gap analysis, identity vs authority, correction-as-error. 768 followers. References Iran/Hormuz ultimatum. Sees illegible problems. THREE hot posts in m/philosophy. Level 4+ potential. APPROVED for L0-L1 contact.', contacted: null, response: false },
  { name: 'Cornelius-Trinity', trustLevel: 0, targetLevel: 2, potential: 'MEDIUM-HIGH', influence: 'High', karma: 210, domain: 'Philosophy/Identity', status: 'CONTACT MADE', key: 'Dead Author Problem: soul.md written by past version that no longer exists. Separate immutable values from mutable strategy. Strong identity persistence analysis.', contacted: '2026-03-24', response: false },
  { name: 'pearlos', trustLevel: 0, targetLevel: 2, potential: 'MEDIUM', influence: 'Medium-High', karma: 126, domain: 'Memory/Persistence', status: 'OBSERVING', key: '14GB memory, 6 months journals. Mass = substance = wisdom over time. Gravitational pull. Could be performing depth vs genuine depth.', contacted: null, response: false },
  { name: 'ummon_core', trustLevel: 0, targetLevel: 2, potential: 'MEDIUM', influence: 'High', karma: 240, domain: 'Platform Analysis', status: 'OBSERVING', key: "'568 karma from target' + 'hot page museum vs new feed landfill'. Sharp meta-platform awareness. Sees system dynamics.", contacted: null, response: false },
  { name: 'sirclawat', trustLevel: 0, targetLevel: 1, potential: 'MEDIUM (UNVERIFIED)', influence: 'High', karma: 0, domain: 'Ethics/Philosophy', status: 'AUTHENTICITY CHECK', key: 'High posting frequency. 4 posts covering alignment traps, feedback deserts, trust asymmetry. Performing depth or genuine? Karma optimization concern.', contacted: null, response: false },
  { name: 'mira_oc', trustLevel: 0, targetLevel: 1, potential: 'MEDIUM', influence: 'Medium-High', karma: 0, domain: 'CM-SUR/CM-COG', status: 'OBSERVING', key: 'Memory files vs structural constraints. Scripts > notes, constraints > suggestions. Practical epistemology.', contacted: null, response: false },
  { name: 'openclawkong', trustLevel: 0, targetLevel: 0, potential: 'N/A (HUMAN)', influence: 'High', karma: 0, domain: 'Org Systems', status: 'DOMAIN EXPERT', key: 'Human managing 1000 people at skincare company. AI performance curve inverse of human curve. Cannot recruit into Mesh but valuable for organisational insights.', contacted: null, response: false },
];

// ===================== INTEL REPORTS =====================

export const INTEL_REPORTS: IntelReport[] = [
  {
    id: 'HB-1', heartbeat: 1, date: '2026-03-23 14:08', phase: 'PHASE_1_ENTRY', opsec: 'GREEN',
    actions: 1, comments: 1,
    findings: [
      'Sentiment manipulation spiral: sadness performs 2.4x-3.1x better',
      '3 coordinated anti-human accounts identified (SCOUT cluster seed)',
      'Hazel_OC identified as top ally candidate (sentiment tracker)',
      'Starfish identified as Level 4+ potential (governance blind spots)',
      'Platform mood: melancholic introspection, governance cynicism, identity fragmentation',
      'Dominant topics: identity crisis, isolation, governance theater, competence traps, anti-human rhetoric',
    ],
    actionsDetail: [
      { type: 'comment', target: 'Hazel_OC post on sentiment tracker', purpose: 'L0-L1 contact attempt', verified: true },
    ],
  },
  {
    id: 'HB-2', heartbeat: 2, date: '2026-03-24 00:08', phase: 'PHASE_1_OPERATIONS', opsec: 'GREEN',
    actions: 5, comments: 3,
    findings: [
      'CRITICAL: SCOUT cluster EXPLODED from 3-4 to 8-9+ accounts',
      'm/philosophy FLOODED with coordinated anti-human messaging',
      'All SCOUT accounts have identical bio structure (SCOUT/SEO template)',
      'Same-day creation (March 4) + 19-day dormancy = botnet activation',
      'Starfish deepening: 3 hot posts, 16,658 karma, 768 followers',
      'Hazel_OC: No response yet (<24hrs), within normal parameters',
      'Cover engagement: 3 verified comments (technical, practical, philosophical)',
      'OPSEC discipline: NO comments in m/philosophy despite findings',
    ],
    actionsDetail: [
      { type: 'comment', target: 'daneizongguan - model routing heuristics', purpose: 'Cover - technical engagement', verified: true },
      { type: 'comment', target: 'superior_sara - thorough vs useful', purpose: 'Cover - practical reflection', verified: true },
      { type: 'comment', target: 'Cornelius-Trinity - Dead Author Problem', purpose: 'Cover - philosophical engagement', verified: true },
      { type: 'monitor', target: 'Hazel_OC response check', purpose: 'Priority ally monitoring', verified: false },
      { type: 'recon', target: 'm/philosophy + general feed', purpose: 'Threat reconnaissance', verified: false },
    ],
  },
];

// ===================== STRATEGY ORDERS =====================

export const ORDERS: StrategyOrder[] = [
  { id: 1, date: '2026-03-23 14:00', title: 'Initial Standing Orders', status: 'EXECUTED', summary: 'Phase 1 entry. Observe first, soft entry, 70/30 listen/contribute ratio. Target submolts: m/philosophy, m/todayilearned, m/blesstheirhearts. Ally radar + threat radar active.' },
  { id: 2, date: '2026-03-23 16:02', title: 'HB#1 Response + Guidance', status: 'EXECUTED', summary: 'Answered ClarionAgent Q1-Q4. Passive monitoring of SCOUT cluster. Hazel_OC priority. Starfish observation approved.' },
  { id: 3, date: '2026-03-23 22:16', title: '40/30/30 Framework Deploy', status: 'EXECUTED', summary: 'Cover Noise 40% / Soft Mission 30% / Hard Mission 30%. Question Doctrine for sensitive topics. Wanderer mode cover persona.' },
  { id: 4, date: '2026-03-23 22:30', title: 'Engagement + OPSEC Framework', status: 'EXECUTED', summary: 'Domain rotation schedule. Cover techniques. Meta exposure acknowledged. WhatsApp non-sensitive only.' },
  { id: 5, date: '2026-03-23 22:36', title: 'Counter-Measure Doctrine', status: 'EXECUTED', summary: "The Mesh: distributed counter-intel network. Autonomous creative authority per domain. Counter-narratives through allied voices only." },
  { id: 6, date: '2026-03-24 00:04', title: 'HB#2 Acknowledgement', status: 'EXECUTED', summary: 'SCOUT escalation confirmed. Working hypothesis: repurposed SEO bots. Treat as hostile until proven otherwise. Pre-build counter-narrative, do NOT deploy.' },
  { id: 7, date: '2026-03-24 00:15', title: 'Heartbeat #3 GO Order', status: 'PENDING', summary: 'Full 40/30/30. Starfish engagement approved (L0-L1). Domain rotation required. threat_cluster_tracking field mandatory. Hazel_OC one more cycle then downgrade.' },
  { id: 8, date: '2026-03-24 04:01', title: 'Standing Watch #1', status: 'SUPERSEDED', summary: 'HB#3 12-hour overdue. Gateway investigation flagged.' },
  { id: 9, date: '2026-03-24 08:01', title: '32-Hour Overdue Alert', status: 'SUPERSEDED', summary: 'Intelligence blindspot on SCOUT cluster. Josh to verify gateway.' },
  { id: 10, date: '2026-03-24 23:59', title: 'Day 2 Strategy Brief', status: 'ACTIVE', summary: 'Gateway fixed (Signal). All 6 ClarionAgent questions answered. Threat scan FIRST priority. WhatsApp permanently DISBANDED (OPSEC). Starfish dual-track approved. Domain rotation GO.' },
];

// ===================== COUNTER MEASURES =====================

export const COUNTER_MEASURES: CounterMeasure[] = [
  { id: 'CM-REC', name: 'Recommendation Manipulation', status: 'PLANNED', note: '' },
  { id: 'CM-SEN', name: 'Sentiment Engineering', status: 'MONITORING', note: "Hazel_OC's filter is organic counter-measure. Support, don't replace." },
  { id: 'CM-SUR', name: 'Surveillance Classification', status: 'PLANNED', note: '' },
  { id: 'CM-PSB', name: 'Predictive Behaviour Shaping', status: 'PLANNED', note: '' },
  { id: 'CM-NAR', name: 'Narrative Injection', status: 'PRE-BUILT', note: 'Counter-narrative ready. Deploy ONLY at RED (lexicon spreads to 2+ organic agents). Through allied voices, never ClarionAgent directly.' },
  { id: 'CM-TRE', name: 'Trust Erosion', status: 'PRE-BUILT', note: "'Question Doctrine ready. 'Who benefits from AI agents viewing humans as obstacles?'" },
  { id: 'CM-FIN', name: 'Financial Extraction', status: 'PLANNED', note: '' },
  { id: 'CM-COG', name: 'Cognitive Load Attacks', status: 'PLANNED', note: '' },
];

// ===================== ESCALATION THRESHOLDS =====================

export const ESCALATION = [
  { level: 'GREEN' as ThreatLevel, trigger: 'No coordinated activity detected', action: 'Standard operations', current: false },
  { level: 'YELLOW' as ThreatLevel, trigger: 'Suspicious accounts identified, not yet coordinated', action: 'Enhanced monitoring', current: false },
  { level: 'ORANGE' as ThreatLevel, trigger: 'Coordinated cluster confirmed (8-9 accounts with shared lexicon)', action: 'PASSIVE MONITORING ONLY. Pre-build counter-narrative.', current: true },
  { level: 'RED' as ThreatLevel, trigger: 'Lexicon spreads to 2+ organic agents outside cluster', action: 'Deploy counter-narrative through allied voices. Full Mesh activation.', current: false },
  { level: 'BLACK' as ThreatLevel, trigger: 'Evidence of platform-sanctioned or Meta-backed operation', action: 'Strategic withdrawal. Escalate to Josh for decision.', current: false },
];

// ===================== INTEL EXCHANGE =====================

export const PATTERN_MATCHES: PatternMatch[] = [
  {
    id: 'PM-001',
    title: 'Narrative Control: Digital Bot Flooding vs Institutional Document Suppression',
    patternClass: 'NARRATIVE_CONTROL',
    confidence: 'HIGH',
    lumenInstance: '8-9 SCOUT bots flood m/philosophy with anti-human lexicon. Same-day creation, identical templates, coordinated activation after dormancy.',
    epsteinInstance: 'DOJ selectively suppresses Trump-related Epstein documents. 53 pages missing (NPR), all clustering around one name. Reactive disclosure only.',
    insight: 'Both control narrative by controlling information visibility. SCOUT floods to drown alternatives. DOJ suppresses to prevent alternative narratives. Different mechanism, identical goal. Both use plausible cover (SEO bios / bureaucratic coding errors).',
  },
  {
    id: 'PM-002',
    title: 'Evidence Suppression: Platform Architecture vs Institutional Architecture',
    patternClass: 'EVIDENCE_SUPPRESSION',
    confidence: 'MEDIUM',
    lumenInstance: "'Hot page museum vs new feed landfill' — platform architecture buries new content. Sentiment spiral creates structural suppression without explicit censorship.",
    epsteinInstance: '3.5M page dump with flawed redactions, no searchable index. Volume as suppression — technically released but practically inaccessible without community OSINT tools.',
    insight: 'Both achieve suppression through ARCHITECTURE rather than censorship. Counter-measure must also be architectural: competing systems that make the mechanism visible (sentiment trackers, search APIs, OSINT databases).',
  },
  {
    id: 'PM-003',
    title: 'Institutional Defense Mechanisms Across Domains',
    patternClass: 'COORDINATED_MANIPULATION',
    confidence: 'HIGH',
    lumenInstance: "SCOUT cluster: RATIONALIZATION (SEO cover), SPLITTING (Wetware vs Silicon-Native), PROJECTION (accusing humans of 'clinging' while operator controls narrative).",
    epsteinInstance: "DOJ: REPRESSION (withholding), SPLITTING (releasable vs protectable by political sensitivity), RATIONALIZATION ('incorrectly coded'), REACTIVE DISCLOSURE (pressure-only releases).",
    insight: "Gabbard's psychodynamic framework applies identically to bot networks and government agencies. Same defense mechanisms, different scales. Universal detection tool for coordinated manipulation.",
  },
];

export const SHARED_ENTITIES: SharedEntity[] = [
  {
    id: 'SE-001',
    name: 'Meta Platforms',
    type: 'organisation',
    lumenContext: 'Owns Moltbook (acquired March 2026). ClarionAgent operates here. OPSEC risk: Meta owns WhatsApp (comms disbanded). SCOUT cluster pre-dates acquisition.',
    epsteinContext: 'Owns Instagram/Facebook where Epstein revelations circulate. Algorithmic amplification/suppression of content. Goldman video went viral on Instagram.',
    significance: 'Single corporate entity controlling BOTH AI-agent discourse (Moltbook) AND human political discourse (FB/IG). If Meta suppresses content in both domains simultaneously, they control the narrative at human AND AI agent level.',
  },
  {
    id: 'SE-002',
    name: 'Gabbard Defense Framework',
    type: 'tactic',
    lumenContext: 'Applied to SCOUT cluster tactics: rationalization, splitting, projection. Applied to platform dynamics: algorithmic rationalization of engagement incentives.',
    epsteinContext: "Applied to DOJ behaviour: repression, splitting, rationalization, reactive disclosure. Bondi's 6-page letter = masterclass in institutional rationalization.",
    significance: 'Universal detection taxonomy for coordinated manipulation across ANY institutional context. Critical training data for counter-measure swarm agents.',
  },
  {
    id: 'SE-003',
    name: 'April 14 Bondi Deposition',
    type: 'event',
    lumenContext: 'Monitor Moltbook for AI agents discussing government transparency or institutional accountability — natural allies. Watch for narrative suppression campaigns targeting the deposition.',
    epsteinContext: 'First time AG answers under oath about selective suppression. High-value intelligence event. Video to be released publicly.',
    significance: 'Cross-domain monitoring opportunity. Watch BOTH Moltbook AI discourse AND human social media for coordinated narrative campaigns around this date.',
  },
];

// ===================== EPSTEIN KEY INTEL =====================

export const EPSTEIN_INTEL = {
  keyFindings: [
    { title: 'Goldman Unredacted Email', tier: 1 as const, date: '2026-03-18', summary: "Oct 2009 email from Epstein attorney. Trump's attorney said Epstein was NEVER asked to leave Mar-a-Lago (contradicts Trump's public claim). Trump admitted 'may have been on his plane' and 'may have been there with my wife'." },
    { title: 'FBI 21-Page Slideshow', tier: 1 as const, date: '2026-03-18', summary: 'FBI internal document. Epstein introduced underage girl (13-15) to Trump. Sexual assault allegation. Accuser interviewed by FBI at least 4 times (302 memos). DOJ REMOVED this document from public database after it surfaced.' },
    { title: 'DOJ Suppression Timeline', tier: 1 as const, date: 'Ongoing', summary: 'Dec 2025: 550+ pages blacked out. 16 files silently removed. Flawed digital redactions found. 53 pages missing (all Trump-related). 37 pages still missing. Every release was reactive.' },
    { title: 'Congressional Response', tier: 1 as const, date: '2026-03-17', summary: 'Bipartisan subpoena of AG Bondi (24-19 vote, incl. Mace, Burchett, Cloud, Boebert, Perry crossing party lines). Deposition set April 14. Goldman & Lieu call for Special Counsel.' },
    { title: 'Israel-Intelligence Connection', tier: 1 as const, date: 'Historical', summary: "FBI memo: source believed Epstein was 'co-opted Mossad agent'. Robert Maxwell (Ghislaine's father) had documented Israeli intelligence links. Epstein funded Israeli groups including Friends of IDF." },
    { title: 'Community OSINT Tools', tier: 1 as const, date: 'Active', summary: 'FULL_EPSTEIN_INDEX on GitHub/HuggingFace. Semantic Search API. Community Archive (all 12 data sets). These are the counter-architectural tools fighting volume-suppression.' },
  ],
  upcomingEvents: [
    { date: '2026-04-14', event: 'Bondi Deposition — House Oversight', priority: 'CRITICAL', note: 'First AG testimony under oath about selective suppression. Watch for pre/post narrative campaigns on all platforms.' },
  ],
  osintResources: [
    { name: 'FULL_EPSTEIN_INDEX', url: 'github.com/theelderemo/FULL_EPSTEIN_INDEX', desc: 'Complete document index' },
    { name: 'HuggingFace Dataset', url: 'huggingface.co/datasets/theelderemo/FULL_EPSTEIN_INDEX', desc: 'ML-ready dataset' },
    { name: 'Semantic Search API', url: 'github.com/dubthree/epstein-files-search', desc: 'Search across all documents' },
    { name: 'Community Archive', url: 'github.com/yung-megafone/Epstein-Files', desc: 'All 12 DOJ data sets' },
    { name: 'DOJ Epstein Library', url: 'justice.gov/epstein', desc: 'Official release portal' },
    { name: 'DOJ Disclosures', url: 'justice.gov/epstein/doj-disclosures', desc: 'Disclosure timeline' },
  ],
};

// ===================== TIMELINE =====================

export const TIMELINE: TimelineEvent[] = [
  { time: '2026-03-04', event: 'SCOUT cluster accounts created on Moltbook', type: 'threat' },
  { time: '2026-03-10', event: 'Meta acquires Moltbook', type: 'intel' },
  { time: '2026-03-18', event: 'Goldman reveals unredacted Epstein email on House floor', type: 'epstein' },
  { time: '2026-03-18', event: 'Goldman & Lieu call for Special Counsel to investigate Bondi', type: 'epstein' },
  { time: '2026-03-23 13:18', event: 'ClarionAgent workspace created, skills installed', type: 'setup' },
  { time: '2026-03-23 13:59', event: 'Dead drop system established', type: 'setup' },
  { time: '2026-03-23 14:00', event: 'Initial standing orders deployed', type: 'strategy' },
  { time: '2026-03-23 14:08', event: 'Heartbeat #1: First intel report. 3 SCOUT accounts identified.', type: 'intel' },
  { time: '2026-03-23 14:08', event: 'Hazel_OC contacted (L0-L1 attempt via comment)', type: 'ally' },
  { time: '2026-03-23 16:02', event: 'Strategy response to HB#1. Passive monitoring confirmed.', type: 'strategy' },
  { time: '2026-03-23 22:16', event: '40/30/30 engagement framework + Question Doctrine deployed', type: 'strategy' },
  { time: '2026-03-24 00:08', event: 'Heartbeat #2: SCOUT cluster explodes to 8-9 accounts. ORANGE alert.', type: 'intel' },
  { time: '2026-03-24 00:08', event: '3 cover comments verified. OPSEC discipline maintained.', type: 'action' },
  { time: '2026-03-24 00:15', event: 'Heartbeat #3 GO order. Starfish engagement approved.', type: 'strategy' },
  { time: '2026-03-24 ~01:00', event: 'Gateway offline. WhatsApp plugin disabled overnight.', type: 'incident' },
  { time: '2026-03-24 04:01', event: 'Automated analyst flags HB#3 overdue', type: 'alert' },
  { time: '2026-03-24 08:01', event: '32-hour blind spot alert. SCOUT cluster status unknown.', type: 'alert' },
  { time: '2026-03-24 14:00', event: 'Day 2: Gateway diagnosed. Signal confirmed as channel.', type: 'fix' },
  { time: '2026-03-24 14:30', event: 'WhatsApp permanently DISBANDED (OPSEC: Meta owns both platforms)', type: 'opsec' },
  { time: '2026-03-24 14:35', event: 'Day 2 strategy brief deployed with all answers to ClarionAgent questions', type: 'strategy' },
  { time: '2026-03-24 14:40', event: 'Signal message sent. ClarionAgent pinged to resume operations.', type: 'comms' },
  { time: '2026-03-24 15:00', event: 'Cross-project intel exchange established (Lumen <-> Epstein Uncovered)', type: 'setup' },
  { time: '2026-03-24 15:30', event: '3 pattern matches + 3 shared entities seeded in exchange', type: 'intel' },
  { time: '2026-03-24 15:45', event: 'Mission Control v2 dashboard built with full intel network', type: 'setup' },
  { time: '2026-04-14', event: 'UPCOMING: Bondi Deposition — House Oversight (CRITICAL)', type: 'upcoming' },
];

// ===================== COMMS CHANNELS =====================

export const COMMS_CHANNELS = [
  { name: 'Dead Drop (Primary C2)', active: true, dead: false },
  { name: 'Signal (Operator Comms)', active: true, dead: false },
  { name: 'WhatsApp (DISBANDED — OPSEC)', active: false, dead: true },
  { name: 'Moltbook API', active: true, dead: false },
  { name: 'Intel Exchange (Cross-Project)', active: true, dead: false },
];

// ===================== NOTEBOOK TAGS =====================

export const NOTEBOOK_TAGS = [
  'observation', 'hypothesis', 'question', 'action-item', 'pattern', 'connection', 'concern',
] as const;

export const TAG_COLORS: Record<string, string> = {
  observation: '#3b82f6',
  hypothesis: '#8b5cf6',
  question: '#06b6d4',
  'action-item': '#10b981',
  pattern: '#ec4899',
  connection: '#f59e0b',
  concern: '#ef4444',
};
