import React, { useState, useEffect } from 'react';
import PageHeader from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Lock, Mail, Eye } from 'lucide-react';
import { toast } from 'sonner';
import api from "@/api/api";

export default function HRSettings() {
  const [user, setUser] = useState(null);
  const [profileForm, setProfileForm] = useState({ full_name: '', phone: '', department: '' });
  const [emailAutoEnabled, setEmailAutoEnabled] = useState(true);
  const [candidateEmailTemplate, setCandidateEmailTemplate] = useState(
    'Dear {candidate_name},\n\nYou have been scheduled for an interview for the position of {position} on {date} at {time}.\n\nPlease confirm your availability.\n\nBest regards,\nHR Team'
  );
  const [recruiterEmailTemplate, setRecruiterEmailTemplate] = useState(
    'Dear {recruiter_name},\n\nYou have been assigned to interview {candidate_name} for the position of {position} on {date} at {time}.\n\nPlease prepare accordingly.\n\nBest regards,\nHR Team'
  );
  const [offerLetterTemplate, setOfferLetterTemplate] = useState(
    'Dear {candidate_name},\n\nCongratulations! We are delighted to offer you the position of {position} at our organization.\n\nOffered Package: {salary}\nExpected Joining Date: {joining_date}\n\nPlease review the attached offer letter and confirm your acceptance within 5 business days.\n\nWe look forward to welcoming you to the team!\n\nWarm regards,\nHR Team'
  );
  const [rejectionTemplate, setRejectionTemplate] = useState(
    'Dear {candidate_name},\n\nThank you for applying for the position of {position} and taking the time to interview with us.\n\nAfter careful consideration, we regret to inform you that we will not be moving forward with your application at this time. This was a difficult decision as we received many strong applications.\n\nWe appreciate your interest in our organization and wish you all the best in your future endeavors.\n\nKind regards,\nHR Team'
  );
  const [previewTemplate, setPreviewTemplate] = useState(null);

 useEffect(() => {

  const loadSettings = async () => {

    // Demo user (temporary)
    const demoUser = {
      id: "hr-1",
      full_name: "HR Admin",
      email: "hr@demo.com",
      role: "hr"
    };

    setUser(demoUser);

    setProfileForm({
      full_name: demoUser.full_name,
      phone: "",
      department: "Human Resources"
    });

    try {

      // Load automation switch
      const automationResponse = await api.get(
        "/settings/email/automation"
      );

      setEmailAutoEnabled(
        automationResponse.data.emailAutomationEnabled
      );

      // Load email templates
      const templatesResponse = await api.get(
        "/settings/email/templates"
      );

     const templates = templatesResponse.data;

console.log("Templates:", templates);

templates.forEach((template) => {

  switch (template.templateKey) {

    case "INTERVIEW_INVITATION":
      setCandidateEmailTemplate(template.body);
      break;

    case "ASSIGNMENT_NOTIFICATION":
      setRecruiterEmailTemplate(template.body);
      break;

    case "OFFER_LETTER":
      setOfferLetterTemplate(template.body);
      break;

    case "REJECTION_MAIL":
      setRejectionTemplate(template.body);
      break;

    default:
      break;
  }

});

    } catch (error) {

      console.error(error);

      toast.error("Failed to load email settings");

    }

  };

  loadSettings();

}, []);

  const handleProfileSave = () => {
    toast.success('Profile updated');
  };
const saveTemplate = async (templateKey, subject, body) => {

  try {

    await api.put(
      `/settings/email/templates/${templateKey}`,
      {
        subject,
        body
      }
    );

    toast.success("Template saved successfully");

  } catch (error) {

    console.error(error);

    toast.error("Failed to save template");

  }

};

  return (
    <div>
      <PageHeader title="Settings" subtitle="Manage your profile and email preferences" />

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="bg-muted">
          <TabsTrigger value="profile" className="gap-2"><User className="w-4 h-4" />Profile</TabsTrigger>
          <TabsTrigger value="email" className="gap-2"><Mail className="w-4 h-4" />Email Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <div className="grid gap-6 max-w-2xl">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-base font-heading">Profile Information</CardTitle>
                <CardDescription>Update your personal details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2"><Label>Full Name</Label><Input value={profileForm.full_name} disabled className="bg-muted/50" /></div>
                  <div className="space-y-2"><Label>Email</Label><Input value={user?.email || ''} disabled className="bg-muted/50" /></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2"><Label>Phone</Label><Input value={profileForm.phone} onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })} /></div>
                  <div className="space-y-2"><Label>Department</Label><Input value={profileForm.department} onChange={(e) => setProfileForm({ ...profileForm, department: e.target.value })} /></div>
                </div>
                <Button onClick={handleProfileSave}>Save Changes</Button>
              </CardContent>
            </Card>
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-base font-heading flex items-center gap-2"><Lock className="w-4 h-4" /> Change Password</CardTitle>
              </CardHeader>
              <CardContent><p className="text-sm text-muted-foreground">Use the forgot password flow from the login page to reset your password.</p></CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="email">
          <div className="grid gap-6 max-w-2xl">
            <Card className="shadow-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div><CardTitle className="text-base font-heading">Email Automation</CardTitle><CardDescription>Toggle automated email notifications</CardDescription></div>
                  <Switch checked={emailAutoEnabled} onCheckedChange={setEmailAutoEnabled} />
                </div>
              </CardHeader>
            </Card>
            <Card className="shadow-sm">
              <CardHeader><CardTitle className="text-base font-heading">Interview Invitation (to Candidate)</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <Textarea value={candidateEmailTemplate} onChange={(e) => setCandidateEmailTemplate(e.target.value)} rows={6} className="font-mono text-sm" />
                <div className="flex gap-3">
                  <Button variant="outline" size="sm" className="gap-1" onClick={() => setPreviewTemplate(candidateEmailTemplate)}><Eye className="w-3 h-3" /> Preview</Button>
                  <Button  size="sm" onClick={() => saveTemplate(
                  "INTERVIEW_INVITATION",
                  "Interview Invitation",
                   candidateEmailTemplate)}>
                   Save Template
                  </Button>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-sm">
              <CardHeader><CardTitle className="text-base font-heading">Assignment Notification (to Recruiter)</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <Textarea value={recruiterEmailTemplate} onChange={(e) => setRecruiterEmailTemplate(e.target.value)} rows={6} className="font-mono text-sm" />
                <div className="flex gap-3">
                  <Button variant="outline" size="sm" className="gap-1" onClick={() => setPreviewTemplate(recruiterEmailTemplate)}><Eye className="w-3 h-3" /> Preview</Button>
                  <Button
  size="sm"
  onClick={() =>
    saveTemplate(
      "ASSIGNMENT_NOTIFICATION",
      "New Candidate Assigned",
      recruiterEmailTemplate
    )
  }
>
  Save Template
</Button>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-sm">
              <CardHeader><CardTitle className="text-base font-heading">Offer Letter (to Candidate)</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <Textarea value={offerLetterTemplate} onChange={(e) => setOfferLetterTemplate(e.target.value)} rows={8} className="font-mono text-sm" />
                <div className="flex gap-3">
                  <Button variant="outline" size="sm" className="gap-1" onClick={() => setPreviewTemplate(offerLetterTemplate)}><Eye className="w-3 h-3" /> Preview</Button>
                  <Button
  size="sm"
  onClick={() =>
    saveTemplate(
      "OFFER_LETTER",
      "Congratulations!",
      offerLetterTemplate
    )
  }
>
  Save Template
</Button>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-sm">
              <CardHeader><CardTitle className="text-base font-heading">Rejection Mail (to Candidate)</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <Textarea value={rejectionTemplate} onChange={(e) => setRejectionTemplate(e.target.value)} rows={8} className="font-mono text-sm" />
                <div className="flex gap-3">
                  <Button variant="outline" size="sm" className="gap-1" onClick={() => setPreviewTemplate(rejectionTemplate)}><Eye className="w-3 h-3" /> Preview</Button>
                  <Button
  size="sm"
  onClick={() =>
    saveTemplate(
      "REJECTION_MAIL",
      "Application Update",
      rejectionTemplate
    )
  }
>
  Save Template
</Button>
                </div>
              </CardContent>
            </Card>
            {previewTemplate && (
              <Card className="shadow-sm border-primary/20">
                <CardHeader><CardTitle className="text-base font-heading">Template Preview</CardTitle></CardHeader>
                <CardContent>
                  <div className="bg-muted/50 rounded-lg p-4 whitespace-pre-wrap text-sm">
                    {previewTemplate.replace('{candidate_name}', 'John Doe').replace('{recruiter_name}', 'Jane Smith').replace('{position}', 'Software Engineer').replace('{date}', 'Jan 15, 2025').replace('{time}', '10:00 AM')}
                  </div>
                  <Button variant="outline" size="sm" className="mt-3" onClick={() => setPreviewTemplate(null)}>Close Preview</Button>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}