# sv

Everything you need to build a Svelte project, powered by [`sv`](https://github.com/sveltejs/cli).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```sh
# create a new project
npx sv create my-app
```

To recreate this project with the same configuration:

```sh
# recreate this project
npx sv@0.17.0 create --template minimal --types ts --add prettier eslint vitest="usages:unit,component" playwright tailwindcss="plugins:typography,forms" sveltekit-adapter="adapter:auto" drizzle="database:sqlite+sqlite:better-sqlite3" better-auth="demo:password,github" ai-tools="ide:opencode,vscode+tools:mcp,svelte-code-writer,svelte-core-bestpractices,svelte-file-editor+mcpSetup:remote" experimental="versions:none+features:async,remoteFunctions" --no-install claude-ai
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```sh
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```sh
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.

allowBuilds:
better-sqlite3: true
esbuild: true

## Syncing remote main to local main

You do not need to merge manually in both places. The GitHub merge updates origin/main; sync your local repository afterward:

```sh
git switch main
git pull --ff-only origin main
```

Then verify:

```sh
git status
git log --oneline -5
```

If you no longer need the feature branch locally:

```sh
git branch -d feature/profile-update
```

GitHub may automatically delete the remote feature branch. If not:

```sh
git push origin --delete feature/profile-update
```

Use git pull --ff-only to avoid creating an unnecessary local merge commit.

Git updates your local main only if it can move the branch pointer forward without creating a merge commit.

If your local branch has diverged from origin/main, Git stops and reports an error instead of automatically merging. This keeps history linear and avoids an unexpected merge commit.

To inspect the divergence:

```sh
git status
git log --oneline --graph --decorate --all
```
