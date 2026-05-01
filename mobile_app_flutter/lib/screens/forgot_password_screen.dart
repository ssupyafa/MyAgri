import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/user_provider.dart';

class ForgotPasswordScreen extends StatefulWidget {
  const ForgotPasswordScreen({Key? key}) : super(key: key);

  @override
  _ForgotPasswordScreenState createState() => _ForgotPasswordScreenState();
}

class _ForgotPasswordScreenState extends State<ForgotPasswordScreen> {
  final _emailCtrl = TextEditingController();
  final _formKey = GlobalKey<FormState>();
  bool _isLoading = false;

  void _submit() async {
    if (!_formKey.currentState!.validate()) return;
    setState(() => _isLoading = true);
    final error = await context.read<UserProvider>().requestPasswordReset(_emailCtrl.text);
    if (!mounted) return;
    setState(() => _isLoading = false);
    if (error == null) {
      showDialog(context: context, builder: (c) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        title: const Text('Email Sent'),
        content: const Text('We have sent a secure password reset link to your email.'),
        actions: [TextButton(onPressed: (){ Navigator.pop(c); Navigator.pop(context); }, child: const Text('Return to Login', style: TextStyle(fontWeight: FontWeight.bold)))]
      ));
    } else {
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(error), backgroundColor: Colors.red));
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Reset Password'), backgroundColor: Colors.transparent),
      body: Center(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 32.0),
          child: ConstrainedBox(
             constraints: const BoxConstraints(maxWidth: 400),
             child: Form(
               key: _formKey,
               child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Container(
                    padding: const EdgeInsets.all(24),
                    decoration: BoxDecoration(color: Theme.of(context).colorScheme.primary.withOpacity(0.1), shape: BoxShape.circle),
                    child: Icon(Icons.lock_reset, size: 80, color: Theme.of(context).colorScheme.primary),
                  ),
                  const SizedBox(height: 24),
                  const Text('Forgot Password?', style: TextStyle(fontSize: 28, fontWeight: FontWeight.bold)),
                  const SizedBox(height: 12),
                  const Text('Enter the email associated with your account and we\'ll send you a link to reset your password.', textAlign: TextAlign.center, style: TextStyle(color: Colors.grey, fontSize: 16)),
                  const SizedBox(height: 40),
                  TextFormField(
                    controller: _emailCtrl,
                    keyboardType: TextInputType.emailAddress,
                    decoration: InputDecoration(
                      prefixIcon: const Icon(Icons.email_outlined),
                      labelText: 'Email Address',
                      border: OutlineInputBorder(borderRadius: BorderRadius.circular(16))
                    ),
                    validator: (val) => val == null || !val.contains('@') ? 'Enter a valid email' : null,
                  ),
                  const SizedBox(height: 32),
                  SizedBox(
                    width: double.infinity,
                    height: 56,
                    child: ElevatedButton(
                      style: ElevatedButton.styleFrom(shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16))),
                      onPressed: _isLoading ? null : _submit,
                      child: _isLoading ? const CircularProgressIndicator(color: Colors.white) : const Text('Send Reset Link', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                    ),
                  )
                ],
            ),
          )),
        ),
      ),
    );
  }
}