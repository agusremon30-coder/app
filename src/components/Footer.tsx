import { Link } from 'react-router-dom';
import { Shield, Terminal, Twitter, Linkedin, Github, MessageCircle } from 'lucide-react';

const Footer = () => {
  const footerLinks = {
    quickLinks: [
      { name: 'Home', path: '/' },
      { name: 'Labs', path: '/labs' },
      { name: 'Pricing', path: '/pricing' },
      { name: 'About', path: '/about' },
      { name: 'Contact', path: '/contact' },
    ],
    resources: [
      { name: 'Blog', path: '#' },
      { name: 'Documentation', path: '#' },
      { name: 'Community', path: '#' },
      { name: 'FAQ', path: '#' },
    ],
    legal: [
      { name: 'Privacy Policy', path: '#' },
      { name: 'Terms of Service', path: '#' },
      { name: 'Cookie Policy', path: '#' },
    ],
  };

  const socialLinks = [
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Github, href: '#', label: 'GitHub' },
    { icon: MessageCircle, href: '#', label: 'Discord' },
  ];

  return (
    <footer className="bg-[#0a0a0a] border-t border-[#333] relative overflow-hidden">
      {/* Animated border glow */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#ff0000] to-transparent opacity-50 animate-pulse" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-3 group mb-6">
              <div className="relative">
                <Shield className="w-10 h-10 text-[#ff0000] transition-transform duration-300 group-hover:scale-110" />
                <Terminal className="w-5 h-5 text-white absolute -bottom-1 -right-1" />
              </div>
              <span className="font-orbitron text-2xl font-bold tracking-wider">
                <span className="text-[#ff0000]">VULN</span>
                <span className="text-white">LAB</span>
              </span>
            </Link>
            <p className="text-[#999] text-sm leading-relaxed mb-6">
              Empowering the next generation of cybersecurity experts through hands-on 
              learning and real-world vulnerability testing.
            </p>
            {/* Social Links */}
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 rounded-lg bg-[#1a1a1a] border border-[#333] flex items-center justify-center text-[#999] hover:text-[#ff0000] hover:border-[#ff0000] hover:scale-110 transition-all duration-300"
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-orbitron text-sm font-semibold tracking-wider uppercase text-white mb-6">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {footerLinks.quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-[#999] hover:text-[#ff0000] hover:translate-x-2 transition-all duration-200 text-sm inline-block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-orbitron text-sm font-semibold tracking-wider uppercase text-white mb-6">
              Resources
            </h4>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-[#999] hover:text-[#ff0000] hover:translate-x-2 transition-all duration-200 text-sm inline-block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-orbitron text-sm font-semibold tracking-wider uppercase text-white mb-6">
              Legal
            </h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-[#999] hover:text-[#ff0000] hover:translate-x-2 transition-all duration-200 text-sm inline-block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-[#222] flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[#666] text-sm">
            &copy; {new Date().getFullYear()} VulnLab. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-[#666] text-sm">
            <span className="w-2 h-2 rounded-full bg-[#00ff41] animate-pulse" />
            All Systems Operational
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#ff0000]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-0 right-0 w-48 h-48 bg-[#ff0000]/3 rounded-full blur-3xl pointer-events-none" />
    </footer>
  );
};

export default Footer;
