import { Check, Download, ShieldCheck, Sparkles } from "lucide-react";

interface Employee {
  name: string;
  department: string;
  position: string;
  employeeId: string;
}

interface ResultPageProps {
  employee: Employee;
  originalPhotoUrl: string;
  idPhotoUrl: string;
  badgePngUrl: string;
  taskId: string;
  onReupload: () => void;
  onRegenerate: () => void;
}

const METRICS = [
  { label: "Face clarity", value: "Passed" },
  { label: "Background", value: "Unified" },
  { label: "Template fit", value: "Ready" },
  { label: "Export PNG", value: "300dpi" },
];

export function ResultPage({ employee, originalPhotoUrl, idPhotoUrl, badgePngUrl, taskId, onReupload, onRegenerate }: ResultPageProps) {
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = badgePngUrl;
    link.download = `xianma_badge_${employee.name}_${employee.employeeId || taskId}.png`;
    link.click();
  };

  return (
    <div className="tech-shell bg-background">
      <header className="tech-header">
        <div className="max-w-[1440px] mx-auto px-8 h-16 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl tech-button-primary flex items-center justify-center">
            <Sparkles size={18} />
          </div>
          <span className="text-foreground font-semibold">AI Badge Studio</span>
          <span className="text-muted-foreground text-sm ml-1">智能工牌生成系统</span>
        </div>
      </header>

      <main className="relative z-1 max-w-[1440px] mx-auto px-8 py-4">
        <div className="flex items-end justify-between gap-8 mb-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full tech-chip mb-3" style={{ fontSize: "0.78rem" }}>
              <Check size={14} />
              GENERATION COMPLETE
            </div>
            <h1 className="tech-title-gradient" style={{ fontSize: "1.95rem", fontWeight: 760, letterSpacing: "-0.04em" }}>
              {employee.name} 的工牌已生成
            </h1>
            <p className="text-muted-foreground mt-2" style={{ fontSize: "0.92rem" }}>
              生活照已转为标准证件照，并完成公司工牌模板合成。任务编号：{taskId}
            </p>
          </div>
          <button onClick={handleDownload} className="tech-button-primary inline-flex items-center gap-2 px-6 py-3 rounded-2xl transition-transform hover:-translate-y-0.5" style={{ fontWeight: 700 }}>
            <Download size={17} />
            下载工牌 PNG
          </button>
        </div>

        <div className="grid grid-cols-[400px_1fr] gap-5">
          <div className="space-y-4">
          <section className="tech-panel rounded-3xl p-5">
            <div className="tech-content">
              <p className="text-primary mb-1" style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.12em" }}>BEFORE / AFTER</p>
              <h2 className="text-foreground mb-4" style={{ fontSize: "1rem", fontWeight: 650 }}>AI 标准化效果</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-3xl border border-border bg-black/20 p-4">
                  <p className="text-muted-foreground mb-3" style={{ fontSize: "0.75rem" }}>原始生活照</p>
                  <img src={originalPhotoUrl} alt="原始照片" className="w-full h-40 object-cover rounded-2xl border border-white/10" />
                </div>
                <div className="rounded-3xl border border-primary/30 bg-primary/10 p-4">
                  <p className="text-muted-foreground mb-3" style={{ fontSize: "0.75rem" }}>AI 标准证件照</p>
                  <img src={idPhotoUrl} alt="AI 标准证件照" className="w-full h-40 object-cover rounded-2xl bg-white border border-white/10" />
                </div>
              </div>
            </div>
          </section>

          <section className="tech-panel rounded-3xl p-5">
            <div className="tech-content h-full flex flex-col">
              <p className="text-primary mb-1" style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.12em" }}>QUALITY REVIEW</p>
              <h2 className="text-foreground mb-5" style={{ fontSize: "1rem", fontWeight: 650 }}>质量检查</h2>
              <div className="grid grid-cols-2 gap-2.5">
                {METRICS.map(item => (
                  <div key={item.label} className="rounded-2xl border border-border bg-black/20 px-3 py-3">
                    <div className="flex items-center gap-2">
                      <ShieldCheck size={14} className="text-primary" />
                      <span className="text-muted-foreground" style={{ fontSize: "0.72rem" }}>{item.label}</span>
                    </div>
                    <p className="text-foreground mt-1.5" style={{ fontSize: "0.82rem", fontWeight: 700 }}>{item.value}</p>
                  </div>
                ))}
              </div>

              <div className="mt-4 rounded-2xl border border-primary/25 bg-primary/10 p-3">
                <p className="text-accent-foreground" style={{ fontSize: "0.8rem", fontWeight: 650 }}>Employee Info</p>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {[
                    { label: "姓名", value: employee.name },
                    { label: "部门", value: employee.department },
                    { label: "岗位", value: employee.position },
                    { label: "工号", value: employee.employeeId },
                  ].map(({ label, value }) => (
                    <div key={label}>
                      <p className="text-muted-foreground" style={{ fontSize: "0.66rem" }}>{label}</p>
                      <p className="text-foreground mt-0.5" style={{ fontSize: "0.74rem", fontWeight: 650 }}>{value}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-3 flex gap-3">
                <button onClick={onReupload} className="tech-button-secondary flex-1 px-4 py-2 rounded-xl hover:bg-secondary transition-colors" style={{ fontSize: "0.82rem", fontWeight: 650 }}>
                  重新上传
                </button>
                <button onClick={onRegenerate} className="tech-button-secondary flex-1 px-4 py-2 rounded-xl hover:bg-secondary transition-colors" style={{ fontSize: "0.82rem", fontWeight: 650 }}>
                  重生成
                </button>
              </div>
            </div>
          </section>
          </div>

          <section className="badge-showroom-card rounded-3xl p-6 min-h-[560px]">
            <div className="tech-content h-full flex flex-col items-center">
              <div className="self-stretch flex items-center justify-between mb-5">
                <div>
                  <p className="text-primary" style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.12em" }}>BADGE PREVIEW</p>
                  <h2 className="text-foreground" style={{ fontSize: "1rem", fontWeight: 650 }}>最终工牌</h2>
                </div>
                <span className="px-3 py-1 rounded-full tech-chip" style={{ fontSize: "0.72rem", fontWeight: 650 }}>Ready</span>
              </div>

              <div className="badge-stage badge-stage-showroom flex-1 w-full">
                <div className="badge-strap" />
                <div className="badge-sleeve">
                  <img
                    src={badgePngUrl}
                    alt="先马电商最终工牌"
                    className="max-h-[470px] w-auto rounded-[1.75rem] border border-white/15 shadow-2xl"
                    style={{ background: "#fff" }}
                  />
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
