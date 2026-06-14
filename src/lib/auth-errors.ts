/**
 * @fileOverview Shared error types for EcoPulse AI.
 * Uses `unknown` instead of `any` for strict TypeScript compliance.
 */

export type SecurityRuleContext = {
  path: string;
  operation: 'get' | 'list' | 'create' | 'update' | 'delete' | 'write';
  /** Typed as unknown — never use any for untrusted data. */
  requestResourceData?: unknown;
};

export class FirestorePermissionError extends Error {
  context: SecurityRuleContext;
  constructor(context: SecurityRuleContext) {
    super(
      `Firestore Permission Denied at ${context.path} for ${context.operation}`
    );
    this.name = 'FirestorePermissionError';
    this.context = context;
  }
}
