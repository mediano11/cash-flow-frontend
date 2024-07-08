import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const api = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({ 
        baseUrl: `${process.env.REACT_APP_API_URL}/`,
        headers: {
            credentials: 'include',
        }
    }),
    tagTypes: [
        'api', 
        'GroupsController',
        'ReplenishmentsController',
        'ExpensesController',
        'InvitationController',
        'CategoryController',
        'UserController',
        'CategoryExpenses'
    ],
    endpoints: () => ({}),
})