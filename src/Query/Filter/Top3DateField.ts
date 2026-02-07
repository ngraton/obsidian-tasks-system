import type { Moment } from 'moment';
import { DateRange } from '../../DateTime/DateRange';
import type { Task } from '../../Task/Task';
import { DateParser } from '../../DateTime/DateParser';
import { Explanation } from '../Explain/Explanation';
import type { Comparator } from '../Sort/Sorter';
import { compareByDate } from '../../DateTime/DateTools';
import type { GrouperFunction } from '../Group/Grouper';
import { Field } from './Field';
import { Filter, type FilterFunction } from './Filter';
import { FilterInstructions } from './FilterInstructions';
import { FilterOrErrorMessage } from './FilterOrErrorMessage';

/**
 * Support the 'top3' search instruction.
 *
 * This field handles multiple dates, checking if any of the task's top3Dates
 * match the query criteria.
 */
export class Top3DateField extends Field {
    private readonly filterInstructions: FilterInstructions;

    constructor() {
        super();
        this.filterInstructions = new FilterInstructions();
        this.filterInstructions.add('has top3 date', (task: Task) => task.top3Dates.length > 0);
        this.filterInstructions.add('no top3 date', (task: Task) => task.top3Dates.length === 0);
    }

    public fieldName(): string {
        return 'top3';
    }

    public canCreateFilterForLine(line: string): boolean {
        if (this.filterInstructions.canCreateFilterForLine(line)) {
            return true;
        }
        if (this.countFilterRegExp().test(line)) {
            return true;
        }
        return super.canCreateFilterForLine(line);
    }

    private countFilterRegExp(): RegExp {
        return /^top3 count\s*(>|>=|<|<=|=|is)\s*(\d+)$/i;
    }

    public createFilterOrErrorMessage(line: string): FilterOrErrorMessage {
        const filterResult = this.filterInstructions.createFilterOrErrorMessage(line);
        if (filterResult.isValid()) {
            return filterResult;
        }

        // Check for count-based filter
        const countMatch = line.match(this.countFilterRegExp());
        if (countMatch !== null) {
            return this.createCountFilter(line, countMatch[1], parseInt(countMatch[2], 10));
        }

        const fieldNameKeywordDate = Field.getMatch(this.filterRegExp(), line);
        if (fieldNameKeywordDate === null) {
            return FilterOrErrorMessage.fromError(line, 'do not understand query filter (top3 date)');
        }

        const keywordAndDateString = fieldNameKeywordDate[1];
        const fieldKeyword = fieldNameKeywordDate[2]?.toLowerCase();
        const fieldDateString = fieldNameKeywordDate[3];

        // Try interpreting everything after the keyword as a date range
        let fieldDates = DateParser.parseDateRange(fieldDateString);

        // If date range parsing failed, try single date
        if (!fieldDates.isValid()) {
            const date = DateParser.parseDate(keywordAndDateString);
            if (date.isValid()) {
                fieldDates = new DateRange(date, date);
            }
        }

        if (!fieldDates.isValid()) {
            return FilterOrErrorMessage.fromError(line, 'do not understand top3 date');
        }

        const filterFunction = this.buildFilterFunction(fieldKeyword, fieldDates);
        const explanation = this.buildExplanation(fieldKeyword, fieldDates);

        return FilterOrErrorMessage.fromFilter(new Filter(line, filterFunction, explanation));
    }

