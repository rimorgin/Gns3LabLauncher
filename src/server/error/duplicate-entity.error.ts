export class DuplicateUserError extends Error {
  public readonly conflicts: string[];

  constructor(email?: string, username?: string) {
    const conflicts = [
      email ? `Email ${email}` : null,
      username ? `Username ${username}` : null,
    ].filter(Boolean) as string[];

    const message = `${conflicts.join(" and ")} already exists`;
    super(message);
    this.name = "DuplicateUserError";
    this.conflicts = conflicts;
  }
}

// generic error
export class DuplicateFieldsError extends Error {
  public readonly conflicts: Record<string, string>;

  /**
   * Create an error for duplicate fields
   * @param conflicts - Object with field names as keys and their conflicting values
   */
  constructor(conflicts: Record<string, string>) {
    const fieldMessages = Object.entries(conflicts).map(
      ([field, value]) => `${field} '${value}'`,
    );

    const message = `${fieldMessages.join(", ")} already exists`;

    super(message);
    this.name = "DuplicateFieldsError";
    this.conflicts = { ...conflicts }; // Make it immutable-friendly
  }
}
