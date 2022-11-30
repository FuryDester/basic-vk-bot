import * as LokiDatabase from 'lokijs';
import DatabaseNotAvailableException from '@/exceptions/custom-exceptions/database-not-available-exception';

export class DatabaseClient {
  private db: LokiDatabase;

  private isAvailable: boolean;

  constructor(databaseName: string, onAvailability?: () => void) {
    this.isAvailable = false;

    this.db = new LokiDatabase(`${databaseName}.db`, {
      autoload         : true,
      autosave         : true,
      autosaveInterval : 2000,
      autoloadCallback : () => {
        this.isAvailable = true;
        if (onAvailability) {
          onAvailability();
        }
      },
    });
  }

  afterAvailability(callback: () => void, hold: number = 500): void {
    let interval = setInterval(() => {
      if (this.isAvailable) {
        clearInterval(interval);
        callback();
      }
    }, hold > 0 ? hold : 500);
  }

  getOrAddCollection(name: string, options?: Partial<CollectionOptions<unknown>> | undefined): Collection<object> {
    this.throwIfNotAvailable();

    return this.db.getCollection(name) || this.db.addCollection(name, options);
  }

  getDatabase(): LokiDatabase {
    return this.db;
  }

  setDatabase(db: LokiDatabase): DatabaseClient {
    this.db = db;
    this.isAvailable = true;

    return this;
  }

  close(): void {
    this.throwIfNotAvailable();

    this.db.close();

    this.isAvailable = false;
  }

  private throwIfNotAvailable(): void {
    if (!this.isAvailable) {
      throw new DatabaseNotAvailableException('Database is not available', {
        databaseName: this.db.filename,
      });
    }
  }
}

export const databaseClient = new DatabaseClient(process.env.DATABASE_NAME!);
