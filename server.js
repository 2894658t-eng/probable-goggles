const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { createClient } = require("@supabase/supabase-js");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const supabaseUrl = "https://nqjbunpvlkvpkhlnvdko.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5xamJ1bnB2bGt2cGtobG52ZGtvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk5ODcyNjcsImV4cCI6MjA4NTU2MzI2N30.rrR1FfAFRdXd7fuE4Z80KOyFTWQy76wavW0ONHNYGwM";

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
