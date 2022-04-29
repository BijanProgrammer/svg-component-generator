import {AngularComponentInfo} from '../models/angular-component-info';

export const FOLDER_TO_ANGULAR_COMPONENT_INFO = new Map<string, AngularComponentInfo>([
    [
        'icons',
        {
            folder: 'icons',
            prefix: 'icon',
            moduleFilename: 'icons.module.ts',
            moduleName: 'IconsModule',
            svgs: [],
        },
    ],
    [
        'illustrations',
        {
            folder: 'illustrations',
            prefix: 'illustration',
            moduleFilename: 'illustrations.module.ts',
            moduleName: 'IllustrationsModule',
            svgs: [],
        },
    ],
    [
        'logos',
        {
            folder: 'logos',
            prefix: 'logo',
            moduleFilename: 'logos.module.ts',
            moduleName: 'LogosModule',
            svgs: [],
        },
    ],
    [
        'technologies',
        {
            folder: 'technologies',
            prefix: 'technology',
            moduleFilename: 'technologies.module.ts',
            moduleName: 'TechnologiesModule',
            svgs: [],
        },
    ],
]);
