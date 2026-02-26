export type Status = 'not-started' | 'draft' | 'submitted' | 'returned' | 'competent' | 'not-yet-competent';

export const studentName = 'Alex';

export type Tier = 'none' | 'bronze' | 'silver' | 'gold';

export interface Assessment {
  id: string;
  name: string;
  status: Status;
  xp: number;
}

export interface Unit {
  id: string;
  code: string;
  title: string;
  progress: number;
  tier: Tier;
  xpEarned: number;
  xpTotal: number;
  assessments: Assessment[];
  image: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  unlocked: boolean;
  date?: string;
  howToUnlock: string;
  icon: string;
}

export interface LogEntry {
  id: string;
  date: string;
  time: string;
  type: 'note' | 'evidence' | 'assessment';
  title: string;
  tags: string[];
}

export const WILDLIFE_IMAGES = [
  'https://images.unsplash.com/photo-1722627168596-e9a5ba58c8cd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cm9waWNhbCUyMGp1bmdsZSUyMHN1bmxpZ2h0JTIwY2Fub3B5fGVufDF8fHx8MTc3MjEwNDI1NXww&ixlib=rb-4.1.0&q=80&w=1080',
  'https://images.unsplash.com/photo-1768346615216-2e03083a4727?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx6b28lMjB3aWxkbGlmZSUyMGFuaW1hbCUyMGVuY2xvc3VyZXxlbnwxfHx8fDE3NzIxMDQyNTV8MA&ixlib=rb-4.1.0&q=80&w=1080',
  'https://images.unsplash.com/photo-1674267845241-6255d65e4d6b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cm9waWNhbCUyMGJpcmRzJTIwY29sb3JmdWwlMjBhdmlhcnl8ZW58MXx8fHwxNzcyMTA0MjU2fDA&ixlib=rb-4.1.0&q=80&w=1080',
  'https://images.unsplash.com/photo-1559735171-971fcb055f72?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aWxkbGlmZSUyMGNvbnNlcnZhdGlvbiUyMG5hdHVyZXxlbnwxfHx8fDE3NzIwMjExOTd8MA&ixlib=rb-4.1.0&q=80&w=1080',
  'https://images.unsplash.com/photo-1689794479919-97234c9be323?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvY2VhbiUyMG1hcmluZSUyMGxpZmUlMjB1bmRlcndhdGVyfGVufDF8fHx8MTc3MjA3MDQ1NXww&ixlib=rb-4.1.0&q=80&w=1080',
];

