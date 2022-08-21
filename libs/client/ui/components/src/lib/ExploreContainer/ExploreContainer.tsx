import { useState, useEffect } from 'react';
import './ExploreContainer.scss';
import axios from 'axios';

interface ContainerProps {
  name: string;
}

export const ExploreContainer: React.FC<ContainerProps> = ({ name }) => {
  const [data, setData] = useState<any>();

  useEffect(() => {
    axios.get('http://localhost:3333/api').then(({ data }) => setData(data));
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
          {JSON.stringify(data)}
        </a>
      </p>
    </div>
  );
};
