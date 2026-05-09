const SHEETS_URL = 'https://script.google.com/macros/s/AKfycbwtTK7-3q5Z7SZYdnStuKqcJXWashQGDtTNXQyNichLQj44B3ae5OerTtb-78K0NFMo/exec';

async function call(params: Record<string, string>): Promise<any> {
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${SHEETS_URL}?${qs}`, { redirect: 'follow' });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function addGasto(expense: {
  cat: string;
  amt: number;
  note: string;
  ts: number;
}): Promise<void> {
  const fecha = new Date().toISOString().split('T')[0];
  await call({
    action: 'addGasto',
    fecha,
    cat: expense.cat,
    amt: String(expense.amt),
    note: expense.note,
    ts: String(expense.ts),
  });
}

export async function getGastos(): Promise<any[]> {
  const res = await call({ action: 'getGastos' });
  return res.data ?? [];
}

export async function setWorkout(done: boolean): Promise<void> {
  const fecha = new Date().toISOString().split('T')[0];
  await call({ action: 'setWorkout', fecha, done: String(done) });
}

export async function setConfig(key: string, value: string): Promise<void> {
  await call({ action: 'setConfig', key, value });
}

export async function getConfig(): Promise<Record<string, string>> {
  const res = await call({ action: 'getConfig' });
  return res.data ?? {};
}

export async function setOutfit(desc: string): Promise<void> {
  const fecha = new Date().toISOString().split('T')[0];
  await call({ action: 'setOutfit', fecha, desc });
}
