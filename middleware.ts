import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("accessToken");
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
  return NextResponse.next();
}

// /loginと/registerは除外
export const config = {
  matcher: ["/((?!login|register|_next).*)"],
};
