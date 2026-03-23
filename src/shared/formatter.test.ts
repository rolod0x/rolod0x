import { Formatter } from './formatter';

const label = 'my address label';

describe('Formatter', () => {
  const testCases = [
    { name: 'evm address with 0x prefix', addr: '0xe3D82337F79306712477b642EF59B75dD62eF109' },
    { name: 'evm address without 0x prefix', addr: 'e3D82337F79306712477b642EF59B75dD62eF109' },
    { name: 'solana address', addr: 'DYw8jCTfwHNRJhhmFcbXvVDTqWMEVFBX6ZKUmG5CNSKK' },
  ];

  testCases.forEach(({ name, addr }) => {
    describe(name, () => {
      it('formats a label with no changes', () => {
        const formatter = new Formatter('%n');
        expect(formatter.format(label, addr)).toEqual(label);
      });

      it('formats a label with some parentheses', () => {
        const formatter = new Formatter('[%n]');
        expect(formatter.format(label, addr)).toEqual('[' + label + ']');
      });

      it('formats a label with leading digits', () => {
        const formatter = new Formatter('<%n | %6l>');
        const trimmed = addr.replace(/^0x/, '');
        const prefix = addr.startsWith('0x') ? '0x' : '';
        const expected = `<${label} | ${prefix}${trimmed.slice(0, 6)}>`;
        expect(formatter.format(label, addr)).toEqual(expected);
      });

      it('formats a label with trailing digits', () => {
        const formatter = new Formatter('%n | %4r');
        const trimmed = addr.replace(/^0x/, '');
        expect(formatter.format(label, addr)).toEqual(`${label} | ${trimmed.slice(-4)}`);
      });

      it('formats a label with leading and trailing digits', () => {
        const formatter = new Formatter('%4l...%n...%4r');
        const trimmed = addr.replace(/^0x/, '');
        const prefix = addr.startsWith('0x') ? '0x' : '';
        expect(formatter.format(label, addr)).toEqual(
          `${prefix}${trimmed.slice(0, 4)}...${label}...${trimmed.slice(-4)}`,
        );
      });

      it('formats a label with a full address', () => {
        const formatter = new Formatter('%n (%a)');
        expect(formatter.format(label, addr)).toEqual(`${label} (${addr})`);
      });
    });

    it('formats a label combining internal digits with other formats', () => {
      // Test the format used by Kraken
      const formatter = new Formatter('%2l %2i4 ... %-8i4 %4r');
      const trimmed = addr.replace(/^0x/, '');
      const prefix = addr.startsWith('0x') ? '0x' : '';
      expect(formatter.format(label, addr)).toEqual(
        `${prefix}${trimmed.slice(0, 2)} ${trimmed.slice(2, 6)} ... ${trimmed.slice(-8, -4)} ${trimmed.slice(-4)}`,
      );
    });
  });
});
