import { useCallback, useEffect, useMemo, useState, type KeyboardEvent, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Line,
  LineChart,
  Pie,
  PieChart,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  RadialBar,
  RadialBarChart,
  Legend,
  ReferenceArea,
  ReferenceLine,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from "recharts";
import * as Dialog from "@radix-ui/react-dialog";
import * as Tabs from "@radix-ui/react-tabs";
import {
  Bell,
  ChevronDown,
  ChevronRight,
  ChartColumn,
  CircleUser,
  Clock3,
  Download,
  FileText,
  Grid2X2,
  Home,
  Layers,
  Map,
  Menu,
  Search,
  Share2,
  Shield,
  Target,
  TrendingUp,
  Users,
  X,
} from "lucide-react";

type PageKey =
  | "dashboard"
  | "roadmap"
  | "okrs"
  | "initiatives"
  | "stakeholders"
  | "risks"
  | "kpis"
  | "tom"
  | "governance";

type Status = "Green" | "Amber" | "Red" | "Planned";

type Initiative = {
  id: string;
  name: string;
  theme: string;
  status: Status;
  owner: string;
  sponsor: string;
  manager: string;
  start: string;
  end: string;
  duration: string;
  priority: "High" | "Medium" | "Critical";
  approach: "Agile Programme" | "Waterfall Project" | "Pilot & Scale" | "Quick Win";
  health: number;
  progress: number;
  budgetPlanned: number;
  budgetActual: number;
  budgetForecast: number;
  problem: string;
  objectives: string[];
  assumptions: string[];
  milestones: {
    phase: string;
    planned: string;
    revised?: string;
    status: "Complete" | "In Progress" | "Upcoming" | "At Risk";
    owner: string;
    criteria: string[];
    note?: string;
  }[];
  team: { role: string; assignment: string; person: string }[];
  raci: { workstream: string; sponsor: string; owner: string; pm: string; steercos: string }[];
  linkedRiskIds: string[];
  linkedIssueIds: string[];
  logs: { date: string; author: string; category: "Status Update" | "Milestone" | "Budget" | "Risk" | "Scope" | "Decision"; text: string }[];
};

type RiskRecord = {
  id: string;
  title: string;
  category: string;
  rating: "Critical" | "High" | "Medium" | "Low";
  rag: "Red" | "Amber" | "Green";
  likelihood: number;
  impact: number;
  owner: string;
  due: string;
  description: string;
  mitigation: { action: string; owner: string; due: string; status: "Not Started" | "In Progress" | "Complete" }[];
  linkedInitiatives: string[];
  history: string[];
  matrix: { x: number; y: number };
};

type IssueRecord = {
  id: string;
  title: string;
  priority: "P1 Critical" | "P2 High" | "P3 Medium";
  raisedBy: string;
  raisedDate: string;
  assignedTo: string;
  status: "Open" | "In Progress" | "Escalated" | "Resolved";
  target: string;
  daysOpen: number;
  description: string;
  impact: string;
  steps: { action: string; owner: string; due: string; status: "Not Started" | "In Progress" | "Complete" }[];
  escalation: string[];
  linkedRiskIds: string[];
};

const colors = {
  navy: "#003366",
  navyDeep: "#001A3A",
  gold: "#C8922A",
  canvas: "#F4F6F9",
  card: "#FFFFFF",
  textPrimary: "#1A1A2E",
  textSecondary: "#6B7280",
  success: "#2D8653",
  warning: "#F5A623",
  danger: "#D0021B",
  accentLight: "#E8EFF8",
};

const statusColor: Record<Status, string> = {
  Green: colors.success,
  Amber: colors.warning,
  Red: colors.danger,
  Planned: "#94A3B8",
};

const themes = [
  "Racing & Wagering Excellence",
  "Digital & Technology Uplift",
  "People & Culture Evolution",
  "Finance & Operational Efficiency",
  "Responsible Gaming & Compliance",
];

const navItems: { key: PageKey; label: string; subtitle: string; icon: typeof Home }[] = [
  { key: "dashboard", label: "Dashboard", subtitle: "Executive Overview", icon: Home },
  { key: "roadmap", label: "Roadmap", subtitle: "Transformation Roadmap", icon: Map },
  { key: "okrs", label: "OKRs", subtitle: "OKR Command Centre", icon: Target },
  { key: "initiatives", label: "Initiatives", subtitle: "Initiative Portfolio", icon: Layers },
  { key: "stakeholders", label: "Stakeholders", subtitle: "Stakeholder Map", icon: Users },
  { key: "risks", label: "Risks", subtitle: "Risk & Issue Register", icon: Shield },
  { key: "kpis", label: "KPIs", subtitle: "Performance Monitor", icon: ChartColumn },
  { key: "tom", label: "TOM", subtitle: "Operating Model", icon: Grid2X2 },
  { key: "governance", label: "Governance", subtitle: "Programme Governance", icon: FileText },
];

const initiatives: Initiative[] = [
  {
    id: "I001",
    name: "Core Banking System Upgrade",
    theme: themes[1],
    status: "Amber",
    owner: "IT Lead",
    sponsor: "CTO",
    manager: "Senior IT PM",
    start: "01 Oct 2024",
    end: "30 Jun 2025",
    duration: "9 months",
    priority: "Critical",
    approach: "Waterfall Project",
    health: 56,
    progress: 32,
    budgetPlanned: 58,
    budgetActual: 22,
    budgetForecast: 72,
    problem:
      "HKJC's core betting system infrastructure, originally implemented in 1999, cannot support the Club's digital transformation ambitions. System limitations prevent real-time data processing, modern API integration, and cloud-scalable architecture required for the Wagering Platform Modernisation and Odds Engine AI initiatives.",
    objectives: [
      "Replace legacy core with cloud-native platform supporting 99.9% uptime and real-time data streaming",
      "Enable seamless integration with 12 downstream digital products by FY26",
      "Reduce annual IT maintenance cost by HK$8M through decommissioning of legacy infrastructure",
    ],
    assumptions: ["Cloud vendor remediation delivered by end-March", "No further regulatory architecture changes in Q4"],
    milestones: [
      { phase: "Discovery & Vendor Selection", planned: "15 Nov 2024", status: "Complete", owner: "CTO", criteria: ["Technical design approved", "Vendor contract signed"], note: "Completed on schedule" },
      { phase: "Project Charter Approved", planned: "10 Dec 2024", status: "Complete", owner: "TO Head", criteria: ["SteerCo approval", "Funding release"], note: "Approved with phased migration approach" },
      { phase: "UAT Environment Setup", planned: "28 Feb 2025", revised: "20 Mar 2025", status: "In Progress", owner: "Cloud Vendor", criteria: ["Environment stable for 7 days", "Access for all test teams"], note: "Delayed by vendor provisioning failure" },
      { phase: "Data Migration Wave 1", planned: "15 Apr 2025", status: "At Risk", owner: "CDAO", criteria: ["Lineage verified", "95% data quality threshold"], note: "Dependent on UAT resolution" },
      { phase: "UAT Gate", planned: "24 Apr 2025", status: "Upcoming", owner: "IT Lead", criteria: ["No P1/P2 defects", "Performance <200ms" ] },
      { phase: "Parallel Run", planned: "15 May 2025", status: "Upcoming", owner: "Senior IT PM", criteria: ["Dual run stable", "Incident rate below threshold"] },
      { phase: "Go Live", planned: "30 Jun 2025", status: "Upcoming", owner: "CTO", criteria: ["SteerCo sign-off", "Contingency tested"] },
      { phase: "Benefits Review", planned: "30 Sep 2025", status: "Upcoming", owner: "CFO", criteria: ["HK$4M savings validated", "Reliability KPI baseline"] },
    ],
    team: [
      { role: "Executive Sponsor", assignment: "Responsible", person: "CTO" },
      { role: "Initiative Owner", assignment: "Accountable", person: "IT Lead" },
      { role: "Programme Manager", assignment: "Responsible", person: "Senior IT PM" },
      { role: "Subject Matter Experts", assignment: "Consulted", person: "Cloud Architect, Data Architect" },
      { role: "Steering Committee", assignment: "Consulted", person: "TO Head + EXCO" },
      { role: "Finance Business Partner", assignment: "Informed", person: "Finance PM" },
    ],
    raci: [
      { workstream: "Architecture", sponsor: "C", owner: "A", pm: "R", steercos: "I" },
      { workstream: "Migration", sponsor: "I", owner: "A", pm: "R", steercos: "C" },
      { workstream: "Testing", sponsor: "I", owner: "C", pm: "A", steercos: "I" },
      { workstream: "Cutover", sponsor: "C", owner: "A", pm: "R", steercos: "C" },
    ],
    linkedRiskIds: ["R001", "R005", "R010"],
    linkedIssueIds: ["I-001"],
    logs: [
      { date: "12 Mar 2025", author: "IT", category: "Risk", text: "Raised critical dependency risk on vendor migration capacity." },
      { date: "08 Mar 2025", author: "CT", category: "Budget", text: "Forecast updated to HK$72M pending remediation package." },
      { date: "03 Mar 2025", author: "PM", category: "Milestone", text: "UAT environment milestone moved to 20 Mar." },
      { date: "20 Feb 2025", author: "TO", category: "Decision", text: "SteerCo approved phased cutover with parallel run gate." },
    ],
  },
  {
    id: "I002",
    name: "Wagering Platform Modernisation",
    theme: themes[0],
    status: "Green",
    owner: "Head of Racing",
    sponsor: "MD, Racing",
    manager: "Digital Product PM",
    start: "15 Oct 2024",
    end: "15 Dec 2025",
    duration: "14 months",
    priority: "High",
    approach: "Agile Programme",
    health: 78,
    progress: 45,
    budgetPlanned: 76,
    budgetActual: 28,
    budgetForecast: 76,
    problem: "Legacy wagering experience lacks personalisation, speed, and interoperability with mobile-first channels.",
    objectives: ["Lift digital handle by 15%", "Reduce transaction latency by 30%", "Enable seamless RG controls"],
    assumptions: ["Data Governance API available by Q2", "No major regulatory redesign"],
    milestones: [
      { phase: "Discovery Complete", planned: "20 Nov 2024", status: "Complete", owner: "Head of Product", criteria: ["Persona mapping complete", "Roadmap approved"], note: "Completed ahead by 4 days" },
      { phase: "Design Sign-off", planned: "03 Apr 2025", status: "In Progress", owner: "Head of Product", criteria: ["UX satisfaction >=80%", "Brand and legal sign-off"] },
      { phase: "UAT Gate", planned: "24 Apr 2025", revised: "12 May 2025", status: "At Risk", owner: "IT Lead", criteria: ["No P1/P2 defects", "Perf <200ms"] },
      { phase: "Go Live", planned: "15 Dec 2025", status: "Upcoming", owner: "MD, Racing", criteria: ["SteerCo launch approval", "Support model ready"] },
    ],
    team: [
      { role: "Executive Sponsor", assignment: "Responsible", person: "MD, Racing" },
      { role: "Initiative Owner", assignment: "Accountable", person: "Head of Racing" },
      { role: "Programme Manager", assignment: "Responsible", person: "Digital Product PM" },
      { role: "Subject Matter Experts", assignment: "Consulted", person: "Product Lead, UX Lead" },
      { role: "Steering Committee", assignment: "Consulted", person: "Programme Board" },
      { role: "Finance Business Partner", assignment: "Informed", person: "Finance BP Racing" },
    ],
    raci: [
      { workstream: "Product", sponsor: "C", owner: "A", pm: "R", steercos: "I" },
      { workstream: "Engineering", sponsor: "I", owner: "A", pm: "R", steercos: "C" },
      { workstream: "Testing", sponsor: "I", owner: "C", pm: "A", steercos: "I" },
      { workstream: "Launch", sponsor: "C", owner: "A", pm: "R", steercos: "C" },
    ],
    linkedRiskIds: ["R004", "R005"],
    linkedIssueIds: ["I-003"],
    logs: [
      { date: "10 Mar 2025", author: "PR", category: "Scope", text: "Added payment fallback flow for high-traffic race days." },
      { date: "05 Mar 2025", author: "IT", category: "Milestone", text: "UAT Gate moved to 12 May due to gateway issue." },
    ],
  },
  {
    id: "I003",
    name: "Agile Ways of Working Rollout",
    theme: themes[2],
    status: "Green",
    owner: "HR Director",
    sponsor: "CHRO",
    manager: "Agile Transformation Lead",
    start: "05 Jan 2025",
    end: "22 Aug 2025",
    duration: "8 months",
    priority: "High",
    approach: "Pilot & Scale",
    health: 82,
    progress: 78,
    budgetPlanned: 18,
    budgetActual: 14,
    budgetForecast: 18,
    problem: "Traditional delivery models are slowing strategic execution and cross-functional responsiveness.",
    objectives: ["Certify 10 teams at L3 maturity", "Reduce cycle time by 15%", "Embed OKR-linked sprint planning"],
    assumptions: ["Business leaders release capacity for coaching", "Q4 change freeze excludes this programme"],
    milestones: [
      { phase: "Framework finalised", planned: "10 Feb 2025", status: "Complete", owner: "Agile Lead", criteria: ["Playbook approved", "Training curriculum signed"] },
      { phase: "Coaching Cohort 1", planned: "27 Mar 2025", status: "In Progress", owner: "HR Director", criteria: ["10 leads certified", "OKR cascades documented"] },
      { phase: "Division Scale-out", planned: "18 Jun 2025", status: "Upcoming", owner: "CHRO", criteria: ["8 divisions onboarded", "Maturity re-assessment complete"] },
    ],
    team: [
      { role: "Executive Sponsor", assignment: "Responsible", person: "CHRO" },
      { role: "Initiative Owner", assignment: "Accountable", person: "HR Director" },
      { role: "Programme Manager", assignment: "Responsible", person: "Agile Transformation Lead" },
      { role: "Subject Matter Experts", assignment: "Consulted", person: "Scrum Coaches" },
      { role: "Steering Committee", assignment: "Consulted", person: "TO Governance" },
      { role: "Finance Business Partner", assignment: "Informed", person: "Finance HR BP" },
    ],
    raci: [
      { workstream: "Training", sponsor: "C", owner: "A", pm: "R", steercos: "I" },
      { workstream: "Coaching", sponsor: "I", owner: "A", pm: "R", steercos: "C" },
      { workstream: "Adoption", sponsor: "I", owner: "C", pm: "A", steercos: "I" },
      { workstream: "Measurement", sponsor: "C", owner: "A", pm: "R", steercos: "C" },
    ],
    linkedRiskIds: ["R002"],
    linkedIssueIds: ["I-006"],
    logs: [{ date: "11 Mar 2025", author: "HR", category: "Status Update", text: "Cohort 2 coaching closed +12 days ahead of plan." }],
  },
  {
    id: "I004",
    name: "OKR Framework Implementation",
    theme: themes[2],
    status: "Green",
    owner: "Transformation Office",
    sponsor: "TO Head",
    manager: "OKR Lead",
    start: "01 Oct 2024",
    end: "28 Feb 2025",
    duration: "5 months",
    priority: "High",
    approach: "Quick Win",
    health: 91,
    progress: 92,
    budgetPlanned: 6,
    budgetActual: 5.5,
    budgetForecast: 5.5,
    problem: "Transformation outcomes lacked a consistent enterprise performance framework.",
    objectives: ["Deploy cascaded OKRs across all divisions", "Enable monthly confidence tracking", "Link outcomes to initiative governance"],
    assumptions: ["Leadership cadence maintained", "Data integration with dashboard closes in Q4"],
    milestones: [
      { phase: "Framework design", planned: "10 Nov 2024", status: "Complete", owner: "OKR Lead", criteria: ["Design ratified", "Template approved"] },
      { phase: "Club rollout", planned: "20 Jan 2025", status: "Complete", owner: "TO Head", criteria: ["All divisions onboard", "Leadership sessions complete"] },
      { phase: "Benefits review", planned: "28 Feb 2025", status: "In Progress", owner: "CFO", criteria: ["Efficiency gains quantified", "Adoption >75%"] },
    ],
    team: [
      { role: "Executive Sponsor", assignment: "Responsible", person: "TO Head" },
      { role: "Initiative Owner", assignment: "Accountable", person: "Transformation Office" },
      { role: "Programme Manager", assignment: "Responsible", person: "OKR Lead" },
      { role: "Subject Matter Experts", assignment: "Consulted", person: "People Analytics" },
      { role: "Steering Committee", assignment: "Consulted", person: "SteerCo" },
      { role: "Finance Business Partner", assignment: "Informed", person: "CFO Office" },
    ],
    raci: [
      { workstream: "Design", sponsor: "C", owner: "A", pm: "R", steercos: "I" },
      { workstream: "Rollout", sponsor: "I", owner: "A", pm: "R", steercos: "C" },
      { workstream: "Analytics", sponsor: "I", owner: "C", pm: "A", steercos: "I" },
      { workstream: "Governance", sponsor: "C", owner: "A", pm: "R", steercos: "C" },
    ],
    linkedRiskIds: ["R002"],
    linkedIssueIds: ["I-005"],
    logs: [{ date: "02 Mar 2025", author: "TO", category: "Milestone", text: "Adoption reached 78% with completion 8 days ahead of plan." }],
  },
  {
    id: "I005",
    name: "Responsible Gambling Analytics",
    theme: themes[4],
    status: "Amber",
    owner: "Compliance Lead",
    sponsor: "Head of Legal & Compliance",
    manager: "RG Programme Manager",
    start: "01 Dec 2024",
    end: "12 Sep 2025",
    duration: "10 months",
    priority: "Critical",
    approach: "Waterfall Project",
    health: 49,
    progress: 55,
    budgetPlanned: 22,
    budgetActual: 12,
    budgetForecast: 25,
    problem: "RG analytics capability cannot currently identify risk signals in time for intervention.",
    objectives: ["Create real-time risk scoring model", "Increase self-exclusion intervention success", "Strengthen regulatory audit evidence"],
    assumptions: ["Privacy review closes by April", "Mobile enrollment dependency resolved"],
    milestones: [
      { phase: "Model design", planned: "15 Jan 2025", status: "Complete", owner: "Compliance Lead", criteria: ["Algorithm approved", "DPO review complete"] },
      { phase: "Data privacy approval", planned: "20 Mar 2025", status: "At Risk", owner: "Legal", criteria: ["PIA signed", "Consent model approved"] },
      { phase: "Pilot launch", planned: "15 May 2025", status: "Upcoming", owner: "RG PM", criteria: ["Live cohort active", "Ethics panel sign-off"] },
    ],
    team: [
      { role: "Executive Sponsor", assignment: "Responsible", person: "Head of Legal & Compliance" },
      { role: "Initiative Owner", assignment: "Accountable", person: "Compliance Lead" },
      { role: "Programme Manager", assignment: "Responsible", person: "RG Programme Manager" },
      { role: "Subject Matter Experts", assignment: "Consulted", person: "DPO, Data Scientist" },
      { role: "Steering Committee", assignment: "Consulted", person: "Risk Committee" },
      { role: "Finance Business Partner", assignment: "Informed", person: "Finance Compliance BP" },
    ],
    raci: [
      { workstream: "Privacy", sponsor: "C", owner: "A", pm: "R", steercos: "I" },
      { workstream: "Model", sponsor: "I", owner: "A", pm: "R", steercos: "C" },
      { workstream: "Pilot", sponsor: "I", owner: "C", pm: "A", steercos: "I" },
      { workstream: "Rollout", sponsor: "C", owner: "A", pm: "R", steercos: "C" },
    ],
    linkedRiskIds: ["R004", "R008"],
    linkedIssueIds: ["I-002"],
    logs: [{ date: "06 Mar 2025", author: "LG", category: "Risk", text: "Privacy assessment queue delay created -10 day slippage." }],
  },
  {
    id: "I006",
    name: "Finance Process Automation",
    theme: themes[3],
    status: "Green",
    owner: "CFO",
    sponsor: "CFO",
    manager: "Finance Transformation PM",
    start: "10 Nov 2024",
    end: "20 Nov 2025",
    duration: "12 months",
    priority: "High",
    approach: "Agile Programme",
    health: 80,
    progress: 65,
    budgetPlanned: 28,
    budgetActual: 18,
    budgetForecast: 28,
    problem: "Manual finance workflows are creating high cycle times and avoidable control errors.",
    objectives: ["Automate AP/AR and reconciliation", "Deliver HK$22M cost avoidance", "Improve close cycle by 25%"],
    assumptions: ["ERP connector available in Q3", "Vendor onboarding remains stable"],
    milestones: [
      { phase: "Blueprint", planned: "05 Jan 2025", status: "Complete", owner: "CFO", criteria: ["Future-state map approved", "Control design signed"] },
      { phase: "Pilot AP", planned: "18 Apr 2025", status: "In Progress", owner: "Finance PM", criteria: ["95% straight-through processing", "No critical control issue"] },
      { phase: "Scale to AR", planned: "05 Aug 2025", status: "Upcoming", owner: "Finance PM", criteria: ["AR automation >70%", "User adoption >80%"] },
    ],
    team: [
      { role: "Executive Sponsor", assignment: "Responsible", person: "CFO" },
      { role: "Initiative Owner", assignment: "Accountable", person: "CFO" },
      { role: "Programme Manager", assignment: "Responsible", person: "Finance Transformation PM" },
      { role: "Subject Matter Experts", assignment: "Consulted", person: "ERP Lead, Controls Lead" },
      { role: "Steering Committee", assignment: "Consulted", person: "Finance Board" },
      { role: "Finance Business Partner", assignment: "Informed", person: "Controller" },
    ],
    raci: [
      { workstream: "AP", sponsor: "C", owner: "A", pm: "R", steercos: "I" },
      { workstream: "AR", sponsor: "I", owner: "A", pm: "R", steercos: "C" },
      { workstream: "Controls", sponsor: "I", owner: "C", pm: "A", steercos: "I" },
      { workstream: "Reporting", sponsor: "C", owner: "A", pm: "R", steercos: "C" },
    ],
    linkedRiskIds: ["R003"],
    linkedIssueIds: ["I-004"],
    logs: [{ date: "09 Mar 2025", author: "CF", category: "Status Update", text: "Workflow automation module reached +5 day lead on schedule." }],
  },
  {
    id: "I007",
    name: "Member Experience Redesign",
    theme: themes[0],
    status: "Red",
    owner: "Member Services",
    sponsor: "MD, Racing",
    manager: "Member Experience PM",
    start: "12 Jan 2025",
    end: "16 Feb 2026",
    duration: "13 months",
    priority: "Critical",
    approach: "Agile Programme",
    health: 42,
    progress: 28,
    budgetPlanned: 31,
    budgetActual: 12,
    budgetForecast: 35,
    problem: "Member app journey has high friction and weak engagement conversion.",
    objectives: ["Lift digital member conversion by 20%", "Reduce onboarding completion drop-off", "Improve NPS by 10 points"],
    assumptions: ["Feature scope freeze enforced", "UX research cycle protected"],
    milestones: [
      { phase: "Discovery", planned: "20 Feb 2025", status: "Complete", owner: "Member Services", criteria: ["Journey map approved", "Pain points prioritised"] },
      { phase: "UX Sign-off", planned: "03 Apr 2025", status: "In Progress", owner: "Head of Product", criteria: ["User test >=80%", "Legal sign-off"] },
      { phase: "Build Wave 1", planned: "30 Jun 2025", status: "At Risk", owner: "IT Lead", criteria: ["Core backlog complete", "Security baseline passed"] },
    ],
    team: [
      { role: "Executive Sponsor", assignment: "Responsible", person: "MD, Racing" },
      { role: "Initiative Owner", assignment: "Accountable", person: "Member Services" },
      { role: "Programme Manager", assignment: "Responsible", person: "Member Experience PM" },
      { role: "Subject Matter Experts", assignment: "Consulted", person: "UX Lead, Analytics Lead" },
      { role: "Steering Committee", assignment: "Consulted", person: "Digital Board" },
      { role: "Finance Business Partner", assignment: "Informed", person: "Finance Racing BP" },
    ],
    raci: [
      { workstream: "UX", sponsor: "C", owner: "A", pm: "R", steercos: "I" },
      { workstream: "Build", sponsor: "I", owner: "A", pm: "R", steercos: "C" },
      { workstream: "Testing", sponsor: "I", owner: "C", pm: "A", steercos: "I" },
      { workstream: "Launch", sponsor: "C", owner: "A", pm: "R", steercos: "C" },
    ],
    linkedRiskIds: ["R007"],
    linkedIssueIds: ["I-003"],
    logs: [{ date: "14 Mar 2025", author: "MS", category: "Scope", text: "Three unapproved features detected in sprint backlog; change board pending." }],
  },
  {
    id: "I008",
    name: "Data Governance Programme",
    theme: themes[1],
    status: "Amber",
    owner: "CDAO",
    sponsor: "CTO",
    manager: "Data Governance Lead",
    start: "01 Nov 2024",
    end: "14 Nov 2025",
    duration: "12 months",
    priority: "High",
    approach: "Waterfall Project",
    health: 58,
    progress: 40,
    budgetPlanned: 26,
    budgetActual: 11,
    budgetForecast: 26,
    problem: "Fragmented ownership and missing lineage compromise analytics reliability and regulatory confidence.",
    objectives: ["Map lineage for priority domains", "Raise data quality to 90%", "Deploy enterprise catalogue"],
    assumptions: ["Business stewards remain allocated", "Catalogue tooling deployed by April"],
    milestones: [
      { phase: "Domain prioritisation", planned: "10 Dec 2024", status: "Complete", owner: "CDAO", criteria: ["5 domains selected", "Steward owners assigned"] },
      { phase: "Catalogue deployment", planned: "30 Apr 2025", status: "In Progress", owner: "IT Lead", criteria: ["Tool live", "Metadata ingestion ready"] },
      { phase: "Governance controls", planned: "30 Jun 2025", status: "At Risk", owner: "Data Governance Lead", criteria: ["Policy sign-off", "Data quality reports"] },
    ],
    team: [
      { role: "Executive Sponsor", assignment: "Responsible", person: "CTO" },
      { role: "Initiative Owner", assignment: "Accountable", person: "CDAO" },
      { role: "Programme Manager", assignment: "Responsible", person: "Data Governance Lead" },
      { role: "Subject Matter Experts", assignment: "Consulted", person: "Data Stewards" },
      { role: "Steering Committee", assignment: "Consulted", person: "Data Council" },
      { role: "Finance Business Partner", assignment: "Informed", person: "Finance IT BP" },
    ],
    raci: [
      { workstream: "Lineage", sponsor: "C", owner: "A", pm: "R", steercos: "I" },
      { workstream: "Policy", sponsor: "I", owner: "A", pm: "R", steercos: "C" },
      { workstream: "Tooling", sponsor: "I", owner: "C", pm: "A", steercos: "I" },
      { workstream: "Reporting", sponsor: "C", owner: "A", pm: "R", steercos: "C" },
    ],
    linkedRiskIds: ["R001", "R009"],
    linkedIssueIds: ["I-005"],
    logs: [{ date: "07 Mar 2025", author: "DA", category: "Risk", text: "Data steward capacity constraint impacts Q2 timeline." }],
  },
  {
    id: "I009",
    name: "HR Operating Model Redesign",
    theme: themes[2],
    status: "Planned",
    owner: "Chief HR Officer",
    sponsor: "CHRO",
    manager: "HR Transformation PM",
    start: "01 Apr 2025",
    end: "18 Jan 2026",
    duration: "9 months",
    priority: "Medium",
    approach: "Pilot & Scale",
    health: 50,
    progress: 10,
    budgetPlanned: 12,
    budgetActual: 3,
    budgetForecast: 12,
    problem: "Current HR model is fragmented across divisions and not aligned to agile operating principles.",
    objectives: ["Define target service model", "Improve workforce planning quality", "Align HR KPIs to OKRs"],
    assumptions: ["Workforce data available by Q3", "Leadership labs continue"],
    milestones: [
      { phase: "Current state diagnostics", planned: "30 Apr 2025", status: "Upcoming", owner: "CHRO", criteria: ["Org map baseline", "Capability heatmap"] },
      { phase: "Target model design", planned: "31 Jul 2025", status: "Upcoming", owner: "HR PM", criteria: ["Design approved", "Transition roadmap"] },
    ],
    team: [
      { role: "Executive Sponsor", assignment: "Responsible", person: "CHRO" },
      { role: "Initiative Owner", assignment: "Accountable", person: "Chief HR Officer" },
      { role: "Programme Manager", assignment: "Responsible", person: "HR Transformation PM" },
      { role: "Subject Matter Experts", assignment: "Consulted", person: "Org Design Lead" },
      { role: "Steering Committee", assignment: "Consulted", person: "People Council" },
      { role: "Finance Business Partner", assignment: "Informed", person: "Finance HR BP" },
    ],
    raci: [
      { workstream: "Design", sponsor: "C", owner: "A", pm: "R", steercos: "I" },
      { workstream: "Workforce", sponsor: "I", owner: "A", pm: "R", steercos: "C" },
      { workstream: "Change", sponsor: "I", owner: "C", pm: "A", steercos: "I" },
      { workstream: "Transition", sponsor: "C", owner: "A", pm: "R", steercos: "C" },
    ],
    linkedRiskIds: ["R002"],
    linkedIssueIds: ["I-006"],
    logs: [{ date: "04 Mar 2025", author: "HR", category: "Decision", text: "Planning baseline approved for Q2 launch." }],
  },
  {
    id: "I010",
    name: "Cost Optimisation Initiative",
    theme: themes[3],
    status: "Planned",
    owner: "Finance PMO",
    sponsor: "CFO",
    manager: "Cost Optimisation Lead",
    start: "10 Apr 2025",
    end: "28 Jun 2026",
    duration: "15 months",
    priority: "Medium",
    approach: "Waterfall Project",
    health: 48,
    progress: 18,
    budgetPlanned: 19,
    budgetActual: 4,
    budgetForecast: 19,
    problem: "Operational spend baseline is rising faster than revenue growth in selected support functions.",
    objectives: ["Reduce non-value spend by 8%", "Improve cost-to-serve visibility", "Embed quarterly reforecast discipline"],
    assumptions: ["Business units adopt savings controls", "No major inflation shock"],
    milestones: [
      { phase: "Baseline confirmed", planned: "15 May 2025", status: "In Progress", owner: "Finance PMO", criteria: ["Spend baseline agreed", "Savings levers scored"] },
      { phase: "Savings wave 1", planned: "30 Sep 2025", status: "Upcoming", owner: "CFO", criteria: ["HK$6M realised", "Control metrics stable"] },
    ],
    team: [
      { role: "Executive Sponsor", assignment: "Responsible", person: "CFO" },
      { role: "Initiative Owner", assignment: "Accountable", person: "Finance PMO" },
      { role: "Programme Manager", assignment: "Responsible", person: "Cost Optimisation Lead" },
      { role: "Subject Matter Experts", assignment: "Consulted", person: "Procurement Lead" },
      { role: "Steering Committee", assignment: "Consulted", person: "Finance Board" },
      { role: "Finance Business Partner", assignment: "Informed", person: "Controller" },
    ],
    raci: [
      { workstream: "Baseline", sponsor: "C", owner: "A", pm: "R", steercos: "I" },
      { workstream: "Savings", sponsor: "I", owner: "A", pm: "R", steercos: "C" },
      { workstream: "Governance", sponsor: "I", owner: "C", pm: "A", steercos: "I" },
      { workstream: "Reporting", sponsor: "C", owner: "A", pm: "R", steercos: "C" },
    ],
    linkedRiskIds: ["R003"],
    linkedIssueIds: ["I-004"],
    logs: [{ date: "01 Mar 2025", author: "FP", category: "Status Update", text: "Benefit case assumptions moved to review gate." }],
  },
];

const risks: RiskRecord[] = [
  {
    id: "R001",
    title: "Legacy System Migration Delays",
    category: "Technology",
    rating: "Critical",
    rag: "Red",
    likelihood: 4,
    impact: 5,
    owner: "IT Lead",
    due: "15 Mar 2025",
    description:
      "The migration of HKJC's 25-year-old core betting platform to the new cloud-based infrastructure has experienced significant delays due to undocumented system dependencies and insufficient vendor resourcing. Three planned data migration windows have been missed, putting Q3 FY25 go-live at risk.",
    mitigation: [
      { action: "Conduct emergency vendor performance review", owner: "IT Lead", due: "15 Mar", status: "In Progress" },
      { action: "Commission independent technical assessment of migration complexity", owner: "CTO", due: "20 Mar", status: "Not Started" },
      { action: "Prepare contingency plan for phased go-live", owner: "Programme Manager", due: "25 Mar", status: "In Progress" },
      { action: "Escalate to Executive Steering Committee", owner: "TO Head", due: "18 Mar", status: "Complete" },
    ],
    linkedInitiatives: ["I001", "I008"],
    history: ["Dec 10: Raised as Amber", "Jan 22: Escalated to High", "Mar 5: Critical - 3rd migration window missed"],
    matrix: { x: 4, y: 5 },
  },
  {
    id: "R002",
    title: "Senior Change Resistance",
    category: "People",
    rating: "High",
    rag: "Amber",
    likelihood: 3,
    impact: 4,
    owner: "HR Director",
    due: "22 Mar 2025",
    description:
      "A cohort of senior operational leaders in the Racing and Member Services divisions have demonstrated passive resistance to new Agile ways of working and the revised performance management framework linked to OKRs.",
    mitigation: [
      { action: "Design targeted change champion programme for Racing division", owner: "HR Director", due: "22 Mar", status: "In Progress" },
      { action: "Facilitate executive leadership alignment sessions", owner: "TO Head", due: "28 Mar", status: "Not Started" },
      { action: "Commission confidential exit risk assessment", owner: "CHRO", due: "31 Mar", status: "Not Started" },
    ],
    linkedInitiatives: ["I003", "I004", "I009"],
    history: ["Jan 8: Raised as Low", "Feb 20: Escalated to Amber after pulse survey"],
    matrix: { x: 3, y: 4 },
  },
  {
    id: "R003",
    title: "Budget overrun on Digital Programme",
    category: "Financial",
    rating: "High",
    rag: "Amber",
    likelihood: 3,
    impact: 4,
    owner: "CFO",
    due: "30 Mar 2025",
    description: "Forecast pressure from cloud security remediation and change requests may push portfolio beyond tolerance.",
    mitigation: [
      { action: "Weekly reforecast with digital leads", owner: "CFO", due: "Weekly", status: "In Progress" },
      { action: "Trigger cost containment gates", owner: "Finance PMO", due: "01 Apr", status: "Not Started" },
    ],
    linkedInitiatives: ["I006", "I010"],
    history: ["Feb 3: Raised as Medium", "Mar 2: Escalated to High"],
    matrix: { x: 3, y: 4 },
  },
  {
    id: "R004",
    title: "Regulatory Rule Changes",
    category: "Regulatory",
    rating: "High",
    rag: "Amber",
    likelihood: 2,
    impact: 5,
    owner: "Legal",
    due: "30 Mar 2025",
    description:
      "Proposed amendments to the Betting Duty Ordinance and emerging HKSAR policy on digital gambling channels may require significant changes to the wagering platform roadmap and RG compliance framework.",
    mitigation: [
      { action: "Monitor HKSAR Legislative Council schedule", owner: "Legal", due: "Ongoing", status: "In Progress" },
      { action: "Develop scenario analysis for 3 regulatory outcomes", owner: "Legal + Strategy", due: "30 Mar", status: "In Progress" },
      { action: "Establish RegTech working group", owner: "Compliance Lead", due: "1 Apr", status: "Not Started" },
    ],
    linkedInitiatives: ["I002", "I005"],
    history: ["Nov 5: Raised as Low", "Feb 14: Escalated to Amber following LegCo consultation paper"],
    matrix: { x: 2, y: 5 },
  },
  {
    id: "R005",
    title: "Vendor Capacity Constraints",
    category: "Operational",
    rating: "High",
    rag: "Amber",
    likelihood: 3,
    impact: 4,
    owner: "Procurement",
    due: "18 Mar 2025",
    description:
      "Key technology vendors supporting Core Banking and Wagering Platform are simultaneously engaged on multiple HKJC deliverables, creating resource contention.",
    mitigation: [
      { action: "Review active vendor contracts for capacity clauses", owner: "Procurement", due: "18 Mar", status: "In Progress" },
      { action: "Identify backup vendors for critical roles", owner: "IT Lead", due: "25 Mar", status: "Not Started" },
      { action: "Negotiate dedicated resource pools", owner: "CTO + Procurement", due: "30 Mar", status: "Not Started" },
    ],
    linkedInitiatives: ["I001", "I002"],
    history: ["Feb 2: Raised as Medium", "Mar 1: Escalated to High after resource conflict"],
    matrix: { x: 4, y: 4 },
  },
  {
    id: "R006",
    title: "Loss of key transformation talent",
    category: "People",
    rating: "Medium",
    rag: "Green",
    likelihood: 3,
    impact: 3,
    owner: "HR",
    due: "8 May 2025",
    description: "Attrition risk in critical specialist roles may reduce delivery capacity in Q4.",
    mitigation: [
      { action: "Retention package for key roles", owner: "HR", due: "30 Mar", status: "Not Started" },
      { action: "Succession list for top 10 roles", owner: "TO", due: "10 Apr", status: "In Progress" },
    ],
    linkedInitiatives: ["I003", "I009"],
    history: ["Jan 18: Raised as Low", "Mar 7: Upgraded to Medium"],
    matrix: { x: 3, y: 3 },
  },
  {
    id: "R007",
    title: "Scope creep on Member Experience",
    category: "Strategic",
    rating: "High",
    rag: "Amber",
    likelihood: 4,
    impact: 3,
    owner: "Programme Lead",
    due: "12 May 2025",
    description: "Uncontrolled scope change requests are increasing delivery time and budget demand.",
    mitigation: [
      { action: "Enforce change freeze pending board review", owner: "Programme Board", due: "25 Mar", status: "In Progress" },
      { action: "Apply value-based CR scoring", owner: "TO Lead", due: "30 Mar", status: "Not Started" },
    ],
    linkedInitiatives: ["I007"],
    history: ["Feb 11: Raised as Medium", "Mar 4: Escalated to High"],
    matrix: { x: 4, y: 3 },
  },
  {
    id: "R008",
    title: "Data privacy breach risk",
    category: "Regulatory",
    rating: "High",
    rag: "Amber",
    likelihood: 2,
    impact: 5,
    owner: "CISO",
    due: "26 Mar 2025",
    description: "Personal data handling controls in RG analytics and mobile enrolment remain under remediation.",
    mitigation: [
      { action: "Complete remediation for open findings", owner: "CISO", due: "26 Mar", status: "Complete" },
      { action: "Audit controls in app enrollment", owner: "Legal", due: "30 Mar", status: "In Progress" },
    ],
    linkedInitiatives: ["I005", "I007"],
    history: ["Feb 1: Raised as High", "Mar 1: Remediation plan approved"],
    matrix: { x: 2, y: 5 },
  },
  {
    id: "R009",
    title: "Racing Data Feed Reliability",
    category: "Technology",
    rating: "Medium",
    rag: "Green",
    likelihood: 2,
    impact: 3,
    owner: "CDAO",
    due: "15 Apr 2025",
    description:
      "Real-time racing data feeds from international race meetings have experienced intermittent latency issues impacting live wagering integrity.",
    mitigation: [
      { action: "Implement redundant feed architecture", owner: "IT Data Ops", due: "15 Apr", status: "In Progress" },
      { action: "Deploy automated feed monitoring alerts", owner: "Data Ops", due: "22 Apr", status: "In Progress" },
      { action: "Negotiate SLA upgrade with data vendors", owner: "Procurement", due: "30 Apr", status: "Not Started" },
    ],
    linkedInitiatives: ["I008", "I002"],
    history: ["Jan 30: Raised as Low", "Mar 6: Upgraded to Medium after two incidents"],
    matrix: { x: 2, y: 3 },
  },
  {
    id: "R010",
    title: "Cyber Security Incident Risk",
    category: "Technology",
    rating: "High",
    rag: "Amber",
    likelihood: 2,
    impact: 5,
    owner: "CISO",
    due: "28 Mar 2025",
    description:
      "As HKJC migrates core systems to cloud and expands digital wagering channels, the attack surface for cyber threats has materially increased.",
    mitigation: [
      { action: "Complete penetration test remediation", owner: "CISO", due: "20 Mar", status: "In Progress" },
      { action: "Deploy enhanced WAF and DDoS protection", owner: "Infrastructure Lead", due: "28 Mar", status: "Not Started" },
      { action: "Conduct tabletop cyber incident simulation", owner: "Risk Office", due: "12 Apr", status: "Not Started" },
    ],
    linkedInitiatives: ["I001", "I002"],
    history: ["Feb 10: Raised as Medium", "Mar 8: Escalated to High due to unresolved P1 finding"],
    matrix: { x: 2, y: 5 },
  },
];

const issues: IssueRecord[] = [
  {
    id: "I-001",
    title: "Core Banking UAT environment unavailable",
    priority: "P1 Critical",
    raisedBy: "IT Lead",
    raisedDate: "04 Mar 2025",
    assignedTo: "CTO",
    status: "Escalated",
    target: "22 Mar 2025",
    daysOpen: 12,
    description:
      "The UAT environment for the Core Banking migration was unavailable for 12 days due to infrastructure provisioning failure by the cloud vendor. Testing has been blocked, impacting 4 downstream milestones.",
    impact: "Go-live at risk of shifting from Q3 to Q4 FY25, with HK$8M in delayed benefit realisation and potential contract penalty clauses.",
    steps: [
      { action: "Vendor to restore UAT environment", owner: "Cloud Vendor", due: "16 Mar", status: "In Progress" },
      { action: "Compress test cycles using risk-based test approach", owner: "IT Lead", due: "20 Mar", status: "Not Started" },
      { action: "Rebaseline milestone plan and communicate to SteerCo", owner: "PM", due: "22 Mar", status: "Not Started" },
    ],
    escalation: ["10 Mar: Escalated to CTO", "12 Mar: Added to Executive SteerCo agenda"],
    linkedRiskIds: ["R001", "R005"],
  },
  {
    id: "I-002",
    title: "RG training platform access denied for 40% of staff",
    priority: "P1 Critical",
    raisedBy: "Compliance Lead",
    raisedDate: "26 Feb 2025",
    assignedTo: "IT Lead",
    status: "In Progress",
    target: "28 Mar 2025",
    daysOpen: 18,
    description:
      "A system configuration error during the LMS platform migration has locked 2,400 staff out of the mandatory Responsible Gambling training module.",
    impact: "Regulatory non-compliance risk with potential HKSAR fine and significant reputation damage if completion target is missed.",
    steps: [
      { action: "Restore IAM permissions for affected cohorts", owner: "IT Lead", due: "18 Mar", status: "In Progress" },
      { action: "Deploy temporary blended learning channel", owner: "L&D", due: "20 Mar", status: "Not Started" },
      { action: "Run daily completion war-room", owner: "Compliance", due: "Daily", status: "Not Started" },
    ],
    escalation: ["05 Mar: Raised to Compliance Committee", "11 Mar: Marked critical for quarterly regulatory report"],
    linkedRiskIds: ["R008", "R004"],
  },
  {
    id: "I-003",
    title: "Scope creep on Member App - 3 unapproved features added",
    priority: "P2 High",
    raisedBy: "PMO",
    raisedDate: "11 Mar 2025",
    assignedTo: "Member Services",
    status: "Open",
    target: "25 Mar 2025",
    daysOpen: 8,
    description: "Backlog controls were bypassed and three non-approved features were added in sprint planning.",
    impact: "Projected +HK$4M cost and 15-day delay risk if not corrected.",
    steps: [{ action: "Convene change control board", owner: "Programme Board", due: "18 Mar", status: "In Progress" }],
    escalation: ["14 Mar: escalated to TO Head"],
    linkedRiskIds: ["R007"],
  },
  {
    id: "I-004",
    title: "Vendor invoice dispute - HK$3.2M withheld",
    priority: "P2 High",
    raisedBy: "Finance",
    raisedDate: "17 Feb 2025",
    assignedTo: "Procurement",
    status: "In Progress",
    target: "28 Mar 2025",
    daysOpen: 25,
    description: "Dispute over milestone acceptance criteria has delayed vendor payment and strained resource commitments.",
    impact: "Risk of slowed delivery if vendor reallocates specialist resources.",
    steps: [{ action: "Run contract interpretation session", owner: "Procurement", due: "20 Mar", status: "In Progress" }],
    escalation: ["09 Mar: CFO notified"],
    linkedRiskIds: ["R005"],
  },
  {
    id: "I-005",
    title: "OKR data not flowing into dashboard - reporting gap",
    priority: "P3 Medium",
    raisedBy: "TO Office",
    raisedDate: "13 Mar 2025",
    assignedTo: "IT",
    status: "Open",
    target: "30 Mar 2025",
    daysOpen: 5,
    description: "Data pipeline jobs intermittently fail due to schema mismatches.",
    impact: "Confidence reporting delayed and manual updates required.",
    steps: [{ action: "Patch ETL mapping", owner: "IT Data Team", due: "19 Mar", status: "Not Started" }],
    escalation: [],
    linkedRiskIds: ["R009"],
  },
  {
    id: "I-006",
    title: "Leadership workshop attendance below 60%",
    priority: "P3 Medium",
    raisedBy: "HR Director",
    raisedDate: "15 Mar 2025",
    assignedTo: "L&D",
    status: "Open",
    target: "02 Apr 2025",
    daysOpen: 3,
    description: "Competing operational commitments reduced attendance in two workshop cohorts.",
    impact: "Could slow people and culture confidence progression in Q4.",
    steps: [{ action: "Rebaseline workshop schedule", owner: "L&D", due: "22 Mar", status: "Not Started" }],
    escalation: [],
    linkedRiskIds: ["R002"],
  },
];

const dashboardHeatmap = {
  [themes[0]]: [
    { quarter: "Q1 FY2025", initiativeId: "I002", name: "Wagering Platform", status: "Green" as Status, progress: 45, used: 28, budget: 76, schedule: "+5 days", owner: "Head of Racing", risk: "Vendor integration complexity" },
    { quarter: "Q2 FY2025", initiativeId: "I007", name: "Member Experience", status: "Amber" as Status, progress: 28, used: 12, budget: 31, schedule: "-15 days", owner: "Member Services", risk: "Scope creep on app features" },
    { quarter: "Q3 FY2025", initiativeId: "I008", name: "Racing Data Hub", status: "Green" as Status, progress: 15, used: 4, budget: 18, schedule: "+2 days", owner: "CDAO", risk: "Data quality from legacy feeds" },
    { quarter: "Q4 FY2025", initiativeId: "I002", name: "Odds Engine AI", status: "Amber" as Status, progress: 5, used: 1, budget: 12, schedule: "Planning stage", owner: "Head of Racing", risk: "AI governance framework not yet approved" },
  ],
  [themes[1]]: [
    { quarter: "Q1 FY2025", initiativeId: "I001", name: "Core Banking", status: "Amber" as Status, progress: 32, used: 22, budget: 58, schedule: "-18 days", owner: "IT Lead", risk: "Vendor delivery milestone at risk" },
    { quarter: "Q2 FY2025", initiativeId: "I008", name: "Data Governance", status: "Amber" as Status, progress: 40, used: 11, budget: 26, schedule: "-5 days", owner: "CDAO", risk: "Data steward capacity" },
    { quarter: "Q3 FY2025", initiativeId: "I001", name: "Cloud Security", status: "Red" as Status, progress: 20, used: 6, budget: 14, schedule: "-22 days", owner: "CISO", risk: "Critical security audit finding unresolved" },
    { quarter: "Q4 FY2025", initiativeId: "I001", name: "Mobile Rebuild", status: "Amber" as Status, progress: 8, used: 3, budget: 20, schedule: "Design phase", owner: "IT Lead", risk: "UX research timeline" },
  ],
  [themes[2]]: [
    { quarter: "Q1 FY2025", initiativeId: "I003", name: "Agile Rollout", status: "Green" as Status, progress: 78, used: 14, budget: 18, schedule: "+12 days", owner: "HR Director", risk: "Coach availability in Q4" },
    { quarter: "Q2 FY2025", initiativeId: "I004", name: "OKR Adoption", status: "Green" as Status, progress: 92, used: 5.5, budget: 6, schedule: "+8 days", owner: "TO Office", risk: "None - completing ahead of schedule" },
    { quarter: "Q3 FY2025", initiativeId: "I009", name: "Leadership Labs", status: "Green" as Status, progress: 35, used: 3, budget: 8, schedule: "+1 day", owner: "Chief HR Officer", risk: "Exec scheduling conflicts" },
    { quarter: "Q4 FY2025", initiativeId: "I009", name: "Workforce Planning", status: "Amber" as Status, progress: 10, used: 1, budget: 9, schedule: "Early stage", owner: "Chief HR Officer", risk: "Skills gap data not yet available" },
  ],
  [themes[3]]: [
    { quarter: "Q1 FY2025", initiativeId: "I006", name: "Finance Automation", status: "Green" as Status, progress: 65, used: 18, budget: 28, schedule: "+5 days", owner: "CFO", risk: "ERP integration dependencies" },
    { quarter: "Q2 FY2025", initiativeId: "I006", name: "Procure-to-Pay", status: "Green" as Status, progress: 42, used: 8, budget: 16, schedule: "+3 days", owner: "CFO", risk: "Vendor onboarding delays" },
    { quarter: "Q3 FY2025", initiativeId: "I010", name: "Cost Optimisation", status: "Amber" as Status, progress: 18, used: 4, budget: 19, schedule: "-8 days", owner: "Finance PMO", risk: "Benefit case assumptions under review" },
    { quarter: "Q4 FY2025", initiativeId: "I010", name: "Controls Uplift", status: "Amber" as Status, progress: 5, used: 1, budget: 11, schedule: "Planning", owner: "CFO", risk: "Regulatory requirement unclear" },
  ],
  [themes[4]]: [
    { quarter: "Q1 FY2025", initiativeId: "I005", name: "RG Analytics", status: "Amber" as Status, progress: 55, used: 12, budget: 22, schedule: "-10 days", owner: "Compliance Lead", risk: "Data privacy approval pending" },
    { quarter: "Q2 FY2025", initiativeId: "I005", name: "Policy Revamp", status: "Green" as Status, progress: 38, used: 3, budget: 7, schedule: "+2 days", owner: "Legal", risk: "Legislative timeline" },
    { quarter: "Q3 FY2025", initiativeId: "I005", name: "Audit Automation", status: "Green" as Status, progress: 22, used: 5, budget: 13, schedule: "On track", owner: "Internal Audit", risk: "Tool vendor selection" },
    { quarter: "Q4 FY2025", initiativeId: "I005", name: "RegTech Upgrade", status: "Red" as Status, progress: 8, used: 2, budget: 15, schedule: "-30 days", owner: "Compliance Lead", risk: "Budget approval not yet secured" },
  ],
};

const interactiveClass =
  "cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:scale-[1.01] hover:border-[#C8922A] hover:shadow-[0_0_0_1px_rgba(200,146,42,0.35),0_10px_24px_rgba(0,26,58,0.1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C8922A]";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function getLocalFlag(key: string) {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(key) === "1";
}

function setLocalFlag(key: string) {
  if (typeof window !== "undefined") window.localStorage.setItem(key, "1");
}

function usePagePulse(pageKey: string) {
  const [show, setShow] = useState<boolean>(() => !getLocalFlag(`pulse-${pageKey}`));
  const acknowledge = useCallback(() => {
    if (show) {
      setShow(false);
      setLocalFlag(`pulse-${pageKey}`);
    }
  }, [show]);
  return { show, acknowledge };
}

function useHintText(pageKey: string) {
  const [show, setShow] = useState<boolean>(() => !getLocalFlag(`hint-${pageKey}`));
  useEffect(() => {
    if (!show) return;
    const t = setTimeout(() => {
      setShow(false);
      setLocalFlag(`hint-${pageKey}`);
    }, 4000);
    return () => clearTimeout(t);
  }, [show]);
  return show;
}

function handleKeyboardActivate(e: KeyboardEvent, fn: () => void) {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    fn();
  }
}

function RagPill({ status }: { status: Status | "Critical" | "High" | "Medium" | "Low" | "P1 Critical" | "P2 High" | "P3 Medium" }) {
  const map: Record<string, string> = {
    Green: "bg-emerald-50 border-emerald-200 text-emerald-700",
    Amber: "bg-amber-50 border-amber-200 text-amber-700",
    Red: "bg-red-50 border-red-200 text-red-700",
    Planned: "bg-slate-100 border-slate-200 text-slate-700",
    Critical: "bg-red-100 border-red-300 text-red-800",
    High: "bg-red-50 border-red-200 text-red-700",
    Medium: "bg-amber-50 border-amber-200 text-amber-700",
    Low: "bg-emerald-50 border-emerald-200 text-emerald-700",
    "P1 Critical": "bg-red-100 border-red-300 text-red-800",
    "P2 High": "bg-red-50 border-red-200 text-red-700",
    "P3 Medium": "bg-amber-50 border-amber-200 text-amber-700",
  };
  return <span className={cn("rounded-full border px-2 py-0.5 text-[11px] font-medium", map[status])}>{status}</span>;
}

function Panel({ title, subtitle, children, className }: { title: string; subtitle?: string; children: ReactNode; className?: string }) {
  return (
    <section className={cn("rounded-2xl border border-slate-200 bg-white p-4 shadow-sm", className)}>
      <div className="mb-3">
        <h3 className="text-base font-bold text-[#003366]">{title}</h3>
        {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
      </div>
      {children}
    </section>
  );
}

function CountUp({ value, prefix = "", suffix = "" }: { value: number; prefix?: string; suffix?: string }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    const steps = 24;
    let current = 0;
    const interval = setInterval(() => {
      current += 1;
      setDisplay(Math.round((value / steps) * current));
      if (current >= steps) clearInterval(interval);
    }, 33);
    return () => clearInterval(interval);
  }, [value]);
  return <>{prefix}{display}{suffix}</>;
}

function ExportToast({ message }: { message: string | null }) {
  return (
    <AnimatePresence>
      {message && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 12 }} className="fixed bottom-4 right-4 z-[80] border-l-4 border-[#C8922A] bg-[#003366] px-4 py-3 text-sm text-white shadow-xl">
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function SlideDrawer({
  open,
  onClose,
  title,
  breadcrumb,
  width = 560,
  children,
  onExport,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  breadcrumb: string;
  width?: number;
  children: ReactNode;
  onExport: () => void;
}) {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const apply = () => setIsMobile(window.innerWidth < 768);
    apply();
    window.addEventListener("resize", apply);
    return () => window.removeEventListener("resize", apply);
  }, []);

  return (
    <Dialog.Root open={open} onOpenChange={(v) => !v && onClose()}>
      <Dialog.Portal>
        <AnimatePresence>
          {open && (
            <>
              <Dialog.Overlay asChild>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/30 backdrop-blur-[2px]" />
              </Dialog.Overlay>
              <Dialog.Content asChild>
                <motion.div
                  initial={isMobile ? { y: "100%", opacity: 0.9 } : { x: 120, opacity: 0.9 }}
                  animate={isMobile ? { y: 0, opacity: 1 } : { x: 0, opacity: 1 }}
                  exit={isMobile ? { y: "100%", opacity: 0.95 } : { x: 120, opacity: 0.9 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className={cn(
                    "fixed z-[60] flex bg-white shadow-2xl",
                    isMobile ? "inset-x-0 bottom-0 h-[92vh] flex-col rounded-t-2xl" : "right-0 top-0 h-screen flex-col"
                  )}
                  style={isMobile ? undefined : { width }}
                >
                  <div className="sticky top-0 z-10 border-b border-slate-200 bg-white px-5 py-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs text-slate-500">{breadcrumb}</p>
                        <Dialog.Title className="text-lg font-bold text-[#003366]">{title}</Dialog.Title>
                      </div>
                      <Dialog.Close className="rounded-lg p-1 text-slate-500 hover:bg-slate-100">
                        <X className="h-4 w-4" />
                      </Dialog.Close>
                    </div>
                  </div>
                  <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">{children}</div>
                  <div className="sticky bottom-0 border-t border-slate-200 bg-white px-5 py-3">
                    <button type="button" onClick={onExport} className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:border-[#C8922A]">
                      Export
                    </button>
                  </div>
                </motion.div>
              </Dialog.Content>
            </>
          )}
        </AnimatePresence>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function CenterModal({ open, onClose, title, breadcrumb, children, onExport }: { open: boolean; onClose: () => void; title: string; breadcrumb: string; children: ReactNode; onExport: () => void }) {
  return (
    <Dialog.Root open={open} onOpenChange={(v) => !v && onClose()}>
      <Dialog.Portal>
        <AnimatePresence>
          {open && (
            <>
              <Dialog.Overlay asChild>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/30 backdrop-blur-[2px]" />
              </Dialog.Overlay>
              <Dialog.Content asChild>
                <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} transition={{ duration: 0.25 }} className="fixed left-1/2 top-1/2 z-[60] flex h-[88vh] w-[94vw] max-w-[720px] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
                  <div className="sticky top-0 border-b border-slate-200 bg-white px-5 py-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-xs text-slate-500">{breadcrumb}</p>
                        <Dialog.Title className="text-lg font-bold text-[#003366]">{title}</Dialog.Title>
                      </div>
                      <Dialog.Close className="rounded-lg p-1 text-slate-500 hover:bg-slate-100">
                        <X className="h-4 w-4" />
                      </Dialog.Close>
                    </div>
                  </div>
                  <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">{children}</div>
                  <div className="border-t border-slate-200 px-5 py-3">
                    <button type="button" onClick={onExport} className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:border-[#C8922A]">
                      Export
                    </button>
                  </div>
                </motion.div>
              </Dialog.Content>
            </>
          )}
        </AnimatePresence>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function BenefitsDetailContent() {
  const byInitiative = [
    { name: "OKR Framework", planned: 8, actual: 9.2 },
    { name: "Finance Automation", planned: 35, actual: 18 },
    { name: "Agile Rollout", planned: 22, actual: 8.5 },
    { name: "Wagering Platform", planned: 65, actual: 6.3 },
    { name: "Core Banking", planned: 50, actual: 0 },
  ];
  const category = [
    { name: "Revenue Growth", value: 85, fill: colors.navy },
    { name: "Cost Reduction", value: 55, fill: colors.gold },
    { name: "Risk Mitigation Value", value: 25, fill: "#0f766e" },
    { name: "Customer Experience", value: 15, fill: "#94A3B8" },
  ];
  const forecast = [
    { q: "Q1 FY24", planned: 10, actual: 6, forecast: 6 },
    { q: "Q2 FY24", planned: 20, actual: 14, forecast: 14 },
    { q: "Q3 FY24", planned: 32, actual: 22, forecast: 22 },
    { q: "Q4 FY24", planned: 46, actual: 31, forecast: 31 },
    { q: "Q1 FY25", planned: 62, actual: 42, forecast: 42 },
    { q: "Q2 FY25", planned: 82, actual: 57, forecast: 57 },
    { q: "Q3 FY25", planned: 104, actual: 74, forecast: 74 },
    { q: "Q4 FY25", planned: 128, actual: 90, forecast: 92 },
    { q: "Q1 FY26", planned: 150, actual: 0, forecast: 116 },
    { q: "Q2 FY26", planned: 166, actual: 0, forecast: 134 },
    { q: "Q3 FY26", planned: 176, actual: 0, forecast: 151 },
    { q: "Q4 FY26", planned: 180, actual: 0, forecast: 168 },
  ];
  return (
    <div className="space-y-6">
      <Panel title="Benefits by Initiative">
        <div className="h-64">
          <ResponsiveContainer>
            <BarChart data={byInitiative} layout="vertical" margin={{ left: 30 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis type="category" dataKey="name" width={120} />
              <RechartsTooltip />
              <Bar dataKey="planned" fill={colors.navy} radius={[4, 4, 4, 4]} />
              <Bar dataKey="actual" fill={colors.gold} radius={[4, 4, 4, 4]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Panel>
      <Panel title="Benefits by Category">
        <div className="h-56">
          <ResponsiveContainer>
            <PieChart>
              <Pie data={category} dataKey="value" nameKey="name" outerRadius={90} label />
              {category.map((c) => (
                <Cell key={c.name} fill={c.fill} />
              ))}
            </PieChart>
          </ResponsiveContainer>
        </div>
      </Panel>
      <Panel title="Benefits Realisation Forecast">
        <div className="h-64">
          <ResponsiveContainer>
            <LineChart data={forecast}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="q" hide />
              <YAxis domain={[0, 200]} />
              <RechartsTooltip />
              <Line dataKey="planned" stroke={colors.navy} strokeDasharray="5 5" strokeWidth={2.2} />
              <Line dataKey="actual" stroke={colors.gold} strokeWidth={2.6} dot={false} />
              <Line dataKey="forecast" stroke={colors.gold} strokeDasharray="3 3" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="rounded-xl border-l-4 border-[#C8922A] bg-[#003366] p-3 text-sm text-white">At current trajectory, programme will realise HK$168M vs HK$180M target by FY26 end - 7% gap requires acceleration in Digital and Racing themes.</div>
      </Panel>
      <div className="grid gap-3 md:grid-cols-3">
        <Panel title="Digital Handle Growth"><p className="text-sm text-slate-700">Projected +HK$34M over 3 years if platform delivers on schedule.</p></Panel>
        <Panel title="Back-office Automation"><p className="text-sm text-slate-700">HK$22M cost avoidance confirmed from Finance programme.</p></Panel>
        <Panel title="Responsible Gambling"><p className="text-sm text-slate-700">HK$12M regulatory risk mitigation value assessed by Legal.</p></Panel>
      </div>
    </div>
  );
}

type PanelState =
  | { type: "dashboard-active" }
  | { type: "dashboard-health" }
  | { type: "dashboard-stakeholder" }
  | { type: "risk-detail"; id: string }
  | { type: "okr-detail"; id: "racing" | "digital" | "people" | "compliance" }
  | { type: "initiative-detail"; id: string }
  | { type: "kpi-ontrack" }
  | { type: "kpi-budget" }
  | { type: "kpi-row"; id: string }
  | { type: "issue-detail"; id: string }
  | null;

function App() {
  const [page, setPage] = useState<PageKey>("dashboard");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [panel, setPanel] = useState<PanelState>(null);
  const [benefitsOpen, setBenefitsOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }, []);

  const openInitiative = useCallback((id: string, navigate?: boolean) => {
    if (navigate) setPage("initiatives");
    setPanel({ type: "initiative-detail", id });
  }, []);

  const selectedInitiative = panel?.type === "initiative-detail" ? initiatives.find((i) => i.id === panel.id) ?? null : null;
  const selectedRisk = panel?.type === "risk-detail" ? risks.find((r) => r.id === panel.id) ?? null : null;
  const selectedIssue = panel?.type === "issue-detail" ? issues.find((r) => r.id === panel.id) ?? null : null;

  return (
    <div className="min-h-screen bg-[#F4F6F9] text-[#1A1A2E]">
      <div className="flex min-h-screen">
        <aside className={cn("fixed inset-y-0 left-0 z-40 flex w-[280px] flex-col bg-gradient-to-b from-[#003366] to-[#001A3A] p-4 text-white transition-transform duration-200 md:w-[84px] lg:w-[280px]", mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0")}>
          <div className="mb-6 flex items-center justify-between md:justify-center lg:justify-between">
            <div className="hidden items-center gap-2 lg:flex">
              <div className="rounded-full bg-[#C8922A] px-3 py-1 text-xs font-bold text-[#003366]">HKJC</div>
              <span className="text-sm font-semibold">TransformHub</span>
            </div>
            <button type="button" className="rounded p-1 md:hidden" onClick={() => setMobileOpen(false)}><X className="h-5 w-5" /></button>
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = page === item.key;
              return (
                <button key={item.key} type="button" onClick={() => { setPage(item.key); setMobileOpen(false); }} className={cn("group relative flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm transition", active ? "bg-[#E8EFF8] text-[#C8922A]" : "text-slate-200 hover:bg-white/10")}>
                  <span className={cn("absolute left-0 top-1/2 h-0 w-1 -translate-y-1/2 rounded-r-full bg-[#C8922A] transition-all", active && "h-7")} />
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="hidden lg:block">
                    <span className="block font-semibold">{item.label}</span>
                    <span className={cn("block text-xs", active ? "text-[#1A1A2E]" : "text-slate-300")}>{item.subtitle}</span>
                  </span>
                </button>
              );
            })}
          </nav>
          <p className="mt-auto hidden text-center text-xs italic text-[#C8922A] lg:block">For the Betterment of Society</p>
        </aside>

        <div className="flex-1 md:ml-[84px] lg:ml-[280px]">
          <header className="sticky top-0 z-30 border-b border-[#C8922A] bg-white/90 backdrop-blur">
            <div className="flex items-center justify-between px-4 py-3 md:px-6">
              <div className="flex items-center gap-3">
                <button type="button" className="rounded border border-slate-300 p-2 md:hidden" onClick={() => setMobileOpen(true)}><Menu className="h-4 w-4" /></button>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-[#003366] px-2 py-0.5 text-xs font-bold text-[#C8922A]">HKJC</span>
                    <h1 className="text-lg font-bold text-[#1A1A2E]">TransformHub</h1>
                  </div>
                  <p className="text-xs text-slate-500">Transformation Office · Programme Management Platform</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="hidden text-sm text-slate-600 md:inline">Designed and built by Alexandre Lee</span>
                <button type="button" className="relative rounded-xl border border-slate-300 p-2 hover:border-[#C8922A]"><Bell className="h-4 w-4" /><span className="absolute -right-1 -top-1 rounded-full bg-[#D0021B] px-1 text-[10px] text-white">4</span></button>
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#003366] text-sm font-bold text-white">SM</div>
              </div>
            </div>
          </header>

          <main className="p-4 md:p-6">
            <AnimatePresence mode="wait">
              <motion.div key={page} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.1 }}>
                {page === "dashboard" && (
                  <DashboardPage
                    onOpenPanel={setPanel}
                    onOpenBenefits={() => setBenefitsOpen(true)}
                    onOpenInitiative={(id) => openInitiative(id, true)}
                  />
                )}
                {page === "kpis" && (
                  <KpiPage
                    onOpenBenefits={() => setBenefitsOpen(true)}
                    onOpenPanel={setPanel}
                  />
                )}
                {page === "risks" && <RisksPage onOpenPanel={setPanel} />}
                {page === "initiatives" && <InitiativesPage onOpenInitiative={(id) => openInitiative(id)} />}
                {page === "roadmap" && <RoadmapPage onOpenInitiative={(id) => openInitiative(id)} />}
                {page === "okrs" && <OkrsPage onOpenPanel={setPanel} onToast={showToast} />}
                {page === "stakeholders" && <StakeholdersPage onToast={showToast} />}
                {page === "tom" && <TomPage onOpenInitiative={(id) => openInitiative(id, true)} onToast={showToast} />}
                {page === "governance" && <GovernancePage onToast={showToast} />}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>

      <CenterModal open={benefitsOpen} onClose={() => setBenefitsOpen(false)} title="Benefits Realisation Analysis" breadcrumb="Dashboard → Benefits Realised" onExport={() => showToast("Report exported to PDF")}>
        <BenefitsDetailContent />
      </CenterModal>

      <SlideDrawer open={panel?.type === "dashboard-active"} onClose={() => setPanel(null)} title="Active Initiatives Breakdown" breadcrumb="Dashboard → Active Initiatives" onExport={() => showToast("Report exported to PDF")}>
        <DashboardActiveDrawer />
      </SlideDrawer>

      <SlideDrawer open={panel?.type === "dashboard-health"} onClose={() => setPanel(null)} title="Programme Health Deep Dive" breadcrumb="Dashboard → Programme Health" onExport={() => showToast("Report exported to PDF")}>
        <DashboardHealthDrawer />
      </SlideDrawer>

      <SlideDrawer open={panel?.type === "dashboard-stakeholder"} onClose={() => setPanel(null)} title="Stakeholder Alignment Detail" breadcrumb="Dashboard → Stakeholder Alignment" onExport={() => showToast("Report exported to PDF")}>
        <StakeholderAlignmentDrawer />
      </SlideDrawer>

      <SlideDrawer open={panel?.type === "kpi-ontrack"} onClose={() => setPanel(null)} title="Initiative Health Analysis" breadcrumb="KPI Performance Monitor → Initiative On-Track Rate" onExport={() => showToast("Report exported to PDF")}>
        <KpiOnTrackDrawer />
      </SlideDrawer>

      <SlideDrawer open={panel?.type === "kpi-budget"} onClose={() => setPanel(null)} title="Budget Utilisation Analysis" breadcrumb="KPI Performance Monitor → Budget Utilisation" onExport={() => showToast("Report exported to PDF")}>
        <KpiBudgetDrawer />
      </SlideDrawer>

      <SlideDrawer open={Boolean(selectedRisk)} onClose={() => setPanel(null)} title="Risk Detail" width={480} breadcrumb="Risk Register → Risk Detail" onExport={() => showToast("Report exported to PDF")}>
        {selectedRisk && <RiskDetail risk={selectedRisk} onOpenInitiative={(id) => openInitiative(id, true)} />}
      </SlideDrawer>

      <SlideDrawer open={Boolean(selectedIssue)} onClose={() => setPanel(null)} title="Issue Detail" width={480} breadcrumb="Risk Register → Issue Detail" onExport={() => showToast("Report exported to PDF")}>
        {selectedIssue && <IssueDetail issue={selectedIssue} />}
      </SlideDrawer>

      <SlideDrawer open={Boolean(selectedInitiative)} onClose={() => setPanel(null)} title="Initiative Deep Dive" width={560} breadcrumb="Initiative Portfolio → Initiative Detail" onExport={() => showToast("Report exported to PDF")}>
        {selectedInitiative && <InitiativeDetail initiative={selectedInitiative} />}
      </SlideDrawer>

      <SlideDrawer open={panel?.type === "okr-detail"} onClose={() => setPanel(null)} title="OKR Detail" breadcrumb="Dashboard → OKR Confidence" onExport={() => showToast("Report exported to PDF")}>
        {panel?.type === "okr-detail" && <OkrDetailDrawer id={panel.id} onOpenInitiative={(id) => openInitiative(id, true)} />}
      </SlideDrawer>

      <SlideDrawer open={panel?.type === "kpi-row"} onClose={() => setPanel(null)} title="KPI Detailed Analysis" breadcrumb="KPI Performance Monitor → KPI Scorecard" onExport={() => showToast("Report exported to PDF")}>
        {panel?.type === "kpi-row" && <KpiDetailDrawer id={panel.id} onOpenBenefits={() => setBenefitsOpen(true)} />}
      </SlideDrawer>

      <ExportToast message={toast} />
    </div>
  );
}

function DashboardPage({ onOpenPanel, onOpenBenefits, onOpenInitiative }: { onOpenPanel: (panel: PanelState) => void; onOpenBenefits: () => void; onOpenInitiative: (id: string) => void }) {
  const hint = useHintText("dashboard");
  const pulse = usePagePulse("dashboard");
  const [cellPopover, setCellPopover] = useState<{ x: number; y: number; item: (typeof dashboardHeatmap)[string][number] } | null>(null);
  const [milestonePopover, setMilestonePopover] = useState<{ x: number; y: number; item: { name: string; initiative: string; status: string; planned: string; revised?: string; owner: string; criteria: string[]; note?: string; initiativeId: string } } | null>(null);

  const cards = [
    { key: "active", title: "Active Initiatives", action: () => { pulse.acknowledge(); onOpenPanel({ type: "dashboard-active" }); }, body: <><p className="text-3xl font-bold"><CountUp value={12} /></p><p className="mt-1 flex items-center gap-1 text-sm text-emerald-700"><TrendingUp className="h-4 w-4" />3 ahead of schedule</p></> },
    { key: "health", title: "Overall Programme Health", action: () => { pulse.acknowledge(); onOpenPanel({ type: "dashboard-health" }); }, body: <><div className="h-24"><ResponsiveContainer><PieChart><Pie data={[{ n: "G", v: 67 }, { n: "A", v: 25 }, { n: "R", v: 8 }]} dataKey="v" innerRadius={28} outerRadius={42}><Cell fill={colors.success} /><Cell fill={colors.warning} /><Cell fill={colors.danger} /></Pie></PieChart></ResponsiveContainer></div><p className="text-xs text-slate-500">67% Green / 25% Amber / 8% Red</p></> },
    { key: "benefits", title: "Benefits Realised", action: () => { pulse.acknowledge(); onOpenBenefits(); }, body: <><p className="text-2xl font-bold">HK$<CountUp value={42} />M</p><p className="text-xs text-slate-500">of HK$180M target</p><div className="mt-2 h-2 rounded-full bg-slate-200"><motion.div initial={{ width: 0 }} animate={{ width: "23%" }} className="h-2 rounded-full bg-[#C8922A]" /></div></> },
    { key: "stakeholder", title: "Stakeholder Alignment", action: () => { pulse.acknowledge(); onOpenPanel({ type: "dashboard-stakeholder" }); }, body: <><p className="text-2xl font-bold"><CountUp value={78} suffix="%" /></p><div className="h-16"><ResponsiveContainer><LineChart data={[{ m: "Oct", v: 58 }, { m: "Nov", v: 62 }, { m: "Dec", v: 65 }, { m: "Jan", v: 67 }, { m: "Feb", v: 70 }, { m: "Mar", v: 67 }]}><Line dataKey="v" stroke={colors.success} strokeWidth={2.3} dot={false} /></LineChart></ResponsiveContainer></div></> },
  ];

  const risksSummary = [
    { id: "R001", title: "Legacy System Migration Delays", owner: "IT", score: 84, status: "Red" as Status },
    { id: "R004", title: "Regulatory Rule Changes", owner: "LG", score: 71, status: "Amber" as Status },
    { id: "R002", title: "Senior Change Resistance", owner: "HR", score: 63, status: "Amber" as Status },
    { id: "R005", title: "Vendor Capacity Constraints", owner: "PM", score: 58, status: "Amber" as Status },
    { id: "R009", title: "Data Lineage Gaps", owner: "DA", score: 44, status: "Green" as Status },
  ];

  const milestones = [
    { name: "Racing - UX Sign-off", initiative: "Member Experience Redesign", initiativeId: "I007", status: "On Track", planned: "03 Apr 2025", owner: "Head of Product", criteria: ["All user testing sessions completed with >=80% satisfaction", "Design system approved by Brand & Legal teams"] },
    { name: "Racing - UAT Gate", initiative: "Wagering Platform Modernisation", initiativeId: "I002", status: "At Risk", planned: "24 Apr 2025", revised: "12 May 2025", owner: "IT Lead", note: "Delay attributed to third-party payment gateway integration issues", criteria: ["Zero P1/P2 defects outstanding", "Performance benchmarks met (response time <200ms)"] },
    { name: "Digital - Data Migration", initiative: "Core Banking System Upgrade", initiativeId: "I001", status: "On Track", planned: "11 Apr 2025", owner: "CDAO", criteria: ["100% of racing data migrated with verified lineage", "Data quality score >=95% on validation report"] },
    { name: "Digital - Cyber Review", initiative: "Cloud Security", initiativeId: "I001", status: "On Track", planned: "18 May 2025", owner: "CISO", criteria: ["Penetration testing complete with no Critical findings", "Security baseline compliance report approved by Audit Committee"] },
    { name: "People - OKR Coaching", initiative: "OKR Framework Implementation", initiativeId: "I004", status: "On Track", planned: "27 Mar 2025", owner: "HR Director", criteria: ["All 10 Agile team leads completed OKR coaching certification", "OKR cascade documented for 85% of divisions"] },
    { name: "People - Pulse Survey", initiative: "HR Operating Model Redesign", initiativeId: "I009", status: "At Risk", planned: "22 May 2025", revised: "05 Jun 2025", owner: "Chief HR Officer", note: "HR system access issues delaying survey platform configuration", criteria: ["Survey deployed to 100% of staff", ">=70% response rate achieved"] },
  ];

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card, idx) => (
          <div key={card.key} className="relative">
            {pulse.show && idx === 0 && <span className="pointer-events-none absolute -inset-1 rounded-2xl border-2 border-[#C8922A] animate-pulse" />}
            {pulse.show && idx === 0 && <span className="pointer-events-none absolute -top-7 left-2 rounded-md border border-[#C8922A] bg-white px-2 py-0.5 text-[10px] text-slate-600">Click to explore</span>}
            <button type="button" onClick={card.action} className={cn("flex h-full min-h-[164px] w-full flex-col rounded-2xl border border-slate-200 border-l-4 border-l-[#C8922A] bg-white p-4 text-left shadow-sm", interactiveClass)}>
              <p className="text-sm font-semibold text-[#003366]">{card.title}</p>
              {card.body}
            </button>
          </div>
        ))}
      </div>
      {hint && <p className="text-xs italic text-slate-500">Click to explore</p>}

      <div className="grid gap-4 xl:grid-cols-5">
        <Panel title="Transformation Portfolio Heatmap" className="xl:col-span-3">
          <div className="grid grid-cols-[190px_repeat(4,minmax(0,1fr))] gap-1 text-[11px]">
            <div />
            {["Q1", "Q2", "Q3", "Q4"].map((q) => <div key={q} className="text-center font-semibold text-slate-600">{q}</div>)}
            {themes.map((theme) => (
              <>
                <div key={`${theme}-title`} className="pr-2 text-xs font-semibold text-slate-700">{theme}</div>
                {dashboardHeatmap[theme].map((cell) => (
                  <button
                    type="button"
                    key={`${theme}-${cell.name}`}
                    onClick={(e) => setCellPopover({ x: e.clientX, y: e.clientY, item: cell })}
                    className={cn("rounded-lg border p-2 text-left text-[10px] text-white", interactiveClass)}
                    style={{ backgroundColor: statusColor[cell.status] }}
                  >
                    {cell.name}
                  </button>
                ))}
              </>
            ))}
          </div>
          <div className="mt-3 flex items-center gap-3 text-xs">{(["Green", "Amber", "Red"] as Status[]).map((s) => <div key={s} className="flex items-center gap-1"><span className="h-3 w-3 rounded-full" style={{ backgroundColor: statusColor[s] }} />{s}</div>)}</div>
          {hint && <p className="mt-2 text-xs italic text-slate-500">Click to explore</p>}
        </Panel>

        <Panel title="Top Risks Snapshot" className="xl:col-span-2">
          {risksSummary.map((r) => (
            <div
              key={r.id}
              role="button"
              tabIndex={0}
              onClick={() => onOpenPanel({ type: "risk-detail", id: r.id })}
              onKeyDown={(e) => handleKeyboardActivate(e, () => onOpenPanel({ type: "risk-detail", id: r.id }))}
              className={cn("mb-3 rounded-xl border border-slate-200 p-2", interactiveClass)}
            >
              <div className="flex items-center justify-between"><p className="text-xs font-semibold text-slate-700">{r.title}</p><span className="rounded-full bg-[#003366] px-2 py-0.5 text-[10px] text-white">{r.owner}</span></div>
              <div className="mt-1 flex items-center justify-between"><RagPill status={r.status} /><div className="h-1.5 w-28 rounded-full bg-slate-200"><div className="h-1.5 rounded-full bg-[#C8922A]" style={{ width: `${r.score}%` }} /></div></div>
            </div>
          ))}
          {hint && <p className="text-xs italic text-slate-500">Click to explore</p>}
        </Panel>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="Milestone Timeline - Next 60 Days">
          <div className="space-y-4">
            {milestones.map((m, idx) => (
              <div key={m.name} className="relative rounded-xl border border-slate-200 p-2">
                <div className="h-1 rounded-full bg-slate-200" />
                <button
                  type="button"
                  onClick={(e) => setMilestonePopover({ x: e.clientX, y: e.clientY, item: m })}
                  className={cn("absolute top-[6px] h-3 w-3 rotate-45", m.status === "At Risk" ? "bg-[#D0021B]" : "bg-[#C8922A]", interactiveClass)}
                  style={{ left: `${10 + idx * 13}%` }}
                />
                <div className="mt-3 flex items-center justify-between text-xs"><span className="font-semibold text-slate-700">{m.name}</span><span className="text-slate-500">{m.planned}</span></div>
              </div>
            ))}
          </div>
          {hint && <p className="mt-2 text-xs italic text-slate-500">Click to explore</p>}
        </Panel>

        <Panel title="OKR Confidence Pulse">
          <div className="grid grid-cols-2 gap-3">
            {[
              { key: "racing", name: "Racing Excellence OKR", val: 82, c: colors.success },
              { key: "digital", name: "Digital Transformation OKR", val: 61, c: colors.warning },
              { key: "people", name: "People & Culture OKR", val: 74, c: colors.success },
              { key: "compliance", name: "Compliance & Risk OKR", val: 45, c: colors.danger },
            ].map((p) => (
              <button key={p.key} type="button" onClick={() => onOpenPanel({ type: "okr-detail", id: p.key as "racing" | "digital" | "people" | "compliance" })} className={cn("rounded-xl border border-slate-200 p-2 text-center", interactiveClass)}>
                <div className="relative mx-auto h-24 w-24">
                  <ResponsiveContainer>
                    <RadialBarChart data={[{ value: p.val }]} cx="50%" cy="50%" innerRadius="70%" outerRadius="100%" startAngle={90} endAngle={-270}>
                      <RadialBar dataKey="value" cornerRadius={10} fill={p.c} />
                    </RadialBarChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <p className="text-sm font-bold leading-none">{p.val}%</p>
                  </div>
                </div>
                <p className="mt-1 text-[11px] text-slate-600">{p.name}</p>
              </button>
            ))}
          </div>
          {hint && <p className="mt-2 text-xs italic text-slate-500">Click to explore</p>}
        </Panel>
      </div>

      <Panel title="Recent Activity Feed">
        {[
          ["09:42", "PM", "Initiative status updated", "#C8922A"],
          ["09:15", "IT", "New risk logged", "#D0021B"],
          ["Yesterday", "SM", "Stakeholder meeting completed", "#2563eb"],
          ["Yesterday", "HR", "Milestone achieved", "#2D8653"],
          ["2d ago", "TO", "OKR confidence updated", "#7c3aed"],
          ["3d ago", "LG", "Document uploaded", "#9ca3af"],
        ].map((a) => (
          <div key={String(a[0])} className="flex items-start gap-3 border-b border-slate-100 py-2 last:border-none"><span className="mt-1 h-2.5 w-2.5 rounded-full" style={{ backgroundColor: String(a[3]) }} /><div className="w-14 text-xs text-slate-500">{a[0]}</div><span className="rounded-full bg-[#003366] px-2 py-0.5 text-[10px] text-white">{a[1]}</span><p className="text-sm text-slate-700">{a[2]}</p></div>
        ))}
      </Panel>

      <AnimatePresence>
        {cellPopover && (
          <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="fixed z-[65] w-[320px] rounded-xl border border-[#003366] bg-white p-3 shadow-2xl" style={{ left: Math.min(cellPopover.x + 12, window.innerWidth - 340), top: Math.max(10, cellPopover.y - 170) }}>
            <div className="mb-2 flex items-center justify-between"><p className="text-sm font-bold text-[#003366]">{cellPopover.item.name}</p><RagPill status={cellPopover.item.status} /></div>
            <p className="text-xs text-slate-500">{cellPopover.item.quarter}</p>
            <p className="mt-1 inline-block rounded-full bg-[#E8EFF8] px-2 py-0.5 text-[11px] text-[#003366]">{themes.find((theme) => dashboardHeatmap[theme].some((cell) => cell.name === cellPopover.item.name))}</p>
            <div className="mt-2 space-y-2 text-xs">
              <div>Progress<div className="h-1.5 rounded-full bg-slate-200"><div className="h-1.5 rounded-full bg-[#003366]" style={{ width: `${cellPopover.item.progress}%` }} /></div><p className="mt-0.5 text-[11px] text-slate-500">{cellPopover.item.progress}% complete</p></div>
              <div>Budget HK${cellPopover.item.used}M of HK${cellPopover.item.budget}M<div className="mt-1 h-1.5 rounded-full bg-slate-200"><div className="h-1.5 rounded-full bg-[#C8922A]" style={{ width: `${Math.min((cellPopover.item.used / cellPopover.item.budget) * 100, 100)}%` }} /></div></div>
              <div>Schedule {cellPopover.item.schedule}</div>
              <div className="rounded bg-slate-50 px-2 py-1">Owner: {cellPopover.item.owner}</div>
              <div className="text-amber-700">Top risk: {cellPopover.item.risk}</div>
              <button type="button" className="text-[#003366] underline" onClick={() => { setCellPopover(null); onOpenInitiative(cellPopover.item.initiativeId); }}>Open Full Initiative →</button>
            </div>
            <button type="button" className="absolute right-2 top-2 text-slate-400" onClick={() => setCellPopover(null)}><X className="h-4 w-4" /></button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {milestonePopover && (
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="fixed z-[65] w-[280px] rounded-xl border border-slate-200 bg-white p-3 shadow-[0_12px_30px_rgba(0,26,58,0.25)]" style={{ left: Math.min(milestonePopover.x - 120, window.innerWidth - 300), top: Math.max(10, milestonePopover.y - 210) }}>
            <p className="text-sm font-bold text-[#003366]">{milestonePopover.item.name}</p>
            <p className="text-xs italic text-[#C8922A]">{milestonePopover.item.initiative}</p>
            <div className="mt-2 flex items-center justify-between"><RagPill status={milestonePopover.item.status === "At Risk" ? "Red" : "Green"} /><span className="text-xs text-slate-500">{milestonePopover.item.planned}</span></div>
            {milestonePopover.item.revised && <p className="mt-1 text-xs text-amber-700">Revised: {milestonePopover.item.revised}</p>}
            <p className="mt-1 text-xs">Owner: {milestonePopover.item.owner}</p>
            <ul className="mt-1 list-disc pl-5 text-xs text-slate-600">{milestonePopover.item.criteria.map((c) => <li key={c}>{c}</li>)}</ul>
            {milestonePopover.item.note && <p className="mt-1 text-xs text-amber-700">{milestonePopover.item.note}</p>}
            <button type="button" className="mt-2 text-xs text-[#003366] underline" onClick={() => onOpenInitiative(milestonePopover.item.initiativeId)}>View Initiative →</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function DashboardActiveDrawer() {
  const stacked = [
    { theme: "Racing & Wagering", green: 2, amber: 1, red: 0 },
    { theme: "Digital & Tech", green: 1, amber: 1, red: 1 },
    { theme: "People & Culture", green: 3, amber: 0, red: 0 },
    { theme: "Finance & Ops", green: 1, amber: 1, red: 0 },
    { theme: "Responsible Gaming", green: 0, amber: 1, red: 0 },
  ];
  const trend = [
    { m: "Oct", v: 58 },
    { m: "Nov", v: 62 },
    { m: "Dec", v: 65 },
    { m: "Jan", v: 67 },
    { m: "Feb", v: 70 },
    { m: "Mar", v: 67 },
  ];
  return (
    <div className="space-y-4">
      <Panel title="Portfolio at a Glance"><div className="grid grid-cols-3 gap-2 text-xs"><div className="rounded-full bg-emerald-50 px-3 py-2 text-center text-emerald-700">On Track: 8</div><div className="rounded-full bg-amber-50 px-3 py-2 text-center text-amber-700">At Risk: 3</div><div className="rounded-full bg-red-50 px-3 py-2 text-center text-red-700">Critical: 1</div></div></Panel>
      <Panel title="Initiatives by Strategic Theme">
        <div className="h-64"><ResponsiveContainer><BarChart data={stacked} layout="vertical" margin={{ left: 10 }}><CartesianGrid strokeDasharray="3 3" /><XAxis type="number" /><YAxis type="category" dataKey="theme" width={120} /><RechartsTooltip /><Bar dataKey="green" stackId="a" fill={colors.success} /><Bar dataKey="amber" stackId="a" fill={colors.warning} /><Bar dataKey="red" stackId="a" fill={colors.danger} /></BarChart></ResponsiveContainer></div>
      </Panel>
      <Panel title="Initiatives Ahead of Schedule">
        {[
          ["Agile Ways of Working Rollout", "People", "+12 days", "HR Director"],
          ["OKR Framework Implementation", "People", "+8 days", "Transformation Office"],
          ["Finance Process Automation", "Finance", "+5 days", "CFO"],
        ].map((a) => (
          <div key={String(a[0])} className="mb-2 rounded-xl border border-slate-200 p-2 text-xs"><p className="font-semibold">{a[0]}</p><div className="mt-1 flex justify-between"><span className="rounded-full bg-[#E8EFF8] px-2 py-0.5 text-[#003366]">{a[1]}</span><span className="text-emerald-700">{a[2]}</span><span className="rounded-full bg-slate-100 px-2 py-0.5">{a[3]}</span></div></div>
        ))}
      </Panel>
      <Panel title="Schedule Performance Trend">
        <div className="h-56"><ResponsiveContainer><AreaChart data={trend}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="m" /><YAxis domain={[40, 90]} /><RechartsTooltip /><ReferenceLine y={80} stroke="#94a3b8" strokeDasharray="5 5" label="Target" /><Area dataKey="v" stroke={colors.gold} fill="#f7e7c5" strokeWidth={2.4} /></AreaChart></ResponsiveContainer></div>
      </Panel>
    </div>
  );
}

function DashboardHealthDrawer() {
  const rows = [
    { theme: themes[0], split: [60, 30, 10], summary: "Wagering Platform on track; Member Experience at risk" },
    { theme: themes[1], split: [45, 30, 25], summary: "Core Banking delayed; Data Governance progressing" },
    { theme: themes[2], split: [85, 15, 0], summary: "Strongest performing theme; OKR adoption exceeding target" },
    { theme: themes[3], split: [70, 30, 0], summary: "Finance Automation ahead; Cost Optimisation in early stage" },
    { theme: themes[4], split: [50, 30, 20], summary: "RG training completion lagging; analytics programme on track" },
  ];
  const trend = [
    { m: "Oct", green: 55, amber: 30, red: 15 },
    { m: "Nov", green: 58, amber: 28, red: 14 },
    { m: "Dec", green: 60, amber: 27, red: 13 },
    { m: "Jan", green: 63, amber: 25, red: 12 },
    { m: "Feb", green: 65, amber: 25, red: 10 },
    { m: "Mar", green: 67, amber: 25, red: 8 },
  ];
  return (
    <div className="space-y-4">
      <Panel title="Health by Strategic Theme">
        {rows.map((r) => (
          <div key={r.theme} className="mb-3 grid grid-cols-[1fr_70px] gap-2 rounded-xl border border-slate-200 p-2 text-xs">
            <div>
              <p className="font-semibold">{r.theme}</p>
              <p className="text-slate-500">{r.summary}</p>
            </div>
            <div className="h-16"><ResponsiveContainer><PieChart><Pie data={[{ v: r.split[0] }, { v: r.split[1] }, { v: r.split[2] }]} dataKey="v" innerRadius={10} outerRadius={20}><Cell fill={colors.success} /><Cell fill={colors.warning} /><Cell fill={colors.danger} /></Pie></PieChart></ResponsiveContainer></div>
          </div>
        ))}
      </Panel>
      <Panel title="Health Trend - Last 6 Months"><div className="h-56"><ResponsiveContainer><AreaChart data={trend}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="m" /><YAxis /><RechartsTooltip /><Area dataKey="green" stackId="1" fill={colors.success} stroke={colors.success} /><Area dataKey="amber" stackId="1" fill={colors.warning} stroke={colors.warning} /><Area dataKey="red" stackId="1" fill={colors.danger} stroke={colors.danger} /></AreaChart></ResponsiveContainer></div></Panel>
      <Panel title="Key Health Drivers">
        <div className="grid gap-3 md:grid-cols-2 text-sm">
          <div><p className="mb-2 font-semibold text-emerald-700">Improving</p><ul className="list-disc space-y-1 pl-5 text-slate-700"><li>People theme agile maturity (+2 levels this quarter)</li><li>Finance automation scope locked</li><li>Stakeholder alignment up 8%</li></ul></div>
          <div><p className="mb-2 font-semibold text-red-700">Declining</p><ul className="list-disc space-y-1 pl-5 text-slate-700"><li>Core Banking vendor delivery at risk</li><li>Member Experience scope creep detected</li><li>RG training completion below threshold</li></ul></div>
        </div>
      </Panel>
    </div>
  );
}

function StakeholderAlignmentDrawer() {
  const radar = [
    { theme: "Racing", score: 82 },
    { theme: "Digital", score: 71 },
    { theme: "People", score: 88 },
    { theme: "Finance", score: 79 },
    { theme: "RG", score: 68 },
  ];
  const list = [
    ["CEO / Executive Director", 5, "Improving", "5 days ago"],
    ["MD, Racing", 4, "Improving", "3 days ago"],
    ["CFO", 4, "Stable", "8 days ago"],
    ["CTO / IT Leadership", 3, "Improving", "2 days ago"],
    ["Chief HR Officer", 4, "Improving", "6 days ago"],
    ["Head of Legal & Compliance", 3, "Stable", "12 days ago"],
    ["Head of Member Services", 3, "Declining", "21 days ago"],
    ["Head of Racing Operations", 2, "Declining", "31 days ago"],
  ];
  return (
    <div className="space-y-4">
      <Panel title="Alignment by Stakeholder Tier">
        {[ ["Executive Leadership",85,"#2D8653"], ["Senior Management",76,"#F5A623"], ["Middle Management & Teams",62,"#F5A623"] ].map((r) => <div key={String(r[0])} className="mb-2 text-xs"><div className="mb-1 flex justify-between"><span>{r[0]}</span><span>{r[1]}%</span></div><div className="h-2 rounded-full bg-slate-200"><div className="h-2 rounded-full" style={{ width: `${r[1]}%`, background: String(r[2]) }} /></div></div>)}
      </Panel>
      <Panel title="Individual Alignment Scores">
        {list.map((s, idx) => (
          <div key={String(s[0])} className={cn("mb-2 flex items-center justify-between rounded-xl border border-slate-200 p-2 text-xs", idx === 6 && "border-l-4 border-l-amber-400", idx === 7 && "border-l-4 border-l-red-500")}>
            <div className="flex items-center gap-2"><span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#003366] text-[10px] text-white">{String(s[0]).split(" ").map((n) => n[0]).slice(0, 2).join("")}</span><div><p className="font-semibold">{s[0]}</p><p className="text-slate-500">{s[3]}</p></div></div>
            <div className="text-right"><p className="text-[#C8922A]">{"●".repeat(Number(s[1]))}{"○".repeat(5 - Number(s[1]))}</p><p className={cn("text-[11px]", String(s[2]) === "Declining" ? "text-red-600" : "text-slate-500")}>{String(s[2]) === "Improving" ? "↑ Improving" : String(s[2]) === "Stable" ? "→ Stable" : "↓ Declining"}</p></div>
          </div>
        ))}
      </Panel>
      <Panel title="Alignment by Theme"><div className="h-56"><ResponsiveContainer><RadarChart data={radar}><PolarGrid /><PolarAngleAxis dataKey="theme" /><Radar dataKey="score" stroke={colors.gold} fill={colors.navy} fillOpacity={0.35} /></RadarChart></ResponsiveContainer></div></Panel>
      <Panel title="Actions Required">
        <div className="space-y-2 text-sm"><div className="rounded-xl border-l-4 border-amber-400 bg-amber-50 p-3">Re-engage Head of Member Services - last contact 21 days ago. Schedule alignment workshop before Q4 planning cycle.</div><div className="rounded-xl border-l-4 border-red-500 bg-red-50 p-3">Escalate Head of Racing Operations alignment - 31 days since last contact. Risk of sponsorship withdrawal on Member Experience initiative.</div></div>
      </Panel>
    </div>
  );
}

function OkrDetailDrawer({ id, onOpenInitiative }: { id: "racing" | "digital" | "people" | "compliance"; onOpenInitiative: (id: string) => void }) {
  const map = {
    racing: {
      title: "Racing & Wagering Excellence",
      confidence: 82,
      owner: "MD, Racing",
      sponsor: "CEO",
      pillar: "Racing Excellence",
      objective: "Deliver a world-class digital wagering experience that grows HKJC's digital handle by 15% YoY while maintaining industry-leading responsible gambling standards",
      why: [
        "Digital wagering is now HKJC's primary growth lever and underpins future sustainability of racing revenue.",
        "Execution quality on reliability and product innovation determines both member retention and responsible wagering outcomes.",
      ],
      success: ["Digital handle grows 15% YoY", "Platform reliability remains at or above 99.9%", "Four new digital wagering products launched with responsible controls"],
      trend: [70, 75, 80, 82],
      initiatives: ["I002", "I007", "I008"],
      positives: ["Digital handle remains close to target trajectory", "Platform stability actions reduced outage recurrence", "Product pipeline governance improved"],
      risks: ["Member app redesign may delay in-play launch", "Vendor integration lead times are volatile"],
      actions: [
        ["Lock Q4 product release governance and scope", "Head of Product", "High", "+4%"],
        ["Complete payment gateway performance hardening", "CTO", "High", "+3%"],
        ["Expand RG-by-design checks in new product backlog", "Compliance Lead", "Medium", "+2%"],
      ],
      krs: [
        { no: "KR1", desc: "Grow digital wagering handle to HK$7.2B", actual: "HK$6.8B", target: "HK$7.2B", achievement: 94, status: "Amber" as Status, variance: "-HK$0.4B", history: [{ q: "Q1", actual: "HK$5.4B", target: "HK$5.8B", status: "Amber" }, { q: "Q2", actual: "HK$6.1B", target: "HK$6.5B", status: "Amber" }, { q: "Q3", actual: "HK$6.8B", target: "HK$7.2B", status: "Amber" }], commentary: "Trending well and expected to close gap with Q4 app enhancements.", next: "Q4 in-play beta launch decision" },
        { no: "KR2", desc: "Achieve 99.9% wagering platform uptime", actual: "99.7%", target: "99.9%", achievement: 100, status: "Green" as Status, variance: "-0.2pp", history: [{ q: "Q1", actual: "99.4%", target: "99.9%", status: "Amber" }, { q: "Q2", actual: "99.6%", target: "99.9%", status: "Amber" }, { q: "Q3", actual: "99.7%", target: "99.9%", status: "Green" }], commentary: "Two Q3 incidents resolved; monitoring controls strengthened.", next: "Resilience test cycle complete by 31 Mar" },
        { no: "KR3", desc: "Launch 4 new wagering product types", actual: "2 of 4", target: "4", achievement: 50, status: "Amber" as Status, variance: "-2 launches", history: [{ q: "Q1", actual: "1", target: "1", status: "Green" }, { q: "Q2", actual: "2", target: "2", status: "Green" }, { q: "Q3", actual: "2", target: "3", status: "Amber" }], commentary: "Parlay launched in Feb; in-play deferred to Q4.", next: "Scope gate for same-race multi by 12 Apr" },
      ],
    },
    digital: {
      title: "Digital & Technology Uplift",
      confidence: 61,
      owner: "Chief Technology Officer",
      sponsor: "CEO",
      pillar: "Digital Leadership",
      objective: "Build a resilient, cloud-native technology foundation that enables data-driven decision making and supports 99.9% system availability across all Club operations",
      why: ["Cloud-native enablement is the backbone for all digital initiatives and throughput.", "Data quality and team capability are key constraints on acceleration."],
      success: ["Eight core systems migrated", "Enterprise data quality at 90%+", "Ten delivery teams certified at agile maturity 3+"],
      trend: [72, 68, 65, 61],
      initiatives: ["I001", "I008", "I003"],
      positives: ["Data catalogue rollout improving confidence", "Agile certification pipeline remains active"],
      risks: ["Core Banking delay remains on critical path", "Cloud security finding blocks two migration workstreams"],
      actions: [["Executive escalation on Core Banking recovery", "CTO", "Urgent", "+8%"], ["Close P1 security finding with dedicated vendor squad", "CISO", "Urgent", "+6%"], ["Protect agile certification capacity through Q4", "HR Director", "High", "+3%"]],
      krs: [
        { no: "KR1", desc: "Migrate 8 core systems to cloud", actual: "3 of 8", target: "8", achievement: 38, status: "Red" as Status, variance: "-5 systems", history: [{ q: "Q1", actual: "2", target: "3", status: "Amber" }, { q: "Q2", actual: "3", target: "5", status: "Red" }, { q: "Q3", actual: "3", target: "8", status: "Red" }], commentary: "Core Banking delay is the key blocker.", next: "Recovery plan sign-off by 20 Mar" },
        { no: "KR2", desc: "Achieve enterprise data quality score of 90%", actual: "84%", target: "90%", achievement: 93, status: "Amber" as Status, variance: "-6pp", history: [{ q: "Q1", actual: "78%", target: "85%", status: "Amber" }, { q: "Q2", actual: "81%", target: "88%", status: "Amber" }, { q: "Q3", actual: "84%", target: "90%", status: "Amber" }], commentary: "Steady improvement driven by catalogue and stewardship.", next: "Data quality controls baseline by 30 Apr" },
        { no: "KR3", desc: "Certify 10 Agile delivery teams", actual: "6 of 10", target: "10", achievement: 60, status: "Amber" as Status, variance: "-4 teams", history: [{ q: "Q1", actual: "3", target: "4", status: "Amber" }, { q: "Q2", actual: "5", target: "7", status: "Amber" }, { q: "Q3", actual: "6", target: "10", status: "Amber" }], commentary: "Four teams are in pipeline for Q4 completion.", next: "Training cohort 4 starts 10 Apr" },
      ],
    },
    people: {
      title: "People & Culture Evolution",
      confidence: 74,
      owner: "Chief HR Officer",
      sponsor: "TO Head",
      pillar: "Operational Transformation",
      objective: "Foster a high-performing, agile and inclusive organisation where every employee understands their contribution to Club transformation and feels equipped to deliver it",
      why: ["Transformation sustainability depends on behaviour change and leadership consistency.", "People metrics are the strongest predictor of execution stability across divisions."],
      success: ["85% staff with active OKRs", "Employee engagement reaches 80", "Leadership coaching exceeds 200 hours"],
      trend: [65, 70, 72, 74],
      initiatives: ["I003", "I004", "I009"],
      positives: ["Leadership coaching materially ahead of plan", "OKR adoption growing in most divisions", "People theme delivering best confidence trajectory"],
      risks: ["Racing operations readiness remains low", "Change fatigue still visible in operational functions"],
      actions: [["Targeted support for Racing Ops readiness", "HR Director", "High", "+4%"], ["Launch pulse survey intervention plan", "CHRO", "Medium", "+2%"], ["Sustain coaching capacity into Q4", "L&D Lead", "Medium", "+2%"]],
      krs: [
        { no: "KR1", desc: "Achieve 85% staff with active cascaded OKRs", actual: "78%", target: "85%", achievement: 87, status: "Green" as Status, variance: "-7pp", history: [{ q: "Q1", actual: "62%", target: "70%", status: "Amber" }, { q: "Q2", actual: "71%", target: "78%", status: "Amber" }, { q: "Q3", actual: "78%", target: "85%", status: "Green" }], commentary: "Racing operations lagging but clubside trajectory remains positive.", next: "Division-level cascade review by 5 Apr" },
        { no: "KR2", desc: "Increase employee engagement index to 80", actual: "74", target: "80", achievement: 93, status: "Amber" as Status, variance: "-6", history: [{ q: "Q1", actual: "68", target: "74", status: "Amber" }, { q: "Q2", actual: "71", target: "77", status: "Amber" }, { q: "Q3", actual: "74", target: "80", status: "Amber" }], commentary: "Improvement is steady with pockets of change fatigue.", next: "Pulse survey launch 22 May" },
        { no: "KR3", desc: "Deliver 200+ leadership coaching hours", actual: "248", target: "200", achievement: 124, status: "Green" as Status, variance: "+48 hours", history: [{ q: "Q1", actual: "112", target: "80", status: "Green" }, { q: "Q2", actual: "184", target: "140", status: "Green" }, { q: "Q3", actual: "248", target: "200", status: "Green" }], commentary: "Leadership labs delivering above plan and creating stronger sponsor behaviour.", next: "Q4 coaching cohort schedule finalised" },
      ],
    },
    compliance: {
      title: "Responsible Gaming & Compliance",
      confidence: 45,
      owner: "Head of Compliance",
      sponsor: "CEO",
      pillar: "Responsible Gaming",
      objective: "Lead the Hong Kong gaming industry in responsible gambling standards, achieving zero material regulatory breaches and industry recognition by FY2026",
      why: [
        "HKJC holds a unique licence from the HKSAR Government to conduct horse race wagering and the Mark Six lottery. This licence is explicitly conditioned on HKJC fulfilling its responsible gambling obligations. Any material regulatory breach risks financial penalty and reputational damage that can impact HKJC's social mandate.",
        "As digital channels expand, exposure to problem gambling risk also increases. Proactive leadership in responsible gambling, backed by analytics and modern operating controls, is both a regulatory requirement and a strategic differentiator.",
      ],
      success: ["Zero material regulatory findings in annual HKSAR review", "HKJC recognised as APAC benchmark for responsible gambling by FY2026", "100% digital self-exclusion capability with predictive analytics"],
      trend: [68, 60, 52, 45],
      initiatives: ["I005"],
      positives: ["Self-exclusion enrolment tracking above prior-year pace", "Compliance audit score stable at 91% with no new findings", "Policy Revamp progressing on schedule"],
      risks: ["CRITICAL: RG training completion at 34% with 2,400 staff untrained", "RegTech Upgrade budget still unapproved and 30 days overdue", "Digital self-exclusion channel blocked by mobile app delay"],
      actions: [
        ["Emergency RG Training Recovery Plan with blended learning", "Compliance Lead + L&D", "Urgent", "+20%"],
        ["Escalate RegTech budget for emergency approval", "Head of Compliance + CFO", "Urgent", "+10%"],
        ["Interim manual digital self-exclusion process", "Compliance Lead + Head of Product", "High", "+8%"],
      ],
      krs: [
        { no: "KR1", desc: "Enrol 5,000 members in self-exclusion programme", actual: "4,200", target: "5,000", achievement: 84, status: "Amber" as Status, variance: "-800", history: [{ q: "Q1", actual: "3,200", target: "3,600", status: "Amber" }, { q: "Q2", actual: "3,700", target: "4,300", status: "Amber" }, { q: "Q3", actual: "4,200", target: "5,000", status: "Amber" }], commentary: "Outreach improving but digital enrolment bottleneck persists.", next: "Interim process pilot by 8 Apr" },
        { no: "KR2", desc: "Achieve 95% HKSAR regulatory audit score", actual: "91%", target: "95%", achievement: 96, status: "Amber" as Status, variance: "-4pp", history: [{ q: "Q1", actual: "89%", target: "92%", status: "Amber" }, { q: "Q2", actual: "90%", target: "94%", status: "Amber" }, { q: "Q3", actual: "91%", target: "95%", status: "Amber" }], commentary: "Three findings in remediation with two due by quarter close.", next: "Audit closure review on 25 Mar" },
        { no: "KR3", desc: "Complete mandatory RG training for 100% of staff", actual: "34%", target: "100%", achievement: 34, status: "Red" as Status, variance: "-66pp", history: [{ q: "Q1", actual: "62%", target: "80%", status: "Amber" }, { q: "Q2", actual: "48%", target: "90%", status: "Red" }, { q: "Q3", actual: "34%", target: "100%", status: "Red" }], commentary: "Training platform migration failure has become the primary compliance exposure.", next: "Platform recovery checkpoint by 20 Mar" },
      ],
    },
  } as const;
  const data = map[id];

  const confidenceChart = data.trend.map((v, idx) => ({ q: ["Q1", "Q2", "Q3", "Current"][idx], value: v }));

  return (
    <Tabs.Root defaultValue="objective" className="space-y-3">
      <Tabs.List className="grid grid-cols-4 gap-1 rounded-xl bg-slate-100 p-1 text-xs">
        <Tabs.Trigger value="objective" className="rounded-md px-2 py-1 data-[state=active]:bg-white data-[state=active]:text-[#003366]">Objective</Tabs.Trigger>
        <Tabs.Trigger value="krs" className="rounded-md px-2 py-1 data-[state=active]:bg-white data-[state=active]:text-[#003366]">Key Results</Tabs.Trigger>
        <Tabs.Trigger value="initiatives" className="rounded-md px-2 py-1 data-[state=active]:bg-white data-[state=active]:text-[#003366]">Initiatives</Tabs.Trigger>
        <Tabs.Trigger value="confidence" className="rounded-md px-2 py-1 data-[state=active]:bg-white data-[state=active]:text-[#003366]">Confidence</Tabs.Trigger>
      </Tabs.List>

      <Tabs.Content value="objective" className="space-y-3">
        <Panel title="Objective Statement"><div className="rounded-xl bg-[#003366] p-3 text-sm text-white">{data.objective}</div></Panel>
        <Panel title="Why this matters to HKJC"><div className="space-y-2 text-sm text-slate-700">{data.why.map((p) => <p key={p}>{p}</p>)}</div></Panel>
        <Panel title="Definition of Success by FY2026"><ul className="list-disc space-y-1 pl-5 text-sm">{data.success.map((s) => <li key={s}>{s}</li>)}</ul></Panel>
        <div className="flex flex-wrap gap-2 text-xs"><span className="rounded-full bg-[#E8EFF8] px-2 py-1 text-[#003366]">Owner: {data.owner}</span><span className="rounded-full bg-[#E8EFF8] px-2 py-1 text-[#003366]">Executive Sponsor: {data.sponsor}</span><span className="rounded-full bg-[#FDF8EC] px-2 py-1 text-[#C8922A]">Strategy Pillar: {data.pillar}</span></div>
      </Tabs.Content>

      <Tabs.Content value="krs" className="space-y-3">
        {data.krs.map((kr) => (
          <Panel key={kr.no} title={`${kr.no} - ${kr.desc}`}>
            <div className="grid gap-3 md:grid-cols-[1fr_130px]">
              <div className="space-y-2 text-xs">
                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded bg-slate-50 p-2"><p className="text-slate-500">Actual</p><p className="font-bold text-[#003366]">{kr.actual}</p></div>
                  <div className="rounded bg-slate-50 p-2"><p className="text-slate-500">Target</p><p className="font-bold text-[#003366]">{kr.target}</p></div>
                  <div className="rounded bg-slate-50 p-2"><p className="text-slate-500">Variance</p><p className={cn("font-bold", kr.status === "Red" ? "text-red-700" : kr.status === "Amber" ? "text-amber-700" : "text-emerald-700")}>{kr.variance}</p></div>
                  <div className="rounded bg-slate-50 p-2"><p className="text-slate-500">Achievement</p><p className="font-bold text-[#003366]">{kr.achievement}%</p></div>
                </div>
                <div className="h-2 rounded-full bg-slate-200"><div className="h-2 rounded-full bg-[#003366]" style={{ width: `${Math.min(kr.achievement, 100)}%` }} /></div>
                <div className="overflow-auto"><table className="min-w-full text-[11px]"><thead><tr className="border-b border-slate-200 text-slate-500"><th className="py-1 text-left">Quarter</th><th className="text-left">Actual</th><th className="text-left">Target</th><th className="text-left">Status</th></tr></thead><tbody>{kr.history.map((h) => <tr key={h.q} className="border-b border-slate-100"><td className="py-1">{h.q}</td><td>{h.actual}</td><td>{h.target}</td><td>{h.status}</td></tr>)}</tbody></table></div>
                <p className="text-slate-600">{kr.commentary}</p>
                <p className="rounded bg-[#FDF8EC] px-2 py-1 text-[#003366]">Next milestone: {kr.next}</p>
              </div>
              <div className="h-32"><ResponsiveContainer><RadialBarChart data={[{ v: kr.achievement }]} startAngle={90} endAngle={-270} innerRadius="68%" outerRadius="100%"><RadialBar dataKey="v" fill={kr.achievement >= 80 ? colors.gold : colors.navy} background /></RadialBarChart></ResponsiveContainer><p className="-mt-16 text-center text-sm font-bold text-[#003366]">{kr.achievement}%</p></div>
            </div>
          </Panel>
        ))}
      </Tabs.Content>

      <Tabs.Content value="initiatives" className="space-y-3">
        {data.initiatives.map((iid) => {
          const initiative = initiatives.find((x) => x.id === iid);
          if (!initiative) return null;
          return (
            <button key={iid} type="button" className={cn("w-full rounded-xl border border-slate-200 p-3 text-left", interactiveClass)} onClick={() => onOpenInitiative(iid)}>
              <div className="flex items-center justify-between"><p className="font-semibold text-slate-800">{initiative.name}</p><RagPill status={initiative.status} /></div>
              <div className="mt-2 h-2 rounded-full bg-slate-200"><div className="h-2 rounded-full bg-[#003366]" style={{ width: `${initiative.progress}%` }} /></div>
              <p className="mt-1 text-xs text-slate-600">How this contributes: Advances {data.title.toLowerCase()} objective through targeted milestone delivery.</p>
              <p className="text-xs text-slate-500">Key milestone: {initiative.milestones.find((m) => m.status === "In Progress" || m.status === "Upcoming")?.planned ?? initiative.end} · Owner: {initiative.owner}</p>
            </button>
          );
        })}
      </Tabs.Content>

      <Tabs.Content value="confidence" className="space-y-3">
        <Panel title="Confidence Score">
          <div className="flex items-center gap-4">
            <div className="h-24 w-24"><ResponsiveContainer><RadialBarChart data={[{ v: data.confidence }]} startAngle={90} endAngle={-270} innerRadius="70%" outerRadius="100%"><RadialBar dataKey="v" background fill={data.confidence > 70 ? colors.success : data.confidence >= 50 ? colors.warning : colors.danger} /></RadialBarChart></ResponsiveContainer></div>
            <p className="text-3xl font-bold text-[#003366]"><CountUp value={data.confidence} suffix="%" /></p>
          </div>
        </Panel>
        <div className="grid gap-3 md:grid-cols-2">
          <Panel title="Confidence Factors"><ul className="space-y-1 text-sm">{data.positives.map((p) => <li key={p} className="text-emerald-700">✓ {p}</li>)}</ul></Panel>
          <Panel title="Risk Factors"><ul className="space-y-1 text-sm">{data.risks.map((r) => <li key={r} className="text-red-700">⚠ {r}</li>)}</ul></Panel>
        </div>
        <Panel title="Confidence History"><div className="h-48"><ResponsiveContainer><LineChart data={confidenceChart}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="q" /><YAxis domain={[0, 100]} /><ReferenceLine y={70} stroke="#94a3b8" strokeDasharray="4 4" /><Line dataKey="value" stroke={colors.gold} strokeWidth={2.5} /></LineChart></ResponsiveContainer></div></Panel>
        <Panel title="Recommended Actions to Improve Confidence"><div className="space-y-2">{data.actions.map((a) => <div key={String(a[0])} className="rounded-xl border border-slate-200 p-2 text-sm"><p className="font-semibold text-slate-800">{a[0]}</p><p className="text-xs text-slate-500">Owner: {a[1]} · Priority: {a[2]} · Expected impact: {a[3]} confidence</p></div>)}</div></Panel>
      </Tabs.Content>
    </Tabs.Root>
  );
}

function RiskDetail({ risk, onOpenInitiative }: { risk: RiskRecord; onOpenInitiative: (id: string) => void }) {
  return (
    <div className="space-y-4 text-sm">
      <div>
        <p className="text-xs text-slate-500">{risk.id}</p>
        <h4 className="text-lg font-bold text-[#003366]">{risk.title}</h4>
        <div className="mt-1 flex gap-2"><span className="rounded-full bg-[#E8EFF8] px-2 py-0.5 text-xs text-[#003366]">{risk.category}</span><RagPill status={risk.rating} /></div>
      </div>
      <Panel title="Risk Description"><p className="text-sm text-slate-700">{risk.description}</p></Panel>
      <Panel title="Risk Metrics"><div className="grid grid-cols-2 gap-2"><div className="rounded-xl bg-slate-50 p-3 text-center"><p className="text-xs text-slate-500">Likelihood</p><p className="text-2xl font-bold text-[#D0021B]">{risk.likelihood}/5</p></div><div className="rounded-xl bg-slate-50 p-3 text-center"><p className="text-xs text-slate-500">Impact</p><p className="text-2xl font-bold text-[#D0021B]">{risk.impact}/5</p></div></div></Panel>
      <Panel title="Mitigation Actions">{risk.mitigation.map((a) => <div key={a.action} className="mb-2 rounded-lg border border-slate-200 p-2 text-xs"><p className="font-semibold">{a.action}</p><p className="text-slate-500">{a.owner} · Due {a.due}</p><p className="mt-1">{a.status}</p></div>)}</Panel>
      <Panel title="Linked Initiatives"><div className="flex flex-wrap gap-2">{risk.linkedInitiatives.map((id) => { const i = initiatives.find((x) => x.id === id); return <button type="button" key={id} onClick={() => onOpenInitiative(id)} className="rounded-full bg-[#E8EFF8] px-2 py-1 text-xs text-[#003366]">{i?.name}</button>; })}</div></Panel>
      <Panel title="Risk History"><ul className="list-disc pl-5 text-xs text-slate-700">{risk.history.map((h) => <li key={h}>{h}</li>)}</ul></Panel>
    </div>
  );
}

function IssueDetail({ issue }: { issue: IssueRecord }) {
  const ageClass = issue.daysOpen > 20 ? "text-red-600" : issue.daysOpen > 10 ? "text-amber-600" : "text-emerald-600";
  return (
    <div className="space-y-4 text-sm">
      <div>
        <h4 className="text-lg font-bold text-[#003366]">{issue.title}</h4>
        <div className="mt-1 flex items-center gap-2"><RagPill status={issue.priority} /><span className="text-xs text-slate-500">Raised by {issue.raisedBy} · {issue.raisedDate}</span></div>
        <p className={cn("mt-1 text-xs", ageClass)}>Assigned to {issue.assignedTo} · Open {issue.daysOpen} days</p>
      </div>
      <Panel title="Issue Description"><p>{issue.description}</p></Panel>
      <Panel title="Impact Assessment"><p>{issue.impact}</p></Panel>
      <Panel title="Resolution Steps">{issue.steps.map((s) => <div key={s.action} className="mb-2 rounded-lg border border-slate-200 p-2 text-xs"><p className="font-semibold">{s.action}</p><p>{s.owner} · Due {s.due} · {s.status}</p></div>)}</Panel>
      <Panel title="Escalation History">{issue.escalation.length ? <ul className="list-disc pl-5 text-xs">{issue.escalation.map((e) => <li key={e}>{e}</li>)}</ul> : <p className="text-xs text-slate-500">No escalation yet.</p>}</Panel>
      <Panel title="Linked Risks"><div className="flex flex-wrap gap-2">{issue.linkedRiskIds.map((r) => <span key={r} className="rounded-full bg-slate-100 px-2 py-1 text-xs">{r}</span>)}</div></Panel>
    </div>
  );
}

function InitiativeDetail({ initiative }: { initiative: Initiative }) {
  const variance = initiative.budgetForecast - initiative.budgetPlanned;
  return (
    <Tabs.Root defaultValue="overview" className="space-y-3">
      <Tabs.List className="grid grid-cols-5 gap-1 rounded-xl bg-slate-100 p-1 text-[11px]">
        {[
          ["overview", "Overview"],
          ["milestones", "Milestones"],
          ["team", "Team & RACI"],
          ["risks", "Risks & Issues"],
          ["log", "Update Log"],
        ].map((t) => (
          <Tabs.Trigger key={String(t[0])} value={String(t[0])} className="rounded-lg px-2 py-2 font-medium data-[state=active]:bg-white data-[state=active]:text-[#003366]">
            {t[1]}
          </Tabs.Trigger>
        ))}
      </Tabs.List>

      <Tabs.Content value="overview" className="space-y-3 text-sm">
        <h3 className="text-xl font-bold text-[#003366]">{initiative.name}</h3>
        <div className="flex gap-2"><span className="rounded-full bg-[#E8EFF8] px-2 py-0.5 text-xs text-[#003366]">{initiative.theme}</span><RagPill status={initiative.status} /><span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs">Health {initiative.health}%</span></div>
        <div className="grid gap-3 md:grid-cols-2 text-xs">
          <Panel title="Ownership"><p>Sponsor: {initiative.sponsor}</p><p>Owner: {initiative.owner}</p><p>Programme Manager: {initiative.manager}</p><p>Start: {initiative.start}</p><p>End: {initiative.end}</p><p>Duration: {initiative.duration}</p><p>Priority: {initiative.priority}</p></Panel>
          <Panel title="Budget Summary"><p>Planned: HK${initiative.budgetPlanned}M</p><p>Actual: HK${initiative.budgetActual}M</p><p>Forecast: HK${initiative.budgetForecast}M</p><p className={cn(variance > 0 ? "text-red-600" : "text-emerald-700")}>Variance: {variance >= 0 ? "+" : ""}HK${variance}M</p><p>Approach: {initiative.approach}</p></Panel>
        </div>
        <Panel title="Problem Statement"><p>{initiative.problem}</p></Panel>
        <Panel title="Strategic Objectives"><ul className="list-disc pl-5">{initiative.objectives.map((o) => <li key={o}>{o}</li>)}</ul></Panel>
        <Panel title="Key Assumptions"><ul className="list-disc pl-5">{initiative.assumptions.map((o) => <li key={o}>{o}</li>)}</ul></Panel>
      </Tabs.Content>

      <Tabs.Content value="milestones" className="space-y-3">
        {initiative.milestones.map((m) => (
          <div key={m.phase} className="rounded-xl border-l-4 border-l-[#C8922A] bg-slate-50 p-3 text-xs">
            <div className="flex items-center justify-between"><p className="font-semibold text-slate-800">{m.phase}</p><span>{m.status === "Complete" ? "✓" : m.status === "In Progress" ? "◉" : m.status === "At Risk" ? "⚠" : "○"} {m.status}</span></div>
            <p>Planned: {m.planned}</p>
            {m.revised && <p className="text-amber-700">Revised: {m.revised}</p>}
            <p>Owner: {m.owner}</p>
            <ul className="list-disc pl-5">{m.criteria.map((c) => <li key={c}>{c}</li>)}</ul>
            {m.note && <p className="mt-1 text-slate-600">{m.note}</p>}
          </div>
        ))}
      </Tabs.Content>

      <Tabs.Content value="team" className="space-y-3 text-xs">
        <Panel title="Team Composition">{initiative.team.map((t) => <div key={t.role} className="mb-2 flex justify-between rounded-lg bg-slate-50 p-2"><span>{t.role}</span><span>{t.person}</span><span>{t.assignment}</span></div>)}</Panel>
        <Panel title="Mini RACI Matrix">
          <table className="min-w-full text-xs"><thead><tr className="border-b border-slate-200"><th className="py-1 text-left">Workstream</th><th>Sponsor</th><th>Owner</th><th>PM</th><th>SteerCo</th></tr></thead><tbody>{initiative.raci.map((r) => <tr key={r.workstream} className="border-b border-slate-100"><td className="py-1">{r.workstream}</td><td>{r.sponsor}</td><td>{r.owner}</td><td>{r.pm}</td><td>{r.steercos}</td></tr>)}</tbody></table>
        </Panel>
      </Tabs.Content>

      <Tabs.Content value="risks" className="space-y-3 text-xs">
        <Panel title="Risks linked to this initiative">{initiative.linkedRiskIds.map((rId) => { const r = risks.find((x) => x.id === rId); if (!r) return null; return <div key={r.id} className="mb-2 rounded-xl border border-slate-200 p-2"><div className="flex justify-between"><span className="font-semibold">{r.id} {r.title}</span><RagPill status={r.rating} /></div><p className="text-slate-500">{r.mitigation[0]?.action}</p></div>; })}</Panel>
        <Panel title="Issues open">{initiative.linkedIssueIds.map((iId) => { const i = issues.find((x) => x.id === iId); return <p key={iId} className="mb-1 rounded bg-slate-50 p-2">{i?.id} {i?.title}</p>; })}</Panel>
      </Tabs.Content>

      <Tabs.Content value="log" className="space-y-2 text-xs">
        {initiative.logs.map((log) => (
          <div key={`${log.date}-${log.text}`} className="rounded-xl border border-slate-200 p-2"><div className="flex items-center justify-between"><span className="rounded-full bg-slate-100 px-2 py-0.5">{log.date}</span><span className="rounded-full bg-[#E8EFF8] px-2 py-0.5 text-[#003366]">{log.category}</span></div><p className="mt-1">{log.author} · {log.text}</p></div>
        ))}
      </Tabs.Content>
    </Tabs.Root>
  );
}

function KpiPage({ onOpenBenefits, onOpenPanel }: { onOpenBenefits: () => void; onOpenPanel: (panel: PanelState) => void }) {
  const hint = useHintText("kpi");
  const pulse = usePagePulse("kpi");
  const gauges = [
    ["Transformation Benefits Realised", 23, "Target HK$180M", () => { pulse.acknowledge(); onOpenBenefits(); }],
    ["Initiative On-Track Rate", 67, "Target 80%", () => { pulse.acknowledge(); onOpenPanel({ type: "kpi-ontrack" }); }],
    ["Stakeholder Satisfaction", 78, "Target 85%", () => { pulse.acknowledge(); onOpenPanel({ type: "dashboard-stakeholder" }); }],
    ["Budget Utilisation", 61, "Target 70%", () => { pulse.acknowledge(); onOpenPanel({ type: "kpi-budget" }); }],
  ] as const;

  const rows = [
    ["kpi1", "Milestone Completion Rate", "72%", "80%", "Amber", "↑"],
    ["kpi2", "Budget Variance", "-5%", "±10%", "Green", "→"],
    ["kpi3", "Change Request Volume", "8", "<5", "Red", "↑"],
    ["kpi4", "Benefits Realised", "HK$42M", "HK$180M", "Amber", "↑"],
    ["kpi5", "ROI on Completed Initiatives", "2.1x", "2.5x", "Amber", "↑"],
    ["kpi6", "Productivity Improvement", "+12%", "+15%", "Amber", "↑"],
    ["kpi7", "Staff Change Readiness", "68%", "80%", "Red", "↓"],
    ["kpi8", "Agile Adoption Rate", "60%", "85%", "Amber", "↑"],
    ["kpi9", "Training Completion", "74%", "95%", "Red", "↓"],
    ["kpi10", "Executive Alignment Score", "82%", "90%", "Amber", "↑"],
    ["kpi11", "Steering Committee Attendance", "91%", "95%", "Green", "→"],
    ["kpi12", "Comms Effectiveness", "71%", "80%", "Amber", "↑"],
  ] as const;

  return (
    <div className="space-y-4">
      <div><h2 className="text-2xl font-bold text-[#003366]">KPI Performance Monitor</h2><p className="text-sm text-slate-600">Strategic KPI Tracking · Q3 FY2024-25 vs Targets</p></div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {gauges.map((g, idx) => (
          <div key={g[0]} className="relative">
            {pulse.show && idx === 0 && <span className="absolute -inset-1 rounded-2xl border-2 border-[#C8922A] animate-pulse" />}
            {pulse.show && idx === 0 && <span className="pointer-events-none absolute -top-7 left-2 rounded-md border border-[#C8922A] bg-white px-2 py-0.5 text-[10px] text-slate-600">Click to explore</span>}
            <button type="button" onClick={g[3]} className={cn("w-full rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm", interactiveClass)}>
              <p className="text-sm font-semibold text-[#003366]">{g[0]}</p>
              <div className="h-28"><ResponsiveContainer><RadialBarChart data={[{ value: Number(g[1]) }]} innerRadius="65%" outerRadius="100%" startAngle={180} endAngle={0}><RadialBar dataKey="value" fill="#C8922A" cornerRadius={8} /></RadialBarChart></ResponsiveContainer></div>
              <p className="-mt-10 text-center text-xl font-bold">{g[1]}%</p><p className="mt-7 text-center text-xs text-slate-500">{g[2]}</p>
            </button>
          </div>
        ))}
      </div>
      {hint && <p className="text-xs italic text-slate-500">Click to explore</p>}

      <Panel title="KPI Scorecard Table">
        <div className="overflow-auto">
          <table className="min-w-full text-sm">
            <thead><tr className="border-b border-slate-200 text-left text-xs text-slate-500"><th className="py-2">KPI</th><th>Actual</th><th>Target</th><th>Status</th><th>Trend</th></tr></thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r[0]} role="button" tabIndex={0} onClick={() => (r[0] === "kpi4" ? onOpenBenefits() : onOpenPanel({ type: "kpi-row", id: r[0] }))} onKeyDown={(e) => handleKeyboardActivate(e, () => (r[0] === "kpi4" ? onOpenBenefits() : onOpenPanel({ type: "kpi-row", id: r[0] })))} className={cn("border-b border-slate-100 text-xs hover:bg-[#FDF8EC]", interactiveClass)}>
                  <td className="py-2 font-semibold">{r[1]}</td><td>{r[2]}</td><td>{r[3]}</td><td><RagPill status={r[4] as Status} /></td><td>{r[5]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}

function KpiOnTrackDrawer() {
  const breakdown = [{ name: "On Track", value: 8, fill: colors.success }, { name: "At Risk", value: 3, fill: colors.warning }, { name: "Critical", value: 1, fill: colors.danger }];
  const scatter = [
    { name: "MEM", v: -15, c: colors.warning },
    { name: "CLD", v: -22, c: colors.danger },
    { name: "RGA", v: -10, c: colors.warning },
    { name: "CBK", v: -18, c: colors.danger },
    { name: "AGR", v: 12, c: colors.success },
    { name: "OKR", v: 8, c: colors.success },
    { name: "FPA", v: 5, c: colors.success },
    { name: "DGV", v: -5, c: colors.warning },
    { name: "WPM", v: 2, c: colors.success },
    { name: "LAB", v: 1, c: colors.success },
    { name: "HRO", v: -3, c: colors.warning },
    { name: "CST", v: -8, c: colors.warning },
  ];
  return (
    <div className="space-y-4">
      <Panel title="On-Track vs At-Risk Breakdown"><div className="h-56"><ResponsiveContainer><PieChart><Pie data={breakdown} dataKey="value" innerRadius={45} outerRadius={75}>{breakdown.map((b) => <Cell key={b.name} fill={b.fill} />)}</Pie></PieChart></ResponsiveContainer></div></Panel>
      <Panel title="At-Risk Initiatives - Detail">
        {[
          ["Member Experience Redesign", "Racing", "-15 days", "Scope creep: 3 unplanned UX features added in Feb sprint", "Action: Convene change control board to assess and prioritise scope", "Owner: Member Services"],
          ["Cloud Security", "Digital", "-22 days", "P1 security audit finding blocking cloud workstream migration", "Action: Accelerate penetration test remediation with emergency vendor support", "Owner: CISO"],
          ["RG Analytics", "Compliance", "-10 days", "Data privacy impact assessment delayed by Legal review queue", "Action: Escalate to DPO for priority assessment", "Owner: Compliance Lead"],
          ["Core Banking System Upgrade", "Digital", "-18 days", "Third vendor milestone missed; core team under-resourced", "Action: Emergency programme review with CTO + Executive Steering Committee by 18 Mar", "Owner: IT Lead"],
        ].map((r, idx) => <div key={String(r[0])} className={cn("mb-2 rounded-xl border p-2 text-xs", idx === 3 ? "border-red-300 bg-red-50" : "border-slate-200")}><div className="flex items-center justify-between"><p className="font-semibold">{r[0]}</p><span className="rounded-full bg-[#E8EFF8] px-2 py-0.5 text-[#003366]">{r[1]}</span></div><p className="text-red-600">{r[2]}</p><p>{r[3]}</p><p className="italic text-slate-600">{r[4]}</p><p>{r[5]}</p></div>)}
      </Panel>
      <Panel title="Schedule Variance Distribution"><div className="h-56"><ResponsiveContainer><ScatterChart><CartesianGrid strokeDasharray="3 3" /><XAxis type="number" dataKey="v" domain={[-30, 15]} /><YAxis type="number" dataKey="y" hide domain={[0, 12]} /><RechartsTooltip /><Scatter data={scatter.map((s, i) => ({ ...s, y: i + 1 }))}>{scatter.map((s) => <Cell key={s.name} fill={s.c} />)}</Scatter></ScatterChart></ResponsiveContainer></div></Panel>
      <Panel title="On-Track Rate by Theme">{[["Racing",67,"Amber"],["Digital",33,"Red"],["People",100,"Green"],["Finance",100,"Green"],["Compliance",0,"Red"]].map((r)=><div key={String(r[0])} className="mb-2 text-xs"><div className="mb-1 flex justify-between"><span>{r[0]}</span><span>{r[1]}%</span></div><div className="h-2 rounded-full bg-slate-200"><div className="h-2 rounded-full" style={{ width: `${r[1]}%`, backgroundColor: statusColor[r[2] as Status] }} /></div></div>)}</Panel>
    </div>
  );
}

function KpiBudgetDrawer() {
  const bars = [
    { name: "Core Banking", budget: 58, spent: 22, over: 0 },
    { name: "Wagering Platform", budget: 76, spent: 28, over: 0 },
    { name: "Member Experience", budget: 31, spent: 12, over: 4 },
    { name: "Finance Automation", budget: 28, spent: 18, over: 0 },
    { name: "RG Analytics", budget: 22, spent: 12, over: 3 },
    { name: "Data Governance", budget: 26, spent: 11, over: 0 },
    { name: "Agile Rollout", budget: 18, spent: 14, over: 0 },
    { name: "OKR Framework", budget: 6, spent: 5.5, over: 0 },
    { name: "HR Op Model", budget: 12, spent: 3, over: 0 },
    { name: "Cost Optimisation", budget: 19, spent: 4, over: 0 },
    { name: "Cloud Security", budget: 14, spent: 6, over: 11 },
    { name: "Workforce Planning", budget: 9, spent: 1, over: 0 },
  ];
  const burn = [
    { m: "Aug", planned: 21, actual: 20 },
    { m: "Sep", planned: 21, actual: 21 },
    { m: "Oct", planned: 21, actual: 20 },
    { m: "Nov", planned: 21, actual: 21 },
    { m: "Dec", planned: 21, actual: 22 },
    { m: "Jan", planned: 21, actual: 24 },
    { m: "Feb", planned: 21, actual: 25 },
    { m: "Mar", planned: 21, actual: 26 },
  ];
  return (
    <div className="space-y-4">
      <Panel title="Portfolio Budget Overview"><div className="grid grid-cols-3 gap-2 text-xs"><div className="rounded-xl bg-slate-50 p-2">Total Budget: HK$280M</div><div className="rounded-xl bg-slate-50 p-2">Spent to Date: HK$171M (61%)</div><div className="rounded-xl bg-slate-50 p-2">Forecast to Complete: HK$298M</div></div><div className="mt-2 rounded-xl border-l-4 border-amber-400 bg-amber-50 p-2 text-sm">Current forecast indicates HK$18M budget overrun. Three initiatives trending over budget.</div></Panel>
      <Panel title="Budget by Initiative"><div className="h-72"><ResponsiveContainer><BarChart data={bars} layout="vertical" margin={{ left: 30 }}><CartesianGrid strokeDasharray="3 3" /><XAxis type="number" /><YAxis type="category" dataKey="name" width={110} /><RechartsTooltip /><Bar dataKey="spent" stackId="a" fill={colors.navy} /><Bar dataKey="budget" stackId="a" fill={colors.accentLight} /><Bar dataKey="over" stackId="a" fill={colors.danger} /></BarChart></ResponsiveContainer></div></Panel>
      <Panel title="Budget Burn Rate Trend"><div className="h-56"><ResponsiveContainer><ComposedChart data={burn}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="m" /><YAxis /><RechartsTooltip /><Area type="monotone" dataKey="actual" fill="#fdecc8" stroke="none" /><Line dataKey="planned" stroke={colors.navy} strokeWidth={2} /><Line dataKey="actual" stroke={colors.warning} strokeWidth={2.5} /></ComposedChart></ResponsiveContainer></div></Panel>
      <Panel title="Budget Risk Summary"><p>Over-budget at risk: Member Experience (+HK$4M), Cloud Security (+HK$11M), RG Analytics (+HK$3M)</p><p>Potential savings: OKR Framework (HK$0.5M underspend forecast), Workforce Planning (HK$2M potentially rephased)</p></Panel>
    </div>
  );
}

function KpiDetailDrawer({ id, onOpenBenefits }: { id: string; onOpenBenefits: () => void }) {
  const details: Record<string, { name: string; actual: string; target: string; status: Status; trend?: number[]; factors: string[]; actions: string[]; related: string[]; roi?: { name: string; value: number }[]; breakdown?: { name: string; value: number; status: Status }[] }> = {
    kpi1: { name: "Milestone Completion Rate", actual: "72%", target: "80%", status: "Amber", trend: [65, 67, 69, 70, 71, 72], factors: ["8 of 11 planned Q3 milestones completed on time", "Core Banking and Cloud Security workstreams account for 3 missed milestones", "People theme achieving 100% milestone completion rate"], actions: ["Review and rebaseline Core Banking milestone plan by 20 Mar - IT Lead", "Introduce bi-weekly milestone health checks for at-risk workstreams - TO Head - Immediate"], related: ["Initiative On-Track Rate", "Budget Variance"] },
    kpi2: { name: "Budget Variance", actual: "-5%", target: "±10%", status: "Green", trend: [-2, -3, -3.5, -4, -4.5, -5], factors: ["Portfolio remains within approved tolerance band of ±10%", "Three initiatives trending over forecast but offset by underspend in People theme", "Cloud Security overrun (+HK$11M forecast) largest risk"], actions: ["None required at portfolio level", "Implement monthly budget reforecast for Cloud Security and Member Experience - CFO - Apr 1"], related: ["Benefits Realised", "Budget Utilisation"] },
    kpi3: { name: "Change Request Volume", actual: "8", target: "<5", status: "Red", trend: [1, 2, 3, 5, 7, 8], factors: ["Member Experience scope expansion driving 4 of 8 CRs", "Wagering Platform: 2 CRs from regulatory requirements", "Core Banking: 2 CRs from revised vendor design"], actions: ["Implement formal change freeze on Member Experience until Q4 planning - 25 Mar", "Brief Executive Steering Committee on CR trend - TO Head - 18 Mar", "Establish CR scoring matrix - TO Lead - 30 Mar"], related: ["Milestone Completion Rate", "Budget Variance"] },
    kpi5: { name: "ROI on Completed Initiatives", actual: "2.1x", target: "2.5x", status: "Amber", factors: ["OKR Framework ROI driven by management efficiency and alignment benefits", "Finance Automation tracking below target ROI due to later-than-planned adoption"], actions: ["Commission ROI acceleration review for Finance Automation - CFO - 31 Mar", "Set ROI milestones for next 3 completing initiatives - TO Head - Apr"], related: ["Benefits Realised", "Productivity Improvement"], roi: [{ name: "OKR Framework", value: 3.2 }, { name: "Finance Automation", value: 1.8 }] },
    kpi6: { name: "Productivity Improvement", actual: "+12%", target: "+15%", status: "Amber", trend: [6, 7, 8, 9, 11, 12], factors: ["Finance process automation delivering measurable time savings", "Agile teams reporting 18% faster cycle times", "Racing Operations not yet capturing productivity metrics"], actions: ["Deploy productivity measurement framework to Racing and Member Services - CHRO - 15 Apr", "Accelerate Finance Automation adoption in Accounts Payable - CFO - 30 Mar"], related: ["Agile Adoption Rate", "Training Completion"] },
    kpi7: { name: "Staff Change Readiness", actual: "68%", target: "80%", status: "Red", trend: [72, 70, 68, 66, 67, 68], factors: ["Change fatigue identified in operational staff", "Racing Operations showing lowest readiness at 52%", "Finance and People divisions highest at 84%"], actions: ["Deploy targeted readiness support to Racing Operations - HR Director - Immediate", "Commission change impact assessment for Q4 - TO Head - 28 Mar", "Establish Change Champion network in lagging divisions - HR - 15 Apr"], related: ["Agile Adoption Rate", "Training Completion"] },
    kpi8: { name: "Agile Adoption Rate", actual: "60%", target: "85%", status: "Amber", trend: [35, 42, 48, 52, 57, 60], factors: ["6 of 10 Agile teams fully certified", "Racing and Compliance yet to commence transformation", "IT division progressing with 4 teams at Level 4"], actions: ["Launch Agile@Scale pilot in Racing Division - 1 Apr", "Schedule remaining 4 team certifications for Q4 - 15 Apr"], related: ["Staff Change Readiness", "Milestone Completion"] },
    kpi9: { name: "Training Completion", actual: "74%", target: "95%", status: "Red", trend: [80, 78, 75, 72, 72, 74], factors: ["RG mandatory training completion at only 34%", "Technical training at 88%", "Leadership development at 96%"], actions: ["Emergency escalation: RG training platform migration by 28 Mar", "Deploy blended learning alternative for RG training by 20 Mar"], related: ["Staff Change Readiness", "Agile Adoption"], breakdown: [{ name: "RG & Compliance Mandatory", value: 34, status: "Red" }, { name: "Technology & Digital Skills", value: 88, status: "Green" }, { name: "Leadership & Management", value: 96, status: "Green" }, { name: "Agile & Ways of Working", value: 71, status: "Amber" }, { name: "Change Management", value: 68, status: "Amber" }] },
    kpi10: { name: "Executive Alignment Score", actual: "82%", target: "90%", status: "Amber", trend: [75, 76, 78, 79, 81, 82], factors: ["CEO and MD Racing are strong champions", "Head of Member Services and Racing Ops declining alignment", "CFO alignment stable but cautious"], actions: ["Schedule 1:1 sessions with Head of Member Services - 20 Mar", "Prepare updated narrative for CFO budget risk - 18 Mar"], related: ["Stakeholder Satisfaction", "Comms Effectiveness"] },
    kpi11: { name: "Steering Committee Attendance", actual: "91%", target: "95%", status: "Green", trend: [88, 89, 90, 91, 92, 91], factors: ["Strong executive engagement", "1 absence represented by deputy", "Attendance trending positively since Q2 format refresh"], actions: ["No critical actions", "Consider deputy attendance protocols for continuity - Apr"], related: ["Executive Alignment Score", "Comms Effectiveness"] },
    kpi12: { name: "Comms Effectiveness", actual: "71%", target: "80%", status: "Amber", trend: [65, 67, 68, 70, 70, 71], factors: ["68% staff feel well informed", "Executive comms rated highly", "Middle management cascade rated poorly"], actions: ["Launch Manager Comms Toolkit - 1 Apr", "Introduce monthly Transformation Pulse email - 15 Apr", "Create visual progress infographic for Racing Ops - 28 Mar"], related: ["Staff Change Readiness", "Executive Alignment"] },
  };
  const d = details[id];
  if (!d) return null;
  if (id === "kpi4") {
    onOpenBenefits();
    return null;
  }
  return (
    <div className="space-y-4">
      <Panel title={`${d.name} Summary`}><div className="grid grid-cols-2 gap-2 text-xs"><div className="rounded bg-slate-50 p-2">Actual: {d.actual}</div><div className="rounded bg-slate-50 p-2">Target: {d.target}</div><div className="rounded bg-slate-50 p-2">Status: {d.status}</div><div className="rounded bg-slate-50 p-2">Trend: {d.trend ? (d.trend[d.trend.length - 1] > d.trend[0] ? "Improving" : "Declining") : "N/A"}</div></div></Panel>
      <Panel title="Trend Chart">
        {d.roi ? (
          <div className="h-52"><ResponsiveContainer><BarChart data={d.roi}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" /><YAxis /><Bar dataKey="value" fill={colors.gold} /></BarChart></ResponsiveContainer></div>
        ) : (
          <div className="h-52"><ResponsiveContainer><LineChart data={(d.trend ?? []).map((v, i) => ({ m: ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"][i], v }))}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="m" /><YAxis /><ReferenceLine y={typeof d.target === "string" && d.target.includes("%") ? Number(d.target.replace(/[^0-9.-]/g, "")) : undefined} stroke="#94a3b8" strokeDasharray="4 4" /><Line dataKey="v" stroke={colors.gold} strokeWidth={2.5} /></LineChart></ResponsiveContainer></div>
        )}
      </Panel>
      <Panel title="Contributing Factors"><ul className="list-disc pl-5 text-sm">{d.factors.map((f) => <li key={f}>{f}</li>)}</ul></Panel>
      {(d.status === "Amber" || d.status === "Red") && <Panel title="Actions to Close Gap"><ul className="list-disc pl-5 text-sm">{d.actions.map((f) => <li key={f}>{f}</li>)}</ul></Panel>}
      {d.breakdown && (
        <Panel title="Breakdown by Training Type">
          {d.breakdown.map((item) => (
            <div key={item.name} className="mb-2 text-xs">
              <div className="mb-1 flex items-center justify-between"><span>{item.name}</span><span>{item.value}%</span></div>
              <div className="h-1.5 rounded-full bg-slate-200"><div className="h-1.5 rounded-full" style={{ width: `${item.value}%`, backgroundColor: statusColor[item.status] }} /></div>
            </div>
          ))}
        </Panel>
      )}
      <Panel title="Related KPIs"><div className="flex flex-wrap gap-2">{d.related.map((r) => <span key={r} className="rounded-full bg-[#E8EFF8] px-3 py-1 text-xs text-[#003366]">{r}</span>)}</div></Panel>
    </div>
  );
}

function RisksPage({ onOpenPanel }: { onOpenPanel: (panel: PanelState) => void }) {
  const hint = useHintText("risks");
  const pulse = usePagePulse("risks");
  const [tab, setTab] = useState<"matrix" | "risks" | "issues">("matrix");
  return (
    <div className="space-y-4">
      <div><h2 className="text-2xl font-bold text-[#003366]">Risk & Issue Register</h2><p className="text-sm text-slate-600">Total Risks: 24 | Critical: 3 | High: 7 | Open Issues: 11 | Overdue Actions: 4</p></div>
      <div className="flex gap-2">{(["risks", "issues", "matrix"] as const).map((t) => <button key={t} type="button" onClick={() => setTab(t)} className={cn("rounded-lg px-3 py-1.5 text-sm", tab === t ? "bg-[#003366] text-white" : "bg-white text-slate-700")}>{t === "matrix" ? "Risk Matrix" : t[0].toUpperCase() + t.slice(1)}</button>)}</div>

      {tab === "matrix" && (
        <Panel title="Risk Matrix">
          <div className="relative mx-auto grid w-[420px] grid-cols-5 gap-1">
            {Array.from({ length: 25 }).map((_, i) => {
              const x = (i % 5) + 1;
              const y = 5 - Math.floor(i / 5);
              const score = x + y;
              const bg = score <= 4 ? "#c8ebd7" : score <= 6 ? "#fde68a" : score <= 8 ? "#f59e0b" : "#b91c1c";
              return <div key={i} className="h-20 rounded" style={{ background: bg }} />;
            })}
            {risks.map((risk) => (
              <div key={risk.id} className="absolute" style={{ left: `${(risk.matrix.x - 0.5) * 20}%`, top: `${(5 - risk.matrix.y + 0.25) * 20}%` }}>
                {pulse.show && risk.id === risks[0].id && <span className="pointer-events-none absolute -inset-1 rounded-full border-2 border-[#C8922A] animate-pulse" />}
                {pulse.show && risk.id === risks[0].id && <span className="pointer-events-none absolute -top-6 left-4 w-max rounded-md border border-[#C8922A] bg-white px-2 py-0.5 text-[10px] text-slate-600">Click to explore</span>}
                <button type="button" onClick={() => { pulse.acknowledge(); onOpenPanel({ type: "risk-detail", id: risk.id }); }} className={cn("absolute flex h-7 w-7 items-center justify-center rounded-full bg-[#003366] text-[10px] text-white", interactiveClass)}>
                  {risk.id.replace("R", "")}
                </button>
              </div>
            ))}
          </div>
          {hint && <p className="mt-2 text-xs italic text-slate-500">Click to explore</p>}
        </Panel>
      )}

      {tab === "risks" && (
        <Panel title="Risk Table">
          <div className="overflow-auto">
            <table className="min-w-full text-sm">
              <thead><tr className="border-b border-slate-200 text-left text-xs text-slate-500"><th className="py-2">ID</th><th>Risk Title</th><th>Category</th><th>Likelihood</th><th>Impact</th><th>Overall</th><th>Owner</th><th>Due Date</th><th>Actions</th></tr></thead>
              <tbody>
                {risks.map((r) => (
                  <tr key={r.id} role="button" tabIndex={0} onClick={() => onOpenPanel({ type: "risk-detail", id: r.id })} onKeyDown={(e) => handleKeyboardActivate(e, () => onOpenPanel({ type: "risk-detail", id: r.id }))} className={cn("border-b border-slate-100 hover:bg-[#FDF8EC]", interactiveClass)}>
                    <td className="py-2">{r.id}</td><td>{r.title}</td><td>{r.category}</td><td>L{r.likelihood}</td><td>I{r.impact}</td><td><RagPill status={r.rating} /></td><td>{r.owner}</td><td>{r.due}</td><td><button type="button" className="rounded border px-2 py-0.5 text-xs">View</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      )}

      {tab === "issues" && (
        <Panel title="Issues Table">
          <div className="overflow-auto">
            <table className="min-w-full text-sm">
              <thead><tr className="border-b border-slate-200 text-left text-xs text-slate-500"><th className="py-2">ID</th><th>Issue</th><th>Priority</th><th>Raised By</th><th>Assigned To</th><th>Status</th><th>Target Resolution</th><th>Days Open</th></tr></thead>
              <tbody>
                {issues.map((r) => (
                  <tr key={r.id} role="button" tabIndex={0} onClick={() => onOpenPanel({ type: "issue-detail", id: r.id })} onKeyDown={(e) => handleKeyboardActivate(e, () => onOpenPanel({ type: "issue-detail", id: r.id }))} className={cn("border-b border-slate-100 hover:bg-[#FDF8EC]", interactiveClass)}>
                    <td className="py-2">{r.id}</td><td>{r.title}</td><td><RagPill status={r.priority} /></td><td>{r.raisedBy}</td><td>{r.assignedTo}</td><td>{r.status}</td><td>{r.target}</td><td>{r.daysOpen}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      )}
    </div>
  );
}

function InitiativesPage({ onOpenInitiative }: { onOpenInitiative: (id: string) => void }) {
  const hint = useHintText("initiatives");
  const pulse = usePagePulse("initiatives");
  const [view, setView] = useState<"Card Grid" | "Data Table">("Card Grid");
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => initiatives.filter((i) => i.name.toLowerCase().includes(query.toLowerCase())), [query]);
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-2xl font-bold text-[#003366]">Initiative Portfolio</h2><p className="text-sm text-slate-600">Total Budget: HK$280M | Active: 12 | Completed: 8 | At Risk: 3</p></div><div className="flex items-center gap-2"><button type="button" onClick={() => setView("Card Grid")} className={cn("rounded-lg px-3 py-2 text-sm", view === "Card Grid" ? "bg-[#003366] text-white" : "bg-white text-slate-700")}>Card Grid</button><button type="button" onClick={() => setView("Data Table")} className={cn("rounded-lg px-3 py-2 text-sm", view === "Data Table" ? "bg-[#003366] text-white" : "bg-white text-slate-700")}>Data Table</button></div></div>
      <Panel title="Filter Bar" className="p-3"><div className="relative max-w-xl"><Search className="pointer-events-none absolute left-2 top-2.5 h-4 w-4 text-slate-400" /><input value={query} onChange={(e) => setQuery(e.target.value)} className="w-full rounded-lg border border-slate-300 py-2 pl-8 pr-3 text-sm" placeholder="Search initiatives..." /></div></Panel>
      {view === "Card Grid" ? (
        <div className="columns-1 gap-4 md:columns-2 xl:columns-3">
          {filtered.map((i) => (
            <div key={i.id} className={cn("relative mb-4 break-inside-avoid rounded-2xl border border-slate-200 bg-white p-4 shadow-sm", interactiveClass)}>
              {pulse.show && i.id === filtered[0]?.id && <span className="pointer-events-none absolute -inset-1 rounded-2xl border-2 border-[#C8922A] animate-pulse" />}
              {pulse.show && i.id === filtered[0]?.id && <span className="pointer-events-none absolute -top-7 left-2 rounded-md border border-[#C8922A] bg-white px-2 py-0.5 text-[10px] text-slate-600">Click to explore</span>}
              <div className="-mt-4 mb-3 h-1 rounded-t-xl" style={{ backgroundColor: statusColor[i.status] }} />
              <h4 className="font-bold text-slate-800">{i.name}</h4>
              <span className="mt-1 inline-block rounded-full bg-[#E8EFF8] px-2 py-0.5 text-xs text-[#003366]">{i.theme}</span>
              <div className="mt-2 h-2 rounded-full bg-slate-200"><div className="h-2 rounded-full bg-[#003366]" style={{ width: `${i.progress}%` }} /></div>
              <div className="mt-2 flex gap-2 text-[11px]"><span className="rounded-full bg-slate-100 px-2 py-0.5">Budget HK${i.budgetPlanned}M</span><span className="rounded-full bg-slate-100 px-2 py-0.5">Timeline {i.duration}</span><span className="rounded-full bg-slate-100 px-2 py-0.5">Risk {i.status}</span></div>
              <div className="mt-3 flex items-center justify-between text-xs text-slate-600"><span className="flex items-center gap-1"><CircleUser className="h-3.5 w-3.5" />{i.owner}</span><span className="flex items-center gap-1"><Clock3 className="h-3.5 w-3.5" />{i.end}</span></div>
              <button type="button" onClick={() => { pulse.acknowledge(); onOpenInitiative(i.id); }} className="mt-3 w-full rounded-lg border border-[#C8922A] py-1.5 text-sm font-semibold text-[#003366]">View Details</button>
            </div>
          ))}
        </div>
      ) : (
        <Panel title="Initiative Data Table"><div className="overflow-auto"><table className="min-w-full text-sm"><thead><tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wide text-slate-500"><th className="py-2">Initiative</th><th>Theme</th><th>Status</th><th>Owner</th><th>Start</th><th>End</th><th>Budget Used</th><th>% Complete</th><th>Health</th></tr></thead><tbody>{filtered.map((i) => <tr key={i.id} role="button" tabIndex={0} onClick={() => onOpenInitiative(i.id)} onKeyDown={(e) => handleKeyboardActivate(e, () => onOpenInitiative(i.id))} className={cn("border-b border-slate-100 hover:bg-[#FDF8EC]", interactiveClass)}><td className="py-2 font-semibold">{i.name}</td><td>{i.theme}</td><td><RagPill status={i.status} /></td><td>{i.owner}</td><td>{i.start}</td><td>{i.end}</td><td><div className="h-1.5 w-20 rounded-full bg-slate-200"><div className="h-1.5 rounded-full bg-[#C8922A]" style={{ width: `${(i.budgetActual / i.budgetPlanned) * 100}%` }} /></div></td><td>{i.progress}%</td><td>{i.health}%</td></tr>)}</tbody></table></div></Panel>
      )}
      {hint && <p className="text-xs italic text-slate-500">Click to explore</p>}
    </div>
  );
}

function RoadmapPage({ onOpenInitiative }: { onOpenInitiative: (id: string) => void }) {
  const [view, setView] = useState<"Timeline" | "Kanban" | "List">("Timeline");

  const roadmapItems = [
    { id: "I001", name: "Core Banking System Upgrade", theme: themes[1], start: 2, duration: 8, status: "Amber" as Status, owner: "IT Lead" },
    { id: "I002", name: "Wagering Platform Modernisation", theme: themes[0], start: 1, duration: 12, status: "Green" as Status, owner: "Head of Racing" },
    { id: "I003", name: "Agile Ways of Working Rollout", theme: themes[2], start: 3, duration: 6, status: "Green" as Status, owner: "HR Director" },
    { id: "I004", name: "OKR Framework Implementation", theme: themes[2], start: 0, duration: 3, status: "Green" as Status, owner: "Transformation Office" },
    { id: "I005", name: "Responsible Gambling Analytics", theme: themes[4], start: 5, duration: 5, status: "Amber" as Status, owner: "Compliance Lead" },
    { id: "I006", name: "Finance Process Automation", theme: themes[3], start: 2, duration: 7, status: "Green" as Status, owner: "CFO" },
    { id: "I007", name: "Member Experience Redesign", theme: themes[0], start: 6, duration: 9, status: "Red" as Status, owner: "Member Services" },
    { id: "I008", name: "Data Governance Programme", theme: themes[1], start: 4, duration: 10, status: "Amber" as Status, owner: "CDAO" },
    { id: "I009", name: "HR Operating Model Redesign", theme: themes[2], start: 12, duration: 4, status: "Planned" as Status, owner: "Chief HR Officer" },
    { id: "I010", name: "Cost Optimisation Initiative", theme: themes[3], start: 13, duration: 6, status: "Planned" as Status, owner: "Finance PMO" },
  ];

  const quarterMarks = ["Q1 FY25", "Q2 FY25", "Q3 FY25", "Q4 FY25", "Q1 FY26", "Q2 FY26", "Q3 FY26", "Q4 FY26"];
  const currentMonthIndex = 8;

  const kanban = {
    Ideation: roadmapItems.filter((i) => i.status === "Planned"),
    "In Design": roadmapItems.filter((i) => i.start >= 4 && i.start <= 8 && i.id !== "I004" && i.status !== "Planned"),
    "In Delivery": roadmapItems.filter((i) => i.start < 4 && i.id !== "I004"),
    Completed: roadmapItems.filter((i) => i.id === "I004"),
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-[#003366]">Transformation Roadmap</h2>
          <p className="text-sm text-slate-600">FY2024-25 → FY2026-27 Strategic Execution Plan</p>
        </div>
        <button type="button" className="rounded-lg bg-[#C8922A] px-3 py-2 text-sm font-semibold text-white">+ New Initiative</button>
      </div>

      <Panel title="Roadmap Controls">
        <div className="flex flex-wrap items-center gap-2">
          {[
            "All Themes",
            "All Status",
            "All Owners",
          ].map((f) => (
            <button key={f} type="button" className="inline-flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-700">
              {f} <ChevronDown className="h-3.5 w-3.5" />
            </button>
          ))}
          <div className="ml-auto flex rounded-lg border border-slate-300 bg-white p-1 text-xs">
            {(["Timeline", "Kanban", "List"] as const).map((v) => (
              <button key={v} type="button" onClick={() => setView(v)} className={cn("rounded-md px-3 py-1.5", view === v ? "bg-[#003366] text-white" : "text-slate-700")}>
                {v}
              </button>
            ))}
          </div>
        </div>
      </Panel>

      {view === "Timeline" && (
        <Panel title="Timeline View">
          <div className="relative overflow-x-auto">
            <div className="min-w-[980px]">
              <div className="mb-3 grid grid-cols-8 gap-2 text-[11px] font-semibold text-slate-500">
                {quarterMarks.map((q) => (
                  <div key={q} className="rounded-md bg-slate-100 px-2 py-1 text-center">{q}</div>
                ))}
              </div>
              <div className="pointer-events-none absolute bottom-0 top-8" style={{ left: `${(currentMonthIndex / 24) * 100}%` }}>
                <div className="h-full border-l-2 border-dashed border-[#C8922A]" />
                <p className="-ml-8 mt-1 rounded bg-[#FDF8EC] px-1 text-[10px] text-[#003366]">Today</p>
              </div>

              <div className="space-y-3">
                {themes.map((theme) => (
                  <div key={theme} className="rounded-xl border border-slate-200 bg-slate-50/60 p-2">
                    <p className="mb-2 text-xs font-semibold text-[#003366]">{theme}</p>
                    <div className="relative h-12 rounded-lg bg-white">
                      <div className="absolute inset-0 grid grid-cols-24 gap-0.5">
                        {Array.from({ length: 24 }).map((_, i) => (
                          <div key={i} className={cn("h-full", i % 3 === 2 ? "bg-slate-100" : "bg-slate-50")} />
                        ))}
                      </div>
                      {roadmapItems
                        .filter((item) => item.theme === theme)
                        .map((item) => (
                          <button
                            key={item.id}
                            type="button"
                            aria-label={`Open ${item.name} initiative detail`}
                            onClick={() => onOpenInitiative(item.id)}
                            className={cn("absolute top-2 h-8 rounded-full px-2 text-left text-[11px] font-semibold text-white shadow-sm", interactiveClass)}
                            style={{
                              left: `${(item.start / 24) * 100}%`,
                              width: `${(item.duration / 24) * 100}%`,
                              backgroundColor: statusColor[item.status],
                            }}
                          >
                            <span className="block truncate">{item.name}</span>
                          </button>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4 rounded-xl border border-[#E8EFF8] bg-[#F8FBFF] p-3 text-xs text-slate-600">
            <p className="font-semibold text-[#003366]">Dependencies</p>
            <p className="mt-1">OKR Framework Implementation → Agile Ways of Working Rollout</p>
            <p>Data Governance Programme → Wagering Platform Modernisation</p>
          </div>
        </Panel>
      )}

      {view === "Kanban" && (
        <div className="grid gap-3 xl:grid-cols-4">
          {Object.entries(kanban).map(([col, items]) => (
            <Panel key={col} title={col} subtitle={`${items.length} initiatives`} className="min-h-[280px]">
              <div className="space-y-2">
                {items.map((item) => (
                  <button key={`${col}-${item.id}`} type="button" onClick={() => onOpenInitiative(item.id)} className={cn("w-full rounded-xl border border-slate-200 bg-white p-2 text-left text-xs", interactiveClass)}>
                    <p className="font-semibold text-[#003366]">{item.name}</p>
                    <p className="text-slate-500">{item.theme}</p>
                    <div className="mt-1 flex items-center justify-between"><RagPill status={item.status} /><span className="rounded-full bg-slate-100 px-2 py-0.5">Owner: {item.owner}</span></div>
                  </button>
                ))}
              </div>
            </Panel>
          ))}
        </div>
      )}

      {view === "List" && (
        <Panel title="List View">
          <div className="overflow-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wide text-slate-500">
                  <th className="py-2">Initiative</th>
                  <th>Theme</th>
                  <th>Status</th>
                  <th>Owner</th>
                  <th>Duration</th>
                </tr>
              </thead>
              <tbody>
                {roadmapItems.map((item) => (
                  <tr
                    key={item.id}
                    role="button"
                    tabIndex={0}
                    aria-label={`View ${item.name}`}
                    onClick={() => onOpenInitiative(item.id)}
                    onKeyDown={(e) => handleKeyboardActivate(e, () => onOpenInitiative(item.id))}
                    className={cn("border-b border-slate-100 hover:bg-[#FDF8EC]", interactiveClass)}
                  >
                    <td className="py-2 font-semibold text-[#003366]">{item.name}</td>
                    <td>{item.theme}</td>
                    <td><RagPill status={item.status} /></td>
                    <td>{item.owner}</td>
                    <td>{item.duration} months</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      )}
    </div>
  );
}

function OkrsPage({ onOpenPanel, onToast }: { onOpenPanel: (panel: PanelState) => void; onToast: (message: string) => void }) {
  const [quarter, setQuarter] = useState<"Q1" | "Q2" | "Q3" | "Q4">("Q3");
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const okrs = [
    {
      id: "racing" as const,
      title: "Racing & Wagering Excellence",
      owner: "MD, Racing",
      confidence: 82,
      updated: "5 March 2025",
      objective:
        "Deliver a world-class digital wagering experience that grows HKJC's digital handle by 15% YoY while maintaining industry-leading responsible gambling standards",
      krs: [
        { label: "KR1", desc: "Grow digital wagering handle (online + mobile) to HK$7.2B by Q4 FY25", progress: 94, actual: "HK$6.8B", target: "HK$7.2B", owner: "Head of Racing", status: "Amber" as Status, trend: "↑ Improving" },
        { label: "KR2", desc: "Achieve wagering platform uptime of 99.9% across all digital channels", progress: 100, actual: "99.7%", target: "99.9%", owner: "CTO", status: "Green" as Status, trend: "→ Stable", note: "Monitoring 2 Q3 outage incidents" },
        { label: "KR3", desc: "Launch 4 new wagering product types by Q4 FY25", progress: 50, actual: "2 of 4 launched", target: "4", owner: "Head of Product", status: "Amber" as Status, trend: "↑ Improving" },
      ],
      teams: [
        { team: "Racing Products Team", objective: "Launch In-Play wagering with 15% digital handle contribution by Q4 FY25", result: "In-Play beta launched - 0% (Not started)", confidence: 65, owner: "Head of Product", pip: "Amber" },
        { team: "Digital Wagering Team", objective: "Reduce mobile app crash rate to <0.5% and increase App Store rating to 4.0+", result: "Crash rate 0.8% vs 0.5%; App rating 3.4 vs 4.0", confidence: 48, owner: "Mobile Lead", pip: "Red" },
      ],
    },
    {
      id: "digital" as const,
      title: "Digital & Technology Uplift",
      owner: "Chief Technology Officer",
      confidence: 61,
      updated: "3 March 2025",
      objective:
        "Build a resilient, cloud-native technology foundation that enables data-driven decision making and supports 99.9% system availability across all Club operations",
      warning: "2 critical blockers identified - see full detail",
      krs: [
        { label: "KR1", desc: "Migrate 8 core systems to cloud-native architecture by Q4 FY25", progress: 38, actual: "3 of 8 systems", target: "8", owner: "IT Lead", status: "Red" as Status, trend: "↓ Declining" },
        { label: "KR2", desc: "Achieve enterprise data quality score of 90% across all critical datasets", progress: 93, actual: "84%", target: "90%", owner: "CDAO", status: "Amber" as Status, trend: "↑ Improving" },
        { label: "KR3", desc: "Certify 10 Agile delivery teams to Level 3+ maturity by Q4 FY25", progress: 60, actual: "6 of 10 teams", target: "10", owner: "HR Director", status: "Amber" as Status, trend: "↑ Improving" },
      ],
      teams: [
        { team: "Infrastructure Team", objective: "Complete cloud migration of 5 non-critical systems by Q3 FY25", result: "3 of 5 systems migrated (60%)", confidence: 62, owner: "Infrastructure Lead", pip: "Amber" },
        { team: "Data Engineering Team", objective: "Deploy enterprise data catalogue covering 80% of critical datasets", result: "45% of datasets catalogued", confidence: 71, owner: "Data Engineering Lead", pip: "Green" },
      ],
    },
    {
      id: "people" as const,
      title: "People & Culture Evolution",
      owner: "Chief HR Officer",
      confidence: 74,
      updated: "6 March 2025",
      objective:
        "Foster a high-performing, agile and inclusive organisation where every employee understands their contribution to Club transformation and feels equipped to deliver it",
      success: "Strongest performing theme this quarter - People on track to exceed KR3",
      krs: [
        { label: "KR1", desc: "Achieve 85% of Club staff with active, cascaded OKRs by Q4 FY25", progress: 92, actual: "78% staff", target: "85%", owner: "CHRO", status: "Green" as Status, trend: "↑ Improving" },
        { label: "KR2", desc: "Increase employee engagement index from 68 to 80 by Q4 FY25", progress: 93, actual: "74", target: "80", owner: "CHRO", status: "Amber" as Status, trend: "↑ Improving" },
        { label: "KR3", desc: "Deliver 200+ leadership coaching hours by Q4 FY25", progress: 100, actual: "248 hours", target: "200", owner: "L&D Lead", status: "Green" as Status, trend: "↑ Improving", note: "124% of target" },
      ],
      teams: [{ team: "Talent & OD Team", objective: "Implement Agile@Scale in 4 additional divisions by Q4 FY25", result: "1 division live, 3 in planning", confidence: 70, owner: "Talent & OD Lead", pip: "Amber" }],
    },
    {
      id: "compliance" as const,
      title: "Responsible Gaming & Compliance",
      owner: "Head of Compliance",
      confidence: 45,
      updated: "7 March 2025",
      objective: "Lead the Hong Kong gaming industry in responsible gambling standards, achieving zero material regulatory breaches and industry recognition by FY2026",
      critical: "CRITICAL: 2,400 staff yet to complete mandatory training. Regulatory deadline: 30 April 2025",
      krs: [
        { label: "KR1", desc: "Enrol 5,000 members in self-exclusion programme by Q4 FY25", progress: 84, actual: "4,200", target: "5,000", owner: "Compliance Lead", status: "Amber" as Status, trend: "↑ Improving" },
        { label: "KR2", desc: "Achieve 95% score on HKSAR regulatory compliance audit", progress: 96, actual: "91%", target: "95%", owner: "Legal", status: "Amber" as Status, trend: "→ Stable" },
        { label: "KR3", desc: "Complete mandatory RG training for 100% of Club staff by 30 April 2025", progress: 34, actual: "34%", target: "100%", owner: "Compliance Lead", status: "Red" as Status, trend: "↓ Declining" },
      ],
      teams: [{ team: "RG Operations Team", objective: "Digitise self-exclusion enrolment to reduce processing from 5 days to 24 hours", result: "In development - Q4 delivery delayed", confidence: 35, owner: "RG Operations Lead", pip: "Red" }],
    },
  ];

  const trendData = [
    { q: "Q1", racing: 70, digital: 72, people: 65, compliance: 68 },
    { q: "Q2", racing: 75, digital: 68, people: 70, compliance: 57 },
    { q: "Q3", racing: 82, digital: 61, people: 74, compliance: 45 },
  ];

  const selectQuarter = (q: "Q1" | "Q2" | "Q3" | "Q4") => {
    setQuarter(q);
    if (q === "Q1" || q === "Q2") onToast(`Viewing historical ${q} data - read only`);
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold text-[#003366]">OKR Command Centre</h2>
        <p className="text-sm text-slate-600">Cascaded Objectives & Key Results · Q3 FY2024-25</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {(["Q1", "Q2", "Q3", "Q4"] as const).map((q) => (
          <button
            key={q}
            type="button"
            aria-label={`Select ${q} quarter`}
            onClick={() => selectQuarter(q)}
            className={cn("rounded-full px-4 py-2 text-sm font-semibold", quarter === q ? "bg-[#C8922A] text-white" : "bg-white text-slate-700", (q === "Q1" || q === "Q2") && "opacity-80")}
          >
            {q} {q === "Q4" && <span className="ml-1 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] text-slate-600">Planning</span>}
          </button>
        ))}
      </div>

      <section className="rounded-2xl border-l-4 border-l-[#C8922A] bg-[#003366] p-5 text-white shadow-sm">
        <p className="text-base font-semibold">Club Objective: Deliver sustainable growth through digital excellence, responsible gambling leadership, and operational transformation</p>
        <div className="mt-3 flex items-center justify-between text-sm"><span className="font-semibold">71% Overall Confidence</span><span>Q3 FY2024-25</span></div>
        <div className="mt-2 h-2 rounded-full bg-white/20"><motion.div initial={{ width: 0 }} animate={{ width: "71%" }} className="h-2 rounded-full bg-gradient-to-r from-[#C8922A] to-[#2D8653]" /></div>
        <div className="mt-3 flex flex-wrap gap-2 text-xs">
          <span className="rounded-full bg-emerald-50 px-2 py-1 text-emerald-700">Initiatives On Track: 8/12</span>
          <span className="rounded-full bg-amber-50 px-2 py-1 text-amber-700">OKRs at Target: 1/4</span>
          <span className="rounded-full bg-amber-50 px-2 py-1 text-amber-700">Benefits Realised: 23% of target</span>
          <span className="rounded-full bg-red-100 px-2 py-1 text-red-700">Critical Risks: 3 open</span>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-2">
        {okrs.map((okr) => (
          <article key={okr.id} className={cn("rounded-2xl border bg-white p-4 shadow-sm", okr.id === "compliance" ? "border-red-300" : "border-slate-200", interactiveClass)} role="button" tabIndex={0} aria-label={`Open ${okr.title} detail`} onClick={() => onOpenPanel({ type: "okr-detail", id: okr.id })} onKeyDown={(e) => handleKeyboardActivate(e, () => onOpenPanel({ type: "okr-detail", id: okr.id }))}>
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="text-base font-bold text-[#003366]">{okr.title}</h3>
                <span className="mt-1 inline-flex rounded-full bg-[#E8EFF8] px-2 py-0.5 text-[11px] text-[#003366]">{okr.owner}</span>
              </div>
              <div className="h-16 w-16">
                <ResponsiveContainer>
                  <RadialBarChart data={[{ v: okr.confidence }]} startAngle={90} endAngle={-270} innerRadius="70%" outerRadius="100%">
                    <RadialBar dataKey="v" background fill={okr.confidence > 70 ? colors.success : okr.confidence >= 50 ? colors.warning : colors.danger} cornerRadius={10} />
                  </RadialBarChart>
                </ResponsiveContainer>
                <p className="-mt-11 text-center text-xs font-semibold text-[#003366]">{okr.confidence}%</p>
              </div>
            </div>

            <p className="mt-2 text-sm italic text-slate-600">{okr.objective}</p>
            <div className="my-3 border-t border-slate-200" />

            <div className="space-y-3">
              {okr.krs.map((kr) => (
                <div key={kr.label} className="rounded-xl border border-slate-200 p-2">
                  <p className="text-xs"><span className="mr-2 rounded bg-[#003366] px-1.5 py-0.5 text-white">{kr.label}</span><span className="font-semibold text-slate-700">{kr.desc}</span></p>
                  <div className="mt-2 h-2 rounded-full bg-slate-200"><div className="h-2 rounded-full bg-[#003366]" style={{ width: `${Math.min(kr.progress, 100)}%` }} /></div>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
                    <span>Actual: {kr.actual}</span>
                    <span>Target: {kr.target}</span>
                    <span className="rounded-full bg-slate-100 px-2 py-0.5">Owner: {kr.owner}</span>
                    <RagPill status={kr.status} />
                    <span>{kr.trend}</span>
                    {(kr as { note?: string }).note && <span className="text-amber-700">* {(kr as { note?: string }).note}</span>}
                  </div>
                </div>
              ))}
            </div>

            {okr.warning && <div className="mt-3 rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-xs text-amber-800">{okr.warning}</div>}
            {okr.success && <div className="mt-3 rounded-lg border border-emerald-300 bg-emerald-50 px-3 py-2 text-xs text-emerald-800">{okr.success}</div>}
            {okr.critical && <div className="mt-3 rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-xs text-red-800">{okr.critical}</div>}

            <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
              <button type="button" className="font-semibold text-[#003366] underline">View Full OKR Detail →</button>
              <span>Last updated: {okr.updated}</span>
            </div>

            <button type="button" className="mt-3 flex w-full items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-[#003366]" onClick={(e) => { e.stopPropagation(); setExpanded((s) => ({ ...s, [okr.id]: !s[okr.id] })); }}>
              Team OKRs {expanded[okr.id] ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </button>
            {expanded[okr.id] && (
              <div className="mt-2 border-l-2 border-[#C8922A] pl-3">
                {okr.teams.map((team) => (
                  <div key={team.team} className="mb-2 rounded-xl border border-slate-200 bg-white p-3 text-xs">
                    <p className="font-semibold text-[#003366]">{team.team}</p>
                    <p className="mt-1 text-slate-700">{team.objective}</p>
                    <p className="mt-1 text-slate-500">KR: {team.result}</p>
                    <div className="mt-1 flex items-center justify-between">
                      <span>Owner: {team.owner}</span>
                      <span className={cn("font-semibold", team.pip === "Green" ? "text-emerald-700" : team.pip === "Amber" ? "text-amber-700" : "text-red-700")}>● {team.confidence}%</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </article>
        ))}
      </div>

      <Panel title="OKR Confidence Trend - All Themes" subtitle="Q1 FY24-25 through Q3 FY24-25">
        <div className="h-80">
          <ResponsiveContainer>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <ReferenceArea y1={70} y2={100} fill="#eaf7ef" fillOpacity={0.8} />
              <ReferenceArea y1={0} y2={50} fill="#fdecec" fillOpacity={0.8} />
              <XAxis dataKey="q" />
              <YAxis domain={[0, 100]} />
              <RechartsTooltip />
              <ReferenceLine y={70} stroke="#94a3b8" strokeDasharray="4 4" label="Health Threshold" />
              <Line dataKey="racing" name="Racing & Wagering" stroke={colors.gold} strokeWidth={2.5} />
              <Line dataKey="digital" name="Digital & Technology" stroke={colors.navy} strokeWidth={2.5} />
              <Line dataKey="people" name="People & Culture" stroke={colors.success} strokeWidth={2.5} />
              <Line dataKey="compliance" name="Compliance & Risk" stroke={colors.danger} strokeWidth={2.5} />
              <Legend verticalAlign="bottom" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-2 grid gap-2 text-xs md:grid-cols-2">
          <p className="rounded bg-amber-50 p-2 text-amber-800">Digital Q3 drop: Core Banking vendor delay</p>
          <p className="rounded bg-red-50 p-2 text-red-800">Compliance Q3 drop: RG training platform failure</p>
        </div>
      </Panel>
    </div>
  );
}

function StakeholdersPage({ onToast }: { onToast: (message: string) => void }) {
  type Sentiment = "Supportive" | "Neutral" | "Resistant";
  type GroupKey = "Executive Leadership" | "Senior Management" | "Regulatory & Governance" | "Industry & External" | "Change Champions Network";
  type Stakeholder = {
    id: string;
    name: string;
    role: string;
    initials: string;
    group: GroupKey;
    color: string;
    interest: number;
    power: number;
    size: number;
    sentiment: Sentiment;
    lastContactDays: number;
    alignment: number;
    frequency: "Weekly" | "Bi-weekly" | "Monthly" | "Quarterly";
    priority: "High" | "Medium" | "Low";
    tenure: string;
    reportsTo: string;
    preferredContact: string;
    context: string;
    interests: string[];
    concerns: string[];
    influenceRows: Array<{ initiative: string; type: string; stance: string }>;
    engagements: Array<{ date: string; ago: string; type: string; duration: string; outcome: "Positive" | "Neutral" | "Concerns Raised" | "Escalated"; points: string[]; followUp: string; by: string }>;
    sentimentTrend: Array<{ month: string; score: number; avg: number }>;
    upcoming: string[];
    influenceMap: { influences: string[]; influencedBy: string[]; peers: string[]; note: string };
    actions: Array<{ priority: "Urgent" | "High" | "Medium"; desc: string; owner: string; due: string; status: "Open" | "In Progress" | "Complete" | "Overdue" }>;
    strategy: string[];
  };

  const stakeholders: Stakeholder[] = [
    {
      id: "s1",
      name: "Executive Director & CEO",
      role: "Chief Executive Sponsor",
      initials: "ED",
      group: "Executive Leadership",
      color: colors.navy,
      interest: 88,
      power: 96,
      size: 52,
      sentiment: "Supportive",
      lastContactDays: 5,
      alignment: 5,
      frequency: "Weekly",
      priority: "High",
      tenure: "14 years",
      reportsTo: "Board of Stewards",
      preferredContact: "Weekly briefing pack + face-to-face monthly",
      context:
        "As the most senior executive of the Club, the ED provides ultimate sponsorship and authority for the transformation programme. Their visible support is critical for driving cultural change across all divisions. The ED chairs the Executive Steering Committee and has publicly committed to delivering the Club's FY2025-27 transformation agenda as a cornerstone of HKJC's next strategic cycle. Engagement is excellent, with weekly briefing packs reviewed consistently.",
      interests: [
        "Long-term sustainability of HKJC's social mission and HK$1.8B annual community contribution model",
        "Digital transformation delivering competitive advantage versus illegal gambling channels",
        "Responsible gambling leadership protecting HKJC's licence and public trust",
      ],
      concerns: [
        "Programme delivery risk from cost overrun or milestone slippage",
        "Change fatigue in race operations affecting race-day quality",
        "Regulatory relationship risk if compliance KPIs deteriorate",
      ],
      influenceRows: [
        { initiative: "Core Banking", type: "Budget Approval Authority", stance: "Supportive" },
        { initiative: "RG Training", type: "Executive Mandate", stance: "Supportive" },
        { initiative: "Agile Rollout", type: "Cultural Sponsorship", stance: "Supportive" },
      ],
      engagements: [
        { date: "4 Mar", ago: "5 days ago", type: "Executive Briefing", duration: "30 min", outcome: "Positive", points: ["Reviewed Q3 programme health", "Requested tighter monitoring on Core Banking"], followUp: "Provide updated risk heatmap before SteerCo", by: "SM" },
        { date: "20 Feb", ago: "17 days ago", type: "Steering Committee", duration: "90 min", outcome: "Positive", points: ["Approved rebaseline approach", "Reinforced transformation narrative"], followUp: "Share board-ready dashboard", by: "TO" },
      ],
      sentimentTrend: [
        { month: "Oct", score: 4.2, avg: 3.2 },
        { month: "Nov", score: 4.3, avg: 3.3 },
        { month: "Dec", score: 4.4, avg: 3.4 },
        { month: "Jan", score: 4.5, avg: 3.5 },
        { month: "Feb", score: 4.6, avg: 3.6 },
        { month: "Mar", score: 4.7, avg: 3.6 },
      ],
      upcoming: ["Mar 25: Executive Steering Committee", "Apr 3: Strategic Q4 priorities session"],
      influenceMap: { influences: ["MD", "CF", "CT", "HR", "RO", "MS"], influencedBy: ["HK", "BS"], peers: [], note: "CEO influence remains the strongest positive force across all workstreams." },
      actions: [
        { priority: "High", desc: "Prepare concise Core Banking recovery update", owner: "IT Lead", due: "18 Mar", status: "In Progress" },
        { priority: "Medium", desc: "Draft Q4 benefits acceleration narrative", owner: "TO Senior Manager", due: "22 Mar", status: "Open" },
      ],
      strategy: [
        "Maintain weekly executive briefing cadence with one-page risk summary.",
        "Use decision-ready options with quantified trade-offs.",
        "Continue visible sponsorship moments in division town halls.",
      ],
    },
    {
      id: "s2",
      name: "Managing Director, Racing",
      role: "Racing Division Lead",
      initials: "MD",
      group: "Executive Leadership",
      color: colors.navy,
      interest: 82,
      power: 90,
      size: 48,
      sentiment: "Supportive",
      lastContactDays: 3,
      alignment: 4,
      frequency: "Bi-weekly",
      priority: "High",
      tenure: "11 years",
      reportsTo: "Executive Director & CEO",
      preferredContact: "Programme steering + 1:1",
      context: "Executive sponsor for Racing initiatives and a key advocate for digital wagering growth.",
      interests: ["Race-day service quality", "Digital handle growth", "Member experience uplift"],
      concerns: ["Potential race-day disruption", "Scope volatility in member programme"],
      influenceRows: [{ initiative: "Wagering Platform", type: "Sponsor", stance: "Supportive" }, { initiative: "Member Experience", type: "Sponsor", stance: "Supportive" }],
      engagements: [{ date: "6 Mar", ago: "3 days ago", type: "1:1 Meeting", duration: "45 min", outcome: "Positive", points: ["Reviewed app scope freeze", "Agreed sponsor messaging"], followUp: "Join re-engagement with Racing Ops", by: "SM" }],
      sentimentTrend: [{ month: "Oct", score: 3.9, avg: 3.2 }, { month: "Nov", score: 4.0, avg: 3.3 }, { month: "Dec", score: 4.0, avg: 3.4 }, { month: "Jan", score: 4.1, avg: 3.5 }, { month: "Feb", score: 4.2, avg: 3.6 }, { month: "Mar", score: 4.2, avg: 3.6 }],
      upcoming: ["Mar 18: Executive Steering Committee", "Apr 1: Racing Agile pilot kick-off"],
      influenceMap: { influences: ["RO", "MS"], influencedBy: ["ED"], peers: ["CF", "CT"], note: "Critical bridge between executive intent and racing operations adoption." },
      actions: [{ priority: "High", desc: "Co-chair Racing Ops re-engagement session", owner: "MD Racing + TO", due: "14 Mar", status: "Open" }],
      strategy: ["Keep bi-weekly checkpoints focused on race operations outcomes.", "Use MD as escalation pathway for resistant operational leaders.", "Align messaging on value and risk control."],
    },
    {
      id: "s3",
      name: "Chief Financial Officer",
      role: "Finance Executive",
      initials: "CF",
      group: "Executive Leadership",
      color: colors.navy,
      interest: 70,
      power: 88,
      size: 44,
      sentiment: "Neutral",
      lastContactDays: 8,
      alignment: 4,
      frequency: "Monthly",
      priority: "High",
      tenure: "9 years",
      reportsTo: "Executive Director & CEO",
      preferredContact: "Budget review + Programme Board",
      context:
        "The CFO holds budget approval authority for all transformation investments above HK$5M and presents programme financial performance to the Board of Stewards quarterly. Currently Neutral, supportive in principle but concerned about HK$18M overrun forecast. D-013 has been pending for 30 days and is now critical.",
      interests: ["Return on transformation investment", "Budget discipline", "Financial risk management"],
      concerns: ["HK$18M forecast overrun", "Benefits realised only at 23%", "Cloud Security request requires better quantification"],
      influenceRows: [
        { initiative: "Cloud Security", type: "Budget Approval", stance: "Neutral → Blocking" },
        { initiative: "Core Banking", type: "Financial Oversight", stance: "Neutral" },
        { initiative: "All Initiatives", type: "Budget Authority", stance: "Neutral" },
      ],
      engagements: [
        { date: "28 Feb", ago: "8 days ago", type: "1:1 Meeting", duration: "60 min", outcome: "Concerns Raised", points: ["Requested quantified risk reduction from HK$11M request", "Questioned forecast confidence range"], followUp: "Submit cost-benefit model for D-013", by: "SM" },
        { date: "12 Feb", ago: "24 days ago", type: "Programme Board", duration: "90 min", outcome: "Neutral", points: ["Reviewed Q3 variance", "Accepted spend controls"], followUp: "Monthly reforecast pack", by: "PMO" },
      ],
      sentimentTrend: [{ month: "Oct", score: 3.7, avg: 3.2 }, { month: "Nov", score: 3.6, avg: 3.3 }, { month: "Dec", score: 3.6, avg: 3.4 }, { month: "Jan", score: 3.5, avg: 3.5 }, { month: "Feb", score: 3.4, avg: 3.6 }, { month: "Mar", score: 3.3, avg: 3.6 }],
      upcoming: ["Mar 18: Executive SteerCo budget decision window", "Mar 22: Finance Committee checkpoint"],
      influenceMap: { influences: ["CT", "TO", "BS"], influencedBy: ["ED", "BS"], peers: ["MD"], note: "CFO neutrality on Cloud Security is creating downstream execution blockers for CTO." },
      actions: [
        { priority: "Urgent", desc: "Submit Cloud Security cost-benefit pack for D-013", owner: "CISO + PMO", due: "18 Mar", status: "Open" },
        { priority: "High", desc: "Run independent spend scenario analysis", owner: "Finance PM", due: "20 Mar", status: "In Progress" },
      ],
      strategy: [
        "Frame updates in investment-risk terms with clear downside avoided.",
        "Provide monthly forecast confidence ranges and mitigation levers.",
        "Use Board-ready benefit narratives linked to social mandate outcomes.",
      ],
    },
    {
      id: "s4",
      name: "Chief Technology Officer",
      role: "Technology Executive",
      initials: "CT",
      group: "Senior Management",
      color: "#0D7377",
      interest: 92,
      power: 82,
      size: 44,
      sentiment: "Supportive",
      lastContactDays: 2,
      alignment: 4,
      frequency: "Weekly",
      priority: "High",
      tenure: "8 years",
      reportsTo: "Executive Director & CEO",
      preferredContact: "Weekly technical working group",
      context: "Accountable for core migration and cloud risk closure.",
      interests: ["Migration stability", "Cyber risk closure", "Delivery capacity"],
      concerns: ["Vendor resourcing", "Audit finding closure deadlines"],
      influenceRows: [{ initiative: "Core Banking", type: "Technical Authority", stance: "Supportive" }, { initiative: "Cloud Security", type: "Decision Owner", stance: "Supportive" }],
      engagements: [{ date: "7 Mar", ago: "2 days ago", type: "Working Group", duration: "90 min", outcome: "Positive", points: ["Aligned on vendor recovery plan", "Confirmed security remediation sprint"], followUp: "Track weekly capacity KPIs", by: "SM" }],
      sentimentTrend: [{ month: "Oct", score: 3.6, avg: 3.2 }, { month: "Nov", score: 3.7, avg: 3.3 }, { month: "Dec", score: 3.8, avg: 3.4 }, { month: "Jan", score: 3.9, avg: 3.5 }, { month: "Feb", score: 4.0, avg: 3.6 }, { month: "Mar", score: 4.0, avg: 3.6 }],
      upcoming: ["Mar 12: Programme Board", "Mar 20: Remediation vendor checkpoint"],
      influenceMap: { influences: ["IT", "VN"], influencedBy: ["CF", "ED"], peers: ["HR"], note: "Technology confidence remains positive but capacity pressure is increasing." },
      actions: [{ priority: "High", desc: "Finalize vendor capacity contract addendum", owner: "CTO + Procurement", due: "20 Mar", status: "In Progress" }],
      strategy: ["Sustain weekly risk-to-resolution tracking.", "Align with CFO on quantified remediation outcomes.", "Protect critical path resources with dedicated vendor pools."],
    },
    { id: "s5", name: "Chief HR Officer", role: "People & Culture Executive", initials: "HR", group: "Senior Management", color: "#0D7377", interest: 86, power: 78, size: 40, sentiment: "Supportive", lastContactDays: 6, alignment: 4, frequency: "Bi-weekly", priority: "High", tenure: "10 years", reportsTo: "Executive Director & CEO", preferredContact: "People workstream review", context: "Leads culture and capability uplift.", interests: ["Adoption", "Leadership coaching", "Change readiness"], concerns: ["Operational fatigue"], influenceRows: [{ initiative: "Agile Rollout", type: "Owner", stance: "Supportive" }], engagements: [{ date: "1 Mar", ago: "6 days ago", type: "Workshop", duration: "60 min", outcome: "Positive", points: ["Reviewed readiness interventions", "Approved division support plan"], followUp: "Deploy change champions", by: "SM" }], sentimentTrend: [{ month: "Oct", score: 3.4, avg: 3.2 }, { month: "Nov", score: 3.5, avg: 3.3 }, { month: "Dec", score: 3.6, avg: 3.4 }, { month: "Jan", score: 3.8, avg: 3.5 }, { month: "Feb", score: 3.9, avg: 3.6 }, { month: "Mar", score: 4.0, avg: 3.6 }], upcoming: ["Mar 19: People Workstream Review", "Apr 1: Agile pilot launch"], influenceMap: { influences: ["CC"], influencedBy: ["ED"], peers: ["CT"], note: "Positive change momentum if operational resistance is contained." }, actions: [{ priority: "Medium", desc: "Refresh readiness survey content", owner: "HR PM", due: "26 Mar", status: "Open" }], strategy: ["Keep bi-weekly cadence and share local win stories.", "Partner with Comms to reduce fatigue.", "Focus on Racing and Member Services support."], },
    { id: "s6", name: "Head of Legal & Compliance", role: "Legal & Compliance Lead", initials: "LC", group: "Senior Management", color: "#0D7377", interest: 74, power: 84, size: 36, sentiment: "Neutral", lastContactDays: 12, alignment: 3, frequency: "Monthly", priority: "High", tenure: "12 years", reportsTo: "Chief Legal Counsel", preferredContact: "Compliance working group", context: "Critical for regulatory interpretation and risk closure.", interests: ["Regulatory assurance", "Policy consistency"], concerns: ["Training deadline risk"], influenceRows: [{ initiative: "Policy Revamp", type: "Owner", stance: "Neutral" }], engagements: [{ date: "26 Feb", ago: "12 days ago", type: "Working Group", duration: "90 min", outcome: "Neutral", points: ["Reviewed policy draft", "Flagged review queue delays"], followUp: "Prioritize privacy review", by: "PMO" }], sentimentTrend: [{ month: "Oct", score: 3.3, avg: 3.2 }, { month: "Nov", score: 3.2, avg: 3.3 }, { month: "Dec", score: 3.1, avg: 3.4 }, { month: "Jan", score: 3.1, avg: 3.5 }, { month: "Feb", score: 3.1, avg: 3.6 }, { month: "Mar", score: 3.0, avg: 3.6 }], upcoming: ["Mar 18: RG risk update", "Mar 30: LegCo scenario review"], influenceMap: { influences: ["HK"], influencedBy: ["CF"], peers: ["HR"], note: "Neutral stance with moderate execution drag from review backlog." }, actions: [{ priority: "High", desc: "Reduce legal review cycle for RG assessments", owner: "Legal Ops", due: "24 Mar", status: "In Progress" }], strategy: ["Escalate queue prioritization for transformation-critical items.", "Use monthly legal-risk dashboard.", "Align compliance and product teams in one forum."], },
    {
      id: "s7",
      name: "HKSAR Government (Racing Authority)",
      role: "Regulatory Authority",
      initials: "HK",
      group: "Regulatory & Governance",
      color: "#6B21A8",
      interest: 28,
      power: 95,
      size: 50,
      sentiment: "Neutral",
      lastContactDays: 45,
      alignment: 3,
      frequency: "Quarterly",
      priority: "High",
      tenure: "N/A",
      reportsTo: "HKSAR Home and Youth Affairs Bureau",
      preferredContact: "Quarterly regulatory update",
      context:
        "The HKSAR Government regulates HKJC's exclusive wagering licence. While not directly involved in day-to-day transformation, it monitors compliance obligations and community contribution commitments. The RG training completion gap at 34% is a regulatory exposure risk that requires proactive communication before 30 April.",
      interests: ["Responsible gambling compliance", "HK$1.8B+ community contribution continuity", "Suppression of illegal gambling"],
      concerns: ["Potential RG training deadline breach", "Digital expansion outpacing safeguards", "Public controversy risk"],
      influenceRows: [
        { initiative: "RG Analytics", type: "Regulatory Requirement", stance: "Neutral" },
        { initiative: "Policy Revamp", type: "Legislative Context", stance: "Neutral" },
        { initiative: "Wagering Platform", type: "Licence Boundary", stance: "Neutral" },
      ],
      engagements: [
        { date: "24 Jan", ago: "45 days ago", type: "Board Briefing", duration: "60 min", outcome: "Neutral", points: ["Shared annual compliance position", "No formal concerns raised"], followUp: "Submit Q3 RG training update", by: "TO" },
      ],
      sentimentTrend: [{ month: "Oct", score: 3.1, avg: 3.2 }, { month: "Nov", score: 3.1, avg: 3.3 }, { month: "Dec", score: 3.0, avg: 3.4 }, { month: "Jan", score: 3.0, avg: 3.5 }, { month: "Feb", score: 2.9, avg: 3.6 }, { month: "Mar", score: 2.8, avg: 3.6 }],
      upcoming: ["Mar 29: Regulatory pre-briefing", "Apr 10: Compliance progress submission"],
      influenceMap: { influences: ["ED", "LC"], influencedBy: [], peers: ["BS"], note: "Overdue briefing is a visible governance risk." },
      actions: [
        { priority: "Urgent", desc: "Prepare proactive RG compliance update note", owner: "Compliance Lead", due: "14 Mar", status: "Open" },
        { priority: "High", desc: "Schedule quarterly authority briefing", owner: "TO Head", due: "15 Mar", status: "Overdue" },
      ],
      strategy: [
        "Engage proactively before regulator requests updates.",
        "Frame remediation milestones with clear dates and owners.",
        "Highlight controls and social impact outcomes in every update.",
      ],
    },
    { id: "s8", name: "Board of Stewards", role: "Board Governance Body", initials: "BS", group: "Regulatory & Governance", color: "#6B21A8", interest: 35, power: 92, size: 46, sentiment: "Neutral", lastContactDays: 28, alignment: 3, frequency: "Quarterly", priority: "High", tenure: "N/A", reportsTo: "HKJC Governance Charter", preferredContact: "Quarterly board briefing pack", context: "Board oversight of strategy, risk, and funding decisions.", interests: ["Governance quality", "Financial stewardship", "Risk transparency"], concerns: ["Unclear variance trajectory"], influenceRows: [{ initiative: "Portfolio", type: "Oversight", stance: "Neutral" }], engagements: [{ date: "12 Feb", ago: "28 days ago", type: "Email Update", duration: "-", outcome: "Neutral", points: ["Sent Q3 outline pack", "Requested deeper budget narrative"], followUp: "Q4 board pack due", by: "SM" }], sentimentTrend: [{ month: "Oct", score: 3.0, avg: 3.2 }, { month: "Nov", score: 3.0, avg: 3.3 }, { month: "Dec", score: 3.1, avg: 3.4 }, { month: "Jan", score: 3.1, avg: 3.5 }, { month: "Feb", score: 3.0, avg: 3.6 }, { month: "Mar", score: 3.0, avg: 3.6 }], upcoming: ["Mar 26: Board prep session", "Apr 5: Q4 briefing pack"], influenceMap: { influences: ["ED", "CF"], influencedBy: [], peers: ["HK"], note: "Board narrative quality strongly impacts confidence." }, actions: [{ priority: "Medium", desc: "Prepare Q3 progress summary", owner: "TO Office", due: "21 Mar", status: "Open" }], strategy: ["Keep board updates concise and evidence-led.", "Link spend to realized and forecast value.", "Provide transparent risk posture and actions."], },
    {
      id: "s9",
      name: "Head of Racing Operations",
      role: "Racing Operations Lead",
      initials: "RO",
      group: "Senior Management",
      color: "#0D7377",
      interest: 78,
      power: 68,
      size: 36,
      sentiment: "Resistant",
      lastContactDays: 31,
      alignment: 2,
      frequency: "Monthly",
      priority: "High",
      tenure: "22 years",
      reportsTo: "Managing Director, Racing",
      preferredContact: "Bi-weekly 1:1 + operational workshops",
      context:
        "The Head of Racing Operations oversees day-to-day management of HKJC's race calendar across Sha Tin and Happy Valley. They have expressed scepticism toward Agile methods and were last engaged 31 days ago, representing a material risk to Agile Rollout and Member Experience initiatives.",
      interests: [
        "Race-day operational reliability with zero disruption",
        "Staff stability through HR operating model changes",
        "Practical tools over theoretical frameworks",
      ],
      concerns: [
        "Agile sprint cadence conflicting with fixed racing calendar",
        "Data governance adding administrative burden",
        "Digital-led design decisions without ops input",
      ],
      influenceRows: [
        { initiative: "Agile Ways of Working", type: "Adoption Authority", stance: "Resistant" },
        { initiative: "Member Experience Redesign", type: "Operational Sign-off", stance: "Neutral" },
        { initiative: "OKR Framework", type: "Team OKR Adoption", stance: "Resistant" },
      ],
      engagements: [
        {
          date: "Mar 7",
          ago: "32 days ago",
          type: "1:1 Meeting",
          duration: "60 min",
          outcome: "Concerns Raised",
          points: [
            "Opposition to Agile sprint cadence interfering with Saturday race preparation",
            "Requested temporary exclusion from OKR rollout in Racing Operations",
          ],
          followUp: "Schedule Agile@Scale discovery workshop with Racing team leads",
          by: "SM",
        },
        {
          date: "Feb 5",
          ago: "62 days ago",
          type: "Working Group",
          duration: "90 min",
          outcome: "Neutral",
          points: [
            "Raised concerns on Member Experience design lacking racecourse input",
            "Agreed to nominate two racing SMEs to working group",
          ],
          followUp: "SME nomination by Feb 14 (not completed)",
          by: "PMO",
        },
        {
          date: "Jan 22",
          ago: "76 days ago",
          type: "Steering Committee",
          duration: "2 hours",
          outcome: "Neutral",
          points: ["Low engagement observed in Q2 review", "Flagged weak communication to frontline racing staff"],
          followUp: "Develop racing-specific transformation communication pack",
          by: "TO",
        },
      ],
      sentimentTrend: [{ month: "Oct", score: 3.5, avg: 3.2 }, { month: "Nov", score: 3.2, avg: 3.3 }, { month: "Dec", score: 3.0, avg: 3.4 }, { month: "Jan", score: 2.8, avg: 3.5 }, { month: "Feb", score: 2.5, avg: 3.6 }, { month: "Mar", score: 2.0, avg: 3.6 }],
      upcoming: ["Mar 25: Executive Steering Committee", "Apr 1: Agile@Scale Pilot Kick-off - Racing Division"],
      influenceMap: {
        influences: ["FU", "MS", "RP"],
        influencedBy: ["MD", "ED"],
        peers: ["MS"],
        note: "If resistance persists, there is high probability of cascading resistance among ~340 Racing Operations staff.",
      },
      actions: [
        { priority: "Urgent", desc: "Schedule re-engagement 1:1 (monthly cadence overdue)", owner: "TO Senior Manager", due: "8 Mar", status: "Open" },
        { priority: "High", desc: "Deliver Racing-specific Agile communications pack", owner: "Comms Team + HR", due: "22 Mar", status: "In Progress" },
        { priority: "High", desc: "Facilitate Agile discovery workshop with Racing leads", owner: "Agile Coach + TO Senior Manager", due: "1 Apr", status: "Open" },
        { priority: "Medium", desc: "Nominate Racing SME for Member Experience group", owner: "Head of Racing Ops", due: "14 Feb", status: "Overdue" },
      ],
      strategy: [
        "Co-design over mandate: involve Racing Ops in shaping Agile approach.",
        "Demonstrate quick wins in race calendar planning before scaling.",
        "Leverage MD Racing to reinforce narrative and accountability.",
      ],
    },
    { id: "s10", name: "Head of Member Services", role: "Member Services Lead", initials: "MS", group: "Senior Management", color: "#0D7377", interest: 82, power: 62, size: 34, sentiment: "Resistant", lastContactDays: 21, alignment: 2, frequency: "Monthly", priority: "High", tenure: "16 years", reportsTo: "Managing Director, Racing", preferredContact: "Member Experience steering", context: "Key owner for member-facing process and app scope decisions.", interests: ["Member satisfaction", "Service continuity", "Scope control"], concerns: ["Scope freeze friction", "Perceived under-resourcing"], influenceRows: [{ initiative: "Member Experience", type: "Initiative Owner", stance: "Resistant" }], engagements: [{ date: "21 Feb", ago: "21 days ago", type: "Steering Committee", duration: "60 min", outcome: "Concerns Raised", points: ["Raised scope freeze concerns", "Requested phased feature reintroduction"], followUp: "Run scope trade-off workshop", by: "SM" }], sentimentTrend: [{ month: "Oct", score: 3.4, avg: 3.2 }, { month: "Nov", score: 3.3, avg: 3.3 }, { month: "Dec", score: 3.1, avg: 3.4 }, { month: "Jan", score: 2.9, avg: 3.5 }, { month: "Feb", score: 2.6, avg: 3.6 }, { month: "Mar", score: 2.4, avg: 3.6 }], upcoming: ["Mar 15: Scope workshop", "Mar 28: Member steering"], influenceMap: { influences: ["MR"], influencedBy: ["MD", "RO"], peers: ["RO"], note: "Alignment decline linked to change freeze and unresolved scope trade-offs." }, actions: [{ priority: "High", desc: "Re-engagement workshop on scope priorities", owner: "TO + Product", due: "15 Mar", status: "Open" }], strategy: ["Reset expectations with transparent scope trade-offs.", "Give Member Services clear decision rights boundaries.", "Increase steering cadence until confidence recovers."], },
    { id: "s11", name: "HKJC Membership Representatives", role: "Member Council", initials: "MR", group: "Industry & External", color: "#526B2D", interest: 76, power: 38, size: 32, sentiment: "Neutral", lastContactDays: 16, alignment: 3, frequency: "Quarterly", priority: "Medium", tenure: "N/A", reportsTo: "Member Council Chair", preferredContact: "Townhall + digital update", context: "Representative voice on member experience changes.", interests: ["User experience quality", "Transparent communication"], concerns: ["Launch delays"], influenceRows: [{ initiative: "Member Experience", type: "Advisory", stance: "Neutral" }], engagements: [{ date: "22 Feb", ago: "16 days ago", type: "Workshop", duration: "90 min", outcome: "Neutral", points: ["Requested phased release transparency"], followUp: "Share revised release timeline", by: "SM" }], sentimentTrend: [{ month: "Oct", score: 3.0, avg: 3.2 }, { month: "Nov", score: 3.1, avg: 3.3 }, { month: "Dec", score: 3.1, avg: 3.4 }, { month: "Jan", score: 3.2, avg: 3.5 }, { month: "Feb", score: 3.2, avg: 3.6 }, { month: "Mar", score: 3.2, avg: 3.6 }], upcoming: ["Apr 4: Member briefing"], influenceMap: { influences: ["MS"], influencedBy: ["MD"], peers: [], note: "Can amplify positive or negative sentiment quickly through member channels." }, actions: [{ priority: "Medium", desc: "Issue member release note", owner: "Comms", due: "29 Mar", status: "Open" }], strategy: ["Maintain transparent progress updates.", "Use concise member-facing value statements.", "Include representative feedback loops."], },
    { id: "s12", name: "Front-line Racing Staff (Union Rep)", role: "Operations Staff Representative", initials: "FU", group: "Industry & External", color: "#526B2D", interest: 65, power: 32, size: 28, sentiment: "Resistant", lastContactDays: 18, alignment: 2, frequency: "Monthly", priority: "Medium", tenure: "N/A", reportsTo: "Head of Racing Operations", preferredContact: "On-site briefing", context: "Frontline sentiment materially affects adoption in racing operations.", interests: ["Roster stability", "Practical training"], concerns: ["Change fatigue"], influenceRows: [{ initiative: "Agile Rollout", type: "Adoption sentiment", stance: "Resistant" }], engagements: [{ date: "20 Feb", ago: "18 days ago", type: "Workshop", duration: "60 min", outcome: "Concerns Raised", points: ["Raised concerns on workload and unclear role impacts"], followUp: "Provide role impact pack", by: "HR" }], sentimentTrend: [{ month: "Oct", score: 3.0, avg: 3.2 }, { month: "Nov", score: 2.9, avg: 3.3 }, { month: "Dec", score: 2.8, avg: 3.4 }, { month: "Jan", score: 2.7, avg: 3.5 }, { month: "Feb", score: 2.6, avg: 3.6 }, { month: "Mar", score: 2.5, avg: 3.6 }], upcoming: ["Mar 27: Shift-lead briefing"], influenceMap: { influences: ["RO"], influencedBy: ["RO"], peers: [], note: "Sentiment risk remains moderate and tied to communication quality." }, actions: [{ priority: "Medium", desc: "Deliver role impact FAQ pack", owner: "HR + Comms", due: "24 Mar", status: "Open" }], strategy: ["Provide concrete operational examples.", "Use in-person forums for clarity.", "Track sentiment weekly through team leads."], },
    { id: "s13", name: "Change Champions Network", role: "Cross-division Change Champions", initials: "CC", group: "Change Champions Network", color: colors.success, interest: 88, power: 42, size: 30, sentiment: "Supportive", lastContactDays: 9, alignment: 4, frequency: "Bi-weekly", priority: "Medium", tenure: "N/A", reportsTo: "Transformation Office", preferredContact: "Champion forum", context: "Distributed network supporting local adoption and feedback loops.", interests: ["Local adoption", "Feedback capture"], concerns: ["Capacity to support all divisions"], influenceRows: [{ initiative: "OKR Framework", type: "Adoption support", stance: "Supportive" }], engagements: [{ date: "28 Feb", ago: "9 days ago", type: "Workshop", duration: "60 min", outcome: "Positive", points: ["Shared local blockers", "Aligned quick wins"], followUp: "Publish champion toolkit", by: "TO" }], sentimentTrend: [{ month: "Oct", score: 3.3, avg: 3.2 }, { month: "Nov", score: 3.4, avg: 3.3 }, { month: "Dec", score: 3.5, avg: 3.4 }, { month: "Jan", score: 3.7, avg: 3.5 }, { month: "Feb", score: 3.8, avg: 3.6 }, { month: "Mar", score: 3.9, avg: 3.6 }], upcoming: ["Mar 20: Champion forum"], influenceMap: { influences: ["FU", "MS"], influencedBy: ["HR"], peers: [], note: "High leverage network for improving local alignment quickly." }, actions: [{ priority: "Medium", desc: "Refresh champion playbook", owner: "TO Change Lead", due: "31 Mar", status: "In Progress" }], strategy: ["Scale proven playbooks.", "Use champions in resistant areas first.", "Close loop with visible action on feedback."], },
    { id: "s14", name: "External Wagering Technology Vendors", role: "Strategic Delivery Partners", initials: "VN", group: "Industry & External", color: "#526B2D", interest: 55, power: 22, size: 26, sentiment: "Neutral", lastContactDays: 11, alignment: 3, frequency: "Bi-weekly", priority: "Medium", tenure: "N/A", reportsTo: "Procurement", preferredContact: "Delivery governance forum", context: "Critical capacity provider for key technology milestones.", interests: ["SLA clarity", "Scope stability"], concerns: ["Concurrent demand on same resources"], influenceRows: [{ initiative: "Core Banking", type: "Delivery dependency", stance: "Neutral" }], engagements: [{ date: "27 Feb", ago: "11 days ago", type: "Working Group", duration: "90 min", outcome: "Neutral", points: ["Raised resource constraints", "Requested revised sequencing"], followUp: "Confirm capacity plan", by: "IT" }], sentimentTrend: [{ month: "Oct", score: 3.1, avg: 3.2 }, { month: "Nov", score: 3.1, avg: 3.3 }, { month: "Dec", score: 3.1, avg: 3.4 }, { month: "Jan", score: 3.0, avg: 3.5 }, { month: "Feb", score: 3.0, avg: 3.6 }, { month: "Mar", score: 3.0, avg: 3.6 }], upcoming: ["Mar 18: Vendor performance review"], influenceMap: { influences: ["CT"], influencedBy: ["CF", "CT"], peers: [], note: "Capacity pressure impacts timeline risk more than sentiment risk." }, actions: [{ priority: "High", desc: "Negotiate dedicated delivery pod", owner: "Procurement + CTO", due: "18 Mar", status: "In Progress" }], strategy: ["Tighten SLA and capacity governance.", "Use milestone-based escalation triggers.", "Maintain alternate vendor contingency."], },
  ];

  const groupColors: Record<GroupKey, string> = {
    "Executive Leadership": colors.navy,
    "Senior Management": "#0D7377",
    "Regulatory & Governance": "#6B21A8",
    "Industry & External": "#526B2D",
    "Change Champions Network": colors.success,
  };

  const [guideOpen, setGuideOpen] = useState(() => !getLocalFlag("stakeholder-guide-collapsed"));
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<"All" | "Overdue" | "Resistant">("All");
  const [logOpenFor, setLogOpenFor] = useState<Stakeholder | null>(null);
  const [lastContactOverrides, setLastContactOverrides] = useState<Record<string, number>>({});
  const [freshGlow, setFreshGlow] = useState<string | null>(null);
  const [activityFilter, setActivityFilter] = useState<"Last 30 days" | "Last 90 days" | "All">("Last 30 days");
  const [expandedActivity, setExpandedActivity] = useState<string | null>(null);
  const [bubblePulseAck, setBubblePulseAck] = useState(false);

  const selectedStakeholder = useMemo(() => stakeholders.find((s) => s.id === selectedId) ?? null, [selectedId, stakeholders]);
  const trackerStakeholders = useMemo(() => stakeholders.filter((s) => ["s1", "s2", "s3", "s4", "s5", "s6", "s8", "s9", "s10", "s7"].includes(s.id)), [stakeholders]);

  const getLastContact = useCallback((s: Stakeholder) => (s.id in lastContactOverrides ? lastContactOverrides[s.id] : s.lastContactDays), [lastContactOverrides]);

  const filteredTracker = trackerStakeholders.filter((s) => {
    const days = getLastContact(s);
    if (filter === "Overdue") return days > 30;
    if (filter === "Resistant") return s.sentiment === "Resistant";
    return true;
  });

  const bubbleData = useMemo(() => [...stakeholders].sort((a, b) => b.size - a.size), [stakeholders]);
  const sentimentCounts = { supportive: stakeholders.filter((s) => s.sentiment === "Supportive").length, neutral: stakeholders.filter((s) => s.sentiment === "Neutral").length, resistant: stakeholders.filter((s) => s.sentiment === "Resistant").length };

  const alignmentTrend = [
    { month: "Oct", score: 3.2 },
    { month: "Nov", score: 3.3 },
    { month: "Dec", score: 3.4 },
    { month: "Jan", score: 3.5 },
    { month: "Feb", score: 3.6 },
    { month: "Mar", score: 3.6 },
  ];

  const activityRows = [
    { id: "a1", date: "4 Mar", stakeholder: "CEO", type: "Executive Briefing", duration: "30 min", outcome: "Positive", follow: "None required", by: "SM", notes: "Reviewed risk posture and confirmed decision cadence for Q4 planning." },
    { id: "a2", date: "3 Mar", stakeholder: "CTO", type: "Working Group", duration: "90 min", outcome: "Positive", follow: "Vendor review by 18 Mar", by: "SM", notes: "Agreed emergency vendor performance review and remediation sequence." },
    { id: "a3", date: "28 Feb", stakeholder: "CFO", type: "1:1 Budget Review", duration: "60 min", outcome: "Concerns Raised", follow: "Provide Cloud Security cost-benefit analysis", by: "SM", notes: "CFO requested quantified downside and confidence range before approval." },
    { id: "a4", date: "26 Feb", stakeholder: "Head of Legal", type: "Compliance Working Group", duration: "90 min", outcome: "Neutral", follow: "Policy draft by 7 Mar", by: "PMO", notes: "Legal queue delay highlighted as blocker for RG analytics timeline." },
    { id: "a5", date: "21 Feb", stakeholder: "Head of Member Services", type: "Member Experience Steering", duration: "60 min", outcome: "Concerns Raised", follow: "Change freeze communicated", by: "SM", notes: "Escalated friction around deferred feature requests and governance controls." },
    { id: "a6", date: "19 Feb", stakeholder: "CHRO", type: "People Workstream Review", duration: "60 min", outcome: "Positive", follow: "None", by: "SM", notes: "Change readiness support plan agreed for lagging divisions." },
    { id: "a7", date: "14 Feb", stakeholder: "Head of Compliance", type: "RG Analytics Review", duration: "90 min", outcome: "Concerns Raised", follow: "Escalate training platform to IT Lead", by: "SM", notes: "Critical training completion gap confirmed and escalation action opened." },
    { id: "a8", date: "12 Feb", stakeholder: "Board of Stewards", type: "Quarterly Briefing Pack (email)", duration: "-", outcome: "Neutral", follow: "Q3 update due 1 Mar", by: "SM", notes: "Board requested stronger financial narrative and risk trend clarity." },
    { id: "a9", date: "10 Feb", stakeholder: "MD Racing", type: "1:1 Meeting", duration: "45 min", outcome: "Positive", follow: "Sponsor message for Racing Ops", by: "SM", notes: "MD aligned to support re-engagement in operations division." },
    { id: "a10", date: "6 Feb", stakeholder: "HKSAR Authority", type: "Email Update", duration: "20 min", outcome: "Neutral", follow: "Regulatory note due", by: "TO", notes: "Acknowledged receipt; requested next compliance milestone update." },
    { id: "a11", date: "5 Feb", stakeholder: "Head of Racing Operations", type: "Working Group", duration: "90 min", outcome: "Concerns Raised", follow: "SME nomination overdue ⚠", by: "PMO", notes: "Ops concerns on Agile impact to race-day prep remained unresolved." },
    { id: "a12", date: "2 Feb", stakeholder: "Change Champions", type: "Workshop", duration: "60 min", outcome: "Positive", follow: "Publish toolkit", by: "TO", notes: "Champion network asked for faster local communication assets." },
    { id: "a13", date: "31 Jan", stakeholder: "Vendors", type: "Phone Call", duration: "30 min", outcome: "Neutral", follow: "Capacity addendum", by: "IT", notes: "Vendor resource conflicts confirmed across two critical streams." },
    { id: "a14", date: "30 Jan", stakeholder: "Member Reps", type: "Workshop", duration: "90 min", outcome: "Neutral", follow: "Release timeline pack", by: "SM", notes: "Member expectations reset session completed with no major escalations." },
  ];

  const visibleRows = activityFilter === "Last 30 days" ? activityRows.slice(0, 8) : activityFilter === "Last 90 days" ? activityRows.slice(0, 12) : activityRows;
  const hint = useHintText("stakeholders");
  const pulse = usePagePulse("stakeholders");

  const sentimentClass = (s: Sentiment) => (s === "Supportive" ? "bg-emerald-50 text-emerald-700" : s === "Neutral" ? "bg-amber-50 text-amber-700" : "bg-red-50 text-red-700");
  const outcomeClass = (o: string) => (o === "Positive" ? "bg-emerald-50 text-emerald-700" : o === "Neutral" ? "bg-slate-100 text-slate-700" : o === "Concerns Raised" ? "bg-amber-50 text-amber-700" : "bg-red-50 text-red-700");

  const submitLog = (id: string) => {
    const who = stakeholders.find((s) => s.id === id);
    setLastContactOverrides((s) => ({ ...s, [id]: 0 }));
    setFreshGlow(id);
    setTimeout(() => setFreshGlow(null), 2000);
    onToast(`Engagement logged successfully for ${who?.name ?? "stakeholder"}`);
    setLogOpenFor(null);
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold text-[#003366]">Stakeholder Engagement Matrix</h2>
        <p className="text-sm text-slate-600">Senior Stakeholder Mapping & Engagement Tracker · Q3 FY2024-25</p>
      </div>

      <div className="flex flex-wrap gap-2 text-xs">
        <span className="rounded-full bg-white px-3 py-1">Total Stakeholders Mapped: 14</span>
        <span className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-700">Actively Engaged: 9</span>
        <span className="animate-pulse rounded-full bg-red-50 px-3 py-1 text-red-700">Engagement Overdue: 3</span>
        <span className="rounded-full bg-[#FDF8EC] px-3 py-1 text-[#C8922A]">Average Alignment Score: 3.6 / 5</span>
        <span className="rounded-full bg-white px-3 py-1">Sentiment: <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-emerald-700">7 Supportive</span> <span className="rounded-full bg-amber-50 px-2 py-0.5 text-amber-700">5 Neutral</span> <span className="rounded-full bg-red-50 px-2 py-0.5 text-red-700">2 Resistant</span></span>
      </div>

      <section className="overflow-hidden rounded-2xl border-l-[3px] border-[#003366] bg-[#E8EFF8] shadow-sm">
        <button type="button" aria-label="Toggle matrix guide" className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-semibold text-[#003366]" onClick={() => setGuideOpen((s) => !s)}>
          <span>How to read this matrix {guideOpen ? "▾" : "▸"}</span>
          {guideOpen && <span className="text-xs text-slate-500">Got it - hide guide ✕</span>}
        </button>
        <AnimatePresence initial={false}>
          {guideOpen && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="px-4 pb-4">
              <h4 className="mb-2 text-sm font-semibold text-[#003366]">How to read the Power / Interest Matrix</h4>
              <div className="grid gap-3 md:grid-cols-2">
                <div className="overflow-hidden rounded-xl border border-slate-200 bg-white text-[11px]">
                  <div className="grid grid-cols-2">
                    <div className="border-b border-r bg-[#FFFBF0] p-2"><p className="font-bold text-[#C8922A]">KEEP SATISFIED</p><p>High Power</p><p>Low Interest</p></div>
                    <div className="border-b bg-[#EEF4FF] p-2"><p className="font-bold text-[#003366]">MANAGE CLOSELY</p><p>High Power</p><p>High Interest</p></div>
                    <div className="border-r bg-[#F8F8F8] p-2"><p className="font-bold text-slate-400">MONITOR</p><p>Low Power</p><p>Low Interest</p></div>
                    <div className="bg-[#F0FAF4] p-2"><p className="font-bold text-[#2D8653]">KEEP INFORMED</p><p>Low Power</p><p>High Interest</p></div>
                  </div>
                </div>
                <ul className="space-y-1 text-xs text-slate-700">
                  <li>Manage Closely (top-right): highest influence and highest interest stakeholders.</li>
                  <li>Keep Satisfied (top-left): powerful stakeholders with lower day-to-day involvement.</li>
                  <li>Keep Informed (bottom-right): highly interested advocates with lower blocking power.</li>
                  <li>Monitor (bottom-left): light-touch engagement and periodic review.</li>
                </ul>
              </div>
              <p className="mt-2 text-xs text-slate-600">Bubble size = stakeholder impact on transformation programme.</p>
              <div className="mt-2 flex flex-wrap gap-2 text-[11px]">
                {Object.entries(groupColors).map(([name, color]) => <span key={name} className="rounded-full bg-white px-2 py-1"><span className="mr-1 inline-block h-2.5 w-2.5 rounded-full align-middle" style={{ backgroundColor: color }} />{name}</span>)}
              </div>
              <p className="mt-2 text-xs italic text-slate-500">Click any bubble to view full stakeholder profile.</p>
              <button type="button" className="mt-2 text-xs text-[#003366] underline" onClick={() => { setGuideOpen(false); setLocalFlag("stakeholder-guide-collapsed"); }}>Got it - hide guide ✕</button>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      <div className="grid gap-4 xl:grid-cols-12">
        <section className="xl:col-span-7 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <h3 className="mb-3 text-base font-bold text-[#003366]">Power / Interest Matrix</h3>
          <div className="relative h-[520px] overflow-hidden rounded-xl border border-slate-200 bg-white">
            <div className="absolute inset-0 grid grid-cols-2 grid-rows-2">
              <div className="bg-[#FFFBF0]" />
              <div className="relative bg-[#EEF4FF]"><div className="absolute inset-1 border border-dashed border-[#C8922A]/60" /></div>
              <div className="bg-[#F8F8F8]" />
              <div className="bg-[#F0FAF4]" />
            </div>
            {[25, 50, 75].map((v) => <div key={`v${v}`} className="absolute inset-y-0 border-l border-[#F0F0F0]" style={{ left: `${v}%` }} />)}
            {[25, 50, 75].map((v) => <div key={`h${v}`} className="absolute inset-x-0 border-t border-[#F0F0F0]" style={{ top: `${v}%` }} />)}
            <div className="absolute inset-y-0 left-1/2 border-l border-dashed border-slate-400/70" />
            <div className="absolute inset-x-0 top-1/2 border-t border-dashed border-slate-400/70" />
            <p className="absolute left-2 top-2 text-[11px] font-bold tracking-wide text-[#C8922A]">KEEP SATISFIED</p>
            <p className="absolute right-2 top-2 text-[11px] font-bold tracking-wide text-[#003366]">MANAGE CLOSELY</p>
            <p className="absolute bottom-2 left-2 text-[11px] font-bold tracking-wide text-slate-400">MONITOR</p>
            <p className="absolute bottom-2 right-2 text-[11px] font-bold tracking-wide text-[#2D8653]">KEEP INFORMED</p>

            {bubbleData.map((s, idx) => {
              const left = s.interest;
              const top = 100 - s.power;
              const sentimentDot = s.sentiment === "Supportive" ? colors.success : s.sentiment === "Neutral" ? colors.warning : colors.danger;
              const overdue = getLastContact(s) > 30;
              return (
                <motion.button
                  key={s.id}
                  type="button"
                  role="button"
                  aria-label={`Open stakeholder profile for ${s.name}`}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: idx * 0.05, type: "spring", stiffness: 280, damping: 20 }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white text-[13px] font-bold text-white shadow-lg transition-transform duration-200 hover:z-20 hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C8922A]"
                  style={{ left: `${left}%`, top: `${top}%`, width: s.size, height: s.size, backgroundColor: s.color }}
                  onMouseEnter={() => setHoveredId(s.id)}
                  onMouseLeave={() => setHoveredId((id) => (id === s.id ? null : id))}
                  onClick={() => {
                    pulse.acknowledge();
                    setBubblePulseAck(true);
                    setSelectedId(s.id);
                  }}
                  onKeyDown={(e) => handleKeyboardActivate(e, () => setSelectedId(s.id))}
                >
                  {pulse.show && !bubblePulseAck && idx === 0 && <span className="pointer-events-none absolute -inset-2 rounded-full border-2 border-[#C8922A] animate-pulse" />}
                  {s.initials}
                  {overdue && <span className="pointer-events-none absolute -inset-2 rounded-full border border-red-400/60 animate-ping" />}
                  {freshGlow === s.id && <span className="pointer-events-none absolute -inset-2 rounded-full border-2 border-[#C8922A] animate-pulse" />}
                  <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white" style={{ backgroundColor: sentimentDot }} />
                </motion.button>
              );
            })}

            {hoveredId && (() => {
              const s = stakeholders.find((st) => st.id === hoveredId);
              if (!s) return null;
              const left = Math.min(80, Math.max(20, s.interest));
              const top = Math.max(10, 100 - s.power - 14);
              const days = getLastContact(s);
              return (
                <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="absolute z-30 w-[240px] -translate-x-1/2 rounded-lg border border-[#003366] bg-white p-3 shadow-xl" style={{ left: `${left}%`, top: `${top}%` }}>
                  <p className="text-xs font-bold text-[#003366]">{s.name}</p>
                  <p className="text-[11px] text-slate-500">{s.role}</p>
                  <div className="my-1 border-t border-slate-200" />
                  <div className="grid grid-cols-2 text-[11px] text-slate-600"><p>Power: {s.power}/100</p><p>Interest: {s.interest}/100</p></div>
                  <div className="mt-1 flex items-center justify-between text-[11px]"><span className={cn("rounded-full px-2 py-0.5", sentimentClass(s.sentiment))}>{s.sentiment}</span><span className={cn(days < 7 ? "text-emerald-700" : days < 30 ? "text-amber-700" : "text-red-700")}>Last engaged: {days} days ago</span></div>
                  <p className="mt-1 text-[11px] italic text-[#C8922A]">Click for full profile →</p>
                </motion.div>
              );
            })()}

            <p className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[11px] italic text-slate-500">← Low Interest   LEVEL OF INTEREST   High Interest →</p>
            <p className="absolute left-2 top-1/2 -translate-y-1/2 -rotate-90 text-[11px] italic text-slate-500">↑ High Power   LEVEL OF POWER / INFLUENCE   Low Power ↓</p>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-3 text-[11px] text-slate-600">
            {Object.entries(groupColors).map(([name, color]) => <span key={name}><span className="mr-1 inline-block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />{name}</span>)}
            <span>○ Small = Lower impact | ○ Medium = Moderate impact | ○ Large = High impact</span>
          </div>
          {hint && <p className="mt-2 text-xs italic text-slate-500">Click to explore</p>}
        </section>

        <section className="xl:col-span-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <h3 className="text-base font-bold text-[#003366]">Engagement Health Tracker</h3>
          <p className="text-xs text-slate-500">Executive & Senior Tier · Last 90 Days</p>
          <div className="mt-2 flex gap-2 text-xs">
            {(["All", "Overdue", "Resistant"] as const).map((f) => (
              <button key={f} type="button" aria-label={`Filter ${f}`} onClick={() => setFilter(f)} className={cn("rounded-full border px-3 py-1", filter === f ? "border-[#C8922A] bg-[#FDF8EC] text-[#003366]" : "border-slate-300 bg-white text-slate-600")}>{f}</button>
            ))}
          </div>

          <div className="mt-3 max-h-[520px] space-y-2 overflow-auto pr-1">
            {filteredTracker.map((s, idx) => {
              const days = getLastContact(s);
              const overdue = days > 30;
              const resistant = s.sentiment === "Resistant";
              return (
                <div key={s.id} className="relative">
                  {pulse.show && idx === 0 && <span className="pointer-events-none absolute -inset-1 rounded-xl border-2 border-[#C8922A] animate-pulse" />}
                  <div
                    role="button"
                    tabIndex={0}
                    aria-label={`Open stakeholder profile ${s.name}`}
                    className={cn("rounded-xl border border-slate-200 p-3", resistant && "border-l-[3px] border-l-red-400", overdue && "bg-amber-50/40", interactiveClass)}
                    onClick={() => setSelectedId(s.id)}
                    onKeyDown={(e) => handleKeyboardActivate(e, () => setSelectedId(s.id))}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white" style={{ backgroundColor: s.color }}>{s.initials}</div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2"><p className="text-sm font-semibold text-slate-800">{s.name}</p><span className={cn("rounded-full px-2 py-0.5 text-[11px]", sentimentClass(s.sentiment))}>{s.sentiment}</span></div>
                        <p className="text-xs text-slate-500">{s.role}</p>
                        <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px]">
                          <span>{"●".repeat(s.alignment)}{"○".repeat(5 - s.alignment)} <span className="text-[#C8922A]">({s.alignment}/5)</span></span>
                          <span className="rounded-full bg-slate-100 px-2 py-0.5">{s.frequency}</span>
                          <span className={cn("rounded-full px-2 py-0.5", days <= 7 ? "bg-emerald-50 text-emerald-700" : days <= 30 ? "bg-amber-50 text-amber-700" : "bg-red-50 text-red-700")}>{days === 0 ? "Today" : `${days} days ago`} {overdue && "⚠"}</span>
                        </div>
                        {s.id === "s8" && <p className="mt-1 text-[11px] text-amber-700">Q4 briefing due</p>}
                        {s.id === "s9" && <p className="mt-1 text-[11px] text-red-700">Overdue — last contact 31 days ago. Resistance risk to Agile Rollout.</p>}
                        {s.id === "s10" && <p className="mt-1 text-[11px] text-amber-700">Declining alignment — scope freeze caused friction. Re-engagement needed.</p>}
                        {s.id === "s7" && <p className="mt-1 text-[11px] text-red-700">Overdue quarterly briefing — RG compliance update required.</p>}
                      </div>
                      <button type="button" className="rounded-lg border border-[#C8922A] px-2 py-1 text-[11px] text-[#003366] hover:scale-[1.02]" onClick={(e) => { e.stopPropagation(); setLogOpenFor(s); }}>+ Log Contact</button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 rounded-xl border border-slate-200 p-3">
            <h4 className="text-sm font-semibold text-[#003366]">Overall Stakeholder Alignment Trend - Last 6 Months</h4>
            <div className="mt-2 h-48">
              <ResponsiveContainer>
                <LineChart data={alignmentTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis domain={[0, 5]} />
                  <RechartsTooltip />
                  <ReferenceLine y={4} stroke="#94a3b8" strokeDasharray="4 4" label="Target alignment" />
                  <Line dataKey="score" stroke={colors.gold} strokeWidth={2.5} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <p className="text-xs text-slate-600">Mar: 78% - Q3 score</p>
          </div>
        </section>
      </div>

      <Panel title="Engagement Activity Log" subtitle="Last 30 days">
        <div className="mb-2 flex flex-wrap gap-2 text-xs">
          {(["Last 30 days", "Last 90 days", "All"] as const).map((f) => (
            <button key={f} type="button" className={cn("rounded-full border px-2.5 py-1", activityFilter === f ? "border-[#C8922A] bg-[#FDF8EC] text-[#003366]" : "border-slate-300")} onClick={() => setActivityFilter(f)}>{f}</button>
          ))}
        </div>
        <div className="overflow-auto">
          <table className="min-w-full text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-left text-slate-500">
                <th className="px-2 py-2">Date</th><th className="px-2 py-2">Stakeholder</th><th className="px-2 py-2">Activity Type</th><th className="px-2 py-2">Duration</th><th className="px-2 py-2">Outcome</th><th className="px-2 py-2">Follow-up</th><th className="px-2 py-2">Logged By</th>
              </tr>
            </thead>
            <tbody>
              {visibleRows.map((r) => (
                <>
                  <tr key={r.id} className={cn("border-b border-slate-100", interactiveClass)} role="button" tabIndex={0} onClick={() => setExpandedActivity((v) => (v === r.id ? null : r.id))} onKeyDown={(e) => handleKeyboardActivate(e, () => setExpandedActivity((v) => (v === r.id ? null : r.id)))}>
                    <td className="px-2 py-2">{r.date}</td>
                    <td className="px-2 py-2 font-semibold text-slate-700">{r.stakeholder}</td>
                    <td className="px-2 py-2">{r.type}</td>
                    <td className="px-2 py-2">{r.duration}</td>
                    <td className="px-2 py-2"><span className={cn("rounded-full px-2 py-0.5", outcomeClass(r.outcome))}>{r.outcome}</span></td>
                    <td className={cn("px-2 py-2", r.follow.includes("⚠") && "font-semibold text-red-700")}>{r.follow}</td>
                    <td className="px-2 py-2">{r.by}</td>
                  </tr>
                  {expandedActivity === r.id && (
                    <tr key={`${r.id}-expanded`} className="border-b border-slate-100 bg-slate-50"><td colSpan={7} className="px-3 py-2 text-[12px] text-slate-600">{r.notes}</td></tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
        {activityFilter === "Last 30 days" && <button type="button" className="mt-2 rounded-lg border border-slate-300 px-3 py-1 text-xs" onClick={() => setActivityFilter("All")}>Show more</button>}
      </Panel>

      <Panel title="Sentiment & Alignment Overview">
        <div className="grid gap-4 lg:grid-cols-3">
          <div>
            <h4 className="text-sm font-semibold text-[#003366]">Sentiment Distribution</h4>
            <div className="h-56">
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={[{ name: "Supportive", value: 7 }, { name: "Neutral", value: 5 }, { name: "Resistant", value: 2 }]} dataKey="value" innerRadius={48} outerRadius={76}>
                    <Cell fill={colors.success} /><Cell fill={colors.warning} /><Cell fill={colors.danger} />
                  </Pie>
                  <RechartsTooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <p className="-mt-16 text-center text-xs font-semibold text-[#003366]">14 Stakeholders</p>
            <div className="mt-8 flex gap-2 text-xs"><span className="rounded-full bg-emerald-50 px-2 py-1 text-emerald-700">Supportive: {sentimentCounts.supportive}</span><span className="rounded-full bg-amber-50 px-2 py-1 text-amber-700">Neutral: {sentimentCounts.neutral}</span><span className="rounded-full bg-red-50 px-2 py-1 text-red-700">Resistant: {sentimentCounts.resistant}</span></div>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-[#003366]">Alignment by Quadrant</h4>
            <div className="h-56">
              <ResponsiveContainer>
                <BarChart data={[{ q: "Manage Closely", v: 3.8, fill: colors.gold }, { q: "Keep Satisfied", v: 3.0, fill: colors.navy }, { q: "Keep Informed", v: 3.2, fill: colors.navy }, { q: "Monitor", v: 2.8, fill: colors.navy }]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="q" tick={{ fontSize: 10 }} />
                  <YAxis domain={[0, 5]} />
                  <RechartsTooltip />
                  <Bar dataKey="v" radius={[6, 6, 0, 0]}>
                    {[colors.gold, colors.navy, colors.navy, colors.navy].map((c) => <Cell key={c + Math.random()} fill={c} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="space-y-2">
            {[
              { id: "s9", level: "HIGH", text: "Head of Racing Operations - 31 days no contact. Resistant sentiment. Manage Closely quadrant.", action: "Book 1:1 by 10 Mar" },
              { id: "s7", level: "HIGH", text: "HKSAR Racing Authority - 45 days no contact. RG compliance exposure.", action: "Prepare regulatory briefing note" },
              { id: "s8", level: "MEDIUM", text: "Board of Stewards - Q4 briefing pack due. Last contact 28 days ago.", action: "Prepare Q3 progress summary" },
            ].map((risk) => (
              <div key={risk.id} className={cn("rounded-xl border p-3", risk.level === "HIGH" ? "border-red-200 bg-red-50" : "border-amber-200 bg-amber-50")}>
                <p className={cn("text-xs font-semibold", risk.level === "HIGH" ? "text-red-700" : "text-amber-700")}>{risk.level === "HIGH" ? "🔴 HIGH" : "🟡 MEDIUM"}</p>
                <p className="text-xs text-slate-700">{risk.text}</p>
                <div className="mt-2 flex items-center justify-between"><span className="text-[11px] text-slate-600">Action: {risk.action}</span><button type="button" className="rounded-lg border border-[#C8922A] px-2 py-1 text-[11px] text-[#003366]" onClick={() => setLogOpenFor(stakeholders.find((s) => s.id === risk.id) ?? null)}>Log Contact</button></div>
              </div>
            ))}
          </div>
        </div>
      </Panel>

      <SlideDrawer
        open={Boolean(selectedStakeholder)}
        onClose={() => setSelectedId(null)}
        title={selectedStakeholder ? `${selectedStakeholder.name}` : "Stakeholder Profile"}
        breadcrumb="Stakeholder Matrix → Stakeholder Profile"
        width={560}
        onExport={() => onToast("Report exported to PDF")}
      >
        {selectedStakeholder && (
          <Tabs.Root defaultValue="profile" className="space-y-3">
            <Tabs.List className="grid grid-cols-4 rounded-lg bg-slate-100 p-1 text-xs">
              <Tabs.Trigger value="profile" className="rounded-md px-2 py-1 data-[state=active]:bg-white data-[state=active]:text-[#003366]">Profile</Tabs.Trigger>
              <Tabs.Trigger value="engagement" className="rounded-md px-2 py-1 data-[state=active]:bg-white data-[state=active]:text-[#003366]">Engagement</Tabs.Trigger>
              <Tabs.Trigger value="influence" className="rounded-md px-2 py-1 data-[state=active]:bg-white data-[state=active]:text-[#003366]">Influence Map</Tabs.Trigger>
              <Tabs.Trigger value="actions" className="rounded-md px-2 py-1 data-[state=active]:bg-white data-[state=active]:text-[#003366]">Actions</Tabs.Trigger>
            </Tabs.List>

            <Tabs.Content value="profile" asChild>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.15 }} className="space-y-3">
                <div className="rounded-xl border border-slate-200 p-3">
                  <div className="flex items-start gap-3">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full text-xl font-bold text-white" style={{ backgroundColor: selectedStakeholder.color }}>{selectedStakeholder.initials}</div>
                    <div>
                      <h4 className="text-lg font-bold text-[#003366]">{selectedStakeholder.name}</h4>
                      <p className="text-sm text-slate-500">{selectedStakeholder.role}</p>
                      <div className="mt-1 flex flex-wrap gap-1 text-[11px]"><span className="rounded-full bg-slate-100 px-2 py-0.5">Reports to: {selectedStakeholder.reportsTo}</span><span className="rounded-full bg-slate-100 px-2 py-0.5">Tenure at HKJC: {selectedStakeholder.tenure}</span></div>
                    </div>
                  </div>
                  <div className="mt-3 grid gap-2 text-xs md:grid-cols-2">
                    <div className="space-y-1">
                      <p>Stakeholder Group: <span className="rounded-full bg-[#E8EFF8] px-2 py-0.5 text-[#003366]">{selectedStakeholder.group}</span></p>
                      <p>Interest Level: {selectedStakeholder.interest}/100</p>
                      <div className="h-1.5 rounded-full bg-slate-200"><div className="h-1.5 rounded-full bg-[#003366]" style={{ width: `${selectedStakeholder.interest}%` }} /></div>
                      <p>Power Level: {selectedStakeholder.power}/100</p>
                      <div className="h-1.5 rounded-full bg-slate-200"><div className="h-1.5 rounded-full bg-[#003366]" style={{ width: `${selectedStakeholder.power}%` }} /></div>
                      <p>Matrix Quadrant: <span className="rounded-full bg-[#E8EFF8] px-2 py-0.5 text-[#003366]">{selectedStakeholder.power >= 50 ? (selectedStakeholder.interest >= 50 ? "Manage Closely" : "Keep Satisfied") : selectedStakeholder.interest >= 50 ? "Keep Informed" : "Monitor"}</span></p>
                    </div>
                    <div className="space-y-1">
                      <p>Current Sentiment: <span className={cn("rounded-full px-2 py-0.5", sentimentClass(selectedStakeholder.sentiment))}>{selectedStakeholder.sentiment}</span></p>
                      <p>Alignment Score: <span className="text-[#C8922A]">{"●".repeat(selectedStakeholder.alignment)}{"○".repeat(5 - selectedStakeholder.alignment)}</span> {selectedStakeholder.alignment}/5</p>
                      <p>Engagement Priority: <span className="rounded-full bg-slate-100 px-2 py-0.5">{selectedStakeholder.priority}</span></p>
                      <p>Preferred Contact: {selectedStakeholder.preferredContact}</p>
                    </div>
                  </div>
                </div>
                <Panel title="Stakeholder Context"><p className="text-sm text-slate-700">{selectedStakeholder.context}</p></Panel>
                <Panel title="Key Interests & Motivations"><ul className="list-disc space-y-1 pl-5 text-sm text-slate-700">{selectedStakeholder.interests.map((i) => <li key={i}>{i}</li>)}</ul></Panel>
                <Panel title="Potential Concerns"><ul className="list-disc space-y-1 pl-5 text-sm text-slate-700">{selectedStakeholder.concerns.map((i) => <li key={i}>{i}</li>)}</ul></Panel>
                <Panel title="Influence on Key Initiatives">
                  <table className="min-w-full text-xs"><thead><tr className="border-b"><th className="py-1 text-left">Initiative</th><th className="text-left">Influence Type</th><th className="text-left">Stance</th></tr></thead><tbody>{selectedStakeholder.influenceRows.map((row) => <tr key={row.initiative} className="border-b last:border-none"><td className="py-1">{row.initiative}</td><td>{row.type}</td><td>{row.stance}</td></tr>)}</tbody></table>
                </Panel>
              </motion.div>
            </Tabs.Content>

            <Tabs.Content value="engagement" asChild>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.15 }} className="space-y-3">
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="rounded-full bg-white px-3 py-1">Total Engagements (90 days): {selectedStakeholder.engagements.length}</span>
                  <span className="rounded-full bg-white px-3 py-1">Average Frequency: {selectedStakeholder.frequency}</span>
                  <span className={cn("rounded-full px-3 py-1", outcomeClass(selectedStakeholder.engagements[0]?.outcome ?? "Neutral"))}>Last Outcome: {selectedStakeholder.engagements[0]?.outcome ?? "Neutral"}</span>
                </div>
                <Panel title="Engagement History Timeline">
                  <div className="space-y-2">
                    {selectedStakeholder.engagements.map((e) => (
                      <div key={`${e.date}-${e.type}`} className="rounded-lg border border-slate-200 p-2 text-xs">
                        <div className="flex items-center justify-between"><p className="font-semibold text-[#003366]">{e.date} ({e.ago}) · {e.type}</p><span className="rounded-full bg-slate-100 px-2 py-0.5">{e.duration}</span></div>
                        <span className={cn("mt-1 inline-flex rounded-full px-2 py-0.5", outcomeClass(e.outcome))}>{e.outcome}</span>
                        <ul className="mt-1 list-disc pl-4 text-slate-600">{e.points.map((p) => <li key={p}>{p}</li>)}</ul>
                        <p className="mt-1 italic text-slate-600">Follow-up: {e.followUp}</p>
                        <p className="text-[11px] text-slate-500">Logged by: {e.by}</p>
                      </div>
                    ))}
                  </div>
                </Panel>
                <Panel title="Sentiment Trend">
                  <div className="h-56">
                    <ResponsiveContainer>
                      <LineChart key={`sentiment-${selectedStakeholder.id}`} data={selectedStakeholder.sentimentTrend}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis domain={[1, 5]} />
                        <RechartsTooltip />
                        <Line dataKey="avg" stroke="#94A3B8" strokeDasharray="4 4" dot={false} />
                        <Line dataKey="score" stroke={selectedStakeholder.sentiment === "Resistant" ? colors.danger : colors.gold} strokeWidth={2.4} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  {selectedStakeholder.id === "s9" && <p className="text-xs text-red-700">Agile Rollout resistance emerged Feb</p>}
                </Panel>
                <Panel title="Planned Upcoming Engagements"><div className="space-y-2">{selectedStakeholder.upcoming.map((u) => <p key={u} className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-xs">{u}</p>)}</div></Panel>
              </motion.div>
            </Tabs.Content>

            <Tabs.Content value="influence" asChild>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.15 }} className="space-y-3">
                <Panel title="Stakeholder Influence Network">
                  <div className="relative h-72 rounded-xl border border-slate-200 bg-slate-50">
                    <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full">
                      {[{ to: [20, 22], type: "influences" }, { to: [80, 22], type: "influences" }, { to: [20, 78], type: "influencedBy" }, { to: [80, 78], type: "peer" }].map((line, i) => (
                        <motion.line
                          key={String(i)}
                          x1="50"
                          y1="50"
                          x2={String(line.to[0])}
                          y2={String(line.to[1])}
                          stroke={line.type === "influences" ? colors.gold : line.type === "influencedBy" ? "#94A3B8" : "#64748B"}
                          strokeDasharray={line.type === "peer" ? "4 4" : "0"}
                          strokeWidth="1.8"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 0.35, delay: i * 0.08 }}
                        />
                      ))}
                    </svg>
                    <motion.div className="absolute left-1/2 top-1/2 z-10 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-sm font-bold text-white" style={{ backgroundColor: selectedStakeholder.color }} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>{selectedStakeholder.initials}</motion.div>
                    {[{ x: "20%", y: "22%", label: selectedStakeholder.influenceMap.influences[0] ?? "IN" }, { x: "80%", y: "22%", label: selectedStakeholder.influenceMap.influences[1] ?? "IN" }, { x: "20%", y: "78%", label: selectedStakeholder.influenceMap.influencedBy[0] ?? "BY" }, { x: "80%", y: "78%", label: selectedStakeholder.influenceMap.peers[0] ?? "PE" }].map((n, idx) => (
                      <motion.div key={`${n.label}-${idx}`} className="absolute z-10 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#003366] text-[11px] font-semibold text-white" style={{ left: n.x, top: n.y }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: idx * 0.1 + 0.1 }}>{n.label}</motion.div>
                    ))}
                  </div>
                </Panel>
                <Panel title="Influence Risk Assessment"><p className="text-sm text-slate-700">⚠ {selectedStakeholder.influenceMap.note}</p></Panel>
              </motion.div>
            </Tabs.Content>

            <Tabs.Content value="actions" asChild>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.15 }} className="space-y-3">
                <Panel title="Open Action Items">
                  <div className="space-y-2">
                    {selectedStakeholder.actions.map((a) => (
                      <div key={a.desc} className="rounded-xl border border-slate-200 p-2 text-xs">
                        <div className="flex items-center justify-between gap-2"><span className={cn("rounded-full px-2 py-0.5", a.priority === "Urgent" ? "bg-red-100 text-red-800" : a.priority === "High" ? "bg-amber-50 text-amber-700" : "bg-slate-100 text-slate-700")}>{a.priority.toUpperCase()}</span><span className={cn("rounded-full px-2 py-0.5", a.status === "Overdue" ? "bg-red-50 text-red-700" : "bg-slate-100 text-slate-700")}>{a.status}</span></div>
                        <p className="mt-1 font-semibold text-slate-800">{a.desc}</p>
                        <p className="text-slate-600">Owner: {a.owner}</p>
                        <p className={cn(a.status === "Overdue" ? "text-red-700" : "text-slate-500")}>Due: {a.due}</p>
                        <button type="button" className="mt-1 rounded border border-slate-300 px-2 py-0.5" onClick={() => onToast("Action marked complete")}>Mark complete</button>
                      </div>
                    ))}
                  </div>
                </Panel>
                <Panel title={`Recommended Approach - ${selectedStakeholder.name}`}>
                  <ul className="list-disc space-y-1 pl-5 text-sm text-slate-700">{selectedStakeholder.strategy.map((s) => <li key={s}>{s}</li>)}</ul>
                </Panel>
                {(selectedStakeholder.sentiment === "Resistant" || getLastContact(selectedStakeholder) > 30) && (
                  <div className="rounded-xl border border-red-300 bg-red-50 p-3 text-sm text-red-800">
                    <p className="font-semibold">⚠ Escalation Recommended</p>
                    <p className="mt-1">This stakeholder is classified as {selectedStakeholder.sentiment} with {getLastContact(selectedStakeholder)} days since last contact. Given their quadrant position, continued disengagement represents a high risk to programme adoption. Recommend TO Head to facilitate re-engagement by 14 March 2025.</p>
                  </div>
                )}
              </motion.div>
            </Tabs.Content>
          </Tabs.Root>
        )}
      </SlideDrawer>

      <Dialog.Root open={Boolean(logOpenFor)} onOpenChange={(v) => !v && setLogOpenFor(null)}>
        <Dialog.Portal>
          <AnimatePresence>
            {logOpenFor && (
              <>
                <Dialog.Overlay asChild>
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/30 backdrop-blur-[2px]" />
                </Dialog.Overlay>
                <Dialog.Content asChild>
                  <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} transition={{ duration: 0.25 }} className="fixed left-1/2 top-1/2 z-[60] w-[94vw] max-w-[720px] -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white shadow-2xl">
                    <div className="border-b border-slate-200 px-5 py-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-xs text-slate-500">Stakeholder Matrix → Log Engagement</p>
                          <Dialog.Title className="text-lg font-bold text-[#003366]">Log Stakeholder Engagement</Dialog.Title>
                        </div>
                        <Dialog.Close className="rounded-lg p-1 text-slate-500 hover:bg-slate-100"><X className="h-4 w-4" /></Dialog.Close>
                      </div>
                    </div>
                    <div className="grid gap-3 px-5 py-4 text-sm md:grid-cols-2">
                      <label className="text-xs">Stakeholder<input value={logOpenFor.name} readOnly className="mt-1 w-full rounded-lg border border-slate-300 px-2 py-1.5" /></label>
                      <label className="text-xs">Date<input defaultValue="2025-03-10" type="date" className="mt-1 w-full rounded-lg border border-slate-300 px-2 py-1.5" /></label>
                      <label className="text-xs">Engagement Type<select className="mt-1 w-full rounded-lg border border-slate-300 px-2 py-1.5"><option>1:1 Meeting</option><option>Working Group</option><option>Steering Committee</option><option>Email Update</option><option>Phone Call</option><option>Workshop</option><option>Board Briefing</option></select></label>
                      <label className="text-xs">Duration<select className="mt-1 w-full rounded-lg border border-slate-300 px-2 py-1.5"><option>15 min</option><option>30 min</option><option>1 hour</option><option>2 hours</option><option>Half day</option></select></label>
                      <label className="text-xs md:col-span-2">Key Discussion Points<textarea rows={3} className="mt-1 w-full rounded-lg border border-slate-300 px-2 py-1.5" defaultValue="Discussed transformation progress, current concerns, and required follow-up actions." /></label>
                      <label className="text-xs">Outcome<select className="mt-1 w-full rounded-lg border border-slate-300 px-2 py-1.5"><option>Positive - Alignment Improved</option><option>Neutral - No Change</option><option>Concerns Raised - Follow-up Needed</option><option>Escalation Required</option></select></label>
                      <label className="text-xs">Follow-up Due Date<input type="date" defaultValue="2025-03-20" className="mt-1 w-full rounded-lg border border-slate-300 px-2 py-1.5" /></label>
                      <label className="text-xs md:col-span-2">Follow-up Action<input className="mt-1 w-full rounded-lg border border-slate-300 px-2 py-1.5" defaultValue="Prepare targeted engagement action and schedule follow-up meeting." /></label>
                    </div>
                    <div className="flex items-center justify-end gap-2 border-t border-slate-200 px-5 py-3">
                      <button type="button" className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm" onClick={() => setLogOpenFor(null)}>Cancel</button>
                      <button type="button" className="rounded-lg bg-[#C8922A] px-3 py-1.5 text-sm font-semibold text-white" onClick={() => submitLog(logOpenFor.id)}>Log Engagement</button>
                    </div>
                  </motion.div>
                </Dialog.Content>
              </>
            )}
          </AnimatePresence>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}

function TomPage({ onOpenInitiative, onToast }: { onOpenInitiative: (id: string) => void; onToast: (message: string) => void }) {
  const [state, setState] = useState<"AS-IS" | "TO-BE">("AS-IS");
  const [selectedCapability, setSelectedCapability] = useState<null | {
    name: string;
    domain: string;
    description: string;
    asIs: { stars: number; label: string; bullets: string[] };
    toBe: { stars: number; label: string; bullets: string[] };
    radar: { dimension: string; asis: number; tobe: number }[];
    gaps: { title: string; severity: "High" | "Medium" | "Low" | "Critical"; text: string }[];
    initiatives: { name: string; status: Status; progress: number; uplift: string; id?: string }[];
    timeline: string[];
    risks: { id: string; title: string; rating: string; mitigation: string }[];
    investment: number;
    roi: number;
  }>(null);
  const [agilePopover, setAgilePopover] = useState<null | { x: number; y: number; row: { name: string; ceremonies: number; backlog: number; iteration: number; tooling: number; next: string; blockers: string } }>(null);

  const initiativeIdByName: Record<string, string> = {
    "Wagering Platform Modernisation": "I002",
    "Odds Engine AI": "I008",
    "Mobile Rebuild": "I007",
    "Data Governance Programme": "I008",
    "RG Analytics": "I005",
    "Policy Revamp": "I005",
    "RegTech Upgrade": "I005",
    "Core Banking System Upgrade": "I001",
    "Cloud Security": "I001",
    "Finance Process Automation": "I006",
    "Procure-to-Pay": "I006",
    "Controls Uplift": "I010",
    "Audit Automation": "I005",
    "Member Experience Redesign": "I007",
    "Racing Data Hub": "I008",
  };

  const capabilities = [
    { col: "Racing & Entertainment", name: "Race Day Operations", asis: 3, tobe: 3, asisBadge: "Optimised", tobeBadge: "Sustain", init: "" },
    { col: "Racing & Entertainment", name: "Customer Experience (Racecourse)", asis: 2, tobe: 3, asisBadge: "Developing", tobeBadge: "Transformation In Progress", init: "Member Experience Redesign" },
    { col: "Racing & Entertainment", name: "International Racing Partnerships", asis: 3, tobe: 3, asisBadge: "Optimised", tobeBadge: "Sustain", init: "" },
    { col: "Racing & Entertainment", name: "Racing Product Innovation", asis: 1, tobe: 3, asisBadge: "Ad-Hoc", tobeBadge: "Uplift Required", init: "Odds Engine AI" },
    { col: "Wagering & Lottery", name: "Digital Wagering Platform", asis: 2, tobe: 3, asisBadge: "Developing", tobeBadge: "Transformation In Progress", init: "Wagering Platform Modernisation" },
    { col: "Wagering & Lottery", name: "Responsible Gambling Framework", asis: 2, tobe: 3, asisBadge: "Developing", tobeBadge: "Transformation In Progress", init: "RG Analytics, Policy Revamp" },
    { col: "Wagering & Lottery", name: "Lottery Operations", asis: 3, tobe: 3, asisBadge: "Optimised", tobeBadge: "Sustain", init: "" },
    { col: "Wagering & Lottery", name: "Odds & Pricing Intelligence", asis: 1, tobe: 3, asisBadge: "Ad-Hoc", tobeBadge: "Uplift Required", init: "Odds Engine AI" },
    { col: "Member Services", name: "Membership Management", asis: 2, tobe: 3, asisBadge: "Developing", tobeBadge: "Transformation In Progress", init: "Member Experience Redesign" },
    { col: "Member Services", name: "Digital Member Engagement", asis: 1, tobe: 3, asisBadge: "Ad-Hoc", tobeBadge: "Uplift Required", init: "Mobile Rebuild" },
    { col: "Member Services", name: "Club Hospitality & F&B", asis: 3, tobe: 3, asisBadge: "Optimised", tobeBadge: "Sustain", init: "" },
    { col: "Member Services", name: "Member Analytics & Personalisation", asis: 1, tobe: 3, asisBadge: "Ad-Hoc", tobeBadge: "Uplift Required", init: "Racing Data Hub" },
    { col: "Finance & Risk", name: "Financial Planning & Reporting", asis: 2, tobe: 3, asisBadge: "Developing", tobeBadge: "Transformation In Progress", init: "Finance Process Automation" },
    { col: "Finance & Risk", name: "Procurement & Vendor Management", asis: 2, tobe: 3, asisBadge: "Developing", tobeBadge: "Transformation In Progress", init: "Procure-to-Pay" },
    { col: "Finance & Risk", name: "Internal Controls & Compliance", asis: 2, tobe: 3, asisBadge: "Developing", tobeBadge: "Uplift Required", init: "Controls Uplift, Audit Automation" },
    { col: "Finance & Risk", name: "Enterprise Risk Management", asis: 2, tobe: 3, asisBadge: "Developing", tobeBadge: "Transformation In Progress", init: "RegTech Upgrade" },
    { col: "Technology & Data", name: "Core Technology Infrastructure", asis: 1, tobe: 3, asisBadge: "Ad-Hoc", tobeBadge: "Transformation In Progress", init: "Core Banking System Upgrade" },
    { col: "Technology & Data", name: "Data & Analytics Platform", asis: 1, tobe: 3, asisBadge: "Ad-Hoc", tobeBadge: "Transformation In Progress", init: "Data Governance Programme" },
    { col: "Technology & Data", name: "Cyber Security", asis: 2, tobe: 3, asisBadge: "Developing", tobeBadge: "Transformation In Progress", init: "Cloud Security" },
    { col: "Technology & Data", name: "Digital Products & Channels", asis: 1, tobe: 3, asisBadge: "Ad-Hoc", tobeBadge: "Uplift Required", init: "Mobile Rebuild" },
  ];

  const detailed: Record<string, NonNullable<typeof selectedCapability>> = {
    "Digital Wagering Platform": {
      name: "Digital Wagering Platform",
      domain: "Wagering & Lottery",
      description:
        "HKJC's digital wagering platform encompasses all online, mobile, and self-service channels through which members and customers place bets on horse racing, football, and the Mark Six lottery. With over 60% of wagering transactions now processed digitally, platform reliability, user experience, and real-time data processing are critical to Club revenue and member satisfaction.",
      asIs: { stars: 2, label: "Developing", bullets: ["Legacy platform architecture limits real-time data and personalisation", "Mobile app rated 3.1/5 vs competitor benchmark 4.2/5", "Cannot support in-play wagering without system overhaul"] },
      toBe: { stars: 3, label: "Target", bullets: ["Cloud-native platform with 99.9% uptime and sub-200ms processing", "Personalised member wagering experience with AI recommendations", "Time-to-market reduced from 18 months to 6 months"] },
      radar: [
        { dimension: "Process Maturity", asis: 3, tobe: 5 },
        { dimension: "Technology Enablement", asis: 2, tobe: 5 },
        { dimension: "People & Skills", asis: 3, tobe: 4 },
        { dimension: "Data & Insights", asis: 2, tobe: 4 },
        { dimension: "Governance & Controls", asis: 3, tobe: 4 },
      ],
      gaps: [
        { title: "Real-time data streaming infrastructure", severity: "High", text: "Event-driven architecture and low-latency feed capability are not yet in place." },
        { title: "Mobile UX design maturity", severity: "High", text: "Current UX patterns lag benchmark apps and impact conversion." },
        { title: "Product management agile capability", severity: "Medium", text: "Backlog governance is inconsistent across product squads." },
        { title: "Wagering analytics tooling", severity: "Medium", text: "Limited experimentation tooling delays product iteration." },
      ],
      initiatives: [
        { name: "Wagering Platform Modernisation", status: "Amber", progress: 37, uplift: "Level 2 → Level 5", id: "I002" },
        { name: "Odds Engine AI", status: "Amber", progress: 5, uplift: "Level 1 → Level 4", id: "I008" },
        { name: "Mobile Rebuild", status: "Amber", progress: 8, uplift: "Level 1 → Level 4", id: "I007" },
      ],
      timeline: ["Q3 FY25: UAT Gate", "Q4 FY25: Go Live", "Q1 FY26: Full feature deployment", "Q2 FY26: Level 5 achieved"],
      risks: [
        { id: "R001", title: "Legacy System Migration", rating: "Critical", mitigation: "Vendor performance recovery plan with weekly steering." },
        { id: "R004", title: "Vendor Delays", rating: "High", mitigation: "Dedicated resource pool with contractual SLA clauses." },
      ],
      investment: 88,
      roi: 145,
    },
    "Data & Analytics Platform": {
      name: "Data & Analytics Platform",
      domain: "Technology & Data",
      description:
        "The Club's data and analytics capability underpins strategic decision-making across racing, wagering, responsible gambling, and finance. Currently fragmented across 14 legacy data silos with no enterprise data catalogue, the transformation to a unified, cloud-based data platform is foundational to all other transformation initiatives.",
      asIs: { stars: 1, label: "Ad-Hoc", bullets: ["14 disconnected data silos with no single source of truth", "No enterprise data catalogue with 40% undocumented critical tables", "Analytics teams spend 60% effort on data prep"] },
      toBe: { stars: 3, label: "Target", bullets: ["Unified cloud data lakehouse with 95%+ data quality", "Collibra catalogue with full lineage for critical datasets", "Self-service analytics without IT dependency"] },
      radar: [
        { dimension: "Process Maturity", asis: 2, tobe: 4 },
        { dimension: "Technology Enablement", asis: 1, tobe: 5 },
        { dimension: "People & Skills", asis: 2, tobe: 4 },
        { dimension: "Data & Insights", asis: 1, tobe: 5 },
        { dimension: "Governance & Controls", asis: 2, tobe: 4 },
      ],
      gaps: [
        { title: "Cloud data infrastructure", severity: "High", text: "Platform migration and integration orchestration remain incomplete." },
        { title: "Data governance framework", severity: "High", text: "Data stewardship and ownership model not fully adopted." },
        { title: "Data literacy", severity: "Medium", text: "Business teams need enablement to consume self-service analytics." },
        { title: "Master data management", severity: "High", text: "Domain models and golden records are inconsistent." },
      ],
      initiatives: [
        { name: "Data Governance Programme", status: "Amber", progress: 40, uplift: "Level 1 → Level 4", id: "I008" },
        { name: "RG Analytics", status: "Amber", progress: 55, uplift: "Level 2 → Level 4", id: "I005" },
        { name: "Odds Engine AI", status: "Amber", progress: 5, uplift: "Level 1 → Level 3", id: "I008" },
      ],
      timeline: ["Q3 FY25: Data Catalogue Live", "Q4 FY25: 3 Domains Migrated", "Q2 FY26: Full Platform Live"],
      risks: [
        { id: "R005", title: "Data Lineage Gaps", rating: "High", mitigation: "Prioritised lineage mapping for five critical domains." },
        { id: "R010", title: "Cyber Security", rating: "High", mitigation: "Enhanced monitoring and WAF deployment in-flight." },
      ],
      investment: 44,
      roi: 78,
    },
    "Responsible Gambling Framework": {
      name: "Responsible Gambling Framework",
      domain: "Wagering & Lottery",
      description:
        "HKJC holds a unique position as a government-authorised wagering operator with explicit social responsibility obligations. The Responsible Gambling Framework encompasses self-exclusion programmes, customer behaviour analytics, staff training, and regulatory reporting.",
      asIs: { stars: 2, label: "Developing", bullets: ["Self-exclusion enrolment remains largely manual", "RG training completion at 34% vs 100% target", "No predictive analytics for at-risk gambling behavior"] },
      toBe: { stars: 3, label: "Target", bullets: ["Digital self-exclusion enrolment within 24 hours", "100% RG training with annual recertification", "Predictive RG analytics identify risk 30 days earlier"] },
      radar: [
        { dimension: "Process Maturity", asis: 3, tobe: 5 },
        { dimension: "Technology Enablement", asis: 2, tobe: 4 },
        { dimension: "People & Skills", asis: 2, tobe: 5 },
        { dimension: "Data & Insights", asis: 2, tobe: 4 },
        { dimension: "Governance & Controls", asis: 3, tobe: 5 },
      ],
      gaps: [
        { title: "Digital self-exclusion channel", severity: "High", text: "Current onboarding SLA exceeds regulatory expectation." },
        { title: "Predictive RG analytics", severity: "High", text: "Detection remains reactive and post-event." },
        { title: "Staff RG training platform", severity: "Critical", text: "Migration failure blocks compliance completion." },
        { title: "RG reporting automation", severity: "Medium", text: "Manual reporting still needed for HKSAR submissions." },
      ],
      initiatives: [
        { name: "RG Analytics", status: "Amber", progress: 55, uplift: "Level 2 → Level 4", id: "I005" },
        { name: "Policy Revamp", status: "Green", progress: 38, uplift: "Level 2 → Level 3", id: "I005" },
        { name: "RegTech Upgrade", status: "Red", progress: 8, uplift: "Level 1 → Level 4", id: "I005" },
      ],
      timeline: ["Q3 FY25: Training Platform Fixed", "Q4 FY25: Digital Enrolment Live", "Q2 FY26: Predictive Analytics Operational"],
      risks: [
        { id: "R004", title: "Regulatory Rule Changes", rating: "High", mitigation: "Scenario modelling with legal and strategy teams." },
        { id: "I-002", title: "RG Training Platform", rating: "Critical", mitigation: "Emergency blended learning workaround in progress." },
      ],
      investment: 29,
      roi: 52,
    },
    "Core Technology Infrastructure": {
      name: "Core Technology Infrastructure",
      domain: "Technology & Data",
      description:
        "HKJC's technology infrastructure spans 25+ years of accumulated systems, including the 1999-era core betting engine, on-premise data centres, and a complex web of proprietary integrations. This transformation is the most critical and complex initiative in the programme.",
      asIs: { stars: 1, label: "Ad-Hoc", bullets: ["Core betting system built in 1999 with limited API capability", "67% infrastructure on-premise with HK$45M annual maintenance", "127 legacy integrations with undocumented dependencies"] },
      toBe: { stars: 3, label: "Target", bullets: ["Cloud-first architecture with Infrastructure-as-Code", "Annual infrastructure cost reduced to HK$28M", "API-first systems for faster product delivery"] },
      radar: [
        { dimension: "Process Maturity", asis: 2, tobe: 4 },
        { dimension: "Technology Enablement", asis: 1, tobe: 5 },
        { dimension: "People & Skills", asis: 2, tobe: 4 },
        { dimension: "Data & Insights", asis: 2, tobe: 4 },
        { dimension: "Governance & Controls", asis: 2, tobe: 4 },
      ],
      gaps: [
        { title: "Cloud architecture expertise", severity: "High", text: "Capability uplift needed across infrastructure teams." },
        { title: "Legacy system documentation", severity: "Critical", text: "Dependency mapping incomplete and high-risk." },
        { title: "Infrastructure-as-Code", severity: "High", text: "Automation tooling standards still maturing." },
        { title: "Cloud disaster recovery", severity: "Medium", text: "DR runbooks and rehearsal cadence required." },
      ],
      initiatives: [
        { name: "Core Banking System Upgrade", status: "Amber", progress: 32, uplift: "Level 1 → Level 4", id: "I001" },
        { name: "Cloud Security", status: "Red", progress: 20, uplift: "Level 2 → Level 4", id: "I001" },
        { name: "Data Governance", status: "Amber", progress: 40, uplift: "Level 1 → Level 3", id: "I008" },
      ],
      timeline: ["Q2 FY25: First System Migrated", "Q4 FY25: 5 Systems Migrated", "Q4 FY26: Full Cloud Migration Complete"],
      risks: [
        { id: "R001", title: "Legacy System Migration", rating: "Critical", mitigation: "Escalated governance and contingency planning." },
        { id: "R010", title: "Cyber Risk", rating: "High", mitigation: "Security remediation package before migration waves." },
      ],
      investment: 72,
      roi: 95,
    },
  };

  const agile = [
    { name: "Transformation Office", owner: "TO Head", level: 4, target: 5, arrow: "→ Level 5 by Q4 FY25", ceremonies: 88, backlog: 82, iteration: 79, tooling: 90, next: "Scale Agile Coaching Office by 30 Apr", blockers: "Resource constraints for embedded coaches" },
    { name: "IT Division", owner: "CTO", level: 3, target: 4, arrow: "→ Level 4 by Q2 FY26", ceremonies: 70, backlog: 66, iteration: 62, tooling: 74, next: "Certify 4 more teams by 15 Apr", blockers: "Cloud migration distractions" },
    { name: "Finance", owner: "CFO", level: 2, target: 3, arrow: "→ Level 3 by Q4 FY25", ceremonies: 54, backlog: 45, iteration: 40, tooling: 51, next: "Run P2P pilot sprint in April", blockers: "Competing audit cycle" },
    { name: "HR & People", owner: "CHRO", level: 3, target: 4, arrow: "→ Level 4 by Q1 FY26", ceremonies: 72, backlog: 67, iteration: 61, tooling: 69, next: "Onboard HR Ops squad to Jira", blockers: "Capability variability across teams" },
    { name: "Racing Division", owner: "Head of Racing", level: 2, target: 3, arrow: "→ Level 3 by Q3 FY25", ceremonies: 45, backlog: 30, iteration: 25, tooling: 40, next: "Agile@Scale pilot kick-off with 2 Racing teams - 1 Apr 2025", blockers: "Senior Racing leadership sceptical of agile applicability to race-day operations" },
    { name: "Member Services", owner: "Head of Member Services", level: 2, target: 3, arrow: "→ Level 3 by Q4 FY25", ceremonies: 49, backlog: 38, iteration: 32, tooling: 44, next: "Launch member app scrum cadence by 10 Apr", blockers: "Scope churn disrupting planning" },
    { name: "Legal & Compliance", owner: "Head of Legal", level: 1, target: 3, arrow: "→ Level 3 by Q2 FY26", ceremonies: 28, backlog: 22, iteration: 18, tooling: 30, next: "Establish fortnightly planning forum by 15 May", blockers: "Regulatory workload and low agile familiarity" },
    { name: "Internal Audit", owner: "Chief Audit", level: 2, target: 3, arrow: "→ Level 3 by Q1 FY26", ceremonies: 43, backlog: 37, iteration: 34, tooling: 40, next: "Pilot risk-based agile audit sprint", blockers: "Current methodology not yet adapted" },
  ];

  const columns = ["Racing & Entertainment", "Wagering & Lottery", "Member Services", "Finance & Risk", "Technology & Data"];

  const openCapability = (name: string, domain: string) => {
    if (detailed[name]) {
      setSelectedCapability(detailed[name]);
      return;
    }
    const cap = capabilities.find((c) => c.name === name)!;
    setSelectedCapability({
      name,
      domain,
      description: `${name} supports HKJC ${domain.toLowerCase()} outcomes and requires structured uplift to meet FY2026 target operating model performance standards.`,
      asIs: { stars: cap.asis, label: cap.asisBadge, bullets: ["Process consistency varies by team", "Manual controls remain in key workflows", "Reporting visibility is partially automated"] },
      toBe: { stars: cap.tobe, label: "Target", bullets: ["Standardised process governance", "Digitally enabled workflow and controls", "Quarterly performance and capability review embedded"] },
      radar: [
        { dimension: "Process Maturity", asis: cap.asis + 1, tobe: 5 },
        { dimension: "Technology Enablement", asis: cap.asis, tobe: 4 },
        { dimension: "People & Skills", asis: cap.asis + 1, tobe: 4 },
        { dimension: "Data & Insights", asis: cap.asis, tobe: 4 },
        { dimension: "Governance & Controls", asis: cap.asis + 1, tobe: 4 },
      ],
      gaps: [{ title: "Capability standardisation", severity: "Medium", text: "Cross-functional playbooks and metrics are not yet unified." }],
      initiatives: cap.init ? cap.init.split(",").map((n) => ({ name: n.trim(), status: "Amber" as Status, progress: 35, uplift: `Level ${cap.asis} → Level ${cap.tobe}`, id: initiativeIdByName[n.trim()] })) : [],
      timeline: ["Q4 FY25: Design baseline complete", "Q2 FY26: Control uplift complete", "Q4 FY26: Target maturity validated"],
      risks: [{ id: "R002", title: "Change adoption variance", rating: "Medium", mitigation: "Focused coaching and governance cadence." }],
      investment: 18,
      roi: 24,
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold text-[#003366]">Target Operating Model Designer</h2>
        <p className="text-sm text-slate-600">AS-IS → TO-BE Operating Model · Transformation Office</p>
      </div>

      <div className="flex flex-wrap gap-2 text-xs">
        <span className="rounded-full bg-white px-3 py-1">Capabilities Assessed: 22</span>
        <span className="rounded-full bg-amber-50 px-3 py-1 text-amber-700">Uplift Required: 14</span>
        <span className="rounded-full bg-[#FDF8EC] px-3 py-1 text-[#C8922A]">Transformation In Progress: 8</span>
        <span className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-700">Target State Achieved: 3</span>
      </div>

      <div className="inline-flex rounded-full border border-slate-200 bg-white p-1 shadow-sm">
        {(["AS-IS", "TO-BE"] as const).map((s) => (
          <button key={s} type="button" aria-label={`Switch to ${s}`} onClick={() => setState(s)} className={cn("rounded-full px-5 py-2 text-sm font-semibold", state === s ? "bg-[#C8922A] text-white shadow" : "bg-slate-100 text-slate-700")}>
            {s} {s === "AS-IS" ? " Current State" : " Target State"}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={state} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }} className="space-y-4">
          <div className={cn("rounded-xl border px-3 py-2 text-sm", state === "AS-IS" ? "border-amber-200 bg-amber-50 text-amber-900" : "border-[#c4d7ef] bg-[#E8EFF8] text-[#003366]")}>{state === "AS-IS" ? "Viewing current state operating model - as of Q3 FY2024-25. Maturity ratings reflect independent capability assessment conducted November 2024." : "Viewing target state operating model - designed for FY2026-27. Gold badges indicate active transformation initiatives. Click any capability block to explore the transformation roadmap."}</div>

          <section className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="rounded-xl border-l-4 border-l-[#C8922A] bg-[#003366] px-4 py-3 text-white">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-semibold">HKJC Strategic Direction: Sustainable Growth Through World-Class Racing, Responsible Wagering & Community Contribution</p>
                <div className="flex flex-wrap gap-2 text-xs text-[#003366]"><span className="rounded-full bg-[#C8922A] px-2 py-1">Racing Excellence</span><span className="rounded-full bg-[#C8922A] px-2 py-1">Digital Leadership</span><span className="rounded-full bg-[#C8922A] px-2 py-1">Responsible Gaming</span></div>
              </div>
            </div>

            <div className="grid gap-3 xl:grid-cols-5">
              {columns.map((col) => (
                <div key={col} className="space-y-1 rounded-xl border border-slate-200 bg-slate-50 p-2">
                  <h4 className="text-center text-sm font-bold text-[#003366]">{col}</h4>
                  {capabilities.filter((c) => c.col === col).map((c) => (
                    <button key={c.name} type="button" aria-label={`Open ${c.name} capability`} className={cn("w-full rounded-lg border border-slate-200 bg-white p-2 text-left", interactiveClass)} onClick={() => openCapability(c.name, col)}>
                      <p className="text-sm font-semibold text-slate-800">{c.name}</p>
                      <p className="mt-1 text-xs text-slate-600">AS-IS: {"★".repeat(c.asis)}{"☆".repeat(3 - c.asis)}</p>
                      <p className="text-xs text-slate-600">TO-BE: ★★★ <span className="text-[#C8922A]">Target</span></p>
                      <span className={cn("mt-1 inline-flex rounded-full px-2 py-0.5 text-[10px]", state === "AS-IS" ? (c.asis <= 1 ? "bg-red-50 text-red-700" : c.asis === 2 ? "bg-amber-50 text-amber-700" : "bg-emerald-50 text-emerald-700") : c.tobeBadge.includes("Sustain") ? "bg-emerald-50 text-emerald-700" : c.tobeBadge.includes("Progress") ? "bg-[#FDF8EC] text-[#C8922A]" : "bg-amber-50 text-amber-700")}>{state === "AS-IS" ? c.asisBadge : c.tobeBadge}</span>
                    </button>
                  ))}
                </div>
              ))}
            </div>

            <div className="rounded-xl bg-[#FDF8EC] p-3">
              <h4 className="mb-2 text-sm font-bold text-[#003366]">Enabling Functions</h4>
              <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-5 text-xs">
                {[
                  ["People & HR", "Level 2", "Level 4", "3 active"],
                  ["Legal & Compliance", "Level 3", "Level 4", "2 active"],
                  ["IT Infrastructure", "Level 1", "Level 4", "4 active"],
                  ["Communications & Change", "Level 2", "Level 3", "1 active"],
                  ["Transformation Office", "Level 3", "Level 5", "All 12"],
                ].map((f) => (
                  <div key={String(f[0])} className={cn("rounded-lg border bg-white p-2", f[0] === "Transformation Office" ? "border-[#C8922A]" : "border-slate-200")}>
                    <p className="font-semibold text-[#003366]">{f[0]}</p>
                    <p>AS-IS: {f[1]}</p>
                    <p>TO-BE: {f[2]}</p>
                    <p className="text-slate-500">Initiatives: {f[3]}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl bg-[#003366] px-4 py-3 text-xs text-white">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p>Governance Model: Executive Steering Committee → Programme Board → Working Groups → Agile Teams</p>
                <div className="flex flex-wrap gap-2"><span className="rounded-full bg-white/10 px-2 py-1">OKR-driven</span><span className="rounded-full bg-white/10 px-2 py-1">Agile@Scale</span><span className="rounded-full bg-white/10 px-2 py-1">Continuous Improvement</span></div>
              </div>
            </div>
          </section>
        </motion.div>
      </AnimatePresence>

      <div className="grid gap-4 xl:grid-cols-12">
        <Panel title="Agile Ways of Working - Organisational Maturity Assessment" subtitle="Club-wide agile maturity rated across 5 levels: Ad-Hoc → Aware → Developing → Advanced → Optimised" className="xl:col-span-8">
          <div className="mb-3 grid grid-cols-5 overflow-hidden rounded-lg text-[11px] text-center text-white">
            {[
              ["Level 1: Ad-Hoc", "#d0021b"],
              ["Level 2: Aware", "#f5a623"],
              ["Level 3: Developing", "#facc15"],
              ["Level 4: Advanced", "#84cc16"],
              ["Level 5: Optimised", "#2d8653"],
            ].map((lv) => <div key={String(lv[0])} className="px-1 py-2" style={{ backgroundColor: String(lv[1]) }}>{lv[0]}</div>)}
          </div>
          <div className="space-y-3">
            {agile.map((row, idx) => (
              <button
                key={row.name}
                type="button"
                aria-label={`Open agile maturity for ${row.name}`}
                className={cn("w-full rounded-xl border border-slate-200 p-3 text-left", interactiveClass)}
                onClick={(e) => {
                  const rect = (e.currentTarget as HTMLButtonElement).getBoundingClientRect();
                  setAgilePopover({ x: rect.left + 220, y: rect.top + window.scrollY + 20, row });
                }}
              >
                <div className="mb-1 flex items-center justify-between text-xs"><p className="font-semibold text-[#003366]">{row.name} <span className="ml-2 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] text-slate-600">{row.owner}</span></p><span className="rounded-full bg-[#FDF8EC] px-2 py-0.5 text-[#C8922A]">Target: Level {row.target}</span></div>
                <div className="grid grid-cols-5 gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <motion.div key={i} initial={{ scaleX: 0 }} animate={{ scaleX: i < row.level ? 1 : 0.2 }} transition={{ delay: idx * 0.1 }} className="h-2 origin-left rounded" style={{ backgroundColor: i === 0 ? "#d0021b" : i === 1 ? "#f5a623" : i === 2 ? "#facc15" : i === 3 ? "#84cc16" : "#2d8653" }} />
                  ))}
                </div>
                <p className="mt-1 text-xs text-slate-500">Level {row.level} {row.level === 1 ? "Ad-Hoc" : row.level === 2 ? "Aware" : row.level === 3 ? "Developing" : row.level === 4 ? "Advanced" : "Optimised"} · {row.arrow}</p>
              </button>
            ))}
          </div>
        </Panel>

        <Panel title="Operating Model Maturity Summary" subtitle="22 capabilities assessed · November 2024" className="xl:col-span-4">
          <div className="h-48">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={[{ name: "Optimised", value: 3, fill: colors.success }, { name: "Advanced", value: 4, fill: "#84cc16" }, { name: "Developing", value: 8, fill: colors.warning }, { name: "Aware", value: 5, fill: "#fb923c" }, { name: "Ad-Hoc", value: 2, fill: colors.danger }]} dataKey="value" innerRadius={42} outerRadius={70}>
                  {[colors.success, "#84cc16", colors.warning, "#fb923c", colors.danger].map((fill) => <Cell key={fill} fill={fill} />)}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <p className="mb-2 text-xs font-semibold text-[#003366]">By FY2026 Target</p>
          <div className="h-36">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={[{ name: "Optimised", value: 8, fill: colors.success }, { name: "Advanced", value: 10, fill: "#84cc16" }, { name: "Developing", value: 4, fill: colors.warning }]} dataKey="value" innerRadius={30} outerRadius={55}>
                  {[colors.success, "#84cc16", colors.warning].map((fill) => <Cell key={fill} fill={fill} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-slate-600">The transformation programme will uplift 17 of 22 capabilities by at least one maturity level, with 8 reaching Optimised state by end FY2026.</p>
        </Panel>
      </div>

      <AnimatePresence>
        {agilePopover && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setAgilePopover(null)} />
            <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }} className="absolute z-50 w-[300px] rounded-xl border border-[#003366]/20 bg-white p-3 shadow-xl" style={{ left: agilePopover.x, top: agilePopover.y }}>
              <p className="text-sm font-bold text-[#003366]">{agilePopover.row.name}</p>
              <div className="mt-2 space-y-1 text-xs text-slate-700">
                <p>Ceremonies adoption: {agilePopover.row.ceremonies}%</p>
                <p>Backlog management: {agilePopover.row.backlog}%</p>
                <p>Iteration delivery: {agilePopover.row.iteration}%</p>
                <p>Agile tooling: {agilePopover.row.tooling}%</p>
                <p className="rounded bg-emerald-50 px-2 py-1 text-emerald-800">Next milestone: {agilePopover.row.next}</p>
                <p className="rounded bg-amber-50 px-2 py-1 text-amber-800">Blockers: {agilePopover.row.blockers}</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <SlideDrawer
        open={Boolean(selectedCapability)}
        onClose={() => setSelectedCapability(null)}
        title={`${selectedCapability?.name ?? "Capability"} - Capability Detail`}
        width={540}
        breadcrumb="Target Operating Model → Capability"
        onExport={() => onToast("Report exported to PDF")}
      >
        {selectedCapability && (
          <Tabs.Root defaultValue="assessment" className="space-y-3">
            <Tabs.List className="flex rounded-lg bg-slate-100 p-1 text-sm">
              <Tabs.Trigger value="assessment" className="rounded-md px-3 py-1 data-[state=active]:bg-white data-[state=active]:text-[#003366]">Assessment</Tabs.Trigger>
              <Tabs.Trigger value="plan" className="rounded-md px-3 py-1 data-[state=active]:bg-white data-[state=active]:text-[#003366]">Transformation Plan</Tabs.Trigger>
            </Tabs.List>
            <Tabs.Content value="assessment" className="space-y-3">
              <Panel title="Capability Overview">
                <h4 className="text-lg font-bold text-[#003366]">{selectedCapability.name}</h4>
                <span className="mt-1 inline-flex rounded-full bg-[#E8EFF8] px-2 py-0.5 text-xs text-[#003366]">{selectedCapability.domain}</span>
                <p className="mt-2 text-sm text-slate-700">{selectedCapability.description}</p>
              </Panel>
              <div className="grid gap-3 md:grid-cols-2">
                <div className="rounded-xl bg-slate-100 p-3 text-sm"><p className="font-semibold text-[#003366]">AS-IS</p><p>{"★".repeat(selectedCapability.asIs.stars)}{"☆".repeat(3 - selectedCapability.asIs.stars)} · {selectedCapability.asIs.label}</p><ul className="mt-2 list-disc space-y-1 pl-5 text-xs text-slate-700">{selectedCapability.asIs.bullets.map((b) => <li key={b}>{b}</li>)}</ul></div>
                <div className="rounded-xl bg-[#E8EFF8] p-3 text-sm"><p className="font-semibold text-[#003366]">TO-BE</p><p className="text-[#C8922A]">★★★ · {selectedCapability.toBe.label}</p><ul className="mt-2 list-disc space-y-1 pl-5 text-xs text-slate-700">{selectedCapability.toBe.bullets.map((b) => <li key={b}>{b}</li>)}</ul></div>
              </div>
              <Panel title="Capability Maturity Radar">
                <div className="h-72"><ResponsiveContainer><RadarChart data={selectedCapability.radar}><PolarGrid /><PolarAngleAxis dataKey="dimension" tick={{ fontSize: 10 }} /><Radar name="AS-IS" dataKey="asis" stroke={colors.navy} strokeDasharray="5 4" fill={colors.navy} fillOpacity={0.1} /><Radar name="TO-BE" dataKey="tobe" stroke={colors.gold} fill={colors.gold} fillOpacity={0.2} /><Legend /></RadarChart></ResponsiveContainer></div>
              </Panel>
              <Panel title="Key Maturity Gaps">
                <div className="space-y-2">{selectedCapability.gaps.map((gap) => <div key={gap.title} className="rounded-xl border border-slate-200 p-2"><p className="text-sm font-semibold text-[#003366]">{gap.title} <span className="ml-2 rounded-full bg-slate-100 px-2 py-0.5 text-[10px]">{gap.severity}</span></p><p className="text-xs text-slate-600">{gap.text}</p></div>)}</div>
              </Panel>
            </Tabs.Content>
            <Tabs.Content value="plan" className="space-y-3">
              <Panel title="Linked Initiatives">
                <div className="space-y-2">
                  {selectedCapability.initiatives.map((initiative) => (
                    <button key={initiative.name} type="button" aria-label={`Open initiative ${initiative.name}`} className={cn("w-full rounded-xl border border-slate-200 p-2 text-left", interactiveClass)} onClick={() => initiative.id && onOpenInitiative(initiative.id)}>
                      <div className="flex items-center justify-between"><p className="font-semibold text-slate-800">{initiative.name}</p><RagPill status={initiative.status} /></div>
                      <div className="mt-1 h-1.5 rounded-full bg-slate-200"><div className="h-1.5 rounded-full bg-[#003366]" style={{ width: `${initiative.progress}%` }} /></div>
                      <p className="mt-1 text-xs text-slate-500">{initiative.progress}% complete · {initiative.uplift}</p>
                    </button>
                  ))}
                </div>
              </Panel>
              <Panel title="Transformation Roadmap (Mini Timeline)"><div className="flex items-center gap-2 overflow-x-auto text-xs">{selectedCapability.timeline.map((t, idx) => <div key={t} className="flex items-center gap-2"><span className="whitespace-nowrap rounded-full bg-[#FDF8EC] px-2 py-1 text-[#003366]">{t}</span>{idx < selectedCapability.timeline.length - 1 && <span className="h-0.5 w-5 bg-[#C8922A]" />}</div>)}</div></Panel>
              <Panel title="Key Risks to Transformation"><div className="space-y-2">{selectedCapability.risks.map((risk) => <div key={risk.id} className="rounded-xl border border-slate-200 p-2 text-xs"><p className="font-semibold text-[#003366]">{risk.id} - {risk.title} <span className="ml-2 rounded-full bg-red-50 px-2 py-0.5 text-red-700">{risk.rating}</span></p><p className="text-slate-600">{risk.mitigation}</p></div>)}</div></Panel>
              <Panel title="Investment Summary"><div className="space-y-1 text-sm"><p>Transformation Investment: <span className="font-semibold text-[#003366]">HK${selectedCapability.investment}M</span></p><p>Expected Capability ROI: <span className="font-semibold text-[#2D8653]">HK${selectedCapability.roi}M over 3 years</span></p></div></Panel>
            </Tabs.Content>
          </Tabs.Root>
        )}
      </SlideDrawer>
    </div>
  );
}

function GovernancePage({ onToast }: { onToast: (message: string) => void }) {
  const [datePopover, setDatePopover] = useState<null | { x: number; y: number; day: number; meetings: Array<{ name: string; type: string; time: string; location: string; chair: string; attendees: string[]; agenda: string[] }> }>(null);
  const [agendaMeeting, setAgendaMeeting] = useState<null | { name: string; date: string; time: string; location: string; chair: string; attendees: string[]; agenda: Array<{ title: string; presenter: string; duration: string }> }>(null);
  const [minutesOpen, setMinutesOpen] = useState(false);
  const [selectedDecision, setSelectedDecision] = useState<null | { id: string; title: string; status: string; maker: string; date: string; rationale: string; impact: string[] }>(null);
  const [visibleDecisions, setVisibleDecisions] = useState(7);
  const [docSearch, setDocSearch] = useState("");
  const [openFolders, setOpenFolders] = useState<Record<string, boolean>>({ strategic: true, reports: true });
  const [filePreview, setFilePreview] = useState<null | { name: string; type: string; size: string; date: string; version: string; uploader: string; modified: string; tags: string[] }>(null);
  const [changePopover, setChangePopover] = useState<null | { x: number; y: number; entry: { version: string; date: string; category: string; title: string; author: string; impact: string; detail: string; decision?: string } }>(null);

  const meetingColor: Record<string, string> = {
    "Executive Steering Committee": "#7c3aed",
    "Programme Board": colors.navy,
    "Cross-functional Working Group": colors.gold,
    "Stakeholder Briefing": colors.success,
    "Post-Project Review": "#0d9488",
  };

  const meetingsByDay: Record<number, Array<{ name: string; type: string; time: string; location: string; chair: string; attendees: string[]; agenda: string[]; future?: boolean }>> = {
    3: [{ name: "Executive Steering Committee", type: "Executive Steering Committee", time: "09:00 - 10:30 HKT", location: "Boardroom 3, Sha Tin", chair: "CEO", attendees: ["CEO", "CFO", "CTO", "TO", "HR"], agenda: ["Q3 programme health", "Risk escalation summary", "Decision review"] }],
    5: [{ name: "Programme Board", type: "Programme Board", time: "10:00 - 11:30 HKT", location: "Video Conference", chair: "TO Head", attendees: ["TO", "IT", "HR", "FIN"], agenda: ["Milestone variance", "Budget watchlist", "Issue escalations"], future: false }],
    7: [{ name: "Cross-Functional Working Group", type: "Cross-functional Working Group", time: "14:00 - 15:30 HKT", location: "Boardroom 2", chair: "TO Senior Manager", attendees: ["PMO", "IT", "Comms", "Legal"], agenda: ["Dependency review", "Cross-team blockers", "Action log"] }],
    10: [{ name: "Cross-Functional Working Group", type: "Cross-functional Working Group", time: "14:00 - 15:30 HKT", location: "Boardroom 2", chair: "TO Senior Manager", attendees: ["PMO", "IT", "Comms", "Legal", "Finance"], agenda: ["Q4 readiness", "Mitigation updates", "Decision prep"], future: true }],
    12: [{ name: "Programme Board", type: "Programme Board", time: "10:00 - 11:30 HKT", location: "Video Conference", chair: "TO Head", attendees: ["TO", "IT", "HR", "Finance"], agenda: ["Risk register review", "Benefits forecast", "Decision dependencies"], future: true }],
    13: [{ name: "Post-Project Review - OKR Framework", type: "Post-Project Review", time: "15:00 - 16:00 HKT", location: "Video Conference", chair: "TO Senior Manager", attendees: ["TO", "HR", "L&D", "Finance", "Comms"], agenda: ["Benefits capture", "Lessons learned", "Scale-up actions"], future: true }],
    17: [{ name: "Cross-Functional Working Group", type: "Cross-functional Working Group", time: "14:00 - 15:30 HKT", location: "Boardroom 2", chair: "TO Senior Manager", attendees: ["PMO", "IT", "Comms", "Legal"], agenda: ["Workstream updates", "Risk mitigations", "Next actions"], future: true }],
    18: [{ name: "Executive Steering Committee", type: "Executive Steering Committee", time: "09:00 - 10:40 HKT", location: "Boardroom 3, Sha Tin", chair: "CEO", attendees: ["CEO", "CFO", "CTO", "CHRO", "TO Head", "Compliance", "Racing"], agenda: ["Opening & Apologies", "Q3 Programme Status Review", "Core Banking - Emergency Risk Escalation", "RG Training - Regulatory Risk Update", "Budget Forecast Review - HK$18M Overrun Risk", "Q4 Priorities & Resource Allocation", "Decisions Required", "AOB & Next Steps"], future: true }],
    19: [{ name: "Programme Board", type: "Programme Board", time: "10:00 - 11:30 HKT", location: "Video Conference", chair: "TO Head", attendees: ["TO", "IT", "HR", "Finance"], agenda: ["Milestone gating", "Issue ageing", "Capacity review"], future: true }],
    24: [{ name: "Cross-Functional Working Group", type: "Cross-functional Working Group", time: "14:00 - 15:30 HKT", location: "Boardroom 2", chair: "TO Senior Manager", attendees: ["PMO", "IT", "Comms", "Legal"], agenda: ["Q4 planning", "Risk burn-down", "Actions"] }],
    25: [{ name: "Executive Steering Committee", type: "Executive Steering Committee", time: "09:00 - 10:30 HKT", location: "Boardroom 3, Sha Tin", chair: "CEO", attendees: ["CEO", "CFO", "CTO", "TO"], agenda: ["Decision pack", "Portfolio outlook", "Resource approvals"] }],
    26: [{ name: "Programme Board", type: "Programme Board", time: "10:00 - 11:30 HKT", location: "Video Conference", chair: "TO Head", attendees: ["TO", "IT", "HR", "Finance"], agenda: ["Execution health", "Budget actions", "Issue closure"] }],
    28: [{ name: "Stakeholder Briefing - Head of Racing", type: "Stakeholder Briefing", time: "11:00 - 11:45 HKT", location: "Sha Tin Racecourse", chair: "TO Head", attendees: ["TO", "Racing", "Product", "Comms"], agenda: ["Programme narrative", "Racing dependencies", "Upcoming milestones"] }],
  };

  const decisions = [
    { id: "D-011", status: "Approved", title: "Approve Core Banking cloud vendor selection - Microsoft Azure + Accenture delivery partner", maker: "CEO", date: "15 Jan 2025", rationale: "Azure selected over AWS on total cost of ownership, local HKSAR data sovereignty compliance, and vendor reference checks", impact: ["Budget (HK$58M)", "Timeline", "Scope"] },
    { id: "D-012", status: "Deferred", title: "Defer Member Mobile App full launch from Q3 to Q4 FY25", maker: "EXCO", date: "3 Feb 2025", rationale: "UX research findings required full redesign of navigation - additional 8 weeks needed", impact: ["Timeline", "Scope", "Revenue (HK$8M delay)"] },
    { id: "D-013", status: "Pending", title: "Approve HK$11M additional budget for Cloud Security remediation", maker: "CFO", date: "18 Mar 2025 (Expected)", rationale: "P1 security audit finding requires unplanned remediation and WAF deployment", impact: ["Budget", "Timeline"] },
    { id: "D-014", status: "Approved", title: "Adopt Agile@Scale (SAFe framework) as Club-wide delivery methodology", maker: "MD", date: "20 Jan 2025", rationale: "SAFe selected after benchmarking 3 frameworks", impact: ["Scope", "Resource", "Timeline"] },
    { id: "D-015", status: "Under Review", title: "Commission independent Target Operating Model refresh assessment", maker: "TO Head", date: "25 Mar 2025 (Expected)", rationale: "Mid-programme TOM refresh required to validate assumptions", impact: ["Scope", "Resource"] },
    { id: "D-016", status: "Approved", title: "Extend OKR Framework Implementation scope to include all enabling functions", maker: "CHRO", date: "12 Feb 2025", rationale: "Business adoption successful and enabling functions requested inclusion", impact: ["Scope", "Timeline"] },
    { id: "D-017", status: "Approved", title: "Approve change freeze on Member Experience from 1 Mar - 30 Apr", maker: "Programme Board", date: "28 Feb 2025", rationale: "8 uncontrolled change requests causing scope creep", impact: ["Scope"] },
    { id: "D-018", status: "Pending", title: "Approve rephasing of Workforce Planning to Q1 FY26", maker: "TO Head", date: "22 Mar 2025", rationale: "Capacity redirected to Core Banking recovery", impact: ["Timeline", "Resource"] },
    { id: "D-019", status: "Under Review", title: "Approve interim manual digital self-exclusion process", maker: "Compliance Head", date: "21 Mar 2025", rationale: "Digital channel delay risks missing RG enrolment target", impact: ["Risk", "Scope"] },
    { id: "D-020", status: "Approved", title: "Increase Programme Board frequency to bi-weekly", maker: "TO Head", date: "15 Feb 2025", rationale: "Need tighter governance during peak delivery period", impact: ["Governance", "Timeline"] },
    { id: "D-021", status: "Approved", title: "Rebaseline Core Banking go-live to June 2025", maker: "CEO", date: "20 Feb 2025", rationale: "Vendor milestone 3 missed and UAT blocked", impact: ["Timeline", "Risk"] },
    { id: "D-022", status: "Deferred", title: "Approve full RegTech budget package", maker: "Finance Committee", date: "Pending", rationale: "Awaiting full compliance cost-benefit pack", impact: ["Budget", "Risk"] },
  ];

  const files = {
    strategic: [
      { name: "Club Transformation Strategy FY25-26", type: "PDF", version: "v1.2", date: "15 Jan 2025", size: "4.2 MB", tags: ["Strategy", "FY2025", "Approved"] },
      { name: "Target Operating Model Design", type: "PPTX", version: "v2.1", date: "3 Feb 2025", size: "8.7 MB", tags: ["TOM", "Design", "Approved"] },
      { name: "Transformation Programme Charter", type: "PDF", version: "v1.0", date: "10 Nov 2024", size: "1.8 MB", tags: ["Governance", "Charter"] },
      { name: "Benefits Realisation Framework & Tracker", type: "XLSX", version: "v1.4", date: "20 Jan 2025", size: "2.1 MB", tags: ["Benefits", "Finance"] },
    ],
    reports: [
      { name: "Q3 FY25 Programme Status Report", type: "PDF", version: "v1.0", date: "1 Mar 2025", size: "3.1 MB", tags: ["Status", "Q3", "NEW"] },
      { name: "Executive Dashboard - March 2025", type: "PPTX", version: "v2.0", date: "3 Mar 2025", size: "12.4 MB", tags: ["Dashboard", "NEW"] },
      { name: "Risk Register", type: "XLSX", version: "v4.2", date: "28 Feb 2025", size: "1.6 MB", tags: ["Risk"] },
      { name: "Q2 FY25 Programme Status Report", type: "PDF", version: "v1.0", date: "1 Dec 2024", size: "2.9 MB", tags: ["Status", "Q2"] },
      { name: "Executive Dashboard - December 2024", type: "PPTX", version: "v1.5", date: "3 Dec 2024", size: "11.8 MB", tags: ["Dashboard"] },
      { name: "Risk Register", type: "XLSX", version: "v3.8", date: "30 Nov 2024", size: "1.5 MB", tags: ["Risk"] },
    ],
    templates: ["SteerCo Template", "Programme Board Minutes Template", "Decision Record Template", "Risk Register Template", "RAID Log Template"],
    businessCases: ["Core Banking BC", "Wagering Platform BC", "Member Experience BC", "RG Analytics BC"],
    minutes: ["Mar 2025 Programme Board Minutes", "Feb 2025 SteerCo Minutes", "Jan 2025 Working Group Minutes"],
    workshops: ["TOM Assessment Nov 2024", "Change Readiness Survey Feb 2025", "Agile Maturity Assessment"],
    regulatory: ["HKSAR Compliance Audit Report", "RG Framework Policy", "Betting Duty Ordinance Summary", "Data Privacy Impact Assessment"],
  };

  const changes = [
    { version: "v4.2", date: "28 Feb", category: "Risk", title: "R005 Vendor Delivery - escalated from High to Critical", author: "PMO", impact: "Added to SteerCo agenda 18 Mar", detail: "Risk reassessment after vendor missed migration milestones for Core Banking.", decision: "D-013" },
    { version: "v2.8", date: "28 Feb", category: "Timeline", title: "Member Experience Redesign - change freeze imposed until 30 Apr", author: "Programme Board", impact: "Scope locked - 8 CRs deferred", detail: "Change freeze approved to stabilise release quality.", decision: "D-017" },
    { version: "v3.1", date: "25 Feb", category: "Scope", title: "OKR Framework scope extended to include 5 enabling functions", author: "CHRO", impact: "6-week timeline extension approved", detail: "Rollout expanded after positive adoption in business divisions.", decision: "D-016" },
    { version: "v2.7", date: "20 Feb", category: "Budget", title: "Cloud Security - HK$11M overrun forecast identified", author: "CISO", impact: "Pending CFO approval - see D-013", detail: "P1 finding remediation package created and submitted to finance.", decision: "D-013" },
    { version: "v1.4", date: "15 Feb", category: "Governance", title: "Programme Board meeting frequency increased from monthly to bi-weekly", author: "TO Head", impact: "Effective 1 March 2025", detail: "Cadence updated to improve control in high-risk quarter." },
    { version: "v2.6", date: "3 Feb", category: "Timeline", title: "Core Banking go-live revised from May to Jun 2025 (+4 weeks)", author: "IT Lead", impact: "Vendor milestone 3 missed - schedule rebaselined", detail: "Dependency risks on UAT and migration activities triggered rebaseline.", decision: "D-021" },
    { version: "v1.3", date: "20 Jan", category: "Scope", title: "SAFe Agile framework adopted - replaces previous Scrum-only approach", author: "MD", impact: "Training for 10 teams commences Feb", detail: "Governance approved enterprise agile model to scale delivery.", decision: "D-014" },
    { version: "v1.2", date: "15 Jan", category: "Budget", title: "Core Banking vendor contract signed - HK$58M committed", author: "CEO", impact: "Azure + Accenture appointed", detail: "Contract signed after 4-month tender and due diligence process.", decision: "D-011" },
  ];

  const calendarDays = Array.from({ length: 35 }).map((_, i) => {
    const day = i - 4;
    return day > 0 && day <= 31 ? day : null;
  });

  const uploadClass = "rounded-lg border border-[#C8922A] px-3 py-1.5 text-xs text-[#003366] hover:bg-[#FDF8EC]";

  const fileRows = (items: typeof files.strategic, section: string) =>
    items
      .filter((f) => f.name.toLowerCase().includes(docSearch.toLowerCase()))
      .map((file) => (
        <div key={`${section}-${file.name}-${file.version}`} className="flex items-center justify-between gap-2 rounded-lg border border-slate-200 px-2 py-1.5 text-xs hover:bg-[#FDF8EC]">
          <button type="button" aria-label={`Preview ${file.name}`} className="text-left" onClick={() => setFilePreview({ ...file, uploader: "TO Senior Manager", modified: "6 Mar 2025" })}>
            <p className="font-semibold text-slate-800">[{file.type}] {file.name}</p>
            <p className="text-slate-500">{file.version} · {file.date} · {file.size} {file.tags.includes("NEW") && <span className="rounded-full bg-emerald-100 px-1 py-0.5 text-[10px] text-emerald-700">NEW</span>}</p>
          </button>
          <div className="flex items-center gap-1">
            <button type="button" aria-label="Download file" onClick={() => onToast("Report exported to PDF")} className="rounded p-1 hover:bg-slate-100"><Download className="h-3.5 w-3.5" /></button>
            <button type="button" aria-label="Share file" onClick={() => onToast("Link shared with governance team")} className="rounded p-1 hover:bg-slate-100"><Share2 className="h-3.5 w-3.5" /></button>
          </div>
        </div>
      ));

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold text-[#003366]">Programme Governance Hub</h2>
        <p className="text-sm text-slate-600">Meeting Cadence | Decisions | Documentation</p>
      </div>

      <div className="flex flex-wrap gap-2 text-xs">
        <span className="rounded-full bg-white px-3 py-1">Meetings This Month: 14</span>
        <span className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-700">Decisions Made Q3: 12</span>
        <span className="rounded-full bg-amber-50 px-3 py-1 text-amber-700">Pending Decisions: 3</span>
        <span className="rounded-full bg-white px-3 py-1">Documents in Library: 47</span>
      </div>

      <div className="grid gap-4 xl:grid-cols-10">
        <Panel title="Governance Calendar" subtitle="March 2025" className="xl:col-span-3">
          <div className="mb-2 grid grid-cols-7 text-center text-[10px] font-semibold text-slate-500"><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span></div>
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day, idx) => (
              <button key={idx} type="button" aria-label={day ? `Open meetings for March ${day}` : "Empty date"} disabled={!day} className={cn("h-12 rounded-lg border border-slate-100 p-1 text-left text-xs", Boolean(day) && interactiveClass, day === 10 && "bg-[#003366] text-white", !day && "opacity-30")}
                onClick={(e) => {
                  if (!day || !meetingsByDay[day]) return;
                  const rect = (e.currentTarget as HTMLButtonElement).getBoundingClientRect();
                  setDatePopover({ x: rect.left + window.scrollX + 20, y: rect.bottom + window.scrollY + 8, day, meetings: meetingsByDay[day] });
                }}>
                <span>{day ?? ""}</span>
                <div className="mt-1 flex flex-wrap gap-0.5">{day && meetingsByDay[day]?.map((m) => <span key={m.name} className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: meetingColor[m.type] }} />)}</div>
              </button>
            ))}
          </div>
          <div className="mt-3 space-y-1 text-[11px] text-slate-600">
            <p><span className="mr-1 inline-block h-2 w-2 rounded-full" style={{ backgroundColor: "#7c3aed" }} />Purple: Executive Steering Committee</p>
            <p><span className="mr-1 inline-block h-2 w-2 rounded-full" style={{ backgroundColor: colors.navy }} />Navy: Programme Board</p>
            <p><span className="mr-1 inline-block h-2 w-2 rounded-full" style={{ backgroundColor: colors.gold }} />Gold: Working Group</p>
            <p><span className="mr-1 inline-block h-2 w-2 rounded-full" style={{ backgroundColor: colors.success }} />Green: Stakeholder Briefing</p>
            <p><span className="mr-1 inline-block h-2 w-2 rounded-full" style={{ backgroundColor: "#0d9488" }} />Teal: Post-Project Review</p>
          </div>
          <h4 className="mt-4 text-sm font-semibold text-[#003366]">Upcoming Meetings - Next 14 Days</h4>
          <div className="mt-2 space-y-2 text-xs">
            {[
              { name: "Cross-Func Working Group", date: "Mon 10 Mar, 14:00", chair: "TO Senior Manager", attendees: 12, type: "Cross-functional Working Group" },
              { name: "Programme Board", date: "Wed 12 Mar, 10:00", chair: "TO Head", attendees: 8, type: "Programme Board" },
              { name: "Post-Project Review: OKR Framework", date: "Thu 13 Mar, 15:00", chair: "TO Senior Manager", attendees: 5, type: "Post-Project Review" },
              { name: "Executive Steering Committee", date: "Mon 18 Mar, 09:00", chair: "CEO", attendees: 11, type: "Executive Steering Committee" },
              { name: "Programme Board", date: "Wed 19 Mar, 10:00", chair: "TO Head", attendees: 8, type: "Programme Board" },
            ].map((m) => (
              <div key={m.name + m.date} className="rounded-xl border border-slate-200 p-2" style={{ borderLeftColor: meetingColor[m.type], borderLeftWidth: 3 }}>
                <p className="font-semibold text-slate-800">{m.name}</p>
                <p className="text-slate-500">{m.date}</p>
                <div className="mt-1 flex items-center justify-between"><span>{m.chair}</span><span>{m.attendees} attendees</span></div>
                <button type="button" className={uploadClass} onClick={() => setAgendaMeeting({ name: m.name, date: m.date.split(",")[0], time: m.date.split(",")[1]?.trim() ?? "", location: "Boardroom 3, Sha Tin", chair: m.chair, attendees: ["CEO", "CFO", "CTO", "CHRO", "TO", "IT"], agenda: [{ title: "Opening & Apologies", presenter: "CEO", duration: "5 mins" }, { title: "Q3 Programme Status Review", presenter: "TO Senior Manager", duration: "20 mins" }, { title: "Core Banking - Emergency Risk Escalation", presenter: "IT Lead", duration: "15 mins" }, { title: "RG Training - Regulatory Risk Update", presenter: "Compliance Lead", duration: "15 mins" }, { title: "Budget Forecast Review - HK$18M Overrun Risk", presenter: "CFO", duration: "15 mins" }, { title: "Q4 Priorities & Resource Allocation", presenter: "TO Head", duration: "15 mins" }, { title: "Decisions Required (see Decision Register)", presenter: "Programme Board Chair", duration: "10 mins" }, { title: "AOB & Next Steps", presenter: "CEO", duration: "5 mins" }] })}>View Agenda</button>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Decision Register" subtitle="12 Decisions · Q3 FY2024-25" className="xl:col-span-4">
          <div className="mb-2 flex flex-wrap gap-2 text-xs"><button type="button" className="rounded border border-slate-300 px-2 py-1">All Status ▾</button><button type="button" className="rounded border border-slate-300 px-2 py-1">All Themes ▾</button><input className="rounded border border-slate-300 px-2 py-1" placeholder="Search" /></div>
          <div className="max-h-[540px] space-y-2 overflow-auto pr-1">
            {decisions.slice(0, visibleDecisions).map((d) => (
              <button key={d.id} type="button" aria-label={`Open decision ${d.id}`} className={cn("w-full rounded-xl border border-slate-200 p-3 text-left", interactiveClass)} onClick={() => setSelectedDecision(d)}>
                <div className="flex items-center justify-between gap-2"><span className="rounded-full bg-[#E8EFF8] px-2 py-0.5 text-xs text-[#003366]">{d.id}</span><RagPill status={d.status as "Low"} /></div>
                <p className="mt-1 text-sm font-semibold text-slate-800">{d.title}</p>
                <p className="text-xs text-slate-500">{d.maker} · {d.date}</p>
                <div className="mt-1 flex flex-wrap gap-1">{d.impact.map((i) => <span key={i} className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px]">{i}</span>)}</div>
                <p className="mt-1 text-xs italic text-slate-500">{d.rationale}</p>
                <p className="mt-1 text-xs font-semibold text-[#003366]">View Detail →</p>
              </button>
            ))}
          </div>
          {visibleDecisions < decisions.length && <button type="button" className="mt-2 rounded-lg border border-slate-300 px-3 py-1 text-xs" onClick={() => setVisibleDecisions((v) => v + 5)}>Load more</button>}
        </Panel>

        <Panel title="Document Library" subtitle="47 Documents" className="xl:col-span-3">
          <div className="mb-2 flex items-center justify-between gap-2"><input value={docSearch} onChange={(e) => setDocSearch(e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs" placeholder="Search documents..." /><button type="button" className={uploadClass} onClick={() => onToast("Upload queued in demo")}>+ Upload</button></div>
          {([
            ["strategic", "Strategic Documents (4 files)", files.strategic],
            ["reports", "Programme Status Reports (6 files)", files.reports],
            ["templates", "Governance Templates (5 files)", files.templates],
            ["businessCases", "Initiative Business Cases (8 files)", files.businessCases],
            ["minutes", "Meeting Minutes (14 files)", files.minutes],
            ["workshops", "Workshops & Assessments (6 files)", files.workshops],
            ["regulatory", "Regulatory & Compliance (4 files)", files.regulatory],
          ] as const).map((section) => (
            <div key={section[0]} className="mb-2 rounded-lg border border-slate-200">
              <button type="button" className="flex w-full items-center justify-between px-2 py-1.5 text-left text-xs font-semibold text-[#003366]" onClick={() => setOpenFolders((s) => ({ ...s, [section[0]]: !s[section[0]] }))}>
                <span>📁 {section[1]}</span>
                {openFolders[section[0]] ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
              </button>
              {openFolders[section[0]] && (
                <div className="space-y-1 border-t border-slate-200 p-1.5">
                  {Array.isArray(section[2]) && typeof section[2][0] === "object"
                    ? fileRows(section[2] as typeof files.strategic, section[0])
                    : (section[2] as string[]).map((n) => <div key={n} className="rounded bg-slate-50 px-2 py-1 text-xs text-slate-600">{n}</div>)}
                </div>
              )}
            </div>
          ))}
        </Panel>
      </div>

      <Panel title="Programme Change Log" subtitle="8 changes this quarter">
        <div className="space-y-2">
          {changes.map((entry) => (
            <button key={entry.version + entry.date} type="button" aria-label={`Open change ${entry.version}`} className={cn("w-full rounded-xl border border-slate-200 p-3 text-left", interactiveClass)} onClick={(e) => {
              const rect = (e.currentTarget as HTMLButtonElement).getBoundingClientRect();
              setChangePopover({ x: rect.left + window.scrollX + 300, y: rect.top + window.scrollY + 8, entry });
            }}>
              <div className="flex flex-wrap items-center gap-2 text-xs"><span className="rounded-full bg-[#003366] px-2 py-0.5 text-white">{entry.version}</span><span className="rounded-full bg-slate-100 px-2 py-0.5">{entry.date}</span><span className="rounded-full bg-slate-100 px-2 py-0.5">{entry.category}</span></div>
              <p className="mt-1 text-sm font-semibold text-slate-800">{entry.title}</p>
              <p className="text-xs text-slate-500">{entry.author} · {entry.impact}</p>
            </button>
          ))}
        </div>
      </Panel>

      <AnimatePresence>
        {datePopover && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setDatePopover(null)} />
            <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }} className="absolute z-50 w-[320px] rounded-xl border border-[#003366]/30 bg-white p-3 shadow-xl" style={{ left: datePopover.x, top: datePopover.y }}>
              <p className="text-sm font-bold text-[#003366]">March {datePopover.day}</p>
              {datePopover.meetings.map((m) => (
                <div key={m.name} className="mt-2 rounded-lg border border-slate-200 p-2 text-xs">
                  <p className="font-semibold">{m.name}</p>
                  <p>{m.time} · {m.location}</p>
                  <p>Chair: {m.chair}</p>
                  <p className="mt-1">Agenda:</p>
                  <ul className="list-disc pl-4">{m.agenda.slice(0, 3).map((a) => <li key={a}>{a}</li>)}</ul>
                  <button type="button" className="mt-1 text-[#003366] underline" onClick={() => { if (datePopover.day < 10) { setMinutesOpen(true); } else { setAgendaMeeting({ name: m.name, date: `March ${datePopover.day}`, time: m.time, location: m.location, chair: m.chair, attendees: m.attendees, agenda: m.agenda.map((a) => ({ title: a, presenter: "TBC", duration: "10 mins" })) }); } }}>View {datePopover.day < 10 ? "Minutes" : "Agenda"}</button>
                </div>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {changePopover && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setChangePopover(null)} />
            <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }} className="absolute z-50 w-[350px] rounded-xl border border-[#003366]/30 bg-white p-3 shadow-xl" style={{ left: changePopover.x, top: changePopover.y }}>
              <p className="font-semibold text-[#003366]">{changePopover.entry.title}</p>
              <p className="mt-1 text-xs text-slate-600">{changePopover.entry.detail}</p>
              <p className="mt-2 text-xs">Approval authority: {changePopover.entry.author}</p>
              <div className="mt-2 flex flex-wrap gap-1 text-[10px]"><span className="rounded bg-slate-100 px-2 py-0.5">Risk Register v4.2</span><span className="rounded bg-slate-100 px-2 py-0.5">Q3 Status Report</span></div>
              {changePopover.entry.decision && <button type="button" className="mt-2 text-xs text-[#003366] underline" onClick={() => setSelectedDecision(decisions.find((d) => d.id === changePopover.entry.decision) ?? null)}>View Decision →</button>}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <CenterModal open={Boolean(agendaMeeting)} onClose={() => setAgendaMeeting(null)} title={`${agendaMeeting?.name ?? "Meeting"} - Agenda`} breadcrumb="Programme Governance → Agenda" onExport={() => onToast("Report exported to PDF")}>
        {agendaMeeting && <div className="space-y-3 text-sm"><p className="rounded bg-slate-50 p-2 text-xs">{agendaMeeting.date} | {agendaMeeting.time} | {agendaMeeting.location} | Chair: {agendaMeeting.chair}</p><div className="flex flex-wrap gap-1 text-xs">{agendaMeeting.attendees.map((a) => <span key={a} className="rounded-full bg-[#E8EFF8] px-2 py-0.5 text-[#003366]">{a}</span>)}</div><ol className="list-decimal space-y-2 pl-5">{agendaMeeting.agenda.map((a) => <li key={a.title}><span className="font-semibold">{a.title}</span> <span className="text-xs text-slate-500">| {a.presenter} | {a.duration}</span></li>)}</ol><div className="flex gap-2"><button type="button" className={uploadClass} onClick={() => onToast("Agenda downloaded")}>Download Agenda PDF</button><button type="button" className={uploadClass} onClick={() => onToast("Attendance confirmed")}>Mark Attendance</button></div></div>}
      </CenterModal>

      <CenterModal open={minutesOpen} onClose={() => setMinutesOpen(false)} title="Programme Board 5 Mar - Minutes" breadcrumb="Programme Governance → Minutes" onExport={() => onToast("Report exported to PDF")}>
        <div className="space-y-3 text-sm">
          <p>The Programme Board reviewed Q3 programme status. The board noted deteriorating confidence in Digital and Compliance themes and requested emergency plans from IT Lead and Compliance Lead for the 18 March Executive SteerCo.</p>
          <p>Overall programme health rated Amber with immediate focus on Core Banking and RG training risk containment.</p>
          <Panel title="Decisions Made"><ol className="list-decimal space-y-1 pl-5 text-sm"><li>Approve change request CR-008 (Member App scope reduction) - Approved</li><li>Defer Workforce Planning to Q1 FY26 - Approved</li><li>Request emergency budget reforecast for Cloud Security - Pending CFO review</li></ol></Panel>
          <Panel title="Action Items"><div className="overflow-auto"><table className="min-w-full text-xs"><thead><tr className="border-b"><th className="py-1 text-left">Owner</th><th className="text-left">Action</th><th className="text-left">Due</th><th className="text-left">Status</th></tr></thead><tbody><tr className="border-b"><td className="py-1">IT Lead</td><td>Prepare Core Banking recovery plan</td><td>18 Mar</td><td>In Progress</td></tr><tr className="border-b"><td className="py-1">Compliance Lead</td><td>Draft RG training emergency plan</td><td>15 Mar</td><td>In Progress</td></tr><tr className="border-b"><td className="py-1">CFO</td><td>Review Cloud Security budget overrun</td><td>18 Mar</td><td>Not Started</td></tr><tr><td className="py-1">TO Senior Manager</td><td>Update Q3 status report for SteerCo</td><td>15 Mar</td><td>Complete</td></tr></tbody></table></div></Panel>
        </div>
      </CenterModal>

      <CenterModal open={Boolean(selectedDecision)} onClose={() => setSelectedDecision(null)} title={`Decision ${selectedDecision?.id ?? ""} - ${selectedDecision?.title ?? ""}`} breadcrumb="Programme Governance → Decision Register" onExport={() => onToast("Report exported to PDF")}>
        {selectedDecision && (
          <div className="space-y-3 text-sm">
            <Panel title="Decision Summary"><p>{selectedDecision.id === "D-013" ? "Following the discovery of a P1 security audit finding in the Cloud Security workstream, an additional HK$11M is required to fund emergency penetration test remediation, Web Application Firewall deployment, and 6 months of enhanced security monitoring. Without this investment, cloud migration for Core Banking and Wagering Platform cannot proceed safely." : selectedDecision.rationale}</p></Panel>
            <Panel title="Options Considered"><div className="overflow-auto"><table className="min-w-full text-xs"><thead><tr className="border-b"><th className="py-1 text-left">Option</th><th className="text-left">Pros</th><th className="text-left">Cons</th><th className="text-left">Recommended</th></tr></thead><tbody>{selectedDecision.id === "D-013" ? <><tr className="border-b"><td className="py-1">A: Approve full HK$11M</td><td>Resolves P1 finding, unblocks migration</td><td>Budget overrun impact</td><td>Yes</td></tr><tr className="border-b"><td className="py-1">B: Approve HK$6M partial</td><td>Lower immediate cost</td><td>P1 finding remains open</td><td>No</td></tr><tr><td className="py-1">C: Pause migration to FY26</td><td>No immediate spend</td><td>HK$45M benefits at risk</td><td>No</td></tr></> : <tr><td className="py-1">Primary Option</td><td>Aligns to programme objectives</td><td>Requires strict execution control</td><td>Yes</td></tr>}</tbody></table></div></Panel>
            <Panel title="Impact Assessment"><p>Budget impact: {selectedDecision.id === "D-013" ? "+HK$11M (3.9% overrun)" : "As per register"}</p><p>Timeline impact: {selectedDecision.id === "D-013" ? "8-week extension if not approved" : "Managed within quarter"}</p><p>Scope impact: No scope change</p><p>Risk change: {selectedDecision.id === "D-013" ? "Reduces Critical risk" : "Neutral"}</p></Panel>
            <Panel title="Implementation Actions"><ul className="list-disc pl-5 text-sm">{selectedDecision.id === "D-013" ? <><li>CFO to approve budget reforecast - 18 Mar</li><li>CISO to engage remediation vendor - 20 Mar</li><li>Programme Board to update risk register - 22 Mar</li></> : <li>Action plan to be tracked in governance action log.</li>}</ul></Panel>
            <p className="text-xs text-slate-500">Review Date: {selectedDecision.id === "D-013" ? "31 Mar 2025" : "Next monthly governance cycle"}</p>
          </div>
        )}
      </CenterModal>

      <CenterModal open={Boolean(filePreview)} onClose={() => setFilePreview(null)} title={filePreview?.name ?? "Document Preview"} breadcrumb="Programme Governance → Document Library" onExport={() => onToast("Report exported to PDF")}>
        {filePreview && <div className="space-y-3 text-sm"><div className="grid grid-cols-2 gap-2 rounded bg-slate-50 p-2 text-xs"><p>Type: {filePreview.type}</p><p>Size: {filePreview.size}</p><p>Version: {filePreview.version}</p><p>Uploaded by: {filePreview.uploader}</p><p>Upload date: {filePreview.date}</p><p>Last modified: {filePreview.modified}</p></div><p>{filePreview.name} is a key governance document used to support programme management reporting and decision making across HKJC Transformation Office forums.</p><div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-center text-slate-500">Document preview unavailable in demo - click Download to view full document.</div><div className="flex flex-wrap gap-1 text-xs">{filePreview.tags.map((tag) => <span key={tag} className="rounded-full bg-[#E8EFF8] px-2 py-0.5 text-[#003366]">{tag}</span>)}</div><Panel title="Version History"><table className="min-w-full text-xs"><tbody><tr><td className="py-1">v1.0</td><td>Initial issue</td><td>TO Office</td></tr><tr><td className="py-1">v1.1</td><td>Updated with governance comments</td><td>PMO</td></tr><tr><td className="py-1">{filePreview.version}</td><td>Current approved version</td><td>TO Senior Manager</td></tr></tbody></table></Panel><div className="flex gap-2"><button type="button" className={uploadClass} onClick={() => onToast("File downloaded")}>Download</button><button type="button" className={uploadClass} onClick={() => onToast("File share link copied")}>Share</button><button type="button" className={uploadClass} onClick={() => setFilePreview(null)}>Close</button></div></div>}
      </CenterModal>
    </div>
  );
}

export default App;
