"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useCategory } from "@/contexts/CategoryContext";
import { Globe, MessageCircle, Mail, Phone, MapPin, AtSign } from "lucide-react";

const Footer = () => {
  const { activeCatData } = useCategory();
  const footerLinks = [
    {
      title: "Solutions",
      links: [
        { name: "Find Rooms", href: "#rooms" },
        { name: "Room Vacancy", href: "#vancancy" },
        { name: "Food Stalls", href: "#food" },
        { name: "Add Listing", href: "#add" },
      ],
    },
    {
      title: "Support",
      links: [
        { name: "Help Center", href: "#help" },
        { name: "Safety Guide", href: "#safety" },
        { name: "Terms of Service", href: "#terms" },
        { name: "Privacy Policy", href: "#privacy" },
      ],
    },
    {
      title: "Company",
      links: [
        { name: "About Us", href: "#about" },
        { name: "Contact", href: "#contact" },
        { name: "Partners", href: "#partners" },
        { name: "Careers", href: "#careers" },
      ],
    },
  ];

  const socialLinks = [
    { icon: <Globe className="w-5 h-5" />, href: "#web" },
    { icon: <AtSign className="w-5 h-5" />, href: "#email" },
    { icon: <MessageCircle className="w-5 h-5" />, href: "#chat" },
  ];

  return (
    <footer className="footer bg-white glass border-t border-border-color pt-16 pb-8 transition-all dark:bg-zinc-950/20">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
        <div className="flex flex-col gap-6">
          <Link href="/" className="flex items-center gap-4 transition-transform hover:scale-105 group">
            <div
              className="relative w-16 h-16 rounded-2xl flex items-center justify-center shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100 overflow-hidden transition-all duration-1000"
              style={{ backgroundColor: activeCatData?.hex || "#ffffff" }}
            >
              <Image
                src="/bs-icon.png"
                alt="BatchelorSolution Icon"
                width={64}
                height={64}
                className="object-contain"
              />
            </div>
            <div className="flex flex-col -gap-1">
              <span className="text-xl font-bold tracking-tight text-foreground leading-tight">
                Batchelor<span className="text-primary">Solution</span>
              </span>
              <span className="text-[10px] font-bold text-primary tracking-[0.2em] uppercase">
                Premium Living
              </span>
            </div>
          </Link>
          <p className="text-foreground/70 max-w-xs leading-relaxed text-sm">
            Everything a bachelor needs to live comfortably. Find rooms, food stalls, and community solutions all in one place.
          </p>
          <div className="flex gap-4">
            {socialLinks.map((link, idx) => (
              <a
                key={idx}
                href={link.href}
                className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all transform hover:scale-110 shadow-sm"
              >
                {link.icon}
              </a>
            ))}
          </div>
        </div>

        {footerLinks.map((section) => (
          <div key={section.title} className="flex flex-col gap-6">
            <h3 className="font-bold text-foreground pointer-events-none uppercase tracking-widest text-xs opacity-60">
              {section.title}
            </h3>
            <ul className="flex flex-col gap-3">
              {section.links.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-foreground/70 text-sm hover:text-primary transition-colors flex items-center group"
                  >
                    <span className="w-0 group-hover:w-2 h-0.5 bg-primary mr-0 group-hover:mr-2 rounded-full transition-all duration-300" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="container mx-auto px-6 border-t border-border-color/50 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium text-foreground/50">
        <p>© 2024 BatchelorSolution. All rights reserved.</p>
        <div className="flex gap-8">
          <a href="#privacy" className="hover:text-primary transition-colors">Privacy Policy</a>
          <a href="#terms" className="hover:text-primary transition-colors">Terms of Service</a>
          <a href="#cookies" className="hover:text-primary transition-colors">Cookie Settings</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
