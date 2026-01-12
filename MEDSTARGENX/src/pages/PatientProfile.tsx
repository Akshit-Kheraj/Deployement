import { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';
import { Patient } from '@/types/patient';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  User,
  Calendar,
  Droplet,
  Activity,
  FileText,
  Printer,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Edit2,
  Loader2
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { patientService } from '@/services';
import { useToast } from '@/hooks/use-toast';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';

const PatientProfile = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id: urlPatientId } = useParams();
  const { toast } = useToast();
  const [patient, setPatient] = useState<Patient | undefined>(location.state?.patient);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    age: 0,
    gender: '',
    bloodType: ''
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [newRecommendation, setNewRecommendation] = useState('');
  const [isAddingRecommendation, setIsAddingRecommendation] = useState(false);
  const [biomarkers, setBiomarkers] = useState(patient?.biomarkers || []);
  const [editingBiomarker, setEditingBiomarker] = useState<string | null>(null);

  // Common recommendation templates
  const recommendationTemplates = [
    'Schedule follow-up in 3 months',
    'Order additional imaging (CT/MRI/PET)',
    'Refer to oncology specialist',
    'Schedule biopsy consultation',
    'Monitor biomarker levels monthly',
    'Lifestyle modification counseling',
    'Consider genetic testing',
    'Start chemotherapy treatment',
    'Radiation therapy consultation',
    'Pain management consultation',
    'Nutritional counseling',
    'Palliative care consultation'
  ];

  // Load existing recommendations from patient data
  useEffect(() => {
    if (patient?.recommendations && Array.isArray(patient.recommendations)) {
      setRecommendations(patient.recommendations);
    }
  }, [patient]);

  // Load biomarkers from patient data
  useEffect(() => {
    if (patient?.biomarkers && Array.isArray(patient.biomarkers)) {
      setBiomarkers(patient.biomarkers);
    }
  }, [patient]);

  // Fetch fresh patient data from database on mount
  useEffect(() => {
    const fetchPatientData = async () => {
      // Get patient ID from URL params or location.state
      const patientId = urlPatientId || patient?._id || patient?.id;

      if (patientId) {
        try {
          const response = await patientService.getPatientById(patientId);
          if (response.success && response.data) {
            setPatient(response.data as Patient);
          }
        } catch (error) {
          console.error('Error fetching patient data:', error);
        }
      }
    };
    fetchPatientData();
  }, [urlPatientId]); // Re-fetch when URL param changes

  // Save recommendations to database
  const saveRecommendations = async (updatedRecommendations: string[]) => {
    try {
      await patientService.updatePatient(patient._id || patient.id, {
        recommendations: updatedRecommendations
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save recommendations",
        variant: "destructive"
      });
    }
  };

  // Initialize formData when patient loads
  if (patient && formData.name === '' && !isEditing) {
    setFormData({
      name: patient.name,
      age: patient.age,
      gender: patient.gender,
      bloodType: patient.bloodType
    });
  }

  if (!patient) {
    return (
      <AppLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Patient Not Found</h2>
            <Button onClick={() => navigate('/dashboard')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
        </div>
      </AppLayout>
    );
  }

  // Handle biomarker status change
  const handleBiomarkerStatusChange = async (markerName: string, newStatus: string) => {
    const updatedBiomarkers = biomarkers.map(marker =>
      marker.name === markerName ? { ...marker, status: newStatus as 'normal' | 'elevated' | 'critical' | 'abnormal' } : marker
    );
    setBiomarkers(updatedBiomarkers);
    setEditingBiomarker(null);

    // Save to database
    try {
      console.log('Sending biomarker update to API:', updatedBiomarkers);
      const updateResponse = await patientService.updatePatient(patient!._id || patient!.id, {
        biomarkers: updatedBiomarkers
      });
      console.log('Update response:', updateResponse);

      if (!updateResponse.success) {
        alert('Update failed: ' + (updateResponse.message || 'Unknown error'));
        throw new Error('Update failed');
      }

      // Refetch patient data to ensure it's in sync
      const response = await patientService.getPatientById(patient!._id || patient!.id);
      console.log('Refetch response:', response);
      if (response.success && response.data) {
        setPatient(response.data as Patient);
        alert('Biomarker updated and refetched successfully!');
      }

      toast({
        title: "Success",
        description: `${markerName} status updated to ${newStatus}`,
      });
    } catch (error) {
      console.error('Error updating biomarker:', error);
      toast({
        title: "Error",
        description: "Failed to save biomarker status",
        variant: "destructive"
      });
      // Revert on error
      setBiomarkers(biomarkers);
    }
  };

  const getStatusVariant = (status: Patient['status']) => {
    switch (status) {
      case 'Malignant': return 'malignant';
      case 'Benign': return 'benign';
      case 'Under Review': return 'review';
      default: return 'default';
    }
  };

  // Generate indicators dynamically from modelProbabilities
  const getIndicators = (patient: Patient) => {
    if (!patient.modelProbabilities) {
      return [
        { label: 'Indicator 1', value: 0 },
        { label: 'Indicator 2', value: 0 },
        { label: 'Indicator 3', value: 0 },
        { label: 'Indicator 4', value: patient.riskScore || 0 },
      ];
    }
    return [
      { label: 'Indicator 1', value: patient.modelProbabilities.randomForest },
      { label: 'Indicator 2', value: patient.modelProbabilities.gradientBoosting },
      { label: 'Indicator 3', value: patient.modelProbabilities.xgboost },
      { label: 'Indicator 4', value: patient.riskScore },
    ];
  };

  // Handle print functionality
  const handlePrint = () => {
    window.print();
  };

  const displayId = patient.patientId || patient.id || patient._id;
  const indicators = getIndicators(patient);

  return (
    <AppLayout>
      <div className="min-h-screen gradient-mesh">
        {/* Print-only header */}
        <div className="hidden print:block text-center py-4 border-b-2 border-gray-300 mb-6">
          <h1 className="text-2xl font-bold">Med Star Gen X</h1>
          <p className="text-sm text-gray-600">AI-Powered Cancer Detection System</p>
        </div>

        <div className="p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => navigate('/dashboard')}>
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl font-bold">{patient.name}</h1>
                  <Dialog open={isEditing} onOpenChange={setIsEditing}>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
                        <Edit2 className="w-4 h-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Edit Patient Details</DialogTitle>
                        <DialogDescription>
                          Update patient information here. Click save when you're done.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="name" className="text-right">Name</Label>
                          <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="age" className="text-right">Age</Label>
                          <Input
                            id="age"
                            type="number"
                            value={formData.age}
                            onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) || 0 })}
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="gender" className="text-right">Gender</Label>
                          <div className="col-span-3">
                            <Select
                              value={formData.gender}
                              onValueChange={(value) => setFormData({ ...formData, gender: value })}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select gender" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Male">Male</SelectItem>
                                <SelectItem value="Female">Female</SelectItem>
                                <SelectItem value="Other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="bloodType" className="text-right">Blood Type</Label>
                          <div className="col-span-3">
                            <Select
                              value={formData.bloodType}
                              onValueChange={(value) => setFormData({ ...formData, bloodType: value })}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select blood type" />
                              </SelectTrigger>
                              <SelectContent>
                                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((type) => (
                                  <SelectItem key={type} value={type}>{type}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                        <Button onClick={async () => {
                          if (!patient._id && !patient.patientId && !patient.id) return;

                          setIsUpdating(true);
                          try {
                            const idToUpdate = patient._id || patient.patientId || patient.id;
                            const response = await patientService.updatePatient(idToUpdate, formData as Partial<Patient>);

                            if (response.success && response.data) {
                              setPatient({ ...patient, ...formData } as Patient);
                              toast({
                                title: "Success",
                                description: "Patient details updated successfully",
                              });
                              setIsEditing(false);
                            }
                          } catch (error: any) {
                            console.error('Error updating patient:', error);
                            toast({
                              title: "Error",
                              description: "Failed to update patient details",
                              variant: "destructive"
                            });
                          } finally {
                            setIsUpdating(false);
                          }
                        }} disabled={isUpdating}>
                          {isUpdating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                          Save Changes
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
                <p className="text-muted-foreground">Patient ID: {displayId}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant={getStatusVariant(patient.status)} className="text-sm px-4 py-2">
                {patient.status}
              </Badge>
              <Button
                variant="glass"
                onClick={handlePrint}
                title="For best printing experience, use Google Chrome"
              >
                <Printer className="w-4 h-4 mr-2" />
                Print Report
              </Button>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left column - Patient info */}
            <div className="space-y-6">
              {/* Profile card */}
              <div className="glass-card rounded-2xl p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center">
                    <User className="w-10 h-10 text-muted-foreground" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">{patient.name}</h2>
                    <p className="text-muted-foreground">{patient.gender} • {patient.age} years old</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                    <Calendar className="w-5 h-5 text-secondary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Last Analysis</p>
                      <p className="font-medium">{patient.lastAnalysis}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                    <Droplet className="w-5 h-5 text-destructive" />
                    <div>
                      <p className="text-sm text-muted-foreground">Blood Type</p>
                      <p className="font-medium">{patient.bloodType}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                    <Activity className="w-5 h-5 text-warning" />
                    <div>
                      <p className="text-sm text-muted-foreground">Risk Score</p>
                      <p className="font-medium text-xl">{patient.riskScore}%</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recommendations */}
              <div className="glass-card rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <FileText className="w-5 h-5 text-secondary" />
                    Doctor Recommendations
                  </h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsAddingRecommendation(true)}
                  >
                    Add Recommendation
                  </Button>
                </div>

                {isAddingRecommendation && (
                  <div className="mb-4 p-4 border border-border rounded-lg bg-card/50">
                    <Label className="text-sm font-medium mb-2 block">Quick Templates</Label>
                    <div className="grid grid-cols-1 gap-2 mb-3">
                      {recommendationTemplates.map((template, idx) => (
                        <Button
                          key={idx}
                          variant="outline"
                          size="sm"
                          className="text-xs justify-start h-auto py-2 px-3"
                          onClick={() => setNewRecommendation(template)}
                        >
                          {template}
                        </Button>
                      ))}
                    </div>
                    <Label className="text-sm font-medium mb-2 block">Custom Recommendation</Label>
                    <Input
                      placeholder="Enter custom recommendation or select from templates above..."
                      value={newRecommendation}
                      onChange={(e) => setNewRecommendation(e.target.value)}
                      className="mb-2"
                    />
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={async () => {
                          if (newRecommendation.trim()) {
                            const updated = [...recommendations, newRecommendation];
                            setRecommendations(updated);
                            await saveRecommendations(updated);
                            setNewRecommendation('');
                            setIsAddingRecommendation(false);
                            toast({
                              title: "Success",
                              description: "Recommendation added",
                            });
                          }
                        }}
                      >
                        Save
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setNewRecommendation('');
                          setIsAddingRecommendation(false);
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  {recommendations.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No recommendations added yet. Click "Add Recommendation" to create one.
                    </p>
                  ) : (
                    recommendations.map((rec, index) => (
                      <div
                        key={index}
                        className="flex items-start justify-between gap-3 p-3 rounded-lg bg-muted/30 border border-border"
                      >
                        <div className="flex items-start gap-3 flex-1">
                          <FileText className="w-5 h-5 mt-0.5 text-secondary" />
                          <p className="text-sm">{rec}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={async () => {
                            const updated = recommendations.filter((_, i) => i !== index);
                            setRecommendations(updated);
                            await saveRecommendations(updated);
                            toast({
                              title: "Success",
                              description: "Recommendation removed",
                            });
                          }}
                        >
                          Remove
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Center column - Charts */}
            <div className="space-y-6">
              {/* Risk Score Chart */}
              <div className="glass-card rounded-2xl p-6">
                <h3 className="text-lg font-semibold mb-4">Risk Indicator Analysis</h3>
                <div className="h-80 flex flex-col justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[{ name: 'Overall Risk Score', value: patient.riskScore }]}
                      margin={{ top: 20, right: 30, left: 60, bottom: 60 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis
                        type="category"
                        dataKey="name"
                        tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 14 }}
                        label={{ value: 'Overall Risk Score', position: 'insideBottom', offset: -20, fill: 'hsl(var(--muted-foreground))' }}
                      />
                      <YAxis
                        type="number"
                        domain={[0, 100]}
                        tick={{ fill: 'hsl(var(--muted-foreground))' }}
                        label={{ value: 'Risk Score (%)', angle: -90, position: 'insideLeft', fill: 'hsl(var(--muted-foreground))' }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                        }}
                        formatter={(value: any) => [`${value}%`, 'Risk Score']}
                      />
                      <Bar
                        dataKey="value"
                        fill={patient.riskScore >= 70 ? 'hsl(0, 84%, 60%)' : patient.riskScore >= 40 ? 'hsl(38, 92%, 50%)' : 'hsl(142, 76%, 36%)'}
                        radius={[8, 8, 0, 0]}
                        label={{
                          position: 'top',
                          fill: 'hsl(var(--foreground))',
                          formatter: (value: any) => `${value}%`
                        }}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Bar chart */}
              <div className="glass-card rounded-2xl p-6">
                <h3 className="text-lg font-semibold mb-4">Biomarker Levels</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={patient.biomarkers}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis
                        dataKey="name"
                        tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                      />
                      <YAxis tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                        }}
                      />
                      <Bar
                        dataKey="value"
                        fill="hsl(var(--secondary))"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Right column - Full report */}
            <div className="glass-card rounded-2xl p-6 max-h-[800px] overflow-y-auto">
              <h3 className="text-lg font-semibold mb-6 flex items-center gap-2 sticky top-0 bg-card/95 backdrop-blur-sm pb-2 z-10">
                <FileText className="w-5 h-5 text-secondary" />
                Full Report Card
              </h3>

              <div className="space-y-4">
                {/* Patient Summary */}
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3">
                    Patient Summary
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between py-2 border-b border-border/30">
                      <span className="text-muted-foreground">Full Name</span>
                      <span className="font-medium">{patient.name}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-border/30">
                      <span className="text-muted-foreground">Patient ID</span>
                      <span className="font-mono">{displayId}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-border/30">
                      <span className="text-muted-foreground">Age</span>
                      <span>{patient.age} years</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-border/30">
                      <span className="text-muted-foreground">Gender</span>
                      <span>{patient.gender}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-border/30">
                      <span className="text-muted-foreground">Blood Type</span>
                      <span>{patient.bloodType}</span>
                    </div>
                  </div>
                </div>

                {/* Biomarker Results */}
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3">
                    Biomarker Results
                  </h4>
                  <div className="space-y-2">
                    {biomarkers.map((marker) => (
                      <div key={marker.name} className="flex items-center justify-between py-2 border-b border-border/30">
                        <div>
                          <span className="text-sm font-medium">{marker.name}</span>
                          <p className="text-xs text-muted-foreground">Normal: {marker.normalRange}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm">{marker.value.toFixed(2)}</span>
                          {editingBiomarker === marker.name ? (
                            <select
                              className="text-xs px-2 py-1 rounded border border-border bg-card"
                              value={marker.status}
                              onChange={(e) => handleBiomarkerStatusChange(marker.name, e.target.value)}
                              onBlur={() => setEditingBiomarker(null)}
                              autoFocus
                            >
                              <option value="normal">Normal</option>
                              <option value="abnormal">Abnormal</option>
                              <option value="elevated">Elevated</option>
                            </select>
                          ) : (
                            <Badge
                              variant={marker.status === 'abnormal' ? 'destructive' : marker.status}
                              className="cursor-pointer hover:opacity-80"
                              onClick={() => setEditingBiomarker(marker.name)}
                            >
                              {marker.status}
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Analysis timestamp */}
                <div className="pt-4 border-t border-border/50">
                  <p className="text-xs text-muted-foreground text-center">
                    Report generated on {new Date().toLocaleString()} • Med Star Gen X AI v2.1
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout >
  );
};

export default PatientProfile;
