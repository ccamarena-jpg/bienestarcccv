import AsyncStorage from '@react-native-async-storage/async-storage';

const URL_KEY = 'sheets_script_url';

export async function getSheetsUrl(): Promise<string | null> {
  return AsyncStorage.getItem(URL_KEY);
}

export async function setSheetsUrl(url: string): Promise<void> {
  await AsyncStorage.setItem(URL_KEY, url.trim());
}

async function call(params: Record<string, string>): Promise<any> {
  const url = await getSheetsUrl();
  if (!url) throw new Error('URL de Sheets no configurada');

  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${url}?${qs}`, {
    redirect: 'follow',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

// ── Gastos ────────────────────────────────────────────────

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

// ── Workout ───────────────────────────────────────────────

export async function setWorkout(done: boolean): Promise<void> {
  const fecha = new Date().toISOString().split('T')[0];
  await call({ action: 'setWorkout', fecha, done: String(done) });
}

// ── Config (presupuesto, nombre, metas) ───────────────────

export async function setConfig(key: string, value: string): Promise<void> {
  await call({ action: 'setConfig', key, value });
}

export async function getConfig(): Promise<Record<string, string>> {
  const res = await call({ action: 'getConfig' });
  return res.data ?? {};
}

// ── Outfit ────────────────────────────────────────────────

export async function setOutfit(desc: string): Promise<void> {
  const fecha = new Date().toISOString().split('T')[0];
  await call({ action: 'setOutfit', fecha, desc });
}
