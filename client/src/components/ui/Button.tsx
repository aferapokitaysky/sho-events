import { forwardRef, type ReactNode } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import clsx from "clsx";
import { IconArrowRight } from "@/components/icons";

type Variant = "primary" | "ghost" | "outline" | "inverse" | "outline-inverse";

interface BaseProps {
  children: ReactNode;
  variant?: Variant;
  className?: string;
  icon?: boolean;
}

const variantClasses: Record<Variant, string> = {
  primary: "bg-wine-800 text-ivory hover:bg-wine-700",
  ghost: "bg-transparent text-ink hover:text-wine-700",
  outline: "border border-ink/25 text-ink hover:border-wine-700 hover:text-wine-700",
  inverse: "bg-ivory text-wine-900 hover:bg-beige-dark",
  "outline-inverse": "border border-ivory/30 text-ivory hover:border-ivory hover:bg-ivory hover:text-wine-900",
};

const shared =
  "group relative inline-flex items-center gap-3 whitespace-nowrap rounded-full px-7 py-3.5 kicker transition-colors duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]";

export const ButtonLink = forwardRef<HTMLAnchorElement, BaseProps & { to: string }>(
  ({ children, variant = "primary", className, icon = true, to }, ref) => {
    return (
      <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }} className="inline-block">
        <Link ref={ref} to={to} className={clsx(shared, variantClasses[variant], className)}>
          <span>{children}</span>
          {icon && (
            <span className="relative flex h-4 w-4 items-center justify-center overflow-hidden">
              <IconArrowRight className="h-4 w-4 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-6" />
              <IconArrowRight className="absolute h-4 w-4 -translate-x-6 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0" />
            </span>
          )}
        </Link>
      </motion.div>
    );
  },
);
ButtonLink.displayName = "ButtonLink";

interface ButtonProps extends BaseProps {
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  onClick?: () => void;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, variant = "primary", className, icon = true, type = "button", disabled, onClick }, ref) => {
    return (
      <motion.button
        ref={ref}
        type={type}
        disabled={disabled}
        onClick={onClick}
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.97 }}
        className={clsx(shared, variantClasses[variant], className, "disabled:opacity-50")}
      >
        <span>{children}</span>
        {icon && (
          <span className="relative flex h-4 w-4 items-center justify-center overflow-hidden">
            <IconArrowRight className="h-4 w-4 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-6" />
            <IconArrowRight className="absolute h-4 w-4 -translate-x-6 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0" />
          </span>
        )}
      </motion.button>
    );
  },
);
Button.displayName = "Button";
