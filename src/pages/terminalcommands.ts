
export const COMMAND_DICTIONARY: Record<string, string> = {
     help: `Available security commands:
--------------------------------------------
- "help"     : Show this advanced menu
- "clear"    : Purge terminal logs from screen
- "scan"     : Run local environment vulnerability check
- "system"   : Display host machine architecture specifications`,

    scan: `[INFO] Launching Password-Inspection Scanner v1.0...
[WAIT] Checking local container environments...
[WAIT] Analyzing hash encryption algorithms...
[SUCCESS] Scan complete. 0 vulnerabilities found.
[SUCCESS] Your local vault database is fully secure.`,

    system: `OS Architecture : Linux WSL2 (Ubuntu 22.04.5 LTS)
Kernel Version  : 5.15.133.1-microsoft-standard-WSL2
Container Engine: Docker Desktop v4.28.0
Memory Alloted  : 4096 MB RAM
Node Environment: Production Mode (Vite)`,
    frog: `
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

}