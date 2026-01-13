import { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import FileUpload from '@/components/dashboard/FileUpload';
import ResultsTable from '@/components/dashboard/ResultsTable';
import { Patient } from '@/types/patient';
import { Activity, Users, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { patientService } from '@/services';
import { useToast } from '@/hooks/use-toast';

const Dashboard = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleDataLoaded = async (data: Patient[]) => {
    setPatients(data);

    // Save patients to database
    try {
      console.log('Attempting to save patients:', data.length);
      const result = await patientService.savePatients(data);
      console.log('Save result:', result);
      toast({
        title: "Success",
        description: `Saved ${data.length} patient${data.length > 1 ? 's' : ''} to database`,
      });
    } catch (error: any) {
      console.error('Error saving patients:', error);
      console.error('Error message:', error.message);
      console.error('Error response:', error.response);

      // Check if it's a 401 error - redirect to login
      if (error.response?.status === 401) {
        window.location.href = '/auth';
        return;
      }

      toast({
        title: "Warning",
        description: error.message || "Predictions displayed but not saved to database",
        variant: "destructive"
      });
    }
  };

  const stats = [
    {
      label: 'Total Analyzed',
      value: patients.length,
      icon: Users,
      color: 'text-secondary',
      bgColor: 'bg-secondary/10',
    },
    {
      label: 'High Risk',
      value: patients.filter(p => p.riskScore >= 70).length,
      icon: AlertTriangle,
      color: 'text-destructive',
      bgColor: 'bg-destructive/10',
    },
    {
      label: 'Under Review',
      value: patients.filter(p => p.riskScore >= 40 && p.riskScore < 70).length,
      icon: Activity,
      color: 'text-warning',
      bgColor: 'bg-warning/10',
    },
    {
      label: 'Low Risk',
      value: patients.filter(p => p.riskScore < 40).length,
      icon: CheckCircle2,
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
  ];

  return (
    <AppLayout>
      <div className="min-h-screen gradient-mesh">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Diagnostic Dashboard</h1>
            <p className="text-muted-foreground">
              Upload patient CSV data to begin AI-powered cancer screening analysis
            </p>
          </div>

          {/* Stats */}
          {patients.length > 0 && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 animate-fade-in">
              {stats.map((stat) => (
                <div key={stat.label} className="glass-card rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                      <stat.icon className={`w-5 h-5 ${stat.color}`} />
                    </div>
                  </div>
                  <p className="text-3xl font-bold mb-1">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          )}

          {/* File Upload */}
          {patients.length === 0 && (
            <div className="max-w-2xl mx-auto">
              <FileUpload
                onDataLoaded={handleDataLoaded}
                isProcessing={isProcessing}
                setIsProcessing={setIsProcessing}
              />
            </div>
          )}

          {/* Results Table */}
          {patients.length > 0 && !isProcessing && (
            <div className="animate-fade-in">
              <ResultsTable patients={patients} />
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
