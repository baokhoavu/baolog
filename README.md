# Baolog

A Next.js and WordPress headless CMS based Website using GraphQL for data binding.

This website showcases Next.js's using [WordPress](https://wordpress.org) as the data source in order to display and render copy and posts. Using Wordpress' GraphQL instead of Wordpress' Rest API, we can configure our query to be cleaner and more defined. Tailwind is applied for styles and layout.

## Demo

### [https://baolog.vercel.app/](https://baolog.vercel.app/)

### Tools and Services

-   [Create React App](https://github.com/facebook/create-react-app)
-   [Next](https://github.com/vercel/next.js/)
-   [WordPress](https://github.com/WordPress/WordPress)
-   [GraphQL](https://github.com/graphql)
-   [Tailwind](https://github.com/tailwindlabs/tailwindcss)
-   [Styled Components](https://styled-components.com)
-   [Vercel](https://vercel.com?utm_source=pulakchakraborty)

### Step 3. Set up environment variables

Copy the `.env.local.example` file in this directory to `.env.local` (which will be ignored by Git):

```bash
cp .env.local.example .env.local
```

Then open `.env.local` and set `WORDPRESS_API_URL` to be the URL to your GraphQL endpoint in WordPress. For example: `https://myapp.wpengine.com/graphql`.

Your `.env.local` file should look like this:

```bash
WORDPRESS_API_URL=...

# Only required if you want to enable preview mode
# WORDPRESS_AUTH_REFRESH_TOKEN=
# WORDPRESS_PREVIEW_SECRET=
```

### Step 4. Run Next.js in development mode

```bash
npm install
npm run dev

# or

yarn install
yarn dev
```

Your blog should be up and running on [http://localhost:3000](http://localhost:3000)! If it doesn't work, post on [GitHub discussions](https://github.com/vercel/next.js/discussions).
