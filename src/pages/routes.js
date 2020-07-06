import React from 'react';

import Main from "./Main";
import News from "./News";
import Details from "./Details";

// Handles prefetching of async data
import { asyncComponent } from '@jaredpalmer/after';

const routes = [
  {
    path: "/",
    component: Main,
    exact: true,
    component: asyncComponent({
      loader: () => import('./Main'), // required
      Placeholder: () => <div>...LOADING...</div>
    })
  },
  {
    path: "/main",
    exact: true,
    component: Main
  },
  {
    path: "/details/:id",
    exact: true,
    component: asyncComponent({
      loader: () => import('./Details'), // required
      Placeholder: () => <div>...LOADING...</div>
    }),
    
  },
  {
    path: "/news",
    component: News
  }
];

export default routes;