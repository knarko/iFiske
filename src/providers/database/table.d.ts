export interface TableDef {
  name: string;
  primary?: string;
  members: {
    [column: string]: "int" | "real" | "boolean" | "string" | "text";
  };
  apiMethod?: string;
}
