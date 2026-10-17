"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Globe2, Menu, X, ArrowUpRight } from "lucide-react";
import { NAV_LINKS, COMPANY } from "@/lib/constants";

export default function Navbar() {
  const pathname = usePathname();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    dialogRef.current?.close();
  }, [pathname]);

  useEffect(() => {
    const updateScroll = () => setScrolled(window.scrollY > 50);
    updateScroll();
    window.addEventListener("scroll", updateScroll, { passive: true });
    return () => window.removeEventListener("scroll", updateScroll);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const desktop = window.matchMedia("(min-width: 1024px)");
    const closeOnDesktop = () => {
      if (desktop.matches) dialogRef.current?.close();
    };
    desktop.addEventListener("change", closeOnDesktop);
    return () => {
      document.body.style.overflow = previousOverflow;
      desktop.removeEventListener("change", closeOnDesktop);
    };
  }, [isOpen]);

  const active = (href: string) =>
    pathname === href || (href !== "/" && pathname.startsWith(`${href}/`));
  const closeMenu = () => dialogRef.current?.close();

  return (
    <>
      <header
        className={`site-header fixed inset-x-0 top-0 z-50 border-b border-white/10 text-white transition-all duration-300 ${scrolled ? "bg-navy-950/95 py-3 shadow-lg backdrop-blur-md" : "bg-navy-900 py-5"}`}
      >
        <nav
          aria-label="Main navigation"
          className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 sm:px-8"
        >
          <Link
            href="/"
            aria-label="A2 Meridian ASSOCIATES home"
            className="flex shrink-0 items-center gap-3"
          >
            <span className="flex size-10 items-center justify-center rounded-lg bg-gold-500 text-navy-900">
              <Globe2 size={25} aria-hidden="true" />
            </span>
            <span>
              <span className="block font-heading text-lg font-bold leading-tight">
                A2 Meridian
              </span>
              <span className="block text-xs text-gold-400">ASSOCIATES</span>
            </span>
          </Link>
          <div className="hidden items-center gap-1 lg:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active(link.href) ? "page" : undefined}
                className={`border-b-2 px-3 py-2 text-sm transition-colors ${active(link.href) ? "border-gold-500 text-gold-400" : "border-transparent text-gray-300 hover:text-white"}`}
              >
                {link.name}
              </Link>
            ))}
          </div>
          <Link
            href="/contact"
            className="hidden items-center gap-2 rounded-md bg-gold-500 px-5 py-3 text-sm font-semibold text-navy-950 transition-colors hover:bg-gold-400 lg:inline-flex"
          >
            Get a Quote <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
          <button
            ref={triggerRef}
            type="button"
            aria-label="Open menu"
            title="Open menu"
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
            onClick={() => {
              dialogRef.current?.showModal();
              setIsOpen(true);
            }}
            className="flex size-11 items-center justify-center rounded-md hover:bg-white/10 lg:hidden"
          >
            <Menu aria-hidden="true" />
          </button>
        </nav>
      </header>
      <dialog
        ref={dialogRef}
        id="mobile-menu"
        aria-label="Mobile navigation"
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            event.preventDefault();
            event.stopPropagation();
            closeMenu();
          }
        }}
        onCancel={closeMenu}
        onClose={() => {
          setIsOpen(false);
          triggerRef.current?.focus();
        }}
        className="mobile-menu fixed inset-0 m-0 h-dvh max-h-none w-full max-w-none border-0 bg-navy-950 p-0 text-white backdrop:bg-navy-950/90"
      >
        <div className="flex min-h-full flex-col px-6 py-5">
          <div className="flex items-center justify-between gap-4">
            <span className="font-heading text-xl">A2 Meridian Associates</span>
            <button
              type="button"
              autoFocus
              onClick={closeMenu}
              aria-label="Close menu"
              title="Close menu"
              className="flex size-11 shrink-0 items-center justify-center rounded-md hover:bg-white/10"
            >
              <X aria-hidden="true" />
            </button>
          </div>
          <nav
            aria-label="Mobile navigation"
            className="my-auto flex flex-col items-center gap-1 py-8"
          >
            {NAV_LINKS.map((link, index) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMenu}
                aria-current={active(link.href) ? "page" : undefined}
                style={{ animationDelay: `${index * 45}ms` }}
                className={`mobile-menu-link px-6 py-2 font-heading text-2xl ${active(link.href) ? "text-gold-400" : "hover:text-gold-400"}`}
              >
                {link.name}
              </Link>
            ))}
            <Link
              href="/contact"
              onClick={closeMenu}
              className="mt-5 rounded-md bg-gold-500 px-6 py-3 font-semibold text-navy-950"
            >
              Get a Quote
            </Link>
          </nav>
          <div className="pb-4 text-center text-sm text-gray-400">
            <p>Palm Olympia, Gaur City 2, Greater Noida</p>
            <a
              className="mt-2 inline-block text-gold-400"
              href={`mailto:${COMPANY.email}`}
            >
              {COMPANY.email}
            </a>
          </div>
        </div>
      </dialog>
    </>
  );
}
