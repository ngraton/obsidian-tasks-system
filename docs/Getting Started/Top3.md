---
publish: true
---

# Top 3 Dates

<span class="related-pages">#feature/top3</span>

## Introduction

The Top 3 feature allows you to mark tasks as part of your "Top 3" priorities for specific days. This is inspired by productivity methods that encourage focusing on just three important tasks each day.

Unlike a single due date, a task can be marked as Top 3 on multiple days - perfect for recurring priorities or tasks that span several days.

## The Top 3 Emoji

Tasks uses the `🎯` (target) emoji to mark Top 3 dates.

Example task:

```text
- [ ] Review quarterly report 🎯 2026-02-06
```

A task with multiple Top 3 dates:

```text
- [ ] Prepare presentation 🎯 2026-02-01,2026-02-03,2026-02-06
```

## Adding Top 3 Dates

### Using the Edit Task Modal

1. Open the Edit Task modal (click the pencil icon or use the command palette)
2. Find the "Top 3 Dates" field
3. Type a date using natural language (e.g., "today", "tomorrow", "td") or YYYY-MM-DD format
4. Click "Add" or press Enter to add the date
5. Dates appear as chips that can be removed by clicking the × button

### Manually in Markdown

Add the `🎯` emoji followed by comma-separated dates in YYYY-MM-DD format:

```text
- [ ] Important task 🎯 2026-02-06
- [ ] Multi-day task 🎯 2026-02-01,2026-02-03
```

## Filtering by Top 3

### Date-based Filters

Filter tasks based on their **most recent** (latest) Top 3 date:

```text
top3 on today
top3 on 2026-02-06
top3 before tomorrow
top3 after yesterday
top3 on or before today
top3 on or after today
top3 this week
top3 last week
```

> [!info]
> When a task has multiple Top 3 dates, the filter checks only the **latest** (most recent) date. This means `top3 on today` matches tasks where the most recent Top 3 date is today, even if the task was also Top 3 on earlier dates.

### Count-based Filters

Filter tasks by how many times they've been marked as Top 3:

```text
top3 count > 1
top3 count >= 3
top3 count < 5
top3 count <= 2
top3 count = 1
top3 count is 2
```

This is useful for finding tasks that have been prioritized multiple times (perhaps indicating difficulty completing them, or ongoing importance).

### Presence Filters

Check if a task has any Top 3 dates at all:

```text
has top3 date
no top3 date
```

## Sorting by Top 3

Sort tasks by their most recent Top 3 date:

```text
sort by top3
sort by top3 reverse
```

Tasks with more recent Top 3 dates will appear first (or last with `reverse`).

## Grouping by Top 3

Group tasks by their Top 3 count:

```text
group by top3
group by top3 reverse
```

This creates groups like:

- `No top3 dates`
- `Top3: 1 time`
- `Top3: 2 times`
- `Top3: 3 times`

## Display Options

### Hiding Top 3 Dates

To hide the Top 3 field from query results:

```text
hide top3 dates
```

To show it again (it's shown by default):

```text
show top3 dates
```

### Short Mode

In short mode, only the `🎯` emoji is shown without the dates. Hover over the task to see the full Top 3 information in a tooltip:

```text
short mode
```

### Top 3 Display Mode

Control how Top 3 is displayed with the `top3 display` command:

```text
top3 display all      # Default: shows all dates (e.g., 🎯 2026-02-01,2026-02-03)
top3 display latest   # Shows only the most recent date (e.g., 🎯 2026-02-03)
top3 display count    # Shows count instead of dates (e.g., 🎯 2)
```

This is useful when you want a cleaner display:

```tasks
not done
has top3 date
top3 display count
group by top3
```

## Example Queries

### Today's Top 3

Show tasks that are Top 3 for today:

```tasks
top3 on today
not done
```

### This Week's Top 3 Overview

Show all tasks prioritized this week, grouped by count:

```tasks
top3 this week
not done
group by top3
top3 display latest
```

### Frequently Prioritized Tasks

Find tasks that have been Top 3 many times (might need extra attention):

```tasks
top3 count >= 3
not done
sort by top3
```

### Tasks Never in Top 3

Find tasks that have never been prioritized:

```tasks
no top3 date
not done
path includes Projects
```

## Use Cases

### Daily Planning

Each morning, mark your three most important tasks for the day:

```text
- [ ] Complete project proposal 🎯 2026-02-06
- [ ] Review team feedback 🎯 2026-02-06
- [ ] Prepare for client meeting 🎯 2026-02-06
```

### Weekly Review

During weekly reviews, you can query which tasks were prioritized and how often:

```tasks
top3 this week
group by top3
sort by top3 reverse
```

### Tracking Recurring Priorities

Some tasks keep coming back to your Top 3. Track these with count queries to identify patterns:

```tasks
top3 count > 3
not done
```

This might indicate tasks that need to be broken down, delegated, or scheduled differently.

## Comparison with Due Date

| Feature | Due Date (`📅`) | Top 3 Date (`🎯`) |
|---------|-----------------|-------------------|
| Number of dates | Single date | Multiple dates |
| Primary purpose | When task must be done | When task is a priority |
| Multiple values | No | Yes (comma-separated) |
| Affects recurrence | Yes | No |
| Shown in calendar views | Yes | Depends on plugin |

Top 3 dates complement due dates rather than replacing them. A task can have both:

```text
- [ ] Submit report 🎯 2026-02-05,2026-02-06 📅 2026-02-07
```

This means: "This task is due on Feb 7, but I'm prioritizing it on Feb 5 and 6."
