import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Target, 
  Users, 
  Award, 
  ArrowRight,
  Lightbulb,
  Heart,
  Zap
} from 'lucide-react';

const AboutPage = () => {
  const values = [
    {
      icon: Lightbulb,
      title: 'Simplicity',
      description: 'We believe powerful financial tracking should be simple and intuitive, not complex and overwhelming.'
    },
    {
      icon: Heart,
      title: 'User-Focused',
      description: 'Every feature is designed with project-based professionals in mind, solving real-world problems.'
    },
    {
      icon: Zap,
      title: 'Efficiency',
      description: 'Streamline your workflow with tools that save time and provide instant insights into project profitability.'
    }
  ];

  const team = [
    {
      name: 'Sarah Johnson',
      role: 'CEO & Co-Founder',
      bio: 'Former project manager with 10+ years in financial tracking. Passionate about helping businesses understand their project profitability.',
      avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=2',
      linkedin: '#'
    },
    {
      name: 'Mike Chen',
      role: 'CTO & Co-Founder',
      bio: 'Full-stack developer with expertise in financial applications. Believes technology should simplify, not complicate.',
      avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=2',
      linkedin: '#'
    },
    {
      name: 'Emma Rodriguez',
      role: 'Head of Product',
      bio: 'UX designer who transforms complex financial workflows into intuitive user experiences.',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=2',
      linkedin: '#'
    },
    {
      name: 'David Kim',
      role: 'Head of Engineering',
      bio: 'Software architect passionate about building reliable, secure applications for financial data.',
      avatar: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=2',
      linkedin: '#'
    }
  ];

  const stats = [
    { number: '5K+', label: 'Active Users' },
    { number: '$10M+', label: 'Tracked Transactions' },
    { number: '98%', label: 'User Satisfaction' },
    { number: '24/7', label: 'Support Available' }
  ];

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="bg-gradient-brand py-16 sm:py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 animate-fade-in">
            About 
            <span className="bg-gradient-hero bg-clip-text text-transparent"> InOutBook</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 leading-relaxed animate-slide-up">
            We're on a mission to help project-based businesses and freelancers gain clear visibility 
            into their financial performance through simple, powerful tracking tools.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
            <div className="animate-slide-up">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 sm:mb-6">
                Our Mission
              </h2>
              <p className="text-base sm:text-lg text-gray-600 mb-4 sm:mb-6 leading-relaxed">
                Too many talented professionals struggle with project profitability because they lack 
                clear visibility into their project-level finances. Traditional accounting software is 
                either too complex or doesn't provide the project-specific insights they need.
              </p>
              <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8 leading-relaxed">
                InOutBook was created to bridge this gap. We believe that understanding your project 
                finances shouldn't require complex accounting knowledge or hours of manual calculations. 
                It should be as simple as recording an IN or OUT transaction.
              </p>
              <div className="flex items-center">
                <Target className="w-6 sm:w-8 h-6 sm:h-8 text-brand-orange mr-3 sm:mr-4" />
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Our Goal</h3>
                  <p className="text-gray-600 text-sm sm:text-base">Empower every project-based business to maximize profitability through clear financial insights</p>
                </div>
              </div>
            </div>
            <div className="animate-slide-in-right">
              <img
                src="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=2"
                alt="Team collaboration"
                className="rounded-xl sm:rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16 animate-fade-in">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
              Our Values
            </h2>
            <p className="text-lg sm:text-xl text-gray-600">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {values.map((value, index) => (
              <div
                key={value.title}
                className="bg-white p-6 sm:p-8 rounded-xl sm:rounded-2xl text-center hover:shadow-xl transition-all duration-300 animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-12 sm:w-16 h-12 sm:h-16 bg-gradient-hero rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <value.icon className="w-6 sm:w-8 h-6 sm:h-8 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">
                  {value.title}
                </h3>
                <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16 animate-fade-in">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
              Trusted by Project-Based Professionals
            </h2>
            <p className="text-lg sm:text-xl text-gray-600">
              Here's what we've achieved together
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className="text-center animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-brand-purple mb-2">
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

      {/* Team Section */}
      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16 animate-fade-in">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
              Meet Our Team
            </h2>
            <p className="text-lg sm:text-xl text-gray-600">
              The passionate people behind InOutBook
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {team.map((member, index) => (
              <div
                key={member.name}
                className="bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl text-center hover:shadow-xl transition-all duration-300 animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <img
                  src={member.avatar}
                  alt={member.name}
                  className="w-20 sm:w-24 h-20 sm:h-24 rounded-full mx-auto mb-3 sm:mb-4 object-cover"
                />
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1">
                  {member.name}
                </h3>
                <p className="text-brand-purple font-medium mb-2 sm:mb-3 text-sm sm:text-base">
                  {member.role}
                </p>
                <p className="text-gray-600 text-xs sm:text-sm leading-relaxed mb-3 sm:mb-4">
                  {member.bio}
                </p>
                <a
                  href={member.linkedin}
                  className="text-brand-purple hover:text-brand-purple/80 transition-colors duration-200 text-xs sm:text-sm"
                >
                  Connect on LinkedIn →
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12 animate-fade-in">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 sm:mb-6">
              Our Story
            </h2>
          </div>
          
          <div className="prose prose-lg mx-auto text-gray-600 animate-slide-up">
            <p className="mb-4 sm:mb-6 text-sm sm:text-base leading-relaxed">
              InOutBook started in 2023 when our founders, Sarah and Mike, were running their own 
              consulting business. Despite being successful, they constantly struggled to understand 
              which projects were actually profitable and which ones were draining resources.
            </p>
            
            <p className="mb-4 sm:mb-6 text-sm sm:text-base leading-relaxed">
              After trying dozens of accounting and project management tools, they realized none 
              were designed specifically for project-level financial tracking. Everything was either 
              too complex for small teams or too generic to provide meaningful project insights.
            </p>
            
            <p className="mb-4 sm:mb-6 text-sm sm:text-base leading-relaxed">
              So they built InOutBook – a lightweight tool that focuses specifically on IN/OUT 
              transaction tracking at the project level. Word spread quickly, and soon other 
              freelancers and agencies were asking to use it too.
            </p>
            
            <p className="text-sm sm:text-base leading-relaxed">
              Today, InOutBook helps thousands of project-based businesses gain clear visibility 
              into their financial performance. We're just getting started on our mission to 
              empower every project-based business to maximize their profitability.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 bg-gradient-hero">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 animate-fade-in">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 sm:mb-6">
            Ready to join our mission?
          </h2>
          <p className="text-lg sm:text-xl text-white/90 mb-6 sm:mb-8">
            Experience the difference InOutBook can make for your project finances.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center max-w-md mx-auto">
            <Link
              to="/signup"
              className="bg-brand-orange text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold hover:bg-brand-orange/90 hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center group"
            >
              Start Your Free Trial
              <ArrowRight className="ml-2 w-4 sm:w-5 h-4 sm:h-5 group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
            <Link
              to="/contact"
              className="border-2 border-white text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold hover:bg-white hover:text-brand-purple transition-all duration-200 flex items-center justify-center"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;