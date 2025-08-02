import { ReactNode } from 'react';

interface Props {
  title?: string;
  description?: string;
  footer?: ReactNode;
  children: ReactNode;
  className?: string;
}

export default function Card({ title, description, footer, children, className }: Props) {
  const hasTitle = title !== undefined;
  
  if (!hasTitle) {
    // For cards without title (like testimonials), return a simple div
    return (
      <div className={className}>
        {children}
      </div>
    );
  }
  
  // For cards with title (like signin forms), keep the original dark styling
  return (
    <div className="w-full max-w-md m-auto my-8 bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-2xl shadow-2xl">
      <div className="px-8 py-8">
        <h3 className="mb-2 text-3xl font-bold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">{title}</h3>
        {description && <p className="text-zinc-400 mb-6">{description}</p>}
        {children}
      </div>
      {footer && (
        <div className="px-8 py-6 border-t rounded-b-2xl border-zinc-800 bg-black/30 text-zinc-500">
          {footer}
        </div>
      )}
    </div>
  );
}
