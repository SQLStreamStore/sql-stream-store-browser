import { PaletteType } from '@material-ui/core';
import { bright, ColorScheme, isotope } from 'base16';
import invertColor from 'invert-color';
const invert = (scheme: ColorScheme): ColorScheme =>
    Object.keys(scheme).reduce(
        (akk, key) => ({
            ...akk,
            [key]: key.startsWith('base')
                // @ts-ignore
                ? invertColor(scheme[key])
                // @ts-ignore
                : scheme[key],
        }),
        // tslint:disable-next-line:no-object-literal-type-assertion
        {} as ColorScheme,
    );

const base16Themes: { [key: string]: ColorScheme } = {
    dark: { ...isotope, base00: '#00000000' },
    light: { ...invert(bright), base00: '#00000000' },
};

const reactJsonTheme = (type: PaletteType = 'light') => base16Themes[type];

export default reactJsonTheme;
