import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, ChevronDown, Shield, Lock, Code, Users, Clock, RefreshCw, Tag, FlaskConical, GraduationCap } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Home = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const labsRef = useRef<HTMLDivElement>(null);
  const testimonialsRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero animations
      gsap.from('.hero-eyebrow', {
        opacity: 0,
        y: 30,
        duration: 0.6,
        delay: 0.4,
        ease: 'power3.out',
      });

      gsap.from('.hero-title-word', {
        opacity: 0,
        y: 50,
        duration: 0.7,
        stagger: 0.1,
        delay: 0.5,
        ease: 'power3.out',
      });

      gsap.from('.hero-description', {
        opacity: 0,
        y: 30,
        duration: 0.6,
        delay: 1,
        ease: 'power3.out',
      });

      gsap.from('.hero-cta', {
        opacity: 0,
        scale: 0.8,
        duration: 0.4,
        stagger: 0.1,
        delay: 1.2,
        ease: 'back.out(1.7)',
      });

      // Stats counter animation
      const statNumbers = document.querySelectorAll('.stat-number');
      statNumbers.forEach((stat) => {
        const target = parseInt(stat.getAttribute('data-target') || '0');
        gsap.from(stat, {
          textContent: 0,
          duration: 2,
          ease: 'power2.out',
          snap: { textContent: 1 },
          scrollTrigger: {
            trigger: stat,
            start: 'top 80%',
            once: true,
          },
          onUpdate: function () {
            stat.textContent = Math.ceil(this.targets()[0].textContent || 0).toString();
          },
        });
      });

      // Section reveal animations
      const sections = [
        { ref: statsRef, class: '.stat-card' },
        { ref: aboutRef, class: '.about-content' },
        { ref: featuresRef, class: '.feature-card' },
        { ref: labsRef, class: '.lab-card' },
        { ref: testimonialsRef, class: '.testimonial-card' },
      ];

      sections.forEach(({ ref, class: className }) => {
        gsap.from(className, {
          opacity: 0,
          y: 80,
          rotateX: 30,
          duration: 0.7,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: ref.current,
            start: 'top 70%',
            once: true,
          },
        });
      });
    });

    return () => ctx.revert();
  }, []);

  const stats = [
    { number: 50, suffix: '+', label: 'Hands-On Labs' },
    { number: 1200, suffix: '+', label: 'Active Users' },
    { number: 95, suffix: '%', label: 'Success Rate' },
    { number: 24, suffix: '/7', label: 'Lab Availability' },
  ];

  const features = [
    {
      icon: FlaskConical,
      title: 'Realistic Labs',
      description: 'Experience true-to-life scenarios that mirror actual cybersecurity challenges.',
    },
    {
      icon: GraduationCap,
      title: 'Expert Guidance',
      description: 'Learn from industry professionals with detailed walkthroughs and tips.',
    },
    {
      icon: Users,
      title: 'Community Support',
      description: 'Join a thriving community of learners and experts to share knowledge.',
    },
    {
      icon: Clock,
      title: 'Flexible Learning',
      description: 'Access labs anytime, anywhere, and learn at your own pace.',
    },
    {
      icon: RefreshCw,
      title: 'Up-to-Date Content',
      description: 'Stay ahead with labs that are regularly updated to reflect the latest threats.',
    },
    {
      icon: Tag,
      title: 'Affordable Pricing',
      description: 'Get top-tier training without breaking the bank.',
    },
  ];

  const labs = [
    {
      title: 'SQL Injection Mastery',
      category: 'Web Application',
      difficulty: 'Beginner',
      description: 'Learn to identify and exploit SQL injection vulnerabilities.',
      image: '/lab-sqli.jpg',
    },
    {
      title: 'XSS Challenge',
      category: 'Web Application',
      difficulty: 'Intermediate',
      description: 'Master cross-site scripting attacks and defenses.',
      image: '/lab-xss.jpg',
    },
    {
      title: 'Buffer Overflow Basics',
      category: 'Reverse Engineering',
      difficulty: 'Advanced',
      description: 'Understand memory corruption and exploitation.',
      image: '/lab-buffer.jpg',
    },
    {
      title: 'Network Sniffing',
      category: 'Network Security',
      difficulty: 'Beginner',
      description: 'Capture and analyze network traffic.',
      image: '/lab-network.jpg',
    },
    {
      title: 'Encryption Cracking',
      category: 'Cryptography',
      difficulty: 'Intermediate',
      description: 'Break weak encryption and learn proper implementation.',
      image: '/lab-crypto.jpg',
    },
    {
      title: 'Privilege Escalation',
      category: 'Network Security',
      difficulty: 'Advanced',
      description: 'Elevate your access rights on compromised systems.',
      image: '/lab-privesc.jpg',
    },
  ];

  const testimonials = [
    {
      name: 'Alex Johnson',
      role: 'Cybersecurity Student',
      content:
        'VulnLab transformed my learning experience. The hands-on labs are incredibly realistic and helped me land my first job in cybersecurity!',
      avatar: '/avatar1.jpg',
    },
    {
      name: 'Sarah Lee',
      role: 'Ethical Hacker',
      content:
        'The variety of labs and the detailed explanations make VulnLab my go-to platform for sharpening my skills.',
      avatar: '/avatar2.jpg',
    },
    {
      name: 'Michael Brown',
      role: 'IT Professional',
      content:
        "I've tried many platforms, but VulnLab stands out with its practical approach and supportive community.",
      avatar: '/avatar3.jpg',
    },
  ];

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
      >
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-[#0a0a0a] to-[#050505]" />
        <div className="absolute inset-0 grid-bg opacity-50" />
        <div className="absolute inset-0 hex-pattern opacity-30" />

        {/* Animated Decorative Elements */}
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-[#ff0000]/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-[#ff0000]/5 rounded-full blur-3xl animate-pulse delay-1000" />

        {/* Floating Icons */}
        <div className="absolute top-1/3 right-[15%] animate-float">
          <Shield className="w-16 h-16 text-[#ff0000]/20" />
        </div>
        <div className="absolute bottom-1/3 left-[10%] animate-float delay-1000">
          <Lock className="w-12 h-12 text-[#ff0000]/15" />
        </div>
        <div className="absolute top-1/4 left-[20%] animate-float delay-2000">
          <Code className="w-10 h-10 text-[#ff0000]/10" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h6 className="hero-eyebrow font-orbitron text-sm tracking-[4px] text-[#ff0000] mb-6 uppercase">
            Learn. Hack. Secure.
          </h6>

          <h1 className="font-orbitron text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light leading-tight mb-8">
            <span className="hero-title-word block text-white">Master the Art of</span>
            <span className="hero-title-word block text-[#ff0000] glow-text">Cybersecurity</span>
          </h1>

          <p className="hero-description text-lg sm:text-xl text-[#e0e0e0] max-w-2xl mx-auto mb-12 leading-relaxed">
            Dive into the world of ethical hacking with our cutting-edge virtual labs. 
            Practice real-world scenarios, exploit vulnerabilities, and become the 
            cybersecurity expert the world needs.
          </p>

          <div className="hero-cta flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/labs">
              <Button
                size="lg"
                className="bg-[#ff0000] hover:bg-[#cc0000] text-white font-orbitron tracking-wider uppercase px-8 py-6 text-lg transition-all duration-300 hover:translate-y-[-3px] animate-pulse-glow"
              >
                Explore Labs
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link to="/pricing">
              <Button
                size="lg"
                variant="outline"
                className="border-[#333] text-white hover:border-[#ff0000] hover:text-[#ff0000] font-orbitron tracking-wider uppercase px-8 py-6 text-lg transition-all duration-300 hover:translate-y-[-3px]"
              >
                View Pricing
              </Button>
            </Link>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-8 h-8 text-[#ff0000]" />
        </div>
      </section>

      {/* Statistics Section */}
      <section ref={statsRef} className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-center font-orbitron text-3xl sm:text-4xl text-white mb-16">
            Trusted by <span className="text-[#ff0000]">Aspiring</span> Ethical Hackers
          </h2>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="stat-card text-center p-8 rounded-xl border border-[#333] bg-[#0a0a0a]/50 backdrop-blur-sm hover:border-[#ff0000]/50 transition-all duration-300 hover:translate-y-[-10px]"
              >
                <div className="font-orbitron text-4xl sm:text-5xl font-bold text-[#ff0000] mb-2">
                  <span className="stat-number" data-target={stat.number}>
                    0
                  </span>
                  <span>{stat.suffix}</span>
                </div>
                <div className="text-[#999] text-sm uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section ref={aboutRef} className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="about-content">
              <h6 className="font-orbitron text-sm tracking-[4px] text-[#ff0000] mb-4 uppercase">
                Who We Are
              </h6>
              <h2 className="font-orbitron text-3xl sm:text-4xl text-white mb-6 leading-tight">
                Empowering the Next Generation of{' '}
                <span className="text-[#ff0000]">Cybersecurity Experts</span>
              </h2>
              <p className="text-[#e0e0e0] text-lg leading-relaxed mb-8">
                At VulnLab, we believe in learning by doing. Our platform offers a safe and 
                legal environment to practice ethical hacking techniques. Whether you&apos;re a 
                beginner or an experienced professional, our labs are designed to challenge 
                and enhance your skills.
              </p>

              <ul className="space-y-4 mb-8">
                {['Real-world scenarios', 'Step-by-step guidance', 'Community support', 'Continuous updates'].map(
                  (item, index) => (
                    <li key={index} className="flex items-center gap-3 text-[#e0e0e0]">
                      <div className="w-6 h-6 rounded-full bg-[#ff0000]/20 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-[#ff0000]" />
                      </div>
                      {item}
                    </li>
                  )
                )}
              </ul>

              <Link to="/about">
                <Button
                  variant="outline"
                  className="border-[#ff0000] text-[#ff0000] hover:bg-[#ff0000] hover:text-white font-orbitron tracking-wider uppercase transition-all duration-300"
                >
                  Learn More
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[#ff0000]/20 to-transparent rounded-2xl transform rotate-3" />
              <div className="relative bg-[#0a0a0a] border border-[#333] rounded-2xl p-8 overflow-hidden">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div className="bg-[#1a1a1a] rounded-lg p-4 border border-[#333]">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-3 h-3 rounded-full bg-[#ff0000]" />
                        <div className="w-3 h-3 rounded-full bg-[#ffaa00]" />
                        <div className="w-3 h-3 rounded-full bg-[#00ff41]" />
                      </div>
                      <div className="font-mono text-xs text-[#999]">
                        <span className="text-[#ff0000]">$</span> nmap -sV target.com
                      </div>
                    </div>
                    <div className="bg-[#1a1a1a] rounded-lg p-4 border border-[#333] h-32 flex items-center justify-center">
                      <Shield className="w-16 h-16 text-[#ff0000]/30" />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-[#1a1a1a] rounded-lg p-4 border border-[#333] h-32 flex items-center justify-center">
                      <Lock className="w-16 h-16 text-[#ff0000]/30" />
                    </div>
                    <div className="bg-[#1a1a1a] rounded-lg p-4 border border-[#333]">
                      <div className="font-mono text-xs text-[#999]">
                        <div className="text-[#00ff41]">[+] Exploit successful</div>
                        <div className="text-[#e0e0e0]">Shell obtained</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a0a0a] to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <h2 className="text-center font-orbitron text-3xl sm:text-4xl text-white mb-4">
            Why Choose <span className="text-[#ff0000]">VulnLab</span>?
          </h2>
          <p className="text-center text-[#999] max-w-2xl mx-auto mb-16">
            Our platform offers everything you need to become a skilled cybersecurity professional
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="feature-card group p-8 rounded-xl border border-[#333] bg-[#0a0a0a]/50 backdrop-blur-sm hover:border-[#ff0000]/50 transition-all duration-300 hover:translate-y-[-15px] card-3d"
              >
                <div className="w-14 h-14 rounded-lg bg-[#ff0000]/10 flex items-center justify-center mb-6 group-hover:bg-[#ff0000]/20 transition-colors duration-300">
                  <feature.icon className="w-7 h-7 text-[#ff0000] group-hover:scale-110 transition-transform duration-300" />
                </div>
                <h3 className="font-orbitron text-xl text-white mb-4">{feature.title}</h3>
                <p className="text-[#999] leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Labs Preview Section */}
      <section ref={labsRef} className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-16">
            <div>
              <h2 className="font-orbitron text-3xl sm:text-4xl text-white mb-4">
                Explore Our <span className="text-[#ff0000]">Labs</span>
              </h2>
              <p className="text-[#999] max-w-xl">
                From beginner to advanced, our labs cover every aspect of cybersecurity
              </p>
            </div>
            <Link to="/labs" className="mt-6 md:mt-0">
              <Button
                variant="outline"
                className="border-[#ff0000] text-[#ff0000] hover:bg-[#ff0000] hover:text-white font-orbitron tracking-wider uppercase transition-all duration-300"
              >
                View All Labs
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {labs.map((lab, index) => (
              <div
                key={index}
                className="lab-card group rounded-xl border border-[#333] bg-[#0a0a0a]/50 backdrop-blur-sm overflow-hidden hover:border-[#ff0000]/50 transition-all duration-300"
              >
                <div className="h-48 bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <FlaskConical className="w-20 h-20 text-[#ff0000]/20 group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <div className="absolute top-4 left-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        lab.difficulty === 'Beginner'
                          ? 'bg-[#00ff41]/20 text-[#00ff41] border border-[#00ff41]'
                          : lab.difficulty === 'Intermediate'
                          ? 'bg-[#ffaa00]/20 text-[#ffaa00] border border-[#ffaa00]'
                          : 'bg-[#ff0040]/20 text-[#ff0040] border border-[#ff0040]'
                      }`}
                    >
                      {lab.difficulty}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="text-[#ff0000] text-xs uppercase tracking-wider mb-2">
                    {lab.category}
                  </div>
                  <h3 className="font-orbitron text-xl text-white mb-3 group-hover:text-[#ff0000] transition-colors duration-300">
                    {lab.title}
                  </h3>
                  <p className="text-[#999] text-sm mb-4">{lab.description}</p>
                  <Link
                    to={`/labs/${lab.title.toLowerCase().replace(/\s+/g, '-')}`}
                    className="inline-flex items-center text-[#ff0000] text-sm hover:underline"
                  >
                    Start Lab
                    <ArrowRight className="ml-1 w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section ref={testimonialsRef} className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <h2 className="text-center font-orbitron text-3xl sm:text-4xl text-white mb-16">
            What Our <span className="text-[#ff0000]">Users</span> Say
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="testimonial-card p-8 rounded-xl border border-[#333] bg-[#0a0a0a]/50 backdrop-blur-sm hover:border-[#ff0000]/30 transition-all duration-300"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#ff0000] to-[#cc0000] flex items-center justify-center text-white font-orbitron text-xl font-bold">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-orbitron text-white">{testimonial.name}</div>
                    <div className="text-[#999] text-sm">{testimonial.role}</div>
                  </div>
                </div>
                <p className="text-[#e0e0e0] leading-relaxed italic">
                  &ldquo;{testimonial.content}&rdquo;
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section ref={ctaRef} className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#ff0000]/10 via-transparent to-[#ff0000]/10 animate-gradient" />
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#ff0000] to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#ff0000] to-transparent" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <h2 className="font-orbitron text-3xl sm:text-4xl md:text-5xl text-white mb-6">
            Ready to Start Your{' '}
            <span className="text-[#ff0000]">Cybersecurity</span> Journey?
          </h2>
          <p className="text-[#e0e0e0] text-lg mb-10 max-w-2xl mx-auto">
            Join thousands of learners and professionals who are mastering ethical hacking 
            with VulnLab. Sign up today and get access to our free labs!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/labs">
              <Button
                size="lg"
                className="bg-[#ff0000] hover:bg-[#cc0000] text-white font-orbitron tracking-wider uppercase px-10 py-6 text-lg transition-all duration-300 hover:translate-y-[-3px] animate-pulse-glow"
              >
                Sign Up Now
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link to="/contact">
              <Button
                size="lg"
                variant="outline"
                className="border-[#333] text-white hover:border-[#ff0000] hover:text-[#ff0000] font-orbitron tracking-wider uppercase px-10 py-6 text-lg transition-all duration-300 hover:translate-y-[-3px]"
              >
                Contact Sales
              </Button>
            </Link>
          </div>
        </div>

        {/* Floating Decorative Elements */}
        <div className="absolute top-1/4 left-[10%] w-20 h-20 border border-[#ff0000]/20 rounded-lg animate-slow-rotate" />
        <div className="absolute bottom-1/4 right-[10%] w-16 h-16 border border-[#ff0000]/20 rounded-full animate-float" />
      </section>
    </div>
  );
};

export default Home;
