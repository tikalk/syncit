import {
    $,
    component$,
    createContextId,
    type QRL,
    type Signal,
    Slot,
    useContext,
    useContextProvider,
    useSignal,
    useVisibleTask$,
} from "@builder.io/qwik";
import {useNavigate} from "@builder.io/qwik-city";
import {type IToastContext, ToastContext} from "~/providers/toast";
import {type User} from "@prisma/client"

export interface IAuthContext {
    user: Signal<User | null | undefined>;
    status: Signal<undefined | "loggedOut" | "loggedIn">;
    login: QRL<
        (data: {
            email: string;
            password: string;
            redirectUri?: string;
        }) => Promise<Signal<User | null | undefined>>
    >;
    logout: QRL<() => Promise<void>>;
    create: QRL<
        (data: {
            email: string;
            password: string;
            name: string;
            passwordConfirm: string;
        }) => Promise<Signal<User | null | undefined>>
    >;
    forgot: QRL<(data: { email: string }) => Promise<void>>;
    reset: QRL<
        (data: {
            password: string;
            passwordConfirm: string;
            token: string;
        }) => Promise<void>
    >;
    update: QRL<
        (data: {
            id: string;
            email?: string;
            name?: string;
            password?: string;
            passwordConfirm?: string;
        }) => Promise<void>
    >;
}

export const AuthContext = createContextId<IAuthContext>("auth-context");

