#!/usr/bin/env node
// scripts/check-hsb-sandbox-v3.js
// Queries the Pipedrive sandbox and writes all relevant IDs/keys to data/hsb-sandbox-state.json

const token  = process.env.PIPEDRIVE_API_TOKEN || '130ac936f22124a6d161d2c6239b1d54a6525a44';
const domain = process.env.PIPEDRIVE_DOMAIN    || 'demo-sunsideai';
const base   = `https://${domain}.pipedrive.com/api/v1`;
const fs     = require('fs');
const path   = require('path');

async function get(endpoint) {
  const sep = endpoint.includes('?') ? '&' : '?';
  const url = `${base}${endpoint}${sep}api_token=${token}`;
  const res  = await fetch(url);
  const json = await res.json();
  if (!json.success) throw new Error(`API error at ${endpoint}: ${JSON.stringify(json)}`);
  return json;
}

// Custom field keys are 40-char hex strings
const isCustomKey = (key) => /^[0-9a-f]{40}$/.test(key);

async function main() {
  console.log(`Connecting to https://${domain}.pipedrive.com …\n`);

  // Pipelines + Stages
  const [pipelinesRes, stagesRes] = await Promise.all([
    get('/pipelines'),
    get('/stages?limit=500'),
  ]);

  const pipelines = (pipelinesRes.data || []).map(p => ({
    id:     p.id,
    name:   p.name,
    stages: (stagesRes.data || [])
      .filter(s => s.pipeline_id === p.id)
      .map(s => ({ id: s.id, name: s.name, order_nr: s.order_nr }))
      .sort((a, b) => a.order_nr - b.order_nr),
  }));

  console.log('Pipelines:');
  pipelines.forEach(p => {
    console.log(`  [${p.id}] ${p.name}`);
    p.stages.forEach(s => console.log(`       Stage [${s.id}] ${s.name}`));
  });

  // Deal fields
  const dealFieldsRes  = await get('/dealFields?limit=500');
  const customDealFields = (dealFieldsRes.data || [])
    .filter(f => isCustomKey(f.key))
    .map(f => ({
      name:       f.name,
      key:        f.key,
      field_type: f.field_type,
      options:    f.options
        ? f.options.map(o => ({ id: o.id, label: o.label }))
        : null,
    }));

  console.log('\nDeal custom fields:');
  customDealFields.forEach(f => {
    console.log(`  "${f.name}" (${f.field_type}) → ${f.key}`);
    if (f.options) f.options.forEach(o => console.log(`    [${o.id}] ${o.label}`));
  });

  // Person fields
  const personFieldsRes  = await get('/personFields?limit=500');
  const customPersonFields = (personFieldsRes.data || [])
    .filter(f => isCustomKey(f.key))
    .map(f => ({
      name:       f.name,
      key:        f.key,
      field_type: f.field_type,
      options:    f.options
        ? f.options.map(o => ({ id: o.id, label: o.label }))
        : null,
    }));

  console.log('\nPerson custom fields:');
  customPersonFields.forEach(f => {
    console.log(`  "${f.name}" (${f.field_type}) → ${f.key}`);
    if (f.options) f.options.forEach(o => console.log(`    [${o.id}] ${o.label}`));
  });

  const state = {
    timestamp:      new Date().toISOString(),
    domain,
    deal_pipelines: pipelines,
    deal_fields:    { custom: customDealFields },
    person_fields:  { custom: customPersonFields },
  };

  const outPath = path.join(__dirname, '../data/hsb-sandbox-state.json');
  fs.writeFileSync(outPath, JSON.stringify(state, null, 2));
  console.log(`\nState written → ${outPath}`);
}

main().catch(err => { console.error(err); process.exit(1); });
