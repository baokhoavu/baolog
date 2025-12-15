import Head from "next/head";
import Container from "../components/container";
import MoreStories from "../components/more-stories";
import HeroPost from "../components/hero-post";
import Intro from "../components/intro";
import Layout from "../components/layout";
import { getAllPostsForHome } from "../lib/api_core";
import { TITLE } from "../lib/constants";

export default function Index({ allPosts: { edges }, preview }) {
    const heroPost = edges[0]?.node;
    const morePosts = edges.slice(1);

    return (
        <Layout preview={preview}>
            <Container>
                <Intro />
                {heroPost && (
                    <HeroPost
                        title={heroPost.title}
                        coverImage={heroPost.featuredImage?.node}
                        date={heroPost.date}
                        author={heroPost.author?.node}
                        slug={heroPost.slug}
                        excerpt={heroPost.excerpt}
                    />
                )}
                {morePosts.length > 0 && <MoreStories posts={morePosts} />}
            </Container>
        </Layout>
    );
}

export async function getStaticProps({ preview = false }) {
    try {
        const allPosts = await getAllPostsForHome(preview);
        return { props: { allPosts, preview } };
    } catch (err) {
        console.error('getStaticProps index error:', err && err.stack ? err.stack : err);
        return { props: { allPosts: { edges: [] }, preview } };
    }
}
