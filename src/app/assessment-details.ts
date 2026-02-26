/**
 * Rich content for each of the 41 assessments across 18 units.
 * Keyed by assessment ID (a1–a41) matching data.ts.
 */

export interface AssessmentDetail {
  about: string;
  whatYouDo?: string[];
  whatYouSubmit?: string[];
  assessorLooksFor?: string[];
  commonMistakes?: string[];
  stepByStepPlan?: string[];
  videoScript?: string[];
  goodAnswerStructure?: string[];
  keyPoints?: string[];
  strongIncludes?: string[];
  simpleStructure?: string[];
  easyApproach?: string[];
  evidenceIdeas?: string[];
  clearWorkflow?: string[];
  tips?: string[];
}

export const assessmentDetails: Record<string, AssessmentDetail> = {

  // ═══════════════════════════════════════════════════
  // UNIT 1 — 5154 – ARCACIA Introduction
  // ═══════════════════════════════════════════════════

  // a1 — Orientation Quiz
  a1: {
    about:
      'This checks you understand how the course works — where to find units, how to submit work, how to get help, and course rules.',
    whatYouDo: ['Complete the quiz based on your orientation materials'],
    whatYouSubmit: ['Quiz answers only'],
    assessorLooksFor: [
      'You know where to find your units and assessments',
      'You understand how to submit work correctly',
      'You know who to contact for help and how',
      'You understand the course rules and expectations',
    ],
    commonMistakes: [
      'Not reading the orientation materials before attempting the quiz',
      'Confusing submission methods or deadlines',
    ],
  },

  // ═══════════════════════════════════════════════════
  // UNIT 2 — 1177 – Prerequisite (Use of animals in learning)
  // ═══════════════════════════════════════════════════

  // a2 — Quiz
  a2: {
    about:
      'This checks basic animal welfare, ethics, safe practice, supervision, and reporting in the context of using animals in learning.',
    whatYouDo: ['Complete the quiz based on prerequisite content'],
    whatYouSubmit: ['Quiz answers only'],
    assessorLooksFor: [
      'Understanding of basic animal welfare principles',
      'Awareness of ethical use of animals in education',
      'Knowledge of safe practices and supervision requirements',
      'Understanding of reporting obligations',
    ],
    commonMistakes: [
      'Overlooking reporting requirements',
      'Not understanding the difference between welfare and ethics',
    ],
  },

  // ═══════════════════════════════════════════════════
  // UNIT 3 — ACMEXH301 – Work within a zoological facility
  // ═══════════════════════════════════════════════════

  // a3 — Quiz
  a3: {
    about:
      'This checks your understanding of how a zoo operates day to day, including roles, routines, records, and safety.',
    whatYouDo: ['Complete the quiz based on unit content'],
    whatYouSubmit: ['Quiz answers only'],
    assessorLooksFor: [
      'Understanding of routine checks, reporting lines, and visitor safety',
      'Understanding of why documentation matters',
      'Understanding that you follow procedures and ask when unsure',
    ],
    commonMistakes: [
      'Assuming you can make decisions alone',
      'Ignoring the need to record and report issues',
    ],
  },

  // a4 — Skills Assessment
  a4: {
    about:
      'This checks you can behave and work like a zoo team member. Safety, communication, and documentation are key.',
    whatYouDo: [
      'Show a routine task or walk through it clearly',
      'Explain the safety risks and how you control them',
      'Show how you record what you did and how you report problems',
    ],
    whatYouSubmit: [
      'Video of you demonstrating or explaining the workflow',
      'A log entry or sample record',
      'Photos if allowed',
      'Supervisor or witness sign-off if required',
    ],
    stepByStepPlan: [
      'Read the assessment docx and highlight what evidence is required',
      'Choose one routine task you can demonstrate safely',
      'Prepare your evidence items — PPE, cleaning tools, log sheet or digital record example',
      'Record your video using a simple structure',
      'Save your evidence files with clear names',
      'Submit all files in the format requested',
    ],
    videoScript: [
      '"Hi, I\'m ____. This is ACMEXH301 Skills. Today I will show how I complete a standard task in a zoo setting."',
      '"First I check PPE and hazards. The main risks here are ____. I control them by ____."',
      '"Next I complete the task steps in this order: step 1, step 2, step 3."',
      '"During the task I protect animal welfare by ____."',
      '"After finishing, I document my work by recording ____ in ____."',
      '"If I see a problem I report it to ____ using ____."',
      '"Reflection: what went well is ____. Next time I will improve ____."',
    ],
    assessorLooksFor: [
      'You follow safe sequence and do not skip checks',
      'You can explain why your steps matter',
      'You show you know how to document and report',
      'You link your actions to welfare and safety',
    ],
    commonMistakes: [
      'No evidence of documentation',
      'Saying "I would do X" without showing steps',
      'Not explaining safety controls',
      'Forgetting a final area check and clean up',
    ],
  },

  // a5 — Case Study
  a5: {
    about:
      'This checks your judgement in a zoo scenario. It is about correct decisions, correct escalation, and correct documentation.',
    whatYouDo: [
      'Read a scenario',
      'Identify risks and problems',
      'Explain what you do first, what you do next, and who you contact',
      'Explain what you record and how you prevent repeat issues',
    ],
    whatYouSubmit: ['Written answers, sometimes plus a short video explanation'],
    goodAnswerStructure: [
      'Scenario summary in 2–3 lines',
      'Main risks — risk to people, risk to animals, risk to biosecurity, risk to facility',
      'Immediate actions — what you do now to make it safe',
      'Escalation and communication — who you notify and why',
      'Documentation — what you record and where',
      'Prevention — changes to reduce the chance of it happening again',
    ],
    commonMistakes: [
      'Not escalating to the right person',
      'Missing documentation',
      'Writing general advice without a step-by-step plan',
    ],
  },

  // ═══════════════════════════════════════════════════
  // UNIT 4 — ACMWHS301 – Workplace health and safety
  // ═══════════════════════════════════════════════════

  // a6 — Knowledge Assessment
  a6: {
    about:
      'This checks you understand WHS concepts and how to apply them in animal care workplaces.',
    whatYouDo: [
      'Define key terms',
      'Answer scenario questions',
      'Explain how you identify hazards and control risks',
    ],
    whatYouSubmit: ['Written answers'],
    easyApproach: [
      'Hazard: what can cause harm',
      'Risk: how likely harm is and how serious it could be',
      'Controls: choose from the hierarchy of control',
      'Report: tell the right person and record it',
      'Review: check if the control worked and adjust',
    ],
    assessorLooksFor: [
      'Correct use of hierarchy of control',
      'Clear logic for why you chose controls',
      'Understanding of reporting and consultation',
    ],
    commonMistakes: [
      'Only listing PPE when stronger controls exist',
      'Forgetting to mention reporting or documentation',
      'Writing definitions with no workplace example',
    ],
  },

  // a7 — Skills Assessment
  a7: {
    about:
      'This checks you can use WHS processes in practice, not just explain them.',
    whatYouDo: [
      'Identify a real or realistic hazard',
      'Assess the risk',
      'Implement a control',
      'Record and report what you did',
    ],
    whatYouSubmit: [
      'Short video walkthrough',
      'Risk assessment form or checklist',
      'Evidence of the control, like a photo of signage or a cleaned spill area',
      'A short reflection',
    ],
    stepByStepPlan: [
      'Choose one hazard you can safely demonstrate',
      'Describe the hazard and who could be harmed',
      'Rate risk using the method your course uses',
      'Apply controls from strongest to weakest',
      'Record it',
      'Explain how you will review it',
    ],
    assessorLooksFor: [
      'Realistic hazard identification',
      'Correct control choice',
      'Evidence of documentation and communication',
    ],
    commonMistakes: [
      'Picking a hazard but not showing any control',
      'Not linking the control to the risk level',
      'No reporting step',
    ],
  },

  // ═══════════════════════════════════════════════════
  // UNIT 5 — ACMEXH303 – Prepare and maintain animal habitats
  // ═══════════════════════════════════════════════════

  // a8 — Knowledge Assessment (Part 2)
  a8: {
    about:
      'This checks you understand habitat cleaning, maintenance, biosecurity, waste handling, and how these affect welfare.',
    whatYouDo: [
      'Explain cleaning sequences',
      'Explain how to prevent cross contamination',
      'Explain why habitat condition matters for welfare',
    ],
    whatYouSubmit: ['Written answers'],
    keyPoints: [
      'Clean from clean areas to dirty areas, or follow site procedure',
      'Separate tools between enclosures when required',
      'Hand hygiene and PPE rules',
      'Safe chemical handling if chemicals are used',
      'Waste segregation and disposal',
      'Final checks — water, bedding, enrichment, and safety',
    ],
    commonMistakes: [
      'Saying "clean the enclosure" without giving steps',
      'Forgetting biosecurity',
      'Forgetting waste disposal detail',
    ],
  },

  // a9 — Skills Assessment
  a9: {
    about:
      'This checks you can perform habitat maintenance safely and correctly.',
    whatYouDo: [
      'Demonstrate a cleaning and maintenance routine',
      'Explain safety and welfare choices',
      'Document the work',
    ],
    whatYouSubmit: ['Video', 'Checklist or log entry', 'Photos if allowed'],
    clearWorkflow: [
      'Preparation — PPE, signage, tools ready',
      'Safety check — hazards, animal location and barriers',
      'Cleaning and sanitation steps',
      'Waste disposal',
      'Habitat reset — water, bedding, enrichment',
      'Final check and documentation',
    ],
    commonMistakes: [
      'Skipping the final check',
      'No documentation evidence',
      'Not explaining safety controls',
    ],
  },

  // a10 — Project
  a10: {
    about:
      'This checks you can plan and improve habitat maintenance, not just do a single clean.',
    whatYouDo: [
      'Identify a habitat problem',
      'Propose a solution',
      'Plan resources and timeline',
      'Evaluate success',
    ],
    whatYouSubmit: [
      'Project plan document',
      'Risk assessment',
      'Before and after evidence if possible',
      'Evaluation summary',
    ],
    simpleStructure: [
      'Problem statement',
      'Goal',
      'Scope and constraints',
      'Plan and timeline',
      'Risks and controls',
      'Implementation summary',
      'Evaluation criteria and results',
      'Recommendations',
    ],
    commonMistakes: [
      'No evaluation criteria',
      'Goals that are too vague',
      'No risk controls',
    ],
  },

  // ═══════════════════════════════════════════════════
  // UNIT 6 — ACMGEN315 – Communicate effectively
  // ═══════════════════════════════════════════════════

  // a11 — Quiz
  a11: {
    about:
      'This checks you understand professional communication, listening, and workplace behaviour.',
    whatYouSubmit: ['Quiz answers only'],
    commonMistakes: [
      'Ignoring confidentiality',
      'Choosing confrontational language',
    ],
  },

  // a12 — Skills Assessment
  a12: {
    about:
      'This checks you can communicate clearly and professionally with a client or team member.',
    whatYouDo: [
      'Demonstrate an interaction',
      'Show listening and clarification',
      'Summarise and confirm next steps',
    ],
    whatYouSubmit: [
      'Video role play or recorded explanation',
      'Short written reflection or transcript',
    ],
    videoScript: [
      'Greeting and purpose',
      'Ask clarifying questions',
      'Repeat back key points',
      'Confirm what will happen next and when',
      'Close politely',
    ],
    commonMistakes: [
      'Not confirming understanding',
      'Missing next steps',
      'Using informal language that does not suit the setting',
    ],
  },

  // a13 — Case Study
  a13: {
    about:
      'This checks you can solve a communication problem in a workplace situation.',
    whatYouDo: [
      'Identify what went wrong',
      'Propose a better approach',
      'Provide follow-up steps',
    ],
    strongIncludes: [
      'What you would say, written like a short script',
      'What you would document after',
      'How you prevent the issue in future',
    ],
  },

  // ═══════════════════════════════════════════════════
  // UNIT 7 — ACMGEN312 – Provide nutritional requirements
  // ═══════════════════════════════════════════════════

  // a14 — Quiz
  a14: {
    about:
      'This checks knowledge of animal diets, food safety, and monitoring intake.',
    whatYouSubmit: ['Quiz answers only'],
  },

  // a15 — Skills Assessment
  a15: {
    about: 'This checks you can prepare diets safely and correctly.',
    whatYouDo: [
      'Explain a diet requirement',
      'Demonstrate safe food prep',
      'Show storage and logging',
    ],
    evidenceIdeas: [
      'Food prep checklist',
      'Labelling and storage photo',
      'Feeding log example',
    ],
    commonMistakes: [
      'No monitoring or record keeping',
      'Poor hygiene explanation',
    ],
  },

  // a16 — Project
  a16: {
    about:
      'This checks you can design a feeding plan and adjust it based on monitoring.',
    strongIncludes: [
      'Feeding schedule',
      'Monitoring method',
      'Adjustment logic — why changes were made',
      'Welfare and safety considerations',
    ],
  },

  // ═══════════════════════════════════════════════════
  // UNIT 8 — ACMGEN311 – Maintain and monitor animal health
  // ═══════════════════════════════════════════════════

  // a17 — Knowledge Assessment (Part 2)
  a17: {
    about:
      'This checks you understand signs of health and welfare, monitoring routines, and reporting.',
    strongIncludes: [
      'Normal and abnormal signs across behaviour, appetite, movement, droppings, skin, feathers, breathing',
      'What to record',
      'Who to report to and when',
    ],
  },

  // a18 — Skills Assessment
  a18: {
    about: 'This checks you can observe and record properly.',
    whatYouDo: [
      'Observe',
      'Record',
      'Identify concerns',
      'Explain escalation',
    ],
    commonMistakes: [
      'Notes are too vague',
      'No time and date',
      'No escalation pathway',
    ],
  },

  // a19 — Case Study
  a19: {
    about:
      'This checks you can respond to a welfare concern in a scenario.',
    strongIncludes: [
      'Immediate safety and welfare actions',
      'Reporting and escalation',
      'Monitoring plan',
      'Prevention ideas',
    ],
  },

  // ═══════════════════════════════════════════════════
  // UNIT 9 — ACMGEN301 – Prepare and present information
  // ════════════════════��══════════════════════════════

  // a20 — Project
  a20: {
    about:
      'This checks you can create accurate and audience-suitable public information.',
    whatYouSubmit: [
      'A poster, script, info sheet, or short presentation content',
      'Sources',
      'Reflection',
    ],
    commonMistakes: [
      'Too technical',
      'No references',
      'No clear audience',
    ],
  },

  // a21 — Skills Assessment
  a21: {
    about: 'This checks you can deliver information clearly.',
    whatYouSubmit: [
      'Video delivery',
      'Reflection on engagement techniques',
    ],
  },

  // ═══════════════════════════════════════════════════
  // UNIT 10 — ACMGEN303 – Assess animal welfare
  // ═══════════════════════════════════════════════════

  // a22 — Skills Assessment
  a22: {
    about:
      'This checks you can assess welfare using observable evidence.',
    strongIncludes: [
      'Clear criteria',
      'Observations linked to criteria',
      'Clear conclusion',
      'Immediate priorities and recommendations',
    ],
  },

  // a23 — Project
  a23: {
    about:
      'This checks you can improve welfare over time and monitor outcomes.',
    strongIncludes: [
      'Baseline assessment',
      'Actions taken',
      'Monitoring schedule',
      'Evaluation results',
    ],
  },

  // ═══════════════════════════════════════════════════
  // UNIT 11 — ACMBEH302 – Provide enrichment
  // ═══════════════════════════════════════════════════

  // a24 — Knowledge Assessment (Part 2)
  a24: {
    about:
      'This checks you understand enrichment categories, safety, and evaluation.',
    strongIncludes: [
      'Clear enrichment categories',
      'Species-suitable examples',
      'Safety risks and controls',
      'How you measure success',
    ],
  },

  // a25 — Project
  a25: {
    about:
      'This checks you can design and evaluate an enrichment program.',
    strongIncludes: [
      'Objective',
      'Schedule',
      'Observation method',
      'Evaluation and improvements',
    ],
  },

  // a26 — Skills Assessment
  a26: {
    about:
      'This checks you can set up enrichment safely and observe outcomes.',
  },

  // ═══════════════════════════════════════════════════
  // UNIT 12 — ACMEXH304 – Capture, restraint, move animals
  // ═══════════════════════════════════════════════════

  // a27 — Knowledge Assessment (Part 2)
  a27: {
    about:
      'This checks you understand safe handling principles and welfare.',
    strongIncludes: [
      'Equipment and PPE',
      'Stress reduction methods',
      'Role clarity',
      'Documentation and reporting',
    ],
  },

  // a28 — Skills Assessment
  a28: {
    about: 'This checks you can assist safely within your role.',
  },

  // a29 — Project
  a29: {
    about:
      'This checks you can plan a safe procedure with risk controls and roles.',
  },

  // ═══════════════════════════════════════════════════
  // UNIT 13 — ACMGEN304 – Promote positive wellbeing
  // ═══════════════════════════════════════════════════

  // a30 — Project
  a30: {
    about:
      'This checks you can plan wellbeing improvements for self and others.',
  },

  // a31 — Case Study
  a31: {
    about:
      'This checks you can respond to a wellbeing scenario with appropriate support and follow-up.',
  },

  // ═══════════════════════════════════════════════════
  // UNIT 14 — ACMSUS401 – Sustainable work practices
  // ═══════════════════════════════════════════════════

  // a32 — Project
  a32: {
    about:
      'This checks you can plan, implement, and monitor sustainability improvements.',
  },

  // ═══════════════════════════════════════════════════
  // UNIT 15 — ACMGEN309 – Basic animal first aid
  // ═══════════════════════════════════════════════════

  // a33 — Quiz (NEW)
  a33: {
    about:
      'This checks basic first aid priorities, safety, infection control, and escalation expectations.',
    whatYouDo: ['Complete the quiz based on unit content'],
    whatYouSubmit: ['Quiz answers only'],
    assessorLooksFor: [
      'Understanding of first aid priorities and scope',
      'Knowledge of infection control basics',
      'Understanding of when and how to escalate',
    ],
    commonMistakes: [
      'Attempting procedures beyond your scope',
      'Forgetting infection control steps',
    ],
  },

  // a34 — Skills Assessment
  a34: {
    about:
      'This checks your first aid response within scope and correct reporting.',
  },

  // ═══════════════════════════════════════════════════
  // UNIT 16 — ACMEXH309 – Exhibit design and renovation
  // ═══════════════════════════════════════════════════

  // a35 — Quiz (NEW)
  a35: {
    about:
      'This checks basic exhibit planning concepts, welfare needs, safety, and practical maintenance considerations.',
    whatYouDo: ['Complete the quiz based on unit content'],
    whatYouSubmit: ['Quiz answers only'],
    assessorLooksFor: [
      'Understanding of how exhibit design affects welfare',
      'Awareness of safety and maintenance requirements',
      'Knowledge of practical planning considerations',
    ],
    commonMistakes: [
      'Focusing only on aesthetics without welfare considerations',
      'Ignoring maintenance and cleaning access in design',
    ],
  },

  // a36 — Project
  a36: {
    about:
      'This checks you can contribute to exhibit planning with welfare and safety.',
  },

  // ═══════════════════════════════════════════════════
  // UNIT 17 — ACMEXH302 – Species population planning
  // ═══════════════════════════════════════════════════

  // a37 — Knowledge Assessment (Part 2)
  a37: {
    about:
      'This checks understanding of population planning, records, and review cycles.',
  },

  // a38 — Project
  a38: {
    about:
      'This checks you can produce a basic population plan with monitoring.',
  },

  // ═══════════════════════════════════════════════════
  // UNIT 18 — ACMSPE314 – General care of birds
  // ═══════════════════════════════════════════════════

  // a39 — Quiz (NEW)
  a39: {
    about:
      'This checks bird care basics including husbandry, hygiene, welfare checks, and common risks.',
    whatYouDo: ['Complete the quiz based on unit content'],
    whatYouSubmit: ['Quiz answers only'],
    assessorLooksFor: [
      'Understanding of routine bird husbandry',
      'Knowledge of hygiene and welfare check requirements',
      'Awareness of common risks in bird care',
    ],
    commonMistakes: [
      'Not understanding species-specific care differences',
      'Overlooking hygiene protocols for aviaries',
    ],
  },

  // a40 — Skills Assessment
  a40: {
    about:
      'This checks you can do routine bird care safely and hygienically.',
  },

  // a41 — Case Study
  a41: {
    about:
      'This checks you can respond to a bird welfare issue with correct steps, reporting, and monitoring.',
  },
};
