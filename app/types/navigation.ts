export interface NavItem {
  id: string;
  label: string;
  translationKey: string;
  icon?: string;
  href?: string;
  hasSubmenu?: boolean;
  submenuItems?: NavItem[];
  requiresAuth?: boolean;
  roles?: string[];
}

export interface NavigationSection {
  id: string;
  title: string;
  translationKey: string;
  items: NavItem[];
  roles?: string[];
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
}
