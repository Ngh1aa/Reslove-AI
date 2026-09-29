import { NextResponse } from 'next/server';

export const dynamic = 'force-static';

export function GET() {
  return NextResponse.json({
    product: 'Resolve AI',
    stack: ['Next.js', 'React', 'TypeScript'],
    prototype: true,
    integrations: 'simulated',
    status: 'ok',
  });
}
