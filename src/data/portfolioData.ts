import {
  ProjectCaseStudy,
  VoiceLabWorkflow,
  GrowthAudience,
  GrowthChallenge,
  GrowthObjective,
  CampaignProposal,
  RecruiterQAItem,
  ProductivityItem,
  TimelineEvent,
  SocialLinks
} from '../types';

export const PERSONAL_INFO = {
  name: 'Siddharth Singh',
  role: 'Student, Builder & Product Explorer',
  tagline: 'The Human Behind the Build.',
  heroLabel: 'INDEPENDENT THINKER. CONSTANT BUILDER.',
  heroHeadline: "I DON'T JUST HAVE IDEAS.\nI TURN THEM INTO THINGS.",
  heroDescription:
    "I'm Siddharth Singh. A student, entrepreneur and builder exploring how technology, creativity and ambitious ideas can solve real problems.",
  centralMessage: "I DON'T JUST HAVE IDEAS. I TURN THEM INTO THINGS.",
  supportingMessage:
    'Every idea has a story. Every experiment teaches something. Every failure creates a better version.',
  closingStatement: 'THE BEST VERSION IS ALWAYS UNDER CONSTRUCTION.',
  hiringChallengeContext: 'Built for the Wispr Flow India Hiring Challenge',
};

export const INITIAL_SOCIAL_LINKS: SocialLinks = {
  linkedin: 'https://linkedin.com/in/[your-profile-here]',
  github: 'https://github.com/[your-handle-here]',
  instagram: 'https://instagram.com/[your-handle-here]',
  email: 'siddharth.[placeholder]@domain.com',
  portfolio: 'https://voiceprint-siddharth.vercel.app',
};

export const ORIGIN_SECTIONS = [
  {
    id: 'where-i-started',
    title: 'Where I Started',
    badge: 'Roots',
    summary: 'Curiosity before code. The itch to understand how things work behind the screen.',
    content: `I didn't start with polished frameworks or grand startup theories. I started with a genuine itch to tinker. 
Whenever I encountered a friction point in daily life—whether it was ordering food with hostel mates, feeling the isolation of college living, or watching architects struggle to convey 3D spatial scale to non-designers—my reflex was never "someone should fix this." My reflex was: "What would it look like if I built a prototype this weekend?"

[Note: Education details are kept in an honest, editable placeholder format: Current Student / Self-directed builder exploring computer science, product design, and software architecture.]`,
  },
  {
    id: 'what-makes-me-curious',
    title: 'What Makes Me Curious',
    badge: 'Cognition',
    summary: 'The intersection of human friction, interface velocity, and autonomous tooling.',
    content: `I am deeply curious about cognitive load and human friction. Why do we still type out 500-word PRDs when spoken natural language can be distilled in 45 seconds? Why are interfaces still built for keyboard and mouse bottlenecks when voice and ambient intelligence can bridge intent directly to execution?
When I watch how everyday people interact with software, I look for the hesitation gaps—the moments where a user pauses because the tool demands unnatural rigidity. That gap is where the best products are born.`,
  },
  {
    id: 'why-i-enjoy-building',
    title: 'Why I Enjoy Building Products',
    badge: 'Builder DNA',
    summary: 'Building is the ultimate feedback loop. Code does not lie; users do not pretend.',
    content: `An idea trapped in your head is a comfortable illusion. It feels flawless until you compile it, deploy it, and hand it to a stressed user. 
Building forces honesty. When a multi-restaurant basket synchronization fails on poor hostel Wi-Fi, you don't get to defend your architecture; you rewrite the state machine. The sheer dopamine of going from a scribble in a notebook to a live URL that solves someone's immediate headache is unmatched.`,
  },
  {
    id: 'what-i-believe',
    title: 'What I Believe About Technology',
    badge: 'Convictions',
    summary: 'Tools should amplify human bandwidth, not trap human attention in dopamine loops.',
    content: `1. Speed of iteration beats perfectionism every single time.
2. Voice is not a gimmick or an accessibility afterthought—it is the highest-bandwidth modality human beings have evolved for externalizing thought.
3. Privacy is not a compliance checkbox; it is a fundamental dignity requirement, especially in high-stress environments like student housing.
4. Generative AI is only as powerful as the ergonomic harness around it. Wispr Flow matters because it removes the friction between organic neurochemistry and digital execution.`,
  },
  {
    id: 'what-i-am-learning',
    title: 'What I Am Learning',
    badge: 'Current Stack',
    summary: 'High-performance React architectures, Web Audio API, voice UX, and go-to-market mechanics.',
    content: `Right now, my active study and experiment hours are split between:
• Real-time audio pipelines: Web Audio API, streaming WebSocket protocols, and low-latency client-side audio processing.
• Robust state orchestration: Local-first offline sync, optimistic UI mutations, and resilient network fallbacks.
• Growth & Distribution: How to build organic referral loops that people actually share without paying for artificial engagement.`,
  },
  {
    id: 'what-i-want-to-accomplish',
    title: 'What I Want to Accomplish',
    badge: 'Mission',
    summary: 'Ship products that eliminate cognitive drudgery and empower independent thinkers.',
    content: `I want to join a team of obsessive builders where high-speed execution is the default culture. At Wispr Flow, my ambition is to help pioneer the next generation of voice-first workflows—proving that dictation isn't just transcription, but an intelligent cognitive co-processor that makes builders 10x faster.`,
  },
];

export const TIMELINE_EVENTS: TimelineEvent[] = [
  {
    year: 'Phase 01',
    period: 'Foundational Curiosity',
    title: 'From Consumer to Tinkerer',
    category: 'Foundation',
    description: 'Started dissecting web applications and mobile apps. Replaced passive digital consumption with inspecting DOM structures and building mini CLI tools.',
    learning: 'Discovered that any complex system is just a tree of simple decisions.',
    isPlaceholder: true,
  },
  {
    year: 'Phase 02',
    period: 'Startup Experiment',
    title: 'GoDuet — Multi-Restaurant Ordering Concept',
    category: 'Builder Experiment',
    description: 'Conceived and prototyped a unified ordering pipeline allowing hostel groups to order across multiple restaurant menus in a single combined checkout.',
    learning: 'Learned the brutal reality of food tech logistics, unit economics, and distributed cart state management.',
  },
  {
    year: 'Phase 03',
    period: 'Empathy-Driven Project',
    title: 'Private Wellness Check-in for Students',
    category: 'Product Exploration',
    description: 'Designed a privacy-conscious, client-encrypted wellness tracking tool tailored to hostel living where mental health stigma prevents students from seeking help.',
    learning: 'Zero-knowledge architectures build emotional trust faster than any marketing copy.',
  },
  {
    year: 'Phase 04',
    period: 'Spatial Visualization',
    title: 'Floor Plan to 3D Viewer Prototype',
    category: 'Builder Experiment',
    description: 'Experimented with parsing 2D architectural vectors and extruding them into an interactive 3D web environment using Three.js / Canvas.',
    learning: 'Transforming legacy static representations into interactive spatial experiences changes client comprehension completely.',
  },
  {
    year: 'Phase 05',
    period: 'Present Day',
    title: 'Wispr Flow India Hiring Challenge & Voiceprint',
    category: 'Current Focus',
    description: 'Architecting VOICEPRINT: demonstrating voice-first velocity, growth simulation, and authentic engineering execution.',
    learning: 'Voice is the missing link between organic ideation and rapid digital construction.',
  },
];

