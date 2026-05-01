import 'package:flutter/material.dart';
import '../services/api_service.dart';
import '../l10n/app_localizations.dart';

class DroughtScreen extends StatefulWidget {
  const DroughtScreen({Key? key}) : super(key: key);

  @override
  _DroughtScreenState createState() => _DroughtScreenState();
}

class _DroughtScreenState extends State<DroughtScreen> {
  final _formKey = GlobalKey<FormState>();
  final ApiService _api = ApiService();
  bool _isLoading = false;
  double? _result;

  final List<String> _fields = [
    'Precipitation_mm', 'Temperature_C', 'Solar_Radiation_MJ_m2',
    'Evapotranspiration_mm', 'Soil_Moisture_%', 'Humidity_%',
    'Drought_Duration_days', 'WUE_g_per_mm', 'Leaf_Water_Potential_MPa',
    'Stomatal_Conductance_mol_m2_s', 'Root_Depth_cm',
    'Photosynthetic_Rate_umol_m2_s', 'Plant_Biomass_g_m2', 'ZmDREB2A',
    'Root_QTL', 'ZmNAC', 'Planting_Density_plants_ha', 'Soil_Type', 'Growth_Stage'
  ];

  late final Map<String, TextEditingController> _controllers;

  @override
  void initState() {
    super.initState();
    _controllers = {for (var f in _fields) f: TextEditingController()};
  }

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;
    setState(() => _isLoading = true);
    final payload = _controllers.map((k, v) => MapEntry(k, v.text));
    final res = await _api.post('/drought', payload);
    setState(() {
      _isLoading = false;
      if (res['status'] == 'success') {
        final innerResult = res['result'];
        if (innerResult is Map) {
          _result = (innerResult['prediction'] as num).toDouble();
        } else {
          _result = (innerResult as num).toDouble();
        }
      } else {
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(res['message'] ?? 'Error fetching prediction')));
      }
    });
  }

  final List<String> _soilTypes = ['Clay', 'Loam', 'Silt'];
  final List<String> _growthStages = ['Flowering', 'Grain_Fill', 'Vegetative'];

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context)!;
    final Map<String, String> localizedLabels = {
      'Precipitation_mm': l10n.drought_Precipitation,
      'Temperature_C': l10n.drought_Temperature,
      'Solar_Radiation_MJ_m2': l10n.drought_SolarRadiation,
      'Evapotranspiration_mm': l10n.drought_Evapotranspiration,
      'Soil_Moisture_%': l10n.drought_SoilMoisture,
      'Humidity_%': l10n.drought_Humidity,
      'Drought_Duration_days': l10n.drought_Duration,
      'WUE_g_per_mm': l10n.drought_WUE,
      'Leaf_Water_Potential_MPa': l10n.drought_LeafWaterPotential,
      'Stomatal_Conductance_mol_m2_s': l10n.drought_StomatalConductance,
      'Root_Depth_cm': l10n.drought_RootDepth,
      'Photosynthetic_Rate_umol_m2_s': l10n.drought_PhotosyntheticRate,
      'Plant_Biomass_g_m2': l10n.drought_PlantBiomass,
      'ZmDREB2A': l10n.drought_ZmDREB2A,
      'Root_QTL': l10n.drought_RootQTL,
      'ZmNAC': l10n.drought_ZmNAC,
      'Planting_Density_plants_ha': l10n.drought_PlantingDensity,
      'Soil_Type': l10n.drought_SoilType,
      'Growth_Stage': l10n.drought_GrowthStage,
    };

    return Scaffold(
      appBar: AppBar(title: Text(l10n.droughtPrediction)),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              ..._fields.map((field) => Padding(
                padding: const EdgeInsets.only(bottom: 16.0),
                child: field == 'Soil_Type'
                  ? DropdownButtonFormField<String>(
                      decoration: InputDecoration(labelText: localizedLabels[field] ?? field, border: const OutlineInputBorder()),
                      value: _controllers[field]!.text.isEmpty ? null : _controllers[field]!.text,
                      items: _soilTypes.map((t) => DropdownMenuItem(value: t, child: Text(t))).toList(),
                      onChanged: (val) => setState(() => _controllers[field]!.text = val!),
                      validator: (val) => val == null || val.isEmpty ? l10n.required : null,
                    )
                  : field == 'Growth_Stage'
                  ? DropdownButtonFormField<String>(
                      decoration: InputDecoration(labelText: localizedLabels[field] ?? field, border: const OutlineInputBorder()),
                      value: _controllers[field]!.text.isEmpty ? null : _controllers[field]!.text,
                      items: _growthStages.map((t) => DropdownMenuItem(value: t, child: Text(t))).toList(),
                      onChanged: (val) => setState(() => _controllers[field]!.text = val!),
                      validator: (val) => val == null || val.isEmpty ? l10n.required : null,
                    )
                  : TextFormField(
                      controller: _controllers[field],
                      decoration: InputDecoration(
                        labelText: localizedLabels[field] ?? field,
                        border: const OutlineInputBorder()
                      ),
                      keyboardType: TextInputType.number,
                      validator: (val) => val == null || val.isEmpty ? l10n.required : null,
                    ),
              )),
              const SizedBox(height: 16),
               ElevatedButton(
                onPressed: _isLoading ? null : _submit,
                style: ElevatedButton.styleFrom(padding: const EdgeInsets.all(16)),
                child: _isLoading ? const CircularProgressIndicator(color: Colors.white) : Text(l10n.predictDrought, style: const TextStyle(fontSize: 18)),
              ),
              const SizedBox(height: 32),
              if (_result != null)
                Container(
                  padding: const EdgeInsets.all(24),
                  decoration: BoxDecoration(color: Colors.orange.withOpacity(0.1), borderRadius: BorderRadius.circular(16), border: Border.all(color: Colors.orange)),
                   child: Column(
                    children: [
                      Text(l10n.predictionResult, style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: Colors.orange)),
                      const SizedBox(height: 16),
                      Text('${l10n.droughtLikelihood}: ${_result!.toStringAsFixed(2)}%', style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold)),
                    ],
                  ),
                ),
            ],
          ),
        ),
      ),
    );
  }
}