import { useState, useEffect, useCallback, useMemo } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// ─── EXERCISE LIBRARY ───
const EXERCISES = {
  mobility: [
    { id: "m1", name: "Hip Circles", category: "mobility", equipment: "none", focus: "both" },
    { id: "m2", name: "Leg Swings", category: "mobility", equipment: "none", focus: "both" },
    { id: "m3", name: "Arm Circles", category: "mobility", equipment: "none", focus: "both" },
    { id: "m4", name: "Cat-Cow", category: "mobility", equipment: "none", focus: "both" },
    { id: "m5", name: "World's Greatest Stretch", category: "mobility", equipment: "none", focus: "both" },
    { id: "m6", name: "Band Pull-Aparts", category: "mobility", equipment: "band", focus: "A" },
    { id: "m7", name: "Ankle Mobility", category: "mobility", equipment: "none", focus: "A" },
    { id: "m8", name: "Thoracic Rotations", category: "mobility", equipment: "none", focus: "both" },
    { id: "m9", name: "Deep Squat Hold", category: "mobility", equipment: "none", focus: "A" },
    { id: "m10", name: "Banded Clamshells", category: "mobility", equipment: "band", focus: "B" },
    { id: "m11", name: "Foam Roll Quads", category: "mobility", equipment: "foam roller", focus: "A" },
    { id: "m12", name: "Foam Roll T-Spine", category: "mobility", equipment: "foam roller", focus: "both" },
    { id: "m13", name: "Banded Shoulder Dislocates", category: "mobility", equipment: "band", focus: "A" },
    { id: "m14", name: "90/90 Hip Stretch", category: "mobility", equipment: "none", focus: "B" },
    { id: "m15", name: "Scapular Push-Ups", category: "mobility", equipment: "none", focus: "A" },
    { id: "m16", name: "Inchworms", category: "mobility", equipment: "none", focus: "both" },
    { id: "m17", name: "Prayer Stretch", category: "mobility", equipment: "none", focus: "both" },
    { id: "m18", name: "Scorpion Twist", category: "mobility", equipment: "none", focus: "both" },
    { id: "m19", name: "Windmill", category: "mobility", equipment: "none", focus: "both" },
    { id: "m20", name: "Adductor Rocks", category: "mobility", equipment: "none", focus: "B" },
    { id: "m21", name: "Goodmornings", category: "mobility", equipment: "none", focus: "B" },
  ],
  compound_push_squat: [
    { id: "cps1", name: "Back Squat", category: "compound", equipment: "barbell", muscles: ["quads", "glutes"], focus: "A" },
    { id: "cps2", name: "Front Squat", category: "compound", equipment: "barbell", muscles: ["quads", "core"], focus: "A" },
    { id: "cps3", name: "Bench Press", category: "compound", equipment: "barbell", muscles: ["chest", "triceps"], focus: "A" },
    { id: "cps4", name: "Overhead Press", category: "compound", equipment: "barbell", muscles: ["shoulders", "triceps"], focus: "A" },
    { id: "cps5", name: "Goblet Squat", category: "compound", equipment: "dumbbell/kettlebell", muscles: ["quads", "glutes"], focus: "A" },
    { id: "cps6", name: "Floor Press", category: "compound", equipment: "barbell/dumbbell", muscles: ["chest", "triceps"], focus: "A" },
    { id: "cps7", name: "Dumbbell Bench Press", category: "compound", equipment: "dumbbells", muscles: ["chest", "triceps"], focus: "A" },
    { id: "cps8", name: "Push Press", category: "compound", equipment: "barbell", muscles: ["shoulders", "triceps", "legs"], focus: "A" },
    { id: "cps9", name: "Leg Press 45°", category: "compound", equipment: "machine", muscles: ["quads", "glutes"], focus: "A" },
    { id: "cps10", name: "DB Floor Press", category: "compound", equipment: "dumbbells", muscles: ["chest", "triceps"], focus: "A" },
    { id: "cps11", name: "Push-Up", category: "compound", equipment: "none", muscles: ["chest", "triceps"], focus: "A" },
    { id: "cps12", name: "Box Squat", category: "compound", equipment: "barbell", muscles: ["quads", "glutes"], focus: "A" },
    { id: "cps13", name: "Shoulder Press 90°", category: "compound", equipment: "dumbbells", muscles: ["shoulders", "triceps"], focus: "A" },
    { id: "cps14", name: "Z-Press", category: "compound", equipment: "dumbbells", muscles: ["shoulders", "core"], focus: "A" },
    { id: "cps15", name: "Standing Press", category: "compound", equipment: "barbell", muscles: ["shoulders", "triceps"], focus: "A" },
    { id: "cps16", name: "Kneeling Press", category: "compound", equipment: "dumbbells", muscles: ["shoulders", "core"], focus: "A" },
    { id: "cps17", name: "Elevated Push-Ups", category: "compound", equipment: "none", muscles: ["chest", "triceps"], focus: "A" },
  ],
  compound_pull_hinge: [
    { id: "cph1", name: "Deadlift", category: "compound", equipment: "barbell", muscles: ["posterior chain"], focus: "B" },
    { id: "cph2", name: "Romanian Deadlift", category: "compound", equipment: "barbell", muscles: ["hamstrings", "glutes"], focus: "B" },
    { id: "cph3", name: "Barbell Row", category: "compound", equipment: "barbell", muscles: ["back", "biceps"], focus: "B" },
    { id: "cph4", name: "Pull-Ups", category: "compound", equipment: "pull-up bar", muscles: ["back", "biceps"], focus: "B" },
    { id: "cph5", name: "Sumo Deadlift", category: "compound", equipment: "barbell", muscles: ["glutes", "inner thigh"], focus: "B" },
    { id: "cph6", name: "Trap Bar Deadlift", category: "compound", equipment: "trap bar", muscles: ["posterior chain"], focus: "B" },
    { id: "cph7", name: "Pendlay Row", category: "compound", equipment: "barbell", muscles: ["back", "biceps"], focus: "B" },
    { id: "cph8", name: "Chin-Ups", category: "compound", equipment: "pull-up bar", muscles: ["back", "biceps"], focus: "B" },
    { id: "cph9", name: "DB Romanian Deadlift", category: "compound", equipment: "dumbbells", muscles: ["hamstrings", "glutes"], focus: "B" },
    { id: "cph10", name: "1-Arm DB Row", category: "compound", equipment: "dumbbell", muscles: ["back", "biceps"], focus: "B" },
    { id: "cph11", name: "Gorilla Row", category: "compound", equipment: "dumbbells", muscles: ["back", "biceps"], focus: "B" },
    { id: "cph12", name: "Dumbbell Bent-over Row", category: "compound", equipment: "dumbbells", muscles: ["back", "biceps"], focus: "B" },
    { id: "cph13", name: "Seal Row", category: "compound", equipment: "dumbbells", muscles: ["back", "rear delts"], focus: "B" },
    { id: "cph14", name: "Lat Machine", category: "compound", equipment: "cable", muscles: ["back", "biceps"], focus: "B" },
    { id: "cph15", name: "Low Pulley", category: "compound", equipment: "cable", muscles: ["back", "biceps"], focus: "B" },
    { id: "cph16", name: "Row Machine", category: "compound", equipment: "machine", muscles: ["back", "biceps"], focus: "B" },
  ],
  accessory_push_squat: [
    { id: "aps1", name: "Bulgarian Split Squat", category: "accessory", equipment: "dumbbells", muscles: ["quads", "glutes"], focus: "A" },
    { id: "aps2", name: "Walking Lunges", category: "accessory", equipment: "dumbbells", muscles: ["quads", "glutes"], focus: "A" },
    { id: "aps3", name: "Lateral Raises", category: "accessory", equipment: "dumbbells", muscles: ["shoulders"], focus: "A" },
    { id: "aps4", name: "Tricep Dips", category: "accessory", equipment: "bench/bars", muscles: ["triceps"], focus: "A" },
    { id: "aps5", name: "Incline Dumbbell Press", category: "accessory", equipment: "dumbbells", muscles: ["upper chest"], focus: "A" },
    { id: "aps6", name: "Chest Flyes", category: "accessory", equipment: "dumbbells", muscles: ["chest"], focus: "A" },
    { id: "aps7", name: "Step-Ups", category: "accessory", equipment: "box/bench", muscles: ["quads", "glutes"], focus: "A" },
    { id: "aps8", name: "Reverse Lunges", category: "accessory", equipment: "dumbbells", muscles: ["quads", "glutes"], focus: "A" },
    { id: "aps9", name: "Leg Press", category: "accessory", equipment: "machine", muscles: ["quads", "glutes"], focus: "A" },
    { id: "aps10", name: "Leg Extension", category: "accessory", equipment: "machine", muscles: ["quads"], focus: "A" },
    { id: "aps11", name: "Calf Raises", category: "accessory", equipment: "machine/step", muscles: ["calves"], focus: "A" },
    { id: "aps12", name: "Tricep Pushdowns", category: "accessory", equipment: "cable", muscles: ["triceps"], focus: "A" },
    { id: "aps13", name: "Arnold Press", category: "accessory", equipment: "dumbbells", muscles: ["shoulders"], focus: "A" },
    { id: "aps14", name: "Cable Flyes", category: "accessory", equipment: "cable", muscles: ["chest"], focus: "A" },
    { id: "aps15", name: "Sissy Squat", category: "accessory", equipment: "none", muscles: ["quads"], focus: "A" },
    { id: "aps16", name: "Cable Tricep Extension", category: "accessory", equipment: "cable", muscles: ["triceps"], focus: "A" },
    { id: "aps17", name: "Dumbbell Incline Press 90°", category: "accessory", equipment: "dumbbells", muscles: ["upper chest"], focus: "A" },
    { id: "aps18", name: "Goblet Split Squat", category: "accessory", equipment: "dumbbell", muscles: ["quads", "glutes"], focus: "A" },
    { id: "aps19", name: "Push-Up Negative (Ecc 3s)", category: "accessory", equipment: "none", muscles: ["chest", "triceps"], focus: "A" },
    { id: "aps20", name: "Half Kneeling Press", category: "accessory", equipment: "dumbbell", muscles: ["shoulders"], focus: "A" },
    { id: "aps21", name: "DB Seated Press", category: "accessory", equipment: "dumbbells/chair", muscles: ["shoulders"], focus: "A" },
    { id: "aps22", name: "Push-Up Hand Release", category: "accessory", equipment: "none", muscles: ["chest", "triceps"], focus: "A" },
    { id: "aps23", name: "DB Bridged Floor Press", category: "accessory", equipment: "dumbbells", muscles: ["chest", "glutes"], focus: "A" },
    { id: "aps24", name: "Dip su Sedia", category: "accessory", equipment: "chair", muscles: ["triceps"], focus: "A" },
    { id: "aps25", name: "SL Goblet Squat (Chair)", category: "accessory", equipment: "dumbbell/chair", muscles: ["quads", "glutes"], focus: "A" },
  ],
  accessory_pull_hinge: [
    { id: "aph1", name: "Hip Thrust", category: "accessory", equipment: "barbell", muscles: ["glutes"], focus: "B" },
    { id: "aph2", name: "Dumbbell Row", category: "accessory", equipment: "dumbbell", muscles: ["back"], focus: "B" },
    { id: "aph3", name: "Face Pulls", category: "accessory", equipment: "cable", muscles: ["rear delts"], focus: "B" },
    { id: "aph4", name: "Bicep Curls", category: "accessory", equipment: "dumbbells", muscles: ["biceps"], focus: "B" },
    { id: "aph5", name: "Single-Leg RDL", category: "accessory", equipment: "dumbbell/kettlebell", muscles: ["hamstrings", "glutes"], focus: "B" },
    { id: "aph6", name: "Seated Cable Row", category: "accessory", equipment: "cable", muscles: ["back"], focus: "B" },
    { id: "aph7", name: "Leg Curl", category: "accessory", equipment: "machine/band", muscles: ["hamstrings"], focus: "B" },
    { id: "aph8", name: "Lat Pulldown", category: "accessory", equipment: "cable", muscles: ["back"], focus: "B" },
    { id: "aph9", name: "Good Mornings", category: "accessory", equipment: "barbell", muscles: ["hamstrings", "lower back"], focus: "B" },
    { id: "aph10", name: "Hammer Curls", category: "accessory", equipment: "dumbbells", muscles: ["biceps"], focus: "B" },
    { id: "aph11", name: "Reverse Flyes", category: "accessory", equipment: "dumbbells", muscles: ["rear delts"], focus: "B" },
    { id: "aph12", name: "Cable Pull-Through", category: "accessory", equipment: "cable", muscles: ["glutes", "hamstrings"], focus: "B" },
    { id: "aph13", name: "Glute Bridge", category: "accessory", equipment: "barbell/band", muscles: ["glutes"], focus: "B" },
    { id: "aph14", name: "Inverted Row", category: "accessory", equipment: "bar/rings", muscles: ["back"], focus: "B" },
    { id: "aph15", name: "Abductor Machine", category: "accessory", equipment: "machine", muscles: ["glutes"], focus: "B" },
    { id: "aph16", name: "Cable Kickback", category: "accessory", equipment: "cable", muscles: ["glutes"], focus: "B" },
    { id: "aph17", name: "RDL B-Stance DB", category: "accessory", equipment: "dumbbells", muscles: ["hamstrings", "glutes"], focus: "B" },
    { id: "aph18", name: "DB SL Hip Thrust", category: "accessory", equipment: "dumbbell", muscles: ["glutes"], focus: "B" },
    { id: "aph19", name: "Hamstring Bridge", category: "accessory", equipment: "none", muscles: ["hamstrings", "glutes"], focus: "B" },
    { id: "aph20", name: "SL Hamstring Bridge", category: "accessory", equipment: "none", muscles: ["hamstrings", "glutes"], focus: "B" },
    { id: "aph21", name: "Hamstring Sliding Curls", category: "accessory", equipment: "none", muscles: ["hamstrings"], focus: "B" },
    { id: "aph22", name: "DB Hip Thrust + Band", category: "accessory", equipment: "dumbbell/band", muscles: ["glutes"], focus: "B" },
    { id: "aph23", name: "Side Plank Clamshell", category: "accessory", equipment: "none", muscles: ["glutes"], focus: "B" },
    { id: "aph24", name: "Plank Row (Chair)", category: "accessory", equipment: "dumbbell/chair", muscles: ["back"], focus: "B" },
    { id: "aph25", name: "Bicep Curls DB", category: "accessory", equipment: "dumbbells", muscles: ["biceps"], focus: "B" },
    { id: "aph26", name: "DB Tricep Extension", category: "accessory", equipment: "dumbbells", muscles: ["triceps"], focus: "B" },
  ],
  core: [
    { id: "co1", name: "Plank", category: "core", equipment: "none" },
    { id: "co2", name: "Dead Bug", category: "core", equipment: "none" },
    { id: "co3", name: "Pallof Press", category: "core", equipment: "cable/band" },
    { id: "co4", name: "Hanging Leg Raise", category: "core", equipment: "pull-up bar" },
    { id: "co5", name: "Ab Wheel Rollout", category: "core", equipment: "ab wheel" },
    { id: "co6", name: "Bird Dog", category: "core", equipment: "none" },
    { id: "co7", name: "Russian Twist", category: "core", equipment: "weight plate" },
    { id: "co8", name: "Hollow Hold", category: "core", equipment: "none" },
    { id: "co9", name: "Side Plank", category: "core", equipment: "none" },
    { id: "co10", name: "Farmer's Carry", category: "core", equipment: "dumbbells/kettlebells" },
    { id: "co11", name: "Suitcase Carry", category: "core", equipment: "dumbbell/kettlebell" },
    { id: "co12", name: "Copenhagen Plank", category: "core", equipment: "bench" },
    { id: "co13", name: "Plank Commando", category: "core", equipment: "none" },
    { id: "co14", name: "Plank Drag Through", category: "core", equipment: "dumbbell" },
    { id: "co15", name: "Plank Reach", category: "core", equipment: "none" },
    { id: "co16", name: "Reverse Crunch", category: "core", equipment: "none" },
  ],
  hiit: [
    { id: "h1", name: "Burpees", category: "hiit", equipment: "none" },
    { id: "h2", name: "Box Jumps", category: "hiit", equipment: "box" },
    { id: "h3", name: "Kettlebell Swings", category: "hiit", equipment: "kettlebell" },
    { id: "h4", name: "Battle Ropes", category: "hiit", equipment: "ropes" },
    { id: "h5", name: "Rowing Intervals", category: "hiit", equipment: "rower" },
    { id: "h6", name: "Assault Bike", category: "hiit", equipment: "assault bike" },
    { id: "h7", name: "Wall Balls", category: "hiit", equipment: "med ball" },
    { id: "h8", name: "Thrusters", category: "hiit", equipment: "barbell/dumbbells" },
    { id: "h9", name: "Jump Rope", category: "hiit", equipment: "rope" },
    { id: "h10", name: "Mountain Climbers", category: "hiit", equipment: "none" },
    { id: "h11", name: "Ski Erg", category: "hiit", equipment: "ski erg" },
    { id: "h12", name: "Sled Push", category: "hiit", equipment: "sled" },
    { id: "h13", name: "Squat Jumps", category: "hiit", equipment: "none" },
    { id: "h14", name: "Split Jumps", category: "hiit", equipment: "none" },
    { id: "h15", name: "Up & Down", category: "hiit", equipment: "none" },
    { id: "h16", name: "Wormwalk", category: "hiit", equipment: "none" },
    { id: "h17", name: "DB Push Press", category: "hiit", equipment: "dumbbells" },
    { id: "h18", name: "DB Deadlift", category: "hiit", equipment: "dumbbells" },
    { id: "h19", name: "Reverse Lunges (Tempo)", category: "hiit", equipment: "dumbbells" },
    { id: "h20", name: "Plank Commando", category: "hiit", equipment: "none" },
    { id: "h21", name: "Devil Press", category: "hiit", equipment: "dumbbells" },
    { id: "h22", name: "Row Renegade", category: "hiit", equipment: "dumbbells" },
    { id: "h23", name: "V-Up", category: "hiit", equipment: "none" },
    { id: "h24", name: "GHD", category: "hiit", equipment: "GHD machine" },
    { id: "h25", name: "Walking Lunges", category: "hiit", equipment: "dumbbells" },
    { id: "h26", name: "Lateral Slamball", category: "hiit", equipment: "slamball" },
  ],
  running: [
    { id: "r1", name: "Easy Run", category: "running", equipment: "none" },
    { id: "r2", name: "Tempo Run", category: "running", equipment: "none" },
    { id: "r3", name: "Interval Run", category: "running", equipment: "none" },
    { id: "r4", name: "Long Run", category: "running", equipment: "none" },
  ],
};

// ─── EQUIPMENT FILTER ───
const GYM_ONLY = new Set(["cps1","cps2","cps3","cps4","cps6","cps8","cps9","cph1","cph2","cph3","cph4","cph5","cph6","cph7","cph8","aps5","aps9","aps10","aps12","aps14","aps15","aps16","aps17","aph6","aph7","aph8","aph9","aph12","aph15","aph16","co3","co4","co5","co12","h2","h4","h5","h6","h7","h11","h12"]);
const filterLoc = (pool, loc) => loc === "home" ? pool.filter(e => !GYM_ONLY.has(e.id)) : pool;

// ─── CARDIO PROGRAMMING ───
function generateCardioDays(level, cardioDays, block) {
  if (cardioDays === 0) return [];
  const sessions = [];
  const isB2 = block === 1;
  const pools = {
    beginner: [
      { type: "Easy Run", warmup: "5' camminata + mobilità", work: isB2 ? "25' easy, conversational pace" : "20' easy, walk/run if needed", cooldown: "5' stretching", rpe: "5-6" },
      { type: "Fartlek", warmup: "5' easy run + mobilità", work: isB2 ? "1' moderato + 1' easy × 24'" : "1' moderato + 1' easy × 20'", cooldown: "5' stretching", rpe: "6-7" },
      { type: "Z2 Bike", warmup: "5'", work: "45' easy — conversational pace", cooldown: "5'", rpe: "5" },
      { type: "Easy Run (Z2)", warmup: "5' camminata", work: isB2 ? "5k easy peasy" : "3-4k easy peasy", cooldown: "5' stretching", rpe: "5" },
    ],
    intermediate: [
      { type: "Interval Run", warmup: "5' easy run + mobilità", work: isB2 ? "8×600m, rec 2' ferma" : "6×800m, rec 2' ferma", cooldown: "5' jogging + stretching", rpe: "8-9" },
      { type: "Fartlek", warmup: "5' easy run + mobilità", work: isB2 ? "2' sostenuti + 1' veloce + 2' lenti × 30'" : "2' sostenuti + 2' lenti × 28'", cooldown: "5' jogging + stretching", rpe: "7-8" },
      { type: "Z2 Bike", warmup: "5'", work: "45' easy — conversational pace", cooldown: "5'", rpe: "5" },
      { type: "Easy Run (Z2)", warmup: "5'", work: isB2 ? "8k easy" : "7k easy", cooldown: "5' jogging + stretching", rpe: "5" },
    ],
    advanced: [
      { type: "Speed Intervals", warmup: "5' easy run + mobilità", work: isB2 ? "10×400m, rec 90s" : "8×400m, rec 90s", cooldown: "5' jogging + stretching", rpe: "9" },
      { type: "Tempo Run", warmup: "5' easy run + mobilità", work: isB2 ? "6km progressive" : "5km progressive", cooldown: "5' jogging + stretching", rpe: "8" },
      { type: "Z2 Bike", warmup: "5'", work: isB2 ? "60' easy" : "45' easy", cooldown: "5'", rpe: "5" },
      { type: "Long Run (Z2)", warmup: "5'", work: isB2 ? "10k easy" : "8k easy", cooldown: "5' stretching", rpe: "5-6" },
    ],
  };
  const pool = pools[level] || pools.beginner;
  for (let i = 0; i < Math.min(cardioDays, pool.length); i++) sessions.push({ ...pool[i], dayLabel: "Cardio " + (i+1) });
  return sessions;
}

const ALL_EXERCISES = Object.values(EXERCISES).flat();
const DURATION_CONFIG = {
  45: { mobilityCount: 3, compoundCount: 2, accessoryCount: 1, coreCount: 1, hiitCount: 2, hiitRounds: 2 },
  60: { mobilityCount: 3, compoundCount: 2, accessoryCount: 2, coreCount: 2, hiitCount: 3, hiitRounds: 3 },
  75: { mobilityCount: 4, compoundCount: 2, accessoryCount: 3, coreCount: 2, hiitCount: 3, hiitRounds: 3 },
  90: { mobilityCount: 4, compoundCount: 2, accessoryCount: 4, coreCount: 2, hiitCount: 4, hiitRounds: 4 },
};

// ─── PROGRESSION ENGINE ───

// Legacy config for historical programs
const LEVEL_CONFIG = {
  beginner: { months1_2: { compoundSets: 3, compoundReps: "10-12", compoundRPE: "6", accessorySets: 2, accessoryReps: "12-15", accessoryRPE: "5-6", coreSets: 2, coreReps: "10-12", restCompound: 120, restAccessory: 90 }, months3_4: { compoundSets: 3, compoundReps: "8-10", compoundRPE: "7", accessorySets: 3, accessoryReps: "10-12", accessoryRPE: "6-7", coreSets: 3, coreReps: "10-12", restCompound: 120, restAccessory: 75 } },
  intermediate: { month1: { compoundSets: 4, compoundReps: "6-8", compoundRPE: "7", accessorySets: 3, accessoryReps: "8-12", accessoryRPE: "7", coreSets: 3, coreReps: "10-15", restCompound: 150, restAccessory: 75 }, following: { compoundSets: 4, compoundReps: "4-6", compoundRPE: "8-9", accessorySets: 4, accessoryReps: "8-10", accessoryRPE: "8", coreSets: 3, coreReps: "12-15", restCompound: 180, restAccessory: 60 } },
  advanced: { base: { compoundSets: 5, compoundReps: "3-5", compoundRPE: "8-9", accessorySets: 4, accessoryReps: "6-10", accessoryRPE: "8-9", coreSets: 3, coreReps: "12-15", restCompound: 180, restAccessory: 60 } },
};

// Parse weight string → number in kg (returns null if unparseable)
function parseWeight(w) {
  if (!w || w === "—" || w === "BW" || w === "bodyweight") return null;
  const s = String(w).toLowerCase().replace(/,/g, ".").replace(/\s+/g, "");
  // Handle "2x10kg" → 10, "2×12.5kg" → 12.5
  let m = s.match(/(\d+)\s*[x×]\s*(\d+\.?\d*)\s*kg/);
  if (m) return { perSide: true, value: parseFloat(m[2]) };
  // Handle "60kg", "60-65kg", "@60%"
  m = s.match(/(\d+\.?\d*)\s*kg/);
  if (m) return { perSide: false, value: parseFloat(m[1]) };
  // Handle ranges "30-35kg"
  m = s.match(/(\d+\.?\d*)\s*[-–]\s*(\d+\.?\d*)\s*kg/);
  if (m) return { perSide: false, value: parseFloat(m[2]) };
  // Handle "+30kg" (weighted)
  m = s.match(/\+\s*(\d+\.?\d*)\s*kg/);
  if (m) return { perSide: false, value: parseFloat(m[1]) };
  // Handle percentage "@65%"
  m = s.match(/@?\s*(\d+\.?\d*)\s*%/);
  if (m) return { perSide: false, value: parseFloat(m[1]), isPercent: true };
  // Handle RPE in weight field "RPE 7"
  m = s.match(/rpe\s*(\d+\.?\d*)/i);
  if (m) return null;
  return null;
}

// Format weight back to string
function formatWeight(parsed, original) {
  if (!parsed) return original || "—";
  const v = parsed.value;
  if (parsed.isPercent) return "@" + Math.round(v) + "%";
  if (parsed.perSide) return "2×" + (v % 1 === 0 ? v : v.toFixed(1)) + "kg";
  return (v % 1 === 0 ? v : v.toFixed(1)) + "kg";
}

// Determine training phase based on month number
function getPhase(monthNumber) {
  const cycle = ((monthNumber - 1) % 4); // 0-indexed in 4-month cycles
  if (cycle === 0) return "foundation";    // Mo 1,5,9...  — build volume, learn patterns
  if (cycle === 1) return "hypertrophy";   // Mo 2,6,10... — moderate load, higher volume
  if (cycle === 2) return "strength";      // Mo 3,7,11... — heavier, lower reps
  return "deload";                         // Mo 4,8,12... — reduce volume & intensity
}

// Phase-specific set/rep/RPE schemes
function getPhaseConfig(level, phase) {
  const configs = {
    beginner: {
      foundation:  { cSets: 3, cReps: "10",  cRPE: "6",   aSets: 3, aReps: "12",  aRPE: "5-6", coreSets: 3, coreReps: "30s", rest: 120, aRest: 90,  tempo: "", wInc: 0,   wIncAcc: 0 },
      hypertrophy: { cSets: 3, cReps: "8",   cRPE: "7",   aSets: 3, aReps: "10",  aRPE: "6-7", coreSets: 3, coreReps: "30s", rest: 120, aRest: 90,  tempo: "", wInc: 2.5, wIncAcc: 1 },
      strength:    { cSets: 4, cReps: "6",   cRPE: "7-8", aSets: 3, aReps: "10",  aRPE: "7",   coreSets: 3, coreReps: "40s", rest: 150, aRest: 90,  tempo: "ecc 3s", wInc: 2.5, wIncAcc: 1 },
      deload:      { cSets: 3, cReps: "8",   cRPE: "5-6", aSets: 2, aReps: "12",  aRPE: "5",   coreSets: 2, coreReps: "30s", rest: 120, aRest: 90,  tempo: "", wInc: -5,  wIncAcc: -2 },
    },
    intermediate: {
      foundation:  { cSets: 4, cReps: "8",   cRPE: "7",   aSets: 3, aReps: "10",  aRPE: "7",   coreSets: 3, coreReps: "40s", rest: 150, aRest: 75,  tempo: "", wInc: 2.5, wIncAcc: 1 },
      hypertrophy: { cSets: 4, cReps: "6",   cRPE: "7-8", aSets: 4, aReps: "8",   aRPE: "7-8", coreSets: 3, coreReps: "40s", rest: 150, aRest: 75,  tempo: "", wInc: 2.5, wIncAcc: 2 },
      strength:    { cSets: 4, cReps: "4-5", cRPE: "8-9", aSets: 3, aReps: "8",   aRPE: "8",   coreSets: 3, coreReps: "40s", rest: 180, aRest: 90,  tempo: "ecc 3s", wInc: 5, wIncAcc: 2 },
      deload:      { cSets: 3, cReps: "8",   cRPE: "6",   aSets: 3, aReps: "10",  aRPE: "6",   coreSets: 2, coreReps: "30s", rest: 120, aRest: 75,  tempo: "", wInc: -5, wIncAcc: -2 },
    },
    advanced: {
      foundation:  { cSets: 4, cReps: "6",   cRPE: "7-8", aSets: 4, aReps: "8",   aRPE: "7-8", coreSets: 3, coreReps: "40s", rest: 180, aRest: 75,  tempo: "", wInc: 2.5, wIncAcc: 2 },
      hypertrophy: { cSets: 5, cReps: "5",   cRPE: "8",   aSets: 4, aReps: "6-8", aRPE: "8",   coreSets: 3, coreReps: "40s", rest: 180, aRest: 75,  tempo: "", wInc: 5, wIncAcc: 2 },
      strength:    { cSets: 5, cReps: "3",   cRPE: "9",   aSets: 4, aReps: "6",   aRPE: "8-9", coreSets: 3, coreReps: "40s", rest: 180, aRest: 90,  tempo: "ecc 3s + conc", wInc: 5, wIncAcc: 2.5 },
      deload:      { cSets: 3, cReps: "6",   cRPE: "6-7", aSets: 3, aReps: "8",   aRPE: "6",   coreSets: 2, coreReps: "30s", rest: 150, aRest: 75,  tempo: "", wInc: -7.5, wIncAcc: -2.5 },
    }
  };
  return (configs[level] || configs.intermediate)[phase] || configs.intermediate.foundation;
}

// Round weight: compounds to nearest 5kg, accessories to nearest 2kg
function roundWeight(val, isCompound) {
  const step = isCompound ? 5 : 2;
  return Math.round(val / step) * step;
}

// Apply weight increment to a parsed weight
function progressWeight(weightStr, increment, isCompound) {
  const parsed = parseWeight(weightStr);
  if (!parsed) return weightStr || "—";
  if (parsed.isPercent) {
    const newPct = Math.min(95, Math.max(50, parsed.value + (increment > 0 ? 5 : -5)));
    return "@" + Math.round(newPct) + "%";
  }
  const inc = parsed.perSide ? increment * 0.5 : increment;
  const raw = Math.max(0, parsed.value + inc);
  const rounded = roundWeight(raw, isCompound);
  return formatWeight({ ...parsed, value: rounded });
}

// Extract exercise map from a program's block2 (latest state) keyed by exercise name
function extractPrevExercises(prev) {
  if (!prev) return {};
  const map = {};
  // Use block2 if available (most progressed), else block1
  const blocks = (prev.block2 && prev.block2.length > 0) ? prev.block2 : prev.block1;
  if (!blocks) return map;
  blocks.forEach(day => {
    if (!day.exercises) return;
    day.exercises.forEach(ex => {
      if (ex.section === "Strength" || ex.section === "Core") {
        map[ex.name.toLowerCase()] = { ...ex, _dayType: day.dayType, _dayLabel: day.dayLabel };
      }
    });
  });
  return map;
}

// Micro-progression: Block2 gets slight bump from Block1
function microProgress(exercises, level) {
  return exercises.map(ex => {
    if (ex.section !== "Strength") return { ...ex };
    const isComp = ex.category === "compound" || ex.rest >= 120;
    const p = parseWeight(ex.weight);
    if (!p || p.isPercent) {
      if (p && p.isPercent) return { ...ex, weight: "@" + Math.min(95, Math.round(p.value + 2.5)) + "%" };
      return { ...ex, notes: (ex.notes ? ex.notes + " | " : "") + "push harder vs W1-2" };
    }
    const bump = p.perSide ? 0.5 : (level === "beginner" ? 1.25 : 2.5);
    const raw = p.value + bump;
    const rounded = roundWeight(raw, isComp);
    return { ...ex, weight: formatWeight({ ...p, value: rounded }) };
  });
}

function pickRandom(arr, count) { const s = [...arr].sort(() => Math.random() - 0.5); return s.slice(0, Math.min(count, arr.length)); }
function buildDaySchedule(spw, d3 = "glute") { if (spw === 3) return ["Q", "H", d3 === "glute" ? "G" : "F"]; const s = []; for (let i = 0; i < spw; i++) s.push(i % 2 === 0 ? "A" : "B"); return s; }

