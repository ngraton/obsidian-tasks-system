# Project Instructions for obsidian-tasks

## Testing

Use `CI=true npx jest --no-coverage` to run tests. The `CI=true` environment variable prevents the approval test framework from opening VS Code diff windows when tests fail.

## Documentation

Documentation lives in `docs/`. Before implementing new features or modifying existing ones:

1. Read relevant documentation files first to understand conventions and patterns
2. Use that understanding to inform your implementation plan
3. Update documentation as part of the implementation, not as an afterthought

Key documentation files:

- `docs/Queries/Filters.md` - Filter syntax and examples
- `docs/Queries/Sorting.md` - Sorting syntax
- `docs/Queries/Grouping.md` - Grouping syntax
- `docs/Queries/Layout.md` - Display/layout options
- `docs/Getting Started/` - Feature introductions

## Commitments

Don't say you'll do things a certain way in the future unless you add those instructions to this file. Empty promises don't help.
