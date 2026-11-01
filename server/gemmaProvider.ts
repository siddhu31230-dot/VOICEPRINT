/**
 * Configurable Gemma 4 AI Model Provider
 * 
 * Supports:
 * 1. "google": Google AI Studio endpoint (gemma-4-it / gemma-2-9b-it / gemma-2-27b-it)
 * 2. "ollama": Local Ollama runner (e.g. gemma2:9b)
 * 3. "openai_compatible": Any OpenAI-compatible provider hosting Gemma (Groq, OpenRouter, etc.)
 * 4. "local_grounded": Deterministic local portfolio grounding engine (fallback when no API key is provided)
 * 
 * Security Invariant: API keys are loaded strictly on the server and are NEVER sent to the client.
 */

import { PORTFOLIO_KNOWLEDGE_BASE, GEMMA_SYSTEM_INSTRUCTION } from './knowledgeBase';

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface GemmaResponse {
  reply: string;
  model: string;
  provider: string;
  grounded: boolean;
  isFallback?: boolean;
}

export async function callGemmaProvider(
  userQuery: string,
  history: ChatMessage[] = []
): Promise<GemmaResponse> {
  const provider = (process.env.GEMMA_PROVIDER || 'google').toLowerCase();
  const model = process.env.GEMMA_MODEL || 'gemma-4-26b-a4b-it';
  const apiKey = process.env.GEMMA_API_KEY || process.env.GEMINI_API_KEY || '';
  const apiBase = process.env.GEMMA_API_BASE || '';
  const temperature = parseFloat(process.env.GEMMA_TEMPERATURE || '0.2');

  // Grounding prompt with strict knowledge base injection
  const fullSystemPrompt = `${GEMMA_SYSTEM_INSTRUCTION}

${PORTFOLIO_KNOWLEDGE_BASE}`;

  // 1. Google Provider (Google AI Studio)
  if (provider === 'google') {
    if (!apiKey) {
      // Graceful fallback to verified grounded engine when API key is unconfigured
      return generateLocalGroundedResponse(userQuery, model, 'Verified Portfolio Archive (Grounded Fallback - GEMMA_API_KEY unconfigured)');
    }

    try {
      // Call Google AI Studio endpoint for Gemma 4 (gemma-4-26b-a4b-it / gemma-4-31b-it)
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

      const contents = [
        {
          role: 'user',
          parts: [
            {
              text: userQuery
            }
          ]
        }
      ];

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout for reasoning models

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: fullSystemPrompt }]
          },
          contents,
          generationConfig: {
            temperature,
            maxOutputTokens: 2048,
          }
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        const errText = await res.text();
        console.warn(`[GemmaProvider] Google API error (${res.status}):`, errText);
        // Fallback to grounded portfolio engine rather than leaving recruiter empty-handed
        return generateLocalGroundedResponse(userQuery, model, 'Verified Portfolio Archive (Grounded Fallback - Remote API Unavailable)');
      }

      const data = await res.json();
      const parts = data.candidates?.[0]?.content?.parts || [];
      // Filter out internal thinking / reasoning traces (thought: true) to return the clean model response
      const responsePart = parts.find((p: any) => !p.thought) || parts[parts.length - 1];
      const generatedText = responsePart?.text;

      if (!generatedText) {
        return generateLocalGroundedResponse(userQuery, model, 'Verified Portfolio Archive (Grounded Fallback - Empty Response)');
      }

      const cleanedReply = cleanGemmaOutput(generatedText);

      return {
        reply: cleanedReply,
        model,
        provider: 'Google AI Studio (Remote Gemma 4)',
        grounded: true,
        isFallback: false
      };
    } catch (err: any) {
      console.warn('[GemmaProvider] Network error calling Google AI Studio:', err.message);
      return generateLocalGroundedResponse(userQuery, model, 'Verified Portfolio Archive (Grounded Fallback - Network Error)');
    }
  }

  // 2. Ollama Provider (Local Runner)
  if (provider === 'ollama') {
    const baseUrl = apiBase || 'http://localhost:11434';
    try {
      const messages = [
        { role: 'system', content: fullSystemPrompt },
        ...history.slice(-4),
        { role: 'user', content: userQuery }
      ];

      const res = await fetch(`${baseUrl}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model,
          messages,
          stream: false,
          options: { temperature }
        })
      });

      if (!res.ok) {
        return generateLocalGroundedResponse(userQuery, model, 'ollama (offline fallback)');
      }

      const data = await res.json();
      return {
        reply: data.message?.content?.trim() || '',
        model,
        provider: 'Local Ollama Instance',
        grounded: true,
        isFallback: false
      };
    } catch (err: any) {
      return generateLocalGroundedResponse(userQuery, model, 'ollama (offline fallback)');
    }
  }

  // 3. OpenAI-Compatible Provider
  if (provider === 'openai_compatible') {
    const baseUrl = apiBase || 'https://api.groq.com/openai/v1';
    try {
      const messages = [
        { role: 'system', content: fullSystemPrompt },
        ...history.slice(-4),
        { role: 'user', content: userQuery }
      ];

      const res = await fetch(`${baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model,
          messages,
          temperature,
          max_tokens: 1024
        })
      });

      if (!res.ok) {
        return generateLocalGroundedResponse(userQuery, model, 'openai_compatible (api error fallback)');
      }

      const data = await res.json();
      return {
        reply: data.choices?.[0]?.message?.content?.trim() || '',
        model,
        provider: 'OpenAI-Compatible Gateway (Gemma)',
        grounded: true,
        isFallback: false
      };
    } catch (err: any) {
      return generateLocalGroundedResponse(userQuery, model, 'openai_compatible (offline fallback)');
    }
  }

  // 4. Default: Local Grounded Engine
  return generateLocalGroundedResponse(userQuery, model, 'Local Grounded Knowledge Engine');
}

