import {
  Apple,
  Bell,
  Dumbbell,
  LayoutDashboard,
  type LucideIcon,
  NotebookText,
  Sliders,
  Trophy,
  User,
  Users,
} from "lucide-react";

export interface NAVIGATION {
  id: number;
  href: string;
  icon: LucideIcon;
  label: string;
}

export const DASHBOARD_TABS: NAVIGATION[] = [
  {
    id: 1,
    href: "/dashboard",
    icon: LayoutDashboard,
    label: "Dashboard",
  },
  {
    id: 2,
    href: "/dashboard/meals",
    icon: Apple,
    label: "Meals",
  },
  {
    id: 3,
    href: "/dashboard/workouts",
    icon: Dumbbell,
    label: "Workouts",
  },
  {
    id: 4,
    href: "/dashboard/quests",
    icon: Trophy,
    label: "Quests",
  },
  {
    id: 5,
    href: "/dashboard/friends",
    icon: Users,
    label: "Friends",
  },
];

export const PROFILE_TABS: NAVIGATION[] = [
  {
    id: 1,
    href: "/dashboard/profile",
    label: "Overview",
    icon: User,
  },
  {
    id: 2,
    href: "/dashboard/profile/preferences",
    label: "Preferences",
    icon: Sliders,
  },
  {
    id: 3,
    href: "/dashboard/profile/notifications",
    label: "Notifications",
    icon: Bell,
  },
  {
    id: 4,
    href: "/dashboard/profile/billing",
    label: "Billing & Plans",
    icon: NotebookText,
  },
];
