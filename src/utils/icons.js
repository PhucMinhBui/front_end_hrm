import {
  Home,
  Users,
  Building,
  Clock,
  Calendar,
  DollarSign,
  FileText,
  Settings,
  Bell,
} from "lucide-react";

const Icons = {
  render: (name, className) => {
    switch (name) {
      case "home":
        return <Home className={className} />;
      case "users":
        return <Users className={className} />;
      case "building":
        return <Building className={className} />;
      case "clock":
        return <Clock className={className} />;
      case "calendar":
        return <Calendar className={className} />;
      case "bell":
        return <Bell className={className} />;
      case "dollar-sign":
        return <DollarSign className={className} />;
      case "file-text":
        return <FileText className={className} />;
      case "settings":
        return <Settings className={className} />;
      default:
        return null;
    }
  },
};

export default Icons;
