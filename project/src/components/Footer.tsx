import React from 'react';
import { Link } from 'react-router-dom';
import { Twitter, Linkedin, Github, Mail } from 'lucide-react';

const Footer = () => {
  const footerLinks = {
    Product: [
      { name: 'Features', href: '/features' },
      { name: 'Pricing', href: '/pricing' },
      { name: 'FAQ', href: '/pricing#faq' },
      { name: 'Roadmap', href: '#' },
    ],
    Company: [
      { name: 'About', href: '/about' },
      { name: 'Contact', href: '/contact' },
      { name: 'Careers', href: '#' },
      { name: 'Press', href: '#' },
    ],
    Legal: [
      { name: 'Privacy Policy', href: '#' },
      { name: 'Terms of Service', href: '#' },
      { name: 'Cookie Policy', href: '#' },
      { name: 'Security', href: '#' },
    ],
  };

  return (
    <footer className="bg-gradient-to-br from-gray-900 to-brand-purple text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 sm:gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center space-x-2 mb-3 sm:mb-4">
              <div className="w-6 sm:w-8 h-6 sm:h-8 rounded-lg flex items-center justify-center">
                <img 
                  src="/logo copy.png" 
                  alt="InOutBook Logo" 
                  className="w-6 sm:w-8 h-6 sm:h-8 object-contain"
                />
              </div>
              <span className="text-lg sm:text-xl font-bold">InOutBook</span>
            </Link>
            <p className="text-gray-300 text-xs sm:text-sm mb-4 sm:mb-6 max-w-sm">
              Lightweight yet powerful web application for tracking project-level income and expenses. 
              Perfect for businesses and freelancers managing multiple projects.
            </p>
            <div className="flex space-x-3 sm:space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                <Twitter className="w-4 sm:w-5 h-4 sm:h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                <Linkedin className="w-4 sm:w-5 h-4 sm:h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                <Github className="w-4 sm:w-5 h-4 sm:h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                <Mail className="w-4 sm:w-5 h-4 sm:h-5" />
              </a>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-xs sm:text-sm font-semibold text-white mb-3 sm:mb-4">{category}</h3>
              <ul className="space-y-2 sm:space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-xs sm:text-sm text-gray-300 hover:text-white transition-colors duration-200"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-800 mt-8 sm:mt-12 pt-6 sm:pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-xs sm:text-sm text-gray-400">
            © 2024 InOutBook. All rights reserved.
          </p>
          <div className="mt-3 md:mt-0 flex flex-wrap justify-center space-x-4 sm:space-x-6">
            <Link to="#" className="text-xs sm:text-sm text-gray-400 hover:text-white transition-colors duration-200">
              Status
            </Link>
            <Link to="#" className="text-xs sm:text-sm text-gray-400 hover:text-white transition-colors duration-200">
              Help Center
            </Link>
            <Link to="#" className="text-xs sm:text-sm text-gray-400 hover:text-white transition-colors duration-200">
              API Docs
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;