import {
  BarChart3,
  CalendarCheck,
  ClipboardList,
  History,
  Settings,
  Target
} from "lucide-react";

export const navItems = [
  { href: "/", label: "首页", icon: BarChart3 },
  { href: "/goals", label: "目标", icon: Target },
  { href: "/today", label: "今日", icon: CalendarCheck },
  { href: "/review", label: "复盘", icon: ClipboardList },
  { href: "/history", label: "历史", icon: History },
  { href: "/settings", label: "设置", icon: Settings }
];
