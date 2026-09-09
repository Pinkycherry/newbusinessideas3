import { Check, Link2, Linkedin, Twitter } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { cn } from "@/lib/utils";

/**
 * A share control that unrolls its destinations sideways.
 *
 * Adapted from Kokonut UI's social button (MIT). Upstream flips to solid black
 * tiles; these are plates in brand ink so they belong to the page. Instagram
 * is dropped — it has no web share URL and the upstream button did nothing.
 *
 * Copy reports success in place rather than firing a toast, so the control
 * answers its own action.
 */
export default function ShareLinks({ url, title }: { url: string; title: string }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const copy = () => {
    void navigator.clipboard?.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    });
  };

  const targets = [
    {
      label: "Share on X",
      icon: Twitter,
      href: `https://x.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
    },
    {
      label: "Share on LinkedIn",
      icon: Linkedin,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    },
  ];

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:border-primary/50"
      >
        <Link2 aria-hidden className="h-4 w-4" />
        Share
      </button>

      <motion.div
        initial={false}
        animate={{ width: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.28, ease: [0.23, 1, 0.32, 1] }}
        className="ml-2 flex items-center gap-2 overflow-hidden motion-reduce:transition-none"
      >
        {targets.map((t) => (
          <a
            key={t.label}
            href={t.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t.label}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-md border border-border bg-card text-foreground transition-colors hover:border-primary/50 hover:text-primary"
          >
            <t.icon aria-hidden className="h-4 w-4" />
          </a>
        ))}
        <button
          type="button"
          onClick={copy}
          aria-label={copied ? "Link copied" : "Copy link"}
          className={cn(
            "grid h-9 w-9 shrink-0 place-items-center rounded-md border border-border bg-card transition-colors",
            copied
              ? "border-hl-green/50 text-hl-green"
              : "text-foreground hover:border-primary/50 hover:text-primary",
          )}
        >
          {copied ? (
            <Check aria-hidden className="h-4 w-4" />
          ) : (
            <Link2 aria-hidden className="h-4 w-4" />
          )}
        </button>
      </motion.div>
    </div>
  );
}
