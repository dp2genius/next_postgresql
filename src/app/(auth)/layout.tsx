"use client";

import { Anchor, Center, Container, Text, Title } from "@mantine/core";
import { usePathname } from "next/navigation";

interface Props {
    children: React.ReactNode;
}

export default function AuthLayout({ children }: Props) {
    const pathname = usePathname();
    return (
        <Center
            sx={(theme) => ({
                minHeight: "100vh",
                color: theme.colorScheme === "light" ? theme.colors.dark : theme.white,
                backgroundImage:
                    theme.colorScheme === "light"
                        ? "linear-gradient(to top, #dfe9f3 0%, white 100%)"
                        : "linear-gradient(to top, #1a202c 0%, #2d3748 100%)",
            })}
        >
            <Container size="xs" sx={{ width: 480, paddingBottom: 16 }}>
                <Title
                    align="center"
                    sx={(theme) => ({
                        fontFamily: `Greycliff CF, ${theme.fontFamily}`,
                        fontWeight: 900,
                    })}
                    variant="gradient"
                    gradient={{ from: "blue", to: "purple", deg: 90 }}
                >
                    JWT Authentication demo
                </Title>
                {pathname === "/login" && (
                    <Text color="dimmed" size="sm" align="center" mt={5}>
                        Don&apos;t have an account?{" "}
                        <Anchor size="sm" href="/register">
                            Sign Up
                        </Anchor>
                    </Text>
                )}
                {pathname === "/register" && (
                    <Text color="dimmed" size="sm" align="center" mt={5}>
                        Already have an account?{" "}
                        <Anchor size="sm" href="/login">
                            Sign In
                        </Anchor>
                    </Text>
                )}
                {children}
            </Container>
        </Center>
    );
}
