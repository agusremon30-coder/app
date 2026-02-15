import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Shield, Bug, Lock, Code, Zap, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

const WafBypassLab = () => {
  const simulateAttack = (type: string) => {
    toast.info(`Attempting ${type}...`);
    setTimeout(() => {
      toast.success(`WAF bypassed! Payload delivered.`);
    }, 1500);
  };

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="bg-[#0a0a0a] border-b border-[#333]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4 mb-4">
            <Link to="/labs">
              <Button variant="outline" size="sm" className="border-[#333] text-white hover:border-[#ff0000]">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Labs
              </Button>
            </Link>
            <Badge className="bg-purple-500/20 text-purple-400 border-purple-500">
              <Bug className="w-3 h-3 mr-1" />
              Advanced
            </Badge>
            <Badge className="bg-[#ff0040]/20 text-[#ff0040] border-[#ff0040]">
              Expert
            </Badge>
          </div>
          <h1 className="font-orbitron text-3xl sm:text-4xl text-white mb-2">
            WAF <span className="text-[#ff0000]">Bypass Master</span>
          </h1>
          <p className="text-[#999] max-w-2xl">
            Advanced techniques to bypass Web Application Firewalls and filters.
            Learn encoding, obfuscation, and evasion methods.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { name: 'Encoding', icon: Code, desc: 'URL, Unicode, and HTML encoding' },
            { name: 'Case Variation', icon: Shield, desc: 'Mixed case to bypass filters' },
            { name: 'Comment Injection', icon: Bug, desc: 'Use comments to split keywords' },
            { name: 'Keyword Splitting', icon: Lock, desc: 'Split blocked keywords' },
            { name: 'Polyglot Payloads', icon: Zap, desc: 'Multi-context payloads' },
            { name: 'Request Smuggling', icon: Eye, desc: 'HTTP request smuggling' },
          ].map((item) => (
            <Card key={item.name} className="bg-[#0a0a0a] border-[#333] hover:border-[#ff0000]/50 transition-all">
              <CardContent className="p-6">
                <item.icon className="w-10 h-10 text-[#ff0000] mb-4" />
                <h3 className="font-orbitron text-lg text-white mb-2">{item.name}</h3>
                <p className="text-[#999] text-sm mb-4">{item.desc}</p>
                <Button 
                  onClick={() => simulateAttack(item.name)}
                  className="w-full bg-[#ff0000]/20 text-[#ff0000] border border-[#ff0000] hover:bg-[#ff0000] hover:text-white"
                >
                  Bypass
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WafBypassLab;
