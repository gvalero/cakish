import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { OrderConfigurator } from "@/components/order-configurator";
import { siteContent } from "@/lib/site-data";

export const metadata = {
  title: "Order Your Pavlova",
  description: "Order a premium handcrafted pavlova from Cakish. Choose 6″, 8″, or 12″ with strawberry floral or patisserie sliced finish. Collection from Wicklow, Ireland.",
  alternates: { canonical: "/order" },
};

export default function OrderPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1 px-6 pb-20 pt-12 md:px-10 md:pb-28 md:pt-16">
        <div className="mx-auto max-w-5xl space-y-12">

          {/* Page heading */}
          <section className="max-w-xl space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[color:var(--soft-gold)]">
              Order
            </p>
            <h1 className="font-serif text-4xl leading-tight text-[color:var(--deep-charcoal)] md:text-5xl">
              Reserve your centrepiece.
            </h1>
            <p className="text-base leading-7 text-[color:var(--body-copy)]">
              Select your size and finish below, then proceed to checkout or send an enquiry.
            </p>
          </section>

          <hr className="cakish-rule" />

          {/* Configurator */}
          <OrderConfigurator />

          <hr className="cakish-rule" />

          {/* Collection details */}
          <section className="space-y-6">
            <div className="max-w-xl space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[color:var(--soft-gold)]">
                Collection Details
              </p>
              <h2 className="font-serif text-2xl text-[color:var(--deep-charcoal)]">
                How collection works.
              </h2>
              <p className="text-sm leading-6 text-[color:var(--body-copy)]">
                {siteContent.collectionModel}
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {siteContent.collectionHighlights.map((item) => (
                <article
                  key={item.title}
                  className="border border-[color:var(--line)] bg-white p-5"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[color:var(--soft-gold)]">
                    {item.title}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-[color:var(--muted-copy)]">
                    {item.copy}
                  </p>
                </article>
              ))}
            </div>
          </section>

        </div>
      </main>
      <SiteFooter />
    </>
  );
}
