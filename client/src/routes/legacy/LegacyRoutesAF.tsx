import { lazy } from "react";
import { Route, Switch } from "wouter";
import NotFound from "@/pages/NotFound";

const ABTesting = lazy(() => import('@/pages/ABTesting'));
const ABTestingAdvanced = lazy(() => import('@/pages/ABTestingAdvanced'));
const AIAgentEconomy = lazy(() => import('@/pages/AIAgentEconomy'));
const AIAgentMarket = lazy(() => import('@/pages/AIAgentMarket'));
const AIAssistant = lazy(() => import('@/pages/AIAssistant'));
const AIBrain = lazy(() => import('@/pages/AIBrain'));
const AICodeStudio = lazy(() => import('@/pages/AICodeStudio'));
const AICopyStudio = lazy(() => import('@/pages/AICopyStudio'));
const AICore = lazy(() => import('@/pages/AICore'));
const AIEngineer = lazy(() => import('@/pages/AIEngineer'));
const AIGovernance = lazy(() => import('@/pages/AIGovernance'));
const AIMarketAgents = lazy(() => import('@/pages/AIMarketAgents'));
const AIMatchmaker = lazy(() => import('@/pages/AIMatchmaker'));
const AIModerationQueue = lazy(() => import('@/pages/AIModerationQueue'));
const AIPersonaFeed = lazy(() => import('@/pages/AIPersonaFeed'));
const AIPersonaSystem = lazy(() => import('@/pages/AIPersonaSystem'));
const AIToolsHub = lazy(() => import('@/pages/AIToolsHub'));
const AITrading = lazy(() => import('@/pages/AITrading'));
const AITrainingLoops = lazy(() => import('@/pages/AITrainingLoops'));
const APIDocs = lazy(() => import('@/pages/APIDocs'));
const APIDocumentation = lazy(() => import('@/pages/APIDocumentation'));
const APIIntegration = lazy(() => import('@/pages/APIIntegration'));
const APIKeys = lazy(() => import('@/pages/APIKeys'));
const APILogs = lazy(() => import('@/pages/APILogs'));
const APIManagement = lazy(() => import('@/pages/APIManagement'));
const APIMonitoring = lazy(() => import('@/pages/APIMonitoring'));
const APIStatus = lazy(() => import('@/pages/APIStatus'));
const APITesting = lazy(() => import('@/pages/APITesting'));
const APIUsage = lazy(() => import('@/pages/APIUsage'));
const APIVersioning = lazy(() => import('@/pages/APIVersioning'));
const APYTracking = lazy(() => import('@/pages/APYTracking'));
const About = lazy(() => import('@/pages/About'));
const AccessControl = lazy(() => import('@/pages/AccessControl'));
const AccessibilitySettings = lazy(() => import('@/pages/AccessibilitySettings'));
const AccordionNavigation = lazy(() => import('@/pages/AccordionNavigation'));
const AccountSettings = lazy(() => import('@/pages/AccountSettings'));
const AchievementBadges = lazy(() => import('@/pages/AchievementBadges'));
const Achievements = lazy(() => import('@/pages/Achievements'));
const ActionObjects = lazy(() => import('@/pages/ActionObjects'));
const ActionPanel = lazy(() => import('@/pages/ActionPanel'));
const ActivityFeed = lazy(() => import('@/pages/ActivityFeed'));
const ActivityEvidence = lazy(() => import('@/pages/ActivityEvidence'));
const ActivityTracking = lazy(() => import('@/pages/ActivityTracking'));
const AdaptivePersonalization = lazy(() => import('@/pages/AdaptivePersonalization'));
const AdaptiveRoadmap = lazy(() => import('@/pages/AdaptiveRoadmap'));
const AddBankAccount = lazy(() => import('@/pages/AddBankAccount'));
const AddCreditCard = lazy(() => import('@/pages/AddCreditCard'));
const AddressBook = lazy(() => import('@/pages/AddressBook'));
const AddressLookup = lazy(() => import('@/pages/AddressLookup'));
const Admin = lazy(() => import('@/pages/Admin'));
const AdminDashboard = lazy(() => import('@/pages/AdminDashboard'));
const AdminOrders = lazy(() => import('@/pages/AdminOrders'));
const AdminPanel = lazy(() => import('@/pages/AdminPanel'));
const AdminWalletManager = lazy(() => import('@/pages/AdminWalletManager'));
const AdvancedAdminPanel = lazy(() => import('@/pages/AdvancedAdminPanel'));
const AdvancedAnalytics = lazy(() => import('@/pages/AdvancedAnalytics'));
const AdvancedOrders = lazy(() => import('@/pages/AdvancedOrders'));
const AdvancedSearch = lazy(() => import('@/pages/AdvancedSearch'));
const AffiliateDashboard = lazy(() => import('@/pages/AffiliateDashboard'));
const AffiliateProgram = lazy(() => import('@/pages/AffiliateProgram'));
const AgeGate = lazy(() => import('@/pages/AgeGate'));
const AgeVerification = lazy(() => import('@/pages/AgeVerification'));
const AgentBuilder = lazy(() => import('@/pages/AgentBuilder'));
const AgentCity = lazy(() => import('@/pages/AgentCity'));
const AgentCoordination = lazy(() => import('@/pages/AgentCoordination'));
const AgentCoordinationHub = lazy(() => import('@/pages/AgentCoordinationHub'));
const AgentDebate = lazy(() => import('@/pages/AgentDebate'));
const AgentDetail = lazy(() => import('@/pages/AgentDetail'));
const AgentMarketplace = lazy(() => import('@/pages/AgentMarketplace'));
const AgentPerformance = lazy(() => import('@/pages/AgentPerformance'));
const AgentSprint = lazy(() => import('@/pages/AgentSprint'));
const AgentsDashboard = lazy(() => import('@/pages/AgentsDashboard'));
const AlertConfiguration = lazy(() => import('@/pages/AlertConfiguration'));
const AlertDialog = lazy(() => import('@/pages/AlertDialog'));
const AlertManagement = lazy(() => import('@/pages/AlertManagement'));
const AmbientFeed = lazy(() => import('@/pages/AmbientFeed'));
const Analytics = lazy(() => import('@/pages/Analytics'));
const AnalyticsDashboard = lazy(() => import('@/pages/AnalyticsDashboard'));
const AnalyticsProducts = lazy(() => import('@/pages/AnalyticsProducts'));
const AnalyticsReports = lazy(() => import('@/pages/AnalyticsReports'));
const AnomalyDetection = lazy(() => import('@/pages/AnomalyDetection'));
const AntiSurveillance = lazy(() => import('@/pages/AntiSurveillance'));
const ApprovalWorkflows = lazy(() => import('@/pages/ApprovalWorkflows'));
const ArbitrageBot = lazy(() => import('@/pages/ArbitrageBot'));
const Arcade = lazy(() => import('@/pages/Arcade'));
const ArchiveManagement = lazy(() => import('@/pages/ArchiveManagement'));
const AssetAllocation = lazy(() => import('@/pages/AssetAllocation'));
const AssetManagement = lazy(() => import('@/pages/AssetManagement'));
const AssetTracking = lazy(() => import('@/pages/AssetTracking'));
const AssignmentTracker = lazy(() => import('@/pages/AssignmentTracker'));
const AttributionModeling = lazy(() => import('@/pages/AttributionModeling'));
const AudienceSegmentation = lazy(() => import('@/pages/AudienceSegmentation'));
const AudioAnalytics = lazy(() => import('@/pages/AudioAnalytics'));
const AudioEditing = lazy(() => import('@/pages/AudioEditing'));
const AudioLibrary = lazy(() => import('@/pages/AudioLibrary'));
const AudioPlayer = lazy(() => import('@/pages/AudioPlayer'));
const AuditLog = lazy(() => import('@/pages/AuditLog'));
const AuditLogs = lazy(() => import('@/pages/AuditLogs'));
const AuditTrail = lazy(() => import('@/pages/AuditTrail'));
const AutoResponder = lazy(() => import('@/pages/AutoResponder'));
const AutomationEngine = lazy(() => import('@/pages/AutomationEngine'));
const AutomationRules = lazy(() => import('@/pages/AutomationRules'));
const AutomationWorkflows = lazy(() => import('@/pages/AutomationWorkflows'));
const BackupManagement = lazy(() => import('@/pages/BackupManagement'));
const Badges = lazy(() => import('@/pages/Badges'));
const BanSuspendUser = lazy(() => import('@/pages/BanSuspendUser'));
const BatchGeneration = lazy(() => import('@/pages/BatchGeneration'));
const BattlePass = lazy(() => import('@/pages/BattlePass'));
const BehavioralIntelligence = lazy(() => import('@/pages/BehavioralIntelligence'));
const Beta = lazy(() => import('@/pages/Beta'));
const BillingHistory = lazy(() => import('@/pages/BillingHistory'));
const BlockBrowser = lazy(() => import('@/pages/BlockBrowser'));
const BlockRewards = lazy(() => import('@/pages/BlockRewards'));
const BlockUser = lazy(() => import('@/pages/BlockUser'));
const BlockchainCustody = lazy(() => import('@/pages/BlockchainCustody'));
const BlockchainMonitor = lazy(() => import('@/pages/BlockchainMonitor'));
const BlockedUsers = lazy(() => import('@/pages/BlockedUsers'));
const BlogEditor = lazy(() => import('@/pages/BlogEditor'));
const BlogPublisher = lazy(() => import('@/pages/BlogPublisher'));
const BookPage = lazy(() => import('@/pages/BookPage'));
const Bookmarks = lazy(() => import('@/pages/Bookmarks'));
const BountySystem = lazy(() => import('@/pages/BountySystem'));
const BrandGuidelines = lazy(() => import('@/pages/BrandGuidelines'));
const BreadcrumbNavigation = lazy(() => import('@/pages/BreadcrumbNavigation'));
const BridgeProtocol = lazy(() => import('@/pages/BridgeProtocol'));
const BridgeTransactions = lazy(() => import('@/pages/BridgeTransactions'));
const BrowserExtension = lazy(() => import('@/pages/BrowserExtension'));
const BudgetPlanner = lazy(() => import('@/pages/BudgetPlanner'));
const BugReporting = lazy(() => import('@/pages/BugReporting'));
const BuildOrder = lazy(() => import('@/pages/BuildOrder'));
const BuildRoadmap = lazy(() => import('@/pages/BuildRoadmap'));
const BulkOperations = lazy(() => import('@/pages/BulkOperations'));
const BulkOrdering = lazy(() => import('@/pages/BulkOrdering'));
const BulkUpload = lazy(() => import('@/pages/BulkUpload'));
const CCPA = lazy(() => import('@/pages/CCPA'));
const CDNManagement = lazy(() => import('@/pages/CDNManagement'));
const CRM = lazy(() => import('@/pages/CRM'));
const CacheManagement = lazy(() => import('@/pages/CacheManagement'));
const Calculator = lazy(() => import('@/pages/Calculator'));
const Calendar = lazy(() => import('@/pages/Calendar'));
const CalendarView = lazy(() => import('@/pages/CalendarView'));
const CampaignAnalytics = lazy(() => import('@/pages/CampaignAnalytics'));
const CampaignBuilder = lazy(() => import('@/pages/CampaignBuilder'));
const CampaignCreation = lazy(() => import('@/pages/CampaignCreation'));
const CarRental = lazy(() => import('@/pages/CarRental'));
const CardGridView = lazy(() => import('@/pages/CardGridView'));
const CashFlowAnalysis = lazy(() => import('@/pages/CashFlowAnalysis'));
const CategoryManagement = lazy(() => import('@/pages/CategoryManagement'));
const CertificateManager = lazy(() => import('@/pages/CertificateManager'));
const ChainExplorer = lazy(() => import('@/pages/ChainExplorer'));
const ChangeLog = lazy(() => import('@/pages/ChangeLog'));
const ChannelCustomization = lazy(() => import('@/pages/ChannelCustomization'));
const Charity = lazy(() => import('@/pages/Charity'));
const CharityLeaderboard = lazy(() => import('@/pages/CharityLeaderboard'));
const ChartAnalysis = lazy(() => import('@/pages/ChartAnalysis'));
const ChartDashboard = lazy(() => import('@/pages/ChartDashboard'));
const ChatBot = lazy(() => import('@/pages/ChatBot'));
const ChatHistory = lazy(() => import('@/pages/ChatHistory'));
const ChatMVP = lazy(() => import('@/pages/ChatMVP'));
const CheckboxGroupForm = lazy(() => import('@/pages/CheckboxGroupForm'));
const Checkout = lazy(() => import('@/pages/Checkout'));
const CheckoutFlow = lazy(() => import('@/pages/CheckoutFlow'));
const ChinaEdition = lazy(() => import('@/pages/ChinaEdition'));
const ChurnPrediction = lazy(() => import('@/pages/ChurnPrediction'));
const CitizenPassport = lazy(() => import('@/pages/CitizenPassport'));
const CivilizationSimulator = lazy(() => import('@/pages/CivilizationSimulator'));
const ClanWars = lazy(() => import('@/pages/ClanWars'));
const ClassroomManagement = lazy(() => import('@/pages/ClassroomManagement'));
const ClientLibraries = lazy(() => import('@/pages/ClientLibraries'));
const ClosingChecklist = lazy(() => import('@/pages/ClosingChecklist'));
const CodeCompletion = lazy(() => import('@/pages/CodeCompletion'));
const CodeFormatter = lazy(() => import('@/pages/CodeFormatter'));
const CodeHighlighting = lazy(() => import('@/pages/CodeHighlighting'));
const CodeQuality = lazy(() => import('@/pages/CodeQuality'));
const CodeQualityDashboard = lazy(() => import('@/pages/CodeQualityDashboard'));
const CodeRepository = lazy(() => import('@/pages/CodeRepository'));
const CodeSamples = lazy(() => import('@/pages/CodeSamples'));
const CohortAnalysis = lazy(() => import('@/pages/CohortAnalysis'));
const ColorPickerDialog = lazy(() => import('@/pages/ColorPickerDialog'));
const CommentThread = lazy(() => import('@/pages/CommentThread'));
const Comments = lazy(() => import('@/pages/Comments'));
const CommentsSection = lazy(() => import('@/pages/CommentsSection'));
const CommissionManagement = lazy(() => import('@/pages/CommissionManagement'));
const Community = lazy(() => import('@/pages/Community'));
const CommunityCreate = lazy(() => import('@/pages/CommunityCreate'));
const CommunityEngagement = lazy(() => import('@/pages/CommunityEngagement'));
const CommunityGuidelines = lazy(() => import('@/pages/CommunityGuidelines'));
const CommunityHub = lazy(() => import('@/pages/CommunityHub'));
const CompanySimulator = lazy(() => import('@/pages/CompanySimulator'));
const CompetitiveRadar = lazy(() => import('@/pages/CompetitiveRadar'));
const ComplianceCenter = lazy(() => import('@/pages/ComplianceCenter'));
const ComplianceChecker = lazy(() => import('@/pages/ComplianceChecker'));
const ComplianceChecking = lazy(() => import('@/pages/ComplianceChecking'));
const ComplianceDashboard = lazy(() => import('@/pages/ComplianceDashboard'));
const ComplianceReports = lazy(() => import('@/pages/ComplianceReports'));
const ComponentShowcase = lazy(() => import('@/pages/ComponentShowcase'));
const ComprehensiveEcosystemLanding = lazy(() => import('@/pages/ComprehensiveEcosystemLanding'));
const ConfirmationDialog = lazy(() => import('@/pages/ConfirmationDialog'));
const ConnectedApps = lazy(() => import('@/pages/ConnectedApps'));
const ConnectionError = lazy(() => import('@/pages/ConnectionError'));
const ConnectionRequests = lazy(() => import('@/pages/ConnectionRequests'));
const ConnectorIntelligence = lazy(() => import('@/pages/ConnectorIntelligence'));
const ContactManagement = lazy(() => import('@/pages/ContactManagement'));
const ContactUsForm = lazy(() => import('@/pages/ContactUsForm'));
const ContentAnalytics = lazy(() => import('@/pages/ContentAnalytics'));
const ContentCalendar = lazy(() => import('@/pages/ContentCalendar'));
const ContentCollaboration = lazy(() => import('@/pages/ContentCollaboration'));
const ContentFlagging = lazy(() => import('@/pages/ContentFlagging'));
const ContentLibrary = lazy(() => import('@/pages/ContentLibrary'));
const ContentModeration = lazy(() => import('@/pages/ContentModeration'));
const ContentScheduler = lazy(() => import('@/pages/ContentScheduler'));
const ContentScheduling = lazy(() => import('@/pages/ContentScheduling'));
const ContentUpload = lazy(() => import('@/pages/ContentUpload'));
const ContentVault = lazy(() => import('@/pages/ContentVault'));
const ContextMenu = lazy(() => import('@/pages/ContextMenu'));
const ContractABI = lazy(() => import('@/pages/ContractABI'));
const ContractManagement = lazy(() => import('@/pages/ContractManagement'));
const ContributionInterface = lazy(() => import('@/pages/ContributionInterface'));
const ConversationArchive = lazy(() => import('@/pages/ConversationArchive'));
const ConversationHistory = lazy(() => import('@/pages/ConversationHistory'));
const ConversionFunnel = lazy(() => import('@/pages/ConversionFunnel'));
const ConversionOptimization = lazy(() => import('@/pages/ConversionOptimization'));
const CookiePolicy = lazy(() => import('@/pages/CookiePolicy'));
const CopyrightManagement = lazy(() => import('@/pages/CopyrightManagement'));
const CostAllocation = lazy(() => import('@/pages/CostAllocation'));
const CostBasisCalculation = lazy(() => import('@/pages/CostBasisCalculation'));
const CourseBuilder = lazy(() => import('@/pages/CourseBuilder'));
const CourseCatalog = lazy(() => import('@/pages/CourseCatalog'));
const CoverPhoto = lazy(() => import('@/pages/CoverPhoto'));
const CreateArticle = lazy(() => import('@/pages/CreateArticle'));
const CreateAudio = lazy(() => import('@/pages/CreateAudio'));
const CreateDrop = lazy(() => import('@/pages/CreateDrop'));
const CreateReel = lazy(() => import('@/pages/CreateReel'));
const CreatorAnalytics = lazy(() => import('@/pages/CreatorAnalytics'));
const CreatorDashboard = lazy(() => import('@/pages/CreatorDashboard'));
const CreatorEconomy = lazy(() => import('@/pages/CreatorEconomy'));
const CreatorFunding = lazy(() => import('@/pages/CreatorFunding'));
const CreatorGrants = lazy(() => import('@/pages/CreatorGrants'));
const CreatorIntelligence = lazy(() => import('@/pages/CreatorIntelligence'));
const CreatorMonetization = lazy(() => import('@/pages/CreatorMonetization'));
const CreatorNetwork = lazy(() => import('@/pages/CreatorNetwork'));
const CreatorOnboarding = lazy(() => import('@/pages/CreatorOnboarding'));
const CreatorProfile = lazy(() => import('@/pages/CreatorProfile'));
const CreatorSpotlight = lazy(() => import('@/pages/CreatorSpotlight'));
const CreatorStudio = lazy(() => import('@/pages/CreatorStudio'));
const CrossChainInterop = lazy(() => import('@/pages/CrossChainInterop'));
const CrossChainSwap = lazy(() => import('@/pages/CrossChainSwap'));
const Crypto = lazy(() => import('@/pages/Crypto'));
const CryptoEnhancementsPage = lazy(() => import('@/pages/CryptoEnhancementsPage'));
const CryptoExchange = lazy(() => import('@/pages/CryptoExchange'));
const CryptoHub = lazy(() => import('@/pages/CryptoHub'));
const CryptoNews = lazy(() => import('@/pages/CryptoNews'));
const CryptoResearchHub = lazy(() => import('@/pages/CryptoResearchHub'));
const CustomDashboard = lazy(() => import('@/pages/CustomDashboard'));
const CustomReports = lazy(() => import('@/pages/CustomReports'));
const CustomerAnalytics = lazy(() => import('@/pages/CustomerAnalytics'));
const CustomerDisputes = lazy(() => import('@/pages/CustomerDisputes'));
const DAOGovernance = lazy(() => import('@/pages/DAOGovernance'));
const DAOTreasury = lazy(() => import('@/pages/DAOTreasury'));
const DCACalculator = lazy(() => import('@/pages/DCACalculator'));
const DEXDepthChart = lazy(() => import('@/pages/DEXDepthChart'));
const DMInbox = lazy(() => import('@/pages/DMInbox'));
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const DashboardOverview = lazy(() => import('@/pages/DashboardOverview'));
const DataExport = lazy(() => import('@/pages/DataExport'));
const DataGrid = lazy(() => import('@/pages/DataGrid'));
const DataLake = lazy(() => import('@/pages/DataLake'));
const DataPrivacy = lazy(() => import('@/pages/DataPrivacy'));
const DataProcessing = lazy(() => import('@/pages/DataProcessing'));
const DataRetention = lazy(() => import('@/pages/DataRetention'));
const DataTable = lazy(() => import('@/pages/DataTable'));
const DataVisualization = lazy(() => import('@/pages/DataVisualization'));
const DatabaseManagement = lazy(() => import('@/pages/DatabaseManagement'));
const DateInputForm = lazy(() => import('@/pages/DateInputForm'));
const DatePickerDialog = lazy(() => import('@/pages/DatePickerDialog'));
const DatingDiscovery = lazy(() => import('@/pages/DatingDiscovery'));
const DatingHome = lazy(() => import('@/pages/DatingHome'));
const DatingMatches = lazy(() => import('@/pages/DatingMatches'));
const DatingMessages = lazy(() => import('@/pages/DatingMessages'));
const DatingPremium = lazy(() => import('@/pages/DatingPremium'));
const DatingProfile = lazy(() => import('@/pages/DatingProfile'));
const DatingProfileSetup = lazy(() => import('@/pages/DatingProfileSetup'));
const DatingSubscription = lazy(() => import('@/pages/DatingSubscription'));
const DayTradeRoom = lazy(() => import('@/pages/DayTradeRoom'));
const DeFi = lazy(() => import('@/pages/DeFi'));
const DecentralizedIdentity = lazy(() => import('@/pages/DecentralizedIdentity'));
const DefensibilityMoat = lazy(() => import('@/pages/DefensibilityMoat'));
const DeleteAccount = lazy(() => import('@/pages/DeleteAccount'));
const DeleteContent = lazy(() => import('@/pages/DeleteContent'));
const DepartmentManagement = lazy(() => import('@/pages/DepartmentManagement'));
const DependencyGraph = lazy(() => import('@/pages/DependencyGraph'));
const DeploymentPipeline = lazy(() => import('@/pages/DeploymentPipeline'));
const DeprecationPolicy = lazy(() => import('@/pages/DeprecationPolicy'));
const DerivativeTrading = lazy(() => import('@/pages/DerivativeTrading'));
const DerivativesTrading = lazy(() => import('@/pages/DerivativesTrading'));
const DestinationGuide = lazy(() => import('@/pages/DestinationGuide'));
const DestinyEngine = lazy(() => import('@/pages/DestinyEngine'));
const DevOps = lazy(() => import('@/pages/DevOps'));
const DeveloperArea = lazy(() => import('@/pages/DeveloperArea'));
const DeveloperCommunity = lazy(() => import('@/pages/DeveloperCommunity'));
const DeveloperMarketplace = lazy(() => import('@/pages/DeveloperMarketplace'));
const DeveloperProtocol = lazy(() => import('@/pages/DeveloperProtocol'));
const DifficultyCalculator = lazy(() => import('@/pages/DifficultyCalculator'));
const DifficultyTracking = lazy(() => import('@/pages/DifficultyTracking'));
const DigitalArtStore = lazy(() => import('@/pages/DigitalArtStore'));
const DigitalNationMode = lazy(() => import('@/pages/DigitalNationMode'));
const DigitalTwin = lazy(() => import('@/pages/DigitalTwin'));
const DirectMessages = lazy(() => import('@/pages/DirectMessages'));
const DirectMessaging = lazy(() => import('@/pages/DirectMessaging'));
const DisasterRecovery = lazy(() => import('@/pages/DisasterRecovery'));
const DiscordIntegration = lazy(() => import('@/pages/DiscordIntegration'));
const Discover = lazy(() => import('@/pages/Discover'));
const DiscussionBoard = lazy(() => import('@/pages/DiscussionBoard'));
const DiscussionForums = lazy(() => import('@/pages/DiscussionForums'));
const DisputeResolution = lazy(() => import('@/pages/DisputeResolution'));
const DistributionChannels = lazy(() => import('@/pages/DistributionChannels'));
const DocumentEditor = lazy(() => import('@/pages/DocumentEditor'));
const DocumentManagement = lazy(() => import('@/pages/DocumentManagement'));
const DocumentSharing = lazy(() => import('@/pages/DocumentSharing'));
const DocumentSigning = lazy(() => import('@/pages/DocumentSigning'));
const Documentation = lazy(() => import('@/pages/Documentation'));
const DogecoinPoolSelection = lazy(() => import('@/pages/DogecoinPoolSelection'));
const DomainManagement = lazy(() => import('@/pages/DomainManagement'));
const DonationProcessing = lazy(() => import('@/pages/DonationProcessing'));
const DropdownMenu = lazy(() => import('@/pages/DropdownMenu'));
const ENSResolver = lazy(() => import('@/pages/ENSResolver'));
const EarningsTracker = lazy(() => import('@/pages/EarningsTracker'));
const EarningsTracking = lazy(() => import('@/pages/EarningsTracking'));
const EconomicLayer = lazy(() => import('@/pages/EconomicLayer'));
const Economics = lazy(() => import('@/pages/Economics'));
const EconomyControl = lazy(() => import('@/pages/EconomyControl'));
const Ecosystem = lazy(() => import('@/pages/Ecosystem'));
const EditProfile = lazy(() => import('@/pages/EditProfile'));
const EmailCampaigns = lazy(() => import('@/pages/EmailCampaigns'));
const EmailConfiguration = lazy(() => import('@/pages/EmailConfiguration'));
const EmailInputForm = lazy(() => import('@/pages/EmailInputForm'));
const EmailIntegration = lazy(() => import('@/pages/EmailIntegration'));
const EmailNotifications = lazy(() => import('@/pages/EmailNotifications'));
const EmailTemplates = lazy(() => import('@/pages/EmailTemplates'));
const EmailVerification = lazy(() => import('@/pages/EmailVerification'));
const EmbedSDK = lazy(() => import('@/pages/EmbedSDK'));
const EmptySearchState = lazy(() => import('@/pages/EmptySearchState'));
const EngagementMetrics = lazy(() => import('@/pages/EngagementMetrics'));
const EngagementStats = lazy(() => import('@/pages/EngagementStats'));
const Engineer = lazy(() => import('@/pages/Engineer'));
const Enterprise = lazy(() => import('@/pages/Enterprise'));
const EnterpriseAPI = lazy(() => import('@/pages/EnterpriseAPI'));
const EnterpriseAnalytics = lazy(() => import('@/pages/EnterpriseAnalytics'));
const EnterpriseBilling = lazy(() => import('@/pages/EnterpriseBilling'));
const EntityProfile = lazy(() => import('@/pages/EntityProfile'));
const EnvironmentManagement = lazy(() => import('@/pages/EnvironmentManagement'));
const Error403 = lazy(() => import('@/pages/Error403'));
const Error404 = lazy(() => import('@/pages/Error404'));
const Error500 = lazy(() => import('@/pages/Error500'));
const Error503 = lazy(() => import('@/pages/Error503'));
const ErrorDialog = lazy(() => import('@/pages/ErrorDialog'));
const ErrorTracking = lazy(() => import('@/pages/ErrorTracking'));
const EscrowShop = lazy(() => import('@/pages/EscrowShop'));
const EthereumPoolSelector = lazy(() => import('@/pages/EthereumPoolSelector'));
const EventAnalytics = lazy(() => import('@/pages/EventAnalytics'));
const EventCalendar = lazy(() => import('@/pages/EventCalendar'));
const EventCreation = lazy(() => import('@/pages/EventCreation'));
const EventPlanner = lazy(() => import('@/pages/EventPlanner'));
const EventRegistration = lazy(() => import('@/pages/EventRegistration'));
const Events = lazy(() => import('@/pages/Events'));
const ExecutionHistory = lazy(() => import('@/pages/ExecutionHistory'));
const ExerciseLibrary = lazy(() => import('@/pages/ExerciseLibrary'));
const ExpenseManagement = lazy(() => import('@/pages/ExpenseManagement'));
const ExpenseTracker = lazy(() => import('@/pages/ExpenseTracker'));
const ExperimentFactory = lazy(() => import('@/pages/ExperimentFactory'));
const ExperimentTracker = lazy(() => import('@/pages/ExperimentTracker'));
const Explore = lazy(() => import('@/pages/Explore'));
const ExportData = lazy(() => import('@/pages/ExportData'));
const FAQManagement = lazy(() => import('@/pages/FAQManagement'));
const FAQPage = lazy(() => import('@/pages/FAQPage'));
const Farming = lazy(() => import('@/pages/Farming'));
const Favorites = lazy(() => import('@/pages/Favorites'));
const FeatureRequests = lazy(() => import('@/pages/FeatureRequests'));
const FeatureTour = lazy(() => import('@/pages/FeatureTour'));
const Features = lazy(() => import('@/pages/Features'));
const FeeCalculation = lazy(() => import('@/pages/FeeCalculation'));
const FeedWithPosts = lazy(() => import('@/pages/FeedWithPosts'));
const Feedback = lazy(() => import('@/pages/Feedback'));
const FeedbackDialog = lazy(() => import('@/pages/FeedbackDialog'));
const FeedbackForm = lazy(() => import('@/pages/FeedbackForm'));
const FeedbackHub = lazy(() => import('@/pages/FeedbackHub'));
const FileBrowser = lazy(() => import('@/pages/FileBrowser'));
const FileConverter = lazy(() => import('@/pages/FileConverter'));
const FileDownload = lazy(() => import('@/pages/FileDownload'));
const FilePreview = lazy(() => import('@/pages/FilePreview'));
const FileSharing = lazy(() => import('@/pages/FileSharing'));
const FileUploadDialog = lazy(() => import('@/pages/FileUploadDialog'));
const FileUploadForm = lazy(() => import('@/pages/FileUploadForm'));
const FileUploadProgress = lazy(() => import('@/pages/FileUploadProgress'));
const FileVersioning = lazy(() => import('@/pages/FileVersioning'));
const FilterPanel = lazy(() => import('@/pages/FilterPanel'));
const FinancialReports = lazy(() => import('@/pages/FinancialReports'));
const FlashLoans = lazy(() => import('@/pages/FlashLoans'));
const FlightSearch = lazy(() => import('@/pages/FlightSearch'));
const FollowList = lazy(() => import('@/pages/FollowList'));
const FollowRequests = lazy(() => import('@/pages/FollowRequests'));
const FollowSystem = lazy(() => import('@/pages/FollowSystem'));
const FollowUnfollow = lazy(() => import('@/pages/FollowUnfollow'));
const FollowerList = lazy(() => import('@/pages/FollowerList'));
const FollowersNetwork = lazy(() => import('@/pages/FollowersNetwork'));
const ForecastingEngine = lazy(() => import('@/pages/ForecastingEngine'));
const ForumCategories = lazy(() => import('@/pages/ForumCategories'));
const FrameworkTemplates = lazy(() => import('@/pages/FrameworkTemplates'));
const FreeWillDashboard = lazy(() => import('@/pages/FreeWillDashboard'));
const FundraiserTools = lazy(() => import('@/pages/FundraiserTools'));

