// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js";

const MYDEPLOYEDHOST = Deno.env.get("_MYDEPLOYEDHOST") as string;

const handler = async (_request: Request): Promise<Response> => {

  const { email, course } = await _request.json();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  let errorRes = false;
  let errorResMessage = "";

  if (!emailRegex.test(email)) 
  {
    errorRes = true;
    errorResMessage = "Invalid email format!";
  } 
  else if(!email || !course)
  {
    errorRes = true;
    errorResMessage = "Email or Course fields required!";
  }

  if(errorRes){
    return new Response(JSON.stringify({ message: errorResMessage }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }


                          // Created a nodemailer via express and deployed on onrender 
                          // instead of implementing api services with domain requirements
  const res = await fetch(`https://${MYDEPLOYEDHOST}/email`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: email.toString(),
      subject: "Enrollment Successful",
      message: `You are now Enrolled in course ${course.toString()}!`,
    }),
  })

  return new Response(JSON.stringify({ message: "Email Sent Successfully!" }), {
    headers: {
      'Content-Type': 'application/json',
    },
  })

}

Deno.serve(handler)


/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/send-email' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/


// import { serve } from 'https://deno.land/x/supabase_edge_functions/mod.ts';
// import sendgrid from 'https://cdn.skypack.dev/@sendgrid/mail';

// // Initialize SendGrid with your API Key
// sendgrid.setApiKey(Deno.env.get('SENDGRID_API_KEY') || 'your_sendgrid_api_key');

// // Function to send email
// const sendEnrollmentEmail = async (req: Request) => {
//   try {
//     const { email, courseName, userName } = await req.json();

//     // Construct the email content
//     const message = {
//       to: email, // recipient's email
//       from: 'your-email@example.com', // your SendGrid verified sender email
//       subject: `Enrollment Successful: Welcome to ${courseName}!`,
//       text: `Hello ${userName},\n\nCongratulations! You have been successfully enrolled in the ${courseName}. We're excited to have you on board!\n\nBest regards,\nYour Team`,
//       html: `<p>Hello ${userName},</p><p>Congratulations! You have been successfully enrolled in the <strong>${courseName}</strong>. We're excited to have you on board!</p><p>Best regards,<br>Your Team</p>`,
//     };

//     // Send the email
//     await sendgrid.send(message);

//     // Respond with success
//     return new Response(JSON.stringify({ message: 'Enrollment email sent successfully.' }), {
//       status: 200,
//       headers: { 'Content-Type': 'application/json' },
//     });
//   } catch (error) {
//     console.error('Error sending email:', error);
//     return new Response(
//       JSON.stringify({ error: 'Failed to send enrollment email' }),
//       {
//         status: 500,
//         headers: { 'Content-Type': 'application/json' },
//       }
//     );
//   }
// };

// // Serve the function
// serve(sendEnrollmentEmail);
