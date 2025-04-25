"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { 
  ArrowRight, 
  Presentation, 
  Sparkles, 
  Gauge, 
  Zap, 
  Check, 
  Menu, 
  X,
  MousePointerClick,
  Brain,
  Share2,
  Palette,
  BarChart,
  Users,
  Calendar,
  Clock,
  Link2,
  Settings
} from "lucide-react";
import { v4 as uuidv4 } from 'uuid';
import { MasterRecursiveComponent } from "@/app/(protected)/presentation/[presentationId]/_components/editor/master-recursive-component";
import { ContentItem, ContentType } from "@/lib/types";

// Simple mock for demo slide
const demoSlide: ContentItem = {
  id: uuidv4(),
  type: "column" as ContentType,
  name: "Column",
  content: [
    {
      id: uuidv4(),
      type: "title" as ContentType,
      name: "Title",
      content: "Create Amazing Presentations",
      placeholder: "Title"
    },
    {
      id: uuidv4(),
      type: "heading2" as ContentType,
      name: "Heading2",
      content: "With Presentive's AI-Powered Platform",
      placeholder: "Subtitle"
    },
    {
      id: uuidv4(),
      type: "bulletList" as ContentType,
      name: "Bullet List",
      content: [
        "Generate beautiful slides in seconds",
        "Customize with intuitive editor",
        "Share with your team instantly",
        "Choose from stunning templates"
      ]
    }
  ],
  className: "space-y-4 p-6"
};

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  
  // Function to handle content changes in the demo (empty implementation)
  const handleContentChange = () => {};

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["home", "features", "demo", "pricing", "cta"];
      const currentSection = sections.find(section => {
        const element = document.getElementById(section);
        if (!element) return false;
        const rect = element.getBoundingClientRect();
        return rect.top <= 100 && rect.bottom >= 100;
      });
      
      if (currentSection) {
        setActiveSection(currentSection);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 80,
        behavior: "smooth"
      });
      setActiveSection(sectionId);
      setIsMenuOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background/95 to-background/90 text-foreground flex flex-col">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 backdrop-blur-lg bg-background/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <span className="text-presentive text-2xl font-bold">Presentive</span>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              {[
                { id: "home", label: "Home" },
                { id: "features", label: "Features" },
                { id: "demo", label: "Demo" },
                { id: "pricing", label: "Pricing" }
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    activeSection === item.id ? "text-primary" : "text-secondary-foreground"
                  }`}
                >
                  {item.label}
                </button>
              ))}
              <Button size="sm" asChild>
                <Link href="/signin">Sign In</Link>
              </Button>
            </nav>
            
            {/* Mobile Menu Button */}
            <button 
              className="md:hidden" 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-border/40 bg-background"
            >
              <div className="px-4 py-4 space-y-4">
                {[
                  { id: "home", label: "Home" },
                  { id: "features", label: "Features" },
                  { id: "demo", label: "Demo" },
                  { id: "pricing", label: "Pricing" }
                ].map(item => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`block w-full text-left px-4 py-2 text-sm font-medium rounded-lg ${
                      activeSection === item.id
                        ? "bg-primary/10 text-primary"
                        : "text-secondary-foreground hover:bg-background-80/10"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
                <div className="pt-2">
                  <Button size="sm" className="w-full" asChild>
                    <Link href="/signin">Sign In</Link>
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Hero Section */}
      <section id="home" className="flex flex-col items-center justify-center text-center px-4 pt-36 pb-24 md:pt-48 md:pb-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)]" />
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-4xl mx-auto relative z-10"
        >
          <div className="inline-block mb-6">
            <div className="flex items-center space-x-2 bg-primary/10 rounded-full py-1 px-3 text-sm font-medium text-presentive">
              <Sparkles size={16} />
              <span>AI-Powered Presentation Creator</span>
            </div>
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight bg-gradient-to-r from-presentive to-purple-400 bg-clip-text text-transparent">
            Create stunning presentations with AI
          </h1>
          <p className="mt-6 text-xl text-secondary-foreground max-w-2xl mx-auto">
            Presentive helps you build professional, beautiful presentations in minutes, 
            not hours. Powered by AI to save you time and boost your impact.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="group bg-gradient-to-r from-presentive to-purple-500 hover:opacity-90">
              <Link href="/signin">
                Get Started Free 
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" onClick={() => scrollToSection("demo")}>
              See Demo
            </Button>
          </div>
        </motion.div>
      </section>

      {/* How it Works Section */}
      <section className="py-24 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-background/50 to-background" />
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-presentive to-purple-400 bg-clip-text text-transparent">
                How it works
              </h2>
              <p className="mt-4 text-xl text-secondary-foreground max-w-2xl mx-auto">
                Create, customize, and share your presentations in three simple steps
              </p>
            </motion.div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Brain className="h-12 w-12 text-presentive" />,
                title: "Generate",
                subtitle: "AI-Powered Creation",
                description: "Enter your topic or outline and let our AI create a professional presentation instantly"
              },
              {
                icon: <Settings className="h-12 w-12 text-purple-400" />,
                title: "Customize",
                subtitle: "Easy Editing",
                description: "Fine-tune your slides with our intuitive editor and choose from beautiful themes"
              },
              {
                icon: <Share2 className="h-12 w-12 text-pink-400" />,
                title: "Share",
                subtitle: "Instant Sharing",
                description: "Share your presentation with anyone, anywhere, on any device"
              }
            ].map((step, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-background/50 p-8 rounded-xl border border-border/50 hover:border-primary/30 transition-all hover:shadow-lg hover:shadow-primary/5 backdrop-blur-sm text-center group"
              >
                <div className="mb-6 p-4 rounded-full bg-primary/5 inline-block group-hover:scale-110 transition-transform">
                  {step.icon}
                </div>
                <h3 className="text-2xl font-bold mb-2">{step.title}</h3>
                <h4 className="text-presentive mb-3">{step.subtitle}</h4>
                <p className="text-secondary-foreground">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section - Updated Grid Layout */}
      <section id="features" className="py-24 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-background/50 to-background" />
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-presentive to-purple-400 bg-clip-text text-transparent">
                Full suite of features
              </h2>
              <p className="mt-4 text-xl text-secondary-foreground max-w-2xl mx-auto">
                Everything you need to create impressive presentations
              </p>
            </motion.div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: <Brain className="h-8 w-8" />,
                title: "AI Generation",
                description: "Transform ideas into slides instantly"
              },
              {
                icon: <Palette className="h-8 w-8" />,
                title: "Beautiful Themes",
                description: "Choose from stunning templates"
              },
              {
                icon: <MousePointerClick className="h-8 w-8" />,
                title: "Easy Editing",
                description: "Intuitive drag-and-drop interface"
              },
              {
                icon: <Share2 className="h-8 w-8" />,
                title: "Quick Sharing",
                description: "Share with anyone, anywhere"
              },
              {
                icon: <Users className="h-8 w-8" />,
                title: "Collaboration",
                description: "Work together seamlessly"
              },
              {
                icon: <BarChart className="h-8 w-8" />,
                title: "Analytics",
                description: "Track presentation performance"
              }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-background/50 p-6 rounded-xl border border-border/50 hover:border-primary/30 transition-all hover:shadow-lg hover:shadow-primary/5 backdrop-blur-sm group"
              >
                <div className="mb-4 p-3 rounded-lg bg-primary/5 inline-block group-hover:scale-110 transition-transform">
                  <div className="text-presentive">{feature.icon}</div>
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-secondary-foreground text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section id="demo" className="py-24 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-background/50 to-background" />
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl md:text-5xl font-bold mb-6">See Presentive in action</h2>
              <p className="mt-4 text-xl text-secondary-foreground max-w-2xl mx-auto">
                Experience how easy it is to create professional presentations with our intuitive platform.
              </p>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative rounded-2xl overflow-hidden shadow-2xl border border-border/50 backdrop-blur-sm"
          >
            <div className="absolute top-0 left-0 right-0 h-10 bg-background/80 backdrop-blur-sm border-b border-border/50 flex items-center px-4 gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <div className="ml-4 text-xs text-secondary-foreground">Presentive - AI Presentation Creator</div>
            </div>
            
            <div className="pt-10 bg-gradient-to-br from-background/80 to-background/90 aspect-video flex items-center justify-center px-6 py-12">
              <div className="w-full max-w-2xl mx-auto bg-background/50 rounded-xl shadow-xl overflow-hidden border border-border/50 backdrop-blur-sm">
                <div className="p-8">
                  <MasterRecursiveComponent
                    content={demoSlide}
                    onContentChange={handleContentChange}
                    isPreview={true}
                    isEditable={false}
                    slideId="demo-slide"
                  />
                </div>
              </div>
            </div>
          </motion.div>
          
          <div className="mt-12 text-center">
            <Button size="lg" asChild>
              <Link href="/signin">
                Try it yourself
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-background/50 to-background" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Simple, transparent pricing</h2>
            <p className="mt-4 text-xl text-secondary-foreground max-w-2xl mx-auto mb-12">
              One plan, all features included. No hidden fees or complicated tiers.
            </p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-background/50 p-10 rounded-2xl border border-border/50 relative overflow-hidden shadow-xl backdrop-blur-sm"
          >
            <div className="absolute top-0 right-0 bg-primary/10 px-4 py-2 rounded-bl-lg text-sm font-medium">
              Most Popular
            </div>
            
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#F55C7A] to-[#F6BC66]"></div>
            
            <h3 className="text-3xl font-bold">Pro Plan</h3>
            <div className="mt-4 mb-6">
              <span className="text-5xl font-bold">$59</span>
              <span className="text-secondary-foreground ml-1">/month</span>
            </div>
            
            <ul className="space-y-4 text-left max-w-md mx-auto mb-8">
              {[
                "Unlimited presentations",
                "Full access to AI generation",
                "All premium templates",
                "Advanced customization options",
                "Team collaboration features",
                "Priority support",
                "Export to PowerPoint & PDF",
                "Custom branding options"
              ].map((feature, i) => (
                <motion.li 
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 0.1 + i * 0.05 }}
                  className="flex items-start"
                >
                  <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 shrink-0" />
                  <span>{feature}</span>
                </motion.li>
              ))}
            </ul>
            
            <Button size="lg" className="w-full text-lg py-6" asChild>
              <Link href="/signin">
                Get Started Now
              </Link>
            </Button>
            <p className="mt-4 text-sm text-secondary-foreground">No credit card required to start</p>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="cta" className="py-24 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-background/50 to-background" />
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="max-w-4xl mx-auto text-center relative z-10"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to transform your presentations?</h2>
          <p className="mt-6 text-xl text-secondary-foreground max-w-2xl mx-auto">
            Join thousands of professionals creating stunning presentations with Presentive.
          </p>
          <Button size="lg" className="mt-10 text-lg py-6 px-8" asChild>
            <Link href="/signin">
              Get Started Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-border/50">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <span className="text-presentive text-2xl font-bold">Presentive</span>
              <p className="mt-4 text-secondary-foreground">Create stunning AI-powered presentations in minutes.</p>
            </div>
            
            <div>
              <h4 className="font-medium mb-4">Product</h4>
              <ul className="space-y-2">
                {["Features", "Templates", "Pricing", "Testimonials"].map(item => (
                  <li key={item}><button onClick={() => scrollToSection("features")} className="text-secondary-foreground hover:text-primary">{item}</button></li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium mb-4">Resources</h4>
              <ul className="space-y-2">
                {["Blog", "Help Center", "Documentation", "API"].map(item => (
                  <li key={item}><Link href="#" className="text-secondary-foreground hover:text-primary">{item}</Link></li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium mb-4">Company</h4>
              <ul className="space-y-2">
                {["About", "Careers", "Contact", "Privacy Policy"].map(item => (
                  <li key={item}><Link href="#" className="text-secondary-foreground hover:text-primary">{item}</Link></li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-border/50 flex flex-col md:flex-row justify-between items-center">
            <div className="text-secondary-foreground text-sm mb-4 md:mb-0">
              © {new Date().getFullYear()} Presentive. All rights reserved.
            </div>
            <div className="flex space-x-4">
              {["Twitter", "LinkedIn", "GitHub", "YouTube"].map(item => (
                <Link href="#" key={item} className="text-secondary-foreground hover:text-primary text-sm">{item}</Link>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
