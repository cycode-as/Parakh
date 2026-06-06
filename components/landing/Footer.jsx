import Link from 'next/link';

const cols = [
  {
    heading: 'Product',
    links: ['Features', 'How It Works', 'Pricing', 'Roadmap', 'Changelog'],
  },
  {
    heading: 'Company',
    links: ['About', 'Blog', 'Careers', 'Press', 'Contact'],
  },
  {
    heading: 'Resources',
    links: ['Documentation', 'API Reference', 'Student Guide', 'Campus Program', 'Status'],
  },
  {
    heading: 'Legal',
    links: ['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Security'],
  },
];

export default function Footer() {
  return (
    <footer id="contact" className="bg-gray-950 text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-5 gap-10 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-white" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
              </div>
              <span className="text-white font-bold">CareerShield AI</span>
            </div>
            <p className="text-sm leading-relaxed mb-4">
              Helping engineering students find opportunities they can trust and know whether they're ready.
            </p>
            <p className="text-xs text-gray-600">
              Made with ❤️ in India<br />
              © {new Date().getFullYear()} CareerShield AI
            </p>
          </div>

          {/* Link columns */}
          {cols.map((col) => (
            <div key={col.heading}>
              <h4 className="text-white text-sm font-semibold mb-4">{col.heading}</h4>
              <ul className="space-y-2.5">
                {col.links.map((l) => (
                  <li key={l}>
                    <Link href="#" className="text-sm hover:text-white transition-colors">
                      {l}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-600">
            Built for engineering students across India. Not affiliated with any company mentioned.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-xs bg-green-900 text-green-400 border border-green-800 px-2.5 py-1 rounded-full">
              ● All systems operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
