# Baolog

A modern Next.js blog application using Sanity as a headless CMS for content management. This project demonstrates headless architecture with GraphQL data binding, featuring responsive design with Tailwind CSS.

## Features

- **Headless CMS Integration**: Powered by Sanity for flexible content management
- **Static Site Generation**: Optimized performance with Next.js SSG
- **Responsive Design**: Mobile-first styling with Tailwind CSS
- **GraphQL Queries**: Efficient data fetching with clean, defined queries
- **Preview Mode**: Draft content preview capabilities

## Demo

[https://baolog.vercel.app/](https://baolog.vercel.app/)

## Technologies

- [Next.js](https://github.com/vercel/next.js/) - React framework for production
- [Sanity](https://www.sanity.io/) - Headless CMS
- [Tailwind CSS](https://github.com/tailwindlabs/tailwindcss) - Utility-first CSS framework
- [Vercel](https://vercel.com/) - Deployment platform

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/baolog.git
   cd baolog
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**

   Copy the example environment file and configure your Sanity credentials:

   ```bash
   cp .env.sanity.example .env.local
   ```

   Edit `.env.local` with your Sanity project details:

   ```bash
   SANITY_PROJECT_ID=your_project_id
   SANITY_DATASET=production
   SANITY_READ_TOKEN=your_read_token  # optional, for drafts
   SANITY_API_VERSION=2025-01-01
   ```

4. **Run in development mode**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

   Your blog will be available at [http://localhost:3000](http://localhost:3000)

## Deployment

Deploy to Vercel with your environment variables set in the dashboard.

## License

This project is licensed under the MIT License.
