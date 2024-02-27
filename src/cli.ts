#!/usr/bin/env tsx

import process from 'process';
import * as fs from 'fs';
import * as readline from 'readline';

import { Command } from '@commander-js/extra-typings';

import { Mapper } from './shared/mapper';
import { Parser } from './shared/parser';
import { Formatter } from './shared/formatter';

interface CLIOptions {
  format: string;
  partial: string;
}

export function run() {
  const program = new Command();
  program
    .name('rolod0x')
    .description('CLI for mapping blockchain addresses to labels')
    .version('0.1.0')
    .option('-f, --format <FORMAT>', 'Label format for exact address matches', '%n (0x%4l…%4r)')
    .option('-p, --partial <FORMAT>', 'Label format for partial address matches', '[0x%4l…%n?…%4r]')
    .argument('<ADDRESS-FILE>', 'path to address book file')
    .action((addressesFile: string, options: CLIOptions) => {
      main(addressesFile, options);
    })
    .showHelpAfterError();

  program.parse();
}

function fatal(msg: string): void {
  console.error(msg + '\n');
  process.exit(1);
}

function main(addressesFile, options: CLIOptions): void {
  const mapper = getMapper(addressesFile, options);
  const rl = readline.createInterface({ input: process.stdin });
  rl.on('line', (line: string) => {
    const mapped = line.replace(/0x[0-9a-f]{40}\b/gi, (match: string) => replacer(mapper, match));
    console.log(mapped);
  });
}

function getMapper(addressesFile, options: CLIOptions): Mapper {
  if (!fs.existsSync(addressesFile)) {
    fatal(`File ${addressesFile} doesn't exist! Aborting.`);
  }

  const addresses = fs.readFileSync(addressesFile as string).toString();
  const parser = new Parser(addresses);

  const exactFormatter = new Formatter(options.format);
  const guessFormatter = new Formatter(options.partial);
  const mapper = new Mapper(exactFormatter, guessFormatter);
  mapper.importParsed(parser.parsedEntries);

  return mapper;
}

function replacer(mapper: Mapper, text: string): string {
  const mapped = mapper.get(text);
  if (!mapped) return text;
  return mapped.label;
}

run();
