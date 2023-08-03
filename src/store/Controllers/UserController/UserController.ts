import { api } from '@store/api';

//types
import { IGetCurrentUserBalance, IGetCurrentUserInfo, IGetUsersFromGroupResponse } from './UserControllerInterfaces';


export const UserApiSlice = api.injectEndpoints({
    endpoints: (builder) => ({
        getUserAuthStatus: builder.query<boolean, null>({
            query: () => ({
                url: `users/user-balance`,
                credentials: 'include',
            }),
            transformErrorResponse: (
                response: { status: string | number },
            ) => response.status,
            transformResponse: (response: {balance: number}): boolean => {
                if (!response) {
                    return false  
                } 
                return !!response
            },
            providesTags: [{ type: 'UserController' as const, id: 0 }],
        }),
        getCurrentUserInfo: builder.query<IGetCurrentUserInfo, null>({
            query: () => ({
                url: `users/info`,
                credentials: 'include',
            }),
            transformErrorResponse: (
                response: { status: string | number },
            ) => response.status,
            providesTags: (res) => res ? [{ type: 'UserController' as const, id: res.id }] :
            [],
        }),
        getUsersByGroup: builder.query<IGetUsersFromGroupResponse, {group_id: number}>({
            query: ({group_id}) => ({
                url: `/groups/${group_id}/users`,
                credentials: 'include',
            }),
            transformErrorResponse: (
                response: { status: string | number },
            ) => response.status,
            providesTags: (result, err, body) => result ? 
            [...result.users_group.map(item => ({ type: 'UserController' as const, id: item.user.id })),
            { type: 'UserController' as const, id: 'Users' }]
                :
            [{ type: 'UserController' as const, id: 'Users' }],
        }),    
        getCurrentUserBalance: builder.query<IGetCurrentUserBalance, null>({
            query: () => ({
                url: `users/user-balance`,
                credentials: 'include',
            }),
            transformErrorResponse: (
                response: { status: string | number },
            ) => response.status,
            providesTags: [
                { type: 'UserController' as const, id: 0 },
                { type: 'ReplenishmentsController' as const, id: 'CREATE_REPLENISHMENT' },
                { type: 'ExpensesController', id: 'EXPENSES_BY_GROUP' }]
        }),
    }),
    overrideExisting: false,
})

export const {
    useGetUserAuthStatusQuery,
    useGetCurrentUserInfoQuery,
    useGetUsersByGroupQuery,
    useGetCurrentUserBalanceQuery
} = UserApiSlice