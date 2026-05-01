export const RANGES = {
  N: { min: 0, max: 200 },
  P: { min: 0, max: 200 },
  K: { min: 0, max: 300 },
  temperature: { min: 0, max: 60 },
  humidity: { min: 0, max: 100 },
  ph: { min: 0, max: 14 },
  rainfall: { min: 0, max: 3000 },

  TS: { min: 200, max: 350 },
  T2M: { min: -50, max: 60 },
  T2M_MAX: { min: -50, max: 60 },
  T2M_MIN: { min: -50, max: 60 },
  T2MDEW: { min: -50, max: 60 },
  QV2M: { min: 0, max: 50 },
  RH2M: { min: 0, max: 100 },
  WS10M: { min: 0, max: 100 },
  WS2M: { min: 0, max: 100 },
  ALLSKY_SFC_PAR_TOT: { min: 0, max: 1000 },
  ALLSKY_SFC_SW_DWN: { min: 0, max: 1500 },
  PS: { min: 50, max: 115 },
  PRECTOTCORR: { min: 0, max: 500 },

  Temperature_C: { min: -50, max: 60 },
  'Humidity_%': { min: 0, max: 100 },
  'Soil_Moisture_%': { min: 0, max: 1 },
  Precipitation_mm: { min: 0, max: 500 },
  Solar_Radiation_MJ_m2: { min: 0, max: 2000 },
  Evapotranspiration_mm: { min: 0, max: 50 },
  Drought_Duration_days: { min: 0, max: 365 },
  WUE_g_per_mm: { min: 0, max: 100 },
  Leaf_Water_Potential_MPa: { min: -10, max: 2 },
  Stomatal_Conductance_mol_m2_s: { min: 0, max: 5 },
  Root_Depth_cm: { min: 0, max: 500 },
  Photosynthetic_Rate_umol_m2_s: { min: 0, max: 100 },
  Plant_Biomass_g_m2: { min: 0, max: 10000 },
  Planting_Density_plants_ha: { min: 0, max: 200000 },
};

export const isValueRandom = (name, value) => {
  if (value === '' || value === undefined || value === null) return false;
  const num = parseFloat(value);
  if (isNaN(num)) return false;
  const range = RANGES[name];
  if (!range) return false;
  return num < range.min || num > range.max;
};

export const checkFormDataForRandomness = (formData) => {
  return Object.keys(formData).some(key => isValueRandom(key, formData[key]));
};