export const PROJECTS: ProjectCaseStudy[] = [
  {
    id: 'goduet',
    title: 'GoDuet',
    tagline: 'Multi-restaurant food delivery experience for shared group cravings.',
    category: 'Food Tech & Marketplace Architecture',
    status: 'Active Exploration',
    date: 'Concept & Prototype',
    summary:
      'A prototype food ordering platform that solves the perennial roommate conflict: one person wants momos, another wants burgers, but no platform allows a single checkout without paying double delivery fees and waiting on separate couriers.',
    problem:
      'In hostel clusters and co-living apartments, meal ordering is inherently collective. However, existing aggregators (Zomato, Swiggy) force users to pick a single restaurant or place disjointed separate orders with doubled delivery charges, minimum order hurdles, and unsynchronized delivery arrivals.',
    businessIdea:
      'GoDuet clusters partner restaurants situated within a 600m radius of a micro-hub or common commercial strip. A unified courier collects both orders simultaneously, dropping them off as a single combined batch. Users split the delivery fee, lowering cost per diner while lifting average order value (AOV) for restaurants.',
    customerExperience:
      'A dual-pane browsing UI where users can toggle "Add from Restaurant B" into the same active session basket. Real-time split-bill calculation, synchronized preparation countdowns, and a combined delivery tracking pin.',
    architectureOrTechnicalApproach:
      'Engineered an optimistic client cart engine with distributed state reconciliation. Handled edge cases such as Restaurant A accepting while Restaurant B rejects or runs out of an ingredient, triggering automated alternatives or single-item fallback.',
    multiOrderingOrCoreFeature:
      'Unified Cart State Machine with atomic rollback: either both restaurants confirm preparation within 90 seconds, or the user is provided instant one-tap substitutes without breaking the basket.',
    revenueModelOrSecurity:
      'Commission sharing across multi-vendor baskets: 14% blended commission per vendor + tiered micro-delivery fee that stays 25% lower than two separate deliveries.',
    keyChallenges: [
      'Synchronizing kitchen prep times so Restaurant A (fast food) doesn’t sit cold waiting for Restaurant B (slow tandoor).',
      'Cart state complexity: handling localized inventory locks across disparate menus.',
      'Unit economics: high sensitivity to driver routing delays if restaurants are even 400m apart.',
    ],
    whatWorked: [
      'Interactive Figma prototypes and user testing with hostel mates showed 88% preference over separate Swiggy orders.',
      'Multi-basket state machine cleanly resolved cart items with distinctive kitchen status badges.',
      'Simulated split-billing calculations eliminated manual UPI calculations among roommates.',
    ],
    whatFailed: [
      'Early delivery time estimations failed during simulated peak hours due to kitchen prep variance.',
      'Restaurants were initially reluctant to share delivery bundles without dedicated logistics guarantees.',
      'Technical hurdle: handling cart abandonment when one item in a multi-restaurant basket went out of stock.',
    ],
    whatILearned:
      'Product desirability is only 20% of the battle; operations and unit economics govern marketplace survival. I learned to design fallback systems for partial failures instead of assuming happy paths.',
    techStack: ['React', 'TypeScript', 'Tailwind CSS', 'State Machine (XState pattern)', 'Node.js prototype API', 'Geolocation APIs'],
    demoHighlights: [
      { label: 'Basket Capability', value: 'Multi-Restaurant Dual Basket' },
      { label: 'Stage', value: 'Functional Frontend & Flow Prototype' },
      { label: 'Simulated Delivery Cost', value: '-35% vs Disjoint Orders' },
    ],
    interactivePreviewType: 'goduet',
  },
  {
    id: 'wellness-checkin',
    title: 'Private Wellness Check-in',
    tagline: 'Zero-knowledge daily mental check-in for high-stress hostel environments.',
    category: 'Privacy Tech & Mental Health UX',
    status: 'Research & Design',
    date: 'UX & Security Exploration',
    summary:
      'A privacy-first mental health pulse tool built specifically for hostel students who fear social stigma and administrative surveillance, providing anonymous emotional trends and safe escalation pathways.',
    problem:
      'College hostel living is intensely communal. When students experience burnout, anxiety, or depression, they routinely avoid university counselling centers or public check-in apps because of deep fear of gossip, roommate judgment, or academic dean notification.',
    businessIdea:
      'A non-judgmental, frictionless 30-second daily check-in that never requires a name or student ID. Data is encrypted on the client device using local keys. Aggregated anonymized health trends can be monitored by student welfare bodies to spot batch-wide burnout before exam periods without identifying individuals.',
    customerExperience:
      'Micro-interactions designed around emotional states rather than clinical questionnaires. Uses haptic-like visual sliders, ambient color shifts based on mood valence, and a zero-friction "Emergency Professional Pathway" that connects to verified helplines via ephemeral proxy.',
    architectureOrTechnicalApproach:
      'Client-side zero-knowledge architecture. Wellness logs are encrypted using Web Crypto API before local storage persistence. No raw mood text or timestamps ever touch central analytics tables in plain text.',
    multiOrderingOrCoreFeature:
      'Mood Pattern Radar: Visualizes a 14-day rolling mood cadence, detecting downward spiral indicators (e.g., 4 consecutive days of high anxiety + sleep disruption) and offering gentle, non-intrusive self-care interventions.',
    revenueModelOrSecurity:
      'Client-side AES-GCM 256 encryption. Key derived from a user-selected private PIN that is never transmitted. Institutional subscription model for anonymized campus stress heatmap.',
    keyChallenges: [
      'Balancing zero-knowledge anonymity with a safe duty-of-care escalation pathway for crisis scenarios.',
      'Preventing the product from feeling like an intimidating clinical survey.',
      'Ensuring offline resilience in low-connectivity hostel basements.',
    ],
    whatWorked: [
      'The 30-second visual mood slider achieved 94% completion in simulated user walkthroughs.',
      'Local-first encryption reassured privacy-sensitive student testers who previously refused counselling apps.',
      'Clear, empathetic UX copy reduced cognitive friction to near-zero.',
    ],
    whatFailed: [
      'Initial designs had too many granular psychological questions, causing drop-off after day 3.',
      'Early cryptographic recovery concept was too complicated for non-technical students.',
      'Distinguishing between normal academic stress and acute crisis without reading plaintext entries.',
    ],
    whatILearned:
      'Empathy must be baked into the security architecture, not just the visual design. When users trust that you cannot read their data, their honesty skyrockets.',
    techStack: ['React', 'TypeScript', 'Web Crypto API', 'IndexedDB / LocalStorage', 'Framer Motion', 'Tailwind CSS'],
    demoHighlights: [
      { label: 'Security Model', value: 'Zero-Knowledge Client Encrypted' },
      { label: 'Interaction Time', value: '< 30 Seconds / Day' },
      { label: 'Status', value: 'Prototype & UI Architecture' },
    ],
    interactivePreviewType: 'wellness',
  },
  {
    id: 'floorplan-3d',
    title: 'Floor Plan to 3D Viewer',
    tagline: 'Bridging the spatial gap: transforming 2D architectural blueprints into interactive 3D spaces.',
    category: 'Spatial Web & Creative Tech',
    status: 'Prototype',
    date: 'Technical Experiment',
    summary:
      'A web-based proof-of-concept that takes 2D floor plan schemas and extrudes them into an interactive 3D spatial model in real-time, allowing clients and non-architects to explore room scale and light before construction.',
    problem:
      '90% of home buyers and renovation clients cannot intuitively read flat 2D blueprint lines, wall symbols, and door swing markings. Professional 3D architectural rendering software (Revit, 3ds Max) is expensive, slow, and requires hours of manual modeling per revision.',
    businessIdea:
      'A lightweight browser-based tool that accepts simplified SVG/DXF or structured room coordinates, dynamically extruding walls, placing windows/doors, and rendering an interactive first-person or orbital 3D walkthrough with zero plugin installations.',
    customerExperience:
      'Upload or select a floor plan layout → instant 3D extrusion → toggle lighting (morning sunlight, golden hour, evening artificial) → inspect room dimensions and walk through rooms with mouse/touch drag.',
    architectureOrTechnicalApproach:
      'Constructed a 2D-to-3D polygon extrusion pipeline using HTML5 Canvas and Three.js geometry meshes. Wall coordinates are parsed as 2D paths, extruded along the Y-axis with material shaders, and lit via directional sunlight and ambient occlusion.',
    multiOrderingOrCoreFeature:
      'Real-time parametric wall modifier: drag a 2D wall boundary in split view, and watch the 3D spatial mesh update its polygon vertices immediately.',
    revenueModelOrSecurity:
      'Freemium tier for individual home owners; pro subscription for interior designers and real estate brokers for client presentations.',
    keyChallenges: [
      'Handling complex wall intersections and T-junction polygon clipping without rendering artifacts.',
      'Maintaining 60 FPS performance on mid-range laptops and mobile devices without heavy GPU strain.',
      'Translating non-standard user-uploaded lines into clean closed geometric contours.',
    ],
    whatWorked: [
      'Three.js scene graph with custom materials delivered smooth orbital controls and immediate spatial comprehension.',
      'Split-screen 2D editor to 3D live viewport provided an intuitive "magic" moment for testers.',
      'Clean polygon extrusion for rectangular and multi-segment room layouts.',
    ],
    whatFailed: [
      'Automatic parsing of messy raster PDF blueprints failed without manual vector tracing.',
      'Curved walls and custom angled arches caused vertex normal distortions in early builds.',
      'File size of textures slowed down initial load times before implementing procedural materials.',
    ],
    whatILearned:
      'Spatial UX is about confidence. When users can freely rotate and inspect an environment, their anxiety about costly physical renovations drops drastically.',
    techStack: ['Three.js', 'React Three Fiber (concept)', 'HTML5 Canvas', 'TypeScript', 'Tailwind CSS', 'Vite'],
    demoHighlights: [
      { label: 'Rendering Engine', value: 'Three.js / WebGL' },
      { label: 'Viewport Latency', value: '60 FPS Smooth Orbit' },
      { label: 'Core Mechanism', value: '2D Vector Path Extrusion' },
    ],
    interactivePreviewType: 'floorplan3d',
  },
];

