import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  FlaskConical,
  Search,
  ArrowRight,
  Filter,
  Terminal,
  Shield,
  Lock,
  Code,
  Database,
  Globe,
  FileCode,
  Server,
  Key,
  Eye,
  RefreshCw,
  Upload,
  Cpu,
  Zap,
  Bug,
  Fingerprint,
  Network,
} from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert' | '0day';
type Category = 'All' | 'Web Application' | 'Network' | 'Cryptography' | 'Reverse Engineering' | 'Advanced';

interface Lab {
  id: string;
  title: string;
  category: string;
  difficulty: Difficulty;
  description: string;
  icon: React.ElementType;
  path: string;
  params: number;
  protected: boolean;
}

const Labs = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | 'All'>('All');
  const labsRef = useRef<HTMLDivElement>(null);

  const labs: Lab[] = [
    // Web Application Security
    {
      id: 'xss',
      title: 'XSS Injection Lab',
      category: 'Web Application',
      difficulty: 'Beginner',
      description: 'Master Cross-Site Scripting vulnerabilities: Reflected, Stored, DOM-based, and Blind XSS attacks with real-world scenarios.',
      icon: Code,
      path: '/labs/xss',
      params: 12,
      protected: true,
    },
    {
      id: 'sqli',
      title: 'SQL Injection Mastery',
      category: 'Web Application',
      difficulty: 'Beginner',
      description: 'Learn Union-based, Error-based, Blind, and Time-based SQL injection techniques against protected databases.',
      icon: Database,
      path: '/labs/sqli',
      params: 15,
      protected: true,
    },
    {
      id: 'lfi',
      title: 'LFI & RFI Exploitation',
      category: 'Web Application',
      difficulty: 'Intermediate',
      description: 'Exploit Local and Remote File Inclusion vulnerabilities with various filters and WAF bypass techniques.',
      icon: FileCode,
      path: '/labs/lfi',
      params: 10,
      protected: true,
    },
    {
      id: 'command-injection',
      title: 'Command Injection Lab',
      category: 'Web Application',
      difficulty: 'Intermediate',
      description: 'Execute arbitrary system commands through vulnerable applications with filter evasion methods.',
      icon: Terminal,
      path: '/labs/command-injection',
      params: 8,
      protected: true,
    },
    {
      id: 'ssti',
      title: 'SSTI Vulnerabilities',
      category: 'Web Application',
      difficulty: 'Advanced',
      description: 'Exploit Server-Side Template Injection in Jinja2, Twig, Smarty, and other template engines.',
      icon: FlaskConical,
      path: '/labs/ssti',
      params: 9,
      protected: true,
    },
    {
      id: 'ssrf',
      title: 'SSRF Exploitation',
      category: 'Web Application',
      difficulty: 'Advanced',
      description: 'Server-Side Request Forgery attacks against internal services with various protections.',
      icon: Server,
      path: '/labs/ssrf',
      params: 7,
      protected: true,
    },
    {
      id: 'csrf',
      title: 'CSRF Protection Bypass',
      category: 'Web Application',
      difficulty: 'Intermediate',
      description: 'Bypass Cross-Site Request Forgery protections including tokens, SameSite cookies, and custom headers.',
      icon: Shield,
      path: '/labs/csrf',
      params: 6,
      protected: true,
    },
    {
      id: 'open-redirect',
      title: 'Open Redirect Lab',
      category: 'Web Application',
      difficulty: 'Beginner',
      description: 'Exploit unvalidated redirect vulnerabilities for phishing and credential theft scenarios.',
      icon: Globe,
      path: '/labs/open-redirect',
      params: 5,
      protected: false,
    },
    {
      id: 'file-upload',
      title: 'File Upload Vulnerabilities',
      category: 'Web Application',
      difficulty: 'Intermediate',
      description: 'Bypass file upload restrictions to execute malicious code on the server.',
      icon: Upload,
      path: '/labs/file-upload',
      params: 11,
      protected: true,
    },
    {
      id: 'html-injection',
      title: 'HTML Injection Lab',
      category: 'Web Application',
      difficulty: 'Beginner',
      description: 'Inject malicious HTML code into web pages to manipulate content and steal data.',
      icon: Code,
      path: '/labs/html-injection',
      params: 4,
      protected: false,
    },
    {
      id: 'xml-injection',
      title: 'XML & XPath Injection',
      category: 'Web Application',
      difficulty: 'Intermediate',
      description: 'Exploit XML parsers and XPath queries to extract sensitive information.',
      icon: FileCode,
      path: '/labs/xml-injection',
      params: 6,
      protected: true,
    },
    {
      id: 'csp-bypass',
      title: 'CSP Bypass Techniques',
      category: 'Web Application',
      difficulty: 'Advanced',
      description: 'Bypass Content Security Policy restrictions to execute injected scripts.',
      icon: Shield,
      path: '/labs/csp-bypass',
      params: 8,
      protected: true,
    },
    {
      id: 'clickjacking',
      title: 'Clickjacking Lab',
      category: 'Web Application',
      difficulty: 'Intermediate',
      description: 'Exploit UI redressing vulnerabilities to trick users into unintended actions.',
      icon: Eye,
      path: '/labs/clickjacking',
      params: 5,
      protected: true,
    },

    // Authentication & Session
    {
      id: 'auth-bypass',
      title: 'Authentication Bypass',
      category: 'Web Application',
      difficulty: 'Intermediate',
      description: 'Bypass login mechanisms using various techniques including SQL injection and logic flaws.',
      icon: Lock,
      path: '/labs/auth-bypass',
      params: 9,
      protected: true,
    },
    {
      id: 'jwt',
      title: 'JWT Security Lab',
      category: 'Web Application',
      difficulty: 'Advanced',
      description: 'Exploit JSON Web Tokens through signature bypass, algorithm confusion, and key injection.',
      icon: Key,
      path: '/labs/jwt',
      params: 7,
      protected: true,
    },
    {
      id: 'idor',
      title: 'IDOR & BOLA',
      category: 'Web Application',
      difficulty: 'Intermediate',
      description: 'Insecure Direct Object Reference and Broken Object Level Authorization exploitation.',
      icon: Eye,
      path: '/labs/idor',
      params: 8,
      protected: true,
    },
    {
      id: 'mass-assignment',
      title: 'Mass Assignment',
      category: 'Web Application',
      difficulty: 'Intermediate',
      description: 'Exploit automatic parameter binding to modify sensitive object properties.',
      icon: Database,
      path: '/labs/mass-assignment',
      params: 5,
      protected: true,
    },

    // Network & Infrastructure
    {
      id: 'rce',
      title: 'Remote Code Execution',
      category: 'Network',
      difficulty: 'Expert',
      description: 'Advanced RCE exploitation through various attack vectors and bypass techniques.',
      icon: Terminal,
      path: '/labs/rce',
      params: 12,
      protected: true,
    },
    {
      id: 'path-traversal',
      title: 'Path Traversal Lab',
      category: 'Network',
      difficulty: 'Intermediate',
      description: 'Access files outside the web root directory using directory traversal techniques.',
      icon: FileCode,
      path: '/labs/path-traversal',
      params: 8,
      protected: true,
    },
    {
      id: 'xxe',
      title: 'XXE Injection',
      category: 'Network',
      difficulty: 'Advanced',
      description: 'XML External Entity attacks for file disclosure, SSRF, and denial of service.',
      icon: FileCode,
      path: '/labs/xxe',
      params: 7,
      protected: true,
    },
    {
      id: 'deserialization',
      title: 'Insecure Deserialization',
      category: 'Network',
      difficulty: 'Expert',
      description: 'Exploit object deserialization vulnerabilities for RCE and authentication bypass.',
      icon: RefreshCw,
      path: '/labs/deserialization',
      params: 9,
      protected: true,
    },
    {
      id: 'race-condition',
      title: 'Race Conditions',
      category: 'Network',
      difficulty: 'Advanced',
      description: 'Exploit time-of-check to time-of-use vulnerabilities for privilege escalation.',
      icon: Zap,
      path: '/labs/race-condition',
      params: 6,
      protected: true,
    },

    // Database & API
    {
      id: 'nosql',
      title: 'NoSQL Injection',
      category: 'Web Application',
      difficulty: 'Intermediate',
      description: 'Inject malicious payloads into MongoDB, CouchDB, and other NoSQL databases.',
      icon: Database,
      path: '/labs/nosql',
      params: 8,
      protected: true,
    },
    {
      id: 'graphql',
      title: 'GraphQL Security',
      category: 'Web Application',
      difficulty: 'Advanced',
      description: 'Exploit GraphQL APIs through introspection, injection, and query manipulation.',
      icon: Network,
      path: '/labs/graphql',
      params: 10,
      protected: true,
    },
    {
      id: 'api-security',
      title: 'API Security Testing',
      category: 'Web Application',
      difficulty: 'Intermediate',
      description: 'Comprehensive API penetration testing with authentication and authorization bypasses.',
      icon: Server,
      path: '/labs/api-security',
      params: 14,
      protected: true,
    },

    // Advanced & 0day
    {
      id: 'waf-bypass',
      title: 'WAF Bypass Master',
      category: 'Advanced',
      difficulty: 'Expert',
      description: 'Advanced techniques to bypass Web Application Firewalls and filters.',
      icon: Shield,
      path: '/labs/waf-bypass',
      params: 15,
      protected: true,
    },
    {
      id: 'zero-day',
      title: '0day Research Sim',
      category: 'Advanced',
      difficulty: '0day',
      description: 'Simulated zero-day vulnerability discovery and exploitation scenarios.',
      icon: Bug,
      path: '/labs/zero-day',
      params: 20,
      protected: true,
    },
    {
      id: 'chain-exploit',
      title: 'Exploit Chaining',
      category: 'Advanced',
      difficulty: 'Expert',
      description: 'Chain multiple low-severity vulnerabilities into critical exploits.',
      icon: Fingerprint,
      path: '/labs/chain-exploit',
      params: 12,
      protected: true,
    },
    {
      id: 'advanced-persistence',
      title: 'Advanced Persistence',
      category: 'Advanced',
      difficulty: 'Expert',
      description: 'Maintain access and establish persistence in compromised systems.',
      icon: Cpu,
      path: '/labs/advanced-persistence',
      params: 11,
      protected: true,
    },
  ];

  const filteredLabs = labs.filter((lab) => {
    const matchesSearch = lab.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         lab.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || lab.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'All' || lab.difficulty === selectedDifficulty;
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.lab-card-item', {
        opacity: 0,
        y: 60,
        duration: 0.6,
        stagger: 0.08,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: labsRef.current,
          start: 'top 80%',
          once: true,
        },
      });
    });

    return () => ctx.revert();
  }, [filteredLabs]);

  const getDifficultyColor = (difficulty: Difficulty) => {
    switch (difficulty) {
      case 'Beginner':
        return 'bg-[#00ff41]/20 text-[#00ff41] border-[#00ff41]';
      case 'Intermediate':
        return 'bg-[#ffaa00]/20 text-[#ffaa00] border-[#ffaa00]';
      case 'Advanced':
        return 'bg-[#ff0040]/20 text-[#ff0040] border-[#ff0040]';
      case 'Expert':
        return 'bg-[#ff0000]/20 text-[#ff0000] border-[#ff0000]';
      case '0day':
        return 'bg-purple-500/20 text-purple-400 border-purple-500 animate-pulse';
      default:
        return 'bg-[#333] text-[#999] border-[#333]';
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="text-center mb-12">
          <h1 className="font-orbitron text-4xl sm:text-5xl text-white mb-4">
            Vulnerability <span className="text-[#ff0000]">Testing Labs</span>
          </h1>
          <p className="text-[#999] text-lg max-w-2xl mx-auto">
            Explore our comprehensive collection of hands-on labs covering every aspect of 
            cybersecurity from beginner basics to advanced 0day research.
          </p>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <div className="bg-[#0a0a0a] border border-[#333] rounded-lg p-4 text-center">
            <div className="font-orbitron text-2xl text-[#ff0000]">{labs.length}</div>
            <div className="text-[#999] text-sm">Total Labs</div>
          </div>
          <div className="bg-[#0a0a0a] border border-[#333] rounded-lg p-4 text-center">
            <div className="font-orbitron text-2xl text-[#00ff41]">150+</div>
            <div className="text-[#999] text-sm">Protected Params</div>
          </div>
          <div className="bg-[#0a0a0a] border border-[#333] rounded-lg p-4 text-center">
            <div className="font-orbitron text-2xl text-[#ffaa00]">5</div>
            <div className="text-[#999] text-sm">Difficulty Levels</div>
          </div>
          <div className="bg-[#0a0a0a] border border-[#333] rounded-lg p-4 text-center">
            <div className="font-orbitron text-2xl text-purple-400">0day</div>
            <div className="text-[#999] text-sm">Research Track</div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#666]" />
            <Input
              type="text"
              placeholder="Search labs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-[#0a0a0a] border-[#333] text-white placeholder:text-[#666] focus:border-[#ff0000] focus:ring-[#ff0000]/20"
            />
          </div>
          <div className="flex gap-4">
            <Select value={selectedCategory} onValueChange={(v) => setSelectedCategory(v as Category)}>
              <SelectTrigger className="w-[180px] bg-[#0a0a0a] border-[#333] text-white">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent className="bg-[#0a0a0a] border-[#333]">
                <SelectItem value="All">All Categories</SelectItem>
                <SelectItem value="Web Application">Web Application</SelectItem>
                <SelectItem value="Network">Network</SelectItem>
                <SelectItem value="Cryptography">Cryptography</SelectItem>
                <SelectItem value="Reverse Engineering">Reverse Engineering</SelectItem>
                <SelectItem value="Advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedDifficulty} onValueChange={(v) => setSelectedDifficulty(v as Difficulty | 'All')}>
              <SelectTrigger className="w-[180px] bg-[#0a0a0a] border-[#333] text-white">
                <Shield className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Difficulty" />
              </SelectTrigger>
              <SelectContent className="bg-[#0a0a0a] border-[#333]">
                <SelectItem value="All">All Levels</SelectItem>
                <SelectItem value="Beginner">Beginner</SelectItem>
                <SelectItem value="Intermediate">Intermediate</SelectItem>
                <SelectItem value="Advanced">Advanced</SelectItem>
                <SelectItem value="Expert">Expert</SelectItem>
                <SelectItem value="0day">0day Research</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results Count */}
        <div className="text-[#999] text-sm mb-6">
          Showing {filteredLabs.length} of {labs.length} labs
        </div>
      </div>

      {/* Labs Grid */}
      <div ref={labsRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLabs.map((lab) => (
            <Link
              key={lab.id}
              to={lab.path}
              className="lab-card-item group relative rounded-xl border border-[#333] bg-[#0a0a0a]/80 backdrop-blur-sm overflow-hidden hover:border-[#ff0000]/50 transition-all duration-300 hover:translate-y-[-5px]"
            >
              {/* Protected Badge */}
              {lab.protected && (
                <div className="absolute top-3 right-3 z-10">
                  <Badge variant="outline" className="bg-[#ff0000]/20 text-[#ff0000] border-[#ff0000] text-xs">
                    <Lock className="w-3 h-3 mr-1" />
                    Protected
                  </Badge>
                </div>
              )}

              <div className="p-6">
                {/* Icon & Category */}
                <div className="flex items-start justify-between mb-4">
                  <div className="w-14 h-14 rounded-lg bg-[#ff0000]/10 flex items-center justify-center group-hover:bg-[#ff0000]/20 transition-colors duration-300">
                    <lab.icon className="w-7 h-7 text-[#ff0000]" />
                  </div>
                  <Badge
                    variant="outline"
                    className={`text-xs ${getDifficultyColor(lab.difficulty)}`}
                  >
                    {lab.difficulty}
                  </Badge>
                </div>

                {/* Content */}
                <div className="text-[#ff0000] text-xs uppercase tracking-wider mb-2">
                  {lab.category}
                </div>
                <h3 className="font-orbitron text-xl text-white mb-3 group-hover:text-[#ff0000] transition-colors duration-300">
                  {lab.title}
                </h3>
                <p className="text-[#999] text-sm mb-4 line-clamp-2">{lab.description}</p>

                {/* Params & Action */}
                <div className="flex items-center justify-between pt-4 border-t border-[#222]">
                  <div className="text-[#666] text-xs">
                    <span className="text-[#ff0000]">{lab.params}</span> protected params
                  </div>
                  <div className="flex items-center text-[#ff0000] text-sm font-medium group-hover:translate-x-1 transition-transform duration-300">
                    Start Lab
                    <ArrowRight className="ml-1 w-4 h-4" />
                  </div>
                </div>
              </div>

              {/* Hover Glow */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#ff0000]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </Link>
          ))}
        </div>

        {/* Empty State */}
        {filteredLabs.length === 0 && (
          <div className="text-center py-16">
            <FlaskConical className="w-16 h-16 text-[#333] mx-auto mb-4" />
            <h3 className="font-orbitron text-xl text-white mb-2">No labs found</h3>
            <p className="text-[#999]">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Labs;
