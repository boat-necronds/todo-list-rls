// Dependencies: pnpm install lucide-react
'use client';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Input } from '@workspace/ui/components/input.js';
import { Check, Eye, EyeOff, X } from 'lucide-react';
import { useMemo, useState } from 'react';
export const InputPassword = ({ id, name, showStrength = true, ...props }) => {
    const [password, setPassword] = useState('');
    const [isVisible, setIsVisible] = useState(false);
    const [isDirty, setIsDirty] = useState(false);
    const toggleVisibility = () => setIsVisible(prevState => !prevState);
    const handlePasswordChange = (e) => {
        const value = e.target.value;
        setPassword(value);
        if (!isDirty && value.length > 0) {
            setIsDirty(true);
        }
    };
    const checkStrength = (pass) => {
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
    const getStrengthColor = (score) => {
        if (score === 0)
            return 'bg-border';
        if (score <= 1)
            return 'bg-red-500';
        if (score <= 2)
            return 'bg-orange-500';
        if (score === 3)
            return 'bg-amber-500';
        return 'bg-emerald-500';
    };
    const getStrengthText = (score) => {
        if (score === 0)
            return 'Enter a password';
        if (score <= 2)
            return 'Weak password';
        if (score === 3)
            return 'Medium password';
        return 'Strong password';
    };
    return (_jsxs("div", { children: [_jsx("div", { className: "space-y-2", children: _jsxs("div", { className: "relative", children: [_jsx(Input, { id: id, name: name, className: "pe-9", placeholder: "Password", type: isVisible ? 'text' : 'password', value: password, "aria-invalid": strengthScore < 4, "aria-describedby": "password-strength", ...props, onChange: e => {
                                handlePasswordChange(e);
                                props.onChange?.(e);
                            } }), _jsx("button", { className: "absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-lg text-muted-foreground/80 transition-shadow hover:text-foreground focus-visible:border focus-visible:border-ring focus-visible:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50", type: "button", onClick: toggleVisibility, "aria-label": isVisible ? 'Hide password' : 'Show password', "aria-pressed": isVisible, "aria-controls": "password", children: isVisible ? (_jsx(EyeOff, { size: 16, strokeWidth: 2, "aria-hidden": "true" })) : (_jsx(Eye, { size: 16, strokeWidth: 2, "aria-hidden": "true" })) })] }) }), showStrength && isDirty && (_jsxs(_Fragment, { children: [_jsx("div", { className: "mb-4 mt-3 h-1 w-full overflow-hidden rounded-full bg-border", role: "progressbar", "aria-valuenow": strengthScore, "aria-valuemin": 0, "aria-valuemax": 4, "aria-label": "Password strength", children: _jsx("div", { className: `h-full ${getStrengthColor(strengthScore)} transition-all duration-500 ease-out`, style: { width: `${(strengthScore / 4) * 100}%` } }) }), _jsxs("p", { id: "password-strength", className: "mb-2 text-sm font-medium text-foreground", children: [getStrengthText(strengthScore), ". Must contain:"] }), _jsx("ul", { className: "space-y-1.5", "aria-label": "Password requirements", children: strength.map((req, index) => (_jsxs("li", { className: "flex items-center gap-2", children: [req.met ? (_jsx(Check, { size: 16, className: "text-emerald-500", "aria-hidden": "true" })) : (_jsx(X, { size: 16, className: "text-muted-foreground/80", "aria-hidden": "true" })), _jsxs("span", { className: `text-xs ${req.met ? 'text-emerald-600' : 'text-muted-foreground'}`, children: [req.text, _jsx("span", { className: "sr-only", children: req.met ? ' - Requirement met' : ' - Requirement not met' })] })] }, index))) })] }))] }));
};
export default InputPassword;
