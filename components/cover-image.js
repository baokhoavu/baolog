import cn from 'classnames'
import Link from 'next/link'

export default function CoverImage({ title, coverImage, slug }) {
  const fallback = 'https://placehold.co/800x400?text=No+Image';
  const imageUrl = coverImage?.sourceUrl || fallback;
  const image = (
    <img
      src={imageUrl}
      className={cn('shadow-small', {
        'hover:shadow-medium transition-shadow duration-200': slug,
      })}
      alt={title}
    />
  );
  return (
    <div className="sm:mx-0">
      {slug ? (
        <Link legacyBehavior as={`/posts/${slug}`} href="/posts/[slug]">
          <a aria-label={title}>{image}</a>
        </Link>
      ) : (
        image
      )}
    </div>
  )
}
