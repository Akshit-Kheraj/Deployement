import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Activity, Check, HelpCircle, ArrowRight, Zap, Building2, Users, Shield } from 'lucide-react';
import Navbar from '@/components/home/Navbar';
import Footer from '@/components/home/Footer';

const Pricing = () => {
  const plans = [
    {
      name: "Starter",
      description: "Perfect for individual practitioners and small clinics",
      price: 99,
      period: "per month",
      icon: Users,
      features: [
        "Up to 100 patient analyses/month",
        "Basic biomarker detection",
        "Email support",
        "Standard reporting",
        "Data export (CSV)",
        "7-day data retention"
      ],
      cta: "Start Free Trial",
      popular: false
    },
    {
      name: "Professional",
      description: "Ideal for growing medical practices and departments",
      price: 299,
      period: "per month",
      icon: Zap,
      features: [
        "Up to 500 patient analyses/month",
        "Advanced AI biomarker analysis",
        "Priority email & phone support",
        "Comprehensive reporting suite",
        "API access",
        "EHR integration",
        "30-day data retention",
        "Custom report templates"
      ],
      cta: "Start Free Trial",
      popular: true
    },
    {
      name: "Enterprise",
      description: "Built for hospitals and large healthcare networks",
      price: null,
      period: "Custom pricing",
      icon: Building2,
      features: [
        "Unlimited patient analyses",
        "Full AI diagnostic suite",
        "24/7 dedicated support",
        "White-label solution",
        "Custom integrations",
        "On-premise deployment option",
        "Unlimited data retention",
        "SLA guarantee",
        "Compliance assistance"
      ],
      cta: "Contact Sales",
      popular: false
    }
  ];

  const faqs = [
    {
      question: "What happens after my free trial ends?",
      answer: "After your 14-day free trial, you'll be automatically moved to your selected plan. You can cancel anytime during the trial period at no cost."
    },
    {
      question: "Can I switch plans at any time?",
      answer: "Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle, and we'll prorate any differences."
    },
    {
      question: "Is my patient data secure?",
      answer: "Absolutely. We're HIPAA compliant and SOC 2 Type II certified. All data is encrypted at rest and in transit, with regular security audits."
    },
    {
      question: "Do you offer discounts for academic institutions?",
      answer: "Yes, we offer special pricing for academic and research institutions. Contact our sales team for more information."
    },
    {
      question: "What EHR systems do you integrate with?",
      answer: "We integrate with major EHR systems including Epic, Cerner, Allscripts, and eClinicalWorks. Custom integrations are available for Enterprise customers."
    },
    {
      question: "Can I get a refund if I'm not satisfied?",
      answer: "We offer a 30-day money-back guarantee for all paid plans. If you're not satisfied, contact us for a full refund."
    }
  ];

  const comparisonFeatures = [
    { feature: "Patient Analyses", starter: "100/mo", professional: "500/mo", enterprise: "Unlimited" },
    { feature: "AI Model Access", starter: "Basic", professional: "Advanced", enterprise: "Full Suite" },
    { feature: "Reporting", starter: "Standard", professional: "Advanced", enterprise: "Custom" },
    { feature: "Support", starter: "Email", professional: "Priority", enterprise: "24/7 Dedicated" },
    { feature: "API Access", starter: "—", professional: "✓", enterprise: "✓" },
    { feature: "EHR Integration", starter: "—", professional: "✓", enterprise: "✓" },
    { feature: "On-Premise Option", starter: "—", professional: "—", enterprise: "✓" },
    { feature: "SLA Guarantee", starter: "—", professional: "99.5%", enterprise: "99.99%" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 gradient-mesh opacity-30" />
        
        <div className="container px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <Badge className="mb-6 bg-primary/10 text-primary border-primary/20">
              Simple, Transparent Pricing
            </Badge>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Choose the Right Plan
              <span className="block text-primary">for Your Practice</span>
            </h1>
            
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Start with a 14-day free trial. No credit card required. 
              Scale as your needs grow.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="pb-20">
        <div className="container px-6">
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`relative rounded-2xl border ${
                  plan.popular 
                    ? 'border-primary shadow-xl scale-105 bg-card' 
                    : 'border-border bg-card/50'
                } p-8 transition-all duration-300 hover:shadow-lg`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground px-4 py-1">
                      Most Popular
                    </Badge>
                  </div>
                )}

                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-2 rounded-xl ${plan.popular ? 'bg-primary/20' : 'bg-primary/10'}`}>
                    <plan.icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold">{plan.name}</h3>
                </div>

                <p className="text-muted-foreground text-sm mb-6">{plan.description}</p>

                <div className="mb-8">
                  {plan.price ? (
                    <>
                      <span className="text-4xl font-bold">${plan.price}</span>
                      <span className="text-muted-foreground ml-2">{plan.period}</span>
                    </>
                  ) : (
                    <span className="text-2xl font-bold">{plan.period}</span>
                  )}
                </div>

                <Link to={plan.price ? "/auth" : "#"}>
                  <Button 
                    variant={plan.popular ? "hero" : "outline"} 
                    className="w-full mb-8"
                  >
                    {plan.cta}
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>

                <div className="space-y-4">
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className="p-0.5 rounded-full bg-success/20 mt-0.5">
                        <Check className="w-3.5 h-3.5 text-success" />
                      </div>
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-20 bg-card/50">
        <div className="container px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Compare Plans</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              A detailed breakdown of what's included in each plan.
            </p>
          </div>

          <div className="max-w-4xl mx-auto overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-4 px-4 font-semibold">Feature</th>
                  <th className="text-center py-4 px-4 font-semibold">Starter</th>
                  <th className="text-center py-4 px-4 font-semibold text-primary">Professional</th>
                  <th className="text-center py-4 px-4 font-semibold">Enterprise</th>
                </tr>
              </thead>
              <tbody>
                {comparisonFeatures.map((row, index) => (
                  <tr key={index} className="border-b border-border/50 hover:bg-card/80 transition-colors">
                    <td className="py-4 px-4 text-muted-foreground">{row.feature}</td>
                    <td className="py-4 px-4 text-center">{row.starter}</td>
                    <td className="py-4 px-4 text-center font-medium">{row.professional}</td>
                    <td className="py-4 px-4 text-center">{row.enterprise}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-16 border-y border-border">
        <div className="container px-6">
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Shield className="w-6 h-6 text-primary" />
              <span className="font-medium">HIPAA Compliant</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Shield className="w-6 h-6 text-primary" />
              <span className="font-medium">SOC 2 Type II</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Shield className="w-6 h-6 text-primary" />
              <span className="font-medium">256-bit Encryption</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Shield className="w-6 h-6 text-primary" />
              <span className="font-medium">GDPR Ready</span>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-20">
        <div className="container px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Everything you need to know about our pricing and plans.
            </p>
          </div>

          <div className="max-w-3xl mx-auto grid gap-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="p-6 rounded-xl border border-border bg-card/50 hover:border-primary/30 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <HelpCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-2">{faq.question}</h3>
                    <p className="text-muted-foreground text-sm">{faq.answer}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-primary/80">
        <div className="container px-6">
          <div className="max-w-3xl mx-auto text-center text-primary-foreground">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Transform Your Diagnostics?
            </h2>
            <p className="text-lg text-primary-foreground/80 mb-8">
              Start your 14-day free trial today. No credit card required.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/auth">
                <Button variant="secondary" size="lg">
                  Start Free Trial
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                Schedule Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Pricing;
