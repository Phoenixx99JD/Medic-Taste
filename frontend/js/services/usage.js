import { post } from './api.js';

export async function logUsage(action_type, recipe_id) {
  try {
    await post('/stats/log', { action_type, recipe_id });
  } catch {
    // silent fail
  }
}
