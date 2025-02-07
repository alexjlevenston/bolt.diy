import type { ActionFunctionArgs } from '@remix-run/node';
import { Form, useActionData } from '@remix-run/react';
import { authenticator } from '~/services/auth.server';

export async function action({ request }: ActionFunctionArgs) {
  try {
    return await authenticator.authenticate('user-pass', request);
  } catch (error) {
    return { error: (error as Error).message };
  }
}

export default function Login() {
  const actionData = useActionData<typeof action>();

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <h1 className="mb-6 text-2xl font-bold">Login</h1>

        <Form method="post" className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium">
              Email
            </label>
            <input type="email" name="email" id="email" required className="mt-1 w-full rounded-md border p-2" />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium">
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              required
              className="mt-1 w-full rounded-md border p-2"
            />
          </div>

          {(actionData as { error: string })?.error && (
            <div className="text-sm text-red-600">{(actionData as { error: string }).error}</div>
          )}

          <button type="submit" className="w-full rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
            Log in
          </button>
        </Form>
      </div>
    </div>
  );
}
