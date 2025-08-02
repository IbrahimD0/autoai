"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useMotionTemplate, animate } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { 
  Star, 
  Check, 
  ArrowRight, 
  Sparkles, 
  Clock, 
  Users, 
  Shield, 
  Zap,
  Camera,
  Globe,
  MessageCircle,
  BarChart3,
  ChevronRight,
  Quote
} from 'lucide-react';

// Utility function
function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

// Floating chocolate particles component
const ChocolateParticles = () => {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 2,
    delay: Math.random() * 5,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute w-2 h-2 bg-orange-300/20 rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
          }}
          animate={{
            y: [0, -50, 0],
            opacity: [0.2, 1, 0.2],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 4 + particle.delay,
            repeat: Infinity,
            ease: "easeInOut",
            delay: particle.delay,
          }}
        />
      ))}
    </div>
  );
};

// Hero Section Component
const HeroSection = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 overflow-hidden">
      <ChocolateParticles />
      
      {/* Sign In Button */}
      <div className="absolute top-6 right-6 z-20">
        <a href="/signin">
          <Button 
            variant="outline"
            className="border-2 border-orange-400 text-orange-700 bg-white hover:bg-orange-50 px-6 py-2"
          >
            Sign In
          </Button>
        </a>
      </div>
      
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-orange-200/30 rounded-full blur-xl" />
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-amber-200/30 rounded-full blur-xl" />
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-orange-300/20 rounded-full blur-lg" />
      </div>

      <div className="relative z-10 container mx-auto px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
            transition={{ duration: 0.8 }}
          >
            <Badge className="mb-6 bg-orange-100 text-orange-800 border-orange-200 hover:bg-orange-200">
              <Sparkles className="w-4 h-4 mr-2" />
              Used by 25+ chocolate shops already
            </Badge>
          </motion.div>

          <motion.h1
            className="text-5xl md:text-7xl font-bold mb-6 text-gray-900 leading-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="bg-gradient-to-r from-amber-800 via-orange-600 to-amber-700 bg-clip-text text-transparent">
              AutoAI:
            </span>
            <br />
            Your Chocolate Shop AI,{' '}
            <span className="relative">
              Automated
              <motion.div
                className="absolute -bottom-2 left-0 right-0 h-3 bg-orange-200/60 rounded-full"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: isVisible ? 1 : 0 }}
                transition={{ duration: 1, delay: 1 }}
              />
            </span>{' '}
            in 24 Hours
          </motion.h1>

          <motion.p
            className="text-xl md:text-2xl text-gray-700 mb-8 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            AI Chat + Professional Website + Smart Ordering - All for{' '}
            <span className="font-bold text-orange-600">$20/month</span>
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <a href="/signin/signup">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                Start Free Trial
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </a>
            <Button 
              variant="outline" 
              size="lg"
              className="!bg-white !text-black"
            >
              Watch Demo
            </Button>
          </motion.div>

          <motion.div
            className="flex flex-wrap justify-center items-center gap-6 text-sm text-gray-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: isVisible ? 1 : 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-green-500" />
              Stripe Secured
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-blue-500" />
              AI Powered
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-purple-500" />
              24/7 Support
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// Features Section Component
const FeaturesSection = () => {
  const features = [
    {
      icon: MessageCircle,
      title: "Smart Chocolate Assistant",
      description: "AI that knows your chocolates and takes custom orders",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Globe,
      title: "Professional Website Generator",
      description: "Beautiful chocolate shop website in 5 minutes",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: Camera,
      title: "Menu Upload Magic",
      description: "Just photograph your menu, AI does the rest",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: BarChart3,
      title: "Customer Management",
      description: "Built-in ordering and customer tracking",
      color: "from-orange-500 to-red-500"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Everything Your Chocolate Shop Needs
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From AI-powered customer service to professional websites, we've got every aspect of your chocolate business covered.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <Card className="p-6 h-full border-2 border-gray-100 hover:border-orange-200 transition-all duration-300 hover:shadow-lg">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Testimonials Section Component
const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Maria Rodriguez",
      role: "Owner, Sweet Dreams Chocolate",
      content: "Sweet Dreams Chocolate increased orders by 200% in first month. The AI assistant handles custom orders perfectly!",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
      rating: 5
    },
    {
      name: "James Chen",
      role: "Chocolatier, Artisan Delights",
      content: "Setup took 5 minutes, saved me 20 hours per week. Now I can focus on creating amazing chocolates instead of managing orders.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      rating: 5
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-orange-50 to-amber-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Loved by Chocolatiers Everywhere
          </h2>
          <p className="text-xl text-gray-600">
            See how AutoAI is transforming chocolate shops across the country
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <Card className="p-8 bg-white/95 backdrop-blur border-2 border-orange-100 hover:border-orange-200 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <Quote className="w-8 h-8 text-orange-300 mb-4" />
                <p className="text-gray-700 text-lg mb-6 leading-relaxed">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Pricing Section Component
const PricingSection = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-gray-600">
            Everything you need to automate your chocolate shop
          </p>
        </div>

        <div className="max-w-lg mx-auto">
          <Card className="p-8 border-4 border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50 relative overflow-hidden">
            <div className="absolute top-4 right-4">
              <Badge className="bg-orange-500 text-white">
                Most Popular
              </Badge>
            </div>
            
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Complete AutoAI Package</h3>
              <div className="flex items-baseline justify-center mb-4">
                <span className="text-5xl font-bold text-orange-600">$20</span>
                <span className="text-xl text-gray-600 ml-2">/month</span>
              </div>
              <p className="text-gray-600">14-day free trial • Cancel anytime</p>
            </div>

            <div className="space-y-4 mb-8">
              {[
                "AI Chat Assistant",
                "Professional Website",
                "Smart Ordering System",
                "Customer Management",
                "Menu Upload Magic",
                "24/7 Support",
                "Setup in 5 minutes",
                "Money-back guarantee"
              ].map((feature, index) => (
                <div key={index} className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>

            <Button className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
              Start Your Free Trial
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>

            <p className="text-center text-sm text-gray-500 mt-4">
              Setup in under 5 minutes, results in 24 hours
            </p>
          </Card>
        </div>
      </div>
    </section>
  );
};

// CTA Section Component
const CTASection = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl" />
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-white/10 rounded-full blur-xl" />
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Ready to Transform Your Chocolate Shop?
          </h2>
          <p className="text-xl text-orange-100 mb-8 leading-relaxed">
            Join 25+ chocolate shops already using AutoAI to increase orders, save time, and delight customers.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              className="bg-white text-orange-600 hover:bg-orange-50 px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Start Free Trial - No Credit Card
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-2 border-white/90 text-white bg-white/10 backdrop-blur hover:bg-white hover:text-orange-600 px-8 py-4 text-lg rounded-xl transition-all duration-300"
            >
              Schedule Demo
            </Button>
          </div>

          <div className="mt-8 flex flex-wrap justify-center items-center gap-6 text-orange-100">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              25+ shops trust us
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              5-minute setup
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Money-back guarantee
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Main Landing Page Component
const AutoAILandingPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <HeroSection />
      <FeaturesSection />
      <TestimonialsSection />
      <PricingSection />
      <CTASection />
    </div>
  );
};

export default AutoAILandingPage;