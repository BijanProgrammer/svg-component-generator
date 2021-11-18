import * as fs from 'fs';
import * as path from 'path';

import {generateAngularComponents} from './generators/angular-generator';

import {Icon} from './models/icon';

import {printSeparator} from './utils/console.utils';

const ICONS_PATH = './assets/icons/';
const ANGULAR_COMPONENTS_PATH = './components/angular/';

const icons: Icon[] = [];

const loadIcons = async (): Promise<void> => {
    const filenames = await fs.promises.readdir(ICONS_PATH);

    for (const filename of filenames) {
        const fullPath = path.join(ICONS_PATH, filename);

        const {name, ext: extension} = path.parse(fullPath);
        if (extension !== '.svg') return;

        const content = await fs.promises.readFile(fullPath, 'utf8');
        icons.push({name, content});
    }
};

const main = async (): Promise<void> => {
    console.log('loading icons ...');
    await loadIcons();

    printSeparator();

    console.log('generating angular components ...');
    await generateAngularComponents(ANGULAR_COMPONENTS_PATH, icons);
};

main().then(() => console.info('Done!'));