export const units: Unit[] = [
  {
    id: '1', code: '5154', title: 'ARCACIA Introduction',
    progress: 0, tier: 'none', xpEarned: 0, xpTotal: 150,
    image: 'https://images.unsplash.com/photo-1761318044223-a2dc78a104a0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1bml2ZXJzaXR5JTIwb3JpZW50YXRpb24lMjBjYW1wdXMlMjB3ZWxjb21lfGVufDF8fHx8MTc3MjExMzY0MXww&ixlib=rb-4.1.0&q=80&w=1080',
    assessments: [
      { id: 'a1', name: 'Orientation Quiz', status: 'not-started', xp: 150 },
    ]
  },
  {
    id: '2', code: '1177', title: 'Prerequisite (Use of animals in learning)',
    progress: 0, tier: 'none', xpEarned: 0, xpTotal: 150,
    image: 'https://images.unsplash.com/photo-1613905780946-26b73b6f6e11?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbmltYWwlMjBldGhpY3MlMjB3ZWxmYXJlJTIwbGVhcm5pbmclMjBlZHVjYXRpb258ZW58MXx8fHwxNzcyMTEzNjQyfDA&ixlib=rb-4.1.0&q=80&w=1080',
    assessments: [
      { id: 'a2', name: 'Quiz', status: 'not-started', xp: 150 },
    ]
  },
  {
    id: '3', code: 'ACMEXH301', title: 'Work within a zoological facility',
    progress: 0, tier: 'none', xpEarned: 0, xpTotal: 450,
    image: 'https://images.unsplash.com/photo-1762655339090-af69aebb2239?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx6b29sb2dpY2FsJTIwcGFyayUyMGFuaW1hbHMlMjB3YWxraW5nfGVufDF8fHx8MTc3MjExMTYzMHww&ixlib=rb-4.1.0&q=80&w=1080',
    assessments: [
      { id: 'a3', name: 'Quiz', status: 'not-started', xp: 150 },
      { id: 'a4', name: 'Skills Assessment', status: 'not-started', xp: 150 },
      { id: 'a5', name: 'Case Study', status: 'not-started', xp: 150 },
    ]
  },
  {
    id: '4', code: 'ACMWHS301', title: 'Contribute to workplace health and safety',
    progress: 0, tier: 'none', xpEarned: 0, xpTotal: 300,
    image: 'https://images.unsplash.com/photo-1768158988512-ad31657fe5b8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b3JrcGxhY2UlMjBzYWZldHklMjBoZWxtZXQlMjBpbmR1c3RyaWFsfGVufDF8fHx8MTc3MjExMTYyMXww&ixlib=rb-4.1.0&q=80&w=1080',
    assessments: [
      { id: 'a6', name: 'Knowledge Assessment', status: 'not-started', xp: 150 },
      { id: 'a7', name: 'Skills Assessment', status: 'not-started', xp: 150 },
    ]
  },
  {
    id: '5', code: 'ACMEXH303', title: 'Prepare and maintain animal habitats',
    progress: 0, tier: 'none', xpEarned: 0, xpTotal: 450,
    image: 'https://images.unsplash.com/photo-1761921015726-659355f11615?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbmltYWwlMjBoYWJpdGF0JTIwdGVycmFyaXVtJTIwZXhoaWJpdHxlbnwxfHx8fDE3NzIxMTE2MjF8MA&ixlib=rb-4.1.0&q=80&w=1080',
    assessments: [
      { id: 'a8', name: 'Knowledge Assessment (Part 2)', status: 'not-started', xp: 150 },
      { id: 'a9', name: 'Skills Assessment', status: 'not-started', xp: 150 },
      { id: 'a10', name: 'Project', status: 'not-started', xp: 150 },
    ]
  },
  {
    id: '6', code: 'ACMGEN315', title: 'Communicate effectively',
    progress: 0, tier: 'none', xpEarned: 0, xpTotal: 450,
    image: 'https://images.unsplash.com/photo-1623725202110-5246c24fde69?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWFtJTIwY29tbXVuaWNhdGlvbiUyMHdpbGRsaWZlfGVufDF8fHx8MTc3MjExMTYyMXww&ixlib=rb-4.1.0&q=80&w=1080',
    assessments: [
      { id: 'a11', name: 'Quiz', status: 'not-started', xp: 150 },
      { id: 'a12', name: 'Skills Assessment', status: 'not-started', xp: 150 },
      { id: 'a13', name: 'Case Study', status: 'not-started', xp: 150 },
    ]
  },
  {
    id: '7', code: 'ACMGEN312', title: 'Provide nutritional requirements',
    progress: 0, tier: 'none', xpEarned: 0, xpTotal: 450,
    image: 'https://images.unsplash.com/photo-1758144771516-6cc825116c99?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbmltYWwlMjBudXRyaXRpb24lMjBmZWVkaW5nJTIwem9vfGVufDF8fHx8MTc3MjExMTYyMnww&ixlib=rb-4.1.0&q=80&w=1080',
    assessments: [
      { id: 'a14', name: 'Quiz', status: 'not-started', xp: 150 },
      { id: 'a15', name: 'Skills Assessment', status: 'not-started', xp: 150 },
      { id: 'a16', name: 'Project', status: 'not-started', xp: 150 },
    ]
  },
  {
    id: '8', code: 'ACMGEN311', title: 'Maintain and monitor animal health',
    progress: 0, tier: 'none', xpEarned: 0, xpTotal: 450,
    image: 'https://images.unsplash.com/photo-1770836037793-95bdbf190f71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2ZXRlcmluYXJpYW4lMjBhbmltYWwlMjBoZWFsdGglMjBjaGVja3VwfGVufDF8fHx8MTc3MjExMTYyMnww&ixlib=rb-4.1.0&q=80&w=1080',
    assessments: [
      { id: 'a17', name: 'Knowledge Assessment (Part 2)', status: 'not-started', xp: 150 },
      { id: 'a18', name: 'Skills Assessment', status: 'not-started', xp: 150 },
      { id: 'a19', name: 'Case Study', status: 'not-started', xp: 150 },
    ]
  },
  {
    id: '9', code: 'ACMGEN301', title: 'Prepare and present information',
    progress: 0, tier: 'none', xpEarned: 0, xpTotal: 300,
    image: 'https://images.unsplash.com/photo-1635494517999-2cdbf3ac72c5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aWxkbGlmZSUyMHByZXNlbnRhdGlvbiUyMGVkdWNhdGlvbnxlbnwxfHx8fDE3NzIxMTE2MjN8MA&ixlib=rb-4.1.0&q=80&w=1080',
    assessments: [
      { id: 'a20', name: 'Project', status: 'not-started', xp: 150 },
      { id: 'a21', name: 'Skills Assessment', status: 'not-started', xp: 150 },
    ]
  },
  {
    id: '10', code: 'ACMGEN303', title: 'Assess animal welfare',
    progress: 0, tier: 'none', xpEarned: 0, xpTotal: 300,
    image: 'https://images.unsplash.com/photo-1771245906840-7371af0563d6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbmltYWwlMjB3ZWxmYXJlJTIwY2FyZSUyMGNvbXBhc3Npb258ZW58MXx8fHwxNzcyMTExNjIzfDA&ixlib=rb-4.1.0&q=80&w=1080',
    assessments: [
      { id: 'a22', name: 'Skills Assessment', status: 'not-started', xp: 150 },
      { id: 'a23', name: 'Project', status: 'not-started', xp: 150 },
    ]
  },
  {
    id: '11', code: 'ACMBEH302', title: 'Provide enrichment',
    progress: 0, tier: 'none', xpEarned: 0, xpTotal: 450,
    image: 'https://images.unsplash.com/photo-1664384640013-29d36b4bf4ec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbmltYWwlMjBlbnJpY2htZW50JTIwdG95cyUyMHpvb3xlbnwxfHx8fDE3NzIxMTE2MjR8MA&ixlib=rb-4.1.0&q=80&w=1080',
    assessments: [
      { id: 'a24', name: 'Knowledge Assessment (Part 2)', status: 'not-started', xp: 150 },
      { id: 'a25', name: 'Project', status: 'not-started', xp: 150 },
      { id: 'a26', name: 'Skills Assessment', status: 'not-started', xp: 150 },
    ]
  },
  {
    id: '12', code: 'ACMEXH304', title: 'Assist with capture/restraint',
    progress: 0, tier: 'none', xpEarned: 0, xpTotal: 450,
    image: 'https://images.unsplash.com/photo-1721742531857-22b6248c6668?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aWxkbGlmZSUyMGNhcHR1cmUlMjByZXN0cmFpbnQlMjBuZXR8ZW58MXx8fHwxNzcyMTExNjI0fDA&ixlib=rb-4.1.0&q=80&w=1080',
    assessments: [
      { id: 'a27', name: 'Knowledge Assessment (Part 2)', status: 'not-started', xp: 150 },
      { id: 'a28', name: 'Skills Assessment', status: 'not-started', xp: 150 },
      { id: 'a29', name: 'Project', status: 'not-started', xp: 150 },
    ]
  },
  {
    id: '13', code: 'ACMGEN304', title: 'Promote positive wellbeing',
    progress: 0, tier: 'none', xpEarned: 0, xpTotal: 300,
    image: 'https://images.unsplash.com/photo-1769470007894-394bdbe3f557?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZWVyJTIwcGVhY2VmdWwlMjBzYW5jdHVhcnklMjBuYXR1cmV8ZW58MXx8fHwxNzcyMTExNjMxfDA&ixlib=rb-4.1.0&q=80&w=1080',
    assessments: [
      { id: 'a30', name: 'Project', status: 'not-started', xp: 150 },
      { id: 'a31', name: 'Case Study', status: 'not-started', xp: 150 },
    ]
  },
  {
    id: '14', code: 'ACMSUS401', title: 'Sustainable work practices',
    progress: 0, tier: 'none', xpEarned: 0, xpTotal: 150,
    image: 'https://images.unsplash.com/photo-1687517133266-7d952efc3362?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdXN0YWluYWJsZSUyMGVudmlyb25tZW50JTIwbmF0dXJlJTIwZ3JlZW58ZW58MXx8fHwxNzcyMTExNjI1fDA&ixlib=rb-4.1.0&q=80&w=1080',
    assessments: [
      { id: 'a32', name: 'Project', status: 'not-started', xp: 150 },
    ]
  },
  {
    id: '15', code: 'ACMGEN309', title: 'Provide basic animal first aid',
    progress: 0, tier: 'none', xpEarned: 0, xpTotal: 300,
    image: 'https://images.unsplash.com/photo-1541887796712-054f4b0f8e5d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbmltYWwlMjBmaXJzdCUyMGFpZCUyMHZldGVyaW5hcnklMjBlbWVyZ2VuY3l8ZW58MXx8fHwxNzcyMTExNjI1fDA&ixlib=rb-4.1.0&q=80&w=1080',
    assessments: [
      { id: 'a33', name: 'Quiz', status: 'not-started', xp: 150 },
      { id: 'a34', name: 'Skills Assessment', status: 'not-started', xp: 150 },
    ]
  },
  {
    id: '16', code: 'ACMEXH309', title: 'Exhibit design and renovation',
    progress: 0, tier: 'none', xpEarned: 0, xpTotal: 300,
    image: 'https://images.unsplash.com/photo-1761627067772-e38ce139b074?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx6b28lMjBleGhpYml0JTIwZGVzaWduJTIwYXJjaGl0ZWN0dXJlfGVufDF8fHx8MTc3MjExMTYyNnww&ixlib=rb-4.1.0&q=80&w=1080',
    assessments: [
      { id: 'a35', name: 'Quiz', status: 'not-started', xp: 150 },
      { id: 'a36', name: 'Project', status: 'not-started', xp: 150 },
    ]
  },
  {
    id: '17', code: 'ACMEXH302', title: 'Species population planning',
    progress: 0, tier: 'none', xpEarned: 0, xpTotal: 300,
    image: 'https://images.unsplash.com/photo-1720663520883-aeb55b215bfb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbmRhbmdlcmVkJTIwc3BlY2llcyUyMGNvbnNlcnZhdGlvbiUyMHBvcHVsYXRpb258ZW58MXx8fHwxNzcyMTExNjI2fDA&ixlib=rb-4.1.0&q=80&w=1080',
    assessments: [
      { id: 'a37', name: 'Knowledge Assessment (Part 2)', status: 'not-started', xp: 150 },
      { id: 'a38', name: 'Project', status: 'not-started', xp: 150 },
    ]
  },
  {
    id: '18', code: 'ACMSPE314', title: 'General care of birds',
    progress: 0, tier: 'none', xpEarned: 0, xpTotal: 450,
    image: 'https://images.unsplash.com/photo-1674267845241-6255d65e4d6b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xvcmZ1bCUyMGJpcmRzJTIwYXZpYXJ5JTIwdHJvcGljYWx8ZW58MXx8fHwxNzcyMTExNjI2fDA&ixlib=rb-4.1.0&q=80&w=1080',
    assessments: [
      { id: 'a39', name: 'Quiz', status: 'not-started', xp: 150 },
      { id: 'a40', name: 'Skills Assessment', status: 'not-started', xp: 150 },
      { id: 'a41', name: 'Case Study', status: 'not-started', xp: 150 },
    ]
  },
];

