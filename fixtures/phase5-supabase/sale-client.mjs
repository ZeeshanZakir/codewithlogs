const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export function saleInput(productId, quantity, requestId) {
  if (typeof productId !== "string" || !uuid.test(productId) || typeof requestId !== "string" || !uuid.test(requestId) || !Number.isInteger(quantity) || quantity < 1 || quantity > 10000) throw new Error("Invalid sale input");
  return { p_product_id: productId, p_qty: quantity, p_request_id: requestId };
}
// Pass an authenticated, cookie-aware server client. Never a service-role client.
// SQL remains the authorization/concurrency boundary; this helper is not that proof.
export async function recordSale(supabase, productId, quantity, requestId) {
  const args = saleInput(productId, quantity, requestId);
  const { data: identity, error: identityError } = await supabase.auth.getUser();
  if (identityError || !identity?.user) throw new Error("Authentication required");
  const { data, error } = await supabase.rpc("cwl_record_sale", args);
  if (error || !Array.isArray(data) || data.length !== 1) throw new Error("Sale could not be confirmed. Check its request ID before retrying.");
  const row = data[0];
  if (!row || typeof row !== "object" || !Number.isInteger(row.remaining_after_sale) || row.remaining_after_sale < 0 || typeof row.movement_id !== "string" || !uuid.test(row.movement_id) || typeof row.replayed !== "boolean") throw new Error("Unexpected sale response");
  return { remainingAfterSale: row.remaining_after_sale, movementId: row.movement_id, replayed: row.replayed };
}
