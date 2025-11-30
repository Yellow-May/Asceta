# Database Migrations

## Generating Migrations

To generate a new migration, run:

```bash
yarn migration:generate src/migrations/MigrationName
```

Replace `MigrationName` with a descriptive name for your migration (e.g., `CreateUsersTable`, `AddEmailToUsers`).

Example:
```bash
yarn migration:generate src/migrations/CreateInitialTables
```

## Running Migrations

To run all pending migrations:

```bash
yarn migration:run
```

## Reverting Migrations

To revert the last migration:

```bash
yarn migration:revert
```

## Note

In development mode, TypeORM's `synchronize` option is enabled, which automatically syncs your entities with the database schema. For production, disable `synchronize` and use migrations instead.



