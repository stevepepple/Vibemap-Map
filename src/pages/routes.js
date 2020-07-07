import React from 'react';

import Main from "./Main";
import News from "./News";

import MapPage from "./MapPage";
import Details from "./Details";

// Handles prefetching of async data
import { asyncComponent } from '@jaredpalmer/after';

const routes = [
  {
    path: "/cities/:city?",
    exact: true,
    component: asyncComponent({
      loader: () => import('./Main'), // required
      Placeholder: () => <div>...LOADING...</div>
    })
  },
  {
    path: "/map",
    component: asyncComponent({
      loader: () => import('./MapPage'), // required
      Placeholder: () => <div>...LOADING...</div>
    })
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