import { Button } from "@/components/ui/button";
import { ArrowRight, ShoppingCart } from "lucide-react";

/**
 * Cakish Reimagined - Home Page
 * 
 * Design Philosophy: Editorial Luxury with Intentional Restraint
 * - Asymmetric layouts that create visual interest
 * - Generous whitespace conveying confidence and luxury
 * - Typography hierarchy using Playfair Display (serif) for headlines
 * - Soft Gold (#C6A769) used sparingly for premium moments
 * - Product imagery as the hero, not background decoration
 */

export default function Home() {
  return (
    <div className="min-h-screen bg-ivory text-deep-charcoal">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-ivory/95 backdrop-blur-sm border-b border-warm-beige">
        <div className="container flex items-center justify-between py-4 md:py-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{backgroundColor: 'var(--soft-gold)'}}>
              <span className="text-ivory font-serif font-bold text-sm">C</span>
            </div>
            <span className="font-serif text-lg font-semibold">Cakish</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#collection" className="text-sm font-medium transition-colors" style={{color: 'var(--deep-charcoal)'}} onMouseEnter={(e) => (e.currentTarget as HTMLAnchorElement).style.color = 'var(--soft-gold)'} onMouseLeave={(e) => (e.currentTarget as HTMLAnchorElement).style.color = 'var(--deep-charcoal)'}>
              Collection
            </a>
            <a href="#story" className="text-sm font-medium transition-colors" style={{color: 'var(--deep-charcoal)'}} onMouseEnter={(e) => (e.currentTarget as HTMLAnchorElement).style.color = 'var(--soft-gold)'} onMouseLeave={(e) => (e.currentTarget as HTMLAnchorElement).style.color = 'var(--deep-charcoal)'}>
              Story
            </a>
            <a href="#contact" className="text-sm font-medium transition-colors" style={{color: 'var(--deep-charcoal)'}} onMouseEnter={(e) => (e.currentTarget as HTMLAnchorElement).style.color = 'var(--soft-gold)'} onMouseLeave={(e) => (e.currentTarget as HTMLAnchorElement).style.color = 'var(--deep-charcoal)'}>
              Contact
            </a>
          </div>
          <Button variant="outline" size="sm" style={{borderColor: 'var(--soft-gold)', color: 'var(--soft-gold)'}} onMouseEnter={(e) => {e.currentTarget.style.backgroundColor = 'var(--soft-gold)'; e.currentTarget.style.color = 'var(--ivory)'}} onMouseLeave={(e) => {e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--soft-gold)'}}>
            <ShoppingCart className="w-4 h-4" />
          </Button>
        </div>
      </nav>

      {/* Hero Section - Editorial Grid */}
      <section className="section-spacing border-b border-warm-beige">
        <div className="container">
          <div className="editorial-grid">
            {/* Text Column */}
            <div className="space-y-6">
              <div className="eyebrow">Cakish</div>
              <h1 className="font-serif font-bold leading-tight">
                A Modern Pavlova, Crafted for Meaningful Moments
              </h1>
              <p className="tagline">
                Not quite traditional. Intentionally contemporary.
              </p>
              <p className="text-base leading-relaxed text-deep-charcoal/80 max-w-md">
                Cakish reimagines the pavlova as a sculptural centrepiece—built on a crisp meringue base, finished with hand-piped cream and seasonal fruit arranged with editorial precision. Every piece is made fresh to order, designed to hold the table.
              </p>
              <div className="flex gap-4 pt-4">
                <Button className="bg-deep-charcoal text-ivory hover:bg-deep-charcoal/90">
                  Reserve Your Order
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button variant="outline" style={{borderColor: 'var(--soft-gold)', color: 'var(--soft-gold)'}} onMouseEnter={(e) => {e.currentTarget.style.backgroundColor = 'var(--soft-gold)'; e.currentTarget.style.color = 'var(--ivory)'}} onMouseLeave={(e) => {e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--soft-gold)'}}>
                  Read Our Story
                </Button>
              </div>
            </div>

            {/* Image Column */}
            <div className="relative">
              <div className="aspect-square bg-warm-beige rounded-2xl overflow-hidden luxury-shadow">
                {/* Placeholder for hero image - would be replaced with actual product photo */}
                <div className="w-full h-full bg-gradient-to-br from-soft-cream to-warm-beige flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl mb-4">🍓</div>
                    <p className="text-sm text-deep-charcoal/60">Hero Product Image</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Sizes Section */}
      <section id="collection" className="section-spacing border-b border-warm-beige">
        <div className="container">
          <div className="mb-12">
            <div className="eyebrow mb-2">Collection</div>
            <h2 className="font-serif font-bold">Three Sizes, One Philosophy</h2>
            <p className="text-deep-charcoal/70 mt-4 max-w-2xl">
              Each size is designed for a specific occasion, but all share the same commitment to editorial presentation and handcrafted quality.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {/* 6" Size */}
            <div className="card-luxury group">
              <div className="aspect-square bg-warm-beige rounded-lg mb-6 overflow-hidden group-hover:shadow-xl transition-shadow">
                <div className="w-full h-full bg-gradient-to-br from-soft-cream to-warm-beige flex items-center justify-center">
                  <span className="text-4xl">6"</span>
                </div>
              </div>
              <h3 className="font-serif font-semibold text-lg mb-2">Intimate</h3>
              <p className="text-sm text-deep-charcoal/70 mb-4">
                Perfect for thoughtful gifting, smaller celebrations, or intimate tables.
              </p>
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-2xl font-serif font-semibold">€48</span>
                <span className="text-xs uppercase tracking-widest" style={{color: 'var(--soft-gold)'}}>from</span>
              </div>
              <Button variant="outline" style={{borderColor: 'var(--soft-gold)', color: 'var(--soft-gold)'}} className="w-full" onMouseEnter={(e) => {e.currentTarget.style.backgroundColor = 'var(--soft-gold)'; e.currentTarget.style.color = 'var(--ivory)'}} onMouseLeave={(e) => {e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--soft-gold)'}}>
                Select Size
              </Button>
            </div>

            {/* 8" Size */}
            <div className="card-luxury group md:scale-105 md:shadow-xl">
              <div className="aspect-square bg-warm-beige rounded-lg mb-6 overflow-hidden group-hover:shadow-xl transition-shadow">
                <div className="w-full h-full bg-gradient-to-br from-soft-cream to-warm-beige flex items-center justify-center">
                  <span className="text-4xl">8"</span>
                </div>
              </div>
              <h3 className="font-serif font-semibold text-lg mb-2">Balanced</h3>
              <p className="text-sm text-deep-charcoal/70 mb-4">
                A versatile centrepiece for most family occasions and elegant hosting.
              </p>
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-2xl font-serif font-semibold">€68</span>
                <span className="text-xs uppercase tracking-widest" style={{color: 'var(--soft-gold)'}}>from</span>
              </div>
              <Button className="w-full bg-deep-charcoal text-ivory hover:bg-deep-charcoal/90">
                Most Popular
              </Button>
            </div>

            {/* 12" Size */}
            <div className="card-luxury group">
              <div className="aspect-square bg-warm-beige rounded-lg mb-6 overflow-hidden group-hover:shadow-xl transition-shadow">
                <div className="w-full h-full bg-gradient-to-br from-soft-cream to-warm-beige flex items-center justify-center">
                  <span className="text-4xl">12"</span>
                </div>
              </div>
              <h3 className="font-serif font-semibold text-lg mb-2">Generous</h3>
              <p className="text-sm text-deep-charcoal/70 mb-4">
                Created for larger tables, bigger moments, and generous serving.
              </p>
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-2xl font-serif font-semibold">€112</span>
                <span className="text-xs uppercase tracking-widest" style={{color: 'var(--soft-gold)'}}>from</span>
              </div>
              <Button variant="outline" style={{borderColor: 'var(--soft-gold)', color: 'var(--soft-gold)'}} className="w-full" onMouseEnter={(e) => {e.currentTarget.style.backgroundColor = 'var(--soft-gold)'; e.currentTarget.style.color = 'var(--ivory)'}} onMouseLeave={(e) => {e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--soft-gold)'}}>
                Select Size
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Finishes Section */}
      <section className="section-spacing border-b border-warm-beige">
        <div className="container">
          <div className="mb-12">
            <div className="eyebrow mb-2">Presentation</div>
            <h2 className="font-serif font-bold">Two Finishes, Two Moods</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            {/* Floral Finish */}
            <div className="space-y-6">
              <div className="aspect-square bg-warm-beige rounded-2xl overflow-hidden luxury-shadow">
                <div className="w-full h-full bg-gradient-to-br from-soft-cream to-warm-beige flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl mb-4">🌸</div>
                    <p className="text-sm text-deep-charcoal/60">Strawberry Floral Finish</p>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-serif font-semibold text-xl mb-2">Strawberry Floral Finish</h3>
                <p className="text-sm uppercase tracking-widest mb-4" style={{color: 'var(--soft-gold)'}}>+€18</p>
                <p className="text-deep-charcoal/70">
                  Whole strawberries thinly sliced and arranged in a sculpted floral pattern, finished with micro-herbs and edible petals. A signature presentation that transforms the pavlova into a centrepiece.
                </p>
              </div>
            </div>

            {/* Patisserie Finish */}
            <div className="space-y-6">
              <div className="aspect-square bg-warm-beige rounded-2xl overflow-hidden luxury-shadow">
                <div className="w-full h-full bg-gradient-to-br from-soft-cream to-warm-beige flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl mb-4">📐</div>
                    <p className="text-sm text-deep-charcoal/60">Patisserie Sliced Finish</p>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-serif font-semibold text-xl mb-2">Patisserie Sliced Finish</h3>
                <p className="text-sm uppercase tracking-widest mb-4" style={{color: 'var(--soft-gold)'}}>Included</p>
                <p className="text-deep-charcoal/70">
                  Precisely sliced seasonal fruit layered in clean geometric lines. A polished, contemporary presentation that is effortless to serve and feels refined.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Made For Section */}
      <section className="section-spacing border-b border-warm-beige">
        <div className="container">
          <div className="mb-12">
            <div className="eyebrow mb-2">Occasions</div>
            <h2 className="font-serif font-bold">Designed for Moments That Matter</h2>
            <p className="text-deep-charcoal/70 mt-4 max-w-2xl">
              Cakish is for the occasions people remember in detail—the table, the flowers, the room, the way dessert made everyone pause.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {["Birthday", "Communion", "Hosting", "Gifting", "Milestones"].map((occasion, idx) => (
              <div key={idx} className="card-luxury text-center hover:bg-warm-beige transition-colors">
                <div className="text-4xl mb-4">
                  {idx === 0 && "🎂"}
                  {idx === 1 && "✨"}
                  {idx === 2 && "🕯️"}
                  {idx === 3 && "🎁"}
                  {idx === 4 && "💫"}
                </div>
                <h3 className="font-serif font-semibold text-lg">{occasion}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section id="story" className="section-spacing border-b border-warm-beige">
        <div className="container">
          <div className="editorial-grid">
            {/* Text Column */}
            <div className="space-y-6">
              <div className="eyebrow">The Story</div>
              <h2 className="font-serif font-bold">Built from a Home Kitchen, Designed for Your Table</h2>
              <p className="text-deep-charcoal/70">
                Cakish began with one question: what if a pavlova could feel like a gift? What started as a personal obsession with meringue architecture became something worth sharing.
              </p>
              <p className="text-deep-charcoal/70">
                Today, every pavlova is made fresh to order, designed to hold the table and create a moment of pause—a reminder that the best desserts are the ones made with intention.
              </p>
              <Button variant="outline" style={{borderColor: 'var(--soft-gold)', color: 'var(--soft-gold)'}} className="mt-4" onMouseEnter={(e) => {e.currentTarget.style.backgroundColor = 'var(--soft-gold)'; e.currentTarget.style.color = 'var(--ivory)'}} onMouseLeave={(e) => {e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--soft-gold)'}}>
                Read the Full Story
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>

            {/* Image Column */}
            <div className="relative">
              <div className="aspect-square bg-warm-beige rounded-2xl overflow-hidden luxury-shadow">
                <div className="w-full h-full bg-gradient-to-br from-soft-cream to-warm-beige flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl mb-4">👩‍🍳</div>
                    <p className="text-sm text-deep-charcoal/60">Story Image</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-spacing bg-deep-charcoal text-ivory">
        <div className="container text-center space-y-6">
          <h2 className="font-serif font-bold text-3xl md:text-4xl">Ready to Reserve?</h2>
          <p className="text-ivory/80 max-w-2xl mx-auto">
            Each pavlova is made fresh to order. We take a limited number of orders each week to ensure every piece receives full attention.
          </p>
          <Button style={{backgroundColor: 'var(--soft-gold)', color: 'var(--deep-charcoal)'}} className="font-semibold hover:opacity-90">
            Start Your Order
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-ivory border-t border-warm-beige">
        <div className="container py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 pb-8 border-b border-warm-beige">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{backgroundColor: 'var(--soft-gold)'}}>
                  <span className="text-ivory font-serif font-bold text-xs">C</span>
                </div>
                <span className="font-serif font-semibold">Cakish</span>
              </div>
              <p className="text-sm text-deep-charcoal/70">
                Modern pavlova centrepieces, crafted for meaningful moments.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#collection" className="text-deep-charcoal/70 transition-colors" onMouseEnter={(e) => (e.currentTarget as HTMLAnchorElement).style.color = 'var(--soft-gold)'} onMouseLeave={(e) => (e.currentTarget as HTMLAnchorElement).style.color = 'var(--deep-charcoal)'}>Collection</a></li>
                <li><a href="#story" className="text-deep-charcoal/70 transition-colors" onMouseEnter={(e) => (e.currentTarget as HTMLAnchorElement).style.color = 'var(--soft-gold)'} onMouseLeave={(e) => (e.currentTarget as HTMLAnchorElement).style.color = 'var(--deep-charcoal)'}>Our Story</a></li>
                <li><a href="#contact" className="text-deep-charcoal/70 transition-colors" onMouseEnter={(e) => (e.currentTarget as HTMLAnchorElement).style.color = 'var(--soft-gold)'} onMouseLeave={(e) => (e.currentTarget as HTMLAnchorElement).style.color = 'var(--deep-charcoal)'}>Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Get in Touch</h4>
              <p className="text-sm text-deep-charcoal/70 mb-2">hello@cakish.ie</p>
              <p className="text-sm text-deep-charcoal/70">@cakish.ie</p>
            </div>
          </div>
          <div className="text-center text-sm text-deep-charcoal/60">
            <p>© 2026 Cakish. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
