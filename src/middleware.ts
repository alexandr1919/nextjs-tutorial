import { useRouter } from 'next/navigation';
import { jwtVerify } from 'jose';
import { NextResponse } from "next/server";
const PUBLIC_FILE = /\.(.*)$/;

const verifyJWT = async (jwt) => {
    const { payload } = await jwtVerify(
        jwt,
        new TextEncoder().encode(process.env.JWT_SECRET)
    )
    return payload
}

const isAuthRoute = (pathname) => {
  return pathname.startsWith("/signin") || pathname.startsWith("/register") ;
}

export default async function middleware(req, res) {
    const { pathname } = req.nextUrl;
    const jwt = req.cookies.get(process.env.COOKIE_NAME)

    if (jwt && isAuthRoute(pathname)) {
      req.nextUrl.pathname = "/home";
      return NextResponse.redirect(req.nextUrl)
    } 
    
    if (
      pathname.startsWith("/_next") ||
      pathname.startsWith("/api") ||
      pathname.startsWith("/static") ||
      isAuthRoute(pathname) ||
      PUBLIC_FILE.test(pathname)
    ) {
        return NextResponse.next();
    }
     
    if (!jwt) {
      req.nextUrl.pathname = "/signin";
      return NextResponse.redirect(req.nextUrl)
    }

    try {
      await verifyJWT(jwt.value);
      return NextResponse.next();
    } catch (e) {
      console.log(e)
      req.nextUrl.pathname="/signin";
      return NextResponse.redirect(req.nextUrl)
    }
    
}