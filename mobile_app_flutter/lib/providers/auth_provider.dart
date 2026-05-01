import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../services/api_service.dart';

class AuthProvider with ChangeNotifier {
  bool _isAuthenticated = false;
  bool _isLoading = true;
  final ApiService _apiService = ApiService();

  bool get isAuthenticated => _isAuthenticated;
  bool get isLoading => _isLoading;

  AuthProvider() {
    _checkAuth();
  }

  Future<void> _checkAuth() async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('session_token');
    if (token != null) {
      _isAuthenticated = true;
    }
    _isLoading = false;
    notifyListeners();
  }

  Future<String?> login(String username, String password) async {
    final response = await _apiService.post('/login', {
      'username': username,
      'password': password,
    });

    if (response['status'] == 'success') {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString('session_token', response['session']);
      _isAuthenticated = true;
      notifyListeners();
      return null;
    }
    return response['message'] ?? 'Login failed';
  }

  Future<String?> signup(String first, String last, String email, String username, String password) async {
    final response = await _apiService.post('/signup', {
      'first': first,
      'last': last,
      'email': email,
      'username': username,
      'password': password,
    });

    if (response['status'] == 'success') {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString('session_token', response['session']);
      _isAuthenticated = true;
      notifyListeners();
      return null;
    }
    return response['message'] ?? 'Signup failed';
  }

  Future<void> logout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('session_token');
    _isAuthenticated = false;
    notifyListeners();
  }
}