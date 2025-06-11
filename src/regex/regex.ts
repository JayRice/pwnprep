import { TargetParams } from '../data/interfaces.ts';
import {getCustomParams} from "../database/database.ts";

import {PLACEHOLDERS} from "../data/data.ts"

/**
 * List of all placeholder keys used in commands.
 * Add any new placeholder key here to have it automatically handled by replaceParams and revertParams.
 */
import {useStore} from "../store/useStore.ts"

/**
 * Replaces all placeholders (e.g., `[target_host]`) in the given command string
 * with their corresponding values from targetParams. If a value is missing or empty,
 * the placeholder remains unchanged in the output.
 */
export async function replaceParams (
    command: string
): Promise<string> {
    let result = command;


    const targetParams = useStore.getState().targetParams;

    // for (const key of PLACEHOLDERS) {
    //
    //     const placeholder = `[${key}]`;
    //     const value = targetParams[key] || placeholder;
    //     // Construct a global regex to match the exact placeholder.
    //     const regex = new RegExp(`\\[${key}\\]`, 'g');
    //     if(!regex) continue
    //     result = result.replace(regex, value);
    // }

    const customParams = await getCustomParams();
    for (const custom of customParams) {
        const placeholder = custom.placeholder;
        const value = custom.value.trim() == "" ? placeholder : custom.value;

        if(!value) {continue}

        const escapeRegExp = (str: string) =>
            str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        console.log(escapeRegExp(placeholder))
        const regex = new RegExp(`${escapeRegExp(placeholder)}`, 'g');
        result = result.replace(regex, value);
    }
    console.log("Result: ", result)
    return result;
}

/**
 * Reverts any inserted parameter values back to their placeholder form (e.g., `myhost.com` → `[target_host]`).
 * Iterates over all keys in targetParams; for each non-empty value, escapes it for safe regex usage and replaces
 * occurrences of that literal value in the command string with the corresponding placeholder.
 */
export async function revertParams  (
    command: string
): Promise<string>  {
    let result = command;

    const targetParams = useStore.getState().targetParams;

    //
    // for (const key of PLACEHOLDERS) {
    //     const value = targetParams[key];
    //     if (!value) continue; // Skip if no value provided
    //
    //     // Escape special regex characters in the value to safely build a search regex
    //     const safeValue = value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    //     const regex = new RegExp(safeValue, 'g');
    //     const placeholder = `[${key}]`;
    //
    //     result = result.replace(regex, placeholder);
    // }

    const customParams = await getCustomParams();

    for (const custom of customParams) {
        const placeholder = custom.placeholder;
        const value = custom.value;
        if(!value) continue
        // Escape special regex characters in the value to safely build a search regex
        const safeValue = value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(safeValue, 'g');

        result = result.replace(regex, placeholder);
    }


    return result;
};