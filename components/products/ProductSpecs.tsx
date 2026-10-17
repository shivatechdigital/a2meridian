import type { CatalogProduct } from "@/lib/catalog-types";

export default function ProductSpecs({
  specifications,
  certifications,
  moq,
  packaging,
}: Pick<
  CatalogProduct,
  "specifications" | "certifications" | "moq" | "packaging"
>) {
  return (
    <div className="space-y-7">
      {specifications.length > 0 && (
        <section aria-label="Product specifications">
          <h2 className="mb-4 font-heading text-xl font-bold text-navy-900">
            Specifications
          </h2>
          <div className="overflow-hidden rounded-lg border border-gray-200">
            <table className="w-full table-fixed text-left text-sm">
              <caption className="sr-only">
                Product specification parameters and values
              </caption>
              <tbody>
                {specifications.map((spec) => (
                  <tr key={spec._key} className="odd:bg-gray-50">
                    <th
                      scope="row"
                      className="w-2/5 break-words border-r border-gray-200 px-4 py-3 font-medium text-navy-900"
                    >
                      {spec.key}
                    </th>
                    <td className="break-words px-4 py-3 text-gray-600">
                      {spec.value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
      {(moq || packaging) && (
        <section aria-label="Trade details">
          <h2 className="mb-4 font-heading text-xl font-bold text-navy-900">
            Trade Details
          </h2>
          <dl className="grid gap-4 sm:grid-cols-2">
            {moq && (
              <div className="rounded-md bg-offwhite p-4">
                <dt className="text-xs text-gray-500">Minimum Order</dt>
                <dd className="mt-2 break-words text-sm font-semibold text-navy-900">
                  {moq}
                </dd>
              </div>
            )}
            {packaging && (
              <div className="rounded-md bg-offwhite p-4">
                <dt className="text-xs text-gray-500">Packaging</dt>
                <dd className="mt-2 break-words text-sm font-semibold text-navy-900">
                  {packaging}
                </dd>
              </div>
            )}
          </dl>
        </section>
      )}
      {certifications.length > 0 && (
        <section aria-label="Product certifications">
          <h2 className="mb-4 font-heading text-xl font-bold text-navy-900">
            Certifications & Documentation
          </h2>
          <ul className="flex flex-wrap gap-2">
            {certifications.map((cert) => (
              <li
                key={cert}
                className="rounded border border-gray-300 bg-offwhite px-3 py-2 text-sm text-navy-900"
              >
                {cert}
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs leading-6 text-gray-500">
            Listed by the supplier. Request current supporting documentation for
            the product and consignment.
          </p>
        </section>
      )}
    </div>
  );
}