export const badges: Badge[] = [];

export const logs: LogEntry[] = [];

export const statusConfig: Record<Status, { label: string; color: string; bg: string }> = {
  'not-started': { label: 'Not Started', color: 'text-text-tertiary', bg: 'bg-[#1a1a2e]' },
  'draft': { label: 'Draft', color: 'text-warning', bg: 'bg-warning/10' },
  'submitted': { label: 'Submitted', color: 'text-brand-primary', bg: 'bg-brand-primary/10' },
  'returned': { label: 'Returned', color: 'text-danger', bg: 'bg-danger/10' },
  'competent': { label: 'Competent', color: 'text-success', bg: 'bg-success/10' },
  'not-yet-competent': { label: 'Not Yet Competent', color: 'text-warning', bg: 'bg-warning/10' },
};

export const tierConfig: Record<Tier, { label: string; color: string; bg: string; border: string }> = {
  'none': { label: 'No Tier', color: 'text-text-tertiary', bg: 'bg-[#1a1a2e]', border: 'border-transparent' },
  'bronze': { label: 'Bronze', color: 'text-amber-600', bg: 'bg-amber-900/20', border: 'border-amber-700/30' },
  'silver': { label: 'Silver', color: 'text-slate-300', bg: 'bg-slate-500/20', border: 'border-slate-400/30' },
  'gold': { label: 'Gold', color: 'text-yellow-400', bg: 'bg-yellow-500/20', border: 'border-yellow-500/30' },
};
