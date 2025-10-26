import * as React from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LucideEye, LucideEyeOff } from "lucide-react";

export interface InputPasswordProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const InputPassword = React.forwardRef<HTMLInputElement, InputPasswordProps>(
  ({ className, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);
    return (
      <div className="relative w-full">
        <input
          type={showPassword ? "text" : "password"}
          className={cn(
            "border-input dark:bg-input/30 placeholder:text-muted-foreground focus-visible:ring-ring flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50",
            className,
          )}
          ref={ref}
          {...props}
        />
        <p className="text-muted-foreground absolute right-1 top-1 text-sm">
          <Button
            type="button"
            variant="ghost"
            className="h-7 w-7 p-0"
            onClick={() => {
              setShowPassword((showPassword) => !showPassword);
            }}
          >
            {showPassword ? (
              <LucideEyeOff className="size-4" />
            ) : (
              <LucideEye className="size-4" />
            )}
          </Button>
        </p>
      </div>
    );
  },
);
InputPassword.displayName = "InputPassword";

export { InputPassword };
