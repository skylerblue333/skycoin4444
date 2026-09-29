import { lazy } from "react";
import { Route, Switch } from "wouter";
import NotFound from "@/pages/NotFound";

const MLInsights = lazy(() => import('@/pages/MLInsights'));
const MLModels = lazy(() => import('@/pages/MLModels'));
const MailingLists = lazy(() => import('@/pages/MailingLists'));
const MainDashboard = lazy(() => import('@/pages/MainDashboard'));
const MaintenanceMode = lazy(() => import('@/pages/MaintenanceMode'));
const MapView = lazy(() => import('@/pages/MapView'));
const MarginTrading = lazy(() => import('@/pages/MarginTrading'));
const MarkdownRendering = lazy(() => import('@/pages/MarkdownRendering'));
const MarketSentiment = lazy(() => import('@/pages/MarketSentiment'));
const MarketingROI = lazy(() => import('@/pages/MarketingROI'));
const Marketplace = lazy(() => import('@/pages/Marketplace'));
const MarketplaceAnalytics = lazy(() => import('@/pages/MarketplaceAnalytics'));
const MasterArchitecture = lazy(() => import('@/pages/MasterArchitecture'));
const MatchChat = lazy(() => import('@/pages/MatchChat'));
const MatchFeed = lazy(() => import('@/pages/MatchFeed'));
const MatchSpace = lazy(() => import('@/pages/MatchSpace'));
const MatchingAlgorithm = lazy(() => import('@/pages/MatchingAlgorithm'));
const Matchmaking = lazy(() => import('@/pages/Matchmaking'));
const MealPlans = lazy(() => import('@/pages/MealPlans'));
const MediaCarousel = lazy(() => import('@/pages/MediaCarousel'));
const MediaGallery = lazy(() => import('@/pages/MediaGallery'));
const MedicationReminder = lazy(() => import('@/pages/MedicationReminder'));
const MegaMarketplace = lazy(() => import('@/pages/MegaMarketplace'));
const MembershipTiers = lazy(() => import('@/pages/MembershipTiers'));
const MemoryConstellation = lazy(() => import('@/pages/MemoryConstellation'));
const MemoryGraphVisualizer = lazy(() => import('@/pages/MemoryGraphVisualizer'));
const MemorySystem = lazy(() => import('@/pages/MemorySystem'));
const Mentions = lazy(() => import('@/pages/Mentions'));
const MessageEncryption = lazy(() => import('@/pages/MessageEncryption'));
const MessageSearch = lazy(() => import('@/pages/MessageSearch'));
const Messages = lazy(() => import('@/pages/Messages'));
const MetaversePortal = lazy(() => import('@/pages/MetaversePortal'));
const MilestoneTracking = lazy(() => import('@/pages/MilestoneTracking'));
const MinerDashboard = lazy(() => import('@/pages/MinerDashboard'));
const MiningCalculator = lazy(() => import('@/pages/MiningCalculator'));
const MiningDashboard = lazy(() => import('@/pages/MiningDashboard'));
const MiningPoolSelector = lazy(() => import('@/pages/MiningPoolSelector'));
const MissionControl = lazy(() => import('@/pages/MissionControl'));
const Mobile = lazy(() => import('@/pages/Mobile'));
const MobileApp = lazy(() => import('@/pages/MobileApp'));
const MobileGaming = lazy(() => import('@/pages/MobileGaming'));
const MobileHome = lazy(() => import('@/pages/MobileHome'));
const MobileMenu = lazy(() => import('@/pages/MobileMenu'));
const MobileMessages = lazy(() => import('@/pages/MobileMessages'));
const MobileNotifications = lazy(() => import('@/pages/MobileNotifications'));
const MobileProfile = lazy(() => import('@/pages/MobileProfile'));
const MobileSearch = lazy(() => import('@/pages/MobileSearch'));
const MobileSettings = lazy(() => import('@/pages/MobileSettings'));
const MobileShop = lazy(() => import('@/pages/MobileShop'));
const MobileStreaming = lazy(() => import('@/pages/MobileStreaming'));
const MobileTrading = lazy(() => import('@/pages/MobileTrading'));
const MobileWallet = lazy(() => import('@/pages/MobileWallet'));
const ModerationDashboard = lazy(() => import('@/pages/ModerationDashboard'));
const Monetization = lazy(() => import('@/pages/Monetization'));
const MoodTracker = lazy(() => import('@/pages/MoodTracker'));
const MortgageCalculator = lazy(() => import('@/pages/MortgageCalculator'));
const MovieCatalog = lazy(() => import('@/pages/MovieCatalog'));
const MovieDetail = lazy(() => import('@/pages/MovieDetail'));
const MultiModelSelector = lazy(() => import('@/pages/MultiModelSelector'));
const MultiSelectForm = lazy(() => import('@/pages/MultiSelectForm'));
const MultiplayerLobby = lazy(() => import('@/pages/MultiplayerLobby'));
const MultivariateTesting = lazy(() => import('@/pages/MultivariateTesting'));
const MusicGeneration = lazy(() => import('@/pages/MusicGeneration'));
const MutualConnections = lazy(() => import('@/pages/MutualConnections'));
const MutualFriends = lazy(() => import('@/pages/MutualFriends'));
const MyLearning = lazy(() => import('@/pages/MyLearning'));
const MyTrips = lazy(() => import('@/pages/MyTrips'));
const NFTGallery = lazy(() => import('@/pages/NFTGallery'));
const NFTMinting = lazy(() => import('@/pages/NFTMinting'));
const NFTWallet = lazy(() => import('@/pages/NFTWallet'));
const NLPTools = lazy(() => import('@/pages/NLPTools'));
const NSFWFeed = lazy(() => import('@/pages/NSFWFeed'));
const NSFWPlatform = lazy(() => import('@/pages/NSFWPlatform'));
const NarrativeEngine = lazy(() => import('@/pages/NarrativeEngine'));
const NetWorthTracker = lazy(() => import('@/pages/NetWorthTracker'));
const NetworkGraph = lazy(() => import('@/pages/NetworkGraph'));
const NetworkHealth = lazy(() => import('@/pages/NetworkHealth'));
const NetworkStatistics = lazy(() => import('@/pages/NetworkStatistics'));
const NotesApp = lazy(() => import('@/pages/NotesApp'));
const NotificationCenter = lazy(() => import('@/pages/NotificationCenter'));
const NotificationHistory = lazy(() => import('@/pages/NotificationHistory'));
const NotificationIntelligence = lazy(() => import('@/pages/NotificationIntelligence'));
const NotificationPreferences = lazy(() => import('@/pages/NotificationPreferences'));
const NotificationSettings = lazy(() => import('@/pages/NotificationSettings'));
const Notifications = lazy(() => import('@/pages/Notifications'));
const NotificationsCenter = lazy(() => import('@/pages/NotificationsCenter'));
const NotificationsHub = lazy(() => import('@/pages/NotificationsHub'));
const NumberInputForm = lazy(() => import('@/pages/NumberInputForm'));
const NutritionTracker = lazy(() => import('@/pages/NutritionTracker'));
const OAuthProviders = lazy(() => import('@/pages/OAuthProviders'));
const OfferManagement = lazy(() => import('@/pages/OfferManagement'));
const Onboarding = lazy(() => import('@/pages/Onboarding'));
const OnboardingTutorial = lazy(() => import('@/pages/OnboardingTutorial'));
const OptionsTrading = lazy(() => import('@/pages/OptionsTrading'));
const OracleNetwork = lazy(() => import('@/pages/OracleNetwork'));
const OrderBook = lazy(() => import('@/pages/OrderBook'));
const OrderConfirmation = lazy(() => import('@/pages/OrderConfirmation'));
const OrderHistory = lazy(() => import('@/pages/OrderHistory'));
const OrderPlacement = lazy(() => import('@/pages/OrderPlacement'));
const OrderTracking = lazy(() => import('@/pages/OrderTracking'));
const OrderTypes = lazy(() => import('@/pages/OrderTypes'));
const OrganizationSettings = lazy(() => import('@/pages/OrganizationSettings'));
const P2EShop = lazy(() => import('@/pages/P2EShop'));
const Pagination = lazy(() => import('@/pages/Pagination'));
const PasswordInputForm = lazy(() => import('@/pages/PasswordInputForm'));
const PasswordReset = lazy(() => import('@/pages/PasswordReset'));
const PayPalIntegration = lazy(() => import('@/pages/PayPalIntegration'));
const PaymentConfirmation = lazy(() => import('@/pages/PaymentConfirmation'));
const PaymentInfra = lazy(() => import('@/pages/PaymentInfra'));
const PaymentMethods = lazy(() => import('@/pages/PaymentMethods'));
const PaymentSetup = lazy(() => import('@/pages/PaymentSetup'));
const Payments = lazy(() => import('@/pages/Payments'));
const PayoutDashboard = lazy(() => import('@/pages/PayoutDashboard'));
const PayoutManagement = lazy(() => import('@/pages/PayoutManagement'));
const PerformanceMetrics = lazy(() => import('@/pages/PerformanceMetrics'));
const PerformanceTuning = lazy(() => import('@/pages/PerformanceTuning'));
const PermissionManagement = lazy(() => import('@/pages/PermissionManagement'));
const PerpetualFutures = lazy(() => import('@/pages/PerpetualFutures'));
const PersonaBuilder = lazy(() => import('@/pages/PersonaBuilder'));
const Phase1Dashboard = lazy(() => import('@/pages/Phase1Dashboard'));
const Phase2to4Dashboard = lazy(() => import('@/pages/Phase2to4Dashboard'));
const PhoneVerification = lazy(() => import('@/pages/PhoneVerification'));
const PlatformMap = lazy(() => import('@/pages/PlatformMap'));
const PlatformStatus = lazy(() => import('@/pages/PlatformStatus'));
const PlaylistManagement = lazy(() => import('@/pages/PlaylistManagement'));
const PlaylistManager = lazy(() => import('@/pages/PlaylistManager'));
const PodcastStudio = lazy(() => import('@/pages/PodcastStudio'));
const PolicyManagement = lazy(() => import('@/pages/PolicyManagement'));
const PoolPerformance = lazy(() => import('@/pages/PoolPerformance'));
const Portfolio = lazy(() => import('@/pages/Portfolio'));
const PortfolioComparison = lazy(() => import('@/pages/PortfolioComparison'));
const PortfolioOptimization = lazy(() => import('@/pages/PortfolioOptimization'));
const PortfolioOverview = lazy(() => import('@/pages/PortfolioOverview'));
const PortfolioRebalance = lazy(() => import('@/pages/PortfolioRebalance'));
const PortfolioTracker = lazy(() => import('@/pages/PortfolioTracker'));
const PortfolioTracking = lazy(() => import('@/pages/PortfolioTracking'));
const PositionManagement = lazy(() => import('@/pages/PositionManagement'));
const PowerUserTools = lazy(() => import('@/pages/PowerUserTools'));
const PracticeSessions = lazy(() => import('@/pages/PracticeSessions'));
const PredictiveAnalytics = lazy(() => import('@/pages/PredictiveAnalytics'));
const PredictiveModels = lazy(() => import('@/pages/PredictiveModels'));
const PredictiveSystems = lazy(() => import('@/pages/PredictiveSystems'));
const PreferencesSetup = lazy(() => import('@/pages/PreferencesSetup'));
const PremiumFeatures = lazy(() => import('@/pages/PremiumFeatures'));
const PresentationWithChat = lazy(() => import('@/pages/PresentationWithChat'));
const PriceAlerts = lazy(() => import('@/pages/PriceAlerts'));
const Pricing = lazy(() => import('@/pages/Pricing'));
const PricingEngine = lazy(() => import('@/pages/PricingEngine'));
const PricingManagement = lazy(() => import('@/pages/PricingManagement'));
const PricingRules = lazy(() => import('@/pages/PricingRules'));
const PriorityMatrix = lazy(() => import('@/pages/PriorityMatrix'));
const PrivacyMixer = lazy(() => import('@/pages/PrivacyMixer'));
const PrivacyPolicy = lazy(() => import('@/pages/PrivacyPolicy'));
const PrivacySettings = lazy(() => import('@/pages/PrivacySettings'));
const PrivacyVault = lazy(() => import('@/pages/PrivacyVault'));
const ProductApproval = lazy(() => import('@/pages/ProductApproval'));
const ProductBrain = lazy(() => import('@/pages/ProductBrain'));
const ProductCatalog = lazy(() => import('@/pages/ProductCatalog'));
const ProductComparison = lazy(() => import('@/pages/ProductComparison'));
const ProductDetail = lazy(() => import('@/pages/ProductDetail'));
const ProductListing = lazy(() => import('@/pages/ProductListing'));
const ProductListings = lazy(() => import('@/pages/ProductListings'));
const ProductReviews = lazy(() => import('@/pages/ProductReviews'));
const ProductionArchitecture = lazy(() => import('@/pages/ProductionArchitecture'));
const Profile = lazy(() => import('@/pages/Profile'));
const ProfileCompletion = lazy(() => import('@/pages/ProfileCompletion'));
const ProfileCreation = lazy(() => import('@/pages/ProfileCreation'));
const ProfileCustomization = lazy(() => import('@/pages/ProfileCustomization'));
const ProfileDashboard = lazy(() => import('@/pages/ProfileDashboard'));
const ProfileEdit = lazy(() => import('@/pages/ProfileEdit'));
const ProfilePicture = lazy(() => import('@/pages/ProfilePicture'));
const ProfilePreview = lazy(() => import('@/pages/ProfilePreview'));
const ProfileView = lazy(() => import('@/pages/ProfileView'));
const ProfileWallet = lazy(() => import('@/pages/ProfileWallet'));
const Profitability = lazy(() => import('@/pages/Profitability'));
const ProgressBar = lazy(() => import('@/pages/ProgressBar'));
const ProgressTracking = lazy(() => import('@/pages/ProgressTracking'));
const ProjectBoard = lazy(() => import('@/pages/ProjectBoard'));
const ProjectListing = lazy(() => import('@/pages/ProjectListing'));
const PromotionEngine = lazy(() => import('@/pages/PromotionEngine'));
const PromptBuilder = lazy(() => import('@/pages/PromptBuilder'));
const ProofVault = lazy(() => import('@/pages/ProofVault'));
const PropertyComparison = lazy(() => import('@/pages/PropertyComparison'));
const PropertyDetail = lazy(() => import('@/pages/PropertyDetail'));
const PropertyListing = lazy(() => import('@/pages/PropertyListing'));
const PropertyTransfer = lazy(() => import('@/pages/PropertyTransfer'));
const ProtocolLayer = lazy(() => import('@/pages/ProtocolLayer'));
const PublishingQueue = lazy(() => import('@/pages/PublishingQueue'));
const PublishingSchedule = lazy(() => import('@/pages/PublishingSchedule'));
const PushNotifications = lazy(() => import('@/pages/PushNotifications'));
const QRCodeGenerator = lazy(() => import('@/pages/QRCodeGenerator'));
const QuantumComputing = lazy(() => import('@/pages/QuantumComputing'));
const QuantumSafe = lazy(() => import('@/pages/QuantumSafe'));
const QuickActions = lazy(() => import('@/pages/QuickActions'));
const QuickStats = lazy(() => import('@/pages/QuickStats'));
const QuizBuilder = lazy(() => import('@/pages/QuizBuilder'));
const RFMAnalysis = lazy(() => import('@/pages/RFMAnalysis'));
const RFQSystem = lazy(() => import('@/pages/RFQSystem'));
const RadioButtonForm = lazy(() => import('@/pages/RadioButtonForm'));
const RateLimitConfig = lazy(() => import('@/pages/RateLimitConfig'));
const RateLimitDashboard = lazy(() => import('@/pages/RateLimitDashboard'));
const RateLimitError = lazy(() => import('@/pages/RateLimitError'));
const RateLimiting = lazy(() => import('@/pages/RateLimiting'));
const RatingSystem = lazy(() => import('@/pages/RatingSystem'));
const ReadReceipts = lazy(() => import('@/pages/ReadReceipts'));
const RealTimeGameEngine = lazy(() => import('@/pages/RealTimeGameEngine'));
const RealTimeMonitoring = lazy(() => import('@/pages/RealTimeMonitoring'));
const RealTimeStreaming = lazy(() => import('@/pages/RealTimeStreaming'));
const RebalancingTools = lazy(() => import('@/pages/RebalancingTools'));
const ReceiptDownload = lazy(() => import('@/pages/ReceiptDownload'));
const ReceiveCrypto = lazy(() => import('@/pages/ReceiveCrypto'));
const RecentActivity = lazy(() => import('@/pages/RecentActivity'));
const Recommendations = lazy(() => import('@/pages/Recommendations'));
const RecommendationsFeed = lazy(() => import('@/pages/RecommendationsFeed'));
const RecommendedMatches = lazy(() => import('@/pages/RecommendedMatches'));
const Reels = lazy(() => import('@/pages/Reels'));
const RefactoringTools = lazy(() => import('@/pages/RefactoringTools'));
const Referrals = lazy(() => import('@/pages/Referrals'));
const RefundRequests = lazy(() => import('@/pages/RefundRequests'));
const RegionalSettings = lazy(() => import('@/pages/RegionalSettings'));
const Reminders = lazy(() => import('@/pages/Reminders'));
const ReportDialog = lazy(() => import('@/pages/ReportDialog'));
const ReportUser = lazy(() => import('@/pages/ReportUser'));
const ReportsDashboard = lazy(() => import('@/pages/ReportsDashboard'));
const Reputation = lazy(() => import('@/pages/Reputation'));
const ReputationSystem = lazy(() => import('@/pages/ReputationSystem'));
const ResourceAllocation = lazy(() => import('@/pages/ResourceAllocation'));
const ResourceLibrary = lazy(() => import('@/pages/ResourceLibrary'));
const ResponseTime = lazy(() => import('@/pages/ResponseTime'));
const Retention = lazy(() => import('@/pages/Retention'));
const RetentionAnalytics = lazy(() => import('@/pages/RetentionAnalytics'));
const RetentionEngine = lazy(() => import('@/pages/RetentionEngine'));
const RetirementPlanner = lazy(() => import('@/pages/RetirementPlanner'));
const ReturnManagement = lazy(() => import('@/pages/ReturnManagement'));
const ReturnsRefunds = lazy(() => import('@/pages/ReturnsRefunds'));
const RevenueTracking = lazy(() => import('@/pages/RevenueTracking'));
const ReviewModeration = lazy(() => import('@/pages/ReviewModeration'));
const Reviews = lazy(() => import('@/pages/Reviews'));
const ReviewsRatings = lazy(() => import('@/pages/ReviewsRatings'));
const RewardSystem = lazy(() => import('@/pages/RewardSystem'));
const RewardsMonitoring = lazy(() => import('@/pages/RewardsMonitoring'));
const RewardsTracking = lazy(() => import('@/pages/RewardsTracking'));
const RiskAnalysis = lazy(() => import('@/pages/RiskAnalysis'));
const RiskManagement = lazy(() => import('@/pages/RiskManagement'));
const Roadmap = lazy(() => import('@/pages/Roadmap'));
const RoadmapView = lazy(() => import('@/pages/RoadmapView'));
const RoleBasedAccess = lazy(() => import('@/pages/RoleBasedAccess'));
const RoleManagement = lazy(() => import('@/pages/RoleManagement'));

