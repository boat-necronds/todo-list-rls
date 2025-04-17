// Dependencies: pnpm install lucide-react

'use client';

import { Input } from '@workspace/ui/components/input.js';
import { Check, Eye, EyeOff, X } from 'lucide-react';
import { InputHTMLAttributes, useMemo, useState } from 'react';

type InputPasswordProps = InputHTMLAttributes<HTMLInputElement> & {
  showStrength?: boolean;
};

export const InputPassword = ({ id, name, showStrength = true, ...props }: InputPasswordProps) => {
  const [password, setPassword] = useState('');
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isDirty, setIsDirty] = useState<boolean>(false);

  const toggleVisibility = () => setIsVisible(prevState => !prevState);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    if (!isDirty && value.length > 0) {
      setIsDirty(true);
    }
  };

  const checkStrength = (pass: string) => {
    const requirements = [
      { regex: /.{8,}/, text: 'At least 8 characters' },
      { regex: /[0-9]/, text: 'At least 1 number' },
      { regex: /[a-z]/, text: 'At least 1 lowercase letter' },
      { regex: /[A-Z]/, text: 'At least 1 uppercase letter' },
    ];

    return requirements.map(req => ({
      met: req.regex.test(pass),
      text: req.text,
    }));
  };

  const strength = checkStrength(password);

  const strengthScore = useMemo(() => {
    return strength.filter(req => req.met).length;
  }, [strength]);

  const getStrengthColor = (score: number) => {
    if (score === 0) return 'bg-border';
    if (score <= 1) return 'bg-red-500';
    if (score <= 2) return 'bg-orange-500';
    if (score === 3) return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  const getStrengthText = (score: number) => {
    if (score === 0) return 'Enter a password';
    if (score <= 2) return 'Weak password';
    if (score === 3) return 'Medium password';
    return 'Strong password';
  };

  return (
    <div>
      <div className="space-y-2">
        <div className="relative">
          <Input
            id={id}
            name={name}
            className="pe-9"
            placeholder="Password"
            type={isVisible ? 'text' : 'password'}
            value={password}
            aria-invalid={strengthScore < 4}
            aria-describedby="password-strength"
            {...props}
            onChange={e => {
              handlePasswordChange(e);
              props.onChange?.(e);
            }}
          />
          <button
            className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-lg text-muted-foreground/80 transition-shadow hover:text-foreground focus-visible:border focus-visible:border-ring focus-visible:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
            type="button"
            onClick={toggleVisibility}
            aria-label={isVisible ? 'Hide password' : 'Show password'}
            aria-pressed={isVisible}
            aria-controls="password"
          >
            {isVisible ? (
              <EyeOff size={16} strokeWidth={2} aria-hidden="true" />
            ) : (
              <Eye size={16} strokeWidth={2} aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {showStrength && isDirty && (
        <>
          <div
            className="mb-4 mt-3 h-1 w-full overflow-hidden rounded-full bg-border"
            role="progressbar"
            aria-valuenow={strengthScore}
            aria-valuemin={0}
            aria-valuemax={4}
            aria-label="Password strength"
          >
            <div
              className={`h-full ${getStrengthColor(
                strengthScore
              )} transition-all duration-500 ease-out`}
              style={{ width: `${(strengthScore / 4) * 100}%` }}
            ></div>
          </div>

          {/* Password strength description */}
          <p id="password-strength" className="mb-2 text-sm font-medium text-foreground">
            {getStrengthText(strengthScore)}. Must contain:
          </p>

          {/* Password requirements list */}
          <ul className="space-y-1.5" aria-label="Password requirements">
            {strength.map((req, index) => (
              <li key={index} className="flex items-center gap-2">
                {req.met ? (
                  <Check size={16} className="text-emerald-500" aria-hidden="true" />
                ) : (
                  <X size={16} className="text-muted-foreground/80" aria-hidden="true" />
                )}
                <span
                  className={`text-xs ${req.met ? 'text-emerald-600' : 'text-muted-foreground'}`}
                >
                  {req.text}
                  <span className="sr-only">
                    {req.met ? ' - Requirement met' : ' - Requirement not met'}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default InputPassword;