/**
 * Sanitizes model text output, stripping any accidental internal reasoning tags
 * or scratchpads emitted by reasoning-capable variants.
 */
function cleanGemmaOutput(raw: string): string {
  if (!raw) return '';
  let text = raw.trim();

  // Strip <thought>...</thought> blocks
  text = text.replace(/<thought>[\s\S]*?<\/thought>/gi, '').trim();

  // If the model output a chain-of-thought scratchpad at the beginning
  if (
    text.includes('* User Role:') ||
    text.includes('* Target Audience:') ||
    text.includes('* Input Question:') ||
    text.includes('* Constraint') ||
    text.includes('* Check against rules:')
  ) {
    const lastQuoteIndex = text.lastIndexOf('\n    "');
    const altQuoteIndex = text.lastIndexOf('\n"');
    const quoteIdx = Math.max(lastQuoteIndex, altQuoteIndex);
    if (quoteIdx !== -1) {
      return text.slice(quoteIdx).replace(/^\s*"/, '').replace(/"\s*$/, '').trim();
    }

    const checkIdx = text.lastIndexOf('Yes.\n');
    if (checkIdx !== -1) {
      return text.slice(checkIdx + 4).replace(/^\s*"/, '').replace(/"\s*$/, '').trim();
    }
  }

  return text.replace(/^"|"$/g, '').trim();
}

/**
 * Deterministic local grounded response generator.
 * Used when no external API key is provided, during offline testing,
 * or as a safe recruiter fallback when remote endpoints are rate-limited or unreachable.
 */
