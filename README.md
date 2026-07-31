# AURA — Autonomous Urban Risk Assessment

AURA is a progressive web app that recommends lower-risk travel routes, monitors active journeys, and initiates emergency escalation automatically — without requiring the user to act once an anomaly is detected.

Built for women and other vulnerable travelers navigating unfamiliar or poorly lit routes, particularly at night.

---

## The Problem

Existing navigation apps optimize for time and distance, not safety. Existing safety apps typically depend on manual activation — a design that fails precisely when the user is incapacitated and can't press a button.

AURA addresses both gaps: safety-aware routing by default, and escalation that doesn't depend on the user being able to act.

## How It Works

```
Destination Input → Risk-Scored Route Options → Start Monitored Journey → Continuous Monitoring → Alert Escalation
```

1. **Destination Input** — the user enters where they're going.
2. **Risk-Scored Route Options** — AURA returns 2–3 routes, each with an explainable, per-segment risk score.
3. **Start Monitored Journey** — the user selects a route and AURA begins tracking it.
4. **Continuous Monitoring** — periodic location checks, deviation detection, and confirmation prompts run in the background.
5. **Alert Escalation** — a missed confirmation or lost connection triggers an automatic alert. No manual action required.

## Core Features

| Feature | Description |
|---|---|
| **Risk-Scored Routing** | Routes are split into segments, each scored from incident history, lighting, and time of day, and shown as a color-graded path — not a single safe/unsafe label. |
| **Community Reports** | Structured, category-constrained incident reporting. Reports gain confidence through repeated confirmation, recency, and moderator review — never treated as fact on submission. |
| **Journey Guardian** | Monitors active journeys, verifies location, detects deviations, and confirms arrival. Escalates automatically on missed confirmation or lost location updates. |
| **Control Room Dashboard** | Real-time moderator view of active journeys, an alert timeline, and report moderation, plus a query assistant restricted to verified application data. |
| **Drone Utility** | An implemented, architecturally decoupled module that dispatches a simulated aerial unit to provide visual confirmation at an emergency location, to support — not replace — human responders. |

## Architecture

AURA is built as five independent modules, each developed end-to-end (interface and logic) by a single owner, against a shared specification agreed upfront. This allows parallel development without blocking on other modules. All five integrate into one application shell under a single design system, combined in incremental stages rather than a single merge at the end.

```
Routes & Risk Engine   ─┐
Community Reports      ─┤
Journey Guardian        ├──►  Unified Application Shell
Control Room Dashboard ─┤
Drone Utility           ─┘
```

### Module Breakdown

**1. Routes & Risk Engine**
Destination search, risk-scored route generation, per-segment explanations, and nearby verified support points.
`Python backend · open-source routing engine · shared relational database · lightweight web frontend`

**2. Community Reports**
Structured incident reporting with confidence-based scoring, a moderation queue, and integration with flagged camera-detected events.
`Python backend · shared database · category-constrained report form`

**3. Journey Guardian & Emergency Alerting**
Journey monitoring, deviation and missed-arrival detection, manual alerting, and opted-in volunteer notification. Escalation is system-initiated, not user-triggered.
`Python backend · location-update service · push notifications`

**4. Control Room Dashboard**
Moderator interface for active journeys, alert timelines, and report moderation, plus a data-constrained query assistant.
`Python backend · restricted, tool-based LLM integration`

**5. Drone Utility** *(implemented, decoupled)*
Simulated aerial dispatch for visual confirmation at an emergency location. Fully implemented and architecturally isolated from the core alerting pathway, so its failure never affects core functionality.
`Flight simulation environment · single unidirectional trigger`

## Design Principles

- **Explainable, not absolute.** Risk is shown as a color-graded path, never a single safe/unsafe verdict.
- **System-initiated escalation.** Alerts don't require the user to act — built for the moment they can't.
- **Nothing is fact on arrival.** Community reports earn confidence through confirmation, recency, and moderation.
- **Traceable answers only.** The dashboard assistant never asserts safety independently — every response maps to a verified data query.
- **Decoupled, never a dependency.** The drone utility and camera-analytics features are architecturally isolated from the core safety pathway — implemented, but never a point of failure for it.

## Feasibility

AURA is built entirely on established, well-documented technologies — no unproven research required. Core resources: a small dev team, routing/map data, a hosted database, a notification service, and test devices. Functionality is organized by priority tier, so the core product remains fully operational even if the drone utility is unavailable.

## Known Risks & Limitations

- Route and report quality depends on community report volume — sparse in low-activity areas.
- Volunteer alerting needs real adoption to be effective early on.
- Continuous location tracking raises real privacy and battery-consumption trade-offs.
- The drone utility is implemented in simulation; real-world flight deployment would still need regulatory approval beyond this prototype.
- Sparse or outdated data can produce a misleadingly favorable risk score — arguably worse than showing no score.

## Status

This project was built as a hackathon prototype. Routing, monitoring, alerting, and the drone utility are all implemented; the drone utility remains architecturally decoupled from the core alerting pathway by design, not because it is incomplete.

## Team

Built by **Ellipsis**

## License

Licensed under the [MIT License](LICENSE).
