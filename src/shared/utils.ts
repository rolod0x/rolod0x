export function fatal(msg: string): void {
  console.error(msg);
  process.exit(1);
}