export const VOICE_LAB_WORKFLOWS: VoiceLabWorkflow[] = [
  {
    id: 'react-component',
    title: 'Creating a Dynamic React Component',
    category: 'Frontend Engineering',
    durationEstimate: '42 seconds spoken',
    timeSaved: '~25 minutes of manual scaffolding',
    stages: {
      rawThought:
        '"Hey... so I need an audio waveform component for the hero section of my portfolio. It should have dynamic bars that oscillate subtly when idle, but when the user hovers or speaks, the amplitudes should flare up like a live frequency analyzer. Deep charcoal background, acid lime green bars, and a clean toggle button for play/pause with nice spring physics."',
      voiceCaptureTranscript:
        'Wispr Flow captured: "Build a responsive audio waveform component for hero section. Idle state: subtle organic oscillation. Interactive state: dynamic amplitude surge on mouse hover or audio input. Palette: #08080A charcoal background with #D4FF00 acid lime bars. Include play/pause toggle with spring animation and current decibel feedback."',
      structuredPrompt:
        `Task: Implement React + Tailwind + Framer Motion WaveformVisualizer
Requirements:
1. Render 32 vertical bars with height interpolation using requestAnimationFrame or Framer Motion.
2. Idle mode: sine-wave oscillation with randomized micro-jitter.
3. Active mode: amplify scale based on pointer X/Y proximity or simulated decibel volume.
4. Color: Acid Lime (#D4FF00) with subtle glow filter drop-shadow.
5. Provide a tactile play/mute toggle with accessible aria labels and state badges.`,
      workingResult: {
        type: 'component',
        title: 'WaveformVisualizer.tsx',
        description: 'Interactive audio visualizer with reactive frequency bars and stateful controls.',
        codeOrMarkdown: `import React, { useState, useEffect } from 'react';
import { Play, Pause, Activity } from 'lucide-react';

export const InteractiveWaveformDemo: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [activeBar, setActiveBar] = useState<number | null>(null);
  
  return (
    <div className="p-6 bg-[#0B0B0E] border border-border-subtle rounded-xl font-mono">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-xs text-acid">
          <Activity className="w-4 h-4 animate-pulse" />
          <span>LIVE FREQUENCY ANALYZER (SIMULATED)</span>
        </div>
        <button 
          onClick={() => setIsPlaying(!isPlaying)}
          className="px-3 py-1 text-xs rounded bg-acid text-black font-semibold hover:bg-acid-hover transition"
        >
          {isPlaying ? 'PAUSE STREAM' : 'RESUME STREAM'}
        </button>
      </div>
      <div className="h-24 flex items-end justify-between gap-1 px-2 py-4 bg-black/40 rounded-lg">
        {Array.from({ length: 24 }).map((_, i) => (
          <div
            key={i}
            onMouseEnter={() => setActiveBar(i)}
            onMouseLeave={() => setActiveBar(null)}
            className="w-full bg-[#D4FF00] rounded-t transition-all duration-150"
            style={{
              height: isPlaying 
                ? activeBar === i ? '95%' : \`\${20 + Math.sin(i * 0.4 + Date.now() * 0.003) * 35 + 30}%\`
                : '12%',
              opacity: activeBar === i ? 1 : 0.75,
              boxShadow: activeBar === i ? '0 0 12px #D4FF00' : 'none'
            }}
          />
        ))}
      </div>
    </div>
  );
};`,
      },
    },
  },
  {
    id: 'bug-fix',
    title: 'Explaining & Root-Causing a Race Condition',
    category: 'Debugging & Architecture',
    durationEstimate: '35 seconds spoken',
    timeSaved: '~15 minutes drafting issue ticket',
    stages: {
      rawThought:
        '"Look, in GoDuet when a user rapidly toggles between the burger place and the momo place while their internet is patchy, the cart total flickers and sometimes retains items from a restaurant that was deselected. It’s definitely a race condition between the async menu fetch and the local optimistic reducer."',
      voiceCaptureTranscript:
        'Wispr Flow captured: "Bug report for GoDuet multi-restaurant cart. Rapid switching between vendor tabs under 3G throttling causes cart total flickering and orphaned line items. Root cause: out-of-order resolution of async vendor inventory queries racing against optimistic local cart reducer dispatch."',
      structuredPrompt:
        `Issue: Race condition in multi-vendor cart reconciliation
Severity: High (Data integrity & billing discrepancy)
Reproduction Steps:
1. Throttle network to 'Fast 3G' in DevTools.
2. Select Item A from Vendor 1.
3. Switch tab to Vendor 2 and immediately select Item B, then deselect Item A.
Expected: Cart contains only Item B from Vendor 2.
Actual: Item A reappears when stale promise resolves.
Fix Strategy:
- Implement AbortController on in-flight inventory fetches.
- Introduce transaction sequence ID (seq_id) in cart action payloads.
- Reject stale state transitions where payload.seq_id < current_seq_id.`,
      workingResult: {
        type: 'bugfix',
        title: 'CartStateReconciler.patch.ts',
        description: 'Sequence-locked transaction reducer preventing stale async cart updates.',
        codeOrMarkdown: `// Cart Reconciliation with Sequence Guard
interface CartAction {
  type: 'SYNC_INVENTORY_SUCCESS';
  vendorId: string;
  seqId: number;
  items: CartItem[];
}

export function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'SYNC_INVENTORY_SUCCESS':
      // Drop stale async promises that resolved out of order
      if (action.seqId < state.lastCommittedSeqId) {
        console.warn(\`[GoDuet Cart] Dropped stale response seq:\${action.seqId} (current:\${state.lastCommittedSeqId})\`);
        return state;
      }
      return {
        ...state,
        lastCommittedSeqId: action.seqId,
        items: reconcileItems(state.items, action.items),
        total: calculateCombinedTotal(action.items),
      };
    default:
      return state;
  }
}`,
      },
    },
  },
  {
    id: 'prd-writing',
    title: 'Writing Product Requirements (PRD)',
    category: 'Product Strategy & UX',
    durationEstimate: '58 seconds spoken',
    timeSaved: '~45 minutes typing documentation',
    stages: {
      rawThought:
        '"For the student wellness check-in, the most critical thing is nobody should ever feel watched. Let’s specify a 14-day rolling mood cadence. The student can record daily energy, sleep quality, and academic stress level using simple 1 to 5 visual gauges. If the system spots four consecutive red flags, it shouldn’t notify the college—it should quietly unlock an anonymous chat link to a verified student helpline."',
      voiceCaptureTranscript:
        'Wispr Flow captured: "PRD Spec: Private Wellness Check-in. Core feature: 14-Day Rolling Mood Cadence. Metrics: Daily Energy (1-5), Sleep Quality (1-5), Academic Stress (1-5). Anonymity requirement: Zero-knowledge client encryption. Escalation protocol: If stress exceeds threshold for 4 consecutive days, trigger non-intrusive self-escalation modal offering anonymous verified helpline connection without notifying college administration."',
      structuredPrompt:
        `Product Requirement Document (PRD): Anonymous Student Pulse & Crisis Escalation
1. Objective: Provide a safe, zero-judgment wellness telemetry tool for hostel students.
2. User Stories:
   - As a student, I want to log my emotional state in under 20 seconds so that I can track my mental burnout.
   - As a student, I want complete cryptographic assurance that my college warden/dean cannot view my logs.
3. System Requirements:
   - Local key derivation (PBKDF2/AES-GCM).
   - Pattern Detection Rule: 4+ days where (Stress >= 4 AND Sleep <= 2).
   - Crisis Pathway: Display empathetic card with single-tap anonymous web call.
4. Non-Goals:
   - No central database of student IDs.
   - No compulsory reporting to academic staff.`,
      workingResult: {
        type: 'prd',
        title: 'PRD-WELLNESS-004.md',
        description: 'Zero-knowledge student pulse & crisis escalation protocol specification.',
        codeOrMarkdown: `### Feature Spec: Client-Encrypted Wellness Telemetry
**Status:** Approved for Prototype
**Target Release:** Student Pilot v0.3
**Author:** Siddharth Singh

#### 1. Success Metrics
- Daily Check-in Completion Rate > 85%
- Average Session Duration < 25 seconds
- 0 plaintext logs stored in server infrastructure

#### 2. Escalation Logic (Pseudocode)
\`\`\`ts
if (rollingDays.slice(-4).every(d => d.stress >= 4 && d.sleep <= 2)) {
  renderCrisisEscalationCard({
    title: "Heavy week? You don't have to carry it alone.",
    actions: [
      { label: "Talk Anonymously (Toll Free)", type: "PROXY_CALL" },
      { label: "View Breathing Exercise", type: "MODAL" },
      { label: "Dismiss", type: "DISMISS_72H" }
    ]
  });
}
\`\`\``,
      },
    },
  },
  {
    id: 'growth-campaign',
    title: 'Planning a Growth Marketing Campaign',
    category: 'Growth & Distribution',
    durationEstimate: '45 seconds spoken',
    timeSaved: '~30 minutes drafting pitch deck',
    stages: {
      rawThought:
        '"Let’s design a hyper-focused college hackathon campaign for Wispr Flow called \'Your Brain Has No Backspace\'. Students lose so much time fighting writer’s block when drafting project docs and commit messages during 24-hour hackathons. We give them Wispr Flow, run a live 60-second speed-dictation challenge at the booth, and give custom mechanical keycaps to whoever speaks the cleanest technical prompt."',
      voiceCaptureTranscript:
        'Wispr Flow captured: "Campus growth campaign proposal: \'Your Brain Has No Backspace\'. Target: Student developers and hackathon participants. Insight: Keyboard latency and backspace paralysis throttle ideas during high-pressure builds. Mechanism: Live 60-second voice-to-PRD speed challenge at hackathons with custom hardware keycap rewards and immediate trial downloads."',
      structuredPrompt:
        `Campaign Blueprint: "YOUR BRAIN HAS NO BACKSPACE"
Target: Indian Collegiate Tech Communities & Hackathon Builders
Core Value Prop: Stream thoughts into code, PRDs, and documentation at 3x typing speed.
Execution Channels:
1. Hackathon "Voice Speedrun" Booth: 60-second challenge to dictate a full React component spec.
2. Campus Ambassador Bounty: Top 5 campus organizers receive Wispr Flow Pro annual licenses for team onboarding.
3. Micro-meme distribution: "Typed vs Wispr Flow" side-by-side video reels comparing typing frustration with effortless spoken prompting.
Success KPIs:
- 1,200 verified student installs per hackathon partnership.
- 40% Week-2 retention rate for daily voice dictation.`,
      workingResult: {
        type: 'campaign',
        title: 'Campaign-Blueprint-Backspace.json',
        description: 'Structured hackathon acquisition strategy and viral peer loop.',
        codeOrMarkdown: `{
  "campaign": "YOUR BRAIN HAS NO BACKSPACE",
  "product": "Wispr Flow",
  "target_persona": "College Tech Builders & Hackers",
  "tactics": [
    {
      "name": "60-Second Voice Speedrun",
      "hook": "Dictate your hackathon project architecture without touching keys.",
      "incentive": "Custom tactile artisan keycap + 3 months Wispr Flow Pro",
      "projected_cac": "₹120 ($1.45) per activated user"
    },
    {
      "name": "The Unfiltered Commit Challenge",
      "hook": "Post the wildest raw spoken thought that Wispr Flow turned into a clean commit message.",
      "viral_coefficient": "Est. 1.35x peer invites via Twitter/LinkedIn"
    }
  ]
}`,
      },
    },
  },
  {
    id: 'project-doc',
    title: 'Documenting a System Architecture RFC',
    category: 'Technical Architecture',
    durationEstimate: '50 seconds spoken',
    timeSaved: '~35 minutes writing technical docs',
    stages: {
      rawThought:
        '"For the 3D floor plan viewer, I need to document how we turn a 2D canvas drawing into Three.js geometry. We take the closed polygon path array, compute the normal vectors, use Three.Shape with ExtrudeGeometry at a fixed height of 2.8 meters, and then instantiate procedural glass materials for window cutouts using boolean CSG operations."',
      voiceCaptureTranscript:
        'Wispr Flow captured: "Technical Architecture RFC: 2D Floor Plan to Three.js Spatial Extrusion. Pipeline overview: Canvas 2D closed polygon path array -> vertex winding verification -> Three.Shape construction -> ExtrudeGeometry at 2.8m wall height. Window and door openings handled via Constructive Solid Geometry (CSG) mesh subtraction with PBR glass shaders."',
      structuredPrompt:
        `RFC Document: 2D-to-3D Spatial Extrusion Pipeline
1. Input Data Structure: Array of Point2D coordinates defining closed loop contours.
2. Validation Layer: Ensure clockwise winding order to guarantee proper face normal orientation in WebGL.
3. Mesh Generation:
   - Wall height constant: H = 2.8m.
   - ExtrudeSettings: bevelEnabled: false, steps: 1.
4. Cutout Processing:
   - Apply ThreeCSG library to subtract door/window bounding boxes from wall meshes.
5. Performance Target: Maintain 60 FPS on integrated Intel Iris Xe / Apple M1 GPUs.`,
      workingResult: {
        type: 'doc',
        title: 'RFC-SPATIAL-012.md',
        description: 'Engineering specification for client-side geometric extrusion pipeline.',
        codeOrMarkdown: `### RFC: Parametric 2D to 3D Extrusion
**Author:** Siddharth Singh
**Module:** \`@floorplan3d/mesh-generator\`

\`\`\`ts
export function buildWallMesh(contour: Point2D[], wallHeight = 2.8): THREE.Mesh {
  const shape = new THREE.Shape();
  contour.forEach((pt, i) => {
    if (i === 0) shape.moveTo(pt.x, pt.y);
    else shape.lineTo(pt.x, pt.y);
  });
  
  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: wallHeight,
    bevelEnabled: false,
  });
  
  // Rotate mesh upright to match Y-up coordinate system
  geometry.rotateX(-Math.PI / 2);
  geometry.computeVertexNormals();
  
  return new THREE.Mesh(geometry, wallMaterial);
}
\`\`\``,
      },
    },
  },
];

