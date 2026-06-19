import { useState } from "react";
import { Download, Eye, RotateCcw, Search, ChevronLeft, ChevronRight, Users, CheckCircle, Clock, AlertTriangle } from "lucide-react";

type BadgeStatus = "待生成" | "生成中" | "已完成" | "需重传";

interface Employee {
  id: string;
  name: string;
  department: string;
  position: string;
  employeeId: string;
  status: BadgeStatus;
  submittedAt: string;
}

const MOCK_DATA: Employee[] = [
  { id: "1", name: "张明远", department: "技术部", position: "高级工程师", employeeId: "EMP-2024-001", status: "已完成", submittedAt: "2024-03-15 10:23" },
  { id: "2", name: "李雪莹", department: "产品部", position: "产品经理", employeeId: "EMP-2024-002", status: "已完成", submittedAt: "2024-03-15 10:45" },
  { id: "3", name: "王建国", department: "运营部", position: "运营专员", employeeId: "EMP-2024-003", status: "生成中", submittedAt: "2024-03-15 11:02" },
  { id: "4", name: "陈思琪", department: "设计部", position: "UI设计师", employeeId: "EMP-2024-004", status: "需重传", submittedAt: "2024-03-15 11:15" },
  { id: "5", name: "刘浩然", department: "市场部", position: "市场总监", employeeId: "EMP-2024-005", status: "已完成", submittedAt: "2024-03-15 11:30" },
  { id: "6", name: "赵雨桐", department: "技术部", position: "前端工程师", employeeId: "EMP-2024-006", status: "待生成", submittedAt: "2024-03-15 11:50" },
  { id: "7", name: "孙洪波", department: "财务部", position: "财务经理", employeeId: "EMP-2024-007", status: "已完成", submittedAt: "2024-03-15 12:05" },
  { id: "8", name: "周静怡", department: "HR部", position: "招聘专员", employeeId: "EMP-2024-008", status: "待生成", submittedAt: "2024-03-15 12:20" },
  { id: "9", name: "吴天宇", department: "技术部", position: "后端工程师", employeeId: "EMP-2024-009", status: "需重传", submittedAt: "2024-03-15 13:00" },
  { id: "10", name: "郑美玲", department: "客服部", position: "客服主管", employeeId: "EMP-2024-010", status: "已完成", submittedAt: "2024-03-15 13:15" },
];

const STATUS_CONFIG: Record<BadgeStatus, { bg: string; color: string; label: string }> = {
  "待生成": { bg: "#f3f4f6", color: "#6b7280", label: "待生成" },
  "生成中": { bg: "#fef9c3", color: "#b45309", label: "生成中" },
  "已完成": { bg: "#dcfce7", color: "#16a34a", label: "已完成" },
  "需重传": { bg: "#fee2e2", color: "#dc2626", label: "需重传" },
};

