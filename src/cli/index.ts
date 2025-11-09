#!/usr/bin/env tsx

import process from 'process';
import * as fs from 'fs';
import * as readline from 'readline';

import { Command } from '@commander-js/extra-typings';

import { Formatter } from '../shared/formatter';
import { RE_ADDRESS_OR_BYTES32 } from '../shared/regexps';
import { Mapper } from '../shared/mapper';
import { Parser } from '../shared/parser';
import { fatal } from '../shared/utils';

import { listDuplicates } from './duplicates';

interface CLIOptions {
  duplicates?: boolean;
  format?: string;
  partial?: string;
  dupFilesFilter?: string;
}

export function run(): void {
  const program = new Command();
  program
    .name('rolod0x')
    .description('CLI for mapping blockchain addresses to labels')
    .version('0.1.0')
    .option('-f, --format <FORMAT>', 'Label format for exact address matches', '%n (0x%4l…%4r)')
    .option('-p, --partial <FORMAT>', 'Label format for partial address matches', '[0x%4l…%n?…%4r]')
    .option('-d, --duplicates', 'Show duplicates (supports multiple files for cross-file analysis)')
    .option(
      '-D, --dup-files-filter <FILTER>',
      'Only show duplicates with at least one label from a file matching this substring',
    )
    .argument('<ADDRESS-FILES...>', 'path(s) to address book file(s)')
    .action((addressFiles: string[], options: CLIOptions) => {
      main(addressFiles, options);
    })
    .showHelpAfterError();

  program.parse();
}

function main(addressFiles: string[], options: CLIOptions): void {
  if (options.dupFilesFilter && !options.duplicates) {
    fatal('--dup-files-filter can only be used with --duplicates option');
  }

  if (options.duplicates) {
    listDuplicates(addressFiles, options.dupFilesFilter);
  } else {
    if (addressFiles.length > 1) {
      fatal('Multiple files only supported with --duplicates option');
    }
    replaceStdin(addressFiles[0], options);
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
  const regexp = new RegExp(RE_ADDRESS_OR_BYTES32.source, 'gi');
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
