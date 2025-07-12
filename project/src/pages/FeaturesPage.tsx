import React from 'react';
import { 
  FolderPlus, 
  Calculator, 
  PieChart, 
  Shield, 
  Search, 
  FileText,
  Paperclip,
  CreditCard,
  Filter,
  Download,
  DollarSign,
  Users,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

const FeaturesPage = () => {
  const features = [
    {
      icon: FolderPlus,
      title: 'Project Management',
      description: 'Create and manage multiple projects with comprehensive details including project name, description, start/end dates, and finalized costs for accurate profitability tracking.',
      benefits: [
        'Add unlimited projects',
        'Store project details & dates',
        'Set finalized project costs',
        'Track project status'
      ],
      image: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=2'
    },
    {
      icon: Calculator,
      title: 'IN/OUT Payment Tracking',
      description: 'Log all income (IN) and expense (OUT) transactions with detailed information including person details, payment methods, reasons, dates, and amounts.',
      benefits: [
        'Record income & expenses',
        'Store person name & contact',
        'Track payment methods (Cash/UPI/Bank)',
        'Add payment reasons & dates'
      ],
      image: 'https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=2'
    },
    {
      icon: PieChart,
      title: 'Dashboard Summary',
      description: 'Get comprehensive project-wise summaries showing total IN, total OUT, and balance calculations with visual profit/loss indicators for quick insights.',
      benefits: [
        'Project-wise financial summaries',
        'Visual profit/loss indicators',
        'Color-coded balance displays',
        'Intuitive dashboard interface'
      ],
      image: 'https://images.pexels.com/photos/669610/pexels-photo-669610.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=2'
    },
    {
      icon: Search,
      title: 'Filter & Search',
      description: 'Quickly find transactions using powerful filtering options by person name, payment type (IN/OUT), payment method, or use the smart search functionality.',
      benefits: [
        'Filter by person name',
        'Filter by payment type',
        'Filter by payment method',
        'Quick search functionality'
      ],
      image: 'https://images.pexels.com/photos/4386366/pexels-photo-4386366.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=2'
    },
    {
      icon: Download,
      title: 'Export Features',
      description: 'Export your project data in multiple formats including PDF project reports for presentations and Excel spreadsheets for detailed accounting.',
      benefits: [
        'PDF project reports',
        'Excel spreadsheet export',
        'Detailed accounting data',
        'Professional presentations'
      ],
      image: 'https://images.pexels.com/photos/4386321/pexels-photo-4386321.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=2'
    },
    {
      icon: Paperclip,
      title: 'Receipt Attachments',
      description: 'Upload and link receipt images or documents to transactions. View attachments directly from the transaction table for complete record keeping.',
      benefits: [
        'Upload receipt images',
        'Link documents to transactions',
        'View attachments in-app',
        'Complete record keeping'
      ],
      image: 'https://images.pexels.com/photos/4386431/pexels-photo-4386431.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=2'
    }
  ];

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="bg-gradient-brand py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 animate-fade-in">
            Powerful Features for 
            <span className="bg-gradient-hero bg-clip-text text-transparent"> Project Financial Tracking</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto animate-slide-up px-4 sm:px-0">
            Everything you need to track, analyze, and manage your project finances. 
            From simple transaction recording to comprehensive profitability analysis.
          </p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-16 sm:space-y-20">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className={`grid lg:grid-cols-2 gap-8 sm:gap-12 items-center ${
                  index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''
                }`}
              >
                <div className={`animate-slide-up ${index % 2 === 1 ? 'lg:col-start-2' : ''}`}>
                  <div className="flex items-center mb-4 sm:mb-6">
                    <div className="w-10 sm:w-12 h-10 sm:h-12 bg-gradient-hero rounded-xl flex items-center justify-center mr-3 sm:mr-4">
                      <feature.icon className="w-5 sm:w-6 h-5 sm:h-6 text-white" />
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">{feature.title}</h2>
                  </div>
                  <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8 leading-relaxed">
                    {feature.description}
                  </p>
                  
                  <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                    {feature.benefits.map((benefit, benefitIndex) => (
                      <div key={benefitIndex} className="flex items-center">
                        <div className="w-5 sm:w-6 h-5 sm:h-6 bg-brand-teal/20 rounded-full flex items-center justify-center mr-2 sm:mr-3">
                          <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-brand-teal rounded-full"></div>
                        </div>
                        <span className="text-gray-700 text-sm sm:text-base">{benefit}</span>
                      </div>
                    ))}
                  </div>

                  <Link
                    to="/signup"
                    className="inline-flex items-center bg-brand-orange text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold hover:bg-brand-orange/90 transition-all duration-200 group text-sm sm:text-base"
                  >
                    Try This Feature
                    <ArrowRight className="ml-2 w-4 sm:w-5 h-4 sm:h-5 group-hover:translate-x-1 transition-transform duration-200" />
                  </Link>
                </div>

                <div className={`animate-slide-in-right ${index % 2 === 1 ? 'lg:col-start-1' : ''}`}>
                  <div className="relative">
                    <img
                      src={feature.image}
                      alt={feature.title}
                      className="rounded-xl sm:rounded-2xl shadow-2xl w-full h-64 sm:h-96 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-brand-purple/20 to-brand-teal/20 rounded-xl sm:rounded-2xl"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Features Grid */}
      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16 animate-fade-in">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
              Built for Project-Based Businesses
            </h2>
            <p className="text-lg sm:text-xl text-gray-600">
              Additional features that make InOutBook perfect for your workflow
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                icon: Shield,
                title: 'Secure Data Storage',
                description: 'Your financial data is protected with enterprise-grade security and regular backups.'
              },
              {
                icon: CreditCard,
                title: 'Multiple Payment Methods',
                description: 'Track payments across Cash, UPI, Bank transfers, and other payment methods.'
              },
              {
                icon: Filter,
                title: 'Advanced Filtering',
                description: 'Filter transactions by multiple criteria to find exactly what you need quickly.'
              },
              {
                icon: DollarSign,
                title: 'Profit/Loss Analysis',
                description: 'Instant calculations showing project profitability against finalized costs.'
              },
              {
                icon: Users,
                title: 'Contact Management',
                description: 'Store person names and contact details for all your project transactions.'
              },
              {
                icon: FileText,
                title: 'Detailed Records',
                description: 'Comprehensive transaction records with dates, amounts, and payment reasons.'
              }
            ].map((feature, index) => (
              <div
                key={feature.title}
                className="bg-white p-6 sm:p-8 rounded-xl sm:rounded-2xl border border-gray-100 hover:border-brand-purple/20 hover:shadow-xl transition-all duration-300 animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-10 sm:w-12 h-10 sm:h-12 bg-gradient-hero rounded-xl flex items-center justify-center mb-4 sm:mb-6">
                  <feature.icon className="w-5 sm:w-6 h-5 sm:h-6 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">
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

      {/* Use Cases Section */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16 animate-fade-in">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
              Perfect for Various Use Cases
            </h2>
            <p className="text-lg sm:text-xl text-gray-600">
              InOutBook adapts to different project-based business models
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                title: 'Freelancers',
                description: 'Track multiple client projects, monitor profitability, and maintain detailed records for tax purposes.',
                icon: '👨‍💻'
              },
              {
                title: 'Small Agencies',
                description: 'Manage team expenses, client payments, and project budgets across multiple concurrent projects.',
                icon: '🏢'
              },
              {
                title: 'Consultants',
                description: 'Monitor consulting engagement costs, track reimbursable expenses, and analyze project margins.',
                icon: '📊'
              }
            ].map((useCase, index) => (
              <div
                key={useCase.title}
                className="bg-gradient-card p-6 sm:p-8 rounded-xl sm:rounded-2xl text-center animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">{useCase.icon}</div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">
                  {useCase.title}
                </h3>
                <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                  {useCase.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 bg-gradient-hero">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 animate-fade-in">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 sm:mb-6">
            Ready to experience these features?
          </h2>
          <p className="text-lg sm:text-xl text-white/90 mb-6 sm:mb-8">
            Start your free trial today and see how InOutBook can transform your project financial management.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center max-w-md mx-auto">
            <Link
              to="/signup"
              className="bg-brand-orange text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold hover:bg-brand-orange/90 hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center group"
            >
              Start Free Trial
              <ArrowRight className="ml-2 w-4 sm:w-5 h-4 sm:h-5 group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
            <Link
              to="/pricing"
              className="border-2 border-white text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold hover:bg-white hover:text-brand-purple transition-all duration-200 flex items-center justify-center"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FeaturesPage;