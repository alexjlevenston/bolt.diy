import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/cloudflare';
import { Form } from '@remix-run/react';
import { authenticator } from '~/auth.server';

/* First we create our UI with the form doing a POST and the inputs with the */
import { data } from '@remix-run/cloudflare';
import { redirect } from '@remix-run/cloudflare';

/* names we are going to use in the strategy */
export default function Screen() {
  return (
    <Form method="post">
      <input type="email" name="email" required />
      <input type="password" name="password" autoComplete="current-password" required />
      <button>Sign In</button>
    </Form>
  );
}

/* Second, we need to export an action function, here we will use the */
/* `authenticator.authenticate method` */
export async function action({ request }: ActionFunctionArgs) {
  /* we call the method with the name of the strategy we want to use and the */
  /* request object */
  const user = await authenticator.authenticate('user-pass', request);

  const session = await sessionStorage.getSession(request.headers.get('cookie'));
  session.set('user', user);

  throw redirect('/', {
    headers: { 'Set-Cookie': await sessionStorage.commitSession(session) },
  });
}

/* Finally, we need to export a loader function to check if the user is already */
/* authenticated and redirect them to the dashboard */
export async function loader({ request }: LoaderFunctionArgs) {
  const session = await sessionStorage.getSession(request.headers.get('cookie'));
  const user = session.get('user');

  if (user) {
    throw redirect('/');
  }

  return data(null);
}
