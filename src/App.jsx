import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import NotFound404 from './components/skillsComponents/NotFound404';
import ProtectedRoute from './components/skillsComponents/ProtectedRoute';
import ErrorPage from './pages/ErrorPage';
import SignIn from './pages/signinPage/SignIn';
import SignUp from './pages/signupPage/SignUp';
import { menuConfig } from './services/configs/menuHandler';

const withLayout = (Component, hideSideBar = false, hideHeader = false) => (
  <Layout hideHeader={hideHeader} hideSideBar={hideSideBar}><Component /></Layout>
);

function App() {
  return (
    <Router>
      <Routes>
        {menuConfig.map(({ path, component: Component, eligibleRoles, hideHeader, hideSideBar }) => (
          eligibleRoles.length > 0 ? (
            <Route key={path} path={path} element={<ProtectedRoute element={withLayout(Component, hideSideBar, hideHeader)} roles={eligibleRoles} />} />
          ) : (
            <Route key={path} path={path} element={withLayout(Component, hideSideBar, hideHeader)} />
          )
        ))}

        {/* Pages d'authentification */}
        <Route path="/signin" element={withLayout(SignIn, true)} />
        <Route path="/signup" element={withLayout(SignUp, true)} />

        {/* Gestion des erreurs */}
        <Route path="/error" element={withLayout(ErrorPage)} />
        <Route path="*" element={withLayout(NotFound404)} />
      </Routes>
    </Router>
  );
}

export default App;