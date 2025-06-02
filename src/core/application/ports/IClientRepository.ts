import type { Client } from "@/core/domain/entities";

export interface IClientRepository {
  findById(id: string): Promise<Client | undefined>;
  save(client: Client): Promise<void>;
}