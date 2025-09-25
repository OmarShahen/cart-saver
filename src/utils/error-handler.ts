import { z } from 'zod';
import { NextResponse } from 'next/server';

export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500
  ) {
    super(message);
    this.name = 'AppError';
  }
}

function getFirstZodError(error: z.ZodError): string {
  const firstIssue = error.issues[0];
  if (!firstIssue) return 'Validation error';

  const field = firstIssue.path.join('.');
  const message = firstIssue.message;

  return field ? `${field}: ${message}` : message;
}

export function handleError(error: unknown): NextResponse {
  console.error('Error:', error);

  if (error instanceof z.ZodError) {
    return NextResponse.json(
      { error: getFirstZodError(error) },
      { status: 400 }
    );
  }

  if (error instanceof AppError) {
    return NextResponse.json(
      { error: error.message },
      { status: error.statusCode }
    );
  }

  return NextResponse.json(
    { error: 'Internal server error' },
    { status: 500 }
  );
}

export function APIError(message: string, statusCode: number = 500): AppError {
  return new AppError(message, statusCode);
}