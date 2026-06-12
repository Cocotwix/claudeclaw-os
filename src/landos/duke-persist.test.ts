import { beforeEach, describe, expect, it } from 'vitest';

import { _initTestLandosDb, getLandosDb } from './db.js';
import { parseDukePayload, persistDukeRun, type DukeRunPayload } from './duke-persist.js';

beforeEach(() => {
  _initTestLandosDb();
});

const basePayload = (): DukeRunPayload => ({
  entity: 'TY_LAND_BIZ',
  status: 'success',
  summary: 'Default Duke Report delivered',
  durationMs: 112_000,
  toolCalls: 3,
  reportStatus: 'delivered',
  parcel: {
    apn: '123-456-789',
    lpPropertyId: 'LP-TEST-1',
    fips: '48001',
    county: 'Test County',
    state: 'TX',
    city: 'Testville',
    address: '100 Test Rd',
    acres: 5.2,
    verified: true,
    verificationSource: 'lp_property_data record match (APN + FIPS)',
  },
  facts: [
    { fact: 'acreage', value: '5.2', label: 'Verified', source: 'lp_property_data' },
    { fact: 'road access', value: 'unknown', label: 'Needs verification' },
  ],
  fileRefs: [
    { kind: 'pdf', pathOrRef: 'D:\\duke-reports\\test-report.pdf', note: 'background PDF' },
  ],
});

