export type LocaleCode = "es" | "en" | "zh" | "hi" | "de" | "fr";

export interface LocaleInfo {
  code: LocaleCode;
  name: string;
  nativeName: string;
  flag: string;
  dir: "ltr" | "rtl";
}

export interface CommonTranslations {
  cancel: string;
  save: string;
  loading: string;
  search: string;
  filter: string;
  export: string;
  import: string;
  delete: string;
  edit: string;
  create: string;
  update: string;
  confirm: string;
  back: string;
  next: string;
  previous: string;
  finish: string;
  saveChanges: string;
  new: string;
}

export interface NavigationTranslations {
  dashboard: string;
  registro: string;
  documentacion: string;
  gestion: string;
  storage: string;
  features: string;
  sociedades: string;
  accionistas: string;
  administradores: string;
  domicilios: string;
  certificados: string;
  juntas: string;
  actas: string;
  temas: string;
  votacion: string;
  librosAccionistas: string;
  librosActas: string;
  documentosGenerados: string;
  plantillasGuardadas: string;
  chatIA: string;
  calculadoraLegal: string;
  ayuda: string;
}

export interface DashboardTranslations {
  title: string;
  subtitle: string;
  companiesRegistered: string;
  documentsGenerated: string;
  activeUsers: string;
  aiQueries: string;
  recentActivity: string;
  quickAccess: string;
  mostUsedFunctions: string;
  newCompany: string;
  consultAI: string;
  viewDocuments: string;
  sinceLastMonth: string;
  registered: string;
  generated: string;
}

export interface ConfigTranslations {
  title: string;
  administration: string;
  personal: string;
  integrations: string;
  preferences: string;
  appearance: string;
  selectTheme: string;
  lightTheme: string;
  darkTheme: string;
  systemTheme: string;
  language: string;
  selectLanguage: string;
  typography: string;
  primaryFont: string;
  secondaryFont: string;
  dashboard: string;
  billing: string;
  users: string;
  general: string;
  profile: string;
  gmail: string;
  googleDrive: string;
}

export interface UserTranslations {
  profile: string;
  configuration: string;
  help: string;
  planService: string;
  logout: string;
  settings: string;
}

export interface ValidationTranslations {
  required: string;
  email: string;
  minLength: string;
  maxLength: string;
  numeric: string;
  alphanumeric: string;
}

export interface MessagesTranslations {
  success: string;
  error: string;
  warning: string;
  info: string;
  confirmDelete: string;
  noData: string;
  loadingData: string;
}

export interface TimeTranslations {
  hoursAgo: string;
  minutesAgo: string;
  daysAgo: string;
  today: string;
  yesterday: string;
  thisWeek: string;
  lastWeek: string;
  thisMonth: string;
  lastMonth: string;
}

export interface ThemeTranslations {
  light: string;
  dark: string;
  system: string;
  current: string;
  systemFollow: string;
}

export interface TranslationSchema {
  common: CommonTranslations;
  navigation: NavigationTranslations;
  dashboard: DashboardTranslations;
  config: ConfigTranslations;
  user: UserTranslations;
  validation: ValidationTranslations;
  messages: MessagesTranslations;
  time: TimeTranslations;
  theme: ThemeTranslations;
}
