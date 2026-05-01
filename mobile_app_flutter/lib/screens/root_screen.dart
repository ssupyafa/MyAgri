import 'package:flutter/material.dart';
import '../l10n/app_localizations.dart';

import 'dashboard_screen.dart';
import 'soil_suitability_screen.dart';
import 'disease_screen.dart';
import 'drought_screen.dart';
import 'crop_rec_screen.dart';

class RootScreen extends StatefulWidget {
  const RootScreen({Key? key}) : super(key: key);

  @override
  _RootScreenState createState() => _RootScreenState();
}

class _RootScreenState extends State<RootScreen> {
  int _currentIndex = 0;

  final List<Widget> _screens = [
    const DashboardScreen(),
    const SoilSuitabilityScreen(),
    const DiseaseScreen(),
    const DroughtScreen(),
    const CropRecScreen(),
  ];

  void _onTabTapped(int index) {
    setState(() {
      _currentIndex = index;
    });
  }

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context)!;
    return Scaffold(
      body: IndexedStack(
        index: _currentIndex,
        children: _screens,
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          print("Open camera for scan");
          setState(() => _currentIndex = 2);
        },
        tooltip: l10n.quickDiseaseScan,
        child: const Icon(Icons.camera_alt),
      ),
      bottomNavigationBar: NavigationBar(
        selectedIndex: _currentIndex,
        onDestinationSelected: _onTabTapped,
        destinations: [
          NavigationDestination(
            icon: const Icon(Icons.dashboard_outlined),
            selectedIcon: const Icon(Icons.dashboard),
            label: l10n.home,
          ),
          NavigationDestination(
            icon: const Icon(Icons.landscape_outlined),
            selectedIcon: const Icon(Icons.landscape),
            label: l10n.soilLabel,
          ),
          NavigationDestination(
            icon: const Badge(label: Text('3'), child: Icon(Icons.bug_report_outlined)),
            selectedIcon: const Badge(label: Text('3'), child: Icon(Icons.bug_report)),
            label: l10n.diseaseLabel,
          ),
          NavigationDestination(
            icon: const Icon(Icons.wb_sunny_outlined),
            selectedIcon: const Icon(Icons.wb_sunny),
            label: l10n.droughtLabel,
          ),
          NavigationDestination(
            icon: const Icon(Icons.eco_outlined),
            selectedIcon: const Icon(Icons.eco),
            label: l10n.cropLabel,
          ),
        ],
      ),
    );
  }
}