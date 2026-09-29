import { lazy } from "react";
import { Route, Switch } from "wouter";
import NotFound from "@/pages/NotFound";

const SDKDownload = lazy(() => import('@/pages/SDKDownload'));
const SDKManagement = lazy(() => import('@/pages/SDKManagement'));
const SEOOptimizer = lazy(() => import('@/pages/SEOOptimizer'));
const SKY444CentralBank = lazy(() => import('@/pages/SKY444CentralBank'));
const SMSCampaigns = lazy(() => import('@/pages/SMSCampaigns'));
const SMSIntegration = lazy(() => import('@/pages/SMSIntegration'));
const SMSTemplates = lazy(() => import('@/pages/SMSTemplates'));
const SMTPSettings = lazy(() => import('@/pages/SMTPSettings'));
const SOC2 = lazy(() => import('@/pages/SOC2'));
const SSLCertificates = lazy(() => import('@/pages/SSLCertificates'));
const SSO = lazy(() => import('@/pages/SSO'));
const SalesAnalytics = lazy(() => import('@/pages/SalesAnalytics'));
const SalesforceIntegration = lazy(() => import('@/pages/SalesforceIntegration'));
const SatisfactionSurvey = lazy(() => import('@/pages/SatisfactionSurvey'));
const SavedProperties = lazy(() => import('@/pages/SavedProperties'));
const SavedSearches = lazy(() => import('@/pages/SavedSearches'));
const SavingsGoals = lazy(() => import('@/pages/SavingsGoals'));
const ScheduledJobs = lazy(() => import('@/pages/ScheduledJobs'));
const ScheduledReports = lazy(() => import('@/pages/ScheduledReports'));
const School = lazy(() => import('@/pages/School'));
const SchoolCertificate = lazy(() => import('@/pages/SchoolCertificate'));
const SchoolCourse = lazy(() => import('@/pages/SchoolCourse'));
const SchoolDashboard = lazy(() => import('@/pages/SchoolDashboard'));
const SchoolLesson = lazy(() => import('@/pages/SchoolLesson'));
const SchoolQuiz = lazy(() => import('@/pages/SchoolQuiz'));
const Search = lazy(() => import('@/pages/Search'));
const SearchAnalytics = lazy(() => import('@/pages/SearchAnalytics'));
const SearchHistory = lazy(() => import('@/pages/SearchHistory'));
const SearchResults = lazy(() => import('@/pages/SearchResults'));
const SearchSuggestions = lazy(() => import('@/pages/SearchSuggestions'));
const SeasonalEvents = lazy(() => import('@/pages/SeasonalEvents'));
const Security = lazy(() => import('@/pages/Security'));
const SecurityAudit = lazy(() => import('@/pages/SecurityAudit'));
const SecurityCompliance = lazy(() => import('@/pages/SecurityCompliance'));
const SecurityDashboard = lazy(() => import('@/pages/SecurityDashboard'));
const SecuritySettings = lazy(() => import('@/pages/SecuritySettings'));
const SegmentationAnalysis = lazy(() => import('@/pages/SegmentationAnalysis'));
const SelectDropdownForm = lazy(() => import('@/pages/SelectDropdownForm'));
const SelfHealingInfra = lazy(() => import('@/pages/SelfHealingInfra'));
const SellerDashboard = lazy(() => import('@/pages/SellerDashboard'));
const SellerProfile = lazy(() => import('@/pages/SellerProfile'));
const SendCrypto = lazy(() => import('@/pages/SendCrypto'));
const SentimentPipeline = lazy(() => import('@/pages/SentimentPipeline'));
const ServerHealth = lazy(() => import('@/pages/ServerHealth'));
const ServerInstaller = lazy(() => import('@/pages/ServerInstaller'));
const ServerStatus = lazy(() => import('@/pages/ServerStatus'));
const Settings = lazy(() => import('@/pages/Settings'));
const SettingsDialog = lazy(() => import('@/pages/SettingsDialog'));
const SetupWizard = lazy(() => import('@/pages/SetupWizard'));
const ShadowIdentity = lazy(() => import('@/pages/ShadowIdentity'));
const ShadowRelay = lazy(() => import('@/pages/ShadowRelay'));
const ShareDialog = lazy(() => import('@/pages/ShareDialog'));
const Shares = lazy(() => import('@/pages/Shares'));
const Sharing = lazy(() => import('@/pages/Sharing'));
const ShippingManagement = lazy(() => import('@/pages/ShippingManagement'));
const ShoppingCart = lazy(() => import('@/pages/ShoppingCart'));
const SidebarNavigation = lazy(() => import('@/pages/SidebarNavigation'));
const SignUp = lazy(() => import('@/pages/SignUp'));
const SignUpFlow = lazy(() => import('@/pages/SignUpFlow').then(({ SignUpFlow }) => ({ default: SignUpFlow })));
const SignUp_old = lazy(() => import('@/pages/SignUp_old'));
const Signin = lazy(() => import('@/pages/Signin'));
const SituationRoom = lazy(() => import('@/pages/SituationRoom'));
const SkillBadges = lazy(() => import('@/pages/SkillBadges'));
const SkySchool = lazy(() => import('@/pages/SkySchool'));
const SkySchoolAI = lazy(() => import('@/pages/SkySchoolAI'));
const SkySchoolQuiz = lazy(() => import('@/pages/SkySchoolQuiz').then(({ default: QuizPage }) => ({ default: () => <QuizPage lessonId="blockchain-101-lesson-0" /> })));
const SkyStore = lazy(() => import('@/pages/SkyStore'));
const SlackIntegration = lazy(() => import('@/pages/SlackIntegration'));
const SleepTracking = lazy(() => import('@/pages/SleepTracking'));
const SlippageProtection = lazy(() => import('@/pages/SlippageProtection'));
const SmartContractAudit = lazy(() => import('@/pages/SmartContractAudit'));
const SmartContractViewer = lazy(() => import('@/pages/SmartContractViewer'));
const SmartContracts = lazy(() => import('@/pages/SmartContracts'));
const SocialAnalytics = lazy(() => import('@/pages/SocialAnalytics'));
const SocialEvents = lazy(() => import('@/pages/SocialEvents'));
const SocialFeed = lazy(() => import('@/pages/SocialFeed'));
const SocialFeedV2 = lazy(() => import('@/pages/SocialFeedV2'));
const SocialGraph = lazy(() => import('@/pages/SocialGraph'));
const SocialMedia = lazy(() => import('@/pages/SocialMedia'));
const SocialMediaCampaigns = lazy(() => import('@/pages/SocialMediaCampaigns'));
const SolanaValidatorSetup = lazy(() => import('@/pages/SolanaValidatorSetup'));
const SortOptions = lazy(() => import('@/pages/SortOptions'));
const SpeechToText = lazy(() => import('@/pages/SpeechToText'));
const SpinWheel = lazy(() => import('@/pages/SpinWheel'));
const Sponsorships = lazy(() => import('@/pages/Sponsorships'));
const StakeDelegation = lazy(() => import('@/pages/StakeDelegation'));
const StakingDashboard = lazy(() => import('@/pages/StakingDashboard'));
const StakingHub = lazy(() => import('@/pages/StakingHub'));
const StakingOptions = lazy(() => import('@/pages/StakingOptions'));
const StakingPortal = lazy(() => import('@/pages/StakingPortal'));
const StatisticsPanel = lazy(() => import('@/pages/StatisticsPanel'));
const Status = lazy(() => import('@/pages/Status'));
const StepperWizard = lazy(() => import('@/pages/StepperWizard'));
const StockChart = lazy(() => import('@/pages/StockChart'));
const StockSearch = lazy(() => import('@/pages/StockSearch'));
const Stories = lazy(() => import('@/pages/Stories'));
const StreamAnalytics = lazy(() => import('@/pages/StreamAnalytics'));
const StreamClip = lazy(() => import('@/pages/StreamClip'));
const StreamGifting = lazy(() => import('@/pages/StreamGifting'));
const StreamingDashboard = lazy(() => import('@/pages/StreamingDashboard'));
const StripeCheckout = lazy(() => import('@/pages/StripeCheckout'));
const StripeIntegration = lazy(() => import('@/pages/StripeIntegration'));
const StudentProgress = lazy(() => import('@/pages/StudentProgress'));
const StyleSelector = lazy(() => import('@/pages/StyleSelector'));
const SubscriberManagement = lazy(() => import('@/pages/SubscriberManagement'));
const SubscriptionManagement = lazy(() => import('@/pages/SubscriptionManagement'));
const SubscriptionPlans = lazy(() => import('@/pages/SubscriptionPlans'));
const SubscriptionSetup = lazy(() => import('@/pages/SubscriptionSetup'));
const Subscriptions = lazy(() => import('@/pages/Subscriptions'));
const SuccessDialog = lazy(() => import('@/pages/SuccessDialog'));
const SuccessScreen = lazy(() => import('@/pages/SuccessScreen'));
const SupportMetrics = lazy(() => import('@/pages/SupportMetrics'));
const SupportTicket = lazy(() => import('@/pages/SupportTicket'));
const SwapInterface = lazy(() => import('@/pages/SwapInterface'));
const SwipeInterface = lazy(() => import('@/pages/SwipeInterface'));
const Synthetics = lazy(() => import('@/pages/Synthetics'));
const SystemArchitecture = lazy(() => import('@/pages/SystemArchitecture'));
const SystemLogs = lazy(() => import('@/pages/SystemLogs'));
const SystemMonitoring = lazy(() => import('@/pages/SystemMonitoring'));
const SystemObservability = lazy(() => import('@/pages/SystemObservability'));
const SystemSettings = lazy(() => import('@/pages/SystemSettings'));
const SystemStatus = lazy(() => import('@/pages/SystemStatus'));
const TabsNavigation = lazy(() => import('@/pages/TabsNavigation'));
const TaskAutomation = lazy(() => import('@/pages/TaskAutomation'));
const TaskDetail = lazy(() => import('@/pages/TaskDetail'));
const TaskList = lazy(() => import('@/pages/TaskList'));
const TaxDocumentation = lazy(() => import('@/pages/TaxDocumentation'));
const TaxPlanning = lazy(() => import('@/pages/TaxPlanning'));
const TaxReporting = lazy(() => import('@/pages/TaxReporting'));
const TaxReports = lazy(() => import('@/pages/TaxReports'));
const TeachingOpportunities = lazy(() => import('@/pages/TeachingOpportunities'));
const TeamManagement = lazy(() => import('@/pages/TeamManagement'));
const TeamWorkspace = lazy(() => import('@/pages/TeamWorkspace'));
const TechnicalIndicators = lazy(() => import('@/pages/TechnicalIndicators'));
const TelegramIntegration = lazy(() => import('@/pages/TelegramIntegration'));
const TemplateLibrary = lazy(() => import('@/pages/TemplateLibrary'));
const TermsAcceptance = lazy(() => import('@/pages/TermsAcceptance'));
const TermsOfService = lazy(() => import('@/pages/TermsOfService'));
const TestingFramework = lazy(() => import('@/pages/TestingFramework'));
const TextInputForm = lazy(() => import('@/pages/TextInputForm'));
const TextToSpeech = lazy(() => import('@/pages/TextToSpeech'));
const TextTools = lazy(() => import('@/pages/TextTools'));
const ThemeSettings = lazy(() => import('@/pages/ThemeSettings'));
const ThreadManagement = lazy(() => import('@/pages/ThreadManagement'));
const TicketAssignment = lazy(() => import('@/pages/TicketAssignment'));
const TicketDetail = lazy(() => import('@/pages/TicketDetail'));
const TicketQueue = lazy(() => import('@/pages/TicketQueue'));
const TierComparison = lazy(() => import('@/pages/TierComparison'));
const TimeInputForm = lazy(() => import('@/pages/TimeInputForm'));
const TimePickerDialog = lazy(() => import('@/pages/TimePickerDialog'));
const TimeTracking = lazy(() => import('@/pages/TimeTracking'));
const TimelineView = lazy(() => import('@/pages/TimelineView'));
const TimeoutError = lazy(() => import('@/pages/TimeoutError'));
const TipJar = lazy(() => import('@/pages/TipJar'));
const ToastNotifications = lazy(() => import('@/pages/ToastNotifications'));
const TodoList = lazy(() => import('@/pages/TodoList'));
const ToggleSwitchForm = lazy(() => import('@/pages/ToggleSwitchForm'));
const TokenDashboard = lazy(() => import('@/pages/TokenDashboard'));
const TokenGovernance = lazy(() => import('@/pages/TokenGovernance'));
const TokenInformation = lazy(() => import('@/pages/TokenInformation'));
const TokenMetrics = lazy(() => import('@/pages/TokenMetrics'));
const TokenomicsCalculator = lazy(() => import('@/pages/TokenomicsCalculator'));
const TorBridge = lazy(() => import('@/pages/TorBridge'));
const TournamentBracket = lazy(() => import('@/pages/TournamentBracket'));
const TournamentBrackets = lazy(() => import('@/pages/TournamentBrackets'));
const Tournaments = lazy(() => import('@/pages/Tournaments'));
const TradeHistory = lazy(() => import('@/pages/TradeHistory'));
const Trading = lazy(() => import('@/pages/Trading'));
const TradingBots = lazy(() => import('@/pages/TradingBots'));
const TradingHistory = lazy(() => import('@/pages/TradingHistory'));
const TradingTerminal = lazy(() => import('@/pages/TradingTerminal'));
const TransactionExplorer = lazy(() => import('@/pages/TransactionExplorer'));
const TransactionHistory = lazy(() => import('@/pages/TransactionHistory'));
const TransactionViewer = lazy(() => import('@/pages/TransactionViewer'));
const TranscriptionManager = lazy(() => import('@/pages/TranscriptionManager'));
const TranslationEnabledCommunity = lazy(() => import('@/pages/TranslationEnabledCommunity'));
const TranslationEnabledSocialFeed = lazy(() => import('@/pages/TranslationEnabledSocialFeed'));
const TransparencyReports = lazy(() => import('@/pages/TransparencyReports'));
const TravelBlog = lazy(() => import('@/pages/TravelBlog'));
const TravelBudget = lazy(() => import('@/pages/TravelBudget'));
const TravelDocuments = lazy(() => import('@/pages/TravelDocuments'));
const TravelPhotos = lazy(() => import('@/pages/TravelPhotos'));
const TravelReviews = lazy(() => import('@/pages/TravelReviews'));
const TravelTips = lazy(() => import('@/pages/TravelTips'));
const TreasuryManagement = lazy(() => import('@/pages/TreasuryManagement'));
const TrendAnalysis = lazy(() => import('@/pages/TrendAnalysis'));
const Trending = lazy(() => import('@/pages/Trending'));
const TrendingContent = lazy(() => import('@/pages/TrendingContent'));
const TrendingItems = lazy(() => import('@/pages/TrendingItems'));
const TrendingTopics = lazy(() => import('@/pages/TrendingTopics'));
const TriggersActions = lazy(() => import('@/pages/TriggersActions'));
const TripPlanner = lazy(() => import('@/pages/TripPlanner'));
const TrumpMining = lazy(() => import('@/pages/TrumpMining'));
const TrustSafetyDashboard = lazy(() => import('@/pages/TrustSafetyDashboard'));
const TrustSystem = lazy(() => import('@/pages/TrustSystem'));
const TwoFactorAuth = lazy(() => import('@/pages/TwoFactorAuth'));
const TwoFactorSetup = lazy(() => import('@/pages/TwoFactorSetup'));
const TypingIndicators = lazy(() => import('@/pages/TypingIndicators'));
const UnhiddenInterface = lazy(() => import('@/pages/UnhiddenInterface'));
const UnhiddenMode = lazy(() => import('@/pages/UnhiddenMode'));
const UnifiedFeed = lazy(() => import('@/pages/UnifiedFeed'));
const UnifiedIdentity = lazy(() => import('@/pages/UnifiedIdentity'));
const UnifiedMessaging = lazy(() => import('@/pages/UnifiedMessaging'));
const UnifiedPaymentLedger = lazy(() => import('@/pages/UnifiedPaymentLedger'));
const UnifiedPlatformDashboard = lazy(() => import('@/pages/UnifiedPlatformDashboard'));
const UnifiedWallet = lazy(() => import('@/pages/UnifiedWallet'));
const UniversalSearch = lazy(() => import('@/pages/UniversalSearch'));
const UpdatedLandingPage = lazy(() => import('@/pages/UpdatedLandingPage'));
const UpgradeDowngradePlan = lazy(() => import('@/pages/UpgradeDowngradePlan'));
const Upscaling = lazy(() => import('@/pages/Upscaling'));
const UserActivity = lazy(() => import('@/pages/UserActivity'));
const UserBehavior = lazy(() => import('@/pages/UserBehavior'));
const UserBio = lazy(() => import('@/pages/UserBio'));
const UserDirectory = lazy(() => import('@/pages/UserDirectory'));
const UserDiscovery = lazy(() => import('@/pages/UserDiscovery'));
const UserManagement = lazy(() => import('@/pages/UserManagement'));
const UserMentions = lazy(() => import('@/pages/UserMentions'));
const UserOnboarding = lazy(() => import('@/pages/UserOnboarding'));
const UserPermissions = lazy(() => import('@/pages/UserPermissions'));
const UserProfile = lazy(() => import('@/pages/UserProfile'));
const UserProfiles = lazy(() => import('@/pages/UserProfiles'));
const UserReputation = lazy(() => import('@/pages/UserReputation'));
const UserSearch = lazy(() => import('@/pages/UserSearch'));
const UserStats = lazy(() => import('@/pages/UserStats'));
const UserSuggestions = lazy(() => import('@/pages/UserSuggestions'));
const UserTimeline = lazy(() => import('@/pages/UserTimeline'));
const VODArchive = lazy(() => import('@/pages/VODArchive'));
const ValidatorPerformance = lazy(() => import('@/pages/ValidatorPerformance'));
const ValidatorSetup = lazy(() => import('@/pages/ValidatorSetup'));
const VendorAnalytics = lazy(() => import('@/pages/VendorAnalytics'));
const VendorDirectory = lazy(() => import('@/pages/VendorDirectory'));
const VendorOnboarding = lazy(() => import('@/pages/VendorOnboarding'));
const VendorPerformance = lazy(() => import('@/pages/VendorPerformance'));
const VendorVerification = lazy(() => import('@/pages/VendorVerification'));
const VenueManagement = lazy(() => import('@/pages/VenueManagement'));
const Verification = lazy(() => import('@/pages/Verification'));
const VerificationSteps = lazy(() => import('@/pages/VerificationSteps'));
const VerificationSystem = lazy(() => import('@/pages/VerificationSystem'));
const VersionManagement = lazy(() => import('@/pages/VersionManagement'));
const VestingSchedule = lazy(() => import('@/pages/VestingSchedule'));
const VideoArea = lazy(() => import('@/pages/VideoArea'));
const VideoCall = lazy(() => import('@/pages/VideoCall'));
const VideoChat = lazy(() => import('@/pages/VideoChat'));
const VideoEditor = lazy(() => import('@/pages/VideoEditor'));
const VideoPlayer = lazy(() => import('@/pages/VideoPlayer'));
const VideoTools = lazy(() => import('@/pages/VideoTools'));
const VideoTutorials = lazy(() => import('@/pages/VideoTutorials'));
const VideoUpload = lazy(() => import('@/pages/VideoUpload'));
const VideoUploader = lazy(() => import('@/pages/VideoUploader'));
const ViewerMetrics = lazy(() => import('@/pages/ViewerMetrics'));
const VirtualTour = lazy(() => import('@/pages/VirtualTour'));
const VoiceCloning = lazy(() => import('@/pages/VoiceCloning'));
const VoiceCommands = lazy(() => import('@/pages/VoiceCommands').then(({ VoiceCommandsPage }) => ({ default: VoiceCommandsPage })));
const VoiceCommandsRegistry = lazy(() => import('@/pages/VoiceCommandsRegistry'));
const VoiceMessages = lazy(() => import('@/pages/VoiceMessages'));
const WalkthroughPage = lazy(() => import('@/pages/WalkthroughPage'));
const Wallet = lazy(() => import('@/pages/Wallet'));
const WalletConnect = lazy(() => import('@/pages/WalletConnect'));
const WalletIntegration = lazy(() => import('@/pages/WalletIntegration'));
const WalletOverview = lazy(() => import('@/pages/WalletOverview'));
const WarningDialog = lazy(() => import('@/pages/WarningDialog'));
const WatchEarn = lazy(() => import('@/pages/WatchEarn'));
const WatchList = lazy(() => import('@/pages/WatchList'));
const WealthSimulator = lazy(() => import('@/pages/WealthSimulator'));
const Web3Auth = lazy(() => import('@/pages/Web3Auth'));
const WebhookManagement = lazy(() => import('@/pages/WebhookManagement'));
const WebhookManager = lazy(() => import('@/pages/WebhookManager'));
const Webhooks = lazy(() => import('@/pages/Webhooks'));
const WelcomeScreen = lazy(() => import('@/pages/WelcomeScreen'));
const WhaleMonitor = lazy(() => import('@/pages/WhaleMonitor'));
const WhitelistManagement = lazy(() => import('@/pages/WhitelistManagement'));
const WishlistManagement = lazy(() => import('@/pages/WishlistManagement'));
const WorkflowAutomation = lazy(() => import('@/pages/WorkflowAutomation'));
const WorkflowBuilder = lazy(() => import('@/pages/WorkflowBuilder'));
const WorldBrain = lazy(() => import('@/pages/WorldBrain'));
const WorldSimulationControl = lazy(() => import('@/pages/WorldSimulationControl'));
const YieldFarming = lazy(() => import('@/pages/YieldFarming'));
const ZapierIntegration = lazy(() => import('@/pages/ZapierIntegration'));
const ZeroKnowledgeProof = lazy(() => import('@/pages/ZeroKnowledgeProof'));

