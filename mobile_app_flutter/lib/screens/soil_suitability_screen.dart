import 'package:flutter/material.dart';
import '../services/api_service.dart';
import '../l10n/app_localizations.dart';

class SoilSuitabilityScreen extends StatefulWidget {
  const SoilSuitabilityScreen({Key? key}) : super(key: key);

  @override
  _SoilSuitabilityScreenState createState() => _SoilSuitabilityScreenState();
}

class _SoilSuitabilityScreenState extends State<SoilSuitabilityScreen> {
  final _formKey = GlobalKey<FormState>();
  final ApiService _api = ApiService();
  bool _isLoading = false;
  Map<String, dynamic>? _result;

  final List<String> _fields = [
    "TS", "T2M_MAX", "T2M", "QV2M", "WS10M", "T2M_MIN",
    "RH2M", "T2MDEW", "WS2M", "ALLSKY_SFC_PAR_TOT",
    "PS", "ALLSKY_SFC_SW_DWN", "PRECTOTCORR"
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
    final res = await _api.post('/suitability', payload);
    setState(() {
      _isLoading = false;
      if (res['status'] == 'success') {
        _result = res['prediction'];
      } else {
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(res['message'] ?? 'Error fetching prediction')));
      }
    });
  }

  String _getLocalizedAnalysis(String analysis, AppLocalizations l10n) {
    if (analysis.startsWith("Excellent")) return l10n.suitabilityExcellent;
    if (analysis.startsWith("Good")) return l10n.suitabilityGood;
    if (analysis.startsWith("Moderate")) return l10n.suitabilityModerate;
    if (analysis.startsWith("Low")) return l10n.suitabilityLow;
    return analysis;
  }

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context)!;
    final Map<String, String> localizedLabels = {
      "TS": l10n.suitability_TS,
      "T2M_MAX": l10n.suitability_T2M_MAX,
      "T2M": l10n.suitability_T2M,
      "QV2M": l10n.suitability_QV2M,
      "WS10M": l10n.suitability_WS10M,
      "T2M_MIN": l10n.suitability_T2M_MIN,
      "RH2M": l10n.suitability_RH2M,
      "T2MDEW": l10n.suitability_T2MDEW,
      "WS2M": l10n.suitability_WS2M,
      "ALLSKY_SFC_PAR_TOT": l10n.suitability_ALLSKY_SFC_PAR_TOT,
      "PS": l10n.suitability_PS,
      "ALLSKY_SFC_SW_DWN": l10n.suitability_ALLSKY_SFC_SW_DWN,
      "PRECTOTCORR": l10n.suitability_PRECTOTCORR,
    };

    return Scaffold(
      appBar: AppBar(title: Text(l10n.soilSuitability)),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              ..._fields.map((field) => Padding(
                padding: const EdgeInsets.only(bottom: 16.0),
                child: TextFormField(
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
                style: ElevatedButton.styleFrom(padding: const EdgeInsets.all(16), backgroundColor: Colors.brown),
                child: _isLoading ? const CircularProgressIndicator(color: Colors.white) : Text(l10n.predictSuitability, style: const TextStyle(fontSize: 18)),
              ),
              const SizedBox(height: 32),
              if (_result != null)
                Container(
                  padding: const EdgeInsets.all(24),
                  decoration: BoxDecoration(color: Colors.brown.withOpacity(0.1), borderRadius: BorderRadius.circular(16), border: Border.all(color: Colors.brown)),
                  child: Column(
                    children: [
                      Text(l10n.suitabilityResult, style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: Colors.brown)),
                      const SizedBox(height: 16),
                      Text('${l10n.score}: ${_result!["suitability"].toStringAsFixed(2)}%', style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold)),
                      const SizedBox(height: 16),
                      Text(_getLocalizedAnalysis('${_result!["analysis"]}', l10n), style: const TextStyle(fontSize: 16), textAlign: TextAlign.center),
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