import React from 'react';
import './footer.scss';

export const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer__content">
        <a href="/">Start</a>
        <a href="/privacy-police">Datenschutzerklärung</a>
      </div>
      <div className="footer__impressum">
        &#169; {new Date().getFullYear()} Landeshauptstadt Bregenz
      </div>
    </footer>
  );
};
