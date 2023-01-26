import React from 'react';
import { Link } from 'react-router-dom';
import './footer.scss';

/* eslint-disable-next-line */
export interface FooterProps {}

export const Footer: React.FC<FooterProps> = (props: FooterProps) => {
  return (
    <footer className="footer">
      <div className="footer__content">
        <Link to={'/'}>Start</Link>
        <Link to={'/privacy-police'}>Datenschutz</Link>
        <a href="/">Start</a>
      </div>
      <div className="footer__impressum"></div>
    </footer>
  );
};
