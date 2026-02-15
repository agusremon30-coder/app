import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, FlaskConical, Clock, Shield, AlertTriangle, CheckCircle } from 'lucide-react';

const LabDetail = () => {
  const { labId } = useParams<{ labId: string }>();

  // This would normally fetch lab details from an API
  const labData = {
    id: labId,
    title: labId?.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') || 'Lab',
    description: 'This is a comprehensive lab for learning and practicing security vulnerabilities.',
    difficulty: 'Intermediate',
    duration: '45 minutes',
    category: 'Web Application',
    objectives: [
      'Understand the vulnerability mechanism',
      'Learn various exploitation techniques',
      'Practice bypass methods',
      'Understand mitigation strategies',
    ],
    prerequisites: [
      'Basic understanding of web technologies',
      'Familiarity with HTTP protocol',
      'Basic knowledge of JavaScript',
    ],
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link to="/labs">
            <Button variant="outline" size="sm" className="mb-4 border-[#333] text-white hover:border-[#ff0000]">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Labs
            </Button>
          </Link>
          <h1 className="font-orbitron text-4xl text-white mb-4">{labData.title}</h1>
          <div className="flex flex-wrap gap-2">
            <Badge className="bg-[#ff0000]/20 text-[#ff0000] border-[#ff0000]">
              {labData.category}
            </Badge>
            <Badge className="bg-[#ffaa00]/20 text-[#ffaa00] border-[#ffaa00]">
              {labData.difficulty}
            </Badge>
            <Badge variant="outline" className="text-[#999] border-[#333]">
              <Clock className="w-3 h-3 mr-1" />
              {labData.duration}
            </Badge>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-[#0a0a0a] border-[#333]">
              <CardHeader>
                <CardTitle className="font-orbitron text-xl text-white">Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-[#e0e0e0]">{labData.description}</p>
              </CardContent>
            </Card>

            <Card className="bg-[#0a0a0a] border-[#333]">
              <CardHeader>
                <CardTitle className="font-orbitron text-xl text-white flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-[#00ff41]" />
                  Learning Objectives
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {labData.objectives.map((objective, index) => (
                    <li key={index} className="flex items-start gap-3 text-[#e0e0e0]">
                      <div className="w-6 h-6 rounded-full bg-[#00ff41]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-[#00ff41] text-xs">{index + 1}</span>
                      </div>
                      {objective}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-[#0a0a0a] border-[#333]">
              <CardHeader>
                <CardTitle className="font-orbitron text-xl text-white flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-[#ffaa00]" />
                  Prerequisites
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {labData.prerequisites.map((prereq, index) => (
                    <li key={index} className="flex items-start gap-3 text-[#e0e0e0]">
                      <div className="w-6 h-6 rounded-full bg-[#ffaa00]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-[#ffaa00] text-xs">{index + 1}</span>
                      </div>
                      {prereq}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="bg-[#0a0a0a] border-[#333] sticky top-24">
              <CardHeader>
                <CardTitle className="font-orbitron text-lg text-white flex items-center gap-2">
                  <FlaskConical className="w-5 h-5 text-[#ff0000]" />
                  Start Lab
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-[#999] text-sm">
                  Ready to start practicing? Click the button below to launch the lab environment.
                </div>
                <Link to={`/labs/${labId}`}>
                  <Button className="w-full bg-[#ff0000] hover:bg-[#cc0000] text-white font-orbitron">
                    Launch Lab
                  </Button>
                </Link>
                <div className="pt-4 border-t border-[#333]">
                  <div className="flex items-center gap-2 text-[#999] text-sm">
                    <Shield className="w-4 h-4" />
                    <span>Isolated environment</span>
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

export default LabDetail;
