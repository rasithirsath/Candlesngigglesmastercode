import { Link } from "react-router-dom";
import {
  Instagram,
  Facebook,
  Twitter,
  Youtube,
  Linkedin,
  MailCheck,
  MessageCircle,
} from "lucide-react";
import { motion } from "framer-motion";

const Footer = () => {
  const socialLinks = [
    {
      icon: Instagram,
      href: "https://www.instagram.com/candlesngiggles/",
      label: "Instagram",
    },
    {
      icon: Linkedin,
      href: "https://www.linkedin.com/company/candlesngiggles/posts/?feedView=all",
      label: "Linkedin",
    },
    {
      icon: MailCheck,
      href: "https://mail.google.com/mail/?view=cm&fs=1&to=candlesngiggles@gmail.com",
      label: "mail",
    },
    {
      icon: MessageCircle,
      href: "https://wa.me/918668198480?text=Hello%20Candles%20and%20Giggles%20I%20want%20to%20know%20about%20your%20candles",
      label: "WhatsApp",
    },
    // { icon: Youtube, href: "#", label: "Youtube" },
  ];

  const footerLinks = [
    { name: "Shop", path: "/shop" },
    { name: "About", path: "/about" },
    { name: "Quiz", path: "/quiz" },
    // ✅ FIXED
  ];

  return (
    <footer className="relative bg-background border-t border-primary/10">
      {/* Ambient Glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-48 bg-primary/5 rounded-full blur-[100px]" />
      </div>

      <div className="container mx-auto px-6 py-16 relative">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <Link to="/">
            <h2 className="text-3xl font-light tracking-[0.2em] text-primary text-shadow-gold">
              Candles&Giggles
            </h2>
          </Link>
          <p className="text-muted-foreground mt-4 font-light tracking-wide">
            Where emotions meet fragrance
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          viewport={{ once: true }}
          className="text-center mb-6"
        >
          <p className="text-sm uppercase tracking-[0.25em] text-foreground/60 font-light">
            Reach Us Through These Platforms
          </p>
        </motion.div>
        {/* Social Icons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="flex justify-center gap-8 mb-12"
        >
          {socialLinks.map(({ icon: Icon, href, label }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="group p-3 border border-primary/20 rounded-full hover:border-primary hover:shadow-[0_0_20px_hsl(43_45%_59%_/_0.2)] transition-all duration-500"
            >
              <Icon
                size={24}
                className="text-primary/60 group-hover:text-primary transition-colors duration-500"
              />
            </a>
          ))}
        </motion.div>

        {/* Footer Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="flex justify-center gap-8 mb-12 flex-wrap"
        >
          {footerLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className="text-sm uppercase tracking-[0.2em] text-foreground/60 hover:text-primary transition-colors duration-500 font-light"
            >
              {link.name}
            </Link>
          ))}
        </motion.div>

        {/* Divider */}
        <div className="luxury-divider mb-8" />

        {/* Copyright */}
        <p className="text-center text-muted-foreground text-sm font-light tracking-wide">
          © 2026 candles&giggles. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