export default function LegacyRoutesMR() {
  return (
    <Switch>
      <Route path="/m-l-insights" component={MLInsights} />
      <Route path="/m-l-models" component={MLModels} />
      <Route path="/mailing-lists" component={MailingLists} />
      <Route path="/main-dashboard" component={MainDashboard} />
      <Route path="/maintenance-mode" component={MaintenanceMode} />
      <Route path="/map-view" component={MapView} />
      <Route path="/margin-trading" component={MarginTrading} />
      <Route path="/markdown-rendering" component={MarkdownRendering} />
      <Route path="/market-sentiment" component={MarketSentiment} />
      <Route path="/marketing-r-o-i" component={MarketingROI} />
      <Route path="/marketplace" component={Marketplace} />
      <Route path="/marketplace-analytics" component={MarketplaceAnalytics} />
      <Route path="/master-architecture" component={MasterArchitecture} />
      <Route path="/match-chat" component={MatchChat} />
      <Route path="/match-feed" component={MatchFeed} />
      <Route path="/match-space" component={MatchSpace} />
      <Route path="/matching-algorithm" component={MatchingAlgorithm} />
      <Route path="/matchmaking" component={Matchmaking} />
      <Route path="/meal-plans" component={MealPlans} />
      <Route path="/media-carousel" component={MediaCarousel} />
      <Route path="/media-gallery" component={MediaGallery} />
      <Route path="/medication-reminder" component={MedicationReminder} />
      <Route path="/mega-marketplace" component={MegaMarketplace} />
      <Route path="/membership-tiers" component={MembershipTiers} />
      <Route path="/memory-constellation" component={MemoryConstellation} />
      <Route path="/memory-graph-visualizer" component={MemoryGraphVisualizer} />
      <Route path="/memory-system" component={MemorySystem} />
      <Route path="/mentions" component={Mentions} />
      <Route path="/message-encryption" component={MessageEncryption} />
      <Route path="/message-search" component={MessageSearch} />
      <Route path="/messages" component={Messages} />
      <Route path="/metaverse-portal" component={MetaversePortal} />
      <Route path="/milestone-tracking" component={MilestoneTracking} />
      <Route path="/miner-dashboard" component={MinerDashboard} />
      <Route path="/mining-calculator" component={MiningCalculator} />
      <Route path="/mining-dashboard" component={MiningDashboard} />
      <Route path="/mining-pool-selector" component={MiningPoolSelector} />
      <Route path="/mission-control" component={MissionControl} />
      <Route path="/mobile" component={Mobile} />
      <Route path="/mobile-app" component={MobileApp} />
      <Route path="/mobile-gaming" component={MobileGaming} />
      <Route path="/mobile-home" component={MobileHome} />
      <Route path="/mobile-menu" component={MobileMenu} />
      <Route path="/mobile-messages" component={MobileMessages} />
      <Route path="/mobile-notifications" component={MobileNotifications} />
      <Route path="/mobile-profile" component={MobileProfile} />
      <Route path="/mobile-search" component={MobileSearch} />
      <Route path="/mobile-settings" component={MobileSettings} />
      <Route path="/mobile-shop" component={MobileShop} />
      <Route path="/mobile-streaming" component={MobileStreaming} />
      <Route path="/mobile-trading" component={MobileTrading} />
      <Route path="/mobile-wallet" component={MobileWallet} />
      <Route path="/moderation-dashboard" component={ModerationDashboard} />
      <Route path="/monetization" component={Monetization} />
      <Route path="/mood-tracker" component={MoodTracker} />
      <Route path="/mortgage-calculator" component={MortgageCalculator} />
      <Route path="/movie-catalog" component={MovieCatalog} />
      <Route path="/movie-detail" component={MovieDetail} />
      <Route path="/multi-model-selector" component={MultiModelSelector} />
      <Route path="/multi-select-form" component={MultiSelectForm} />
      <Route path="/multiplayer-lobby" component={MultiplayerLobby} />
      <Route path="/multivariate-testing" component={MultivariateTesting} />
      <Route path="/music-generation" component={MusicGeneration} />
      <Route path="/mutual-connections" component={MutualConnections} />
      <Route path="/mutual-friends" component={MutualFriends} />
      <Route path="/my-learning" component={MyLearning} />
      <Route path="/my-trips" component={MyTrips} />
      <Route path="/n-f-t-gallery" component={NFTGallery} />
      <Route path="/n-f-t-minting" component={NFTMinting} />
      <Route path="/n-f-t-wallet" component={NFTWallet} />
      <Route path="/n-l-p-tools" component={NLPTools} />
      <Route path="/n-s-f-w-feed" component={NSFWFeed} />
      <Route path="/n-s-f-w-platform" component={NSFWPlatform} />
      <Route path="/narrative-engine" component={NarrativeEngine} />
      <Route path="/net-worth-tracker" component={NetWorthTracker} />
      <Route path="/network-graph" component={NetworkGraph} />
      <Route path="/network-health" component={NetworkHealth} />
      <Route path="/network-statistics" component={NetworkStatistics} />
      <Route path="/notes-app" component={NotesApp} />
      <Route path="/notification-center" component={NotificationCenter} />
      <Route path="/notification-history" component={NotificationHistory} />
      <Route path="/notification-intelligence" component={NotificationIntelligence} />
      <Route path="/notification-preferences" component={NotificationPreferences} />
      <Route path="/notification-settings" component={NotificationSettings} />
      <Route path="/notifications" component={Notifications} />
      <Route path="/notifications-center" component={NotificationsCenter} />
      <Route path="/notifications-hub" component={NotificationsHub} />
      <Route path="/number-input-form" component={NumberInputForm} />
      <Route path="/nutrition-tracker" component={NutritionTracker} />
      <Route path="/o-auth-providers" component={OAuthProviders} />
      <Route path="/offer-management" component={OfferManagement} />
      <Route path="/onboarding" component={Onboarding} />
      <Route path="/onboarding-tutorial" component={OnboardingTutorial} />
      <Route path="/options-trading" component={OptionsTrading} />
      <Route path="/oracle-network" component={OracleNetwork} />
      <Route path="/order-book" component={OrderBook} />
      <Route path="/order-confirmation" component={OrderConfirmation} />
      <Route path="/order-history" component={OrderHistory} />
      <Route path="/order-placement" component={OrderPlacement} />
      <Route path="/order-tracking" component={OrderTracking} />
      <Route path="/order-types" component={OrderTypes} />
      <Route path="/organization-settings" component={OrganizationSettings} />
      <Route path="/p2-e-shop" component={P2EShop} />
      <Route path="/pagination" component={Pagination} />
      <Route path="/password-input-form" component={PasswordInputForm} />
      <Route path="/password-reset" component={PasswordReset} />
      <Route path="/pay-pal-integration" component={PayPalIntegration} />
      <Route path="/payment-confirmation" component={PaymentConfirmation} />
      <Route path="/payment-infra" component={PaymentInfra} />
      <Route path="/payment-methods" component={PaymentMethods} />
      <Route path="/payment-setup" component={PaymentSetup} />
      <Route path="/payments" component={Payments} />
      <Route path="/payout-dashboard" component={PayoutDashboard} />
      <Route path="/payout-management" component={PayoutManagement} />
      <Route path="/performance-metrics" component={PerformanceMetrics} />
      <Route path="/performance-tuning" component={PerformanceTuning} />
      <Route path="/permission-management" component={PermissionManagement} />
      <Route path="/perpetual-futures" component={PerpetualFutures} />
      <Route path="/persona-builder" component={PersonaBuilder} />
      <Route path="/phase1-dashboard" component={Phase1Dashboard} />
      <Route path="/phase2to4-dashboard" component={Phase2to4Dashboard} />
      <Route path="/phone-verification" component={PhoneVerification} />
      <Route path="/platform-map" component={PlatformMap} />
      <Route path="/platform-status" component={PlatformStatus} />
      <Route path="/playlist-management" component={PlaylistManagement} />
      <Route path="/playlist-manager" component={PlaylistManager} />
      <Route path="/podcast-studio" component={PodcastStudio} />
      <Route path="/policy-management" component={PolicyManagement} />
      <Route path="/pool-performance" component={PoolPerformance} />
      <Route path="/portfolio" component={Portfolio} />
      <Route path="/portfolio-comparison" component={PortfolioComparison} />
      <Route path="/portfolio-optimization" component={PortfolioOptimization} />
      <Route path="/portfolio-overview" component={PortfolioOverview} />
      <Route path="/portfolio-rebalance" component={PortfolioRebalance} />
      <Route path="/portfolio-tracker" component={PortfolioTracker} />
      <Route path="/portfolio-tracking" component={PortfolioTracking} />
      <Route path="/position-management" component={PositionManagement} />
      <Route path="/power-user-tools" component={PowerUserTools} />
      <Route path="/practice-sessions" component={PracticeSessions} />
      <Route path="/predictive-analytics" component={PredictiveAnalytics} />
      <Route path="/predictive-models" component={PredictiveModels} />
      <Route path="/predictive-systems" component={PredictiveSystems} />
      <Route path="/preferences-setup" component={PreferencesSetup} />
      <Route path="/premium-features" component={PremiumFeatures} />
      <Route path="/presentation-with-chat" component={PresentationWithChat} />
      <Route path="/price-alerts" component={PriceAlerts} />
      <Route path="/pricing" component={Pricing} />
      <Route path="/pricing-engine" component={PricingEngine} />
      <Route path="/pricing-management" component={PricingManagement} />
      <Route path="/pricing-rules" component={PricingRules} />
      <Route path="/priority-matrix" component={PriorityMatrix} />
      <Route path="/privacy-mixer" component={PrivacyMixer} />
      <Route path="/privacy-policy" component={PrivacyPolicy} />
      <Route path="/privacy-settings" component={PrivacySettings} />
      <Route path="/privacy-vault" component={PrivacyVault} />
      <Route path="/product-approval" component={ProductApproval} />
      <Route path="/product-brain" component={ProductBrain} />
      <Route path="/product-catalog" component={ProductCatalog} />
      <Route path="/product-comparison" component={ProductComparison} />
      <Route path="/product-detail" component={ProductDetail} />
      <Route path="/product-listing" component={ProductListing} />
      <Route path="/product-listings" component={ProductListings} />
      <Route path="/product-reviews" component={ProductReviews} />
      <Route path="/production-architecture" component={ProductionArchitecture} />
      <Route path="/profile" component={Profile} />
      <Route path="/profile-completion" component={ProfileCompletion} />
      <Route path="/profile-creation" component={ProfileCreation} />
      <Route path="/profile-customization" component={ProfileCustomization} />
      <Route path="/profile-dashboard" component={ProfileDashboard} />
      <Route path="/profile-edit" component={ProfileEdit} />
      <Route path="/profile-picture" component={ProfilePicture} />
      <Route path="/profile-preview" component={ProfilePreview} />
      <Route path="/profile-view" component={ProfileView} />
      <Route path="/profile-wallet" component={ProfileWallet} />
      <Route path="/profitability" component={Profitability} />
      <Route path="/progress-bar" component={ProgressBar} />
      <Route path="/progress-tracking" component={ProgressTracking} />
      <Route path="/project-board" component={ProjectBoard} />
      <Route path="/project-listing" component={ProjectListing} />
      <Route path="/promotion-engine" component={PromotionEngine} />
      <Route path="/prompt-builder" component={PromptBuilder} />
      <Route path="/proof-vault" component={ProofVault} />
      <Route path="/property-comparison" component={PropertyComparison} />
      <Route path="/property-detail" component={PropertyDetail} />
      <Route path="/property-listing" component={PropertyListing} />
      <Route path="/property-transfer" component={PropertyTransfer} />
      <Route path="/protocol-layer" component={ProtocolLayer} />
      <Route path="/publishing-queue" component={PublishingQueue} />
      <Route path="/publishing-schedule" component={PublishingSchedule} />
      <Route path="/push-notifications" component={PushNotifications} />
      <Route path="/q-r-code-generator" component={QRCodeGenerator} />
      <Route path="/quantum-computing" component={QuantumComputing} />
      <Route path="/quantum-safe" component={QuantumSafe} />
      <Route path="/quick-actions" component={QuickActions} />
      <Route path="/quick-stats" component={QuickStats} />
      <Route path="/quiz-builder" component={QuizBuilder} />
      <Route path="/r-f-m-analysis" component={RFMAnalysis} />
      <Route path="/r-f-q-system" component={RFQSystem} />
      <Route path="/radio-button-form" component={RadioButtonForm} />
      <Route path="/rate-limit-config" component={RateLimitConfig} />
      <Route path="/rate-limit-dashboard" component={RateLimitDashboard} />
      <Route path="/rate-limit-error" component={RateLimitError} />
      <Route path="/rate-limiting" component={RateLimiting} />
      <Route path="/rating-system" component={RatingSystem} />
      <Route path="/read-receipts" component={ReadReceipts} />
      <Route path="/real-time-game-engine" component={RealTimeGameEngine} />
      <Route path="/real-time-monitoring" component={RealTimeMonitoring} />
      <Route path="/real-time-streaming" component={RealTimeStreaming} />
      <Route path="/rebalancing-tools" component={RebalancingTools} />
      <Route path="/receipt-download" component={ReceiptDownload} />
      <Route path="/receive-crypto" component={ReceiveCrypto} />
      <Route path="/recent-activity" component={RecentActivity} />
      <Route path="/recommendations" component={Recommendations} />
      <Route path="/recommendations-feed" component={RecommendationsFeed} />
      <Route path="/recommended-matches" component={RecommendedMatches} />
      <Route path="/reels" component={Reels} />
      <Route path="/refactoring-tools" component={RefactoringTools} />
      <Route path="/referrals" component={Referrals} />
      <Route path="/refund-requests" component={RefundRequests} />
      <Route path="/regional-settings" component={RegionalSettings} />
      <Route path="/reminders" component={Reminders} />
      <Route path="/report-dialog" component={ReportDialog} />
      <Route path="/report-user" component={ReportUser} />
      <Route path="/reports-dashboard" component={ReportsDashboard} />
      <Route path="/reputation" component={Reputation} />
      <Route path="/reputation-system" component={ReputationSystem} />
      <Route path="/resource-allocation" component={ResourceAllocation} />
      <Route path="/resource-library" component={ResourceLibrary} />
      <Route path="/response-time" component={ResponseTime} />
      <Route path="/retention" component={Retention} />
      <Route path="/retention-analytics" component={RetentionAnalytics} />
      <Route path="/retention-engine" component={RetentionEngine} />
      <Route path="/retirement-planner" component={RetirementPlanner} />
      <Route path="/return-management" component={ReturnManagement} />
      <Route path="/returns-refunds" component={ReturnsRefunds} />
      <Route path="/revenue-tracking" component={RevenueTracking} />
      <Route path="/review-moderation" component={ReviewModeration} />
      <Route path="/reviews" component={Reviews} />
      <Route path="/reviews-ratings" component={ReviewsRatings} />
      <Route path="/reward-system" component={RewardSystem} />
      <Route path="/rewards-monitoring" component={RewardsMonitoring} />
      <Route path="/rewards-tracking" component={RewardsTracking} />
      <Route path="/risk-analysis" component={RiskAnalysis} />
      <Route path="/risk-management" component={RiskManagement} />
      <Route path="/roadmap" component={Roadmap} />
      <Route path="/roadmap-view" component={RoadmapView} />
      <Route path="/role-based-access" component={RoleBasedAccess} />
      <Route path="/role-management" component={RoleManagement} />
      <Route component={NotFound} />
    </Switch>
  );
}
