import { TerminalUser,SYSTEM_USERS } from './terminaluser';
import { VIRTUAL_ROOT,VirtualDirectory,VirtualFile } from './terminalfile';

export interface CommandContext {
  currentUser: TerminalUser | null;
  setCurrentUser: (user: TerminalUser | null) => void;
  isSystemLocked: boolean;
  setIsSystemLocked: (lock: boolean) => void;
  unlockedUsers: string[];
  setUnlockedUsers: React.Dispatch<React.SetStateAction<string[]>>;
  setActiveApp: (app: string | null) => void;
}

export class BaseCommand {
  public name: string;
  public description: string;
  private action: (args?: string, context?: CommandContext) => string;

  constructor(name: string, description: string, action: (args?: string, context?: CommandContext) => string) {
    this.name = name;
    this.description = description;
    this.action = action;
  }

  public execute(args?: string, context?: CommandContext): string {
    return this.action(args, context);
  }
}



export const COMMAND_DICTIONARY: Record<string, BaseCommand> = {
     help: new BaseCommand('help',
      'show a list of avialbe commands',
      ()=> `Available security commands:
--------------------------------------------
- "help"     : Show this advanced menu
- "clear"    : Purge terminal logs from screen
- "scan"     : Run local environment vulnerability check
- "system"   : Display host machine architecture specifications`),
scan: new BaseCommand(
    'scan',
    'Run local environment vulnerability check',
    () => `[INFO] Launching Password-Inspection Scanner v1.0...
[WAIT] Checking local container environments...
[WAIT] Analyzing hash encryption algorithms...
[SUCCESS] Scan complete. 0 vulnerabilities found.
[SUCCESS] Your local vault database is fully secure.`
  ),

  system: new BaseCommand(
    'system',
    'Display host machine architecture specifications',
    () => `OS Architecture : Linux WSL2 (Ubuntu 22.04.5 LTS)
Kernel Version  : 5.15.133.1-microsoft-standard-WSL2
Container Engine: Docker Desktop v4.28.0
Memory Alloted  : 4096 MB RAM
Node Environment: Production Mode (Vite)`
  ),
  ls: new BaseCommand(
    'ls',
    'Display wirtual directory tree structure',
    () => `[FOLDERS] root\n${VIRTUAL_ROOT.getTreeStructure()}`
  ),

  cat: new BaseCommand(
    'cat',
    'Read content of a specific file',
    (args) => {
      if (!args) {
        return 'Usage: cat [folder/file_name] (e.g., cat guest/readme.txt)';
      }

      const file = VIRTUAL_ROOT.findFileByPath(args);
      
      if (!file) {
        return `File or path not found: "${args}"`;
      }

      return `Reading ${file.name}:\n-------------------\n${file.content}`;
    }
  ),
users: new BaseCommand(
    'users',
    'Display all system profiles and their authorization status',
    (_, ctx) => {
      if (!ctx) return 'System error.';

      let result = `[ CODENAME: VANGUARD OS ACCESS CONTROL ]\n`;
      result += `==================================================\n`;
      result += `USER PROFILE         STATUS           SESSION\n`;
      result += `--------------------------------------------------\n`;

      // Robimy pętlę po kluczach
      Object.keys(SYSTEM_USERS).forEach(username => {
        const isUnlocked = ctx.unlockedUsers.includes(username);
        const statusIcon = isUnlocked ? 'UNLOCKED [UNLOCKED]' : 'LOCKED [LOCKED]';
        const isCurrent = ctx.currentUser?.username === username ? 'ACTIVE' : 'IDLE';

        result += `${username.toUpperCase().padEnd(21)}${statusIcon.padEnd(25)}${isCurrent}\n`;
      });

      result += `==================================================\n`;

      return result;
    }
  ),
  newuser: new BaseCommand(
    'newuser',
    'Create new user profile',
    (args, ctx) => {
      if (!ctx) return 'Context error.';

      const parts = args?.split(' ') || [];
      const username = parts[0]?.toLowerCase().trim();
      const password = parts[1];

      if (!username || !password) {
        return 'Usage: newuser [username] [password]';
      }

      // SPRAWDZENIE: Czy użytkownik o tej nazwie już istnieje w bazie
      if (SYSTEM_USERS[username]) {
        return `ACCESS DENIED: User "${username}" already exists in the system database.`;
      }

      // 1. Tworzymy obiekt nowego użytkownika
      const newUser = new TerminalUser(username, password, 'guest');

      SYSTEM_USERS[username] = newUser;

      // 2. Tworzymy dla niego dedykowany folder
      const userFolder = new VirtualDirectory(
        username,
        [],
        [new VirtualFile('welcome.txt', `Witaj w swoim folderze, ${username}!`)]
      );
      VIRTUAL_ROOT.addSubDirectory(userFolder);

      // 3. Aktualizujemy stany
      ctx.setCurrentUser(newUser);
      ctx.setIsSystemLocked(false);
      ctx.setUnlockedUsers(prev => [...prev, username]);

      return `[ SUCCESS ] Profile "${username}" registered directly into SYSTEM_USERS.\n` +
             `Created personal directory: root/${username}/\n` +
             `System UNLOCKED. Type "help" or "ls" to explore.`;
    }
  ),

 login: new BaseCommand(
    'login',
    'Authenticate existing profile',
    (args, ctx) => {
      if (!ctx) return 'Context error.';
      
      const parts = args?.split(' ') || [];
      const username = parts[0]?.toLowerCase().trim();
      const password = parts[1];

      if (!username || !password) {
        return 'Usage: login [username] [password]';
      }

      const systemUser = SYSTEM_USERS[username];

      if (systemUser) {
        if (systemUser.validatePassword(password)) {
          ctx.setCurrentUser(systemUser);
          ctx.setIsSystemLocked(false);
          ctx.setUnlockedUsers(prev => prev.includes(username) ? prev : [...prev, username]);
          return `[ ACCESS GRANTED ] Welcome back, ${username}. System unlocked.`;
        }
      }

      return 'Authorization FAILED: Invalid username or key password.';
    }
  ),
  install: new BaseCommand(
    'install',
    'Install software into current user directory',
    (args, ctx) => {
      if (!ctx) return 'Context error.';
      if (!ctx.currentUser) return 'ACCESS DENIED: You must be logged in to install software.';

      const programName = args?.trim();
      const fullArgs = args?.trim() || '';

      if (!fullArgs) {
        return 'Usage:\n' +
               '  install PasswordCracker\n' +
               '  install Cambridge -key:PROMO-XXXX\n' +
               '  install TasteTheRainbow -key:RAINBOW-XXXX';
      }

      let targetFileName = '';

      // KROK 1: Sprawdzamy opcje instalacji
      if (fullArgs === 'PasswordCracker') {
        targetFileName = 'PasswordCracker.exe';
      } 
      else if (fullArgs === 'Cambridge -key:PROMO-CODE-99X2-CAMB') {
        targetFileName = 'Cambridge.bin';
      } 
      else if (fullArgs === 'TasteTheRainbow -key:RAINBOW-TASTE-2026-X77F-PLACE') {
        targetFileName = 'Rainbow.bin';
      } 
      // Zabezpieczenie: jeśli wpisał dobrą nazwę, ale zły klucz
      else if (fullArgs.startsWith('Cambridge')) {
        return '[ REJECTED ] Invalid license key or wrong syntax. Expected: install Cambridge -key:PROMO-XXXX';
      } 
      else if (fullArgs.startsWith('TasteTheRainbow')) {
        return '[ REJECTED ] Invalid enterprise key or wrong syntax. Expected: install TasteTheRainbow -key:RAINBOW-XXXX';
      } 
      else {
        return `[ ERROR ] Unknown package or syntax error: "${fullArgs}"`;
      }
      const currentUsername = ctx.currentUser.username;

      const userFolder = VIRTUAL_ROOT.subDirectories.find(
        dir => dir.name.toLowerCase() === currentUsername
      );

      if (!userFolder) return `[ ERROR ] Personal directory not found.`;

      // Sprawdzamy, czy już zainstalowano
      const alreadyInstalled = userFolder.files.some(f => f.name === targetFileName);
      if (alreadyInstalled) {
        return `[ INFO ] ${targetFileName} is already installed in root/${currentUsername}/`;
      }

      // Wstawiamy odpowiedni plik hakerski
      const newPluginFile = new VirtualFile(
        targetFileName,
        `// MODULE CONFIGURATION FOR ${targetFileName.toUpperCase()} //\nSTATUS: OPERATIONAL`
      );
      userFolder.addFile(newPluginFile);

      return `[ DOWNLOADING ] Fetching ${programName} core package from repository...\n` +
             `[ progress: ██████████████████████████████ ] 100%\n` +
             `[ SUCCESS ] Mod "${targetFileName}" successfully loaded into root/${currentUsername}/`;
    }
  ),
  run: new BaseCommand(
    'run',
    'Execute an installed software application (e.g., run PasswordCracker.exe)',
    (args, ctx) => {
      if (!ctx) return 'Context error.';
      if (!ctx.currentUser) return 'ACCESS DENIED: You must be logged in to execute applications.';

      const fileName = args?.trim();

      if (!fileName) {
        return 'Usage: run [filename.exe] (e.g., run PasswordCracker.exe)';
      }
      const currentUsername = ctx.currentUser.username;

      const userFolder = VIRTUAL_ROOT.subDirectories.find(
        dir => dir.name.toLowerCase() === currentUsername
      );

      const hasExecutable = userFolder?.files.some(
        file => file.name.toLowerCase() === fileName.toLowerCase()
      );

      if (!hasExecutable) {
        return `[ ERROR ] File "${fileName}" not found in root/${currentUsername}/. Make sure to "install" it first.`;
      }

      // Obsługa konkretnej aplikacji: PasswordCracker.exe
      if (fileName.toLowerCase() === 'passwordcracker.exe') {
        // Zmieniamy stan aktywnej aplikacji – React podmieni okno displayowe
        ctx.setActiveApp('password_cracker');
        return `[ LAUNCHING ] Executing ${fileName}... entering graphical overlay interface.`;
      }
      return `[ ERROR ] "${fileName}" is not a recognized executable system application.`;
    }
  ),
  frog: new BaseCommand(
    'frog',
    'Display the digital frog guardian',
    () => `
                           .-----.
                          /7  .  (
                         /   .-.  \\
                        /   /   \\  \\
                       / '  )   (   )
                      / '   )   ).  \\
                    .'  _.   \\_/  . |
  .--.            .' _.' )\`.        |
 (    \`---...._.'   \`---.'_)    ..  \\
  \\            \`----....___    \`. \\  |
   \`.           _ ----- _   \`._  )/  |
     \`.        /"  \\   /"  \\\`.  \`._   |
       \`.    ((O)\` ) ((O)\` ) \`.   \`._\\
         \`-- '\`---'   \`---' )  \`.    \`-.
               /                   \` \\       \`-.
             .'                       \`.        \`.
            /                      \`  \` \`.       \`-.
  .--.    \\ ===._____.======. \`    \`   \`. .___.--\`      .''.' \`.
 ' .\` \`-. \`.                )\`. \`    \` \` \\          .' . '  8)
(8  .  \` \`-.\`.                ( .  \` \`  .\`\\       .'  '    ' /
 \\  \`. \`    \`-.                ) \` .    \` \` \\  .'    ' .  '  /
  \\ \` \`.  \` . \\\`.    .--.     |  \` ) \`    .\`\`/    '  // .  /
   \`.  \`\`. .   \\ \\   .-- \`.  (  \` /_    \` . / ' .  '/   .'
     \`. \` \\  \`  \\ \\  '-.   \`-'  .'  \`-.  \`   .  .'/  .'
       \\ \`.\`.  \` \\ \\   ) /\`._.\`        \`.  \` .  .'  /
    LGB    |  \`.\`. . \\ \\  (.'                \`.   .'  .'
        __/  .. \\ \\ \` ) \\                      \\.' .. \\__
 .-._.-'      '"  ) .-'   \`.                    (  '"      \`._.--.
(_________.-====' / .' /\\_)\`--..__________..-- \`====-. _________)
                 (.'(.'
`
  )
};
