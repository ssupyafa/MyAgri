import 'dart:async';

import 'package:flutter/foundation.dart';
import 'package:flutter/widgets.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:intl/intl.dart' as intl;

import 'app_localizations_am.dart';
import 'app_localizations_en.dart';
import 'app_localizations_om.dart';

// ignore_for_file: type=lint

/// Callers can lookup localized strings with an instance of AppLocalizations
/// returned by `AppLocalizations.of(context)`.
///
/// Applications need to include `AppLocalizations.delegate()` in their app's
/// `localizationDelegates` list, and the locales they support in the app's
/// `supportedLocales` list. For example:
///
/// ```dart
/// import 'l10n/app_localizations.dart';
///
/// return MaterialApp(
///   localizationsDelegates: AppLocalizations.localizationsDelegates,
///   supportedLocales: AppLocalizations.supportedLocales,
///   home: MyApplicationHome(),
/// );
/// ```
///
/// ## Update pubspec.yaml
///
/// Please make sure to update your pubspec.yaml to include the following
/// packages:
///
/// ```yaml
/// dependencies:
///   # Internationalization support.
///   flutter_localizations:
///     sdk: flutter
///   intl: any # Use the pinned version from flutter_localizations
///
///   # Rest of dependencies
/// ```
///
/// ## iOS Applications
///
/// iOS applications define key application metadata, including supported
/// locales, in an Info.plist file that is built into the application bundle.
/// To configure the locales supported by your app, you’ll need to edit this
/// file.
///
/// First, open your project’s ios/Runner.xcworkspace Xcode workspace file.
/// Then, in the Project Navigator, open the Info.plist file under the Runner
/// project’s Runner folder.
///
/// Next, select the Information Property List item, select Add Item from the
/// Editor menu, then select Localizations from the pop-up menu.
///
/// Select and expand the newly-created Localizations item then, for each
/// locale your application supports, add a new item and select the locale
/// you wish to add from the pop-up menu in the Value field. This list should
/// be consistent with the languages listed in the AppLocalizations.supportedLocales
/// property.
abstract class AppLocalizations {
  AppLocalizations(String locale)
    : localeName = intl.Intl.canonicalizedLocale(locale.toString());

  final String localeName;

  static AppLocalizations? of(BuildContext context) {
    return Localizations.of<AppLocalizations>(context, AppLocalizations);
  }

  static const LocalizationsDelegate<AppLocalizations> delegate =
      _AppLocalizationsDelegate();

  /// A list of this localizations delegate along with the default localizations
  /// delegates.
  ///
  /// Returns a list of localizations delegates containing this delegate along with
  /// GlobalMaterialLocalizations.delegate, GlobalCupertinoLocalizations.delegate,
  /// and GlobalWidgetsLocalizations.delegate.
  ///
  /// Additional delegates can be added by appending to this list in
  /// MaterialApp. This list does not have to be used at all if a custom list
  /// of delegates is preferred or required.
  static const List<LocalizationsDelegate<dynamic>> localizationsDelegates =
      <LocalizationsDelegate<dynamic>>[
        delegate,
        GlobalMaterialLocalizations.delegate,
        GlobalCupertinoLocalizations.delegate,
        GlobalWidgetsLocalizations.delegate,
      ];

  /// A list of this localizations delegate's supported locales.
  static const List<Locale> supportedLocales = <Locale>[
    Locale('am'),
    Locale('en'),
    Locale('om'),
  ];

  /// No description provided for @appTitle.
  ///
  /// In en, this message translates to:
  /// **'Agri-Smart'**
  String get appTitle;

  /// No description provided for @signIn.
  ///
  /// In en, this message translates to:
  /// **'Sign In'**
  String get signIn;

  /// No description provided for @createAccount.
  ///
  /// In en, this message translates to:
  /// **'Create Account'**
  String get createAccount;

  /// No description provided for @username.
  ///
  /// In en, this message translates to:
  /// **'Username'**
  String get username;

  /// No description provided for @password.
  ///
  /// In en, this message translates to:
  /// **'Password'**
  String get password;

