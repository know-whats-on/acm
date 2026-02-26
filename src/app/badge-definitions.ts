/**
 * Badge definitions for the Wildlife Assignments & Competency Tracker.
 * 41 badges total: 36 Assessment badges + 5 Quality badges.
 *
 * Assessment badges unlock when their linked assessment reaches
 * "submitted" or "competent" status.
 *
 * Quality badges unlock when a threshold count of assessments
 * reaches "submitted" or "competent".
 */

export type BadgeRarity = 'Common' | 'Uncommon' | 'Rare' | 'Legendary';
export type BadgeCategory = 'Assessment' | 'Quality';

export interface BadgeDefinition {
  id: string;
  name: string;
  category: BadgeCategory;
  unitCode?: string;
  assessmentName?: string;
  /** Direct link to the assessment ID in data.ts for fast lookup */
  assessmentId?: string;
  rarity: BadgeRarity;
  xpBonus: number;
  iconHint: string;
  description: string;
  coachTip?: string;
  /** For quality badges: how many "submitted"/"competent" total are needed */
  qualityThreshold?: number;
}

export const RARITY_CONFIG: Record<BadgeRarity, {
  label: string;
  color: string;
  bg: string;
  border: string;
  gradient: string;
  glow: string;
  textColor: string;
}> = {
  Common: {
    label: 'Common',
    color: '#9ca3af',
    bg: 'rgba(156,163,175,0.1)',
    border: 'rgba(156,163,175,0.2)',
    gradient: 'linear-gradient(135deg, rgba(156,163,175,0.15) 0%, rgba(107,114,128,0.08) 100%)',
    glow: '0 0 12px rgba(156,163,175,0.15)',
    textColor: 'text-gray-400',
  },
  Uncommon: {
    label: 'Uncommon',
    color: '#34d399',
    bg: 'rgba(52,211,153,0.1)',
    border: 'rgba(52,211,153,0.2)',
    gradient: 'linear-gradient(135deg, rgba(52,211,153,0.15) 0%, rgba(16,185,129,0.08) 100%)',
    glow: '0 0 16px rgba(52,211,153,0.2)',
    textColor: 'text-emerald-400',
  },
  Rare: {
    label: 'Rare',
    color: '#818cf8',
    bg: 'rgba(129,140,248,0.1)',
    border: 'rgba(129,140,248,0.25)',
    gradient: 'linear-gradient(135deg, rgba(129,140,248,0.18) 0%, rgba(99,102,241,0.08) 100%)',
    glow: '0 0 20px rgba(129,140,248,0.25)',
    textColor: 'text-indigo-400',
  },
  Legendary: {
    label: 'Legendary',
    color: '#fbbf24',
    bg: 'rgba(251,191,36,0.1)',
    border: 'rgba(251,191,36,0.3)',
    gradient: 'linear-gradient(135deg, rgba(251,191,36,0.2) 0%, rgba(245,158,11,0.1) 100%)',
    glow: '0 0 24px rgba(251,191,36,0.3)',
    textColor: 'text-yellow-400',
  },
};

