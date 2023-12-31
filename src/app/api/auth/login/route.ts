import { NEXT_PUBLIC_JWT_EXPIRES_IN } from "@/config";
import { getErrorResponse } from "@/lib/helpers";
import { prisma } from "@/lib/prisma";
import { signJWT } from "@/lib/token";
import { LoginUserInput, LoginUserSchema } from "@/lib/validations/user.schema";
import { compare } from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import Users from '../../data';

export async function POST(req: NextRequest) {
    try {
        const body = (await req.json()) as LoginUserInput;
        const data = LoginUserSchema.parse(body);

        // const user = await prisma.authUser.findUnique({
        //     where: { email: data.email },
        // });
        const user = Users.find(item => item.email === data.email);

        if (!user || !(await compare(data.password, user.password))) {
            return getErrorResponse(401, "Invalid email or password");
        }
        const token = await signJWT({ sub: '' + user.id }, { exp: `${NEXT_PUBLIC_JWT_EXPIRES_IN}m` });
        const tokenMaxAge = parseInt(NEXT_PUBLIC_JWT_EXPIRES_IN) * 60;
        const cookieOptions = {
            name: "token",
            value: token,
            httpOnly: true,
            path: "/",
            secure: process.env.NODE_ENV !== "development",
            maxAge: tokenMaxAge,
        };

        const response = new NextResponse(
            JSON.stringify({
                status: "success",
                data: {
                    token,
                },
            }),
            {
                status: 200,
                headers: { "Content-Type": "application/json" },
            }
        );

        await Promise.all([
            response.cookies.set(cookieOptions),
            response.cookies.set({
                name: "logged-in",
                value: "true",
                maxAge: tokenMaxAge,
            }),
        ]);

        return response;
    } catch (error: any) {
        console.log("error", error);
        if (error instanceof ZodError) {
            return getErrorResponse(400, "failed validations", error);
        }

        return getErrorResponse(500, error.message);
    }
}