export const GROWTH_AUDIENCES: GrowthAudience[] = [
  {
    id: 'students',
    name: 'College Students',
    role: 'CS, Design & Engineering Students',
    painPoint: 'Keyboard friction during late-night hackathons and assignment drafting.',
    coreDesire: 'Capture thoughts instantly without battling backspace paralysis.',
  },
  {
    id: 'professionals',
    name: 'Working Professionals',
    role: 'Product Managers, Engineers & Consultants',
    painPoint: 'Exhausting Slack/Email typing fatigue and endless documentation backlogs.',
    coreDesire: 'Reclaim 2 hours daily by talking through updates and tickets at natural speech speed.',
  },
  {
    id: 'founders',
    name: 'Startup Founders',
    role: 'Solo Builders, Indie Hackers & Early Founders',
    painPoint: 'Wearing 10 hats simultaneously with zero bandwidth for structured writing.',
    coreDesire: 'Turn rambling voice memos into executive updates, investor notes, and PRDs.',
  },
  {
    id: 'creators',
    name: 'Content Creators',
    role: 'Writers, Tech Influencers & YouTubers',
    painPoint: 'Ideas evaporate while trying to type out full scripts and video outlines.',
    coreDesire: 'Stream of consciousness ideation that formats automatically into publish-ready copy.',
  },
];

