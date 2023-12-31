import { NEXT_PUBLIC_JWT_SECRET_KEY } from "@/config";
import { SignJWT, jwtVerify } from "jose";

export const signJWT = async (payload: { sub: string }, options: { exp: string }) => {
    try {
        const secret = new TextEncoder().encode(NEXT_PUBLIC_JWT_SECRET_KEY);
        const alg = "HS256";
        return new SignJWT(payload)
            .setProtectedHeader({ alg })
            .setExpirationTime(options.exp)
            .setIssuedAt()
            .setSubject(payload.sub)
            .sign(secret);
    } catch (error) {
        throw error;
    }
};

export const verifyJWT = async <T>(token: string): Promise<T> => {
    try {
        const { payload } = await jwtVerify(
            token,
            new TextEncoder().encode(NEXT_PUBLIC_JWT_SECRET_KEY)
        );
        return payload as T;
    } catch (error) {
        // console.log(error);
        throw new Error("Your token has expired.");
    }
};
