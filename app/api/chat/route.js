import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req) {
  try {
    const { message } = await req.json();

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "user",
          content: message,
        },
      ],
    });

    return Response.json({
      reply: completion.choices[0].message.content,
    });
  } catch (err) {
    console.error("GROQ ERROR:", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}

// import OpenAI from "openai";

// export async function POST(req) {
//   try {
//     const { message } = await req.json();
//     const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

//     const completion = await openai.chat.completions.create({
//       model: "gpt-4o-mini",
//       messages: [{ role: "user", content: message }],
//     });

//     return Response.json({
//       reply: completion.choices[0].message.content,
//     });
//   } catch (error) {
//     return Response.json({ error: error.message }, { status: 500 });
//   }
// }
