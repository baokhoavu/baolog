export default function Avatar({ author }) {
  const name = author
    ? author.firstName && author.lastName
      ? `${author.firstName} ${author.lastName}`
      : author.name
    : null;
  const fallback = 'https://placehold.co/48x48?text=No+Avatar';
  const avatarUrl = author?.avatar?.url || fallback;
  return (
    <>
      {author && (
        <div className="flex items-center">
          <img
            src={avatarUrl}
            className="w-12 h-12 rounded-full mr-4"
            alt={name}
          />
          <div className="text-xl font-bold">{name}</div>
        </div>
      )}
    </>
  );
}
