import { Patient } from '@/types/patient';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronRight, User, TrendingUp, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ResultsTableProps {
  patients: Patient[];
}

const ResultsTable = ({ patients }: ResultsTableProps) => {
  const navigate = useNavigate();

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

  const handlePatientClick = (patient: Patient) => {
    const patientId = patient.patientId || patient.id || patient._id;
    navigate(`/patient/${patientId}`, { state: { patient } });
  };

  return (
    <div className="glass-card rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-border/50">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">Analysis Results</h2>
            <p className="text-sm text-muted-foreground">{patients.length} patients analyzed</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm">
              <div className="w-3 h-3 rounded-full bg-destructive/50" />
              <span className="text-muted-foreground">High Risk: {patients.filter(p => p.riskScore >= 70).length}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-3 h-3 rounded-full bg-success/50" />
              <span className="text-muted-foreground">Low Risk: {patients.filter(p => p.riskScore < 40).length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border/50">
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Patient</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">ID</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Age</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Risk Score</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
              <th className="text-right p-4 text-sm font-medium text-muted-foreground">Action</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((patient, index) => (
              <tr
                key={patient.id}
                className="border-b border-border/30 hover:bg-muted/20 transition-colors cursor-pointer group"
                onClick={() => handlePatientClick(patient)}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-muted/50 flex items-center justify-center">
                      <User className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium">{patient.name}</p>
                      <p className="text-sm text-muted-foreground">{patient.gender} • {patient.bloodType}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <span className="text-sm font-mono text-muted-foreground">
                    {patient.patientId || patient.id || patient._id}
                  </span>
                </td>
                <td className="p-4">
                  <span className="text-sm">{patient.age} yrs</span>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    {patient.riskScore >= 70 ? (
                      <AlertTriangle className="w-4 h-4 text-destructive" />
                    ) : (
                      <TrendingUp className={`w-4 h-4 ${getRiskColor(patient.riskScore)}`} />
                    )}
                    <span className={`font-semibold ${getRiskColor(patient.riskScore)}`}>
                      {patient.riskScore}%
                    </span>
                  </div>
                </td>
                <td className="p-4">
                  <Badge variant={getStatusVariant(patient.status)}>
                    {patient.status}
                  </Badge>
                </td>
                <td className="p-4 text-right">
                  <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                    View Profile
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ResultsTable;