function generateLocalGroundedResponse(query: string, model: string, providerInfo: string): GemmaResponse {
  const q = query.toLowerCase();

  // Strict anti-hallucination check for ungrounded claims, funding, institutional awards, or corporate affiliations
  if (
    q.includes('funding') ||
    q.includes('venture') ||
    q.includes('raise') ||
    q.includes('raised') ||
    q.includes('valuation') ||
    q.includes('investor') ||
    q.includes('medal') ||
    q.includes('olympic') ||
    q.includes('nobel') ||
    q.includes('forbes') ||
    q.includes('phd') ||
    q.includes('doctorate') ||
    q.includes('patent') ||
    (q.includes('work') && (q.includes('meta') || q.includes('apple') || q.includes('netflix')))
  ) {
    return {
      reply: `I don't have records of that in Siddharth's verified portfolio.

Siddharth's documented work and builder records focus on:
- **GoDuet:** Multi-restaurant shared courier logistics and distributed cart state machine (independent student prototype, not venture-funded).
- **Private Wellness Check-in:** Client-side AES-256-GCM zero-knowledge student privacy.
- **Floor Plan to 3D Viewer:** WebGL Three.js spatial extrusion from 2D vectors.
- **Wispr Flow Voice Velocity:** Voice-first developer workflows saving ~25-35 minutes per task.
- **GTM Strategy:** Collegiate hackathon growth campaigns ("Your Brain Has No Backspace").

Siddharth is currently a student builder and independent explorer. No venture funding, institutional awards, or external corporate employment are claimed in his verified portfolio.`,
      model,
      provider: providerInfo,
      grounded: true,
      isFallback: true
    };
  }

  // 0. HACKATHON & RECENT COMPETITION AWARDS CHECK
  if (
    q.includes('hackathon') ||
    q.includes('hacktoberfest') ||
    q.includes('competition') ||
    q.includes('contest') ||
    (q.includes('won') && !q.includes('goduet')) ||
    (q.includes('win') && !q.includes('goduet')) ||
    q.includes('first place') ||
    q.includes('1st place') ||
    q.includes('achievement')
  ) {
    return {
      reply: `**Hackathon Championship: 1st Place Winner — Hacktoberfest 2026 (Track 2: Google Gemma)**

Siddharth and his team won **1st Place in Track 2** at **Hacktoberfest 2026**, a 24-hour overnight hackathon held at **SMRU Campus, Hyderabad** on **October 30–31, 2026**.

**Key Event Details:**
- **Event:** Hacktoberfest 2026 (24-Hour Overnight Hackathon)
- **Organizers:** Newton School of Technology & St. Mary's Rehabilitation University (SMRU)
- **Official Partners:** Powered by Major League Hacking (MLH) and DEV; in partnership with Hacktoberfest 26
- **Track Partner:** **Google Gemma** (Track 2)
- **Result:** **1st Place (Championship)**

**The Builder Takeaway:**
Competing under 24-hour time pressure against collegiate engineering teams in Hyderabad, their solution combined Google Gemma's instruction-following models with high-speed developer workflows, turning a concept into a winning production-ready prototype overnight. This firsthand hackathon victory directly reinforces Siddharth's conviction in voice velocity for Indian builders and the Wispr Flow campus campaign.`,
      model,
      provider: providerInfo,
      grounded: true,
      isFallback: true
    };
  }

  // 1. SPECIFIC PROJECT CHECK: GODUET (Must take priority over generic "project" or "built" queries)
  if (q.includes('goduet') || q.includes('go duet')) {
    return {
      reply: `**GoDuet (Food Tech & Marketplace Architecture)**

GoDuet is Siddharth's multi-restaurant ordering concept built specifically to solve the perennial hostel roommate dilemma: one person wants momos, another wants burgers, but platforms like Swiggy and Zomato force separate orders with doubled delivery charges, duplicate minimum-order thresholds, and unsynchronized couriers.

• **The Problem:** In hostel dorms and co-living clusters, meal ordering is inherently collective. Forcing users into a single restaurant or disjointed deliveries introduces friction and doubles delivery costs.
• **Core Concept & Architecture:**
  - Clusters partner restaurants situated within a 600m micro-hub radius.
  - A single courier collects both orders simultaneously, dropping them off as a single combined batch.
  - Reduces customer delivery fees by ~35% while lifting Average Order Value (AOV) for restaurants.
  - Features an optimistic client-side cart state machine with atomic rollback if an item goes out of stock.
• **Key Technical Challenge:**
  - Handling asynchronous race conditions on unstable 3G mobile connections when users rapidly toggle between two menus. Asynchronous API responses arrived out of order, corrupting the cart total.
  - Resolved by implementing sequence-guarded reducers with AbortControllers.
• **The Operational Failure & Takeaway:**
  - In initial live trials with hostel mates, burgers cooked in 8 minutes while biryani took 28 minutes. Couriers arrived with cold food.
  - This failure taught Siddharth that **software design without physical operational physics is wishful thinking**. He redesigned the bundling algorithm to strictly enforce kitchen prep-time tolerance bands.
• **Current Status:**
  - Functional prototype and state-flow simulation tested with hostel students, proving 88% preference over separate orders.`,
      model,
      provider: providerInfo,
      grounded: true,
      isFallback: true
    };
  }

  // 2. SPECIFIC PROJECT CHECK: PRIVATE WELLNESS CHECK-IN
  if (q.includes('wellness') || (q.includes('mental') && q.includes('health')) || q.includes('hostel check-in')) {
    return {
      reply: `**Private Wellness Check-in (Privacy Tech & Zero-Knowledge Architecture)**

A zero-knowledge daily wellness check-in prototype engineered specifically for student hostels, where social stigma often prevents students from seeking mental health support.

• **The Core Problem:** Students in shared hostel living experience severe academic stress but avoid campus counseling due to fear of institutional surveillance or peer judgment.
• **Security & Privacy Architecture:**
  - Pure client-side AES-256-GCM authenticated encryption using the native Web Crypto API.
  - Generates fresh 12-byte cryptographically random IVs for every entry; keys are held strictly in browser memory and are never sent to any server.
  - 128-bit authentication tags ensure zero tampering can occur undetected.
• **Product Decision (What NOT to Build):**
  - Originally designed with 18 comprehensive tracking metrics. Students abandoned it within 3 days.
  - Siddharth ruthlessly subtracted the scope down to 3 visual micro-sliders taking under 30 seconds daily, restoring 94% retention.
• **Key Takeaway:** Zero-knowledge cryptographic guarantees build emotional trust faster than any marketing copy.`,
      model,
      provider: providerInfo,
      grounded: true,
      isFallback: true
    };
  }

  // 3. SPECIFIC PROJECT CHECK: FLOOR PLAN TO 3D VIEWER
  if (q.includes('floor plan') || q.includes('floorplan') || q.includes('3d viewer') || q.includes('three.js') || q.includes('spatial')) {
    return {
      reply: `**Floor Plan to 3D Viewer Prototype (Spatial Web & Three.js)**

A browser-based tool that parses static 2D architectural blueprint vectors and extrudes them into an interactive 3D WebGL spatial model in real time.

• **The Core Problem:** Most home renovators and buyers struggle to understand spatial scale from flat 2D blueprint lines.
• **Technical Approach:**
  - Vector path parsing and vertex winding order validation in WebGL.
  - Three.js ExtrudeGeometry with normal vector calculations at fixed 2.8m wall heights.
  - Constructive Solid Geometry (CSG) mesh subtractions for parametric window and door openings.
  - PBR glass and architectural shaders running smoothly at 60 FPS on integrated GPUs.
• **Hard Engineering Lesson:**
  - Complex boolean CSG operations on irregular polygon contours initially crashed the WebGL rendering context. Resolved by pre-validating winding order and tessellating complex polygons into simpler convex sets before extrusion.`,
      model,
      provider: providerInfo,
      grounded: true,
      isFallback: true
    };
  }

  // 4. Pattern match against general portfolio inquiries
  if (q.includes('built') || q.includes('project') || q.includes('portfolio') || q.includes('what have you done')) {
    return {
      reply: `Siddharth has designed and engineered three distinct prototypes born from real daily friction:

1. **GoDuet (Food Tech & Marketplace Architecture):** A multi-restaurant ordering platform allowing hostel roommates to combine dishes from different menus into a single checkout with one shared delivery fee. Features micro-hub clustering (600m radius) and an optimistic distributed cart state machine with atomic rollback.
2. **Private Wellness Check-in (Privacy Tech):** A zero-knowledge client-side mental health tracker utilizing native Web Crypto AES-256-GCM encryption. Designed specifically for hostel living where social stigma prevents students from seeking care.
3. **Floor Plan to 3D Viewer (Spatial Web):** Converts static 2D blueprint contours into an interactive 3D WebGL scene using Three.js and Constructive Solid Geometry (CSG) at 60 FPS.

Every project has working code, architecture trade-offs, and documented operational learnings.`,
      model,
      provider: providerInfo,
      grounded: true,
      isFallback: true
    };
  }

  if (q.includes('wispr') || q.includes('why wispr') || q.includes('flow') || q.includes('hiring challenge')) {
    return {
      reply: `Siddharth is building for **Wispr Flow** because voice is the highest-bandwidth modality human beings have evolved for externalizing thought.

Most AI companies build isolated chatbot wrappers that sit in a separate browser tab, forcing users to context-switch away from their active flow. Wispr Flow operates at the operating system layer, turning organic speech into structured code, PRDs, and communication directly where your cursor lives.

For an ambitious builder who prototypes rapidly, eliminating mechanical typing latency is the most consequential ergonomics shift since the graphical user interface.`,
      model,
      provider: providerInfo,
      grounded: true,
      isFallback: true
    };
  }

  if (q.includes('failure') || q.includes('mistake') || q.includes('learn') || q.includes('wrong')) {
    return {
      reply: `Siddharth's biggest failure was in GoDuet's early physical logistics:

"When I prototyped GoDuet, I assumed users only cared about a shared cart UI. In live trials with hostel mates, Restaurant A cooked burgers in 8 minutes, but Restaurant B took 28 minutes for biryani. By the time the courier arrived, the burgers were cold.

That failure taught me that **software design without physical operational physics is wishful thinking**. I redesigned the algorithm to only bundle orders within strict prep-time tolerance bands."

His motto: *"Every failure creates a better version."*`,
      model,
      provider: providerInfo,
      grounded: true,
      isFallback: true
    };
  }

  if (q.includes('technical challenge') || q.includes('hardest') || q.includes('complex') || q.includes('state machine')) {
    return {
      reply: `Siddharth's two primary technical challenges:

1. **GoDuet's Distributed State Reconciliation:** Managing asynchronous cart state when users on poor 3G toggled rapidly between restaurants. Asynchronous menu responses arrived out of order, corrupting totals. Resolved by implementing sequence-guarded reducers and AbortControllers.
2. **Floor Plan 3D Extrusion:** Parsing raw 2D polygon vectors, verifying vertex winding order in WebGL, and performing boolean CSG (Constructive Solid Geometry) mesh subtractions for window/door openings while sustaining 60 FPS on integrated Apple/Intel GPUs.`,
      model,
      provider: providerInfo,
      grounded: true,
      isFallback: true
    };
  }

  if (q.includes('ai') || q.includes('llm') || q.includes('prompt') || q.includes('use ai')) {
    return {
      reply: `Siddharth treats AI not as an unreviewed code generator, but as an **active cognitive co-processor**:

- **Voice-to-Spec:** Dictating stream-of-consciousness architectural thoughts into structured, high-signal prompts in under 45 seconds using Wispr Flow (demonstrated in the Voice Lab).
- **Scaffolding:** Rapidly generating TypeScript boilerplate, boundary condition tests, and comprehensive PRD drafts.
- **Stress-Testing:** Using LLMs to uncover subtle concurrency flaws and state edge cases before deploying.
- He shifts his role from mechanical typist to systems orchestrator and product architect.`,
      model,
      provider: providerInfo,
      grounded: true,
      isFallback: true
    };
  }

  if (q.includes('3000') || q.includes('budget') || q.includes('setup') || q.includes('hardware')) {
    return {
      reply: `Siddharth's illustrative **$3,000 Productivity Acceleration Setup** is designed to maximize output velocity:

1. **Apple MacBook Pro 14" (M3 Pro / 18GB / 512GB) — $1,799:** Powering local ONNX neural execution, WebGL rendering, and parallel dev environments.
2. **Dell UltraSharp 27" 4K USB-C Hub Monitor — $549:** Providing split-screen real-time terminal logs and code editors.
3. **Shure MV7+ Microphone & Boom Arm — $299:** Eliminating acoustic bleed in hostel environments for crisp Wispr Flow dictation.
4. **Ergonomic Desk & Chair Setup — $249:** Sustaining deep work marathons without posture fatigue.
5. **Wispr Flow Pro + Cursor Annual Subscriptions — $104:** Software leverage for high-velocity voice-first development.

*Notice: This is an illustrative allocation proposal demonstrating calculated hardware ROI, not an awarded grant.*`,
      model,
      provider: providerInfo,
      grounded: true,
      isFallback: true
    };
  }

  // Fallback for ungrounded or unknown queries
  return {
    reply: `I don't have records of that in Siddharth's verified portfolio.

Siddharth's documented work and builder records focus on:
- **GoDuet:** Multi-restaurant shared courier logistics and distributed cart state.
- **Private Wellness Check-in:** Client-side AES-256-GCM zero-knowledge student privacy.
- **Floor Plan to 3D Viewer:** WebGL Three.js spatial extrusion from 2D vectors.
- **Wispr Flow Voice Velocity:** Voice-first developer workflows saving ~25-35 minutes per task.
- **GTM Strategy:** Collegiate hackathon growth campaigns ("Your Brain Has No Backspace").

Feel free to ask about any of these projects, his technical decisions, or his engineering philosophy!`,
    model,
    provider: providerInfo,
    grounded: true,
    isFallback: true
  };
}
