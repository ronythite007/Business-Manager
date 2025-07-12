import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, X, ArrowRight, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

const PricingPage = () => {
  const [isAnnual, setIsAnnual] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const plans = [
    {
      name: 'Free',
      price: { monthly: 0, annual: 0 },
      description: 'Perfect for freelancers getting started',
      features: [
        'Up to 3 projects',
        'Basic income/expense tracking',
        'Simple profit calculations',
        'Email support',
        'Mobile app access',
        'Data export (CSV)'
      ],
      limitations: [
        'Limited to 3 projects',
        'Basic reporting only',
        'No advanced analytics',
        'No team collaboration'
      ],
      cta: 'Get Started Free',
      popular: false
    },
    {
      name: 'Pro',
      price: { monthly: 19, annual: 15 },
      description: 'For growing businesses and agencies',
      features: [
        'Unlimited projects',
        'Advanced analytics & reporting',
        'Team collaboration (up to 5 members)',
        'Priority email support',
        'Custom categories & tags',
        'Recurring payment tracking',
        'Multi-currency support',
        'API access',
        'Data export (CSV, PDF, Excel)',
        'Advanced profit/loss analysis'
      ],
      limitations: [],
      cta: 'Start Pro Trial',
      popular: true
    },
    {
      name: 'Enterprise',
      price: { monthly: 49, annual: 39 },
      description: 'For large teams and organizations',
      features: [
        'Everything in Pro',
        'Unlimited team members',
        'Advanced user permissions',
        'Dedicated account manager',
        'Phone & chat support',
        'Custom integrations',
        'White-label options',
        'Advanced security features',
        'Custom reporting',
        'SLA guarantee'
      ],
      limitations: [],
      cta: 'Contact Sales',
      popular: false
    }
  ];

  const faqs = [
    {
      question: 'What happens when my free trial ends?',
      answer: 'Your free trial includes all Pro features for 14 days. After the trial, you can continue with the Free plan or upgrade to Pro. Your data is always safe and accessible.'
    },
    {
      question: 'Can I change plans anytime?',
      answer: 'Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately, and we\'ll prorate any billing differences.'
    },
    {
      question: 'Is my financial data secure?',
      answer: 'Absolutely. We use bank-level 256-bit SSL encryption and are SOC 2 compliant. Your data is backed up daily and stored in secure, geographically distributed data centers.'
    },
    {
      question: 'Do you offer refunds?',
      answer: 'Yes, we offer a 30-day money-back guarantee. If you\'re not satisfied with InOutBook, contact us within 30 days for a full refund.'
    },
    {
      question: 'Can I export my data?',
      answer: 'Yes, you can export your data at any time in CSV, PDF, or Excel formats. We believe your data belongs to you and should always be accessible.'
    },
    {
      question: 'Is there a setup fee?',
      answer: 'No setup fees, ever. The price you see is the price you pay. We believe in transparent, straightforward pricing.'
    }
  ];

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="bg-gradient-brand py-16 sm:py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 animate-fade-in">
            Simple, Transparent 
            <span className="bg-gradient-hero bg-clip-text text-transparent"> Pricing</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 mb-6 sm:mb-8 animate-slide-up">
            Choose the plan that's right for you. Start free, upgrade when you need more.
          </p>
          
          {/* Annual/Monthly Toggle */}
          <div className="flex items-center justify-center mb-6 sm:mb-8 animate-slide-up">
            <span className={`mr-2 sm:mr-3 text-sm sm:text-base ${!isAnnual ? 'text-gray-900 font-semibold' : 'text-gray-600'}`}>
              Monthly
            </span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className={`relative inline-flex h-5 sm:h-6 w-9 sm:w-11 items-center rounded-full transition-colors duration-200 ${
                isAnnual ? 'bg-brand-purple' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-3 sm:h-4 w-3 sm:w-4 transform rounded-full bg-white transition-transform duration-200 ${
                  isAnnual ? 'translate-x-5 sm:translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`ml-2 sm:ml-3 text-sm sm:text-base ${isAnnual ? 'text-gray-900 font-semibold' : 'text-gray-600'}`}>
              Annual
            </span>
            {isAnnual && (
              <span className="ml-2 bg-brand-orange text-white px-2 py-1 rounded-full text-xs font-medium">
                Save 20%
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
            {plans.map((plan, index) => (
              <div
                key={plan.name}
                className={`relative bg-white rounded-xl sm:rounded-2xl border-2 transition-all duration-300 hover:shadow-xl animate-slide-up ${
                  plan.popular
                    ? 'border-brand-purple shadow-lg scale-105'
                    : 'border-gray-200 hover:border-brand-purple/20'
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {plan.popular && (
                  <div className="absolute -top-3 sm:-top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-brand-orange text-white px-3 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="p-6 sm:p-8">
                  <div className="text-center mb-6 sm:mb-8">
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                    <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">{plan.description}</p>
                    <div className="mb-3 sm:mb-4">
                      <span className="text-3xl sm:text-4xl font-bold text-gray-900">
                        ${isAnnual ? plan.price.annual : plan.price.monthly}
                      </span>
                      {plan.price.monthly > 0 && (
                        <span className="text-gray-600 ml-1 text-sm sm:text-base">
                          /{isAnnual ? 'month' : 'month'}
                        </span>
                      )}
                      {isAnnual && plan.price.monthly > 0 && (
                        <div className="text-xs sm:text-sm text-gray-500 mt-1">
                          Billed annually (${plan.price.annual * 12}/year)
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-start">
                        <CheckCircle className="w-4 sm:w-5 h-4 sm:h-5 text-brand-teal mr-2 sm:mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 text-sm sm:text-base">{feature}</span>
                      </div>
                    ))}
                    {plan.limitations.map((limitation, limitationIndex) => (
                      <div key={limitationIndex} className="flex items-start opacity-60">
                        <X className="w-4 sm:w-5 h-4 sm:h-5 text-gray-400 mr-2 sm:mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-500 text-sm sm:text-base">{limitation}</span>
                      </div>
                    ))}
                  </div>

                  <Link
                    to={plan.name === 'Enterprise' ? '/contact' : '/signup'}
                    className={`w-full py-2 sm:py-3 px-4 sm:px-6 rounded-lg sm:rounded-xl font-semibold text-center transition-all duration-200 block text-sm sm:text-base ${
                      plan.popular
                        ? 'bg-brand-orange text-white hover:bg-brand-orange/90 hover:scale-105 shadow-md hover:shadow-lg'
                        : 'bg-gray-900 text-white hover:bg-gray-800'
                    }`}
                  >
                    {plan.cta}
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8 sm:mt-12 animate-fade-in">
            <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">
              All plans include our 14-day free trial and 30-day money-back guarantee
            </p>
            <Link
              to="/contact"
              className="text-brand-purple font-medium hover:underline inline-flex items-center text-sm sm:text-base"
            >
              Need a custom solution? Contact us
              <ArrowRight className="ml-1 w-3 sm:w-4 h-3 sm:h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-16 sm:py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16 animate-fade-in">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg sm:text-xl text-gray-600">
              Everything you need to know about InOutBook pricing
            </p>
          </div>

          <div className="space-y-3 sm:space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-lg sm:rounded-xl border border-gray-200 overflow-hidden animate-slide-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full px-4 sm:px-6 py-3 sm:py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
                >
                  <span className="font-semibold text-gray-900 text-sm sm:text-base">{faq.question}</span>
                  {openFaq === index ? (
                    <ChevronUp className="w-4 sm:w-5 h-4 sm:h-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-4 sm:w-5 h-4 sm:h-5 text-gray-500" />
                  )}
                </button>
                {openFaq === index && (
                  <div className="px-4 sm:px-6 pb-3 sm:pb-4">
                    <p className="text-gray-600 leading-relaxed text-sm sm:text-base">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="text-center mt-8 sm:mt-12 animate-fade-in">
            <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">
              Still have questions?
            </p>
            <Link
              to="/contact"
              className="bg-brand-purple text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold hover:bg-brand-purple/90 transition-colors duration-200 inline-flex items-center text-sm sm:text-base"
            >
              <HelpCircle className="mr-2 w-4 sm:w-5 h-4 sm:h-5" />
              Contact Support
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 bg-gradient-hero">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 animate-fade-in">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 sm:mb-6">
            Ready to get started?
          </h2>
          <p className="text-lg sm:text-xl text-white/90 mb-6 sm:mb-8">
            Join thousands of professionals who trust InOutBook with their project finances.
          </p>
          <Link
            to="/signup"
            className="bg-brand-orange text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold hover:bg-brand-orange/90 hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl inline-flex items-center group"
          >
            Start Your Free Trial
            <ArrowRight className="ml-2 w-4 sm:w-5 h-4 sm:h-5 group-hover:translate-x-1 transition-transform duration-200" />
          </Link>
          <p className="text-xs sm:text-sm text-white/80 mt-3 sm:mt-4">
            14-day free trial • No credit card required • Cancel anytime
          </p>
        </div>
      </section>
    </div>
  );
};

export default PricingPage;