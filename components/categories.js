export default function Categories({ categories }) {
  return (
    <span className="ml-1">
      under
      {categories.edges && categories.edges.length > 0 ? (
        categories.edges.map((category, index) => (
          <span key={index} className="ml-1">
            {category.node?.name || 'Uncategorized'}
          </span>
        ))
      ) : (
        <span className="ml-1">Uncategorized</span>
      )}
    </span>
  )
}
