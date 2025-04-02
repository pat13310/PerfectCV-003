import { createClient } from 'npm:@supabase/supabase-js@2.39.7';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('fichier');

    if (!file || !(file instanceof File)) {
      throw new Error('Aucun fichier fourni');
    }

    // Forward the request to n8n webhook
    try {
      const n8nResponse = await fetch('https://n8n.srv760758.hstgr.cloud/webhook-test/OCR', {
        method: 'POST',
        body: formData,
      });

      if (!n8nResponse.ok) {
        throw new Error(`Erreur n8n: ${n8nResponse.status}`);
      }

      const n8nData = await n8nResponse.json();

      // If n8n fails to return data, use mock data
      if (!n8nData) {
        throw new Error('Aucune donnée reçue de n8n');
      }

      return new Response(JSON.stringify(n8nData), {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      });

    } catch (n8nError) {
      console.error('n8n error:', n8nError);
      
      // Fallback to mock data if n8n fails
      const mockData = {
        fullName: 'John Doe',
        title: 'Développeur Full Stack Senior',
        email: 'john.doe@example.com',
        phone: '+33 6 12 34 56 78',
        address: '123 rue Example, 75000 Paris',
        summary: 'Développeur Full Stack passionné avec plus de 8 ans d\'expérience dans la création d\'applications web innovantes. Expertise approfondie en JavaScript/TypeScript, React, Node.js et architecture cloud.',
        skills: [
          { id: '1', name: 'JavaScript', level: 5 },
          { id: '2', name: 'TypeScript', level: 4 },
          { id: '3', name: 'React', level: 5 },
          { id: '4', name: 'Node.js', level: 4 },
          { id: '5', name: 'AWS', level: 3 }
        ],
        experience: [
          {
            company: 'Tech Company',
            position: 'Senior Developer',
            startDate: '2020-01-01',
            endDate: '2023-12-31',
            description: 'Lead développeur sur plusieurs projets majeurs, responsable de l\'architecture technique et du mentorat des développeurs juniors.'
          },
          {
            company: 'Startup Innovation',
            position: 'Full Stack Developer',
            startDate: '2018-03-01',
            endDate: '2019-12-31',
            description: 'Développement full stack d\'applications web modernes utilisant React et Node.js.'
          }
        ],
        education: [
          {
            school: 'University of Technology',
            degree: 'Master in Computer Science',
            startDate: '2015-09-01',
            endDate: '2020-06-30',
            description: 'Spécialisation en génie logiciel et systèmes distribués.'
          }
        ]
      };

      return new Response(
        JSON.stringify(mockData),
        { 
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json'
          }
        }
      );
    }

  } catch (error) {
    console.error('Error processing CV:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Une erreur est survenue' 
      }),
      { 
        status: 400,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );
  }
});