function generateDay(dayType, phaseCfg, durationCfg, block, usedExercises, location, prevExMap, phase) {
  const exercises = [];
  const P = {}; Object.keys(EXERCISES).forEach(k => { P[k] = filterLoc(EXERCISES[k], location); });
  const isA = dayType === "A", isB = dayType === "B", isQ = dayType === "Q", isH = dayType === "H", isG = dayType === "G", isFB = dayType === "F";

  // Fixed Warm-Up
  const warmUp = [
    { id: "m4", name: "Cat-Cow", category: "mobility", section: "Warm-Up", sets: 1, reps: "10", rest: 0, weight: "BW", rpe: "", notes: "" },
    { id: "m5", name: "World's Greatest Stretch", category: "mobility", section: "Warm-Up", sets: 1, reps: "8/side", rest: 0, weight: "BW", rpe: "", notes: "" },
    { id: "m_9090", name: "90/90 Hip Stretch", category: "mobility", section: "Warm-Up", sets: 1, reps: "5/side", rest: 0, weight: "BW", rpe: "", notes: "" },
    { id: "m_inch", name: "Inchworms", category: "mobility", section: "Warm-Up", sets: 1, reps: "5", rest: 0, weight: "BW", rpe: "", notes: "" },
  ];
  warmUp.forEach(ex => exercises.push({ ...ex }));

  // ─── STYLE-TRAINED TEMPLATES (from 35 real programs) ───
  // Each slot defines: pool of exercise names (most-used first), isCompound flag
  // The generator picks from these in order, carrying over from previous program when possible

  const allStrength = [...P.compound_push_squat, ...P.compound_pull_hinge, ...P.accessory_push_squat, ...P.accessory_pull_hinge];
  const findEx = (names) => {
    for (const n of names) {
      const found = allStrength.find(e => e.name.toLowerCase().includes(n.toLowerCase()) && !usedExercises.has(e.id));
      if (found) return found;
    }
    return null;
  };

  // Check if previous program had this exercise (by partial name match)
  const prevHas = (names) => {
    const prevNames = Object.keys(prevExMap);
    for (const n of names) {
      const match = prevNames.find(pn => pn.includes(n.toLowerCase()));
      if (match) return prevExMap[match];
    }
    return null;
  };

  const addEx = (names, isCompound) => {
    // First try to carry over from previous program
    const prev = prevHas(names);
    const ex = findEx(names);
    if (!ex) return;

    const sets = isCompound ? phaseCfg.cSets : phaseCfg.aSets;
    const reps = isCompound ? phaseCfg.cReps : phaseCfg.aReps;
    const rpe = isCompound ? phaseCfg.cRPE : phaseCfg.aRPE;
    const rest = isCompound ? phaseCfg.rest : phaseCfg.aRest;
    const inc = isCompound ? phaseCfg.wInc : phaseCfg.wIncAcc;

    let weight = "—";
    let notes = "";
    if (prev) {
      weight = progressWeight(prev.weight, inc, isCompound);
      notes = prev.notes || "";
      if (phaseCfg.tempo && !notes.includes("ecc")) notes = [notes, phaseCfg.tempo].filter(Boolean).join(" | ");
    } else {
      notes = phaseCfg.tempo || "";
    }

    exercises.push({ ...ex, section: "Strength", sets: sets || 3, reps: reps || "8", rest: rest || 90, weight, rpe, notes: notes.trim() });
    usedExercises.add(ex.id);
  };

  // ─── DAY TYPE TEMPLATES ───
  // Based on analysis of Gabriele's 35 programs: typical exercise order per day type

  if (isQ) {
    // Day Q: Back Squat → Lunge variant → Hip Thrust → Leg Curl/Calf → Shoulder press → Lateral raise
    addEx(["Back Squat", "Box Squat", "Front Squat", "Goblet Squat"], true);
    addEx(["Bulgarian Split Squat", "Reverse Lunge", "Walking Lunges", "Affondi"], false);
    addEx(["Hip Thrust"], true);
    if (durationCfg.accessoryCount >= 2) addEx(["Leg Curl", "Calf Raise", "Leg Extension"], false);
    if (durationCfg.accessoryCount >= 3) addEx(["Shoulder Press 90°", "DB Shoulder Press", "Arnold Press", "Standing Press", "Kneeling Press"], false);
    if (durationCfg.accessoryCount >= 4) addEx(["Alzate Laterali", "Lateral Raise", "Bicep Curl"], false);
  } else if (isH) {
    // Day H: Deadlift/RDL → Leg Curl → Pull (Lat/Row) → Press/Lat Machine → Optional isolation
    addEx(["Deadlift", "Romanian Deadlift", "RDL", "B-Stance RDL"], true);
    addEx(["Leg Curl", "Hip Thrust"], false);
    addEx(["Lat Machine", "Low Pulley", "Row Machine", "Chest Press"], false);
    if (durationCfg.accessoryCount >= 2) addEx(["Lat Machine neutra", "Lat Machine", "Military Press", "1-Arm DB Row", "DB Row"], false);
    if (durationCfg.accessoryCount >= 3) addEx(["Curl manubri", "Bicep Curl", "Tricipiti corda", "Tricipiti cavo", "Cable Triceps"], false);
  } else if (isG) {
    // Day G: Hip Thrust heavy → RDL/Lat → Hip machine/Push → Abductor → Upper accessory
    addEx(["Hip Thrust"], true);
    addEx(["RDL", "Romanian Deadlift", "B-Stance RDL", "Lat Machine"], false);
    addEx(["Abductor", "Kickback", "Cable Pull"], false);
    if (durationCfg.accessoryCount >= 2) addEx(["Push-Up", "Elevated Push-Up", "DB Bench", "Incline DB Press"], false);
    if (durationCfg.accessoryCount >= 3) addEx(["Rematore", "Gorilla Row", "Dumbbell Bent-over Row", "Seal Row", "Row Machine"], false);
  } else if (isFB) {
    // Full Body: Squat/Hinge → Upper Push/Pull → Hip → Accessory
    if (block % 2 === 0) {
      addEx(["Back Squat", "Box Squat", "Front Squat"], true);
      addEx(["Pull-Up", "Chin-Up", "Lat Machine"], true);
    } else {
      addEx(["Deadlift", "Romanian Deadlift", "RDL"], true);
      addEx(["Bench Press", "DB Bench", "Incline DB Press"], true);
    }
    addEx(["Hip Thrust", "Bulgarian Split Squat"], false);
    if (durationCfg.accessoryCount >= 2) addEx(["Shoulder Press 90°", "Arnold Press", "Alzate Laterali", "Standing Press"], false);
    if (durationCfg.accessoryCount >= 3) addEx(["Leg Curl", "Calf Raise", "Curl manubri", "Tricipiti corda"], false);
  } else if (isA) {
    // Day A (Upper Push focus): Vertical Press → Pull-Up → Horizontal Push → Row → Optional iso
    addEx(["Military Press", "Standing Press", "Z-Press", "Overhead Press", "Kneeling Press"], true);
    addEx(["Pull-Up", "Chin-Up", "Pull-Ups assisted"], true);
    addEx(["DB Bench Press", "Incline DB Press", "Bench Press", "Elevated Push-Up", "Chest Press"], false);
    if (durationCfg.accessoryCount >= 2) addEx(["1-Arm DB Row", "Gorilla Row", "Dumbbell Bent-over Row", "Seal Row", "Row Machine", "Chest-Supported Row"], false);
    if (durationCfg.accessoryCount >= 3) addEx(["Tricipiti corda", "French Press", "Tricipiti cavo", "Cable Triceps", "Curl manubri", "Bicep Curl"], false);
  } else if (isB) {
    // Day B (Upper Pull focus): Deadlift/Row → Pull-Up → Lat/Row → Press accessory → Arm iso
    addEx(["Rematore Bilanciere", "Gorilla Row", "Dumbbell Bent-over Row", "Seal Row", "Row Machine"], true);
    addEx(["Pull-Up", "Chin-Up", "Lat Machine"], true);
    addEx(["Lat Machine neutra", "Low Pulley", "1-Arm DB Row", "DB Row"], false);
    if (durationCfg.accessoryCount >= 2) addEx(["DB Shoulder Press", "Shoulder Press 90°", "Arnold Press", "Alzate Laterali"], false);
    if (durationCfg.accessoryCount >= 3) addEx(["Curl manubri", "Bicep Curl", "Hammer Curl", "Face Pull"], false);
  }

  // ─── CORE (Gabriele's paired format) ───
  const coreTemplates = [
    { name: "Hollow Hold + Side Plank", reps: "30s + 30s/side" },
    { name: "Dead Bug + Plank Shoulder Taps", reps: "12 + 16" },
    { name: "Russian Twist + Hollow Rocks", reps: "20 + 15" },
    { name: "Plank Drag Through + V-Ups", reps: "12 + 10" },
    { name: "Plank + Side Plank", reps: "30s + 30s/side" },
    { name: "Dead Bug + Plank Reach", reps: "12 + 10" },
    { name: "Hollow Body + Pallof Press", reps: "30s + 12" },
    { name: "Plank Commando + Knee to Chest", reps: "12 + 16" },
  ];
  const coreCount = Math.min(durationCfg.coreCount, coreTemplates.length);
  const corePicks = pickRandom(coreTemplates, coreCount);
  corePicks.forEach((ct, i) => {
    exercises.push({ id: "core_" + dayType + "_" + block + "_" + i, name: ct.name, category: "core", section: "Core", sets: phaseCfg.coreSets, reps: ct.reps, rest: 45, weight: "BW", rpe: "", notes: "" });
  });

  // ─── FINISHER (Gabriele's EMOM/AMRAP/circuit style) ───
  const finTemplates = {
    gym: [
      { name: "EMOM 9': 15 Wall Ball + 12 Burpees + 9 Row Cal", reps: "EMOM 9'", notes: "pacing: steady, no rest" },
      { name: "AMRAP 9': 8 WB + 8 Box Jump + 8 DB Snatch", reps: "AMRAP 9'", notes: "4-5 round target" },
      { name: "4RFT: 250m Run + 10 Burpees + 12 Russian Swing", reps: "4 rounds FT", notes: "" },
      { name: "EMOM 12': 200m Row + 10 Burpees + 14 WB", reps: "EMOM 12'", notes: "" },
      { name: "3RFT: 300m Row + 12 Sit-Up + 10 KB Swing", reps: "3 rounds FT", notes: "" },
      { name: "EMOM 9': 8 Ski Cal + 6 Burpees + 6 DB Snatch", reps: "EMOM 9'", notes: "" },
      { name: "E2MOM x4: 250m Row + 10 Box Jump Over", reps: "E2MOM x4", notes: "" },
      { name: "AMRAP 7': 8 Kipping PU + 12 Air Squat + 10 Sit-Up", reps: "AMRAP 7'", notes: "" },
      { name: "Circ 3R: 10 TRX Pull-Up + 10 Goblet Squat + 10 Russian Swing", reps: "3 rounds", notes: "rec 60s between rounds" },
      { name: "5R: 200m Run + 8 Burpees + 6 Thruster", reps: "5 rounds FT", notes: "" },
    ],
    home: [
      { name: "AMRAP 9': 10 Burpees + 15 Air Squat + 12 V-Ups", reps: "AMRAP 9'", notes: "" },
      { name: "EMOM 9': 8 DB Snatch + 10 Lunges + 12 Sit-Ups", reps: "EMOM 9'", notes: "" },
      { name: "4RFT: 10 Burpees + 15 Goblet Squat + 12 DB Row", reps: "4 rounds FT", notes: "" },
      { name: "Tabata 4': Burpees + Mountain Climbers", reps: "20s on / 10s off x8", notes: "" },
    ],
  };
  const finPool = finTemplates[location] || finTemplates.gym;
  const fin = phase === "deload" ? { name: "Light Circuit: 3R easy pace", reps: "3 rounds", notes: "60s rest between exercises, RPE 6" } : pickRandom(finPool, 1)[0];
  const finRounds = phase === "deload" ? 3 : durationCfg.hiitRounds;
  exercises.push({ id: "fin_" + dayType + "_" + block + "_" + Math.random().toString(36).slice(2,6), name: fin.name, category: "hiit", section: "Finisher", sets: finRounds, reps: fin.reps, rest: 60, weight: "—", rpe: phase === "deload" ? "6" : "8-9", notes: fin.notes || "" });

  return exercises;
}

function generateProgram(client, previousProgram = null) {
  const monthNumber = previousProgram ? (previousProgram.monthNumber || 1) + 1 : (client.monthNumber || 1);
  const phase = getPhase(monthNumber);
  const phaseCfg = getPhaseConfig(client.level, phase);
  const durationCfg = DURATION_CONFIG[client.sessionDuration || 60];
  const schedule = buildDaySchedule(client.sessionsPerWeek || 3, client.day3Type || "glute");
  const dayLabels = { A: "Push + Squat", B: "Pull + Hinge", Q: "Quad + Push", H: "Hinge + Pull", G: "Glute Focus", F: "Full Body" };
  const loc = client.trainingLocation || "gym";
  const prevExMap = extractPrevExercises(previousProgram);
  const phaseLabel = { foundation: "Foundation", hypertrophy: "Hypertrophy", strength: "Strength", deload: "Deload" }[phase];

  // Generate Block 1 (W1-2)
  const usedB1 = new Set();
  const block1 = schedule.map((dt, i) => ({ dayLabel: "Day " + (i+1), focus: dayLabels[dt], dayType: dt, exercises: generateDay(dt, phaseCfg, durationCfg, 0, usedB1, loc, prevExMap, phase) }));

  // Generate Block 2 (W3-4) — micro-progression from Block 1
  const block2 = block1.map(day => ({
    ...day,
    exercises: microProgress(day.exercises, client.level)
  }));

  const cardioDays = client.cardioDaysPerWeek || 0;
  return {
    id: "prog_" + Date.now(), clientId: client.id, clientName: client.name, level: client.level,
    monthNumber, sessionsPerWeek: client.sessionsPerWeek || 3, sessionDuration: client.sessionDuration || 60, trainingLocation: loc, createdAt: new Date().toISOString(),
    block1, block2, levelCfg: phaseCfg, durationCfg, phase: phaseLabel,
    includesRunning: client.includesRunning || cardioDays > 0, cardioDaysPerWeek: cardioDays,
    cardio: cardioDays > 0 ? { block1: generateCardioDays(client.level, cardioDays, 0), block2: generateCardioDays(client.level, cardioDays, 1) } : null,
    running: client.includesRunning && cardioDays === 0 ? {
      block1: [{ day: "Off-Day 1", type: "Easy Run", duration: client.level === "beginner" ? "20 min" : "25 min", notes: "Conversational pace" }, { day: "Off-Day 2", type: client.level === "beginner" ? "Easy Run" : "Tempo Run", duration: client.level === "beginner" ? "20 min" : "30 min", notes: client.level === "beginner" ? "Walk/run intervals OK" : "Moderate effort" }],
      block2: [{ day: "Off-Day 1", type: "Easy Run", duration: "30 min", notes: "Conversational pace" }, { day: "Off-Day 2", type: client.level === "advanced" ? "Interval Run" : "Tempo Run", duration: "30 min", notes: client.level === "advanced" ? "6×400m w/ 90s rest" : "Progressive pace" }],
    } : null,
  };
}

// ─── ICONS ───
const I = {
  dashboard: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
  users: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  program: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6"/><path d="M16 13H8"/><path d="M16 17H8"/><path d="M10 9H8"/></svg>,
  library: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>,
  plus: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>,
  trash: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>,
  chevron: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>,
  back: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>,
  bolt: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  check: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  search: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  refresh: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>,
  edit: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  clock: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  cal: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  history: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v5h5"/><path d="M3.05 13A9 9 0 1 0 6 5.3L3 8"/><path d="M12 7v5l4 2"/></svg>,
  upload: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>,
};

// ─── SAMPLE DATA ───
const SAMPLE_CLIENTS = [
  { id: "cl5", name: "Redini", email: "", phone: "", level: "intermediate", monthNumber: 3, sessionsPerWeek: 3, sessionDuration: 75, day3Type: "glute", trainingLocation: "gym", cardioDaysPerWeek: 0, goals: "Strength, pull-up progression, glute development", healthNotes: "", injuries: [], includesRunning: false, startDate: "2025-09-01", status: "active" },
  { id: "cl6", name: "Benvenuti", email: "", phone: "", level: "intermediate", monthNumber: 3, sessionsPerWeek: 3, sessionDuration: 60, day3Type: "fullbody", trainingLocation: "home", cardioDaysPerWeek: 3, goals: "General fitness, improve running, body recomposition", healthNotes: "", injuries: [], includesRunning: false, startDate: "2025-10-01", status: "active" },
  { id: "cl7", name: "Cardoni", email: "", phone: "", level: "intermediate", monthNumber: 3, sessionsPerWeek: 4, sessionDuration: 75, day3Type: "fullbody", trainingLocation: "gym", cardioDaysPerWeek: 1, goals: "Strength, pull-up progression, running", healthNotes: "", injuries: [], includesRunning: true, startDate: "2025-07-01", status: "active" },
  { id: "cl8", name: "Adamoli", email: "", phone: "", level: "intermediate", monthNumber: 1, sessionsPerWeek: 3, sessionDuration: 70, day3Type: "fullbody", trainingLocation: "gym", cardioDaysPerWeek: 0, goals: "Strength, conditioning", healthNotes: "", injuries: [], includesRunning: false, startDate: "2025-11-01", status: "active" },
  { id: "cl9", name: "Agrati", email: "", phone: "", level: "beginner", monthNumber: 2, sessionsPerWeek: 4, sessionDuration: 60, day3Type: "fullbody", trainingLocation: "gym", cardioDaysPerWeek: 1, goals: "General fitness, running", healthNotes: "", injuries: [], includesRunning: true, startDate: "2025-09-01", status: "active" },
  { id: "cl10", name: "Allegri", email: "", phone: "", level: "intermediate", monthNumber: 4, sessionsPerWeek: 6, sessionDuration: 45, day3Type: "fullbody", trainingLocation: "home", cardioDaysPerWeek: 3, goals: "Home training, conditioning, running", healthNotes: "", injuries: [], includesRunning: true, startDate: "2025-06-01", status: "active" },
  { id: "cl11", name: "Anna Savino", email: "", phone: "", level: "beginner", monthNumber: 1, sessionsPerWeek: 2, sessionDuration: 60, day3Type: "fullbody", trainingLocation: "gym", cardioDaysPerWeek: 4, goals: "Strength, running improvement", healthNotes: "", injuries: [], includesRunning: true, startDate: "2025-11-01", status: "active" },
  { id: "cl12", name: "Assereto", email: "", phone: "", level: "advanced", monthNumber: 4, sessionsPerWeek: 3, sessionDuration: 75, day3Type: "fullbody", trainingLocation: "gym", cardioDaysPerWeek: 0, goals: "Strength, hypertrophy, 1RM progression", healthNotes: "", injuries: [], includesRunning: false, startDate: "2025-07-01", status: "active" },
  { id: "cl13", name: "Baini", email: "", phone: "", level: "intermediate", monthNumber: 4, sessionsPerWeek: 4, sessionDuration: 70, day3Type: "fullbody", trainingLocation: "gym", cardioDaysPerWeek: 1, goals: "HYROX prep, strength, running", healthNotes: "Lumbar sensitivity", injuries: ["lower back"], includesRunning: true, startDate: "2025-06-01", status: "active" },
  { id: "cl14", name: "Benedetta Baini", email: "", phone: "", level: "beginner", monthNumber: 2, sessionsPerWeek: 3, sessionDuration: 60, day3Type: "glute", trainingLocation: "gym", cardioDaysPerWeek: 0, goals: "General fitness, conditioning", healthNotes: "", injuries: [], includesRunning: false, startDate: "2025-09-01", status: "active" },
  { id: "cl15", name: "Basco", email: "", phone: "", level: "advanced", monthNumber: 3, sessionsPerWeek: 5, sessionDuration: 90, day3Type: "fullbody", trainingLocation: "gym", cardioDaysPerWeek: 2, goals: "HYROX race prep, strength, endurance", healthNotes: "", injuries: [], includesRunning: true, startDate: "2025-06-01", status: "active" },
  { id: "cl16", name: "Biagioni", email: "", phone: "", level: "beginner", monthNumber: 3, sessionsPerWeek: 3, sessionDuration: 60, day3Type: "fullbody", trainingLocation: "gym", cardioDaysPerWeek: 0, goals: "General fitness, strength foundation", healthNotes: "", injuries: [], includesRunning: false, startDate: "2025-09-01", status: "active" },
  { id: "cl17", name: "Bulla", email: "", phone: "", level: "beginner", monthNumber: 1, sessionsPerWeek: 4, sessionDuration: 60, day3Type: "fullbody", trainingLocation: "gym", cardioDaysPerWeek: 0, goals: "Strength foundation, technique learning", healthNotes: "", injuries: [], includesRunning: false, startDate: "2025-10-01", status: "active" },
  { id: "cl18", name: "Martina", email: "", phone: "", level: "beginner", monthNumber: 1, sessionsPerWeek: 3, sessionDuration: 60, day3Type: "fullbody", trainingLocation: "gym", cardioDaysPerWeek: 0, goals: "General fitness, strength", healthNotes: "", injuries: [], includesRunning: false, startDate: "2025-10-01", status: "active" },
];

const K = { bg: "#0a0a0c", sf: "#131318", sfh: "#1a1a22", cd: "#16161e", bd: "#25252f", tx: "#e8e8ed", tm: "#8b8b9e", td: "#5a5a6e", ac: "#c8ff2e", ab: "rgba(200,255,46,0.08)", ab2: "rgba(200,255,46,0.15)", dg: "#ff4d6a", dgb: "rgba(255,77,106,0.1)", ok: "#2ecc71", wn: "#f0c040", beg: "#5dade2", int: "#f0a030", adv: "#e74c3c" };
const ff = "'DM Sans',-apple-system,BlinkMacSystemFont,sans-serif";
const mf = "'JetBrains Mono','SF Mono',monospace";

function Badge({ children, color = K.ac, bg }) { return <span style={{ display: "inline-flex", alignItems: "center", padding: "3px 10px", borderRadius: 6, fontSize: 11, fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase", color, background: bg || (color + "18") }}>{children}</span>; }
function LvlBadge({ level }) { return <Badge color={{ beginner: K.beg, intermediate: K.int, advanced: K.adv }[level] || K.tm}>{level}</Badge>; }
function Btn({ children, onClick, v = "primary", sm, icon, style: cs, disabled }) {
  const base = { display: "inline-flex", alignItems: "center", gap: 6, border: "none", borderRadius: 8, fontFamily: ff, fontWeight: 600, cursor: disabled ? "not-allowed" : "pointer", transition: "all 0.15s", opacity: disabled ? 0.5 : 1 };
  const vs = { primary: { background: K.ac, color: "#0a0a0c" }, secondary: { background: K.sfh, color: K.tx, border: "1px solid " + K.bd }, ghost: { background: "transparent", color: K.tm }, danger: { background: K.dgb, color: K.dg } };
  return <button onClick={onClick} disabled={disabled} style={{ ...base, ...vs[v], padding: sm ? "6px 12px" : "10px 20px", fontSize: sm ? 12 : 13, ...cs }}>{icon}{children}</button>;
}
function Inp({ label, value, onChange, type = "text", placeholder, textarea, options, style: cs }) {
  const s = { width: "100%", padding: "10px 14px", background: K.sf, border: "1px solid " + K.bd, borderRadius: 8, color: K.tx, fontSize: 13, fontFamily: ff, outline: "none", boxSizing: "border-box", ...cs };
  return (<div style={{ marginBottom: 14 }}>{label && <label style={{ display: "block", marginBottom: 6, fontSize: 12, fontWeight: 600, color: K.tm, textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</label>}{options ? <select value={value} onChange={e => onChange(e.target.value)} style={{ ...s, cursor: "pointer" }}>{options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}</select> : textarea ? <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={{ ...s, resize: "vertical", minHeight: 80 }} /> : <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={s} />}</div>);
}
function Crd({ children, style, onClick }) { return <div onClick={onClick} style={{ background: K.cd, border: "1px solid " + K.bd, borderRadius: 12, padding: 20, cursor: onClick ? "pointer" : "default", transition: "all 0.15s", ...style }}>{children}</div>; }
function Mdl({ title, onClose, children, wide }) {
  return (<div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 20 }} onClick={onClose}><div onClick={e => e.stopPropagation()} style={{ background: K.sf, border: "1px solid " + K.bd, borderRadius: 16, padding: 28, width: "100%", maxWidth: wide ? 700 : 500, maxHeight: "85vh", overflowY: "auto" }}><div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}><h3 style={{ margin: 0, fontSize: 18, color: K.tx }}>{title}</h3><button onClick={onClose} style={{ background: "none", border: "none", color: K.tm, fontSize: 22, cursor: "pointer" }}>×</button></div>{children}</div></div>);
}
function Stat({ label, value, sub, icon }) { return <Crd style={{ flex: 1, minWidth: 140 }}><div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}><div><div style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: K.tm, marginBottom: 8 }}>{label}</div><div style={{ fontSize: 28, fontWeight: 700, color: K.tx, fontFamily: mf }}>{value}</div>{sub && <div style={{ fontSize: 12, color: K.td, marginTop: 4 }}>{sub}</div>}</div><div style={{ color: K.ac, opacity: 0.6 }}>{icon}</div></div></Crd>; }