export const badgeDefinitions: BadgeDefinition[] = [
  // ───── ACMEXH301 — Work within a zoological facility ─────
  {
    id: 'acmexh301_quiz_zoo_ops_aware',
    name: 'Zoo Ops Aware',
    category: 'Assessment',
    unitCode: 'ACMEXH301',
    assessmentName: 'Quiz',
    assessmentId: 'a3',
    rarity: 'Common',
    xpBonus: 10,
    iconHint: 'clipboard-check',
    description: 'You understand zoo routines, reporting lines, visitor safety, and why documentation matters.',
    coachTip: "Avoid the 'I can decide alone' mindset — zoo work is team + procedure + records.",
  },
  {
    id: 'acmexh301_skills_shift_ready_keeper',
    name: 'Shift-Ready Keeper',
    category: 'Assessment',
    unitCode: 'ACMEXH301',
    assessmentName: 'Skills Assessment',
    assessmentId: 'a4',
    rarity: 'Uncommon',
    xpBonus: 30,
    iconHint: 'shield-check',
    description: 'You demonstrated a safe routine task with hazards, controls, welfare focus, and clear documentation/reporting.',
    coachTip: "Don't just say \"I would do X\" — show steps + final area check + cleanup + record.",
  },
  {
    id: 'acmexh301_case_calm_under_pressure',
    name: 'Calm Under Pressure',
    category: 'Assessment',
    unitCode: 'ACMEXH301',
    assessmentName: 'Case Study',
    assessmentId: 'a5',
    rarity: 'Uncommon',
    xpBonus: 20,
    iconHint: 'route',
    description: 'You made step-by-step decisions, escalated correctly, and documented actions to prevent repeat issues.',
    coachTip: 'Strong answers include: immediate actions, who you notify, what you record, and prevention.',
  },

  // ───── ACMWHS301 — Contribute to workplace health and safety ─────
  {
    id: 'acmwhs301_knowledge_hierarchy_hitter',
    name: 'Hierarchy Hitter',
    category: 'Assessment',
    unitCode: 'ACMWHS301',
    assessmentName: 'Knowledge Assessment',
    assessmentId: 'a6',
    rarity: 'Common',
    xpBonus: 15,
    iconHint: 'layers',
    description: 'You applied WHS terms correctly and used the hierarchy of control with clear logic and reporting/consultation.',
    coachTip: "Don't list only PPE — show stronger controls first, then reporting + review.",
  },
  {
    id: 'acmwhs301_skills_control_in_action',
    name: 'Control In Action',
    category: 'Assessment',
    unitCode: 'ACMWHS301',
    assessmentName: 'Skills Assessment',
    assessmentId: 'a7',
    rarity: 'Uncommon',
    xpBonus: 30,
    iconHint: 'hard-hat',
    description: 'You identified a realistic hazard, assessed risk, implemented controls, and documented + communicated the outcome.',
    coachTip: 'Always link your control choice to the risk level and include the reporting step.',
  },

  // ───── ACMEXH303 — Prepare and maintain animal habitats ─────
  {
    id: 'acmexh303_knowledge_biosecurity_brain',
    name: 'Biosecurity Brain',
    category: 'Assessment',
    unitCode: 'ACMEXH303',
    assessmentName: 'Knowledge Assessment (Part 2)',
    assessmentId: 'a8',
    rarity: 'Common',
    xpBonus: 15,
    iconHint: 'droplets',
    description: 'You understand cleaning sequences, cross-contamination prevention, waste handling, and welfare impacts.',
    coachTip: 'High scorers include: clean-to-dirty sequence, tool separation, hygiene, waste disposal, final checks.',
  },
  {
    id: 'acmexh303_skills_habitat_reset_pro',
    name: 'Habitat Reset Pro',
    category: 'Assessment',
    unitCode: 'ACMEXH303',
    assessmentName: 'Skills Assessment',
    assessmentId: 'a9',
    rarity: 'Uncommon',
    xpBonus: 30,
    iconHint: 'sparkles',
    description: 'You demonstrated safe habitat maintenance with welfare choices, reset steps, final checks, and documentation.',
    coachTip: 'Final check + documentation are the most missed. Make them visible in your evidence.',
  },
  {
    id: 'acmexh303_project_habitat_improvement_planner',
    name: 'Habitat Improvement Planner',
    category: 'Assessment',
    unitCode: 'ACMEXH303',
    assessmentName: 'Project',
    assessmentId: 'a10',
    rarity: 'Rare',
    xpBonus: 50,
    iconHint: 'calendar-check',
    description: 'You planned a habitat improvement with scope, timeline, risks/controls, evaluation, and recommendations.',
    coachTip: "No evaluation criteria = common fail. Define what 'success' looks like upfront.",
  },

  // ───── ACMGEN315 — Communicate effectively ─────
  {
    id: 'acmgen315_quiz_clear_comms_basics',
    name: 'Clear Comms Basics',
    category: 'Assessment',
    unitCode: 'ACMGEN315',
    assessmentName: 'Quiz',
    assessmentId: 'a11',
    rarity: 'Common',
    xpBonus: 10,
    iconHint: 'message-square',
    description: 'You demonstrated understanding of professional communication, confidentiality, and workplace behaviour.',
    coachTip: "Professional tone + confidentiality > being 'right' or confrontational.",
  },
  {
    id: 'acmgen315_skills_professional_communicator',
    name: 'Professional Communicator',
    category: 'Assessment',
    unitCode: 'ACMGEN315',
    assessmentName: 'Skills Assessment',
    assessmentId: 'a12',
    rarity: 'Uncommon',
    xpBonus: 30,
    iconHint: 'mic',
    description: 'You showed listening, clarification, summary, and confirmed next steps in a realistic interaction.',
    coachTip: 'Most missed: repeating back key points + confirming next steps and timing.',
  },
  {
    id: 'acmgen315_case_deescalation_designer',
    name: 'De-escalation Designer',
    category: 'Assessment',
    unitCode: 'ACMGEN315',
    assessmentName: 'Case Study',
    assessmentId: 'a13',
    rarity: 'Uncommon',
    xpBonus: 20,
    iconHint: 'shield',
    description: 'You diagnosed a communication breakdown, proposed better language, and documented follow-up steps.',
    coachTip: 'Top answers include: exact script + what you document after + prevention.',
  },

  // ───── ACMGEN312 — Provide nutritional requirements ─────
  {
    id: 'acmgen312_quiz_nutrition_knowhow',
    name: 'Nutrition Know-How',
    category: 'Assessment',
    unitCode: 'ACMGEN312',
    assessmentName: 'Quiz',
    assessmentId: 'a14',
    rarity: 'Common',
    xpBonus: 10,
    iconHint: 'apple',
    description: 'You understand diets, food safety, and monitoring intake.',
  },
  {
    id: 'acmgen312_skills_safe_prep_specialist',
    name: 'Safe Prep Specialist',
    category: 'Assessment',
    unitCode: 'ACMGEN312',
    assessmentName: 'Skills Assessment',
    assessmentId: 'a15',
    rarity: 'Uncommon',
    xpBonus: 30,
    iconHint: 'utensils',
    description: 'You demonstrated safe food prep, storage/labelling, and logging/monitoring.',
    coachTip: 'Common miss: no monitoring/record keeping. Logs are part of the skill.',
  },
  {
    id: 'acmgen312_project_feeding_plan_architect',
    name: 'Feeding Plan Architect',
    category: 'Assessment',
    unitCode: 'ACMGEN312',
    assessmentName: 'Project',
    assessmentId: 'a16',
    rarity: 'Rare',
    xpBonus: 50,
    iconHint: 'file-text',
    description: 'You designed a feeding plan with monitoring, adjustment logic, and welfare/safety considerations.',
  },

  // ───── ACMGEN311 — Maintain and monitor animal health ─────
  {
    id: 'acmgen311_knowledge_health_signals_spotter',
    name: 'Health Signals Spotter',
    category: 'Assessment',
    unitCode: 'ACMGEN311',
    assessmentName: 'Knowledge Assessment (Part 2)',
    assessmentId: 'a17',
    rarity: 'Common',
    xpBonus: 15,
    iconHint: 'activity',
    description: 'You identified normal vs abnormal signs and explained what to record and when to report.',
  },
  {
    id: 'acmgen311_skills_observation_scribe',
    name: 'Observation Scribe',
    category: 'Assessment',
    unitCode: 'ACMGEN311',
    assessmentName: 'Skills Assessment',
    assessmentId: 'a18',
    rarity: 'Uncommon',
    xpBonus: 30,
    iconHint: 'pen-tool',
    description: 'You observed, recorded clearly (time/date), identified concerns, and described escalation.',
    coachTip: 'Avoid vague notes — timestamp + specifics + escalation pathway.',
  },
  {
    id: 'acmgen311_case_welfare_first_responder',
    name: 'Welfare First Responder',
    category: 'Assessment',
    unitCode: 'ACMGEN311',
    assessmentName: 'Case Study',
    assessmentId: 'a19',
    rarity: 'Uncommon',
    xpBonus: 20,
    iconHint: 'alert-triangle',
    description: 'You responded to a welfare scenario with immediate actions, reporting, monitoring, and prevention.',
  },

  // ───── ACMGEN301 — Prepare and present information ─────
  {
    id: 'acmgen301_project_public_educator',
    name: 'Public Educator',
    category: 'Assessment',
    unitCode: 'ACMGEN301',
    assessmentName: 'Project',
    assessmentId: 'a20',
    rarity: 'Rare',
    xpBonus: 50,
    iconHint: 'megaphone',
    description: 'You created accurate, audience-suitable public information with sources and reflection.',
    coachTip: 'Most common fail: no references or unclear target audience.',
  },
  {
    id: 'acmgen301_skills_engagement_speaker',
    name: 'Engagement Speaker',
    category: 'Assessment',
    unitCode: 'ACMGEN301',
    assessmentName: 'Skills Assessment',
    assessmentId: 'a21',
    rarity: 'Uncommon',
    xpBonus: 30,
    iconHint: 'video',
    description: 'You delivered information clearly and reflected on engagement techniques.',
  },

  // ───── ACMGEN303 — Assess animal welfare ─────
  {
    id: 'acmgen303_skills_welfare_assessor',
    name: 'Welfare Assessor',
    category: 'Assessment',
    unitCode: 'ACMGEN303',
    assessmentName: 'Skills Assessment',
    assessmentId: 'a22',
    rarity: 'Uncommon',
    xpBonus: 30,
    iconHint: 'search',
    description: 'You assessed welfare using clear criteria, linked observations, and reached a defensible conclusion.',
  },
  {
    id: 'acmgen303_project_welfare_uplift_lead',
    name: 'Welfare Uplift Lead',
    category: 'Assessment',
    unitCode: 'ACMGEN303',
    assessmentName: 'Project',
    assessmentId: 'a23',
    rarity: 'Rare',
    xpBonus: 50,
    iconHint: 'trending-up',
    description: 'You improved welfare over time with baseline, actions, monitoring schedule, and evaluation results.',
  },

  // ───── ACMBEH302 — Provide enrichment ─────
  {
    id: 'acmbeh302_knowledge_enrichment_strategist',
    name: 'Enrichment Strategist',
    category: 'Assessment',
    unitCode: 'ACMBEH302',
    assessmentName: 'Knowledge Assessment (Part 2)',
    assessmentId: 'a24',
    rarity: 'Common',
    xpBonus: 15,
    iconHint: 'brain',
    description: 'You explained enrichment categories, species-suitable examples, risks/controls, and how to measure success.',
  },
  {
    id: 'acmbeh302_project_enrichment_program_builder',
    name: 'Enrichment Program Builder',
    category: 'Assessment',
    unitCode: 'ACMBEH302',
    assessmentName: 'Project',
    assessmentId: 'a25',
    rarity: 'Rare',
    xpBonus: 50,
    iconHint: 'sparkle',
    description: 'You designed and evaluated an enrichment program with objectives, schedule, observation method, and improvements.',
  },
  {
    id: 'acmbeh302_skills_enrichment_setup_scout',
    name: 'Enrichment Setup Scout',
    category: 'Assessment',
    unitCode: 'ACMBEH302',
    assessmentName: 'Skills Assessment',
    assessmentId: 'a26',
    rarity: 'Uncommon',
    xpBonus: 30,
    iconHint: 'package',
    description: 'You set up enrichment safely and observed outcomes appropriately.',
  },

  // ───── ACMEXH304 — Assist with capture/restraint ─────
  {
    id: 'acmexh304_knowledge_handling_principles_pro',
    name: 'Handling Principles Pro',
    category: 'Assessment',
    unitCode: 'ACMEXH304',
    assessmentName: 'Knowledge Assessment (Part 2)',
    assessmentId: 'a27',
    rarity: 'Common',
    xpBonus: 15,
    iconHint: 'hand',
    description: 'You covered PPE/equipment, stress reduction, role clarity, and documentation/reporting for handling.',
  },
  {
    id: 'acmexh304_skills_safe_assist',
    name: 'Safe Assist',
    category: 'Assessment',
    unitCode: 'ACMEXH304',
    assessmentName: 'Skills Assessment',
    assessmentId: 'a28',
    rarity: 'Uncommon',
    xpBonus: 30,
    iconHint: 'shield',
    description: 'You assisted within your role safely and followed instructions, welfare priorities, and communication protocols.',
  },
  {
    id: 'acmexh304_project_procedure_planner',
    name: 'Procedure Planner',
    category: 'Assessment',
    unitCode: 'ACMEXH304',
    assessmentName: 'Project',
    assessmentId: 'a29',
    rarity: 'Rare',
    xpBonus: 50,
    iconHint: 'map',
    description: 'You planned a safe procedure with role allocation and risk controls.',
  },

  // ───── ACMGEN304 — Promote positive wellbeing ─────
  {
    id: 'acmgen304_project_wellbeing_builder',
    name: 'Wellbeing Builder',
    category: 'Assessment',
    unitCode: 'ACMGEN304',
    assessmentName: 'Project',
    assessmentId: 'a30',
    rarity: 'Rare',
    xpBonus: 50,
    iconHint: 'heart',
    description: 'You planned wellbeing improvements for yourself and others with practical steps and follow-through.',
  },
  {
    id: 'acmgen304_case_support_navigator',
    name: 'Support Navigator',
    category: 'Assessment',
    unitCode: 'ACMGEN304',
    assessmentName: 'Case Study',
    assessmentId: 'a31',
    rarity: 'Uncommon',
    xpBonus: 20,
    iconHint: 'life-buoy',
    description: 'You responded to a wellbeing scenario with appropriate support steps and follow-up actions.',
  },

  // ───── ACMSUS401 — Sustainable work practices ─────
  {
    id: 'acmsus401_project_sustainability_implementer',
    name: 'Sustainability Implementer',
    category: 'Assessment',
    unitCode: 'ACMSUS401',
    assessmentName: 'Project',
    assessmentId: 'a32',
    rarity: 'Rare',
    xpBonus: 50,
    iconHint: 'leaf',
    description: 'You planned, implemented, and monitored a sustainability improvement with measurable outcomes.',
  },

  // ───── ACMGEN309 — Provide basic animal first aid ─────
  {
    id: 'acmgen309_skills_first_aid_within_scope',
    name: 'First Aid Within Scope',
    category: 'Assessment',
    unitCode: 'ACMGEN309',
    assessmentName: 'Skills Assessment',
    assessmentId: 'a34',
    rarity: 'Uncommon',
    xpBonus: 30,
    iconHint: 'plus-circle',
    description: 'You demonstrated an in-scope first aid response and correct reporting/escalation.',
  },

  // ───── ACMEXH309 — Exhibit design and renovation ─────
  {
    id: 'acmexh309_project_exhibit_codesigner',
    name: 'Exhibit Co-Designer',
    category: 'Assessment',
    unitCode: 'ACMEXH309',
    assessmentName: 'Project',
    assessmentId: 'a36',
    rarity: 'Rare',
    xpBonus: 50,
    iconHint: 'layout',
    description: 'You contributed to exhibit planning with welfare and safety considerations.',
  },

  // ───── ACMEXH302 — Species population planning ─────
  {
    id: 'acmexh302_knowledge_population_planning_foundations',
    name: 'Population Planning Foundations',
    category: 'Assessment',
    unitCode: 'ACMEXH302',
    assessmentName: 'Knowledge Assessment (Part 2)',
    assessmentId: 'a37',
    rarity: 'Common',
    xpBonus: 15,
    iconHint: 'database',
    description: 'You understood population planning concepts, records, and review cycles.',
  },
  {
    id: 'acmexh302_project_population_plan_drafter',
    name: 'Population Plan Drafter',
    category: 'Assessment',
    unitCode: 'ACMEXH302',
    assessmentName: 'Project',
    assessmentId: 'a38',
    rarity: 'Rare',
    xpBonus: 50,
    iconHint: 'file-spreadsheet',
    description: 'You produced a basic population plan with monitoring and review logic.',
  },

  // ───── ACMSPE314 — General care of birds ─────
  {
    id: 'acmspe314_skills_bird_care_routine',
    name: 'Bird Care Routine',
    category: 'Assessment',
    unitCode: 'ACMSPE314',
    assessmentName: 'Skills Assessment',
    assessmentId: 'a40',
    rarity: 'Uncommon',
    xpBonus: 30,
    iconHint: 'feather',
    description: 'You demonstrated routine bird care safely and hygienically.',
  },
  {
    id: 'acmspe314_case_bird_welfare_advocate',
    name: 'Bird Welfare Advocate',
    category: 'Assessment',
    unitCode: 'ACMSPE314',
    assessmentName: 'Case Study',
    assessmentId: 'a41',
    rarity: 'Uncommon',
    xpBonus: 20,
    iconHint: 'feather',
    description: 'You responded to a bird welfare issue with correct steps, reporting, and monitoring.',
  },

  // ───── QUALITY / BEHAVIOUR BADGES ─────
  {
    id: 'quality_documentation_matters',
    name: 'Documentation Matters',
    category: 'Quality',
    rarity: 'Common',
    xpBonus: 25,
    iconHint: 'book-open',
    description: 'You consistently attach records and logs — the thing most students forget.',
    qualityThreshold: 10,
  },
  {
    id: 'quality_escalation_ready',
    name: 'Escalation Ready',
    category: 'Quality',
    rarity: 'Uncommon',
    xpBonus: 40,
    iconHint: 'phone-call',
    description: 'You repeatedly name who to notify and how — clear reporting lines every time.',
    qualityThreshold: 5,
  },
  {
    id: 'quality_safety_first',
    name: 'Safety First',
    category: 'Quality',
    rarity: 'Uncommon',
    xpBonus: 40,
    iconHint: 'hard-hat',
    description: 'You show hazards + controls (not just PPE) with evidence across multiple assessments.',
    qualityThreshold: 5,
  },
  {
    id: 'quality_biosecurity_guardian',
    name: 'Biosecurity Guardian',
    category: 'Quality',
    rarity: 'Uncommon',
    xpBonus: 40,
    iconHint: 'shield-alert',
    description: 'You tag and evidence biosecurity practices: tool separation, hygiene, waste handling.',
    qualityThreshold: 3,
  },
  {
    id: 'quality_evaluation_mindset',
    name: 'Evaluation Mindset',
    category: 'Quality',
    rarity: 'Rare',
    xpBonus: 60,
    iconHint: 'bar-chart-3',
    description: "You include evaluation criteria and results — the difference between 'did it' and 'improved it'.",
    qualityThreshold: 3,
  },
];