export const AuthProvider = component$(() => {
    const user = useSignal<User | null>();
    const status = useSignal<undefined | "loggedOut" | "loggedIn">();
    const nav = useNavigate();
    const {toast} = useContext<IToastContext>(ToastContext);

    const login = $(
        async (data: { email: string; password: string; redirectUri?: string }) => {
            try {
                const res = await fetch(
                    `${import.meta.env.PUBLIC_SERVER_URL}/api/auth/login`,
                    {
                        method: "POST",
                        credentials: "include",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            email: data.email,
                            password: data.password,
                        }),
                    },
                );

                if (res.ok) {
                    const json = await res.json();
                    if (json.errors) throw new Error(json.errors[0].message);

                    user.value = json.user;
                    status.value = "loggedIn";
                    await toast({
                        msg: "Login successfully",
                        type: "success",
                        timeout: 5000,
                    });
                    await nav(data.redirectUri || "/");
                    return user;
                }
                await toast({msg: "Invalid login", type: "error", timeout: 5000});
                throw new Error("Invalid login");
            } catch (e) {
                await toast({
                    msg: "An error occurred while attempting to login.",
                    type: "error",
                    timeout: 5000,
                });
                throw new Error("An error occurred while attempting to login.");
            }
        },
    );
    const logout = $(async () => {
        try {
            const res = await fetch(
                `${import.meta.env.PUBLIC_SERVER_URL}/api/auth/logout`,
                {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                },
            );

            if (res.ok) {
                user.value = null;
                status.value = "loggedOut";
                await toast({
                    msg: "Logout successfully",
                    type: "success",
                    timeout: 5000,
                });
            } else {
                await toast({
                    msg: "An error occurred while attempting to logout.",
                    type: "error",
                    timeout: 5000,
                });
                throw new Error("An error occurred while attempting to logout.");
            }
        } catch (e) {
            await toast({
                msg: "An error occurred while attempting to logout.",
                type: "error",
                timeout: 5000,
            });
            throw new Error("An error occurred while attempting to logout.");
        }
    });
    const create = $(
        async (data: {
            email: string;
            password: string;
            name: string;
        }) => {
            try {
                const res = await fetch(
                    `${import.meta.env.PUBLIC_SERVER_URL}/api/auth/register`,
                    {
                        method: "POST",
                        credentials: "include",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            email: data.email,
                            name: data.name,
                            password: data.password,
                        }),
                    },
                );

                if (res.ok) {
                    const {doc, errors} = await res.json();
                    if (errors) throw new Error(errors[0].message);
                    user.value = doc.user;
                    status.value = "loggedIn";
                    await toast({
                        msg: "User created successfully",
                        type: "success",
                        timeout: 5000,
                    });
                    await nav("/");
                    return user;
                } else {
                    await toast({
                        msg: res.statusText || "There was an error creating the account.",
                        type: "error",
                        timeout: 5000,
                    });
                    throw new Error(
                        res.statusText || "There was an error creating the account.",
                    );
                }
            } catch (e) {
                await toast({
                    msg: "An error occurred while attempting to logout.",
                    type: "error",
                    timeout: 5000,
                });
                throw new Error("An error occurred while attempting to create user.");
            }
        },
    );
    const forgot = $(async (data: { email: string }) => {
        try {
            const res = await fetch(
                `${import.meta.env.PUBLIC_SERVER_URL}/api/users/forgot-password`,
                {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email: data.email,
                    }),
                },
            );

            if (res.ok) {
                const {errors} = await res.json();
                if (errors) throw new Error(errors[0].message);
                await toast({
                    msg: "Check your email for further instructions.",
                    type: "success",
                    timeout: 5000,
                });
                await nav("/auth/forgot-password/continue");
            } else {
                await toast({
                    msg: res.statusText || "There was an error sending recovery email.",
                    type: "error",
                    timeout: 5000,
                });
                throw new Error("Invalid login");
            }
        } catch (e) {
            await toast({
                msg: "An error occurred while attempting to reset password.",
                type: "error",
                timeout: 5000,
            });
            throw new Error("An error occurred while attempting to reset password.");
        }
    });
    const reset = $(
        async (data: {
            password: string;
            passwordConfirm: string;
            token: string;
        }) => {
            try {
                const res = await fetch(
                    `${import.meta.env.PUBLIC_SERVER_URL}/api/users/reset-password`,
                    {
                        method: "POST",
                        credentials: "include",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            password: data.password,
                            token: data.token,
                        }),
                    },
                );

                if (res.ok) {
                    const json = await res.json();
                    if (json.errors) throw new Error(json.errors[0].message);
                    await login({email: json.user.email, password: data.password});
                    await toast({
                        msg: "Password reset successfully.",
                        type: "success",
                        timeout: 5000,
                    });
                    await nav("/auth/profile");
                } else {
                    await toast({
                        msg: res.statusText || "There was an error resetting password.",
                        type: "error",
                        timeout: 5000,
                    });
                    throw new Error("Invalid login");
                }
            } catch (e) {
                await toast({
                    msg: "An error occurred while attempting to reset password.",
                    type: "error",
                    timeout: 5000,
                });
                throw new Error(
                    "An error occurred while attempting to reset password.",
                );
            }
        },
    );
    const update = $(
        async (data: {
            id: string;
            email?: string;
            name?: string;
            password?: string;
            passwordConfirm?: string;
        }) => {
            try {
                const res = await fetch(
                    `${import.meta.env.PUBLIC_SERVER_URL}/api/users/${data.id}`,
                    {
                        method: "PATCH",
                        credentials: "include",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(data),
                    },
                );

                if (res.ok) {
                    const json = await res.json();
                    if (json.errors) throw new Error(json.errors[0].message);
                    user.value = json.doc;
                    await toast({
                        msg: "Successfully updated account.",
                        type: "success",
                        timeout: 5000,
                    });
                } else {
                    await toast({
                        msg: res.statusText || "There was a problem updating your account.",
                        type: "error",
                        timeout: 5000,
                    });
                    throw new Error("There was a problem updating your account.");
                }
            } catch (e) {
                await toast({
                    msg: "There was a problem updating your account.",
                    type: "error",
                    timeout: 5000,
                });
                throw new Error("There was a problem updating your account.");
            }
        },
    );

    // eslint-disable-next-line qwik/no-use-visible-task
    useVisibleTask$(async () => {
        try {
            const res = await fetch(
                `${import.meta.env.PUBLIC_SERVER_URL}/api/auth/me`,
                {
                    method: "GET",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                },
            );
            if (res.ok) {
                const json = await res.json();
                user.value = json.user || null;
                status.value = json.user ? "loggedIn" : "loggedOut";
            } else {
                status.value = "loggedOut";
                console.error("An error occurred while fetching your account.");
            }
        } catch (e) {
            user.value = null;
            status.value = "loggedOut";
            console.error("An error occurred while fetching your account.");
        }
    });

    useContextProvider(AuthContext, {
        user,
        status,
        login,
        logout,
        create,
        forgot,
        reset,
        update,
    });
    return (
        <>
            <Slot/>
        </>
    );
});
