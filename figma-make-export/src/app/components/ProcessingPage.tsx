import { useEffect, useRef, useState } from "react";
import { Activity, ArrowLeft, CheckCircle, IdCard, Loader2, Sparkles, XCircle } from "lucide-react";

interface ProcessingPageProps {
  employee: {
    name: string;
    department: string;
    position: string;
    employeeId: string;
  };
  file: File | null;
  onComplete: (result: { task_id: string; id_photo: string; badge_png: string }) => void;
  onCancel: () => void;
}

type StepStatus = "pending" | "processing" | "done" | "error";

const STEPS = [
  { label: "检测人脸质量", desc: "分析上传照片中的人脸区域、光线和清晰度" },
  { label: "生成标准证件照", desc: "AI 抠图、补光、统一背景色处理" },
  { label: "套入公司工牌模板", desc: "合成姓名、部门、岗位、工号及二维码" },
  { label: "导出工牌 PNG", desc: "高清 300dpi 工牌图片生成中" },
];

const QUALITY_ITEMS = ["Face clarity", "Template fit", "BG match", "Export ready"];

export function ProcessingPage({ employee, file, onComplete, onCancel }: ProcessingPageProps) {
  const [statuses, setStatuses] = useState<StepStatus[]>(["pending", "pending", "pending", "pending"]);
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string>("");
  const apiDoneRef = useRef(false);
  const startedRef = useRef(false);

  useEffect(() => {
    let cancelled = false;
    const generate = async () => {
      if (startedRef.current) return;
      startedRef.current = true;
      if (!file) {
        setError("没有读取到上传照片，请返回重新上传。");
        return;
      }
      try {
        const formData = new FormData();
        formData.append("photo", file);
        formData.append("name", employee.name);
        formData.append("department", employee.department);
        formData.append("position", employee.position);
        formData.append("employeeId", employee.employeeId);

        const response = await fetch("/api/generate", {
          method: "POST",
          body: formData,
        });
        const payload = await response.json();
        if (!response.ok || payload.error) {
          throw new Error(payload.error || "生成失败");
        }
        if (!cancelled) {
          apiDoneRef.current = true;
          setStatuses(["done", "done", "done", "done"]);
          setProgress(100);
          setTimeout(() => onComplete(payload), 450);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "生成失败，请稍后重试。");
          setStatuses(prev => {
            const next = [...prev];
            next[Math.max(0, Math.min(currentStep, next.length - 1))] = "error";
            return next;
          });
        }
      }
    };

    let step = 0;
    const advance = () => {
      if (cancelled || apiDoneRef.current) return;
      if (step >= STEPS.length) {
        setProgress(prev => Math.max(prev, 92));
        return;
      }
      setCurrentStep(step);
      setStatuses(prev => {
        const next = [...prev];
        next[step] = "processing";
        return next;
      });

      const duration = [1400, 1600, 1200, 1000][step];
      const start = Date.now();
      const baseProgress = step * 25;

      const tick = () => {
        const elapsed = Date.now() - start;
        const frac = Math.min(elapsed / duration, 1);
        setProgress(Math.round(baseProgress + frac * 25));
        if (frac < 1) requestAnimationFrame(tick);
        else {
          if (cancelled || apiDoneRef.current) return;
          setStatuses(prev => {
            const next = [...prev];
            next[step] = "done";
            return next;
          });
          step++;
          setTimeout(advance, 300);
        }
      };
      requestAnimationFrame(tick);
    };
    generate();
    setTimeout(advance, 400);
    return () => {
      cancelled = true;
    };
  }, []);

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

      <main className="relative z-1 max-w-[1440px] mx-auto px-8 py-8">
        <div className="flex items-end justify-between mb-7">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full tech-chip mb-3" style={{ fontSize: "0.78rem" }}>
              <Activity size={14} />
              AI PROCESSING
            </div>
            <h1 className="tech-title-gradient" style={{ fontSize: "2rem", fontWeight: 750, letterSpacing: "-0.04em" }}>
              正在为 {employee.name} 生成工牌
            </h1>
            <p className="text-muted-foreground mt-2" style={{ fontSize: "0.92rem" }}>
              系统正在执行人脸检测、证件照标准化、模板合成和导出检查。
            </p>
          </div>
          <div className="tech-panel rounded-2xl px-5 py-3">
            <div className="tech-content text-right">
              <p className="text-muted-foreground" style={{ fontSize: "0.72rem" }}>Overall Progress</p>
              <p className="text-primary" style={{ fontSize: "1.35rem", fontWeight: 750 }}>{progress}%</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-[1fr_380px] gap-6">
          <div className="space-y-4">
            <div className="tech-panel rounded-3xl p-5">
              <div className="tech-content">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-foreground" style={{ fontSize: "0.875rem", fontWeight: 600 }}>AI Workflow</span>
                  <span className="text-primary" style={{ fontSize: "0.875rem", fontWeight: 700 }}>{progress}%</span>
                </div>
                <div className="h-2 bg-black/30 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{ width: `${progress}%`, background: "linear-gradient(90deg, #ef3b2d, #ff8b7f)" }}
                  />
                </div>
              </div>
            </div>

            <div className="tech-panel rounded-3xl overflow-hidden">
              <div className="tech-content divide-y divide-border">
                {STEPS.map((step, i) => {
                  const status = statuses[i];
                  return (
                    <div key={i} className="p-5 flex items-start gap-4">
                      <div className="mt-0.5">
                        {status === "done" && <CheckCircle size={24} style={{ color: "#22c55e" }} />}
                        {status === "processing" && (
                          <div className="relative">
                            <div className="absolute inset-0 rounded-full bg-primary/40 blur-md" />
                            <Loader2 size={24} className="relative text-primary animate-spin" />
                          </div>
                        )}
                        {status === "error" && <XCircle size={24} className="text-destructive" />}
                        {status === "pending" && (
                          <div className="w-6 h-6 rounded-full border border-border bg-black/20 flex items-center justify-center">
                            <span className="text-muted-foreground" style={{ fontSize: "0.7rem" }}>{i + 1}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className={`${status === "pending" ? "text-muted-foreground" : "text-foreground"}`} style={{ fontWeight: status === "processing" ? 700 : 500 }}>
                          {step.label}
                        </p>
                        <p className="text-muted-foreground mt-0.5" style={{ fontSize: "0.8rem" }}>{step.desc}</p>
                      </div>
                      <div>
                        {status === "done" && <span className="px-2 py-0.5 rounded-full text-xs" style={{ background: "rgba(34,197,94,.13)", color: "#86efac", fontWeight: 600 }}>已完成</span>}
                        {status === "processing" && <span className="px-2 py-0.5 rounded-full text-xs tech-chip" style={{ fontWeight: 600 }}>处理中</span>}
                        {status === "pending" && <span className="px-2 py-0.5 rounded-full text-xs bg-secondary text-muted-foreground">等待中</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {error ? (
              <div className="tech-panel rounded-3xl p-5">
                <div className="tech-content flex items-start gap-3">
                  <XCircle size={20} className="text-destructive mt-0.5" />
                  <div className="flex-1">
                    <p className="text-foreground" style={{ fontSize: "0.9rem", fontWeight: 650 }}>生成失败</p>
                    <p className="text-muted-foreground mt-1" style={{ fontSize: "0.82rem" }}>{error}</p>
                    <button
                      onClick={onCancel}
                      className="tech-button-secondary mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-secondary transition-colors"
                      style={{ fontSize: "0.875rem" }}
                    >
                      <ArrowLeft size={15} />
                      返回重新上传
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="tech-panel rounded-3xl p-5">
                <div className="tech-content">
                  <p className="text-muted-foreground" style={{ fontSize: "0.85rem" }}>
                    AI 正在调用 HivisionIDPhotos 生成统一证件照，并合成先马电商工牌。整个过程约需 <strong className="text-foreground">5–15 秒</strong>，完成后将自动跳转至结果页。
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="tech-panel rounded-3xl p-5 flex flex-col items-center">
            <div className="tech-content w-full flex flex-col items-center">
              <p className="text-foreground mb-4 self-start" style={{ fontSize: "0.875rem", fontWeight: 650 }}>Badge Preview</p>
              <div className="relative">
                <div className="absolute -inset-4 rounded-[2rem] bg-primary/20 blur-2xl" />
                <div className="relative w-56 rounded-3xl border border-white/10 overflow-hidden shadow-2xl bg-white">
                  <div className="bg-primary px-4 py-4 flex items-center justify-between">
                    <span className="text-primary-foreground" style={{ fontSize: "0.78rem", fontWeight: 800, letterSpacing: "0.08em" }}>XIANMA-EC</span>
                    <IdCard size={16} className="text-primary-foreground" style={{ opacity: 0.85 }} />
                  </div>
                  <div className="mx-auto mt-5 w-20 h-24 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center">
                    <Loader2 size={20} className="text-slate-500 animate-spin" />
                  </div>
                  <div className="p-5 space-y-2">
                    <div className="h-4 bg-slate-200 rounded" style={{ width: "72%" }} />
                    <div className="h-3 bg-slate-100 rounded" style={{ width: "58%" }} />
                    <div className="h-3 bg-slate-100 rounded" style={{ width: "48%" }} />
                    <div className="h-3 bg-slate-100 rounded" style={{ width: "42%" }} />
                  </div>
                  <div className="mx-auto mb-5 w-12 h-12 bg-slate-100 rounded" />
                </div>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-2 w-full">
                {QUALITY_ITEMS.map(item => (
                  <div key={item} className="rounded-2xl border border-border bg-black/20 px-3 py-2">
                    <p className="text-muted-foreground" style={{ fontSize: "0.72rem" }}>{item}</p>
                    <p className="text-primary mt-0.5" style={{ fontSize: "0.9rem", fontWeight: 700 }}>Checking</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