  /// No description provided for @forgotPassword.
  ///
  /// In en, this message translates to:
  /// **'Forgot Password?'**
  String get forgotPassword;

  /// No description provided for @newToAgriSmart.
  ///
  /// In en, this message translates to:
  /// **'New to Agri-Smart?'**
  String get newToAgriSmart;

  /// No description provided for @secureCloudDashboard.
  ///
  /// In en, this message translates to:
  /// **'Secure Cloud Dashboard'**
  String get secureCloudDashboard;

  /// No description provided for @pleaseEnterUsername.
  ///
  /// In en, this message translates to:
  /// **'Please enter username'**
  String get pleaseEnterUsername;

  /// No description provided for @pleaseEnterPassword.
  ///
  /// In en, this message translates to:
  /// **'Please enter password'**
  String get pleaseEnterPassword;

  /// No description provided for @accountSettings.
  ///
  /// In en, this message translates to:
  /// **'Account Settings'**
  String get accountSettings;

  /// No description provided for @profileUpdatedSuccessfully.
  ///
  /// In en, this message translates to:
  /// **'Profile updated successfully'**
  String get profileUpdatedSuccessfully;

  /// No description provided for @emailAddress.
  ///
  /// In en, this message translates to:
  /// **'Email Address'**
  String get emailAddress;

  /// No description provided for @saveProfileUpdates.
  ///
  /// In en, this message translates to:
  /// **'Save Profile Updates'**
  String get saveProfileUpdates;

  /// No description provided for @preferences.
  ///
  /// In en, this message translates to:
  /// **'Preferences'**
  String get preferences;

  /// No description provided for @changePassword.
  ///
  /// In en, this message translates to:
  /// **'Change Password'**
  String get changePassword;

  /// No description provided for @darkModeDisplay.
  ///
  /// In en, this message translates to:
  /// **'Dark Mode Display'**
  String get darkModeDisplay;

  /// No description provided for @secureLogOut.
  ///
  /// In en, this message translates to:
  /// **'Secure Log Out'**
  String get secureLogOut;

  /// No description provided for @language.
  ///
  /// In en, this message translates to:
  /// **'Language'**
  String get language;

  /// No description provided for @english.
  ///
  /// In en, this message translates to:
  /// **'English'**
  String get english;

  /// No description provided for @amharic.
  ///
  /// In en, this message translates to:
  /// **'Amharic'**
  String get amharic;

  /// No description provided for @afaanOromo.
  ///
  /// In en, this message translates to:
  /// **'Affan Oromo'**
  String get afaanOromo;

  /// No description provided for @soilSuitability.
  ///
  /// In en, this message translates to:
  /// **'Soil Suitability'**
  String get soilSuitability;

  /// No description provided for @droughtPrediction.
  ///
  /// In en, this message translates to:
  /// **'Drought Prediction'**
  String get droughtPrediction;

  /// No description provided for @cropRecommendation.
  ///
  /// In en, this message translates to:
  /// **'Crop Recommendation'**
  String get cropRecommendation;

  /// No description provided for @diseaseDetection.
  ///
  /// In en, this message translates to:
  /// **'Disease Detection'**
  String get diseaseDetection;

  /// No description provided for @firstName.
  ///
  /// In en, this message translates to:
  /// **'First Name'**
  String get firstName;

  /// No description provided for @lastName.
  ///
  /// In en, this message translates to:
  /// **'Last Name'**
  String get lastName;

  /// No description provided for @signUp.
  ///
  /// In en, this message translates to:
  /// **'Sign Up'**
  String get signUp;

  /// No description provided for @email.
  ///
  /// In en, this message translates to:
  /// **'Email'**
  String get email;

  /// No description provided for @home.
  ///
  /// In en, this message translates to:
  /// **'Home'**
  String get home;

  /// No description provided for @soilLabel.
  ///
  /// In en, this message translates to:
  /// **'Soil'**
  String get soilLabel;

  /// No description provided for @diseaseLabel.
  ///
  /// In en, this message translates to:
  /// **'Disease'**
  String get diseaseLabel;

  /// No description provided for @droughtLabel.
  ///
  /// In en, this message translates to:
  /// **'Drought'**
  String get droughtLabel;

