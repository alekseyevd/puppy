/* eslint-disable no-unused-vars */
import { Redirect, Navigate, Route, Switch } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import loginPage from './pages/Login'
import Button from '@material-ui/core/Button'
import DataTable from './pages/Table'

export default function(isAuthenticated = false, logout) {
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
        <Route path="*" exact>
          <div>fsdfsdf</div>
          <DataTable />
        </Route>
      </Switch>
    </MainLayout>
  )
}
