import {utils} from 'ethers';

import {AddressData, LabelMap} from './types';

// On many sites (e.g. Tenderly, defender.openzeppelin.com, Gnosis Safe),
// we see this abbreviated form of addresses.
function abbreviatedAddress1(address: string): string {
    return address.slice(0, 10) + '...' + address.slice(-4);
}

// On etherscan, we see a different form of abbreviation:
function abbreviatedAddress2(address: string): string {
    return address.slice(0, 8) + '...' + address.slice(-8);
}

function addLabel(labelMap: LabelMap, i: number, line: string, address: string, label: string, comment?: string) {
    const addresses = [address];
    let canonical: string;
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
    if (address === canonical) {
        addresses.push(canonical.toLowerCase());
    } else {
        addresses.push(canonical);
    }

    for (const a of addresses) {
        labelMap.set(a, {label, comment});

        // The abbreviated form has a small risk of collisions,
        // so technically this is "just" a well-educated guess,
        // and we append a suffix to indicate the uncertainty.
        const guess = {label: label + '?', comment};
        labelMap.set(abbreviatedAddress1(a), guess);
        labelMap.set(abbreviatedAddress2(a), guess);
    }
}

export function parseLabels(labels: string): LabelMap {
    const labelMap: LabelMap = new Map<string, AddressData>();
    const labelLineRe = /^s*(0x[\da-f]{40})\s+(.+?)(?:\s+\/\/\s*(.*?)\s*)?$/i;
    const lines = labels.split('\n');
    lines.forEach((line, i) => {
        if (/^\s*(\/\/|$)/.test(line)) {
            // Comment or blank line; ignore
            return;
        }

        const m = labelLineRe.exec(line);
        if (m) {
            const [_all, address, label, comment] = m;
            if (address && label) {
                addLabel(labelMap, i, line, address, label, comment);
                return;
            }

            throw new Error(
                `BUG: parsing issue with line ${i + 1}; ` +
                    `address=${address ?? 'undefined'}, ` +
                    `label=${label ?? 'undefined'}:\n` +
                    line,
            );
        }

        throw new Error(`Failed to parse line ${i + 1}:\n` + line);
    });

    return labelMap;
}
