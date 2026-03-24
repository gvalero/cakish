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
      <main className="flex-1 px-6 pb-16 pt-10 md:px-10 md:pb-22 md:pt-16">
        <div className="mx-auto max-w-7xl space-y-10">
          <section className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
            <div className="space-y-5">
              <span className="section-label">Order</span>
              <h1 className="font-serif text-5xl leading-[0.95] tracking-[-0.03em] text-[color:var(--deep-charcoal)] md:text-6xl">
                Reserve your Cakish centrepiece.
              </h1>
              <p className="max-w-xl text-lg leading-8 text-[color:var(--body-copy)]">
                Choose your preferred size and finish, review the pricing
                instantly, and preview the checkout flow we will connect to live
                payments soon.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {siteContent.collectionHighlights.map((item) => (
                <article
                  key={item.title}
                  className="rounded-[1.8rem] border border-[color:var(--line)] bg-white/75 p-5 shadow-[0_18px_40px_rgba(53,45,34,0.05)]"
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

          <OrderConfigurator />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
