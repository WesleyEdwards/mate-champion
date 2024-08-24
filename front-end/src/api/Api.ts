import { LevelInfo, LevelMap } from "../game/loopShared/models";
import { User, LoginBody, Condition, Score, TopScore } from "../types";

export interface Api {
  readonly auth: {
    createAccount: (
      body: User & { password: string; score?: number }
    ) => Promise<User>;
    signIn: (body: LoginBody) => Promise<User>;
    getSelf: () => Promise<User>;
  };

  readonly user: {
    detail: (id: string) => Promise<User>;
    query: (filter: Condition<User>) => Promise<User[]>;
    create: (body: User) => Promise<User>;
    modify: (id: string, mod: Partial<User>) => Promise<User>;
    delete: (id: string) => Promise<User>;
  };
  readonly level: {
    detail: (id: string) => Promise<LevelInfo>;
    query: (filter: Condition<LevelInfo>) => Promise<LevelInfo[]>;
    queryPartial: (
      filter: Condition<LevelInfo>,
      fields: (keyof LevelInfo)[]
    ) => Promise<Partial<LevelInfo>[]>;
    create: (body: LevelInfo) => Promise<LevelInfo>;
    modify: (id: string, mod: Partial<LevelInfo>) => Promise<LevelInfo>;
    delete: (id: string) => Promise<LevelInfo>;
    generate: (ids: string[]) => Promise<LevelInfo[]>;
    levelMapDetail: (id: string) => Promise<LevelMap>;
    modifyMap: (id: string, mod: Partial<LevelMap>) => Promise<LevelMap>;
  };
  readonly score: {
    detail: (id: string) => Promise<Score>;
    query: (filter: Condition<Score>) => Promise<Score[]>;
    create: (body: Score) => Promise<Score>;
    update: (id: string, body: Partial<Score>) => Promise<Score>;
    delete: (id: string) => Promise<Score>;
    self: () => Promise<TopScore[]>;
    topScores: () => Promise<TopScore[]>;
  };
}
