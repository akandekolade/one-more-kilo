// One more Kilo! — exercise pool, plans, and guides (pure data)
// Exercise photos from free-exercise-db (CC0), served via jsDelivr CDN
const IMAGE_BASE = 'https://cdn.jsdelivr.net/gh/yuhonas/free-exercise-db@main/exercises/';

const EXERCISES = [
  { bodyType:'ecto', key:'barbell-bench-press', day:'chest', name:'Barbell bench press', badge:'Primary', badgeClass:'badge-chest', statColor:'c-chest', sets:4, reps:'6–8', rest:90, tip:'Shoulder blades squeezed, feet into the floor. As an ectomorph, heavy compound lifts are your best friend.', img:'Barbell_Bench_Press_-_Medium_Grip/0.jpg' },
  { bodyType:'ecto', key:'incline-dumbbell-press', day:'chest', name:'Incline dumbbell press', badge:'Upper chest', badgeClass:'badge-chest', statColor:'c-chest', sets:3, reps:'8–10', rest:75, tip:'Set bench at 30 to 45 degrees. Squeeze hard at the top. Builds upper chest thickness.', img:'Incline_Dumbbell_Press/0.jpg' },
  { bodyType:'ecto', key:'cable-chest-fly', day:'chest', name:'Cable chest fly', badge:'Isolation', badgeClass:'badge-chest', statColor:'c-chest', sets:3, reps:'12–15', rest:60, tip:'Control the stretch on the return. Slight elbow bend. Builds the inner chest line.', img:'Flat_Bench_Cable_Flyes/0.jpg' },
  { bodyType:'ecto', key:'close-grip-bench-press', day:'chest', name:'Close-grip bench press', badge:'Triceps', badgeClass:'badge-tri', statColor:'c-chest', sets:3, reps:'8–10', rest:75, tip:'Grip just inside shoulder width, elbows tucked. Triceps make up 2/3 of arm size.', img:'Close-Grip_Barbell_Bench_Press/0.jpg' },
  { bodyType:'ecto', key:'tricep-pushdown', day:'chest', name:'Tricep pushdown', badge:'Triceps', badgeClass:'badge-tri', statColor:'c-chest', sets:3, reps:'12–15', rest:60, tip:'Full extension every rep. Spread the rope at the bottom for full lateral head activation.', img:'Triceps_Pushdown/0.jpg' },
  { bodyType:'ecto', key:'cable-crunch', day:'chest', name:'Cable crunch', badge:'Abs', badgeClass:'badge-core', statColor:'c-chest', sets:3, reps:'15–20', rest:45, tip:'Round your spine, not your hips — the crunch comes from your abs, not your arms pulling the rope down.', img:'Cable_Crunch/0.jpg' },

  { bodyType:'ecto', key:'barbell-back-squat', day:'legs', name:'Barbell back squat', badge:'Primary', badgeClass:'badge-legs', statColor:'c-legs', sets:4, reps:'5–7', rest:120, tip:'Break parallel. Brace your core hard. The king of mass builders for ectomorphs.', img:'Barbell_Squat/0.jpg' },
  { bodyType:'ecto', key:'romanian-deadlift', day:'legs', name:'Romanian deadlift', badge:'Hamstrings', badgeClass:'badge-legs', statColor:'c-legs', sets:3, reps:'8–10', rest:90, tip:'Hinge at hips, soft knees. Feel the hamstring stretch before driving back up.', img:'Romanian_Deadlift/0.jpg' },
  { bodyType:'ecto', key:'leg-press', day:'legs', name:'Leg press', badge:'Quads', badgeClass:'badge-legs', statColor:'c-legs', sets:3, reps:'10–12', rest:75, tip:"Feet hip-width mid-platform. Don't lock out knees at the top.", img:'Leg_Press/0.jpg' },
  { bodyType:'ecto', key:'walking-lunges', day:'legs', name:'Walking lunges', badge:'Glutes', badgeClass:'badge-legs', statColor:'c-legs', sets:3, reps:'10 each', rest:60, tip:'Torso upright, front knee tracks over toe. Builds symmetry and glute size.', img:'Bodyweight_Walking_Lunge/0.jpg' },
  { bodyType:'ecto', key:'standing-calf-raise', day:'legs', name:'Standing calf raise', badge:'Calves', badgeClass:'badge-legs', statColor:'c-legs', sets:4, reps:'15–20', rest:45, tip:'Full range of motion. Hold at the top 1 second. Calves respond to high reps.', img:'Standing_Calf_Raises/0.jpg' },

  { bodyType:'ecto', key:'lat-pulldown', day:'arms', name:'Lat pulldown', badge:'Back width', badgeClass:'badge-back', statColor:'c-arms', sets:4, reps:'8–10', rest:90, tip:'Pull to your upper chest, lead with the elbows, avoid leaning back excessively. Builds the back width that makes your waist look smaller.', img:'Wide-Grip_Lat_Pulldown/0.jpg' },
  { bodyType:'ecto', key:'seated-cable-row', day:'arms', name:'Seated cable row', badge:'Back thickness', badgeClass:'badge-back', statColor:'c-arms', sets:3, reps:'10–12', rest:75, tip:'Chest up, pull to your stomach, squeeze your shoulder blades together at the end of every rep.', img:'Seated_Cable_Rows/0.jpg' },
  { bodyType:'ecto', key:'barbell-curl', day:'arms', name:'Barbell curl', badge:'Biceps', badgeClass:'badge-arms', statColor:'c-arms', sets:4, reps:'8–10', rest:75, tip:'Elbows fixed at sides. Full extension at the bottom. Go heavy — biceps need progressive overload.', img:'Barbell_Curl/0.jpg' },
  { bodyType:'ecto', key:'incline-dumbbell-curl', day:'arms', name:'Incline dumbbell curl', badge:'Long head', badgeClass:'badge-arms', statColor:'c-arms', sets:3, reps:'10–12', rest:60, tip:'Incline gives a longer stretch. Hold the peak squeeze 1 second. Builds the bicep peak.', img:'Incline_Dumbbell_Curl/0.jpg' },
  { bodyType:'ecto', key:'overhead-press', day:'arms', name:'Overhead press', badge:'Shoulders', badgeClass:'badge-sh', statColor:'c-arms', sets:4, reps:'6–8', rest:90, tip:'Press from chin height. Lock out fully. Broad shoulders make arms look significantly bigger.', img:'Standing_Military_Press/0.jpg' },
  { bodyType:'ecto', key:'lateral-raises', day:'arms', name:'Lateral raises', badge:'Side delts', badgeClass:'badge-sh', statColor:'c-arms', sets:3, reps:'12–15', rest:60, tip:'Lead with elbows, stop at shoulder height. Builds the wide, capped shoulder look.', img:'Side_Lateral_Raise/0.jpg' },
  { bodyType:'ecto', key:'skull-crushers', day:'arms', name:'Skull crushers', badge:'Triceps', badgeClass:'badge-tri', statColor:'c-arms', sets:3, reps:'10–12', rest:75, tip:'Lower slowly to forehead. Upper arms stay vertical. Great overall tricep mass builder.', img:'EZ-Bar_Skullcrusher/0.jpg' },

  { bodyType:'ecto', key:'deadlift', day:'full', name:'Deadlift', badge:'King lift', badgeClass:'badge-full', statColor:'c-full', sets:4, reps:'4–6', rest:120, tip:'Flat back, chest up, push the floor away. Recruits the entire body — ultimate ectomorph mass builder.', img:'Barbell_Deadlift/0.jpg' },
  { bodyType:'ecto', key:'pull-up', day:'full', name:'Pull-up', badge:'Back width', badgeClass:'badge-full', statColor:'c-full', sets:4, reps:'6–10', rest:90, tip:'Full hang at bottom, chin over bar at top. Builds lats that make your body look much larger.', img:'Pullups/0.jpg' },
  { bodyType:'ecto', key:'dips', day:'full', name:'Dips', badge:'Chest + tris', badgeClass:'badge-full', statColor:'c-full', sets:3, reps:'8–10', rest:75, tip:'Lean forward for more chest. Add weight belt once bodyweight becomes easy.', img:'Dips_-_Chest_Version/0.jpg' },
  { bodyType:'ecto', key:'farmers-carry', day:'full', name:"Farmer's carry", badge:'Functional', badgeClass:'badge-full', statColor:'c-full', sets:3, reps:'30m', repsLabel:'Distance', rest:60, tip:'Heavy dumbbells, tall posture. Builds forearms, traps, and core simultaneously.', img:'Farmers_Walk/0.jpg' },
  { bodyType:'ecto', key:'hanging-leg-raise', day:'full', name:'Hanging leg raise', badge:'Lower abs', badgeClass:'badge-core', statColor:'c-full', sets:3, reps:'12–15', rest:45, tip:'Curl your pelvis up at the top, control the descent, avoid swinging on the bar.', img:'Hanging_Leg_Raise/0.jpg' },
  { bodyType:'ecto', key:'plank', day:'full', name:'Plank', badge:'Core', badgeClass:'badge-core', statColor:'c-full', sets:3, reps:'45–60s', repsLabel:'Hold', rest:45, tip:"Straight line from head to heels, brace like you're about to be punched.", img:'Plank/0.jpg' },

  { bodyType:'meso', key:'incline-barbell-bench-press', day:'chest', name:'Incline barbell bench press', badge:'Primary', badgeClass:'badge-chest', statColor:'c-chest', sets:4, reps:'8–10', rest:90, tip:'Mesomorphs respond fast to compound pressing — keep bar speed controlled and squeeze at lockout.', img:'Barbell_Incline_Bench_Press_-_Medium_Grip/0.jpg' },
  { bodyType:'meso', key:'seated-dumbbell-press', day:'chest', name:'Seated dumbbell press', badge:'Shoulders', badgeClass:'badge-sh', statColor:'c-chest', sets:3, reps:'8–10', rest:75, tip:'Back supported, press until arms lock without banging the dumbbells together.', img:'Seated_Dumbbell_Press/0.jpg' },
  { bodyType:'meso', key:'decline-bench-press', day:'chest', name:'Decline bench press', badge:'Lower chest', badgeClass:'badge-chest', statColor:'c-chest', sets:3, reps:'8–10', rest:75, tip:'Secure your legs, lower to the lower chest, drive up explosively.', img:'Decline_Barbell_Bench_Press/0.jpg' },
  { bodyType:'meso', key:'seated-lateral-raise', day:'chest', name:'Seated lateral raise', badge:'Side delts', badgeClass:'badge-sh', statColor:'c-chest', sets:3, reps:'10–12', rest:60, tip:'Seated removes any momentum — pure side delt isolation.', img:'Seated_Side_Lateral_Raise/0.jpg' },
  { bodyType:'meso', key:'bench-dips', day:'chest', name:'Bench dips', badge:'Triceps', badgeClass:'badge-tri', statColor:'c-chest', sets:3, reps:'10–12', rest:60, tip:'Keep elbows tracking straight back, not flaring, to protect the shoulders.', img:'Bench_Dips/0.jpg' },

  { bodyType:'meso', key:'front-squat', day:'legs', name:'Front squat', badge:'Primary', badgeClass:'badge-legs', statColor:'c-legs', sets:4, reps:'8–10', rest:90, tip:'Elbows high, torso upright. Quad-dominant alternative to the back squat.', img:'Front_Barbell_Squat/0.jpg' },
  { bodyType:'meso', key:'leg-extension', day:'legs', name:'Leg extension', badge:'Quads', badgeClass:'badge-legs', statColor:'c-legs', sets:3, reps:'10–12', rest:60, tip:'Pause and squeeze at full extension, control the negative.', img:'Leg_Extensions/0.jpg' },
  { bodyType:'meso', key:'lying-leg-curl', day:'legs', name:'Lying leg curl', badge:'Hamstrings', badgeClass:'badge-legs', statColor:'c-legs', sets:3, reps:'10–12', rest:60, tip:"Don't let your hips lift off the pad as you curl.", img:'Lying_Leg_Curls/0.jpg' },
  { bodyType:'meso', key:'dumbbell-split-squat', day:'legs', name:'Dumbbell split squat', badge:'Unilateral', badgeClass:'badge-legs', statColor:'c-legs', sets:3, reps:'10 each', rest:75, tip:'Rear foot elevated if possible. Fixes left-right imbalances.', img:'Split_Squat_with_Dumbbells/0.jpg' },
  { bodyType:'meso', key:'seated-calf-raise', day:'legs', name:'Seated calf raise', badge:'Calves', badgeClass:'badge-legs', statColor:'c-legs', sets:4, reps:'12–15', rest:45, tip:'Targets the soleus — full stretch at the bottom, hard squeeze at the top.', img:'Seated_Calf_Raise/0.jpg' },

  { bodyType:'meso', key:'bent-over-row', day:'arms', name:'Bent over row', badge:'Back thickness', badgeClass:'badge-back', statColor:'c-arms', sets:4, reps:'8–10', rest:90, tip:'Flat back, pull to your lower ribs, squeeze the shoulder blades.', img:'Bent_Over_Barbell_Row/0.jpg' },
  { bodyType:'meso', key:'one-arm-dumbbell-row', day:'arms', name:'One-arm dumbbell row', badge:'Back width', badgeClass:'badge-back', statColor:'c-arms', sets:3, reps:'10–12', rest:75, tip:'Support on a bench, pull with the elbow, not the hand.', img:'One-Arm_Dumbbell_Row/0.jpg' },
  { bodyType:'meso', key:'face-pull', day:'arms', name:'Face pull', badge:'Rear delts', badgeClass:'badge-back', statColor:'c-arms', sets:3, reps:'15–20', rest:60, tip:'Pull to your face, thumbs back — great for shoulder health.', img:'Face_Pull/0.jpg' },
  { bodyType:'meso', key:'hammer-curl', day:'arms', name:'Hammer curl', badge:'Biceps', badgeClass:'badge-arms', statColor:'c-arms', sets:3, reps:'10–12', rest:60, tip:'Neutral grip hits the brachialis for thicker-looking arms.', img:'Hammer_Curls/0.jpg' },
  { bodyType:'meso', key:'concentration-curl', day:'arms', name:'Concentration curl', badge:'Biceps peak', badgeClass:'badge-arms', statColor:'c-arms', sets:3, reps:'10–12', rest:60, tip:'Elbow braced on the inner thigh, strict form, no swinging.', img:'Concentration_Curls/0.jpg' },

  { bodyType:'meso', key:'kettlebell-dead-clean', day:'full', name:'Kettlebell dead clean', badge:'Power', badgeClass:'badge-full', statColor:'c-full', sets:4, reps:'6–8 each', rest:75, tip:'Explosive hip drive, let the kettlebell float up to the shoulder.', img:'Kettlebell_Dead_Clean/0.jpg' },
  { bodyType:'meso', key:'box-jump', day:'full', name:'Box jump', badge:'Power', badgeClass:'badge-full', statColor:'c-full', sets:3, reps:'8–10', rest:60, tip:"Land soft, step down — don't jump down.", img:'Box_Jump_Multiple_Response/0.jpg' },
  { bodyType:'meso', key:'russian-twist', day:'full', name:'Russian twist', badge:'Obliques', badgeClass:'badge-core', statColor:'c-full', sets:3, reps:'15–20 each', rest:45, tip:'Rotate from the torso, keep the feet off the ground for extra difficulty.', img:'Russian_Twist/0.jpg' },
  { bodyType:'meso', key:'mountain-climbers', day:'full', name:'Mountain climbers', badge:'Conditioning', badgeClass:'badge-core', statColor:'c-full', sets:3, reps:'30s', repsLabel:'Time', rest:45, tip:'Keep hips low and drive the knees fast — this is a conditioning finisher.', img:'Mountain_Climbers/0.jpg' },

  { bodyType:'endo', key:'pushups', day:'chest', name:'Push-ups', badge:'Chest', badgeClass:'badge-chest', statColor:'c-chest', sets:3, reps:'15–20', rest:30, tip:'Full range, body in a straight line. Elevate your feet to add difficulty as you progress.', img:'Pushups/0.jpg' },
  { bodyType:'endo', key:'dumbbell-row', day:'chest', name:'Two-dumbbell row', badge:'Back', badgeClass:'badge-back', statColor:'c-chest', sets:3, reps:'15–20', rest:30, tip:'Flat back, squeeze at the top, keep the reps brisk to keep your heart rate up.', img:'Bent_Over_Two-Dumbbell_Row/0.jpg' },
  { bodyType:'endo', key:'dumbbell-shoulder-press', day:'chest', name:'Dumbbell shoulder press', badge:'Shoulders', badgeClass:'badge-sh', statColor:'c-chest', sets:3, reps:'15–20', rest:30, tip:'Seated or standing, controlled tempo, no locking out and resting at the top.', img:'Dumbbell_Shoulder_Press/0.jpg' },
  { bodyType:'endo', key:'tricep-kickback', day:'chest', name:'Tricep kickback', badge:'Triceps', badgeClass:'badge-tri', statColor:'c-chest', sets:3, reps:'15–20', rest:30, tip:'Upper arm locked parallel to the floor, extend fully, squeeze.', img:'Tricep_Dumbbell_Kickback/0.jpg' },
  { bodyType:'endo', key:'dumbbell-bicep-curl', day:'chest', name:'Dumbbell bicep curl', badge:'Biceps', badgeClass:'badge-arms', statColor:'c-chest', sets:3, reps:'15–20', rest:30, tip:'Keep it brisk and controlled — higher reps build the metabolic burn endomorphs respond to.', img:'Dumbbell_Bicep_Curl/0.jpg' },

  { bodyType:'endo', key:'goblet-squat', day:'legs', name:'Goblet squat', badge:'Quads', badgeClass:'badge-legs', statColor:'c-legs', sets:3, reps:'15–20', rest:30, tip:'Hold the weight at your chest, elbows push your knees out at the bottom.', img:'Goblet_Squat/0.jpg' },
  { bodyType:'endo', key:'dumbbell-rdl', day:'legs', name:'Dumbbell RDL', badge:'Hamstrings', badgeClass:'badge-legs', statColor:'c-legs', sets:3, reps:'15–20', rest:30, tip:'Soft knees, hinge at the hips, keep the dumbbells close to your legs.', img:'Stiff-Legged_Dumbbell_Deadlift/0.jpg' },
  { bodyType:'endo', key:'dumbbell-step-ups', day:'legs', name:'Dumbbell step-ups', badge:'Glutes', badgeClass:'badge-legs', statColor:'c-legs', sets:3, reps:'15 each', rest:30, tip:"Drive through the lead heel, don't bounce off the trailing leg.", img:'Dumbbell_Step_Ups/0.jpg' },
  { bodyType:'endo', key:'standing-dumbbell-calf-raise', day:'legs', name:'Standing calf raise', badge:'Calves', badgeClass:'badge-legs', statColor:'c-legs', sets:3, reps:'20–25', rest:30, tip:'Fast, high-rep pump work — full stretch and full contraction every rep.', img:'Standing_Dumbbell_Calf_Raise/0.jpg' },
  { bodyType:'endo', key:'rope-jumping', day:'legs', name:'Rope jumping', badge:'Cardio', badgeClass:'badge-core', statColor:'c-legs', sets:3, reps:'60s', repsLabel:'Time', rest:30, tip:'Steady pace finisher — burns fat while keeping your legs conditioned.', img:'Rope_Jumping/0.jpg' },

  { bodyType:'endo', key:'kettlebell-thruster', day:'arms', name:'Kettlebell thruster', badge:'Full body', badgeClass:'badge-full', statColor:'c-arms', sets:3, reps:'12–15', rest:30, tip:'Squat into a press — one continuous, explosive motion.', img:'Kettlebell_Thruster/0.jpg' },
  { bodyType:'endo', key:'renegade-row', day:'arms', name:'Renegade row', badge:'Full body', badgeClass:'badge-back', statColor:'c-arms', sets:3, reps:'10 each', rest:30, tip:'Wide stance for stability, minimize hip rotation as you row.', img:'Alternating_Renegade_Row/0.jpg' },
  { bodyType:'endo', key:'stationary-rowing', day:'arms', name:'Rowing machine', badge:'Cardio', badgeClass:'badge-core', statColor:'c-arms', sets:3, reps:'2 min', repsLabel:'Time', rest:30, tip:'Drive with the legs first, then lean back, then pull — reverse the order on the way in.', img:'Rowing_Stationary/0.jpg' },
  { bodyType:'endo', key:'air-bike', day:'arms', name:'Air bike (bicycle crunch)', badge:'Core', badgeClass:'badge-core', statColor:'c-arms', sets:3, reps:'20 each', rest:30, tip:"Elbow to opposite knee, control the rotation, don't pull on your neck.", img:'Air_Bike/0.jpg' },

  { bodyType:'endo', key:'plank-endo', day:'full', name:'Plank', badge:'Core', badgeClass:'badge-core', statColor:'c-full', sets:3, reps:'45–60s', repsLabel:'Hold', rest:30, tip:'Straight line head to heels — a staple core-and-conditioning hold.', img:'Plank/0.jpg' },
  { bodyType:'endo', key:'crunches', day:'full', name:'Crunches', badge:'Abs', badgeClass:'badge-core', statColor:'c-full', sets:3, reps:'20–25', rest:30, tip:'Small range of motion, keep the lower back pressed to the floor.', img:'Crunches/0.jpg' },
  { bodyType:'endo', key:'side-plank-pushup', day:'full', name:'Push-up to side plank', badge:'Full body', badgeClass:'badge-full', statColor:'c-full', sets:3, reps:'10 each', rest:30, tip:'One push-up, then rotate into a side plank — combines strength and core in one move.', img:'Push_Up_to_Side_Plank/0.jpg' },
  { bodyType:'endo', key:'treadmill-jog', day:'full', name:'Treadmill jog', badge:'Cardio', badgeClass:'badge-core', statColor:'c-full', sets:1, reps:'15–20 min', repsLabel:'Time', rest:60, tip:'Steady-state finisher — this is where the calorie deficit comes from.', img:'Jogging_Treadmill/0.jpg' },

  { key:'arnold-press', name:'Arnold press', badge:'Shoulders', badgeClass:'badge-sh', statColor:'c-arms', sets:3, reps:'10–12', rest:75, tip:'Rotate palms from facing you to facing forward as you press — hits all three delt heads.', img:'Arnold_Dumbbell_Press/0.jpg' },
  { key:'barbell-shrug', name:'Barbell shrug', badge:'Traps', badgeClass:'badge-back', statColor:'c-arms', sets:3, reps:'12–15', rest:60, tip:'Straight up and down, hold the top squeeze — no rolling the shoulders.', img:'Barbell_Shrug/0.jpg' },
  { key:'dumbbell-flyes', name:'Dumbbell flyes', badge:'Isolation', badgeClass:'badge-chest', statColor:'c-chest', sets:3, reps:'10–12', rest:60, tip:'Wide arc, slight elbow bend, feel the chest stretch at the bottom.', img:'Dumbbell_Flyes/0.jpg' },
  { key:'upright-row', name:'Upright row', badge:'Traps + delts', badgeClass:'badge-sh', statColor:'c-arms', sets:3, reps:'10–12', rest:60, tip:'Lead with the elbows, keep the bar close, stop at chin height.', img:'Upright_Barbell_Row/0.jpg' },
  { key:'treadmill-walk', name:'Treadmill walk', badge:'Recovery', badgeClass:'badge-core', statColor:'c-full', sets:1, reps:'30–40 min', repsLabel:'Time', rest:60, tip:'Brisk pace, upright posture — active recovery that speeds up muscle repair.', img:'Walking_Treadmill/0.jpg' },
  { key:'elliptical', name:'Elliptical', badge:'Cardio', badgeClass:'badge-core', statColor:'c-full', sets:1, reps:'15–20 min', repsLabel:'Time', rest:60, tip:'Low-impact steady cardio — keep a pace where you can still hold a conversation.', img:'Elliptical_Trainer/0.jpg' },
  { key:'glute-bridge', name:'Glute bridge', badge:'Glutes', badgeClass:'badge-legs', statColor:'c-legs', sets:3, reps:'15–20', rest:30, tip:'Drive through the heels, squeeze the glutes hard at the top for a second.', img:'Butt_Lift_Bridge/0.jpg' },
  { key:'superman', name:'Superman', badge:'Lower back', badgeClass:'badge-core', statColor:'c-full', sets:3, reps:'12–15', rest:30, tip:'Lift arms, chest, and legs together; squeeze your lower back at the top.', img:'Superman/0.jpg' },
  { key:'preacher-curl', name:'Preacher curl', badge:'Biceps', badgeClass:'badge-arms', statColor:'c-arms', sets:3, reps:'10–12', rest:60, tip:'The pad removes all momentum — full stretch at the bottom, squeeze at the top.', img:'Preacher_Curl/0.jpg' },
  { key:'good-morning', name:'Good morning', badge:'Posterior chain', badgeClass:'badge-legs', statColor:'c-legs', sets:3, reps:'10–12', rest:75, tip:'Light weight, hips back, flat back — hamstrings and lower back do the work.', img:'Good_Morning/0.jpg' },
  { key:'cat-stretch', name:'Cat stretch', badge:'Mobility', badgeClass:'badge-core', statColor:'c-full', sets:3, reps:'15s', repsLabel:'Hold', rest:15, tip:'Round the spine fully, let the head drop, breathe slowly.', img:'Cat_Stretch/0.jpg' },
  { key:'hamstring-calf-stretch', name:'Hamstring & calf stretch', badge:'Mobility', badgeClass:'badge-core', statColor:'c-legs', sets:2, reps:'20s each', repsLabel:'Hold', rest:15, tip:'Front leg straight, toes up, lean forward gently — never bounce.', img:'Standing_Hamstring_and_Calf_Stretch/0.jpg' },
  { key:'chest-shoulder-stretch', name:'Chest & shoulder stretch', badge:'Mobility', badgeClass:'badge-core', statColor:'c-chest', sets:2, reps:'20s', repsLabel:'Hold', rest:15, tip:'Wide grip on a stick or towel, lift up and behind your head slowly.', img:'Chest_And_Front_Of_Shoulder_Stretch/0.jpg' },
  { key:'seated-triceps-press', name:'Seated triceps press', badge:'Triceps', badgeClass:'badge-tri', statColor:'c-chest', sets:3, reps:'10–12', rest:60, tip:'Elbows in and pointed at the ceiling; only the forearms move.', img:'Seated_Triceps_Press/0.jpg' },
  { key:'stationary-bike', name:'Stationary bike', badge:'Cardio', badgeClass:'badge-core', statColor:'c-full', sets:1, reps:'15–20 min', repsLabel:'Time', rest:60, tip:'Moderate resistance, steady cadence — easy on the joints.', img:'Bicycling_Stationary/0.jpg' },
  { key:'reverse-crunch', name:'Reverse crunch', badge:'Abs', badgeClass:'badge-core', statColor:'c-full', sets:3, reps:'12–15', rest:30, tip:'Roll the pelvis back and bring knees to chest — no swinging the legs.', img:'Reverse_Crunch/0.jpg' },
  { key:'lying-leg-raise', name:'Lying leg raise', badge:'Lower abs', badgeClass:'badge-core', statColor:'c-full', sets:3, reps:'12–15', rest:45, tip:'Legs straight, raise to 90 degrees, lower slowly without arching your back.', img:'Flat_Bench_Lying_Leg_Raise/0.jpg' },
  { key:'dumbbell-lunges', name:'Dumbbell lunges', badge:'Quads + glutes', badgeClass:'badge-legs', statColor:'c-legs', sets:3, reps:'10 each', rest:60, tip:'Torso upright, front shin vertical, push through the front heel.', img:'Dumbbell_Lunges/0.jpg' },
  { key:'barbell-lunge', name:'Barbell lunge', badge:'Unilateral', badgeClass:'badge-legs', statColor:'c-legs', sets:3, reps:'8 each', rest:75, tip:'Heavier than dumbbell lunges — use a rack, keep the knee behind the toes.', img:'Barbell_Lunge/0.jpg' }
];

