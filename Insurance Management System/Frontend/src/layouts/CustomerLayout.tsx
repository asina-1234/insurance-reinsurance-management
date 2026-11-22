import PersonIcon from '@mui/icons-material/Person';
import DescriptionIcon from '@mui/icons-material/Description';
import AssignmentIcon from '@mui/icons-material/Assignment';
import SideMenuLayout, { type SideMenuItem } from './SideMenuLayout';

const MENU: SideMenuItem[] = [
  { label: 'Profile', path: '/customer/profile', icon: <PersonIcon /> },
  { label: 'Policies', path: '/customer/policies', icon: <DescriptionIcon /> },
  { label: 'Claims', path: '/customer/claims', icon: <AssignmentIcon /> },
];

export default function CustomerLayout() {
  return <SideMenuLayout menu={MENU} />;
}