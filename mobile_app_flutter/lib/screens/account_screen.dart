import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../l10n/app_localizations.dart'; 
import '../providers/user_provider.dart';
import '../providers/theme_provider.dart';
import '../providers/auth_provider.dart';
import '../providers/language_provider.dart';

class AccountScreen extends StatefulWidget {
  const AccountScreen({Key? key}) : super(key: key);

  @override
  _AccountScreenState createState() => _AccountScreenState();
}

class _AccountScreenState extends State<AccountScreen> {
  final _formKey = GlobalKey<FormState>();
  late TextEditingController _userCtrl;
  late TextEditingController _emailCtrl;

  @override
  void initState() {
    super.initState();
    final user = context.read<UserProvider>().user;
    _userCtrl = TextEditingController(text: user?.username ?? '');
    _emailCtrl = TextEditingController(text: user?.email ?? '');
  }

  Future<void> _save() async {
    if (_formKey.currentState!.validate()) {
      final success = await context.read<UserProvider>().updateProfile(_userCtrl.text, _emailCtrl.text);
      if (success && mounted) {
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(
          content: Text(AppLocalizations.of(context)!.profileUpdatedSuccessfully),
          backgroundColor: Colors.green,
          behavior: SnackBarBehavior.floating,
        ));
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final userProv = context.watch<UserProvider>();
    final themeProv = context.watch<ThemeProvider>();
    final langProv = context.watch<LanguageProvider>();
    final l10n = AppLocalizations.of(context)!;
    final isDark = themeProv.themeMode == ThemeMode.dark;

    return Scaffold(
      appBar: AppBar(title: Text(l10n.accountSettings)),
      body: userProv.isLoading && userProv.user == null
          ? const Center(child: CircularProgressIndicator())
          : SingleChildScrollView(
              padding: const EdgeInsets.all(24.0),
              child: Form(
                key: _formKey,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    Center(
                      child: Stack(
                        children: [
                          CircleAvatar(
                            radius: 50,
                            backgroundColor: Theme.of(context).colorScheme.primary,
                            child: Text(
                              userProv.user?.username.substring(0, 1).toUpperCase() ?? 'U',
                              style: const TextStyle(fontSize: 40, color: Colors.white, fontWeight: FontWeight.bold)
                            ),
                          ),
                          Positioned(
                            bottom: 0, right: 0,
                            child: Container(
                              padding: const EdgeInsets.all(4),
                              decoration: BoxDecoration(color: Colors.white, shape: BoxShape.circle, border: Border.all(color: Colors.grey.shade300)),
                              child: Icon(Icons.edit, size: 20, color: Theme.of(context).colorScheme.primary),
                            ),
                          )
                        ],
                      ),
                    ),
                    const SizedBox(height: 32),
                    TextFormField(
                      controller: _userCtrl,
                      decoration: InputDecoration(labelText: l10n.username, border: const OutlineInputBorder(borderRadius: BorderRadius.all(Radius.circular(12)))),
                      validator: (val) => val == null || val.isEmpty ? 'Required' : null,
                    ),
                    const SizedBox(height: 16),
                    TextFormField(
                      controller: _emailCtrl,
                      decoration: InputDecoration(labelText: l10n.emailAddress, border: const OutlineInputBorder(borderRadius: BorderRadius.all(Radius.circular(12)))),
                      validator: (val) => val == null || !val.contains('@') ? 'Invalid email format' : null,
                    ),
                    const SizedBox(height: 24),
                    ElevatedButton(
                      style: ElevatedButton.styleFrom(
                        padding: const EdgeInsets.symmetric(vertical: 16),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                      ),
                      onPressed: userProv.isLoading ? null : _save,
                      child: userProv.isLoading
                        ? const SizedBox(height: 20, width: 20, child: CircularProgressIndicator(strokeWidth: 2))
                        : Text(l10n.saveProfileUpdates, style: const TextStyle(fontSize: 16)),
                    ),
                    const SizedBox(height: 32),
                    Text(l10n.preferences, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: Colors.grey)),
                    const SizedBox(height: 8),
                    Card(
                      elevation: 0,
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16), side: BorderSide(color: Colors.grey.shade200)),
                      child: Column(
                        children: [
                          ListTile(
                            leading: const Icon(Icons.lock_outline),
                            title: Text(l10n.changePassword),
                            trailing: const Icon(Icons.chevron_right),
                            onTap: () => Navigator.pushNamed(context, '/change_password'),
                          ),
                          const Divider(height: 1),
                          SwitchListTile(
                            title: Text(l10n.darkModeDisplay),
                            secondary: const Icon(Icons.dark_mode_outlined),
                            value: isDark,
                            activeColor: Theme.of(context).colorScheme.primary,
                            onChanged: (val) => themeProv.toggleTheme(val),
                          ),
                          const Divider(height: 1),
                          ListTile(
                            leading: const Icon(Icons.language),
                            title: Text(l10n.language),
                            trailing: DropdownButton<String>(
                              value: langProv.locale.languageCode,
                              underline: const SizedBox(),
                                items: [
                                  DropdownMenuItem(value: 'en', child: Text(l10n.english)),
                                  DropdownMenuItem(value: 'am', child: Text(l10n.amharic)),
                                  DropdownMenuItem(value: 'om', child: Text(l10n.afaanOromo)),
                                ],
                              onChanged: (val) {
                                if (val != null) langProv.setLocale(Locale(val));
                              },
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 32),
                    TextButton.icon(
                      style: TextButton.styleFrom(
                        padding: const EdgeInsets.symmetric(vertical: 16),
                        iconColor: Colors.red, foregroundColor: Colors.red,
                        backgroundColor: Colors.red.withOpacity(0.1),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12))
                      ),
                      icon: const Icon(Icons.logout),
                      label: Text(l10n.secureLogOut, style: const TextStyle(fontWeight: FontWeight.bold)),
                      onPressed: () {
                        Navigator.pop(context);
                        context.read<AuthProvider>().logout();
                      },
                    )
                  ],
                ),
              ),
            ),
    );
  }
}