import AppLayout from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  User,
  Bell,
  Shield,
  Palette,
  Database,
  Key,
  Save,
  Mail,
  Building,
  Phone
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { patientService } from '@/services';

const Settings = () => {
  const { toast } = useToast();

  // Profile state
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    organization: ''
  });

  // Notifications state
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    reports: true,
    alerts: true,
  });

  // Security state
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  // Theme state
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Tab state
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'data', label: 'Data & Export', icon: Database },
    { id: 'api', label: 'API Keys', icon: Key },
  ];

  // Load saved preferences on mount
  useEffect(() => {
    const savedNotifications = localStorage.getItem('notifications');
    if (savedNotifications) {
      setNotifications(JSON.parse(savedNotifications));
    }

    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark';
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    }
  }, []);

  // Save profile
  const handleSaveProfile = () => {
    toast({
      title: "Success",
      description: "Profile updated successfully",
    });
  };

  // Save notifications
  const handleSaveNotifications = () => {
    localStorage.setItem('notifications', JSON.stringify(notifications));
    toast({
      title: "Success",
      description: "Notification preferences saved",
    });
  };

  // Change password
  const handleChangePassword = () => {
    if (!passwords.current || !passwords.new || !passwords.confirm) {
      toast({
        title: "Error",
        description: "Please fill in all password fields",
        variant: "destructive"
      });
      return;
    }

    if (passwords.new !== passwords.confirm) {
      toast({
        title: "Error",
        description: "New passwords do not match",
        variant: "destructive"
      });
      return;
    }

    if (passwords.new.length < 8) {
      toast({
        title: "Error",
        description: "Password must be at least 8 characters",
        variant: "destructive"
      });
      return;
    }

    // Reset password fields
    setPasswords({ current: '', new: '', confirm: '' });
    toast({
      title: "Success",
      description: "Password updated successfully",
    });
  };

  // Toggle theme
  const handleThemeChange = (newTheme: 'light' | 'dark') => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
    toast({
      title: "Success",
      description: `Theme changed to ${newTheme} mode`,
    });
  };

  // Export data
  const handleExportData = async () => {
    try {
      const response = await patientService.getPatients();
      if (response.success && response.data) {
        const patients = Array.isArray(response.data) ? response.data : [response.data];
        const csv = convertToCSV(patients);
        downloadCSV(csv, 'patient-data.csv');
        toast({
          title: "Success",
          description: "Patient data exported successfully",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to export data",
        variant: "destructive"
      });
    }
  };

  // Helper function to convert data to CSV
  const convertToCSV = (data: any[]) => {
    if (data.length === 0) return '';

    const headers = ['Patient ID', 'Name', 'Age', 'Gender', 'Blood Type', 'Risk Score', 'Status'];
    const rows = data.map(patient => [
      patient.patientId || patient.id,
      patient.name,
      patient.age,
      patient.gender,
      patient.bloodType,
      patient.riskScore,
      patient.status
    ]);

    return [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
  };

  // Helper function to download CSV
  const downloadCSV = (csv: string, filename: string) => {
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <AppLayout>
      <div className="min-h-screen gradient-mesh">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Settings</h1>
            <p className="text-muted-foreground">
              Manage your account settings and preferences
            </p>
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar Navigation */}
            <div className="glass-card rounded-2xl p-4 h-fit">
              <nav className="space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === tab.id
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-muted/50 text-muted-foreground hover:text-foreground'
                      }`}
                  >
                    <tab.icon className="w-5 h-5" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>

            {/* Content Area */}
            <div className="lg:col-span-3">
              {activeTab === 'profile' && (
                <div className="glass-card rounded-2xl p-8 animate-fade-in">
                  <h2 className="text-xl font-semibold mb-6">Profile Information</h2>

                  <div className="flex items-center gap-6 mb-8 pb-8 border-b border-border/30">
                    <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                      <User className="w-12 h-12 text-primary-foreground" />
                    </div>
                    <div>
                      <Button variant="outline" className="mb-2">Upload Photo</Button>
                      <p className="text-sm text-muted-foreground">JPG, PNG or GIF. Max 2MB.</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        placeholder="John"
                        className="bg-card/50"
                        value={profile.firstName}
                        onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        placeholder="Smith"
                        className="bg-card/50"
                        value={profile.lastName}
                        onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          Email Address
                        </div>
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="john@hospital.com"
                        className="bg-card/50"
                        value={profile.email}
                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          Phone Number
                        </div>
                      </Label>
                      <Input
                        id="phone"
                        placeholder="+1 (555) 000-0000"
                        className="bg-card/50"
                        value={profile.phone}
                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="organization">
                        <div className="flex items-center gap-2">
                          <Building className="w-4 h-4" />
                          Organization
                        </div>
                      </Label>
                      <Input
                        id="organization"
                        placeholder="Hospital Name"
                        className="bg-card/50"
                        value={profile.organization}
                        onChange={(e) => setProfile({ ...profile, organization: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end mt-8">
                    <Button
                      className="bg-gradient-to-r from-primary to-primary/80"
                      onClick={handleSaveProfile}
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </Button>
                  </div>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div className="glass-card rounded-2xl p-8 animate-fade-in">
                  <h2 className="text-xl font-semibold mb-6">Notification Preferences</h2>

                  <div className="space-y-6">
                    <div className="flex items-center justify-between py-4 border-b border-border/30">
                      <div>
                        <div className="font-medium">Email Notifications</div>
                        <div className="text-sm text-muted-foreground">Receive notifications via email</div>
                      </div>
                      <Switch
                        checked={notifications.email}
                        onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, email: checked }))}
                      />
                    </div>
                    <div className="flex items-center justify-between py-4 border-b border-border/30">
                      <div>
                        <div className="font-medium">Push Notifications</div>
                        <div className="text-sm text-muted-foreground">Receive push notifications in browser</div>
                      </div>
                      <Switch
                        checked={notifications.push}
                        onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, push: checked }))}
                      />
                    </div>
                    <div className="flex items-center justify-between py-4 border-b border-border/30">
                      <div>
                        <div className="font-medium">Analysis Reports</div>
                        <div className="text-sm text-muted-foreground">Get notified when analysis is complete</div>
                      </div>
                      <Switch
                        checked={notifications.reports}
                        onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, reports: checked }))}
                      />
                    </div>
                    <div className="flex items-center justify-between py-4">
                      <div>
                        <div className="font-medium">High Risk Alerts</div>
                        <div className="text-sm text-muted-foreground">Immediate alerts for high-risk patients</div>
                      </div>
                      <Switch
                        checked={notifications.alerts}
                        onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, alerts: checked }))}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end mt-8">
                    <Button
                      className="bg-gradient-to-r from-primary to-primary/80"
                      onClick={handleSaveNotifications}
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save Preferences
                    </Button>
                  </div>
                </div>
              )}

              {activeTab === 'security' && (
                <div className="glass-card rounded-2xl p-8 animate-fade-in">
                  <h2 className="text-xl font-semibold mb-6">Security Settings</h2>

                  <div className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="font-medium">Change Password</h3>
                      <div className="space-y-4 max-w-md">
                        <div className="space-y-2">
                          <Label htmlFor="currentPassword">Current Password</Label>
                          <Input
                            id="currentPassword"
                            type="password"
                            className="bg-card/50"
                            value={passwords.current}
                            onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="newPassword">New Password</Label>
                          <Input
                            id="newPassword"
                            type="password"
                            className="bg-card/50"
                            value={passwords.new}
                            onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="confirmPassword">Confirm New Password</Label>
                          <Input
                            id="confirmPassword"
                            type="password"
                            className="bg-card/50"
                            value={passwords.confirm}
                            onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                          />
                        </div>
                        <Button variant="outline" onClick={handleChangePassword}>Update Password</Button>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-border/30">
                      <h3 className="font-medium mb-4">Two-Factor Authentication</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Add an extra layer of security to your account
                      </p>
                      <Button variant="outline">Enable 2FA</Button>
                    </div>

                    <div className="pt-6 border-t border-border/30">
                      <h3 className="font-medium mb-4">Active Sessions</h3>
                      <div className="glass rounded-xl p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">Current Session</div>
                            <div className="text-sm text-muted-foreground">Chrome on macOS • San Francisco, CA</div>
                          </div>
                          <Badge variant="outline" className="text-success border-success">Active</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'appearance' && (
                <div className="glass-card rounded-2xl p-8 animate-fade-in">
                  <h2 className="text-xl font-semibold mb-6">Appearance</h2>

                  <div className="space-y-6">
                    <div>
                      <h3 className="font-medium mb-4">Theme</h3>
                      <div className="flex gap-4">
                        <Button
                          variant={theme === 'light' ? 'default' : 'outline'}
                          onClick={() => handleThemeChange('light')}
                          className="flex-1"
                        >
                          Light Mode
                        </Button>
                        <Button
                          variant={theme === 'dark' ? 'default' : 'outline'}
                          onClick={() => handleThemeChange('dark')}
                          className="flex-1"
                        >
                          Dark Mode
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'data' && (
                <div className="glass-card rounded-2xl p-8 animate-fade-in">
                  <h2 className="text-xl font-semibold mb-6">Data & Export</h2>

                  <div className="space-y-6">
                    <div>
                      <h3 className="font-medium mb-4">Export Patient Data</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Download all patient records as a CSV file
                      </p>
                      <Button onClick={handleExportData}>
                        <Database className="w-4 h-4 mr-2" />
                        Export to CSV
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'api' && (
                <div className="glass-card rounded-2xl p-8 animate-fade-in">
                  <h2 className="text-xl font-semibold mb-6">API Keys</h2>
                  <p className="text-muted-foreground">API key management coming soon...</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

// Add Badge import
import { Badge } from '@/components/ui/badge';

export default Settings;