describe('persistDukeRun', () => {
  it('persists property, parcel, facts, file refs, run, and audit atomically', () => {
    const result = persistDukeRun(basePayload());
    const db = getLandosDb();

    expect(result.runId).toBeGreaterThan(0);
    expect(result.propertyId).toBeGreaterThan(0);
    expect(result.parcelId).toBeGreaterThan(0);
    expect(result.parcelUpdated).toBe(false);
    expect(result.factIds).toHaveLength(2);
    expect(result.fileRefIds).toHaveLength(1);

    const parcel = db.prepare('SELECT * FROM landos_parcel WHERE id = ?').get(result.parcelId) as Record<string, unknown>;
    expect(parcel.entity).toBe('TY_LAND_BIZ');
    expect(parcel.apn).toBe('123-456-789');
    expect(parcel.lp_property_id).toBe('LP-TEST-1');
    expect(parcel.fips).toBe('48001');
    expect(parcel.verified).toBe(1);
    expect(parcel.verified_at).not.toBeNull();
    expect(parcel.property_id).toBe(result.propertyId);

    const property = db.prepare('SELECT * FROM landos_property WHERE id = ?').get(result.propertyId) as Record<string, unknown>;
    expect(property.address).toBe('100 Test Rd');
    expect(property.county).toBe('Test County');

    const facts = db.prepare('SELECT * FROM landos_fact WHERE parcel_id = ? ORDER BY id').all(result.parcelId) as Array<Record<string, unknown>>;
    expect(facts).toHaveLength(2);
    expect(facts[0].label).toBe('Verified');
    expect(facts[1].label).toBe('Needs verification');
    expect(facts[0].checked_by).toBe('duke-due-diligence');

    const run = db.prepare('SELECT * FROM landos_agent_run WHERE id = ?').get(result.runId) as Record<string, unknown>;
    expect(run.agent_id).toBe('duke-due-diligence');
    expect(run.status).toBe('success');
    expect(run.duration_ms).toBe(112_000);
    expect(run.summary).toContain('[report_status=delivered]');
    expect(run.summary).toContain('[tool_calls=3]');

    const audit = db.prepare('SELECT * FROM landos_audit_log WHERE id = ?').get(result.auditId) as Record<string, unknown>;
    expect(audit.action).toBe('duke_run_persisted');
    const detail = JSON.parse(audit.detail as string) as Record<string, unknown>;
    expect(detail.runId).toBe(result.runId);
    expect(detail.factCount).toBe(2);
    expect(detail.toolCalls).toBe(3);
  });

  it('upserts the same parcel by lp_property_id + fips instead of duplicating', () => {
    const first = persistDukeRun(basePayload());
    const second = persistDukeRun({
      ...basePayload(),
      parcel: { ...basePayload().parcel, acres: 5.5, address: undefined },
    });
    expect(second.parcelId).toBe(first.parcelId);
    expect(second.parcelUpdated).toBe(true);

    const db = getLandosDb();
    const count = db.prepare('SELECT COUNT(*) AS n FROM landos_parcel').get() as { n: number };
    expect(count.n).toBe(1);
    const parcel = db.prepare('SELECT acres FROM landos_parcel WHERE id = ?').get(first.parcelId) as { acres: number };
    expect(parcel.acres).toBe(5.5);
  });

  it('rejects an unknown entity', () => {
    const payload = { ...basePayload(), entity: 'SOMEONE_ELSE' } as unknown as DukeRunPayload;
    expect(() => persistDukeRun(payload)).toThrow(/entity must be one of/);
  });

  it('rejects an invalid fact label', () => {
    const payload = basePayload();
    payload.facts = [{ fact: 'zoning', label: 'Vibes' as never }];
    expect(() => persistDukeRun(payload)).toThrow(/invalid label/);
  });

  it('rejects an invalid run status and report status', () => {
    expect(() => persistDukeRun({ ...basePayload(), status: 'done' as never })).toThrow(/status must be one of/);
    expect(() => persistDukeRun({ ...basePayload(), reportStatus: 'shipped' as never })).toThrow(/reportStatus must be one of/);
  });

  it('enforces the hard parcel rule: banned verification sources are refused', () => {
    const banned = [
      'geocoder match',
      'coordinates from map',
      'nearest parcel lookup',
      'map pin placed by user',
      'visual inference from satellite',
      'lat/lon centroid',
      'street view confirmation',
    ];
    for (const source of banned) {
      const payload = basePayload();
      payload.parcel = { ...payload.parcel, verified: true, verificationSource: source };
      expect(() => persistDukeRun(payload), `should reject "${source}"`).toThrow(/hard parcel rule/);
    }
  });

  it('requires a verification source when parcel is marked verified', () => {
    const payload = basePayload();
    payload.parcel = { ...payload.parcel, verified: true, verificationSource: '' };
    expect(() => persistDukeRun(payload)).toThrow(/requires a verificationSource/);
  });

  it('accepts an unverified parcel without a verification source', () => {
    const payload = basePayload();
    payload.parcel = { ...payload.parcel, verified: false, verificationSource: undefined };
    const result = persistDukeRun(payload);
    const db = getLandosDb();
    const parcel = db.prepare('SELECT verified, verification_source, verified_at FROM landos_parcel WHERE id = ?')
      .get(result.parcelId) as Record<string, unknown>;
    expect(parcel.verified).toBe(0);
    expect(parcel.verification_source).toBe('');
    expect(parcel.verified_at).toBeNull();
  });

  it('rejects file refs that point inside the repo', () => {
    const payload = basePayload();
    payload.fileRefs = [{ kind: 'md', pathOrRef: process.cwd() + '\\report.md' }];
    expect(() => persistDukeRun(payload)).toThrow(/inside the repo/);
  });

  it('leaves the database untouched when any part of the payload is invalid', () => {
    const payload = basePayload();
    payload.facts = [
      { fact: 'acreage', value: '5.2', label: 'Verified' },
      { fact: '', label: 'Verified' },
    ];
    expect(() => persistDukeRun(payload)).toThrow();
    const db = getLandosDb();
    for (const table of ['landos_parcel', 'landos_property', 'landos_fact', 'landos_agent_run', 'landos_file_ref']) {
      const count = db.prepare(`SELECT COUNT(*) AS n FROM ${table}`).get() as { n: number };
      expect(count.n, `${table} should be empty after rollback`).toBe(0);
    }
  });

  it('works without parcel, facts, or file refs (run metadata only)', () => {
    const result = persistDukeRun({
      entity: 'LAND_ALLY',
      status: 'failed',
      error: 'timeout before parcel resolution',
      workflow: 'default_duke_report',
    });
    expect(result.runId).toBeGreaterThan(0);
    expect(result.parcelId).toBeNull();
    expect(result.propertyId).toBeNull();
    const db = getLandosDb();
    const run = db.prepare('SELECT status, error FROM landos_agent_run WHERE id = ?').get(result.runId) as Record<string, unknown>;
    expect(run.status).toBe('failed');
    expect(run.error).toBe('timeout before parcel resolution');
  });

  it('parses payload JSON with a leading UTF-8 BOM (parseDukePayload)', () => {
    const json = JSON.stringify(basePayload());
    const withBom = '\uFEFF' + json;
    expect(() => JSON.parse(withBom)).toThrow(); // raw parse fails — the BOM is the problem
    const payload = parseDukePayload(withBom);
    expect(payload.entity).toBe('TY_LAND_BIZ');
    const result = persistDukeRun(payload);
    expect(result.runId).toBeGreaterThan(0);
    // BOM only stripped at the very start, not inside the payload
    expect((parseDukePayload(json) as DukeRunPayload).entity).toBe('TY_LAND_BIZ');
  });

  it('derives timing when only durationMs is supplied', () => {
    const result = persistDukeRun({ entity: 'TY_LAND_BIZ', status: 'success', durationMs: 60_000 });
    const db = getLandosDb();
    const run = db.prepare('SELECT started_at, finished_at, duration_ms FROM landos_agent_run WHERE id = ?')
      .get(result.runId) as { started_at: number; finished_at: number; duration_ms: number };
    expect(run.duration_ms).toBe(60_000);
    expect(run.finished_at - run.started_at).toBe(60);
  });
});
