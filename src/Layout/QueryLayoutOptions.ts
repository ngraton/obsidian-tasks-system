/**
 * Display mode for top3 field
 */
export enum Top3DisplayMode {
    All = 'all', // Show all dates (default)
    Latest = 'latest', // Show only the latest (most recent) date
    Count = 'count', // Show count instead of dates
}

/**
 * Options to control {@link QueryRenderer} behaviour.
 *
 * @see LayoutOptions
 */
export class QueryLayoutOptions {
    hideToolbar: boolean = true;
    hidePostponeButton: boolean = false;
    hideTaskCount: boolean = false;
    hideBacklinks: boolean = false;
    hideEditButton: boolean = false;
    hideUrgency: boolean = true;
    hideTree: boolean = true;
    shortMode: boolean = false;
    explainQuery: boolean = false;
    top3DisplayMode: Top3DisplayMode = Top3DisplayMode.All;
}

// Type to extract only boolean keys from QueryLayoutOptions
type BooleanKeys<T> = {
    [K in keyof T]: T[K] extends boolean ? K : never;
}[keyof T];

/**
 * Parse show/hide options for Query Layout options
 * @param queryLayoutOptions
 * @param option - must already have been lower-cased
 * @param hide - whether the option should be hidden
 * @return True if the option was recognised, and false otherwise
 * @see parseTaskShowHideOptions
 */
export function parseQueryShowHideOptions(queryLayoutOptions: QueryLayoutOptions, option: string, hide: boolean) {
    const optionMap = new Map<string, BooleanKeys<QueryLayoutOptions>>([
        // Alphabetical order
        ['backlink', 'hideBacklinks'],
        ['edit button', 'hideEditButton'],
        ['postpone button', 'hidePostponeButton'],
        ['task count', 'hideTaskCount'],
        ['toolbar', 'hideToolbar'],
        ['tree', 'hideTree'],
        ['urgency', 'hideUrgency'],
    ]);

    for (const [key, property] of optionMap.entries()) {
        if (option.startsWith(key)) {
            queryLayoutOptions[property] = hide;
            return true;
        }
    }
    return false;
}
