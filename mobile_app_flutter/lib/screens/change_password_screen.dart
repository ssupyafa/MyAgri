import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/user_provider.dart';

class ChangePasswordScreen extends StatefulWidget {
  const ChangePasswordScreen({Key? key}) : super(key: key);

  @override
  _ChangePasswordScreenState createState() => _ChangePasswordScreenState();
}

class _ChangePasswordScreenState extends State<ChangePasswordScreen> {
  final _formKey = GlobalKey<FormState>();
  final _oldCtrl = TextEditingController();
  final _newCtrl = TextEditingController();
  final _confirmCtrl = TextEditingController();
  bool _obscureOld = true;
  bool _obscureNew = true;
  bool _obscureConfirm = true;

  void _submit() async {
    if (!_formKey.currentState!.validate()) return;
    final error = await context.read<UserProvider>().changePassword(_oldCtrl.text, _newCtrl.text);

    if (!mounted) return;
    if (error == null) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(
        content: Text('Password changed successfully!'),
        backgroundColor: Colors.green,
      ));
      Navigator.pop(context);
    } else {
      showDialog(context: context, builder: (c) => AlertDialog(
        title: const Text('Verification Error'),
        content: Text(error),
        actions: [TextButton(onPressed: ()=>Navigator.pop(c), child: const Text('OK'))]
      ));
    }
  }

  @override
  Widget build(BuildContext context) {
    final isLoading = context.watch<UserProvider>().isLoading;
    return Scaffold(
      appBar: AppBar(title: const Text('Change Password')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24.0),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              TextFormField(
                controller: _oldCtrl,
                obscureText: _obscureOld,
                decoration: InputDecoration(
                  labelText: 'Current Password', border: const OutlineInputBorder(borderRadius: BorderRadius.all(Radius.circular(12))),
                  suffixIcon: IconButton(icon: Icon(_obscureOld ? Icons.visibility : Icons.visibility_off), onPressed: () => setState(() => _obscureOld = !_obscureOld))
                ),
                validator: (val) => val == null || val.isEmpty ? 'Required' : null,
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: _newCtrl,
                obscureText: _obscureNew,
                decoration: InputDecoration(
                  labelText: 'New Password', border: const OutlineInputBorder(borderRadius: BorderRadius.all(Radius.circular(12))),
                  suffixIcon: IconButton(icon: Icon(_obscureNew ? Icons.visibility : Icons.visibility_off), onPressed: () => setState(() => _obscureNew = !_obscureNew))
                ),
                validator: (val) => val == null || val.length < 6 ? 'Minimum 6 characters required' : null,
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: _confirmCtrl,
                obscureText: _obscureConfirm,
                decoration: InputDecoration(
                  labelText: 'Confirm New Password', border: const OutlineInputBorder(borderRadius: BorderRadius.all(Radius.circular(12))),
                  suffixIcon: IconButton(icon: Icon(_obscureConfirm ? Icons.visibility : Icons.visibility_off), onPressed: () => setState(() => _obscureConfirm = !_obscureConfirm))
                ),
                validator: (val) => val != _newCtrl.text ? 'Passwords do not match' : null,
              ),
              const SizedBox(height: 32),
              ElevatedButton(
                style: ElevatedButton.styleFrom(
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                ),
                onPressed: isLoading ? null : _submit,
                child: isLoading ? const SizedBox(height: 20, width: 20, child: CircularProgressIndicator(strokeWidth: 2)) : const Text('Update Password', style: TextStyle(fontSize: 16)),
              ),
            ],
          ),
        ),
      ),
    );
  }
}