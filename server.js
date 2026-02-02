const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { createClient } = require("@supabase/supabase-js");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const supabaseUrl = "PUT_YOUR_SUPABASE_URL_HERE";
const supabaseKey = "PUT_YOUR_SUPABASE_ANON_KEY_HERE";
const supabase = createClient(supabaseUrl, supabaseKey);

app.get("/", (req, res) => {
  res.send("Attendance System Running ✅");
});

app.post("/scan", async (req, res) => {
  const { code } = req.body;

  const { data: student } = await supabase
    .from("students")
    .select("*")
    .eq("student_code", code)
    .single();

  if (!student) return res.json({ message: "❌ الطالب غير مسجل" });

  await supabase.from("attendance").insert({
    student_id: student.id,
    status: "present",
    scan_time: new Date()
  });

  res.json({ message: "✅ تم تسجيل الحضور" });
});

app.listen(3000, () => console.log("Server started"));
