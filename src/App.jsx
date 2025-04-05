import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import NotFound404 from "./components/skillsComponents/NotFound404";
import ProtectedRoute from "./components/skillsComponents/ProtectedRoute";
import ErrorPage from "./pages/ErrorPage";
import SignIn from "./pages/signinPage/SignIn";
import SignUp from "./pages/signupPage/SignUp";
import { menuConfig } from "./services/configs/menuHandler";
// Higher-order component to wrap pages with Layout
const withLayout = (Component, hideSideBar = false, hideHeader = false) => (
  <Layout hideHeader={hideHeader} hideSideBar={hideSideBar}>
    <Component />
  </Layout>
);

function App() {
  return (
    <Router>
      <Routes>
        {menuConfig.map(
          ({
            path,
            component: Component,
            eligibleRoles,
            eligibleLevels,
            hideHeader,
            hideSideBar,
          }) => {
            const resolvedPath =
              typeof path === "function" ? path(":id") : path;

            return eligibleRoles && eligibleRoles.length > 0 ? (
              <Route
                key={resolvedPath}
                path={resolvedPath}
                element={
                  <ProtectedRoute
                    element={withLayout(Component, hideSideBar, hideHeader)}
                    roles={eligibleRoles}
                    levels={eligibleLevels}
                  />
                }
              />
            ) : (
              <Route
                key={resolvedPath}
                path={resolvedPath}
                element={withLayout(Component, hideSideBar, hideHeader)}
              />
            );
          }
        )}

        {/* Authentication Pages */}
        <Route path="/signin" element={withLayout(SignIn, true)} />
        <Route path="/signup" element={withLayout(SignUp, true)} />

        {/* Error Handling */}
        <Route path="/error" element={withLayout(ErrorPage)} />
        <Route path="*" element={withLayout(NotFound404)} />
      </Routes>
    </Router>
  );
}

export default App;