export const GROWTH_CHALLENGES: GrowthChallenge[] = [
  {
    id: 'low-awareness',
    name: 'Low Awareness',
    context: 'Potential users do not know that modern voice transcription has evolved beyond clunky Siri/speech-to-text.',
  },
  {
    id: 'adoption-friction',
    name: 'Low Product Adoption',
    context: 'People download the tool but hesitate to build a daily voice habit due to workplace/dorm self-consciousness.',
  },
  {
    id: 'retention-drop',
    name: 'Low Retention',
    context: 'Novelty wears off after 3 days unless voice is deeply embedded into their existing IDE, Slack, or Notion workflows.',
  },
  {
    id: 'heavy-competition',
    name: 'Competition',
    context: 'Operating systems (macOS dictation, Windows speech) offer free, mediocre built-in defaults that mask true potential.',
  },
  {
    id: 'community-growth',
    name: 'Community Growth',
    context: 'Lack of an organic word-of-mouth flywheel where power users actively showcase their speed gains to peers.',
  },
];

export const GROWTH_OBJECTIVES: GrowthObjective[] = [
  {
    id: 'brand-awareness',
    name: 'Brand Awareness',
    kpiTarget: 'Top-of-mind recall & 250k+ organic views on builder-first case study demos.',
  },
  {
    id: 'product-trials',
    name: 'Product Trials',
    kpiTarget: 'High-intent app downloads with > 65% first-session activation rate.',
  },
  {
    id: 'daily-engagement',
    name: 'Daily Engagement',
    kpiTarget: 'Daily active voice words spoken per user (targeting > 500 words/day).',
  },
  {
    id: 'organic-referrals',
    name: 'Referrals & Virality',
    kpiTarget: 'Viral coefficient K > 1.25 driven by shareable "Voice-to-Code" snippets.',
  },
  {
    id: 'long-term-retention',
    name: 'Long-term Retention',
    kpiTarget: '30-day cohort retention > 45% via hotkey muscle memory integration.',
  },
];

