declare global {
  namespace NodeJS {
    interface ProcessEnv extends Dict<string> {
      DB_USER?: string | undefined;
      DB_PASSWORD?: string | undefined;
      DB_HOST?: string | undefined;
      DB_PORT?: string | undefined;
      DB_NAME?: string | undefined;
      PORT?: string | undefined;
    }
  }

  function parseInt(string?: string, radix?: number): number;
}

export {};
