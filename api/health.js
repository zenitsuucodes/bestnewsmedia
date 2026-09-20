import { sendJson, handleOptions } from '../server/apiUtils.js';

export default async function handler(req, res) {
  if (handleOptions(req, res)) return;
  sendJson(res, 200, { status: 'ok', site: 'Best News Media', since: 2009 });
}
