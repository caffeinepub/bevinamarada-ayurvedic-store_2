import { useState } from 'react';
import { Phone, MessageCircle, MapPin, Mail, Send, CheckCircle, Leaf } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSubmitInquiry, useGetProducts } from '../hooks/useQueries';

const STORE_PHONE = '+91 98765 43210';
const STORE_PHONE_RAW = '+919876543210';
const WHATSAPP_NUMBER = '919876543210';
const STORE_ADDRESS = 'Bevinamarada Ayurvedic Store, Main Road, Karnataka, India';

export default function ContactPage() {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    message: '',
    productId: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const { data: products } = useGetProducts(false);
  const visibleProducts = (products ?? []).filter((p) => !p.isHidden);
  const submitInquiry = useSubmitInquiry();

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.name.trim()) newErrors.name = 'Name is required';
    if (!form.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!form.message.trim()) newErrors.message = 'Message is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await submitInquiry.mutateAsync({
        name: form.name.trim(),
        phone: form.phone.trim(),
        message: form.message.trim(),
        productId: form.productId ? BigInt(form.productId) : undefined,
      });
      setSubmitted(true);
      setForm({ name: '', phone: '', message: '', productId: '' });
    } catch (error) {
      console.error('Failed to submit inquiry:', error);
    }
  };

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
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-foreground mb-3">Contact Us</h1>
          <p className="font-body text-sm text-muted-foreground max-w-md mx-auto">
            We're here to help. Reach out for product enquiries, health guidance, or any questions.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 pb-14">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Contact Info */}
          <div className="space-y-6">
            <div>
              <h2 className="font-heading text-xl font-bold text-foreground mb-4">Get in Touch</h2>
              <div className="space-y-4">
                <a
                  href={`tel:${STORE_PHONE_RAW}`}
                  className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border hover:border-primary/30 hover:shadow-leaf transition-all group"
                >
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                    <Phone className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-body text-xs text-muted-foreground">Phone</p>
                    <p className="font-heading text-sm font-semibold text-foreground">{STORE_PHONE}</p>
                  </div>
                </a>

                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border hover:border-primary/30 hover:shadow-leaf transition-all group"
                >
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                    <MessageCircle className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-body text-xs text-muted-foreground">WhatsApp</p>
                    <p className="font-heading text-sm font-semibold text-foreground">Chat with us</p>
                  </div>
                </a>

                <div className="flex items-start gap-4 p-4 rounded-xl bg-card border border-border">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-body text-xs text-muted-foreground">Address</p>
                    <p className="font-heading text-sm font-semibold text-foreground">{STORE_ADDRESS}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Map */}
            <div>
              <h3 className="font-heading text-base font-semibold text-foreground mb-3">Find Us</h3>
              <div className="rounded-xl overflow-hidden border border-border h-52 bg-muted">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.0!2d77.5946!3d12.9716!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTLCsDU4JzE3LjgiTiA3N8KwMzUnNDAuNiJF!5e0!3m2!1sen!2sin!4v1234567890"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Store Location"
                />
              </div>
            </div>
          </div>

          {/* Enquiry Form */}
          <div>
            <Card className="border-border shadow-leaf">
              <CardContent className="p-6">
                <h2 className="font-heading text-xl font-bold text-foreground mb-1">Send an Enquiry</h2>
                <p className="font-body text-sm text-muted-foreground mb-6">
                  Fill in the form and we'll get back to you shortly.
                </p>

                {submitted ? (
                  <div className="text-center py-8">
                    <CheckCircle className="h-12 w-12 text-primary mx-auto mb-4" />
                    <h3 className="font-heading text-lg font-semibold text-foreground mb-2">
                      Enquiry Submitted!
                    </h3>
                    <p className="font-body text-sm text-muted-foreground mb-4">
                      Thank you for reaching out. We'll contact you soon.
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => setSubmitted(false)}
                      className="font-body border-primary text-primary hover:bg-primary/5"
                    >
                      Send Another Enquiry
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="name" className="font-body text-sm font-medium text-foreground">
                        Your Name <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="name"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="Enter your name"
                        className={`mt-1 font-body text-sm border-border ${errors.name ? 'border-destructive' : ''}`}
                      />
                      {errors.name && <p className="font-body text-xs text-destructive mt-1">{errors.name}</p>}
                    </div>

                    <div>
                      <Label htmlFor="phone" className="font-body text-sm font-medium text-foreground">
                        Phone Number <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        placeholder="+91 XXXXX XXXXX"
                        className={`mt-1 font-body text-sm border-border ${errors.phone ? 'border-destructive' : ''}`}
                      />
                      {errors.phone && <p className="font-body text-xs text-destructive mt-1">{errors.phone}</p>}
                    </div>

                    <div>
                      <Label htmlFor="product" className="font-body text-sm font-medium text-foreground">
                        Product of Interest (Optional)
                      </Label>
                      <Select
                        value={form.productId}
                        onValueChange={(val) => setForm({ ...form, productId: val })}
                      >
                        <SelectTrigger className="mt-1 font-body text-sm border-border">
                          <SelectValue placeholder="Select a product (optional)" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="" className="font-body text-sm">No specific product</SelectItem>
                          {visibleProducts.map((p) => (
                            <SelectItem key={p.id.toString()} value={p.id.toString()} className="font-body text-sm">
                              {p.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="message" className="font-body text-sm font-medium text-foreground">
                        Message <span className="text-destructive">*</span>
                      </Label>
                      <Textarea
                        id="message"
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        placeholder="Tell us how we can help you..."
                        rows={4}
                        className={`mt-1 font-body text-sm border-border resize-none ${errors.message ? 'border-destructive' : ''}`}
                      />
                      {errors.message && <p className="font-body text-xs text-destructive mt-1">{errors.message}</p>}
                    </div>

                    {submitInquiry.isError && (
                      <p className="font-body text-xs text-destructive">
                        Failed to submit. Please try again.
                      </p>
                    )}

                    <Button
                      type="submit"
                      disabled={submitInquiry.isPending}
                      className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-body font-medium gap-2"
                    >
                      {submitInquiry.isPending ? (
                        <>
                          <div className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4" />
                          Send Enquiry
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
