import express, { Router } from 'express';

// Health check api route
import healthRoute from './health.route';

import slotConfigRoute from './slotConfig.route';
import holidayConfigRoute from './holidayConfig.route';
import appointmentRoute from './appointment.route';


//Admin Routes
import adminLoginRoute from './admin/login.route';
import adminRoute from './admin/admin.route';

const router: Router = express.Router();

interface Route {
    path: string;
    route: Router;
}

const defaultRoutes: Route[] = [
    {
        path: '/health',
        route: healthRoute,
    },
    {
        path: '/slot-configs',
        route: slotConfigRoute,
    },
    {
        path: '/holidays',
        route: holidayConfigRoute,
    },
    {
        path: '/appointments',
        route: appointmentRoute,
    },
    {
        path: '/admins/auth',
        route: adminLoginRoute,
    },
    {
        path: '/admins',
        route: adminRoute,
    },
];

defaultRoutes.forEach((route) => {
    router.use(route.path, route.route);
});

export default router;
