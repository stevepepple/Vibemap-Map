import React from 'react';

import Main from "./Main";
import MapPage from "./MapPage";
import Details from "./Details";
import Redirect from "./Redirect";

// Handles prefetching of async data
import { asyncComponent } from '@jaredpalmer/after';

const routes = [
	{
		path: "/",
		exact: true,
		component: Redirect
	},
	{
		path: "/discover/:city?",
		exact: true,
		component: asyncComponent({
			loader: () => import('./Main'), // required
			Placeholder: () => <div>...LOADING...</div>
		})
	},
	{
		path: "/search",
		component: asyncComponent({
			loader: () => import('./MobileSearch'), // required
			Placeholder: () => <div>...LOADING...</div>
		})
	},
	{
		path: "/lookup",
		component: asyncComponent({
			loader: () => import('./Lookup'), // required
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

	}
];

export default routes;