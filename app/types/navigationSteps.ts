export interface NavigationStep {
  title: string;
  description: string;
  status: "completed" | "current" | "empty";
  route: string;
}