    private createCountFilter(line: string, operator: string, value: number): FilterOrErrorMessage {
        let filterFunction: FilterFunction;
        let explanation: string;

        switch (operator.toLowerCase()) {
            case '>':
                filterFunction = (task: Task) => task.top3Count > value;
                explanation = `top3 count is greater than ${value}`;
                break;
            case '>=':
                filterFunction = (task: Task) => task.top3Count >= value;
                explanation = `top3 count is at least ${value}`;
                break;
            case '<':
                filterFunction = (task: Task) => task.top3Count < value;
                explanation = `top3 count is less than ${value}`;
                break;
            case '<=':
                filterFunction = (task: Task) => task.top3Count <= value;
                explanation = `top3 count is at most ${value}`;
                break;
            case '=':
            case 'is':
                filterFunction = (task: Task) => task.top3Count === value;
                explanation = `top3 count is exactly ${value}`;
                break;
            default:
                return FilterOrErrorMessage.fromError(line, `Unknown operator: ${operator}`);
        }

        return FilterOrErrorMessage.fromFilter(new Filter(line, filterFunction, new Explanation(explanation)));
    }

    protected filterRegExp(): RegExp {
        return new RegExp('^top3 (((?:on|in) or before|before|(?:on|in) or after|after|on|in)? ?(.*))', 'i');
    }

    private buildFilterFunction(fieldKeyword: string, fieldDates: DateRange): FilterFunction {
        return (task: Task) => {
            if (task.top3Dates.length === 0) {
                return false;
            }

            // Get the latest (most recent) top3 date
            const latestDate = this.getLatestDate(task);
            if (!latestDate || !latestDate.isValid()) {
                return false;
            }

            switch (fieldKeyword) {
                case 'before':
                    return latestDate.isBefore(fieldDates.start);
                case 'after':
                    return latestDate.isAfter(fieldDates.end);
                case 'on or before':
                case 'in or before':
                    return latestDate.isSameOrBefore(fieldDates.end);
                case 'on or after':
                case 'in or after':
                    return latestDate.isSameOrAfter(fieldDates.start);
                default:
                    // 'on' or no keyword - check if date is within range
                    return latestDate.isSameOrAfter(fieldDates.start) && latestDate.isSameOrBefore(fieldDates.end);
            }
        };
    }

    private getLatestDate(task: Task): Moment | null {
        if (task.top3Dates.length === 0) {
            return null;
        }
        return task.top3Dates.reduce((latest, current) => (current.isAfter(latest) ? current : latest));
    }

    private buildExplanation(fieldKeyword: string, fieldDates: DateRange): Explanation {
        const dateFormat = 'YYYY-MM-DD (dddd Do MMMM YYYY)';
        let relationship = fieldKeyword || 'on';

        let explanationDates: string;
        switch (fieldKeyword) {
            case 'before':
            case 'on or after':
            case 'in or after':
                explanationDates = fieldDates.start.format(dateFormat);
                if (fieldKeyword === 'in or after') relationship = 'on or after';
                break;
            case 'after':
            case 'on or before':
            case 'in or before':
                explanationDates = fieldDates.end.format(dateFormat);
                if (fieldKeyword === 'in or before') relationship = 'on or before';
                break;
            default:
                if (!fieldDates.start.isSame(fieldDates.end)) {
                    return new Explanation('top3 date is between:', [
                        new Explanation(`${fieldDates.start.format(dateFormat)} and`),
                        new Explanation(`${fieldDates.end.format(dateFormat)} inclusive`),
                    ]);
                }
                explanationDates = fieldDates.start.format(dateFormat);
                break;
        }

        return new Explanation(`top3 date is ${relationship} ${explanationDates}`);
    }

    public supportsSorting(): boolean {
        return true;
    }

    /**
     * Sort by the most recent top3 date
     */
    public comparator(): Comparator {
        return (a: Task, b: Task) => {
            const aDate = this.getLatestDate(a);
            const bDate = this.getLatestDate(b);
            return compareByDate(aDate, bDate);
        };
    }

    public supportsGrouping(): boolean {
        return true;
    }

    /**
     * Group by top3 count
     */
    public grouper(): GrouperFunction {
        return (task: Task) => {
            const count = task.top3Dates.length;
            if (count === 0) {
                return ['No top3 dates'];
            }
            return [`Top3: ${count} time${count === 1 ? '' : 's'}`];
        };
    }
}