// Written form cues per exercise, sourced from the free-exercise-db (CC0) dataset
const EXERCISE_STEPS = {
  'barbell-bench-press': ["Lie back on a flat bench. Using a medium width grip, lift the bar from the rack and hold it straight over you with your arms locked. This is your starting position.","From the starting position, breathe in and begin coming down slowly until the bar touches your middle chest.","After a brief pause, push the bar back to the starting position as you breathe out, focusing on pushing with your chest. Lock out and squeeze at the top, hold a second.","Repeat for the prescribed reps.","When done, place the bar back in the rack."],
  'incline-dumbbell-press': ["Lie back on an incline bench with a dumbbell in each hand atop your thighs, palms facing each other.","Using your thighs to help, lift the dumbbells one at a time up to shoulder width.","Rotate your wrists so palms face away from you. This is your starting position.","Keeping control, breathe out and push the dumbbells up with your chest.","Lock out at the top, hold a second, then lower slowly.","Repeat for the prescribed reps.","When done, lower the dumbbells to your thighs, then to the floor."],
  'cable-chest-fly': ["Position a flat bench between two low pulleys so your chest lines up with the cables.","Lie flat on the bench, feet on the ground.","Grab a handle in each hand with a palms-up grip.","Extend your arms out to your sides with a slight elbow bend — this is your starting position.","Lift the arms in a semi-circle in front of you until your hands meet, squeezing your chest and exhaling. Hold a second at the top.","Slowly return to the starting position.","Repeat for the prescribed reps."],
  'close-grip-bench-press': ["Lie back on a flat bench. Using a close, shoulder-width grip, lift the bar and hold it straight over you with arms locked — this is your starting position.","Breathing in, lower the bar slowly until it touches your middle chest, keeping elbows tucked close to maximize triceps involvement.","After a pause, press back up as you breathe out, driving with your triceps. Lock out and hold a second.","Repeat for the prescribed reps.","When done, place the bar back in the rack."],
  'tricep-pushdown': ["Attach a bar to a high pulley and grab it overhand at shoulder width.","Stand upright, torso mostly straight, upper arms close to your body and perpendicular to the floor — this is your starting position.","Using your triceps, push the bar down until your arms are fully extended, keeping upper arms stationary. Exhale as you push.","Hold a second at the bottom, then let the bar rise slowly as you inhale.","Repeat for the prescribed reps."],
  'barbell-back-squat': ["Set the bar on a rack at shoulder level, step under it and rest it across the back of your shoulders.","Lift the bar off the rack by pushing with your legs and straightening your torso.","Step back and set your feet shoulder width, toes slightly out, head up, back straight — this is your starting position.","Lower slowly by bending knees and hips, keeping a straight posture, until thighs are just past parallel. Inhale as you descend.","Drive back up by pushing through your heels as you exhale.","Repeat for the prescribed reps."],
  'romanian-deadlift': ["Grab a barbell in front of you with a shoulder-width overhand grip.","Bend the knees slightly, shins vertical, hips back, back straight — this is your starting position.","Keeping back and arms straight, drive your hips forward to lift the bar as you exhale.","Once standing tall, lower the bar by pushing your hips back with only a slight knee bend, feeling the hamstring stretch.","Repeat for the prescribed reps."],
  'leg-press': ["Sit on the leg press machine with feet on the platform at shoulder width.","Release the safety bars and press the platform up until legs are extended without locking the knees — this is your starting position.","Inhale and lower the platform slowly until your knees reach about 90 degrees.","Push mainly through your heels back to the starting position as you exhale.","Repeat for the prescribed reps, then re-lock the safety pins."],
  'walking-lunges': ["Stand with feet shoulder-width apart, hands on hips.","Step forward with one leg, bending both knees to drop your hips until the rear knee nearly touches the ground, torso upright.","Drive through the front heel and extend both knees to rise back up.","Step through with the rear foot and repeat on the opposite leg."],
  'standing-calf-raise': ["Position your shoulders under the pads with the balls of your feet on the block, heels hanging off, knees slightly bent — this is your starting position.","Raise your heels as high as possible, flexing your calves and exhaling. Hold the top for a second.","Lower slowly back down as you inhale, stretching the calves at the bottom.","Repeat for the prescribed reps."],
  'barbell-curl': ["Stand upright holding a barbell at shoulder width, palms forward, elbows close to your torso — this is your starting position.","Keeping upper arms stationary, curl the bar up as you exhale, moving only the forearms.","Squeeze at the top for a second once biceps are fully contracted.","Lower slowly back to the starting position as you inhale.","Repeat for the prescribed reps."],
  'incline-dumbbell-curl': ["Sit back on an incline bench with a dumbbell in each hand at arm's length, elbows close to your torso, palms forward — this is your starting position.","Curl the weights up while keeping upper arms stationary, exhaling as you go, until biceps are fully contracted. Hold a second.","Lower slowly back to the starting position as you inhale.","Repeat for the prescribed reps."],
  'overhead-press': ["Set a barbell at chest height on a rack and grip it just wider than shoulder width, palms forward.","Rest the bar on your collarbone, step back with feet shoulder width apart.","Press the bar overhead, locking out your arms — this is your starting position.","Lower the bar slowly back to your collarbone as you inhale.","Press back up to the starting position as you exhale.","Repeat for the prescribed reps."],
  'lateral-raises': ["Stand holding a dumbbell in each hand at your sides, palms facing you — this is your starting position.","Keeping your torso still, raise the dumbbells out to the sides with a slight elbow bend until arms are parallel to the floor. Exhale and pause a second at the top.","Lower slowly back to your sides as you inhale.","Repeat for the prescribed reps."],
  'skull-crushers': ["Lie on a bench holding an EZ bar with a close grip, arms perpendicular to the floor — this is your starting position.","Keeping upper arms stationary, lower the bar toward your forehead by bending the elbows, inhaling as you go.","Extend the elbows to press the bar back up as you exhale.","Repeat for the prescribed reps."],
  'deadlift': ["Stand in front of a loaded barbell.","Keeping your back straight, bend your knees and grasp the bar with a shoulder-width overhand grip — this is your starting position.","Push through your legs and straighten your torso to lift the bar, exhaling as you rise. Stick your chest out at the top.","Lower back down by bending the knees and hips, keeping the back straight, until the plates touch the floor.","Repeat for the prescribed reps."],
  'pull-up': ["Grab the pull-up bar with palms facing forward at your chosen grip width.","Hang with arms extended, torso tilted back slightly, chest out — this is your starting position.","Pull your torso up until the bar reaches your upper chest, exhaling and squeezing your back.","Lower slowly back to a full hang as you inhale.","Repeat for the prescribed reps."],
  'dips': ["Support yourself on parallel bars with arms locked — this is your starting position.","Inhale and lower yourself slowly, torso leaning forward, elbows flared slightly, until you feel a chest stretch.","Push back up to the starting position as you exhale, squeezing your chest at the top.","Repeat for the prescribed reps."],
  'farmers-carry': ["Stand between two heavy dumbbells or handles.","Grip them and lift by driving through your heels, keeping your back straight and head up.","Walk with short, quick steps for the target distance, breathing steadily."],
  'cable-crunch': ["Kneel below a high pulley with a rope attachment and grasp the rope, lowering it until your hands are next to your face.","Flex your hips slightly, letting the weight extend your lower back — this is your starting position.","Keeping your hips stationary, flex at the waist and contract your abs so your elbows travel toward your thighs, exhaling as you go. Hold a second.","Slowly return to the starting position as you inhale, keeping constant tension on the abs.","Repeat for the prescribed reps."],
  'lat-pulldown': ["Sit at a pulldown machine with a wide bar attached, knee pad adjusted to your height.","Grab the bar with palms facing forward, wider than shoulder width.","Lean your torso back around 30 degrees, chest out — this is your starting position.","Breathing out, pull the bar down until it touches your upper chest, driving the elbows down and back.","Hold a second, squeezing your shoulder blades together, then raise the bar slowly back up as you inhale.","Repeat for the prescribed reps."],
  'seated-cable-row': ["Sit at a low pulley row machine with a V-bar, feet on the platform, knees slightly bent.","Lean forward and grab the handles with your back straight.","Pull back until your torso is upright and slightly arched, chest out — this is your starting position.","Keeping your torso still, pull the handles to your torso, exhaling and squeezing your back hard. Hold a second.","Slowly return to the starting position as you inhale.","Repeat for the prescribed reps."],
  'hanging-leg-raise': ["Hang from a pull-up bar with arms extended, legs straight down — this is your starting position.","Raise your legs until your torso and legs form a 90-degree angle, exhaling as you go. Hold a second.","Lower slowly back to the starting position as you inhale.","Repeat for the prescribed reps."],
  'plank': ["Get into a prone position supported on your toes and forearms, elbows directly below your shoulders.","Keep your body in a straight line and hold the position for the prescribed time."],
  'incline-barbell-bench-press': ["Lie back on an incline bench. Using a medium-width grip, lift the bar from the rack and hold it straight over you with your arms locked. This is your starting position.","As you breathe in, come down slowly until you feel the bar on your upper chest.","After a second pause, bring the bar back to the starting position as you breathe out, pushing with your chest. Lock your arms, squeeze, hold a second, then start coming down slowly again.","Repeat the movement for the prescribed reps.","When done, place the bar back in the rack."],
  'seated-dumbbell-press': ["Grab a couple of dumbbells and sit on a bench with back support, dumbbells upright on your thighs.","Clean the dumbbells up one at a time to shoulder height at each side.","Rotate your wrists so palms face forward. This is your starting position.","Exhale and push the dumbbells up until they touch at the top.","Pause a second, then slowly lower back to the starting position as you inhale.","Repeat for the prescribed reps."],
  'decline-bench-press': ["Secure your legs at the end of a decline bench and lie down.","Using a medium-width grip, lift the bar from the rack and hold it straight over you, arms locked. This is your starting position.","As you breathe in, lower the bar slowly until it touches your lower chest.","After a pause, press back up as you breathe out, using your chest. Lock out, squeeze, hold a second.","Repeat for the prescribed reps, then place the bar back in the rack."],
  'seated-lateral-raise': ["Sit at the end of a flat bench holding a dumbbell in each hand at your sides, palms facing in. This is your starting position.","Keeping your torso stationary, lift the dumbbells out to your sides with a slight elbow bend until arms are parallel to the floor. Exhale and pause a second at the top.","Lower slowly back to the starting position as you inhale.","Repeat for the prescribed reps."],
  'bench-dips': ["Place a bench behind you and hold its edge with hands shoulder-width apart, legs extended forward. This is your starting position.","Inhale and lower your body slowly by bending the elbows until you reach roughly a 90-degree angle, keeping elbows close.","Using your triceps, push back up to the starting position as you exhale.","Repeat for the prescribed reps."],
  'front-squat': ["Set the bar on a rack at the right height, bring your arms up under the bar with elbows high, resting it across the front of your shoulders.","Lift the bar off the rack by pushing with your legs and straightening your torso.","Step back, feet shoulder width, toes slightly out, head up, back straight — this is your starting position.","Lower slowly by bending the knees, keeping the torso upright, until thighs are just past parallel. Inhale as you descend.","Drive back up through the middle of your foot as you exhale.","Repeat for the prescribed reps."],
  'leg-extension': ["Sit on a leg extension machine with your legs under the pad, hands holding the side bars. This is your starting position.","Using your quads, extend your legs to the maximum as you exhale, pausing a second at the top.","Slowly lower back to the starting position as you inhale.","Repeat for the prescribed reps."],
  'lying-leg-curl': ["Lie face down on a leg curl machine with the pad against the back of your lower legs, legs fully stretched. This is your starting position.","Exhale and curl your legs up as far as possible without lifting your hips off the pad. Hold a second at the top.","Inhale and lower back to the starting position.","Repeat for the prescribed reps."],
  'dumbbell-split-squat': ["Get into a staggered stance with your rear foot elevated behind you, a dumbbell in each hand at your sides. This is your starting position.","Lower yourself by flexing the front knee and hip, keeping your posture upright.","Drive through the front heel to return to the starting position.","Repeat for the prescribed reps, then switch legs."],
  'seated-calf-raise': ["Sit on the machine with the balls of your feet on the platform, heels off the edge, thighs under the lever pad.","Lift the lever slightly and release the safety bar. This is your starting position.","Lower your heels as far as comfortable by bending the ankles, inhaling as you go.","Raise your heels as high as possible, contracting your calves, exhaling as you go. Hold a second at the top.","Repeat for the prescribed reps."],
  'bent-over-row': ["Holding a barbell with an overhand grip, bend your knees slightly and bend forward at the waist until your torso is almost parallel to the floor, back straight, bar hanging in front of you. This is your starting position.","Keeping your torso stationary, exhale and pull the bar up to your lower ribs, elbows close to the body. Squeeze at the top and hold a second.","Inhale and slowly lower the bar back to the starting position.","Repeat for the prescribed reps."],
  'one-arm-dumbbell-row': ["Place one knee and hand on a flat bench for support, other foot on the floor, holding a dumbbell in your free hand with your arm extended. This is your starting position.","Pull the dumbbell up to the side of your chest, elbow close to your body, exhaling as you go. Squeeze your back and hold a second.","Lower slowly back to the starting position as you inhale.","Repeat for the prescribed reps, then switch sides."],
  'face-pull': ["Facing a high pulley with a rope attached, grab the rope with both hands.","Pull the rope directly toward your face, separating your hands as you pull, keeping your upper arms parallel to the ground.","Slowly return to the starting position.","Repeat for the prescribed reps."],
  'hammer-curl': ["Stand upright with a dumbbell in each hand at your sides, palms facing your torso, elbows close to your body. This is your starting position.","Exhale and curl the weights forward, keeping the upper arms stationary, until fully contracted. Hold a second.","Inhale and slowly lower back to the starting position.","Repeat for the prescribed reps."],
  'concentration-curl': ["Sit on a bench with a dumbbell between your legs, brace the back of your upper arm against your inner thigh, arm extended. This is your starting position.","Exhale and curl the weight up, keeping the upper arm stationary, until fully contracted. Hold a second and squeeze.","Inhale and slowly lower back to the starting position.","Repeat for the prescribed reps, then switch arms."],
  'kettlebell-dead-clean': ["Place the kettlebell between your feet, push your hips back, and grab it with a flat back. This is your starting position.","Clean the kettlebell to your shoulder by extending through the legs and hips, rotating your wrist as it rises.","Lower the kettlebell back down under control, keeping your back straight.","Repeat for the prescribed reps, then switch sides."],
  'box-jump': ["Stand facing the box, arms at your sides, knees slightly bent. This is your starting position.","Swing your arms and jump up and forward, landing softly with both feet on the box.","Step back down (don't jump down) and reset.","Repeat for the prescribed reps."],
  'russian-twist': ["Sit on the floor with your knees bent, feet either lifted or anchored, torso leaning back to form a V-shape with your thighs, arms extended in front of you. This is your starting position.","Rotate your torso to one side until your arms are parallel to the floor, exhaling as you go.","Return to center, then rotate to the other side.","Repeat for the prescribed reps on each side."],
  'mountain-climbers': ["Start in a push-up position, weight on your hands and toes, one knee driven up toward your chest. This is your starting position.","Explosively switch legs, driving the other knee forward while extending the first leg back.","Continue alternating at a quick pace for the prescribed time."],
  'pushups': ["Get into a push-up position, hands slightly wider than shoulder width, body in a straight line. This is your starting position.","Inhale and lower your body until your chest nearly touches the floor.","Exhale and push back up to the starting position, squeezing your chest at the top.","Repeat for the prescribed reps."],
  'dumbbell-row': ["Holding a dumbbell in each hand, bend your knees slightly and bend forward at the waist until your torso is almost parallel to the floor, back straight, weights hanging in front of you. This is your starting position.","Exhale and pull both dumbbells up to your sides, elbows close to the body. Squeeze at the top and hold a second.","Inhale and slowly lower back to the starting position.","Repeat for the prescribed reps."],
  'dumbbell-shoulder-press': ["Sit or stand holding a dumbbell in each hand at shoulder height, palms facing forward. This is your starting position.","Exhale and press the dumbbells overhead until they nearly touch, without locking out and resting.","Inhale and lower back to shoulder height under control.","Repeat for the prescribed reps."],
  'tricep-kickback': ["Hold a dumbbell in each hand, bend forward at the waist with a flat back, upper arms parallel to the floor, elbows bent 90 degrees. This is your starting position.","Exhale and extend your arms back until fully straight, keeping the upper arms stationary.","Pause, then inhale and bend the elbows back to the starting position.","Repeat for the prescribed reps."],
  'dumbbell-bicep-curl': ["Stand holding a dumbbell in each hand at arm's length, palms facing forward, elbows close to your torso. This is your starting position.","Exhale and curl the weights up until your biceps are fully contracted. Hold a second and squeeze.","Inhale and slowly lower back to the starting position.","Repeat for the prescribed reps."],
  'goblet-squat': ["Hold a dumbbell or kettlebell vertically against your chest with both hands. This is your starting position.","Squat down between your legs until your hamstrings rest on your calves, chest and head up.","Pause at the bottom, then drive back up through your heels to the starting position.","Repeat for the prescribed reps."],
  'dumbbell-rdl': ["Hold a dumbbell in each hand in front of your thighs, torso straight, knees slightly bent. This is your starting position.","Keeping the knees mostly stationary, lower the dumbbells down the front of your legs by hinging at the waist, back straight, until you feel a hamstring stretch.","Exhale and drive your hips forward to return to the starting position.","Repeat for the prescribed reps."],
  'dumbbell-step-ups': ["Stand in front of a sturdy elevated platform holding a dumbbell in each hand. This is your starting position.","Place one foot fully on the platform and drive through that heel to step up, bringing the other foot up to meet it.","Step back down with control, one foot at a time.","Repeat for the prescribed reps, then switch the leading leg."],
  'standing-dumbbell-calf-raise': ["Stand holding a dumbbell in each hand, balls of your feet on a raised surface, heels hanging off. This is your starting position.","Exhale and raise your heels as high as possible, contracting your calves. Hold a second at the top.","Inhale and lower your heels back down past level for a full stretch.","Repeat for the prescribed reps."],
  'rope-jumping': ["Hold one end of the rope in each hand, positioned behind you on the ground.","Turn the rope overhead and jump over it as it passes under your feet, maintaining a steady rhythm.","Continue for the prescribed time, using a pace you can sustain."],
  'kettlebell-thruster': ["Clean two kettlebells to your shoulders, extending through the legs and hips to bring them up. This is your starting position.","Squat down by flexing your hips and knees, keeping your back straight.","Drive back up explosively, using the momentum to press both kettlebells overhead.","Lower the kettlebells back to your shoulders and repeat for the prescribed reps."],
  'renegade-row': ["Get into a push-up position gripping two kettlebells on the floor, feet set wide for stability. This is your starting position.","Row one kettlebell up to your ribs, keeping your hips square, while balancing on the other arm.","Lower the kettlebell back down and repeat on the other side.","Continue alternating for the prescribed reps."],
  'stationary-rowing': ["Sit on the rowing machine, feet strapped in, knees bent, arms extended forward holding the handle. This is your starting position.","Drive through your legs first, then lean back slightly, then pull the handle to your upper abdomen.","Reverse the order on the way back: extend your arms, lean forward, then bend your knees.","Continue at a steady pace for the prescribed time."],
  'air-bike': ["Lie on your back, hands lightly beside your head, knees raised with lower legs parallel to the floor. This is your starting position.","Crunch up and bring your right elbow toward your left knee while extending your right leg, exhaling as you go.","Switch sides in a pedaling motion, bringing your left elbow toward your right knee.","Continue alternating for the prescribed reps on each side."],
  'plank-endo': ["Get into a prone position supported on your toes and forearms, elbows directly below your shoulders.","Keep your body in a straight line and hold the position for the prescribed time."],
  'crunches': ["Lie on your back, knees bent, feet flat on the floor, hands lightly beside your head. This is your starting position.","Exhale and curl your shoulders up off the floor a few inches, contracting your abs. Keep your lower back on the floor.","Hold a second at the top, then inhale and lower back down.","Repeat for the prescribed reps."],
  'side-plank-pushup': ["Start in a push-up position, hands just outside shoulder width. This is your starting position.","Perform one push-up, keeping your body straight as you descend.","As you push back up, rotate onto one side into a side plank, reaching the top arm toward the ceiling.","Return to the push-up position and repeat, alternating sides each rep."],
  'treadmill-jog': ["Step onto the treadmill and select a manual pace or program.","Maintain an upright posture and a steady jogging pace for the prescribed time, only holding the rails when necessary."],
  'arnold-press': ["Sit on a bench with back support holding two dumbbells at upper chest level, palms facing your body, elbows bent — like the top of a curl. This is your starting position.","Press the dumbbells up while rotating your palms until they face forward.","Continue until your arms are extended overhead, exhaling as you press.","Pause a second at the top, then lower back down while rotating your palms back toward you, inhaling as you go.","Repeat for the prescribed reps."],
  'barbell-shrug': ["Stand straight, feet shoulder width, holding a barbell in front of you with an overhand grip just wider than shoulder width. This is your starting position.","Raise your shoulders straight up as high as possible as you exhale, holding the squeeze a second. Don't use your biceps.","Lower slowly back to the starting position as you inhale.","Repeat for the prescribed reps."],
  'dumbbell-flyes': ["Lie on a flat bench with a dumbbell in each hand, pressed up above you at shoulder width, palms facing each other, just short of lockout. This is your starting position.","With a slight fixed bend in the elbows, lower your arms out to the sides in a wide arc until you feel a chest stretch. Inhale as you lower.","Bring your arms back up along the same arc, squeezing your chest and exhaling.","Hold a second at the top and repeat for the prescribed reps."],
  'upright-row': ["Grasp a barbell with an overhand grip slightly narrower than shoulder width, resting on your thighs, back straight. This is your starting position.","Exhale and lift the bar straight up your body, driving your elbows up and out until the bar nears your chin. Elbows stay above forearms.","Pause a second at the top, then lower slowly as you inhale.","Repeat for the prescribed reps."],
  'treadmill-walk': ["Step onto the treadmill and pick a manual setting or program; adjust incline to change intensity.","Walk at a brisk (not leisurely) pace with upright posture for the prescribed time, holding the handles only when needed."],
  'elliptical': ["Step onto the elliptical and select a manual setting or program; adjust resistance/elevation to set intensity.","Keep a steady, conversational pace for the prescribed time; use the handles to monitor heart rate if available."],
  'glute-bridge': ["Lie on your back, knees bent, feet flat at shoulder width, arms by your sides. This is your starting position.","Push through your heels and lift your hips off the floor, keeping your back straight. Exhale and hold the top squeeze for a second.","Lower slowly back to the starting position as you inhale.","Repeat for the prescribed reps."],
  'superman': ["Lie face down with your arms fully extended in front of you. This is your starting position.","Raise your arms, chest, and legs off the floor at the same time, exhaling and squeezing your lower back. Hold for 2 seconds.","Lower slowly back to the floor as you inhale.","Repeat for the prescribed reps."],
  'preacher-curl': ["Sit at a preacher bench with an EZ bar, upper arms and chest against the pad, holding the bar at shoulder length. This is your starting position.","Inhale and lower the bar slowly until your arms are fully extended and the biceps fully stretched.","Exhale and curl the bar back up until fully contracted at shoulder height. Squeeze hard and hold a second.","Repeat for the prescribed reps."],
  'good-morning': ["Rack a light bar across the rear of your shoulders (like a squat), back tight, knees slightly bent, and step back from the rack.","Bend at the hips, pushing them back as your torso lowers toward parallel, keeping your back arched and neck neutral. Inhale as you go.","Drive your hips forward using your glutes and hamstrings to return upright as you exhale.","Repeat for the prescribed reps."],
  'cat-stretch': ["Get on the floor on your hands and knees.","Pull your belly in and round your spine, shoulders, and neck, letting your head drop.","Hold for the prescribed time, breathing slowly."],
  'hamstring-calf-stretch': ["Loop a belt, band, or towel around one foot and place that foot forward while standing.","Bend your back leg, keep the front leg straight, lift the front toes off the ground, and lean forward.","Gently pull the top of the foot toward you to deepen the calf stretch. Hold for the prescribed time, then switch feet."],
  'chest-shoulder-stretch': ["Stand with legs together holding a stick, band, or towel.","Take a wider-than-shoulder grip and hold it in front of you, palms down.","Slowly lift it up and over behind your head, keeping the arms straight. Hold for the prescribed time."],
  'seated-triceps-press': ["Sit on a bench with back support holding one dumbbell overhead with both hands, palms on the underside of the top plate. This is your starting position.","Keeping your upper arms close to your head and elbows pointed up, lower the dumbbell in an arc behind your head until your forearms touch your biceps. Inhale as you lower.","Press back up to the starting position using your triceps as you exhale.","Repeat for the prescribed reps."],
  'stationary-bike': ["Sit on the bike and adjust the seat to your height.","Pick a manual setting or program and pedal at a steady cadence for the prescribed time, adjusting resistance as needed."],
  'reverse-crunch': ["Lie on the floor, legs extended, arms at your sides with palms down.","Bring your legs up so your thighs are vertical and feet together — this is your starting position.","Inhale and pull your knees toward your chest, rolling your pelvis back and lifting your hips off the floor.","Hold a second, then return your legs to the starting position as you exhale.","Repeat for the prescribed reps."],
  'lying-leg-raise': ["Lie flat on a bench with your legs extended off the end, hands under your glutes or gripping the bench. This is your starting position.","Keeping your legs straight, raise them until they're at 90 degrees to the floor, exhaling and holding a second at the top.","Lower slowly back to the starting position as you inhale.","Repeat for the prescribed reps."],
  'dumbbell-lunges': ["Stand upright with a dumbbell in each hand at your sides. This is your starting position.","Step forward about two feet and lower your body, keeping your torso upright and front shin vertical. Inhale as you descend.","Push through the front heel to return to the starting position as you exhale.","Repeat for the prescribed reps, then switch legs."],
  'barbell-lunge': ["Set a bar in a rack just below shoulder height and rack it across the back of your shoulders, then step back.","Step forward with one leg and squat down through your hips, torso upright, knee behind the toes. Inhale as you descend.","Push through the front heel to return to the starting position as you exhale.","Repeat for the prescribed reps, then switch legs."]
};

