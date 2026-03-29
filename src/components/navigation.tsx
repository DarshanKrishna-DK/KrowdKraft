"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Menu, X, Users } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "#home", label: "Home" },
  { href: "#about", label: "About" },
  { href: "/events", label: "Events" },
  { href: "#services", label: "Services" },
  { href: "#community", label: "Community" },
  { href: "#merch", label: "Merch" },
  { href: "#team", label: "Team" },
  { href: "#faq", label: "FAQ" },
] as const;

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const pathname = usePathname();

  // Track active section based on scroll position
  useEffect(() => {
    if (pathname !== "/") return;

    const handleScroll = () => {
      const sections = navItems
        .filter(item => item.href.startsWith("#"))
        .map(item => item.href.substring(1));

      const scrollPosition = window.scrollY + 100; // Offset for header height

      for (const sectionId of sections) {
        const section = document.getElementById(sectionId);
        if (section) {
          const { offsetTop, offsetHeight } = section;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(`#${sectionId}`);
            break;
          }
        }
      }
    };

    handleScroll(); // Initial check
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  const scrollToSection = (href: string) => {
    if (href.startsWith("/")) {
      window.location.href = href;
      return;
    }
    if (pathname !== "/") {
      window.location.href = `/${href}`;
      return;
    }
    const el = document.querySelector(href);

    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      setTimeout(() => setIsOpen(false), 700);
    }
  };

  const baseLink =
    "text-muted-foreground hover:text-foreground transition-colors duration-200 relative group cursor-pointer";
  const underline =
    "absolute -bottom-1 left-0 h-0.5 bg-neon transition-all duration-200";

  return (
    <motion.nav
      role="navigation"
      aria-label="Main"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center space-x-2 group cursor-pointer"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.2 }}
              className="w-12 h-12 relative"
            >
              <Image
                src="/KrowdKraft_Logo.png"
                alt="KrowdKraft Logo"
                width={48}
                height={48}
                className="object-contain"
                priority
              />
            </motion.div>
            <span className="font-bold text-2xl neon-text group-hover:text-neon transition-colors duration-300">
              KrowdKraft
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden nav-break:flex items-center space-x-8">
            {navItems.map((item) => {
              const isRoute = item.href.startsWith("/");
              const isActive = isRoute ? pathname === item.href : activeSection === item.href;
              const linkClasses = isActive
                ? baseLink.replace("text-muted-foreground", "text-foreground")
                : baseLink;

              return isRoute ? (
                <Link
                  key={item.href}
                  href={item.href}
                  className={linkClasses}
                  aria-current={isActive ? "page" : undefined}
                >
                  {item.label}
                  <span
                    className={`${underline} ${isActive ? "w-full" : "w-0 group-hover:w-full"
                      }`}
                  />
                </Link>
              ) : (
                <button
                  key={item.href}
                  onClick={() => scrollToSection(item.href)}
                  className={linkClasses}
                >
                  {item.label}
                  <span className={`${underline} ${isActive ? "w-full" : "w-0 group-hover:w-full"
                    }`} />
                </button>
              );
            })}

            {/* CTA */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{
                type: "spring",
                stiffness: 600,
                damping: 25,
                duration: 0.2,
              }}
            >
              <Button asChild variant="neon" size="sm" className="ml-4">
                <Link href="/join-community">
                  <Users className="mr-2 h-4 w-4 pointer-events-none" />
                  Join Our Community
                </Link>
              </Button>
            </motion.div>
          </div>

          {/* Mobile menu button */}
          <div className="nav-break:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              {isOpen ? (
                <X className="h-6 w-6 pointer-events-none" />
              ) : (
                <Menu className="h-6 w-6 pointer-events-none" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="nav-break:hidden glass border-t border-white/10"
          >
            <div className="px-4 py-4 space-y-4">
              {navItems.map((item, index) => {
                const isRoute = item.href.startsWith("/");
                const isActive = isRoute ? pathname === item.href : activeSection === item.href;
                const mobileBase = "block py-2 transition-colors duration-200";
                const mobileCls = isActive
                  ? `${mobileBase} text-foreground font-medium`
                  : `${mobileBase} text-muted-foreground hover:text-foreground`;

                return (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    {isRoute ? (
                      <Link
                        href={item.href}
                        className={mobileCls}
                        aria-current={isActive ? "page" : undefined}
                        onClick={() => setIsOpen(false)}
                      >
                        {item.label}
                      </Link>
                    ) : (
                      <button
                        onClick={() => scrollToSection(item.href)}
                        className={`${mobileCls} text-left w-full`}
                      >
                        {item.label}
                      </button>
                    )}
                  </motion.div>
                );
              })}

              {/* CTA */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: navItems.length * 0.1 }}
                className="pt-4 border-t border-white/10"
              >
                <Button asChild variant="neon" size="sm" className="w-full">
                  <Link href="/join-community" onClick={() => setIsOpen(false)}>
                    <Users className="mr-2 h-4 w-4 pointer-events-none" />
                    Join Our Community
                  </Link>
                </Button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