export const FLAGSHIP_CAMPAIGNS: CampaignProposal[] = [
  {
    id: 'brain-no-backspace',
    title: 'Campus Hackathon Blitz: "Your Brain Has No Backspace"',
    creativeHeadline: 'YOUR BRAIN HAS NO BACKSPACE.',
    targetAudience: 'College Students',
    challengeAddressed: 'Low Awareness & Product Adoption',
    primaryObjective: 'Product Trials & Habit Formation',
    isFlagship: true,
    problemAnalysis:
      'Students spend up to 40% of their ideation time hitting the backspace key, second-guessing grammar, and losing their original creative train of thought during hackathons and project submissions.',
    audienceInsight:
      'Students don’t want another "corporate productivity tool." They want unfair speed advantages that make them look like wizards in front of their peers during 24-hour coding marathons.',
    campaignConcept:
      'Turn voice-first building into an esports-like speedrun. Set up live demo stations where students compete to scaffold a full product PRD or commit history using only Wispr Flow in 60 seconds.',
    distributionChannels: [
      'Top Indian Collegiate Hackathons (Smart India Hackathon, ETHIndia, collegiate dev fests)',
      'Campus Dev Club Partnerships (GDG on Campus, ACM Student Chapters)',
      'Instagram Reels & Twitter/X short-form comparison clips',
    ],
    contentIdeas: [
      'Split-screen reel: "Typing a React hook (1:45) vs Speaking a React hook with Wispr Flow (0:14)"',
      'The "Rambling to Clean PRD" transformation carousel showing real student chaos turned into crisp markdown',
      'Hackathon survival kit digital drop: Wispr Flow shortcuts cheat-sheet for fast coders',
    ],
    executionTimeline: [
      { week: 'Week 1', action: 'Curate list of 15 tier-1 student hackathons and reach out to student leads with sponsored toolkits.' },
      { week: 'Week 2', action: 'Ship "Speedrun Challenge" booth kits with branded keycaps, stickers, and one-click trial QR codes.' },
      { week: 'Week 3', action: 'Launch campus leaderboard for highest words dictated per student club with semester software grants.' },
      { week: 'Week 4', action: 'Measure trial-to-D14 retention and invite top 20 student power users to an exclusive beta advisory circle.' },
    ],
    successMetricsHypotheses: [
      { metric: 'New Active Trials', expectedLift: '+1,800 students', rationale: 'Driven by peer-to-peer competition at live events.' },
      { metric: 'First-day Activation', expectedLift: '72%', rationale: 'Instant gratification of completing the 60-second speed challenge.' },
      { metric: 'Day-14 Retention', expectedLift: '48%', rationale: 'Students who use Wispr Flow during an active project build persistent muscle memory.' },
    ],
    potentialRisks: [
      'Noisy hackathon environments could degrade microphone input if noise suppression is not highlighted.',
      'Students might view it as an exam cheat rather than a legitimate developer velocity tool.',
    ],
    learningAndIteration:
      'Hypothesis to validate: Does positioning Wispr Flow as an "unfair hackathon weapon" drive higher organic peer shares than positioning it as a general note-taking tool? If hackathon trials show high D7 drop-off, pivot onboarding tutorials directly into VS Code & Cursor extensions.',
  },
  {
    id: 'code-speed-of-thought',
    title: 'Founder Velocity: "Code at the Speed of Thought"',
    creativeHeadline: 'DICTATE CODE AT THE SPEED OF THOUGHT.',
    targetAudience: 'Startup Founders',
    challengeAddressed: 'Competition from Built-in OS Dictation',
    primaryObjective: 'Retention & Daily Engagement',
    isFlagship: true,
    problemAnalysis:
      'Founders waste 3+ hours daily context-switching between writing linear tickets, replying to customer bugs, and drafting architecture RFCs. macOS native dictation fails because it cannot parse technical nomenclature (e.g., camelCase, TypeScript interfaces, REST endpoints).',
    audienceInsight:
      'Founders are obsessed with leverage. If a tool saves them 45 minutes a day, they will pay immediately and evangelize it to their entire portfolio batch on WhatsApp and Twitter.',
    campaignConcept:
      'A raw, unproduced showcase demonstrating how a founder goes on a 15-minute morning walk, speaks into Wispr Flow, and arrives at their desk with 5 comprehensive Linear tickets and an investor memo already drafted.',
    distributionChannels: [
      'Twitter / X builder circles & Indie Hackers',
      'Y Combinator & Indian Incubator WhatsApp/Slack communities',
      'Product Hunt launch with live founder walkthrough videos',
    ],
    contentIdeas: [
      'Loom-style breakdowns: "How I planned our entire Q3 sprint during my 12-minute commute"',
      'Technical glossary comparison: Showing Wispr Flow perfectly formatting `useEffect` vs Siri typing "you effect"',
      'Open-source repository of prompt templates tailored for voice-first engineering leads',
    ],
    executionTimeline: [
      { week: 'Week 1', action: 'Identify 25 high-visibility indie builders on Twitter/LinkedIn and seed them with private VIP onboarding.' },
      { week: 'Week 2', action: 'Co-publish real uncensored workflow breakdowns showing their actual voice-to-execution pipelines.' },
      { week: 'Week 3', action: 'Host an open virtual "Voice Hack Night" with screen-sharing live builds.' },
      { week: 'Week 4', action: 'Package the highest-performing workflows into a downloadable "Founder Voice Playbook".' },
    ],
    successMetricsHypotheses: [
      { metric: 'Paid Conversion Rate', expectedLift: '14.5%', rationale: 'High willingness-to-pay when tied to direct hourly founder savings.' },
      { metric: 'Organic Mentions on X', expectedLift: '+320 posts', rationale: 'Founders love flexing high-velocity development setups.' },
      { metric: 'Weekly Words Spoken', expectedLift: '3,200 words/user', rationale: 'Voice replaces tedious manual Slack and PR drafting.' },
    ],
    potentialRisks: [
      'Founders working in open offices might feel self-conscious speaking out loud unless whisper-level sensitivity is emphasized.',
    ],
    learningAndIteration:
      'Validate if founders prefer voice for code generation or for managerial communication (Linear, Slack, Email). Adjust product onboarding tooltips accordingly.',
  },
  {
    id: 'zero-friction-writer',
    title: 'Creator Unleashed: "The Zero-Friction Writer\'s Room"',
    creativeHeadline: 'THE ZERO-FRICTION WRITER\'S ROOM.',
    targetAudience: 'Content Creators',
    challengeAddressed: 'Low Retention & Adoption Friction',
    primaryObjective: 'Referrals & Virality',
    isFlagship: true,
    problemAnalysis:
      'Creators suffer from the "blank cursor curse." The physiological act of typing forces analytical editing too early, stifling organic conversational charisma.',
    audienceInsight:
      'Creators speak effortlessly on camera or in person, but freeze when facing a Google Doc. Bridging speech to structured text preserves their authentic voice without burnout.',
    campaignConcept:
      'Challenge top YouTube/Substack creators to record a 10-minute stream-of-consciousness podcast, then let Wispr Flow extract 3 Twitter threads, 1 newsletter issue, and 5 video hooks in real time.',
    distributionChannels: [
      'Substack & Beehiiv creator networks',
      'YouTube Tech commentary sponsorships',
      'LinkedIn thought-leadership carousels',
    ],
    contentIdeas: [
      'Side-by-side timelapse: 10 minutes of talking vs 4 hours of typing a 2,000-word essay',
      '"Don\'t type your podcast show notes"—one-click voice workflow breakdown',
      'Audio waveform breakdowns showing organic voice cadence becoming publication-grade prose',
    ],
    executionTimeline: [
      { week: 'Week 1', action: 'Partner with 10 newsletter writers to pilot voice-drafted editions.' },
      { week: 'Week 2', action: 'Publish the "Voice-to-Newsletter" breakdown case study.' },
      { week: 'Week 3', action: 'Launch an invite-only creator affiliate program with custom voice dashboard metrics.' },
      { week: 'Week 4', action: 'Aggregate viral testimonials into a creator wall of love.' },
    ],
    successMetricsHypotheses: [
      { metric: 'Referral Coefficient (K)', expectedLift: '1.42', rationale: 'Creators naturally talk about the tools behind their content output.' },
      { metric: 'Newsletter Signups via Landing Page', expectedLift: '+4,500', rationale: 'High social proof from trusted cultural voices.' },
      { metric: 'Avg Session Frequency', expectedLift: '4.2x / week', rationale: 'Becomes the core step in every content ideation cycle.' },
    ],
    potentialRisks: [
      'Creators might worry about losing their distinct idiosyncratic writing voice to over-sanitized AI formatting.',
    ],
    learningAndIteration:
      'Ensure Wispr Flow preserves stylistic idioms and tonal personality rather than flattening output into generic corporate English.',
  },
];

