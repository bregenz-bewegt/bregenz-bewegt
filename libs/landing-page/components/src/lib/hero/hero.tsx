import { Mockup } from '../mockup/mockup';
import './hero.scss';

/* eslint-disable-next-line */
export interface HeroProps {}

export const Hero: React.FC<HeroProps> = (props: HeroProps) => {
  return (
    <div className="hero">
      <div className="hero__mockup">
        <Mockup src={`${process.env['NX_CLIENT_BASE_URL']}`} />
      </div>
      <div className="hero__info">
        <h1>Bregenz bewegt App</h1>
      </div>
    </div>
  );
};
