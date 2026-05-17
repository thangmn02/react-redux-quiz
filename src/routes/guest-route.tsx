// import { Navigate } from "react-router"

interface GuestRouteProps extends React.PropsWithChildren {}

function GuestRoute({ children }: GuestRouteProps) {
  // const token = window.localStorage.getItem('token')

  // if (token) {
  //   return <Navigate to="/" />;
  // }

  return children
}

export default GuestRoute