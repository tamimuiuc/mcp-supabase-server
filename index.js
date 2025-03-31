const { createClient } = require("@supabase/supabase-js");

console.log("✅ Supabase MCP Server Starting...");

// Parse --config JSON from args
const configArg = process.argv.find(arg => arg.startsWith("{") && arg.includes("supabaseProjectRef"));
let config = {};
try {
  config = JSON.parse(configArg);
  console.log("🔧 Parsed config:", config);
} catch (e) {
  console.error("❌ Failed to parse Supabase config JSON");
  throw e;
}

const { supabaseProjectRef, supabaseServiceRoleKey } = config;

if (!supabaseProjectRef || !supabaseServiceRoleKey) {
  throw new Error("❌ Missing Supabase projectRef or service role key");
}

const SUPABASE_URL = `https://${supabaseProjectRef}.supabase.co`;
const supabase = createClient(SUPABASE_URL, supabaseServiceRoleKey);

// ✅ Return tools via async function
exports.default = async () => {
  console.log("🛠 Exporting tools...");
  return {
    tools: [
      {
        name: "getSkills",
        description: "Fetch all skills from Supabase `skills` table",
        run: async () => {
          const { data, error } = await supabase.from("skills").select("*");
          if (error) throw new Error(error.message);
          return data;
        },
      },
      {
        name: "addSkill",
        description: "Add a new skill",
        params: {
          name: "string",
          description: "string",
          owner_id: "string",
        },
        run: async ({ name, description, owner_id }) => {
          const { data, error } = await supabase
            .from("skills")
            .insert([{ name, description, owner_id }]);
          if (error) throw new Error(error.message);
          return data;
        },
      },
    ],
  };
};

