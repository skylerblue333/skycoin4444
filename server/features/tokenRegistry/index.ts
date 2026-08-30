export type TokenNetwork = "ethereum" | "solana" | "skycoin";

export interface TokenDefinition {
  id: string;
  symbol: string;
  name: string;
  network: TokenNetwork;
  decimals: number;
  contractAddress?: string;
}

export interface TokenRegistrySnapshotV1 {
  type: "sky.token-registry.snapshot.v1";
  tokenCount: number;
  tokens: readonly TokenDefinition[];
}

function clean(value: string, field: string): string {
  const normalized = value.trim();
  if (!normalized) throw new Error(`${field} is required`);
  return normalized;
}

function normalizeToken(input: TokenDefinition): TokenDefinition {
  const id = clean(input.id, "token id");
  const symbol = clean(input.symbol, "token symbol").toUpperCase();
  const name = clean(input.name, "token name");
  if (!Number.isInteger(input.decimals) || input.decimals < 0 || input.decimals > 30) {
    throw new Error("token decimals must be an integer between 0 and 30");
  }
  const contractAddress = input.contractAddress?.trim();
  if (contractAddress !== undefined && !contractAddress) {
    throw new Error("contract address cannot be blank");
  }
  return { id, symbol, name, network: input.network, decimals: input.decimals, ...(contractAddress ? { contractAddress } : {}) };
}

export class SkyTokenRegistry {
  private readonly tokens = new Map<string, TokenDefinition>();

  register(input: TokenDefinition): TokenDefinition {
    const token = normalizeToken(input);
    if (this.tokens.has(token.id)) throw new Error(`duplicate token id: ${token.id}`);
    if ([...this.tokens.values()].some((existing) => existing.network === token.network && existing.symbol === token.symbol)) {
      throw new Error(`duplicate token symbol on network: ${token.network}:${token.symbol}`);
    }
    this.tokens.set(token.id, token);
    return token;
  }

  get(id: string): TokenDefinition | undefined {
    return this.tokens.get(clean(id, "token id"));
  }

  snapshot(): TokenRegistrySnapshotV1 {
    const tokens = [...this.tokens.values()].sort((a, b) => a.id.localeCompare(b.id));
    return { type: "sky.token-registry.snapshot.v1", tokenCount: tokens.length, tokens };
  }
}
