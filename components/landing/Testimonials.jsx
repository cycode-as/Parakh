const testimonials = [
  {
    name: 'Rahul Sharma',
    role: 'B.Tech CSE, VIT Bhopal',
    avatar: 'RS',
    color: 'bg-blue-500',
    stars: 5,
    text: 'I almost fell for a fake Amazon internship that asked for a ₹999 "registration fee". CareerShield caught it instantly with a Trust Score of 18. Saved me money and time!',
    company: 'Now at Flipkart',
  },
  {
    name: 'Priya Nair',
    role: 'B.E. IT, BITS Pilani',
    avatar: 'PN',
    color: 'bg-violet-500',
    stars: 5,
    text: 'The skill gap analysis was eye-opening. I had a 58% fit score for my dream job at Razorpay. The roadmap told me exactly what to build and in 6 weeks I was interview-ready.',
    company: 'Interned at Razorpay',
  },
  {
    name: 'Arjun Mehta',
    role: 'MCA, Delhi University',
    avatar: 'AM',
    color: 'bg-emerald-500',
    stars: 5,
    text: 'The GitHub analysis feature is insane. It pulled my actual commit history and told recruiters I\'d worked with REST APIs before — things I forgot to mention in my resume.',
    company: 'SDE at Zomato',
  },
  {
    name: 'Sneha Reddy',
    role: 'B.Tech ECE, NIT Warangal',
    avatar: 'SR',
    color: 'bg-amber-500',
    stars: 5,
    text: 'As an ECE student pivoting to software, I had no idea which jobs were realistic for me. CareerShield\'s fit scores helped me target the right opportunities and land my first offer.',
    company: 'Interned at Infosys',
  },
  {
    name: 'Karan Patel',
    role: 'B.Tech CSE, IIT Bombay',
    avatar: 'KP',
    color: 'bg-pink-500',
    stars: 5,
    text: 'Used CareerShield for every application this placement season. The APPLY / UPSKILL / AVOID recommendation is brutally honest — and exactly what I needed to focus my prep.',
    company: 'Placed at Microsoft',
  },
  {
    name: 'Divya Krishnan',
    role: 'MCA, Bangalore University',
    avatar: 'DK',
    color: 'bg-cyan-500',
    stars: 5,
    text: 'Three of my friends got scammed on LinkedIn last year. I shared CareerShield with my entire department. Now everyone uses it before applying anywhere. It\'s essential.',
    company: 'Joined Accenture',
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 bg-amber-50 text-amber-700 border border-amber-100 px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
            ⭐ Student stories
          </span>
          <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            Loved by <span className="text-blue-600">48,000+ students</span>
          </h2>
          <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">
            Real students. Real results. Real career wins.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <div key={i}
              className="bg-white rounded-2xl border border-gray-100 p-6 shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col gap-4">
              {/* Stars */}
              <div className="flex gap-0.5">
                {[...Array(t.stars)].map((_, j) => (
                  <svg key={j} className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              {/* Quote */}
              <p className="text-sm text-gray-600 leading-relaxed flex-1">
                "{t.text}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-2 border-t border-gray-50">
                <div className={`w-10 h-10 rounded-xl ${t.color} flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}>
                  {t.avatar}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">{t.name}</p>
                  <p className="text-xs text-gray-500">{t.role}</p>
                </div>
                <span className="ml-auto text-xs bg-green-50 text-green-700 border border-green-200 px-2 py-0.5 rounded-full font-medium">
                  {t.company}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
