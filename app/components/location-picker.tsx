'use client';

import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export interface LocationPickerProps {
  currentLocation: string;
  onLocationChange: (location: string) => void;
  disabled?: boolean;
}

export function LocationPicker({
  currentLocation,
  onLocationChange,
  disabled = false,
}: LocationPickerProps) {
  // Parse current location into row and column
  const [row, setRow] = useState(() => {
    const match = currentLocation.match(/([A-Z]+)(\d+)/);
    return match ? match[1] : 'A';
  });
  
  const [column, setColumn] = useState(() => {
    const match = currentLocation.match(/([A-Z]+)(\d+)/);
    return match ? match[2] : '1';
  });

  const handleRowChange = (value: string) => {
    setRow(value);
    onLocationChange(`${value}${column}`);
  };

  const handleColumnChange = (value: string) => {
    setColumn(value);
    onLocationChange(`${row}${value}`);
  };

  return (
    <div className="flex gap-4">
      <Select
        value={row}
        onValueChange={handleRowChange}
        disabled={disabled}
      >
        <SelectTrigger className="w-24">
          <SelectValue placeholder="Row" />
        </SelectTrigger>
        <SelectContent>
          {['A', 'B', 'C', 'D', 'E', 'F'].map((r) => (
            <SelectItem key={r} value={r}>
              Row {r}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={column}
        onValueChange={handleColumnChange}
        disabled={disabled}
      >
        <SelectTrigger className="w-24">
          <SelectValue placeholder="Column" />
        </SelectTrigger>
        <SelectContent>
          {Array.from({ length: 10 }, (_, i) => String(i + 1)).map((c) => (
            <SelectItem key={c} value={c}>
              Column {c}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
} 