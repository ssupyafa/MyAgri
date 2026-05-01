features = ['Precipitation_mm', 'Temperature_C', 'Solar_Radiation_MJ_m2',
       'Evapotranspiration_mm', 'Soil_Moisture_%', 'Humidity_%',
       'Drought_Duration_days', 'WUE_g_per_mm', 'Leaf_Water_Potential_MPa',
       'Stomatal_Conductance_mol_m2_s', 'Root_Depth_cm',
       'Photosynthetic_Rate_umol_m2_s', 'Plant_Biomass_g_m2', 'ZmDREB2A',
       'Root_QTL', 'ZmNAC', 'Planting_Density_plants_ha', 'Soil_Type',
       'Growth_Stage']

def print_statement(nameofobject):
    statement = f'<section><div class="text-block-36">{nameofobject}</div><input class="text-field-2 w-input" maxlength="256" name="{nameofobject}" data-name="first" placeholder="" type="number" id="first" /></section>'
    print(statement)

count = 1
print('<section class="section-83">')

for i in features:
    if count == 2:
        count = 0
        print('</section>\n\n<section class="section-83">')
        print_statement(i)
    else:
        print_statement(i)
        count += 1