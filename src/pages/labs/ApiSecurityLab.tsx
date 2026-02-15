import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Server, Bug, Shield, Lock, Key, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

const ApiSecurityLab = () => {
  const simulateAttack = (type: string) => {
    toast.info(`Testing ${type}...`);
    setTimeout(() => {
      toast.success(`API vulnerability discovered!`);
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
            API Security <span className="text-[#ff0000]">Testing</span>
          </h1>
          <p className="text-[#999] max-w-2xl">
            Comprehensive API penetration testing with authentication and authorization bypasses.
            Test REST and SOAP APIs for security vulnerabilities.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { name: 'Authentication', icon: Lock, desc: 'Test API authentication mechanisms' },
            { name: 'Authorization', icon: Key, desc: 'Bypass API authorization checks' },
            { name: 'Rate Limiting', icon: Shield, desc: 'Bypass rate limiting controls' },
            { name: 'Input Validation', icon: Bug, desc: 'Test API input validation' },
            { name: 'Version Testing', icon: Server, desc: 'Test deprecated API versions' },
            { name: 'CORS Misconfig', icon: Globe, desc: 'Exploit CORS misconfigurations' },
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
                  Test API
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ApiSecurityLab;
