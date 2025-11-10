export type SummaryStatus = "completed" | "pending" | "in-progress" | "optional";

export interface SummaryHighlight {
  id: string;
  label: string;
  value: string;
  description?: string;
  status?: SummaryStatus;
}

export interface SummaryBlock {
  id: string;
  title: string;
  description?: string;
  highlights?: SummaryHighlight[];
  notes?: string[];
}

export interface SummarySection {
  id: string;
  title: string;
  route: string;
  order: number;
  blocks: SummaryBlock[];
}

export interface SummaryRegistry {
  flowId: string;
  sections: SummarySection[];
}

