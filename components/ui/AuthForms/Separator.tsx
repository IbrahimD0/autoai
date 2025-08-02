interface SeparatorProps {
  text: string;
}

export default function Separator({ text }: SeparatorProps) {
  return (
    <div className="relative my-6">
      <div className="relative flex items-center py-1">
        <div className="grow border-t border-zinc-800"></div>
        <span className="mx-4 shrink text-sm leading-8 text-zinc-500 bg-zinc-900 px-2">
          {text}
        </span>
        <div className="grow border-t border-zinc-800"></div>
      </div>
    </div>
  );
}
