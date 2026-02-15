import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Mail, MapPin, Phone, Send } from 'lucide-react';
import { toast } from 'sonner';

const Contact = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Message sent! We will get back to you soon.');
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-[#ff0000]/20 text-[#ff0000] border-[#ff0000]">
            Contact
          </Badge>
          <h1 className="font-orbitron text-4xl sm:text-5xl text-white mb-6">
            Get in <span className="text-[#ff0000]">Touch</span>
          </h1>
          <p className="text-[#999] text-lg max-w-2xl mx-auto">
            Have questions or feedback? We&apos;d love to hear from you. 
            Reach out to our team and we&apos;ll get back to you as soon as possible.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="bg-[#0a0a0a] border-[#333]">
              <CardContent className="p-6">
                <Mail className="w-8 h-8 text-[#ff0000] mb-4" />
                <h3 className="font-orbitron text-lg text-white mb-2">Email</h3>
                <p className="text-[#999]">support@vulnlab.com</p>
                <p className="text-[#999]">sales@vulnlab.com</p>
              </CardContent>
            </Card>

            <Card className="bg-[#0a0a0a] border-[#333]">
              <CardContent className="p-6">
                <Phone className="w-8 h-8 text-[#ff0000] mb-4" />
                <h3 className="font-orbitron text-lg text-white mb-2">Phone</h3>
                <p className="text-[#999]">+1 (555) 123-4567</p>
                <p className="text-[#999]">Mon-Fri 9am-6pm EST</p>
              </CardContent>
            </Card>

            <Card className="bg-[#0a0a0a] border-[#333]">
              <CardContent className="p-6">
                <MapPin className="w-8 h-8 text-[#ff0000] mb-4" />
                <h3 className="font-orbitron text-lg text-white mb-2">Address</h3>
                <p className="text-[#999]">123 Cyber Street</p>
                <p className="text-[#999]">San Francisco, CA 94105</p>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="bg-[#0a0a0a] border-[#333]">
              <CardHeader>
                <CardTitle className="font-orbitron text-xl text-white">Send us a Message</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-[#999] text-sm mb-2 block">Name</label>
                      <Input
                        placeholder="Your name"
                        className="bg-[#1a1a1a] border-[#333] text-white placeholder:text-[#666]"
                      />
                    </div>
                    <div>
                      <label className="text-[#999] text-sm mb-2 block">Email</label>
                      <Input
                        type="email"
                        placeholder="your@email.com"
                        className="bg-[#1a1a1a] border-[#333] text-white placeholder:text-[#666]"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[#999] text-sm mb-2 block">Subject</label>
                    <Input
                      placeholder="How can we help?"
                      className="bg-[#1a1a1a] border-[#333] text-white placeholder:text-[#666]"
                    />
                  </div>
                  <div>
                    <label className="text-[#999] text-sm mb-2 block">Message</label>
                    <Textarea
                      placeholder="Your message..."
                      rows={6}
                      className="bg-[#1a1a1a] border-[#333] text-white placeholder:text-[#666]"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="bg-[#ff0000] hover:bg-[#cc0000] text-white font-orbitron"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
