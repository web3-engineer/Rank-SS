const fs = require('fs');
const path = require('path');

try {
    // 1. Lê o seu arquivo local que já funciona
    const jsonPath = path.join(__dirname, 'service-account.json');
    
    if (!fs.existsSync(jsonPath)) {
        console.error("ERRO: O arquivo 'service-account.json' não está na raiz!");
        process.exit(1);
    }

    const credenciais = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

    // 2. Pega o e-mail
    const email = credenciais.client_email;

    // 3. Pega a chave e transforma em Base64 (Uma linha só, super seguro)
    const privateKey = credenciais.private_key;
    const base64Key = Buffer.from(privateKey).toString('base64');

    console.log("==================================================");
    console.log("   COPIE ESTES VALORES PARA A VERCEL (SETTINGS)");
    console.log("==================================================");
    console.log("");
    console.log("NOME:  GOOGLE_CLIENT_EMAIL");
    console.log("VALOR: " + email);
    console.log("");
    console.log("--------------------------------------------------");
    console.log("");
    console.log("NOME:  GOOGLE_PRIVATE_KEY_BASE64");
    console.log("VALOR: " + base64Key);
    console.log("");
    console.log("==================================================");

} catch (e) {
    console.error("Erro:", e.message);
}