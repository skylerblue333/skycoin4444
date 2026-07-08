import { Shield, Award, Users, TrendingUp, CheckCircle2, ArrowRight, Lock, Zap, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "wouter";

const SERVICES = [
  {
    icon: Shield,
    title: "Cybersecurity Audits",
    description: "Robust security assessments and penetration testing",
    price: "$5,000 - $50,000",
    features: ["Vulnerability Assessment", "Penetration Testing", "Compliance Audit", "Risk Analysis"],
  },
  {
    icon: Lock,
    title: "Managed IT Services",
    description: "24/7 monitoring, maintenance, and support for your infrastructure",
    price: "$2,000 - $10,000/month",
    features: ["24/7 Monitoring", "Incident Response", "System Administration", "Security Updates"],
  },
  {
    icon: Zap,
    title: "AI-Powered Solutions",
    description: "Custom AI implementations for automation and intelligence",
    price: "$10,000 - $100,000",
    features: ["Machine Learning Models", "Process Automation", "Data Analytics", "Custom Development"],
  },
  {
    icon: BarChart3,
    title: "Blockchain Integration",
    description: "Web3 infrastructure and smart contract development",
    price: "$15,000 - $150,000",
    features: ["Smart Contracts", "DeFi Integration", "Token Development", "Security Audit"],
  },
];

const CASE_STUDIES = [
  {
    company: "TechCorp Inc",
    industry: "Financial Services",
    challenge: "Critical security vulnerabilities in legacy systems",
    result: "100% vulnerability remediation, SOC 2 compliance achieved",
    impact: "Reduced security incidents by 95%",
  },
  {
    company: "HealthPlus Systems",
    industry: "Healthcare",
    challenge: "HIPAA compliance and data protection",
    result: "Full HIPAA compliance, encrypted infrastructure",
    impact: "Zero data breaches, 99.99% uptime",
  },
  {
    company: "FinanceFlow",
    industry: "Fintech",
    challenge: "Blockchain security and smart contract audit",
    result: "Audited $50M in smart contracts, zero exploits",
    impact: "Enabled $500M+ in transaction volume",
  },
];

const CREDENTIALS = [
  { title: "Certified Ethical Hacker (CEH)", issuer: "EC-Council", year: "2022" },
  { title: "M.S. Cybersecurity", issuer: "Graduate School", year: "2023" },
  { title: "B.S. Information Technology", issuer: "University", year: "2020" },
  { title: "Advanced Security Certifications", issuer: "Multiple", year: "2021-2023" },
];

export default function IITR() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      {/* Hero Section */}
      <section className="relative py-24 md:py-32 overflow-hidden border-b border-slate-700">
        <div className="absolute inset-0 bg-grid-white/5" />
        <div className="container relative z-10">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-6">
              <img
                src="https://d2xsxph8kpxj0f.cloudfront.net/310519663608806484/ebV4wfmMWhJ74jJTNddpvH/iitr-logo-itXaCQWtNPgmPdjkMmkReN.webp"
                alt="IITR Logo"
                className="w-12 h-12"
              />
              <span className="text-sm font-semibold text-blue-400 uppercase tracking-wider">IITR</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Scalable Security & Technology Solutions
            </h1>
            <p className="text-xl text-slate-300 mb-8">
              Innovative Information Technology Resolutions. Cybersecurity audits, managed IT services, AI integration, and blockchain expertise for enterprises.
            </p>
            <div className="flex gap-4">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                Schedule Consultation
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
              <Button size="lg" variant="outline" className="border-slate-600 text-white hover:bg-slate-800">
                View Case Studies
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 border-b border-slate-700">
        <div className="container">
          <h2 className="text-4xl font-bold text-white mb-4">Our Services</h2>
          <p className="text-slate-400 mb-12 max-w-2xl">
            Robust solutions tailored to your security and technology needs
          </p>
          <div className="grid md:grid-cols-2 gap-8">
            {SERVICES.map((service, i) => {
              const Icon = service.icon;
              return (
                <Card key={i} className="bg-slate-800 border-slate-700 p-8 hover:border-blue-500 transition">
                  <Icon className="w-10 h-10 text-blue-400 mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">{service.title}</h3>
                  <p className="text-slate-400 mb-4">{service.description}</p>
                  <p className="text-blue-400 font-semibold mb-4">{service.price}</p>
                  <ul className="space-y-2">
                    {service.features.map((feature, j) => (
                      <li key={j} className="flex items-center gap-2 text-slate-300">
                        <CheckCircle2 className="w-4 h-4 text-green-400" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Case Studies Section */}
      <section className="py-24 border-b border-slate-700">
        <div className="container">
          <h2 className="text-4xl font-bold text-white mb-4">Case Studies</h2>
          <p className="text-slate-400 mb-12 max-w-2xl">
            Proven results across industries and security challenges
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {CASE_STUDIES.map((study, i) => (
              <Card key={i} className="bg-slate-800 border-slate-700 p-8">
                <h3 className="text-lg font-bold text-white mb-2">{study.company}</h3>
                <p className="text-blue-400 text-sm mb-4">{study.industry}</p>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-slate-400 uppercase">Challenge</p>
                    <p className="text-slate-300">{study.challenge}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 uppercase">Result</p>
                    <p className="text-slate-300">{study.result}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 uppercase">Impact</p>
                    <p className="text-green-400 font-semibold">{study.impact}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Founder Credentials Section */}
      <section className="py-24 border-b border-slate-700">
        <div className="container">
          <h2 className="text-4xl font-bold text-white mb-4">Founder Credentials</h2>
          <p className="text-slate-400 mb-12 max-w-2xl">
            Skyler Blue Spillers - 10+ years of cybersecurity and software engineering expertise
          </p>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <div className="space-y-4">
                {CREDENTIALS.map((cred, i) => (
                  <Card key={i} className="bg-slate-800 border-slate-700 p-6">
                    <div className="flex items-start gap-4">
                      <Award className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="font-bold text-white">{cred.title}</h3>
                        <p className="text-slate-400 text-sm">{cred.issuer}</p>
                        <p className="text-blue-400 text-xs mt-1">{cred.year}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-900/30 to-slate-800 border border-slate-700 rounded-lg p-8">
              <h3 className="text-2xl font-bold text-white mb-6">Why Choose IITR?</h3>
              <ul className="space-y-4">
                <li className="flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span className="text-slate-300">CEH-level security expertise and auditing</span>
                </li>
                <li className="flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span className="text-slate-300">Graduate-level cybersecurity knowledge</span>
                </li>
                <li className="flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span className="text-slate-300">Full-stack software engineering capability</span>
                </li>
                <li className="flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span className="text-slate-300">Blockchain and Web3 integration expertise</span>
                </li>
                <li className="flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span className="text-slate-300">Scalable compliance (SOC 2, HIPAA, GDPR, PCI-DSS)</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="container">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Secure Your Scalable?
            </h2>
            <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
              Contact IITR today for a free security assessment and consultation
            </p>
            <div className="flex gap-4 justify-center">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-slate-100">
                Schedule Consultation
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-blue-700">
                Contact Us
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
