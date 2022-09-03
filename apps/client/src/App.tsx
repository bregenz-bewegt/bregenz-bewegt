import { IonApp, setupIonicReact } from '@ionic/react';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/index.scss';

import { Router } from '@bregenz-bewegt/client-ui-router';
import { StoreProvider } from '@bregenz-bewegt/client-ui-components';

/* Yup validation */
import '@bregenz-bewegt/client/common/validation';

setupIonicReact({ mode: 'ios' });

const App: React.FC = () => (
  <IonApp>
    <StoreProvider>
      <Router />
    </StoreProvider>
  </IonApp>
);

export default App;
