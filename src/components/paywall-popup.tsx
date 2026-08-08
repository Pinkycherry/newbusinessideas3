import { Link } from "@tanstack/react-router";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

/**
 * PROJECT_BRIEF.md Section 3.2 — shown by ValidateButton's Step 0 precondition
 * when the signed-in user has no active plan. Copy is per spec, not to be
 * genericized into a cold "upgrade required" dialog.
 */
export function PaywallPopup({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">
            Hold on — this one&apos;s worth doing right.
          </DialogTitle>
          <DialogDescription className="pt-2 text-sm leading-relaxed text-foreground/80">
            Everywhere else, someone&apos;s charging you $20 to $100 a month just to validate a
            handful of ideas. We&apos;re not charging you a rupee for the AI part — that&apos;s
            free, forever, on your own account. This small fee is just for our time and effort
            building this for you. ₹199 gets you 3 months. ₹399 gets you lifetime access, every
            future update, and unlimited validations. No subscriptions, no surprises.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-2 flex flex-col gap-2 sm:flex-row">
          <Link
            to="/pricing"
            onClick={() => onOpenChange(false)}
            className="sheen flex-1 rounded-full border border-border px-5 py-3 text-center text-sm font-semibold transition-all duration-300 hover:border-primary"
          >
            Get 3 Months — ₹199
          </Link>
          <Link
            to="/pricing"
            onClick={() => onOpenChange(false)}
            className="sheen flex-1 rounded-full bg-gradient-to-r from-primary to-ember px-5 py-3 text-center text-sm font-semibold text-primary-foreground shadow-[0_10px_36px_oklch(0.687_0.161_51.5/40%)] transition-all duration-300 hover:scale-[1.02]"
          >
            Get Lifetime — ₹399
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  );
}
