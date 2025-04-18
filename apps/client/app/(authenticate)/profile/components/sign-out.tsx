'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from '@/lib/auth-client';
import { Button } from '@workspace/ui/components/button';
import { Loader2 } from 'lucide-react';

export default function SignOut() {
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  async function handleLogout() {
    setLoading(true);
    try {
      await signOut({
        fetchOptions: {
          onSuccess: () => {
            router.push('/sign-in');
          },
        },
      });
    } catch (error) {
      console.log('error:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex w-full items-center justify-end">
      <Button onClick={handleLogout} variant="destructive">
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
          </>
        ) : (
          'Sign Out'
        )}
      </Button>
    </div>
  );
}
