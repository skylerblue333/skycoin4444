import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Shield,
  Code2,
  Zap,
  Brain,
  Blocks,
  Users,
  TrendingUp,
  Award,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';

export default function ITServicesLanding() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Navigation */}
      <nav className="border-b border-slate-800 bg-slate-950/80 backdrop-blur">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-blue-400">IITR</div>
          <div className="hidden md:flex gap-8">
            <a href="#services" className="text-slate-300 hover:text-white">Services</a>
            <a href="#pricing" className="text-slate-300 hover:text-white">Pricing</a>
            <a href="#about" className="text-slate-300 hover:text-white">About</a>
            <a href="#contact" className="text-slate-300 hover:text-white">Contact</a>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700">Get Started</Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Innovative Information Technology Resolutions
          </h1>
          <p className="text-xl text-slate-300 mb-8">
            Robust software development, cybersecurity, and AI solutions for businesses ready to transform.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              Schedule Consultation
            </Button>
            <Button size="lg" variant="outline" className="border-slate-600 text-white hover:bg-slate-800">
              View Services
            </Button>
          </div>
        </div>
      </section>

      {/* Founder Credentials */}
      <section className="bg-slate-900/50 py-16 border-y border-slate-800">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Meet Your Technology Partner</h2>
            <p className="text-slate-300">Led by Skyler Blue, a seasoned technology expert with advanced credentials</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="bg-slate-800 border-slate-700 p-6">
              <Award className="h-12 w-12 text-blue-400 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Education</h3>
              <ul className="text-slate-300 space-y-2">
                <li>✓ B.S. Information Technology</li>
                <li>✓ Software Engineer Bootcamp</li>
                <li>✓ M.S. Cybersecurity (Graduate)</li>
              </ul>
            </Card>

            <Card className="bg-slate-800 border-slate-700 p-6">
              <Shield className="h-12 w-12 text-blue-400 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Certifications</h3>
              <ul className="text-slate-300 space-y-2">
                <li>✓ Certified Advanced Ethical Hacker (CEH)</li>
                <li>✓ Experienced Developer</li>
                <li>✓ 50+ Security Audits</li>
              </ul>
            </Card>
          </div>

          <div className="mt-8 text-center text-slate-400">
            <p>Father of 3 daughters | Committed to secure, innovative technology solutions</p>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-white text-center mb-16">Our Services</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Software Development */}
            <Card className="bg-slate-800 border-slate-700 p-8 hover:border-blue-500 transition">
              <Code2 className="h-12 w-12 text-blue-400 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Software Development</h3>
              <p className="text-slate-300 mb-4">Custom applications, cloud-native architecture, microservices, and legacy modernization.</p>
              <p className="text-blue-400 font-semibold">$150-$300/hr</p>
            </Card>

            {/* Managed IT */}
            <Card className="bg-slate-800 border-slate-700 p-8 hover:border-blue-500 transition">
              <Zap className="h-12 w-12 text-blue-400 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Managed IT Services</h3>
              <p className="text-slate-300 mb-4">24/7 monitoring, infrastructure management, patch management, and disaster recovery.</p>
              <p className="text-blue-400 font-semibold">$2K-$10K/month</p>
            </Card>

            {/* Cybersecurity */}
            <Card className="bg-slate-800 border-slate-700 p-8 hover:border-blue-500 transition">
              <Shield className="h-12 w-12 text-blue-400 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Cybersecurity</h3>
              <p className="text-slate-300 mb-4">Security audits, penetration testing, SOC services, and compliance management.</p>
              <p className="text-blue-400 font-semibold">$5K-$50K/audit</p>
            </Card>

            {/* AI/ML */}
            <Card className="bg-slate-800 border-slate-700 p-8 hover:border-blue-500 transition">
              <Brain className="h-12 w-12 text-blue-400 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">AI & Machine Learning</h3>
              <p className="text-slate-300 mb-4">Predictive analytics, threat detection, data science, and intelligent automation.</p>
              <p className="text-blue-400 font-semibold">$10K-$100K+/project</p>
            </Card>

            {/* Blockchain */}
            <Card className="bg-slate-800 border-slate-700 p-8 hover:border-blue-500 transition">
              <Blocks className="h-12 w-12 text-blue-400 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Blockchain & Web3</h3>
              <p className="text-slate-300 mb-4">Smart contracts, DeFi development, security audits, and Web3 strategy.</p>
              <p className="text-blue-400 font-semibold">$50K-$500K+/project</p>
            </Card>

            {/* Consulting */}
            <Card className="bg-slate-800 border-slate-700 p-8 hover:border-blue-500 transition">
              <TrendingUp className="h-12 w-12 text-blue-400 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">IT Strategy</h3>
              <p className="text-slate-300 mb-4">Technology roadmap, architecture design, vendor management, and cost optimization.</p>
              <p className="text-blue-400 font-semibold">$5K-$25K/engagement</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="bg-slate-900/50 py-20 border-y border-slate-800">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-white text-center mb-16">Service Packages</h2>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Starter */}
            <Card className="bg-slate-800 border-slate-700 p-8">
              <h3 className="text-2xl font-bold text-white mb-2">Starter</h3>
              <p className="text-4xl font-bold text-blue-400 mb-6">$500<span className="text-lg text-slate-400">/month</span></p>
              <ul className="space-y-3 mb-8">
                <li className="flex gap-2 text-slate-300">
                  <CheckCircle2 className="h-5 w-5 text-blue-400 flex-shrink-0" />
                  <span>Quarterly security audit</span>
                </li>
                <li className="flex gap-2 text-slate-300">
                  <CheckCircle2 className="h-5 w-5 text-blue-400 flex-shrink-0" />
                  <span>Email support (48h)</span>
                </li>
                <li className="flex gap-2 text-slate-300">
                  <CheckCircle2 className="h-5 w-5 text-blue-400 flex-shrink-0" />
                  <span>Monthly reports</span>
                </li>
                <li className="flex gap-2 text-slate-300">
                  <CheckCircle2 className="h-5 w-5 text-blue-400 flex-shrink-0" />
                  <span>1 hour consulting</span>
                </li>
              </ul>
              <Button className="w-full bg-slate-700 hover:bg-slate-600">Get Started</Button>
            </Card>

            {/* Professional */}
            <Card className="bg-blue-900/30 border-blue-500 p-8 relative">
              <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                Popular
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Professional</h3>
              <p className="text-4xl font-bold text-blue-400 mb-6">$2,500<span className="text-lg text-slate-400">/month</span></p>
              <ul className="space-y-3 mb-8">
                <li className="flex gap-2 text-slate-300">
                  <CheckCircle2 className="h-5 w-5 text-blue-400 flex-shrink-0" />
                  <span>Advanced security audit</span>
                </li>
                <li className="flex gap-2 text-slate-300">
                  <CheckCircle2 className="h-5 w-5 text-blue-400 flex-shrink-0" />
                  <span>Priority support (24h)</span>
                </li>
                <li className="flex gap-2 text-slate-300">
                  <CheckCircle2 className="h-5 w-5 text-blue-400 flex-shrink-0" />
                  <span>Weekly reports</span>
                </li>
                <li className="flex gap-2 text-slate-300">
                  <CheckCircle2 className="h-5 w-5 text-blue-400 flex-shrink-0" />
                  <span>8 hours consulting</span>
                </li>
                <li className="flex gap-2 text-slate-300">
                  <CheckCircle2 className="h-5 w-5 text-blue-400 flex-shrink-0" />
                  <span>Compliance reporting</span>
                </li>
              </ul>
              <Button className="w-full bg-blue-600 hover:bg-blue-700">Get Started</Button>
            </Card>

            {/* Scalable */}
            <Card className="bg-slate-800 border-slate-700 p-8">
              <h3 className="text-2xl font-bold text-white mb-2">Scalable</h3>
              <p className="text-4xl font-bold text-blue-400 mb-6">$10,000<span className="text-lg text-slate-400">/month</span></p>
              <ul className="space-y-3 mb-8">
                <li className="flex gap-2 text-slate-300">
                  <CheckCircle2 className="h-5 w-5 text-blue-400 flex-shrink-0" />
                  <span>Monthly security audit</span>
                </li>
                <li className="flex gap-2 text-slate-300">
                  <CheckCircle2 className="h-5 w-5 text-blue-400 flex-shrink-0" />
                  <span>24/7 phone support</span>
                </li>
                <li className="flex gap-2 text-slate-300">
                  <CheckCircle2 className="h-5 w-5 text-blue-400 flex-shrink-0" />
                  <span>Daily reports</span>
                </li>
                <li className="flex gap-2 text-slate-300">
                  <CheckCircle2 className="h-5 w-5 text-blue-400 flex-shrink-0" />
                  <span>40 hours consulting</span>
                </li>
                <li className="flex gap-2 text-slate-300">
                  <CheckCircle2 className="h-5 w-5 text-blue-400 flex-shrink-0" />
                  <span>Dedicated account manager</span>
                </li>
              </ul>
              <Button className="w-full bg-slate-700 hover:bg-slate-600">Contact Sales</Button>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Transform Your Technology?</h2>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Schedule a free consultation with our founder to discuss your technology challenges and opportunities.
          </p>
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700 gap-2">
            Schedule Free Consultation
            <ArrowRight className="h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 py-12">
        <div className="container mx-auto px-4 text-center text-slate-400">
          <p>&copy; 2026 Innovative Information Technology Resolutions. All rights reserved.</p>
          <p className="mt-2">Founder: Skyler Blue | CEH | M.S. Cybersecurity | Father of 3</p>
        </div>
      </footer>
    </div>
  );
}
