import 'dart:async';
import 'package:flutter/material.dart';
import '../models/log_model.dart';
import '../services/api_service.dart';

class DashboardProvider with ChangeNotifier {
  final ApiService _api = ApiService();
  List<LogModel> _logs = [];
  bool _isLoading = true;
  String _errorMessage = '';
  Timer? _autoRefreshTimer;
  List<LogModel> get logs => _logs;
  bool get isLoading => _isLoading;
  String get errorMessage => _errorMessage;

  DashboardProvider() {
    fetchLogs();
    _startAutoRefresh();
  }

  void _startAutoRefresh() {
    _autoRefreshTimer?.cancel();
    _autoRefreshTimer = Timer.periodic(const Duration(seconds: 30), (_) {
      fetchLogs(silent: true);
    });
  }

  @override
  void dispose() {
    _autoRefreshTimer?.cancel();
    super.dispose();
  }

  Future<void> fetchLogs({bool silent = false}) async {
    if (!silent) {
      _isLoading = true;
      notifyListeners();
    }

    final res = await _api.get('/dashboard');
    if (res['status'] == 'success') {
      final rawLogs = res['logs'] as List? ?? [];
      _logs = rawLogs.map((e) => LogModel.fromJson(e)).toList();
      _errorMessage = '';
    } else {
      if (!silent) _errorMessage = res['message'] ?? 'Failed to load logs';
    }
    _isLoading = false;
    notifyListeners();
  }
}