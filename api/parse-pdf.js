export default async function handler(req, res) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return res.status(500).json({ error: "ANTHROPIC_API_KEY not configured in Vercel environment variables" });

  try {
    const { pdfBase64, fileName } = req.body;
    if (!pdfBase64) return res.status(400).json({ error: "No PDF data provided" });

    const PARSE_PROMPT = `You are a fitness program parser. Given a PDF of a training program, extract ALL data into this EXACT JSON format. Respond ONLY with valid JSON, no markdown, no backticks, no explanation.

{
  "client": {
    "name": "Client surname (from filename or header)",
    "level": "beginner|intermediate|advanced",
    "sessionsPerWeek": 3,
    "sessionDuration": 60,
    "day3Type": "glute|fullbody",
    "trainingLocation": "gym|home",
    "cardioDaysPerWeek": 0,
    "goals": "",
    "healthNotes": "",
    "injuries": [],
    "includesRunning": false,
    "startDate": "2025-01-01",
    "status": "active"
  },
  "program": {
    "monthNumber": 1,
    "blockLabel": "Block description",
    "block1": [
      {
        "dayLabel": "Day 1",
        "focus": "Lower Body + Core",
        "dayType": "Q",
        "exercises": [
          {
            "id": "unique_id",
            "name": "Exercise Name (keep original language, e.g. Italian)",
            "category": "compound|isolation|core|mobility|hiit",
            "section": "Strength|Core|Finisher|Warm-Up",
            "sets": 4,
            "reps": "8",
            "rest": 120,
            "weight": "60kg",
            "rpe": "RPE7",
            "notes": "tempo, technique cues, etc."
          }
        ]
      }
    ],
    "block2": [],
    "cardio": null,
    "running": null
  }
}

RULES:
- "block1" = weeks 1-2 (or first half), "block2" = weeks 3-4 (or second half). If only one block exists, put it in block1 and leave block2 as empty copy or same.
- dayType: Q=quad/push, H=hinge/pull, G=glute, F=fullbody
- section: group exercises by Strength (all main lifts and accessory work), Core (abs/stability), Finisher (EMOM/AMRAP/circuits), Warm-Up
- Keep exercise names in their ORIGINAL language (Italian, English, etc.)
- For supersets, put both exercises as separate entries with notes "Superset with X"
- For circuits/EMOM/AMRAP, put as single exercise in Finisher section with full description in notes
- rest in seconds
- weight: include unit (kg, lb) or "bodyweight" or dash if not specified
- If the PDF contains multiple weeks with different weights/reps, use W1-2 for block1 and W3-4 for block2
- For cardio/running days, include them in the "cardio" field as array: [{"week":"W1","sessions":[{"type":"Easy Run","description":"8k Zone 2"}]}]
- For running programs, include in "running" field similarly
- If you can detect the month/block number from context, set monthNumber accordingly
- Generate unique exercise IDs like "ex_1", "ex_2", etc.`;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 8000,
        system: PARSE_PROMPT,
        messages: [{
          role: "user",
          content: [
            { type: "document", source: { type: "base64", media_type: "application/pdf", data: pdfBase64 } },
            { type: "text", text: "Parse this training program PDF. The filename is: " + (fileName || "unknown.pdf") + ". Extract all exercises, sets, reps, weights, rest periods, and any cardio/running. Return ONLY the JSON object." }
          ]
        }]
      })
    });

    if (!response.ok) {
      const err = await response.text();
      return res.status(response.status).json({ error: "Anthropic API error: " + err });
    }

    const data = await response.json();
    const text = (data.content || []).map(b => b.text || "").join("\n");
    const clean = text.replace(/```json|```/g, "").trim();
    
    try {
      const parsed = JSON.parse(clean);
      return res.status(200).json(parsed);
    } catch (parseErr) {
      return res.status(200).json({ raw: clean, parseError: parseErr.message });
    }
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
