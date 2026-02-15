import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Shield, Terminal, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Labs', path: '/labs' },
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'About', path: '/about' },
    { name: 'Pricing', path: '/pricing' },
    { name: 'Contact', path: '/contact' },
  ];

  const labCategories = [
    { name: 'XSS Lab', path: '/labs/xss' },
    { name: 'SQL Injection', path: '/labs/sqli' },
    { name: 'LFI/RFI', path: '/labs/lfi' },
    { name: 'RCE', path: '/labs/rce' },
    { name: 'SSTI', path: '/labs/ssti' },
    { name: 'SSRF', path: '/labs/ssrf' },
    { name: 'View All Labs', path: '/labs' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-[#050505]/90 backdrop-blur-xl border-b border-[#333] shadow-lg shadow-black/50'
          : 'bg-transparent'
      }`}
      style={{ height: isScrolled ? '60px' : '70px' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex items-center justify-between h-full">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <Shield className="w-8 h-8 text-[#ff0000] transition-transform duration-300 group-hover:scale-110" />
              <Terminal className="w-4 h-4 text-white absolute -bottom-1 -right-1" />
            </div>
            <span className="font-orbitron text-xl font-bold tracking-wider">
              <span className="text-[#ff0000]">VULN</span>
              <span className="text-white">LAB</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) =>
              link.name === 'Labs' ? (
                <DropdownMenu key={link.name}>
                  <DropdownMenuTrigger asChild>
                    <button
                      className={`flex items-center gap-1 text-sm font-medium tracking-wide uppercase transition-colors duration-200 hover:text-[#ff0000] ${
                        isActive(link.path) ? 'text-[#ff0000]' : 'text-[#e0e0e0]'
                      }`}
                    >
                      {link.name}
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="bg-[#0a0a0a] border-[#333] min-w-[200px]"
                    align="start"
                  >
                    {labCategories.map((lab) => (
                      <DropdownMenuItem key={lab.path} asChild>
                        <Link
                          to={lab.path}
                          className="text-[#e0e0e0] hover:text-[#ff0000] hover:bg-[#1a1a1a] cursor-pointer"
                        >
                          {lab.name}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`relative text-sm font-medium tracking-wide uppercase transition-colors duration-200 hover:text-[#ff0000] group ${
                    isActive(link.path) ? 'text-[#ff0000]' : 'text-[#e0e0e0]'
                  }`}
                >
                  {link.name}
                  <span
                    className={`absolute -bottom-1 left-0 h-[2px] bg-[#ff0000] transition-all duration-300 ${
                      isActive(link.path) ? 'w-full' : 'w-0 group-hover:w-full'
                    }`}
                  />
                </Link>
              )
            )}
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Button
              className="bg-[#ff0000] hover:bg-[#cc0000] text-white font-orbitron text-sm tracking-wider uppercase px-6 py-2 transition-all duration-300 hover:translate-y-[-2px] hover:shadow-lg hover:shadow-red-500/30"
            >
              Get Started
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden fixed inset-0 top-[70px] bg-[#050505]/98 backdrop-blur-xl transition-all duration-500 ${
          isMobileMenuOpen
            ? 'opacity-100 translate-x-0'
            : 'opacity-0 translate-x-full pointer-events-none'
        }`}
      >
        <div className="flex flex-col items-center justify-center h-full gap-8">
          {navLinks.map((link, index) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`text-2xl font-orbitron tracking-wider uppercase transition-all duration-300 hover:text-[#ff0000] ${
                isActive(link.path) ? 'text-[#ff0000]' : 'text-white'
              }`}
              style={{
                animationDelay: `${index * 100}ms`,
              }}
            >
              {link.name}
            </Link>
          ))}
          <Button
            className="mt-8 bg-[#ff0000] hover:bg-[#cc0000] text-white font-orbitron text-lg tracking-wider uppercase px-8 py-3"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Get Started
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
