import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Shield,
  Terminal,
  Target,
  TrendingUp,
  Award,
  Lock,
  Unlock,
  AlertTriangle,
  CheckCircle,
  Clock,
  Zap,
  Bug,
  Activity,
  Cpu,
  Globe,
  Database,
  FileCode,
  Eye,
} from 'lucide-react';

interface LabProgress {
  id: string;
  name: string;
  category: string;
  progress: number;
  completed: boolean;
  lastAccessed: string;
  difficulty: string;
}

interface SecurityEvent {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  message: string;
  timestamp: string;
  lab?: string;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  unlocked: boolean;
  unlockedAt?: string;
}

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  // Simulated user stats
  const userStats = {
    totalLabs: 32,
    completedLabs: 18,
    inProgressLabs: 7,
    totalAttempts: 156,
    successfulExploits: 89,
    failedAttempts: 67,
    currentStreak: 12,
    longestStreak: 28,
    rank: 'Elite Hacker',
    points: 8750,
    nextRank: 10000,
  };

  // Simulated lab progress
  const labProgress: LabProgress[] = [
    { id: '1', name: 'XSS Injection Lab', category: 'Web Application', progress: 100, completed: true, lastAccessed: '2 hours ago', difficulty: 'Beginner' },
    { id: '2', name: 'SQL Injection Mastery', category: 'Web Application', progress: 85, completed: false, lastAccessed: '1 day ago', difficulty: 'Beginner' },
    { id: '3', name: 'LFI & RFI Exploitation', category: 'Web Application', progress: 60, completed: false, lastAccessed: '3 days ago', difficulty: 'Intermediate' },
    { id: '4', name: 'Command Injection', category: 'Web Application', progress: 100, completed: true, lastAccessed: '5 days ago', difficulty: 'Intermediate' },
    { id: '5', name: 'SSRF Exploitation', category: 'Web Application', progress: 30, completed: false, lastAccessed: '1 week ago', difficulty: 'Advanced' },
    { id: '6', name: 'JWT Security', category: 'Authentication', progress: 100, completed: true, lastAccessed: '2 weeks ago', difficulty: 'Advanced' },
  ];

  // Simulated security events
  const securityEvents: SecurityEvent[] = [
    { id: '1', type: 'success', message: 'Successfully exploited XSS vulnerability in Lab #3', timestamp: '2 hours ago', lab: 'XSS Injection Lab' },
    { id: '2', type: 'info', message: 'Started new lab: SQL Injection Mastery', timestamp: '1 day ago', lab: 'SQL Injection' },
    { id: '3', type: 'warning', message: 'Multiple failed attempts on SSRF Lab', timestamp: '3 days ago', lab: 'SSRF' },
    { id: '4', type: 'success', message: 'Completed Command Injection Lab', timestamp: '5 days ago', lab: 'Command Injection' },
    { id: '5', type: 'error', message: 'WAF blocked payload in WAF Bypass Lab', timestamp: '1 week ago', lab: 'WAF Bypass' },
    { id: '6', type: 'success', message: 'Unlocked achievement: First Blood', timestamp: '2 weeks ago' },
  ];

  // Simulated achievements
  const achievements: Achievement[] = [
    { id: '1', name: 'First Blood', description: 'Complete your first lab', icon: Target, unlocked: true, unlockedAt: '2 weeks ago' },
    { id: '2', name: 'Web Warrior', description: 'Complete 10 Web Application labs', icon: Globe, unlocked: true, unlockedAt: '1 week ago' },
    { id: '3', name: 'SQL Master', description: 'Master all SQL injection techniques', icon: Database, unlocked: true, unlockedAt: '5 days ago' },
    { id: '4', name: 'Streak Keeper', description: 'Maintain a 7-day learning streak', icon: Zap, unlocked: true, unlockedAt: '3 days ago' },
    { id: '5', name: '0day Hunter', description: 'Complete the 0day Research Lab', icon: Bug, unlocked: false },
    { id: '6', name: 'Elite Hacker', description: 'Reach Elite Hacker rank', icon: Award, unlocked: false },
    { id: '7', name: 'WAF Slayer', description: 'Successfully bypass all WAF protections', icon: Shield, unlocked: false },
    { id: '8', name: 'Code Breaker', description: 'Complete all cryptography labs', icon: FileCode, unlocked: false },
  ];

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-[#00ff41]" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-[#ffaa00]" />;
      case 'error':
        return <AlertTriangle className="w-5 h-5 text-[#ff0040]" />;
      default:
        return <Activity className="w-5 h-5 text-[#00aaff]" />;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner':
        return 'text-[#00ff41] bg-[#00ff41]/10';
      case 'Intermediate':
        return 'text-[#ffaa00] bg-[#ffaa00]/10';
      case 'Advanced':
        return 'text-[#ff0040] bg-[#ff0040]/10';
      default:
        return 'text-[#999] bg-[#333]';
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-orbitron text-4xl text-white mb-2">
            Security <span className="text-[#ff0000]">Dashboard</span>
          </h1>
          <p className="text-[#999]">Monitor your progress and security testing activities</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-[#0a0a0a] border-[#333]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#999] text-sm">Labs Completed</p>
                  <p className="font-orbitron text-3xl text-[#00ff41]">
                    {userStats.completedLabs}/{userStats.totalLabs}
                  </p>
                </div>
                <CheckCircle className="w-10 h-10 text-[#00ff41]/30" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#0a0a0a] border-[#333]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#999] text-sm">Success Rate</p>
                  <p className="font-orbitron text-3xl text-[#ffaa00]">
                    {Math.round((userStats.successfulExploits / userStats.totalAttempts) * 100)}%
                  </p>
                </div>
                <TrendingUp className="w-10 h-10 text-[#ffaa00]/30" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#0a0a0a] border-[#333]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#999] text-sm">Current Streak</p>
                  <p className="font-orbitron text-3xl text-[#ff0000]">
                    {userStats.currentStreak} days
                  </p>
                </div>
                <Zap className="w-10 h-10 text-[#ff0000]/30" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#0a0a0a] border-[#333]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#999] text-sm">Total Points</p>
                  <p className="font-orbitron text-3xl text-[#00aaff]">
                    {userStats.points.toLocaleString()}
                  </p>
                </div>
                <Award className="w-10 h-10 text-[#00aaff]/30" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Rank Progress */}
        <Card className="bg-[#0a0a0a] border-[#333] mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-[#999] text-sm">Current Rank</p>
                <p className="font-orbitron text-2xl text-white">{userStats.rank}</p>
              </div>
              <div className="text-right">
                <p className="text-[#999] text-sm">Next Rank</p>
                <p className="font-orbitron text-xl text-[#ff0000]">Master Hacker</p>
              </div>
            </div>
            <div className="relative">
              <Progress
                value={(userStats.points / userStats.nextRank) * 100}
                className="h-3 bg-[#1a1a1a]"
              />
              <div className="absolute top-4 left-0 text-[#999] text-xs">
                {userStats.points.toLocaleString()} XP
              </div>
              <div className="absolute top-4 right-0 text-[#999] text-xs">
                {userStats.nextRank.toLocaleString()} XP
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-[#0a0a0a] border border-[#333]">
            <TabsTrigger value="overview" className="data-[state=active]:bg-[#ff0000] data-[state=active]:text-white">
              <Activity className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="labs" className="data-[state=active]:bg-[#ff0000] data-[state=active]:text-white">
              <Terminal className="w-4 h-4 mr-2" />
              My Labs
            </TabsTrigger>
            <TabsTrigger value="achievements" className="data-[state=active]:bg-[#ff0000] data-[state=active]:text-white">
              <Award className="w-4 h-4 mr-2" />
              Achievements
            </TabsTrigger>
            <TabsTrigger value="activity" className="data-[state=active]:bg-[#ff0000] data-[state=active]:text-white">
              <Eye className="w-4 h-4 mr-2" />
              Activity Log
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Quick Stats */}
              <Card className="bg-[#0a0a0a] border-[#333]">
                <CardHeader>
                  <CardTitle className="font-orbitron text-lg text-white flex items-center gap-2">
                    <Cpu className="w-5 h-5 text-[#ff0000]" />
                    Performance Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[#999]">Total Attempts</span>
                    <span className="font-mono text-white">{userStats.totalAttempts}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#999]">Successful Exploits</span>
                    <span className="font-mono text-[#00ff41]">{userStats.successfulExploits}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#999]">Failed Attempts</span>
                    <span className="font-mono text-[#ff0040]">{userStats.failedAttempts}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#999]">Labs In Progress</span>
                    <span className="font-mono text-[#ffaa00]">{userStats.inProgressLabs}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#999]">Longest Streak</span>
                    <span className="font-mono text-white">{userStats.longestStreak} days</span>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="bg-[#0a0a0a] border-[#333]">
                <CardHeader>
                  <CardTitle className="font-orbitron text-lg text-white flex items-center gap-2">
                    <Clock className="w-5 h-5 text-[#ff0000]" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {securityEvents.slice(0, 4).map((event) => (
                      <div key={event.id} className="flex items-start gap-3 p-3 bg-[#1a1a1a] rounded-lg">
                        {getEventIcon(event.type)}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-white truncate">{event.message}</p>
                          <p className="text-xs text-[#666]">{event.timestamp}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Category Progress */}
            <Card className="bg-[#0a0a0a] border-[#333]">
              <CardHeader>
                <CardTitle className="font-orbitron text-lg text-white flex items-center gap-2">
                  <Target className="w-5 h-5 text-[#ff0000]" />
                  Category Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  {[
                    { name: 'Web Application', completed: 12, total: 18, color: 'bg-[#ff0000]' },
                    { name: 'Network Security', completed: 4, total: 8, color: 'bg-[#00aaff]' },
                    { name: 'Advanced Techniques', completed: 2, total: 6, color: 'bg-[#ffaa00]' },
                  ].map((category) => (
                    <div key={category.name} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-white">{category.name}</span>
                        <span className="text-[#999]">
                          {category.completed}/{category.total}
                        </span>
                      </div>
                      <div className="h-2 bg-[#1a1a1a] rounded-full overflow-hidden">
                        <div
                          className={`h-full ${category.color} transition-all duration-500`}
                          style={{ width: `${(category.completed / category.total) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Labs Tab */}
          <TabsContent value="labs">
            <Card className="bg-[#0a0a0a] border-[#333]">
              <CardHeader>
                <CardTitle className="font-orbitron text-lg text-white">Lab Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {labProgress.map((lab) => (
                    <div
                      key={lab.id}
                      className="flex items-center gap-4 p-4 bg-[#1a1a1a] rounded-lg hover:bg-[#222] transition-colors"
                    >
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getDifficultyColor(lab.difficulty)}`}>
                        {lab.completed ? (
                          <Unlock className="w-5 h-5" />
                        ) : (
                          <Lock className="w-5 h-5" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-white font-medium">{lab.name}</span>
                          <Badge variant="outline" className={`text-xs ${getDifficultyColor(lab.difficulty)}`}>
                            {lab.difficulty}
                          </Badge>
                          {lab.completed && (
                            <Badge className="bg-[#00ff41]/20 text-[#00ff41] text-xs">
                              Completed
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-4 mt-1">
                          <span className="text-[#666] text-sm">{lab.category}</span>
                          <span className="text-[#666] text-sm">Last: {lab.lastAccessed}</span>
                        </div>
                      </div>
                      <div className="w-32">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-[#999]">Progress</span>
                          <span className="text-white">{lab.progress}%</span>
                        </div>
                        <div className="h-2 bg-[#0a0a0a] rounded-full overflow-hidden">
                          <div
                            className={`h-full ${lab.completed ? 'bg-[#00ff41]' : 'bg-[#ff0000]'} transition-all duration-500`}
                            style={{ width: `${lab.progress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Achievements Tab */}
          <TabsContent value="achievements">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {achievements.map((achievement) => (
                <Card
                  key={achievement.id}
                  className={`bg-[#0a0a0a] border-[#333] ${
                    achievement.unlocked ? '' : 'opacity-50'
                  }`}
                >
                  <CardContent className="p-6 text-center">
                    <div
                      className={`w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center ${
                        achievement.unlocked
                          ? 'bg-[#ff0000]/20 text-[#ff0000]'
                          : 'bg-[#1a1a1a] text-[#666]'
                      }`}
                    >
                      <achievement.icon className="w-8 h-8" />
                    </div>
                    <h3 className="font-orbitron text-white mb-2">{achievement.name}</h3>
                    <p className="text-[#999] text-sm mb-3">{achievement.description}</p>
                    {achievement.unlocked ? (
                      <Badge className="bg-[#00ff41]/20 text-[#00ff41]">
                        Unlocked {achievement.unlockedAt}
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-[#666] border-[#333]">
                        Locked
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Activity Log Tab */}
          <TabsContent value="activity">
            <Card className="bg-[#0a0a0a] border-[#333]">
              <CardHeader>
                <CardTitle className="font-orbitron text-lg text-white">Security Event Log</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {securityEvents.map((event) => (
                    <div
                      key={event.id}
                      className="flex items-start gap-4 p-4 bg-[#1a1a1a] rounded-lg"
                    >
                      <div className="mt-1">{getEventIcon(event.type)}</div>
                      <div className="flex-1">
                        <p className="text-white">{event.message}</p>
                        {event.lab && (
                          <p className="text-sm text-[#ff0000] mt-1">Lab: {event.lab}</p>
                        )}
                      </div>
                      <div className="text-[#666] text-sm whitespace-nowrap">{event.timestamp}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
