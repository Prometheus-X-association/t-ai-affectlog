import React from "react";
import { Check } from "lucide-react";
import clsx from "clsx";

export interface WizardStep {
  number: number;
  label: string;
  sublabel?: string;
}

export const WIZARD_STEPS: WizardStep[] = [
  { number: 1, label: "Input Source", sublabel: "Upload or connect" },
  { number: 2, label: "Format Detection", sublabel: "Auto-detect schema" },
  { number: 3, label: "Schema Mapping", sublabel: "Confirm fields" },
  { number: 4, label: "Privacy Review", sublabel: "PII and controls" },
  { number: 5, label: "Model Context", sublabel: "Optional" },
  { number: 6, label: "Analysis Scope", sublabel: "Select analyses" },
  { number: 7, label: "Plot Selection", sublabel: "Choose visuals" },
  { number: 8, label: "Output Contract", sublabel: "Review & approve" },
  { number: 9, label: "Run Progress", sublabel: "Execute pipeline" },
  { number: 10, label: "Results", sublabel: "Findings & artifacts" },
];

interface WizardProgressProps {
  currentStep: number;
  completedSteps: Set<number>;
  onStepClick?: (step: number) => void;
}

export function WizardProgress({ currentStep, completedSteps, onStepClick }: WizardProgressProps) {
  return (
    <nav className="flex flex-col gap-0.5 py-4 px-2">
      {WIZARD_STEPS.map((step) => {
        const isCompleted = completedSteps.has(step.number);
        const isCurrent = currentStep === step.number;
        const isClickable = isCompleted || isCurrent;

        return (
          <button
            key={step.number}
            disabled={!isClickable}
            onClick={() => isClickable && onStepClick?.(step.number)}
            className={clsx(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-all w-full",
              isCurrent && "bg-indigo-700/25 text-white",
              isCompleted && !isCurrent && "text-slate-400 hover:bg-slate-800 hover:text-slate-300",
              !isCompleted && !isCurrent && "text-slate-600 cursor-default",
            )}
          >
            <span
              className={clsx(
                "flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border text-xs font-bold transition-all",
                isCurrent && "border-indigo-500 bg-indigo-500 text-white",
                isCompleted && !isCurrent && "border-emerald-500/50 bg-emerald-500/20 text-emerald-400",
                !isCompleted && !isCurrent && "border-slate-700 text-slate-600",
              )}
            >
              {isCompleted && !isCurrent ? <Check size={10} /> : step.number}
            </span>
            <span className="min-w-0">
              <span className="block text-xs font-medium leading-tight truncate">{step.label}</span>
              {step.sublabel && (
                <span className="block text-[10px] text-slate-600 truncate">{step.sublabel}</span>
              )}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
