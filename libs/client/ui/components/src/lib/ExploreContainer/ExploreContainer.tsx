import { useState, useEffect } from 'react';
import './ExploreContainer.scss';

interface ContainerProps {
  name: string;
}

export const ExploreContainer: React.FC<ContainerProps> = ({ name }) => {
  const [users, setUsers] = useState();

  useEffect(() => {
    fetch('http://localhost:3333/api/users')
      .then((data) => data.json())
      .then((data) => setUsers(data));
  }, []);

  return (
    <div className="container">
      <strong>{name}</strong>
      <p>
        Explore{' '}
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://ionicframework.com/docs/components"
        >
          {JSON.stringify(users)}
        </a>
      </p>
    </div>
  );
};
