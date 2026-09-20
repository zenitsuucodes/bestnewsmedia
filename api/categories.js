import { CATEGORIES } from '../server/feeds.js';
import { sendJson, handleOptions } from '../server/apiUtils.js';

export default async function handler(req, res) {
  if (handleOptions(req, res)) return;
  if (req.method !== 'GET') return sendJson(res, 405, { error: 'Method not allowed' });
  sendJson(res, 200, CATEGORIES);
}
