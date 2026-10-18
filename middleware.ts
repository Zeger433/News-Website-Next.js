import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

function base64UrlToBase64(base64url: string): string {
  return base64url.replace(/-/g, '+').replace(/_/g, '/');
}

function base64ToUint8Array(base64: string): Uint8Array {
  const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

async function verifyJWT(token: string, secret: string): Promise<boolean> {
  const parts = token.split('.');
  if (parts.length !== 3) return false;

  const [headerB64, payloadB64, signatureB64] = parts;

  try {
    const payloadJson = atob(base64UrlToBase64(payloadB64));
    const payload = JSON.parse(payloadJson);
    if (payload.exp && payload.exp * 1000 < Date.now()) return false;
  } catch {
    return false;
  }

  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(`${headerB64}.${payloadB64}`);

    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    );

    const sigArray = base64ToUint8Array(base64UrlToBase64(signatureB64));
    const sigBuffer = new ArrayBuffer(sigArray.length);
    new Uint8Array(sigBuffer).set(sigArray);

    return await crypto.subtle.verify('HMAC', key, sigBuffer, data);
  } catch {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Public paths (no authentication required)
  const publicPaths = [
    '/',
    '/login',
    '/api/auth/login',
    '/api/auth/logout',
    '/api/auth/verify',
    '/about',
    '/contact',
    '/news',
    '/technology',
    '/economy',
    '/global',
    '/lifestyle',
    '/science',
    '/top-stories',
    '/privacy',
    '/subscription'
  ];

  // Check if path is public
  const isPublicPath = publicPaths.some(p => path === p || path.startsWith(p + '/'));
  
  // Admin paths that need protection
  const isAdminPath = path.startsWith('/admin');
  const isAdminApiPath = path.startsWith('/api/admin');

  // Get token from cookie
  const token = request.cookies.get('token')?.value;

  // Verify token
  let isAuthenticated = false;
  if (token) {
    const secret = process.env.JWT_SECRET || 'your-secret-key';
    isAuthenticated = await verifyJWT(token, secret);
  }

  // Protect admin routes
  if ((isAdminPath || isAdminApiPath) && !isAuthenticated) {
    if (isAdminApiPath) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Redirect to admin if already authenticated and trying to access login
  if (isAuthenticated && path === '/login') {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/admin/:path*',
    '/api/auth/:path*',
    '/login'
  ]
};
