import Main from "./Main";
import News from "./News";

const routes = [
  {
    path: "/",
    exact: true,
    component: Main
  },
  {
    path: "/news",
    component: News
  }
];

export default routes;