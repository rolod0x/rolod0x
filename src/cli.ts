#!/usr/bin/env tsx

import process from 'process';
import * as fs from 'fs';
import * as readline from 'readline';

import { Command } from '@commander-js/extra-typings';

import { Formatter } from './shared/formatter';
import { RE_ADDRESSES_OR_BYTES32 } from './shared/regexps';
import { Mapper } from './shared/mapper';
import { Parser } from './shared/parser';

interface CLIOptions {
  duplicates?: boolean;
  format?: string;
  partial?: string;
}

export function run(): void {
  const program = new Command();
  program
    .name('rolod0x')
    .description('CLI for mapping blockchain addresses to labels')
    .version('0.1.0')
    .option('-f, --format <FORMAT>', 'Label format for exact address matches', '%n (%4l…%4r)')
    .option('-p, --partial <FORMAT>', 'Label format for partial address matches', '[%4l…%n?…%4r]')
    .option('-d, --duplicates', 'Show duplicates')
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

function main(addressesFile: string, options: CLIOptions): void {
  if (options.duplicates) {
    listDuplicates(addressesFile);
  } else {
    replaceStdin(addressesFile, options);
  }
}

function listDuplicates(addressesFile: string): void {
  const parser = getParser(addressesFile);
  let first = true;
  for (const address of parser.duplicates) {
    if (first) {
      first = false;
    } else {
      console.log('');
    }
    console.log(address);
    for (const label of parser.labels[address]) {
      console.log('    ' + label);
    }
    for (const comment of parser.comments[address] || []) {
      console.log('    // ' + comment);
    }
  }
}

function getParser(addressesFile: string): Parser {
  if (!fs.existsSync(addressesFile)) {
    fatal(`File ${addressesFile} doesn't exist! Aborting.`);
  }

  const addresses = fs.readFileSync(addressesFile as string).toString();
  return new Parser(addresses);
}

function replaceStdin(addressesFile: string, options: CLIOptions): void {
  const mapper = getMapper(addressesFile, options);
  const rl = readline.createInterface({ input: process.stdin });
  const regexp = new RegExp(RE_ADDRESSES_OR_BYTES32.source, 'gi');
  rl.on('line', (line: string) => {
    const mapped = line.replace(regexp, (match: string) => replacer(mapper, match));
    console.log(mapped);
  });
}

function getMapper(addressesFile: string, options: CLIOptions): Mapper {
  const exactFormatter = new Formatter(options.format);
  const guessFormatter = new Formatter(options.partial);
  const mapper = new Mapper(exactFormatter, guessFormatter);
  const parser = getParser(addressesFile);
  mapper.importParsed(parser.parsedEntries);

  return mapper;
}

function replacer(mapper: Mapper, text: string): string {
  const mapped = mapper.get(text);
  if (!mapped) return text;
  return mapped.label;
}

run();
