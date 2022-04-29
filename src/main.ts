import * as fs from 'fs';
import * as path from 'path';

import {generateAngularComponents} from './generators/angular-generator';

import {Svg} from './models/svg';

import {printSeparator} from './utils/console.utils';
import {AngularComponentInfo} from './models/angular-component-info';
import {FOLDER_TO_ANGULAR_COMPONENT_INFO} from './data/folder-to-angular-component-info';

const ASSETS_PATH = './assets/';
const COMPONENTS_PATH = './components/';
const PROJECT = 'code-star';

const ANGULAR_COMPONENTS_PATH = path.join(COMPONENTS_PATH, PROJECT, 'angular/');

const loadFolders = async (): Promise<string[]> => {
    const files = await fs.promises.readdir(path.join(ASSETS_PATH, PROJECT), {withFileTypes: true});
    const folders = files.filter((file) => file.isDirectory());
    return folders.map((folder) => folder.name);
};

const loadSvgs = async (svgsPath: string): Promise<Svg[]> => {
    try {
        const filenames = await fs.promises.readdir(svgsPath);
        const svgs: Svg[] = [];

        for (const filename of filenames) {
            const fullPath = path.join(svgsPath, filename);

            const {name, ext: extension} = path.parse(fullPath);
            if (extension !== '.svg') continue;

            const content = await fs.promises.readFile(fullPath, 'utf8');
            svgs.push({
                name,
                content,
            });
        }

        return svgs;
    } catch (e) {
        return [];
    }
};

const main = async (): Promise<void> => {
    const folders = await loadFolders();
    const infos: AngularComponentInfo[] = [];

    for (const folder of folders) {
        const info = FOLDER_TO_ANGULAR_COMPONENT_INFO.get(folder);
        if (!info) continue;

        console.log(`loading ${folder} ...`);
        const svgs = await loadSvgs(path.join(ASSETS_PATH, PROJECT, folder));

        infos.push({...info, folder, svgs});
    }

    printSeparator();

    console.log('generating angular components ...');
    await generateAngularComponents(ANGULAR_COMPONENTS_PATH, infos);
};

main().then(() => console.info('Done!'));
