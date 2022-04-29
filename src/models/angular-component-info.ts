import {Svg} from './svg';

export interface AngularComponentInfo {
    prefix: string;
    moduleFilename: string;
    moduleName: string;
    folder: string;
    svgs: Svg[];
}
