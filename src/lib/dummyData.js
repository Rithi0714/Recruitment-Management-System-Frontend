// Shared dummy data for frontend-only mode
// No backend connection required

const today = new Date();
const fmt = (d) => d.toISOString().split('T')[0];

export const dummyCandidates = [
  { id: 'c1', name: 'Aisha Patel', email: 'aisha.patel@email.com', phone: '+1-555-0101', position: 'Senior Frontend Developer', source: 'linkedin', status: 'interview_scheduled', assigned_recruiter_id: 'recruiter-1', assigned_recruiter_name: 'Jane Smith', skills: 'React, TypeScript, Tailwind CSS, Next.js', feedback: 'Strong portfolio, good communication skills' },
  { id: 'c2', name: 'Marcus Johnson', email: 'marcus.j@email.com', phone: '+1-555-0102', position: 'Backend Engineer', source: 'referral', status: 'shortlisted', assigned_recruiter_id: 'recruiter-1', assigned_recruiter_name: 'Jane Smith', skills: 'Node.js, Python, PostgreSQL, Docker', feedback: 'Excellent technical background' },
  { id: 'c3', name: 'Sophie Chen', email: 'sophie.chen@email.com', phone: '+1-555-0103', position: 'Product Manager', source: 'indeed', status: 'in_review', assigned_recruiter_id: 'recruiter-1', assigned_recruiter_name: 'Jane Smith', skills: 'Agile, JIRA, Roadmapping, Stakeholder Management' },
  { id: 'c4', name: 'David Okafor', email: 'david.okafor@email.com', phone: '+1-555-0104', position: 'DevOps Engineer', source: 'website', status: 'applied', assigned_recruiter_id: null, assigned_recruiter_name: null, skills: 'AWS, Kubernetes, Terraform, CI/CD' },
  { id: 'c5', name: 'Elena Russo', email: 'elena.russo@email.com', phone: '+1-555-0105', position: 'UX Designer', source: 'linkedin', status: 'selected', assigned_recruiter_id: 'recruiter-1', assigned_recruiter_name: 'Jane Smith', skills: 'Figma, User Research, Prototyping, Design Systems', feedback: 'Outstanding design sense, highly recommended' },
  { id: 'c6', name: 'James Walker', email: 'james.walker@email.com', phone: '+1-555-0106', position: 'Data Scientist', source: 'job_fair', status: 'interview_completed', assigned_recruiter_id: 'recruiter-1', assigned_recruiter_name: 'Jane Smith', skills: 'Python, ML, TensorFlow, SQL', feedback: 'Great analytical skills' },
  { id: 'c7', name: 'Priya Sharma', email: 'priya.sharma@email.com', phone: '+1-555-0107', position: 'QA Engineer', source: 'indeed', status: 'rejected', assigned_recruiter_id: 'recruiter-1', assigned_recruiter_name: 'Jane Smith', skills: 'Selenium, Cypress, Manual Testing', feedback: 'Not enough experience for senior role' },
  { id: 'c8', name: 'Alice Johnson', email: 'alice@example.com', phone: '+1-555-0201', position: 'Frontend Developer', source: 'linkedin', status: 'applied', assigned_recruiter_id: null, assigned_recruiter_name: null, skills: 'React, TypeScript, CSS' },
  { id: 'c9', name: 'Bob Williams', email: 'bob@example.com', phone: '+1-555-0202', position: 'Backend Engineer', source: 'indeed', status: 'interview_scheduled', assigned_recruiter_id: 'recruiter-1', assigned_recruiter_name: 'Jane Smith', skills: 'Node.js, Python, PostgreSQL' },
  { id: 'c10', name: 'Grace Lee', email: 'grace@example.com', phone: '+1-555-0203', position: 'Full Stack Developer', source: 'referral', status: 'shortlisted', assigned_recruiter_id: null, assigned_recruiter_name: null, skills: 'React, Node.js, MongoDB' },
  { id: 'c11', name: 'Emma Wilson', email: 'emma@example.com', phone: '+1-555-0204', position: 'Product Manager', source: 'linkedin', status: 'rejected', assigned_recruiter_id: null, assigned_recruiter_name: null, skills: 'Agile, Scrum, Jira' },
  { id: 'c12', name: 'Henry Brown', email: 'henry@example.com', phone: '+1-555-0205', position: 'QA Engineer', source: 'linkedin', status: 'hired', assigned_recruiter_id: 'recruiter-1', assigned_recruiter_name: 'Jane Smith', skills: 'Selenium, Jest, Cypress' },
  { id: 'c13', name: 'Noah Kim', email: 'noah.kim@email.com', phone: '+1-555-0206', position: 'Mobile Developer', source: 'linkedin', status: 'applied', assigned_recruiter_id: null, assigned_recruiter_name: null, skills: 'React Native, Flutter, Swift' },
  { id: 'c14', name: 'Fatima Hassan', email: 'fatima.h@email.com', phone: '+1-555-0207', position: 'Data Engineer', source: 'website', status: 'in_review', assigned_recruiter_id: 'recruiter-1', assigned_recruiter_name: 'Jane Smith', skills: 'Spark, Airflow, Python, Snowflake' },
  { id: 'c15', name: 'Lucas Rivera', email: 'lucas.r@email.com', phone: '+1-555-0208', position: 'DevOps Engineer', source: 'referral', status: 'offer_sent', assigned_recruiter_id: 'recruiter-1', assigned_recruiter_name: 'Jane Smith', skills: 'Kubernetes, Helm, ArgoCD, GCP', feedback: 'Excellent infrastructure knowledge' },
  { id: 'c16', name: 'Olivia Wang', email: 'olivia.w@email.com', phone: '+1-555-0209', position: 'Technical Writer', source: 'indeed', status: 'applied', assigned_recruiter_id: null, assigned_recruiter_name: null, skills: 'Markdown, DITA, API Documentation' },
  { id: 'c17', name: 'Ethan Taylor', email: 'ethan.t@email.com', phone: '+1-555-0210', position: 'Security Engineer', source: 'linkedin', status: 'shortlisted', assigned_recruiter_id: 'recruiter-1', assigned_recruiter_name: 'Jane Smith', skills: 'Pen Testing, SOC2, OWASP, SIEM' },
  { id: 'c18', name: 'Ava Martinez', email: 'ava.m@email.com', phone: '+1-555-0211', position: 'Frontend Developer', source: 'referral', status: 'interview_scheduled', assigned_recruiter_id: 'recruiter-1', assigned_recruiter_name: 'Jane Smith', skills: 'Vue.js, Nuxt, Tailwind CSS, Storybook' },
  { id: 'c19', name: 'Liam O\'Brien', email: 'liam.ob@email.com', phone: '+1-555-0212', position: 'Backend Engineer', source: 'job_fair', status: 'applied', assigned_recruiter_id: null, assigned_recruiter_name: null, skills: 'Go, Rust, gRPC, Redis' },
  { id: 'c20', name: 'Isabella Garcia', email: 'isabella.g@email.com', phone: '+1-555-0213', position: 'Product Designer', source: 'linkedin', status: 'selected', assigned_recruiter_id: 'recruiter-1', assigned_recruiter_name: 'Jane Smith', skills: 'Figma, User Testing, Interaction Design', feedback: 'Stunning portfolio, culture fit confirmed' },
];

