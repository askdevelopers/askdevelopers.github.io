import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const TO_EMAIL = "askdevelopers001@gmail.com";

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const body = await req.json();
    const fullName = String(body.fullName ?? "").trim();
    const email = String(body.email ?? "").trim();
    const company = String(body.company ?? "").trim();
    const phone = String(body.phone ?? "").trim();
    const serviceNeeded = String(body.serviceNeeded ?? "").trim();
    const budgetRange = String(body.budgetRange ?? "").trim();
    const projectDetails = String(body.projectDetails ?? "").trim();

    if (!fullName || !email || !projectDetails) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return new Response(
        JSON.stringify({ error: "Invalid email" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );

    const { error: dbError } = await supabase
      .from("contact_submissions")
      .insert({
        full_name: fullName,
        email,
        company,
        phone,
        service_needed: serviceNeeded,
        budget_range: budgetRange,
        project_details: projectDetails,
      });

    if (dbError) {
      return new Response(
        JSON.stringify({ error: "Could not save submission" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const resendKey = Deno.env.get("RESEND_API_KEY");
    let emailSent = false;
    if (resendKey) {
      const html = [
        `<h2>New project inquiry — Ask Developers</h2>`,
        `<table cellpadding="6" cellspacing="0" style="font-family:sans-serif;font-size:14px;color:#111">`,
        `<tr><td><b>Name</b></td><td>${esc(fullName)}</td></tr>`,
        `<tr><td><b>Email</b></td><td>${esc(email)}</td></tr>`,
        `<tr><td><b>Company</b></td><td>${esc(company) || "—"}</td></tr>`,
        `<tr><td><b>Phone</b></td><td>${esc(phone) || "—"}</td></tr>`,
        `<tr><td><b>Service</b></td><td>${esc(serviceNeeded) || "—"}</td></tr>`,
        `<tr><td><b>Budget</b></td><td>${esc(budgetRange) || "—"}</td></tr>`,
        `</table>`,
        `<h3 style="font-family:sans-serif">Project details</h3>`,
        `<p style="font-family:sans-serif;white-space:pre-wrap;color:#222">${esc(projectDetails)}</p>`,
      ].join("");

      const text = `New project inquiry\n\nName: ${fullName}\nEmail: ${email}\nCompany: ${company || "—"}\nPhone: ${phone || "—"}\nService: ${serviceNeeded || "—"}\nBudget: ${budgetRange || "—"}\n\nProject details:\n${projectDetails}`;

      try {
        const res = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${resendKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "Ask Developers <onboarding@resend.dev>",
            to: [TO_EMAIL],
            reply_to: email,
            subject: `New project inquiry from ${fullName}`,
            html,
            text,
          }),
        });
        emailSent = res.ok;
      } catch {
        emailSent = false;
      }
    }

    return new Response(
      JSON.stringify({ ok: true, emailSent }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err?.message ?? "Server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
