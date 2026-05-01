import 'dart:io';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import '../services/api_service.dart';
import '../l10n/app_localizations.dart';

class DiseaseScreen extends StatefulWidget {
  const DiseaseScreen({Key? key}) : super(key: key);

  @override
  _DiseaseScreenState createState() => _DiseaseScreenState();
}

class _DiseaseScreenState extends State<DiseaseScreen> {
  File? _image;
  final picker = ImagePicker();
  final ApiService _api = ApiService();
  bool _isLoading = false;
  Map<String, dynamic>? _result;

  Future<void> _pickImage(ImageSource source) async {
    final pickedFile = await picker.pickImage(source: source);
    if (pickedFile != null) {
      setState(() {
        _image = File(pickedFile.path);
        _result = null;
      });
    }
  }

  Future<void> _predictDisease() async {
    if (_image == null) return;
    setState(() => _isLoading = true);
    final res = await _api.uploadImage('/crop_disease', _image!);
    setState(() {
      _isLoading = false;
      if (res['status'] == 'success') {
        _result = res['result'];
      } else {
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(res['message'] ?? 'Error predicting disease')));
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context)!;
    return Scaffold(
      appBar: AppBar(title: Text(l10n.diseaseDetection)),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            if (_image != null)
              ClipRRect(
                borderRadius: BorderRadius.circular(16),
                child: Image.file(_image!, height: 300, fit: BoxFit.cover),
              )
            else
              Container(
                height: 300,
                decoration: BoxDecoration(color: Colors.grey.shade300, borderRadius: BorderRadius.circular(16)),
                child: const Icon(Icons.image, size: 80, color: Colors.grey),
              ),
            const SizedBox(height: 24),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: [
                ElevatedButton.icon(
                  onPressed: () => _pickImage(ImageSource.camera),
                  icon: const Icon(Icons.camera_alt),
                  label: Text(l10n.camera),
                ),
                ElevatedButton.icon(
                  onPressed: () => _pickImage(ImageSource.gallery),
                  icon: const Icon(Icons.photo_library),
                  label: Text(l10n.gallery),
                ),
              ],
            ),
            const SizedBox(height: 32),
            ElevatedButton(
              onPressed: _image != null && !_isLoading ? _predictDisease : null,
              style: ElevatedButton.styleFrom(padding: const EdgeInsets.all(16)),
              child: _isLoading ? const CircularProgressIndicator(color: Colors.white) : Text(l10n.detectDisease, style: const TextStyle(fontSize: 18)),
            ),
            const SizedBox(height: 32),
            if (_result != null)
              Container(
                padding: const EdgeInsets.all(24),
                decoration: BoxDecoration(color: Colors.green.withOpacity(0.1), borderRadius: BorderRadius.circular(16), border: Border.all(color: Colors.green)),
                child: Column(
                  children: [
                    Text(l10n.diseaseDetectionResult, style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: Colors.green)),
                    const SizedBox(height: 16),
                    Text('${l10n.disease}: ${_result!["label"]}', style: const TextStyle(fontSize: 18), textAlign: TextAlign.center),
                    const SizedBox(height: 8),
                    Text('${l10n.confidence}: ${(_result!["confidence"] * 100).toStringAsFixed(1)}%', style: const TextStyle(fontSize: 18)),
                  ],
                ),
              ),
          ],
        ),
      ),
    );
  }
}