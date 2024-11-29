"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface LocationPickerProps {
  currentLocation?: string;
  onLocationChange?: (location: string) => void;
}

const SHELF_ROWS = ["A", "B", "C", "D"];
const SHELF_COLUMNS = Array.from({ length: 5 }, (_, i) => (i + 1).toString());

export function LocationPicker({ currentLocation, onLocationChange }: LocationPickerProps) {
  const row = currentLocation?.charAt(0) || "";
  const column = currentLocation?.slice(1) || "";

  const handleRowChange = (newRow: string) => {
    if (onLocationChange) {
      onLocationChange(column ? `${newRow}${column}` : newRow);
    }
  };

  const handleColumnChange = (newColumn: string) => {
    if (onLocationChange) {
      onLocationChange(row ? `${row}${newColumn}` : newColumn);
    }
  };

  return (
    <div className="flex gap-4">
      <Select value={row} onValueChange={handleRowChange}>
        <SelectTrigger className="w-[120px]">
          <SelectValue placeholder="Select row" />
        </SelectTrigger>
        <SelectContent>
          {SHELF_ROWS.map((r) => (
            <SelectItem key={r} value={r}>
              Row {r}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={column} onValueChange={handleColumnChange}>
        <SelectTrigger className="w-[120px]">
          <SelectValue placeholder="Select column" />
        </SelectTrigger>
        <SelectContent>
          {SHELF_COLUMNS.map((c) => (
            <SelectItem key={c} value={c}>
              Column {c}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}