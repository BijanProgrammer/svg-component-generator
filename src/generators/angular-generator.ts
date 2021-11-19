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

const generateModuleContent = (icons: Icon[]): string => {
    const components = icons.map((x) => `${titleCase(x.name)}Component`);

    const declarations = components.map((x) => `        ${x},`);
    const imports = components.map((x, i) => `import {${x}} from './${icons[i].name}/${icons[i].name}.component';`);

    return `import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

${imports.join('\n')}

@NgModule({
    declarations: [
${declarations.join('\n')}
    ],
    imports: [CommonModule],
    exports: [
${declarations.join('\n')}
    ],
})
export class IconsModule {}
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

    const moduleFilePromise = fs.promises.writeFile(
        path.join(outputDirectory, 'icons.module.ts'),
        generateModuleContent(icons)
    );

    await Promise.all([...promises, moduleFilePromise]);
};
