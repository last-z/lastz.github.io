import PlannerPage from '../pages/PlannerPage';
import AdminPage from '../pages/AdminPage';

const routes = [
  {
    path: '/',
    component: PlannerPage,
    name: 'Planner'
  },
  {
    path: '/admin',
    component: AdminPage,
    name: 'Admin'
  }
];

export default routes;