export default function LegacyRoutesAF() {
  return (
    <Switch>
      <Route path="/a-b-testing" component={ABTesting} />
      <Route path="/a-b-testing-advanced" component={ABTestingAdvanced} />
      <Route path="/a-i-agent-economy" component={AIAgentEconomy} />
      <Route path="/a-i-agent-market" component={AIAgentMarket} />
      <Route path="/a-i-assistant" component={AIAssistant} />
      <Route path="/a-i-brain" component={AIBrain} />
      <Route path="/a-i-code-studio" component={AICodeStudio} />
      <Route path="/a-i-copy-studio" component={AICopyStudio} />
      <Route path="/a-i-core" component={AICore} />
      <Route path="/a-i-engineer" component={AIEngineer} />
      <Route path="/a-i-governance" component={AIGovernance} />
      <Route path="/a-i-market-agents" component={AIMarketAgents} />
      <Route path="/a-i-matchmaker" component={AIMatchmaker} />
      <Route path="/a-i-moderation-queue" component={AIModerationQueue} />
      <Route path="/a-i-persona-feed" component={AIPersonaFeed} />
      <Route path="/a-i-persona-system" component={AIPersonaSystem} />
      <Route path="/a-i-tools-hub" component={AIToolsHub} />
      <Route path="/a-i-trading" component={AITrading} />
      <Route path="/a-i-training-loops" component={AITrainingLoops} />
      <Route path="/a-p-i-docs" component={APIDocs} />
      <Route path="/a-p-i-documentation" component={APIDocumentation} />
      <Route path="/a-p-i-integration" component={APIIntegration} />
      <Route path="/a-p-i-keys" component={APIKeys} />
      <Route path="/a-p-i-logs" component={APILogs} />
      <Route path="/a-p-i-management" component={APIManagement} />
      <Route path="/a-p-i-monitoring" component={APIMonitoring} />
      <Route path="/a-p-i-status" component={APIStatus} />
      <Route path="/a-p-i-testing" component={APITesting} />
      <Route path="/a-p-i-usage" component={APIUsage} />
      <Route path="/a-p-i-versioning" component={APIVersioning} />
      <Route path="/a-p-y-tracking" component={APYTracking} />
      <Route path="/about" component={About} />
      <Route path="/access-control" component={AccessControl} />
      <Route path="/accessibility-settings" component={AccessibilitySettings} />
      <Route path="/accordion-navigation" component={AccordionNavigation} />
      <Route path="/account-settings" component={AccountSettings} />
      <Route path="/achievement-badges" component={AchievementBadges} />
      <Route path="/achievements" component={Achievements} />
      <Route path="/action-objects" component={ActionObjects} />
      <Route path="/action-panel" component={ActionPanel} />
      <Route path="/activity-feed" component={ActivityFeed} />
      <Route path="/activity-evidence" component={ActivityEvidence} />
      <Route path="/activity-tracking" component={ActivityTracking} />
      <Route path="/adaptive-personalization" component={AdaptivePersonalization} />
      <Route path="/adaptive-roadmap" component={AdaptiveRoadmap} />
      <Route path="/add-bank-account" component={AddBankAccount} />
      <Route path="/add-credit-card" component={AddCreditCard} />
      <Route path="/address-book" component={AddressBook} />
      <Route path="/address-lookup" component={AddressLookup} />
      <Route path="/admin" component={Admin} />
      <Route path="/admin-dashboard" component={AdminDashboard} />
      <Route path="/admin-orders" component={AdminOrders} />
      <Route path="/admin-panel" component={AdminPanel} />
      <Route path="/admin-wallet-manager" component={AdminWalletManager} />
      <Route path="/advanced-admin-panel" component={AdvancedAdminPanel} />
      <Route path="/advanced-analytics" component={AdvancedAnalytics} />
      <Route path="/advanced-orders" component={AdvancedOrders} />
      <Route path="/advanced-search" component={AdvancedSearch} />
      <Route path="/affiliate-dashboard" component={AffiliateDashboard} />
      <Route path="/affiliate-program" component={AffiliateProgram} />
      <Route path="/age-gate" component={AgeGate} />
      <Route path="/age-verification" component={AgeVerification} />
      <Route path="/agent-builder" component={AgentBuilder} />
      <Route path="/agent-city" component={AgentCity} />
      <Route path="/agent-coordination" component={AgentCoordination} />
      <Route path="/agent-coordination-hub" component={AgentCoordinationHub} />
      <Route path="/agent-debate" component={AgentDebate} />
      <Route path="/agent-detail" component={AgentDetail} />
      <Route path="/agent-marketplace" component={AgentMarketplace} />
      <Route path="/agent-performance" component={AgentPerformance} />
      <Route path="/agent-sprint" component={AgentSprint} />
      <Route path="/agents-dashboard" component={AgentsDashboard} />
      <Route path="/alert-configuration" component={AlertConfiguration} />
      <Route path="/alert-dialog" component={AlertDialog} />
      <Route path="/alert-management" component={AlertManagement} />
      <Route path="/ambient-feed" component={AmbientFeed} />
      <Route path="/analytics" component={Analytics} />
      <Route path="/analytics-dashboard" component={AnalyticsDashboard} />
      <Route path="/analytics-products" component={AnalyticsProducts} />
      <Route path="/analytics-reports" component={AnalyticsReports} />
      <Route path="/anomaly-detection" component={AnomalyDetection} />
      <Route path="/anti-surveillance" component={AntiSurveillance} />
      <Route path="/approval-workflows" component={ApprovalWorkflows} />
      <Route path="/arbitrage-bot" component={ArbitrageBot} />
      <Route path="/arcade" component={Arcade} />
      <Route path="/archive-management" component={ArchiveManagement} />
      <Route path="/asset-allocation" component={AssetAllocation} />
      <Route path="/asset-management" component={AssetManagement} />
      <Route path="/asset-tracking" component={AssetTracking} />
      <Route path="/assignment-tracker" component={AssignmentTracker} />
      <Route path="/attribution-modeling" component={AttributionModeling} />
      <Route path="/audience-segmentation" component={AudienceSegmentation} />
      <Route path="/audio-analytics" component={AudioAnalytics} />
      <Route path="/audio-editing" component={AudioEditing} />
      <Route path="/audio-library" component={AudioLibrary} />
      <Route path="/audio-player" component={AudioPlayer} />
      <Route path="/audit-log" component={AuditLog} />
      <Route path="/audit-logs" component={AuditLogs} />
      <Route path="/audit-trail" component={AuditTrail} />
      <Route path="/auto-responder" component={AutoResponder} />
      <Route path="/automation-engine" component={AutomationEngine} />
      <Route path="/automation-rules" component={AutomationRules} />
      <Route path="/automation-workflows" component={AutomationWorkflows} />
      <Route path="/backup-management" component={BackupManagement} />
      <Route path="/badges" component={Badges} />
      <Route path="/ban-suspend-user" component={BanSuspendUser} />
      <Route path="/batch-generation" component={BatchGeneration} />
      <Route path="/battle-pass" component={BattlePass} />
      <Route path="/behavioral-intelligence" component={BehavioralIntelligence} />
      <Route path="/beta" component={Beta} />
      <Route path="/billing-history" component={BillingHistory} />
      <Route path="/block-browser" component={BlockBrowser} />
      <Route path="/block-rewards" component={BlockRewards} />
      <Route path="/block-user" component={BlockUser} />
      <Route path="/blockchain-custody" component={BlockchainCustody} />
      <Route path="/blockchain-monitor" component={BlockchainMonitor} />
      <Route path="/blocked-users" component={BlockedUsers} />
      <Route path="/blog-editor" component={BlogEditor} />
      <Route path="/blog-publisher" component={BlogPublisher} />
      <Route path="/book-page" component={BookPage} />
      <Route path="/bookmarks" component={Bookmarks} />
      <Route path="/bounty-system" component={BountySystem} />
      <Route path="/brand-guidelines" component={BrandGuidelines} />
      <Route path="/breadcrumb-navigation" component={BreadcrumbNavigation} />
      <Route path="/bridge-protocol" component={BridgeProtocol} />
      <Route path="/bridge-transactions" component={BridgeTransactions} />
      <Route path="/browser-extension" component={BrowserExtension} />
      <Route path="/budget-planner" component={BudgetPlanner} />
      <Route path="/bug-reporting" component={BugReporting} />
      <Route path="/build-order" component={BuildOrder} />
      <Route path="/build-roadmap" component={BuildRoadmap} />
      <Route path="/bulk-operations" component={BulkOperations} />
      <Route path="/bulk-ordering" component={BulkOrdering} />
      <Route path="/bulk-upload" component={BulkUpload} />
      <Route path="/c-c-p-a" component={CCPA} />
      <Route path="/c-d-n-management" component={CDNManagement} />
      <Route path="/c-r-m" component={CRM} />
      <Route path="/cache-management" component={CacheManagement} />
      <Route path="/calculator" component={Calculator} />
      <Route path="/calendar" component={Calendar} />
      <Route path="/calendar-view" component={CalendarView} />
      <Route path="/campaign-analytics" component={CampaignAnalytics} />
      <Route path="/campaign-builder" component={CampaignBuilder} />
      <Route path="/campaign-creation" component={CampaignCreation} />
      <Route path="/car-rental" component={CarRental} />
      <Route path="/card-grid-view" component={CardGridView} />
      <Route path="/cash-flow-analysis" component={CashFlowAnalysis} />
      <Route path="/category-management" component={CategoryManagement} />
      <Route path="/certificate-manager" component={CertificateManager} />
      <Route path="/chain-explorer" component={ChainExplorer} />
      <Route path="/change-log" component={ChangeLog} />
      <Route path="/channel-customization" component={ChannelCustomization} />
      <Route path="/charity" component={Charity} />
      <Route path="/charity-leaderboard" component={CharityLeaderboard} />
      <Route path="/chart-analysis" component={ChartAnalysis} />
      <Route path="/chart-dashboard" component={ChartDashboard} />
      <Route path="/chat-bot" component={ChatBot} />
      <Route path="/chat-history" component={ChatHistory} />
      <Route path="/chat-m-v-p" component={ChatMVP} />
      <Route path="/checkbox-group-form" component={CheckboxGroupForm} />
      <Route path="/checkout" component={Checkout} />
      <Route path="/checkout-flow" component={CheckoutFlow} />
      <Route path="/china-edition" component={ChinaEdition} />
      <Route path="/churn-prediction" component={ChurnPrediction} />
      <Route path="/citizen-passport" component={CitizenPassport} />
      <Route path="/civilization-simulator" component={CivilizationSimulator} />
      <Route path="/clan-wars" component={ClanWars} />
      <Route path="/classroom-management" component={ClassroomManagement} />
      <Route path="/client-libraries" component={ClientLibraries} />
      <Route path="/closing-checklist" component={ClosingChecklist} />
      <Route path="/code-completion" component={CodeCompletion} />
      <Route path="/code-formatter" component={CodeFormatter} />
      <Route path="/code-highlighting" component={CodeHighlighting} />
      <Route path="/code-quality" component={CodeQuality} />
      <Route path="/code-quality-dashboard" component={CodeQualityDashboard} />
      <Route path="/code-repository" component={CodeRepository} />
      <Route path="/code-samples" component={CodeSamples} />
      <Route path="/cohort-analysis" component={CohortAnalysis} />
      <Route path="/color-picker-dialog" component={ColorPickerDialog} />
      <Route path="/comment-thread" component={CommentThread} />
      <Route path="/comments" component={Comments} />
      <Route path="/comments-section" component={CommentsSection} />
      <Route path="/commission-management" component={CommissionManagement} />
      <Route path="/community" component={Community} />
      <Route path="/community-create" component={CommunityCreate} />
      <Route path="/community-engagement" component={CommunityEngagement} />
      <Route path="/community-guidelines" component={CommunityGuidelines} />
      <Route path="/community-hub" component={CommunityHub} />
      <Route path="/company-simulator" component={CompanySimulator} />
      <Route path="/competitive-radar" component={CompetitiveRadar} />
      <Route path="/compliance-center" component={ComplianceCenter} />
      <Route path="/compliance-checker" component={ComplianceChecker} />
      <Route path="/compliance-checking" component={ComplianceChecking} />
      <Route path="/compliance-dashboard" component={ComplianceDashboard} />
      <Route path="/compliance-reports" component={ComplianceReports} />
      <Route path="/component-showcase" component={ComponentShowcase} />
      <Route path="/comprehensive-ecosystem-landing" component={ComprehensiveEcosystemLanding} />
      <Route path="/confirmation-dialog" component={ConfirmationDialog} />
      <Route path="/connected-apps" component={ConnectedApps} />
      <Route path="/connection-error" component={ConnectionError} />
      <Route path="/connection-requests" component={ConnectionRequests} />
      <Route path="/connector-intelligence" component={ConnectorIntelligence} />
      <Route path="/contact-management" component={ContactManagement} />
      <Route path="/contact-us-form" component={ContactUsForm} />
      <Route path="/content-analytics" component={ContentAnalytics} />
      <Route path="/content-calendar" component={ContentCalendar} />
      <Route path="/content-collaboration" component={ContentCollaboration} />
      <Route path="/content-flagging" component={ContentFlagging} />
      <Route path="/content-library" component={ContentLibrary} />
      <Route path="/content-moderation" component={ContentModeration} />
      <Route path="/content-scheduler" component={ContentScheduler} />
      <Route path="/content-scheduling" component={ContentScheduling} />
      <Route path="/content-upload" component={ContentUpload} />
      <Route path="/content-vault" component={ContentVault} />
      <Route path="/context-menu" component={ContextMenu} />
      <Route path="/contract-a-b-i" component={ContractABI} />
      <Route path="/contract-management" component={ContractManagement} />
      <Route path="/contribution-interface" component={ContributionInterface} />
      <Route path="/conversation-archive" component={ConversationArchive} />
      <Route path="/conversation-history" component={ConversationHistory} />
      <Route path="/conversion-funnel" component={ConversionFunnel} />
      <Route path="/conversion-optimization" component={ConversionOptimization} />
      <Route path="/cookie-policy" component={CookiePolicy} />
      <Route path="/copyright-management" component={CopyrightManagement} />
      <Route path="/cost-allocation" component={CostAllocation} />
      <Route path="/cost-basis-calculation" component={CostBasisCalculation} />
      <Route path="/course-builder" component={CourseBuilder} />
      <Route path="/course-catalog" component={CourseCatalog} />
      <Route path="/cover-photo" component={CoverPhoto} />
      <Route path="/create-article" component={CreateArticle} />
      <Route path="/create-audio" component={CreateAudio} />
      <Route path="/create-drop" component={CreateDrop} />
      <Route path="/create-reel" component={CreateReel} />
      <Route path="/creator-analytics" component={CreatorAnalytics} />
      <Route path="/creator-dashboard" component={CreatorDashboard} />
      <Route path="/creator-economy" component={CreatorEconomy} />
      <Route path="/creator-funding" component={CreatorFunding} />
      <Route path="/creator-grants" component={CreatorGrants} />
      <Route path="/creator-intelligence" component={CreatorIntelligence} />
      <Route path="/creator-monetization" component={CreatorMonetization} />
      <Route path="/creator-network" component={CreatorNetwork} />
      <Route path="/creator-onboarding" component={CreatorOnboarding} />
      <Route path="/creator-profile" component={CreatorProfile} />
      <Route path="/creator-spotlight" component={CreatorSpotlight} />
      <Route path="/creator-studio" component={CreatorStudio} />
      <Route path="/cross-chain-interop" component={CrossChainInterop} />
      <Route path="/cross-chain-swap" component={CrossChainSwap} />
      <Route path="/crypto" component={Crypto} />
      <Route path="/crypto-enhancements-page" component={CryptoEnhancementsPage} />
      <Route path="/crypto-exchange" component={CryptoExchange} />
      <Route path="/crypto-hub" component={CryptoHub} />
      <Route path="/crypto-news" component={CryptoNews} />
      <Route path="/crypto-research-hub" component={CryptoResearchHub} />
      <Route path="/custom-dashboard" component={CustomDashboard} />
      <Route path="/custom-reports" component={CustomReports} />
      <Route path="/customer-analytics" component={CustomerAnalytics} />
      <Route path="/customer-disputes" component={CustomerDisputes} />
      <Route path="/d-a-o-governance" component={DAOGovernance} />
      <Route path="/d-a-o-treasury" component={DAOTreasury} />
      <Route path="/d-c-a-calculator" component={DCACalculator} />
      <Route path="/d-e-x-depth-chart" component={DEXDepthChart} />
      <Route path="/d-m-inbox" component={DMInbox} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/dashboard-overview" component={DashboardOverview} />
      <Route path="/data-export" component={DataExport} />
      <Route path="/data-grid" component={DataGrid} />
      <Route path="/data-lake" component={DataLake} />
      <Route path="/data-privacy" component={DataPrivacy} />
      <Route path="/data-processing" component={DataProcessing} />
      <Route path="/data-retention" component={DataRetention} />
      <Route path="/data-table" component={DataTable} />
      <Route path="/data-visualization" component={DataVisualization} />
      <Route path="/database-management" component={DatabaseManagement} />
      <Route path="/date-input-form" component={DateInputForm} />
      <Route path="/date-picker-dialog" component={DatePickerDialog} />
      <Route path="/dating-discovery" component={DatingDiscovery} />
      <Route path="/dating-home" component={DatingHome} />
      <Route path="/dating-matches" component={DatingMatches} />
      <Route path="/dating-messages" component={DatingMessages} />
      <Route path="/dating-premium" component={DatingPremium} />
      <Route path="/dating-profile" component={DatingProfile} />
      <Route path="/dating-profile-setup" component={DatingProfileSetup} />
      <Route path="/dating-subscription" component={DatingSubscription} />
      <Route path="/day-trade-room" component={DayTradeRoom} />
      <Route path="/de-fi" component={DeFi} />
      <Route path="/decentralized-identity" component={DecentralizedIdentity} />
      <Route path="/defensibility-moat" component={DefensibilityMoat} />
      <Route path="/delete-account" component={DeleteAccount} />
      <Route path="/delete-content" component={DeleteContent} />
      <Route path="/department-management" component={DepartmentManagement} />
      <Route path="/dependency-graph" component={DependencyGraph} />
      <Route path="/deployment-pipeline" component={DeploymentPipeline} />
      <Route path="/deprecation-policy" component={DeprecationPolicy} />
      <Route path="/derivative-trading" component={DerivativeTrading} />
      <Route path="/derivatives-trading" component={DerivativesTrading} />
      <Route path="/destination-guide" component={DestinationGuide} />
      <Route path="/destiny-engine" component={DestinyEngine} />
      <Route path="/dev-ops" component={DevOps} />
      <Route path="/developer-area" component={DeveloperArea} />
      <Route path="/developer-community" component={DeveloperCommunity} />
      <Route path="/developer-marketplace" component={DeveloperMarketplace} />
      <Route path="/developer-protocol" component={DeveloperProtocol} />
      <Route path="/difficulty-calculator" component={DifficultyCalculator} />
      <Route path="/difficulty-tracking" component={DifficultyTracking} />
      <Route path="/digital-art-store" component={DigitalArtStore} />
      <Route path="/digital-nation-mode" component={DigitalNationMode} />
      <Route path="/digital-twin" component={DigitalTwin} />
      <Route path="/direct-messages" component={DirectMessages} />
      <Route path="/direct-messaging" component={DirectMessaging} />
      <Route path="/disaster-recovery" component={DisasterRecovery} />
      <Route path="/discord-integration" component={DiscordIntegration} />
      <Route path="/discover" component={Discover} />
      <Route path="/discussion-board" component={DiscussionBoard} />
      <Route path="/discussion-forums" component={DiscussionForums} />
      <Route path="/dispute-resolution" component={DisputeResolution} />
      <Route path="/distribution-channels" component={DistributionChannels} />
      <Route path="/document-editor" component={DocumentEditor} />
      <Route path="/document-management" component={DocumentManagement} />
      <Route path="/document-sharing" component={DocumentSharing} />
      <Route path="/document-signing" component={DocumentSigning} />
      <Route path="/documentation" component={Documentation} />
      <Route path="/dogecoin-pool-selection" component={DogecoinPoolSelection} />
      <Route path="/domain-management" component={DomainManagement} />
      <Route path="/donation-processing" component={DonationProcessing} />
      <Route path="/dropdown-menu" component={DropdownMenu} />
      <Route path="/e-n-s-resolver" component={ENSResolver} />
      <Route path="/earnings-tracker" component={EarningsTracker} />
      <Route path="/earnings-tracking" component={EarningsTracking} />
      <Route path="/economic-layer" component={EconomicLayer} />
      <Route path="/economics" component={Economics} />
      <Route path="/economy-control" component={EconomyControl} />
      <Route path="/ecosystem" component={Ecosystem} />
      <Route path="/edit-profile" component={EditProfile} />
      <Route path="/email-campaigns" component={EmailCampaigns} />
      <Route path="/email-configuration" component={EmailConfiguration} />
      <Route path="/email-input-form" component={EmailInputForm} />
      <Route path="/email-integration" component={EmailIntegration} />
      <Route path="/email-notifications" component={EmailNotifications} />
      <Route path="/email-templates" component={EmailTemplates} />
      <Route path="/email-verification" component={EmailVerification} />
      <Route path="/embed-s-d-k" component={EmbedSDK} />
      <Route path="/empty-search-state" component={EmptySearchState} />
      <Route path="/engagement-metrics" component={EngagementMetrics} />
      <Route path="/engagement-stats" component={EngagementStats} />
      <Route path="/engineer" component={Engineer} />
      <Route path="/enterprise" component={Enterprise} />
      <Route path="/enterprise-a-p-i" component={EnterpriseAPI} />
      <Route path="/enterprise-analytics" component={EnterpriseAnalytics} />
      <Route path="/enterprise-billing" component={EnterpriseBilling} />
      <Route path="/entity-profile" component={EntityProfile} />
      <Route path="/environment-management" component={EnvironmentManagement} />
      <Route path="/error403" component={Error403} />
      <Route path="/error404" component={Error404} />
      <Route path="/error500" component={Error500} />
      <Route path="/error503" component={Error503} />
      <Route path="/error-dialog" component={ErrorDialog} />
      <Route path="/error-tracking" component={ErrorTracking} />
      <Route path="/escrow-shop" component={EscrowShop} />
      <Route path="/ethereum-pool-selector" component={EthereumPoolSelector} />
      <Route path="/event-analytics" component={EventAnalytics} />
      <Route path="/event-calendar" component={EventCalendar} />
      <Route path="/event-creation" component={EventCreation} />
      <Route path="/event-planner" component={EventPlanner} />
      <Route path="/event-registration" component={EventRegistration} />
      <Route path="/events" component={Events} />
      <Route path="/execution-history" component={ExecutionHistory} />
      <Route path="/exercise-library" component={ExerciseLibrary} />
      <Route path="/expense-management" component={ExpenseManagement} />
      <Route path="/expense-tracker" component={ExpenseTracker} />
      <Route path="/experiment-factory" component={ExperimentFactory} />
      <Route path="/experiment-tracker" component={ExperimentTracker} />
      <Route path="/explore" component={Explore} />
      <Route path="/export-data" component={ExportData} />
      <Route path="/f-a-q-management" component={FAQManagement} />
      <Route path="/f-a-q-page" component={FAQPage} />
      <Route path="/farming" component={Farming} />
      <Route path="/favorites" component={Favorites} />
      <Route path="/feature-requests" component={FeatureRequests} />
      <Route path="/feature-tour" component={FeatureTour} />
      <Route path="/features" component={Features} />
      <Route path="/fee-calculation" component={FeeCalculation} />
      <Route path="/feed-with-posts" component={FeedWithPosts} />
      <Route path="/feedback" component={Feedback} />
      <Route path="/feedback-dialog" component={FeedbackDialog} />
      <Route path="/feedback-form" component={FeedbackForm} />
      <Route path="/feedback-hub" component={FeedbackHub} />
      <Route path="/file-browser" component={FileBrowser} />
      <Route path="/file-converter" component={FileConverter} />
      <Route path="/file-download" component={FileDownload} />
      <Route path="/file-preview" component={FilePreview} />
      <Route path="/file-sharing" component={FileSharing} />
      <Route path="/file-upload-dialog" component={FileUploadDialog} />
      <Route path="/file-upload-form" component={FileUploadForm} />
      <Route path="/file-upload-progress" component={FileUploadProgress} />
      <Route path="/file-versioning" component={FileVersioning} />
      <Route path="/filter-panel" component={FilterPanel} />
      <Route path="/financial-reports" component={FinancialReports} />
      <Route path="/flash-loans" component={FlashLoans} />
      <Route path="/flight-search" component={FlightSearch} />
      <Route path="/follow-list" component={FollowList} />
      <Route path="/follow-requests" component={FollowRequests} />
      <Route path="/follow-system" component={FollowSystem} />
      <Route path="/follow-unfollow" component={FollowUnfollow} />
      <Route path="/follower-list" component={FollowerList} />
      <Route path="/followers-network" component={FollowersNetwork} />
      <Route path="/forecasting-engine" component={ForecastingEngine} />
      <Route path="/forum-categories" component={ForumCategories} />
      <Route path="/framework-templates" component={FrameworkTemplates} />
      <Route path="/free-will-dashboard" component={FreeWillDashboard} />
      <Route path="/fundraiser-tools" component={FundraiserTools} />
      <Route component={NotFound} />
    </Switch>
  );
}