  /// No description provided for @cropLabel.
  ///
  /// In en, this message translates to:
  /// **'Crop'**
  String get cropLabel;

  /// No description provided for @welcome.
  ///
  /// In en, this message translates to:
  /// **'Welcome'**
  String get welcome;

  /// No description provided for @overviewActivity.
  ///
  /// In en, this message translates to:
  /// **'Overview Activity'**
  String get overviewActivity;

  /// No description provided for @recentLogs.
  ///
  /// In en, this message translates to:
  /// **'Recent Logs'**
  String get recentLogs;

  /// No description provided for @refresh.
  ///
  /// In en, this message translates to:
  /// **'Refresh'**
  String get refresh;

  /// No description provided for @noData.
  ///
  /// In en, this message translates to:
  /// **'No data generated yet.'**
  String get noData;

  /// No description provided for @quickDiseaseScan.
  ///
  /// In en, this message translates to:
  /// **'Quick Disease Scan'**
  String get quickDiseaseScan;

  /// No description provided for @predictSuitability.
  ///
  /// In en, this message translates to:
  /// **'Predict Suitability'**
  String get predictSuitability;

  /// No description provided for @suitabilityResult.
  ///
  /// In en, this message translates to:
  /// **'Suitability Result'**
  String get suitabilityResult;

  /// No description provided for @score.
  ///
  /// In en, this message translates to:
  /// **'Score'**
  String get score;

  /// No description provided for @required.
  ///
  /// In en, this message translates to:
  /// **'Required'**
  String get required;

  /// No description provided for @takeAPhoto.
  ///
  /// In en, this message translates to:
  /// **'Take a Photo'**
  String get takeAPhoto;

  /// No description provided for @uploadImage.
  ///
  /// In en, this message translates to:
  /// **'Upload Image'**
  String get uploadImage;

  /// No description provided for @detectDisease.
  ///
  /// In en, this message translates to:
  /// **'Detect Disease'**
  String get detectDisease;

  /// No description provided for @diseaseDetectionResult.
  ///
  /// In en, this message translates to:
  /// **'Disease Detection Result'**
  String get diseaseDetectionResult;

  /// No description provided for @predictDrought.
  ///
  /// In en, this message translates to:
  /// **'Predict Drought'**
  String get predictDrought;

  /// No description provided for @droughtLikelihood.
  ///
  /// In en, this message translates to:
  /// **'Drought Likelihood'**
  String get droughtLikelihood;

  /// No description provided for @getRecommendation.
  ///
  /// In en, this message translates to:
  /// **'Get Recommendation'**
  String get getRecommendation;

  /// No description provided for @topRecommendedCrops.
  ///
  /// In en, this message translates to:
  /// **'Top Recommended Crops'**
  String get topRecommendedCrops;

  /// No description provided for @camera.
  ///
  /// In en, this message translates to:
  /// **'Camera'**
  String get camera;

  /// No description provided for @gallery.
  ///
  /// In en, this message translates to:
  /// **'Gallery'**
  String get gallery;

  /// No description provided for @disease.
  ///
  /// In en, this message translates to:
  /// **'Disease'**
  String get disease;

  /// No description provided for @confidence.
  ///
  /// In en, this message translates to:
  /// **'Confidence'**
  String get confidence;

  /// No description provided for @suitability_TS.
  ///
  /// In en, this message translates to:
  /// **'Surface Temperature (K)'**
  String get suitability_TS;

  /// No description provided for @suitability_T2M_MAX.
  ///
  /// In en, this message translates to:
  /// **'Maximum 2m Temperature (°C)'**
  String get suitability_T2M_MAX;

  /// No description provided for @suitability_T2M.
  ///
  /// In en, this message translates to:
  /// **'Average 2m Temperature (°C)'**
  String get suitability_T2M;

  /// No description provided for @suitability_QV2M.
  ///
  /// In en, this message translates to:
  /// **'2m Specific Humidity (g/kg)'**
  String get suitability_QV2M;

