import * as React from "react";
import { Badge } from "./badge";
import { X } from "lucide-react";

import { cn } from "@clnt/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className,
      )}
      {...props}
    />
  );
}

interface StringArrayInputProps {
  value?: string[];
  onChange?: (value: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
}

function StringArrayInput({
  value = [],
  onChange,
  placeholder = "Type and press Enter...",
  disabled,
}: StringArrayInputProps) {
  const [inputValue, setInputValue] = React.useState("");

  const handleAddItem = (item: string) => {
    const trimmedItem = item.trim();
    if (trimmedItem && !value.includes(trimmedItem)) {
      onChange?.([...value, trimmedItem]);
    }
    setInputValue("");
  };

  const handleRemoveItem = (itemToRemove: string) => {
    onChange?.(value.filter((item) => item !== itemToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === "Enter" || e.key === ",") && inputValue) {
      e.preventDefault();
      handleAddItem(inputValue);
    }

    if (e.key === "Backspace" && !inputValue && value.length > 0) {
      handleRemoveItem(value[value.length - 1]);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {value.map((item) => (
          <Badge
            key={item}
            variant="secondary"
            className="py-1 px-2 text-sm flex items-center gap-1"
          >
            {item}
            {!disabled && (
              <button
                type="button"
                onClick={() => handleRemoveItem(item)}
                className="ml-1 hover:text-destructive"
                aria-label={`Remove ${item}`}
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </Badge>
        ))}
        {!disabled && (
          <Input
            className="max-w-48 grow"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
          />
        )}
      </div>
    </div>
  );
}

export { Input, StringArrayInput };
