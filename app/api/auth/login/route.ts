//app/api/auth/login/route.ts
import { createHmac } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";

const TOKEN_EXPIRATION_SECONDS = 60 * 60; // 1 hour

const base64UrlEncode = (value: string | Buffer) =>
    Buffer.from(value)
        .toString("base64")
        .replace(/=/g, "")
        .replace(/\+/g, "-")
        .replace(/\//g, "_");

const createJwtToken = (payload: Record<string, unknown>, secret: string) => {
    const header = {
        alg: "HS256",
        typ: "JWT",
    };

    const encodedHeader = base64UrlEncode(JSON.stringify(header));
    const encodedPayload = base64UrlEncode(JSON.stringify(payload));
    const data = `${encodedHeader}.${encodedPayload}`;
    const signature = base64UrlEncode(createHmac("sha256", secret).update(data).digest());

    return `${data}.${signature}`;
};


export async function POST(request: NextRequest) {
    const secret = process.env.AUTH_JWT_KEY;

    if (!secret) {
        return NextResponse.json(
            { error: "AUTH_JWT_KEY is not configured" },
            { status: 500 }
        );
    }

    let body: { userId?: unknown; email?: unknown };
    try {
        body = await request.json();
    } catch (error) {
        return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const userId = typeof body.userId === "string" ? body.userId.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim() : "";

    if (!userId) {
        return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }

    const issuedAt = Math.floor(Date.now() / 1000);
    const payload: Record<string, unknown> = {
        sub: userId,
        iat: issuedAt,
        exp: issuedAt + TOKEN_EXPIRATION_SECONDS,
    };

    if (email) {
        payload.email = email;
    }

    try {
        const token = createJwtToken(payload, secret);
        return NextResponse.json({ token });
    } catch (error) {
        console.error("Failed to create login token:", error);
        return NextResponse.json({ error: "Unable to generate login token" }, { status: 500 });
    }
}
