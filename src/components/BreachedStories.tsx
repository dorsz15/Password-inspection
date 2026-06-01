// types/PasswordFacts.ts

export interface PasswordFact {
  company: string;
  title: string;
  description: string;
}

export const breachStories: PasswordFact[] = [
 {
    company: "Yahoo",
    title: "The 2013 Mega-Breach",
    description: "This remains the largest data breach in internet history, affecting over 3 billion user accounts. Most users were completely unaware their credentials were stolen until hackers began hijacking their private email inboxes years later. If you were active online during this period, there is a very high probability that your old password is still circulating in dark web forums."
  },
  {
    company: "LinkedIn",
    title: "The 2012/2016 Security Crisis",
    description: "LinkedIn lost over 100 million passwords, serving as a brutal lesson for the tech industry on how not to store sensitive user data. Hackers leveraged these leaks for 'credential stuffing' attacks, systematically logging into thousands of unrelated platforms using the stolen credentials. Many users lost access to their bank accounts simply because they recycled the same password for work, social media, and finance."
  },
  {
    company: "Adobe",
    title: "The 2013 Credential Leak",
    description: "This breach was particularly malicious because, in addition to passwords, hackers managed to steal the security hints set by the users themselves. Criminals used these hints to bypass security measures and guess the actual passwords of individuals who wrongly assumed they were safe. It stands as clear proof that even the simplest security features can be turned against you if your password is easy to predict."
  },
  {
    company: "MySpace",
    title: "The 2008/2013 Legacy Leak",
    description: "Although MySpace is now seen as an internet relic, its breach exposed 427 million accounts that are still exploited by automated bots today. Hackers utilized weak encryption algorithms, allowing them to crack most of the stolen passwords almost immediately after the database was dumped. It is a perfect example of how a password you forgot a decade ago can become the master key to your modern online life."
  },
  {
    company: "Collection #1",
    title: "The 2019 Master Aggregator",
    description: "This is a massive repository containing billions of unique email and password pairs gathered from thousands of various data breaches over the years. Hackers created user-friendly search engines from this data, allowing anyone to check if your credentials are public in less than a second. If your password has ever been leaked anywhere in the past, it is almost certainly in this database, waiting to be tested by malicious bots."
  },

  // --- GENERAL SECURITY FACTS ---
  {
    company: "General Security",
    title: "The Keyboard Walk",
    description: "Patterns like 'qwerty' or '12345' are the absolute first things hackers test in their scripts. These aren't even considered real passwords by security experts; they are essentially open doors. Your fingers may enjoy the easy motion, but a bot will crack that combination in less than a millisecond."
  },
  {
    company: "General Security",
    title: "Entropy is Everything",
    description: "A password is only as strong as its randomness, a concept known as entropy. Simply adding an exclamation point to the end of your password doesn't make you safe, as automated tools are programmed to guess that exact behavior. True security comes from length and unpredictability, not just swapping letters for numbers."
  },
  {
    company: "General Security",
    title: "The Biometric Trap",
    description: "Biometrics like face scans and fingerprints are convenient, but they carry a permanent risk. If your password is stolen, you can simply change it; if your fingerprint data is leaked from a server, you cannot change your biological traits. This is why multi-factor authentication (MFA) remains a vital secondary layer of protection."
  },
  {
    company: "General Security",
    title: "Length Outperforms Complexity",
    description: "Modern cracking hardware is so fast that short, complex passwords are often weaker than long, simple ones. A 16-character phrase consisting of four random, unrelated words is exponentially harder to crack than a shorter 8-character string filled with symbols. Always prioritize length when creating your next login credential."
  },
  {
    company: "General Security",
    title: "The Password Reuse Fallacy",
    description: "Many users believe that if they only reuse a password for 'unimportant' sites, they are safe. However, hackers specifically target these weaker sites because they are easier to breach, knowing that users will likely use the same credentials for their primary email or banking. One weak link in your account portfolio compromises your entire digital identity."
  },
  {
    company: "General Security",
    title: "Hashing and Salting",
    description: "Websites shouldn't store your actual password, but a 'hash'—a scrambled mathematical representation. The best companies add 'salt' (random data) to your password before hashing, which makes it nearly impossible for hackers to use rainbow tables to reverse the process. If a site doesn't mention how they protect your data, they are likely doing it wrong."
  }
];