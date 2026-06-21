import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Briefcase, Eye, EyeOff, AlertCircle, ArrowLeft, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('recruiter');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const roleRoutes = {
    hr: '/hr/dashboard',
    recruiter: '/recruiter/dashboard',
    admin: '/admin/dashboard',
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Frontend-only login: accept any email/password, redirect based on selected role
    setTimeout(() => {
      window.location.href = roleRoutes[role] || '/recruiter/dashboard';
    }, 500);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary to-primary/80 relative items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30" />
        <div className="relative z-10 text-white text-center px-12">
          <Briefcase className="w-16 h-16 mx-auto mb-6 opacity-90" />
          <h2 className="text-4xl font-heading font-bold tracking-tight">Welcome Back</h2>
          <p className="mt-4 text-white/80 text-lg">Access your recruitment dashboard and manage the complete hiring workflow.</p>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-primary p-2 rounded-xl">
                <Briefcase className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-heading font-bold text-lg">RMS</span>
            </div>
            <h1 className="text-3xl font-heading font-bold tracking-tight">Sign In</h1>
            <p className="text-muted-foreground mt-2">Enter your credentials to access the dashboard</p>
          </div>

          {error && (
            <div className="bg-destructive/10 text-destructive rounded-lg p-3 mb-6 flex items-center gap-2 text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-11 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Login As</Label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: 'hr', label: 'HR' },
                  { value: 'recruiter', label: 'Recruiter' },
                  { value: 'admin', label: 'Admin' },
                ].map((r) => (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => setRole(r.value)}
                    className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg border text-sm font-medium transition-all ${
                      role === r.value
                        ? 'border-primary bg-primary/10 text-primary shadow-sm'
                        : 'border-border hover:border-primary/40 hover:bg-muted/50 text-muted-foreground'
                    }`}
                  >
                    <Users className="w-3.5 h-3.5" />
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            <Button type="submit" className="w-full h-11 font-semibold" disabled={loading}>
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                'Sign In'
              )}
            </Button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => {
                  toast.info('Password reset link sent to your email (demo mode)');
                }}
                className="text-sm text-primary hover:underline"
              >
                Forgot your password?
              </button>
            </div>
          </form>

          <div className="mt-8 p-4 bg-muted rounded-lg text-sm text-muted-foreground">
            <p className="font-medium text-foreground">Frontend-Only Login</p>
            <p className="mt-1">Enter any email and password to sign in. No backend connection required.</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}