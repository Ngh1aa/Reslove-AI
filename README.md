# Resolve AI — Human-Governed Support Operations

Resolve AI is an interactive product prototype for AI-assisted customer support where consequential actions remain visible, permissioned and human-governed.

## Product thesis

AI support should not optimize only for deflection or speed. The interface makes **source → permission → proposed action → approval → recorded outcome** inspectable so a human operator can understand and control consequential actions.

The flagship scenario is a $480 refund:

1. the agent retrieves a simulated order;
2. it checks a simulated policy source;
3. it proposes a refund action;
4. a human approval gate is required above the $250 threshold;
5. approve/reject becomes explicit UI state and audit context.

No real customer, order, refund or support API is connected.

## Technical proof

This repository is intentionally a real **Next.js + React + TypeScript** implementation rather than a static prototype labeled as one.

- Next.js `16.3.6` App Router
- React `19.3.0`
- TypeScript `7.0.2` with `strict: true`
- typed client interaction state in `components/resolve-workspace.tsx`
- server Route Handler at `app/api/health/route.ts`
- production build gate with `next build`
- independent TypeScript gate with `tsc --noEmit`

The migration preserves the existing product concept and visual system instead of replacing it with a framework demo.

## Run locally

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

Validation commands:

```bash
npm run typecheck
npm run build
```

## Evidence boundary

Verified by source/CI when the relevant checks pass:

- the repository uses Next.js, React and TypeScript;
- the product renders through App Router;
- interaction state is implemented in React rather than DOM string injection;
- a typed server endpoint exists;
- production build and typecheck complete.

Not claimed:

- production customer usage;
- live AI/LLM calls;
- real refunds or external tool execution;
- authentication, database, billing or enterprise security readiness;
- business impact, support deflection or resolution improvement.

## Why this exists in the portfolio

The project demonstrates the bridge from **product/design decisions → typed component implementation → stateful interaction → server route → verifiable build**. AI can assist implementation and review, while product authority, evidence boundaries and release judgment remain human-owned.
