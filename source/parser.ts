import {LabelMap} from './types.ts';

function tenderlyAddress(address: string): string {
    return address.slice(0, 10) + '...' + address.slice(-4);
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
                labelMap[address] = labelMap[tenderlyAddress(address)] = {
                    label,
                    comment,
                };
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
