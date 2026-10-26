// Mock de sistema de tokens para acesso ao catálogo de repasses
// Na implementação real, isso seria gerenciado no backend

interface RepasseToken {
  token: string;
  createdAt: Date;
  expiresAt: Date | null;
  isActive: boolean;
}

// Simula banco de dados de tokens
const tokens: RepasseToken[] = [
  {
    token: "demo-token-123",
    createdAt: new Date(),
    expiresAt: null,
    isActive: true,
  },
];

export async function generateToken(): Promise<string> {
  // Simula geração de token único
  const token = `rpss_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;

  tokens.push({
    token,
    createdAt: new Date(),
    expiresAt: null,
    isActive: true,
  });

  return token;
}

export async function validateToken(token: string): Promise<boolean> {
  const tokenData = tokens.find((t) => t.token === token);

  if (!tokenData) return false;
  if (!tokenData.isActive) return false;
  if (tokenData.expiresAt && tokenData.expiresAt < new Date()) return false;

  return true;
}

export async function deactivateToken(token: string): Promise<boolean> {
  const tokenData = tokens.find((t) => t.token === token);

  if (!tokenData) return false;

  tokenData.isActive = false;
  return true;
}

export async function listTokens(): Promise<RepasseToken[]> {
  // Simula delay de API
  await new Promise((resolve) => setTimeout(resolve, 300));
  return tokens;
}
