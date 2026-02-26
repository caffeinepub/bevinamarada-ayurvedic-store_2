import { Leaf, Award, Heart, Users, BookOpen } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export default function AboutPage() {
  return (
    <div className="bg-background">
      {/* Hero */}
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 leaf-pattern opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-ayur-green-deep/5 to-background" />
        <div className="relative z-10 container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="h-px w-12 bg-primary/30" />
            <Leaf className="h-4 w-4 text-primary" />
            <div className="h-px w-12 bg-primary/30" />
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-foreground mb-4">About Us</h1>
          <p className="font-body text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Rooted in tradition, committed to your health and wellbeing through authentic Ayurvedic wisdom.
          </p>
        </div>
      </section>

      {/* Owner Section */}
      <section className="py-12 bg-card border-y border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-8 max-w-3xl mx-auto">
            <div className="flex-shrink-0">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-primary/20 bg-muted flex items-center justify-center shadow-leaf">
                <Users className="h-16 w-16 text-muted-foreground/40" />
              </div>
            </div>
            <div>
              <p className="font-body text-xs text-primary font-semibold uppercase tracking-wide mb-1">Store Owner</p>
              <h2 className="font-heading text-2xl font-bold text-foreground mb-2">Proprietor</h2>
              <p className="font-body text-sm text-muted-foreground leading-relaxed mb-4">
                With decades of experience in Ayurvedic medicine, our proprietor has dedicated their life to bringing authentic, effective herbal remedies to the community. Their deep knowledge of traditional Ayurvedic texts and modern applications ensures every product meets the highest standards of quality and efficacy.
              </p>
              <div className="flex flex-wrap gap-3">
                {['Certified Ayurvedic Practitioner', 'Community Trusted', '20+ Years Experience'].map((tag) => (
                  <span key={tag} className="font-body text-xs bg-primary/10 text-primary px-3 py-1 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Store History */}
      <section className="py-14 bg-background">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-10">
            <BookOpen className="h-8 w-8 text-primary mx-auto mb-3" />
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground">Our Story</h2>
          </div>
          <div className="space-y-6 font-body text-base text-foreground/80 leading-relaxed">
            <p>
              Bevinamarada Ayurvedic Store was founded with a singular vision: to make authentic, time-tested Ayurvedic medicines accessible to everyone in our community. What began as a small herbal dispensary has grown into a trusted pharmacy serving hundreds of families.
            </p>
            <p>
              Our journey started when our founder recognized a growing need for genuine Ayurvedic products in an era flooded with synthetic alternatives. Drawing from ancient texts and family traditions passed down through generations, we curated a collection of herbal formulations that truly work.
            </p>
            <p>
              Today, we stock over a hundred carefully selected Ayurvedic products — from classical formulations like Chyawanprash and Triphala to specialized herbal oils, powders, and tablets. Every product in our store is sourced from reputable manufacturers who adhere to traditional preparation methods.
            </p>
          </div>
        </div>
      </section>

      <Separator className="max-w-3xl mx-auto" />

      {/* Bevinamarada / Neem Section */}
      <section className="py-14 bg-background">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-10">
            <Leaf className="h-8 w-8 text-primary mx-auto mb-3" />
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground">
              The Sacred Neem — Bevinamarada
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card className="border-border bg-card">
              <CardContent className="p-6">
                <h3 className="font-heading text-lg font-semibold text-foreground mb-3">What is Bevinamarada?</h3>
                <p className="font-body text-sm text-muted-foreground leading-relaxed">
                  "Bevinamarada" (ಬೇವಿನಮರದ) is the Kannada name for the Neem tree (<em>Azadirachta indica</em>). In Ayurveda, Neem is called "Sarva Roga Nivarini" — the universal healer. Every part of the Neem tree, from its leaves to its bark and seeds, holds profound medicinal value.
                </p>
              </CardContent>
            </Card>
            <Card className="border-border bg-card">
              <CardContent className="p-6">
                <h3 className="font-heading text-lg font-semibold text-foreground mb-3">Healing Properties</h3>
                <ul className="font-body text-sm text-muted-foreground space-y-2">
                  {[
                    'Powerful antibacterial & antifungal',
                    'Blood purification & detoxification',
                    'Skin health & wound healing',
                    'Immune system strengthening',
                    'Digestive health support',
                  ].map((prop) => (
                    <li key={prop} className="flex items-center gap-2">
                      <Leaf className="h-3 w-3 text-primary flex-shrink-0" />
                      {prop}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
          <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 text-center">
            <p className="font-heading text-base italic text-foreground/80 leading-relaxed">
              "Just as the Neem tree gives without asking — purifying air, healing wounds, nourishing the earth — our store is committed to giving you the best of nature's pharmacy, with honesty and care."
            </p>
            <p className="font-body text-sm text-primary mt-3 font-medium">— Our Founding Philosophy</p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-12 bg-card border-t border-border">
        <div className="container mx-auto px-4">
          <h2 className="font-heading text-xl sm:text-2xl font-bold text-foreground text-center mb-8">Our Values</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {[
              { icon: Award, title: 'Authenticity', desc: 'Only genuine, quality-tested Ayurvedic products' },
              { icon: Heart, title: 'Care', desc: 'Personalized guidance for every customer\'s health needs' },
              { icon: Leaf, title: 'Nature First', desc: 'Committed to natural, sustainable healing solutions' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-heading text-base font-semibold text-foreground mb-1">{title}</h3>
                <p className="font-body text-sm text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
