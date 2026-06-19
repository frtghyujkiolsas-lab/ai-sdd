import { useState } from "react";
import { UploadPage } from "./components/UploadPage";
import { ProcessingPage } from "./components/ProcessingPage";
import { ResultPage } from "./components/ResultPage";
import { HRPage } from "./components/HRPage";

{/* MARKER-MAKE-KIT-INVOKED */}

type Page = "upload" | "processing" | "result" | "hr";

interface EmployeeData {
  name: string;
  department: string;
  position: string;
  employeeId: string;
}

interface GenerateResult {
  task_id: string;
  id_photo: string;
  badge_png: string;
}

export default function App() {
  const [page, setPage] = useState<Page>("upload");
  const [employee, setEmployee] = useState<EmployeeData>({ name: "", department: "", position: "", employeeId: "" });
  const [photoUrl, setPhotoUrl] = useState<string>("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [result, setResult] = useState<GenerateResult | null>(null);

  const handleGenerate = (form: EmployeeData, file: File) => {
    setEmployee(form);
    setPhotoFile(file);
    setResult(null);
    const reader = new FileReader();
    reader.onload = (e) => {
      setPhotoUrl(e.target?.result as string);
      setPage("processing");
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="size-full">
      {page === "upload" && (
        <div>
          <UploadPage onGenerate={handleGenerate} />
          <div className="fixed bottom-4 right-4">
            <button
              onClick={() => setPage("hr")}
              className="px-4 py-2 bg-card border border-border rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors shadow-sm"
              style={{ fontSize: "0.8rem" }}
            >
              HR 管理后台 →
            </button>
          </div>
        </div>
      )}
      {page === "processing" && (
        <ProcessingPage
          employee={employee}
          file={photoFile}
          onComplete={(nextResult) => {
            setResult(nextResult);
            setPage("result");
          }}
          onCancel={() => setPage("upload")}
        />
      )}
      {page === "result" && result && (
        <ResultPage
          employee={employee}
          originalPhotoUrl={photoUrl}
          idPhotoUrl={result.id_photo}
          badgePngUrl={result.badge_png}
          taskId={result.task_id}
          onReupload={() => setPage("upload")}
          onRegenerate={() => setPage("processing")}
        />
      )}
      {page === "hr" && (
        <HRPage onNavigateToUpload={() => setPage("upload")} />
      )}
    </div>
  );
}
