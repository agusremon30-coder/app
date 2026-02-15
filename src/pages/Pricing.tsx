import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Zap } from 'lucide-react';

const Pricing = () => {
  const plans = [
    {
      name: 'Basic',
      price: '$29',
      period: '/month',
      description: 'Perfect for beginners starting their cybersecurity journey',
      features: [
        'Access to 10 labs',
        'Community support',
        'Basic tutorials',
        'Email support',
      ],
      cta: 'Get Started',
      featured: false,
    },
    {
      name: 'Pro',
      price: '$79',
      period: '/month',
      description: 'Best for serious learners and professionals',
      features: [
        'Access to 50+ labs',
        'Priority support',
        'Advanced tutorials',
        'Certification prep',
        'Downloadable resources',
        'Lab hints included',
      ],
      cta: 'Go Pro',
      featured: true,
    },
    {
      name: 'Enterprise',
      price: '$199',
      period: '/month',
      description: 'For teams and organizations',
      features: [
        'Unlimited lab access',
        'Dedicated support',
        'Custom labs',
        'Team management',
        'Progress tracking',
        'API access',
        'SSO integration',
      ],
      cta: 'Contact Us',
      featured: false,
    },
  ];

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-[#ff0000]/20 text-[#ff0000] border-[#ff0000]">
            Pricing
          </Badge>
          <h1 className="font-orbitron text-4xl sm:text-5xl text-white mb-6">
            Choose Your <span className="text-[#ff0000]">Plan</span>
          </h1>
          <p className="text-[#999] text-lg max-w-2xl mx-auto">
            Select the plan that best fits your learning goals. All plans include 
            access to our isolated lab environments.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={`bg-[#0a0a0a] border-[#333] relative ${
                plan.featured ? 'border-[#ff0000] scale-105' : ''
              }`}
            >
              {plan.featured && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-[#ff0000] text-white border-[#ff0000]">
                    <Zap className="w-3 h-3 mr-1" />
                    Most Popular
                  </Badge>
                </div>
              )}
              <CardHeader className="text-center pb-0">
                <CardTitle className="font-orbitron text-2xl text-white">{plan.name}</CardTitle>
                <div className="mt-4">
                  <span className="font-orbitron text-4xl text-[#ff0000]">{plan.price}</span>
                  <span className="text-[#999]">{plan.period}</span>
                </div>
                <p className="text-[#999] mt-2">{plan.description}</p>
              </CardHeader>
              <CardContent className="pt-6">
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, fIndex) => (
                    <li key={fIndex} className="flex items-center gap-3 text-[#e0e0e0]">
                      <Check className="w-5 h-5 text-[#00ff41] flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button
                  className={`w-full font-orbitron ${
                    plan.featured
                      ? 'bg-[#ff0000] hover:bg-[#cc0000] text-white'
                      : 'bg-[#1a1a1a] hover:bg-[#222] text-white border border-[#333]'
                  }`}
                >
                  {plan.cta}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* FAQ */}
        <div className="max-w-3xl mx-auto">
          <h2 className="font-orbitron text-2xl text-white text-center mb-8">
            Frequently Asked <span className="text-[#ff0000]">Questions</span>
          </h2>
          <div className="space-y-4">
            {[
              {
                q: 'Can I cancel my subscription anytime?',
                a: 'Yes, you can cancel your subscription at any time. Your access will continue until the end of your billing period.',
              },
              {
                q: 'Do you offer refunds?',
                a: 'We offer a 7-day money-back guarantee for all new subscriptions. If you\'re not satisfied, contact us for a full refund.',
              },
              {
                q: 'Can I upgrade or downgrade my plan?',
                a: 'Yes, you can upgrade or downgrade your plan at any time. The changes will take effect on your next billing cycle.',
              },
              {
                q: 'Do you offer student discounts?',
                a: 'Yes, we offer a 50% discount for students with a valid .edu email address. Contact us to apply.',
              },
            ].map((faq, index) => (
              <Card key={index} className="bg-[#0a0a0a] border-[#333]">
                <CardContent className="p-6">
                  <h3 className="font-orbitron text-lg text-white mb-2">{faq.q}</h3>
                  <p className="text-[#999]">{faq.a}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
