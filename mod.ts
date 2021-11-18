import { flatten } from "https://deno.land/x/flatten@1.0.0/mod.ts";
import { escapeHtml } from "https://deno.land/x/escape@1.4.0/mod.ts";

export type FlattenData = Record<string, Record<string, string>>;

const flattenData: FlattenData = {};

export const load = (locale: string, data: Record<string, unknown>): void => {
  flattenData[locale] = flatten(data) as Record<string, string>;
};

export const t = (
  locale: string,
  key: string,
  args?: Record<string, unknown>
) => {
  if (!flattenData[locale]) {
    return null;
  }

  if (!flattenData[locale][key]) {
    return null;
  }

  if (args) {
    const flattenArgs = flatten(args) as Record<string, string>;

    let str = flattenData[locale][key];
    const variables = str.match(/(\{\{.*?\}\}|\{.*?\})/gim);

    if (variables && variables.length > 0) {
      for (const variable of variables) {
        const cleanVariableName = variable.replace(/[\{\}]/g, "");

        if (variable.startsWith("{{") && variable.endsWith("}}")) {
          str = str.replaceAll(variable, flattenArgs[cleanVariableName]);
        } else {
          str = str.replaceAll(
            variable,
            escapeHtml(flattenArgs[cleanVariableName])
          );
        }
      }

      return str;
    }
  }

  return flattenData[locale][key];
};
