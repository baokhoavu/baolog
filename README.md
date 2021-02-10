# A statically generated blog example using Next.js and WordPress - Baolog

This example showcases Next.js's [Static Generation](https://nextjs.org/docs/basic-features/pages) feature using [WordPress](https://wordpress.org) as the data source in order to display and render copy and posts. Using Wordpress' GraphQL instead of Wordpress' Rest API, we can configure our query to be cleaner and more defined. Tailwind is applied for styles and layout.

## Demo

### [https://baokhoavu.com/Baolog](https://baokhoavu.com/Baolog)

## Deploy your own

Once you have access to [the environment variables you'll need](#step-3-set-up-environment-variables), deploy the example using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme&utm_campaign=next-example):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/git/external?repository-url=https://github.com/vercel/next.js/tree/canary/examples/cms-wordpress&project-name=cms-wordpress&repository-name=cms-wordpress&env=WORDPRESS_API_URL&envDescription=Required%20to%20connect%20the%20app%20with%20WordPress&envLink=https://vercel.link/cms-wordpress-env)

Execute [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) with [npm](https://docs.npmjs.com/cli/init) or [Yarn](https://yarnpkg.com/lang/en/docs/cli/create/) to bootstrap the example:

```bash
npx create-next-app --example cms-wordpress cms-wordpress-app
# or
yarn create next-app --example cms-wordpress cms-wordpress-app
```

## Configuration

### Step 1. Prepare your WordPress site

First, you need a WordPress site. There are many solutions for WordPress hosting, such as [WP Engine](https://wpengine.com/) and [WordPress.com](https://wordpress.com/).

Once the site is ready, you'll need to install the [WPGraphQL](https://www.wpgraphql.com/) plugin. It will add GraphQL API to your WordPress site, which we'll use to query the posts. Follow these steps to install it:

-   Download the [WPGraphQL repo](https://github.com/wp-graphql/wp-graphql) as a ZIP archive.
-   Inside your WordPress admin, go to **Plugins** and then click **Add New**.
-   Click the **Upload Plugin** button at the top of the page and upload the WPGraphQL plugin.
-   Once the plugin has been added, activate it from either the **Activate Plugin** button displayed after uploading or from the **Plugins** page.

#### Optional: Add WPGraphiQL

The [WPGraphiQL](https://github.com/wp-graphql/wp-graphiql) plugin gives you access to a GraphQL IDE directly from your WordPress Admin, allowing you to inspect and play around with the GraphQL API.

The process to add WPGraphiQL is the same as the one for WPGraphQL: Go to the [WPGraphiQL repo](https://github.com/wp-graphql/wp-graphiql), download the ZIP archive, and install it as a plugin in your WordPress site. Once that's done you should be able to access the GraphiQL page in the admin:

### Step 2. Populate Content

Inside your WordPress admin, go to **Posts** and start adding new posts:

-   We recommend creating at least **2 posts**
-   Use dummy data for the content
-   Pick an author from your WordPress users
-   Add a **Featured Image**. You can download one from [Unsplash](https://unsplash.com/)
-   Fill the **Excerpt** field

When you’re done, make sure to **Publish** the posts.

> **Note:** Only **published** posts and public fields will be rendered by the app unless [Preview Mode](https://nextjs.org/docs/advanced-features/preview-mode) is enabled.

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
