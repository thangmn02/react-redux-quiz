// import { Navigate } from "react-router"

interface AuthRouteProps extends React.PropsWithChildren {}

function AuthRoute({ children }: AuthRouteProps) {
  // const token = window.localStorage.getItem('token')

  // if (!token) return <Navigate to="login" />;

  return children
}

export default AuthRoute