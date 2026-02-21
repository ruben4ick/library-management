import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";

const DATA_DIR = join(process.cwd(), "data");

export class FileBackedMap<T> extends Map<string, T> {
  private readonly filePath: string;
  private readonly reviver?: (value: unknown) => T;

  constructor(filename: string, reviver?: (value: unknown) => T) {
    super();
    this.filePath = join(DATA_DIR, filename);
    this.reviver = reviver;
    this.load();
  }

  private load(): void {
    if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
    if (!existsSync(this.filePath)) return;

    const raw = JSON.parse(readFileSync(this.filePath, "utf-8")) as [
      string,
      unknown,
    ][];
    for (const [key, value] of raw) {
      super.set(key, this.reviver ? this.reviver(value) : (value as T));
    }
  }

  private save(): void {
    writeFileSync(
      this.filePath,
      JSON.stringify(Array.from(this.entries()), null, 2),
      "utf-8",
    );
  }

  set(key: string, value: T): this {
    super.set(key, value);
    this.save();
    return this;
  }

  delete(key: string): boolean {
    const result = super.delete(key);
    if (result) this.save();
    return result;
  }
}
