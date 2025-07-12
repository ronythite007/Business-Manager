import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  FolderPlus, 
  Calculator, 
  TrendingUp, 
  Shield, 
  Search, 
  FileText,
  Star,
  CheckCircle,
  Play,
  DollarSign,
  CreditCard,
  PieChart,
  Sparkles,
  Zap,
  Users,
  BarChart3,
  Clock,
  Award,
  Target,
  Rocket,
  Globe,
  ChevronRight
} from 'lucide-react';

const LandingPage = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [statsVisible, setStatsVisible] = useState(false);
  const [isDemoOpen, setIsDemoOpen] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStatsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const statsElement = document.getElementById('stats-section');
    if (statsElement) {
      observer.observe(statsElement);
    }

    return () => observer.disconnect();
  }, []);

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (isDemoOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isDemoOpen]);

  const features = [
    {
      icon: FolderPlus,
      title: 'Smart Project Management',
      description: 'Create unlimited projects with intelligent categorization, automated cost tracking, and real-time profitability insights.',
      gradient: 'from-blue-500 to-purple-600'
    },
    {
      icon: Calculator,
      title: 'Advanced Payment Tracking',
      description: 'Track every transaction with detailed metadata, receipt attachments, and multi-currency support for global projects.',
      gradient: 'from-green-500 to-teal-600'
    },
    {
      icon: BarChart3,
      title: 'Visual Analytics Dashboard',
      description: 'Beautiful charts and graphs that transform your financial data into actionable insights with predictive analytics.',
      gradient: 'from-orange-500 to-red-600'
    },
    {
      icon: Zap,
      title: 'Lightning Fast Search',
      description: 'Find any transaction instantly with AI-powered search, smart filters, and advanced query capabilities.',
      gradient: 'from-purple-500 to-pink-600'
    },
  ];

  const testimonials = [
    {
      name: 'Rajendra Thite',
      role: 'Freelance Designer',
      company: 'Creative Studio',
      avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      quote: "InOutBook transformed how I track my project finances. I can finally see which projects are actually profitable and make better pricing decisions. It's like having a financial advisor built into my workflow.",
      rating: 5
    },
    {
      name: 'Mike Chen',
      role: 'Agency Owner',
      company: 'Digital Solutions Inc',
      avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      quote: "The project-level tracking is exactly what we needed. We can now monitor cash flow for each client project and spot issues early. Our profit margins have improved by 23% since we started using InOutBook.",
      rating: 5
    },
    {
      name: 'Emma Rodriguez',
      role: 'Consultant',
      company: 'Strategy Partners',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      quote: "Simple yet powerful. InOutBook gives me clear visibility into project profitability without the complexity of traditional accounting software. The export features are fantastic for client reports.",
      rating: 5
    },
  ];

  const stats = [
    { number: '10+', label: 'Active Users', icon: Users },
    { number: '₹5L+', label: 'Tracked Revenue', icon: DollarSign },
    { number: '99.9%', label: 'Uptime', icon: Shield },
    { number: '4.9/5', label: 'User Rating', icon: Star }
  ];

  const benefits = [
    {
      icon: Target,
      title: 'Increase Profitability',
      description: 'Identify your most profitable projects and optimize pricing strategies',
      color: 'text-green-600'
    },
    {
      icon: Clock,
      title: 'Save Time',
      description: 'Automate financial tracking and reduce manual bookkeeping by 80%',
      color: 'text-blue-600'
    },
    {
      icon: Award,
      title: 'Make Better Decisions',
      description: 'Data-driven insights help you choose the right projects and clients',
      color: 'text-purple-600'
    },
    {
      icon: Rocket,
      title: 'Scale Your Business',
      description: 'Clear financial visibility enables confident business growth',
      color: 'text-orange-600'
    }
  ];

  return (
    <div className="pt-16 overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 flex items-center">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 sm:top-20 left-5 sm:left-10 w-48 sm:w-72 h-48 sm:h-72 bg-gradient-to-r from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-10 sm:bottom-20 right-5 sm:right-10 w-64 sm:w-96 h-64 sm:h-96 bg-gradient-to-r from-orange-400/20 to-pink-600/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[400px] sm:w-[600px] lg:w-[800px] h-[400px] sm:h-[600px] lg:h-[800px] bg-gradient-to-r from-teal-400/10 to-blue-600/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="text-center lg:text-left animate-fade-in">
              {/* Badge */}
              <div className="inline-flex items-center px-3 sm:px-4 py-2 bg-gradient-hero rounded-full text-white text-xs sm:text-sm font-medium mb-4 sm:mb-6 shadow-lg">
                <Sparkles className="w-3 sm:w-4 h-3 sm:h-4 mr-1 sm:mr-2" />
                #1 Project Finance Tool
                <ChevronRight className="w-3 sm:w-4 h-3 sm:h-4 ml-1 sm:ml-2" />
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 leading-tight mb-4 sm:mb-6">
                Transform Your
                <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 bg-clip-text text-transparent">
                  Project Finances
                </span>
              </h1>
              
              <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-6 sm:mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0 px-4 sm:px-0">
                The most intuitive way to track project income and expenses. Get real-time insights, 
                boost profitability, and make data-driven decisions with confidence.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6 sm:mb-8 max-w-md mx-auto lg:mx-0 px-4 sm:px-0">
                <Link
                  to="/signup"
                  className="group relative bg-gradient-hero text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl flex items-center justify-center overflow-hidden"
                >
                  <span className="relative z-10 flex items-center">
                    <Rocket className="w-4 sm:w-5 h-4 sm:h-5 mr-2" />
                    Start Free Trial
                    <ArrowRight className="ml-2 w-4 sm:w-5 h-4 sm:h-5 group-hover:translate-x-1 transition-transform duration-200" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Link>
                
                <button className="group border-2 border-gray-300 text-gray-700 px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold hover:border-brand-purple hover:text-brand-purple transition-all duration-200 flex items-center justify-center" onClick={() => setIsDemoOpen(true)}>
                  <Play className="mr-2 w-4 sm:w-5 h-4 sm:h-5 group-hover:scale-110 transition-transform duration-200" />
                  Watch Demo
                </button>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-2 sm:space-y-0 sm:space-x-6 text-xs sm:text-sm text-gray-500 px-4 sm:px-0">
                <div className="flex items-center">
                  <CheckCircle className="w-3 sm:w-4 h-3 sm:h-4 text-green-500 mr-1 sm:mr-2" />
                  Free 14-day trial
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-3 sm:w-4 h-3 sm:h-4 text-green-500 mr-1 sm:mr-2" />
                  No credit card required
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-3 sm:w-4 h-3 sm:h-4 text-green-500 mr-1 sm:mr-2" />
                  Cancel anytime
                </div>
              </div>
            </div>
            
            <div className="relative animate-slide-in-right mt-8 lg:mt-0">
              <div className="relative max-w-lg mx-auto">
                {/* Main Dashboard Card */}
                <div className="bg-white/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 lg:p-8 border border-white/20">
                  <div className="flex items-center justify-between mb-4 sm:mb-6">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900">Project Dashboard</h3>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 sm:w-3 h-2 sm:h-3 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-xs sm:text-sm text-gray-600">Live</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-4 sm:mb-6">
                    <div className="bg-gradient-to-br from-green-50 to-emerald-100 p-2 sm:p-4 rounded-xl sm:rounded-2xl border border-green-200">
                      <div className="text-lg sm:text-2xl font-bold text-green-700">$24.5K</div>
                      <div className="text-xs sm:text-sm text-green-600">Total IN</div>
                      <div className="text-xs text-green-500 mt-1">↗ +12%</div>
                    </div>
                    <div className="bg-gradient-to-br from-red-50 to-rose-100 p-2 sm:p-4 rounded-xl sm:rounded-2xl border border-red-200">
                      <div className="text-lg sm:text-2xl font-bold text-red-700">$18.2K</div>
                      <div className="text-xs sm:text-sm text-red-600">Total OUT</div>
                      <div className="text-xs text-red-500 mt-1">↘ -5%</div>
                    </div>
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-2 sm:p-4 rounded-xl sm:rounded-2xl border border-blue-200">
                      <div className="text-lg sm:text-2xl font-bold text-blue-700">$6.3K</div>
                      <div className="text-xs sm:text-sm text-blue-600">Profit</div>
                      <div className="text-xs text-blue-500 mt-1">↗ +23%</div>
                    </div>
                  </div>

                  <div className="space-y-2 sm:space-y-3">
                    <div className="flex items-center justify-between p-2 sm:p-3 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg sm:rounded-xl border border-purple-200">
                      <div className="flex items-center">
                        <div className="w-8 sm:w-10 h-8 sm:h-10 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center mr-2 sm:mr-3">
                          <Globe className="w-4 sm:w-5 h-4 sm:h-5 text-white" />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900 text-sm sm:text-base">Website Redesign</div>
                          <div className="text-xs sm:text-sm text-gray-600">Client: TechCorp</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-green-600 text-sm sm:text-base">+$2,500</div>
                        <div className="text-xs text-gray-500">85% margin</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-2 sm:p-3 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg sm:rounded-xl border border-orange-200">
                      <div className="flex items-center">
                        <div className="w-8 sm:w-10 h-8 sm:h-10 bg-gradient-to-r from-orange-500 to-yellow-600 rounded-lg flex items-center justify-center mr-2 sm:mr-3">
                          <Rocket className="w-4 sm:w-5 h-4 sm:h-5 text-white" />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900 text-sm sm:text-base">Mobile App</div>
                          <div className="text-xs sm:text-sm text-gray-600">Client: StartupXYZ</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-green-600 text-sm sm:text-base">+$4,200</div>
                        <div className="text-xs text-gray-500">92% margin</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Elements */}
                <div className="absolute -top-2 sm:-top-4 -right-2 sm:-right-4 w-12 sm:w-16 h-12 sm:h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-xl animate-bounce-gentle">
                  <TrendingUp className="w-6 sm:w-8 h-6 sm:h-8 text-white" />
                </div>
                
                <div className="absolute -bottom-2 sm:-bottom-4 -left-2 sm:-left-4 w-10 sm:w-12 h-10 sm:h-12 bg-gradient-to-r from-green-400 to-teal-500 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg animate-pulse">
                  <DollarSign className="w-5 sm:w-6 h-5 sm:h-6 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats-section" className="py-12 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className={`text-center animate-slide-up ${statsVisible ? 'animate-count-up' : ''}`}
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="flex items-center justify-center mb-3 sm:mb-4">
                  <div className="w-12 sm:w-16 h-12 sm:h-16 bg-gradient-hero rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg">
                    <stat.icon className="w-6 sm:w-8 h-6 sm:h-8 text-white" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-1 sm:mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium text-sm sm:text-base">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16 animate-fade-in">
            <div className="inline-flex items-center px-3 sm:px-4 py-2 bg-gradient-hero rounded-full text-white text-xs sm:text-sm font-medium mb-4 sm:mb-6">
              <Zap className="w-3 sm:w-4 h-3 sm:h-4 mr-1 sm:mr-2" />
              Powerful Features
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 px-4 sm:px-0">
              Everything you need for
              <span className="block bg-gradient-to-r from-purple-600 to-teal-600 bg-clip-text text-transparent">
                project financial success
              </span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto px-4 sm:px-0">
              From simple transaction tracking to advanced analytics, InOutBook provides 
              all the tools you need to maximize your project profitability.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="group bg-white/80 backdrop-blur-sm p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-white/20 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 animate-slide-up"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className={`w-12 sm:w-16 h-12 sm:h-16 bg-gradient-to-r ${feature.gradient} rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <feature.icon className="w-6 sm:w-8 h-6 sm:h-8 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4 group-hover:text-brand-purple transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 sm:gap-16 items-center">
            <div className="animate-slide-up">
              <div className="inline-flex items-center px-3 sm:px-4 py-2 bg-gradient-to-r from-green-100 to-teal-100 rounded-full text-green-700 text-xs sm:text-sm font-medium mb-4 sm:mb-6">
                <Target className="w-3 sm:w-4 h-3 sm:h-4 mr-1 sm:mr-2" />
                Why Choose InOutBook
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-6 sm:mb-8">
                Built for project-based
                <span className="block text-brand-purple">professionals like you</span>
              </h2>
              
              <div className="space-y-4 sm:space-y-6">
                {benefits.map((benefit, index) => (
                  <div
                    key={benefit.title}
                    className="flex items-start group animate-slide-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className={`w-10 sm:w-12 h-10 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center mr-3 sm:mr-4 mt-1 flex-shrink-0 group-hover:scale-110 transition-transform duration-300 ${
                      benefit.color === 'text-green-600' ? 'bg-green-100' :
                      benefit.color === 'text-blue-600' ? 'bg-blue-100' :
                      benefit.color === 'text-purple-600' ? 'bg-purple-100' : 'bg-orange-100'
                    }`}>
                      <benefit.icon className={`w-5 sm:w-6 h-5 sm:h-6 ${benefit.color}`} />
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-2 group-hover:text-brand-purple transition-colors duration-300">
                        {benefit.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="animate-slide-in-right">
              <div className="relative">
                <img
                  src="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=2"
                  alt="Project financial tracking"
                  className="rounded-2xl sm:rounded-3xl shadow-2xl w-full h-64 sm:h-96 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-teal-600/20 rounded-2xl sm:rounded-3xl"></div>
                
                {/* Floating Stats */}
                <div className="absolute top-2 sm:top-4 right-2 sm:right-4 bg-white/90 backdrop-blur-sm rounded-lg sm:rounded-xl p-2 sm:p-4 shadow-lg animate-float">
                  <div className="text-lg sm:text-2xl font-bold text-green-600">+23%</div>
                  <div className="text-xs sm:text-sm text-gray-600">Profit Increase</div>
                </div>
                
                <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 bg-white/90 backdrop-blur-sm rounded-lg sm:rounded-xl p-2 sm:p-4 shadow-lg animate-float" style={{ animationDelay: '1s' }}>
                  <div className="text-lg sm:text-2xl font-bold text-blue-600">80%</div>
                  <div className="text-xs sm:text-sm text-gray-600">Time Saved</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 sm:py-20 bg-gradient-to-br from-purple-50 to-indigo-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16 animate-fade-in">
            <div className="inline-flex items-center px-3 sm:px-4 py-2 bg-gradient-hero rounded-full text-white text-xs sm:text-sm font-medium mb-4 sm:mb-6">
              <Star className="w-3 sm:w-4 h-3 sm:h-4 mr-1 sm:mr-2" />
              Customer Stories
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 sm:mb-6">
              Loved by thousands of
              <span className="block text-brand-purple">project professionals</span>
            </h2>
          </div>

          <div className="relative max-w-4xl mx-auto">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 shadow-2xl border border-white/20 animate-fade-in">
              <div className="flex items-center mb-4 sm:mb-6">
                {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                  <Star key={i} className="w-5 sm:w-6 h-5 sm:h-6 text-yellow-400 fill-current" />
                ))}
              </div>
              
              <blockquote className="text-lg sm:text-xl lg:text-2xl text-gray-700 leading-relaxed mb-6 sm:mb-8 italic">
                "{testimonials[currentTestimonial].quote}"
              </blockquote>
              
              <div className="flex items-center">
                <img
                  src={testimonials[currentTestimonial].avatar}
                  alt={testimonials[currentTestimonial].name}
                  className="w-12 sm:w-16 h-12 sm:h-16 rounded-full mr-3 sm:mr-4 object-cover"
                />
                <div>
                  <div className="font-bold text-gray-900 text-base sm:text-lg">
                    {testimonials[currentTestimonial].name}
                  </div>
                  <div className="text-brand-purple font-medium text-sm sm:text-base">
                    {testimonials[currentTestimonial].role}
                  </div>
                  <div className="text-gray-600 text-xs sm:text-sm">
                    {testimonials[currentTestimonial].company}
                  </div>
                </div>
              </div>
            </div>

            {/* Testimonial Indicators */}
            <div className="flex justify-center mt-6 sm:mt-8 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-2 sm:w-3 h-2 sm:h-3 rounded-full transition-all duration-300 ${
                    index === currentTestimonial ? 'bg-brand-purple w-6 sm:w-8' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-purple-600/20 to-teal-600/20"></div>
          <div className="absolute top-10 sm:top-20 left-10 sm:left-20 w-48 sm:w-64 h-48 sm:h-64 bg-gradient-to-r from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-10 sm:bottom-20 right-10 sm:right-20 w-56 sm:w-80 h-56 sm:h-80 bg-gradient-to-r from-orange-400/20 to-pink-600/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="relative max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 animate-fade-in">
          <div className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-white/10 backdrop-blur-sm rounded-full text-white text-xs sm:text-sm font-medium mb-6 sm:mb-8">
            <Sparkles className="w-3 sm:w-4 h-3 sm:h-4 mr-1 sm:mr-2" />
            Join 10,000+ Happy Users
          </div>
          
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">
            Ready to transform your
            <span className="block bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              project finances?
            </span>
          </h2>
          
          <p className="text-lg sm:text-xl text-white/90 mb-8 sm:mb-10 max-w-2xl mx-auto leading-relaxed px-4 sm:px-0">
            Join thousands of professionals who trust InOutBook to track their project 
            profitability and make data-driven business decisions.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center max-w-md mx-auto mb-6 sm:mb-8 px-4 sm:px-0">
            <Link
              to="/signup"
              className="group bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl flex items-center justify-center"
            >
              <Rocket className="w-4 sm:w-5 h-4 sm:h-5 mr-2" />
              Start Your Free Trial
              <ArrowRight className="ml-2 w-4 sm:w-5 h-4 sm:h-5 group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
            
            <Link
              to="/contact"
              className="border-2 border-white/30 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold hover:bg-white/10 transition-all duration-200 flex items-center justify-center backdrop-blur-sm"
            >
              Contact Sales
            </Link>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-8 text-xs sm:text-sm text-white/70">
            <div className="flex items-center">
              <CheckCircle className="w-3 sm:w-4 h-3 sm:h-4 text-green-400 mr-1 sm:mr-2" />
              14-day free trial
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-3 sm:w-4 h-3 sm:h-4 text-green-400 mr-1 sm:mr-2" />
              No credit card required
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-3 sm:w-4 h-3 sm:h-4 text-green-400 mr-1 sm:mr-2" />
              Cancel anytime
            </div>
          </div>
        </div>
      </section>

      {/* Modal for demo video */}
      {isDemoOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 overflow-y-auto"
          style={{ overscrollBehavior: 'contain' }}
          aria-modal="true"
          role="dialog"
          tabIndex={-1}
          onClick={() => setIsDemoOpen(false)}
        >
          <div
            className="relative bg-white rounded-xl sm:rounded-2xl shadow-2xl w-[98vw] sm:w-[90vw] md:w-[80vw] lg:w-[70vw] xl:w-[60vw] max-w-2xl sm:max-w-3xl lg:max-w-4xl mx-auto p-0 sm:p-4 animate-modal-fade"
            onClick={e => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-2 text-gray-700 hover:text-red-500 text-3xl font-bold z-10 rounded-full bg-white/80 p-1 transition-colors"
              onClick={() => setIsDemoOpen(false)}
              aria-label="Close"
              tabIndex={0}
            >
              &times;
            </button>
            <div className="w-full aspect-video bg-black rounded-b-xl sm:rounded-b-2xl overflow-hidden">
              <video
                src="/Black and Purple Modern App New Features Animated Video.mp4"
                controls
                autoPlay
                className="w-full h-full object-contain rounded-b-xl sm:rounded-b-2xl"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;