  /// No description provided for @suitability_WS10M.
  ///
  /// In en, this message translates to:
  /// **'10m Wind Speed (m/s)'**
  String get suitability_WS10M;

  /// No description provided for @suitability_T2M_MIN.
  ///
  /// In en, this message translates to:
  /// **'Minimum 2m Temperature (°C)'**
  String get suitability_T2M_MIN;

  /// No description provided for @suitability_RH2M.
  ///
  /// In en, this message translates to:
  /// **'2m Relative Humidity (%)'**
  String get suitability_RH2M;

  /// No description provided for @suitability_T2MDEW.
  ///
  /// In en, this message translates to:
  /// **'2m Dew Point Temperature (°C)'**
  String get suitability_T2MDEW;

  /// No description provided for @suitability_WS2M.
  ///
  /// In en, this message translates to:
  /// **'2m Wind Speed (m/s)'**
  String get suitability_WS2M;

  /// No description provided for @suitability_ALLSKY_SFC_PAR_TOT.
  ///
  /// In en, this message translates to:
  /// **'All Sky Surface PAR Total'**
  String get suitability_ALLSKY_SFC_PAR_TOT;

  /// No description provided for @suitability_PS.
  ///
  /// In en, this message translates to:
  /// **'Surface Pressure (kPa)'**
  String get suitability_PS;

  /// No description provided for @suitability_ALLSKY_SFC_SW_DWN.
  ///
  /// In en, this message translates to:
  /// **'All Sky Surface Shortwave Down'**
  String get suitability_ALLSKY_SFC_SW_DWN;

  /// No description provided for @suitability_PRECTOTCORR.
  ///
  /// In en, this message translates to:
  /// **'Corrected Precipitation (mm)'**
  String get suitability_PRECTOTCORR;

  /// No description provided for @drought_Precipitation.
  ///
  /// In en, this message translates to:
  /// **'Precipitation (mm)'**
  String get drought_Precipitation;

  /// No description provided for @drought_Temperature.
  ///
  /// In en, this message translates to:
  /// **'Temperature (°C)'**
  String get drought_Temperature;

  /// No description provided for @drought_SolarRadiation.
  ///
  /// In en, this message translates to:
  /// **'Solar Radiation (MJ/m²)'**
  String get drought_SolarRadiation;

  /// No description provided for @drought_Evapotranspiration.
  ///
  /// In en, this message translates to:
  /// **'Evapotranspiration (mm)'**
  String get drought_Evapotranspiration;

  /// No description provided for @drought_SoilMoisture.
  ///
  /// In en, this message translates to:
  /// **'Soil Moisture (%)'**
  String get drought_SoilMoisture;

  /// No description provided for @drought_Humidity.
  ///
  /// In en, this message translates to:
  /// **'Humidity (%)'**
  String get drought_Humidity;

  /// No description provided for @drought_Duration.
  ///
  /// In en, this message translates to:
  /// **'Drought Duration (days)'**
  String get drought_Duration;

  /// No description provided for @drought_WUE.
  ///
  /// In en, this message translates to:
  /// **'WUE (g/mm)'**
  String get drought_WUE;

  /// No description provided for @drought_LeafWaterPotential.
  ///
  /// In en, this message translates to:
  /// **'Leaf Water Potential (MPa)'**
  String get drought_LeafWaterPotential;

  /// No description provided for @drought_StomatalConductance.
  ///
  /// In en, this message translates to:
  /// **'Stomatal Conductance (mol/m² s)'**
  String get drought_StomatalConductance;

  /// No description provided for @drought_RootDepth.
  ///
  /// In en, this message translates to:
  /// **'Root Depth (cm)'**
  String get drought_RootDepth;

  /// No description provided for @drought_PhotosyntheticRate.
  ///
  /// In en, this message translates to:
  /// **'Photosynthetic Rate (µmol/m² s)'**
  String get drought_PhotosyntheticRate;

  /// No description provided for @drought_PlantBiomass.
  ///
  /// In en, this message translates to:
  /// **'Plant Biomass (g/m²)'**
  String get drought_PlantBiomass;

