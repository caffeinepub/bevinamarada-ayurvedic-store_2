import { useState, useMemo } from 'react';
import { Search, Leaf, Filter, SlidersHorizontal } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useGetProducts } from '../hooks/useQueries';
import { ProductStatus } from '../backend';

function ProductCard({ product }: { product: any }) {
  const inStock = product.status === ProductStatus.inStock;
  return (
    <Card className="overflow-hidden border-border hover:shadow-leaf transition-all duration-200 group">
      <div className="aspect-square overflow-hidden bg-muted relative">
        <img
          src={product.imageUrl || '/assets/generated/product-placeholder.dim_400x400.png'}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/assets/generated/product-placeholder.dim_400x400.png';
          }}
        />
        <div className="absolute top-2 right-2">
          <Badge
            className={`text-xs font-body font-medium shadow-sm ${
              inStock
                ? 'bg-primary text-primary-foreground'
                : 'bg-destructive text-destructive-foreground'
            }`}
          >
            {inStock ? '✅ In Stock' : '❌ Out of Stock'}
          </Badge>
        </div>
      </div>
      <CardContent className="p-4">
        <p className="font-body text-xs text-primary font-medium mb-1">{product.category}</p>
        <h3 className="font-heading text-sm font-semibold text-foreground leading-tight mb-2 line-clamp-2">
          {product.name}
        </h3>
        {product.description && (
          <p className="font-body text-xs text-muted-foreground mb-3 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        )}
        <p className="font-heading text-lg font-bold text-primary">₹{product.price.toFixed(2)}</p>
      </CardContent>
    </Card>
  );
}

export default function ProductsPage() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const { data: products, isLoading } = useGetProducts(false);

  // Filter out hidden products for customer view
  const visibleProducts = useMemo(
    () => (products ?? []).filter((p) => !p.isHidden),
    [products]
  );

  const categories = useMemo(() => {
    const cats = new Set(visibleProducts.map((p) => p.category).filter(Boolean));
    return Array.from(cats).sort();
  }, [visibleProducts]);

  const filteredProducts = useMemo(() => {
    return visibleProducts.filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [visibleProducts, search, selectedCategory]);

  return (
    <div className="bg-background min-h-screen">
      {/* Header */}
      <section className="relative py-12 overflow-hidden">
        <div className="absolute inset-0 leaf-pattern opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-ayur-green-deep/5 to-background" />
        <div className="relative z-10 container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="h-px w-12 bg-primary/30" />
            <Leaf className="h-4 w-4 text-primary" />
            <div className="h-px w-12 bg-primary/30" />
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-foreground mb-3">Our Products</h1>
          <p className="font-body text-sm text-muted-foreground max-w-md mx-auto">
            Authentic Ayurvedic medicines and herbal products for your health and wellness
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="sticky top-16 z-30 bg-background/95 backdrop-blur border-b border-border py-3">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 font-body text-sm bg-background border-border"
              />
            </div>
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full sm:w-44 font-body text-sm border-border">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all" className="font-body text-sm">All Categories</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat} className="font-body text-sm">{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          {!isLoading && (
            <p className="font-body text-xs text-muted-foreground mt-2">
              Showing {filteredProducts.length} of {visibleProducts.length} products
            </p>
          )}
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <Skeleton className="aspect-square" />
                  <CardContent className="p-4 space-y-2">
                    <Skeleton className="h-3 w-1/3" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-5 w-1/3" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id.toString()} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <Leaf className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="font-heading text-lg font-semibold text-foreground mb-2">No products found</h3>
              <p className="font-body text-sm text-muted-foreground">
                {search || selectedCategory !== 'all'
                  ? 'Try adjusting your search or filter'
                  : 'No products available yet. Check back soon!'}
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
