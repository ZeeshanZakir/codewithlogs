// Complete SDK calls for a disposable cwl_cardinality table with an integer id.
// A transport-level test does not prove table constraints or live RLS behavior.
export async function inspectSingle(supabase) {
  const { data, error } = await supabase.from("cwl_cardinality").select("id").single();
  return { data, error };
}
export async function inspectMaybeSingle(supabase) {
  const { data, error } = await supabase.from("cwl_cardinality").select("id").maybeSingle();
  return { data, error };
}
