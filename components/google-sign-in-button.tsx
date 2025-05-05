'use client';

import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';

export function GoogleSignInButton() {
  return (
    <Button
      variant="outline"
      type="button"
      className="w-full"
      onClick={() => signIn('google', { callbackUrl: process.env.NEXT_PUBLIC_APP_URL || '/' })}
    >
      <Icons.google className="mr-2 h-4 w-4" />
      Sign in with Google
    </Button>
  );
} 