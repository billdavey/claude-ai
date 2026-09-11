# CI/CD with GitHub, Neon, and Vercel

This guide describes the planned delivery pipeline for the SvelteKit application.

## Responsibilities

- **Local development:** Run the application and checks locally.
- **GitHub Pull Requests:** Review and control changes entering `main`.
- **GitHub Actions:** Continuous Integration (CI): validate code, tests, and builds.
- **Vercel:** Preview and production deployments.
- **Neon:** Hosted database environments for preview and production.

## Environments

| Environment | Application                  | Database                    |
| ----------- | ---------------------------- | --------------------------- |
| Local       | Local SvelteKit dev server   | Local SQLite `local.db`     |
| Preview     | Vercel preview deployment    | Neon preview/staging branch |
| Production  | Vercel production deployment | Neon production branch      |

Do not use the local SQLite database or the production Neon database for Vercel previews.

## Local Development

Use the repository's `pnpm-lock.yaml` and run:

```sh
pnpm install
pnpm dev
```

Before opening a pull request, run the relevant checks:

```sh
pnpm check
pnpm lint
pnpm test:unit -- --run
pnpm test:e2e
pnpm build
```

Keep `.env` local-only. `.env.example` should document required variable names without containing secrets.

## Pull Request Workflow

Use a feature branch for each change:

```text
feature branch -> pull request -> main
```

For a new change:

```sh
git switch -c feature/my-change
# make and test changes
git push -u origin feature/my-change
```

Then open a pull request on GitHub with:

- Base branch: `main`
- Compare branch: the feature branch
- A summary of the change
- Testing performed

GitHub Actions starts when the pull request is created or updated.

## GitHub Actions CI

Add a workflow at `.github/workflows/ci.yml`. It should run on pull requests and pushes to `main` and should:

1. Check out the repository.
2. Install the pinned pnpm version.
3. Install Node.js and cache pnpm dependencies.
4. Run `pnpm install --frozen-lockfile`.
5. Run `pnpm check`.
6. Run `pnpm lint`.
7. Run unit tests.
8. Install the Playwright browser and run end-to-end tests.
9. Run `pnpm build`.

CI should use a temporary SQLite database and placeholder OAuth values. It must not require production secrets.

The workflow runs on a temporary GitHub-hosted runner. GitHub reads the YAML file, creates the runner, executes its steps, and reports success or failure on the pull request.

## GitHub Repository Controls

Protect the `main` branch with a ruleset or branch protection rule:

- Require pull requests before merging.
- Require the CI job to pass.
- Require branches to be up to date before merging.
- Block force pushes and branch deletion.

Dependabot can be enabled for npm packages and GitHub Actions dependencies.

## Vercel Preview and Production

Connect the GitHub repository to Vercel. Vercel can then:

- Create a preview deployment for each pull request.
- Deploy the `main` branch to production after it is merged.
- Provide deployment history and rollback support.

GitHub Actions validates the change; Vercel builds and hosts it. These are separate systems.

Configure Vercel variables by environment:

```text
Preview:
DATABASE_URL=<preview Neon connection string>
BETTER_AUTH_SECRET=<preview-only secret>
ORIGIN=<preview application URL or configured preview domain>

Production:
DATABASE_URL=<production Neon connection string>
BETTER_AUTH_SECRET=<production-only secret>
ORIGIN=<production domain>
```

Use separate GitHub OAuth credentials or callback configuration for preview and production when OAuth is enabled.

Before deploying to Vercel, select the Vercel-specific SvelteKit adapter instead of relying on `adapter-auto`.

## Neon Branches

Neon branches are isolated, writable database environments created from a snapshot. Each branch has its own connection string, schema state, and data changes, although Neon uses copy-on-write storage internally.

They resemble Git branches when created, but they do not merge like Git branches:

- Data changes are not automatically merged.
- Schema changes should be promoted through migration files.
- Preview migrations should be tested before applying them to production.
- A persistent preview/staging branch is simpler initially than one branch per pull request.

Recommended structure:

```text
Neon project
├── production branch
└── preview/staging branch
```

A preview branch should mirror the production schema, but it should not normally contain live user data. Use sanitized or seeded data where possible.

## Database Migration Order

Apply schema changes in this order:

```text
Create migration
    -> apply to preview Neon branch
    -> run CI and test the Vercel preview
    -> merge the pull request
    -> apply the approved migration to production
    -> deploy the application
```

Do not point Vercel at the local `local.db`. Vercel's filesystem is ephemeral and is not suitable for a shared production database. The current SQLite setup can remain for local development, while Neon provides the hosted database required by preview and production.

## Target Operating Model

```text
Local branch
    -> local checks
    -> push feature branch
    -> GitHub pull request
    -> GitHub Actions CI
    -> Vercel preview + manual review
    -> merge into protected main
    -> Vercel production deployment
```

This starts as Continuous Delivery: every approved merge produces a tested, deployable production release. It can later become Continuous Deployment by automatically promoting successful `main` builds after optional smoke tests and approval gates.

## Current Status

The repository has not yet had the GitHub Actions workflow implemented. The CI/CD setup described here is the planned architecture and configuration sequence.
