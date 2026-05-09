/**
 * BITÁCORA · Google Apps Script
 *
 * INSTRUCCIONES:
 * 1. Abre tu Google Sheet → Extensiones → Apps Script
 * 2. Borra todo el contenido y pega este código completo
 * 3. Guarda (Ctrl+S)
 * 4. Haz clic en "Implementar" → "Nueva implementación"
 *    - Tipo: Aplicación web
 *    - Ejecutar como: Yo (tu cuenta)
 *    - Quién tiene acceso: Cualquier usuario
 * 5. Copia la URL que te da y pégala en Bitácora → Configuración
 */

function doGet(e) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const action = e.parameter.action;

  try {
    // ── GASTOS ──────────────────────────────────────────────
    if (action === 'addGasto') {
      const sheet = getOrCreate(ss, 'Gastos', ['Fecha', 'Categoría', 'Monto', 'Nota', 'Timestamp']);
      sheet.appendRow([
        e.parameter.fecha,
        e.parameter.cat,
        parseFloat(e.parameter.amt),
        e.parameter.note || '',
        new Date(parseInt(e.parameter.ts)),
      ]);
      return ok({ added: true });
    }

    if (action === 'getGastos') {
      const sheet = getOrCreate(ss, 'Gastos', ['Fecha', 'Categoría', 'Monto', 'Nota', 'Timestamp']);
      const rows = sheet.getDataRange().getValues().slice(1);
      const data = rows.map(r => ({
        fecha: Utilities.formatDate(new Date(r[0]), Session.getScriptTimeZone(), 'yyyy-MM-dd'),
        cat: r[1],
        amt: r[2],
        note: r[3],
        ts: r[4] ? new Date(r[4]).getTime() : 0,
      }));
      return ok({ data });
    }

    // ── WORKOUT ─────────────────────────────────────────────
    if (action === 'setWorkout') {
      const sheet = getOrCreate(ss, 'Workout', ['Fecha', 'Hecho']);
      const fecha = e.parameter.fecha;
      const done = e.parameter.done === 'true';
      const values = sheet.getDataRange().getValues();
      const idx = values.findIndex((r, i) => i > 0 && r[0] === fecha);
      if (idx > 0) {
        sheet.getRange(idx + 1, 2).setValue(done);
      } else {
        sheet.appendRow([fecha, done]);
      }
      return ok({ saved: true });
    }

    if (action === 'getWorkout') {
      const sheet = getOrCreate(ss, 'Workout', ['Fecha', 'Hecho']);
      const rows = sheet.getDataRange().getValues().slice(1);
      const data = rows.reduce((acc, r) => {
        acc[r[0]] = r[1];
        return acc;
      }, {});
      return ok({ data });
    }

    // ── CONFIGURACIÓN ────────────────────────────────────────
    if (action === 'setConfig') {
      const sheet = getOrCreate(ss, 'Config', ['Clave', 'Valor']);
      const key = e.parameter.key;
      const val = e.parameter.value;
      const values = sheet.getDataRange().getValues();
      const idx = values.findIndex(r => r[0] === key);
      if (idx >= 0) {
        sheet.getRange(idx + 1, 2).setValue(val);
      } else {
        sheet.appendRow([key, val]);
      }
      return ok({ saved: true });
    }

    if (action === 'getConfig') {
      const sheet = getOrCreate(ss, 'Config', ['Clave', 'Valor']);
      const rows = sheet.getDataRange().getValues().slice(1);
      const data = rows.reduce((acc, r) => {
        acc[r[0]] = r[1];
        return acc;
      }, {});
      return ok({ data });
    }

    // ── OUTFIT ───────────────────────────────────────────────
    if (action === 'setOutfit') {
      const sheet = getOrCreate(ss, 'Outfit', ['Fecha', 'Descripción']);
      const fecha = e.parameter.fecha;
      const desc = e.parameter.desc || '';
      const values = sheet.getDataRange().getValues();
      const idx = values.findIndex((r, i) => i > 0 && r[0] === fecha);
      if (idx > 0) {
        sheet.getRange(idx + 1, 2).setValue(desc);
      } else {
        sheet.appendRow([fecha, desc]);
      }
      return ok({ saved: true });
    }

    return ok({ error: 'Acción no reconocida: ' + action });

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ── Helpers ────────────────────────────────────────────────

function getOrCreate(ss, name, headers) {
  let sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    sheet.appendRow(headers);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
  }
  return sheet;
}

function ok(data) {
  return ContentService
    .createTextOutput(JSON.stringify({ ok: true, ...data }))
    .setMimeType(ContentService.MimeType.JSON);
}
