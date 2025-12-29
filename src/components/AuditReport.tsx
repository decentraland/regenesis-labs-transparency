import { FileText, CheckCircle, AlertCircle, Clock } from "lucide-react";

const auditReports = [
  {
    id: 1,
    title: "Q4 2024 Financial Audit",
    date: "Dec 15, 2024",
    status: "completed",
    auditor: "Deloitte",
  },
  {
    id: 2,
    title: "Smart Contract Security Audit",
    date: "Nov 28, 2024",
    status: "completed",
    auditor: "CertiK",
  },
  {
    id: 3,
    title: "Q1 2025 Treasury Review",
    date: "Jan 15, 2025",
    status: "pending",
    auditor: "KPMG",
  },
  {
    id: 4,
    title: "Annual Compliance Report",
    date: "Feb 01, 2025",
    status: "in-progress",
    auditor: "PwC",
  },
];

const statusConfig = {
  completed: {
    icon: CheckCircle,
    label: "Completed",
    className: "text-green-500 bg-green-500/10",
  },
  pending: {
    icon: Clock,
    label: "Pending",
    className: "text-yellow-500 bg-yellow-500/10",
  },
  "in-progress": {
    icon: AlertCircle,
    label: "In Progress",
    className: "text-blue-500 bg-blue-500/10",
  },
};

export const AuditReport = () => {
  return (
    <div className="rounded-xl bg-card border border-border p-6 animate-fade-in" style={{ animationDelay: "400ms" }}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Audit Report</h3>
          <p className="text-sm text-muted-foreground">Recent audits and reviews</p>
        </div>
        <button className="text-sm text-primary hover:underline">View All</button>
      </div>

      <div className="space-y-4">
        {auditReports.map((report) => {
          const status = statusConfig[report.status as keyof typeof statusConfig];
          const StatusIcon = status.icon;

          return (
            <div
              key={report.id}
              className="flex items-center justify-between p-4 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="p-2 rounded-lg bg-primary/10">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">{report.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {report.auditor} • {report.date}
                  </p>
                </div>
              </div>

              <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${status.className}`}>
                <StatusIcon className="h-4 w-4" />
                <span className="text-sm font-medium">{status.label}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
