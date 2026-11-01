/**
 * VOICEPRINT Grounded Portfolio Answer Resolver
 * 
 * Ensures that questions about specific projects (especially GoDuet)
 * return ONLY details regarding that specific topic without dragging
 * in unrelated project overviews.
 */

import { RECRUITER_QA } from '../data/portfolioData';

export function getGroundedFallbackAnswer(query: string): string {
  const q = query.toLowerCase().trim();

  // 1. TOPIC: GODUET (Must take priority over generic "project" or "built" questions)
  if (q.includes('goduet') || q.includes('go duet') || q.includes('food tech') || q.includes('two restaurant')) {
    return `**GoDuet (Food Tech & Marketplace Architecture)**

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
  - Functional prototype and state-flow simulation tested with hostel students, proving 88% preference over separate orders.`;
  }

  // 2. TOPIC: PRIVATE WELLNESS CHECK-IN
  if (q.includes('wellness') || (q.includes('mental') && q.includes('health')) || q.includes('hostel check-in')) {
    return `**Private Wellness Check-in (Privacy Tech & Zero-Knowledge Architecture)**

A zero-knowledge daily wellness check-in prototype engineered specifically for student hostels, where social stigma often prevents students from seeking mental health support.

• **The Core Problem:** Students in shared hostel living experience severe academic stress but avoid campus counseling due to fear of institutional surveillance or peer judgment.
• **Security & Privacy Architecture:**
  - Pure client-side AES-256-GCM authenticated encryption using the native Web Crypto API.
  - Generates fresh 12-byte cryptographically random IVs for every entry; keys are held strictly in browser memory and are never sent to any server.
  - 128-bit authentication tags ensure zero tampering can occur undetected.
• **Product Decision (What NOT to Build):**
  - Originally designed with 18 comprehensive tracking metrics. Students abandoned it within 3 days.
  - Siddharth ruthlessly subtracted the scope down to 3 visual micro-sliders taking under 30 seconds daily, restoring 94% retention.
• **Key Takeaway:** Zero-knowledge cryptographic guarantees build emotional trust faster than any marketing copy.`;
  }

  // 3. TOPIC: FLOOR PLAN TO 3D VIEWER
  if (q.includes('floor plan') || q.includes('floorplan') || q.includes('3d viewer') || q.includes('three.js') || q.includes('spatial')) {
    return `**Floor Plan to 3D Viewer Prototype (Spatial Web & Three.js)**

A browser-based tool that parses static 2D architectural blueprint vectors and extrudes them into an interactive 3D WebGL spatial model in real time.

• **The Core Problem:** Most home renovators and buyers struggle to understand spatial scale from flat 2D blueprint lines.
• **Technical Approach:**
  - Vector path parsing and vertex winding order validation in WebGL.
  - Three.js ExtrudeGeometry with normal vector calculations at fixed 2.8m wall heights.
  - Constructive Solid Geometry (CSG) mesh subtractions for parametric window and door openings.
  - PBR glass and architectural shaders running smoothly at 60 FPS on integrated GPUs.
• **Hard Engineering Lesson:**
  - Complex boolean CSG operations on irregular polygon contours initially crashed the WebGL rendering context. Resolved by pre-validating winding order and tessellating complex polygons into simpler convex sets before extrusion.`;
  }

  // 4. TOPIC: WISPR FLOW / VOICE VELOCITY
  if (q.includes('why wispr') || q.includes('wispr flow') || q.includes('voice velocity') || q.includes('why flow')) {
    return `**Why Wispr Flow? The Voice Velocity Thesis**

Siddharth is building for Wispr Flow because voice is the highest-bandwidth modality human beings have evolved for externalizing thought (speaking at 150+ WPM vs keyboard typing at 40 WPM).

• **Operating System Ergonomics:** Most AI startups build isolated chatbot wrappers in browser tabs, forcing users into disruptive context switching. Wispr Flow operates ambiently at the OS layer, enhancing every workflow—Cursor, Slack, Linear, Notion—directly at the cursor.
• **India Growth Crucible:** India represents the world's most dynamic proving ground with 1.4B multilingual citizens, massive student/developer density, and rapid collegiate tech adoption.
• **What Siddharth Brings:** A rare combination of working prototype builder execution (GoDuet, zero-knowledge crypto), empathy-driven design, and grassroots collegiate growth playbooks (Campus Voices, Founder Mode, Creator Challenge).`;
  }

  // 5. TOPIC: FAILURES & HARD LESSONS
  if (q.includes('failure') || q.includes('mistake') || q.includes('learn from failure') || q.includes('wrong')) {
    return `**Siddharth's Biggest Failure & Hardest Lesson**

During the initial live trials of GoDuet with hostel mates, Restaurant A prepared burgers in 8 minutes while Restaurant B took 28 minutes for biryani. Couriers arrived with cold, soggy burgers.

"That failure taught me that **software design without physical operational physics is wishful thinking**. I stopped assuming happy paths and redesigned the bundling logic around strict kitchen prep-time tolerance bands."

His motto: *"Every failure creates a better version."*`;
  }

  // 6. TOPIC: GENERAL RECRUITER QA MATCH
  const directMatch = RECRUITER_QA.find(
    (qa) =>
      qa.question.toLowerCase().includes(q) ||
      qa.relatedTags.some((tag) => q.includes(tag.toLowerCase()))
  );

  if (directMatch) {
    return `${directMatch.shortAnswer}\n\n${directMatch.detailedAnswer}`;
  }

  // 7. GENERAL OVERVIEW (Only if asked generally about all projects or who he is)
  if (q.includes('built') || q.includes('project') || q.includes('portfolio') || q.includes('who are you') || q.includes('tell me about yourself')) {
    return `Siddharth Singh is a builder, product explorer, and creative technologist applying for the **Wispr Flow India Hiring Challenge 2026**.

His documented prototypes include:
1. **GoDuet (Food Tech Logistics):** Multi-restaurant shared cart platform with 600m micro-hub clustering and optimistic distributed state machines.
2. **Private Wellness Check-in (Privacy Tech):** Zero-knowledge client-side mental health tracker with AES-256-GCM encryption.
3. **Floor Plan to 3D Viewer (Spatial Web):** WebGL Three.js real-time extrusion of 2D blueprint contours into 3D at 60 FPS.
4. **Wispr Flow India Growth Lab:** 3 strategic GTM campaigns: *Campus Voices*, *Founder Mode*, and *Creator Challenge*.

Ask about any of these specific projects, and I will dive straight into the technical decisions, architecture, and operational lessons!`;
  }

  // 8. UNGROUNDED / UNVERIFIED TOPIC REFUSAL
  return `I don't have records of that in Siddharth's verified portfolio.

Siddharth's documented builder work focuses on:
- **GoDuet:** Multi-restaurant shared delivery logistics & distributed cart state.
- **Private Wellness Check-in:** Client-side AES-256-GCM zero-knowledge student privacy.
- **Floor Plan to 3D Viewer:** WebGL Three.js spatial extrusion from 2D vectors.
- **Wispr Flow Growth Campaigns:** Campus Voices, Founder Mode, and Creator Challenges.

Ask me about **GoDuet**, and I'll explain its architecture and operational challenges directly!`;
}