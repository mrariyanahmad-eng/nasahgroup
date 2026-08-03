import Link from "next/link";
import Image from "next/image";
import { Card, StatusBadge } from "@/components/ui/Card";
import { getProducts } from "@/lib/site-data";

export async function ProductGrid() {
  const products = await getProducts();

  return (
    <section id="products" className="border-y border-nasah-border bg-nasah-surface py-28 dark:border-white/10 dark:bg-white/[0.02]">
      <div className="mx-auto max-w-6xl px-8">
        <div className="mx-auto mb-16 max-w-xl text-center">
          <h2 className="font-display text-h2">One ecosystem, every product.</h2>
          <p className="mt-4 text-nasah-gray">
            Every tool Nasah Group LTD builds shares the same design system,
            account, and infrastructure — so they work like one platform, not
            a collection of apps.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <Card key={product.id}>
              {product.image_url ? (
                <Image
                  src={product.image_url}
                  alt={product.name}
                  width={44}
                  height={44}
                  className="mb-5 rounded-xl object-cover"
                />
              ) : (
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-nasah-red font-display text-base font-bold text-white">
                  {product.icon_letter}
                </div>
              )}
              <h3 className="mb-2 text-lg font-semibold tracking-tight">{product.name}</h3>
              <p className="mb-5 text-sm leading-relaxed text-nasah-gray">
                {product.description}
              </p>
              <div className="flex items-center justify-between">
                <StatusBadge status={product.status} />
                <Link href={product.href} className="text-sm font-semibold text-nasah-red">
                  Learn more →
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
