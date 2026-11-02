// Supabase Edge Function: generate-sop
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { category, theme, structure, formData } = await req.json();

    if (!formData?.title) {
      return new Response(JSON.stringify({ error: 'Title is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // In a live Supabase Edge Function, you can read Deno.env.get('AI_API_KEY')
    return new Response(
      JSON.stringify({
        documentTitle: formData.title,
        organization: formData.companyName || 'Enterprise Organization',
        metadata: {
          sopId: `SOP-${category.toUpperCase().slice(0, 3)}-001`,
          version: formData.version || '1.0',
          effectiveDate: formData.effectiveDate || new Date().toISOString().split('T')[0],
          department: formData.department || 'Operations',
          preparedBy: formData.preparedBy || '[Insert Prepared By]',
          reviewedBy: formData.reviewedBy || '[Insert Reviewer]',
          approvedBy: formData.approvedBy || '[Insert Approver]',
        },
        sections: [
          {
            id: 'sec-1',
            title: '1. Purpose & Scope',
            type: 'text',
            content: formData.purpose || 'Standard Operating Procedure purpose statement.',
          },
        ],
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

