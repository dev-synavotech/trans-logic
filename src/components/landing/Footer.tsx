import { Link } from "react-router-dom";
import { Truck, Mail, Phone, MapPin, Linkedin, Twitter, Github } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 mb-12">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-2 lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
                <Truck className="w-5 h-5 text-accent-foreground" />
              </div>
              <span className="text-xl font-bold">
                Trans<span className="text-accent">Logic</span>
              </span>
            </Link>
            <p className="text-primary-foreground/70 text-sm mb-6 leading-relaxed">
              AI-enabled transportation and logistics platform for modern businesses.
            </p>
            <div className="flex items-center gap-4">
              <SocialIcon icon={Linkedin} />
              <SocialIcon icon={Twitter} />
              <SocialIcon icon={Github} />
            </div>
          </div>

          {/* Solutions */}
          <div>
            <h4 className="font-semibold mb-4 text-accent">Solutions</h4>
            <ul className="space-y-3">
              <FooterLink label="Fleet Management" />
              <FooterLink label="Route Optimization" />
              <FooterLink label="Dynamic Pricing" />
              <FooterLink label="Live Tracking" />
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold mb-4 text-accent">Company</h4>
            <ul className="space-y-3">
              <FooterLink label="About Us" />
              <FooterLink label="Careers" />
              <FooterLink label="Blog" />
              <FooterLink label="Contact" />
            </ul>
          </div>

          {/* Contact */}
          <div className="col-span-2 md:col-span-1">
            <h4 className="font-semibold mb-4 text-accent">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-sm text-primary-foreground/70">
                <Mail className="w-4 h-4 text-accent flex-shrink-0" />
                <span className="break-all">support@translogic.io</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-primary-foreground/70">
                <Phone className="w-4 h-4 text-accent flex-shrink-0" />
                +1 (555) 123-4567
              </li>
              <li className="flex items-start gap-3 text-sm text-primary-foreground/70">
                <MapPin className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                <span>123 Logistics Way, Suite 100<br />San Francisco, CA 94102</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-primary-foreground/10 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <p className="text-sm text-primary-foreground/60">
            © 2026 TransLogic. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center justify-center md:justify-end gap-4 sm:gap-6 text-sm text-primary-foreground/60">
            <Link to="#" className="hover:text-accent transition-colors">Privacy Policy</Link>
            <Link to="#" className="hover:text-accent transition-colors">Terms of Service</Link>
            <Link to="#" className="hover:text-accent transition-colors">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

const FooterLink = ({ label }: { label: string }) => (
  <li>
    <Link to="#" className="text-sm text-primary-foreground/70 hover:text-accent transition-colors">
      {label}
    </Link>
  </li>
);

const SocialIcon = ({ icon: Icon }: { icon: typeof Linkedin }) => (
  <a href="#" className="w-9 h-9 rounded-lg bg-primary-foreground/10 flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-colors">
    <Icon className="w-4 h-4" />
  </a>
);

export default Footer;
