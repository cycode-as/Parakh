// lib/presets.js
// Demo preset data for Parakh AI
// Contains a fake (scam) job posting and a real (legitimate) job posting,
// both paired with the same sample student resume.

export const PRESETS = {
  fake: {
    jobText: `Amazon Work From Home Internship — URGENT HIRING

Company: Amazon India
Salary: ₹1,50,000/month + performance bonus
Duration: 3 months (extendable)
Location: Remote

We are hiring talented students for our elite remote internship program.

Requirements:
- Basic computer knowledge
- Smartphone or laptop
- Willingness to learn
- Available immediately

How to apply:
Pay a ₹999 registration and background verification fee via UPI to amazonhrjobs@gmail.com
Contact our HR team on WhatsApp: +91 98765 43210

Hurry! Only 5 seats left. Offer expires in 24 hours.`,
    resumeText: `Name: Rahul Sharma
B.Tech CSE, 3rd Year — VIT Bhopal

Skills: React.js, Java, HTML, CSS, Git

Projects:
- Todo App (React)
- Java console-based bank management system

Certifications: Infosys Springboard Java Basics`
  },
  real: {
    jobText: `Google — Software Engineering Intern (India, Summer 2025)

Location: Bangalore / Hybrid
Duration: 10 weeks
Stipend: ₹80,000/month

About the role:
Join one of Google's engineering teams to work on real infrastructure,
tools, or product features. You will be paired with a full-time engineer
mentor and contribute to production code.

Minimum qualifications:
- Currently pursuing B.Tech/B.E. in CS or related field
- Strong fundamentals in data structures and algorithms
- Proficiency in at least one of: C++, Java, Python, Go
- Experience with SQL and relational databases
- Familiarity with REST APIs and backend development

Apply at: careers.google.com/students
Contact: google-university-recruiting@google.com`,
    resumeText: `Name: Rahul Sharma
B.Tech CSE, 3rd Year — VIT Bhopal

Skills: React.js, Java, HTML, CSS, Git

Projects:
- Todo App (React)
- Java console-based bank management system

Certifications: Infosys Springboard Java Basics`
  }
}
