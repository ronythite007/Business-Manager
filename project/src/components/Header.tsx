import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, Sparkles } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showFeaturesDropdown, setShowFeaturesDropdown] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigation = [
    { 
      name: 'Features', 
      href: '/features',
      hasDropdown: true,
      dropdownItems: [
        { name: 'Project Management', href: '/features#projects' },
        { name: 'Payment Tracking', href: '/features#payments' },
        { name: 'Analytics & Reports', href: '/features#analytics' },
        { name: 'Export Tools', href: '/features#export' }
      ]
    },
    { name: 'Pricing', href: '/pricing' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <header className={`fixed w-full top-0 z-50 transition-all duration-500 ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-xl shadow-lg border-b border-gray-100' 
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        <div className="flex justify-between items-center py-3 sm:py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 sm:space-x-3 group">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
              <img 
                src="/logo copy.png" 
                alt="InOutBook Logo" 
                className="w-8 h-8 sm:w-10 sm:h-10 object-contain"
              />
            </div>
            <span className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 group-hover:text-brand-purple transition-colors duration-300">
              InOutBook
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navigation.map((item) => (
              <div key={item.name} className="relative group">
                {item.hasDropdown ? (
                  <div
                    onMouseEnter={() => setShowFeaturesDropdown(true)}
                    onMouseLeave={() => setShowFeaturesDropdown(false)}
                  >
                    <button className={`flex items-center px-3 xl:px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-gray-50 hover:text-brand-purple ${
                      location.pathname === item.href ? 'text-brand-purple bg-brand-purple/10' : 'text-gray-700'
                    }`}>
                      {item.name}
                      <ChevronDown className="ml-1 w-4 h-4" />
                    </button>
                    
                    {showFeaturesDropdown && (
                      <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 animate-slide-up">
                        {item.dropdownItems?.map((dropdownItem) => (
                          <Link
                            key={dropdownItem.name}
                            to={dropdownItem.href}
                            className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-brand-purple transition-colors duration-200"
                          >
                            {dropdownItem.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    to={item.href}
                    className={`px-3 xl:px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-gray-50 hover:text-brand-purple ${
                      location.pathname === item.href ? 'text-brand-purple bg-brand-purple/10' : 'text-gray-700'
                    }`}
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
          </nav>

          {/* Desktop CTA Buttons */}
          <div className="hidden lg:flex items-center space-x-2 xl:space-x-3">
            <Link
              to="/login"
              className="px-3 xl:px-4 py-2 text-sm font-medium text-gray-700 hover:text-brand-purple transition-colors duration-200 rounded-lg hover:bg-gray-50"
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              className="relative bg-gradient-hero text-white px-4 xl:px-6 py-2 xl:py-2.5 rounded-xl text-sm font-semibold hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl overflow-hidden group"
            >
              <span className="relative z-10 flex items-center">
                <Sparkles className="w-4 h-4 mr-1 xl:mr-2" />
                <span className="hidden sm:inline">Try Free</span>
                <span className="sm:hidden">Free</span>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-brand-orange to-brand-coral opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors duration-200"
          >
            {isMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden pb-4 sm:pb-6 animate-slide-up bg-white/95 backdrop-blur-xl rounded-b-2xl shadow-lg border-t border-gray-100 -mx-3 sm:-mx-4 px-3 sm:px-4">
            <nav className="space-y-1 sm:space-y-2 pt-4">
              {navigation.map((item) => (
                <div key={item.name}>
                  <Link
                    to={item.href}
                    className={`block px-3 sm:px-4 py-2 sm:py-3 rounded-xl text-base font-medium transition-colors duration-200 ${
                      location.pathname === item.href
                        ? 'text-brand-purple bg-brand-purple/10'
                        : 'text-gray-700 hover:text-brand-purple hover:bg-gray-50'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                  {/* Mobile Dropdown Items */}
                  {item.hasDropdown && (
                    <div className="ml-4 mt-1 space-y-1">
                      {item.dropdownItems?.map((dropdownItem) => (
                        <Link
                          key={dropdownItem.name}
                          to={dropdownItem.href}
                          className="block px-3 py-2 text-sm text-gray-600 hover:text-brand-purple hover:bg-gray-50 rounded-lg transition-colors duration-200"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {dropdownItem.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <div className="pt-3 sm:pt-4 space-y-2 sm:space-y-3 border-t border-gray-200 mt-3 sm:mt-4">
                <Link
                  to="/login"
                  className="block px-3 sm:px-4 py-2 sm:py-3 rounded-xl text-base font-medium text-gray-700 hover:text-brand-purple hover:bg-gray-50 transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="block bg-gradient-hero text-white px-3 sm:px-4 py-2 sm:py-3 rounded-xl text-base font-semibold text-center hover:scale-105 transition-all duration-200 shadow-lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="flex items-center justify-center">
                    <Sparkles className="w-4 h-4 mr-2" />
                    Try Free
                  </span>
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;