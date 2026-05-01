import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/auth_provider.dart';
import '../l10n/app_localizations.dart';

class SignupScreen extends StatefulWidget {
  const SignupScreen({Key? key}) : super(key: key);

  @override
  _SignupScreenState createState() => _SignupScreenState();
}

class _SignupScreenState extends State<SignupScreen> {
  final _firstController = TextEditingController();
  final _lastController = TextEditingController();
  final _emailController = TextEditingController();
  final _usernameController = TextEditingController();
  final _passwordController = TextEditingController();
  bool _isLoading = false;

  void _signup() async {
    if (_usernameController.text.isEmpty || _passwordController.text.isEmpty) return;
    setState(() => _isLoading = true);
    final auth = Provider.of<AuthProvider>(context, listen: false);
    final error = await auth.signup(
      _firstController.text.trim(),
      _lastController.text.trim(),
      _emailController.text.trim(),
      _usernameController.text.trim(),
      _passwordController.text,
    );
    if (mounted) {
      setState(() => _isLoading = false);
      if (error != null) {
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(error, style: const TextStyle(color: Colors.white)), backgroundColor: Colors.red));
      } else {
        Navigator.pop(context);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context)!;
    return Scaffold(
      appBar: AppBar(title: Text(l10n.signUp), backgroundColor: Colors.transparent, elevation: 0, foregroundColor: Colors.black),
      body: Center(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text(l10n.createAccount, style: const TextStyle(fontSize: 28, fontWeight: FontWeight.bold)),
              const SizedBox(height: 32),
              Row(
                children: [
                  Expanded(child: TextField(controller: _firstController, decoration: InputDecoration(labelText: l10n.firstName, border: const OutlineInputBorder()))),
                  const SizedBox(width: 16),
                  Expanded(child: TextField(controller: _lastController, decoration: InputDecoration(labelText: l10n.lastName, border: const OutlineInputBorder()))),
                ],
              ),
              const SizedBox(height: 16),
              TextField(controller: _emailController, decoration: InputDecoration(labelText: l10n.email, border: const OutlineInputBorder())),
              const SizedBox(height: 16),
              TextField(controller: _usernameController, decoration: InputDecoration(labelText: l10n.username, border: const OutlineInputBorder())),
              const SizedBox(height: 16),
              TextField(controller: _passwordController, obscureText: true, decoration: InputDecoration(labelText: l10n.password, border: const OutlineInputBorder())),
              const SizedBox(height: 24),
              SizedBox(
                width: double.infinity,
                height: 50,
                child: ElevatedButton(
                  onPressed: _isLoading ? null : _signup,
                  child: _isLoading ? const SizedBox(width: 24, height: 24, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2)) : Text(l10n.signUp, style: const TextStyle(fontSize: 18)),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}