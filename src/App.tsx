import { FC, Fragment } from 'react';
import { Routes, Route } from 'react-router';
import { BrowserRouter } from 'react-router-dom';
import { Cards } from './Components/Cards';
import { NotificationsProvider } from './Components/NotificationsProvider';
import { CssBaseline } from '@mui/material';

const App: FC = () => {
  return (
    <Fragment>
      <CssBaseline />
      <BrowserRouter>
        <NotificationsProvider maxNotifications={5} />
        <Routes>
          <Route path="*" element={<Cards />} />
        </Routes>
      </BrowserRouter>
    </Fragment>
  );
};

export default App;
