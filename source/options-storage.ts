import OptionsSync from 'webext-options-sync';

export default new OptionsSync({
    defaults: {
        labels: '',
    },
    migrations: [OptionsSync.migrations.removeUnused],
    logging: true,
});
