import Main from "../pages/Main";
import News from "../app/components/news/News";

import Details from "../pages/Details"

const routes = [
  {
    path: "/",
    component: Main
  },
  {
    path: "/details/:id",
    component: Details
  },
  {
    path: "/test",
    component: News
  },
  {
    path: "/news",
    component: News
  }
];

export default routes;