export const dummyInterviews = [
  { id: 'i1', candidate_id: 'c1', candidate_name: 'Aisha Patel', recruiter_id: 'recruiter-1', recruiter_name: 'Jane Smith', interview_date: fmt(new Date(today.getTime() + 86400000)), interview_time: '10:00 AM', interview_type: 'technical', mode: 'online', meeting_link: 'https://meet.google.com/abc-defg-hij', status: 'scheduled', notes: 'Focus on React architecture and TypeScript patterns' },
  { id: 'i2', candidate_id: 'c2', candidate_name: 'Marcus Johnson', recruiter_id: 'recruiter-1', recruiter_name: 'Jane Smith', interview_date: fmt(new Date(today.getTime() + 86400000 * 2)), interview_time: '2:00 PM', interview_type: 'hr', mode: 'online', meeting_link: 'https://meet.google.com/marcus-hr-002', status: 'scheduled', notes: 'Discuss culture fit, salary expectations' },
  { id: 'i3', candidate_id: 'c3', candidate_name: 'Sophie Chen', recruiter_id: 'recruiter-1', recruiter_name: 'Jane Smith', interview_date: fmt(new Date(today.getTime() - 86400000)), interview_time: '11:00 AM', interview_type: 'managerial', mode: 'offline', status: 'completed', feedback: 'Good strategic thinking, needs improvement on execution' },
  { id: 'i4', candidate_id: 'c5', candidate_name: 'Elena Russo', recruiter_id: 'recruiter-1', recruiter_name: 'Jane Smith', interview_date: fmt(new Date(today.getTime() - 86400000 * 2)), interview_time: '3:00 PM', interview_type: 'final', mode: 'offline', status: 'completed', feedback: 'Excellent candidate, strong recommendation to hire' },
  { id: 'i5', candidate_id: 'c6', candidate_name: 'James Walker', recruiter_id: 'recruiter-1', recruiter_name: 'Jane Smith', interview_date: fmt(new Date(today.getTime() + 86400000 * 3)), interview_time: '9:30 AM', interview_type: 'technical', mode: 'online', meeting_link: 'https://zoom.us/j/1234567890', status: 'scheduled' },
  { id: 'i6', candidate_id: 'c9', candidate_name: 'Bob Williams', recruiter_id: 'recruiter-1', recruiter_name: 'Jane Smith', interview_date: today.toISOString().split('T')[0], interview_time: '1:00 PM', interview_type: 'hr', mode: 'online', meeting_link: 'https://meet.google.com/bob-hr-003', status: 'scheduled' },
  { id: 'i7', candidate_id: 'c18', candidate_name: 'Ava Martinez', recruiter_id: 'recruiter-1', recruiter_name: 'Jane Smith', interview_date: fmt(new Date(today.getTime() + 86400000 * 5)), interview_time: '10:30 AM', interview_type: 'technical', mode: 'online', meeting_link: 'https://meet.google.com/ava-tech-004', status: 'scheduled' },
  { id: 'i8', candidate_id: 'c17', candidate_name: 'Ethan Taylor', recruiter_id: 'recruiter-1', recruiter_name: 'Jane Smith', interview_date: fmt(new Date(today.getTime() + 86400000 * 7)), interview_time: '3:00 PM', interview_type: 'managerial', mode: 'offline', status: 'scheduled', notes: 'Senior leadership to assess security mindset' },
  { id: 'i9', candidate_id: 'c15', candidate_name: 'Lucas Rivera', recruiter_id: 'recruiter-1', recruiter_name: 'Jane Smith', interview_date: fmt(new Date(today.getTime() - 86400000 * 4)), interview_time: '11:00 AM', interview_type: 'final', mode: 'offline', status: 'completed', feedback: 'Exceptional candidate, offer sent' },
  { id: 'i10', candidate_id: 'c14', candidate_name: 'Fatima Hassan', recruiter_id: 'recruiter-1', recruiter_name: 'Jane Smith', interview_date: fmt(new Date(today.getTime() + 86400000)), interview_time: '2:30 PM', interview_type: 'hr', mode: 'online', meeting_link: 'https://zoom.us/j/5551213', status: 'scheduled' },
];