  /// No description provided for @drought_ZmDREB2A.
  ///
  /// In en, this message translates to:
  /// **'ZmDREB2A'**
  String get drought_ZmDREB2A;

  /// No description provided for @drought_RootQTL.
  ///
  /// In en, this message translates to:
  /// **'Root QTL'**
  String get drought_RootQTL;

  /// No description provided for @drought_ZmNAC.
  ///
  /// In en, this message translates to:
  /// **'ZmNAC'**
  String get drought_ZmNAC;

  /// No description provided for @drought_PlantingDensity.
  ///
  /// In en, this message translates to:
  /// **'Planting Density (plants/ha)'**
  String get drought_PlantingDensity;

  /// No description provided for @drought_SoilType.
  ///
  /// In en, this message translates to:
  /// **'Soil Type'**
  String get drought_SoilType;

  /// No description provided for @drought_GrowthStage.
  ///
  /// In en, this message translates to:
  /// **'Growth Stage'**
  String get drought_GrowthStage;

  /// No description provided for @crop_N.
  ///
  /// In en, this message translates to:
  /// **'Nitrogen (N)'**
  String get crop_N;

  /// No description provided for @crop_P.
  ///
  /// In en, this message translates to:
  /// **'Phosphorus (P)'**
  String get crop_P;

  /// No description provided for @crop_K.
  ///
  /// In en, this message translates to:
  /// **'Potassium (K)'**
  String get crop_K;

  /// No description provided for @crop_Temperature.
  ///
  /// In en, this message translates to:
  /// **'Temperature (°C)'**
  String get crop_Temperature;

  /// No description provided for @crop_Humidity.
  ///
  /// In en, this message translates to:
  /// **'Humidity (%)'**
  String get crop_Humidity;

  /// No description provided for @crop_PH.
  ///
  /// In en, this message translates to:
  /// **'pH Level'**
  String get crop_PH;

  /// No description provided for @crop_Rainfall.
  ///
  /// In en, this message translates to:
  /// **'Rainfall (mm)'**
  String get crop_Rainfall;

  /// No description provided for @predictionResult.
  ///
  /// In en, this message translates to:
  /// **'Prediction Result'**
  String get predictionResult;

  /// No description provided for @suitabilityExcellent.
  ///
  /// In en, this message translates to:
  /// **'Excellent suitability: Highly favorable conditions. Scientific consensus suggests optimal yields.'**
  String get suitabilityExcellent;

  /// No description provided for @suitabilityGood.
  ///
  /// In en, this message translates to:
  /// **'Good suitability: Adequate conditions, though some minor parameters could be optimized.'**
  String get suitabilityGood;

  /// No description provided for @suitabilityModerate.
  ///
  /// In en, this message translates to:
  /// **'Moderate suitability: Limiting factors present. Soil remediation or irrigation adjustments advised.'**
  String get suitabilityModerate;

  /// No description provided for @suitabilityLow.
  ///
  /// In en, this message translates to:
  /// **'Low suitability: Unfavorable conditions. High risk for crop failure without major intervention.'**
  String get suitabilityLow;
}

class _AppLocalizationsDelegate
    extends LocalizationsDelegate<AppLocalizations> {
  const _AppLocalizationsDelegate();

  @override
  Future<AppLocalizations> load(Locale locale) {
    return SynchronousFuture<AppLocalizations>(lookupAppLocalizations(locale));
  }

  @override
  bool isSupported(Locale locale) =>
      <String>['am', 'en', 'om'].contains(locale.languageCode);

  @override
  bool shouldReload(_AppLocalizationsDelegate old) => false;
}

AppLocalizations lookupAppLocalizations(Locale locale) {
  // Lookup logic when only language code is specified.
  switch (locale.languageCode) {
    case 'am':
      return AppLocalizationsAm();
    case 'en':
      return AppLocalizationsEn();
    case 'om':
      return AppLocalizationsOm();
  }

  throw FlutterError(
    'AppLocalizations.delegate failed to load unsupported locale "$locale". This is likely '
    'an issue with the localizations generation tool. Please file an issue '
    'on GitHub with a reproducible sample app and the gen-l10n configuration '
    'that was used.',
  );
}
