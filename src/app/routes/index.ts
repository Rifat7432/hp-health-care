import { Router } from 'express';
import { userRoute } from '../modules/User/user.routes';
import { adminRoute } from '../modules/Admin/admin.route';
import { authRoutes } from '../modules/Auth/auth.route';


const router = Router();

const moduleRoutes = [
  {
    path: '/user',
    route: userRoute,
  },
  {
    path: '/admin',
    route: adminRoute,
  },
  {
    path: '/auth',
    route: authRoutes,
  },
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));


export default router;
