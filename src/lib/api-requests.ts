import { NEXT_PUBLIC_BACKEND_URL } from "@/config";
import { FilteredUser, UserLoginResponse, UserResponse } from "./types";

async function handleResponse<T>(response: Response): Promise<T> {
    const contentType = response.headers.get("Content-Type") || "";
    const isJson = contentType.includes("application/json");
    const data = isJson ? await response.json() : await response.text();

    if (!response.ok) {
        if (isJson && data.errors !== null) {
            throw new Error(JSON.stringify(data.errors));
        }

        throw new Error(data.message || response.statusText);
    }

    return data as T;
}

export async function apiRegisterUser(credentials: string): Promise<FilteredUser> {
    const response = await fetch(`${NEXT_PUBLIC_BACKEND_URL}/api/auth/register`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: credentials,
    });
    // console.log(response);
    return handleResponse<UserResponse>(response).then(({ data }) => data.user);
}

export async function apiLoginUser(credentials: string): Promise<string> {
    const response = await fetch(`${NEXT_PUBLIC_BACKEND_URL}/api/auth/login`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: credentials,
    });
    return handleResponse<UserLoginResponse>(response).then(({ data }) => data.token);
}

export async function apiLogoutUser(): Promise<void> {
    const response = await fetch(`${NEXT_PUBLIC_BACKEND_URL}/api/auth/logout`, {
        method: "GET",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
    });

    return handleResponse<void>(response);
}

export async function apiGetAuthUser(token?: string | null): Promise<FilteredUser> {
    const headers: Record<string, string> = {
        "Content-Type": "application/json",
    };

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }
    const response = await fetch(`${NEXT_PUBLIC_BACKEND_URL}/api/users/me`, {
        method: "GET",
        credentials: "include",
        headers,
    });
    // console.log('apiGetAuthUser', response);
    return handleResponse<UserResponse>(response).then(({ data }) => data.user);
}

export async function apiGetTable() {
    
}