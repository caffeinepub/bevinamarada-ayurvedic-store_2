import { useState } from 'react';
import {
  Package,
  AlertTriangle,
  MessageSquare,
  IndianRupee,
  Calendar,
  BarChart3,
  Leaf,
  RefreshCw,
  Settings,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import {
  useGetIncomeStats,
  useGetProducts,
  useGetInquiries,
  useGetLowStockProducts,
  useSetLowStockThreshold,
} from '../hooks/useQueries';
import { ProductStatus } from '../backend';
import { useQueryClient } from '@tanstack/react-query';

function StatCard({
  title,
  value,
  icon: Icon,
  loading,
  colorClass = 'bg-primary/10 text-primary',
}: {
  title: string;
  value: string | number;
  icon: React.ElementType;
  loading?: boolean;
  colorClass?: string;
}) {
  return (
    <Card className="border-border rounded-2xl shadow-xs">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="font-body text-xs text-muted-foreground mb-1">{title}</p>
            {loading ? (
              <Skeleton className="h-7 w-24 mt-1" />
            ) : (
              <p className="font-heading text-2xl font-bold text-foreground">{value}</p>
            )}
          </div>
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${colorClass}`}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function AdminDashboardPage() {
  const queryClient = useQueryClient();
  const [newThreshold, setNewThreshold] = useState('');
  const [thresholdSaved, setThresholdSaved] = useState(false);

  const { data: incomeStats, isLoading: incomeLoading } = useGetIncomeStats();
  const { data: products, isLoading: productsLoading } = useGetProducts(false);
  const { data: inquiries, isLoading: inquiriesLoading } = useGetInquiries();
  const { data: lowStockProducts, isLoading: lowStockLoading } = useGetLowStockProducts();
  const setThreshold = useSetLowStockThreshold();

  const totalProducts = products?.length ?? 0;
  const outOfStockCount = products?.filter((p) => p.status === ProductStatus.outOfStock).length ?? 0;
  const totalInquiries = inquiries?.length ?? 0;
  const unreadInquiries = inquiries?.filter((i) => !i.isRead).length ?? 0;

  const handleRefresh = () => {
    queryClient.invalidateQueries();
  };

  const handleSetThreshold = async () => {
    const val = parseInt(newThreshold);
    if (isNaN(val) || val < 1) return;
    await setThreshold.mutateAsync(BigInt(val));
    setThresholdSaved(true);
    setNewThreshold('');
    setTimeout(() => setThresholdSaved(false), 2000);
  };

  return (
    <div className="p-4 md:p-6 space-y-6 md:mt-0 mt-14">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="font-body text-sm text-muted-foreground mt-0.5">
            Overview of your store's performance
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          className="font-body text-sm border-border gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          <span className="hidden sm:inline">Refresh</span>
        </Button>
      </div>

      {/* Income Stats */}
      <div>
        <h2 className="font-heading text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
          Income Overview
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            title="Today's Income"
            value={`₹${(incomeStats?.todayIncome ?? 0).toFixed(2)}`}
            icon={IndianRupee}
            loading={incomeLoading}
            colorClass="bg-primary/10 text-primary"
          />
          <StatCard
            title="Monthly Income"
            value={`₹${(incomeStats?.monthlyIncome ?? 0).toFixed(2)}`}
            icon={Calendar}
            loading={incomeLoading}
            colorClass="bg-accent text-accent-foreground"
          />
          <StatCard
            title="Total Income"
            value={`₹${(incomeStats?.totalIncome ?? 0).toFixed(2)}`}
            icon={BarChart3}
            loading={incomeLoading}
            colorClass="bg-primary/10 text-primary"
          />
        </div>
      </div>

      {/* Store Stats */}
      <div>
        <h2 className="font-heading text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
          Store Overview
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <StatCard
            title="Total Products"
            value={totalProducts}
            icon={Package}
            loading={productsLoading}
            colorClass="bg-primary/10 text-primary"
          />
          <StatCard
            title="Out of Stock"
            value={outOfStockCount}
            icon={AlertTriangle}
            loading={productsLoading}
            colorClass="bg-destructive/10 text-destructive"
          />
          <StatCard
            title="Total Enquiries"
            value={totalInquiries}
            icon={MessageSquare}
            loading={inquiriesLoading}
            colorClass="bg-accent text-accent-foreground"
          />
        </div>
      </div>

      {/* Low Stock Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="border-border rounded-2xl shadow-xs">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="font-heading text-base font-semibold flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                  Low Stock Alerts
                </CardTitle>
                {unreadInquiries > 0 && (
                  <Badge className="bg-destructive text-destructive-foreground font-body text-xs">
                    {unreadInquiries} unread enquiries
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {lowStockLoading ? (
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => <Skeleton key={i} className="h-10 w-full" />)}
                </div>
              ) : lowStockProducts && lowStockProducts.length > 0 ? (
                <div className="space-y-2">
                  {lowStockProducts.map((product) => (
                    <div
                      key={product.id.toString()}
                      className="flex items-center justify-between p-3 rounded-lg bg-amber-50 border border-amber-200"
                    >
                      <div className="flex items-center gap-3">
                        <AlertTriangle className="h-4 w-4 text-amber-500 flex-shrink-0" />
                        <div>
                          <p className="font-body text-sm font-medium text-foreground">{product.name}</p>
                          <p className="font-body text-xs text-muted-foreground">{product.category}</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="font-body text-xs border-amber-400 text-amber-600">
                        {product.stockQuantity.toString()} left
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <Leaf className="h-8 w-8 text-primary/30 mx-auto mb-2" />
                  <p className="font-body text-sm text-muted-foreground">All products are well stocked!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Threshold Settings */}
        <div>
          <Card className="border-border rounded-2xl shadow-xs">
            <CardHeader className="pb-3">
              <CardTitle className="font-heading text-base font-semibold flex items-center gap-2">
                <Settings className="h-4 w-4 text-primary" />
                Stock Alert Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="font-body text-sm font-medium text-foreground">
                  Low Stock Threshold
                </Label>
                <p className="font-body text-xs text-muted-foreground mt-0.5 mb-3">
                  Alert when stock falls below this quantity
                </p>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    min="1"
                    value={newThreshold}
                    onChange={(e) => setNewThreshold(e.target.value)}
                    placeholder="e.g. 5"
                    className="font-body text-sm border-border"
                  />
                  <Button
                    onClick={handleSetThreshold}
                    disabled={setThreshold.isPending || !newThreshold}
                    size="sm"
                    className="bg-primary text-primary-foreground hover:bg-primary/90 font-body flex-shrink-0"
                  >
                    {thresholdSaved ? '✓' : 'Set'}
                  </Button>
                </div>
                {thresholdSaved && (
                  <p className="font-body text-xs text-primary mt-1">Threshold updated!</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
