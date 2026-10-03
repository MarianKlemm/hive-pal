# HivePal MCP/API integration plan

This branch keeps HivePal close to upstream while adding an automation boundary for AI clients.

## Goals

- Reuse existing HivePal domain services instead of duplicating business logic.
- Keep existing apiary permission checks authoritative.
- Expose a small, stable tool surface suitable for MCP clients.
- Separate read-only tools from mutating tools.
- Keep the integration optional so upstream changes remain easy to merge.

## Phase 1 — foundation

1. Inventory existing REST endpoints and domain services.
2. Define MCP resources/tools for apiaries, hives, inspections and actions.
3. Add dedicated machine authentication based on scoped tokens.
4. Implement read-only tools first.
5. Add tests for tenant/apiary isolation and permissions.

Initial read tools:
- list_apiaries
- list_hives
- get_hive
- list_recent_inspections
- list_actions
- get_hive_context

## Phase 2 — controlled writes

Initial write tools:
- create_feeding
- create_treatment
- create_note
- create_quick_check
- create_todo

Writes must call existing HivePal services and permission guards; the MCP layer must not write directly to Prisma.

## Phase 3 — sensor/automation integration

- Hive scales and weight measurements
- MQTT bridge
- Home Assistant/n8n integration
- alert/event resources

## Architecture

AI client / ChatGPT / local model
→ MCP adapter
→ HivePal application services
→ Prisma/PostgreSQL

Sensor devices
→ MQTT/bridge
→ HivePal measurement services

The MCP adapter is intentionally thin. HivePal remains the system of record.
