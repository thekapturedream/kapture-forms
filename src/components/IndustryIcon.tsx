import {
  Stethoscope,
  Users,
  Wallet,
  Scale,
  GraduationCap,
  UtensilsCrossed,
  Home,
  HardHat,
  Landmark,
  Truck,
  FileText,
  type LucideIcon,
} from "lucide-react";

const MAP: Record<string, LucideIcon> = {
  Healthcare: Stethoscope,
  "HR & people": Users,
  Finance: Wallet,
  "Legal & agreements": Scale,
  Legal: Scale,
  Education: GraduationCap,
  Hospitality: UtensilsCrossed,
  "Real estate": Home,
  Construction: HardHat,
  "Public sector": Landmark,
  Logistics: Truck,
};

export function IndustryIcon({
  name,
  size = 22,
  className,
}: {
  name: string;
  size?: number;
  className?: string;
}) {
  const Icon = MAP[name] ?? FileText;
  return <Icon size={size} className={className} strokeWidth={1.75} />;
}
