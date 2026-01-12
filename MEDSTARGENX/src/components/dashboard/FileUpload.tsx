import { useCallback, useState } from 'react';
import { Upload, FileSpreadsheet, Loader2, CheckCircle2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { parseCSV, generateSampleCSV } from '@/lib/csvParser';
import { Patient } from '@/types/patient';

interface FileUploadProps {
  onDataLoaded: (patients: Patient[]) => void;
  isProcessing: boolean;
  setIsProcessing: (value: boolean) => void;
}

const FileUpload = ({ onDataLoaded, isProcessing, setIsProcessing }: FileUploadProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const processFile = useCallback(async (file: File) => {
    setUploadedFile(file);
    setIsProcessing(true);
    setProgress(0);

    try {
      // Simulate processing stages
      const stages = [
        { progress: 20, delay: 400 },
        { progress: 45, delay: 600 },
        { progress: 70, delay: 500 },
        { progress: 90, delay: 400 },
      ];

      for (const stage of stages) {
        await new Promise(resolve => setTimeout(resolve, stage.delay));
        setProgress(stage.progress);
      }

      // Call ML API for predictions
      const patients = await parseCSV(file);

      setProgress(100);
      await new Promise(resolve => setTimeout(resolve, 300));
      onDataLoaded(patients);
      setIsProcessing(false);
    } catch (error) {
      console.error('Error processing file:', error);
      setIsProcessing(false);
      // You might want to show an error toast here
    }
  }, [onDataLoaded, setIsProcessing]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
        processFile(file);
      }
    }
  }, [processFile]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  }, [processFile]);

  const loadSampleData = useCallback(() => {
    const sampleCSV = generateSampleCSV();
    const blob = new Blob([sampleCSV], { type: 'text/csv' });
    const file = new File([blob], 'sample_patients.csv', { type: 'text/csv' });
    processFile(file);
  }, [processFile]);

  const resetUpload = () => {
    setUploadedFile(null);
    setProgress(0);
  };

  if (isProcessing) {
    return (
      <div className="glass-card rounded-2xl p-12">
        <div className="flex flex-col items-center justify-center space-y-6">
          <div className="relative">
            <div className="w-20 h-20 rounded-full border-4 border-muted flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-secondary animate-spin" />
            </div>
            <div
              className="absolute inset-0 rounded-full border-4 border-secondary border-t-transparent animate-spin"
              style={{ animationDuration: '1.5s' }}
            />
          </div>

          <div className="text-center">
            <h3 className="text-xl font-semibold mb-2">Analyzing Bio-markers...</h3>
            <p className="text-muted-foreground mb-4">Processing patient data through AI models</p>
          </div>

          {/* Progress bar */}
          <div className="w-full max-w-sm">
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-secondary to-cyan-400 transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex justify-between mt-2 text-sm text-muted-foreground">
              <span>{progress}%</span>
              <span>{uploadedFile?.name}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (uploadedFile && !isProcessing) {
    return (
      <div className="glass-card rounded-2xl p-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-success/10">
              <CheckCircle2 className="w-8 h-8 text-success" />
            </div>
            <div>
              <h3 className="font-semibold">File Uploaded Successfully</h3>
              <p className="text-sm text-muted-foreground">{uploadedFile.name}</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={resetUpload}>
            <X className="w-5 h-5" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div
        className={`relative glass-card rounded-2xl p-12 border-2 border-dashed transition-all duration-300 ${dragActive
            ? 'border-secondary bg-secondary/5 scale-[1.02]'
            : 'border-border/50 hover:border-secondary/50'
          }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept=".csv"
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />

        <div className="flex flex-col items-center justify-center text-center space-y-4">
          <div className={`p-6 rounded-2xl transition-all duration-300 ${dragActive ? 'bg-secondary/20 scale-110' : 'bg-muted/50'
            }`}>
            <Upload className={`w-12 h-12 transition-colors ${dragActive ? 'text-secondary' : 'text-muted-foreground'
              }`} />
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2">
              {dragActive ? 'Drop your file here' : 'Upload Patient Data'}
            </h3>
            <p className="text-muted-foreground">
              Drag and drop your CSV file, or click to browse
            </p>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <FileSpreadsheet className="w-4 h-4" />
            <span>Supports .CSV files up to 50MB</span>
          </div>
        </div>
      </div>

      {/* Sample data button */}
      <div className="text-center">
        <Button variant="glass" onClick={loadSampleData}>
          <FileSpreadsheet className="w-4 h-4 mr-2" />
          Load Sample Data
        </Button>
      </div>
    </div>
  );
};

export default FileUpload;