function ImportModal({ cls, setCls, prgs, setPrgs, onClose, notify, dbSave, clToDb, prToDb }) {
  const [tab, setTab] = useState("pdf");
  const [files, setFiles] = useState([]);
  const [parsing, setParsing] = useState(false);
  const [progress, setProgress] = useState("");
  const [preview, setPreview] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [jsonText, setJsonText] = useState("");

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
- weight: include unit (kg, lb) or "bodyweight" or "—" if not specified
- If the PDF contains multiple weeks with different weights/reps, use W1-2 for block1 and W3-4 for block2
- For cardio/running days, include them in the "cardio" field as array: [{"week":"W1","sessions":[{"type":"Easy Run","description":"8k Zone 2"}]}]
- For running programs, include in "running" field similarly
- If you can detect the month/block number from context, set monthNumber accordingly
- Generate unique exercise IDs like "ex_1", "ex_2", etc.`;

  const toBase64 = (file) => new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(r.result.split(",")[1]);
    r.onerror = () => rej(new Error("Failed to read file"));
    r.readAsDataURL(file);
  });

  const parsePDF = async (file) => {
    const b64 = await toBase64(file);
    const resp = await fetch("/api/parse-pdf", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pdfBase64: b64, fileName: file.name })
    });
    if (!resp.ok) {
      const err = await resp.json().catch(() => ({ error: "Network error" }));
      throw new Error(err.error || "API error " + resp.status);
    }
    const data = await resp.json();
    if (data.parseError) throw new Error("Parse error: " + data.parseError + "\nRaw: " + (data.raw || "").substring(0, 200));
    return data;
  };

  const handleFiles = (newFiles) => {
    const pdfs = Array.from(newFiles).filter(f => f.type === "application/pdf" || f.name.endsWith(".pdf"));
    if (pdfs.length === 0) { notify("No PDF files found", "warn"); return; }
    setFiles(prev => [...prev, ...pdfs]);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setDragOver(false);
    const items = e.dataTransfer.items;
    if (!items) { handleFiles(e.dataTransfer.files); return; }
    const allFiles = [];
    const readEntry = (entry) => new Promise((resolve) => {
      if (entry.isFile) {
        entry.file(f => { if (f.type === "application/pdf" || f.name.endsWith(".pdf")) allFiles.push(f); resolve(); }, () => resolve());
      } else if (entry.isDirectory) {
        const reader = entry.createReader();
        reader.readEntries(async (entries) => {
          for (const e of entries) await readEntry(e);
          resolve();
        }, () => resolve());
      } else { resolve(); }
    });
    const entries = [];
    for (let i = 0; i < items.length; i++) {
      const entry = items[i].webkitGetAsEntry && items[i].webkitGetAsEntry();
      if (entry) entries.push(entry);
    }
    if (entries.length > 0) {
      for (const entry of entries) await readEntry(entry);
      if (allFiles.length === 0) { notify("No PDF files found in folder", "warn"); return; }
      setFiles(prev => [...prev, ...allFiles]);
    } else {
      handleFiles(e.dataTransfer.files);
    }
  };

  const removeFile = (idx) => setFiles(files.filter((_, i) => i !== idx));

  const handleParse = async () => {
    if (files.length === 0) return;
    setParsing(true);
    setPreview(null);
    const results = [];
    for (let i = 0; i < files.length; i++) {
      setProgress(`Parsing ${i + 1}/${files.length}: ${files[i].name}...`);
      try {
        const parsed = await parsePDF(files[i]);
        results.push({ file: files[i].name, ...parsed, _ok: true });
      } catch (e) {
        console.error("Parse error for", files[i].name, e);
        results.push({ file: files[i].name, _ok: false, _err: e.message });
      }
    }
    setProgress("");
    setParsing(false);
    setPreview(results);
  };

  const handleImportParsed = () => {
    if (!preview) return;
    const nameToId = {};
    cls.forEach(c => { nameToId[c.name.toLowerCase()] = c.id; });
    let addedC = 0, addedP = 0;
    const newCls = [];
    const newPrs = [];

    preview.filter(r => r._ok).forEach(r => {
      const c = r.client;
      if (c && c.name) {
        const key = c.name.toLowerCase();
        if (!nameToId[key]) {
          const cl = { ...c, id: "cl_" + Date.now() + "_" + Math.random().toString(36).slice(2, 6), email: "", phone: "", monthNumber: c.monthNumber || 1 };
          nameToId[key] = cl.id;
          newCls.push(cl);
          addedC++;
        }
      }
      const p = r.program;
      if (p) {
        const cName = (r.client?.name || "").toLowerCase();
        const cId = nameToId[cName] || "unknown";
        const pr = {
          ...p,
          id: "prog_" + Date.now() + "_" + Math.random().toString(36).slice(2, 6),
          clientId: cId,
          clientName: r.client?.name || "Unknown",
          level: r.client?.level || "intermediate",
          sessionsPerWeek: r.client?.sessionsPerWeek || 3,
          sessionDuration: r.client?.sessionDuration || 60,
          trainingLocation: r.client?.trainingLocation || "gym",
          includesRunning: r.client?.includesRunning || false,
          cardioDaysPerWeek: r.client?.cardioDaysPerWeek || 0,
          createdAt: new Date().toISOString(),
          block1: p.block1 || [],
          block2: p.block2 && p.block2.length > 0 ? p.block2 : p.block1 || [],
          cardio: p.cardio || null,
          running: p.running || null,
          levelCfg: null,
          durationCfg: null
        };
        newPrs.push(pr);
        addedP++;
      }
    });

    if (newCls.length > 0) {
      newCls.forEach(c => dbSave("clients", clToDb(c)).catch(console.error));
      setCls(prev => [...prev, ...newCls]);
    }
    if (newPrs.length > 0) {
      newPrs.forEach(p => dbSave("programs", prToDb(p)).catch(console.error));
      setPrgs(prev => {
        const np = { ...prev };
        newPrs.forEach(p => { if (!np[p.clientId]) np[p.clientId] = []; np[p.clientId].push(p); });
        return np;
      });
    }
    onClose();
    notify("Imported " + addedC + " clients, " + addedP + " programs");
  };

  const handleJsonImport = () => {
    try {
      const raw = jsonText.trim();
      if (!raw) return;
      const data = JSON.parse(raw);
      let addedC = 0, addedP = 0;
      const nameToId = {};
      cls.forEach(c => { nameToId[c.name.toLowerCase()] = c.id; });
      if (data.clients && Array.isArray(data.clients)) {
        const nc = data.clients.map(c => ({ ...c, id: c.id || "cl_" + Date.now() + "_" + Math.random().toString(36).slice(2, 6), email: c.email || "", phone: c.phone || "", monthNumber: c.monthNumber || 1 }));
        nc.forEach(c => { nameToId[c.name.toLowerCase()] = c.id; dbSave("clients", clToDb(c)).catch(console.error); });
        setCls(prev => [...prev, ...nc]);
        addedC = nc.length;
      }
      if (data.programs && Array.isArray(data.programs)) {
        const np = data.programs.map(p => {
          const cId = p.clientId || nameToId[(p.clientName || "").toLowerCase()] || "unknown";
          return { ...p, id: p.id || "prog_" + Date.now() + "_" + Math.random().toString(36).slice(2, 6), clientId: cId, createdAt: p.createdAt || new Date().toISOString(), block1: p.block1 || [], block2: p.block2 || [], cardio: p.cardio || null, running: p.running || null, levelCfg: null, durationCfg: null };
        });
        np.forEach(p => dbSave("programs", prToDb(p)).catch(console.error));
        setPrgs(prev => { const ng = { ...prev }; np.forEach(p => { if (!ng[p.clientId]) ng[p.clientId] = []; ng[p.clientId].push(p); }); return ng; });
        addedP = np.length;
      }
      onClose();
      notify("Imported " + addedC + " clients, " + addedP + " programs");
    } catch (e) { notify("Invalid JSON: " + e.message, "warn"); }
  };

  const tabStyle = (active) => ({ padding: "10px 20px", border: "none", borderBottom: active ? "2px solid " + K.ac : "2px solid transparent", background: "transparent", color: active ? K.ac : K.tm, fontFamily: ff, fontSize: 13, fontWeight: 600, cursor: "pointer" });
  const dropZone = { border: "2px dashed " + (dragOver ? K.ac : K.bd), borderRadius: 12, padding: 40, textAlign: "center", background: dragOver ? K.ac + "08" : K.bg, transition: "all 0.2s", cursor: "pointer" };

  return (
    <Mdl title="Import" onClose={onClose} wide>
      <div style={{ display: "flex", borderBottom: "1px solid " + K.bd, marginBottom: 20 }}>
        <button onClick={() => setTab("pdf")} style={tabStyle(tab === "pdf")}>📄 Upload PDF</button>
        <button onClick={() => setTab("json")} style={tabStyle(tab === "json")}>📋 Paste JSON</button>
      </div>

      {tab === "pdf" && (
        <div>
          <p style={{ color: K.tm, fontSize: 13, marginBottom: 16 }}>Upload your training program PDFs. Claude AI will automatically extract exercises, sets, reps, weights, and structure.</p>

          {!preview && (
            <>
              <div style={dropZone}
                onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
              >
                <div style={{ color: K.ac, marginBottom: 8 }}>{I.upload}</div>
                <div style={{ color: K.tx, fontWeight: 600, fontSize: 14, marginBottom: 4 }}>Drop PDFs or a folder here</div>
                <div style={{ color: K.td, fontSize: 12, marginBottom: 14 }}>Or use the buttons below</div>
                <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
                  <button onClick={() => document.getElementById("pdfInput").click()} style={{ padding: "8px 16px", borderRadius: 8, border: "1px solid " + K.bd, background: K.sf, color: K.tx, fontFamily: ff, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>📄 Select Files</button>
                  <button onClick={() => document.getElementById("pdfFolderInput").click()} style={{ padding: "8px 16px", borderRadius: 8, border: "1px solid " + K.ac, background: K.ab, color: K.ac, fontFamily: ff, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>📁 Select Folder</button>
                </div>
                <input id="pdfInput" type="file" accept=".pdf" multiple style={{ display: "none" }} onChange={e => handleFiles(e.target.files)} />
                <input id="pdfFolderInput" type="file" accept=".pdf" multiple webkitdirectory="" directory="" style={{ display: "none" }} onChange={e => handleFiles(e.target.files)} />
              </div>

              {files.length > 0 && (
                <div style={{ marginTop: 16 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: K.tm, marginBottom: 8, textTransform: "uppercase" }}>{files.length} file{files.length > 1 ? "s" : ""} selected</div>
                  {files.map((f, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 12px", background: K.bg, borderRadius: 8, marginBottom: 6, border: "1px solid " + K.bd }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <span style={{ color: K.dg, fontSize: 18 }}>📄</span>
                        <div>
                          <div style={{ fontSize: 13, color: K.tx, fontWeight: 500 }}>{f.name}</div>
                          <div style={{ fontSize: 11, color: K.td }}>{(f.size / 1024).toFixed(0)} KB</div>
                        </div>
                      </div>
                      <button onClick={() => removeFile(i)} style={{ background: "none", border: "none", color: K.td, cursor: "pointer", fontSize: 16 }}>×</button>
                    </div>
                  ))}
                </div>
              )}

              {parsing && (
                <div style={{ marginTop: 16, padding: 16, background: K.ab, borderRadius: 10, border: "1px solid " + K.ac + "30" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 20, height: 20, border: "2px solid " + K.ac, borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                    <span style={{ color: K.ac, fontSize: 13, fontWeight: 600 }}>{progress}</span>
                  </div>
                  <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
                </div>
              )}

              <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 20 }}>
                <Btn v="secondary" onClick={onClose}>Cancel</Btn>
                <Btn onClick={handleParse} disabled={files.length === 0 || parsing} icon={I.bolt}>{parsing ? "Parsing..." : "Parse with AI"}</Btn>
              </div>
            </>
          )}

          {preview && (
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: K.tm, marginBottom: 12, textTransform: "uppercase" }}>Parsed Results</div>
              {preview.map((r, i) => (
                <div key={i} style={{ padding: 14, background: r._ok ? K.bg : "#2a1010", borderRadius: 10, marginBottom: 10, border: "1px solid " + (r._ok ? K.bd : K.dg + "50") }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: r._ok ? 8 : 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: r._ok ? K.tx : K.dg }}>{r.file}</div>
                    <Badge color={r._ok ? K.ok : K.dg}>{r._ok ? "✓ Parsed" : "✗ Failed"}</Badge>
                  </div>
                  {r._ok && (
                    <div style={{ fontSize: 12, color: K.td, lineHeight: 1.8 }}>
                      <div><span style={{ color: K.tm }}>Client:</span> {r.client?.name || "Unknown"} · <span style={{ color: K.tm }}>Level:</span> {r.client?.level}</div>
                      <div><span style={{ color: K.tm }}>Sessions:</span> {r.client?.sessionsPerWeek}×/wk · {r.client?.sessionDuration}min</div>
                      <div><span style={{ color: K.tm }}>Block 1:</span> {(r.program?.block1 || []).length} days · {(r.program?.block1 || []).reduce((a, d) => a + (d.exercises?.length || 0), 0)} exercises</div>
                      {(r.program?.block2 || []).length > 0 && <div><span style={{ color: K.tm }}>Block 2:</span> {r.program.block2.length} days · {r.program.block2.reduce((a, d) => a + (d.exercises?.length || 0), 0)} exercises</div>}
                      {r.program?.cardio && <div><span style={{ color: K.tm }}>Cardio:</span> Included</div>}
                      {r.program?.running && <div><span style={{ color: K.tm }}>Running:</span> Included</div>}
                    </div>
                  )}
                  {!r._ok && <div style={{ fontSize: 12, color: K.dg, marginTop: 6 }}>{r._err}</div>}
                </div>
              ))}
              <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 20 }}>
                <Btn v="secondary" onClick={() => { setPreview(null); setFiles([]); }}>Back</Btn>
                <Btn onClick={handleImportParsed} disabled={!preview.some(r => r._ok)} icon={I.check}>Import {preview.filter(r => r._ok).length} Program{preview.filter(r => r._ok).length !== 1 ? "s" : ""}</Btn>
              </div>
            </div>
          )}
        </div>
      )}

      {tab === "json" && (
        <div>
          <p style={{ color: K.tm, fontSize: 13, marginBottom: 12 }}>Paste JSON data to import clients and/or programs:</p>
          <textarea value={jsonText} onChange={e => setJsonText(e.target.value)} placeholder='{"clients": [...], "programs": [...]}' style={{ width: "100%", minHeight: 220, padding: 14, background: K.bg, border: "1px solid " + K.bd, borderRadius: 8, color: K.tx, fontSize: 12, fontFamily: mf, resize: "vertical", outline: "none", boxSizing: "border-box" }} />
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 16 }}>
            <Btn v="secondary" onClick={onClose}>Cancel</Btn>
            <Btn onClick={handleJsonImport} disabled={!jsonText.trim()}>Import JSON</Btn>
          </div>
        </div>
      )}
    </Mdl>
  );
}

// ─── HISTORY HELPERS ───
function getLatest(prgs, cId) { const a = prgs[cId]; return a && a.length > 0 ? a[a.length - 1] : null; }
function getAll(prgs, cId) { return prgs[cId] || []; }
function addProg(prgs, cId, p) { const a = prgs[cId] ? [...prgs[cId]] : []; a.push(p); return { ...prgs, [cId]: a }; }
function updProg(prgs, cId, p) { return { ...prgs, [cId]: (prgs[cId] || []).map(x => x.id === p.id ? p : x) }; }

// ─── PDF HISTORICAL PROGRAMS ───
const ex = (id, name, section, sets, reps, rest, weight, rpe, notes) => ({ id, name, category: section === "Warm-Up" ? "mobility" : section === "Core" ? "core" : section === "Finisher" ? "hiit" : "compound", section, sets: sets || "", reps: reps || "", rest: parseInt(rest) || 0, weight: weight || "—", rpe: rpe || "", notes: notes || "" });

const REDINI_B1 = {
  id: "prog_r1", clientId: "cl5", clientName: "Redini", level: "intermediate", monthNumber: 1, sessionsPerWeek: 3, sessionDuration: 75, trainingLocation: "gym", createdAt: "2025-09-01T10:00:00Z",
  block1: [
    { dayLabel: "Day 1", focus: "Leg Press + Spinte", dayType: "Q", exercises: [
      ex("cps9","Leg Press 45°","Strength",4,"10","120","90–110kg","",""),
      ex("cps3","Bench Press","Strength",3,"6","90","20–22.5kg","","lavora su tecnica"),
      ex("aps8","Reverse Lunge","Strength",3,"10/10","90","2×16kg","","deve essere molto pesante"),
      ex("aph7","Leg Curl","Strength",3,"12","75","25-27.5kg","",""),
      ex("aps13","Arnold Press","Strength",3,"10","90","6–8kg","",""),
    ]},
    { dayLabel: "Day 2", focus: "Deadlift + Tirate + Pull-Up", dayType: "H", exercises: [
      ex("cph1","Deadlift","Strength",4,"5","120","50–55kg","",""),
      ex("cph3","Barbell Row","Strength",4,"8","120","25-30kg","","tirala di brutto no matter what"),
      ex("aph8","Lat Machine (Neutral)","Strength",3,"6 - ecc 2s","120","40kg","",""),
      ex("cph4","Pull-Up (Banded)","Strength",3,"3","120","banded","",""),
      ex("aph1","Hip Thrust","Strength",3,"10","120","65–70kg","","sfondati il culo La"),
    ]},
    { dayLabel: "Day 3", focus: "Glute Focus + Accessori", dayType: "G", exercises: [
      ex("aph1","Hip Thrust","Strength",4,"8","120","70-75kg","",""),
      ex("aps1","Bulgarian Split Squat","Strength",3,"8/8","120","2×16kg","",""),
      ex("aph15","Abductor Machine","Strength",3,"20","45","35–45kg","",""),
      ex("aps17","Dumbbell Incline Press 90°","Strength",3,"10","120","2×8kg","",""),
      ex("aps16","Cable Triceps","Strength",3,"12","75","10–12kg","",""),
      ex("co8","Hollow Hold + V-up","Core",3,"25\" each","60","BW","",""),
    ]},
  ],
  block2: [
    { dayLabel: "Day 1", focus: "Leg Press + Spinte", dayType: "Q", exercises: [
      ex("cps9","Leg Press 45°","Strength",4,"8","120","90–110kg","",""),
      ex("cps3","Bench Press","Strength",4,"6","90","20–22.5kg","",""),
      ex("aps8","Reverse Lunge","Strength",3,"12/12","90","2×16kg","",""),
      ex("aph7","Leg Curl","Strength",3,"12","75","25-27.5kg","",""),
      ex("aps13","Arnold Press","Strength",4,"10","90","6–8kg","",""),
    ]},
    { dayLabel: "Day 2", focus: "Deadlift + Tirate + Pull-Up", dayType: "H", exercises: [
      ex("cph1","Deadlift","Strength",4,"5","120","50–55kg","",""),
      ex("cph3","Barbell Row","Strength",4,"8","120","25-30kg","",""),
      ex("aph8","Lat Machine (Neutral)","Strength",3,"7","120","40kg","",""),
      ex("cph4","Pull-Up (Banded)","Strength",4,"3","120","banded","",""),
      ex("aph1","Hip Thrust","Strength",4,"10","120","65–70kg","",""),
    ]},
    { dayLabel: "Day 3", focus: "Glute Focus + Accessori", dayType: "G", exercises: [
      ex("aph1","Hip Thrust","Strength",4,"8","120","70-75kg","",""),
      ex("aps1","Bulgarian Split Squat","Strength",3,"8/8","120","2×16kg","",""),
      ex("aph15","Abductor Machine","Strength",3,"20","45","35–45kg","",""),
      ex("aps17","Dumbbell Incline Press 90°","Strength",4,"5+5 rec 15s","120","2×8kg W3-4 9kg","","piangi"),
      ex("aps16","Cable Triceps","Strength",3,"12","75","10–12kg","",""),
      ex("co8","Hollow Hold + V-up","Core",3,"30\" each","60","BW","",""),
    ]},
  ],
  includesRunning: false, cardioDaysPerWeek: 0, cardio: null, running: null,
  levelCfg: LEVEL_CONFIG.intermediate.month1, durationCfg: DURATION_CONFIG[75],
};

const REDINI_B2 = {
  id: "prog_r2", clientId: "cl5", clientName: "Redini", level: "intermediate", monthNumber: 2, sessionsPerWeek: 3, sessionDuration: 75, trainingLocation: "gym", createdAt: "2025-10-01T10:00:00Z",
  block1: [
    { dayLabel: "Day 1", focus: "Leg Press + Spinte (Intensità)", dayType: "Q", exercises: [
      ex("cps9","Leg Press 45°","Strength",4,"10","120","110kg","",""),
      ex("cps3","Bench Press","Strength",3,"8","90","20-25kg","",""),
      ex("aps2","Walking Lunge","Strength",3,"10/10","90","2×14kg","",""),
      ex("aps21","Shoulder Press DB","Strength",3,"8","120","10kg","",""),
      ex("aph7","Leg Curl","Strength",3,"10+5 rec 10s","90","27.5kg","",""),
    ]},
    { dayLabel: "Day 2", focus: "Deadlift + Tirate + Pull-Up Adv.", dayType: "H", exercises: [
      ex("cph1","Deadlift","Strength","2","5-4-3 (↑kg)","150","50-52.5-55kg","","W5-6"),
      ex("cph3","Barbell Row","Strength",3,"10","90","30kg","",""),
      ex("cph4","Pull-Up (Assisted)","Strength",3,"5","120","assist","",""),
      ex("aph8","Lat Machine","Strength",2,"8","120","40kg","",""),
      ex("aph1","Hip Thrust","Strength",3,"10","120","67.5–72.5kg","","ihih"),
    ]},
    { dayLabel: "Day 3", focus: "Glute Max + Medius", dayType: "G", exercises: [
      ex("aph1","Hip Thrust","Strength",5,"5","120","80-75kg","",""),
      ex("cph9","RDL Manubri","Strength",4,"10","120","2×16–20kg","",""),
      ex("aph16","Cable Kickback","Strength",3,"12","75","10kg","",""),
      ex("aps17","Dumbbell Incline Press 90°","Strength",4,"8","120","2×9-10kg","",""),
      ex("co15","Plank Reach + V-up","Core",3,"10/10 each","60","BW","",""),
    ]},
  ],
  block2: [
    { dayLabel: "Day 1", focus: "Leg Press + Spinte (Intensità)", dayType: "Q", exercises: [
      ex("cps9","Leg Press 45°","Strength",4,"10 ecc 3s","120","110kg","",""),
      ex("cps3","Bench Press","Strength",4,"5","90","20-25kg","",""),
      ex("aps2","Walking Lunge","Strength",3,"12/12","90","2×14kg","",""),
      ex("aps21","Shoulder Press DB","Strength",3,"8","120","10kg","",""),
      ex("aph7","Leg Curl","Strength",3,"10+8 rec 10s","90","27.5kg","",""),
    ]},
    { dayLabel: "Day 2", focus: "Deadlift + Tirate + Pull-Up Adv.", dayType: "H", exercises: [
      ex("cph1","Deadlift","Strength",4,"4","150","55kg","","W6-7"),
      ex("cph3","Barbell Row","Strength",4,"10","90","30kg","",""),
      ex("cph4","Pull-Up","Strength",5,"2","120","banda leggera","",""),
      ex("aph8","Lat Machine","Strength",2,"8 ecc 3s","120","40kg","",""),
      ex("aph1","Hip Thrust","Strength",4,"10","120","67.5–72.5kg","","ihih"),
    ]},
    { dayLabel: "Day 3", focus: "Glute Max + Medius", dayType: "G", exercises: [
      ex("aph1","Hip Thrust","Strength",5,"8","120","80-75kg","",""),
      ex("cph9","RDL Manubri","Strength",4,"10","120","2×16–20kg","",""),
      ex("aph16","Cable Kickback","Strength",3,"12","75","10kg","",""),
      ex("aps17","Dumbbell Incline Press 90°","Strength",4,"10","120","2×9-10kg","",""),
      ex("co15","Plank Reach + V-up","Core",3,"10/10 each","60","BW","",""),
    ]},
  ],
  includesRunning: false, cardioDaysPerWeek: 0, cardio: null, running: null,
  levelCfg: LEVEL_CONFIG.intermediate.following, durationCfg: DURATION_CONFIG[75],
};

const REDINI_B3 = {
  id: "prog_r3", clientId: "cl5", clientName: "Redini", level: "intermediate", monthNumber: 3, sessionsPerWeek: 3, sessionDuration: 75, trainingLocation: "gym", createdAt: "2025-11-01T10:00:00Z",
  block1: [
    { dayLabel: "Day 1", focus: "Leg Press + Spinte (Intensità)", dayType: "Q", exercises: [
      ex("cps9","Leg Press 45°","Strength",3,"8","120","120kg","","tienimi aggiornata su sensazione peso"),
      ex("cps3","Bench Press","Strength",3,"6","90","25kg","",""),
      ex("aps1","Bulgarian Split Squat","Strength",3,"8/side","90","2×12kg","","ihih"),
      ex("aps21","Shoulder Press DB","Strength",4,"8","120","10kg","","oh spingi"),
      ex("aps3","Lateral Raises + Knee Raises","Strength",3,"12+8","75","2×6kg","",""),
    ]},
    { dayLabel: "Day 2", focus: "Deadlift + Tirate + Pull-Up Adv.", dayType: "H", exercises: [
      ex("cph1","Deadlift","Strength",4,"4 (3s ecc + 3s conc)","150","52.5kg","","W9-10"),
      ex("cph4","Pull-Up","Strength",3,"3","120","—","","fammi sap come vanno"),
      ex("aph8","Lat Machine","Strength",2,"10","120","40kg","",""),
      ex("cph3","Barbell Row","Strength",3,"10","90","35kg","",""),
      ex("aph1","Hip Thrust","Strength",3,"8","120","75kg","","ihih"),
    ]},
    { dayLabel: "Day 3", focus: "Glute Max + Medius", dayType: "G", exercises: [
      ex("aph1","Hip Thrust","Strength",3,"10","90","70kg","",""),
      ex("cph9","RDL Manubri","Strength",4,"10","120","2×16–20kg","",""),
      ex("aph7","Leg Curls","Strength",3,"12","75","10kg","",""),
      ex("aps17","Dumbbell Incline Press 90°","Strength",4,"8","120","2×9-10kg","",""),
      ex("co8","Hollow Hold + V-up","Core",3,"30s each","60","BW","",""),
    ]},
  ],
  block2: [
    { dayLabel: "Day 1", focus: "Leg Press + Spinte (Intensità)", dayType: "Q", exercises: [
      ex("cps9","Leg Press 45°","Strength",4,"8","120","120kg","",""),
      ex("cps3","Bench Press","Strength",4,"6","90","25kg","",""),
      ex("aps1","Bulgarian Split Squat","Strength",3,"10/side","90","2×12kg","",""),
      ex("aps21","Shoulder Press DB","Strength",4,"6+6 rec 15s","120","10kg","",""),
      ex("aps3","Lateral Raises + Knee Raises","Strength",4,"12+10","75","2×6kg","",""),
    ]},
    { dayLabel: "Day 2", focus: "Deadlift + Tirate + Pull-Up Adv.", dayType: "H", exercises: [
      ex("cph1","Deadlift","Strength",4,"6","150","55kg","","W11-12"),
      ex("cph4","Pull-Up","Strength",4,"3","120","—","",""),
      ex("aph8","Lat Machine","Strength",2,"10","120","40kg","",""),
      ex("cph3","Barbell Row","Strength",4,"10","90","35kg","",""),
      ex("aph1","Hip Thrust","Strength",4,"8","120","75kg","","ihih"),
    ]},
    { dayLabel: "Day 3", focus: "Glute Max + Medius", dayType: "G", exercises: [
      ex("aph1","Hip Thrust","Strength",4,"10","90","70kg","",""),
      ex("cph9","RDL Manubri","Strength",4,"10","120","2×16–20kg","",""),
      ex("aph7","Leg Curls","Strength",3,"12","75","10kg","",""),
      ex("aps17","Dumbbell Incline Press 90°","Strength",4,"10","120","2×9-10kg","",""),
      ex("co8","Hollow Hold + V-up","Core",4,"30s each","60","BW","",""),
    ]},
  ],
  includesRunning: false, cardioDaysPerWeek: 0, cardio: null, running: null,
  levelCfg: LEVEL_CONFIG.intermediate.following, durationCfg: DURATION_CONFIG[75],
};

const mkCardio = (label, type, warmup, work, cooldown, rpe) => ({ dayLabel: label, type, warmup, work, cooldown, rpe });

const BENVENUTI_B1 = {
  id: "prog_b1", clientId: "cl6", clientName: "Benvenuti", level: "intermediate", monthNumber: 1, sessionsPerWeek: 3, sessionDuration: 60, trainingLocation: "home", createdAt: "2025-10-01T10:00:00Z",
  block1: [
    { dayLabel: "Day 1", focus: "Home Gym (Lower Focus)", dayType: "A", exercises: [
      ex("cps5","Goblet Squat (SS w/ 1-Arm Row)","Strength",3,"10+12","90","12kg / RIR 2","","Ecc squat 3s"),
      ex("cps10","DB Floor Press","Strength",3,"10","90","2×8kg","2",""),
      ex("cph9","Romanian Deadlift","Strength",3,"12","90","2×10kg","2","Inizia minimo"),
      ex("aph22","DB Hip Thrust","Strength",3,"12","60","20kg + elastico","1","Pausa 2s top glutei"),
      ex("co15","Plank Reach + V-up","Core",3,"12+10","45","BW","",""),
    ]},
    { dayLabel: "Day 2", focus: "Home Gym (Upper Focus)", dayType: "B", exercises: [
      ex("aps19","Push-Up Negative (Ecc 3s)","Strength",3,"5","90","BW","1","senza ginocchia"),
      ex("aps20","Half Kneeling Press","Strength",3,"10","90","1×7kg","2",""),
      ex("aph19","Hamstring Bridge + Wallsit","Strength",3,"10 + 30s","60","8kg","",""),
      ex("aps3","Lateral Raise + Bicep Curl","Strength",3,"10+12","75","2×5kg","2-3",""),
      ex("aps24","Dip su Sedia","Strength",3,"12","60","BW","",""),
      ex("h15","AMRAP 5': Up&Down + Rev Crunch + Push Press","Finisher",1,"6+8+10","0","2×7kg","","As many rounds as possible baby"),
    ]},
  ],
  block2: [
    { dayLabel: "Day 1", focus: "Home Gym (Lower Focus)", dayType: "A", exercises: [
      ex("cps5","Goblet Squat (SS w/ 1-Arm Row)","Strength",4,"10+12 → 4×8+10","90","12-14kg / RIR 2","","Ecc squat 3s"),
      ex("cps10","DB Floor Press","Strength",4,"10 → 4×8","90","2×8kg → ↑kg","2","W4: aumenta kg"),
      ex("cph9","Romanian Deadlift","Strength",3,"10 → 4×10","90","2×12kg","2",""),
      ex("aph22","DB Hip Thrust","Strength",4,"12 → 4×15","60","20kg + elastico","1","Pausa 2s top"),
      ex("co15","Plank Reach + V-up","Core",3,"14+12","45","BW","","W4: 4 round"),
    ]},
    { dayLabel: "Day 2", focus: "Home Gym (Upper Focus)", dayType: "B", exercises: [
      ex("aps19","Push-Up Negative (Ecc 3s)","Strength",4,"5","90","BW","1",""),
      ex("aps20","Half Kneeling Press","Strength",4,"10 ecc 3s → 4×12","90","1×7kg","2",""),
      ex("aph20","SL Hamstring Bridge + Wallsit","Strength",4,"10+30s → 4×12+40s","60","10kg","",""),
      ex("aps3","Lateral Raise + Bicep Curl","Strength",4,"10+12 → 4×12+12","75","2×5kg","2-3",""),
      ex("aps24","Dip su Sedia","Strength",3,"15","75","BW","",""),
      ex("h1","AMRAP 5-6': Burpees + Squat Jumps + Push Press","Finisher",1,"5+10+10","0","2×7kg","",""),
    ]},
  ],
  includesRunning: false, cardioDaysPerWeek: 3,
  cardio: {
    block1: [
      mkCardio("Cardio 1","Easy Run (Progressive)","5' easy run + mobilità","5km progressivi: 1lento + 2medio + 2sostenuto","5' jogging + stretching","7"),
      mkCardio("Cardio 2","Interval Run (Ripetute)","5' easy run + mobilità","10×500m, 1'30\" camminata, ritmo sostenuto","5' jogging + stretching","8-9"),
    ],
    block2: [
      mkCardio("Cardio 1","Easy Run (Progressive)","5' + mobilità","6km progressivi: 1lento + 3medio + 2sostenuto","5' jogging + stretching","7-8"),
      mkCardio("Cardio 2","Interval Run (Ripetute)","5' easy run + mobilità","12×500m, 1'30\" camminata, ritmo sostenuto","5' jogging + stretching","8-9"),
    ],
  },
  running: null, levelCfg: LEVEL_CONFIG.intermediate.month1, durationCfg: DURATION_CONFIG[60],
};

const BENVENUTI_B2 = {
  id: "prog_b2", clientId: "cl6", clientName: "Benvenuti", level: "intermediate", monthNumber: 2, sessionsPerWeek: 3, sessionDuration: 60, trainingLocation: "home", createdAt: "2025-11-01T10:00:00Z",
  block1: [
    { dayLabel: "Day 1", focus: "Home Gym (Lower)", dayType: "A", exercises: [
      ex("cps5","Goblet Squat (SS w/ Side Plank Clamshell)","Strength",3,"8+12/side","60","1×16kg","3",""),
      ex("aps18","Goblet Split Squat","Strength",3,"10/gamba","90","12kg","2",""),
      ex("cps10","DB Floor Press","Strength",3,"10","90","2×10kg","2",""),
      ex("aps19","Push-Up Negative","Strength",5,"5","75","BW","1","No ginocchia"),
      ex("co14","Plank Drag Through + Plank Commando","Core",3,"10+10","60","1×10kg","","Alternati"),
    ]},
    { dayLabel: "Day 2", focus: "Home Gym (Hinge/Upper)", dayType: "B", exercises: [
      ex("cph9","Romanian Deadlift","Strength",3,"12","90","2×14kg","2","Ecc 3s"),
      ex("aph18","DB SL Hip Thrust","Strength",3,"12/gamba","60","14kg","1","Pausa 2s top"),
      ex("aps21","Seated Press (Chair)","Strength",3,"8","90","2×8kg","2",""),
      ex("aph20","SL Hamstring Bridge + Lateral Raise","Strength",4,"15+30s","60","2×5kg","",""),
      ex("co1","Core: Plank Accumulo","Core",1,"4' plank","0","BW","",""),
    ]},
    { dayLabel: "Day 3", focus: "Home Gym (Pull/Legs)", dayType: "F", exercises: [
      ex("h16","Circuito Attivazione: Wormwalk + Up&Down + Squat Jump","Warm-Up",3,"4+6+8","0","BW","","paxxerella"),
      ex("cph10","1-Arm Row","Strength",3,"12","90","14kg","1","Pausa 2s top"),
      ex("aps25","SL Goblet Squat (Chair)","Strength",3,"10/gamba","90","1×10kg","2",""),
      ex("aps24","Dip Sedia + Bicep Curls (SS)","Strength",3,"15+10","60","2×6kg","1-2",""),
      ex("h1","Circuito: 2-4-6-8… Burpees + V-up","Finisher",1,"ladder","0","BW","","Cap Time 5'"),
    ]},
  ],
  block2: [
    { dayLabel: "Day 1", focus: "Home Gym (Lower)", dayType: "A", exercises: [
      ex("cps5","Goblet Squat (SS w/ Side Plank Clamshell)","Strength",3,"10+12/side → 3×12+12/side","60","1×16kg","3",""),
      ex("aps18","Goblet Split Squat","Strength",4,"10/gamba → 4×12/gamba","90","12kg","2",""),
      ex("cps10","DB Floor Press","Strength",4,"8","90","2×12kg","2",""),
      ex("aps22","Push-Up (ROM ridotto)","Strength",4,"5 → 4×6","75","BW","1","Cuscino sotto petto"),
      ex("co14","Plank Drag Through + Plank Commando","Core",3,"12+12","60","1×10kg","","Alternati"),
    ]},
    { dayLabel: "Day 2", focus: "Home Gym (Hinge/Upper)", dayType: "B", exercises: [
      ex("cph9","Romanian Deadlift","Strength","4→3","15 → 3×12","90","2×14kg → 2×16kg","2",""),
      ex("aph18","DB SL Hip Thrust","Strength",3,"15/gamba → 4×15","60","14-16kg","1","Pausa 2s top"),
      ex("aps21","Seated Press (Chair)","Strength",3,"10 → 4×10","90","2×8kg","2",""),
      ex("aph21","Hamstring Sliding Curls + Lateral Raise","Strength",4,"10+8","60","2×6kg","",""),
      ex("co1","Core: Plank Accumulo","Core",1,"6' plank → 6' high plank","0","BW","",""),
    ]},
    { dayLabel: "Day 3", focus: "Home Gym (Pull/Legs)", dayType: "F", exercises: [
      ex("h16","Circuito Attivazione: Wormwalk + Up&Down + Squat Jump","Warm-Up",3,"4+6+8","0","BW","","paxxerella"),
      ex("cph10","1-Arm Row","Strength",4,"12 → 4×8 ↑kg","90","14-16kg","1",""),
      ex("aps25","SL Goblet Squat (Chair)","Strength",3,"10/gamba → 3×12/gamba","90","1×12kg","2",""),
      ex("aps24","Dip Sedia + Bicep Curls (SS)","Strength",3,"15+12 → 4×15+12","60","2×6kg","1-2",""),
      ex("h8","Circuito: 3-6-9… Thruster + Deadlift","Finisher",1,"ladder","0","2×8kg","","Cap Time 5'"),
    ]},
  ],
  includesRunning: false, cardioDaysPerWeek: 3,
  cardio: {
    block1: [
      mkCardio("Cardio 1","Interval Run (800m)","5' easy run + mobilità","6×800m, rec 2' ferma, spingi RPE 8-9","5' jogging + stretching","8-9"),
      mkCardio("Cardio 2","Fartlek","5' easy run + mobilità","2' sostenuti + 2' lenti × 28'","5' jogging + stretching","7-8"),
      mkCardio("Cardio 3","Z2 Easy Run","5'","7k easy peasy — conversational pace","5'","5"),
    ],
    block2: [
      mkCardio("Cardio 1","Interval Run (600m)","5' easy run + mobilità","8×600m, rec 2' ferma, più veloce degli 800m RPE 8-9","5' jogging + stretching","8-9"),
      mkCardio("Cardio 2","Fartlek","5' easy run + mobilità","2' sostenuti + 1' veloce + 2' lenti × 30'","5' jogging + stretching","7-8"),
      mkCardio("Cardio 3","Z2 Easy Run","5'","8k easy","5' jogging + stretching","5"),
    ],
  },
  running: null, levelCfg: LEVEL_CONFIG.intermediate.following, durationCfg: DURATION_CONFIG[60],
};

const BENVENUTI_B3 = {
  id: "prog_b3", clientId: "cl6", clientName: "Benvenuti", level: "intermediate", monthNumber: 3, sessionsPerWeek: 3, sessionDuration: 60, trainingLocation: "home", createdAt: "2025-12-01T10:00:00Z",
  block1: [
    { dayLabel: "Day 1", focus: "Home Gym (Lower)", dayType: "A", exercises: [
      ex("cps5","Circuito: Goblet Squat + Plank Reach + Dead Bug","Warm-Up",3,"30s each","60","1×16kg","",""),
      ex("aps8","Reverse Lunges","Strength",4,"8/gamba","120","2×8kg","2",""),
      ex("aps23","DB Bridged Floor Press","Strength",4,"8","90","2×12kg","2","su il culooo"),
      ex("aps22","Push-Up Hand Release","Strength",3,"8","90","BW","1","No ginocchia — mani si staccano"),
      ex("aps24","Dip Sedia + Plank Row (SS)","Strength",3,"12 ecc 3s + 10/side","60","1×10kg","",""),
    ]},
    { dayLabel: "Day 2", focus: "Home Gym (Hinge/Upper)", dayType: "B", exercises: [
      ex("aph17","RDL B-Stance DB","Strength",3,"10/gamba","90","2×10kg","2","Ecc 3s"),
      ex("aph22","Hip Thrust + Band","Strength",3,"15","60","2×10kg","1","Pausa 2s top"),
      ex("aps21","Seated Press (Chair)","Strength",4,"10","120","2×8kg","2",""),
      ex("aph25","EMOM 8': Bicep Curls + Tricep Ext","Finisher",1,"8+12","0","2×6kg","",""),
      ex("co1","Core: Plank Accumulo","Core",1,"6' plank","0","BW","",""),
    ]},
    { dayLabel: "Day 3", focus: "Home Gym (Pull/Legs)", dayType: "F", exercises: [
      ex("h15","Circuito Attivazione: Plank Commando + Up&Down + Air Squat","Warm-Up",3,"4+8+12","0","BW","","paxxerella"),
      ex("cph10","1-Arm Row","Strength",4,"8","90","16kg","1","Pausa 2s top"),
      ex("aps25","SL Goblet Squat (Chair)","Strength",4,"10/gamba","90","1×12kg","2",""),
      ex("aps3","Lateral Raises + Frontal Raises (SS)","Strength",3,"12+10","60","2×6kg","1-2",""),
      ex("h1","3RFT: Rev Lunges + Burpees + Squat Jumps","Finisher",3,"12+6+12","0","2×6kg per affondi","","Circuito della muerte"),
    ]},
  ],
  block2: [
    { dayLabel: "Day 1", focus: "Home Gym (Lower)", dayType: "A", exercises: [
      ex("cps5","Circuito: Goblet Squat + Plank Reach + Dead Bug","Warm-Up",3,"40-45s each","60","1×16kg","",""),
      ex("aps8","Reverse Lunges","Strength",4,"10/gamba","120","2×8kg","2",""),
      ex("aps23","DB Bridged Floor Press + Handstand Walk","Strength",4,"8+3 → 4×10+4","90","2×12kg","2","se non riesci hw, facciamo su sedia"),
      ex("aps22","Push-Up Hand (ROM ridotto)","Strength",3,"8","90","BW","1","No ginocchia — libro sottile"),
      ex("aps24","Dip Sedia gambe tese + Plank Row (SS)","Strength",4,"10+12/side","60","1×10kg","",""),
    ]},
    { dayLabel: "Day 2", focus: "Home Gym (Hinge/Upper)", dayType: "B", exercises: [
      ex("aph17","RDL B-Stance DB","Strength",3,"15 → 3×12","90","2×10kg → 2×12kg","2",""),
      ex("aph22","Hip Thrust + Band","Strength",4,"15","60","2×12kg","1","Pausa 2s top"),
      ex("aps21","Seated Press (Chair)","Strength",4,"10 ecc 3s","120","2×8kg","2",""),
      ex("aph25","EMOM 8': Bicep Curls + Tricep Ext","Finisher",1,"6+10","0","2×8kg","",""),
      ex("co1","Core: Plank Accumulo","Core",1,"7' plank","0","BW","",""),
    ]},
    { dayLabel: "Day 3", focus: "Home Gym (Pull/Legs)", dayType: "F", exercises: [
      ex("h15","Circuito Attivazione: Plank Commando + Up&Down + Squat Jump","Warm-Up",3,"6+6+6","0","BW","","paxxerella"),
      ex("cph10","1-Arm Row","Strength",3,"10 → 3×12","90","16kg","1",""),
      ex("aps25","SL Goblet Squat (ripiano più basso)","Strength",4,"10/gamba → 4×12","90","1×12kg","2","Su divano?"),
      ex("aps3","Lateral Raises + Frontal Raises (SS)","Strength",3,"15+12","60","2×6kg","1-2",""),
      ex("h10","30s on/15s off × 3: Mt Climbers + Split Jumps + Plank Commando + Burpees","Finisher",3,"30s on/15s off","0","BW","","Circuito della muerte"),
    ]},
  ],
  includesRunning: false, cardioDaysPerWeek: 3,
  cardio: {
    block1: [
      mkCardio("Cardio 1","Fartlek (Easy)","5' - tanta mobilità","1' moderato + 1' easy × 20' RPE 6-7","5' - stretching","6-7"),
      mkCardio("Cardio 2","Progressive 800m","5' - tanta mobilità","4×800m easy + 200m rest camminando","5' - stretching","6-7"),
      mkCardio("Cardio 3","Z2 Bike","—","45' eaasy — non ripartiamo abbomba con la corsa","—","5"),
    ],
    block2: [
      mkCardio("Cardio 1","Fartlek (Build)","5' camminata + mobilità","1' moderato + 1' easy × 24'","5' - stretching","6-7"),
      mkCardio("Cardio 2","Progressive Run","5' easy run + mobilità","20' progressivi — parti piano e aumenta","5' jogging + stretching","7-8"),
      mkCardio("Cardio 3","Z2 Bike","—","45' eaasy — conversational pace","—","5"),
    ],
  },
  running: null, levelCfg: LEVEL_CONFIG.intermediate.following, durationCfg: DURATION_CONFIG[60],
};

// ─── CARDONI (3 blocks) ───
const CARDONI_B1={id:"prog_cd1",clientId:"cl7",clientName:"Cardoni",level:"intermediate",monthNumber:1,sessionsPerWeek:4,sessionDuration:75,trainingLocation:"gym",includesRunning:true,cardioDaysPerWeek:1,createdAt:"2025-07-01T10:00:00Z",
block1:[{dayLabel:"Day 1",focus:"Lower Body + Core",dayType:"Q",exercises:[ex("cd1","Back Squat","Strength",3,"8","120","RPE 7","","segna carico"),ex("cd2","Affondi Dietro","Strength",3,"8/gamba","90","2x12.5kg","","RPE 8"),ex("cd3","Hip Thrust Bilanciere","Strength",4,"8","90","80kg","","RPE 9"),ex("cd4","Leg Curls su Fitball","Strength",3,"12","75","BW","","senti bene femorale"),ex("cd5","Hollow Body Hold + Plank Fitball","Core",3,"30'' each","60","BW","","")]},{dayLabel:"Day 2",focus:"Upper Body + Conditioning",dayType:"A",exercises:[ex("cd6","Pull-Up Negativi","Strength",3,"3","120","BW","","Solo discesa"),ex("cd7","Incline Dumbbell Press 30°","Strength",3,"8","90","2x9kg","","RPE 8"),ex("cd8","Arnold Press","Strength",3,"8","90","2x6kg","",""),ex("cd9","1 Arm Row","Strength",3,"12","90","1x12.5kg","",""),ex("cd10","Bicipiti + alzate laterali","Strength",3,"8+10","90","2x6kg + 2x5kg","","")]},{dayLabel:"Day 3",focus:"Full Body / Posterior Chain",dayType:"H",exercises:[ex("cd11","Deadlift Trapbar","Strength",3,"8","120","RPE 7","",""),ex("cd12","RDL manubri","Strength",3,"12","90","2x10kg","",""),ex("cd13","Pushup Negativi","Strength",3,"5","90","BW","","solo discesa"),ex("cd14","SS: Australian Pullup + Box jump 50cm","Strength",3,"6+8","60","BW","",""),ex("cd15","Dead Bug + Plank Shoulder Taps","Core",3,"30'' each","60","BW","","")]}],
block2:[{dayLabel:"Day 1",focus:"Lower Body + Core",dayType:"Q",exercises:[ex("cd16","Back Squat","Strength",4,"6","120","RPE 7","",""),ex("cd17","Affondi Dietro","Strength",4,"8","90","","","RPE8"),ex("cd18","Hip Thrust cluster 10s","Strength",3,"5+5+5","90","same","",""),ex("cd19","Leg Curls","Strength",3,"15","75","same","",""),ex("cd20","Hollow Hold + Side Plank","Core",3,"30'' each","60","BW","","")]},{dayLabel:"Day 2",focus:"Upper Body + Conditioning",dayType:"A",exercises:[ex("cd21","Pull-Up Negativi","Strength",4,"3","120","BW","",""),ex("cd22","Incline Dumbbell Press 30°","Strength",4,"8","90","2x9-10kg","",""),ex("cd23","Shoulder Press cluster","Strength",3,"4+4+4","120","2x8kg","",""),ex("cd24","1 Arm Row ecc 2s","Strength",4,"10","90","1x12.5kg","",""),ex("cd25","WOD EMOM 9'","Finisher",1,"15WB+8Burp+7Row","0","","","")]},{dayLabel:"Day 3",focus:"Full Body / Posterior",dayType:"H",exercises:[ex("cd26","Deadlift Trapbar","Strength",4,"6","120","RPE 7","",""),ex("cd27","RDL manubri","Strength",4,"10","90","2x12.5kg","",""),ex("cd28","Pushup Negativi","Strength",3,"6","90","BW","",""),ex("cd29","SS: Australian Pullup + Box jump","Strength",3,"8+8","60","BW","",""),ex("cd30","Russian Twist + Side Plank","Core",3,"30'' each","30","1x16kg","","")]}],
cardio:{block1:[mkCardio("Day 4","Intervals","10'","6x600m + 1' walk RPE 7","5'","7")],block2:[mkCardio("Day 4","Fartlek","5'","30': 1' sostenuto + 2' lento","5'","7")]},running:null,levelCfg:null,durationCfg:null};

const CARDONI_B2={id:"prog_cd2",clientId:"cl7",clientName:"Cardoni",level:"intermediate",monthNumber:2,sessionsPerWeek:4,sessionDuration:75,trainingLocation:"gym",includesRunning:true,cardioDaysPerWeek:1,createdAt:"2025-08-01T10:00:00Z",
block1:[{dayLabel:"Day 1",focus:"Lower Body + Core",dayType:"Q",exercises:[ex("cd31","Back Squat ecc 3s","Strength",4,"4","120","45kg","",""),ex("cd32","Affondi Dietro","Strength",4,"10/gamba","90","2x12.5kg","",""),ex("cd33","Hip Thrust 2'' hold","Strength",4,"6","90","85kg","",""),ex("cd34","Ponte femorali 1 gamba","Strength",3,"12/gamba","75","BW","",""),ex("cd35","Hollow Body Rocks + Side Plank","Core",3,"30'' each","60","BW","","")]},{dayLabel:"Day 2",focus:"Upper Body + Conditioning",dayType:"A",exercises:[ex("cd36","Pull-Up Negativi","Strength",4,"4","120","BW","","discesa 4-5''"),ex("cd37","Incline DB Press 30°","Strength",4,"8","90","2x10kg","",""),ex("cd38","Shoulder Press Panca","Strength",4,"8","90","2x8kg","",""),ex("cd39","1 Arm Row pausa 2''","Strength",4,"10","90","12.5kg","",""),ex("cd40","AMRAP 7': 8KPU+12AS+10SU","Finisher",1,"AMRAP 7'","0","","","")]},{dayLabel:"Day 3",focus:"Full Body / Posterior",dayType:"H",exercises:[ex("cd41","Deadlift pausa 2s","Strength",4,"5","120","55kg","",""),ex("cd42","RDL Bilanciere","Strength",3,"8","120","35kg","","discesa controllata"),ex("cd43","Push-up negativi","Strength",4,"6","90","BW","",""),ex("cd44","SS: Aust. pullup + L-sitting press","Strength",4,"10+8","90","2x7kg","",""),ex("cd45","Plank ST + Russian Twist","Core",3,"40'' each","60","1x16kg","","")]}],
block2:[{dayLabel:"Day 1",focus:"Lower Body + Core",dayType:"Q",exercises:[ex("cd46","Back Squat fermo in buca","Strength",5,"4","120","45kg","",""),ex("cd47","Affondi in Camminata","Strength",3,"10/gamba","90","2x12.5kg","",""),ex("cd48","Hip Thrust","Strength",4,"8","120","85kg","",""),ex("cd49","Ponte femorali 1 gamba","Strength",4,"12/gamba","75","BW","",""),ex("cd50","Dead Bug + Plank Slide Fitball","Core",3,"40'' each","60","BW","","")]},{dayLabel:"Day 2",focus:"Upper Body + Conditioning",dayType:"A",exercises:[ex("cd51","Pull-Up Negativi","Strength",4,"5","120","BW","","2'' hold + discesa"),ex("cd52","Incline DB Press 30°","Strength",4,"10","90","2x10kg","",""),ex("cd53","Shoulder Press cluster","Strength",3,"4+4+4","120","2x10kg","",""),ex("cd54","1 Arm Row","Strength",4,"8","90","1x14kg","",""),ex("cd55","Bicipiti ez + alzate lat","Strength",3,"8+12","90","2.5kg + 2x6kg","","")]},{dayLabel:"Day 3",focus:"Full Body / Posterior",dayType:"H",exercises:[ex("cd56","Deadlift","Strength",4,"5","120","65kg","",""),ex("cd57","RDL Bilanciere","Strength",4,"8","90","37.5kg","",""),ex("cd58","Push-up Elevati","Strength",3,"8","90","BW","",""),ex("cd59","SS: Row renegade + L-sitting press","Strength",4,"12+10","90","2x12.5kg + 2x8kg","",""),ex("cd60","Side Plank + High Plank","Core",3,"40'' each","60","BW","","")]}],
cardio:{block1:[mkCardio("Day 4","Progressive Run","5' easy","30' RPE8","5'","8")],block2:[mkCardio("Day 4","Fartlek","10'","2' forte + 3' lento x9","5'","7")]},running:null,levelCfg:null,durationCfg:null};

const CARDONI_B3={id:"prog_cd3",clientId:"cl7",clientName:"Cardoni",level:"intermediate",monthNumber:3,sessionsPerWeek:4,sessionDuration:75,trainingLocation:"gym",includesRunning:true,cardioDaysPerWeek:1,createdAt:"2025-09-01T10:00:00Z",
block1:[{dayLabel:"Day 1",focus:"Lower Body + Core",dayType:"Q",exercises:[ex("cd61","Back Squat","Strength","2+3","6+4","120","45+47.5kg","","prova dischetto tallone"),ex("cd62","Affondi Dietro Bilanciere","Strength",3,"10/gamba","90","30kg tot","",""),ex("cd63","Hip Thrust","Strength","2+2","6+10","90","90+85kg","",""),ex("cd64","Circuito: Bicipiti+Hamstring+K2C","Finisher",3,"10+12+14","90","2x6kg","","")]},{dayLabel:"Day 2",focus:"Upper Body + Conditioning",dayType:"A",exercises:[ex("cd65","Pull-Up Assistiti","Strength",3,"3","120","elastico","",""),ex("cd66","Rematore Bilanciere","Strength",3,"10","90","30kg tot","",""),ex("cd67","Incline DB Press 30°","Strength",3,"8","90","2x12kg","",""),ex("cd68","Shoulder Press Panca","Strength",3,"8","90","2x10kg","",""),ex("cd69","EMOM 8': 12 TRX pull + 8 burpees","Finisher",1,"EMOM 8'","0","","","")]},{dayLabel:"Day 3",focus:"Full Body / Posterior",dayType:"H",exercises:[ex("cd70","Deadlift pausa 2s","Strength",3,"6","120","65kg","",""),ex("cd71","RDL Bilanciere","Strength",3,"10","120","40kg","",""),ex("cd72","Military Press","Strength",3,"6","90","20kg tot","",""),ex("cd73","Push-up Elevati","Strength",3,"6","90","rack basso","",""),ex("cd74","V-up + Hollow Body","Core",4,"30'' each","60","BW","","")]}],
block2:[{dayLabel:"Day 1",focus:"Lower Body + Core",dayType:"Q",exercises:[ex("cd75","Back Squat EMOM 5'","Strength",3,"—","120","47.5-50kg","",""),ex("cd76","Affondi Dietro Bilanciere","Strength",3,"8/gamba","90","35kg tot","",""),ex("cd77","Hip Thrust","Strength","2+2","8+12","90","90+85kg","",""),ex("cd78","EMOM 9': Bicipiti+Nordic+K2C","Finisher",1,"EMOM 9'","0","2x6kg","","")]},{dayLabel:"Day 2",focus:"Upper Body + Conditioning",dayType:"A",exercises:[ex("cd79","Pull-Up Assistiti","Strength",4,"3","120","","",""),ex("cd80","Rematore Bilanciere","Strength",4,"10","120","35kg","",""),ex("cd81","Incline DB Press 30°","Strength",3,"10","90","2x12kg","",""),ex("cd82","Shoulder Press Panca","Strength",4,"8","90","2x10kg","",""),ex("cd83","EMOM 8': Burpees BJ + Russian swing","Finisher",1,"EMOM 8'","0","18kg","","")]},{dayLabel:"Day 3",focus:"Full Body / Posterior",dayType:"H",exercises:[ex("cd84","Deadlift","Strength","2x","6-4-2","120","65-67.5-70kg","",""),ex("cd85","RDL Bilanciere","Strength","2+2","6+12","120","45+40kg","",""),ex("cd86","Military Press","Strength",4,"6","90","20kg tot","",""),ex("cd87","Push-up Elevati","Strength",3,"8","90","rack bassissimo","",""),ex("cd88","K2C + Suitcase carry","Core",4,"12+20m/side","60","","","")]}],
cardio:{block1:[mkCardio("Day 4","Progressive","5'","(4'@5'/km+1'@4'45'')x4","5'","8")],block2:[mkCardio("Day 4","Fartlek","5' easy","(1'forte+1'lento)x10","5'","7")]},running:null,levelCfg:null,durationCfg:null};

// ─── ADAMOLI (1 block) ───
const ADAMOLI_B1={id:"prog_ad1",clientId:"cl8",clientName:"Adamoli",level:"intermediate",monthNumber:1,sessionsPerWeek:3,sessionDuration:70,trainingLocation:"gym",includesRunning:false,cardioDaysPerWeek:0,createdAt:"2025-11-01T10:00:00Z",
block1:[{dayLabel:"Day 1",focus:"Lower + Core",dayType:"Q",exercises:[ex("ad1","Back Squat","Strength",4,"8","90","45kg RPE7","",""),ex("ad2","Military Press","Strength",4,"8","120","@55%","",""),ex("ad3","Hip Thrust","Strength",4,"8","90","RPE 8","",""),ex("ad4","Affondi dietro deficit","Strength",3,"10/side","90","2x16kg","",""),ex("ad5","Deadbug + Plank fitball","Core",3,"12+25''","60","BW","","")]},{dayLabel:"Day 2",focus:"Schiena + Spalle + Core",dayType:"H",exercises:[ex("ad6","Lat Machine neutra","Strength",4,"8","120","35kg","","RPE 9"),ex("ad7","1 Arm Row","Strength",3,"12","120","1x18kg","",""),ex("ad8","DB Shoulder Press","Strength",3,"10","90","2x12kg","",""),ex("ad9","4RFT: 250m run + 10 Burpees","Finisher",1,"4RFT","0","","","ihih :)"),ex("ad10","Curl manubri","Strength",3,"12","60","2x6kg","","")]},{dayLabel:"Day 3",focus:"Posteriori + Spinte + Core",dayType:"H",exercises:[ex("ad11","RDL bilanciere","Strength",4,"8","120","40-45kg","","RPE7"),ex("ad12","DB Incline Press 30°","Strength",3,"8","90","2x12-14kg","",""),ex("ad13","Bulgari","Strength",3,"8/gamba","90","2x15kg","",""),ex("ad14","Push-Up elevati","Strength",3,"6","60","bilanciere","",""),ex("ad15","Tricipiti cavo","Strength",3,"12","60","10kg","",""),ex("ad16","Plank Drag + Side plank","Core",3,"12+30s/side","60","1x8kg","","")]}],
block2:[{dayLabel:"Day 1",focus:"Lower + Core",dayType:"Q",exercises:[ex("ad17","Back Squat","Strength",4,"6","90","@60%","",""),ex("ad18","Military Press","Strength",4,"6","120","@60%","",""),ex("ad19","Hip Thrust","Strength",4,"10","120","same","",""),ex("ad20","Affondi dietro deficit","Strength",3,"12/side","90","same","",""),ex("ad21","Deadbug + Plank fitball","Core",3,"16+30''","60","BW","","")]},{dayLabel:"Day 2",focus:"Schiena + Spalle + Core",dayType:"H",exercises:[ex("ad22","Pullup Negativi","Strength",3,"3-4","120","BW","","discesa lenta"),ex("ad23","1 Arm Row","Strength",4,"8","120","1x20-22kg","",""),ex("ad24","DB Shoulder Press","Strength",4,"8","90","2x14kg","",""),ex("ad25","3RFT: 300m+12SU+10KBS","Finisher",1,"3RFT","0","20kg","",""),ex("ad26","Curl manubri","Strength",4,"8","60","2x7kg","","")]},{dayLabel:"Day 3",focus:"Posteriori + Spinte + Core",dayType:"H",exercises:[ex("ad27","RDL bilanciere","Strength","2+2","6+10","90","RPE8+RPE7","",""),ex("ad28","DB Incline Press 30°","Strength",3,"10","90","RPE 8","",""),ex("ad29","Bulgari","Strength",3,"10/gamba","90","same","",""),ex("ad30","Pushup elevati","Strength",3,"8","90","bilanciere","",""),ex("ad31","Tricipiti cavo","Strength",4,"12","60","10kg","",""),ex("ad32","Plank Drag + Side plank","Core",4,"12+30s/side","60","1x8kg","","")]}],
cardio:null,running:null,levelCfg:null,durationCfg:null};

// ─── AGRATI (2 blocks) ───
const AGRATI_B1={id:"prog_ag1",clientId:"cl9",clientName:"Agrati",level:"beginner",monthNumber:1,sessionsPerWeek:4,sessionDuration:60,trainingLocation:"gym",includesRunning:true,cardioDaysPerWeek:1,createdAt:"2025-09-01T10:00:00Z",
block1:[{dayLabel:"Day 1",focus:"Accosciate + Spinte",dayType:"Q",exercises:[ex("ag1","Plank + Shoulder tap","Core",3,"30''+16","60","BW","",""),ex("ag2","Reverse Lunge","Strength",4,"8/side","90","2x4kg","",""),ex("ag3","Hip Thrust","Strength",3,"12","90","10kg+","",""),ex("ag4","Chest Press macch.","Strength",3,"10","90","15-17.5kg","",""),ex("ag5","DB Shoulder Press","Strength",3,"10","90","2x5kg","",""),ex("ag6","Abductors","Strength",3,"15","60","30kg","",""),ex("ag7","Alzate Laterali","Strength",3,"10","60","2x4-5kg","","")]},{dayLabel:"Day 2",focus:"Hinge + Tirate",dayType:"H",exercises:[ex("ag8","RDL Manubri","Strength",3,"10","90","2x8-9kg","",""),ex("ag9","Lat Machine","Strength",4,"10","90","25kg","",""),ex("ag10","DB Row 1 braccio","Strength",3,"12/side","90","1x10kg","",""),ex("ag11","Curl manubri","Strength",3,"10","60","2x5kg","",""),ex("ag12","Leg Curl","Strength",3,"12","90","20kg","","")]},{dayLabel:"Day 3",focus:"Full Body",dayType:"A",exercises:[ex("ag13","Leg Press","Strength",3,"10","90","60kg","",""),ex("ag14","SS: Standing Press + Trx pull","Strength",3,"10+10","90","2x5kg","",""),ex("ag15","Circuito: KB DL+BJ+Burpees","Finisher",3,"10+8+6","75","KB 18-20kg","",""),ex("ag16","Tricipiti cavo","Strength",3,"12","75","7.5kg","","")]}],
block2:[{dayLabel:"Day 1",focus:"Accosciate + Spinte",dayType:"Q",exercises:[ex("ag17","Plank + Shoulder tap","Core",3,"40''+20","60","BW","",""),ex("ag18","Reverse Lunge","Strength",3,"10/side","90","2x6kg","",""),ex("ag19","Hip Thrust","Strength",4,"10","90","15kg+","",""),ex("ag20","Chest Press","Strength",4,"8","90","17.5kg","",""),ex("ag21","DB Shoulder Press","Strength",3,"8","90","2x6kg","",""),ex("ag22","Abductors","Strength",3,"15","60","30kg","",""),ex("ag23","Alzate Laterali","Strength",3,"10","60","2x4-5kg","","")]},{dayLabel:"Day 2",focus:"Hinge + Tirate",dayType:"H",exercises:[ex("ag24","RDL Manubri","Strength",4,"8","90","2x10kg","",""),ex("ag25","Lat Machine","Strength",3,"8","120","30kg","",""),ex("ag26","DB Row 1 braccio","Strength",3,"10/side","90","1x12kg","",""),ex("ag27","Leg Curl","Strength",3,"10","90","22.5kg","",""),ex("ag28","Curl manubri","Strength",3,"12","60","2x5kg","","")]},{dayLabel:"Day 3",focus:"Full Body",dayType:"A",exercises:[ex("ag29","Leg Press","Strength",4,"10","90","60kg","",""),ex("ag30","SS: Standing Press + Trx pull","Strength",3,"10","90","22.5kg","",""),ex("ag31","4RFT: KB DL+BJ+Burpees","Finisher",1,"4RFT","0","","",""),ex("ag32","Tricipiti cavo","Strength",4,"12","75","7.5kg","","")]}],
cardio:{block1:[mkCardio("Day 4","Fartlek","5'","5-6km: 2'veloce/3'lento RPE7","5'","7")],block2:[mkCardio("Day 4","Easy Run","","7km easy run","","6")]},running:null,levelCfg:null,durationCfg:null};

const AGRATI_B2={id:"prog_ag2",clientId:"cl9",clientName:"Agrati",level:"beginner",monthNumber:2,sessionsPerWeek:4,sessionDuration:60,trainingLocation:"gym",includesRunning:true,cardioDaysPerWeek:1,createdAt:"2025-10-01T10:00:00Z",
block1:[{dayLabel:"Day 1",focus:"Accosciate + Spinte",dayType:"Q",exercises:[ex("ag33","RT 8kg + Deadbug","Core",3,"16+16","60","","",""),ex("ag34","Reverse Lunge","Strength",3,"8/side","90","2x8kg","",""),ex("ag35","Hip Thrust","Strength","2+2","8+10","90","20-15kg+","",""),ex("ag36","Chest Press","Strength","2+2","6+10","90","22.5-20kg","",""),ex("ag37","DB Shoulder Press","Strength",3,"10","90","2x6kg","",""),ex("ag38","Abductors","Strength",3,"15","60","30kg","",""),ex("ag39","Alzate Laterali","Strength",3,"12","60","2x5kg","","")]},{dayLabel:"Day 2",focus:"Hinge + Tirate",dayType:"H",exercises:[ex("ag40","RDL Manubri ecc 3s","Strength","3+1","8+12","120","2x14+1x12kg","","discesa 3s"),ex("ag41","Lat Machine","Strength",4,"8","90","30kg","",""),ex("ag42","DB Row 1 braccio","Strength",3,"12/side","90","1x12kg","",""),ex("ag43","Curl manubri","Strength",3,"10","60","2x5kg","",""),ex("ag44","Leg Curl","Strength",3,"12","90","20kg","","")]},{dayLabel:"Day 3",focus:"Full Body",dayType:"A",exercises:[ex("ag45","Leg Press","Strength",4,"8","120","70kg","",""),ex("ag46","SS: Pushup + Trx pull","Strength",4,"8+6","90","ginocchia","",""),ex("ag47","4RFT: 250m run+6burp+15AS","Finisher",1,"4RFT","0","","",""),ex("ag48","Tricipiti cavo","Strength",3,"10","90","10kg","","")]}],
block2:[{dayLabel:"Day 1",focus:"Accosciate + Spinte",dayType:"Q",exercises:[ex("ag49","RT 10kg + Deadbug","Core",3,"16+16","60","","",""),ex("ag50","Reverse Lunge","Strength",3,"10/side","90","2x6kg","",""),ex("ag51","Hip Thrust","Strength",4,"10","90","15kg+","",""),ex("ag52","Chest Press","Strength",4,"6","90","22.5kg","",""),ex("ag53","DB Shoulder Press","Strength","2+2","6+10","90","2x7+2x6kg","",""),ex("ag54","Abductors","Strength",3,"15","60","30kg","",""),ex("ag55","Alzate Laterali","Strength",4,"10","60","2x5kg","","")]},{dayLabel:"Day 2",focus:"Hinge + Tirate",dayType:"H",exercises:[ex("ag56","RDL Manubri","Strength",4,"8","90","2x14kg","",""),ex("ag57","Lat Machine","Strength","2+2","10+8","120","30kg","",""),ex("ag58","DB Row 1 braccio","Strength",4,"6/side","90","1x14kg","",""),ex("ag59","Leg Curl","Strength",4,"10","90","22.5kg","",""),ex("ag60","Curl manubri","Strength",4,"12","60","2x5kg","","")]},{dayLabel:"Day 3",focus:"Full Body",dayType:"A",exercises:[ex("ag61","Leg Press","Strength",4,"10","90","70kg","",""),ex("ag62","SS: KB DL + Row renegade","Strength",3,"10+10","90","20kg+2x8kg","",""),ex("ag63","4R: 300m run+15SU+12RT","Finisher",1,"4 round","60","10kg","",""),ex("ag64","Tricipiti cavo","Strength",3,"12","90","10kg","","")]}],
cardio:{block1:[mkCardio("Day 4","Intervals","10'","5x800m RPE8 rec 2'","5'","8")],block2:[mkCardio("Day 4","Easy Run","","8km easy","","6")]},running:null,levelCfg:null,durationCfg:null};

// ─── ALLEGRI Blocco 4 ───
const ALLEGRI_B4={id:"prog_al4",clientId:"cl10",clientName:"Allegri",level:"intermediate",monthNumber:4,sessionsPerWeek:6,sessionDuration:45,trainingLocation:"home",includesRunning:true,cardioDaysPerWeek:3,createdAt:"2025-09-15T10:00:00Z",
block1:[{dayLabel:"Day 2",focus:"Home Gym",dayType:"A",exercises:[ex("al1","Circuito: RT+V-up+Plank commando","Core",3,"16+14+12","60","1x10kg","",""),ex("al2","Reverse Lunges","Strength",3,"6/gamba","120","2x10kg","",""),ex("al3","EMOM 8': Floor Press + Row","Strength",1,"10+12","0","2x12kg","",""),ex("al4","Pushup HR ecc 3s","Strength",4,"6","90","BW","",""),ex("al5","SS: Dip Sedia + SL Hip Thrust","Strength",4,"12+10/side","60","BW","","")]},{dayLabel:"Day 4",focus:"Home Gym",dayType:"H",exercises:[ex("al6","SL RDL","Strength",3,"10/side","90","2x8kg","",""),ex("al7","Crab Walk + SL Hip Thrust","Strength",3,"30s+12/side","75","1x8kg","",""),ex("al8","Seated Press","Strength","1+3","12+6","120","2x8+2x10kg","",""),ex("al9","EMOM 8': 6 burpees","Finisher",1,"EMOM 8'","0","BW","",""),ex("al10","Core: accumulo 60 sit-up","Core",1,"60","0","BW","","")]},{dayLabel:"Day 6",focus:"Home Gym",dayType:"A",exercises:[ex("al11","Circuito: plank row + 1db squat","Warm-Up",3,"10+8/side","0","1x10kg","",""),ex("al12","1 Arm Row","Strength",4,"10","90","1x16kg","",""),ex("al13","Shrimp Squat","Strength",3,"6/gamba","90","BW","","piede non tocca mai"),ex("al14","Alzate Laterali","Strength",3,"10","75","2x8kg","",""),ex("al15","AMRAP 9': 5burp+10thruster+10lunges","Finisher",1,"AMRAP 9'","0","2x10kg","","")]}],
block2:[{dayLabel:"Day 2",focus:"Home Gym",dayType:"A",exercises:[ex("al16","Circuito: RT12kg + Plank Lat","Core",3,"16+40s","60","1x12kg","",""),ex("al17","Reverse Lunges","Strength",3,"8/gamba","120","2x10kg","",""),ex("al18","EMOM 8': KPU + Row","Strength",1,"10+12","0","2x12kg","",""),ex("al19","Circuito: Floor Press + SL HT","Strength",4,"6+12/side","120","2x14kg","","")]},{dayLabel:"Day 4",focus:"Home Gym",dayType:"H",exercises:[ex("al20","SL RDL ecc 3s","Strength",3,"12/side","90","2x8kg","",""),ex("al21","Crab Walk + SL Hip Thrust","Strength",3,"30s+12/side","75","1x10kg","",""),ex("al22","Seated Press ecc 3s","Strength",3,"6","120","2x10kg","",""),ex("al23","Every 1'30'' x5: thruster+v-up","Finisher",5,"8+8","90","2x8kg","","")]},{dayLabel:"Day 6",focus:"Home Gym",dayType:"A",exercises:[ex("al24","Circuito: OH march + 1db squat","Warm-Up",4,"20+8/side","0","2x10kg","",""),ex("al25","1 Arm Row iso 1s","Strength",4,"8","90","1x16kg","",""),ex("al26","Shrimp Squat","Strength",3,"8/gamba","90","BW","",""),ex("al27","Alzate Laterali","Strength",3,"12","75","2x8kg","",""),ex("al28","AMRAP 9': 6burp+10split+14SU","Finisher",1,"AMRAP 9'","0","BW","","")]}],
cardio:{block1:[mkCardio("Day 1","Easy Run","mobilità","20' easy + 5' sost","stretching","6"),mkCardio("Day 3","Intervals","10' easy","8x300m RPE9 rec 2'","5' jog","9"),mkCardio("Day 5","Bike Z2","","35' easy","","5")],block2:[mkCardio("Day 1","Easy Run","","2km easy+2km gasa+1km easy","stretching","6"),mkCardio("Day 3","Tempo Run","10' easy","5k sostenuti","5' jog","7"),mkCardio("Day 5","Bike Z2","","35' easy","","5")]},running:null,levelCfg:null,durationCfg:null};

// ─── ANNA SAVINO (1 block) ───
const SAVINO_B1={id:"prog_as1",clientId:"cl11",clientName:"Anna Savino",level:"beginner",monthNumber:1,sessionsPerWeek:2,sessionDuration:60,trainingLocation:"gym",includesRunning:true,cardioDaysPerWeek:4,createdAt:"2025-11-01T10:00:00Z",
block1:[{dayLabel:"Giorno 1",focus:"Spinte + Accosciate",dayType:"Q",exercises:[ex("as1","Back Squat","Strength",4,"8","120","25-30kg RPE7","","invia video"),ex("as2","Military Press","Strength",4,"6","120","15-17.5kg","","petto alto gomiti sotto"),ex("as3","Floor Press","Strength",3,"8","90","2x8kg","",""),ex("as4","Affondi dietro","Strength",3,"8/8","90","2x9kg","","Focus kiappa"),ex("as5","Dead Bug + Plank Reach","Core",3,"20s each","60","BW","","")]},{dayLabel:"Giorno 2",focus:"Tirate + Hip Hinge",dayType:"H",exercises:[ex("as6","RDL ecc 3s","Strength",4,"8","120","30kg","","Eccentrica lenta"),ex("as7","Lat Machine neutra","Strength",4,"8","90","30kg","",""),ex("as8","Hip Thrust","Strength",4,"10","120","70kg","","RPE 8"),ex("as9","Ring/TRX Row","Strength",3,"10-12","90","BW","","più inclinata poss"),ex("as10","Drag Through + Side Plank","Core",3,"10+30s","60","1x8kg","","")]}],
block2:[{dayLabel:"Giorno 1",focus:"Spinte + Accosciate",dayType:"Q",exercises:[ex("as11","Back Squat","Strength",4,"6","120","27.5-32.5kg","","RPE 7"),ex("as12","Military Press","Strength",4,"6","120","17.5kg","",""),ex("as13","Floor Press","Strength",3,"8","90","2x9kg","",""),ex("as14","Affondi dietro","Strength",3,"8/8","90","2x10kg","",""),ex("as15","Dead Bug + Plank Reach","Core",3,"30s each","60","BW","","")]},{dayLabel:"Giorno 2",focus:"Tirate + Hip Hinge",dayType:"H",exercises:[ex("as16","RDL","Strength",4,"8","120","35-40kg RPE8","",""),ex("as17","Lat Machine neutra","Strength",4,"10","90","30kg","",""),ex("as18","Hip Thrust","Strength",4,"8","120","75kg RPE8.5","",""),ex("as19","Ring/TRX Row ecc 3s","Strength",3,"10-12","90","BW RPE9","",""),ex("as20","Drag Through + Side Plank","Core",3,"12+30s","60","1x8kg","","")]}],
cardio:{block1:[mkCardio("Speed D1","Intervals","10'+andature","6x500m @75% rec 2'","8-10'","8"),mkCardio("Speed D2","Intervals","10'","4x1000m @5'45''/km rec 90''","8-10'","8")],block2:[mkCardio("Long Run","Z2 Run","","7k Z2","","6"),mkCardio("Tempo","Tempo Run","10'","5k @6'00''/km","stretching","7")]},running:null,levelCfg:null,durationCfg:null};

// ─── ASSERETO (4 blocks) ───
const ASSERETO_B1={id:"prog_ae1",clientId:"cl12",clientName:"Assereto",level:"advanced",monthNumber:1,sessionsPerWeek:3,sessionDuration:75,trainingLocation:"gym",includesRunning:false,cardioDaysPerWeek:0,createdAt:"2025-07-01T10:00:00Z",
block1:[{dayLabel:"Day 1",focus:"Squat & Shoulders",dayType:"Q",exercises:[ex("ae1","Box Squat @65%","Strength",4,"6","90","1RM 100kg","",""),ex("ae2","Reverse Lunge DB","Strength",3,"10/leg","75","2x17.5-22.5kg","",""),ex("ae3","Leg Curl","Strength",3,"15","0","35-45kg","",""),ex("ae4","Calf Raise","Strength",3,"12","0","","",""),ex("ae5","DB Shoulder Press","Strength",4,"8","75","18-24kg","",""),ex("ae6","Lateral Raise","Strength",3,"10","60","10-15kg","","")]},{dayLabel:"Day 2",focus:"Push/Pull Upper",dayType:"A",exercises:[ex("ae7","Incline Bench @70%","Strength",5,"5","90","1RM 90kg","",""),ex("ae8","One Arm DB Row","Strength",4,"8","75","32-40kg","",""),ex("ae9","Lat Machine","Strength",3,"8","0","50-60kg","",""),ex("ae10","Push-up max","Strength",3,"max","120","BW","","SS con Lat"),ex("ae11","French Press EZ","Strength",3,"12","60","","","")]},{dayLabel:"Day 3",focus:"Hinge & Arms",dayType:"H",exercises:[ex("ae12","RDL @65%","Strength",4,"8","90","1RM 100kg","",""),ex("ae13","Hip Thrust 2'' hold","Strength",4,"10","90","50-65kg","",""),ex("ae14","EZ Curl + Hammer SS","Strength",3,"10+12","75","","",""),ex("ae15","Core: Ab wheel+K2C+Hollow","Core",3,"8+12+15","60","","","")]}],
block2:[{dayLabel:"Day 1",focus:"Squat & Shoulders",dayType:"Q",exercises:[ex("ae16","Box Squat @70%","Strength",4,"6","90","1RM 100kg","",""),ex("ae17","Reverse Lunge DB","Strength",3,"10/leg","75","","",""),ex("ae18","Leg Curl","Strength",3,"12","0","","",""),ex("ae19","Calf Raise","Strength",3,"15","0","","",""),ex("ae20","DB Shoulder Press","Strength",4,"8","75","","",""),ex("ae21","Lateral Raise","Strength",3,"12","60","","","")]},{dayLabel:"Day 2",focus:"Push/Pull Upper",dayType:"A",exercises:[ex("ae22","Incline Bench @72%","Strength",5,"5","90","1RM 90kg","",""),ex("ae23","One Arm DB Row","Strength",4,"10","75","","",""),ex("ae24","Lat Machine","Strength",4,"8","0","","",""),ex("ae25","Push-up max","Strength",3,"max","120","BW","",""),ex("ae26","French Press EZ","Strength",3,"12","60","","","")]},{dayLabel:"Day 3",focus:"Hinge & Arms",dayType:"H",exercises:[ex("ae27","RDL @72.5%","Strength",4,"6-8","90","1RM 100kg","",""),ex("ae28","Hip Thrust","Strength",4,"10","90","","",""),ex("ae29","EZ Curl + Hammer SS","Strength",3,"10+12","0","","",""),ex("ae30","Core: Ab wheel+K2C+Hollow","Core",3,"8+12+15","60","","","")]}],
cardio:null,running:null,levelCfg:null,durationCfg:null};

const ASSERETO_B2={id:"prog_ae2",clientId:"cl12",clientName:"Assereto",level:"advanced",monthNumber:2,sessionsPerWeek:3,sessionDuration:75,trainingLocation:"gym",includesRunning:false,cardioDaysPerWeek:0,createdAt:"2025-08-01T10:00:00Z",
block1:[{dayLabel:"Day 1",focus:"Squat & Shoulders",dayType:"Q",exercises:[ex("ae31","Box Squat @72%","Strength",4,"6","120","1RM 100kg","",""),ex("ae32","Bulgarian Split Squat","Strength",3,"10/leg","120","2x15kg","",""),ex("ae33","Leg Curl","Strength",3,"15","0","","",""),ex("ae34","Calf Raise","Strength",3,"12","0","","",""),ex("ae35","DB Shoulder Press","Strength",4,"8","0","2x18kg","",""),ex("ae36","Lat Raise + Face Pull SS","Strength",3,"12+12","0","","",""),ex("ae37","EMOM 10': Goblet+PU","Finisher",1,"EMOM 10'","0","24kg","","")]},{dayLabel:"Day 2",focus:"Push & Pull",dayType:"A",exercises:[ex("ae38","Bench Press @72%","Strength",5,"5","120","1RM 85kg","",""),ex("ae39","Pull-up","Strength",4,"3-2-1","90","BW","",""),ex("ae40","One Arm DB Row","Strength",4,"10/side","0","28kg","",""),ex("ae41","Chest Press + PU SS","Strength",4,"10+max","0","","",""),ex("ae42","Face Pull","Strength",3,"15","0","","",""),ex("ae43","French Press + Hammer SS","Strength",3,"12+12","0","","",""),ex("ae44","EMOM 8': PU+Inverted Row","Finisher",1,"EMOM 8'","0","","","")]},{dayLabel:"Day 3",focus:"Hinge & Arms",dayType:"H",exercises:[ex("ae45","RDL @70%","Strength",4,"8","120","1RM 95kg","",""),ex("ae46","Hip Thrust cluster 6+4+2","Strength",3,"6+4+2","0","+65kg","","ogni 10s"),ex("ae47","Walking Lunge DB","Strength",3,"12/leg","0","","",""),ex("ae48","EZ Curl + Cavo SS","Strength",3,"12+12","0","","",""),ex("ae49","Incline DB Curl","Strength",3,"12","0","","",""),ex("ae50","Core: Plank+SP+Dead Bug","Core",3,"30''+30''+12","0","","","")]}],
block2:[{dayLabel:"Day 1",focus:"Squat & Shoulders",dayType:"Q",exercises:[ex("ae51","Box Squat @75%","Strength",5,"5","120","1RM 100kg","",""),ex("ae52","Bulgarian Split Squat","Strength",4,"10/leg","120","","",""),ex("ae53","Leg Curl","Strength",4,"12","0","","",""),ex("ae54","Calf Raise","Strength",4,"12","0","","",""),ex("ae55","DB Shoulder Press","Strength",4,"10","0","","","più carico"),ex("ae56","Lat Raise + Face Pull SS","Strength",3,"15+15","0","","",""),ex("ae57","EMOM 10': Curls+Dip","Finisher",1,"EMOM 10'","0","","","")]},{dayLabel:"Day 2",focus:"Push & Pull",dayType:"A",exercises:[ex("ae58","Bench Press @75%","Strength",5,"4","120","1RM 85kg","",""),ex("ae59","Pull-up zavorrati","Strength",4,"2","0","+5kg","","minimo"),ex("ae60","One Arm DB Row","Strength",4,"12/side","0","","",""),ex("ae61","Chest Press + PU SS","Strength",4,"10+max","0","","",""),ex("ae62","French Press + Hammer SS","Strength",3,"12+12","0","","","")]},{dayLabel:"Day 3",focus:"Hinge & Arms",dayType:"H",exercises:[ex("ae63","RDL @75%","Strength",4,"6","120","1RM 95kg","",""),ex("ae64","Hip Thrust","Strength",4,"8","0","65kg","",""),ex("ae65","Walking Lunge DB","Strength",3,"8/leg","0","","","più carico"),ex("ae66","EZ Curl + Cavo SS","Strength",3,"12+12","0","","","più carico"),ex("ae67","Incline DB Curl ecc 3''","Strength",3,"10","0","","",""),ex("ae68","Core: Plank reach+SP+K2C","Core",3,"30''+35''+12","0","","","")]}],
cardio:null,running:null,levelCfg:null,durationCfg:null};

const ASSERETO_B3={id:"prog_ae3",clientId:"cl12",clientName:"Assereto",level:"advanced",monthNumber:3,sessionsPerWeek:3,sessionDuration:75,trainingLocation:"gym",includesRunning:false,cardioDaysPerWeek:0,createdAt:"2025-09-01T10:00:00Z",
block1:[{dayLabel:"Day 1",focus:"Squat & Shoulders",dayType:"Q",exercises:[ex("ae69","T-Drill stability","Warm-Up",3,"6/gamba","0","BW","","equilibrio"),ex("ae70","Back Squat @70%","Strength",5,"5","120","1RM 100kg","","invia video"),ex("ae71","Affondi dietro","Strength",3,"10/leg","90","2x18kg","","focus stabilità"),ex("ae72","Leg Extension","Strength",3,"15","90","35kg","",""),ex("ae73","Calf Raise","Strength",3,"15","75","","","segna peso"),ex("ae74","DB Shoulder Press","Strength",4,"6","120","2x20kg","",""),ex("ae75","Lat Raise manubri","Strength",3,"8","60","2x12kg","","belle pulite"),ex("ae76","Lat Raise cavo","Strength",2,"max rep","0","5kg","","no rest")]},{dayLabel:"Day 2",focus:"Push & Pull",dayType:"A",exercises:[ex("ae77","Bench Press @70%","Strength",5,"5","120","1RM 85kg","",""),ex("ae78","Pull-up zavorrati","Strength",4,"4","90","+10kg","",""),ex("ae79","Rematore Bilanciere","Strength",3,"10","90","65kg","",""),ex("ae80","Chest Press","Strength",3,"15","120","35kg","",""),ex("ae81","French Press + Hammer SS","Strength",4,"12+12","60","","","")]},{dayLabel:"Day 3",focus:"Hinge & Arms",dayType:"H",exercises:[ex("ae82","RDL @70%","Strength",4,"8","120","1RM 120kg","",""),ex("ae83","Hip Thrust","Strength",4,"8","90","65kg","",""),ex("ae84","Military Press","Strength",4,"6","120","40kg","",""),ex("ae85","Incline DB Press ecc 3s","Strength",3,"10","90","2x22kg","",""),ex("ae86","EMOM 9': PU+EZ curl+DragThru","Core",1,"EMOM 9'","0","10kg","","")]}],
block2:[{dayLabel:"Day 1",focus:"Squat & Shoulders",dayType:"Q",exercises:[ex("ae87","T-Drill stability","Warm-Up",3,"6/gamba","0","BW","",""),ex("ae88","Back Squat pausa 1s @75%","Strength",5,"4","120","1RM 100kg","",""),ex("ae89","Affondi dietro","Strength",4,"10/leg","90","2x18-20kg","",""),ex("ae90","Leg Extension","Strength",4,"12","90","40kg","",""),ex("ae91","Calf Raise","Strength",4,"15","75","","",""),ex("ae92","DB Shoulder Press","Strength",4,"8","120","2x20kg","",""),ex("ae93","Lat Raise","Strength",3,"10","60","2x12kg","",""),ex("ae94","Lat Raise cavo","Strength",2,"max rep","0","5kg","","")]},{dayLabel:"Day 2",focus:"Push & Pull",dayType:"A",exercises:[ex("ae95","Bench Press @75%","Strength",5,"4","120","1RM 85kg","",""),ex("ae96","Pull-up zavorrati","Strength",4,"5","90","+10kg","",""),ex("ae97","Rematore Bilanciere","Strength",4,"10","90","65kg","",""),ex("ae98","Chest Press","Strength",4,"15","120","35kg","",""),ex("ae99","French Press + Hammer SS","Strength",5,"12+12","60","","","")]},{dayLabel:"Day 3",focus:"Hinge & Arms",dayType:"H",exercises:[ex("ae100","RDL ecc 3s @75%","Strength",4,"6","120","1RM 120kg","",""),ex("ae101","Hip Thrust","Strength",4,"10","90","65kg","",""),ex("ae102","Military Press ecc 3s","Strength",4,"5","120","42.5kg","",""),ex("ae103","Incline DB Press ecc 3s","Strength",3,"12","90","2x22kg","",""),ex("ae104","EMOM 9': Dip+Hammer+Plank","Core",1,"EMOM 9'","0","","","")]}],
cardio:null,running:null,levelCfg:null,durationCfg:null};

const ASSERETO_B4={id:"prog_ae4",clientId:"cl12",clientName:"Assereto",level:"advanced",monthNumber:4,sessionsPerWeek:3,sessionDuration:75,trainingLocation:"gym",includesRunning:false,cardioDaysPerWeek:0,createdAt:"2025-10-01T10:00:00Z",
block1:[{dayLabel:"Day 1",focus:"Squat & Shoulders",dayType:"Q",exercises:[ex("ae105","T-Drill stability","Warm-Up",3,"8/gamba","0","BW","",""),ex("ae106","Back Squat @50% tecnica","Strength",3,"8","120","1RM 100kg","","profondità"),ex("ae107","Affondi dietro","Strength",3,"6/leg","120","2x22kg","","VAI PIANO"),ex("ae108","Leg Extension","Strength",3,"15","90","40kg","",""),ex("ae109","Calf Raise","Strength",2,"10 heavy+2x12","0","","",""),ex("ae110","DB Shoulder Press","Strength",3,"10","120","2x22kg","",""),ex("ae111","Lat Raise cavo","Strength",3,"max rep","0","5kg","","")]},{dayLabel:"Day 2",focus:"Push & Pull",dayType:"A",exercises:[ex("ae112","Bench fermo petto @75%","Strength",4,"5","120","1RM 85kg","",""),ex("ae113","Pull-up max zavorra test","Strength",1,"find 3RM/2RM","120","","","W17-18 test"),ex("ae114","Rematore Bilanciere","Strength",3,"8","120","70kg","",""),ex("ae115","Chest Press","Strength",3,"10","90","40kg","",""),ex("ae116","French Press EZ","Strength",4,"12","75","","","aumenta peso"),ex("ae117","Bicipiti EZ Bar","Strength",3,"6","90","","","PESAAAANTIIII")]},{dayLabel:"Day 3",focus:"Hinge & Arms",dayType:"H",exercises:[ex("ae118","RDL @75%","Strength",3,"8","120","1RM 120kg","",""),ex("ae119","Hip Thrust","Strength",3,"10","90","65kg","",""),ex("ae120","Military Press","Strength",3,"8","120","35kg","",""),ex("ae121","Incline DB Press","Strength","2+2","6+8","120","2x24+2x22kg","",""),ex("ae122","EMOM 9': Dip+Hammer+K2C","Core",1,"EMOM 9'","0","","","")]}],
block2:[{dayLabel:"Day 1",focus:"Squat & Shoulders",dayType:"Q",exercises:[ex("ae123","T-Drill stability","Warm-Up",3,"10/gamba","0","BW","",""),ex("ae124","Back Squat @55%","Strength",4,"8","120","1RM 100kg","",""),ex("ae125","Affondi dietro","Strength",3,"8/leg","120","2x22kg","",""),ex("ae126","Leg Extension 30s on/off","Strength",4,"30s on/off","90","40kg","",""),ex("ae127","Calf Raise","Strength",4,"12","75","","",""),ex("ae128","DB Shoulder Press","Strength",4,"6","120","2x24kg","",""),ex("ae129","Lat Raise cavo","Strength",4,"max rep","0","5kg","","")]},{dayLabel:"Day 2",focus:"Push & Pull",dayType:"A",exercises:[ex("ae130","Bench Press @77%","Strength",4,"6","120","1RM 85kg","",""),ex("ae131","Pull-up @80%","Strength",5,"2","120","","",""),ex("ae132","Rematore Bilanciere","Strength",4,"8","120","70kg","",""),ex("ae133","Chest Press","Strength",4,"10","90","40kg","",""),ex("ae134","French Press EZ","Strength",5,"12","75","","",""),ex("ae135","Bicipiti EZ","Strength",4,"8","90","same","","")]},{dayLabel:"Day 3",focus:"Hinge & Arms",dayType:"H",exercises:[ex("ae136","RDL @80%+@65%","Strength","2+2","6+12","120","1RM 120kg","",""),ex("ae137","Hip Thrust","Strength",4,"6","90","70kg","",""),ex("ae138","Military Press","Strength",3,"10","120","35kg","",""),ex("ae139","Incline DB Press","Strength",4,"6","120","2x24kg","",""),ex("ae140","EMOM 9': Dip+Hammer+K2C","Core",1,"EMOM 9'","0","","","")]}],
cardio:null,running:null,levelCfg:null,durationCfg:null};

// ─── BAINI (3 blocks) ───
const BAINI_B1={id:"prog_ba1",clientId:"cl13",clientName:"Baini",level:"intermediate",monthNumber:1,sessionsPerWeek:4,sessionDuration:70,trainingLocation:"gym",includesRunning:true,cardioDaysPerWeek:1,createdAt:"2025-06-01T10:00:00Z",
block1:[{dayLabel:"Day 1",focus:"Lower Body + Push",dayType:"Q",exercises:[ex("ba1","Back Squat","Strength",3,"8","120","50kg scarico","","cura tecnica"),ex("ba2","Bulgarian Split Squat","Strength",3,"8/side","90","2x16kg","","box 45cm"),ex("ba3","Hip Thrust","Strength",3,"10","90","35kg","",""),ex("ba4","Leg Curls","Strength",3,"12","90","25-27.5kg","",""),ex("ba5","Plank commando+Fitball","Core",3,"30''+30''","30","BW","","")]},{dayLabel:"Day 2",focus:"Upper Body + Hinge",dayType:"H",exercises:[ex("ba6","RDL bilanciere","Strength",4,"6","120","35-40kg","","ecc controllata"),ex("ba7","Pull-Up assistiti EMOM 5'","Strength",5,"3","0","elastico","",""),ex("ba8","Low Pulley","Strength",3,"8","90","30kg","",""),ex("ba9","Arnold Press","Strength",3,"10","90","2x6kg","",""),ex("ba10","Lat Machine neutra","Strength",3,"6","120","40kg","",""),ex("ba11","Farmer's Hold+Plank DT","Core",3,"30''+8/side","45","2x15+1x10kg","","")]},{dayLabel:"Day 3",focus:"HYROX Circuit",dayType:"A",exercises:[ex("ba12","Panca Piana tecnica","Strength",3,"6","90","20-25kg tot","",""),ex("ba13","Incline DB Press 30°","Strength",3,"8","90","2x12kg","",""),ex("ba14","Shrimp Squat","Strength",3,"10/lato","90","BW","",""),ex("ba15","EMOM 16': Thruster+Burp+Ski","Finisher",1,"EMOM 16'","0","2x10kg","",""),ex("ba16","Bicep Curls EZ","Strength",4,"8","90","2.5kg/lato","","")]}],
block2:[{dayLabel:"Day 1",focus:"Lower Body + Push",dayType:"Q",exercises:[ex("ba17","Back Squat","Strength",4,"5","120","57.5kg RPE8","",""),ex("ba18","Bulgarian Split Squat","Strength",3,"10/side","90","2x16kg","",""),ex("ba19","Hip Thrust","Strength",4,"8","90","+5kg","",""),ex("ba20","Leg Curls","Strength",3,"15","90","25-27.5kg","",""),ex("ba21","Side Plank+Fitball","Core",3,"40''","30","BW","","")]},{dayLabel:"Day 2",focus:"Upper Body + Hinge",dayType:"H",exercises:[ex("ba22","RDL","Strength",4,"6","120","+5kg","",""),ex("ba23","Pull-Up assistiti","Strength",5,"3","120","morbido","","sul serio"),ex("ba24","Low Pulley","Strength",3,"10","90","30kg","",""),ex("ba25","Arnold Press","Strength",3,"10","90","2x7kg","",""),ex("ba26","Lat Machine r/p 6+3","Strength",3,"6+3","120","40kg","",""),ex("ba27","Farmer's Hold+Plank DT","Core",3,"40''+8/side","45","2x15+1x10kg","","")]},{dayLabel:"Day 3",focus:"HYROX Circuit",dayType:"A",exercises:[ex("ba28","Panca Piana tecnica","Strength",3,"7-8","90","25kg tot","",""),ex("ba29","Incline DB Press 30°","Strength",3,"10","90","2x12kg","",""),ex("ba30","Shrimp Squat","Strength",3,"10/lato","90","5-6kg petto","",""),ex("ba31","AMRAP 12': Run+Lunges+Burp","Finisher",1,"AMRAP 12'","0","2x10kg","",""),ex("ba32","Bicep Curls EZ","Strength",4,"10","90","2.5kg/lato","","")]}],
cardio:{block1:[mkCardio("Day 4","Easy Run","","30-35' Z2","","5")],block2:[mkCardio("Day 4","Progressive","","35': 15'easy+10'medio+10'sost","","7")]},running:null,levelCfg:null,durationCfg:null};

const BAINI_B2={id:"prog_ba2",clientId:"cl13",clientName:"Baini",level:"intermediate",monthNumber:2,sessionsPerWeek:4,sessionDuration:70,trainingLocation:"gym",includesRunning:true,cardioDaysPerWeek:1,createdAt:"2025-07-01T10:00:00Z",
block1:[{dayLabel:"Day 1",focus:"Lower Body + Push",dayType:"Q",exercises:[ex("ba33","Goblet Squat","Strength",4,"8","60","1x17.5kg","","contr ecc+conc"),ex("ba34","Split Squat statico","Strength",3,"8/side","90","1x12.5-15kg","",""),ex("ba35","Hip Thrust","Strength",3,"10","90","25kg","",""),ex("ba36","Leg Curls","Strength",3,"12","90","27.5kg","",""),ex("ba37","Stir Pot+Dead Bug","Core",3,"30''+40''","60","BW","","")]},{dayLabel:"Day 2",focus:"Upper Body + Hinge",dayType:"H",exercises:[ex("ba38","RDL manubri ecc 3s","Strength",4,"8","120","2x15kg","",""),ex("ba39","Pull-Up iso 2s top","Strength",4,"3","120","","",""),ex("ba40","Low Pulley","Strength",3,"10","90","30kg","",""),ex("ba41","Shoulder Press","Strength",3,"10","90","2x9kg","",""),ex("ba42","Lat Machine neutra","Strength",4,"8","120","35kg","",""),ex("ba43","Alzate lat+Suitcase march","Core",3,"12+16p/side","60","2x6+1x17.5kg","","")]},{dayLabel:"Day 3",focus:"HYROX Circuit",dayType:"A",exercises:[ex("ba44","Panca Piana tecnica","Strength",4,"6","90","25kg tot","",""),ex("ba45","DB Press Panca","Strength",3,"10","90","2x10kg","",""),ex("ba46","Affondi dietro","Strength",3,"10/lato","90","2x10kg","",""),ex("ba47","Circuito: 250m row+12AS+10RR","Finisher",4,"","75","2x10kg","",""),ex("ba48","Tricipiti corda","Strength",4,"8","60","10kg","","")]}],
block2:[{dayLabel:"Day 1",focus:"Lower Body + Push",dayType:"Q",exercises:[ex("ba49","Back Squat","Strength",4,"6","120","45kg","",""),ex("ba50","Bulgarian Split Squat","Strength",3,"10/side","90","2x10kg","",""),ex("ba51","Hip Thrust","Strength",4,"8","90","30kg","",""),ex("ba52","SS: TRX pull+Ham curls fitball","Strength",3,"10+15","90","","","stai bene giù"),ex("ba53","Core: DT+DB+Bicep","Core",3,"16+40''+10","60","1x8+2x7kg","","")]},{dayLabel:"Day 2",focus:"Upper Body + Hinge",dayType:"H",exercises:[ex("ba54","RDL bilanciere ecc 3s","Strength",4,"8","120","35-40kg","",""),ex("ba55","Pull-Up assistiti","Strength",4,"4","120","morbido","",""),ex("ba56","Low Pulley","Strength",4,"12","90","30kg","",""),ex("ba57","Shoulder Press","Strength",4,"10","90","2x10kg","",""),ex("ba58","Lat Machine neutra","Strength",4,"6","120","40kg","",""),ex("ba59","Alzate lat+Suitcase march","Core",4,"12+16p/side","60","2x6+1x17.5kg","","")]},{dayLabel:"Day 3",focus:"HYROX Circuit",dayType:"A",exercises:[ex("ba60","Panca Piana tecnica","Strength",5,"6","90","25kg tot","",""),ex("ba61","DB Press Panca","Strength",4,"8","90","2x12kg","",""),ex("ba62","Affondi dietro","Strength",4,"10/lato","90","2x10kg","",""),ex("ba63","AMRAP 9': KPU+Plank+Row+WB","Finisher",1,"AMRAP 9'","0","4kg","",""),ex("ba64","Tricipiti corda","Strength",4,"10","75","10kg","","")]}],
cardio:{block1:[mkCardio("Day 4","Easy Run","","30' Z2","","5")],block2:[mkCardio("Day 4","Intervals","","6x800m rec 2' ferma","","8")]},running:null,levelCfg:null,durationCfg:null};

const BAINI_B3={id:"prog_ba3",clientId:"cl13",clientName:"Baini",level:"intermediate",monthNumber:3,sessionsPerWeek:4,sessionDuration:70,trainingLocation:"gym",includesRunning:true,cardioDaysPerWeek:1,createdAt:"2025-08-01T10:00:00Z",
block1:[{dayLabel:"Day 1",focus:"Lower Body + Push",dayType:"Q",exercises:[ex("ba65","Back Squat 3s ecc+conc","Strength",4,"4","120","40kg","","auguri"),ex("ba66","Bulgarian Split Squat","Strength",4,"7/side","90","2x12.5kg","",""),ex("ba67","Hip Thrust","Strength",4,"10","90","30kg","","contrai chiappa"),ex("ba68","Low Pulley r/p 5+5","Strength",3,"5+5","90","35kg","",""),ex("ba69","Pallof+Suitcase march","Core",3,"12/side+12/side","60","elast+kb18-20kg","","")]},{dayLabel:"Day 2",focus:"Upper Body + Hinge",dayType:"H",exercises:[ex("ba70","RDL bilanciere ecc 3s","Strength","2+2","6+10","120","45-40kg","","manda video"),ex("ba71","Pull-Up EMOM 6'","Strength",6,"3","0","nero/viola","",""),ex("ba72","Shoulder Press","Strength","2+2","6+10","120","2x12+2x10kg","",""),ex("ba73","Lat Pulldown","Strength",3,"10","120","17.5kg","",""),ex("ba74","Core: 4' plank fitball","Core",1,"4'","0","","","minor serie")]},{dayLabel:"Day 3",focus:"HYROX Circuit",dayType:"A",exercises:[ex("ba75","Panca Piana","Strength",4,"6","90","27.5kg","","feedback?"),ex("ba76","Affondi dietro","Strength",3,"8/lato","90","2x12kg","",""),ex("ba77","EMOM 12': Burp+BJ+Press","Finisher",1,"EMOM 12'","0","","",""),ex("ba78","Tricipiti corda","Strength",3,"8","60","12.kg","","")]}],
block2:[{dayLabel:"Day 1",focus:"Lower Body + Push",dayType:"Q",exercises:[ex("ba79","Back Squat pausa 2s","Strength",5,"3","120","45kg","","tensione spinta"),ex("ba80","Bulgarian Split Squat","Strength",4,"8/side","90","2x12.5kg","",""),ex("ba81","Hip Thrust","Strength",4,"10","90","35kg","",""),ex("ba82","Low Pulley","Strength",4,"10","90","35kg","",""),ex("ba83","Pallof+Suitcase march","Core",4,"12/side+12/side","60","kb20kg","","")]},{dayLabel:"Day 2",focus:"Upper Body + Hinge",dayType:"H",exercises:[ex("ba84","RDL bilanciere ecc 3s","Strength","2+2","6+10","120","45-40kg","",""),ex("ba85","Pull-Up assistiti","Strength",5,"3","90","1 piede elast","",""),ex("ba86","Shoulder Press","Strength","3+1","6+10","120","2x12+2x10kg","",""),ex("ba87","Lat Pulldown","Strength",3,"12","120","17.5kg","",""),ex("ba88","Core: 5' plank fitball","Core",1,"5'","0","","","")]},{dayLabel:"Day 3",focus:"HYROX Circuit",dayType:"A",exercises:[ex("ba89","Panca Piana","Strength","2+3","4+5","120","28.5+27.5kg","",""),ex("ba90","Affondi dietro","Strength",3,"10/lato","90","2x12kg","",""),ex("ba91","Circ: 300m row+16 gorilla row","Finisher",4,"","75","2x12kg","",""),ex("ba92","Tricipiti corda","Strength",4,"8","75","12.5kg","","")]}],
cardio:{block1:[mkCardio("Day 4","Progressive","","30' ogni 5'→9→11.5km/h","","7")],block2:[mkCardio("Day 4","Intervals","","10x500m rec 1'30'' spingili","","9")]},running:null,levelCfg:null,durationCfg:null};

// ─── BENEDETTA BAINI (2 blocks) ───
const BBAINI_B1={id:"prog_bb1",clientId:"cl14",clientName:"Benedetta Baini",level:"beginner",monthNumber:1,sessionsPerWeek:3,sessionDuration:60,trainingLocation:"gym",includesRunning:false,cardioDaysPerWeek:0,createdAt:"2025-09-01T10:00:00Z",
block1:[{dayLabel:"Giorno 1",focus:"Lower Body (Front Squat + Glutei)",dayType:"Q",exercises:[ex("bb1","Circuito: Hollow+SP+Situp","Core",3,"30s+30s+12","60","10kg","",""),ex("bb2","Front Squat Multipower 3-1-1","Strength",4,"6","120","2x20kg","",""),ex("bb3","Hip Thrust Multipower","Strength",4,"12","120","2x40kg","",""),ex("bb4","Affondi dietro bilanciere","Strength",3,"10/gb","120","30kg","",""),ex("bb5","Leg Curl","Strength",4,"12","75","25kg","","")]},{dayLabel:"Giorno 2",focus:"Upper Body + Metcon",dayType:"A",exercises:[ex("bb6","Lat Machine larga","Strength",4,"8","120","35kg","",""),ex("bb7","T-Bar Row","Strength",3,"12","120","15+25kg","",""),ex("bb8","Shoulder Press manubri","Strength",4,"6+10","0","10-9kg","","6-6+10-10"),ex("bb9","Alzate Laterali","Strength",3,"12","0","9kg","",""),ex("bb10","EMOM 12': 200m run+10 burp+14WB+14RS","Finisher",1,"EMOM 12'","0","6kg+20kg","","")]},{dayLabel:"Giorno 3",focus:"Glutei + Petto + Trazioni",dayType:"G",exercises:[ex("bb11","Trazioni elastico","Strength",4,"4","120","","",""),ex("bb12","RDL bilanciere","Strength",3,"12","120","47.5kg","",""),ex("bb13","Hip Thrust macchina","Strength",3,"15","90","+35kg","",""),ex("bb14","Abductor machine","Strength",4,"20","75","55kg","",""),ex("bb15","Bench DB Press inclinata","Strength",3,"10","90","2x12kg","",""),ex("bb16","SS: max KPU + Plank ST","Finisher",3,"max+30''","90","","","")]}],
block2:[{dayLabel:"Giorno 1",focus:"Lower Body",dayType:"Q",exercises:[ex("bb17","Circuito: Hollow+SP+Situp","Core",3,"30s+30s+15","0","10kg","",""),ex("bb18","Front Squat MW pausa 2''","Strength",4,"4","120","2x22.5kg","",""),ex("bb19","Hip Thrust Multipower","Strength",4,"8","90","2x50kg","",""),ex("bb20","Affondi dietro bb","Strength",3,"10/gb","0","35kg","",""),ex("bb21","Leg Curl","Strength",3,"30''","60","20kg","",""),ex("bb22","Wall sit","Strength",2,"1'","0","BW","","")]},{dayLabel:"Giorno 2",focus:"Upper Body + Metcon",dayType:"A",exercises:[ex("bb23","Lat Machine r/p 6+6","Strength",4,"6+6","0","35kg","","pausa 15s"),ex("bb24","T-Bar Row","Strength",4,"10","120","40kg tot","",""),ex("bb25","Shoulder Press man","Strength",4,"8","120","10kg","",""),ex("bb26","Alzate Laterali","Strength",3,"14","75","9kg","",""),ex("bb27","AMRAP 15': 200m row+10burp+12RR+14SO","Finisher",1,"AMRAP 15'","0","2x15kg","","")]},{dayLabel:"Giorno 3",focus:"Glutei + Petto + Trazioni",dayType:"G",exercises:[ex("bb28","Trazioni ecc 3''+neg 3x3","Strength","2+3","4+3","120","","","no elastico"),ex("bb29","RDL bilanciere","Strength",3,"10","90","52.5kg","",""),ex("bb30","Hip Thrust macchina","Strength",4,"10","120","+40kg","",""),ex("bb31","Abductor machine","Strength",4,"15","75","60kg","",""),ex("bb32","DB Press 1½ ROM","Strength",3,"8","90","2x10kg","",""),ex("bb33","SS: max PU iso+V-sit-up","Finisher",3,"max+10","60","","","")]}],
cardio:null,running:null,levelCfg:null,durationCfg:null};

const BBAINI_B2={id:"prog_bb2",clientId:"cl14",clientName:"Benedetta Baini",level:"beginner",monthNumber:2,sessionsPerWeek:3,sessionDuration:60,trainingLocation:"gym",includesRunning:false,cardioDaysPerWeek:0,createdAt:"2025-10-01T10:00:00Z",
block1:[{dayLabel:"Day 1",focus:"Lower + Core",dayType:"Q",exercises:[ex("bb34","Back Squat @60%","Strength",4,"8","150","","","track load"),ex("bb35","B-Stance RDL","Strength",3,"10","90","2x12.5kg","",""),ex("bb36","BB Lunges indietro","Strength",3,"10/gamba","90","25kg tot","",""),ex("bb37","Hip Thrust","Strength",4,"15","90","+20kg","",""),ex("bb38","Hollow+SP+Dead Bug","Core",3,"30s each","60","","","")]},{dayLabel:"Day 2",focus:"Upper + Conditioning",dayType:"A",exercises:[ex("bb39","Pull-Ups assisted","Strength",4,"4","180","","",""),ex("bb40","DB Bench Press","Strength",4,"8","90","2x9kg","",""),ex("bb41","OH DB Press","Strength",4,"8","90","2x7kg","",""),ex("bb42","DB 1 Arm Row","Strength",3,"12","90","1x14kg","",""),ex("bb43","EMOM 9': 10row+8burp+6snatch","Finisher",1,"EMOM 9'","0","2x8kg","","")]},{dayLabel:"Day 3",focus:"Hinge + Push",dayType:"H",exercises:[ex("bb44","Deadlift @60%","Strength",4,"8","150","","",""),ex("bb45","Leg Curl","Strength",3,"12","90","22.5kg","",""),ex("bb46","Chest Press","Strength",4,"8","90","22.5kg","",""),ex("bb47","Lat Machine","Strength",3,"12","120","30kg","",""),ex("bb48","Core: PU+V-ups+Plank ST","Core",3,"8+16+24","60","","","")]}],
block2:[{dayLabel:"Day 1",focus:"Lower + Core",dayType:"Q",exercises:[ex("bb49","Back Squat @62.5%","Strength",4,"8","150","","",""),ex("bb50","B-Stance RDL","Strength",4,"10","90","2x16kg","",""),ex("bb51","Bulgarian Split Squat","Strength",3,"12","90","2x10kg","",""),ex("bb52","Core: Plank slide+K2C","Core",3,"30s each","60","","","")]},{dayLabel:"Day 2",focus:"Upper + Conditioning",dayType:"A",exercises:[ex("bb53","Pull-Ups assisted","Strength",4,"6","180","","",""),ex("bb54","DB Bench Press","Strength",4,"8","90","2x10kg","",""),ex("bb55","OH Press","Strength",4,"9","90","","",""),ex("bb56","DB 1 Arm Row","Strength",4,"12","90","","",""),ex("bb57","5R: 200m run+8burp+6thruster","Finisher",5,"","60","2x10kg","","")]},{dayLabel:"Day 3",focus:"Hinge + Push",dayType:"H",exercises:[ex("bb58","Deadlift @67.5%","Strength",4,"8","150","","",""),ex("bb59","Leg Curl","Strength",3,"12","90","25kg","",""),ex("bb60","Chest Press","Strength",4,"12","90","25kg","",""),ex("bb61","Lat Machine","Strength",4,"10","120","35kg","",""),ex("bb62","Core: Plank slide+K2C","Core",3,"30s each","60","","","")]}],
cardio:null,running:null,levelCfg:null,durationCfg:null};

// ─── BASCO (3 blocks) ───
const BASCO_B1={id:"prog_bs1",clientId:"cl15",clientName:"Basco",level:"advanced",monthNumber:1,sessionsPerWeek:5,sessionDuration:90,trainingLocation:"gym",includesRunning:true,cardioDaysPerWeek:2,createdAt:"2025-06-01T10:00:00Z",
block1:[{dayLabel:"Day 1",focus:"Strength A (Upper+Core)",dayType:"A",exercises:[ex("bs1","Military Press","Strength",5,"5","120","20kg","",""),ex("bs2","Pull-up assisted","Strength",4,"max rep","120","","",""),ex("bs3","Seated DB Shoulder Press","Strength",3,"10","90","2x8kg","","no schienale"),ex("bs4","Barbell Row","Strength",4,"8","90","35kg","",""),ex("bs5","Push-up a onda","Strength",3,"10","60","BW","","ecc lenta"),ex("bs6","Plank ST+Side Plank","Core",3,"20+40''","45","BW","","")]},{dayLabel:"Day 3",focus:"Strength B (Full Body)",dayType:"Q",exercises:[ex("bs7","Back Squat @70%","Strength",4,"6","120","max 65kg","",""),ex("bs8","Romanian Deadlift BB","Strength",3,"8","90","35kg","",""),ex("bs9","DB Walking Lunge","Strength",3,"12/leg","75","peso gara","",""),ex("bs10","DB Bench Press","Strength",3,"10","90","2x7kg","",""),ex("bs11","Plank Reach+Farmer Carry","Core",3,"30''+50m","60","peso gara","","")]},{dayLabel:"Day 4",focus:"Hyrox Specific",dayType:"A",exercises:[ex("bs12","Lat Machine","Strength",4,"10","90","32kg","",""),ex("bs13","5RFT: 400m+500mSki+Sled+Thru+WB","Finisher",1,"5 RFT","0","","","peso gara")]}],
block2:[{dayLabel:"Day 1",focus:"Strength A (Upper+Core)",dayType:"A",exercises:[ex("bs14","Military Press","Strength",5,"5","120","22.5kg","","pushpress+ecc lenta"),ex("bs15","Pull-up assisted","Strength",4,"6","120","","",""),ex("bs16","Seated DB Shoulder Press","Strength",4,"8","90","2x9kg","",""),ex("bs17","Barbell Row","Strength",4,"10","90","35kg","",""),ex("bs18","Push-up a onda","Strength",3,"12","60","BW","",""),ex("bs19","Plank ST+Side Plank","Core",3,"24+45''","45","BW","","")]},{dayLabel:"Day 3",focus:"Strength B (Full Body)",dayType:"Q",exercises:[ex("bs20","Back Squat ecc 3'' @75%","Strength",4,"5","120","","",""),ex("bs21","RDL ecc 3''","Strength",3,"10","90","35kg","",""),ex("bs22","DB Walking Lunge","Strength",3,"10/leg","90","2x12kg","",""),ex("bs23","DB Bench Press","Strength",3,"8","90","2x8kg","",""),ex("bs24","Dead Hung+Farmer Carry","Core",3,"30''+50m","60","peso gara","","")]},{dayLabel:"Day 4",focus:"Hyrox Specific",dayType:"A",exercises:[ex("bs25","Lat Machine","Strength",4,"8","90","35kg","",""),ex("bs26","Hip Thrust","Strength",3,"12","90","100kg","",""),ex("bs27","E4MOM 20': 250m row+25WB","Finisher",1,"E4MOM 20'","0","6kg","",""),ex("bs28","Bicipiti","Strength",4,"10","75","","","Pesanti :)")]}],
cardio:{block1:[mkCardio("Day 2","Speed Run","10'+andature","6x400m @90% rec 2' jog","8-10'","9"),mkCardio("Day 5","Long Run Z2","","10k","","5")],block2:[mkCardio("Day 2","Speed Run","10'+andature","6x600m @80% rec 90'' jog","8-10'","8"),mkCardio("Day 5","Long Run Z2","","10-12k","","5")]},running:null,levelCfg:null,durationCfg:null};

const BASCO_B2={id:"prog_bs2",clientId:"cl15",clientName:"Basco",level:"advanced",monthNumber:2,sessionsPerWeek:5,sessionDuration:90,trainingLocation:"gym",includesRunning:true,cardioDaysPerWeek:2,createdAt:"2025-07-01T10:00:00Z",
block1:[{dayLabel:"Day 1",focus:"Strength A (Upper)",dayType:"A",exercises:[ex("bs29","Military Press 1-0-2","Strength",4,"4","120","22.5kg","",""),ex("bs30","Pull-up negativi","Strength",4,"5","120","no band","",""),ex("bs31","Arnold Press","Strength",4,"8","90","2x7kg","",""),ex("bs32","Bench Supported Row","Strength",3,"8","90","2x15kg","",""),ex("bs33","Ring Row elev","Strength",2,"12","60","BW","",""),ex("bs34","Hollow+Pallof","Core",3,"30''+30''/side","60","","","")]},{dayLabel:"Day 3",focus:"Strength B (Full Body)",dayType:"Q",exercises:[ex("bs35","Back Squat @82-85%","Strength",5,"3","150","","","+2.5kg se ok"),ex("bs36","RDL BB","Strength",3,"6","90","42.5kg","",""),ex("bs37","Bulgarian Split Squat","Strength",3,"6/leg","90","2x15kg","",""),ex("bs38","DB Bench Press","Strength",4,"7","90","2x10kg","",""),ex("bs39","Suitcase Carry+Side Plank","Core",3,"50m+30''","60","peso gara","","")]},{dayLabel:"Day 4",focus:"Hyrox Specific",dayType:"A",exercises:[ex("bs40","SS: Lat Machine+PU","Strength",4,"10+6","120","32-35kg","",""),ex("bs41","E5MOM x6: 500m Row+400m Ski","Finisher",6,"","0","","","")]}],
block2:[{dayLabel:"Day 1",focus:"Strength A (Upper)",dayType:"A",exercises:[ex("bs42","Military Press","Strength","3+2","3+6","120","23.5-20kg","",""),ex("bs43","Pull-up assisted","Strength",3,"8","120","","",""),ex("bs44","Arnold Press","Strength",4,"8","90","2x7kg","",""),ex("bs45","Chest-Supported Row","Strength",4,"8","90","2x16kg","",""),ex("bs46","Ring Row elev","Strength",3,"12","60","BW","",""),ex("bs47","Hollow+Pallof","Core",3,"40''+30''/side","60","","","")]},{dayLabel:"Day 3",focus:"Strength B (Full Body)",dayType:"Q",exercises:[ex("bs48","Back Squat @85-88%","Strength",5,"3","150","","","usa spotter"),ex("bs49","RDL pause 1''","Strength",2,"12","120","40kg","",""),ex("bs50","Bulgarian Split Squat","Strength",3,"8/leg","90","2x15kg","",""),ex("bs51","DB Bench Press","Strength",4,"8","90","2x10kg","",""),ex("bs52","Farmer's Hold","Core",4,"60''","30","peso gara","","")]},{dayLabel:"Day 4",focus:"Hyrox Specific",dayType:"A",exercises:[ex("bs53","Chipper: 1k run cash in/out","Finisher",1,"For Time","0","","",""),ex("bs54","500mRow+40WB+30Burp+20Ski+10m sled","Finisher",1,"","0","6kg+peso gara","",""),ex("bs55","Bicipiti","Strength",5,"8","75","","","Pesantiiiii")]}],
cardio:{block1:[mkCardio("Day 2","Intervals","10'","5x1000m rec 2' walk ritmo gara","8-10'","8"),mkCardio("Day 5","Long Run Z2","","12k","","5")],block2:[mkCardio("Day 2","Intervals","10'","4x1200m @85% rec 3' ferma","8-10'","8"),mkCardio("Day 5","Long Run Z2","","8k","","5")]},running:null,levelCfg:null,durationCfg:null};

const BASCO_B3={id:"prog_bs3",clientId:"cl15",clientName:"Basco",level:"advanced",monthNumber:3,sessionsPerWeek:5,sessionDuration:90,trainingLocation:"gym",includesRunning:true,cardioDaysPerWeek:2,createdAt:"2025-08-01T10:00:00Z",
block1:[{dayLabel:"Day 1",focus:"Strength A (Upper)",dayType:"A",exercises:[ex("bs56","Push Press","Strength",5,"3-4","120","25kg","",""),ex("bs57","Pull-up","Strength",3,"6","120","elast leggero","",""),ex("bs58","Half Kneeling Press","Strength",3,"max rep","90","10kg","",""),ex("bs59","Chest-Supported Row","Strength",4,"7","90","2x17.5kg","","esplodere"),ex("bs60","Ring Row elev","Strength",2,"12","60","BW","",""),ex("bs61","Hollow+Pallof","Core",3,"40''+30''/side","60","","","")]},{dayLabel:"Day 3",focus:"Strength B (Full Body)",dayType:"Q",exercises:[ex("bs62","Back Squat @85-90%","Strength",6,"2","180","","","qualità > ego"),ex("bs63","Hip Thrust","Strength",3,"10","120","115kg","",""),ex("bs64","DB Bench Press r/p","Strength",4,"5+5","90","2x10kg","",""),ex("bs65","Farmer's Carry","Core",3,"100m","60","peso gara+","","")]},{dayLabel:"Day 4",focus:"Hyrox Specific",dayType:"A",exercises:[ex("bs66","SS: 1 Arm Row+PU","Strength",4,"12+7","120","17.5kg","",""),ex("bs67","Chipper FT 30': 800m+Row+Sled+Lunges+BurpBJ+WB","Finisher",1,"For Time","0","6kg","","")]}],
block2:[{dayLabel:"Day 1",focus:"Strength A SCARICO",dayType:"A",exercises:[ex("bs68","Push Press","Strength",3,"5","120","23.5kg","",""),ex("bs69","Pull-up","Strength",3,"6","120","elast leggero","",""),ex("bs70","Shoulder Press","Strength",3,"8","120","2x10kg","",""),ex("bs71","Chest-Supported Row","Strength",3,"10","90","2x16kg","",""),ex("bs72","Ring Row","Strength",3,"12","60","BW","",""),ex("bs73","Hollow+Pallof","Core",3,"30''+30''/side","60","","","")]},{dayLabel:"Day 3",focus:"Strength B SCARICO",dayType:"Q",exercises:[ex("bs74","Back Squat @70%","Strength",3,"6","150","","","scarico/taper"),ex("bs75","DB Reverse Lunge","Strength",3,"10/leg","90","2x12.5kg","",""),ex("bs76","DB Bench Press","Strength",3,"8","90","2x10kg","",""),ex("bs77","Lat Machine","Strength",3,"10","90","35-32kg","","")]},{dayLabel:"Day 4",focus:"Hyrox Specific",dayType:"A",exercises:[ex("bs78","Lat Machine r/p","Strength",4,"5+5","90","35kg","",""),ex("bs79","Hip Thrust","Strength",4,"10","90","110kg","",""),ex("bs80","FT 4R: 600m+400mRow+Sled+Farmer+Lunges+WB","Finisher",1,"For Time TC 35'","0","6kg","","")]}],
cardio:{block1:[mkCardio("Day 2","Intervals","10'","10x500m @85-90% rec 90'' ferma","8-10'","9"),mkCardio("Day 5","Long Run Z2","","13k","","5")],block2:[mkCardio("Day 2","Easy Intervals","10'","3x1200m @70% rec 3' jog EASY","8-10'","5"),mkCardio("Day 5","Long Run Z2","","7-8k","","5")]},running:null,levelCfg:null,durationCfg:null};

// ─── BAINI Foundation (Blocco_1 W1-6) ───
const Strength="Strength",Core="Core",Finisher="Finisher";

const BAINI_B0={id:"prog_ba0",clientId:"cl13",clientName:"Baini",level:"intermediate",monthNumber:0,sessionsPerWeek:4,sessionDuration:70,trainingLocation:"gym",includesRunning:true,cardioDaysPerWeek:1,createdAt:"2025-05-01T10:00:00Z",
block1:[{dayLabel:"Day 1",focus:"Lower Body + Core",dayType:"Q",exercises:[ex("ba100","Back Squat",Strength,3,"6","150","52.5kg","",""),ex("ba101","Bulgarian Split Squat",Strength,3,"6","90","2x17.5kg","",""),ex("ba102","Hip Thrust",Strength,4,"10","90","25kg","",""),ex("ba103","Hollow Rocks+Plank Fitball",Core,3,"40''","30","BW","","")]},{dayLabel:"Day 2",focus:"Upper Body + Conditioning",dayType:"A",exercises:[ex("ba104","Pull-Up assistiti",Strength,5,"5","180","","",""),ex("ba105","Incline DB Press 30°",Strength,3,"8","90","2x12kg","",""),ex("ba106","Arnold Press",Strength,3,"10","90","2x7kg","",""),ex("ba107","Row Macchinario",Strength,3,"12","90","22.5kg/lato","",""),ex("ba108","EMOM 9': 15WB+12Burp+9Row","Finisher",1,"EMOM 9'","0","6kg","","")]},{dayLabel:"Day 3",focus:"Full Body / Posterior",dayType:"H",exercises:[ex("ba109","Deadlift @75%",Strength,4,"4","150","","",""),ex("ba110","B-stance RDL manubri",Strength,3,"12","90","2x15kg","",""),ex("ba111","Lat Machine neutra",Strength,3,"10","90","35-30kg","",""),ex("ba112","Wallwalk+Box Jumps 60cm",Finisher,3,"3+10","60","","",""),ex("ba113","Dead Bug+Plank ST",Core,3,"40''","30","BW","","")]}],
block2:[{dayLabel:"Day 1",focus:"Lower Body + Core",dayType:"Q",exercises:[ex("ba114","Back Squat",Strength,5,"5","150","55kg","",""),ex("ba115","Reverse Lunge+Hip Thrust SS",Strength,3,"10/gb+12","120","2x15+30kg","",""),ex("ba116","Hyperextension",Strength,3,"15","90","15kg","",""),ex("ba117","Plank Drag+V-Ups",Core,3,"40''","30","12kg","","")]},{dayLabel:"Day 2",focus:"Upper Body + Conditioning",dayType:"A",exercises:[ex("ba118","Pull-Up",Strength,6,"5","180","","",""),ex("ba119","DB Floor Press+OH Press SS",Strength,3,"10","90","2x14+2x9kg","",""),ex("ba120","Chest Supported Row",Strength,3,"10","90","2x16kg","",""),ex("ba121","Push-Up inclinati",Strength,3,"8","90","bb a 3","",""),ex("ba122","Tricipiti Corda",Strength,3,"12","90","10kg","","")]},{dayLabel:"Day 3",focus:"Full Body / Posterior",dayType:"H",exercises:[ex("ba123","Deadlift ecc 3'' @70%",Strength,4,"6","150","","",""),ex("ba124","SS: RDL+Double Row",Strength,3,"12+10","90","2x18+2x12.5kg","",""),ex("ba125","Lat Machine neutra",Strength,3,"12","90","35-30kg","",""),ex("ba126","Hollow Hold+Knee Tuck",Core,3,"40''","30","","","")]}],
cardio:{block1:[mkCardio("Day 4","Intervals W1","","6x600m @13.5km/h rec 1' walk","","8"),mkCardio("Day 4","Circuit W2","","4RFT: 500m+15GS+12WB+9PP+6Burp","","9")],block2:[mkCardio("Day 4","Tempo Run W5","","6k medium pace","","6"),mkCardio("Day 4","AMRAP W6","","25' AMRAP: 200m+10Thr+10SO+15AS+10Burp","","9")]},running:null,levelCfg:null,durationCfg:null};

// ─── BASCO HYROX Torino Prep (Blocco_2 + 1025) ───
const BASCO_B4={id:"prog_bs4",clientId:"cl15",clientName:"Basco",level:"advanced",monthNumber:4,sessionsPerWeek:5,sessionDuration:90,trainingLocation:"gym",includesRunning:true,cardioDaysPerWeek:2,createdAt:"2025-09-01T10:00:00Z",
block1:[{dayLabel:"Day 1",focus:"Strength A (Upper)",dayType:"A",exercises:[ex("bs81","Push Press",Strength,5,"5","120","25kg","",""),ex("bs82","Pull-up EMOM 6'",Strength,6,"3","0","elastico","",""),ex("bs83","DB Bench Press",Strength,4,"8","90","2x10kg","",""),ex("bs84","Chest-Supported Row",Strength,3,"10","90","2x17.5kg","",""),ex("bs85","Accumulo 100 WB 6kg",Finisher,1,"100","0","","","8 burp ogni stop")]},{dayLabel:"Day 3",focus:"Strength B (Full Body)",dayType:"Q",exercises:[ex("bs86","Back Squat @65-70%",Strength,4,"6/5","180","","","scarichiamo"),ex("bs87","Bench Press",Strength,3,"6","90","22.5kg","",""),ex("bs88","Hip Thrust",Strength,4,"6","120","125kg","",""),ex("bs89","Shoulder Press 90°",Strength,3,"6","120","2x12kg","",""),ex("bs90","Circ Grip: K2C+StepUp+TRXpull",Finisher,3,"","60","2x10kg","",""),ex("bs91","Bicipiti Man",Strength,4,"8","75","2x7kg","","")]},{dayLabel:"Day 4",focus:"Hyrox Specific",dayType:"A",exercises:[ex("bs92","Feet Elev TRX Pullup",Strength,4,"3-4","90","","","simulare pullup"),ex("bs93","Squat Bulgari DB",Strength,3,"8","120","2x17.5kg","",""),ex("bs94","Erg: 500m row+500m ski",Finisher,3,"","60","","","75% effort"),ex("bs95","AMRAP 9': 8WB8kg+8BJO+8snatch10kg",Finisher,1,"AMRAP 9'","0","","","4-5 round goal")]}],
block2:[{dayLabel:"Day 1",focus:"Strength A (Upper)",dayType:"A",exercises:[ex("bs96","Military Press",Strength,5,"3","120","25kg","",""),ex("bs97","Pull-up TEST",Strength,3,"2","120","elastico leggero","",""),ex("bs98","DB Bench Press",Strength,4,"8","90","2x10kg","",""),ex("bs99","1 Arm Row",Strength,3,"8","90","1x20kg","",""),ex("bs100","SS: 10thr+10WB",Finisher,3,"","90","2x10+6kg","","")]},{dayLabel:"Day 3",focus:"Strength B (Full Body)",dayType:"Q",exercises:[ex("bs101","Back Squat 3s ecc+conc @50-75%",Strength,5,"3-4","180","","",""),ex("bs102","Bench Press",Strength,4,"6","90","22.5kg","",""),ex("bs103","Hip Thrust",Strength,4,"8","120","125kg","",""),ex("bs104","Shoulder Press 90°",Strength,4,"6","120","2x12kg","",""),ex("bs105","Circ Grip: K2C+Lunges+RR",Finisher,3,"","90","2x15kg","",""),ex("bs106","Bicipiti Man",Strength,4,"10","75","2x7kg","","")]},{dayLabel:"Day 4",focus:"Hyrox Specific",dayType:"A",exercises:[ex("bs107","Feet Elev TRX Pullup",Strength,4,"5","90","","",""),ex("bs108","Squat Bulgari DB",Strength,3,"10","120","2x17.5kg","",""),ex("bs109","Erg: 10x250m rec 30s",Finisher,1,"","0","","",""),ex("bs110","12cal AB+20m sled push",Finisher,3,"","60","peso gara","","")]}],
cardio:{block1:[mkCardio("Day 2","Fartlek","10'+andature","30' 1'vel+1'lenta","8-10'","7"),mkCardio("Day 5","Long Run Z2","","12k","","5")],block2:[mkCardio("Day 2","Fartlek","10'+andature","30' 2'vel+1'lenta","8-10'","7"),mkCardio("Day 5","Progressive","","12k ogni 3k: 5'40→5'20→5'00→4'45","","7")]},running:null,levelCfg:null,durationCfg:null};

const BASCO_B5={id:"prog_bs5",clientId:"cl15",clientName:"Basco",level:"advanced",monthNumber:5,sessionsPerWeek:5,sessionDuration:90,trainingLocation:"gym",includesRunning:true,cardioDaysPerWeek:2,createdAt:"2025-10-01T10:00:00Z",
block1:[{dayLabel:"Day 1",focus:"Strength A (Upper)",dayType:"A",exercises:[ex("bs111","Military Press",Strength,4,"4","120","25kg","","daje"),ex("bs112","Pull-up 3s conc+ecc",Strength,3,"3","120","","",""),ex("bs113","DB Bench Press",Strength,4,"10","90","2x10kg","",""),ex("bs114","1 Arm Row r/p",Strength,"2+2","8+10","90","20+18kg","",""),ex("bs115","EMOM 10': 8 WB 8kg",Finisher,1,"EMOM 10'","0","","","")]},{dayLabel:"Day 3",focus:"Strength B (Full Body)",dayType:"Q",exercises:[ex("bs116","Back Squat @80%",Strength,3,"3","180","","",""),ex("bs117","Bench Press",Strength,3,"8","120","25kg","",""),ex("bs118","Hip Thrust r/p",Strength,"2+2","8+10","120","125-120kg","",""),ex("bs119","Shoulder Press 90° r/p",Strength,3,"4+4","90","2x12kg","",""),ex("bs120","Core+Grip: FH+DragThru+Hollow",Core,3,"30s each","60","2x20+10kg","",""),ex("bs121","Bicipiti optional",Strength,3,"12","75","2x7kg","","")]},{dayLabel:"Day 4",focus:"Hyrox Specific",dayType:"A",exercises:[ex("bs122","RDL bilanciere",Strength,3,"10","90","40kg","",""),ex("bs123","Squat Bulgari BB",Strength,4,"8","90","35kg","",""),ex("bs124","Erg: 12cal ski+12GHD/TTB",Finisher,4,"","60","","",""),ex("bs125","Every 2'30''x3: 15s AB+20m BurpBBJ+20m sled",Finisher,3,"","0","peso gara","","")]}],
block2:[{dayLabel:"Day 1",focus:"Strength A Race Week",dayType:"A",exercises:[ex("bs126","Military Press",Strength,3,"6","90","22.5kg","",""),ex("bs127","Pull-up EMOM 4'",Strength,4,"2","0","","",""),ex("bs128","DB Bench Press",Strength,3,"6","90","2x12kg","",""),ex("bs129","Double Row+Hollow",Strength,3,"10+30s","90","2x15kg","",""),ex("bs130","EMOM 4': 6 elev pushup",Finisher,1,"EMOM 4'","0","","","")]},{dayLabel:"Day 3",focus:"Strength B Race Week",dayType:"Q",exercises:[ex("bs131","Back Squat @80%",Strength,4,"2","120","","",""),ex("bs132","Bench Press",Strength,3,"6","90","26kg","",""),ex("bs133","Hip Thrust",Strength,3,"10","120","125kg","",""),ex("bs134","Shoulder Press 90°",Strength,3,"7","90","2x12kg","",""),ex("bs135","1k Row+1k Ski",Finisher,1,"","0","","","blando")]}],
cardio:{block1:[mkCardio("Day 2","Soglia/Lattacide","10'+andature","2x4x1'max+1'walk rec 4' / 4x300m 3'","8-10'","9"),mkCardio("Day 5","Easy Run","","8k","","5")],block2:[mkCardio("Day 2","5k veloci","10'+andature","5k @4'50''/km","8-10'","8"),mkCardio("Day 5","Easy Run","","40' sciogli gambe","","4")]},running:null,levelCfg:null,durationCfg:null};

const BASCO_B6={id:"prog_bs6",clientId:"cl15",clientName:"Basco",level:"advanced",monthNumber:6,sessionsPerWeek:5,sessionDuration:90,trainingLocation:"gym",includesRunning:true,cardioDaysPerWeek:2,createdAt:"2025-11-01T10:00:00Z",
block1:[{dayLabel:"Day 1",focus:"Strength A (Upper)",dayType:"A",exercises:[ex("bs136","Military Press",Strength,"2+2","6+5","120","22.5-25kg","",""),ex("bs137","Pull-up EMOM 5'",Strength,5,"2","0","","",""),ex("bs138","DB Bench Press",Strength,3,"8","90","2x12kg","",""),ex("bs139","1 Arm Row",Strength,3,"10","90","1x18kg","",""),ex("bs140","EMOM 10': 8 WB 8kg",Finisher,1,"EMOM 10'","0","","","")]},{dayLabel:"Day 3",focus:"Strength B (Full Body)",dayType:"Q",exercises:[ex("bs141","Back Squat @65%",Strength,3,"8","120","","",""),ex("bs142","Bench Press ecc 3s",Strength,3,"5","120","25kg","",""),ex("bs143","Hip Thrust",Strength,4,"8","60","125kg","",""),ex("bs144","Shoulder Press 90°",Strength,3,"7-8","90","2x12kg","",""),ex("bs145","Core+Grip: DH+HBR+Scap PU",Core,3,"30s+30s+10","60","","",""),ex("bs146","Bicipiti optional",Strength,4,"10","90","2x7kg","","")]},{dayLabel:"Day 4",focus:"Total Body",dayType:"A",exercises:[ex("bs147","RDL bilanciere r/p",Strength,"2+2","6+10","120","50+42.5kg","",""),ex("bs148","Squat Bulgari BB",Strength,3,"6","120","40kg","",""),ex("bs149","Pullups elastico spesso",Strength,4,"max rep","120","","",""),ex("bs150","E2'30''x4: 250m row+10BJO",Finisher,4,"","0","","","")]}],
block2:[{dayLabel:"Day 1",focus:"Pre-Gara Lunedì",dayType:"A",exercises:[ex("bs151","Back Squat",Strength,"2+2","6@70%+4@75%","150","","","taper"),ex("bs152","Hip Thrust",Strength,3,"10","90","110kg","",""),ex("bs153","DB Bench Press",Strength,3,"10","90","2x10kg","",""),ex("bs154","Lat Machine",Strength,3,"12","90","35-32kg","",""),ex("bs155","Bicipiti Man",Strength,3,"10","75","2x6kg","","")]},{dayLabel:"Day 3",focus:"Pre-Gara Giovedì",dayType:"A",exercises:[ex("bs156","PHA 4R: 10RR+10GS+10DragThru",Finisher,4,"","90","","","attivazione"),ex("bs157","Pull-up ecc 3s",Strength,3,"6","120","elast leggero","",""),ex("bs158","SS: 12RR+12StepUpOver",Strength,3,"","90","2x12.5kg","",""),ex("bs159","Core: FH+WoodChop+PlankComm",Core,3,"","60","2x24+10kg","","")]}],
cardio:{block1:[mkCardio("Day 2","Fartlek","10'+andature","5x1000m rec 2' jog @4:45/km","8-10'","8"),mkCardio("Day 5","Long Run","","9k easy","","5")],block2:[mkCardio("Day 2","5k sostenuto","","5k sostenuto @5'15''/km","","7"),mkCardio("Day 4","Easy Run Z2","","7k + stretching","","4")]},running:null,levelCfg:null,durationCfg:null};

// ─── BIAGIONI (3 blocks) ───

const BIAGIONI_B1={id:"prog_bi1",clientId:"cl16",clientName:"Biagioni",level:"beginner",monthNumber:1,sessionsPerWeek:3,sessionDuration:60,trainingLocation:"gym",includesRunning:false,cardioDaysPerWeek:0,createdAt:"2025-09-01T10:00:00Z",
block1:[{dayLabel:"Day 1",focus:"Lower + Core",dayType:"Q",exercises:[ex("bi1","Back Squat @60%",Strength,4,"8","150","30-35kg","",""),ex("bi2","B-Stance RDL",Strength,3,"10","90","2x9kg","",""),ex("bi3","BB Lunges indietro",Strength,3,"10/gamba","90","15kg tot","",""),ex("bi4","Hip Thrust",Strength,3,"15","90","+15kg","",""),ex("bi5","Hollow+SP+Dead Bug",Core,3,"30s each","60","","","")]},{dayLabel:"Day 2",focus:"Upper + Conditioning",dayType:"A",exercises:[ex("bi6","Pull-Ups assisted",Strength,4,"3","180","","",""),ex("bi7","DB Bench Press",Strength,4,"8","90","2x9kg","",""),ex("bi8","OH DB Press",Strength,4,"8","90","2x7kg","",""),ex("bi9","DB 1 Arm Row",Strength,3,"12","90","1x12kg","",""),ex("bi10","EMOM 9': 8ski+6burp+6snatch",Finisher,1,"EMOM 9'","0","2x7kg","","")]},{dayLabel:"Day 3",focus:"Hinge + Push",dayType:"H",exercises:[ex("bi11","Deadlift @60%",Strength,4,"8","150","35-40kg","",""),ex("bi12","Leg Curl",Strength,3,"12","90","20kg","",""),ex("bi13","Chest Press",Strength,4,"8","90","22.5kg","",""),ex("bi14","Lat Machine",Strength,3,"12","120","30kg","",""),ex("bi15","Core: PU+V-ups+Plank ST",Core,3,"8+16+24","60","","","")]}],
block2:[{dayLabel:"Day 1",focus:"Lower + Core",dayType:"Q",exercises:[ex("bi16","Back Squat ecc 3'' @62.5%",Strength,4,"5","150","37.5kg","",""),ex("bi17","DB RDL",Strength,4,"10","150","2x12.5kg","",""),ex("bi18","Bulgarian Split Squat",Strength,3,"12","90","2x8kg","",""),ex("bi19","Plank slide+K2C",Core,3,"30s each","60","","","")]},{dayLabel:"Day 2",focus:"Upper + Conditioning",dayType:"A",exercises:[ex("bi20","Pull-Ups assisted",Strength,4,"5","180","","",""),ex("bi21","DB Bench Press",Strength,4,"8","90","2x10kg","",""),ex("bi22","OH Press",Strength,4,"9","90","","",""),ex("bi23","DB 1 Arm Row",Strength,4,"12","90","","",""),ex("bi24","3R: 200m+8burp+6pushpress",Finisher,3,"","60","2x9kg","","")]},{dayLabel:"Day 3",focus:"Hinge + Push",dayType:"H",exercises:[ex("bi25","Deadlift @65-70%",Strength,4,"5","150","47.5kg","",""),ex("bi26","Leg Curl",Strength,3,"12","90","25kg","",""),ex("bi27","Chest Press",Strength,3,"8","90","27.5kg","",""),ex("bi28","Lat Machine",Strength,4,"10","120","35kg","",""),ex("bi29","Plank slide+K2C",Core,3,"40s each","60","","","")]}],
cardio:null,running:null,levelCfg:null,durationCfg:null};

const BIAGIONI_B2={id:"prog_bi2",clientId:"cl16",clientName:"Biagioni",level:"beginner",monthNumber:2,sessionsPerWeek:3,sessionDuration:60,trainingLocation:"gym",includesRunning:false,cardioDaysPerWeek:0,createdAt:"2025-11-01T10:00:00Z",
block1:[{dayLabel:"Day 1",focus:"Lower + Push",dayType:"Q",exercises:[ex("bi30","Back Squat ecc 3'' RPE7",Strength,3,"6","120","32.5kg","",""),ex("bi31","RDL Bilanciere RPE7",Strength,3,"8","120","30kg","",""),ex("bi32","Hip Thrust",Strength,4,"10","90","20kg","",""),ex("bi33","Dead Bug+Side Plank",Core,3,"30s each","0","","",""),ex("bi34","Circ 4RFT: Curls+TRX+FC",Finisher,4,"10+10+50m","0","2x17.5kg","","")]},{dayLabel:"Day 2",focus:"Upper + Conditioning",dayType:"A",exercises:[ex("bi35","Pull-Up assistite",Strength,4,"3","120","","",""),ex("bi36","DB Bench Press 30°",Strength,4,"8","90","2x9kg","",""),ex("bi37","Arnold Press seduta",Strength,3,"10","90","2x6kg","",""),ex("bi38","T-Bar Row",Strength,3,"10","0","","",""),ex("bi39","EMOM 9': 200m row+12WB+15Vup",Finisher,1,"EMOM 9'","0","6kg","","")]},{dayLabel:"Day 3",focus:"Hinge + Push",dayType:"H",exercises:[ex("bi40","Deadlift tecnico",Strength,4,"4","120","","",""),ex("bi41","Leg Curl",Strength,3,"12","90","","",""),ex("bi42","Chest Press",Strength,3,"8","90","","",""),ex("bi43","Lat Machine pausa 1s",Strength,4,"10","90","30kg","",""),ex("bi44","Pushup eccentrici",Strength,3,"3","90","BW","",""),ex("bi45","Tricipiti corda",Strength,3,"10","0","10kg","","")]}],
block2:[{dayLabel:"Day 1",focus:"Lower + Push",dayType:"Q",exercises:[ex("bi46","Back Squat RPE7",Strength,4,"6","120","","",""),ex("bi47","RDL Bilanciere RPE7 ecc 3s",Strength,4,"8","120","","",""),ex("bi48","Hip Thrust pausa 2s",Strength,4,"10","90","","",""),ex("bi49","Dead Bug+Side Plank",Core,4,"30s each","0","","",""),ex("bi50","Circ 4RFT: Curls+TRX+FC",Finisher,4,"","0","","","")]},{dayLabel:"Day 2",focus:"Upper + Conditioning",dayType:"A",exercises:[ex("bi51","Pull-Up assistite r/p",Strength,"3","3+2","120","","",""),ex("bi52","DB Bench Press 30°",Strength,4,"8","90","2x10kg","",""),ex("bi53","Arnold Press ecc 2s",Strength,4,"10","90","","",""),ex("bi54","T-Bar Row",Strength,4,"10","0","","",""),ex("bi55","EMOM 12': 8Burp+10Thr+12Row",Finisher,1,"EMOM 12'","0","2x9kg","","")]},{dayLabel:"Day 3",focus:"Hinge + Push",dayType:"H",exercises:[ex("bi56","Deadlift 2x5+2x3",Strength,"2+2","5+3","120","","","medi+pesanti"),ex("bi57","Leg Curl",Strength,3,"12","90","","",""),ex("bi58","Chest Press",Strength,4,"8","90","","",""),ex("bi59","Lat Machine fermo 2s",Strength,4,"8","90","30kg","",""),ex("bi60","Pushup eccentrici",Strength,4,"3","90","BW","",""),ex("bi61","Tricipiti corda",Strength,3,"12","0","","","")]}],
cardio:null,running:null,levelCfg:null,durationCfg:null};

const BIAGIONI_B3={id:"prog_bi3",clientId:"cl16",clientName:"Biagioni",level:"beginner",monthNumber:3,sessionsPerWeek:3,sessionDuration:60,trainingLocation:"gym",includesRunning:false,cardioDaysPerWeek:0,createdAt:"2025-12-01T10:00:00Z",
block1:[{dayLabel:"Day 1",focus:"Lower + Push",dayType:"Q",exercises:[ex("bi62","Russian Twist+Hollow Rocks",Core,3,"20+15","60","1x8kg","",""),ex("bi63","Back Squat",Strength,4,"3","120","40kg","","feedback??"),ex("bi64","RDL Bilanciere",Strength,3,"8","120","35kg","",""),ex("bi65","DB Bench Press piana",Strength,3,"6","120","2x10kg","",""),ex("bi66","EMOM 6': KPU+Row",Finisher,1,"EMOM 6'","0","","",""),ex("bi67","Tricipiti corda",Strength,3,"12","75","10kg","","")]},{dayLabel:"Day 2",focus:"Upper + Hip Thrust",dayType:"A",exercises:[ex("bi68","Pull-Up assistite",Strength,"1+3","5+3","120","","",""),ex("bi69","Hip Thrust",Strength,3,"10","120","+30kg","","spingi chiappeeee"),ex("bi70","Shoulder Press",Strength,"2+2","6+12","120","2x9+2x7kg","",""),ex("bi71","1 Arm Row",Strength,3,"12","90","1x15kg","",""),ex("bi72","Abductors",Strength,3,"15","75","35kg","","")]},{dayLabel:"Day 3",focus:"Hinge + Push",dayType:"H",exercises:[ex("bi73","Deadlift",Strength,3,"6","120","45kg","",""),ex("bi74","Chest Press",Strength,3,"8","120","25kg","",""),ex("bi75","Lat Machine neutra",Strength,4,"6","120","35kg","",""),ex("bi76","Circ: 250m run+12WB",Finisher,3,"3RFT","0","6kg","","for time")]}],
block2:[{dayLabel:"Day 1",focus:"Lower + Push",dayType:"Q",exercises:[ex("bi77","Russian Twist+Hollow Rocks",Core,4,"20+15","60","1x8kg","",""),ex("bi78","Back Squat",Strength,4,"5","120","40kg","",""),ex("bi79","RDL Bilanciere ecc 3s",Strength,4,"8","120","35kg","",""),ex("bi80","DB Bench Press piana",Strength,3,"8","120","2x10kg","",""),ex("bi81","EMOM 6': 6ski+8BJ50cm",Finisher,1,"EMOM 6'","0","","",""),ex("bi82","Tricipiti r/p 5+5+5",Strength,3,"5+5+5","75","10kg","","")]},{dayLabel:"Day 2",focus:"Upper + Hip Thrust",dayType:"A",exercises:[ex("bi83","Pull-Up assistite",Strength,"2+3","5+3","120","","",""),ex("bi84","Hip Thrust",Strength,3,"12","120","+30kg","",""),ex("bi85","Shoulder Press",Strength,"2+2","8+10","120","2x9+2x8kg","",""),ex("bi86","1 Arm Row",Strength,3,"8","90","1x16kg","",""),ex("bi87","Abductors",Strength,3,"20","75","35kg","","")]},{dayLabel:"Day 3",focus:"Hinge + Push",dayType:"H",exercises:[ex("bi88","Deadlift",Strength,4,"3","120","52.5kg","",""),ex("bi89","Chest Press",Strength,4,"8","120","25kg","",""),ex("bi90","Lat Machine r/p",Strength,"3+1","8+10","120","35+30kg","",""),ex("bi91","Circ: 250m run+12WB",Finisher,4,"4RFT","0","6kg","","for time, no rest")]}],
cardio:null,running:null,levelCfg:null,durationCfg:null};

// ─── BULLA (1 block) ───
const BULLA_B1={id:"prog_bu1",clientId:"cl17",clientName:"Bulla",level:"beginner",monthNumber:1,sessionsPerWeek:4,sessionDuration:60,trainingLocation:"gym",includesRunning:false,cardioDaysPerWeek:0,createdAt:"2025-10-01T10:00:00Z",
block1:[{dayLabel:"Giorno 1",focus:"Squat + Shoulders",dayType:"Q",exercises:[ex("bu1","Plank Hold+Drag Through",Core,3,"30s+12","60","8kg","",""),ex("bu2","Back Squat RPE6",Strength,4,"10","120","25-30kg","","manda video pls"),ex("bu3","Reverse Lunge RPE8",Strength,3,"10/10","90","2x10kg","","lav gamba ant"),ex("bu4","Shoulder Press 90°",Strength,3,"10","90","2x6kg","","gomiti chiusi"),ex("bu5","Leg Extension",Strength,3,"10","90","25-30kg","",""),ex("bu6","Alzate Laterali",Strength,3,"10","75","2x4kg","","controllati")]},{dayLabel:"Giorno 2",focus:"Deadlift + Pull",dayType:"H",exercises:[ex("bu7","Deadlift RPE7",Strength,3,"8","120","40-42.5kg","","manda video"),ex("bu8","Rematore Bilanciere RPE8",Strength,4,"8","120","25-30kg","",""),ex("bu9","Lat Machine neutra",Strength,3,"8","120","30kg","","giù spalle petto fuori"),ex("bu10","Hip Thrust",Strength,3,"10","120","","",""),ex("bu11","Leg Curl",Strength,3,"10","90","20-22.5kg","",""),ex("bu12","Bicipiti Man",Strength,3,"10","75","2x6kg","","")]},{dayLabel:"Giorno 3",focus:"RDL + Push",dayType:"H",exercises:[ex("bu13","RDL Barbell RPE7",Strength,3,"8","120","35-40kg","","manda video"),ex("bu14","Chest Press",Strength,4,"8","120","20kg","",""),ex("bu15","Bulgarian Split Squat RPE9",Strength,3,"8/8","120","2x10kg","",""),ex("bu16","Abductor Machine",Strength,3,"15","60","35-45kg","","tronco 45°"),ex("bu17","Cable Triceps",Strength,3,"12","75","10-12kg","",""),ex("bu18","Hollow+V-up",Core,3,"25'' each","60","BW","","")]},{dayLabel:"Giorno 4",focus:"Glute + Circuit",dayType:"G",exercises:[ex("bu19","Hip Thrust",Strength,4,"8","120","","",""),ex("bu20","Lat Machine",Strength,3,"10","90","25kg","",""),ex("bu21","Pushup Negativi",Strength,3,"5","90","BW","","solo discesa"),ex("bu22","Rematore BB",Strength,3,"10","90","25kg","",""),ex("bu23","Circ: 10TRXpull+10GS+10RS",Finisher,3,"","75","12kg","","")]}],
block2:[{dayLabel:"Giorno 1",focus:"Squat + Shoulders",dayType:"Q",exercises:[ex("bu24","Plank Hold+Drag Through",Core,4,"30s+12","60","8kg","",""),ex("bu25","Back Squat RPE7",Strength,4,"8","120","","",""),ex("bu26","Reverse Lunge RPE8",Strength,3,"12/12","90","","",""),ex("bu27","Shoulder Press 90°",Strength,4,"10","90","","",""),ex("bu28","Leg Extension",Strength,3,"10","90","","",""),ex("bu29","Alzate Laterali",Strength,3,"12","75","","","")]},{dayLabel:"Giorno 2",focus:"Deadlift + Pull",dayType:"H",exercises:[ex("bu30","Deadlift RPE7.5",Strength,4,"6","120","","",""),ex("bu31","Rematore BB RPE8",Strength,4,"8","120","","",""),ex("bu32","Lat Machine neutra",Strength,4,"8","120","","",""),ex("bu33","Hip Thrust",Strength,4,"10","120","","",""),ex("bu34","Leg Curl",Strength,3,"12","90","","",""),ex("bu35","Bicipiti Man",Strength,4,"10","75","","","")]},{dayLabel:"Giorno 3",focus:"RDL + Push",dayType:"H",exercises:[ex("bu36","RDL Barbell RPE7.5",Strength,4,"8","120","","",""),ex("bu37","Chest Press",Strength,4,"10","120","","",""),ex("bu38","Bulgarian Split Squat RPE9",Strength,3,"10/10","120","","",""),ex("bu39","Abductor Machine",Strength,3,"20","60","","",""),ex("bu40","Cable Triceps",Strength,3,"12","75","","",""),ex("bu41","Hollow+V-up",Core,3,"30'' each","60","","","")]},{dayLabel:"Giorno 4",focus:"Glute + Circuit",dayType:"G",exercises:[ex("bu42","Hip Thrust",Strength,4,"8","120","","",""),ex("bu43","Lat Machine",Strength,3,"12","90","","",""),ex("bu44","Pushup Negativi",Strength,3,"6","90","","",""),ex("bu45","Rematore BB",Strength,3,"10","90","","",""),ex("bu46","Circ: 10TRXpull+10GS+10RS",Finisher,4,"","75","","","")]}],
cardio:null,running:null,levelCfg:null,durationCfg:null};

// ─── MARTINA (1 block) ───
const MARTINA_B1={id:"prog_mt1",clientId:"cl18",clientName:"Martina",level:"beginner",monthNumber:1,sessionsPerWeek:3,sessionDuration:60,trainingLocation:"gym",includesRunning:false,cardioDaysPerWeek:0,createdAt:"2025-10-01T10:00:00Z",
block1:[{dayLabel:"Day 1",focus:"Lower + Core",dayType:"Q",exercises:[ex("mt1","B-Stance RDL",Strength,3,"10","90","2x10kg","",""),ex("mt2","BB Reverse Lunges",Strength,3,"10/gamba","90","15kg tot","",""),ex("mt3","Hip Thrust Multipower",Strength,3,"15","90","60kg tot","",""),ex("mt4","Hollow+SP+Dead Bug",Core,3,"30s each","60","","",""),ex("mt5","Bicipiti manubri",Strength,3,"12","60","2x5kg","","")]},{dayLabel:"Day 2",focus:"Upper + Conditioning",dayType:"A",exercises:[ex("mt6","Pull-Ups assisted",Strength,4,"3","120","elastico","",""),ex("mt7","DB Bench Press",Strength,4,"8","90","2x8-10kg","",""),ex("mt8","OH DB Press Panca",Strength,4,"8","90","2x8kg","",""),ex("mt9","Seated Row",Strength,3,"12","90","25kg","",""),ex("mt10","EMOM 9': 8ski+6burp+20vups",Finisher,1,"EMOM 9'","0","","","")]},{dayLabel:"Day 3",focus:"Hinge + Push",dayType:"H",exercises:[ex("mt11","Deadlift classico RPE7",Strength,4,"8","150","35-40kg","",""),ex("mt12","Leg Curl",Strength,3,"10","90","25kg","",""),ex("mt13","Lat Machine",Strength,3,"12","120","30-25kg","",""),ex("mt14","Alzate Laterali",Strength,3,"10","75","2x5-6kg","",""),ex("mt15","Core: V-ups+Plank ST",Core,3,"8+16+24","60","","","")]}],
block2:[{dayLabel:"Day 1",focus:"Lower + Core",dayType:"Q",exercises:[ex("mt16","Back Squat RPE6",Strength,4,"6","120","25kg","","tecnica"),ex("mt17","B-Stance RDL",Strength,3,"12","120","2x15kg","",""),ex("mt18","Step-Ups",Strength,3,"10/side","90","1x5-7kg","",""),ex("mt19","Hollow+SP+Dead Bug+5kg",Core,3,"30s each","60","","","")]},{dayLabel:"Day 2",focus:"Upper + Conditioning",dayType:"A",exercises:[ex("mt20","Pull-Ups assisted",Strength,4,"4","180","","",""),ex("mt21","DB Bench Press ecc 3''",Strength,3,"8","90","","",""),ex("mt22","OH Press",Strength,4,"10","90","","",""),ex("mt23","DB 1 Arm Row",Strength,4,"8","90","1x14kg","",""),ex("mt24","EMOM 9': 250mSki+15WB+10RR",Finisher,1,"EMOM 9'","0","6+10kg","","")]},{dayLabel:"Day 3",focus:"Hinge + Push",dayType:"H",exercises:[ex("mt25","Deadlift 3s ecc+conc",Strength,4,"5","150","40kg","",""),ex("mt26","Leg Curl",Strength,3,"10","90","25kg","",""),ex("mt27","Lat Machine",Strength,4,"8","120","35kg","",""),ex("mt28","Core: RT12kg+Plank March",Core,3,"8+16+24","60","12kg","","")]}],
cardio:null,running:null,levelCfg:null,durationCfg:null};

const INITIAL_PRGS = {
  cl5: [REDINI_B1, REDINI_B2, REDINI_B3],
  cl6: [BENVENUTI_B1, BENVENUTI_B2, BENVENUTI_B3],
  cl7: [CARDONI_B1, CARDONI_B2, CARDONI_B3],
  cl8: [ADAMOLI_B1],
  cl9: [AGRATI_B1, AGRATI_B2],
  cl10: [ALLEGRI_B4],
  cl11: [SAVINO_B1],
  cl12: [ASSERETO_B1, ASSERETO_B2, ASSERETO_B3, ASSERETO_B4],
  cl13: [BAINI_B0, BAINI_B1, BAINI_B2, BAINI_B3],
  cl14: [BBAINI_B1, BBAINI_B2],
  cl15: [BASCO_B1, BASCO_B2, BASCO_B3, BASCO_B4, BASCO_B5, BASCO_B6],
  cl16: [BIAGIONI_B1, BIAGIONI_B2, BIAGIONI_B3],
  cl17: [BULLA_B1],
  cl18: [MARTINA_B1],
};

// ─── SUPABASE ───
const SUPA_URL = "https://wvbyrqevjuukkwjwzicj.supabase.co";
const SUPA_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind2YnlycWV2anV1a2t3and6aWNqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAzNzg3NjQsImV4cCI6MjA4NTk1NDc2NH0.FAOa7BFMOTftWVPlBJzWx5lJRhnaR-Yl8ktYrHcf2CY";
const supaFetch = (path, { method = "GET", body, prefer } = {}) =>
  fetch(`${SUPA_URL}/rest/v1/${path}`, { method, headers: { apikey: SUPA_KEY, Authorization: `Bearer ${SUPA_KEY}`, "Content-Type": "application/json", ...(prefer ? { Prefer: prefer } : {}) }, ...(body ? { body: JSON.stringify(body) } : {}) })
  .then(r => r.ok ? (r.status === 204 ? [] : r.json()) : r.text().then(t => { console.error("Supa:", t); return []; }));

const clToDb = c => ({ id: c.id, name: c.name, email: c.email || "", phone: c.phone || "", level: c.level, month_number: c.monthNumber || 1, sessions_per_week: c.sessionsPerWeek || 3, session_duration: c.sessionDuration || 60, day3_type: c.day3Type || "glute", training_location: c.trainingLocation || "gym", cardio_days_per_week: c.cardioDaysPerWeek || 0, goals: c.goals || "", health_notes: c.healthNotes || "", injuries: c.injuries || [], includes_running: c.includesRunning || false, start_date: c.startDate || "", status: c.status || "active" });
const clFromDb = r => ({ id: r.id, name: r.name, email: r.email, phone: r.phone, level: r.level, monthNumber: r.month_number, sessionsPerWeek: r.sessions_per_week, sessionDuration: r.session_duration, day3Type: r.day3_type, trainingLocation: r.training_location, cardioDaysPerWeek: r.cardio_days_per_week, goals: r.goals, healthNotes: r.health_notes, injuries: r.injuries, includesRunning: r.includes_running, startDate: r.start_date, status: r.status });
const prToDb = p => ({ id: p.id, client_id: p.clientId, client_name: p.clientName, level: p.level, month_number: p.monthNumber, sessions_per_week: p.sessionsPerWeek || 3, session_duration: p.sessionDuration || 60, training_location: p.trainingLocation || "gym", includes_running: p.includesRunning || false, cardio_days_per_week: p.cardioDaysPerWeek || 0, block1: p.block1, block2: p.block2, cardio: p.cardio || null, running: p.running || null, level_cfg: p.levelCfg || null, duration_cfg: p.durationCfg || null, created_at: p.createdAt });
const sanitizeExercises = (block) => { if (!block || !Array.isArray(block)) return block; return block.map(day => ({ ...day, exercises: (day.exercises || []).map(ex => ({ ...ex, sets: (ex.sets !== undefined && ex.sets !== null && String(ex.sets) !== "undefined") ? ex.sets : "", reps: (ex.reps !== undefined && ex.reps !== null && String(ex.reps) !== "undefined") ? ex.reps : "", weight: ex.weight || "—", rpe: ex.rpe || "", notes: ex.notes || "", rest: ex.rest || 0 })) })); };
const prFromDb = r => { const mn = r.month_number || 1; const phases = ["foundation","hypertrophy","strength","deload"]; const ph = { foundation: "Foundation", hypertrophy: "Hypertrophy", strength: "Strength", deload: "Deload" }[phases[(mn - 1) % 4]] || ""; return { id: r.id, clientId: r.client_id, clientName: r.client_name, level: r.level, monthNumber: mn, sessionsPerWeek: r.sessions_per_week, sessionDuration: r.session_duration, trainingLocation: r.training_location, includesRunning: r.includes_running, cardioDaysPerWeek: r.cardio_days_per_week, block1: sanitizeExercises(r.block1), block2: sanitizeExercises(r.block2), cardio: r.cardio, running: r.running, levelCfg: r.level_cfg, durationCfg: r.duration_cfg, createdAt: r.created_at, phase: ph }; };
const dbLoad = table => supaFetch(`${table}?select=*&order=${table === "clients" ? "name" : "created_at"}`);
const dbSave = (table, data) => supaFetch(table, { method: "POST", body: data, prefer: "return=representation,resolution=merge-duplicates" });
const dbDelete = (table, id) => supaFetch(`${table}?id=eq.${id}`, { method: "DELETE" });

// ─── MAIN ───
export default function App() {
  const [pg, setPg] = useState("dashboard");
  const [cls, setCls] = useState([]);
  const [prgs, setPrgs] = useState({});
  const [selCl, setSelCl] = useState(null);
  const [selPr, setSelPr] = useState(null);
  const [showCM, setShowCM] = useState(false);
  const [editCl, setEditCl] = useState(null);
  const [confDel, setConfDel] = useState(null);
  const [confDelPr, setConfDelPr] = useState(null);
  const [showImport, setShowImport] = useState(false);
  const [sq, setSq] = useState("");
  const [ntf, setNtf] = useState(null);
  const [loading, setLoading] = useState(true);
  const notify = (m, t = "success") => { setNtf({ m, t }); setTimeout(() => setNtf(null), 3000); };

  useEffect(() => {
    (async () => {
      try {
        let clients = await dbLoad("clients");
        if (!Array.isArray(clients)) clients = [];
        
        // Remove fake/old clients (cl1-cl4) if present
        const fakeIds = ["cl1","cl2","cl3","cl4"];
        const hasOld = clients.some(c => fakeIds.includes(c.id));
        if (hasOld) {
          for (const fid of fakeIds) {
            await supaFetch(`clients?id=eq.${fid}`, { method: "DELETE" });
          }
          clients = clients.filter(c => !fakeIds.includes(c.id));
        }
        
        // Seed all real clients if DB was empty or sync missing ones
        if (clients.length === 0) {
          await dbSave("clients", SAMPLE_CLIENTS.map(clToDb));
          clients = SAMPLE_CLIENTS;
        } else {
          clients = clients.map(clFromDb);
          const existIds = new Set(clients.map(c => c.id));
          const missing = SAMPLE_CLIENTS.filter(c => !existIds.has(c.id));
          if (missing.length > 0) {
            await dbSave("clients", missing.map(clToDb));
            clients = [...clients, ...missing];
          }
        }

        let programs = await dbLoad("programs");
        if (!Array.isArray(programs)) programs = [];
        if (programs.length === 0) {
          const allProgs = Object.values(INITIAL_PRGS).flat();
          await dbSave("programs", allProgs.map(prToDb));
          programs = allProgs;
        } else {
          programs = programs.map(prFromDb);
          // Sync missing programs
          const existPIds = new Set(programs.map(p => p.id));
          const allInit = Object.values(INITIAL_PRGS).flat();
          const missingP = allInit.filter(p => !existPIds.has(p.id));
          if (missingP.length > 0) {
            await dbSave("programs", missingP.map(prToDb));
            programs = [...programs, ...missingP];
          }
        }

        setCls(clients);
        const grouped = {};
        programs.forEach(p => { if (!grouped[p.clientId]) grouped[p.clientId] = []; grouped[p.clientId].push(p); });
        Object.keys(grouped).forEach(k => grouped[k].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)));
        setPrgs(grouped);
      } catch (e) {
        console.error("Load error:", e);
        setCls(SAMPLE_CLIENTS);
        setPrgs(INITIAL_PRGS);
      }
      setLoading(false);
    })();
  }, []);
  const actCls = cls.filter(c => c.status === "active");

  function ClForm({ client, onSave, onClose }) {
    const [f, setF] = useState(client || { name: "", email: "", phone: "", level: "beginner", goals: "", healthNotes: "", injuries: [], includesRunning: false, monthNumber: 1, sessionsPerWeek: 3, sessionDuration: 60, day3Type: "glute", trainingLocation: "gym", cardioDaysPerWeek: 0, startDate: new Date().toISOString().split("T")[0], status: "active" });
    const [ii, setII] = useState("");
    return (
      <Mdl title={client ? "Edit Client" : "New Client"} onClose={onClose}>
        <Inp label="Full Name" value={f.name} onChange={v => setF({ ...f, name: v })} placeholder="e.g., Sofia Marchetti" />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}><Inp label="Email" value={f.email} onChange={v => setF({ ...f, email: v })} placeholder="email@example.com" /><Inp label="Phone" value={f.phone} onChange={v => setF({ ...f, phone: v })} placeholder="+39 ..." /></div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}><Inp label="Level" value={f.level} onChange={v => setF({ ...f, level: v })} options={[{ value: "beginner", label: "Beginner" }, { value: "intermediate", label: "Intermediate" }, { value: "advanced", label: "Advanced" }]} /><Inp label="Month #" value={f.monthNumber} onChange={v => setF({ ...f, monthNumber: parseInt(v) || 1 })} type="number" /><Inp label="Start Date" value={f.startDate} onChange={v => setF({ ...f, startDate: v })} type="date" /></div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}><Inp label="Sessions / Week" value={f.sessionsPerWeek} onChange={v => setF({ ...f, sessionsPerWeek: parseInt(v) })} options={[{ value: 2, label: "2 days/week" }, { value: 3, label: "3 days/week" }, { value: 4, label: "4 days/week" }, { value: 5, label: "5 days/week" }]} /><Inp label="Session Duration" value={f.sessionDuration} onChange={v => setF({ ...f, sessionDuration: parseInt(v) })} options={[{ value: 45, label: "45 min" }, { value: 60, label: "60 min" }, { value: 75, label: "75 min" }, { value: 90, label: "90 min" }]} /></div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}><Inp label="Training Location" value={f.trainingLocation || "gym"} onChange={v => setF({ ...f, trainingLocation: v })} options={[{ value: "gym", label: "🏋️ Gym" }, { value: "home", label: "🏠 Home Gym" }]} /><Inp label="Cardio Days / Week" value={f.cardioDaysPerWeek || 0} onChange={v => setF({ ...f, cardioDaysPerWeek: parseInt(v) })} options={[{ value: 0, label: "None" }, { value: 1, label: "1 day" }, { value: 2, label: "2 days" }, { value: 3, label: "3 days" }]} /></div>
        {f.sessionsPerWeek === 3 && <Inp label="Day 3 Focus" value={f.day3Type || "glute"} onChange={v => setF({ ...f, day3Type: v })} options={[{ value: "glute", label: "Glute Focus" }, { value: "fullbody", label: "Full Body" }]} />}
        <div style={{ background: K.ab, border: "1px solid " + K.ac + "30", borderRadius: 8, padding: 12, marginBottom: 14 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: K.ac, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>Weekly Split Preview</div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>{buildDaySchedule(f.sessionsPerWeek, f.day3Type || "glute").map((t, i) => { const labels = { A: "Push+Squat", B: "Pull+Hinge", Q: "Quad+Push", H: "Hinge+Pull", G: "Glute Focus", F: "Full Body" }; const colors = { A: "#5dade2", B: "#f0a030", Q: "#5dade2", H: "#f0a030", G: "#e74c3c", F: "#2ecc71" }; return <span key={i} style={{ padding: "4px 10px", borderRadius: 6, fontSize: 12, fontWeight: 600, background: colors[t] + "25", color: colors[t] }}>Day {i+1}: {labels[t]}</span>; })}</div>
          {(f.cardioDaysPerWeek || 0) > 0 && <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 6 }}>{Array.from({ length: f.cardioDaysPerWeek }, (_, i) => <span key={"c"+i} style={{ padding: "4px 10px", borderRadius: 6, fontSize: 12, fontWeight: 600, background: "rgba(46,204,113,0.15)", color: "#2ecc71" }}>Cardio {i+1}</span>)}</div>}
          <div style={{ fontSize: 11, color: K.td, marginTop: 6 }}>{f.trainingLocation === "home" ? "🏠 Home" : "🏋️ Gym"} · {f.sessionDuration} min · {(f.sessionsPerWeek || 3) + (f.cardioDaysPerWeek || 0)} total days/week</div>
        </div>
        <Inp label="Goals" value={f.goals} onChange={v => setF({ ...f, goals: v })} textarea placeholder="Strength, weight loss, muscle tone..." />
        <Inp label="Health Notes" value={f.healthNotes} onChange={v => setF({ ...f, healthNotes: v })} textarea placeholder="Any conditions, medications..." />
        <div style={{ marginBottom: 14 }}><label style={{ display: "block", marginBottom: 6, fontSize: 12, fontWeight: 600, color: K.tm, textTransform: "uppercase", letterSpacing: "0.05em" }}>Injuries</label><input value={ii} onChange={e => setII(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && ii.trim()) { setF({ ...f, injuries: [...(f.injuries || []), ii.trim()] }); setII(""); } }} placeholder="Type + Enter" style={{ width: "100%", padding: "8px 12px", background: K.sf, border: "1px solid " + K.bd, borderRadius: 8, color: K.tx, fontSize: 13, fontFamily: ff, outline: "none", boxSizing: "border-box", marginBottom: 8 }} /><div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>{(f.injuries || []).map((inj, i) => <span key={i} onClick={() => setF({ ...f, injuries: f.injuries.filter((_, j) => j !== i) })} style={{ padding: "3px 10px", borderRadius: 6, fontSize: 12, background: K.dgb, color: K.dg, cursor: "pointer" }}>{inj} ×</span>)}</div></div>
        {(f.cardioDaysPerWeek || 0) === 0 && <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", fontSize: 13, color: K.tx, marginBottom: 20 }}><div onClick={() => setF({ ...f, includesRunning: !f.includesRunning })} style={{ width: 40, height: 22, borderRadius: 11, background: f.includesRunning ? K.ac : K.bd, position: "relative", cursor: "pointer" }}><div style={{ position: "absolute", top: 2, left: f.includesRunning ? 20 : 2, width: 18, height: 18, borderRadius: 9, background: f.includesRunning ? "#0a0a0c" : K.tm, transition: "all 0.2s" }} /></div>Include running sessions</label>}
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}><Btn v="secondary" onClick={onClose}>Cancel</Btn><Btn onClick={() => { if (!f.name.trim()) return; onSave({ ...f, id: f.id || "cl_" + Date.now() }); }}>{client ? "Save" : "Add Client"}</Btn></div>
      </Mdl>
    );
  }

  // ─── PDF GENERATION ───
  const pdfIcon = <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6"/><path d="M12 18v-6"/><path d="M9 15l3 3 3-3"/></svg>;

  const exportPDF = (prog) => {
    try {
    const fmtSR = (ex) => { if (!ex) return ""; const s = (ex.sets != null && String(ex.sets) !== "undefined") ? ex.sets : ""; const r = (ex.reps != null && String(ex.reps) !== "undefined") ? ex.reps : ""; return (s || r) ? `${s}×${r}` : ""; };
    const fmtRest = (r) => { if (r === undefined || r === null || r === "") return ""; const n = parseInt(r); if (!n || isNaN(n)) return String(r || ""); return n >= 120 ? (n / 60) + "'" : n + "''"; };
    const accent = [15, 30, 75]; const accentText = [130, 200, 255]; const headerBg = [20, 40, 90]; const rowAlt = [235, 243, 255]; const white = [255, 255, 255];
    const clientName = prog.clientName || "Client";
    const monthNum = prog.monthNumber || 1;

    const buildBlockPDF = (doc, blockData, blockNum, weekLabel, cardioData, runningData) => {
      const W = doc.internal.pageSize.getWidth();
      const H = doc.internal.pageSize.getHeight();
      const margin = 12;

      // Block title page
      doc.addPage();
      let y = margin;
      doc.setFillColor(...accent);
      doc.rect(0, 0, W, 22, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.setTextColor(...white);
      doc.text(`${clientName} — Blocco ${monthNum} · ${weekLabel}`, margin, 14);
      doc.setFontSize(9);
      doc.setTextColor(...accentText);
      doc.text(`${(prog.level || "").toUpperCase()} · ${prog.sessionsPerWeek || 3}x/week · ${prog.sessionDuration || 60}min · ${prog.trainingLocation === "home" ? "Home Gym" : "Gym"}`, W - margin, 14, { align: "right" });
      y = 28;

      // Days
      if (blockData) {
        for (let di = 0; di < blockData.length; di++) {
          const day = blockData[di];
          if (!day) continue;
          const exs = day.exercises || [];

          const estHeight = 12 + exs.length * 6.5 + 8;
          if (y + estHeight > H - 10) { doc.addPage(); y = margin; }

          // Day header
          doc.setFillColor(15, 30, 75);
          doc.rect(margin, y, W - margin * 2, 8, "F");
          doc.setFont("helvetica", "bold");
          doc.setFontSize(10);
          doc.setTextColor(255, 255, 255);
          doc.text(`${(day.dayLabel || "").toUpperCase()} — ${(day.focus || "").toUpperCase()}`, margin + 4, y + 5.5);
          y += 10;

          const rows = [];
          let lastSection = "";
          for (let ei = 0; ei < exs.length; ei++) {
            const ex = exs[ei];
            if (!ex) continue;

            if (ex.section && ex.section !== lastSection && ex.section !== "Warm-Up") {
              if (lastSection !== "" || ei > 0) {
                rows.push([{ content: ex.section.toUpperCase(), colSpan: 6, styles: { fillColor: [25, 50, 110], textColor: [130, 200, 255], fontStyle: "bold", fontSize: 7, cellPadding: 1.5 } }]);
              }
              lastSection = ex.section;
            } else if (ei === 0 && ex.section) { lastSection = ex.section; }

            const name = (ex.name || "") + (ex.circuit ? " (" + ex.circuit.join(", ") + ")" : "");
            const sets = (ex.sets !== undefined && ex.sets !== null && ex.sets !== "" && String(ex.sets) !== "undefined" && String(ex.sets) !== "null") ? String(ex.sets) : "";
            const reps = (ex.reps !== undefined && ex.reps !== null && ex.reps !== "" && String(ex.reps) !== "undefined" && String(ex.reps) !== "null") ? String(ex.reps) : "";
            const weight = ex.weight || "—";
            const rest = fmtRest(ex.rest);
            const notes = ex.notes || "";
            rows.push([name || "", sets, reps, weight || "—", rest || "", notes || ""]);
          }

          autoTable(doc, {
            startY: y, margin: { left: margin, right: margin },
            head: [["Esercizio", "Serie", "Rep", "Carico", "Rec.", "Note"]],
            body: rows, theme: "grid",
            styles: { fontSize: 8, cellPadding: 2, lineColor: [220, 220, 225], lineWidth: 0.2, halign: "center" },
            headStyles: { fillColor: headerBg, textColor: white, fontStyle: "bold", fontSize: 8, halign: "center" },
            alternateRowStyles: { fillColor: rowAlt },
            columnStyles: {
              0: { cellWidth: 70, fontStyle: "bold", halign: "left" },
              1: { cellWidth: 18, halign: "center" },
              2: { cellWidth: 24, halign: "center" },
              3: { cellWidth: 28, halign: "center" },
              4: { cellWidth: 18, halign: "center" },
              5: { cellWidth: "auto", fontStyle: "italic", fontSize: 7, textColor: [60, 80, 120], halign: "left" },
            },
          });
          y = doc.lastAutoTable.finalY + 8;
        }
      }

      // Cardio
      if (cardioData && cardioData.length > 0) {
        if (y + 40 > H - 10) { doc.addPage(); y = margin; }
        doc.setFillColor(25, 50, 110);
        doc.rect(margin, y, W - margin * 2, 8, "F");
        doc.setFont("helvetica", "bold"); doc.setFontSize(10); doc.setTextColor(255, 255, 255);
        doc.text("CARDIO", margin + 4, y + 5.5);
        y += 10;
        const cRows = cardioData.map((s, i) => [s.dayLabel || ("Cardio " + (i+1)), s.type || "", s.work || "", s.rpe ? "RPE " + s.rpe : ""]);
        autoTable(doc, {
          startY: y, margin: { left: margin, right: margin },
          head: [["Day", "Type", "Work", "RPE"]], body: cRows, theme: "grid",
          styles: { fontSize: 8, cellPadding: 2, lineColor: [220, 220, 225], lineWidth: 0.2 },
          headStyles: { fillColor: headerBg, textColor: white, fontStyle: "bold", fontSize: 8 },
          alternateRowStyles: { fillColor: rowAlt },
        });
        y = doc.lastAutoTable.finalY + 8;
      }

      // Running
      if (runningData && runningData.length > 0) {
        if (y + 30 > H - 10) { doc.addPage(); y = margin; }
        doc.setFillColor(25, 50, 110);
        doc.rect(margin, y, W - margin * 2, 8, "F");
        doc.setFont("helvetica", "bold"); doc.setFontSize(10); doc.setTextColor(255, 255, 255);
        doc.text("RUNNING", margin + 4, y + 5.5);
        y += 10;
        const rRows = runningData.map(s => [s.day || "", `${s.type || ""} · ${s.duration || ""}`, s.notes || ""]);
        autoTable(doc, {
          startY: y, margin: { left: margin, right: margin },
          head: [["Day", "Session", "Notes"]], body: rRows, theme: "grid",
          styles: { fontSize: 8, cellPadding: 2, lineColor: [220, 220, 225], lineWidth: 0.2 },
          headStyles: { fillColor: headerBg, textColor: white, fontStyle: "bold", fontSize: 8 },
          alternateRowStyles: { fillColor: rowAlt },
        });
      }
    };

    // Single PDF with both blocks on separate pages
    const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
    const cardio1 = prog.cardio ? (prog.cardio.block1 || []) : [];
    const running1 = prog.running ? (prog.running.block1 || []) : [];
    buildBlockPDF(doc, prog.block1, 1, "Sett. 1-2", cardio1, running1);

    const cardio2 = prog.cardio ? (prog.cardio.block2 || []) : [];
    const running2 = prog.running ? (prog.running.block2 || []) : [];
    buildBlockPDF(doc, prog.block2, 2, "Sett. 3-4", cardio2, running2);

    // Remove blank first page
    doc.deletePage(1);

    // Footer on all pages
    const W = doc.internal.pageSize.getWidth();
    const H = doc.internal.pageSize.getHeight();
    const pages = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pages; i++) {
      doc.setPage(i);
      doc.setFontSize(7); doc.setTextColor(80, 100, 140);
      doc.text(`TrainForge Pro · ${clientName} · Blocco ${monthNum}`, 12, H - 5);
      doc.text(`${i}/${pages}`, W - 12, H - 5, { align: "right" });
    }

    doc.save(`${clientName.replace(/\s+/g, "_")}_Blocco${monthNum}.pdf`);
    notify("PDF exported!");
    } catch (err) { console.error("PDF error:", err); notify("PDF error: " + err.message, "warn"); }
  };

  function ProgEdit({ program, onSave, onBack }) {
    const [p, setP] = useState(JSON.parse(JSON.stringify(program)));
    const [ab, setAb] = useState(0);
    const [ad, setAd] = useState(0);
    const [exPk, setExPk] = useState(null);
    const cb = ab === 0 ? p.block1 : p.block2;
    const cd = cb[ad];
    // Auto-sync Block1 edits → Block2 with micro-progression
    const syncBlock2 = (np) => {
      if (!np.block1) return np;
      np.block2 = np.block1.map(day => ({
        ...day,
        exercises: microProgress(day.exercises, np.level || "intermediate")
      }));
      return np;
    };
    const upEx = (di, ei, fld, val) => { const bk = ab === 0 ? "block1" : "block2"; const np = { ...p }; np[bk] = [...np[bk]]; np[bk][di] = { ...np[bk][di] }; np[bk][di].exercises = [...np[bk][di].exercises]; np[bk][di].exercises[ei] = { ...np[bk][di].exercises[ei], [fld]: val }; if (ab === 0) syncBlock2(np); setP(np); };
    const rmEx = (di, ei) => { const bk = ab === 0 ? "block1" : "block2"; const np = { ...p }; np[bk] = [...np[bk]]; np[bk][di] = { ...np[bk][di] }; np[bk][di].exercises = np[bk][di].exercises.filter((_, i) => i !== ei); if (ab === 0) syncBlock2(np); setP(np); };
    const repEx = (di, ei, nx) => { const bk = ab === 0 ? "block1" : "block2"; const np = { ...p }; np[bk] = [...np[bk]]; np[bk][di] = { ...np[bk][di] }; np[bk][di].exercises = [...np[bk][di].exercises]; const o = np[bk][di].exercises[ei]; np[bk][di].exercises[ei] = { ...nx, section: o.section, sets: o.sets, reps: o.reps, rest: o.rest, weight: o.weight, rpe: o.rpe, notes: o.notes || "" }; if (ab === 0) syncBlock2(np); setP(np); setExPk(null); };
    const sc = s => ({ "Warm-Up": "#6eb5ff", Strength: K.ac, Core: "#b388ff", Finisher: K.dg }[s] || K.tm);
    return (
      <div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}><button onClick={onBack} style={{ background: "none", border: "none", color: K.tm, cursor: "pointer", padding: 4 }}>{I.back}</button><div><h2 style={{ margin: 0, fontSize: 20, color: K.tx }}>{p.clientName}</h2><div style={{ fontSize: 12, color: K.tm, display: "flex", gap: 8, alignItems: "center", marginTop: 4 }}>Month {p.monthNumber} · <LvlBadge level={p.level} /><span style={{ display: "inline-flex", alignItems: "center", gap: 3 }}>{I.cal} {p.sessionsPerWeek}×/wk</span><span style={{ display: "inline-flex", alignItems: "center", gap: 3 }}>{I.clock} {p.sessionDuration}min</span>{p.trainingLocation === "home" && <span style={{ padding: "2px 8px", borderRadius: 4, fontSize: 10, fontWeight: 600, background: "rgba(200,255,46,0.15)", color: K.ac }}>🏠 HOME</span>}{p.cardioDaysPerWeek > 0 && <span style={{ padding: "2px 8px", borderRadius: 4, fontSize: 10, fontWeight: 600, background: "rgba(46,204,113,0.15)", color: "#2ecc71" }}>+{p.cardioDaysPerWeek} Cardio</span>}</div></div></div>
          <div style={{ display: "flex", gap: 10 }}><Btn v="secondary" sm onClick={() => exportPDF(p)} icon={pdfIcon}>PDF</Btn><Btn v="secondary" sm onClick={() => { setP(JSON.parse(JSON.stringify(program))); notify("Reset", "warn"); }} icon={I.refresh}>Reset</Btn><Btn v="danger" sm onClick={() => setConfDelPr(p)} icon={I.trash}>Delete</Btn><Btn sm onClick={() => { onSave(p); notify("Saved!"); }}>Save</Btn></div>
        </div>
        <div style={{ display: "flex", gap: 2, marginBottom: 16, background: K.sf, borderRadius: 10, padding: 3 }}>{["Block 1 — Weeks 1-2", "Block 2 — Weeks 3-4"].map((l, i) => <button key={i} onClick={() => { setAb(i); setAd(0); }} style={{ flex: 1, padding: "10px 16px", border: "none", borderRadius: 8, fontFamily: ff, fontSize: 13, fontWeight: 600, cursor: "pointer", background: ab === i ? K.ac : "transparent", color: ab === i ? "#0a0a0c" : K.tm }}>{l}</button>)}</div>
        <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>{cb.map((d, i) => <button key={i} onClick={() => setAd(i)} style={{ padding: "8px 16px", border: "1px solid " + (ad === i ? K.ac : K.bd), borderRadius: 8, fontFamily: ff, fontSize: 12, fontWeight: 600, cursor: "pointer", background: ad === i ? K.ab : "transparent", color: ad === i ? K.ac : K.tm }}>{d.dayLabel} · {d.focus}</button>)}</div>
        <div>{(() => { let ls = ""; return cd.exercises.map((ex, ei) => { const ss = ex.section !== ls; ls = ex.section; return (<div key={ei}>{ss && <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: ei > 0 ? 24 : 0, marginBottom: 10 }}><div style={{ display: "flex", alignItems: "center", gap: 8 }}><div style={{ width: 3, height: 16, borderRadius: 2, background: sc(ex.section) }} /><span style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: sc(ex.section) }}>{ex.section}</span></div><Btn v="ghost" sm onClick={() => setExPk({ di: ad, sec: ex.section })} icon={I.plus}>Add</Btn></div>}<div style={{ background: K.cd, border: "1px solid " + K.bd, borderRadius: 10, marginBottom: 6, padding: "10px 14px" }}><div style={{ display: "grid", gridTemplateColumns: "1fr auto auto auto auto auto auto", gap: 8, alignItems: "center", fontSize: 13 }}><div style={{ color: K.tx, fontWeight: 500, cursor: "pointer" }} onClick={() => setExPk({ di: ad, sec: ex.section, idx: ei, rep: true })}>{ex.name}{ex.circuit && <span style={{ fontSize: 11, color: K.td, marginLeft: 6 }}>({ex.circuit.join(", ")})</span>}</div>{["sets","reps","rest","weight","rpe"].map(fld => <div key={fld} style={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: fld === "reps" ? 65 : fld === "weight" ? 55 : 40 }}><span style={{ fontSize: 9, color: K.td, textTransform: "uppercase" }}>{fld}</span><input value={ex[fld]} onChange={e => upEx(ad, ei, fld, e.target.value)} style={{ width: fld === "reps" ? 70 : fld === "weight" ? 55 : 45, padding: "4px 6px", background: K.sf, border: "1px solid " + K.bd, borderRadius: 5, color: K.tx, fontSize: 13, fontFamily: mf, textAlign: "center", outline: "none" }} /></div>)}<button onClick={() => rmEx(ad, ei)} style={{ background: "none", border: "none", color: K.td, cursor: "pointer", padding: 4, opacity: 0.6 }}>{I.trash}</button></div><input value={ex.notes || ""} onChange={e => upEx(ad, ei, "notes", e.target.value)} placeholder="Notes (e.g., tempo, cues, weight guidance...)" style={{ width: "100%", marginTop: 6, padding: "5px 10px", background: K.sf, border: "1px solid " + K.bd, borderRadius: 5, color: K.tm, fontSize: 11, fontFamily: ff, outline: "none", boxSizing: "border-box" }} /></div></div>); }); })()}</div>
        {p.includesRunning && p.running && <div style={{ marginTop: 28 }}><div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}><div style={{ width: 3, height: 16, borderRadius: 2, background: K.ok }} /><span style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: K.ok }}>Running</span></div>{(ab === 0 ? p.running.block1 : p.running.block2).map((r, i) => <Crd key={i} style={{ marginBottom: 8, padding: 14 }}><div style={{ display: "flex", justifyContent: "space-between" }}><div><span style={{ fontWeight: 600, color: K.tx, fontSize: 13 }}>{r.day}</span><span style={{ color: K.tm, fontSize: 12, marginLeft: 12 }}>{r.type} · {r.duration}</span></div><span style={{ fontSize: 12, color: K.td }}>{r.notes}</span></div></Crd>)}</div>}
        {p.cardio && <div style={{ marginTop: 28 }}><div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}><div style={{ width: 3, height: 16, borderRadius: 2, background: "#2ecc71" }} /><span style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "#2ecc71" }}>Cardio Programming</span></div>{(ab === 0 ? p.cardio.block1 : p.cardio.block2).map((c, i) => <Crd key={i} style={{ marginBottom: 8, padding: 14 }}><div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}><div><span style={{ fontWeight: 600, color: K.tx, fontSize: 13 }}>{c.dayLabel}</span><span style={{ color: "#2ecc71", fontSize: 12, marginLeft: 10, fontWeight: 600 }}>{c.type}</span>{c.rpe && <span style={{ color: K.td, fontSize: 11, marginLeft: 8 }}>RPE {c.rpe}</span>}</div></div><div style={{ marginTop: 8, fontSize: 12, color: K.tm, display: "grid", gridTemplateColumns: "auto 1fr", gap: "4px 12px" }}><span style={{ color: K.td }}>Warm-up:</span><span>{c.warmup}</span><span style={{ color: K.td }}>Work:</span><span style={{ color: K.tx, fontWeight: 500 }}>{c.work}</span><span style={{ color: K.td }}>Cool-down:</span><span>{c.cooldown}</span></div></Crd>)}</div>}
        {exPk && <ExPick section={exPk.sec} dayType={cd.dayType} location={p.trainingLocation || "gym"} onSelect={ex => { if (exPk.rep && exPk.idx != null) { repEx(exPk.di, exPk.idx, ex); } else { const bk = ab === 0 ? "block1" : "block2"; const np = { ...p }; np[bk] = [...np[bk]]; np[bk][exPk.di] = { ...np[bk][exPk.di] }; const exs = [...np[bk][exPk.di].exercises]; const ic = ex.category === "compound"; const lc = p.levelCfg || {}; const ne = { ...ex, section: exPk.sec, sets: ic ? (lc.compoundSets || lc.cSets || 4) : (lc.accessorySets || lc.aSets || 3), reps: ic ? (lc.compoundReps || lc.cReps || "8") : (lc.accessoryReps || lc.aReps || "10"), rest: ic ? (lc.restCompound || lc.rest || 120) : (lc.restAccessory || lc.aRest || 90), weight: "—", rpe: ic ? (lc.compoundRPE || lc.cRPE || "") : (lc.accessoryRPE || lc.aRPE || ""), notes: "" }; let ia = exs.length; for (let i = exs.length - 1; i >= 0; i--) { if (exs[i].section === exPk.sec) { ia = i + 1; break; } } exs.splice(ia, 0, ne); np[bk][exPk.di].exercises = exs; if (ab === 0) syncBlock2(np); setP(np); setExPk(null); } }} onClose={() => setExPk(null)} />}
      </div>
    );
  }

  function ExPick({ section, dayType, location, onSelect, onClose }) {
    const [ft, setFt] = useState("");
    const getSectionCats = () => { if (section === "Warm-Up") return ["mobility"]; if (section === "Core") return ["core"]; if (section === "Finisher") return ["hiit"]; if (section === "Strength") return ["compound_push_squat", "compound_pull_hinge", "accessory_push_squat", "accessory_pull_hinge"]; return Object.keys(EXERCISES); };
    const fl = getSectionCats().flatMap(c => filterLoc(EXERCISES[c] || [], location || "gym")).filter(e => e.name.toLowerCase().includes(ft.toLowerCase()));
    return (<Mdl title={"Select — " + section} onClose={onClose} wide><div style={{ position: "relative", marginBottom: 16 }}><input value={ft} onChange={e => setFt(e.target.value)} placeholder="Search..." style={{ width: "100%", padding: "10px 14px 10px 36px", background: K.bg, border: "1px solid " + K.bd, borderRadius: 8, color: K.tx, fontSize: 13, fontFamily: ff, outline: "none", boxSizing: "border-box" }} /><div style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: K.td }}>{I.search}</div></div><div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, maxHeight: 400, overflowY: "auto" }}>{fl.map(ex => <div key={ex.id} onClick={() => onSelect(ex)} style={{ padding: "12px 14px", background: K.cd, border: "1px solid " + K.bd, borderRadius: 8, cursor: "pointer", transition: "all 0.12s" }} onMouseEnter={e => { e.currentTarget.style.borderColor = K.ac; e.currentTarget.style.background = K.ab; }} onMouseLeave={e => { e.currentTarget.style.borderColor = K.bd; e.currentTarget.style.background = K.cd; }}><div style={{ fontWeight: 600, fontSize: 13, color: K.tx, marginBottom: 4 }}>{ex.name}</div><div style={{ fontSize: 11, color: K.td }}>{ex.category}{ex.equipment ? " · " + ex.equipment : ""}{ex.muscles ? " · " + ex.muscles.join(", ") : ""}</div></div>)}</div></Mdl>);
  }

  // ─── PROGRAM HISTORY VIEW ───
  function ProgHistory({ client, programs, onSelectProgram, onBack }) {
    const getDiff = (curr, prev) => { if (!prev) return { added: [], removed: [], kept: [] }; const pIds = extractPrevIds(prev); const cIds = extractPrevIds(curr); return { added: [...cIds].filter(id => !pIds.has(id)), removed: [...pIds].filter(id => !cIds.has(id)), kept: [...cIds].filter(id => pIds.has(id)) }; };
    return (
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}><button onClick={onBack} style={{ background: "none", border: "none", color: K.tm, cursor: "pointer", padding: 4 }}>{I.back}</button><div><h2 style={{ margin: 0, fontSize: 20, color: K.tx }}>Program History — {client.name}</h2><div style={{ fontSize: 12, color: K.tm, marginTop: 4 }}>{programs.length} program{programs.length !== 1 ? "s" : ""}</div></div></div>
        {programs.length === 0 ? <Crd style={{ textAlign: "center", padding: 40 }}><div style={{ color: K.td, fontSize: 14 }}>No programs generated yet.</div></Crd> :
        <div style={{ position: "relative", paddingLeft: 28 }}>
          <div style={{ position: "absolute", left: 10, top: 8, bottom: 8, width: 2, background: K.bd }} />
          {[...programs].reverse().map((prog, idx) => {
            const realIdx = programs.length - 1 - idx;
            const prev = realIdx > 0 ? programs[realIdx - 1] : null;
            const diff = getDiff(prog, prev);
            const isLatest = idx === 0;
            const exCount = (prog.block1?.reduce((a, d) => a + d.exercises.filter(e => e.section === "Strength" || e.section === "Strength").length, 0) || 0) + (prog.block2?.reduce((a, d) => a + d.exercises.filter(e => e.section === "Strength" || e.section === "Strength").length, 0) || 0);
            return (
              <div key={prog.id} style={{ position: "relative", marginBottom: 16 }}>
                <div style={{ position: "absolute", left: -24, top: 16, width: 12, height: 12, borderRadius: 6, background: isLatest ? K.ac : K.bd, border: isLatest ? "none" : "2px solid " + K.td }} />
                <Crd onClick={() => onSelectProgram(prog)} style={{ cursor: "pointer", borderLeft: "3px solid " + (isLatest ? K.ac : K.bd) }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}><span style={{ fontWeight: 700, fontSize: 16, color: K.tx }}>Month {prog.monthNumber}</span>{isLatest && <Badge color={K.ac}>Current</Badge>}<LvlBadge level={prog.level} /></div>
                      <div style={{ fontSize: 12, color: K.tm, display: "flex", gap: 12, flexWrap: "wrap" }}><span>{prog.sessionsPerWeek}×/wk · {prog.sessionDuration}min</span><span>{exCount} exercises</span><span>{new Date(prog.createdAt).toLocaleDateString("it-IT", { day: "numeric", month: "short", year: "numeric" })}</span></div>
                    </div>
                    <div style={{ color: K.td }}>{I.chevron}</div>
                  </div>
                  {prev && <div style={{ marginTop: 12, display: "flex", gap: 16, fontSize: 11 }}>{diff.added.length > 0 && <span style={{ color: K.ok }}>+{diff.added.length} new</span>}{diff.removed.length > 0 && <span style={{ color: K.dg }}>-{diff.removed.length} rotated out</span>}{diff.kept.length > 0 && <span style={{ color: K.tm }}>{diff.kept.length} kept</span>}</div>}
                  <div style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap" }}>{prog.block1?.map((d, di) => <span key={di} style={{ padding: "3px 8px", borderRadius: 4, fontSize: 10, fontWeight: 600, background: K.ac + "15", color: K.ac }}>{d.dayLabel}: {d.focus}</span>)}{prog.cardioDaysPerWeek > 0 && <span style={{ padding: "3px 8px", borderRadius: 4, fontSize: 10, fontWeight: 600, background: "rgba(46,204,113,0.15)", color: "#2ecc71" }}>+{prog.cardioDaysPerWeek} Cardio</span>}</div>
                </Crd>
              </div>
            );
          })}
        </div>}
      </div>
    );
  }

  function Dash() {
    const np = actCls.filter(c => !getLatest(prgs, c.id));
    const totalProgs = Object.values(prgs).reduce((a, arr) => a + arr.length, 0);
    return (
      <div>
        <div style={{ marginBottom: 28 }}><h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: K.tx }}>Dashboard</h1><p style={{ margin: "6px 0 0", color: K.tm, fontSize: 14 }}>Training business overview</p></div>
        <div style={{ display: "flex", gap: 14, marginBottom: 28, flexWrap: "wrap" }}><Stat label="Active Clients" value={actCls.length} sub={cls.length + " total"} icon={I.users} /><Stat label="Programs" value={totalProgs} sub="total generated" icon={I.program} /><Stat label="Need Program" value={np.length} sub="pending" icon={I.bolt} /><Stat label="Exercises" value={ALL_EXERCISES.length} sub="in library" icon={I.library} /></div>
        {np.length > 0 && <div style={{ marginBottom: 28 }}><h3 style={{ fontSize: 15, color: K.tx, marginBottom: 12 }}>Needs Program</h3><div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 12 }}>{np.map(c => <Crd key={c.id} onClick={() => { setSelCl(c); setPg("clients"); }} style={{ cursor: "pointer", borderLeft: "3px solid " + K.wn }}><div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><div><div style={{ fontWeight: 600, color: K.tx, fontSize: 14 }}>{c.name}</div><div style={{ fontSize: 12, color: K.tm, marginTop: 4 }}>Month {c.monthNumber} · <LvlBadge level={c.level} /> · {c.sessionsPerWeek}×/wk · {c.sessionDuration}min</div></div><div style={{ color: K.td }}>{I.chevron}</div></div></Crd>)}</div></div>}
        {totalProgs > 0 && <div><h3 style={{ fontSize: 15, color: K.tx, marginBottom: 12 }}>Recent Programs</h3><div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 12 }}>{Object.entries(prgs).flatMap(([cId, arr]) => arr.map(p => ({ ...p, _cId: cId }))).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 6).map(p => <Crd key={p.id} onClick={() => { const c = cls.find(x => x.id === p._cId); if (c) { setSelCl(c); setSelPr(p); setPg("clients"); } }} style={{ cursor: "pointer", borderLeft: "3px solid " + K.ac }}><div style={{ fontWeight: 600, color: K.tx, fontSize: 14 }}>{p.clientName}</div><div style={{ fontSize: 12, color: K.tm, marginTop: 4 }}>Month {p.monthNumber} · {p.sessionsPerWeek}×/wk · {p.sessionDuration}min · {new Date(p.createdAt).toLocaleDateString()}</div></Crd>)}</div></div>}
      </div>
    );
  }

  function Clients() {
    const [histCl, setHistCl] = useState(null);
    const fl = cls.filter(c => c.name.toLowerCase().includes(sq.toLowerCase()) || c.level.includes(sq.toLowerCase()));
    if (selCl && selPr) return <ProgEdit program={selPr} onSave={u => { setPrgs(updProg(prgs, u.clientId, u)); setSelPr(u); dbSave("programs", prToDb(u)).catch(console.error); }} onBack={() => setSelPr(null)} />;
    if (selCl && histCl) return <ProgHistory client={selCl} programs={getAll(prgs, selCl.id)} onSelectProgram={p => { setSelPr(p); setHistCl(null); }} onBack={() => setHistCl(null)} />;
    if (selCl) {
      const c = selCl, cp = getLatest(prgs, c.id), allP = getAll(prgs, c.id);
      const handleGenerate = () => { const p = generateProgram(c, cp); setPrgs(addProg(prgs, c.id, p)); setSelPr(p); const upd = { ...c, monthNumber: p.monthNumber }; setCls(cls.map(x => x.id === c.id ? upd : x)); setSelCl(upd); dbSave("programs", prToDb(p)).catch(console.error); dbSave("clients", clToDb(upd)).catch(console.error); notify("Generated Month " + p.monthNumber + "!"); };
      return (
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}><button onClick={() => setSelCl(null)} style={{ background: "none", border: "none", color: K.tm, cursor: "pointer", padding: 4 }}>{I.back}</button><h2 style={{ margin: 0, fontSize: 22, color: K.tx }}>{c.name}</h2><LvlBadge level={c.level} /></div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
            <Crd><h4 style={{ margin: "0 0 12px", fontSize: 13, color: K.tm, textTransform: "uppercase" }}>Details</h4><div style={{ fontSize: 13, color: K.tx, lineHeight: 2 }}><div><span style={{ color: K.td }}>Email:</span> {c.email}</div><div><span style={{ color: K.td }}>Phone:</span> {c.phone}</div><div><span style={{ color: K.td }}>Start:</span> {c.startDate}</div><div><span style={{ color: K.td }}>Month:</span> {c.monthNumber}</div><div><span style={{ color: K.td }}>Location:</span> {c.trainingLocation === "home" ? "🏠 Home Gym" : "🏋️ Gym"}</div><div><span style={{ color: K.td }}>Sessions:</span> {c.sessionsPerWeek}×/week</div><div><span style={{ color: K.td }}>Duration:</span> {c.sessionDuration} min</div><div><span style={{ color: K.td }}>Cardio:</span> {(c.cardioDaysPerWeek || 0) > 0 ? c.cardioDaysPerWeek + " days/week" : c.includesRunning ? "Running" : "No"}</div></div></Crd>
            <Crd><h4 style={{ margin: "0 0 12px", fontSize: 13, color: K.tm, textTransform: "uppercase" }}>Goals & Health</h4><div style={{ fontSize: 13, color: K.tx, lineHeight: 2 }}><div><span style={{ color: K.td }}>Goals:</span> {c.goals}</div><div><span style={{ color: K.td }}>Health:</span> {c.healthNotes || "None"}</div><div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}><span style={{ color: K.td }}>Injuries:</span>{c.injuries?.length ? c.injuries.map((inj, i) => <Badge key={i} color={K.dg}>{inj}</Badge>) : <span style={{ color: K.td }}>None</span>}</div></div></Crd>
          </div>
          <Crd style={{ marginBottom: 24, background: K.ab, borderColor: K.ac + "30" }}><div style={{ fontSize: 12, fontWeight: 600, color: K.ac, textTransform: "uppercase", marginBottom: 8 }}>Weekly Schedule</div><div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>{buildDaySchedule(c.sessionsPerWeek, c.day3Type || "glute").map((t, i) => { const labels = { A: "Push+Squat", B: "Pull+Hinge", Q: "Quad+Push", H: "Hinge+Pull", G: "Glute Focus", F: "Full Body" }; const colors = { A: "#5dade2", B: "#f0a030", Q: "#5dade2", H: "#f0a030", G: "#e74c3c", F: "#2ecc71" }; return <div key={i} style={{ padding: "8px 14px", borderRadius: 8, background: colors[t] + "20", border: "1px solid " + colors[t] + "50" }}><div style={{ fontSize: 11, fontWeight: 700, color: colors[t], marginBottom: 2 }}>Day {i+1}</div><div style={{ fontSize: 12, color: K.tx }}>{labels[t]}</div></div>; })}{c.includesRunning && <div style={{ padding: "8px 14px", borderRadius: 8, background: "rgba(46,204,113,0.12)", border: "1px solid rgba(46,204,113,0.3)" }}><div style={{ fontSize: 11, fontWeight: 700, color: K.ok, marginBottom: 2 }}>Off-Day</div><div style={{ fontSize: 12, color: K.tx }}>Running</div></div>}</div></Crd>
          <div style={{ display: "flex", gap: 10, marginBottom: 24, flexWrap: "wrap" }}>
            <Btn onClick={handleGenerate} icon={I.bolt}>{cp ? "Generate Month " + ((cp.monthNumber || 1) + 1) : "Generate Program"}</Btn>
            {cp && <Btn v="secondary" onClick={() => setSelPr(cp)} icon={I.edit}>Edit Current</Btn>}
            {cp && <Btn v="secondary" onClick={() => exportPDF(cp)} icon={pdfIcon}>Export PDF</Btn>}
            {allP.length > 0 && <Btn v="secondary" onClick={() => setHistCl(c)} icon={I.history}>History ({allP.length})</Btn>}
            <Btn v="secondary" onClick={() => { setEditCl(c); setShowCM(true); }} icon={I.edit}>Edit Client</Btn>
            <Btn v="danger" onClick={() => setConfDel(c)} icon={I.trash}>Delete Client</Btn>
          </div>
          {cp && <Crd style={{ marginBottom: 16 }}><div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}><h4 style={{ margin: 0, fontSize: 14, color: K.tx }}>Current Program — Month {cp.monthNumber}</h4><span style={{ fontSize: 11, color: K.td }}>{new Date(cp.createdAt).toLocaleDateString()}</span></div><div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>{["Block 1 (Wk 1-2)", "Block 2 (Wk 3-4)"].map((l, bi) => <div key={bi} style={{ background: K.bg, borderRadius: 8, padding: 14 }}><div style={{ fontSize: 12, fontWeight: 600, color: K.ac, marginBottom: 10 }}>{l}</div>{(bi === 0 ? cp.block1 : cp.block2).map((d, di) => <div key={di} style={{ marginBottom: 8 }}><div style={{ fontSize: 12, fontWeight: 600, color: K.tx }}>{d.dayLabel}: {d.focus}</div><div style={{ fontSize: 11, color: K.td }}>{d.exercises.length} exercises</div></div>)}</div>)}</div></Crd>}
          {allP.length > 1 && <Crd><div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}><h4 style={{ margin: 0, fontSize: 14, color: K.tx }}>Program Timeline</h4><Btn v="ghost" sm onClick={() => setHistCl(c)} icon={I.history}>View All</Btn></div><div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4 }}>{allP.map((prog, i) => { const isLast = i === allP.length - 1; return <div key={prog.id} onClick={() => setSelPr(prog)} style={{ minWidth: 120, padding: "10px 14px", borderRadius: 8, background: isLast ? K.ab : K.bg, border: "1px solid " + (isLast ? K.ac + "50" : K.bd), cursor: "pointer", textAlign: "center", flexShrink: 0 }}><div style={{ fontSize: 18, fontWeight: 700, color: isLast ? K.ac : K.tx, fontFamily: mf }}>{prog.monthNumber}</div><div style={{ fontSize: 10, color: K.td, marginTop: 2 }}>Month</div><div style={{ fontSize: 10, color: K.tm, marginTop: 4 }}>{new Date(prog.createdAt).toLocaleDateString("it-IT", { day: "numeric", month: "short" })}</div></div>; })}</div></Crd>}
        </div>
      );
    }
    return (
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}><div><h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: K.tx }}>Clients</h1><p style={{ margin: "6px 0 0", color: K.tm, fontSize: 14 }}>{actCls.length} active</p></div><div style={{ display: "flex", gap: 10 }}><Btn v="secondary" onClick={() => setShowImport(true)} icon={I.upload}>Import</Btn><Btn onClick={() => { setEditCl(null); setShowCM(true); }} icon={I.plus}>New Client</Btn></div></div>
        <div style={{ position: "relative", marginBottom: 20 }}><input value={sq} onChange={e => setSq(e.target.value)} placeholder="Search..." style={{ width: "100%", padding: "12px 16px 12px 40px", background: K.sf, border: "1px solid " + K.bd, borderRadius: 10, color: K.tx, fontSize: 14, fontFamily: ff, outline: "none", boxSizing: "border-box" }} /><div style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: K.td }}>{I.search}</div></div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 12 }}>{fl.map(c => { const lp = getLatest(prgs, c.id); const pc = getAll(prgs, c.id).length; return <Crd key={c.id} onClick={() => setSelCl(c)} style={{ cursor: "pointer", borderLeft: "3px solid " + (lp ? K.ac : K.bd) }}><div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}><div><div style={{ fontWeight: 600, color: K.tx, fontSize: 15, marginBottom: 6 }}>{c.name}</div><div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 6, flexWrap: "wrap" }}><LvlBadge level={c.level} /><span style={{ fontSize: 12, color: K.tm }}>Mo.{c.monthNumber} · {c.sessionsPerWeek}×/wk · {c.sessionDuration}min</span>{c.trainingLocation === "home" && <Badge color={K.ac}>🏠 Home</Badge>}{(c.cardioDaysPerWeek || 0) > 0 && <Badge color="#2ecc71">+{c.cardioDaysPerWeek} Cardio</Badge>}</div><div style={{ fontSize: 12, color: K.td }}>{c.goals}</div></div><div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>{lp ? <Badge color={K.ac}>Mo.{lp.monthNumber} ✓</Badge> : <Badge color={K.wn}>Pending</Badge>}{pc > 1 && <span style={{ fontSize: 10, color: K.td }}>{pc} programs</span>}<div style={{ display: "flex", alignItems: "center", gap: 8 }}><button onClick={e => { e.stopPropagation(); setConfDel(c); }} style={{ background: "none", border: "none", color: K.td, cursor: "pointer", padding: 4, borderRadius: 4, display: "flex", alignItems: "center" }} title="Delete">{I.trash}</button><div style={{ color: K.td }}>{I.chevron}</div></div></div></div></Crd>; })}</div>
      </div>
    );
  }

  function Programs() {
    if (selPr) return <ProgEdit program={selPr} onSave={u => { setPrgs(updProg(prgs, u.clientId, u)); setSelPr(u); dbSave("programs", prToDb(u)).catch(console.error); }} onBack={() => setSelPr(null)} />;
    const all = Object.entries(prgs).flatMap(([, arr]) => arr).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return (<div><div style={{ marginBottom: 24 }}><h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: K.tx }}>Programs</h1><p style={{ margin: "6px 0 0", color: K.tm, fontSize: 14 }}>{all.length} programs</p></div>{all.length === 0 ? <Crd style={{ textAlign: "center", padding: 40 }}><div style={{ color: K.td, fontSize: 14 }}>No programs yet.</div></Crd> : <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 12 }}>{all.map(p => <Crd key={p.id} onClick={() => setSelPr(p)} style={{ cursor: "pointer" }}><div style={{ fontWeight: 600, color: K.tx, fontSize: 15, marginBottom: 6 }}>{p.clientName}</div><div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 6 }}><LvlBadge level={p.level} /><span style={{ fontSize: 12, color: K.tm }}>Mo.{p.monthNumber} · {p.sessionsPerWeek}×/wk · {p.sessionDuration}min</span></div><div style={{ fontSize: 12, color: K.td }}>{p.block1.reduce((a, d) => a + d.exercises.length, 0) + p.block2.reduce((a, d) => a + d.exercises.length, 0)} exercises · {new Date(p.createdAt).toLocaleDateString()}</div></Crd>)}</div>}</div>);
  }

  function Library() {
    const [ac, setAc] = useState("compound_push_squat");
    return (<div><div style={{ marginBottom: 24 }}><h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: K.tx }}>Exercise Library</h1><p style={{ margin: "6px 0 0", color: K.tm, fontSize: 14 }}>{ALL_EXERCISES.length} exercises</p></div><div style={{ display: "flex", gap: 6, marginBottom: 20, flexWrap: "wrap" }}>{Object.keys(EXERCISES).map(cat => <button key={cat} onClick={() => setAc(cat)} style={{ padding: "8px 16px", border: "1px solid " + (ac === cat ? K.ac : K.bd), borderRadius: 8, fontFamily: ff, fontSize: 12, fontWeight: 600, cursor: "pointer", background: ac === cat ? K.ab : "transparent", color: ac === cat ? K.ac : K.tm, textTransform: "capitalize" }}>{cat.replace(/_/g, " ")} ({EXERCISES[cat].length})</button>)}</div><div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(250px,1fr))", gap: 10 }}>{EXERCISES[ac].map(ex => <Crd key={ex.id} style={{ padding: 16 }}><div style={{ fontWeight: 600, fontSize: 14, color: K.tx, marginBottom: 6 }}>{ex.name}</div><div style={{ fontSize: 12, color: K.td }}>{ex.equipment ? "Equipment: " + ex.equipment : ""}{ex.muscles ? " · " + ex.muscles.join(", ") : ""}</div></Crd>)}</div></div>);
  }

  const nav = [{ id: "dashboard", label: "Dashboard", icon: I.dashboard }, { id: "clients", label: "Clients", icon: I.users }, { id: "programs", label: "Programs", icon: I.program }, { id: "library", label: "Library", icon: I.library }];
  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: K.bg, fontFamily: ff }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
      <div style={{ textAlign: "center" }}>
        <div style={{ width: 48, height: 48, borderRadius: 12, background: K.ac, display: "flex", alignItems: "center", justifyContent: "center", color: "#0a0a0c", margin: "0 auto 16px", animation: "pulse 1.5s ease infinite" }}>{I.bolt}</div>
        <div style={{ fontSize: 18, fontWeight: 700, color: K.tx, marginBottom: 8 }}>TrainForge Pro</div>
        <div style={{ fontSize: 13, color: K.tm }}>Loading from Supabase...</div>
      </div>
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}`}</style>
    </div>
  );
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: K.bg, fontFamily: ff, color: K.tx }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
      <nav style={{ width: 220, minHeight: "100vh", background: K.sf, borderRight: "1px solid " + K.bd, padding: "20px 0", display: "flex", flexDirection: "column", flexShrink: 0 }}>
        <div style={{ padding: "0 20px 24px", borderBottom: "1px solid " + K.bd, marginBottom: 16 }}><div style={{ display: "flex", alignItems: "center", gap: 10 }}><div style={{ width: 32, height: 32, borderRadius: 8, background: K.ac, display: "flex", alignItems: "center", justifyContent: "center", color: "#0a0a0c" }}>{I.bolt}</div><div><div style={{ fontWeight: 700, fontSize: 15, color: K.tx, letterSpacing: "-0.02em" }}>TrainForge</div><div style={{ fontSize: 10, color: K.td, textTransform: "uppercase", letterSpacing: "0.08em" }}>Pro Dashboard</div></div></div></div>
        {nav.map(n => <button key={n.id} onClick={() => { setPg(n.id); setSelCl(null); setSelPr(null); }} style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 20px", border: "none", background: pg === n.id ? K.ab : "transparent", color: pg === n.id ? K.ac : K.tm, fontFamily: ff, fontSize: 13, fontWeight: 600, cursor: "pointer", borderLeft: pg === n.id ? "2px solid " + K.ac : "2px solid transparent", width: "100%", textAlign: "left" }}>{n.icon}{n.label}</button>)}
      </nav>
      <main style={{ flex: 1, padding: "28px 36px", overflowY: "auto", maxHeight: "100vh" }}>{pg === "dashboard" && <Dash />}{pg === "clients" && <Clients />}{pg === "programs" && <Programs />}{pg === "library" && <Library />}</main>
      {showCM && <ClForm client={editCl} onClose={() => { setShowCM(false); setEditCl(null); }} onSave={c => { if (editCl) { setCls(cls.map(x => x.id === c.id ? c : x)); if (selCl?.id === c.id) setSelCl(c); } else setCls([...cls, c]); dbSave("clients", clToDb(c)).catch(console.error); setShowCM(false); setEditCl(null); notify(editCl ? "Updated!" : "Added!"); }} />}
      {confDel && <Mdl title="Delete Client" onClose={() => setConfDel(null)}><p style={{ color: K.tm, fontSize: 14, marginBottom: 8 }}>Are you sure you want to delete <strong style={{ color: K.tx }}>{confDel.name}</strong>?</p><p style={{ color: K.dg, fontSize: 13, marginBottom: 20 }}>This will also delete all {(getAll(prgs, confDel.id) || []).length} associated programs. This action cannot be undone.</p><div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}><Btn v="secondary" onClick={() => setConfDel(null)}>Cancel</Btn><Btn v="danger" onClick={() => { const cId = confDel.id; dbDelete("clients", cId).catch(console.error); (getAll(prgs, cId) || []).forEach(p => dbDelete("programs", p.id).catch(console.error)); setCls(cls.filter(c => c.id !== cId)); const np = { ...prgs }; delete np[cId]; setPrgs(np); if (selCl?.id === cId) { setSelCl(null); setSelPr(null); } setConfDel(null); notify("Client deleted", "warn"); }}>Delete</Btn></div></Mdl>}
      {confDelPr && <Mdl title="Delete Program" onClose={() => setConfDelPr(null)}><p style={{ color: K.tm, fontSize: 14, marginBottom: 8 }}>Delete <strong style={{ color: K.tx }}>{confDelPr.clientName} — Month {confDelPr.monthNumber}</strong>?</p><p style={{ color: K.dg, fontSize: 13, marginBottom: 20 }}>This action cannot be undone.</p><div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}><Btn v="secondary" onClick={() => setConfDelPr(null)}>Cancel</Btn><Btn v="danger" onClick={() => { const p = confDelPr; dbDelete("programs", p.id).catch(console.error); const np = { ...prgs, [p.clientId]: (prgs[p.clientId] || []).filter(x => x.id !== p.id) }; if (np[p.clientId].length === 0) delete np[p.clientId]; setPrgs(np); if (selPr?.id === p.id) setSelPr(null); setConfDelPr(null); notify("Program deleted", "warn"); }}>Delete</Btn></div></Mdl>}
      {showImport && <ImportModal cls={cls} setCls={setCls} prgs={prgs} setPrgs={setPrgs} onClose={() => setShowImport(false)} notify={notify} dbSave={dbSave} clToDb={clToDb} prToDb={prToDb} />}
      {ntf && <div style={{ position: "fixed", bottom: 24, right: 24, padding: "12px 20px", borderRadius: 10, background: ntf.t === "warn" ? "#332800" : "#0a2e12", border: "1px solid " + (ntf.t === "warn" ? K.wn : K.ok) + "30", color: ntf.t === "warn" ? K.wn : K.ok, fontSize: 13, fontWeight: 600, fontFamily: ff, display: "flex", alignItems: "center", gap: 8, zIndex: 2000, animation: "slideUp 0.3s ease" }}>{I.check} {ntf.m}</div>}
      <style>{`@keyframes slideUp{from{transform:translateY(20px);opacity:0}to{transform:translateY(0);opacity:1}}*{box-sizing:border-box}::-webkit-scrollbar{width:6px}::-webkit-scrollbar-track{background:${K.bg}}::-webkit-scrollbar-thumb{background:${K.bd};border-radius:3px}select option{background:${K.sf};color:${K.tx}}input:focus,select:focus,textarea:focus{border-color:${K.ac}!important}`}</style>
    </div>
  );
}
