import { Calendar, ExternalLink, CheckCircle, Clock, Circle } from "lucide-react";

type RoadmapStatus = "done" | "in-progress" | "not-started";

interface RoadmapItem {
  id: number;
  emoji: string;
  title: string;
  status: RoadmapStatus;
  progress: number;
  description?: string;
  quarter?: string;
}

const roadmapItems: RoadmapItem[] = [
  {
    id: 1,
    emoji: "📝",
    title: "Establish Executive Arm Legal & Financial Structure",
    status: "done",
    progress: 100,
    description: "Legal entity setup and financial governance framework",
    quarter: "Q2 2024",
  },
  {
    id: 2,
    emoji: "👛",
    title: "Deploy DAO Treasury Strategy (Design)",
    status: "in-progress",
    progress: 75,
    description: "Multi-sig wallet setup and treasury management protocols",
    quarter: "Q4 2024",
  },
  {
    id: 3,
    emoji: "📱",
    title: "Mobile V01 Release (Social Media)",
    status: "in-progress",
    progress: 60,
    description: "First mobile app version with social media integration",
    quarter: "Q4 2024",
  },
  {
    id: 4,
    emoji: "⚾",
    title: "Grants Program",
    status: "not-started",
    progress: 0,
    description: "Community grants for builders and creators",
    quarter: "Q1 2025",
  },
  {
    id: 5,
    emoji: "📱",
    title: "Mobile V02 Release (Engagement Layer)",
    status: "in-progress",
    progress: 35,
    description: "Enhanced engagement features and user interactions",
    quarter: "Q1 2025",
  },
  {
    id: 6,
    emoji: "🕹️",
    title: "Launch Multiplayer Game",
    status: "in-progress",
    progress: 45,
    description: "Interactive multiplayer gaming experience",
    quarter: "Q1 2025",
  },
  {
    id: 7,
    emoji: "🏗️",
    title: "Enhance In-World Builder Experience",
    status: "not-started",
    progress: 0,
    description: "Improved tools for world creation and customization",
    quarter: "Q2 2025",
  },
  {
    id: 8,
    emoji: "🌐",
    title: "Cross-Platform Integration",
    status: "not-started",
    progress: 0,
    description: "Seamless experience across web, mobile, and VR",
    quarter: "Q3 2025",
  },
];

const getStatusConfig = (status: RoadmapStatus) => {
  switch (status) {
    case "done":
      return {
        label: "Done",
        icon: CheckCircle,
        borderColor: "border-l-success",
        badgeClass: "bg-success/20 text-success",
        iconColor: "text-success",
      };
    case "in-progress":
      return {
        label: "In Progress",
        icon: Clock,
        borderColor: "border-l-primary",
        badgeClass: "bg-primary/20 text-primary",
        iconColor: "text-primary",
      };
    case "not-started":
      return {
        label: "Not Started",
        icon: Circle,
        borderColor: "border-l-muted-foreground",
        badgeClass: "bg-muted text-muted-foreground",
        iconColor: "text-muted-foreground",
      };
  }
};

export function Roadmap() {
  const doneCount = roadmapItems.filter((item) => item.status === "done").length;
  const inProgressCount = roadmapItems.filter((item) => item.status === "in-progress").length;
  const notStartedCount = roadmapItems.filter((item) => item.status === "not-started").length;
  const progress = Math.round((doneCount / roadmapItems.length) * 100);

  return (
    <div className="mt-8 rounded-xl bg-card border border-border overflow-hidden animate-slide-up" style={{ animationDelay: "500ms" }}>
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Roadmap
            </h3>
            <p className="text-sm text-muted-foreground mt-1">DCL Regenesis Labs project timeline and milestones</p>
          </div>
          <a
            href="https://confirmed-copper-f3a.notion.site/2d35f96e0b7080309d90ee08eeef20b3?v=2d35f96e0b708035acb5000cf950d66e"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors self-start sm:self-auto"
          >
            <span>Open Full Roadmap</span>
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>

        {/* Progress Stats */}
        <div className="mt-6 grid grid-cols-3 gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-success/20 flex items-center justify-center">
              <CheckCircle className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-xl font-bold text-foreground">{doneCount}</p>
              <p className="text-xs text-muted-foreground">Completed</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center">
              <Clock className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-xl font-bold text-foreground">{inProgressCount}</p>
              <p className="text-xs text-muted-foreground">In Progress</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
              <Circle className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-xl font-bold text-foreground">{notStartedCount}</p>
              <p className="text-xs text-muted-foreground">Upcoming</p>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
            <span>Overall Progress</span>
            <span>{progress}%</span>
          </div>
          <div className="h-2 rounded-full bg-secondary overflow-hidden">
            <div 
              className="h-full rounded-full bg-gradient-to-r from-[hsl(280_70%_55%)] via-[hsl(320_80%_55%)] to-[hsl(340_85%_60%)] transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
      
      {/* Roadmap Cards */}
      <div className="p-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {roadmapItems.map((item, index) => {
          const statusConfig = getStatusConfig(item.status);
          const StatusIcon = statusConfig.icon;
          
          return (
            <div 
              key={item.id}
              className={`rounded-lg bg-secondary/30 p-4 border-l-4 ${statusConfig.borderColor} hover:bg-secondary/50 transition-colors group`}
              style={{ animationDelay: `${600 + index * 50}ms` }}
            >
              <div className="flex items-start justify-between gap-2 mb-3">
                <span className="text-2xl">{item.emoji}</span>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusConfig.badgeClass} flex items-center gap-1`}>
                  <StatusIcon className="h-3 w-3" />
                  {statusConfig.label}
                </span>
              </div>
              <h4 className="font-medium text-foreground text-sm mb-2 group-hover:text-primary transition-colors">
                {item.title}
              </h4>
              {item.description && (
                <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                  {item.description}
                </p>
              )}
              
              {/* Progress Bar */}
              <div className="mb-3">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-muted-foreground">Progress</span>
                  <span className={`font-semibold ${item.progress === 100 ? 'text-success' : item.progress > 0 ? 'text-primary' : 'text-muted-foreground'}`}>
                    {item.progress}%
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${
                      item.progress === 100 
                        ? 'bg-success' 
                        : item.progress > 0 
                          ? 'bg-gradient-to-r from-[hsl(280_70%_55%)] to-[hsl(320_80%_55%)]' 
                          : 'bg-muted'
                    }`}
                    style={{ width: `${item.progress}%` }}
                  />
                </div>
              </div>

              {item.quarter && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  <span>{item.quarter}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
