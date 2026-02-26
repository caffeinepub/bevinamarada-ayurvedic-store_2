import { useState } from 'react';
import {
  Plus,
  Pencil,
  Trash2,
  EyeOff,
  Package,
  Search,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import {
  useGetProducts,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
} from '../hooks/useQueries';
import { ProductStatus, type Product, type ProductInput } from '../backend';

type ProductForm = {
  name: string;
  category: string;
  price: string;
  stockQuantity: string;
  description: string;
  imageUrl: string;
  isHidden: boolean;
};

const emptyFormState: ProductForm = {
  name: '',
  category: '',
  price: '',
  stockQuantity: '',
  description: '',
  imageUrl: '',
  isHidden: false,
};

export default function AdminProductsPage() {
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [deleteProductId, setDeleteProductId] = useState<bigint | null>(null);
  const [formData, setFormData] = useState<ProductForm>(emptyFormState);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [inlineStock, setInlineStock] = useState<Record<string, string>>({});

  const { data: products, isLoading } = useGetProducts(false);
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();

  const filteredProducts = (products ?? []).filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
  );

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.category.trim()) errors.category = 'Category is required';
    const price = parseFloat(formData.price);
    if (isNaN(price) || price < 0) errors.price = 'Valid price is required';
    const qty = parseInt(formData.stockQuantity);
    if (isNaN(qty) || qty < 0) errors.stockQuantity = 'Valid quantity is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const openAddModal = () => {
    setFormData(emptyFormState);
    setFormErrors({});
    setShowAddModal(true);
  };

  const openEditModal = (product: Product) => {
    setEditProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      price: product.price.toString(),
      stockQuantity: product.stockQuantity.toString(),
      description: product.description,
      imageUrl: product.imageUrl,
      isHidden: product.isHidden,
    });
    setFormErrors({});
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    const input: ProductInput = {
      name: formData.name.trim(),
      category: formData.category.trim(),
      price: parseFloat(formData.price),
      stockQuantity: BigInt(parseInt(formData.stockQuantity)),
      description: formData.description.trim(),
      imageUrl: formData.imageUrl.trim(),
    };

    try {
      if (editProduct) {
        await updateProduct.mutateAsync({ id: editProduct.id, product: input });
        setEditProduct(null);
      } else {
        await createProduct.mutateAsync(input);
        setShowAddModal(false);
      }
    } catch (err) {
      console.error('Save failed:', err);
    }
  };

  const handleDelete = async () => {
    if (deleteProductId === null) return;
    try {
      await deleteProduct.mutateAsync(deleteProductId);
      setDeleteProductId(null);
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const handleInlineStockUpdate = async (product: Product) => {
    const val = inlineStock[product.id.toString()];
    if (val === undefined || val === '') return;
    const qty = parseInt(val);
    if (isNaN(qty) || qty < 0) return;
    try {
      await updateProduct.mutateAsync({
        id: product.id,
        product: {
          name: product.name,
          category: product.category,
          price: product.price,
          stockQuantity: BigInt(qty),
          description: product.description,
          imageUrl: product.imageUrl,
        },
      });
      setInlineStock((prev) => {
        const next = { ...prev };
        delete next[product.id.toString()];
        return next;
      });
    } catch (err) {
      console.error('Stock update failed:', err);
    }
  };

  const isSaving = createProduct.isPending || updateProduct.isPending;

  const ProductFormFields = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label className="font-body text-sm font-medium">Name *</Label>
          <Input
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Product name"
            className={`mt-1 font-body text-sm border-border ${formErrors.name ? 'border-destructive' : ''}`}
          />
          {formErrors.name && (
            <p className="font-body text-xs text-destructive mt-1">{formErrors.name}</p>
          )}
        </div>
        <div>
          <Label className="font-body text-sm font-medium">Category *</Label>
          <Input
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            placeholder="e.g. Herbal Oils"
            className={`mt-1 font-body text-sm border-border ${formErrors.category ? 'border-destructive' : ''}`}
          />
          {formErrors.category && (
            <p className="font-body text-xs text-destructive mt-1">{formErrors.category}</p>
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label className="font-body text-sm font-medium">Price (₹) *</Label>
          <Input
            type="number"
            min="0"
            step="0.01"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            placeholder="0.00"
            className={`mt-1 font-body text-sm border-border ${formErrors.price ? 'border-destructive' : ''}`}
          />
          {formErrors.price && (
            <p className="font-body text-xs text-destructive mt-1">{formErrors.price}</p>
          )}
        </div>
        <div>
          <Label className="font-body text-sm font-medium">Stock Quantity *</Label>
          <Input
            type="number"
            min="0"
            value={formData.stockQuantity}
            onChange={(e) => setFormData({ ...formData, stockQuantity: e.target.value })}
            placeholder="0"
            className={`mt-1 font-body text-sm border-border ${formErrors.stockQuantity ? 'border-destructive' : ''}`}
          />
          {formErrors.stockQuantity && (
            <p className="font-body text-xs text-destructive mt-1">{formErrors.stockQuantity}</p>
          )}
        </div>
      </div>
      <div>
        <Label className="font-body text-sm font-medium">Description</Label>
        <Textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Short product description..."
          rows={3}
          className="mt-1 font-body text-sm border-border resize-none"
        />
      </div>
      <div>
        <Label className="font-body text-sm font-medium">Image URL</Label>
        <Input
          value={formData.imageUrl}
          onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
          placeholder="https://..."
          className="mt-1 font-body text-sm border-border"
        />
      </div>
      <div className="flex items-center gap-3">
        <Switch
          checked={formData.isHidden}
          onCheckedChange={(checked) => setFormData({ ...formData, isHidden: checked })}
          id="isHidden"
        />
        <Label htmlFor="isHidden" className="font-body text-sm font-medium cursor-pointer">
          Hide from customers
        </Label>
      </div>
    </div>
  );

  return (
    <div className="p-4 md:p-6 space-y-6 md:mt-0 mt-14">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">Products</h1>
          <p className="font-body text-sm text-muted-foreground mt-0.5">
            Manage your product inventory
          </p>
        </div>
        <Button
          onClick={openAddModal}
          className="bg-primary text-primary-foreground hover:bg-primary/90 font-body font-medium gap-2 flex-shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Add Product</span>
          <span className="sm:hidden">Add</span>
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 font-body text-sm border-border"
        />
      </div>

      {/* Products List */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-20 w-full rounded-xl" />
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-16">
          <Package className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
          <p className="font-heading text-base font-semibold text-foreground mb-1">No products found</p>
          <p className="font-body text-sm text-muted-foreground">
            {search ? 'Try a different search term' : 'Add your first product to get started'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredProducts.map((product) => {
            const inStock = product.status === ProductStatus.inStock;
            const stockKey = product.id.toString();
            return (
              <Card
                key={stockKey}
                className={`border-border rounded-2xl shadow-xs ${product.isHidden ? 'opacity-60' : ''}`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    {/* Image */}
                    <div className="w-14 h-14 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                      <img
                        src={
                          product.imageUrl ||
                          '/assets/generated/product-placeholder.dim_400x400.png'
                        }
                        alt={product.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            '/assets/generated/product-placeholder.dim_400x400.png';
                        }}
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 flex-wrap">
                        <div>
                          <h3 className="font-heading text-sm font-semibold text-foreground leading-tight">
                            {product.name}
                          </h3>
                          <p className="font-body text-xs text-muted-foreground">{product.category}</p>
                        </div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <Badge
                            className={`text-xs font-body ${
                              inStock
                                ? 'bg-primary/90 text-primary-foreground'
                                : 'bg-destructive text-destructive-foreground'
                            }`}
                          >
                            {inStock ? '✅ In Stock' : '❌ Out of Stock'}
                          </Badge>
                          {product.isHidden && (
                            <Badge
                              variant="outline"
                              className="text-xs font-body border-muted-foreground text-muted-foreground"
                            >
                              <EyeOff className="h-3 w-3 mr-1" />
                              Hidden
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-4 mt-2 flex-wrap">
                        <span className="font-heading text-sm font-bold text-primary">
                          ₹{product.price.toFixed(2)}
                        </span>

                        {/* Inline stock update */}
                        <div className="flex items-center gap-1.5">
                          <span className="font-body text-xs text-muted-foreground">Stock:</span>
                          <Input
                            type="number"
                            min="0"
                            value={
                              inlineStock[stockKey] !== undefined
                                ? inlineStock[stockKey]
                                : product.stockQuantity.toString()
                            }
                            onChange={(e) =>
                              setInlineStock({ ...inlineStock, [stockKey]: e.target.value })
                            }
                            className="w-16 h-7 text-xs font-body border-border px-2"
                          />
                          {inlineStock[stockKey] !== undefined &&
                            inlineStock[stockKey] !== product.stockQuantity.toString() && (
                              <Button
                                size="sm"
                                onClick={() => handleInlineStockUpdate(product)}
                                disabled={updateProduct.isPending}
                                className="h-7 px-2 text-xs bg-primary text-primary-foreground hover:bg-primary/90 font-body"
                              >
                                {updateProduct.isPending ? (
                                  <Loader2 className="h-3 w-3 animate-spin" />
                                ) : (
                                  'Update'
                                )}
                              </Button>
                            )}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditModal(product)}
                        className="h-8 w-8 text-muted-foreground hover:text-foreground"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteProductId(product.id)}
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Add Product Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-heading text-lg font-bold">Add New Product</DialogTitle>
            <DialogDescription className="font-body text-sm text-muted-foreground">
              Fill in the details to add a new product to your inventory.
            </DialogDescription>
          </DialogHeader>
          <ProductFormFields />
          <DialogFooter className="gap-2 mt-2">
            <Button
              variant="outline"
              onClick={() => setShowAddModal(false)}
              className="font-body border-border"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-primary text-primary-foreground hover:bg-primary/90 font-body gap-2"
            >
              {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
              Add Product
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Product Modal */}
      <Dialog open={!!editProduct} onOpenChange={(open) => !open && setEditProduct(null)}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-heading text-lg font-bold">Edit Product</DialogTitle>
            <DialogDescription className="font-body text-sm text-muted-foreground">
              Update the product details below.
            </DialogDescription>
          </DialogHeader>
          <ProductFormFields />
          <DialogFooter className="gap-2 mt-2">
            <Button
              variant="outline"
              onClick={() => setEditProduct(null)}
              className="font-body border-border"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-primary text-primary-foreground hover:bg-primary/90 font-body gap-2"
            >
              {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog
        open={deleteProductId !== null}
        onOpenChange={(open) => !open && setDeleteProductId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="font-heading text-lg font-bold">
              Delete Product?
            </AlertDialogTitle>
            <AlertDialogDescription className="font-body text-sm text-muted-foreground">
              This action cannot be undone. The product will be permanently removed from your
              inventory.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="font-body border-border">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 font-body"
            >
              {deleteProduct.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