export const RECRUITER_QA: RecruiterQAItem[] = [
  {
    id: 'why-wispr-flow',
    category: 'Wispr Flow',
    question: 'Why are you specifically interested in Wispr Flow?',
    shortAnswer: 'Because voice is the only input modality with human-level bandwidth, and Wispr Flow is doing the hard work of making it ergonomic for builders.',
    detailedAnswer:
      'Most AI companies are building chatbot wrappers that sit in a separate browser tab, demanding that users abandon their active flow. Wispr Flow is different: it sits at the operating system level, turning organic speech into immediate structured execution wherever your cursor already lives. For someone like me who builds prototypes rapidly, eliminating the mechanical keyboard bottleneck between thought and code is the most exciting frontier in human-computer interaction.',
    keyTakeaway: 'Focus on low-friction ambient ergonomics rather than isolated chatbot novelties.',
    relatedTags: ['Voice UX', 'Productivity', 'HCI', 'Wispr Flow'],
  },
  {
    id: 'how-i-learn-from-failure',
    category: 'Failures',
    question: 'Tell me about an experiment that failed and what you actually changed.',
    shortAnswer: 'GoDuet taught me that multi-restaurant ordering fails on kitchen prep synchronization, not UI design.',
    detailedAnswer:
      'When I prototyped GoDuet, my initial assumption was that users just wanted a single cart for multiple restaurants. I built the frontend and simulated orders with hostel mates. The catastrophic failure point was kitchen timing: Restaurant A finished burgers in 8 minutes, while Restaurant B took 26 minutes for biryani. By the time the single courier reached the hostel, half the food was cold. That failure taught me that product design without operational unit physics is just wishful thinking. I pivoted the design to cluster restaurants with synchronized prep-window guarantees.',
    keyTakeaway: 'Respect physical constraints and operational unit economics before celebrating UI aesthetics.',
    relatedTags: ['GoDuet', 'Failures', 'Operational Physics', 'Iteration'],
  },
  {
    id: 'technical-decisions',
    category: 'Technical',
    question: 'How do you choose your technical stack for a new project?',
    shortAnswer: 'I choose tools that optimize for iteration velocity and zero runtime surprises.',
    detailedAnswer:
      'I rely on React, TypeScript, and Tailwind because they provide type-safety, rapid composability, and predictable maintenance. However, when a project demands specialized capability—like client-side cryptography for the Wellness Check-in (Web Crypto API) or spatial 3D rendering for the Floor Plan viewer (Three.js)—I delve directly into foundational browser standards rather than layering bloated third-party abstractions that I cannot debug.',
    keyTakeaway: 'Pragmatic velocity over tech vanity; foundational web APIs over opaque wrappers.',
    relatedTags: ['Architecture', 'TypeScript', 'Web Crypto', 'Three.js'],
  },
  {
    id: 'product-mindset',
    category: 'Product Mindset',
    question: 'How do you decide what NOT to build?',
    shortAnswer: 'If a feature doesn’t directly eliminate user hesitation or prove the core hypothesis, it gets cut.',
    detailedAnswer:
      'When designing the Private Wellness Check-in, my initial notebook had 18 different tracking metrics: hydration, social interaction score, study hours, screen time. I realized that asking a depressed hostel student to fill out 18 metrics guaranteed 0% retention by day 3. I violently trimmed the scope down to 3 visual micro-sliders that take 15 seconds. Relentless subtraction is what makes products actually get used.',
    keyTakeaway: 'Perfection is achieved not when there is nothing more to add, but when there is nothing left to take away.',
    relatedTags: ['Product Design', 'Scope Trimming', 'Hostel Wellness'],
  },
  {
    id: 'growth-approach',
    category: 'Growth',
    question: 'How do you approach marketing when you don’t have an ad budget?',
    shortAnswer: 'Build the distribution mechanism directly into the product’s core utility.',
    detailedAnswer:
      'Paid ads on social media produce rented attention with high churn. True grassroots growth comes from creating an "artifact of value" that people naturally want to show off. For Wispr Flow in the Growth Arena, my proposal isn’t to buy Instagram ads—it is to run 60-second live speedrun challenges at hackathons where builders compare their voice output on a live screen. When someone sees their friend dictate a 50-line component spec in 30 seconds, they download the app immediately without any marketing pitch.',
    keyTakeaway: 'Distribution is an engineering and UX problem, not just a media-buying problem.',
    relatedTags: ['Growth Strategy', 'Organic Loops', 'Hackathons'],
  },
  {
    id: 'ownership-and-initiative',
    category: 'Learning',
    question: 'What does "taking ownership" mean to you as a builder?',
    shortAnswer: 'Never saying "that wasn’t my job" when something breaks between the user and the code.',
    detailedAnswer:
      'Taking ownership means following the idea all the way to the end of the wire. If a database query is slow, if the user onboarding copy sounds robotic, if the mobile layout overflows on an iPhone SE, or if the user doesn’t understand what a button does—that is entirely my responsibility as the builder. I don’t wait for detailed tickets; I spot the leak, diagnose the cause, and ship the fix.',
    keyTakeaway: 'Full-spectrum accountability from customer empathy to production deployment.',
    relatedTags: ['Ownership', 'Initiative', 'Builder Culture'],
  },
  {
    id: 'authenticity-note',
    category: 'Projects',
    question: 'Are the metrics and projects displayed on VOICEPRINT real?',
    shortAnswer: '100% transparent. Prototypes are labeled as prototypes; hypotheses are labeled as hypotheses.',
    detailedAnswer:
      'I have zero interest in padding my portfolio with fabricated revenue numbers, fake user counts, or pretend venture rounds. GoDuet is an active exploration with working client state and user research; Private Wellness Check-in is a privacy-first prototype with real client-side crypto; Floor Plan 3D is a functional spatial geometry experiment. Every growth simulation in the Growth Arena is explicitly labeled as a hypothesis. I want you to evaluate me on how I think, build, and solve problems—not on manufactured vanity metrics.',
    keyTakeaway: 'Radical honesty builds lasting engineering credibility.',
    relatedTags: ['Integrity', 'Evidence', 'Honest Builder'],
  },
];

