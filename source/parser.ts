import {utils} from 'ethers';
import {LabelMap} from './types.ts';

function tenderlyAddress(address: string): string {
    return address.slice(0, 10) + '...' + address.slice(-4);
}

function addLabel(labelMap: LabelMap, i: number, line: string, address: string, label: string, comment?: string) {
    const addresses = [address];
    let canonical;
    try {
        canonical = utils.getAddress(address);
    }
    catch (err: any) {
        if (err.message.match(/bad address checksum/)) {
            throw new Error(
                `Bad address checksum on line ${i + 1}:\n` + line);
        }
        throw err;
    }
    if (address != canonical) {
        addresses.push(canonical);
    }

    for (const a of addresses) {
        labelMap[a] = labelMap[tenderlyAddress(a)] = {
            label,
            comment,
        };
    }
}

export function parseLabels(labels: string): LabelMap {
    const labelMap: LabelMap = {};
    const labelLineRe = /^s*(0x[\da-f]{40})\s+(.+?)(?:\s+\/\/\s*(.*?)\s*)?$/i;
    const lines = labels.split('\n');
    for (const [i, line] of lines.entries()) {
        if (/^\s*(\/\/|$)/.test(line)) {
            // Comment or blank line; ignore
            continue;
        }

        const m = labelLineRe.exec(line);
        if (m) {
            const [_all, address, label, comment] = m;
            if (address && label) {
                addLabel(labelMap, i, line, address, label, comment);
                continue;
            }

            throw new Error(
                `BUG: parsing issue with line ${i + 1}; ` +
                    `address=${address ?? 'undefined'}, ` +
                    `label=${label ?? 'undefined'}:\n` +
                    line,
            );
        }

        throw new Error(`Failed to parse line ${i + 1}:\n` + line);
    }

    return labelMap;
}
