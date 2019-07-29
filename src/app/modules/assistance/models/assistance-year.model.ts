export class AssistanceYear {
  year: number;
  apply: boolean;
  docsRequired: boolean = true;
  currentYear: number;
  isCutoffDate?: boolean;
  cutoffYear?: number;
  disabled: boolean;
  hasSpouse?: boolean;
  files?: any[];
  spouseFiles?: any[];
}
