import { createContext } from "react";
// Add new language locale import here
import localeZhCn from "./zhCn";

export type AppLocale = typeof localeZhCn;

export const LocaleContext = createContext(localeZhCn);

const locales: { name: string; locale: AppLocale }[] = [
    // Add new language locale object here
    {
        name: "简体中文",
        locale: localeZhCn
    }
];

export default locales;
