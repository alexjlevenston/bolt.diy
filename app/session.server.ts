import { createCookieSessionStorage } from '@remix-run/cloudflare';

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: '_session', // use any name you want here
    sameSite: 'lax', // this helps with CSRF
    path: '/', // remember to add this so the cookie will work in all routes
    httpOnly: true, // for security reasons, make this cookie http only
    secrets: [process.env.SESSION_SECRET as string], // replace this with an actual secret from your env
    secure: process.env.NODE_ENV === 'production', // enable this in prod only
  },
});

// You can also export the methods individually for your own usage
export const { getSession, commitSession, destroySession } = sessionStorage;
