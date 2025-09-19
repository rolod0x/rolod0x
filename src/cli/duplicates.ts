import * as fs from 'fs';

import { Parser } from '../shared/parser';
import { Address } from '../shared/types';
import { fatal } from '../shared/utils';

// Maps from text (label/comment) -> address -> set of files containing that text for that address
// This complex nested structure is needed because:
// 1. The same label can be used for different addresses (e.g., "Alice" for 0x123 and "Alice" for 0x456)
// 2. The same address can have the same label in multiple files (e.g., "Uniswap" in both personal.txt and work.txt)
// 3. We need to track which specific files contain each label/address combination for display purposes
// Example: TextToFilesMap["Alice"][0x123] = Set{"personal.txt", "work.txt"}
type TextToFilesMap = Map<string, Map<Address, Set<string>>>;

// Stateful class for detecting and displaying duplicate addresses across multiple files
class DuplicatesDetector {
  private combinedParser = new Parser();
  private labelToFiles: TextToFilesMap = new Map();
  private commentToFiles: TextToFilesMap = new Map();
  private addressFiles: string[] = [];

  constructor(addressFiles: string[]) {
    this.validateFiles(addressFiles);
    this.addressFiles = addressFiles;
    this.parseAndTrackFiles();
  }

  // Display duplicate addresses with optional file filtering
  displayDuplicates(filesFilter?: string): void {
    let first = true;
    const duplicateAddresses = this.findCrossFileDuplicates();

    for (const address of duplicateAddresses) {
      if (filesFilter && !this.hasMatchingFile(address, filesFilter)) {
        continue;
      }

      if (first) {
        first = false;
      } else {
        console.log('');
      }

      this.displayDuplicateAddress(address);
    }
  }

  private validateFiles(addressFiles: string[]): void {
    for (const file of addressFiles) {
      if (!fs.existsSync(file)) {
        fatal(`File ${file} doesn't exist! Aborting.`);
      }
    }
  }

  // Parse all address files and build tracking maps to know which files contain each label/comment
  private parseAndTrackFiles(): void {
    for (const file of this.addressFiles) {
      const content = fs.readFileSync(file).toString();
      const fileParser = new Parser(content);

      this.trackLabelsAndComments(fileParser, file);
      this.combinedParser.parseMultiline(content);
    }
  }

  // Track which files contain each label and comment for a given address
  private trackLabelsAndComments(fileParser: Parser, file: string): void {
    for (const address of fileParser.addresses) {
      const labels = fileParser.labels[address] || [];
      const comments = fileParser.comments[address] || [];

      for (const label of labels) {
        this.addToTracker(this.labelToFiles, label, address, file);
      }

      for (const comment of comments) {
        this.addToTracker(this.commentToFiles, comment, address, file);
      }
    }
  }

  // Add a label/comment and its source file to the tracking data structure
  private addToTracker(tracker: TextToFilesMap, key: string, address: Address, file: string): void {
    if (!tracker.has(key)) {
      tracker.set(key, new Map());
    }
    if (!tracker.get(key)!.has(address)) {
      tracker.get(key)!.set(address, new Set());
    }
    tracker.get(key)!.get(address)!.add(file);
  }

  // Find addresses that appear in multiple files by analyzing label and comment file mappings
  private findCrossFileDuplicates(): Address[] {
    if (this.addressFiles.length <= 1) {
      return [];
    }

    const addressToFiles = new Map<Address, Set<string>>();

    for (const labelMap of this.labelToFiles.values()) {
      for (const [address, files] of labelMap) {
        if (!addressToFiles.has(address)) {
          addressToFiles.set(address, new Set());
        }
        for (const file of files) {
          addressToFiles.get(address)!.add(file);
        }
      }
    }

    for (const commentMap of this.commentToFiles.values()) {
      for (const [address, files] of commentMap) {
        if (!addressToFiles.has(address)) {
          addressToFiles.set(address, new Set());
        }
        for (const file of files) {
          addressToFiles.get(address)!.add(file);
        }
      }
    }

    return Array.from(addressToFiles.entries())
      .filter(([_address, files]) => files.size > 1)
      .map(([address, _files]) => address);
  }

  // Check if an address has any labels from files matching the filter substring
  private hasMatchingFile(address: Address, filesFilter: string): boolean {
    for (const label of this.combinedParser.labels[address]) {
      const labelFiles = this.labelToFiles.get(label)?.get(address);
      if (labelFiles) {
        for (const file of labelFiles) {
          if (file.includes(filesFilter)) {
            return true;
          }
        }
      }
    }
    return false;
  }

  private displayDuplicateAddress(address: Address): void {
    console.log(address);

    for (const label of this.combinedParser.labels[address] || []) {
      this.displayLabelWithFiles(label, address);
    }

    for (const comment of this.combinedParser.comments[address] || []) {
      this.displayCommentWithFiles(comment, address);
    }
  }

  private displayLabelWithFiles(label: string, address: Address): void {
    const labelFiles = this.labelToFiles.get(label)?.get(address);
    if (this.addressFiles.length > 1 && labelFiles && labelFiles.size > 0) {
      const fileList = Array.from(labelFiles).map(formatPath).join(', ');
      console.log(`    ${label} (${fileList})`);
    } else {
      console.log('    ' + label);
    }
  }

  private displayCommentWithFiles(comment: string, address: Address): void {
    const commentFiles = this.commentToFiles.get(comment)?.get(address);
    if (this.addressFiles.length > 1 && commentFiles && commentFiles.size > 0) {
      const fileList = Array.from(commentFiles).map(formatPath).join(', ');
      console.log(`    // ${comment} (${fileList})`);
    } else {
      console.log('    // ' + comment);
    }
  }
}

// Replace home directory with ~ in file paths for cleaner display
function formatPath(filePath: string): string {
  const homeDir = process.env.HOME || process.env.USERPROFILE || '';
  if (homeDir && filePath.startsWith(homeDir)) {
    return filePath.replace(homeDir, '~');
  }
  return filePath;
}

export function listDuplicates(addressFiles: string[], filesFilter?: string): void {
  const detector = new DuplicatesDetector(addressFiles);
  detector.displayDuplicates(filesFilter);
}
