import { Routes } from '@angular/router';
import { Dashboard } from './pages/dashboard/dashboard';
import { ToolsPage } from './pages/tools/tools';
import { Analytics } from './pages/analytics/analytics';

export const routes: Routes = [
    {
        path: '',
        component: Dashboard
    },
    {
        path: 'tools',
        component: ToolsPage
    },
    {
        path: 'analytics',
        component: Analytics
    }
];
