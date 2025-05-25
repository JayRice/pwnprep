import { createBrowserRouter } from 'react-router-dom';
import App from '../App';
import ToolPage from '../components/ToolPage';
import PortPage from '../components/PortPage';
import TechniquePage from '../components/TechniquePage';
import Premium from '../components/Premium';
import NotFound from '../components/NotFound';

import NoteTaker from '../components/NoteTaker';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <NotFound />,
    children: [
      {
        path: 'notes',
        element: < NoteTaker/>
      },
      {
        path: 'tools/:toolId',
        element: <ToolPage />
      },
      {
        path: 'ports/:portId',
        element: <PortPage />
      },
      {
        path: 'techniques/:techniqueId',
        element: <TechniquePage />
      },
      {
        path: 'premium',
        element: <Premium />
      }
    ]
  }
]);