//pages
import Dashboard from "@pages/Dashboard/Dashboard";
import Analytics from "@pages/Analytics/Analytics";
import Categories from "@pages/Categories/Categories";
import Groups from "@pages/Groups/GroupsPage";
import Group from "@pages/Group/Group";
import History from "@pages/History/History";
import Login from "@pages/Login/Login";
//UI
import Header from "@components/Header/Header";
import MobileNotifications from "@components/Header/Notifications/MobileNotifications/MobileNotifications";

export const DASHBOARD_PAGE = '/dashboard';
export const ANALYTICS_PAGE = '/analytics';
export const NOTIFICATIONS_PAGE = '/notifications';
export const CATEGORIES_PAGE = '/categories';
export const GROUPS_PAGE = '/groups';
export const GROUP_PAGE = '/group';
export const HISTORY_PAGE = '/history';
export const SETTINGS_PAGE = '/settings';
export const LOG_IN_PAGE = '/login';
export const SIGN_UP_PAGE = '/signup';
export const LOG_OUT = '/logout';

export const routesNotAuth = [
    {
        path: LOG_IN_PAGE,
        component: Login
    },{
        path: SIGN_UP_PAGE,
        component: Login
    }
];
export const routesAuth = [
    {
        path: DASHBOARD_PAGE,
        component: Dashboard
    }, {
        path: ANALYTICS_PAGE,
        component: Dashboard
    }, {
        path: NOTIFICATIONS_PAGE,
        component: MobileNotifications
    }, {
        path: CATEGORIES_PAGE,
        component: Categories
    }, {
        path: GROUPS_PAGE,
        component: Groups
    }, {
        path: HISTORY_PAGE,
        component: History
    },
];
export const routesMobileNavigation = [
    {
        path: DASHBOARD_PAGE,
        component: Dashboard
    }, {
        path: ANALYTICS_PAGE,
        component: Dashboard
    }, {
        path: NOTIFICATIONS_PAGE,
        component: MobileNotifications
    }, {
        path: CATEGORIES_PAGE,
        component: Categories
    }, {
        path: GROUPS_PAGE,
        component: Groups
    }, {
        path: HISTORY_PAGE,
        component: History
    },
];



export const components = [
    {
        path: "/components/Header",
        component: Header
    }
];