"use client";

import Link from "next/link";
import { FaFacebook, FaTwitter, FaLinkedin } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-6 mt-10 border-t border-gray-700">
      <div className="container mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-center">
        {/* Left Section - Brand & Copyright */}
        <div className="text-center md:text-left mb-4 md:mb-0">
          <h2 className="text-lg font-bold text-blue-400">FinTrack</h2>
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} FinTrack. All rights reserved.
          </p>
        </div>

        {/* Center Section - Navigation Links */}
        <nav className="flex space-x-6 text-sm">
          <Link href="/dashboard" className="hover:text-blue-400 transition duration-300">
            Dashboard
          </Link>
          <Link href="/budget" className="hover:text-blue-400 transition duration-300">
            Budget
          </Link>
          <Link href="/reports" className="hover:text-blue-400 transition duration-300">
            Reports
          </Link>
          <Link href="/settings" className="hover:text-blue-400 transition duration-300">
            Settings
          </Link>
        </nav>

        {/* Right Section - Social Media Icons */}
        <div className="flex space-x-4">
          <a href="#" className="hover:text-blue-400 transition duration-300">
            <FaFacebook className="text-lg" />
          </a>
          <a href="#" className="hover:text-blue-400 transition duration-300">
            <FaTwitter className="text-lg" />
          </a>
          <a href="#" className="hover:text-blue-400 transition duration-300">
            <FaLinkedin className="text-lg" />
          </a>
        </div>
      </div>
    </footer>
  );
}
