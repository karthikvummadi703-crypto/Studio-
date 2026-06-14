export type FirestoreOperation = 'get' | 'list' | 'create' | 'update' | 'delete' | 'write';

export type SecurityRuleContext = {
  path: string;
  operation: FirestoreOperation;
  requestResourceData?: Record<string, unknown>;
};

export class FirestorePermissionError extends Error {
  context: SecurityRuleContext;
  constructor(context: SecurityRuleContext) {
    super(`Firestore Permission Denied at ${context.path} for ${context.operation}`);
    this.name = 'FirestorePermissionError';
    this.context = context;
  }
}
