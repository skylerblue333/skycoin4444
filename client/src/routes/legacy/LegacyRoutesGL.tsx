import { lazy } from "react";
import { Route, Switch } from "wouter";
import NotFound from "@/pages/NotFound";

const GDPR = lazy(() => import('@/pages/GDPR'));
const GTMStrategy = lazy(() => import('@/pages/GTMStrategy'));
const GainLossTracking = lazy(() => import('@/pages/GainLossTracking'));
const GameBlackjack = lazy(() => import('@/pages/GameBlackjack'));
const GameBlockBuilder = lazy(() => import('@/pages/GameBlockBuilder'));
const GameChat = lazy(() => import('@/pages/GameChat'));
const GameCrash = lazy(() => import('@/pages/GameCrash'));
const GameCryptoQuiz = lazy(() => import('@/pages/GameCryptoQuiz'));
const GameFiQuestBoard = lazy(() => import('@/pages/GameFiQuestBoard'));
const GameHighLow = lazy(() => import('@/pages/GameHighLow'));
const GameLobby = lazy(() => import('@/pages/GameLobby'));
const GamePlinko = lazy(() => import('@/pages/GamePlinko'));
const GameRoulette = lazy(() => import('@/pages/GameRoulette'));
const GameRoom = lazy(() => import('@/pages/GameRoom'));
const GameSettings = lazy(() => import('@/pages/GameSettings'));
const GameSlots = lazy(() => import('@/pages/GameSlots'));
const GameTokenTap = lazy(() => import('@/pages/GameTokenTap'));
const GameSkyRush = lazy(() => import('@/pages/GameSkyRush'));
const Gaming = lazy(() => import('@/pages/Gaming'));
const GamingForCharity = lazy(() => import('@/pages/GamingForCharity'));
const GanttChart = lazy(() => import('@/pages/GanttChart'));
const GasFeeEstimator = lazy(() => import('@/pages/GasFeeEstimator'));
const GasPriceMonitor = lazy(() => import('@/pages/GasPriceMonitor'));
const GasTracker = lazy(() => import('@/pages/GasTracker'));
const GeneralSettings = lazy(() => import('@/pages/GeneralSettings'));
const GeneratedApiExplorer = lazy(() => import('@/pages/GeneratedApiExplorer'));
const GeneratedGallery = lazy(() => import('@/pages/GeneratedGallery'));
const GettingStartedGuide = lazy(() => import('@/pages/GettingStartedGuide'));
const GhostMode = lazy(() => import('@/pages/GhostMode'));
const GlobalOperationsCenter = lazy(() => import('@/pages/GlobalOperationsCenter'));
const GlobalSearch = lazy(() => import('@/pages/GlobalSearch'));
const Governance = lazy(() => import('@/pages/Governance'));
const GovernanceVoting = lazy(() => import('@/pages/GovernanceVoting'));
const GovernanceWizard = lazy(() => import('@/pages/GovernanceWizard'));
const GradeBook = lazy(() => import('@/pages/GradeBook'));
const GroupChat = lazy(() => import('@/pages/GroupChat'));
const GroupChats = lazy(() => import('@/pages/GroupChats'));
const GroupDirectory = lazy(() => import('@/pages/GroupDirectory'));
const GroupEvents = lazy(() => import('@/pages/GroupEvents'));
const GroupManagement = lazy(() => import('@/pages/GroupManagement'));
const Growth = lazy(() => import('@/pages/Growth'));
const Guilds = lazy(() => import('@/pages/Guilds'));
const HIPAA = lazy(() => import('@/pages/HIPAA'));
const HOPEAIControl = lazy(() => import('@/pages/HOPEAIControl'));
const HashRateMonitor = lazy(() => import('@/pages/HashRateMonitor'));
const HashtagExplorer = lazy(() => import('@/pages/HashtagExplorer'));
const HashtagSearch = lazy(() => import('@/pages/HashtagSearch'));
const Hashtags = lazy(() => import('@/pages/Hashtags'));
const HealthArticles = lazy(() => import('@/pages/HealthArticles'));
const HealthDashboard = lazy(() => import('@/pages/HealthDashboard'));
const HealthGoals = lazy(() => import('@/pages/HealthGoals'));
const HelpCenter = lazy(() => import('@/pages/HelpCenter'));
const HopeAI = lazy(() => import('@/pages/HopeAIWorkspace'));
const HopeAICoach = lazy(() => import('@/pages/HopeAI'));
const HopeAIAdvanced = lazy(() => import('@/pages/HopeAIWorkspace'));
const HopeAIMeta = lazy(() => import('@/pages/HopeAIMeta'));
const HopeAIPage = lazy(() => import('@/pages/HopeAIPage'));
const HopeAIUpgrades = lazy(() => import('@/pages/HopeAIUpgrades'));
const HotelSearch = lazy(() => import('@/pages/HotelSearch'));
const HubSpotIntegration = lazy(() => import('@/pages/HubSpotIntegration'));
const ICOLaunchpad = lazy(() => import('@/pages/ICOLaunchpad'));
const IFTTT = lazy(() => import('@/pages/IFTTT'));
const IITR = lazy(() => import('@/pages/IITR'));
const ITServicesLanding = lazy(() => import('@/pages/ITServicesLanding'));
const ITServicesPortal = lazy(() => import('@/pages/ITServicesPortal'));
const ImageEditor = lazy(() => import('@/pages/ImageEditor'));
const ImageGallery = lazy(() => import('@/pages/ImageGallery'));
const ImageTools = lazy(() => import('@/pages/ImageTools'));
const ImageViewer = lazy(() => import('@/pages/ImageViewer'));
const ImpactMap = lazy(() => import('@/pages/ImpactMap'));
const ImpactMetrics = lazy(() => import('@/pages/ImpactMetrics'));
const InAppNotifications = lazy(() => import('@/pages/InAppNotifications'));
const InGameCurrency = lazy(() => import('@/pages/InGameCurrency'));
const IncidentManagement = lazy(() => import('@/pages/IncidentManagement'));
const InputDialog = lazy(() => import('@/pages/InputDialog'));
const InstructorDashboard = lazy(() => import('@/pages/InstructorDashboard'));
const IntegrationSetup = lazy(() => import('@/pages/IntegrationSetup'));
const Integrations = lazy(() => import('@/pages/Integrations'));
const InventoryManagement = lazy(() => import('@/pages/InventoryManagement'));
const InvestmentGoals = lazy(() => import('@/pages/InvestmentGoals'));
const InvestorMetrics = lazy(() => import('@/pages/InvestorMetrics'));
const InvestorPitch = lazy(() => import('@/pages/InvestorPitch'));
const InvestorPortal = lazy(() => import('@/pages/InvestorPortal'));
const InvestorRoom = lazy(() => import('@/pages/InvestorRoom'));
const InvoiceDetails = lazy(() => import('@/pages/InvoiceDetails'));
const InvoiceManagement = lazy(() => import('@/pages/InvoiceManagement'));
const KYCVerification = lazy(() => import('@/pages/KYCVerification'));
const KnowledgeBase = lazy(() => import('@/pages/KnowledgeBase'));
const LDAPIntegration = lazy(() => import('@/pages/LDAPIntegration'));
const LTVAnalysis = lazy(() => import('@/pages/LTVAnalysis'));
const LandingPage = lazy(() => import('@/pages/LandingPage'));
const LanguageExchangeAdmin = lazy(() => import('@/pages/LanguageExchangeAdmin'));
const LanguagePartnerDiscovery = lazy(() => import('@/pages/LanguagePartnerDiscovery'));
const LanguageSelector = lazy(() => import('@/pages/LanguageSelector'));
const LanguageSettings = lazy(() => import('@/pages/LanguageSettings'));
const LeadScoring = lazy(() => import('@/pages/LeadScoring'));
const Leaderboard = lazy(() => import('@/pages/Leaderboard'));
const Leaderboards = lazy(() => import('@/pages/Leaderboards'));
const Learning = lazy(() => import('@/pages/Learning'));
const LearningPath = lazy(() => import('@/pages/LearningPath'));
const LegalDocuments = lazy(() => import('@/pages/LegalDocuments'));
const LegendaryStatus = lazy(() => import('@/pages/LegendaryStatus'));
const LendingBorrow = lazy(() => import('@/pages/LendingBorrow'));
const LendingBorrowing = lazy(() => import('@/pages/LendingBorrowing'));
const LessonEditor = lazy(() => import('@/pages/LessonEditor'));
const LifeCommand = lazy(() => import('@/pages/LifeCommand'));
const Lightbox = lazy(() => import('@/pages/Lightbox'));
const LikeReactionSystem = lazy(() => import('@/pages/LikeReactionSystem'));
const Likes = lazy(() => import('@/pages/Likes'));
const LiquidStaking = lazy(() => import('@/pages/LiquidStaking'));
const LiquidityPools = lazy(() => import('@/pages/LiquidityPools'));
const ListView = lazy(() => import('@/pages/ListView'));
const Live = lazy(() => import('@/pages/Live'));
const LiveChat = lazy(() => import('@/pages/LiveChat'));
const LiveGifting = lazy(() => import('@/pages/LiveGifting'));
const LiveReactions = lazy(() => import('@/pages/LiveReactions'));
const LiveStreamSetup = lazy(() => import('@/pages/LiveStreamSetup'));
const LiveStreaming = lazy(() => import('@/pages/LiveStreaming'));
const LivestreamDashboard = lazy(() => import('@/pages/LivestreamDashboard'));
const LoadBalancing = lazy(() => import('@/pages/LoadBalancing'));
const LoadingDialog = lazy(() => import('@/pages/LoadingDialog'));
const LogViewer = lazy(() => import('@/pages/LogViewer'));
const Login = lazy(() => import('@/pages/Login'));
const LogisticsOptimizer = lazy(() => import('@/pages/LogisticsOptimizer'));

