const fs = require('fs');
const crypto = require('crypto');

async function decryptFile() {
  const encryptedData = fs.readFileSync('c:/Users/vedan/Downloads/rajesh-portfolio-main/rajesh-portfolio-main/public/models/character.enc');
  const iv = new Uint8Array(encryptedData.buffer, encryptedData.byteOffset, 16);
  const data = new Uint8Array(encryptedData.buffer, encryptedData.byteOffset + 16);
  const password = "MyCharacter12";
  const passwordBuffer = new TextEncoder().encode(password);
  
  const hashedPassword = await crypto.webcrypto.subtle.digest("SHA-256", passwordBuffer);
  const key = await crypto.webcrypto.subtle.importKey(
    "raw",
    hashedPassword.slice(0, 32),
    { name: "AES-CBC" },
    false,
    ["encrypt", "decrypt"]
  );
  
  const decrypted = await crypto.webcrypto.subtle.decrypt({ name: "AES-CBC", iv }, key, data);
  fs.writeFileSync('c:/Users/vedan/Downloads/rajesh-portfolio-main/rajesh-portfolio-main/public/models/decrypted_character.glb', new Uint8Array(decrypted));
  console.log("Decrypted to decrypted_character.glb");
}

decryptFile().catch(console.error);
