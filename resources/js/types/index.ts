import { LucideIcon } from 'lucide-react';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    url: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    roles: string[];
    permissions: string[];
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

export interface Profile {
    id: number;
    user_id: number;
    is_individual: boolean;
    first_name: string;
    last_name: string;
    company_name: string;
    phone_number: string;
    date_of_birth: Date;
    preferred_currency_id?: number;
    is_translator: boolean;
    is_interpreter: boolean;
    avatar: string;
    native_languages: Language[];
    secondary_email?: string;
    secondary_phone?: string;
    address: Address;
    [key: string]: unknown; // This allows for additional properties...
}

export interface Currency {
    id: number;
    code: string;
    name: string;
    symbol: string;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

export interface Address {
    id: number;
    address_line_1: string;
    address_line_2?: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
    type?: string;
    [key: string]: unknown; // This allows for additional properties...
}

export interface Add_Info {
    id: number;
    user_id: number;
    secondary_email: string;
    secondary_phone: string;
    additional_fields: Array<{ key: string; value: string }>;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

export interface Language {
    id: number;
    iso_code: string;
    name: string;
    [key: string]: unknown; // This allows for additional properties...
}