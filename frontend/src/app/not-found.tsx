import Link from 'next/link'
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-center p-4">
      <h1 className="text-6xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
        404 - Page Not Found
      </h1>
      <p className="text-xl text-gray-300 mb-8 max-w-2xl">
        The chess position you're looking for has been captured! Try another
        square.
      </p>
      <Button asChild variant="gradient">
        <Link href="/">Return to Homepage</Link>
      </Button>
    </div>
  )
}