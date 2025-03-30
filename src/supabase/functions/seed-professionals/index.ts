
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

    // Sample professional data
    const professionals = [
      {
        name: "יוסי כהן",
        profession: "חשמלאי",
        rating: 4.8,
        review_count: 125,
        location: "תל אביב",
        image: "https://images.unsplash.com/photo-1566753323558-f4e0952af115?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8ZWxlY3RyaWNpYW58ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60",
        specialties: ["תיקוני חשמל", "התקנת מזגנים", "אינסטלציה חשמלית"],
        phone_number: "054-1234567"
      },
      {
        name: "דני לוי",
        profession: "אינסטלטור",
        rating: 4.5,
        review_count: 89,
        location: "ירושלים",
        image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8cGx1bWJlcnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60",
        specialties: ["תיקוני צנרת", "התקנת כיורים", "איתור נזילות"],
        phone_number: "052-9876543"
      },
      {
        name: "מיכל אלון",
        profession: "מעצבת פנים",
        rating: 4.9,
        review_count: 132,
        location: "חיפה",
        image: "https://images.unsplash.com/photo-1587304881279-158ca2648ca4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8aW50ZXJpb3IlMjBkZXNpZ25lcnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60",
        specialties: ["עיצוב דירות", "תכנון מטבחים", "ייעוץ צבעים"],
        phone_number: "050-1122334"
      },
      {
        name: "אלי פרץ",
        profession: "נגר",
        rating: 4.7,
        review_count: 74,
        location: "תל אביב",
        image: "https://images.unsplash.com/photo-1611021701236-0d95c1b6b10c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8Y2FycGVudGVyfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60",
        specialties: ["רהיטים מותאמים אישית", "מטבחים", "ארונות"],
        phone_number: "053-9988776"
      },
      {
        name: "רונית מור",
        profession: "צבעית מקצועית",
        rating: 4.6,
        review_count: 57,
        location: "ראשון לציון",
        image: "https://images.unsplash.com/photo-1562259929-b4e1fd3aef09?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8OHx8cGFpbnRlcnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60",
        specialties: ["צביעת דירות", "צביעת חדרי ילדים", "אפקטים מיוחדים"],
        phone_number: "054-5566778"
      },
      {
        name: "עמית שלום",
        profession: "מזגנים וקירור",
        rating: 4.4,
        review_count: 93,
        location: "בני ברק",
        image: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8YWlyJTIwY29uZGl0aW9uZXJ8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60",
        specialties: ["התקנת מזגנים", "שירות למזגנים", "מערכות קירור"],
        phone_number: "052-1122334"
      },
      {
        name: "נועה ברק",
        profession: "גננית נוי",
        rating: 4.9,
        review_count: 41,
        location: "הרצליה",
        image: "https://images.unsplash.com/photo-1572078286378-2ec9584a5243?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8Z2FyZGVuZXJ8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60",
        specialties: ["תכנון גינות", "השקיה אוטומטית", "גינות פרחים"],
        phone_number: "050-9877665"
      },
      {
        name: "משה יעקב",
        profession: "הנדימן",
        rating: 4.3,
        review_count: 68,
        location: "רמת גן",
        image: "https://images.unsplash.com/photo-1580893246395-52aead8960dc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NHx8aGFuZHltYW58ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60",
        specialties: ["תיקונים כלליים", "הרכבת רהיטים", "תליית תמונות"],
        phone_number: "053-1234987"
      }
    ];

    // Check if there are already professionals in the database
    const { count, error: countError } = await supabaseAdmin
      .from('professionals')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      throw countError;
    }

    // Only insert data if the table is empty
    if (count === 0) {
      // Insert data
      const { data, error } = await supabaseAdmin
        .from('professionals')
        .insert(professionals)
        .select();

      if (error) {
        throw error;
      }

      return new Response(
        JSON.stringify({ success: true, message: "Professionals added successfully", count: data.length }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    } else {
      return new Response(
        JSON.stringify({ success: true, message: "Professionals already exist in the database", count }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }
  } catch (error) {
    console.error("Error seeding professionals:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
