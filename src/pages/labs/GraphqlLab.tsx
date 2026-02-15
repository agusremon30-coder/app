import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Network, Bug, Shield, Lock, Eye, Code } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

const GraphqlLab = () => {
  const simulateAttack = (type: string) => {
    toast.info(`Testing ${type}...`);
    setTimeout(() => {
      toast.success(`GraphQL vulnerability found!`);
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
            <Badge className="bg-[#ff0040]/20 text-[#ff0040] border-[#ff0040]">
              Advanced
            </Badge>
          </div>
          <h1 className="font-orbitron text-3xl sm:text-4xl text-white mb-2">
            GraphQL <span className="text-[#ff0000]">Security</span>
          </h1>
          <p className="text-[#999] max-w-2xl">
            Exploit GraphQL APIs through introspection, injection, and query manipulation.
            Learn to secure GraphQL endpoints effectively.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { name: 'Introspection', icon: Eye, desc: 'Query schema information' },
            { name: 'Query Injection', icon: Code, desc: 'Inject malicious queries' },
            { name: 'Depth Attack', icon: Network, desc: 'Exploit nested query depth' },
            { name: 'Field Duplication', icon: Bug, desc: 'Abuse query complexity' },
            { name: 'Authorization', icon: Lock, desc: 'Bypass field-level auth' },
            { name: 'Batch Attacks', icon: Shield, desc: 'Exploit query batching' },
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
                  Test
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GraphqlLab;
