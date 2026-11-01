export interface ProjectCaseStudy {
  id: string;
  title: string;
  tagline: string;
  category: string;
  status: 'Prototype' | 'Active Exploration' | 'Research & Design' | 'Completed Concept';
  date: string;
  summary: string;
  problem: string;
  businessIdea: string;
  customerExperience: string;
  architectureOrTechnicalApproach: string;
  multiOrderingOrCoreFeature?: string;
  revenueModelOrSecurity?: string;
  keyChallenges: string[];
  whatWorked: string[];
  whatFailed: string[];
  whatILearned: string;
  techStack: string[];
  demoHighlights: { label: string; value: string }[];
  interactivePreviewType: 'goduet' | 'wellness' | 'floorplan3d';
}

export interface VoiceWorkflowStage {
  rawThought: string;
  voiceCaptureTranscript: string;
  structuredPrompt: string;
  workingResult: {
    type: 'component' | 'bugfix' | 'prd' | 'campaign' | 'doc';
    title: string;
    description: string;
    codeOrMarkdown: string;
    previewMeta?: Record<string, any>;
  };
}

export interface VoiceLabWorkflow {
  id: string;
  title: string;
  category: string;
  durationEstimate: string;
  timeSaved: string;
  stages: VoiceWorkflowStage;
}

export interface GrowthAudience {
  id: string;
  name: string;
  role: string;
  painPoint: string;
  coreDesire: string;
}

export interface GrowthChallenge {
  id: string;
  name: string;
  context: string;
}

export interface GrowthObjective {
  id: string;
  name: string;
  kpiTarget: string;
}

export interface CampaignProposal {
  id: string;
  title: string;
  creativeHeadline: string;
  targetAudience: string;
  challengeAddressed: string;
  primaryObjective: string;
  problemAnalysis: string;
  audienceInsight: string;
  campaignConcept: string;
  distributionChannels: string[];
  contentIdeas: string[];
  executionTimeline: { week: string; action: string }[];
  successMetricsHypotheses: { metric: string; expectedLift: string; rationale: string }[];
  potentialRisks: string[];
  learningAndIteration: string;
  isFlagship?: boolean;
}

export interface RecruiterQAItem {
  id: string;
  category: 'Projects' | 'Technical' | 'Failures' | 'Product Mindset' | 'Growth' | 'Wispr Flow' | 'Learning';
  question: string;
  shortAnswer: string;
  detailedAnswer: string;
  keyTakeaway: string;
  relatedTags: string[];
}

export interface ProductivityItem {
  id: string;
  category: 'Workstation' | 'Monitor' | 'Audio Equipment' | 'Ergonomics' | 'Productivity Tools';
  name: string;
  spec: string;
  estimatedPriceUSD: number;
  isCustomPrice?: boolean;
  productivityBenefit: string;
  urgency: 'Crucial' | 'High Impact' | 'Workflow Enabler';
  selected: boolean;
}

export interface TimelineEvent {
  year: string;
  period: string;
  title: string;
  category: 'Foundation' | 'Builder Experiment' | 'Product Exploration' | 'Current Focus';
  description: string;
  learning: string;
  isPlaceholder?: boolean;
}

export interface SocialLinks {
  linkedin: string;
  github: string;
  twitter?: string;
  instagram: string;
  email: string;
  portfolio: string;
}
