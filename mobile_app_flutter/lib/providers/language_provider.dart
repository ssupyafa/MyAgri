import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

class LanguageProvider with ChangeNotifier {
  Locale _locale = const Locale('en');
  static const String _prefKey = 'selected_language';

  LanguageProvider() {
    _loadFromPrefs();
  }

  Locale get locale => _locale;

  void setLocale(Locale locale) {
    if (_locale == locale) return;
    _locale = locale;
    _saveToPrefs(locale.languageCode);
    notifyListeners();
  }

  Future<void> _loadFromPrefs() async {
    final prefs = await SharedPreferences.getInstance();
    final langCode = prefs.getString(_prefKey) ?? 'en';
    _locale = Locale(langCode);
    notifyListeners();
  }

  Future<void> _saveToPrefs(String langCode) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_prefKey, langCode);
  }
}
