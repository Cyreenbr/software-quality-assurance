import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import NotFound404 from './components/skillsComponents/NotFound404';
import ProtectedRoute from './components/skillsComponents/ProtectedRoute';
import ErrorPage from './pages/ErrorPage';
import SignIn from './pages/signinPage/SignIn';
import SignUp from './pages/signupPage/SignUp';
import { menuConfig } from './services/configs/menuHandler';
import OptionPage from "./pages/optionPage/OptionPage";

// Higher-order component to wrap pages with Layout
const withLayout = (Component) => {
  return (props) => (
    <Layout>
      <Component {...props} />
    </Layout>
  );
};

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
        {/* Pages with Layout (header w navbar) */}
        {/* NB : essta3eml withLayout() ken hajtek bech tzid menu w header lel page te3k kima l'exemple louta */}
        {/* <Route path="/route" element={React.createElement(withLayout(Element_li_t7eb_tzidou_header_w_menu))} /> */}
        <Route path="/" element={React.createElement(withLayout(Home))} />
        <Route
          path="/dashboard"
          element={React.createElement(withLayout(Dashboard))}
        />
        <Route
          path="/profile"
          element={React.createElement(withLayout(Profile))}
        />
        <Route
          path="/subjects"
          element={React.createElement(withLayout(Subjects))}
        />
        <Route
          path="/notifications"
          element={React.createElement(withLayout(Notifications))}
        />
        <Route
          path="/chooseoption"
          element={React.createElement(withLayout(OptionPage))}
        />

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