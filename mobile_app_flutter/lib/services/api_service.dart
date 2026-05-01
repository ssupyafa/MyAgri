import 'dart:convert';
import 'dart:io';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

class ApiService {
  static String get baseUrl {
    return 'http://172.20.10.4:1234/api';
  }

  Future<Map<String, String>> _getHeaders() async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('session_token');
    return {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      if (token != null) 'Authorization': 'Bearer $token',
    };
  }

  Future<Map<String, dynamic>> post(String endpoint, Map<String, dynamic> body) async {
    try {
      final headers = await _getHeaders();
      final response = await http.post(
        Uri.parse('$baseUrl$endpoint'),
        headers: headers,
        body: jsonEncode(body),
      ).timeout(const Duration(seconds: 10));
      if (response.body.isEmpty) return {'status': 'fail', 'message': 'Empty response from server'};
      return jsonDecode(response.body);
    } catch (e) {
      return {'status': 'fail', 'message': 'Network Error to $baseUrl. Make sure Flask backend is running on port 1234.'};
    }
  }

  Future<Map<String, dynamic>> get(String endpoint) async {
    try {
      final headers = await _getHeaders();
      final response = await http.get(
        Uri.parse('$baseUrl$endpoint'),
        headers: headers,
      ).timeout(const Duration(seconds: 10));
      if (response.body.isEmpty) return {'status': 'fail', 'message': 'Empty response from server'};
      return jsonDecode(response.body);
    } catch (e) {
      return {'status': 'fail', 'message': 'Network Error to $baseUrl. Make sure Flask backend is running on port 1234.'};
    }
  }

  Future<Map<String, dynamic>> uploadImage(String endpoint, File file) async {
    try {
      final headers = await _getHeaders();
      var request = http.MultipartRequest('POST', Uri.parse('$baseUrl$endpoint'));
      headers.forEach((key, value) {
        request.headers[key] = value;
      });
      request.files.add(await http.MultipartFile.fromPath('image', file.path));
      var response = await request.send().timeout(const Duration(seconds: 20));
      var responseData = await response.stream.bytesToString();
      if (responseData.isEmpty) return {'status': 'fail', 'message': 'Empty response from server'};
      return jsonDecode(responseData);
    } catch (e) {
      return {'status': 'fail', 'message': 'Network Error to $baseUrl. Make sure Flask backend is running on port 1234.'};
    }
  }
}