import { User } from '@/types';

export function useRoles() {
    const hasRole = (user: User, role: string) => {
        return user.roles.includes(role);
    };

    const hasAnyRole = (user: User, roles: string[]) => {
        return roles.some((role) => user.roles.includes(role));
    };

    const hasAllRoles = (user: User, roles: string[]) => {
        return roles.every((role) => user.roles.includes(role));
    };

    return { hasRole, hasAnyRole, hasAllRoles };
}
