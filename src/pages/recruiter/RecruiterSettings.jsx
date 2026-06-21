import React, { useState, useEffect } from 'react';
import PageHeader from '@/components/shared/PageHeader';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { User, Lock } from 'lucide-react';

export default function RecruiterSettings() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    setUser({ id: 'recruiter-1', full_name: 'Jane Smith', email: 'recruiter@demo.com', role: 'recruiter', department: 'Talent Acquisition' });
  }, []);

  return (
    <div>
      <PageHeader title="Settings" subtitle="Your profile information" />

      <div className="grid gap-6 max-w-2xl">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-heading flex items-center gap-2">
              <User className="w-4 h-4" />
              Profile Information
            </CardTitle>
            <CardDescription>Your details are managed by HR</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input value={user?.full_name || ''} disabled className="bg-muted/50" />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input value={user?.email || ''} disabled className="bg-muted/50" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Department</Label>
                <Input value={user?.department || '—'} disabled className="bg-muted/50" />
              </div>
              <div className="space-y-2">
                <Label>Role</Label>
                <Input value="Recruiter" disabled className="bg-muted/50" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-heading flex items-center gap-2">
              <Lock className="w-4 h-4" />
              Change Password
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Use the forgot password flow from the login page to reset your password.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}