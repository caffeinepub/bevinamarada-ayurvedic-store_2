import { useState } from 'react';
import { MessageSquare, Trash2, CheckCheck, Loader2, Phone, Package, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
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
import {
  useGetInquiries,
  useMarkInquiryRead,
  useDeleteInquiry,
  useGetProductById,
} from '../hooks/useQueries';
import type { Inquiry } from '../backend';

function formatTimestamp(ts: bigint): string {
  const ms = Number(ts) * 1000;
  return new Date(ms).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function ProductName({ productId }: { productId: bigint }) {
  const { data: product, isLoading } = useGetProductById(productId);
  if (isLoading) return <span className="text-muted-foreground">Loading...</span>;
  if (!product) return <span className="text-muted-foreground">Unknown product</span>;
  return <span>{product.name}</span>;
}

function EnquiryCard({
  inquiry,
  onMarkRead,
  onDelete,
  isMarkingRead,
}: {
  inquiry: Inquiry;
  onMarkRead: (id: bigint) => void;
  onDelete: (id: bigint) => void;
  isMarkingRead: boolean;
}) {
  return (
    <Card
      className={`border-border transition-all ${
        !inquiry.isRead
          ? 'border-l-4 border-l-primary bg-primary/5'
          : 'opacity-80'
      }`}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            {/* Header row */}
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <span className="font-heading text-sm font-semibold text-foreground">
                {inquiry.name}
              </span>
              {!inquiry.isRead && (
                <Badge className="bg-primary text-primary-foreground font-body text-xs px-2 py-0">
                  New
                </Badge>
              )}
              {inquiry.isRead && (
                <Badge variant="outline" className="font-body text-xs border-muted-foreground/40 text-muted-foreground">
                  Read
                </Badge>
              )}
            </div>

            {/* Contact info */}
            <div className="flex items-center gap-4 mb-3 flex-wrap">
              <a
                href={`tel:${inquiry.phone}`}
                className="flex items-center gap-1.5 font-body text-xs text-primary hover:underline"
              >
                <Phone className="h-3 w-3" />
                {inquiry.phone}
              </a>
              <div className="flex items-center gap-1.5 font-body text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                {formatTimestamp(inquiry.timestamp)}
              </div>
            </div>

            {/* Message */}
            <p className="font-body text-sm text-foreground/80 leading-relaxed mb-3 bg-background rounded-lg p-3 border border-border">
              {inquiry.message}
            </p>

            {/* Product of interest */}
            {inquiry.productId !== undefined && inquiry.productId !== null && (
              <div className="flex items-center gap-1.5 font-body text-xs text-muted-foreground">
                <Package className="h-3 w-3 text-primary" />
                <span>Interested in:</span>
                <span className="font-medium text-foreground">
                  <ProductName productId={inquiry.productId} />
                </span>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-1.5 flex-shrink-0">
            {!inquiry.isRead && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onMarkRead(inquiry.id)}
                disabled={isMarkingRead}
                className="h-8 px-2 font-body text-xs border-primary/30 text-primary hover:bg-primary/5 gap-1"
              >
                {isMarkingRead ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <CheckCheck className="h-3 w-3" />
                )}
                <span className="hidden sm:inline">Mark Read</span>
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(inquiry.id)}
              className="h-8 px-2 font-body text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/5 gap-1"
            >
              <Trash2 className="h-3 w-3" />
              <span className="hidden sm:inline">Delete</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function AdminEnquiriesPage() {
  const [deleteId, setDeleteId] = useState<bigint | null>(null);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');

  const { data: inquiries, isLoading } = useGetInquiries();
  const markRead = useMarkInquiryRead();
  const deleteInquiry = useDeleteInquiry();

  const sortedInquiries = [...(inquiries ?? [])].sort((a, b) =>
    Number(b.timestamp) - Number(a.timestamp)
  );

  const filteredInquiries = sortedInquiries.filter((i) => {
    if (filter === 'unread') return !i.isRead;
    if (filter === 'read') return i.isRead;
    return true;
  });

  const unreadCount = (inquiries ?? []).filter((i) => !i.isRead).length;

  const handleMarkRead = async (id: bigint) => {
    try {
      await markRead.mutateAsync(id);
    } catch (err) {
      console.error('Mark read failed:', err);
    }
  };

  const handleDelete = async () => {
    if (deleteId === null) return;
    try {
      await deleteInquiry.mutateAsync(deleteId);
      setDeleteId(null);
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-6 md:mt-0 mt-14">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-heading text-2xl font-bold text-foreground">Enquiries</h1>
            {unreadCount > 0 && (
              <Badge className="bg-primary text-primary-foreground font-body text-xs">
                {unreadCount} new
              </Badge>
            )}
          </div>
          <p className="font-body text-sm text-muted-foreground mt-0.5">
            Customer enquiries and messages
          </p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2">
        {(['all', 'unread', 'read'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full font-body text-sm font-medium transition-colors capitalize ${
              filter === f
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80'
            }`}
          >
            {f}
            {f === 'unread' && unreadCount > 0 && (
              <span className="ml-1.5 text-xs">({unreadCount})</span>
            )}
          </button>
        ))}
      </div>

      {/* Enquiries List */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32 w-full rounded-xl" />
          ))}
        </div>
      ) : filteredInquiries.length === 0 ? (
        <div className="text-center py-16">
          <MessageSquare className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
          <p className="font-heading text-base font-semibold text-foreground mb-1">
            No enquiries found
          </p>
          <p className="font-body text-sm text-muted-foreground">
            {filter !== 'all'
              ? `No ${filter} enquiries at the moment`
              : 'Customer enquiries will appear here'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredInquiries.map((inquiry) => (
            <EnquiryCard
              key={inquiry.id.toString()}
              inquiry={inquiry}
              onMarkRead={handleMarkRead}
              onDelete={(id) => setDeleteId(id)}
              isMarkingRead={markRead.isPending}
            />
          ))}
        </div>
      )}

      {/* Delete Confirmation */}
      <AlertDialog
        open={deleteId !== null}
        onOpenChange={(open) => !open && setDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="font-heading text-lg font-bold">
              Delete Enquiry?
            </AlertDialogTitle>
            <AlertDialogDescription className="font-body text-sm text-muted-foreground">
              This will permanently delete the customer enquiry. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="font-body border-border">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 font-body"
            >
              {deleteInquiry.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Delete'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
