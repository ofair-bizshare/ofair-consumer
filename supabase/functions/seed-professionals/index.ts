
// deno-lint-ignore-file
/// <reference no-default-lib="true" />
/// <reference lib="dom" />
/// <reference lib="dom.iterable" />
/// <reference lib="dom.asynciterable" />
/// <reference lib="deno.ns" />

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Create a Supabase client with the Admin key
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Check if there are already professionals in the database
    const { count, error: countError } = await supabaseAdmin
      .from('professionals')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      throw countError;
    }

    // If professionals already exist, don't add more
    if (count && count > 0) {
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "Sample data not added. Professionals already exist in the database.", 
          existingCount: count 
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }

    // Sample professionals data to seed
    const sampleProfessionals = [
      {
        name: 'אבי כהן',
        profession: 'טכנאי מזגנים',
        rating: 4.8,
        review_count: 124,
        location: 'תל אביב והמרכז',
        image: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1180&q=80',
        specialties: ['תיקוני מזגנים', 'התקנות מזגנים', 'ניקוי מזגנים'],
        phone_number: '052-1234567',
        about: 'טכנאי מזגנים מוסמך עם ניסיון רב בתחום. מעניק שירות מהיר, אמין ומקצועי עם אחריות על העבודה.'
      },
      {
        name: 'יוסי לוי',
        profession: 'טכנאי מזגנים',
        rating: 4.6,
        review_count: 87,
        location: 'תל אביב והמרכז',
        image: 'https://images.unsplash.com/photo-1566753323558-f4e0952af115?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2122&q=80',
        specialties: ['תיקוני מזגנים', 'התקנות מזגנים'],
        phone_number: '052-2345678',
        about: 'טכנאי מזגנים בעל ניסיון של 15 שנה בתחום. מומחה בתיקון כל סוגי המזגנים, כולל מזגנים מרכזיים ומולטי-ספליט.'
      },
      {
        name: 'דני שטרן',
        profession: 'טכנאי מיזוג אוויר',
        rating: 4.9,
        review_count: 112,
        location: 'רמת גן',
        image: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80',
        specialties: ['תיקון מזגנים', 'מזגנים מרכזיים'],
        phone_number: '052-3456789',
        about: 'מהנדס מיזוג אוויר בעל תואר ראשון. ניסיון של 20 שנה בתכנון וביצוע התקנות מיזוג אוויר בפרויקטים מורכבים.'
      },
    ];

    // Insert the sample professionals
    const { data, error } = await supabaseAdmin
      .from('professionals')
      .insert(sampleProfessionals)
      .select();

    if (error) {
      throw error;
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Successfully added ${data.length} professionals to the database.`,
        data
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error in seed professionals function:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