export default function LegacyRoutesGL() {
  return (
    <Switch>
      <Route path="/g-d-p-r" component={GDPR} />
      <Route path="/g-t-m-strategy" component={GTMStrategy} />
      <Route path="/gain-loss-tracking" component={GainLossTracking} />
      <Route path="/game-blackjack" component={GameBlackjack} />
      <Route path="/game-block-builder" component={GameBlockBuilder} />
      <Route path="/game-chat" component={GameChat} />
      <Route path="/game-crash" component={GameCrash} />
      <Route path="/game-crypto-quiz" component={GameCryptoQuiz} />
      <Route path="/game-fi-quest-board" component={GameFiQuestBoard} />
      <Route path="/game-high-low" component={GameHighLow} />
      <Route path="/game-lobby" component={GameLobby} />
      <Route path="/game-plinko" component={GamePlinko} />
      <Route path="/game-roulette" component={GameRoulette} />
      <Route path="/game-room" component={GameRoom} />
      <Route path="/game-settings" component={GameSettings} />
      <Route path="/game-slots" component={GameSlots} />
      <Route path="/game-token-tap" component={GameTokenTap} />
      <Route path="/game-sky-rush" component={GameSkyRush} />
      <Route path="/gaming" component={Gaming} />
      <Route path="/gaming-for-charity" component={GamingForCharity} />
      <Route path="/gantt-chart" component={GanttChart} />
      <Route path="/gas-fee-estimator" component={GasFeeEstimator} />
      <Route path="/gas-price-monitor" component={GasPriceMonitor} />
      <Route path="/gas-tracker" component={GasTracker} />
      <Route path="/general-settings" component={GeneralSettings} />
      <Route path="/generated-api-explorer" component={GeneratedApiExplorer} />
      <Route path="/generated-gallery" component={GeneratedGallery} />
      <Route path="/getting-started-guide" component={GettingStartedGuide} />
      <Route path="/ghost-mode" component={GhostMode} />
      <Route path="/global-operations-center" component={GlobalOperationsCenter} />
      <Route path="/global-search" component={GlobalSearch} />
      <Route path="/governance" component={Governance} />
      <Route path="/governance-voting" component={GovernanceVoting} />
      <Route path="/governance-wizard" component={GovernanceWizard} />
      <Route path="/grade-book" component={GradeBook} />
      <Route path="/group-chat" component={GroupChat} />
      <Route path="/group-chats" component={GroupChats} />
      <Route path="/group-directory" component={GroupDirectory} />
      <Route path="/group-events" component={GroupEvents} />
      <Route path="/group-management" component={GroupManagement} />
      <Route path="/growth" component={Growth} />
      <Route path="/guilds" component={Guilds} />
      <Route path="/h-i-p-a-a" component={HIPAA} />
      <Route path="/h-o-p-e-a-i-control" component={HOPEAIControl} />
      <Route path="/hash-rate-monitor" component={HashRateMonitor} />
      <Route path="/hashtag-explorer" component={HashtagExplorer} />
      <Route path="/hashtag-search" component={HashtagSearch} />
      <Route path="/hashtags" component={Hashtags} />
      <Route path="/health-articles" component={HealthArticles} />
      <Route path="/health-dashboard" component={HealthDashboard} />
      <Route path="/health-goals" component={HealthGoals} />
      <Route path="/help-center" component={HelpCenter} />
      <Route path="/hope-a-i" component={HopeAI} />
      <Route path="/hope-a-i-coach" component={HopeAICoach} />
      <Route path="/hope-a-i-advanced" component={HopeAIAdvanced} />
      <Route path="/hope-a-i-meta" component={HopeAIMeta} />
      <Route path="/hope-a-i-page" component={HopeAIPage} />
      <Route path="/hope-a-i-upgrades" component={HopeAIUpgrades} />
      <Route path="/hotel-search" component={HotelSearch} />
      <Route path="/hub-spot-integration" component={HubSpotIntegration} />
      <Route path="/i-c-o-launchpad" component={ICOLaunchpad} />
      <Route path="/i-f-t-t-t" component={IFTTT} />
      <Route path="/i-i-t-r" component={IITR} />
      <Route path="/i-t-services-landing" component={ITServicesLanding} />
      <Route path="/i-t-services-portal" component={ITServicesPortal} />
      <Route path="/image-editor" component={ImageEditor} />
      <Route path="/image-gallery" component={ImageGallery} />
      <Route path="/image-tools" component={ImageTools} />
      <Route path="/image-viewer" component={ImageViewer} />
      <Route path="/impact-map" component={ImpactMap} />
      <Route path="/impact-metrics" component={ImpactMetrics} />
      <Route path="/in-app-notifications" component={InAppNotifications} />
      <Route path="/in-game-currency" component={InGameCurrency} />
      <Route path="/incident-management" component={IncidentManagement} />
      <Route path="/input-dialog" component={InputDialog} />
      <Route path="/instructor-dashboard" component={InstructorDashboard} />
      <Route path="/integration-setup" component={IntegrationSetup} />
      <Route path="/integrations" component={Integrations} />
      <Route path="/inventory-management" component={InventoryManagement} />
      <Route path="/investment-goals" component={InvestmentGoals} />
      <Route path="/investor-metrics" component={InvestorMetrics} />
      <Route path="/investor-pitch" component={InvestorPitch} />
      <Route path="/investor-portal" component={InvestorPortal} />
      <Route path="/investor-room" component={InvestorRoom} />
      <Route path="/invoice-details" component={InvoiceDetails} />
      <Route path="/invoice-management" component={InvoiceManagement} />
      <Route path="/k-y-c-verification" component={KYCVerification} />
      <Route path="/knowledge-base" component={KnowledgeBase} />
      <Route path="/l-d-a-p-integration" component={LDAPIntegration} />
      <Route path="/l-t-v-analysis" component={LTVAnalysis} />
      <Route path="/landing-page" component={LandingPage} />
      <Route path="/language-exchange-admin" component={LanguageExchangeAdmin} />
      <Route path="/language-partner-discovery" component={LanguagePartnerDiscovery} />
      <Route path="/language-selector" component={LanguageSelector} />
      <Route path="/language-settings" component={LanguageSettings} />
      <Route path="/lead-scoring" component={LeadScoring} />
      <Route path="/leaderboard" component={Leaderboard} />
      <Route path="/leaderboards" component={Leaderboards} />
      <Route path="/learning" component={Learning} />
      <Route path="/learning-path" component={LearningPath} />
      <Route path="/legal-documents" component={LegalDocuments} />
      <Route path="/legendary-status" component={LegendaryStatus} />
      <Route path="/lending-borrow" component={LendingBorrow} />
      <Route path="/lending-borrowing" component={LendingBorrowing} />
      <Route path="/lesson-editor" component={LessonEditor} />
      <Route path="/life-command" component={LifeCommand} />
      <Route path="/lightbox" component={Lightbox} />
      <Route path="/like-reaction-system" component={LikeReactionSystem} />
      <Route path="/likes" component={Likes} />
      <Route path="/liquid-staking" component={LiquidStaking} />
      <Route path="/liquidity-pools" component={LiquidityPools} />
      <Route path="/list-view" component={ListView} />
      <Route path="/live" component={Live} />
      <Route path="/live-chat" component={LiveChat} />
      <Route path="/live-gifting" component={LiveGifting} />
      <Route path="/live-reactions" component={LiveReactions} />
      <Route path="/live-stream-setup" component={LiveStreamSetup} />
      <Route path="/live-streaming" component={LiveStreaming} />
      <Route path="/livestream-dashboard" component={LivestreamDashboard} />
      <Route path="/load-balancing" component={LoadBalancing} />
      <Route path="/loading-dialog" component={LoadingDialog} />
      <Route path="/log-viewer" component={LogViewer} />
      <Route path="/login" component={Login} />
      <Route path="/logistics-optimizer" component={LogisticsOptimizer} />
      <Route component={NotFound} />
    </Switch>
  );
}
