import React from 'react';
import './App.css';
import NavBar from './components/NavBar'
import Login from './components/Login'
import AdminChatBox from './components/admin/AdminChatBox'
import ProjectAdmin from './components/admin/AdminProjects'
import Profile from './components/Profile'
import ResetPasswordRequest from './components/ResetPasswordRequest'
import ResetPassword from './components/ResetPassword'
import Projects from './components/Projects'
import Skills from './components/admin/Skills'
import AdminProfile from './components/admin/AdminProfile'
import Experience from './components/admin/Experience'
import Education from './components/admin/Education'
import Address from './components/admin/Address'
import User from './components/User/User'
import Abilities from './components/Abilities'
import AdminSideNav from './components/admin/AdminSideNav'
import { Switch, Route } from 'react-router-dom'
//import Footer from './components/Footer'


import Home from './components/Home'
import Register from './components/Register';
import Employment from './components/admin/Employment';
function App() {
  const DefaultRoutes = () => {
    return (
      <div>
        <NavBar />
        <Switch>
          <Route exact path='/' component={Home} />
          <Route path="/profile/" component={Profile} />
          <Route path="/projects/" component={Projects} />
          <Route path="/register" component={Register} />
          <Route path="/abilities" component={Abilities} />
        </Switch>
      </div>
    );
  };
  return (
    <>
      <Switch>

        <Route exact path='/login' component={Login} />
        <Route exact path='/user' component={User} />
        <Route exact path='/forgot-password' component={ResetPasswordRequest} />
        <Route exact path='/reset-password' render={(props) => <ResetPassword {...props} />} />
        <Route exact path='/admin/projects' >
          <AdminSideNav title="Project Details">
            <ProjectAdmin />
          </AdminSideNav>
        </Route>
        <Route exact path='/admin/address' >
          <AdminSideNav title="Address Details">
            <Address />
          </AdminSideNav>
        </Route>
        <Route exact path='/admin/profile' >
          <AdminSideNav title="Profile">
            <AdminProfile />
          </AdminSideNav>
        </Route>
        <Route exact path='/admin/experience' >
          <AdminSideNav title="Experience Details">
            <Experience />
          </AdminSideNav>
        </Route>

        <Route exact path='/admin/emp' >
          <AdminSideNav title="Employment Details">
            <Employment />
          </AdminSideNav>
        </Route>
        <Route exact path='/admin/inbox' >
          <AdminSideNav title="Inbox">
            <AdminChatBox />
          </AdminSideNav>
        </Route>
        <Route exact path='/admin/skills' >
          <AdminSideNav title="Skills">
            <Skills />
          </AdminSideNav>
        </Route>

        <Route exact path='/admin/education' >
          <AdminSideNav title="Education Details">
            <Education />
          </AdminSideNav>
        </Route>
        <Route component={DefaultRoutes} />
      </Switch>


    </>
  );
}

export default App;
