import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Briefcase, ArrowRight, Users, Calendar, BarChart3, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

function FloatingCard({ className, icon: Icon, label, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.8 }}
      className={className}
    >
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-4 flex items-center gap-3 animate-float" style={{ animationDelay: `${delay}s` }}>
        <div className="bg-primary/10 p-2.5 rounded-xl">
          <Icon className="w-5 h-5 text-primary" />
        </div>
        <span className="text-sm font-medium text-foreground/80">{label}</span>
      </div>
    </motion.div>
  );
}

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-background relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/3 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
      </div>

      {/* Floating cards */}
      <FloatingCard className="absolute top-32 right-[15%] hidden lg:block" icon={Users} label="24 New Candidates" delay={0.5} />
      <FloatingCard className="absolute top-48 left-[10%] hidden lg:block" icon={Calendar} label="5 Interviews Today" delay={0.8} />
      <FloatingCard className="absolute bottom-40 right-[20%] hidden lg:block" icon={BarChart3} label="87% Hire Rate" delay={1.1} />
      <FloatingCard className="absolute bottom-32 left-[15%] hidden lg:block" icon={Shield} label="Admin Monitoring" delay={1.4} />

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-6 lg:px-12 py-5">
        <div className="flex items-center gap-3">
          <div className="bg-primary p-2 rounded-xl">
            <Briefcase className="w-6 h-6 text-primary-foreground" />
          </div>
          <span className="font-heading font-bold text-xl tracking-tight">RMS</span>
        </div>
        <Link to="/login">
          <Button variant="outline" className="rounded-full px-6 font-medium">
            Login
          </Button>
        </Link>
      </nav>

      {/* Hero */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl"
        >
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-sm font-medium px-4 py-1.5 rounded-full mb-8">
            <Briefcase className="w-4 h-4" />
            Streamline Your Hiring Process
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-heading font-extrabold tracking-tight leading-[1.1]">
            Recruitment{' '}
            <span className="text-primary">Management</span>{' '}
            System
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Simplify and automate your entire hiring workflow — from candidate tracking to offer letters, all in one place.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/login">
              <Button size="lg" className="rounded-full px-8 text-base font-semibold h-12 shadow-lg shadow-primary/25">
                Get Started
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Features strip */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl w-full"
        >
          {[
            { icon: Users, title: "Candidate Management", desc: "Track and manage all applicants" },
            { icon: Calendar, title: "Interview Scheduling", desc: "Effortless interview coordination" },
            { icon: BarChart3, title: "Analytics & Reports", desc: "Real-time recruitment insights" },
          ].map((feat, i) => (
            <div key={i} className="bg-card/80 backdrop-blur-sm rounded-xl border border-border/50 p-5 text-center shadow-sm">
              <div className="inline-flex p-3 rounded-xl bg-primary/10 mb-3">
                <feat.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-heading font-semibold text-sm">{feat.title}</h3>
              <p className="text-xs text-muted-foreground mt-1">{feat.desc}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}