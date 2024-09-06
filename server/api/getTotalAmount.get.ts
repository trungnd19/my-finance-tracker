import { serverSupabaseClient } from "#supabase/server";
import { SupabaseClient } from "@supabase/supabase-js"; // Ensure the correct import

// Define the shape of the expected response from your RPC function
interface TotalsResponse {
  total_income: number;
  total_expenses: number;
}

export default defineEventHandler(async (event) => {
  // Explicitly cast the Supabase client
  const supabase = (await serverSupabaseClient(event)) as SupabaseClient;

  const query = getQuery(event);
  const { month, year } = query;

  if (!month || !year) {
    return { error: "Month and year are required" };
  }

  // Call the RPC function to get totals by month
  const { data, error } = await supabase.rpc("get_totals_by_month", {
    year: Number(year),
    month: Number(month),
  });

  console.log(data, '111111');

  if (error) {
    return { error: "Error fetching data" };
  }

  return data;
});
