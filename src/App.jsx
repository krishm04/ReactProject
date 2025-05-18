import React, { useEffect, Suspense } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';

// import Users from './user/pages/Users';


// import NewPlace from './places/pages/NewPlace';
// import UserPlaces from './places/pages/UserPlaces';
import MainNavigation from './shared/components/Navigation/MainNavigation';
// import UpadtePlaces from './places/pages/UpadtePlaces';
// import Auth from './user/pages/Auth';
import { AuthContext } from './shared/Context/Auth-context';
import { useAuth } from './shared/Hooks/auth-hook';
import LoadingSpinner from './shared/components/UIElements/LoadingSpinner';

const Users = React.lazy(() => import('./user/pages/Users'));
const NewPlace = React.lazy(() => import('./places/pages/NewPlace'));
const UserPlaces = React.lazy(() => import('./places/pages/UserPlaces'));
const UpadtePlaces = React.lazy(() => import('./places/pages/UpadtePlaces'));
const Auth = React.lazy(() => import('./user/pages/Auth'));



const App = () => {

  const { login, logout, token, userId } = useAuth();


  useEffect(() => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    console.log("Backend URL:", backendUrl);
  }, []);
  let routes;
  if (token) {
    routes = (
      <>
        <Route path="/" element={<Users />} />
        <Route path="/:userId/places" element={<UserPlaces />} />
        <Route path="/places/:placeId" element={<UpadtePlaces />} />
        <Route path="/places/new" element={<NewPlace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </>
    )
  } else {
    routes = (
      <>
        <Route path="/" element={<Users />} />
        <Route path="/:userId/places" element={<UserPlaces />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="*" element={<Navigate to="/auth" replace />} />
      </>
    )
  }
  return (
    <AuthContext.Provider value={{ isLoggedIn: !!token, token: token, userId: userId, login: login, logout: logout }}>
      <Router>
        <MainNavigation />
        <main >
          <Suspense fallback={<div className="center"><LoadingSpinner /></div>}>
            <Routes>
              {routes}
            </Routes>
          </Suspense>
        </main>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;
