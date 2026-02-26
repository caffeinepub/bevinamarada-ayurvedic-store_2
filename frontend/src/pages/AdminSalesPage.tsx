import { useState } from 'react';
import { TrendingUp, Plus, Loader2, IndianRupee, Package, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from '@/components/ui/table';
import {
  useGetProducts,
  useGetSalesByDate,
  useGetSalesByMonth,
  useGetSalesByProduct,
  useRecordSale,
} from '../hooks/useQueries';
import type { Product } from '../backend';

function formatDate(ts: bigint): string {
  const ms = Number(ts) * 1000;
  return new Date(ms).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function todayTimestamp(): bigint {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return BigInt(Math.floor(now.getTime() / 1000));
}

// ─── Daily Report Tab ─────────────────────────────────────────────────────────
function DailyReportTab() {
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );

  const dayTs = selectedDate
    ? BigInt(Math.floor(new Date(selectedDate).getTime() / 1000))
    : null;

  const { data: sales, isLoading } = useGetSalesByDate(dayTs);

  const total = (sales ?? []).reduce((sum, s) => sum + s.totalAmount, 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Label className="font-body text-sm font-medium flex-shrink-0">Select Date:</Label>
        <Input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="font-body text-sm border-border w-auto"
        />
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-12 w-full" />)}
        </div>
      ) : (sales ?? []).length === 0 ? (
        <div className="text-center py-10">
          <TrendingUp className="h-10 w-10 text-muted-foreground/30 mx-auto mb-2" />
          <p className="font-body text-sm text-muted-foreground">No sales recorded for this date.</p>
        </div>
      ) : (
        <div className="rounded-xl border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="font-body text-xs font-semibold text-muted-foreground">Product</TableHead>
                <TableHead className="font-body text-xs font-semibold text-muted-foreground text-right">Qty</TableHead>
                <TableHead className="font-body text-xs font-semibold text-muted-foreground text-right">Unit Price</TableHead>
                <TableHead className="font-body text-xs font-semibold text-muted-foreground text-right">Total</TableHead>
                <TableHead className="font-body text-xs font-semibold text-muted-foreground hidden sm:table-cell">Customer</TableHead>
                <TableHead className="font-body text-xs font-semibold text-muted-foreground hidden md:table-cell">Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(sales ?? []).map((sale) => (
                <TableRow key={sale.id.toString()}>
                  <TableCell className="font-body text-sm font-medium text-foreground">{sale.productName}</TableCell>
                  <TableCell className="font-body text-sm text-right">{sale.quantity.toString()}</TableCell>
                  <TableCell className="font-body text-sm text-right">₹{sale.pricePerUnit.toFixed(2)}</TableCell>
                  <TableCell className="font-body text-sm font-semibold text-primary text-right">₹{sale.totalAmount.toFixed(2)}</TableCell>
                  <TableCell className="font-body text-sm text-muted-foreground hidden sm:table-cell">
                    {sale.customerName ?? '—'}
                  </TableCell>
                  <TableCell className="font-body text-xs text-muted-foreground hidden md:table-cell">
                    {formatDate(sale.saleDate)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow className="bg-primary/5">
                <TableCell colSpan={3} className="font-heading text-sm font-bold text-foreground">
                  Day Total
                </TableCell>
                <TableCell className="font-heading text-sm font-bold text-primary text-right">
                  ₹{total.toFixed(2)}
                </TableCell>
                <TableCell colSpan={2} className="hidden sm:table-cell" />
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      )}
    </div>
  );
}

// ─── Monthly Report Tab ───────────────────────────────────────────────────────
function MonthlyReportTab() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear().toString());
  const [month, setMonth] = useState((now.getMonth() + 1).toString());

  const yearBig = year ? BigInt(parseInt(year)) : null;
  const monthBig = month ? BigInt(parseInt(month)) : null;

  const { data: sales, isLoading } = useGetSalesByMonth(yearBig, monthBig);

  const total = (sales ?? []).reduce((sum, s) => sum + s.totalAmount, 0);

  // Group by day
  const byDay: Record<string, { sales: typeof sales; total: number }> = {};
  (sales ?? []).forEach((sale) => {
    const day = new Date(Number(sale.saleDate) * 1000).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
    if (!byDay[day]) byDay[day] = { sales: [], total: 0 };
    byDay[day].sales!.push(sale);
    byDay[day].total += sale.totalAmount;
  });

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <Label className="font-body text-sm font-medium">Year:</Label>
          <Input
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="font-body text-sm border-border w-24"
            min="2020"
            max="2099"
          />
        </div>
        <div className="flex items-center gap-2">
          <Label className="font-body text-sm font-medium">Month:</Label>
          <Select value={month} onValueChange={setMonth}>
            <SelectTrigger className="font-body text-sm border-border w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {months.map((m, i) => (
                <SelectItem key={i + 1} value={(i + 1).toString()} className="font-body text-sm">
                  {m}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-12 w-full" />)}
        </div>
      ) : (sales ?? []).length === 0 ? (
        <div className="text-center py-10">
          <Calendar className="h-10 w-10 text-muted-foreground/30 mx-auto mb-2" />
          <p className="font-body text-sm text-muted-foreground">No sales recorded for this month.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {Object.entries(byDay).map(([day, data]) => (
            <Card key={day} className="border-border">
              <CardHeader className="py-3 px-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="font-heading text-sm font-semibold text-foreground">{day}</CardTitle>
                  <span className="font-heading text-sm font-bold text-primary">₹{data.total.toFixed(2)}</span>
                </div>
              </CardHeader>
              <CardContent className="px-4 pb-3">
                <div className="space-y-1">
                  {data.sales!.map((sale) => (
                    <div key={sale.id.toString()} className="flex items-center justify-between text-xs font-body text-muted-foreground">
                      <span>{sale.productName} × {sale.quantity.toString()}</span>
                      <span>₹{sale.totalAmount.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
          <Card className="border-primary/30 bg-primary/5">
            <CardContent className="p-4 flex items-center justify-between">
              <span className="font-heading text-base font-bold text-foreground">Month Total</span>
              <span className="font-heading text-xl font-bold text-primary">₹{total.toFixed(2)}</span>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

// ─── Product-wise Report Tab ──────────────────────────────────────────────────
function ProductWiseReportTab({ products }: { products: Product[] }) {
  const [selectedProductId, setSelectedProductId] = useState<string>(
    products[0]?.id.toString() ?? ''
  );

  const productId = selectedProductId ? BigInt(selectedProductId) : null;
  const { data: sales, isLoading } = useGetSalesByProduct(productId);

  const totalUnits = (sales ?? []).reduce((sum, s) => sum + Number(s.quantity), 0);
  const totalRevenue = (sales ?? []).reduce((sum, s) => sum + s.totalAmount, 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 flex-wrap">
        <Label className="font-body text-sm font-medium flex-shrink-0">Select Product:</Label>
        <Select value={selectedProductId} onValueChange={setSelectedProductId}>
          <SelectTrigger className="font-body text-sm border-border w-full sm:w-64">
            <SelectValue placeholder="Choose a product" />
          </SelectTrigger>
          <SelectContent>
            {products.map((p) => (
              <SelectItem key={p.id.toString()} value={p.id.toString()} className="font-body text-sm">
                {p.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedProductId && (
        <div className="grid grid-cols-2 gap-4">
          <Card className="border-border">
            <CardContent className="p-4 text-center">
              <p className="font-body text-xs text-muted-foreground mb-1">Total Units Sold</p>
              {isLoading ? (
                <Skeleton className="h-8 w-16 mx-auto" />
              ) : (
                <p className="font-heading text-2xl font-bold text-foreground">{totalUnits}</p>
              )}
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardContent className="p-4 text-center">
              <p className="font-body text-xs text-muted-foreground mb-1">Total Revenue</p>
              {isLoading ? (
                <Skeleton className="h-8 w-24 mx-auto" />
              ) : (
                <p className="font-heading text-2xl font-bold text-primary">₹{totalRevenue.toFixed(2)}</p>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {isLoading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-12 w-full" />)}
        </div>
      ) : (sales ?? []).length === 0 ? (
        <div className="text-center py-10">
          <Package className="h-10 w-10 text-muted-foreground/30 mx-auto mb-2" />
          <p className="font-body text-sm text-muted-foreground">No sales recorded for this product.</p>
        </div>
      ) : (
        <div className="rounded-xl border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="font-body text-xs font-semibold text-muted-foreground">Date</TableHead>
                <TableHead className="font-body text-xs font-semibold text-muted-foreground text-right">Qty</TableHead>
                <TableHead className="font-body text-xs font-semibold text-muted-foreground text-right">Unit Price</TableHead>
                <TableHead className="font-body text-xs font-semibold text-muted-foreground text-right">Total</TableHead>
                <TableHead className="font-body text-xs font-semibold text-muted-foreground hidden sm:table-cell">Customer</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(sales ?? []).map((sale) => (
                <TableRow key={sale.id.toString()}>
                  <TableCell className="font-body text-xs text-muted-foreground">{formatDate(sale.saleDate)}</TableCell>
                  <TableCell className="font-body text-sm text-right">{sale.quantity.toString()}</TableCell>
                  <TableCell className="font-body text-sm text-right">₹{sale.pricePerUnit.toFixed(2)}</TableCell>
                  <TableCell className="font-body text-sm font-semibold text-primary text-right">₹{sale.totalAmount.toFixed(2)}</TableCell>
                  <TableCell className="font-body text-sm text-muted-foreground hidden sm:table-cell">
                    {sale.customerName ?? '—'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

// ─── Record Sale Form ─────────────────────────────────────────────────────────
function RecordSaleModal({
  open,
  onClose,
  products,
}: {
  open: boolean;
  onClose: () => void;
  products: Product[];
}) {
  const [form, setForm] = useState({
    productId: '',
    quantity: '1',
    customerName: '',
    phone: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const recordSale = useRecordSale();

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.productId) errs.productId = 'Please select a product';
    const qty = parseInt(form.quantity);
    if (isNaN(qty) || qty < 1) errs.quantity = 'Quantity must be at least 1';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    try {
      await recordSale.mutateAsync({
        productId: BigInt(form.productId),
        quantity: BigInt(parseInt(form.quantity)),
        customerName: form.customerName.trim() || undefined,
        phone: form.phone.trim() || undefined,
      });
      setForm({ productId: '', quantity: '1', customerName: '', phone: '' });
      onClose();
    } catch (err: any) {
      console.error('Record sale failed:', err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-heading text-lg font-bold">Record a Sale</DialogTitle>
          <DialogDescription className="font-body text-sm text-muted-foreground">
            Log a new sale transaction for your records.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label className="font-body text-sm font-medium">Product *</Label>
            <Select value={form.productId} onValueChange={(v) => setForm({ ...form, productId: v })}>
              <SelectTrigger className={`mt-1 font-body text-sm border-border ${errors.productId ? 'border-destructive' : ''}`}>
                <SelectValue placeholder="Select product" />
              </SelectTrigger>
              <SelectContent>
                {products.map((p) => (
                  <SelectItem key={p.id.toString()} value={p.id.toString()} className="font-body text-sm">
                    {p.name} — ₹{p.price.toFixed(2)} (Stock: {p.stockQuantity.toString()})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.productId && <p className="font-body text-xs text-destructive mt-1">{errors.productId}</p>}
          </div>
          <div>
            <Label className="font-body text-sm font-medium">Quantity *</Label>
            <Input
              type="number"
              min="1"
              value={form.quantity}
              onChange={(e) => setForm({ ...form, quantity: e.target.value })}
              className={`mt-1 font-body text-sm border-border ${errors.quantity ? 'border-destructive' : ''}`}
            />
            {errors.quantity && <p className="font-body text-xs text-destructive mt-1">{errors.quantity}</p>}
          </div>
          <div>
            <Label className="font-body text-sm font-medium">Customer Name (Optional)</Label>
            <Input
              value={form.customerName}
              onChange={(e) => setForm({ ...form, customerName: e.target.value })}
              placeholder="Customer name"
              className="mt-1 font-body text-sm border-border"
            />
          </div>
          <div>
            <Label className="font-body text-sm font-medium">Phone (Optional)</Label>
            <Input
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="+91 XXXXX XXXXX"
              className="mt-1 font-body text-sm border-border"
            />
          </div>
          {recordSale.isError && (
            <p className="font-body text-xs text-destructive">
              Failed to record sale. Check stock availability and try again.
            </p>
          )}
        </div>
        <DialogFooter className="gap-2 mt-2">
          <Button variant="outline" onClick={onClose} className="font-body border-border">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={recordSale.isPending}
            className="bg-primary text-primary-foreground hover:bg-primary/90 font-body gap-2"
          >
            {recordSale.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            Record Sale
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function AdminSalesPage() {
  const [showRecordModal, setShowRecordModal] = useState(false);
  const { data: products, isLoading: productsLoading } = useGetProducts(false);
  const availableProducts = (products ?? []).filter((p) => Number(p.stockQuantity) > 0);

  return (
    <div className="p-4 md:p-6 space-y-6 md:mt-0 mt-14">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">Sales & Income</h1>
          <p className="font-body text-sm text-muted-foreground mt-0.5">
            Track your sales and revenue reports
          </p>
        </div>
        <Button
          onClick={() => setShowRecordModal(true)}
          className="bg-primary text-primary-foreground hover:bg-primary/90 font-body font-medium gap-2 flex-shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Record Sale</span>
          <span className="sm:hidden">Record</span>
        </Button>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="daily">
        <TabsList className="bg-muted border border-border w-full sm:w-auto">
          <TabsTrigger value="daily" className="font-body text-sm flex-1 sm:flex-none">
            Daily
          </TabsTrigger>
          <TabsTrigger value="monthly" className="font-body text-sm flex-1 sm:flex-none">
            Monthly
          </TabsTrigger>
          <TabsTrigger value="product" className="font-body text-sm flex-1 sm:flex-none">
            By Product
          </TabsTrigger>
        </TabsList>

        <TabsContent value="daily" className="mt-4">
          <DailyReportTab />
        </TabsContent>

        <TabsContent value="monthly" className="mt-4">
          <MonthlyReportTab />
        </TabsContent>

        <TabsContent value="product" className="mt-4">
          {productsLoading ? (
            <div className="space-y-2">
              {[1, 2].map((i) => <Skeleton key={i} className="h-12 w-full" />)}
            </div>
          ) : (products ?? []).length === 0 ? (
            <div className="text-center py-10">
              <Package className="h-10 w-10 text-muted-foreground/30 mx-auto mb-2" />
              <p className="font-body text-sm text-muted-foreground">No products found.</p>
            </div>
          ) : (
            <ProductWiseReportTab products={products ?? []} />
          )}
        </TabsContent>
      </Tabs>

      {/* Record Sale Modal */}
      <RecordSaleModal
        open={showRecordModal}
        onClose={() => setShowRecordModal(false)}
        products={availableProducts}
      />
    </div>
  );
}
