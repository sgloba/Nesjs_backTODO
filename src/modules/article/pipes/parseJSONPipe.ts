import {PipeTransform, Injectable, ArgumentMetadata} from '@nestjs/common';

interface ParseJSONPipeOptionsI {
    omit?: string[],
    only?: string[]
}

@Injectable()
export class ParseJSONPipe implements PipeTransform {
    private options: ParseJSONPipeOptionsI = {};

    constructor(options: ParseJSONPipeOptionsI) {
        this.options = options;
    }

    transform(value: any, metadata: ArgumentMetadata) {

        return Object
            .keys(value)
            .filter((key) => {
                if (this.options.omit) {
                    return !this.options.omit.includes(key)
                }
                if (this.options.only) {
                    return this.options.only.includes(key)
                }
                return true
            })
            .reduce((result, key) => ({ ...result, [key]: JSON.parse(value[key]) }), {});
    }
}
