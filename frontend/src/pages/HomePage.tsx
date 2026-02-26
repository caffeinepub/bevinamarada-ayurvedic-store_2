import { Link } from '@tanstack/react-router';
import { Phone, MessageCircle, Leaf, Star, Shield, Clock, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetProducts } from '../hooks/useQueries';
import { ProductStatus } from '../backend';

const STORE_PHONE_RAW = '+919876543210';
const WHATSAPP_NUMBER = '919876543210';

function ProductCard({ product }: { product: any }) {
  const inStock = product.status === ProductStatus.inStock;
  return (
    <Card className="overflow-hidden border-border hover:shadow-leaf transition-shadow group">
      <div className="aspect-square overflow-hidden bg-muted">
        <img
          src={product.imageUrl || '/assets/generated/product-placeholder.dim_400x400.png'}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/assets/generated/product-placeholder.dim_400x400.png';
          }}
        />
      </div>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-heading text-sm font-semibold text-foreground leading-tight line-clamp-2">{product.name}</h3>
          <Badge
            variant={inStock ? 'default' : 'destructive'}
            className={`text-xs flex-shrink-0 ${inStock ? 'bg-primary/90 text-primary-foreground' : ''}`}
          >
            {inStock ? '✅ In Stock' : '❌ Out of Stock'}
          </Badge>
        </div>
        <p className="font-body text-xs text-muted-foreground mb-2">{product.category}</p>
        <p className="font-heading text-base font-bold text-primary">₹{product.price.toFixed(2)}</p>
      </CardContent>
    </Card>
  );
}

export default function HomePage() {
  const { data: allProducts, isLoading } = useGetProducts(true);

  // Show up to 6 in-stock, non-hidden products
  const featuredProducts = allProducts
    ?.filter((p) => !p.isHidden && p.status === ProductStatus.inStock)
    .slice(0, 6) ?? [];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative min-h-[480px] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/assets/generated/hero-banner.dim_1200x480.png"
            alt="Ayurvedic Store"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 hero-overlay" />
        </div>
        <div className="relative z-10 container mx-auto px-4 py-16">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-4">
              <Leaf className="h-5 w-5 text-ayur-gold" />
              <span className="font-body text-sm text-ayur-gold font-medium tracking-wide uppercase">
                Authentic Ayurveda
              </span>
            </div>
            <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight mb-4">
              Bevinamarada<br />
              <span className="text-ayur-gold">Ayurvedic Store</span>
            </h1>
            <p className="font-body text-base sm:text-lg text-white/85 mb-8 leading-relaxed max-w-xl">
              Rooted in the healing power of Neem (Bevinamarada), we bring you authentic Ayurvedic medicines and herbal products trusted for generations.
            </p>
            <div className="flex flex-wrap gap-3">
              <a href={`tel:${STORE_PHONE_RAW}`}>
                <Button size="lg" className="bg-ayur-gold text-ayur-brown-deep hover:bg-ayur-gold/90 font-body font-semibold gap-2">
                  <Phone className="h-4 w-4" />
                  Call Us Now
                </Button>
              </a>
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 font-body font-semibold gap-2">
                  <MessageCircle className="h-4 w-4" />
                  WhatsApp
                </Button>
              </a>
              <Link to="/products">
                <Button size="lg" variant="outline" className="border-white/60 text-white hover:bg-white/10 font-body font-semibold gap-2">
                  View Products
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="bg-ayur-green-deep py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { icon: Shield, title: 'Authentic Products', desc: 'Genuine Ayurvedic medicines from trusted sources' },
              { icon: Leaf, title: 'Natural & Pure', desc: 'Herbal formulations with no harmful additives' },
              { icon: Star, title: 'Trusted Since Years', desc: 'Serving the community with care and expertise' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-start gap-3 text-ayur-cream">
                <div className="w-10 h-10 rounded-full bg-ayur-green-mid flex items-center justify-center flex-shrink-0">
                  <Icon className="h-5 w-5 text-ayur-gold" />
                </div>
                <div>
                  <h3 className="font-heading text-sm font-semibold">{title}</h3>
                  <p className="font-body text-xs text-ayur-cream/70 mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-14 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="h-px w-12 bg-primary/30" />
              <Leaf className="h-4 w-4 text-primary" />
              <div className="h-px w-12 bg-primary/30" />
            </div>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground">Featured Products</h2>
            <p className="font-body text-sm text-muted-foreground mt-2">Handpicked Ayurvedic remedies for your wellbeing</p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <Skeleton className="aspect-square" />
                  <CardContent className="p-4 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                    <Skeleton className="h-5 w-1/3" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : featuredProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id.toString()} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Leaf className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
              <p className="font-body text-muted-foreground">No products available yet. Check back soon!</p>
            </div>
          )}

          {featuredProducts.length > 0 && (
            <div className="text-center mt-8">
              <Link to="/products">
                <Button variant="outline" className="border-primary text-primary hover:bg-primary/5 font-body font-medium gap-2">
                  View All Products
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* About Teaser */}
      <section className="py-14 leaf-pattern relative">
        <div className="absolute inset-0 bg-ayur-green-deep/90" />
        <div className="relative z-10 container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center text-ayur-cream">
            <Leaf className="h-8 w-8 text-ayur-gold mx-auto mb-4" />
            <h2 className="font-heading text-2xl sm:text-3xl font-bold mb-4">
              The Wisdom of Bevinamarada
            </h2>
            <p className="font-body text-base text-ayur-cream/80 leading-relaxed mb-6">
              "Bevinamarada" means Neem in Kannada — a sacred tree revered in Ayurveda for its extraordinary healing properties. Our store is built on this ancient wisdom, offering you nature's finest remedies.
            </p>
            <Link to="/about">
              <Button variant="outline" className="border-ayur-gold text-ayur-gold hover:bg-ayur-gold/10 font-body font-medium gap-2">
                Learn Our Story
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-heading text-xl sm:text-2xl font-bold text-foreground mb-3">
            Have Questions? We're Here to Help
          </h2>
          <p className="font-body text-sm text-muted-foreground mb-6">
            Reach out via phone or WhatsApp for product enquiries and guidance
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <a href={`tel:${STORE_PHONE_RAW}`}>
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 font-body gap-2">
                <Phone className="h-4 w-4" />
                +91 98765 43210
              </Button>
            </a>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline" className="border-primary text-primary hover:bg-primary/5 font-body gap-2">
                <MessageCircle className="h-4 w-4" />
                Chat on WhatsApp
              </Button>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
