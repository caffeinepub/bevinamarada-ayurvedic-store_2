import { Link } from '@tanstack/react-router';
import { Phone, MessageCircle, MapPin, Leaf, Heart } from 'lucide-react';

const STORE_PHONE = '+91 98765 43210';
const STORE_PHONE_RAW = '+919876543210';
const WHATSAPP_NUMBER = '919876543210';
const STORE_ADDRESS = 'Bevinamarada Ayurvedic Store, Main Road, Karnataka, India';

export default function CustomerFooter() {
  const year = new Date().getFullYear();
  const appId = encodeURIComponent(typeof window !== 'undefined' ? window.location.hostname : 'bevinamarada-ayurvedic');

  return (
    <footer className="bg-ayur-green-deep text-ayur-cream">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full overflow-hidden border border-ayur-gold">
                <img
                  src="/assets/generated/store-logo.dim_256x256.png"
                  alt="Logo"
                  className="w-full h-full object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
              </div>
              <h3 className="font-heading text-base font-semibold">Bevinamarada Ayurvedic Store</h3>
            </div>
            <p className="font-body text-sm text-ayur-cream/70 leading-relaxed">
              Authentic Ayurvedic medicines and herbal products rooted in the healing wisdom of Neem (Bevinamarada).
            </p>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading text-sm font-semibold mb-3 text-ayur-gold">Contact Us</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href={`tel:${STORE_PHONE_RAW}`}
                  className="flex items-center gap-2 font-body text-sm text-ayur-cream/80 hover:text-ayur-cream transition-colors"
                >
                  <Phone className="h-4 w-4 text-ayur-gold flex-shrink-0" />
                  {STORE_PHONE}
                </a>
              </li>
              <li>
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 font-body text-sm text-ayur-cream/80 hover:text-ayur-cream transition-colors"
                >
                  <MessageCircle className="h-4 w-4 text-ayur-gold flex-shrink-0" />
                  WhatsApp Chat
                </a>
              </li>
              <li>
                <div className="flex items-start gap-2 font-body text-sm text-ayur-cream/70">
                  <MapPin className="h-4 w-4 text-ayur-gold flex-shrink-0 mt-0.5" />
                  <span>{STORE_ADDRESS}</span>
                </div>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading text-sm font-semibold mb-3 text-ayur-gold">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { to: '/', label: 'Home' },
                { to: '/products', label: 'Products' },
                { to: '/about', label: 'About Us' },
                { to: '/contact', label: 'Contact' },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="font-body text-sm text-ayur-cream/70 hover:text-ayur-cream transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-ayur-green-mid/40 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-body text-xs text-ayur-cream/50">
            © {year} Bevinamarada Ayurvedic Store. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <p className="font-body text-xs text-ayur-cream/50 flex items-center gap-1">
              Built with <Heart className="h-3 w-3 text-red-400 fill-red-400" /> using{' '}
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-ayur-gold hover:underline"
              >
                caffeine.ai
              </a>
            </p>
            <Link
              to="/admin/login"
              className="font-body text-xs text-ayur-cream/30 hover:text-ayur-cream/60 transition-colors"
            >
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
