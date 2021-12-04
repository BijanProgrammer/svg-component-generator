import * as fs from 'fs';
import * as path from 'path';

import {generateAngularComponents} from './generators/angular-generator';

import {Svg} from './models/svg';

import {printSeparator} from './utils/console.utils';

const ASSETS_PATH = './assets/';
const COMPONENTS_PATH = './components/';
const PROJECT = 'storybook';

const ICONS_PATH = path.join(ASSETS_PATH, PROJECT, 'icons/');
const ILLUSTRATIONS_PATH = path.join(ASSETS_PATH, PROJECT, 'illustrations/');
const LOGOS_PATH = path.join(ASSETS_PATH, PROJECT, 'logos/');

const ANGULAR_COMPONENTS_PATH = path.join(COMPONENTS_PATH, PROJECT, 'angular/');

let icons: Svg[] = [];
let illustrations: Svg[] = [];
let logos: Svg[] = [];

const loadSvgs = async (svgsPath: string): Promise<Svg[]> => {
    const filenames = await fs.promises.readdir(svgsPath);
    const svgs: Svg[] = [];

    for (const filename of filenames) {
        const fullPath = path.join(svgsPath, filename);

        const {name, ext: extension} = path.parse(fullPath);
        if (extension !== '.svg') continue;

        const content = await fs.promises.readFile(fullPath, 'utf8');
        svgs.push({name, content});
    }

    return svgs;
};

const main = async (): Promise<void> => {
    console.log('loading icons ...');
    icons = await loadSvgs(ICONS_PATH);

    console.log('loading illustrations ...');
    illustrations = await loadSvgs(ILLUSTRATIONS_PATH);

    console.log('loading logos ...');
    logos = await loadSvgs(LOGOS_PATH);

    printSeparator();

    console.log('generating angular components ...');
    await generateAngularComponents(ANGULAR_COMPONENTS_PATH, icons, illustrations, logos);
};

main().then(() => console.info('Done!'));
