import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Lock, Bug, Shield, Key, Eye, Power } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

const AuthBypassLab = () => {
  const simulateAttack = (type: string) => {
    toast.info(`Starting ${type} attack simulation...`);
    setTimeout(() => {
      toast.success(`${type} attack completed! Check the results.`);
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
            Authentication <span className="text-[#ff0000]">Bypass</span>
          </h1>
          <p className="text-[#999] max-w-2xl">
            Learn various authentication bypass techniques including SQL injection, 
            logic flaws, session manipulation, and brute force attacks.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { name: 'SQL Injection Login', icon: Lock, desc: 'Bypass login using SQL injection', color: 'text-[#ff0000]' },
            { name: 'Logic Flaws', icon: Shield, desc: 'Exploit authentication logic errors', color: 'text-[#ffaa00]' },
            { name: 'Session Fixation', icon: Key, desc: 'Hijack user sessions', color: 'text-[#00aaff]' },
            { name: 'Brute Force', icon: Eye, desc: 'Password guessing attacks', color: 'text-[#00ff41]' },
            { name: 'Cookie Tampering', icon: Power, desc: 'Modify authentication cookies', color: 'text-purple-400' },
            { name: 'Response Manipulation', icon: Shield, desc: 'Change API responses', color: 'text-pink-400' },
          ].map((item) => (
            <Card key={item.name} className="bg-[#0a0a0a] border-[#333] hover:border-[#ff0000]/50 transition-all">
              <CardContent className="p-6">
                <item.icon className={`w-10 h-10 ${item.color} mb-4`} />
                <h3 className="font-orbitron text-lg text-white mb-2">{item.name}</h3>
                <p className="text-[#999] text-sm mb-4">{item.desc}</p>
                <Button 
                  onClick={() => simulateAttack(item.name)}
                  className="w-full bg-[#ff0000]/20 text-[#ff0000] border border-[#ff0000] hover:bg-[#ff0000] hover:text-white"
                >
                  Start Attack
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AuthBypassLab;
