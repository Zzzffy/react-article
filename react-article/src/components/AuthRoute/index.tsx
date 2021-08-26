import { FC } from 'react'
import { Redirect, Route } from 'react-router-dom'
import cookie from 'react-cookies'

interface Props {
  component: any
  path: string
}
const AuthRoute: FC<Props> = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={routeProps => (
        cookie.load('userToken') ?
          <Component {...routeProps} /> : <Redirect to="/sign_in" />
      )}
    />
  );
}
export default AuthRoute
