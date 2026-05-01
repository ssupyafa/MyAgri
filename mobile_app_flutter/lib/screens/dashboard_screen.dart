import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:fl_chart/fl_chart.dart';
import 'package:intl/intl.dart';

import '../providers/theme_provider.dart';
import '../providers/dashboard_provider.dart';
import '../providers/user_provider.dart';
import '../models/log_model.dart';
import '../l10n/app_localizations.dart';

class DashboardScreen extends StatelessWidget {
  const DashboardScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider(
      create: (_) => DashboardProvider(),
      child: const _DashboardView(),
    );
  }
}

class _DashboardView extends StatelessWidget {
  const _DashboardView({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<DashboardProvider>();
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;
    final l10n = AppLocalizations.of(context)!;

    return Scaffold(
      appBar: AppBar(
        title: Builder(
          builder: (ctx) {
            final user = ctx.watch<UserProvider>().user;
            return Text(user != null ? '${l10n.welcome}, ${user.username}' : l10n.appTitle, style: const TextStyle(fontWeight: FontWeight.bold));
          }
        ),
        actions: [
          IconButton(
            icon: Icon(theme.brightness == Brightness.dark ? Icons.light_mode : Icons.dark_mode),
            onPressed: () => context.read<ThemeProvider>().toggleTheme(theme.brightness != Brightness.dark)
          ),
          IconButton(
            icon: const Icon(Icons.account_circle, size: 28),
            color: theme.colorScheme.primary,
            onPressed: () => Navigator.pushNamed(context, '/account')
          ),
          const SizedBox(width: 8),
        ],
      ),
      body: provider.isLoading && provider.logs.isEmpty
          ? const Center(child: CircularProgressIndicator())
          : RefreshIndicator(
              onRefresh: () => provider.fetchLogs(),
              child: CustomScrollView(
                physics: const AlwaysScrollableScrollPhysics(),
                slivers: [
                  if (provider.errorMessage.isNotEmpty)
                    SliverToBoxAdapter(
                      child: Container(
                        padding: const EdgeInsets.all(12),
                        margin: const EdgeInsets.all(16),
                        decoration: BoxDecoration(color: Colors.red.withOpacity(0.1), borderRadius: BorderRadius.circular(8)),
                        child: Text(provider.errorMessage, style: const TextStyle(color: Colors.red)),
                      ),
                    ),
                  SliverToBoxAdapter(
                    child: Padding(
                      padding: const EdgeInsets.all(16.0),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(l10n.overviewActivity, style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold)),
                          const SizedBox(height: 16),
                          _buildChartCard(context, provider.logs, isDark),
                          const SizedBox(height: 32),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Text(l10n.recentLogs, style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold)),
                              TextButton.icon(
                                onPressed: () => provider.fetchLogs(),
                                icon: const Icon(Icons.refresh, size: 16),
                                label: Text(l10n.refresh),
                              )
                            ],
                          ),
                          const SizedBox(height: 8),
                        ],
                      ),
                    ),
                  ),
                  SliverPadding(
                    padding: const EdgeInsets.symmetric(horizontal: 16.0),
                    sliver: SliverList(
                      delegate: SliverChildBuilderDelegate(
                        (context, index) => _buildLogCard(context, provider.logs[index], isDark),
                        childCount: provider.logs.length,
                      ),
                    ),
                  ),
                  const SliverToBoxAdapter(child: SizedBox(height: 80)),
                ],
              ),
            ),
    );
  }

  Widget _buildChartCard(BuildContext context, List<LogModel> logs, bool isDark) {
    if (logs.isEmpty) {
      return Container(
        height: 200,
        alignment: Alignment.center,
        decoration: BoxDecoration(color: Theme.of(context).colorScheme.surfaceContainerHighest, borderRadius: BorderRadius.circular(24)),
        child: Text(AppLocalizations.of(context)!.noData),
      );
    }

    final Map<String, int> counts = {};
    for (var log in logs) {
      counts[log.type] = (counts[log.type] ?? 0) + 1;
    }

    final colors = [Colors.green, Colors.orange, Colors.brown, Colors.redAccent, Colors.blue];
    int colorIdx = 0;

    final pieData = counts.entries.map((e) {
      final color = colors[colorIdx % colors.length];
      colorIdx++;
      return PieChartSectionData(
        value: e.value.toDouble(),
        color: color,
        radius: 50,
        title: '${e.value}',
        titleStyle: const TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: Colors.white),
      );
    }).toList();

    return Container(
      height: 220,
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Theme.of(context).colorScheme.surfaceContainerHighest,
        borderRadius: BorderRadius.circular(24),
      ),
      child: Row(
        children: [
          Expanded(
            flex: 3,
            child: PieChart(
              PieChartData(
                sections: pieData,
                centerSpaceRadius: 25,
                sectionsSpace: 2,
              ),
            ),
          ),
          const SizedBox(width: 24),
          Expanded(
            flex: 2,
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: counts.entries.map((e) {
                return Padding(
                  padding: const EdgeInsets.only(bottom: 12.0),
                  child: Row(
                    children: [
                      Container(
                        width: 14, height: 14,
                        decoration: BoxDecoration(shape: BoxShape.circle, color: colors[counts.keys.toList().indexOf(e.key) % colors.length])
                      ),
                      const SizedBox(width: 8),
                      Expanded(child: Text(e.key.toUpperCase(), style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w600), overflow: TextOverflow.ellipsis)),
                    ],
                  ),
                );
              }).toList(),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildLogCard(BuildContext context, LogModel log, bool isDark) {
    Color levelColor;
    IconData levelIcon;

    switch (log.level) {
      case LogLevel.info:
        levelColor = Colors.blue;
        levelIcon = Icons.info_outline;
        break;
      case LogLevel.warning:
        levelColor = Colors.orange;
        levelIcon = Icons.warning_amber_rounded;
        break;
      case LogLevel.error:
        levelColor = Colors.red;
        levelIcon = Icons.error_outline;
        break;
    }

    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      elevation: 0,
      color: isDark ? const Color(0xFF2C2C2C) : Colors.white,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(20),
        side: BorderSide(color: isDark ? Colors.grey.shade800 : Colors.grey.shade200),
      ),
      child: InkWell(
        borderRadius: BorderRadius.circular(20),
        onTap: () => _showLogDetails(context, log, levelColor),
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              Container(
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                  color: levelColor.withOpacity(isDark ? 0.2 : 0.1),
                  shape: BoxShape.circle,
                ),
                child: Icon(levelIcon, color: levelColor, size: 24),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(log.type.toUpperCase(), style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                        Text(DateFormat('MMM d, h:mm a').format(log.timestamp), style: TextStyle(color: Colors.grey.shade500, fontSize: 12)),
                      ],
                    ),
                    const SizedBox(height: 6),
                    Text(
                      log.shortDescription,
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                      style: TextStyle(color: isDark ? Colors.grey.shade300 : Colors.grey.shade800, fontSize: 14),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  void _showLogDetails(BuildContext context, LogModel log, Color levelColor) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Theme.of(context).scaffoldBackgroundColor,
      shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(24))),
      builder: (context) {
        return DraggableScrollableSheet(
          initialChildSize: 0.6,
          minChildSize: 0.4,
          maxChildSize: 0.9,
          expand: false,
          builder: (context, scrollController) {
            return SingleChildScrollView(
              controller: scrollController,
              padding: const EdgeInsets.all(24),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Center(
                    child: Container(
                      width: 40, height: 4,
                      margin: const EdgeInsets.only(bottom: 20),
                      decoration: BoxDecoration(color: Colors.grey.withOpacity(0.3), borderRadius: BorderRadius.circular(2)),
                    ),
                  ),
                  Row(
                    children: [
                      Icon(Icons.analytics, color: levelColor, size: 28),
                      const SizedBox(width: 12),
                      Expanded(child: Text('${log.type.toUpperCase()} DETAILS', style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold))),
                    ],
                  ),
                  const Divider(height: 48),
                  _buildDetailItem('TRANSACTION TIMESTAMP', log.timestamp.toString()),
                  const SizedBox(height: 24),
                  _buildDetailItem('SUMMARY', log.shortDescription, isBold: true),
                  const SizedBox(height: 24),
                  _buildDetailSection('INPUT PARAMETERS', log.input, levelColor),
                  const SizedBox(height: 24),
                  _buildDetailSection('API RESULT', log.result, levelColor, isResult: true),
                  const SizedBox(height: 48),
                ],
              ),
            );
          }
        );
      }
    );
  }

  Widget _buildDetailItem(String label, String value, {bool isBold = false}) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label, style: const TextStyle(fontWeight: FontWeight.bold, color: Colors.grey, fontSize: 11, letterSpacing: 1.1)),
        const SizedBox(height: 4),
        Text(value, style: TextStyle(fontSize: 15, fontWeight: isBold ? FontWeight.w600 : FontWeight.normal)),
      ],
    );
  }

  Widget _buildDetailSection(String label, dynamic data, Color color, {bool isResult = false}) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label, style: const TextStyle(fontWeight: FontWeight.bold, color: Colors.grey, fontSize: 11, letterSpacing: 1.1)),
        const SizedBox(height: 8),
        Container(
          width: double.infinity,
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: isResult ? color.withOpacity(0.05) : Colors.grey.withOpacity(0.05),
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: isResult ? color.withOpacity(0.2) : Colors.grey.withOpacity(0.1)),
          ),
          child: _renderData(data),
        ),
      ],
    );
  }

  Widget _renderData(dynamic data) {
    if (data == null) return const Text('N/A', style: TextStyle(fontFamily: 'monospace'));
    if (data is Map) {
      return Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: data.entries.map((e) {
          return Padding(
            padding: const EdgeInsets.only(bottom: 6.0),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('${_formatKey(e.key.toString())}: ', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13, fontFamily: 'monospace')),
                Expanded(child: Text('${e.value}', style: const TextStyle(fontSize: 13, fontFamily: 'monospace'))),
              ],
            ),
          );
        }).toList(),
      );
    }
    return Text(data.toString(), style: const TextStyle(fontFamily: 'monospace', fontSize: 13));
  }

  String _formatKey(String key) {
    return key.replaceAll('_', ' ').split(' ').map((s) => s.isNotEmpty ? s[0].toUpperCase() + s.substring(1) : '').join(' ');
  }
}