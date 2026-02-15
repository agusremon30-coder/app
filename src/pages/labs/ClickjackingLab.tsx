import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, MousePointer, Bug, Shield, Lock, Eye, Layers } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

const ClickjackingLab = () => {
  const simulateAttack = (type: string) => {
    toast.info(`Setting up ${type}...`);
    setTimeout(() => {
      toast.success(`Clickjacking attack successful!`);
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
            <Badge className="bg-[#ff0000]/20 text-[#ff0000] border-[#ff0000]">
              <Bug className="w-3 h-3 mr-1" />
              Web Application
            </Badge>
            <Badge className="bg-[#ffaa00]/20 text-[#ffaa00] border-[#ffaa00]">
              Intermediate
            </Badge>
          </div>
          <h1 className="font-orbitron text-3xl sm:text-4xl text-white mb-2">
            Clickjacking <span className="text-[#ff0000]">Lab</span>
          </h1>
          <p className="text-[#999] max-w-2xl">
            Exploit UI redressing vulnerabilities to trick users into unintended actions.
            Learn to bypass X-Frame-Options and CSP frame-ancestors.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { name: 'Basic Clickjacking', icon: MousePointer, desc: 'Simple iframe overlay' },
            { name: 'X-Frame Bypass', icon: Shield, desc: 'Bypass X-Frame-Options' },
            { name: 'CSP Bypass', icon: Lock, desc: 'Bypass frame-ancestors CSP' },
            { name: 'Cursor Tracking', icon: Eye, desc: 'Advanced cursor manipulation' },
            { name: 'Multi-Click', icon: Layers, desc: 'Chained click attacks' },
            { name: 'Likejacking', icon: Bug, desc: 'Social media likejacking' },
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
                  Demo Attack
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ClickjackingLab;
