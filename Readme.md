# Craftbook — A Dedicated Visual-First Platform for Artists

**One-line tagline:** *Where craft meets community — a high-fidelity social space made for sketch artists, painters, and traditional creatives.*

---

## 1. Project Snapshot
**Title:** Craftbook — A Dedicated Visual-First Platform for Artists

**Prepared by:** Amanjeet – 2024-B-31102004

**Elevator pitch:** A mobile-first social app that preserves artwork quality, encourages meaningful critique through visual annotations, and helps artists sell and collaborate — without the noise of mainstream social networks.

---

## 2. Problem Statement — Why this app must exist
Many general-purpose social networks treat artworks as generic posts. This creates several problems:

- **Image degradation:** High-quality artworks are heavily compressed and lose important detail.
- **Shallow engagement:** "Likes" dominate while constructive critique is rare.
- **Poor discovery:** Niche mediums and traditional techniques are hard to find.
- **Monetization friction:** Artists struggle to list and manage commissions or sales.

**Goal:** Build a focused platform that preserves craft, encourages improvement, and enables monetization for artists.

---

## 3. Proposed Solution (Core Concept)
A mobile and web platform that:

- Accepts lossless high-resolution uploads and supports time-lapse/process posts.
- Enables **annotation-based critique** so feedback can be visual and actionable.
- Provides in-app commerce for commissions, prints, and originals.
- Surfaces artists by medium and skill — improving discovery and collaborations.

**Key benefit:** Artists get a curated environment designed around their workflow, not general social metrics.

---

## 4. Key Features (Clear, bite-sized items)
1. **Lossless Upload & Zoomable Viewer** — Upload high-res images with optional watermarking.
2. **Process Stages & Time-lapse** — Multi-step posts that show evolution from sketch to final.
3. **Annotation Critique Mode** — Draw-on-image feedback (public or private) with versioned replies.
4. **Commission & Storefront** — Commission requests, direct sales, and order tracking.
5. **Explore by Medium & Curated Challenges** — Powerful filters and community-driven events.
6. **Collab Board & Matchmaking** — Post project invites and find collaborators by skill and style.

---

## 5. Target Users / Personas
**Primary users:**
- *Raj — The College Sketch Artist* (age 20): Shares process to get critique and build a portfolio.
- *Sana — Professional Painter & Seller* (age 28): Wants to sell originals and get commission requests.
- *Mr. Verma — Gallery Curator* (age 42): Looks for emerging talent and commissions work.

**Audience:** Artists (traditional & digital), students, collectors, galleries, and art teachers.

---

## 6. Representative User Stories
- As an artist, I want to upload a multi-stage post so viewers can follow my process.
- As a peer, I want to annotate a painting to point out shading suggestions.
- As a collector, I want to request a commission and securely pay within the app.
- As a curator, I want to search by medium and skill level to discover new artists.

---

## 7. Technology Stack (Concise)
**Mobile:** React Native or Flutter
**Web:** React + Tailwind
**Backend:** Node.js (Express) or Django
**DB:** PostgreSQL + S3-compatible media storage
**Realtime:** Socket.IO or Firebase
**Media tools:** Sharp / Pillow + FFmpeg
**Payments:** Stripe / Razorpay
**Search:** Algolia or ElasticSearch
**CI/CD & Hosting:** Docker, GitHub Actions, AWS / DigitalOcean

---

## 8. MVP — What we must deliver first
**MVP Scope (must-haves):**
- Signup / Login and artist profile
- Upload high-res artwork with multi-image posts
- Zoomable viewer and basic watermark
- Public comments + simple annotation feedback
- Explore by medium and basic search
- Commission request form (sandboxed payment)

**MVP Success criteria:**
- Able to upload and view high-res art without perceptible quality loss.
- Users can leave at least 10 annotations across 5 different artworks.
- Commission flow completes end-to-end in a sandbox.

---

## 9. Timeline & Milestones (10-week plan)

| Week | Milestone |
|------|-----------|
| 1–2  | Research, UX wireframes, user flows, design system |
| 3–4  | Backend models, auth, media storage, DB schema |
| 5–6  | Mobile feed, upload flow, zoomable viewer |
| 7    | Annotation layer, real-time updates, messaging |
| 8    | Commission flow & payment sandbox integration |
| 9    | Testing (QA), performance tuning for media |
| 10   | Deployment, demo build, documentation |

---

## 10. UI / Navigation — Quick flow
1. **Onboarding** → Choose art type & interests
2. **Home Feed** → Infinite scroll of curated and followed artists
3. **Post View** → Full-res viewer, comments, and Critique toggle
4. **Upload** → Select images/video → add stages, tags, price
5. **Discover** → Filter by medium, challenges, and trending
6. **Profile** → Portfolio, store, reviews, collab board

---

## 11. Measurements of Success (KPIs)
- DAU/MAU of artists and collectors
- Avg time spent on a post (longer indicates deeper engagement)
- Number of annotation critiques per week
- Commission conversion rate (requests → paid orders)
- Retention at 7/30/90 days

---

## 12. Risks & Mitigations
- **Risk:** Large uploads degrade performance. **Mitigation:** Server-side image optimization + progressive loading.
- **Risk:** Abuse and copyright infringement. **Mitigation:** Watermarking, report flows, and moderation tools.
- **Risk:** Payment disputes. **Mitigation:** Escrow-style flow and dispute resolution guidelines.

---

## 13. Next Steps (Short checklist)
- [ ] Create 6 wireframe screens (Onboarding, Home, Post View, Upload, Discover, Profile)
- [ ] Build backend models and media pipeline
- [ ] Implement annotation prototype
- [ ] Integrate sandbox payments for commissions

---

## 14. Deliverables

- Wireframes (Figma/PNG) — optional next step
- Mobile & backend source code (MVP)
- Demo video & deployment guide

---

## 15. Additional Considerations
- **User Privacy:** Implement robust privacy settings for artists to control who can view their work.
- **Content Moderation:** Develop guidelines and tools for community moderation to maintain a positive environment.
- **Scalability:** Plan for scaling the platform to accommodate a growing user base and increasing media uploads.