export const dummyOfferLetters = [
  { id: 'o1', candidate_id: 'c12', candidate_name: 'Henry Brown', position: 'QA Engineer', salary: '$75,000/yr', joining_date: fmt(new Date(today.getTime() + 86400000 * 14)), status: 'accepted' },
  { id: 'o2', candidate_id: 'c15', candidate_name: 'Lucas Rivera', position: 'DevOps Engineer', salary: '$130,000/yr', joining_date: fmt(new Date(today.getTime() + 86400000 * 21)), status: 'sent' },
];

export const dummyActivityLogs = [
  { id: 'a1', action: 'Aisha Patel was scheduled for a technical interview', entity_type: 'interview', performed_by: 'HR Admin', role: 'hr', created_date: new Date(today.getTime() - 86400000 * 1).toISOString() },
  { id: 'a2', action: 'Elena Russo was marked as selected', entity_type: 'candidate', performed_by: 'Jane Smith', role: 'recruiter', created_date: new Date(today.getTime() - 86400000 * 2).toISOString() },
  { id: 'a3', action: 'Marcus Johnson was added to the system', entity_type: 'candidate', performed_by: 'HR Admin', role: 'hr', created_date: new Date(today.getTime() - 86400000 * 3).toISOString() },
  { id: 'a4', action: 'Henry Brown was hired', entity_type: 'candidate', performed_by: 'HR Admin', role: 'hr', created_date: new Date(today.getTime() - 86400000 * 5).toISOString() },
  { id: 'a5', action: 'Lucas Rivera received an offer letter', entity_type: 'offer_letter', performed_by: 'HR Admin', role: 'hr', created_date: new Date(today.getTime() - 86400000 * 4).toISOString() },
  { id: 'a6', action: 'Isabella Garcia was shortlisted for final round', entity_type: 'candidate', performed_by: 'Jane Smith', role: 'recruiter', created_date: new Date(today.getTime() - 86400000 * 6).toISOString() },
  { id: 'a7', action: 'Ava Martinez was scheduled for a technical interview', entity_type: 'interview', performed_by: 'HR Admin', role: 'hr', created_date: new Date(today.getTime() - 86400000 * 7).toISOString() },
  { id: 'a8', action: 'Ethan Taylor passed initial screening', entity_type: 'candidate', performed_by: 'Jane Smith', role: 'recruiter', created_date: new Date(today.getTime() - 86400000 * 8).toISOString() },
];

export const dummyUsers = [
  { id: 'hr-1', full_name: 'HR Admin', email: 'hr@demo.com', role: 'hr', department: 'Human Resources' },
  { id: 'recruiter-1', full_name: 'Jane Smith', email: 'recruiter@demo.com', role: 'recruiter', department: 'Talent Acquisition' },
  { id: 'admin-1', full_name: 'Admin User', email: 'admin@demo.com', role: 'admin', department: 'Management' },
];