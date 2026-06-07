export class TerminalUser {
  public username: string;
  private password: string;
  public role: 'admin' | 'guest';

  constructor(username: string, passwordHash: string, role: 'admin' | 'guest') {
    this.username = username;
    this.password = passwordHash;
    this.role = role;
  }

  public validatePassword(password: string): boolean {
    return this.password === password;
  }
}

export const SYSTEM_USERS: Record<string, TerminalUser> = {
  admin: new TerminalUser('admin', 'secret123', 'admin'),
  brute_force: new TerminalUser('brute_force', 'fc', 'guest'),
  rainbow: new TerminalUser('rainbow', 'CommonPassword', 'guest')
};