export const PRODUCTIVITY_ITEMS: ProductivityItem[] = [
  {
    id: 'workstation',
    category: 'Workstation',
    name: 'Apple MacBook Pro 14" (M3 Pro / 18GB / 512GB)',
    spec: 'Apple Silicon M-Series, Unified Memory for local AI model compilation and instant hot reload',
    estimatedPriceUSD: 1799,
    productivityBenefit:
      'Enables running local transcription models, fast WebGL rendering for 3D floor plans, and parallel dev servers without thermal throttling or battery anxiety.',
    urgency: 'Crucial',
    selected: true,
  },
  {
    id: 'monitor',
    category: 'Monitor',
    name: 'Dell UltraSharp 27" 4K USB-C Hub Monitor (U2723QE)',
    spec: 'IPS Black panel, 98% DCI-P3, 400 nits, single-cable 90W power delivery & hub',
    estimatedPriceUSD: 549,
    productivityBenefit:
      'Allows side-by-side split screen: interactive UI on one half, real-time code and terminal logs on the other, cutting visual context-switching time by 40%.',
    urgency: 'High Impact',
    selected: true,
  },
  {
    id: 'audio-mic',
    category: 'Audio Equipment',
    name: 'Shure MV7+ USB/XLR Dynamic Microphone + Low-Profile Boom Arm',
    spec: 'Broadcast-quality dynamic capsule, built-in DSP voice isolation, hardware mute sensor',
    estimatedPriceUSD: 299,
    productivityBenefit:
      'Essential for crystal-clear voice-first engineering and testing Wispr Flow in noisy hostel/room environments with zero acoustic bleed or transcription distortion.',
    urgency: 'Crucial',
    selected: true,
  },
  {
    id: 'ergonomics',
    category: 'Ergonomics',
    name: 'Ergonomic Desk Setup & Active Posture Task Chair',
    spec: 'Adjustable lumbar support, pneumatic gas lift, 3D armrests for long build sprints',
    estimatedPriceUSD: 249,
    productivityBenefit:
      'Prevents wrist strain and posture fatigue during 12+ hour deep-work sessions, sustaining uninterrupted flow and mental clarity.',
    urgency: 'Workflow Enabler',
    selected: true,
  },
  {
    id: 'tooling-licenses',
    category: 'Productivity Tools',
    name: 'Wispr Flow Pro + Cursor + Dev Tooling Annual Subscriptions',
    spec: 'Annual developer access for voice transcription, AI paired scaffolding, and cloud staging',
    estimatedPriceUSD: 104,
    productivityBenefit:
      'Direct software velocity multiplier: powers the exact voice-to-execution pipeline demonstrated in the Voice Lab.',
    urgency: 'Crucial',
    selected: true,
  },
];
