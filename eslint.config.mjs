module.exports = {
  // Estende as configurações existentes
  extends: [
    // Suas extensões atuais...
  ],
  rules: {
    // Desativar regras específicas
    "@typescript-eslint/no-explicit-any": "off",
    "react-hooks/exhaustive-deps": "warn", // Transformar em warning ao invés de erro
    "@typescript-eslint/no-unused-vars": "warn",
  },
}

