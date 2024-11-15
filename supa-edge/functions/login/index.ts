// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.46.1"

console.log("Hello from Functions!")
const url = Deno.env.get("_SUPA_API_URL") as string;
const key = Deno.env.get("_SUPA_API_KEY") as string;
const supabase = createClient(url, key);

Deno.serve(async (req) => {
    try {
      const { name, password } = await req.json();
  
      if (!name || !password) {
        return new Response(
          JSON.stringify({ error: "Missing name or password" }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }
  
      const { data, error } = await supabase.auth.signInWithPassword({
        email: name,
        password: password,
      });
  
      if (error) {
        return new Response(
          JSON.stringify({ error: error.message }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }
  
      return new Response(
        JSON.stringify({ data }),
        { headers: { "Content-Type": "application/json" } },
      );
    } catch (err) {
      return new Response(
        JSON.stringify({ error: err.message }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
  });
  

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/hello-world' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
