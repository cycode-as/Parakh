import Link from 'next/link';

const plans = [
  {
    name:  'Free',
    price: '₹0',
    period: 'forever',
    desc: 'Perfect for getting started',
    highlight: false,
    features: [
      '5 analyses per month',
      'Trust Score only',
      'Basic red flag detection',
      'Email support',
    ],
    cta: 'Get Started Free',
    href: '/signup',
    btnClass: 'bg-white text-blue-600 border-2 border-blue-600 hover:bg-blue-50',
  },
  {
    name:  'Pro',
    price: '₹199',
    period: 'per month',
    desc: 'For serious job seekers',
    highlight: true,
    badge: '🔥 Most Popular',
    features: [
      'Unlimited analyses',
      'Full 6-card report',
      'GitHub + LinkedIn analysis',
      'Personalized roadmap',
      'Priority support',
      'History & reports',
    ],
    cta: 'Start Free Trial',
    href: '/signup',
    btnClass: 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg',
  },
  {
    name:  'Campus',
    price: '₹2,999',
    period: 'per college/year',
    desc: 'For placement cells & TPOs',
    highlight: false,
    features: [
      'Unlimited student accounts',
      'Bulk analysis dashboard',
      'Placement analytics',
      'Custom branding',
      'Dedicated account manager',
      'API access',
    ],
    cta: 'Contact Sales',
    href: '#contact',
    btnClass: 'bg-gray-900 text-white hover:bg-gray-700',
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 border border-blue-100 px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
            💸 Simple pricing
          </span>
          <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            Start free, scale as you grow
          </h2>
          <p className="mt-4 text-lg text-gray-500 max-w-xl mx-auto">
            No hidden fees. Cancel anytime. Built for students.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 items-start">
          {plans.map((plan) => (
            <div key={plan.name}
              className={`relative rounded-2xl p-8 flex flex-col gap-6 transition-all duration-300
                ${plan.highlight
                  ? 'bg-blue-600 text-white shadow-2xl scale-105 border-0'
                  : 'bg-white border border-gray-100 shadow-card hover:shadow-card-hover'}`}>
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-amber-400 text-amber-900 text-xs font-bold px-3 py-1 rounded-full shadow">
                    {plan.badge}
                  </span>
                </div>
              )}

              <div>
                <p className={`text-sm font-semibold uppercase tracking-widest mb-1 ${plan.highlight ? 'text-blue-200' : 'text-gray-500'}`}>{plan.name}</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold">{plan.price}</span>
                  <span className={`text-sm ${plan.highlight ? 'text-blue-200' : 'text-gray-500'}`}>/{plan.period}</span>
                </div>
                <p className={`text-sm mt-1 ${plan.highlight ? 'text-blue-100' : 'text-gray-500'}`}>{plan.desc}</p>
              </div>

              <ul className="space-y-3 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className={`flex items-center gap-2.5 text-sm ${plan.highlight ? 'text-blue-100' : 'text-gray-600'}`}>
                    <svg className={`w-4 h-4 flex-shrink-0 ${plan.highlight ? 'text-blue-200' : 'text-green-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>

              <Link href={plan.href}
                className={`block text-center py-3 rounded-xl font-semibold text-sm transition-all ${plan.btnClass}`}>
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
