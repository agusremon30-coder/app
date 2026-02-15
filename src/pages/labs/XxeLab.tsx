import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, FileCode, Bug, Shield, Lock, Eye, Server } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

const XxeLab = () => {
  const simulateAttack = (type: string) => {
    toast.info(`Executing ${type}...`);
    setTimeout(() => {
      toast.success(`${type} successful! Data extracted.`);
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
            <Badge className="bg-[#ff0040]/20 text-[#ff0040] border-[#ff0040]">
              <Bug className="w-3 h-3 mr-1" />
              Network
            </Badge>
            <Badge className="bg-[#ff0040]/20 text-[#ff0040] border-[#ff0040]">
              Advanced
            </Badge>
          </div>
          <h1 className="font-orbitron text-3xl sm:text-4xl text-white mb-2">
            XXE <span className="text-[#ff0000]">Injection</span>
          </h1>
          <p className="text-[#999] max-w-2xl">
            XML External Entity attacks for file disclosure, SSRF, and denial of service.
            Learn to exploit XML parsers and extract sensitive data.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { name: 'File Disclosure', icon: FileCode, desc: 'Read arbitrary files via XXE' },
            { name: 'SSRF via XXE', icon: Server, desc: 'Make internal requests through XXE' },
            { name: 'DoS Attacks', icon: Shield, desc: 'Billion laughs and quadratic blowup' },
            { name: 'Error-Based XXE', icon: Bug, desc: 'Extract data through error messages' },
            { name: 'Out-of-Band XXE', icon: Eye, desc: 'Exfiltrate data to external servers' },
            { name: 'XXE WAF Bypass', icon: Lock, desc: 'Bypass XXE protections' },
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
                  Execute
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default XxeLab;
