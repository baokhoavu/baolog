Sanity setup (example)

This file shows a minimal Sanity Studio schema and the environment variables required to run your Next.js site with live Sanity content.

1) Create a new Sanity project / Studio

  - Install Sanity CLI (global):
    ```bash
    npm install -g @sanity/cli
    ```

  - Create a new Studio (choose a project name):
    ```bash
    npx create-sanity@latest
    # or
    sanity init
    ```

  - Inside the studio folder, place the example schemas from `sanity/schemas/` into `./schemas` and export them from `schema.js` (the example `index.js` above uses `schemaTypes`).

2) Environment variables (for Next.js and Studio)

  Required for Next.js front-end (set in Vercel or in `.env.local` in the Next project root):

  - `SANITY_PROJECT_ID` — your Sanity project id (string)
  - `SANITY_DATASET` — dataset name (usually `production`)
  - `SANITY_READ_TOKEN` — optional, a read token for preview/drafts (create via Manage → API)
  - `SANITY_API_VERSION` — optional ISO date (e.g. `2025-01-01`)

  Example `.env.local` (Next root):

  ```text
  SANITY_PROJECT_ID=yourProjectId
  SANITY_DATASET=production
  SANITY_READ_TOKEN=
  SANITY_API_VERSION=2025-01-01
  ```

3) Start Sanity Studio (dev)

  In the Studio folder:
  ```bash
  sanity start
  ```

4) Seed content

  - Use the Studio UI to create authors, categories and posts using the fields defined in `sanity/schemas`.

5) Run Next.js locally and build

  - For development (reads data from Sanity CDN):
    ```bash
    # set env (powershell example)
    $env:SANITY_PROJECT_ID='yourProjectId'
    $env:SANITY_DATASET='production'
    npm run dev
    ```

  - For production build and serve locally:
    ```bash
    # create .env.local with the SANITY_* values, then:
    npm run build
    npm start
    ```

6) Vercel deployment

  - Add the same `SANITY_*` environment variables in Vercel project settings.
  - Deploy the Next.js project to Vercel; the front-end will fetch content from Sanity.

Notes

  - The example `lib/sanity.js` in the project uses `createClient` and will fall back cleanly if `SANITY_PROJECT_ID` is not set, allowing local builds without a Sanity project.
  - Adjust the Sanity schemas to match any custom fields you need.
