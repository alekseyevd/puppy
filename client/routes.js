/* eslint-disable no-unused-vars */
import { Redirect, Navigate, Route, Switch } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import loginPage from './pages/Login'
import config from './config'
import Documents from './pages/Documents'
// import Document from './pages/Documents/Document'

export default function(isAuthenticated = false) {
  if (!isAuthenticated) {
    return (
      <Switch>
        <Route path="/login" component={loginPage} />
        <Redirect to="/login" />
      </Switch>

    )
  }

  return (
    <MainLayout>
      <Switch>
        <Route path="/" exact>
          <Documents entity="users" fields={config.users.columns} controls={config.users.controls}/>
        </Route>
        <Route path="/roles" exact>
          <Documents entity="roles" fields={config.roles.columns} controls={config.roles.controls}/>
        </Route>
        <Route path="/roles/:id" exact>
          {/* <Document entity="users" controls={config.users.controls}/> */}
          <Documents entity="roles" fields={config.roles.columns} controls={config.roles.controls}/>
        </Route>
        <Route path="/users" exact>
          <Documents entity="users" fields={config.users.columns} controls={config.users.controls}/>
        </Route>
        <Route path="/users/:id" exact>
          {/* <Document entity="users" controls={config.users.controls}/> */}
          <Documents entity="users" fields={config.users.columns} controls={config.users.controls}/>
        </Route>
        <Route path="/people" exact>
          <Documents entity="people" fields={config.people.columns} controls={config.people.controls}/>
        </Route>
        <Route path="/people/:id" exact>
          {/* <Document entity="people" controls={config.people.controls}/> */}
          <Documents entity="people" fields={config.people.columns} controls={config.people.controls}/>
        </Route>
      </Switch>
    </MainLayout>
  )
}
