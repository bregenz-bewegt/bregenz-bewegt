import './coin.scss';

/* eslint-disable-next-line */
export interface CoinProps {
  className?: string;
}

export const Coin: React.FC<CoinProps> = ({ className }: CoinProps) => {
  return (
    <div className={`bb-coin${className ? ` ${className}` : ''}`}>
      <h1>BB</h1>
    </div>
  );
};
