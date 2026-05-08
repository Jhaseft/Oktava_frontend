let pendingId: string | null = null;

export function setPendingAddressSelect(id: string) { pendingId = id; }

export function consumePendingAddressSelect(): string | null {
  const id = pendingId;
  pendingId = null;
  return id;
}