export function HRPage({ onNavigateToUpload }: { onNavigateToUpload: () => void }) {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<BadgeStatus | "全部">("全部");
  const [page, setPage] = useState(1);

  const filtered = MOCK_DATA.filter(e => {
    const matchSearch = e.name.includes(search) || e.department.includes(search) || e.employeeId.includes(search);
    const matchStatus = filterStatus === "全部" || e.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const pageSize = 8;
  const totalPages = Math.ceil(filtered.length / pageSize);
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  const stats = {
    total: MOCK_DATA.length,
    done: MOCK_DATA.filter(e => e.status === "已完成").length,
    pending: MOCK_DATA.filter(e => e.status === "待生成" || e.status === "生成中").length,
    retry: MOCK_DATA.filter(e => e.status === "需重传").length,
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="max-w-[1440px] mx-auto px-8 h-16 flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
            <span className="text-primary-foreground text-xs font-bold">AI</span>
          </div>
          <span className="text-foreground font-medium">AI智能工牌生成系统</span>
          <span className="text-muted-foreground text-sm ml-1">企业内部工具</span>
          <div className="ml-auto flex items-center gap-6 text-sm text-muted-foreground">
            <button onClick={onNavigateToUpload} className="hover:text-foreground transition-colors">工牌生成</button>
            <button className="text-foreground font-medium">HR管理</button>
          </div>
        </div>
      </header>

      {/* Page header */}
      <div className="bg-primary">
        <div className="max-w-[1440px] mx-auto px-8 py-6 flex items-center justify-between">
          <div>
            <p className="text-primary-foreground" style={{ opacity: 0.85, fontSize: "0.875rem" }}>人力资源管理</p>
            <h1 className="text-primary-foreground mt-0.5" style={{ fontSize: "1.375rem", fontWeight: 600 }}>员工工牌生成管理</h1>
          </div>
          <button
            onClick={onNavigateToUpload}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-primary bg-primary-foreground hover:opacity-90 transition-opacity"
            style={{ fontSize: "0.875rem", fontWeight: 600 }}
          >
            + 新增工牌
          </button>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-8 py-6">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            { label: "总人数", value: stats.total, icon: Users, color: "#1a1a2e", bg: "#f0f1f4" },
            { label: "已完成", value: stats.done, icon: CheckCircle, color: "#16a34a", bg: "#dcfce7" },
            { label: "待处理", value: stats.pending, icon: Clock, color: "#b45309", bg: "#fef9c3" },
            { label: "需重传", value: stats.retry, icon: AlertTriangle, color: "#dc2626", bg: "#fee2e2" },
          ].map(({ label, value, icon: Icon, color, bg }) => (
            <div key={label} className="bg-card rounded-xl border border-border p-5 flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: bg }}>
                <Icon size={20} style={{ color }} />
              </div>
              <div>
                <p className="text-muted-foreground" style={{ fontSize: "0.8rem" }}>{label}</p>
                <p className="text-foreground" style={{ fontSize: "1.5rem", fontWeight: 700, lineHeight: 1.2 }}>{value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          {/* Toolbar */}
          <div className="px-5 py-4 border-b border-border flex items-center gap-3">
            <div className="relative flex-1 max-w-xs">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                className="w-full pl-9 pr-3 py-2 bg-input-background rounded-lg border border-border text-foreground placeholder:text-muted-foreground outline-none focus:border-primary transition-colors"
                style={{ fontSize: "0.875rem" }}
                placeholder="搜索姓名、部门、工号"
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1); }}
              />
            </div>
            <div className="flex items-center gap-2">
              {(["全部", "待生成", "生成中", "已完成", "需重传"] as const).map(s => (
                <button
                  key={s}
                  onClick={() => { setFilterStatus(s); setPage(1); }}
                  className={`px-3 py-1.5 rounded-lg transition-colors`}
                  style={{
                    fontSize: "0.8rem",
                    fontWeight: filterStatus === s ? 600 : 400,
                    background: filterStatus === s ? "var(--primary)" : "var(--secondary)",
                    color: filterStatus === s ? "#fff" : "var(--muted-foreground)",
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
            <span className="ml-auto text-muted-foreground" style={{ fontSize: "0.8rem" }}>{filtered.length} 条记录</span>
          </div>

          {/* Table Header */}
          <div className="grid px-5 py-3 bg-secondary border-b border-border" style={{ gridTemplateColumns: "1.5fr 1fr 1.5fr 1fr 1fr 1.2fr 1.2fr" }}>
            {["姓名", "部门", "岗位", "工号", "状态", "提交时间", "操作"].map(col => (
              <span key={col} className="text-muted-foreground" style={{ fontSize: "0.78rem", fontWeight: 600 }}>{col}</span>
            ))}
          </div>

          {/* Table Rows */}
          {paged.map((emp, i) => {
            const cfg = STATUS_CONFIG[emp.status];
            return (
              <div key={emp.id} className={`grid px-5 py-3.5 border-b border-border items-center hover:bg-secondary/50 transition-colors ${i === paged.length - 1 ? "border-b-0" : ""}`} style={{ gridTemplateColumns: "1.5fr 1fr 1.5fr 1fr 1fr 1.2fr 1.2fr" }}>
                <span className="text-foreground" style={{ fontSize: "0.875rem", fontWeight: 500 }}>{emp.name}</span>
                <span className="text-muted-foreground" style={{ fontSize: "0.875rem" }}>{emp.department}</span>
                <span className="text-muted-foreground" style={{ fontSize: "0.875rem" }}>{emp.position}</span>
                <span className="text-muted-foreground font-mono" style={{ fontSize: "0.8rem" }}>{emp.employeeId}</span>
                <span>
                  <span className="px-2 py-0.5 rounded" style={{ fontSize: "0.75rem", fontWeight: 600, background: cfg.bg, color: cfg.color }}>{cfg.label}</span>
                </span>
                <span className="text-muted-foreground" style={{ fontSize: "0.78rem" }}>{emp.submittedAt}</span>
                <div className="flex items-center gap-2">
                  <button className="p-1.5 rounded hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground" title="预览工牌">
                    <Eye size={14} />
                  </button>
                  {emp.status === "已完成" && (
                    <button className="p-1.5 rounded hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground" title="下载">
                      <Download size={14} />
                    </button>
                  )}
                  {emp.status === "需重传" && (
                    <button className="flex items-center gap-1 px-2 py-1 rounded text-xs bg-accent text-accent-foreground hover:opacity-80 transition-opacity">
                      <RotateCcw size={11} />
                      退回重传
                    </button>
                  )}
                </div>
              </div>
            );
          })}

          {paged.length === 0 && (
            <div className="py-12 text-center text-muted-foreground" style={{ fontSize: "0.875rem" }}>暂无匹配记录</div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4">
            <span className="text-muted-foreground" style={{ fontSize: "0.8rem" }}>第 {page} / {totalPages} 页，共 {filtered.length} 条</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-1.5 rounded border border-border bg-card disabled:opacity-40 hover:bg-secondary transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className="w-8 h-8 rounded border transition-colors"
                  style={{
                    fontSize: "0.8rem",
                    fontWeight: page === p ? 600 : 400,
                    background: page === p ? "var(--primary)" : "var(--card)",
                    color: page === p ? "#fff" : "var(--foreground)",
                    borderColor: page === p ? "var(--primary)" : "var(--border)",
                  }}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-1.5 rounded border border-border bg-card disabled:opacity-40 hover:bg-secondary transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
