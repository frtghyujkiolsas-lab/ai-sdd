import { useCallback, useRef, useState } from "react";
import {
  AlertCircle,
  ArrowRight,
  Building2,
  Briefcase,
  CheckCircle,
  Cpu,
  Hash,
  IdCard,
  ShieldCheck,
  Sparkles,
  Upload,
  User,
} from "lucide-react";

interface EmployeeForm {
  name: string;
  department: string;
  position: string;
  employeeId: string;
}

interface UploadPageProps {
  onGenerate: (form: EmployeeForm, file: File) => void;
}

const WORKFLOW = [
  { title: "Face Detect", desc: "人脸区域、清晰度、遮挡检查" },
  { title: "ID Photo", desc: "抠图、补光、统一背景" },
  { title: "Compose", desc: "套入公司工牌模板" },
  { title: "Quality Check", desc: "字段、头像、导出规格检查" },
];

const QUALITY = ["Face clarity", "BG unified", "Template fit", "PNG ready"];

export function UploadPage({ onGenerate }: UploadPageProps) {
  const [form, setForm] = useState<EmployeeForm>({ name: "", department: "", position: "", employeeId: "" });
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [errors, setErrors] = useState<Partial<EmployeeForm & { file: string }>>({});
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (f: File) => {
    setFile(f);
    const reader = new FileReader();
    reader.onload = e => setPreview(e.target?.result as string);
    reader.readAsDataURL(f);
    setErrors(prev => ({ ...prev, file: undefined }));
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f && f.type.startsWith("image/")) handleFile(f);
  }, []);

  const validate = () => {
    const errs: Partial<EmployeeForm & { file: string }> = {};
    if (!form.name.trim()) errs.name = "请输入姓名";
    if (!form.department.trim()) errs.department = "请输入部门";
    if (!form.position.trim()) errs.position = "请输入岗位";
    if (!form.employeeId.trim()) errs.employeeId = "请输入工号";
    if (!file) errs.file = "请上传生活照";
    return errs;
  };

  const handleSubmit = () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    onGenerate(form, file!);
  };

  const fields = [
    { key: "name", label: "姓名", placeholder: "请输入员工姓名", icon: User },
    { key: "department", label: "部门", placeholder: "如：技术部、运营部", icon: Building2 },
    { key: "position", label: "岗位", placeholder: "如：高级工程师、产品经理", icon: Briefcase },
    { key: "employeeId", label: "工号", placeholder: "如：EMP-2024-001", icon: Hash },
  ] as const;

  return (
    <div className="tech-shell bg-background">
      <header className="tech-header">
        <div className="max-w-[1440px] mx-auto px-8 h-16 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl tech-button-primary flex items-center justify-center">
            <Sparkles size={18} />
          </div>
          <div>
            <span className="text-foreground font-semibold">AI Badge Studio</span>
            <span className="text-muted-foreground text-sm ml-2">智能工牌生成系统</span>
          </div>
          <div className="ml-auto flex items-center gap-6 text-sm text-muted-foreground">
            <button className="hover:text-foreground transition-colors">工牌生成</button>
            <button className="hover:text-foreground transition-colors">HR管理</button>
          </div>
        </div>
      </header>

      <main className="relative z-1 max-w-[1440px] mx-auto px-8 py-5">
        <div className="flex items-end justify-between gap-8 mb-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full tech-chip mb-3" style={{ fontSize: "0.78rem" }}>
              <Cpu size={14} />
              AI BADGE GENERATION WORKBENCH
            </div>
            <h1 className="tech-title-gradient" style={{ fontSize: "2rem", fontWeight: 780, letterSpacing: "-0.05em" }}>
              从生活照到统一员工工牌
            </h1>
            <p className="text-muted-foreground mt-2 max-w-3xl" style={{ fontSize: "0.95rem" }}>
              上传员工生活照，系统自动完成人脸检测、证件照标准化、模板合成和导出质检。这里展示的是完整 AI 处理链路，而不只是一个表单。
            </p>
          </div>
          <div className="hidden xl:flex items-center gap-3">
            {QUALITY.map(item => (
              <div key={item} className="tech-panel rounded-2xl px-4 py-3">
                <div className="tech-content flex items-center gap-2">
                  <ShieldCheck size={15} className="text-primary" />
                  <span className="text-muted-foreground" style={{ fontSize: "0.78rem" }}>{item}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-[315px_1fr_360px] gap-5">
          <section className="tech-panel rounded-3xl p-4">
            <div className="tech-content min-h-[650px] flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-primary" style={{ fontSize: "0.72rem", fontWeight: 750, letterSpacing: "0.14em" }}>CONTROL</p>
                  <h2 className="text-foreground" style={{ fontSize: "1rem", fontWeight: 700 }}>员工信息</h2>
                </div>
                <span className="px-2.5 py-1 rounded-full tech-chip" style={{ fontSize: "0.7rem" }}>Required</span>
              </div>

            <div className="space-y-2.5">
                {fields.map(({ key, label, placeholder, icon: Icon }) => (
                  <div key={key}>
                    <label className="block mb-1.5 text-muted-foreground" style={{ fontSize: "0.76rem" }}>
                      {label} <span className="text-primary">*</span>
                    </label>
                    <div className="relative">
                      <Icon size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <input
                      className={`tech-input w-full pl-9 pr-3 py-2 rounded-xl outline-none placeholder:text-muted-foreground ${errors[key] ? "border-primary" : ""}`}
                        style={{ fontSize: "0.84rem" }}
                        placeholder={placeholder}
                        value={form[key]}
                        onChange={e => {
                          setForm(prev => ({ ...prev, [key]: e.target.value }));
                          setErrors(prev => ({ ...prev, [key]: undefined }));
                        }}
                      />
                    </div>
                    {errors[key] && <p className="mt-1 text-primary flex items-center gap-1" style={{ fontSize: "0.72rem" }}><AlertCircle size={12} />{errors[key]}</p>}
                  </div>
                ))}
              </div>

              <div
                className={`mt-3 rounded-2xl border border-dashed cursor-pointer transition-all ${dragging ? "border-primary bg-primary/10" : errors.file ? "border-primary bg-primary/10" : "border-border hover:border-primary/60 hover:bg-primary/5"}`}
                onDragOver={e => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={onDrop}
                onClick={() => inputRef.current?.click()}
              >
                <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
                {preview ? (
                  <div className="p-3 flex items-center gap-3">
                    <img src={preview} alt="预览" className="w-14 h-[72px] rounded-xl object-cover border border-white/10" />
                    <div>
                      <div className="flex items-center gap-1.5" style={{ color: "#22c55e", fontSize: "0.78rem" }}>
                        <CheckCircle size={13} />
                        <span>{file?.name}</span>
                      </div>
                      <p className="text-muted-foreground mt-1" style={{ fontSize: "0.72rem" }}>点击可重新上传</p>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-secondary border border-border flex items-center justify-center">
                      <Upload size={19} className="text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-foreground" style={{ fontSize: "0.82rem", fontWeight: 650 }}>上传生活照</p>
                      <p className="text-muted-foreground" style={{ fontSize: "0.72rem" }}>JPG / PNG / WEBP</p>
                    </div>
                  </div>
                )}
              </div>
              {errors.file && <p className="mt-1.5 text-primary flex items-center gap-1" style={{ fontSize: "0.72rem" }}><AlertCircle size={12} />{errors.file}</p>}

              <button
                onClick={handleSubmit}
                className="tech-button-primary mt-4 w-full py-3 rounded-2xl transition-transform hover:-translate-y-0.5 active:translate-y-0"
                style={{ fontWeight: 700 }}
              >
                生成 AI 工牌
              </button>
            </div>
          </section>

          <section className="tech-panel rounded-3xl p-5 overflow-hidden">
            <div className="tech-content h-full">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <p className="text-primary" style={{ fontSize: "0.72rem", fontWeight: 750, letterSpacing: "0.14em" }}>AI CANVAS</p>
                  <h2 className="text-foreground" style={{ fontSize: "1.1rem", fontWeight: 720 }}>实时处理链路</h2>
                </div>
                <div className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-primary" style={{ fontSize: "0.74rem", fontWeight: 700 }}>4 STEPS</div>
              </div>

              <div className="relative min-h-[500px] rounded-[2rem] border border-border bg-black/20 overflow-hidden p-5">
                <div className="absolute inset-0 opacity-40" style={{
                  background:
                    "radial-gradient(circle at 24% 24%, rgba(239,59,45,.28), transparent 13rem), radial-gradient(circle at 72% 62%, rgba(239,59,45,.16), transparent 15rem)",
                }} />
                <div className="absolute left-[18%] right-[18%] top-[47%] h-px bg-gradient-to-r from-transparent via-primary to-transparent" />
                <div className="absolute left-1/2 top-[20%] bottom-[18%] w-px bg-gradient-to-b from-transparent via-primary/70 to-transparent" />

                <div className="relative grid grid-cols-[150px_1fr_150px] gap-4 h-full">
                  <div className="self-center rounded-3xl border border-border bg-black/35 p-4">
                    <p className="text-muted-foreground mb-3" style={{ fontSize: "0.74rem" }}>Source</p>
                    {preview ? (
                      <img src={preview} alt="上传预览" className="w-full aspect-[3/4] object-cover rounded-2xl border border-white/10" />
                    ) : (
                      <div className="w-full aspect-[3/4] rounded-2xl border border-dashed border-border bg-secondary/40 flex flex-col items-center justify-center text-muted-foreground">
                        <Upload size={22} />
                        <span className="mt-2" style={{ fontSize: "0.72rem" }}>Waiting photo</span>
                      </div>
                    )}
                  </div>

                  <div className="relative flex flex-col justify-center gap-4">
                    {WORKFLOW.map((step, index) => (
                      <div key={step.title} className="group relative rounded-3xl border border-border bg-[rgba(8,13,25,.76)] p-4 shadow-2xl">
                        <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-primary shadow-[0_0_24px_rgba(239,59,45,.75)]" />
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-2xl tech-button-primary flex items-center justify-center shrink-0" style={{ fontWeight: 800 }}>{index + 1}</div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <p className="text-foreground" style={{ fontSize: "0.9rem", fontWeight: 730 }}>{step.title}</p>
                              <span className="text-primary" style={{ fontSize: "0.72rem", fontWeight: 700 }}>Ready</span>
                            </div>
                          <p className="text-muted-foreground mt-1" style={{ fontSize: "0.72rem" }}>{step.desc}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="self-center rounded-3xl border border-primary/30 bg-primary/10 p-4">
                    <p className="text-muted-foreground mb-3" style={{ fontSize: "0.74rem" }}>ID Photo</p>
                    <div className="w-full aspect-[3/4] rounded-2xl bg-white/95 border border-white/20 flex items-center justify-center overflow-hidden">
                      {preview ? (
                        <img src={preview} alt="证件照预览" className="w-full h-full object-cover grayscale-[0.08] brightness-110" />
                      ) : (
                        <User size={34} className="text-slate-400" />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="badge-showroom-card rounded-3xl p-5">
            <div className="tech-content h-full flex flex-col">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <p className="text-primary" style={{ fontSize: "0.72rem", fontWeight: 750, letterSpacing: "0.14em" }}>OUTPUT</p>
                  <h2 className="text-foreground" style={{ fontSize: "1.1rem", fontWeight: 720 }}>Badge Hero</h2>
                </div>
                <IdCard size={20} className="text-primary" />
              </div>

              <div className="badge-stage badge-stage-showroom badge-stage-compact mt-1 flex-1">
                <div className="badge-strap" />
                <div className="badge-sleeve">
                  <div className="w-[245px] rounded-[1.75rem] bg-white p-3 shadow-2xl">
                    <div className="rounded-t-[1.25rem] bg-primary px-5 py-5">
                      <p className="text-white" style={{ fontSize: "1rem", fontWeight: 850, letterSpacing: "0.08em" }}>XIANMA-EC</p>
                      <p className="text-white/70 mt-1" style={{ fontSize: "0.55rem", letterSpacing: "0.3em" }}>EMPLOYEE BADGE</p>
                    </div>
                    <div className="px-5 py-6">
                      <div className="mx-auto h-[112px] w-24 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-lg">
                        {preview ? <img src={preview} className="w-full h-full object-cover" alt="工牌头像预览" /> : null}
                      </div>
                      <div className="mt-5 space-y-2.5">
                        {[
                          ["姓名", form.name || "NAME"],
                          ["部门", form.department || "DEPT"],
                          ["岗位", form.position || "TITLE"],
                          ["工号", form.employeeId || "ID"],
                        ].map(([label, value]) => (
                          <div key={label} className="flex items-center gap-3">
                            <span className="w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center" style={{ fontSize: "0.58rem" }}>●</span>
                            <span className="text-slate-400" style={{ fontSize: "0.62rem" }}>{label}</span>
                            <span className="text-slate-800 ml-auto" style={{ fontSize: "0.72rem", fontWeight: 800 }}>{value}</span>
                          </div>
                        ))}
                      </div>
                      <div className="mx-auto mt-5 w-14 h-14 rounded-lg bg-slate-100 border border-slate-200" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-4">
                {QUALITY.map(item => (
                  <div key={item} className="rounded-2xl border border-white/10 bg-black/28 px-3 py-2 shadow-sm backdrop-blur">
                    <p className="text-muted-foreground" style={{ fontSize: "0.7rem" }}>{item}</p>
                    <p className="text-primary mt-0.5" style={{ fontSize: "0.82rem", fontWeight: 750 }}>Ready</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
