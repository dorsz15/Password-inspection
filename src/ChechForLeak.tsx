async function sha1(message: string): Promise<string> {
  const msgUint8 = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-1', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();
}

export const checkPasswordPwned = async (password: string) => {
  const fullHash = await sha1(password);
  const prefix = fullHash.slice(0, 5);
  const suffix = fullHash.slice(5);

  const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
  const data = await response.text();
  
  const isPwned = data.includes(suffix);
  return isPwned;
};