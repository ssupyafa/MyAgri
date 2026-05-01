import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'l10n/app_localizations.dart';
import 'l10n/fallback_localizations_delegate.dart';

import 'providers/auth_provider.dart';
import 'providers/theme_provider.dart';
import 'providers/user_provider.dart';
import 'providers/language_provider.dart';

import 'screens/login_screen.dart';
import 'screens/signup_screen.dart';
import 'screens/root_screen.dart';
import 'screens/soil_suitability_screen.dart';
import 'screens/drought_screen.dart';
import 'screens/crop_rec_screen.dart';
import 'screens/disease_screen.dart';
import 'screens/account_screen.dart';
import 'screens/change_password_screen.dart';
import 'screens/forgot_password_screen.dart';

void main() {
  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AuthProvider()),
        ChangeNotifierProvider(create: (_) => ThemeProvider()),
        ChangeNotifierProvider(create: (_) => UserProvider()),
        ChangeNotifierProvider(create: (_) => LanguageProvider()),
      ],
      child: const AgriSmartApp(),
    ),
  );
}

class AgriSmartApp extends StatelessWidget {
  const AgriSmartApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Consumer2<ThemeProvider, LanguageProvider>(
      builder: (context, themeProvider, langProvider, _) {
        return MaterialApp(
          title: 'Agri-Smart',
          debugShowCheckedModeBanner: false,
          themeMode: themeProvider.themeMode,
          locale: langProvider.locale,
          localizationsDelegates: const [
            AppLocalizations.delegate,
            GlobalMaterialLocalizations.delegate,
            GlobalWidgetsLocalizations.delegate,
            GlobalCupertinoLocalizations.delegate,
            FallbackMaterialLocalizationsDelegate(),
            FallbackCupertinoLocalizationsDelegate(),
            FallbackWidgetsLocalizationsDelegate(),
          ],
          supportedLocales: const [
            Locale('en'),
            Locale('am'),
            Locale('om'),
          ],
          theme: ThemeData(
            useMaterial3: true,
            colorScheme: ColorScheme.fromSeed(
              seedColor: const Color(0xFF2E7D32),
              brightness: Brightness.light,
              surface: const Color(0xFFF8F9FA),
            ),
            textTheme: GoogleFonts.interTextTheme(ThemeData.light().textTheme),
            appBarTheme: const AppBarTheme(centerTitle: true, elevation: 0),
          ),
          darkTheme: ThemeData(
            useMaterial3: true,
            colorScheme: ColorScheme.fromSeed(
              seedColor: const Color(0xFF4CAF50),
              brightness: Brightness.dark,
              surface: const Color(0xFF1E1E1E),
            ),
            textTheme: GoogleFonts.interTextTheme(ThemeData.dark().textTheme),
            appBarTheme: const AppBarTheme(centerTitle: true, elevation: 0),
          ),
          home: Consumer<AuthProvider>(
            builder: (context, auth, _) {
              if (auth.isLoading) {
                return const Scaffold(body: Center(child: CircularProgressIndicator()));
              }
              if (auth.isAuthenticated) {
                return const RootScreen();
              }
              return const LoginScreen();
            },
          ),
          routes: {
            '/login': (context) => const LoginScreen(),
            '/signup': (context) => const SignupScreen(),
            '/root': (context) => const RootScreen(),
            '/suitability': (context) => const SoilSuitabilityScreen(),
            '/drought': (context) => const DroughtScreen(),
            '/crop_rec': (context) => const CropRecScreen(),
            '/disease': (context) => const DiseaseScreen(),
            '/account': (context) => const AccountScreen(),
            '/change_password': (context) => const ChangePasswordScreen(),
            '/forgot_password': (context) => const ForgotPasswordScreen(),
          },
        );
      },
    );
  }
}