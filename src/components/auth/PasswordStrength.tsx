import { cn } from "@/lib/utils";

export const checkPasswordStrength = (password: string) => {
  const checks = {
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    symbol: /[^A-Za-z0-9]/.test(password),
  };
  const score = Object.values(checks).filter(Boolean).length;
  return { checks, score };
};

const labels = ["Too weak", "Weak", "Fair", "Good", "Strong", "Excellent"];
const colors = [
  "bg-muted",
  "bg-destructive",
  "bg-destructive",
  "bg-accent",
  "bg-secondary",
  "bg-primary",
];

interface Props {
  password: string;
}

const PasswordStrength = ({ password }: Props) => {
  const { checks, score } = checkPasswordStrength(password);
  if (!password) return null;

  return (
    <div className="mt-2 space-y-2">
      <div className="flex gap-1">
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={cn(
              "h-1 flex-1 rounded-full transition-smooth",
              i < score ? colors[score] : "bg-muted",
            )}
          />
        ))}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
        <span>
          Strength: <span className="font-medium text-foreground">{labels[score]}</span>
        </span>
        <ul className="flex flex-wrap gap-x-3 gap-y-1">
          <li className={checks.length ? "text-foreground" : ""}>8+ chars</li>
          <li className={checks.upper ? "text-foreground" : ""}>A-Z</li>
          <li className={checks.lower ? "text-foreground" : ""}>a-z</li>
          <li className={checks.number ? "text-foreground" : ""}>0-9</li>
          <li className={checks.symbol ? "text-foreground" : ""}>!@#</li>
        </ul>
      </div>
    </div>
  );
};

export default PasswordStrength;
