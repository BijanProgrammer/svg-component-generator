import * as fs from 'fs';
import * as path from 'path';

import {Icon} from '../models/icon';
import {titleCase} from '../utils/string.utils';

const generateComponentContent = (name: string): string => {
    return `import {Component} from '@angular/core';

@Component({
    selector: 'icon-${name}',
    templateUrl: './${name}.component.svg',
})
export class ${titleCase(name)}Component {}
`;
};

export const generateAngularComponents = async (outputDirectory: string, icons: Icon[]): Promise<void> => {
    const promises: Promise<any>[] = [];

    for (const icon of icons) {
        console.log(`generating ${icon.name} files ...`);

        await fs.promises.mkdir(path.join(outputDirectory, icon.name), {recursive: true});

        const svgFilePromise = fs.promises.writeFile(
            path.join(outputDirectory, icon.name, `${icon.name}.component.svg`),
            icon.content
        );

        const componentFilePromise = fs.promises.writeFile(
            path.join(outputDirectory, icon.name, `${icon.name}.component.ts`),
            generateComponentContent(icon.name)
        );

        promises.push(svgFilePromise, componentFilePromise);
    }

    await Promise.all(promises);
};
