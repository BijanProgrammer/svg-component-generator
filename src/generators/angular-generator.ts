import * as fs from 'fs';
import * as path from 'path';

import {Svg} from '../models/svg';
import {titleCase} from '../utils/string.utils';
import {AngularComponentInfo} from '../models/angular-component-info';

const generateComponentContent = (prefix: string, name: string): string => {
    return `import {Component} from '@angular/core';

@Component({
    selector: '${prefix}-${name}',
    templateUrl: './${name}.component.svg',
})
export class ${titleCase(name)}Component {}
`;
};

const generateModuleContent = (moduleName: string, svgs: Svg[]): string => {
    const components = svgs.map((x) => `${titleCase(x.name)}Component`);

    const declarations = components.map((x) => `        ${x},`);
    const imports = components.map((x, i) => `import {${x}} from './${svgs[i].name}/${svgs[i].name}.component';`);

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
export class ${moduleName} {}
`;
};

const generateComponents = async (outputDirectory: string, info: AngularComponentInfo): Promise<Promise<any>[]> => {
    if (!info.svgs || !info.svgs.length) return [];

    const promises: Promise<any>[] = [];

    for (const svg of info.svgs) {
        console.log(`generating ${svg.name} files ...`);

        await fs.promises.mkdir(path.join(outputDirectory, svg.name), {recursive: true});

        const svgFilePromise = fs.promises.writeFile(
            path.join(outputDirectory, svg.name, `${svg.name}.component.svg`),
            svg.content
        );

        const componentFilePromise = fs.promises.writeFile(
            path.join(outputDirectory, svg.name, `${svg.name}.component.ts`),
            generateComponentContent(info.prefix, svg.name)
        );

        promises.push(svgFilePromise, componentFilePromise);
    }

    const moduleFilePromise = fs.promises.writeFile(
        path.join(outputDirectory, info.moduleFilename),
        generateModuleContent(info.moduleName, info.svgs)
    );

    return [...promises, moduleFilePromise];
};

export const generateAngularComponents = async (
    outputDirectory: string,
    infos: AngularComponentInfo[]
): Promise<void> => {
    console.log('removing components folder ...');
    await fs.promises.rmdir(outputDirectory, {recursive: true});

    const promises: Promise<any>[] = [];
    for (const info of infos) {
        promises.push(...(await generateComponents(path.join(outputDirectory, info.folder), info)));
    }

    await Promise.all(promises);
};
