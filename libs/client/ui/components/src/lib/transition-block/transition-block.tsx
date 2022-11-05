import './transition-block.scss';

export interface TransitionBlockProps {
  height?: number;
  className?: string;
}

export const TransitionBlock: React.FC<TransitionBlockProps> = ({
  height,
  className,
}: TransitionBlockProps) => {
  return (
    <span
      className={`transition-block${className ? ` ${className}` : ''}`}
      style={{ height: height ?? 40 }}
    ></span>
  );
};
