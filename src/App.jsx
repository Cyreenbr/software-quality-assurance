import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/dashboardPage/Dashboard';
import Home from './pages/homePage/Home';
import Notifications from './pages/Notifications';
import Profile from './pages/profilePage/Profile';
import SignIn from './pages/signinPage/SignIn';
import SignUp from './pages/signupPage/SignUp';
import Subjects from './pages/subjectsPage/Subjects';
import Pfa from './pages/pfaPage/Pfa';

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
        {/* Pages with Layout (header w navbar) */}
        {/* NB : essta3eml withLayout() ken hajtek bech tzid menu w header lel page te3k kima l'exemple louta */}
        {/* <Route path="/route" element={React.createElement(withLayout(Element_li_t7eb_tzidou_header_w_menu))} /> */}
        <Route path="/" element={React.createElement(withLayout(Home))} />
        <Route path="/dashboard" element={React.createElement(withLayout(Dashboard))} />
        <Route path="/profile" element={React.createElement(withLayout(Profile))} />
        <Route path="/subjects" element={React.createElement(withLayout(Subjects))} />
        <Route path="/pfa" element={React.createElement(withLayout(Pfa))} />
        <Route path="/notifications" element={React.createElement(withLayout(Notifications))} />

        {/* Pages without Layout */}
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        
      </Routes>
    </Router>
  );
}

export default App;
