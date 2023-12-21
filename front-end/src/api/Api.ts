import { User, LoginBody, Condition, Score, TopScore } from "../types";

type Method = "get" | "post" | "put" | "delete";

export class Api {
  private token: string;
  public baseUrl = import.meta.env.VITE_BACKEND_URL;

  public constructor(token: string | null) {
    this.token = token || "";
  }

  public getToken() {
    return this.token;
  }

  private setToken(token: string) {
    if (!token) return;
    this.token = token;
    localStorage.setItem("mate-token", token);
  }

  public async makeRequest(
    path: string,
    method: Method,
    body: Record<string, any> = {}
  ) {
    const options: RequestInit = {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.token}`,
      },
    };

    if (method === "post" || method === "put") {
      options.body = JSON.stringify(body);
    }

    const result = await fetch(`${this.baseUrl}/${path}`, options);
    if (result.status !== 200) return Promise.reject(result.json());
    return result.json();
  }

  private get(path: string) {
    return this.makeRequest(path, "get");
  }

  private post(path: string, body: Record<string, any>) {
    return this.makeRequest(path, "post", body);
  }

  private put(path: string, body: Record<string, any>) {
    return this.makeRequest(path, "put", body);
  }

  private del(path: string) {
    return this.makeRequest(path, "delete");
  }

  readonly auth = {
    createAccount: (
      body: User & { password: string; score?: number }
    ): Promise<User> => {
      return this.post("user/create", body).then((res) => {
        this.setToken(res.token);
        return res.user;
      });
    },
    signIn: (body: LoginBody): Promise<User> => {
      return this.post("user/login", body).then((res) => {
        this.setToken(res.token);
        return res.user;
      });
    },
    getSelf: (): Promise<User> => {
      if (!this.token) return Promise.reject("No token");
      return this.get("user");
    },
  };

  readonly user = {
    detail: (id: string): Promise<User> => {
      return this.get(`user/${id}`);
    },
    query: (filter: Condition<User>): Promise<User[]> => {
      return this.post("user", filter);
    },
    create: (body: User): Promise<User> => {
      return this.post("user/create", body);
    },
    changeName: (name: string): Promise<User> => {
      return this.post(`user/change-name`, { name });
    },
    delete: (id: string): Promise<User> => {
      return this.del(`user/${id}`);
    },
  };

  readonly score = {
    detail: (id: string): Promise<Score> => {
      return this.get(`score/${id}`);
    },
    query: (filter: Condition<Score>): Promise<Score[]> => {
      return this.post("score/query", filter);
    },
    create: (body: Score): Promise<Score> => {
      return this.post("score/create", body);
    },
    update: (id: string, body: Partial<Score>): Promise<Score> => {
      return this.put(`score/${id}`, body);
    },
    delete: (id: string): Promise<Score> => {
      return this.del(`score/${id}`);
    },
    self: (): Promise<TopScore[]> => {
      return this.get(`score/self`);
    },
    topScores: (): Promise<TopScore[]> => {
      return this.get(`score/top-scores`);
    },
  };
}
