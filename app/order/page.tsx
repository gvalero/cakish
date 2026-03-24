import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { OrderConfigurator } from "@/components/order-configurator";
import { siteContent } from "@/lib/site-data";

export const metadata = {
  title: "Order | Cakish.ie",
  description: "Select your size and finish for The Cakish Modern Pavlova.",
};

export default function OrderPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1 px-4 pb-14 pt-8 md:px-10 md:pb-22 md:pt-16">
        <div className="mx-auto max-w-7xl space-y-10">

          {/* Page heading — concise, CTA-first */}
          <section className="space-y-3 max-w-2xl">
            <span className="section-label">Order</span>
            <h1 className="font-serif text-4xl leading-[0.95] tracking-[-0.03em] text-[color:var(--deep-charcoal)] md:text-6xl">
              Reserve your Cakish centrepiece.
            </h1>
            <p className="text-base leading-7 text-[color:var(--body-copy)] md:text-lg md:leading-8">
              Select your size and finish below, then proceed to checkout.
            </p>
          </section>

          {/* Configurator — immediately visible, no scrolling required */}
          <OrderConfigurator />

          {/* Collection details — moved below the configurator */}
          <section className="rounded-[2rem] border border-[color:var(--line)] bg-white/60 p-6 md:rounded-[2.5rem] md:p-8">
            <div className="mb-6 space-y-2">
              <span className="section-label">Collection Details</span>
              <h2 className="font-serif text-2xl text-[color:var(--deep-charcoal)] md:text-3xl">
                How collection works.
              </h2>
              <p className="max-w-xl text-sm leading-6 text-[color:var(--body-copy)] md:text-base md:leading-7">
                {siteContent.collectionModel}
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {siteContent.collectionHighlights.map((item) => (
                <article
                  key={item.title}
                  className="rounded-[1.6rem] border border-[color:var(--line)] bg-white/75 p-4 shadow-[0_18px_40px_rgba(53,45,34,0.05)] md:rounded-[1.8rem] md:p-5"
                >
                  <p className="text-sm uppercase tracking-[0.22em] text-[color:var(--soft-gold)]">
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
