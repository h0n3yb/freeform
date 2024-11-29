export type PieceStatus = "GREENWARE" | "BISQUED" | "GLAZED" | "COMPLETED" | "PICKED_UP";
export type FilterStatus = "all" | PieceStatus;

export const ALL_STATUSES: PieceStatus[] = ["GREENWARE", "BISQUED", "GLAZED", "COMPLETED", "PICKED_UP"];
export const ALL_FILTER_STATUSES: FilterStatus[] = ["all", ...ALL_STATUSES]; 