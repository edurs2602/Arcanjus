<!--
Sync Impact Report
- Version change: 0.0.0 → 1.0.0
- Added principles: Test-First, Simplicity, Observability, Security, Clean Architecture
- Added sections: Technology Standards, Development Workflow
- Added: Governance rules
- Templates requiring updates:
  - .specify/templates/plan-template.md ✅ no changes needed (generic)
  - .specify/templates/spec-template.md ✅ no changes needed (generic)
  - .specify/templates/tasks-template.md ✅ no changes needed (generic)
- Follow-up TODOs: none
-->

# Arcanjus Constitution

## Core Principles

### I. Test-First

All feature work MUST begin with failing tests that define expected behavior
before implementation begins. Red-Green-Refactor cycle is enforced:
tests written and failing first, then minimal implementation to pass,
then refactor. No code merges without passing test coverage for the
changed behavior.

### II. Simplicity

Start with the simplest solution that meets requirements. YAGNI applies:
do not build for hypothetical future needs. Prefer fewer abstractions,
flat structures, and direct code paths. Complexity MUST be justified
in writing (plan or PR description) before introduction.

### III. Observability

All services MUST emit structured logs (JSON) with correlation IDs.
Errors MUST surface clearly via stderr or structured error responses.
Health checks and basic metrics endpoints are required for any deployed
service. Debug-ability takes priority over cleverness.

### IV. Security

OWASP Top 10 vulnerabilities MUST be addressed by design. Input
validation at system boundaries is mandatory. Secrets MUST NOT appear
in code, logs, or version control. Dependencies MUST be kept up to date
and audited for known vulnerabilities.

### V. Clean Architecture

Business logic MUST be independent of frameworks, databases, and
delivery mechanisms. Dependencies point inward: outer layers depend on
inner layers, never the reverse. Each module MUST have a single clear
responsibility. Interfaces define contracts between layers.

## Technology Standards

- **Language**: TypeScript (strict mode enabled)
- **Runtime**: Node.js (LTS)
- **Package Manager**: npm or pnpm (consistent across project)
- **Linting**: ESLint with strict rules
- **Formatting**: Prettier (enforced via pre-commit)
- **Testing**: Vitest or Jest for unit/integration tests
- **Type Safety**: No `any` types without explicit justification

## Development Workflow

- Feature branches follow naming convention: `###-feature-name`
- All changes require passing CI before merge
- Code review is mandatory for production-bound changes
- Commits MUST be atomic and descriptive (conventional commits preferred)
- Breaking changes MUST be documented in the PR description
- Deploy from main branch only after all checks pass

## Governance

This constitution is the highest-authority document for project decisions.
All PRs, code reviews, and architectural choices MUST comply with the
principles above. Deviations require explicit justification and team
consensus.

**Amendment Process**:
1. Propose change via PR modifying this file
2. Document rationale for the change
3. Version bump according to semver (MAJOR for principle removal/redefinition,
   MINOR for additions, PATCH for clarifications)
4. Update dependent templates if principle names or requirements change

**Compliance Review**: Each PR review MUST verify alignment with
applicable principles. Reviewers SHOULD cite the relevant principle
when requesting changes.

**Version**: 1.0.0 | **Ratified**: 2026-05-16 | **Last Amended**: 2026-05-16
