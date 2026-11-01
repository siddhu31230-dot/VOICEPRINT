import { CampaignProposal, GrowthAudience, GrowthChallenge, GrowthObjective } from '../types';
import { FLAGSHIP_CAMPAIGNS } from '../data/portfolioData';

export function generateCampaignProposal(
  audience: GrowthAudience,
  challenge: GrowthChallenge,
  objective: GrowthObjective
): CampaignProposal {
  // Check if matches flagship campaigns
  if (audience.id === 'students') {
    return FLAGSHIP_CAMPAIGNS[0];
  }
  if (audience.id === 'founders') {
    return FLAGSHIP_CAMPAIGNS[1];
  }
  if (audience.id === 'creators') {
    return FLAGSHIP_CAMPAIGNS[2];
  }

  // Otherwise, synthesize a tailored proposal
  const headline = `THE UNFILTERED FLOW: SPEECH OVER FRICTION.`;

  return {
    id: `custom-${audience.id}-${challenge.id}-${objective.id}`,
    title: `${audience.name} Growth Sprint: Tackling ${challenge.name}`,
    creativeHeadline: headline,
    targetAudience: audience.name,
    challengeAddressed: challenge.name,
    primaryObjective: objective.name,
    isFlagship: false,
    problemAnalysis: `For ${audience.name.toLowerCase()} (${audience.role}), the biggest barrier under "${challenge.name}" is ${audience.painPoint.toLowerCase()} When trying to solve this, traditional typing introduces a cognitive tax that drains energy before the idea is fully expressed.`,
    audienceInsight: `${audience.name} don't care about generic AI buzzwords. Their core emotional desire is: "${audience.coreDesire}" If Wispr Flow proves it can save them 90 minutes each week without errors, adoption becomes automatic.`,
    campaignConcept: `An organic proof-of-work sprint showing ${audience.name.toLowerCase()} how to bypass keyboard latency and capture raw thoughts directly into clean outputs without second-guessing.`,
    distributionChannels: [
      `Targeted communities where ${audience.name.toLowerCase()} actively share tools (Subreddits, Discord groups, and LinkedIn cohorts)`,
      `Direct interactive micro-demonstrations comparing typing speed with Wispr Flow voice velocity`,
      `Peer referral loops with team license incentives for workgroups and cohorts`,
    ],
    contentIdeas: [
      `Interactive breakdown: "What 500 spoken words look like before and after Wispr Flow structuring"`,
      `Day-in-the-life walkthrough: How a professional uses voice dictation to clear their 5 PM inbox in 8 minutes`,
      `Comparison chart: Native OS dictation vs Wispr Flow context-aware transcription accuracy`,
    ],
    executionTimeline: [
      { week: 'Sprint W1', action: `Map out high-density hubs for ${audience.name.toLowerCase()} and recruit 20 initial beta advocates.` },
      { week: 'Sprint W2', action: `Deploy targeted video walkthroughs addressing "${challenge.name}" head-on with live screen recordings.` },
      { week: 'Sprint W3', action: `Launch the "${objective.name}" incentive program with community bounties and peer invites.` },
      { week: 'Sprint W4', action: `Analyze week-4 cohort retention and calibrate voice prompt presets based on user telemetry.` },
    ],
    successMetricsHypotheses: [
      {
        metric: 'Cohort Trial Activation',
        expectedLift: '+38%',
        rationale: `Directly targeted messaging addressing ${audience.painPoint.toLowerCase()}`,
      },
      {
        metric: 'Weekly Spoken Volume',
        expectedLift: '2,400+ words/user',
        rationale: `Users transition daily updates and stream-of-consciousness notes from keyboard to voice`,
      },
      {
        metric: 'Product NPS / Share Rate',
        expectedLift: '+18 points',
        rationale: `Word-of-mouth recommendations triggered by tangible time saved each day`,
      },
    ],
    potentialRisks: [
      `Friction during initial OS permissions setup (microphone access, global hotkeys).`,
      `Overcoming user hesitation to speak out loud in shared co-working spaces or quiet offices.`,
    ],
    learningAndIteration: `Validate whether ${audience.name.toLowerCase()} prefer structured markdown output or raw natural phrasing. If retention falters at day 7, introduce contextual quick-action templates tailored to their daily software stack.`,
  };
}
