#!/usr/bin/env node
/**
 * LandOS Duke persistence CLI
 *
 * Persists a completed Duke run's structured metadata into landos.db.
 * Runs after report delivery (same pattern as gen-pdf-bg.js) so it never
 * sits on Duke's fast path. No network, no .env, no secrets.
 *
 * Usage:
 *   node dist/landos/duke-persist-cli.js <payload.json>
 *   node dist/landos/duke-persist-cli.js --stdin   (payload JSON on stdin)
 *
 * Payload shape: see DukeRunPayload in src/landos/duke-persist.ts.
 */

import fs from 'fs';

import { parseDukePayload, persistDukeRun, type DukeRunPayload } from './duke-persist.js';

function readPayloadText(): string {
  const arg = process.argv[2];
  if (!arg) {
    console.error('Usage: duke-persist-cli <payload.json> | --stdin');
    process.exit(1);
  }
  if (arg === '--stdin') {
    return fs.readFileSync(0, 'utf8');
  }
  if (!fs.existsSync(arg)) {
    console.error(`Payload file not found: ${arg}`);
    process.exit(1);
  }
  return fs.readFileSync(arg, 'utf8');
}

let payload: DukeRunPayload;
try {
  payload = parseDukePayload(readPayloadText());
} catch (err) {
  console.error(`Invalid JSON payload: ${err instanceof Error ? err.message : String(err)}`);
  process.exit(1);
}

try {
  const result = persistDukeRun(payload);
  console.log('Duke run persisted.');
  console.log(`  Run:      landos_agent_run #${result.runId}`);
  if (result.propertyId !== null) console.log(`  Property: landos_property #${result.propertyId}`);
  if (result.parcelId !== null) {
    console.log(`  Parcel:   landos_parcel #${result.parcelId}${result.parcelUpdated ? ' (updated existing)' : ' (new)'}`);
  }
  console.log(`  Facts:    ${result.factIds.length}`);
  console.log(`  FileRefs: ${result.fileRefIds.length}`);
  console.log(`  Audit:    landos_audit_log #${result.auditId}`);
} catch (err) {
  console.error(err instanceof Error ? err.message : String(err));
  process.exit(1);
}
