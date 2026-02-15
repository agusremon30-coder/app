import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Bug, Shield, Lock, Search, Zap, Target } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

const ZeroDayLab = () => {
  const simulateAttack = (type: string) => {
    toast.info(`Researching ${type}...`);
    setTimeout(() => {
      toast.success(`0day vulnerability discovered!`);
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
            <Badge className="bg-purple-500/20 text-purple-400 border-purple-500 animate-pulse">
              <Bug className="w-3 h-3 mr-1" />
              Advanced
            </Badge>
            <Badge className="bg-purple-500/20 text-purple-400 border-purple-500 animate-pulse">
              0day Research
            </Badge>
          </div>
          <h1 className="font-orbitron text-3xl sm:text-4xl text-white mb-2">
            0day <span className="text-purple-400">Research Sim</span>
          </h1>
          <p className="text-[#999] max-w-2xl">
            Simulated zero-day vulnerability discovery and exploitation scenarios.
            Learn advanced research techniques and vulnerability development.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { name: 'Fuzzing', icon: Zap, desc: 'Advanced fuzzing techniques' },
            { name: 'Source Analysis', icon: Search, desc: 'Static code analysis' },
            { name: 'Binary Exploitation', icon: Bug, desc: 'Binary vulnerability research' },
            { name: 'Patch Diffing', icon: Shield, desc: 'Analyze security patches' },
            { name: 'Exploit Dev', icon: Lock, desc: 'Develop reliable exploits' },
            { name: 'Responsible Disclosure', icon: Target, desc: 'Disclosure procedures' },
          ].map((item) => (
            <Card key={item.name} className="bg-[#0a0a0a] border-[#333] hover:border-purple-500/50 transition-all">
              <CardContent className="p-6">
                <item.icon className="w-10 h-10 text-purple-400 mb-4" />
                <h3 className="font-orbitron text-lg text-white mb-2">{item.name}</h3>
                <p className="text-[#999] text-sm mb-4">{item.desc}</p>
                <Button 
                  onClick={() => simulateAttack(item.name)}
                  className="w-full bg-purple-500/20 text-purple-400 border border-purple-500 hover:bg-purple-500 hover:text-white"
                >
                  Research
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ZeroDayLab;
