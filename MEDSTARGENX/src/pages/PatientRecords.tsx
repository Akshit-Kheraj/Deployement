import { useState, useEffect } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Search,
  Filter,
  Download,
  User,
  Calendar,
  TrendingUp,
  ChevronRight,
  SlidersHorizontal,
  Loader2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Patient } from '@/types/patient';
import { patientService } from '@/services';
import { useToast } from '@/hooks/use-toast';

const PatientRecords = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);

  // Fetch patients from API
  useEffect(() => {
    fetchPatients();
  }, [searchQuery, filterStatus]);

  const fetchPatients = async () => {
    setIsLoading(true);
    try {
      const response = await patientService.getPatients({
        search: searchQuery || undefined,
        status: filterStatus !== 'all' ? filterStatus : undefined
      });
      setPatients(response.data as Patient[]);
    } catch (error: any) {
      console.error('Error fetching patients:', error);
      toast({
        title: "Error",
        description: "Failed to load patient records",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredPatients = patients;

  const getStatusVariant = (status: Patient['status']) => {
    switch (status) {
      case 'Malignant':
        return 'malignant';
      case 'Benign':
        return 'benign';
      case 'Under Review':
        return 'review';
      default:
        return 'default';
    }
  };

  const getRiskColor = (score: number) => {
    if (score >= 70) return 'text-destructive';
    if (score >= 40) return 'text-warning';
    return 'text-success';
  };

  // Export all patients to CSV
  const handleExportAll = () => {
    if (filteredPatients.length === 0) {
      toast({
        title: "No Data",
        description: "No patient records to export",
        variant: "destructive"
      });
      return;
    }

    const csv = convertToCSV(filteredPatients);
    downloadCSV(csv, `patient-records-${new Date().toISOString().split('T')[0]}.csv`);
    toast({
      title: "Success",
      description: `Exported ${filteredPatients.length} patient records`,
    });
  };

  // Helper function to convert data to CSV
  const convertToCSV = (data: Patient[]) => {
    const headers = ['Patient ID', 'Name', 'Age', 'Gender', 'Blood Type', 'Risk Score', 'Status', 'Last Analysis'];
    const rows = data.map(patient => [
      patient.patientId || patient.id,
      patient.name,
      patient.age,
      patient.gender,
      patient.bloodType,
      patient.riskScore,
      patient.status,
      patient.lastAnalysis
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
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Patient Records</h1>
              <p className="text-muted-foreground">
                View and manage all analyzed patient records
              </p>
            </div>
            <Button className="bg-gradient-to-r from-primary to-primary/80" onClick={handleExportAll}>
              <Download className="w-4 h-4 mr-2" />
              Export All
            </Button>
          </div>

          {/* Filters */}
          <div className="glass-card rounded-2xl p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Search by name or ID..."
                  className="pl-10 bg-card/50"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant={filterStatus === 'all' ? 'default' : 'outline'}
                  onClick={() => setFilterStatus('all')}
                >
                  All
                </Button>
                <Button
                  variant={filterStatus === 'Malignant' ? 'default' : 'outline'}
                  onClick={() => setFilterStatus('Malignant')}
                  className={filterStatus === 'Malignant' ? 'bg-destructive hover:bg-destructive/90' : ''}
                >
                  High Risk
                </Button>
                <Button
                  variant={filterStatus === 'Under Review' ? 'default' : 'outline'}
                  onClick={() => setFilterStatus('Under Review')}
                  className={filterStatus === 'Under Review' ? 'bg-warning hover:bg-warning/90' : ''}
                >
                  Review
                </Button>
                <Button
                  variant={filterStatus === 'Benign' ? 'default' : 'outline'}
                  onClick={() => setFilterStatus('Benign')}
                  className={filterStatus === 'Benign' ? 'bg-success hover:bg-success/90' : ''}
                >
                  Low Risk
                </Button>
                <Button variant="outline" size="icon">
                  <SlidersHorizontal className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="glass-card rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-border/30">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold">All Records</h2>
                  <p className="text-sm text-muted-foreground">{filteredPatients.length} patients found</p>
                </div>
              </div>
            </div>

            {/* Patient List */}
            <div className="divide-y divide-border/30">
              {isLoading ? (
                <div className="p-12 flex items-center justify-center">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : filteredPatients.length > 0 ? (
                filteredPatients.map((patient, index) => {
                  const patientId = patient.patientId || patient.id || patient._id || `unknown-${index}`;
                  return (
                    <div
                      key={patientId}
                      className="p-6 hover:bg-muted/20 transition-colors cursor-pointer group"
                      onClick={() => navigate(`/patient/${patientId}`, { state: { patient } })}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                            <User className="w-7 h-7 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">{patient.name}</h3>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span className="font-mono">{patientId}</span>
                              <span className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {patient.age} yrs • {patient.gender}
                              </span>
                              <span>{patient.bloodType}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-6">
                          <div className="text-right">
                            <div className="text-sm text-muted-foreground mb-1">Risk Score</div>
                            <div className={`text-2xl font-bold flex items-center gap-2 ${getRiskColor(patient.riskScore)}`}>
                              <TrendingUp className="w-5 h-5" />
                              {patient.riskScore}%
                            </div>
                          </div>
                          <Badge variant={getStatusVariant(patient.status)} className="px-4 py-2">
                            {patient.status}
                          </Badge>
                          <ChevronRight className="w-5 h-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-12 text-center">
                  <div className="text-muted-foreground">
                    {searchQuery || filterStatus !== 'all'
                      ? 'No patients match your search criteria'
                      : 'No patient records yet. Upload a CSV in the Dashboard to get started.'
                    }
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default PatientRecords;
