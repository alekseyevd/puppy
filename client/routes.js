/* eslint-disable no-unused-vars */
import { Redirect, Navigate, Route, Switch } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import loginPage from './pages/Login'
import DataTable from './pages/Table'
import Item from './pages/Item'
import People from './pages/People'

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
          <DataTable />
        </Route>
        <Route path="/users" exact>
          <DataTable />
        </Route>
        <Route path="/users/:id" exact>
          <Item></Item>
        </Route>
        <Route path="/people" exact>
          <People />
        </Route>
        {/* <Route path="/people/:id" exact>
          <Item></Item>
        </Route> */}
      </Switch>
    </MainLayout>
  )
}
