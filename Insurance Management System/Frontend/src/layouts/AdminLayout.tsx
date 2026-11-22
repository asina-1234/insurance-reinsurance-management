import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import DescriptionIcon from '@mui/icons-material/Description';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PieChartIcon from '@mui/icons-material/PieChart';
import LayersIcon from '@mui/icons-material/Layers';
import SideMenuLayout, { type SideMenuItem } from './SideMenuLayout';

const MENU: SideMenuItem[] = [
  { label: 'Dashboard', path: '/admin/dashboard', icon: <DashboardIcon /> },
  { label: 'Customers', path: '/admin/customers', icon: <PeopleIcon /> },
  { label: 'Policies', path: '/admin/policies', icon: <DescriptionIcon /> },
  { label: 'Claims', path: '/admin/claims', icon: <AssignmentIcon /> },
  { label: 'Proportional Treaty', path: '/admin/proportional-treaty', icon: <PieChartIcon /> },
  {
    label: 'Non-Proportional Treaty',
    path: '/admin/non-proportional-treaty',
    icon: <LayersIcon />,
  },
];

export default function AdminLayout() {
  return <SideMenuLayout menu={MENU} />;
}