export default function LegacyRoutesSZ() {
  return (
    <Switch>
      <Route path="/s-d-k-download" component={SDKDownload} />
      <Route path="/s-d-k-management" component={SDKManagement} />
      <Route path="/s-e-o-optimizer" component={SEOOptimizer} />
      <Route path="/s-k-y444-central-bank" component={SKY444CentralBank} />
      <Route path="/s-m-s-campaigns" component={SMSCampaigns} />
      <Route path="/s-m-s-integration" component={SMSIntegration} />
      <Route path="/s-m-s-templates" component={SMSTemplates} />
      <Route path="/s-m-t-p-settings" component={SMTPSettings} />
      <Route path="/s-o-c2" component={SOC2} />
      <Route path="/s-s-l-certificates" component={SSLCertificates} />
      <Route path="/s-s-o" component={SSO} />
      <Route path="/sales-analytics" component={SalesAnalytics} />
      <Route path="/salesforce-integration" component={SalesforceIntegration} />
      <Route path="/satisfaction-survey" component={SatisfactionSurvey} />
      <Route path="/saved-properties" component={SavedProperties} />
      <Route path="/saved-searches" component={SavedSearches} />
      <Route path="/savings-goals" component={SavingsGoals} />
      <Route path="/scheduled-jobs" component={ScheduledJobs} />
      <Route path="/scheduled-reports" component={ScheduledReports} />
      <Route path="/school" component={School} />
      <Route path="/school-certificate" component={SchoolCertificate} />
      <Route path="/school-course" component={SchoolCourse} />
      <Route path="/school-dashboard" component={SchoolDashboard} />
      <Route path="/school-lesson" component={SchoolLesson} />
      <Route path="/school-quiz" component={SchoolQuiz} />
      <Route path="/search" component={Search} />
      <Route path="/search-analytics" component={SearchAnalytics} />
      <Route path="/search-history" component={SearchHistory} />
      <Route path="/search-results" component={SearchResults} />
      <Route path="/search-suggestions" component={SearchSuggestions} />
      <Route path="/seasonal-events" component={SeasonalEvents} />
      <Route path="/security" component={Security} />
      <Route path="/security-audit" component={SecurityAudit} />
      <Route path="/security-compliance" component={SecurityCompliance} />
      <Route path="/security-dashboard" component={SecurityDashboard} />
      <Route path="/security-settings" component={SecuritySettings} />
      <Route path="/segmentation-analysis" component={SegmentationAnalysis} />
      <Route path="/select-dropdown-form" component={SelectDropdownForm} />
      <Route path="/self-healing-infra" component={SelfHealingInfra} />
      <Route path="/seller-dashboard" component={SellerDashboard} />
      <Route path="/seller-profile" component={SellerProfile} />
      <Route path="/send-crypto" component={SendCrypto} />
      <Route path="/sentiment-pipeline" component={SentimentPipeline} />
      <Route path="/server-health" component={ServerHealth} />
      <Route path="/server-installer" component={ServerInstaller} />
      <Route path="/server-status" component={ServerStatus} />
      <Route path="/settings" component={Settings} />
      <Route path="/settings-dialog" component={SettingsDialog} />
      <Route path="/setup-wizard" component={SetupWizard} />
      <Route path="/shadow-identity" component={ShadowIdentity} />
      <Route path="/shadow-relay" component={ShadowRelay} />
      <Route path="/share-dialog" component={ShareDialog} />
      <Route path="/shares" component={Shares} />
      <Route path="/sharing" component={Sharing} />
      <Route path="/shipping-management" component={ShippingManagement} />
      <Route path="/shopping-cart" component={ShoppingCart} />
      <Route path="/sidebar-navigation" component={SidebarNavigation} />
      <Route path="/sign-up" component={SignUp} />
      <Route path="/sign-up-flow" component={SignUpFlow} />
      <Route path="/sign-up_old" component={SignUp_old} />
      <Route path="/signin" component={Signin} />
      <Route path="/situation-room" component={SituationRoom} />
      <Route path="/skill-badges" component={SkillBadges} />
      <Route path="/sky-school" component={SkySchool} />
      <Route path="/sky-school-a-i" component={SkySchoolAI} />
      <Route path="/sky-school-quiz" component={SkySchoolQuiz} />
      <Route path="/sky-store" component={SkyStore} />
      <Route path="/slack-integration" component={SlackIntegration} />
      <Route path="/sleep-tracking" component={SleepTracking} />
      <Route path="/slippage-protection" component={SlippageProtection} />
      <Route path="/smart-contract-audit" component={SmartContractAudit} />
      <Route path="/smart-contract-viewer" component={SmartContractViewer} />
      <Route path="/smart-contracts" component={SmartContracts} />
      <Route path="/social-analytics" component={SocialAnalytics} />
      <Route path="/social-events" component={SocialEvents} />
      <Route path="/social-feed" component={SocialFeed} />
      <Route path="/social-feed-v2" component={SocialFeedV2} />
      <Route path="/social-graph" component={SocialGraph} />
      <Route path="/social-media" component={SocialMedia} />
      <Route path="/social-media-campaigns" component={SocialMediaCampaigns} />
      <Route path="/solana-validator-setup" component={SolanaValidatorSetup} />
      <Route path="/sort-options" component={SortOptions} />
      <Route path="/speech-to-text" component={SpeechToText} />
      <Route path="/spin-wheel" component={SpinWheel} />
      <Route path="/sponsorships" component={Sponsorships} />
      <Route path="/stake-delegation" component={StakeDelegation} />
      <Route path="/staking-dashboard" component={StakingDashboard} />
      <Route path="/staking-hub" component={StakingHub} />
      <Route path="/staking-options" component={StakingOptions} />
      <Route path="/staking-portal" component={StakingPortal} />
      <Route path="/statistics-panel" component={StatisticsPanel} />
      <Route path="/status" component={Status} />
      <Route path="/stepper-wizard" component={StepperWizard} />
      <Route path="/stock-chart" component={StockChart} />
      <Route path="/stock-search" component={StockSearch} />
      <Route path="/stories" component={Stories} />
      <Route path="/stream-analytics" component={StreamAnalytics} />
      <Route path="/stream-clip" component={StreamClip} />
      <Route path="/stream-gifting" component={StreamGifting} />
      <Route path="/streaming-dashboard" component={StreamingDashboard} />
      <Route path="/stripe-checkout" component={StripeCheckout} />
      <Route path="/stripe-integration" component={StripeIntegration} />
      <Route path="/student-progress" component={StudentProgress} />
      <Route path="/style-selector" component={StyleSelector} />
      <Route path="/subscriber-management" component={SubscriberManagement} />
      <Route path="/subscription-management" component={SubscriptionManagement} />
      <Route path="/subscription-plans" component={SubscriptionPlans} />
      <Route path="/subscription-setup" component={SubscriptionSetup} />
      <Route path="/subscriptions" component={Subscriptions} />
      <Route path="/success-dialog" component={SuccessDialog} />
      <Route path="/success-screen" component={SuccessScreen} />
      <Route path="/support-metrics" component={SupportMetrics} />
      <Route path="/support-ticket" component={SupportTicket} />
      <Route path="/swap-interface" component={SwapInterface} />
      <Route path="/swipe-interface" component={SwipeInterface} />
      <Route path="/synthetics" component={Synthetics} />
      <Route path="/system-architecture" component={SystemArchitecture} />
      <Route path="/system-logs" component={SystemLogs} />
      <Route path="/system-monitoring" component={SystemMonitoring} />
      <Route path="/system-observability" component={SystemObservability} />
      <Route path="/system-settings" component={SystemSettings} />
      <Route path="/system-status" component={SystemStatus} />
      <Route path="/tabs-navigation" component={TabsNavigation} />
      <Route path="/task-automation" component={TaskAutomation} />
      <Route path="/task-detail" component={TaskDetail} />
      <Route path="/task-list" component={TaskList} />
      <Route path="/tax-documentation" component={TaxDocumentation} />
      <Route path="/tax-planning" component={TaxPlanning} />
      <Route path="/tax-reporting" component={TaxReporting} />
      <Route path="/tax-reports" component={TaxReports} />
      <Route path="/teaching-opportunities" component={TeachingOpportunities} />
      <Route path="/team-management" component={TeamManagement} />
      <Route path="/team-workspace" component={TeamWorkspace} />
      <Route path="/technical-indicators" component={TechnicalIndicators} />
      <Route path="/telegram-integration" component={TelegramIntegration} />
      <Route path="/template-library" component={TemplateLibrary} />
      <Route path="/terms-acceptance" component={TermsAcceptance} />
      <Route path="/terms-of-service" component={TermsOfService} />
      <Route path="/testing-framework" component={TestingFramework} />
      <Route path="/text-input-form" component={TextInputForm} />
      <Route path="/text-to-speech" component={TextToSpeech} />
      <Route path="/text-tools" component={TextTools} />
      <Route path="/theme-settings" component={ThemeSettings} />
      <Route path="/thread-management" component={ThreadManagement} />
      <Route path="/ticket-assignment" component={TicketAssignment} />
      <Route path="/ticket-detail" component={TicketDetail} />
      <Route path="/ticket-queue" component={TicketQueue} />
      <Route path="/tier-comparison" component={TierComparison} />
      <Route path="/time-input-form" component={TimeInputForm} />
      <Route path="/time-picker-dialog" component={TimePickerDialog} />
      <Route path="/time-tracking" component={TimeTracking} />
      <Route path="/timeline-view" component={TimelineView} />
      <Route path="/timeout-error" component={TimeoutError} />
      <Route path="/tip-jar" component={TipJar} />
      <Route path="/toast-notifications" component={ToastNotifications} />
      <Route path="/todo-list" component={TodoList} />
      <Route path="/toggle-switch-form" component={ToggleSwitchForm} />
      <Route path="/token-dashboard" component={TokenDashboard} />
      <Route path="/token-governance" component={TokenGovernance} />
      <Route path="/token-information" component={TokenInformation} />
      <Route path="/token-metrics" component={TokenMetrics} />
      <Route path="/tokenomics-calculator" component={TokenomicsCalculator} />
      <Route path="/tor-bridge" component={TorBridge} />
      <Route path="/tournament-bracket" component={TournamentBracket} />
      <Route path="/tournament-brackets" component={TournamentBrackets} />
      <Route path="/tournaments" component={Tournaments} />
      <Route path="/trade-history" component={TradeHistory} />
      <Route path="/trading" component={Trading} />
      <Route path="/trading-bots" component={TradingBots} />
      <Route path="/trading-history" component={TradingHistory} />
      <Route path="/trading-terminal" component={TradingTerminal} />
      <Route path="/transaction-explorer" component={TransactionExplorer} />
      <Route path="/transaction-history" component={TransactionHistory} />
      <Route path="/transaction-viewer" component={TransactionViewer} />
      <Route path="/transcription-manager" component={TranscriptionManager} />
      <Route path="/translation-enabled-community" component={TranslationEnabledCommunity} />
      <Route path="/translation-enabled-social-feed" component={TranslationEnabledSocialFeed} />
      <Route path="/transparency-reports" component={TransparencyReports} />
      <Route path="/travel-blog" component={TravelBlog} />
      <Route path="/travel-budget" component={TravelBudget} />
      <Route path="/travel-documents" component={TravelDocuments} />
      <Route path="/travel-photos" component={TravelPhotos} />
      <Route path="/travel-reviews" component={TravelReviews} />
      <Route path="/travel-tips" component={TravelTips} />
      <Route path="/treasury-management" component={TreasuryManagement} />
      <Route path="/trend-analysis" component={TrendAnalysis} />
      <Route path="/trending" component={Trending} />
      <Route path="/trending-content" component={TrendingContent} />
      <Route path="/trending-items" component={TrendingItems} />
      <Route path="/trending-topics" component={TrendingTopics} />
      <Route path="/triggers-actions" component={TriggersActions} />
      <Route path="/trip-planner" component={TripPlanner} />
      <Route path="/trump-mining" component={TrumpMining} />
      <Route path="/trust-safety-dashboard" component={TrustSafetyDashboard} />
      <Route path="/trust-system" component={TrustSystem} />
      <Route path="/two-factor-auth" component={TwoFactorAuth} />
      <Route path="/two-factor-setup" component={TwoFactorSetup} />
      <Route path="/typing-indicators" component={TypingIndicators} />
      <Route path="/unhidden-interface" component={UnhiddenInterface} />
      <Route path="/unhidden-mode" component={UnhiddenMode} />
      <Route path="/unified-feed" component={UnifiedFeed} />
      <Route path="/unified-identity" component={UnifiedIdentity} />
      <Route path="/unified-messaging" component={UnifiedMessaging} />
      <Route path="/unified-payment-ledger" component={UnifiedPaymentLedger} />
      <Route path="/unified-platform-dashboard" component={UnifiedPlatformDashboard} />
      <Route path="/unified-wallet" component={UnifiedWallet} />
      <Route path="/universal-search" component={UniversalSearch} />
      <Route path="/updated-landing-page" component={UpdatedLandingPage} />
      <Route path="/upgrade-downgrade-plan" component={UpgradeDowngradePlan} />
      <Route path="/upscaling" component={Upscaling} />
      <Route path="/user-activity" component={UserActivity} />
      <Route path="/user-behavior" component={UserBehavior} />
      <Route path="/user-bio" component={UserBio} />
      <Route path="/user-directory" component={UserDirectory} />
      <Route path="/user-discovery" component={UserDiscovery} />
      <Route path="/user-management" component={UserManagement} />
      <Route path="/user-mentions" component={UserMentions} />
      <Route path="/user-onboarding" component={UserOnboarding} />
      <Route path="/user-permissions" component={UserPermissions} />
      <Route path="/user-profile" component={UserProfile} />
      <Route path="/user-profiles" component={UserProfiles} />
      <Route path="/user-reputation" component={UserReputation} />
      <Route path="/user-search" component={UserSearch} />
      <Route path="/user-stats" component={UserStats} />
      <Route path="/user-suggestions" component={UserSuggestions} />
      <Route path="/user-timeline" component={UserTimeline} />
      <Route path="/v-o-d-archive" component={VODArchive} />
      <Route path="/validator-performance" component={ValidatorPerformance} />
      <Route path="/validator-setup" component={ValidatorSetup} />
      <Route path="/vendor-analytics" component={VendorAnalytics} />
      <Route path="/vendor-directory" component={VendorDirectory} />
      <Route path="/vendor-onboarding" component={VendorOnboarding} />
      <Route path="/vendor-performance" component={VendorPerformance} />
      <Route path="/vendor-verification" component={VendorVerification} />
      <Route path="/venue-management" component={VenueManagement} />
      <Route path="/verification" component={Verification} />
      <Route path="/verification-steps" component={VerificationSteps} />
      <Route path="/verification-system" component={VerificationSystem} />
      <Route path="/version-management" component={VersionManagement} />
      <Route path="/vesting-schedule" component={VestingSchedule} />
      <Route path="/video-area" component={VideoArea} />
      <Route path="/video-call" component={VideoCall} />
      <Route path="/video-chat" component={VideoChat} />
      <Route path="/video-editor" component={VideoEditor} />
      <Route path="/video-player" component={VideoPlayer} />
      <Route path="/video-tools" component={VideoTools} />
      <Route path="/video-tutorials" component={VideoTutorials} />
      <Route path="/video-upload" component={VideoUpload} />
      <Route path="/video-uploader" component={VideoUploader} />
      <Route path="/viewer-metrics" component={ViewerMetrics} />
      <Route path="/virtual-tour" component={VirtualTour} />
      <Route path="/voice-cloning" component={VoiceCloning} />
      <Route path="/voice-commands" component={VoiceCommands} />
      <Route path="/voice-commands-registry" component={VoiceCommandsRegistry} />
      <Route path="/voice-messages" component={VoiceMessages} />
      <Route path="/walkthrough-page" component={WalkthroughPage} />
      <Route path="/wallet" component={Wallet} />
      <Route path="/wallet-connect" component={WalletConnect} />
      <Route path="/wallet-integration" component={WalletIntegration} />
      <Route path="/wallet-overview" component={WalletOverview} />
      <Route path="/warning-dialog" component={WarningDialog} />
      <Route path="/watch-earn" component={WatchEarn} />
      <Route path="/watch-list" component={WatchList} />
      <Route path="/wealth-simulator" component={WealthSimulator} />
      <Route path="/web3-auth" component={Web3Auth} />
      <Route path="/webhook-management" component={WebhookManagement} />
      <Route path="/webhook-manager" component={WebhookManager} />
      <Route path="/webhooks" component={Webhooks} />
      <Route path="/welcome-screen" component={WelcomeScreen} />
      <Route path="/whale-monitor" component={WhaleMonitor} />
      <Route path="/whitelist-management" component={WhitelistManagement} />
      <Route path="/wishlist-management" component={WishlistManagement} />
      <Route path="/workflow-automation" component={WorkflowAutomation} />
      <Route path="/workflow-builder" component={WorkflowBuilder} />
      <Route path="/world-brain" component={WorldBrain} />
      <Route path="/world-simulation-control" component={WorldSimulationControl} />
      <Route path="/yield-farming" component={YieldFarming} />
      <Route path="/zapier-integration" component={ZapierIntegration} />
      <Route path="/zero-knowledge-proof" component={ZeroKnowledgeProof} />
      <Route component={NotFound} />
    </Switch>
  );
}
