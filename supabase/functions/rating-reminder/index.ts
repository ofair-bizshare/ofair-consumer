
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  // 1. מצא בקשות בסטטוס waiting_for_rating שלא דורגו >36 שעות
  const { data: requests, error } = await supabase
    .from('requests')
    .select('id, user_id, title')
    .eq('status', 'waiting_for_rating');

  if (error) {
    console.error("Failed fetching requests to remind", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: corsHeaders });
  }

  if (!requests || requests.length === 0) {
    return new Response(JSON.stringify({ result: 'No waiting_for_rating requests found' }), { headers: corsHeaders });
  }

  let notificationsSent = 0;

  for (const req of requests) {
    // לבדוק האם כבר קיימת נוטיפיקציית rating-reminder על אותה בקשה
    const { data: existing, error: notifError } = await supabase
      .from('notifications')
      .select('id')
      .eq('related_id', req.id)
      .eq('type', 'reminder');

    if (notifError) continue;
    if (existing && existing.length > 0) continue; // כבר יש תזכורת

    // צור התראה חדשה
    const { error: createNotifError } = await supabase
      .from('notifications')
      .insert({
        title: 'לא לשכוח לדרג את בעל המקצוע!',
        description: `נשמח אם תדרגו את הבקשה "${req.title}"`,
        type: 'reminder',
        related_id: req.id,
        related_type: 'request',
        is_read: false,
        professional_id: null, // הפונה, לא המקצוען
      });

    if (!createNotifError) notificationsSent += 1;
  }

  return new Response(JSON.stringify({ sent: notificationsSent }), { headers: corsHeaders });
});
