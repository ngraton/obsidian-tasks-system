<script lang="ts">
    import { doAutocomplete } from '../DateTime/DateAbbreviations';
    import { parseTypedDateForSaving } from '../DateTime/DateTools';
    import { labelContentWithAccessKey } from './EditTaskHelpers';

    export let dateSymbol: string;
    export let dates: string; // comma-separated dates
    export let accesskey: string | null;

    let newDateInput: string = '';
    let parsedDates: string[] = [];
    let newDateParsed: string = '';
    let isNewDateValid: boolean = true;

    // Parse the existing dates string into an array
    $: parsedDates = dates
        ? dates
              .split(',')
              .map((d) => d.trim())
              .filter((d) => d !== '')
        : [];

    // Handle autocomplete and validation for the new date input
    $: {
        newDateInput = doAutocomplete(newDateInput);
        if (newDateInput.trim() === '') {
            newDateParsed = '';
            isNewDateValid = true;
        } else {
            const parsed = parseTypedDateForSaving(newDateInput, false);
            if (parsed && parsed.isValid()) {
                newDateParsed = parsed.format('YYYY-MM-DD');
                isNewDateValid = true;
            } else {
                newDateParsed = 'invalid';
                isNewDateValid = false;
            }
        }
    }

    function addDate() {
        if (isNewDateValid && newDateParsed && newDateParsed !== 'invalid') {
            // Add the new date if it's not already in the list
            if (!parsedDates.includes(newDateParsed)) {
                parsedDates = [...parsedDates, newDateParsed];
                dates = parsedDates.join(',');
            }
            newDateInput = '';
            newDateParsed = '';
        }
    }

    function removeDate(dateToRemove: string) {
        parsedDates = parsedDates.filter((d) => d !== dateToRemove);
        dates = parsedDates.join(',');
    }

    function onKeyDown(e: KeyboardEvent) {
        if (e.key === 'Enter' && !e.isComposing) {
            e.preventDefault();
            addDate();
        }
    }

    function onDatePicked(e: Event) {
        const target = e.target as HTMLInputElement;
        if (target && target.value) {
            if (!parsedDates.includes(target.value)) {
                parsedDates = [...parsedDates, target.value];
                dates = parsedDates.join(',');
            }
            target.value = '';
        }
    }

    const datePlaceholder = "Try 'td' or 'Mon' then Enter";
</script>

<label for="top3Dates">{@html labelContentWithAccessKey('Top 3 Dates', accesskey)}</label>

<div class="tasks-modal-top3dates-container">
    <div class="tasks-modal-top3dates-input-row">
        <!-- svelte-ignore a11y-accesskey -->
        <input
            bind:value={newDateInput}
            id="top3Dates"
            type="text"
            class:tasks-modal-error={!isNewDateValid}
            class="tasks-modal-date-input"
            placeholder={datePlaceholder}
            {accesskey}
            on:keydown={onKeyDown}
        />
        {#if isNewDateValid && newDateParsed}
            <span class="tasks-modal-parsed-date">{dateSymbol} {newDateParsed}</span>
        {:else if !isNewDateValid}
            <code class="tasks-modal-parsed-date">{dateSymbol} invalid</code>
        {/if}
        <input class="tasks-modal-date-editor-picker" type="date" on:input={onDatePicked} tabindex="-1" />
        <button
            type="button"
            class="tasks-modal-top3dates-add"
            on:click={addDate}
            disabled={!isNewDateValid || !newDateParsed}
        >
            Add
        </button>
    </div>

    {#if parsedDates.length > 0}
        <div class="tasks-modal-top3dates-list">
            {#each parsedDates as date}
                <span class="tasks-modal-top3dates-chip">
                    {dateSymbol}
                    {date}
                    <button type="button" class="tasks-modal-top3dates-remove" on:click={() => removeDate(date)}>
                        &times;
                    </button>
                </span>
            {/each}
        </div>
    {/if}
</div>

<style>
    .tasks-modal-top3dates-container {
        display: flex;
        flex-direction: column;
        gap: 8px;
        grid-column: 2;
    }

    .tasks-modal-top3dates-input-row {
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .tasks-modal-top3dates-list {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
    }

    .tasks-modal-top3dates-chip {
        display: inline-flex;
        align-items: center;
        background-color: var(--interactive-normal);
        box-shadow: var(--input-shadow);
        border-radius: 16px;
        padding: 4px 8px;
        font-size: var(--font-ui-small);
    }

    .tasks-modal-top3dates-remove {
        margin-left: 4px;
        padding: 0 4px;
        border: none;
        background: none;
        cursor: pointer;
        font-size: 1.2em;
        line-height: 1;
        color: var(--text-muted);
    }

    .tasks-modal-top3dates-remove:hover {
        color: var(--text-error);
    }

    .tasks-modal-top3dates-add {
        padding: 4px 12px;
    }
</style>
