import Main from "../pages/Main";
import News from "../app/components/news/News";

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