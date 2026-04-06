"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Home, Search, Building2, Utensils, Menu, X } from "lucide-react";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/", icon: <Home className="w-4 h-4" /> },
    { name: "Find Rooms", href: "#rooms", icon: <Search className="w-4 h-4" /> },
    { name: "Vacancies", href: "#vacancies", icon: <Building2 className="w-4 h-4" /> },
    { name: "Food Stalls", href: "#food", icon: <Utensils className="w-4 h-4" /> },
  ];

  return (
    <header
      className={`fixed left-1/2 -translate-x-1/2 w-[95%] max-w-7xl z-50 transition-all duration-300 rounded-2xl ${
        isScrolled ? "glass shadow-glass py-3" : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary/20">
            BS
          </div>
          <span className="text-xl font-bold tracking-tight text-foreground hidden sm:block">
            Batchelor<span className="text-primary">Solution</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="flex items-center gap-2 text-sm font-medium text-foreground/70 hover:text-primary transition-colors"
            >
              {link.icon}
              {link.name}
            </Link>
          ))}
          <button className="bg-primary hover:bg-primary-hover text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-md shadow-primary/10 active:scale-95">
            Log In
          </button>
        </nav>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden p-2 text-foreground"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 mt-2 glass rounded-2xl shadow-glass overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300">
          <nav className="flex flex-col p-4 gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-primary/5 text-foreground/80 hover:text-primary transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.icon}
                {link.name}
              </Link>
            ))}
            <div className="h-px bg-border-color my-2 mx-2" />
            <button className="w-full bg-primary text-white p-3 rounded-xl font-semibold shadow-md active:scale-95 transition-all">
              Log In
            </button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
