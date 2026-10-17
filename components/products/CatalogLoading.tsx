export default function CatalogLoading() {
  return (
    <section
      role="status"
      aria-label="Loading products"
      className="px-5 py-12 sm:px-8"
    >
      <span className="sr-only">Loading products...</span>
      <div
        aria-hidden="true"
        className="mx-auto grid max-w-7xl gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <div
            key={item}
            className="animate-pulse overflow-hidden rounded-lg border border-gray-200"
          >
            <div className="aspect-[4/3] bg-gray-200" />
            <div className="space-y-4 p-5">
              <div className="h-5 w-3/4 rounded bg-gray-200" />
              <div className="h-4 rounded bg-gray-100" />
              <div className="h-4 w-1/2 rounded bg-gray-100" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
