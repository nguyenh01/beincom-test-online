import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { ACCESS_TOKEN } from "@src/constants/cookies";
import { REDIRECT_PATH } from "@src/constants/redirection";

export function middleware(req: NextRequest) {
  const token = req.cookies.get(ACCESS_TOKEN);

  const restrictedPaths = [REDIRECT_PATH.LOGIN, REDIRECT_PATH.REGISTER];
  const restrictedHomePaths = [REDIRECT_PATH.HOME];

  if (token) {
    if (restrictedPaths.includes(req.nextUrl.pathname)) {
      return NextResponse.redirect(new URL(REDIRECT_PATH.HOME, req.url));
    }
  } else {
    if (restrictedHomePaths.includes(req.nextUrl.pathname)) {
      return NextResponse.redirect(new URL(REDIRECT_PATH.LOGIN, req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/(.*)"],
};
