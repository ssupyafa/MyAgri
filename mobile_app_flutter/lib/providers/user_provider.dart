import 'package:flutter/material.dart';
import '../models/user_model.dart';

class UserProvider with ChangeNotifier {
  UserModel? _user;
  bool _isLoading = false;

  UserModel? get user => _user;
  bool get isLoading => _isLoading;

  Future<void> loadProfile(String username) async {
    _isLoading = true;
    notifyListeners();
    await Future.delayed(const Duration(milliseconds: 600));
    _user = UserModel(
      id: "1",
      username: username,
      email: "$username@example.com",
      firstName: "Admin",
      lastName: "User",
    );
    _isLoading = false;
    notifyListeners();
  }

  Future<bool> updateProfile(String newUsername, String newEmail) async {
    _isLoading = true;
    notifyListeners();
    await Future.delayed(const Duration(seconds: 1));
    if (_user != null) {
      _user = UserModel(
        id: _user!.id,
        username: newUsername,
        email: newEmail,
        firstName: _user!.firstName,
        lastName: _user!.lastName,
      );
    }
    _isLoading = false;
    notifyListeners();
    return true;
  }

  Future<String?> changePassword(String oldPass, String newPass) async {
    await Future.delayed(const Duration(seconds: 1));
    if (oldPass != 'password' && oldPass != 'admin123') {
      return 'Incorrect old password. (Try "password" or "admin123" for demo)';
    }
    return null;
  }

  Future<String?> requestPasswordReset(String email) async {
    await Future.delayed(const Duration(seconds: 1));
    if (!email.contains('@')) return 'Invalid email address';
    return null;
  }
}