let currentBodyType = 'ecto';

// PLANS[bodyType][daysPerWeek] = one entry per training day: chip (tab label),
// label (section heading), color (day accent var), ex (exercise keys from the pool)
const PLANS = {
  ecto: {
    4: [
      { chip:'Chest & Tris', label:'Chest, Triceps & Abs', color:'chest', ex:['barbell-bench-press','incline-dumbbell-press','cable-chest-fly','close-grip-bench-press','tricep-pushdown','cable-crunch'] },
      { chip:'Legs', label:'Legs & Glutes', color:'legs', ex:['barbell-back-squat','romanian-deadlift','leg-press','walking-lunges','standing-calf-raise'] },
      { chip:'Back & Arms', label:'Back, Arms & Shoulders', color:'arms', ex:['lat-pulldown','seated-cable-row','barbell-curl','incline-dumbbell-curl','overhead-press','lateral-raises','skull-crushers'] },
      { chip:'Full Body', label:'Full Body & Core', color:'full', ex:['deadlift','pull-up','dips','farmers-carry','hanging-leg-raise','plank'] }
    ],
    5: [
      { chip:'Chest', label:'Chest', color:'chest', ex:['barbell-bench-press','incline-dumbbell-press','dumbbell-flyes','cable-chest-fly','pushups'] },
      { chip:'Back', label:'Back & Traps', color:'back', ex:['deadlift','lat-pulldown','seated-cable-row','one-arm-dumbbell-row','barbell-shrug'] },
      { chip:'Legs', label:'Legs & Glutes', color:'legs', ex:['barbell-back-squat','romanian-deadlift','leg-press','barbell-lunge','standing-calf-raise'] },
      { chip:'Delts & Arms', label:'Shoulders & Arms', color:'arms', ex:['overhead-press','lateral-raises','barbell-curl','preacher-curl','skull-crushers','tricep-pushdown'] },
      { chip:'Full Body', label:'Full Body & Core', color:'full', ex:['pull-up','dips','farmers-carry','hanging-leg-raise','plank'] }
    ],
    6: [
      { chip:'Push A', label:'Push A — Chest & Shoulders', color:'chest', ex:['barbell-bench-press','overhead-press','incline-dumbbell-press','tricep-pushdown','cable-crunch'] },
      { chip:'Pull A', label:'Pull A — Back & Biceps', color:'back', ex:['deadlift','lat-pulldown','barbell-curl','face-pull','barbell-shrug'] },
      { chip:'Legs A', label:'Legs A — Squat Focus', color:'legs', ex:['barbell-back-squat','romanian-deadlift','leg-press','standing-calf-raise'] },
      { chip:'Push B', label:'Push B — Volume', color:'chest', ex:['incline-barbell-bench-press','dips','lateral-raises','skull-crushers','dumbbell-flyes'] },
      { chip:'Pull B', label:'Pull B — Width & Arms', color:'back', ex:['pull-up','seated-cable-row','incline-dumbbell-curl','hammer-curl','upright-row'] },
      { chip:'Legs B', label:'Legs B — Unilateral & Core', color:'legs', ex:['front-squat','barbell-lunge','lying-leg-curl','seated-calf-raise','hanging-leg-raise'] }
    ],
    7: [
      { chip:'Push A', label:'Push A — Chest & Shoulders', color:'chest', ex:['barbell-bench-press','overhead-press','incline-dumbbell-press','tricep-pushdown','cable-crunch'] },
      { chip:'Pull A', label:'Pull A — Back & Biceps', color:'back', ex:['deadlift','lat-pulldown','barbell-curl','face-pull','barbell-shrug'] },
      { chip:'Legs A', label:'Legs A — Squat Focus', color:'legs', ex:['barbell-back-squat','romanian-deadlift','leg-press','standing-calf-raise'] },
      { chip:'Push B', label:'Push B — Volume', color:'chest', ex:['incline-barbell-bench-press','dips','lateral-raises','skull-crushers','dumbbell-flyes'] },
      { chip:'Pull B', label:'Pull B — Width & Arms', color:'back', ex:['pull-up','seated-cable-row','incline-dumbbell-curl','hammer-curl','upright-row'] },
      { chip:'Legs B', label:'Legs B — Unilateral & Core', color:'legs', ex:['front-squat','barbell-lunge','lying-leg-curl','seated-calf-raise','hanging-leg-raise'] },
      { chip:'Recovery', label:'Active Recovery & Mobility', color:'core', ex:['treadmill-walk','cat-stretch','hamstring-calf-stretch','chest-shoulder-stretch'] }
    ]
  },
  meso: {
    4: [
      { chip:'Push', label:'Push Day', color:'chest', ex:['incline-barbell-bench-press','seated-dumbbell-press','decline-bench-press','seated-lateral-raise','bench-dips'] },
      { chip:'Legs', label:'Legs', color:'legs', ex:['front-squat','leg-extension','lying-leg-curl','dumbbell-split-squat','seated-calf-raise'] },
      { chip:'Pull', label:'Pull Day', color:'arms', ex:['bent-over-row','one-arm-dumbbell-row','face-pull','hammer-curl','concentration-curl'] },
      { chip:'Conditioning', label:'Conditioning & Core', color:'full', ex:['kettlebell-dead-clean','box-jump','russian-twist','mountain-climbers'] }
    ],
    5: [
      { chip:'Push', label:'Push Day', color:'chest', ex:['incline-barbell-bench-press','seated-dumbbell-press','decline-bench-press','seated-lateral-raise','bench-dips'] },
      { chip:'Pull', label:'Pull Day', color:'back', ex:['bent-over-row','one-arm-dumbbell-row','face-pull','hammer-curl','concentration-curl'] },
      { chip:'Legs', label:'Legs', color:'legs', ex:['front-squat','leg-extension','lying-leg-curl','dumbbell-split-squat','seated-calf-raise'] },
      { chip:'Power Upper', label:'Power Upper Body', color:'arms', ex:['arnold-press','upright-row','barbell-shrug','close-grip-bench-press','preacher-curl'] },
      { chip:'Conditioning', label:'Conditioning & Core', color:'full', ex:['kettlebell-dead-clean','box-jump','russian-twist','mountain-climbers','reverse-crunch'] }
    ],
    6: [
      { chip:'Push A', label:'Push A', color:'chest', ex:['incline-barbell-bench-press','seated-dumbbell-press','bench-dips','seated-lateral-raise'] },
      { chip:'Pull A', label:'Pull A', color:'back', ex:['bent-over-row','face-pull','hammer-curl','barbell-shrug'] },
      { chip:'Legs A', label:'Legs A', color:'legs', ex:['front-squat','lying-leg-curl','leg-extension','seated-calf-raise'] },
      { chip:'Push B', label:'Push B', color:'chest', ex:['decline-bench-press','arnold-press','dumbbell-flyes','seated-triceps-press'] },
      { chip:'Pull B', label:'Pull B', color:'back', ex:['one-arm-dumbbell-row','upright-row','preacher-curl','concentration-curl'] },
      { chip:'Legs & Core', label:'Legs B & Core', color:'legs', ex:['dumbbell-split-squat','dumbbell-lunges','good-morning','russian-twist','reverse-crunch'] }
    ],
    7: [
      { chip:'Push A', label:'Push A', color:'chest', ex:['incline-barbell-bench-press','seated-dumbbell-press','bench-dips','seated-lateral-raise'] },
      { chip:'Pull A', label:'Pull A', color:'back', ex:['bent-over-row','face-pull','hammer-curl','barbell-shrug'] },
      { chip:'Legs A', label:'Legs A', color:'legs', ex:['front-squat','lying-leg-curl','leg-extension','seated-calf-raise'] },
      { chip:'Push B', label:'Push B', color:'chest', ex:['decline-bench-press','arnold-press','dumbbell-flyes','seated-triceps-press'] },
      { chip:'Pull B', label:'Pull B', color:'back', ex:['one-arm-dumbbell-row','upright-row','preacher-curl','concentration-curl'] },
      { chip:'Legs & Core', label:'Legs B & Core', color:'legs', ex:['dumbbell-split-squat','dumbbell-lunges','good-morning','russian-twist','reverse-crunch'] },
      { chip:'Recovery', label:'Active Recovery & Mobility', color:'core', ex:['stationary-bike','cat-stretch','hamstring-calf-stretch','chest-shoulder-stretch'] }
    ]
  },
  endo: {
    4: [
      { chip:'Upper', label:'Upper Body', color:'chest', ex:['pushups','dumbbell-row','dumbbell-shoulder-press','tricep-kickback','dumbbell-bicep-curl'] },
      { chip:'Lower+Cardio', label:'Lower Body & Cardio', color:'legs', ex:['goblet-squat','dumbbell-rdl','dumbbell-step-ups','standing-dumbbell-calf-raise','rope-jumping'] },
      { chip:'Full Circuit', label:'Full-Body Circuit', color:'arms', ex:['kettlebell-thruster','renegade-row','stationary-rowing','air-bike'] },
      { chip:'Core & Cardio', label:'Core & Conditioning', color:'full', ex:['plank-endo','crunches','side-plank-pushup','treadmill-jog'] }
    ],
    5: [
      { chip:'Upper', label:'Upper Body', color:'chest', ex:['pushups','dumbbell-row','dumbbell-shoulder-press','tricep-kickback','dumbbell-bicep-curl'] },
      { chip:'Lower+Cardio', label:'Lower Body & Cardio', color:'legs', ex:['goblet-squat','dumbbell-rdl','dumbbell-step-ups','standing-dumbbell-calf-raise','rope-jumping'] },
      { chip:'Full Circuit', label:'Full-Body Circuit', color:'back', ex:['kettlebell-thruster','renegade-row','stationary-rowing','air-bike'] },
      { chip:'Dumbbell Full', label:'Full-Body Dumbbell', color:'full', ex:['dumbbell-lunges','glute-bridge','dumbbell-flyes','one-arm-dumbbell-row','elliptical'] },
      { chip:'Core & Cardio', label:'Core & Conditioning', color:'core', ex:['plank-endo','crunches','side-plank-pushup','reverse-crunch','treadmill-jog'] }
    ],
    6: [
      { chip:'Upper A', label:'Upper A', color:'chest', ex:['pushups','dumbbell-row','dumbbell-shoulder-press','tricep-kickback'] },
      { chip:'Lower A', label:'Lower A', color:'legs', ex:['goblet-squat','dumbbell-rdl','standing-dumbbell-calf-raise','glute-bridge'] },
      { chip:'Circuit', label:'Full-Body Circuit', color:'back', ex:['kettlebell-thruster','renegade-row','stationary-rowing','air-bike'] },
      { chip:'Upper B', label:'Upper B', color:'arms', ex:['dumbbell-flyes','one-arm-dumbbell-row','arnold-press','dumbbell-bicep-curl'] },
      { chip:'Lower B', label:'Lower B & Core', color:'full', ex:['dumbbell-lunges','dumbbell-step-ups','superman','lying-leg-raise'] },
      { chip:'Cardio & Core', label:'Cardio & Core', color:'core', ex:['treadmill-jog','plank-endo','crunches','reverse-crunch'] }
    ],
    7: [
      { chip:'Upper A', label:'Upper A', color:'chest', ex:['pushups','dumbbell-row','dumbbell-shoulder-press','tricep-kickback'] },
      { chip:'Lower A', label:'Lower A', color:'legs', ex:['goblet-squat','dumbbell-rdl','standing-dumbbell-calf-raise','glute-bridge'] },
      { chip:'Circuit', label:'Full-Body Circuit', color:'back', ex:['kettlebell-thruster','renegade-row','stationary-rowing','air-bike'] },
      { chip:'Upper B', label:'Upper B', color:'arms', ex:['dumbbell-flyes','one-arm-dumbbell-row','arnold-press','dumbbell-bicep-curl'] },
      { chip:'Lower B', label:'Lower B & Core', color:'full', ex:['dumbbell-lunges','dumbbell-step-ups','superman','lying-leg-raise'] },
      { chip:'Cardio & Core', label:'Cardio & Core', color:'core', ex:['treadmill-jog','plank-endo','crunches','reverse-crunch'] },
      { chip:'Recovery', label:'Recovery Walk & Mobility', color:'core', ex:['treadmill-walk','elliptical','cat-stretch','hamstring-calf-stretch'] }
    ]
  }
};

