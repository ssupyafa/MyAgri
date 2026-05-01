import 'package:flutter/material.dart';
import '../services/api_service.dart';
import '../l10n/app_localizations.dart';

class CropRecScreen extends StatefulWidget {
  const CropRecScreen({Key? key}) : super(key: key);

  @override
  _CropRecScreenState createState() => _CropRecScreenState();
}

class _CropRecScreenState extends State<CropRecScreen> {
  final _formKey = GlobalKey<FormState>();
  final ApiService _api = ApiService();
  bool _isLoading = false;
  List<dynamic>? _result;

  final Map<String, TextEditingController> _controllers = {
    'N (Nitrogen)': TextEditingController(),
    'P (Phosphorus)': TextEditingController(),
    'K (Potassium)': TextEditingController(),
    'Temperature': TextEditingController(),
    'Humidity': TextEditingController(),
    'ph': TextEditingController(),
    'Rainfall': TextEditingController(),
  };

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;
    setState(() => _isLoading = true);
    Map<String, String> payload = {};
    _controllers.forEach((k, v) {
      if (k == 'N (Nitrogen)') payload['N'] = v.text;
      else if (k == 'P (Phosphorus)') payload['P'] = v.text;
      else if (k == 'K (Potassium)') payload['K'] = v.text;
      else payload[k.toLowerCase()] = v.text;
    });

    final res = await _api.post('/crop_recommendation', payload);
    setState(() {
      _isLoading = false;
      if (res['status'] == 'success') {
        _result = res['top_crops'];
      } else {
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(res['message'] ?? 'Error fetching prediction')));
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context)!;
    final Map<String, String> localizedLabels = {
      'N (Nitrogen)': l10n.crop_N,
      'P (Phosphorus)': l10n.crop_P,
      'K (Potassium)': l10n.crop_K,
      'Temperature': l10n.crop_Temperature,
      'Humidity': l10n.crop_Humidity,
      'ph': l10n.crop_PH,
      'Rainfall': l10n.crop_Rainfall,
    };

    return Scaffold(
      appBar: AppBar(title: Text(l10n.cropRecommendation)),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              ..._controllers.entries.map((e) => Padding(
                padding: const EdgeInsets.only(bottom: 16.0),
                child: TextFormField(
                  controller: e.value,
                  decoration: InputDecoration(labelText: localizedLabels[e.key] ?? e.key, border: const OutlineInputBorder()),
                  keyboardType: TextInputType.number,
                  validator: (val) => val == null || val.isEmpty ? l10n.required : null,
                ),
              )),
              const SizedBox(height: 16),
              ElevatedButton(
                onPressed: _isLoading ? null : _submit,
                style: ElevatedButton.styleFrom(padding: const EdgeInsets.all(16)),
                child: _isLoading ? const CircularProgressIndicator(color: Colors.white) : Text(l10n.getRecommendation, style: const TextStyle(fontSize: 18)),
              ),
              const SizedBox(height: 32),
              if (_result != null)
                Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(color: Colors.green.withOpacity(0.1), borderRadius: BorderRadius.circular(16)),
                  child: Column(
                    children: [
                      Text(l10n.topRecommendedCrops, style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: Colors.green)),
                      const SizedBox(height: 16),
                      ..._result!.map((crop) => ListTile(
                        leading: const Icon(Icons.eco, color: Colors.green),
                        title: Text(crop[0].toString().toUpperCase(), style: const TextStyle(fontWeight: FontWeight.bold)),
                        trailing: Text('${(crop[1] * 100).toStringAsFixed(1)}%'),
                      )),
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