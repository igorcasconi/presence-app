export enum WORKOUT_TYPES {
  UPPER_LIMBS = "upperLimbs",
  LOWER_LIMBS = "lowerLimbs",
  MOBILITY = "mobility",
  LOCOMOTION = "locomotion",
  HANDSTAND = "handstand",
}

export const optionsWorkoutType = [
  {
    id: WORKOUT_TYPES.UPPER_LIMBS,
    label: "Membros superiores",
  },
  {
    id: WORKOUT_TYPES.LOWER_LIMBS,
    label: "Membros inferiores",
  },
  {
    id: WORKOUT_TYPES.LOCOMOTION,
    label: "Locomoção",
  },
  {
    id: WORKOUT_TYPES.MOBILITY,
    label: "Mobilidade",
  },
  {
    id: WORKOUT_TYPES.HANDSTAND,
    label: "Parada de mão",
  },
];