function getDaysPerWeek() {
  const p = getProfile();
  return (p && [4,5,6,7].includes(p.daysPerWeek)) ? p.daysPerWeek : 4;
}
function currentPlan() { return PLANS[currentBodyType][getDaysPerWeek()]; }

const BODY_GUIDES = {
  ecto: {
    subtitle: 'Ectomorph mass builder',
    muscleWhy: 'Chest adds width, arms add definition, and legs trigger the most whole-body anabolic growth. As an ectomorph these three groups give you the fastest visible results.',
    heading: 'Ectomorph guide',
    rows: [
      { label:'Calorie surplus', value:'+400–600 kcal/day', pct:75, color:'#4a8fd4' },
      { label:'Protein target', value:'1.6–2g per kg', pct:85, color:'#5db87a' },
      { label:'Sleep requirement', value:'8–9 hrs', pct:90, color:'#9b7fe8' },
      { label:'Cardio cap', value:'2 sessions/week max', pct:25, color:'#e87a50' }
    ],
    cards: [
      { title:'🍗 Eat more than you think', body:"Ectomorphs have fast metabolisms. If you're not gaining weight, you're not eating enough. Track calories for 2 weeks, then add 400 to 600 above maintenance." },
      { title:'🏋️ Heavy compound lifts first', body:'Squats, deadlifts, bench press, and overhead press should anchor every session. Isolation work comes after, not instead of, these lifts.' },
      { title:'⏱️ Keep sessions under 60 min', body:'Long sessions raise cortisol and blunt muscle growth. Aim for 45 to 55 minutes of focused lifting.' },
      { title:'😴 Sleep is your anabolic window', body:'Growth hormone is released during deep sleep. Ectomorphs need 8 to 9 hours. Treat sleep as part of your training program.' },
      { title:'📈 Track progressive overload', body:"Write down your weights and reps every single session. If you're not lifting more over time, your muscles have no reason to grow." }
    ]
  },
  meso: {
    subtitle: 'Mesomorph recomposition',
    muscleWhy: 'Mesomorphs build muscle and lose fat relatively easily — a balanced Push/Pull/Legs split with moderate volume is what actually drives results, not extremes in either direction.',
    heading: 'Mesomorph guide',
    rows: [
      { label:'Calorie balance', value:'Maintenance to +200 kcal/day', pct:55, color:'#4a8fd4' },
      { label:'Protein target', value:'1.6–2g per kg', pct:80, color:'#5db87a' },
      { label:'Sleep requirement', value:'7–9 hrs', pct:80, color:'#9b7fe8' },
      { label:'Cardio', value:'2–3 sessions/week', pct:50, color:'#e87a50' }
    ],
    cards: [
      { title:'⚖️ Small surplus, not a big one', body:'You gain muscle easily but can gain fat just as easily. Stay near maintenance or a slight surplus and let the scale move slowly.' },
      { title:'🔄 Rotate your rep ranges', body:'Mix moderate (8-12) and occasional heavier (4-6) work every few weeks so you keep adapting instead of plateauing.' },
      { title:'🏃 Keep some conditioning', body:'2-3 short cardio or conditioning sessions a week keeps body composition in check without eating into recovery.' },
      { title:'😴 Prioritize recovery', body:'You respond fast to training, which also means you can overtrain fast. Respect rest days.' },
      { title:'📈 Track everything', body:'Log every set — mesomorphs plateau when training gets vague, not when genetics run out.' }
    ]
  },
  endo: {
    subtitle: 'Endomorph fat-loss & strength',
    muscleWhy: 'Endomorphs gain muscle and fat easily, so the priority is metabolic: higher-rep circuits, shorter rest, and built-in cardio finishers keep your heart rate up while you still build real strength.',
    heading: 'Endomorph guide',
    rows: [
      { label:'Calorie deficit', value:'-300–500 kcal/day', pct:60, color:'#4a8fd4' },
      { label:'Protein target', value:'2–2.4g per kg', pct:90, color:'#5db87a' },
      { label:'Sleep requirement', value:'7–9 hrs', pct:80, color:'#9b7fe8' },
      { label:'Cardio', value:'4–5 sessions/week', pct:85, color:'#e87a50' }
    ],
    cards: [
      { title:'🥗 Protein and fiber first', body:'Build meals around lean protein and vegetables — they keep you full on fewer calories, which matters most for fat loss.' },
      { title:'⏱️ Keep rest short', body:"Short rest periods (30-45s) keep your heart rate elevated and burn more calories per session — that's the point of this split." },
      { title:'🚶 Walk daily, on top of training', body:'8,000-10,000 steps a day outside the gym does more for fat loss than any single workout.' },
      { title:'😴 Sleep protects the diet', body:'Poor sleep increases hunger hormones. Under-sleeping while in a deficit is the #1 reason diets fail.' },
      { title:'📈 Track weight weekly, not daily', body:'Daily weight swings with water and food — a weekly average in the Progress tab tells the real story.' }
    ]
  }
};

// indexes (1-based into the plan array), 'R' is a rest day.
const WEEK_LAYOUTS = {
  4: [1, 2, 'R', 3, 4, 'R', 'R'],
  5: [1, 2, 3, 'R', 4, 5, 'R'],
  6: [1, 2, 3, 4, 5, 6, 'R'],
  7: [1, 2, 3, 4, 5, 6, 7]
};

// Calendar day number (1-7) for a given training-day index
function calendarDayFor(trainIdx) {
  const layout = WEEK_LAYOUTS[getDaysPerWeek()];
  return layout.indexOf(trainIdx) + 1;
}

const BODY_TYPE_NAMES = { ecto: 'Ectomorph', meso: 'Mesomorph', endo: 'Endomorph' };
