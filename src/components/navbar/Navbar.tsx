"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-gray-900 text-white px-6 py-4 fixed top-0 w-full shadow-lg border-b border-gray-700 z-50">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold">
          💰 FinTrack
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex space-x-6">
          <NavLink href="/">Home</NavLink>
          <NavLink href="/dashboard">Dashboard</NavLink>
          <NavLink href="/transactions">Transactions</NavLink>
          <NavLink href="/report">Report</NavLink>
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          className="md:hidden text-white"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </Button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden mt-4 space-y-2">
          <NavLink href="/" mobile>Home</NavLink>
          <NavLink href="/dashboard" mobile>Dashboard</NavLink>
          <NavLink href="/transactions" mobile>Transactions</NavLink>
          <NavLink href="/report" mobile>Report</NavLink>
        </div>
      )}
    </nav>
  );
}

// Reusable NavLink Component
const NavLink = ({ href, children, mobile }: { href: string; children: React.ReactNode; mobile?: boolean }) => (
  <Link
    href={href}
    className={`block transition-colors duration-200 ${
      mobile
        ? "p-2 text-center bg-gray-800 rounded-md hover:bg-gray-700"
        : "relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-[2px] after:bg-white after:transition-all after:duration-300 hover:after:w-full"
    } hover:text-gray-300`}
  >
    {children}
  </Link>
);
