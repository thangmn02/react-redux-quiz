import { Route, Routes } from "react-router"
import { Question } from "../pages/question";
import { FinalScore } from "../pages/final-score";
import { Dashboard } from "../pages/dashboard";
import { Leaderboard } from "../pages/leaderboard";
import { MainLayout } from "../layouts/main-layout";
import { Contact } from "../pages/contact";
import React from "react";
import { MinialLayout } from "../layouts/minimal-layout";
import { Login } from "../pages/login";
import AuthRoute from "./auth-route";
import GuestRoute from "./guest-route";


function renderRoutes() {
  const company = JSON.parse(window.localStorage.getItem('user') as any)?.company || '';
  let layout = MainLayout;

  if (company === 'A') {
    layout = MinialLayout
  }

  const routesConfig = [
    {
      path: '',
      component: Dashboard,
      layout,
      guard: AuthRoute
    },
    {
      path: 'question',
      component: Question,
      layout,
      guard: AuthRoute
    },
    {
      path: 'final-score',
      component: FinalScore,
      layout,
      guard: AuthRoute
    },
    {
      path: 'leaderboard',
      component: Leaderboard,
      layout,
      guard: AuthRoute
    },
    {
      path: 'contact',
      component: Contact,
    },
    {
      path: 'login',
      component: Login,
      guard: GuestRoute
    }
  ]
  return (
    <Routes>
      {routesConfig.map(route => {
        const Component = route.component;
        const Layout = route?.layout || React.Fragment;
        const Guard = route?.guard || React.Fragment;
        return (
          <Route 
            key={route.path} 
            path={route.path} 
            element={
              <Guard>
                <Layout>
                  <Component />
                </Layout> 
              </Guard>
            } 
          />
        )
      })}

      <Route path="*" element={<div>page not found</div>}/>
    </Routes>
  )
}


export const RoutesMain = () => {
  return renderRoutes();
}