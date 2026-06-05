// 1. Klasa reprezentująca zwykły plik

export class VirtualFile {
  public name: string;
  public content: string;

  constructor(name: string, content: string) {
    this.name = name;
    this.content = content;
  }
}

// 2. Klasa reprezentująca folder, który może mieć podfoldery i pliki
export class VirtualDirectory {
  public name: string;
  public subDirectories: VirtualDirectory[];
  public files: VirtualFile[];

  constructor(
    name: string, 
    subDirectories: VirtualDirectory[] = [], 
    files: VirtualFile[] = []
  ) {
    this.name = name;
    this.subDirectories = subDirectories;
    this.files = files;
  }

  /* Generuje drzewko wizualne w stylu komendy 'tree'*/
  public getTreeStructure(indent: string = ''): string {
    let result = '';
    
    // Najpierw przechodzimy przez podfoldery
    this.subDirectories.forEach((dir, index) => {
      const isLast = index === this.subDirectories.length - 1 && this.files.length === 0;
      result += `${indent}${isLast ? '└── ' : '├── '}[FOLDER] ${dir.name}\n`;
      result += dir.getTreeStructure(indent + (isLast ? '    ' : '│   '));
    });

    // Potem przez pliki w tym folderze
    this.files.forEach((file, index) => {
      const isLast = index === this.files.length - 1;
      result += `${indent}${isLast ? '└── ' : '├── '}[FILE] ${file.name}\n`;
    });

    return result;
  }
  public findFileByPath(path: string): VirtualFile | null {
    const parts = path.split('/');
    
    // Jeśli to tylko nazwa pliku w bieżącym katalogu
    if (parts.length === 1) {
      return this.files.find(f => f.name.toLowerCase() === parts[0].toLowerCase()) || null;
    }

    // Jeśli idziemy głębiej
    const nextDir = this.subDirectories.find(d => d.name.toLowerCase() === parts[0].toLowerCase());
    if (!nextDir) return null;

    // Rekurencyjnie szukamy dalej, łącząc resztę ścieżki
    return nextDir.findFileByPath(parts.slice(1).join('/'));
  }
  public addSubDirectory(dir: VirtualDirectory): void {
  if (!this.subDirectories.some(d => d.name.toLowerCase() === dir.name.toLowerCase())) {
    this.subDirectories.push(dir);
  }
}
  public addFile(file: VirtualFile): void {
  if (!this.files.some(f => f.name.toLowerCase() === file.name.toLowerCase())) {
    this.files.push(file);
  }
}
}


export const VIRTUAL_ROOT = new VirtualDirectory('root', [
  // Folder Admina
  new VirtualDirectory('admin', [], [
    new VirtualFile('flag.txt', 'CTF{system_failure_2026}'),
    new VirtualFile('server_config.cfg', 'PORT=8080\nSSL=TRUE\nFIREWALL=ACTIVE'),
    new VirtualFile('root_access.key', 'SHA256: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'),
    new VirtualFile('backdoor_memo.txt', 'WARNING: Temporary port 9999 is open for debugging. Close it before deployment!')
  ]),
  // Folder dla First
  new VirtualDirectory('frog_master', [], [
    new VirtualFile('network_scan.log', 'SCANNING SUBNET 192.168.1.0/24... DONE.\nFOUND 3 ALIVE HOSTS.'),
    new VirtualFile('memo.txt', 'Remember to update databeses on friday.'),
    new VirtualFile('todo.txt', '1. Crack the hash from secondary server\n2. Download Cambridge tool\n3. Feed the digital frog guardian'),
    new VirtualFile('credentials.dat', 'service_account : P@ssw0rd_Frog_2026\nbackup_user : temp_token_9912')
  ]),
  // Folder dla tadpole_sec
  new VirtualDirectory('second', [], [
    new VirtualFile('readme_first.txt', 'Access denied. Please contact admin.'),
    new VirtualFile('intercepted_chat.txt', 'user_x: Did you see the new firewall?\ntadpole_sec: Yeah, it is heavy. But TasteTheRainbow tool can bypass it with the enterprise key.'),
    new VirtualFile('notes.txt', 'Cambridge license key is located somewhere in the root/logs/ directory. Search deep.')
  ]),
  // Wspólny folder logów
  new VirtualDirectory('logs', [], [
    new VirtualFile('syslog.log', '[OK] System booted successfully\n[WARN] High frog activity detected')
  ])
]);