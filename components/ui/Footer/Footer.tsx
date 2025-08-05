import Link from 'next/link';
import Image from 'next/image';
import { Github, Twitter, Linkedin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 py-12 md:grid-cols-4">
          <div className="col-span-1">
            <Link
              href="/"
              className="flex items-center gap-2 text-amber-600 hover:text-amber-700 transition-colors"
            >
              <Image
                src="/autoailogo.png"
                alt="AutoAI Logo"
                width={32}
                height={32}
                className="w-8 h-8"
              />
              <span className="text-xl font-bold">AutoAI</span>
            </Link>
            <p className="mt-4 text-sm text-gray-600">
              AI-powered platform to create beautiful websites for local shops and restaurants.
            </p>
          </div>
          
          <div className="col-span-1">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Product</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/landing"
                  className="text-sm text-gray-600 hover:text-amber-600 transition-colors"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard"
                  className="text-sm text-gray-600 hover:text-amber-600 transition-colors"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="text-sm text-gray-600 hover:text-amber-600 transition-colors"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="text-sm text-gray-600 hover:text-amber-600 transition-colors"
                >
                  API
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="col-span-1">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Support</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/"
                  className="text-sm text-gray-600 hover:text-amber-600 transition-colors"
                >
                  Documentation
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="text-sm text-gray-600 hover:text-amber-600 transition-colors"
                >
                  Guides
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="text-sm text-gray-600 hover:text-amber-600 transition-colors"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="text-sm text-gray-600 hover:text-amber-600 transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="col-span-1">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Legal</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/"
                  className="text-sm text-gray-600 hover:text-amber-600 transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="text-sm text-gray-600 hover:text-amber-600 transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="text-sm text-gray-600 hover:text-amber-600 transition-colors"
                >
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 py-8">
          <div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
            <div className="text-sm text-gray-600">
              &copy; {new Date().getFullYear()} AutoAI. All rights reserved.
            </div>
            <div className="flex items-center space-x-6">
              <a
                href="https://github.com"
                aria-label="GitHub"
                className="text-gray-400 hover:text-amber-600 transition-colors"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com"
                aria-label="Twitter"
                className="text-gray-400 hover:text-amber-600 transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="https://linkedin.com"
                aria-label="LinkedIn"
                className="text-gray-400 hover:text-amber-600 transition-colors"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
