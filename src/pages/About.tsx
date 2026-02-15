import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Lock, Code, Users, Target, Award } from 'lucide-react';

const About = () => {
  const features = [
    {
      icon: Shield,
      title: 'Hands-On Learning',
      description: 'Practice in real-world scenarios with our isolated lab environments.',
    },
    {
      icon: Lock,
      title: 'Safe Environment',
      description: 'All labs run in isolated containers, ensuring complete safety.',
    },
    {
      icon: Code,
      title: 'Real Vulnerabilities',
      description: 'Learn from actual CVEs and real-world vulnerability patterns.',
    },
    {
      icon: Users,
      title: 'Community Driven',
      description: 'Join a thriving community of security enthusiasts and professionals.',
    },
    {
      icon: Target,
      title: 'Skill Progression',
      description: 'Structured learning path from beginner to expert level.',
    },
    {
      icon: Award,
      title: 'Certifications',
      description: 'Earn certificates to showcase your skills to employers.',
    },
  ];

  const stats = [
    { value: '50+', label: 'Hands-on Labs' },
    { value: '10K+', label: 'Active Learners' },
    { value: '95%', label: 'Success Rate' },
    { value: '24/7', label: 'Lab Access' },
  ];

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-[#ff0000]/20 text-[#ff0000] border-[#ff0000]">
            About Us
          </Badge>
          <h1 className="font-orbitron text-4xl sm:text-5xl text-white mb-6">
            Empowering the Next Generation of{' '}
            <span className="text-[#ff0000]">Cybersecurity Experts</span>
          </h1>
          <p className="text-[#999] text-lg max-w-3xl mx-auto">
            VulnLab is a cutting-edge platform designed to help security enthusiasts, 
            developers, and professionals master the art of ethical hacking through 
            hands-on practice in a safe and legal environment.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <Card key={index} className="bg-[#0a0a0a] border-[#333] text-center">
              <CardContent className="p-6">
                <div className="font-orbitron text-3xl text-[#ff0000] mb-2">{stat.value}</div>
                <div className="text-[#999] text-sm">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Features */}
        <div className="mb-16">
          <h2 className="font-orbitron text-3xl text-white text-center mb-12">
            Why Choose <span className="text-[#ff0000]">VulnLab</span>?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="bg-[#0a0a0a] border-[#333]">
                <CardContent className="p-6">
                  <feature.icon className="w-10 h-10 text-[#ff0000] mb-4" />
                  <h3 className="font-orbitron text-lg text-white mb-2">{feature.title}</h3>
                  <p className="text-[#999]">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Mission */}
        <Card className="bg-[#0a0a0a] border-[#333] mb-16">
          <CardHeader>
            <CardTitle className="font-orbitron text-2xl text-white">Our Mission</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-[#e0e0e0]">
            <p>
              At VulnLab, we believe that the best way to learn cybersecurity is by doing. 
              Our platform provides a safe, legal environment where you can practice exploiting 
              real vulnerabilities without any risk.
            </p>
            <p>
              We are committed to making cybersecurity education accessible to everyone. 
              Whether you&apos;re a beginner looking to start your journey or an experienced 
              professional seeking to sharpen your skills, VulnLab has something for you.
            </p>
            <p>
              Our labs are designed by industry experts and cover a wide range of vulnerabilities, 
              from common web application flaws to advanced network security issues. Each lab 
              includes detailed explanations, hints, and solutions to ensure you learn effectively.
            </p>
          </CardContent>
        </Card>

        {/* Team */}
        <div className="text-center">
          <h2 className="font-orbitron text-3xl text-white mb-8">
            Meet Our <span className="text-[#ff0000]">Team</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: 'Alex Chen', role: 'Founder & CEO', initials: 'AC' },
              { name: 'Sarah Miller', role: 'Head of Security', initials: 'SM' },
              { name: 'David Park', role: 'Lead Developer', initials: 'DP' },
            ].map((member, index) => (
              <div key={index} className="text-center">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#ff0000] to-[#cc0000] flex items-center justify-center text-white font-orbitron text-2xl mx-auto mb-4">
                  {member.initials}
                </div>
                <h3 className="font-orbitron text-lg text-white">{member.name}</h3>
                <p className="text-[#999]">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
