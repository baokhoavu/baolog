import PostPreview from '../components/post-preview'

export default function MoreStories({ posts }) {
  if (!posts || posts.length === 0) return null;
  
  return (
    <section className="flex flex-col items-center w-full">
      <div className="w-full max-w-7xl">
        <h2 className="mb-8 text-6xl md:text-7xl font-bold tracking-tighter leading-tight text-center">
          More Stories
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 lg:gap-16 mb-32 w-full justify-items-center">
          {posts.map(({ node }) => (
            <PostPreview
              key={node.slug}
              title={node.title}
              coverImage={node.featuredImage?.node}
              date={node.date}
              author={node.author?.node}
              slug={node.slug}
              excerpt={node.excerpt}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
