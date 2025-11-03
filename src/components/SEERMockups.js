import React, { useState, useEffect } from "react";
import {
  Home,
  Gamepad2,
  MessageCircle,
  User,
  Globe,
  LogIn,
  ChevronRight,
  PlusCircle,
  Search,
  Settings,
  X,
  Library,
  Dumbbell,
  Play,
  Heart,
  MessageSquare,
  Share,
  Edit,
  Award,
  Lock,
  Mail,
  Phone,
  Moon,
  Sun,
  Languages,
  ChevronLeft,
  Eye,
  EyeOff,
  Check,
  Send,
  QrCode,
  UserPlus,
  Scan,
  Copy,
  Mic,
  Smile,
  Plus,
  Image,
  Video,
  Crown,
  Sparkles,
  Download,
  Radio,
  UserX,
  Pin,
  Bookmark,
  Calendar,
  Briefcase,
  Users,
  Star,
  UserCheck,
  UserMinus,
  Coins,
  Gift,
  ShoppingBag,
  Shirt,
  Zap,
  TrendingUp,
  CheckCircle,
  Clock,
  Flame,
  MoreVertical,
  Reply,
  CheckCheck,
  File,
  Bell,
  Trash2,
  Edit3,
  Gem,
  Tv,
  Camera,
  MonitorPlay,
  Volume2,
  PhoneCall,
  Minus
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { GomokuLobby, GomokuGameScreen, GomokuLoadingScreen } from './GomokuGame';
import { ChessLobby, ChessGameScreen, ChessLoadingScreen } from './ChineseChess';
import { AIHub, AIChatScreen, AIImageScreen, AIMusicScreen, AIVideoScreen } from './AI';
import AILoadingScreen from './AI/AILoadingScreen';
import { adminLogin, adminMe, adminLogout } from '../services/AuthService';
import BuildingChatService from '../services/BuildingChatService';

/**
 * SEER Mobile UI Mockups (High‑Fidelity)
 * - Tailwind + lucide-react + framer-motion
 * - Each page is mapped from the user's JSON config and styled for a high-fidelity preview
 * - Color system: primary #6D5EEA (indigo-500/600 vibes), secondary #00D1B2 (teal/mint accent)
 */

const palette = {
  bg: "bg-slate-50",
  card: "bg-white",
  primary: "#6D5EEA",
  primaryRing: "ring-indigo-300",
  accent: "#00D1B2",
  text: "text-slate-800",
  subtext: "text-slate-500",
};

// Translation object for bilingual support
const translations = {
  en: {
    // Navigation
    home: "Home",
    games: "Games",
    chat: "Chat",
    map: "Map",
    mine: "Mine",
    // Common
    settings: "Settings",
    save: "Save",
    cancel: "Cancel",
    confirm: "Confirm",
    send: "Send",
    sent: "Sent",
    back: "Back",
    // Login Page
    welcomeBack: "Welcome back to SEER",
    emailOrUsername: "Email or Username",
    enterEmailOrUsername: "Enter your email or username",
    password: "Password",
    enterPassword: "Enter your password",
    login: "Log In",
    forgotPassword: "Forgot Password?",
    noAccount: "Don't have an account?",
    signUp: "Sign Up",
    // Registration
    createAccount: "Create Your Account",
    username: "Username",
    chooseUsername: "Choose a username",
    minCharacters: "Minimum 3 characters required",
    email: "Email",
    enterEmail: "Enter your email",
    createPassword: "Create a password",
    passwordStrength: "Minimum 8 characters with strong mix",
    confirmPassword: "Confirm Password",
    confirmYourPassword: "Confirm your password",
    alreadyHaveAccount: "Already have an account?",
    // Home
    forYou: "For You",
    following: "Following",
    new: "New",
    createPost: "Create Post",
    whatsOnYourMind: "What's on your mind?",
    addPhoto: "Add Photo",
    addVideo: "Add Video",
    post: "Post",
    selectImage: "Select Image",
    selectVideo: "Select Video",
    // Games
    gameLobby: "Game Lobby",
    featuredGames: "Featured Games",
    playNow: "Play now",
    online: "online",
    // Chat
    messages: "Messages",
    searchConversations: "Search conversations",
    typeMessage: "Type a message...",
    today: "Today",
    yesterday: "Yesterday",
    addFriend: "Add Friend",
    enterUserId: "Enter User ID",
    scanQRCode: "Scan QR Code",
    searchById: "Search by ID",
    userId: "User ID",
    copyId: "Copy ID",
    idCopied: "ID Copied!",
    // Profile
    profile: "Profile",
    editProfile: "Edit Profile",
    achievements: "Achievements",
    logOut: "Log Out",
    posts: "Posts",
    followers: "Followers",
    following_noun: "Following",
    myQRCode: "My QR Code",
    scanToAddFriend: "Scan to add friend",
    shareQRCode: "Share QR Code",
    // Settings
    appearance: "Appearance",
    darkMode: "Day/Night Mode",
    lightMode: "Light",
    nightMode: "Dark",
    language: "Language",
    accountSecurity: "Account Security",
    changePassword: "Change Password",
    bindEmail: "Bind Email",
    bindPhone: "Bind Phone",
    // Change Password
    currentPassword: "Current Password",
    enterCurrentPassword: "Enter your current password",
    newPassword: "New Password",
    enterNewPassword: "Enter your new password",
    confirmNewPassword: "Confirm New Password",
    confirmYourNewPassword: "Confirm your new password",
    updatePassword: "Update Password",
    // Bind Email
    emailAddress: "Email Address",
    enterEmailAddress: "Enter your email address",
    verificationCode: "Verification Code",
    enterCode: "Enter code",
    codeSentEmail: "Verification code sent to your email",
    // Bind Phone
    phoneNumber: "Phone Number",
    enterPhoneNumber: "Enter your phone number",
    codeSentPhone: "Verification code sent to your phone",
    // Map
    campusMap: "XJTLU Campus",
    interactiveMap: "Interactive Map",
    tapToMove: "Tap to move",
    library: "Library",
    sportsCenter: "Sports Center",
    enter: "Enter",
    // Forgot Password
    resetPassword: "Reset Password",
    selectVerification: "Select Verification Method",
    verifyByEmail: "Verify by Email",
    verifyByPhone: "Verify by Phone",
    emailVerification: "Email Verification",
    phoneVerification: "Phone Verification",
    verify: "Verify",
    resetYourPassword: "Reset Your Password",
    // Pro Upgrade
    upgradeToPro: "Upgrade to Pro",
    proSubscription: "Pro Subscription",
    unlockPremium: "Unlock Premium Features",
    perMonth: "/month",
    subscribePro: "Subscribe to Pro",
    proFeatures: "Pro Features",
    downloadVideos: "Download Videos",
    downloadVideosDesc: "Save videos for offline viewing",
    liveStreaming: "Live Streaming",
    liveStreamingDesc: "Start your own live streams",
    anonymousMode: "Anonymous Mode",
    anonymousModeDesc: "Browse and interact anonymously",
    pinPosts: "Pin Posts",
    pinPostsDesc: "Pin your posts to top for 10 minutes (10x/month)",
    proSupport: "Priority Support",
    proSupportDesc: "Get priority customer support",
    currentPlan: "Current Plan",
    freePlan: "Free Plan",
    proPlan: "Pro Plan",
    manageSub: "Manage Subscription",
    // Edit Profile
    birthday: "Birthday",
    selectBirthday: "Select your birthday",
    gender: "Gender",
    male: "Male",
    female: "Female",
    preferNotToSay: "Prefer not to say",
    major: "Major",
    selectMajor: "Select your major",
    bio: "Bio",
    editBio: "Edit your bio",
    saveChanges: "Save Changes",
    age: "Age",
    yearsOld: "years old",
    // Profile Tabs
    myPosts: "My Posts",
    likedPosts: "Liked Posts",
    savedPosts: "Saved Posts",
    noPosts: "No posts yet",
    noLikedPosts: "No liked posts yet",
    noSavedPosts: "No saved posts yet",
    // Follow Actions
    follow: "Follow",
    following_verb: "Following",
    specialFollow: "Special",
    setSpecialFollow: "Set as Special Follow",
    unfollowSpecial: "Unfollow Special Follow",
    unfollow: "Unfollow",
    // Pro Subscription Extended
    expiresOn: "Expires on",
    renewNow: "Renew Now",
    subscriptionActive: "Subscription Active",
    proMemberFor: "SEER Pro member for",
    days: "days",
    selectPlan: "Select Your Plan",
    month: "Month",
    months: "Months",
    savePercent: "Save",
    // Member Center
    memberCenter: "Member Center",
    myLevel: "My Level",
    coins: "Coins",
    diamonds: "Diamonds",
    diamondRecharge: "Diamond Recharge",
    diamondsDesc: "Diamonds can only be obtained via recharge or live-stream gifts. Use Diamonds to buy live gifts, purchase outfits, and extend Pro membership.",
    diamondsPricing: "Pricing",
    diamondsTier1: "$1 → 70 Diamonds",
    diamondsTier2: "$10 → 800 Diamonds",
    diamondsTier3: "$100 → 10,000 Diamonds",
    checkIn: "Check In",
    checkedIn: "Checked In",
    consecutiveDays: "Consecutive Days",
    dailyCheckIn: "Daily Check-In",
    checkInReward: "Get coins every day",
    earnCoins: "Earn Coins",
    recharge: "Recharge",
    coinShop: "Coin Shop",
    myItems: "My Items",
    levelPrivileges: "Level Privileges",
    currentLevel: "Current Level",
    nextLevel: "Next Level",
    expToNextLevel: "EXP to Next Level",
    totalExp: "Total EXP",
    // Pro Levels
    pro1: "Pro 1",
    pro2: "Pro 2",
    pro3: "Pro 3",
    pro4: "Pro 4",
    pro5: "Pro 5",
    // Shop Categories
    avatarFrames: "Avatar Frames",
    outfits: "Outfits",
    accessories: "Accessories",
    effects: "Effects",
    owned: "Owned",
    equip: "Equip",
    equipped: "Equipped",
    purchase: "Purchase",
    // Coin Packages
    coinPackage: "Coin Package",
    buyCoins: "Buy Coins",
    bonus: "Bonus",
    coinReward: "Coin Reward",
    coins: "Coins",
    buyDiamonds: "Buy Diamonds",
    useDiamondsFor: "Use Diamonds for",
    useDiamondsItems: "Live gifts · Outfits · Pro extension",
    // Notifications
    notifications: "Notifications",
    likeNotification: "liked your post",
    commentNotification: "commented on your post",
    followNotification: "started following you",
    systemNotification: "System Notification",
    noNotifications: "No notifications yet",
    markAllRead: "Mark All Read",
    // Search
    search: "Search",
    hotTopics: "Hot Topics",
    trendingSearches: "Trending Searches",
    searchUsers: "Search users",
    searchPosts: "Search posts",
    searchTopics: "Search topics",
    noResults: "No results found",
    // Comments
    comments: "Comments",
    viewComments: "View Comments",
    writeComment: "Write a comment...",
    reply: "Reply",
    replyTo: "Reply to",
    likesCount: "likes",
    repliesCount: "replies",
    // Topic/Hashtag
    topics: "Topics",
    topicPage: "Topic",
    postsCount: "posts",
    addTopic: "Add topic",
    trendingTopics: "Trending Topics",
    // Social Lists
    friendsList: "Friends List",
    fansList: "Fans List",
    followingList: "Following List",
    mutualFriends: "Mutual Friends",
    removeFollower: "Remove Follower",
    // Privacy & Security
    privacySecurity: "Privacy & Security",
    blockUser: "Block User",
    reportPost: "Report Post",
    notInterested: "Not Interested",
    blockAuthor: "Block Author",
    blockedUsers: "Blocked Users",
    postPrivacy: "Post Privacy",
    publicPost: "Public",
    friendsOnly: "Friends Only",
    privatePost: "Private",
    whoCanComment: "Who Can Comment",
    everyone: "Everyone",
    friendsCanComment: "Friends",
    nobodyCanComment: "Nobody",
    reportContent: "Report Content",
    reportReason: "Report Reason",
    spam: "Spam",
    harassment: "Harassment",
    inappropriate: "Inappropriate Content",
    deleteAccount: "Delete Account",
    // Friend Groups
    friendGroups: "Friend Groups",
    addressBook: "Address Book",
    allContacts: "All Contacts",
    createGroup: "Create Group",
    groupName: "Group Name",
    addToGroup: "Add to Group",
    family: "Family",
    colleagues: "Colleagues",
    classmates: "Classmates",
    // Live Streaming
    liveStream: "Live Stream",
    myLiveStream: "My Live Stream",
    startLiveStream: "Start Live Stream",
    goLive: "Go Live",
    liveNow: "LIVE",
    viewers: "viewers",
    sendGift: "Send Gift",
    liveTitle: "Live Title",
    enterLiveTitle: "Enter your live stream title",
    liveCategory: "Category",
    selectCategory: "Select a category",
    gaming: "Gaming",
    chatting: "Chatting",
    studying: "Studying",
    music: "Music",
    sports: "Sports",
    other: "Other",
    endLiveStream: "End Stream",
    liveSettings: "Live Settings",
    proOnlyFeature: "Pro Members Only",
    upgradeToUnlock: "Upgrade to Pro to unlock this feature",
    liveBlocked: "Live Streaming Locked",
    liveBlockedDesc: "Subscribe to Pro to unlock live streaming",
    watchingNow: "Watching now",
    gifts: "Gifts",
    liveChat: "Live Chat",
    shareStream: "Share Stream",
    viewerCount: "Viewer Count",
    likesReceived: "Likes Received",
    giftsReceived: "Gifts Received",
    streamDuration: "Duration",
    streamQuality: "Quality",
    high: "High",
    medium: "Medium",
    low: "Low",
    rose: "Rose",
    heart: "Heart",
    star: "Star",
    diamond: "Diamond",
    crown: "Crown",
    rocket: "Rocket",
    preview: "Preview",
  },
  zh: {
    // Navigation
    home: "首页",
    games: "游戏",
    chat: "聊天",
    map: "地图",
    mine: "我的",
    // Common
    settings: "设置",
    save: "保存",
    cancel: "取消",
    confirm: "确认",
    send: "发送",
    sent: "已发送",
    back: "返回",
    // Login Page
    welcomeBack: "欢迎回到 SEER",
    emailOrUsername: "邮箱或用户名",
    enterEmailOrUsername: "请输入邮箱或用户名",
    password: "密码",
    enterPassword: "请输入密码",
    login: "登录",
    forgotPassword: "忘记密码？",
    noAccount: "还没有账号？",
    signUp: "注册",
    // Registration
    createAccount: "创建您的账户",
    username: "用户名",
    chooseUsername: "选择一个用户名",
    minCharacters: "至少需要3个字符",
    email: "邮箱",
    enterEmail: "请输入您的邮箱",
    createPassword: "创建密码",
    passwordStrength: "至少8个字符，需包含数字和字母",
    confirmPassword: "确认密码",
    confirmYourPassword: "请确认您的密码",
    alreadyHaveAccount: "已有账号？",
    // Home
    forYou: "推荐",
    following: "关注",
    new: "发布",
    createPost: "创建帖子",
    whatsOnYourMind: "分享新鲜事...",
    addPhoto: "添加图片",
    addVideo: "添加视频",
    post: "发布",
    selectImage: "选择图片",
    selectVideo: "选择视频",
    // Games
    gameLobby: "游戏大厅",
    featuredGames: "精选游戏",
    playNow: "立即游戏",
    online: "在线",
    // Chat
    messages: "消息",
    searchConversations: "搜索对话",
    typeMessage: "输入消息...",
    today: "今天",
    yesterday: "昨天",
    addFriend: "添加好友",
    enterUserId: "输入用户ID",
    scanQRCode: "扫一扫",
    searchById: "通过ID搜索",
    userId: "用户ID",
    copyId: "复制ID",
    idCopied: "ID已复制！",
    // Profile
    profile: "个人资料",
    editProfile: "编辑资料",
    achievements: "成就",
    logOut: "退出登录",
    posts: "帖子",
    followers: "粉丝",
    following_noun: "关注",
    myQRCode: "我的二维码",
    scanToAddFriend: "扫码添加好友",
    shareQRCode: "分享二维码",
    // Settings
    appearance: "外观",
    darkMode: "日间/夜间 模式",
    lightMode: "日间",
    nightMode: "夜间",
    language: "语言",
    accountSecurity: "账户安全",
    changePassword: "修改密码",
    bindEmail: "绑定邮箱",
    bindPhone: "绑定手机",
    // Change Password
    currentPassword: "当前密码",
    enterCurrentPassword: "请输入当前密码",
    newPassword: "新密码",
    enterNewPassword: "请输入新密码",
    confirmNewPassword: "确认新密码",
    confirmYourNewPassword: "请确认新密码",
    updatePassword: "更新密码",
    // Bind Email
    emailAddress: "邮箱地址",
    enterEmailAddress: "请输入邮箱地址",
    verificationCode: "验证码",
    enterCode: "请输入验证码",
    codeSentEmail: "验证码已发送到您的邮箱",
    // Bind Phone
    phoneNumber: "手机号码",
    enterPhoneNumber: "请输入手机号码",
    codeSentPhone: "验证码已发送到您的手机",
    // Map
    campusMap: "西浦校园",
    interactiveMap: "互动地图",
    tapToMove: "点击移动",
    library: "图书馆",
    sportsCenter: "体育中心",
    enter: "进入",
    // Forgot Password
    resetPassword: "重置密码",
    selectVerification: "选择验证方式",
    verifyByEmail: "邮箱验证",
    verifyByPhone: "手机验证",
    emailVerification: "邮箱验证",
    phoneVerification: "手机验证",
    verify: "验证",
    resetYourPassword: "重置您的密码",
    // Pro Upgrade
    upgradeToPro: "升级至Pro",
    proSubscription: "Pro会员",
    unlockPremium: "解锁高级功能",
    perMonth: "/月",
    subscribePro: "订阅Pro会员",
    proFeatures: "Pro功能",
    downloadVideos: "下载视频",
    downloadVideosDesc: "保存视频离线观看",
    liveStreaming: "直播功能",
    liveStreamingDesc: "开启你的直播间",
    anonymousMode: "匿名模式",
    anonymousModeDesc: "匿名浏览和互动",
    pinPosts: "置顶帖子",
    pinPostsDesc: "置顶帖子10分钟（每月10次）",
    proSupport: "优先支持",
    proSupportDesc: "获得优先客服支持",
    currentPlan: "当前方案",
    freePlan: "免费版",
    proPlan: "Pro会员",
    manageSub: "管理订阅",
    // Edit Profile
    birthday: "生日",
    selectBirthday: "选择您的生日",
    gender: "性别",
    male: "男",
    female: "女",
    preferNotToSay: "不方便告知",
    major: "专业",
    selectMajor: "选择您的专业",
    bio: "个人简介",
    editBio: "编辑个人简介",
    saveChanges: "保存更改",
    age: "年龄",
    yearsOld: "岁",
    // Profile Tabs
    myPosts: "我的帖子",
    likedPosts: "点赞过的",
    savedPosts: "收藏的",
    noPosts: "暂无帖子",
    noLikedPosts: "暂无点赞",
    noSavedPosts: "暂无收藏",
    // Follow Actions
    follow: "关注",
    following_verb: "已关注",
    specialFollow: "特别关注",
    setSpecialFollow: "设为特别关注",
    unfollowSpecial: "取消特别关注",
    unfollow: "取消关注",
    // Pro Subscription Extended
    expiresOn: "到期时间",
    renewNow: "立即续费",
    subscriptionActive: "订阅已激活",
    proMemberFor: "已成为SEER Pro",
    days: "天",
    selectPlan: "选择订阅方案",
    month: "个月",
    months: "个月",
    savePercent: "省",
    // Member Center
    memberCenter: "会员中心",
    myLevel: "我的等级",
    coins: "金币",
    diamonds: "钻石",
    diamondRecharge: "钻石充值",
    diamondsDesc: "钻石仅可通过充值或直播礼物获得。可用于购买直播礼物、装扮、以及延长Pro账号时间。",
    diamondsPricing: "定价",
    diamondsTier1: "$1 → 70钻石",
    diamondsTier2: "$10 → 800钻石",
    diamondsTier3: "$100 → 10000钻石",
    checkIn: "签到",
    checkedIn: "已签到",
    consecutiveDays: "连续天数",
    dailyCheckIn: "每日签到",
    checkInReward: "每天领取金币",
    earnCoins: "赚取金币",
    recharge: "充值",
    coinShop: "金币商城",
    myItems: "我的物品",
    levelPrivileges: "等级特权",
    currentLevel: "当前等级",
    nextLevel: "下一等级",
    expToNextLevel: "升级所需经验",
    totalExp: "总经验值",
    // Pro Levels
    pro1: "Pro 1",
    pro2: "Pro 2",
    pro3: "Pro 3",
    pro4: "Pro 4",
    pro5: "Pro 5",
    // Shop Categories
    avatarFrames: "头像框",
    outfits: "服装",
    accessories: "配饰",
    effects: "特效",
    owned: "已拥有",
    equip: "装备",
    equipped: "已装备",
    purchase: "购买",
    // Coin Packages
    coinPackage: "金币礼包",
    buyCoins: "购买金币",
    bonus: "额外赠送",
    coinReward: "金币奖励",
    coins: "金币",
    buyDiamonds: "购买钻石",
    useDiamondsFor: "钻石可用于",
    useDiamondsItems: "直播礼物 · 装扮 · Pro续期",
    // Notifications
    notifications: "通知",
    likeNotification: "赞了你的帖子",
    commentNotification: "评论了你的帖子",
    followNotification: "关注了你",
    systemNotification: "系统通知",
    noNotifications: "暂无通知",
    markAllRead: "全部已读",
    // Search
    search: "搜索",
    hotTopics: "热门话题",
    trendingSearches: "热搜榜",
    searchUsers: "搜索用户",
    searchPosts: "搜索帖子",
    searchTopics: "搜索话题",
    noResults: "未找到结果",
    // Comments
    comments: "评论",
    viewComments: "查看评论",
    writeComment: "写评论...",
    reply: "回复",
    replyTo: "回复",
    likesCount: "赞",
    repliesCount: "回复",
    // Topic/Hashtag
    topics: "话题",
    topicPage: "话题",
    postsCount: "帖子",
    addTopic: "添加话题",
    trendingTopics: "热门话题",
    // Social Lists
    friendsList: "好友列表",
    fansList: "粉丝列表",
    followingList: "关注列表",
    mutualFriends: "共同好友",
    removeFollower: "移除粉丝",
    // Privacy & Security
    privacySecurity: "隐私与安全",
    blockUser: "屏蔽用户",
    reportPost: "举报",
    notInterested: "不感兴趣",
    blockAuthor: "屏蔽作者",
    blockedUsers: "黑名单",
    postPrivacy: "帖子隐私",
    publicPost: "公开",
    friendsOnly: "好友可见",
    privatePost: "私密",
    whoCanComment: "谁可以评论",
    everyone: "所有人",
    friendsCanComment: "好友",
    nobodyCanComment: "关闭评论",
    reportContent: "举报内容",
    reportReason: "举报原因",
    spam: "垃圾信息",
    harassment: "骚扰",
    inappropriate: "不当内容",
    deleteAccount: "注销账户",
    // Friend Groups
    friendGroups: "好友分组",
    addressBook: "通讯录",
    allContacts: "全部联系人",
    createGroup: "创建分组",
    groupName: "分组名称",
    addToGroup: "添加到分组",
    family: "家人",
    colleagues: "同事",
    classmates: "同学",
    // Live Streaming
    liveStream: "直播",
    myLiveStream: "我的直播间",
    startLiveStream: "开始直播",
    goLive: "开播",
    liveNow: "直播中",
    viewers: "观众",
    sendGift: "送礼物",
    liveTitle: "直播标题",
    enterLiveTitle: "输入直播标题",
    liveCategory: "分类",
    selectCategory: "选择分类",
    gaming: "游戏",
    chatting: "聊天",
    studying: "学习",
    music: "音乐",
    sports: "运动",
    other: "其他",
    endLiveStream: "结束直播",
    liveSettings: "直播设置",
    proOnlyFeature: "Pro会员专属",
    upgradeToUnlock: "升级至Pro会员解锁此功能",
    liveBlocked: "直播功能已锁定",
    liveBlockedDesc: "订阅Pro会员解锁直播功能",
    watchingNow: "正在观看",
    gifts: "礼物",
    liveChat: "聊天",
    shareStream: "分享直播",
    viewerCount: "观众数",
    likesReceived: "收到点赞",
    giftsReceived: "收到礼物",
    streamDuration: "时长",
    streamQuality: "画质",
    high: "高清",
    medium: "标清",
    low: "流畅",
    rose: "玫瑰",
    heart: "爱心",
    star: "星星",
    diamond: "钻石",
    crown: "皇冠",
    rocket: "火箭",
    preview: "预览",
  }
};

const t = (key, lang) => translations[lang][key] || key;

/* =================== PRO BADGE COMPONENT =================== */
function ProBadge({ size = "sm", onClick = null, clickable = false }) {
  const sizeClasses = {
    xs: "text-[10px] px-1.5 py-0.5",
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-2.5 py-1",
    lg: "text-base px-3 py-1",
  };

  const Component = clickable ? 'button' : 'span';

  return (
    <Component
      onClick={onClick}
      className={`${sizeClasses[size]} font-bold rounded-lg backdrop-blur-md border shadow-lg relative overflow-hidden ${clickable ? 'cursor-pointer hover:scale-105 transition-transform' : ''}`}
      style={{ 
        letterSpacing: '0.05em',
        background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.7) 0%, rgba(139, 92, 246, 0.7) 50%, rgba(79, 70, 229, 0.8) 100%)',
        borderColor: 'rgba(139, 92, 246, 0.8)',
        color: '#ffffff',
        textShadow: '0 0 12px rgba(139, 92, 246, 0.8)',
      }}
    >
      <span className="relative z-10">PRO</span>
      <span 
        className="absolute inset-0 opacity-60"
        style={{
          background: 'radial-gradient(circle at 30% 50%, rgba(167, 139, 250, 0.6) 0%, transparent 50%)',
        }}
      />
    </Component>
  );
}

function DeviceFrame({ children, title }) {
  return (
    <div className="w-full flex flex-col items-center gap-3">
      <div className="text-slate-700 text-xl font-semibold">{title}</div>
      <div className="relative rounded-[3rem] shadow-2xl p-4 bg-slate-200">
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-40 h-2 bg-slate-300 rounded-full" />
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-24 h-2 bg-slate-300 rounded-full" />
        <div id="seer-device-frame" className="w-[480px] h-[880px] rounded-[2.2rem] overflow-hidden bg-white shadow-xl">
          {children}
        </div>
      </div>
    </div>
  );
}

function TopBar({ title, right }) {
  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
      <div className="text-xl font-bold tracking-wide" style={{ color: palette.primary }}>{title}</div>
      <div className="flex items-center gap-2">{right}</div>
    </div>
  );
}

function BottomNav({ active, navigateTo, language = "en", darkMode = false }) {
  const item = (key, label, Icon, isActive) => (
    <button 
      onClick={() => navigateTo(key)}
      className={`flex flex-col items-center justify-center gap-1 transition-colors ${
        isActive 
          ? darkMode ? "text-indigo-400" : "text-indigo-600"
          : darkMode ? "text-slate-500" : "text-slate-400"
      } ${darkMode ? "hover:text-indigo-300" : "hover:text-indigo-500"}`}
    >
      <Icon className="w-6 h-6" />
      <span className="text-[11px]">{label}</span>
    </button>
  );
  return (
    <div className={`absolute bottom-0 left-0 right-0 backdrop-blur border-t px-6 py-2 transition-colors ${
      darkMode 
        ? "bg-slate-800/90 border-slate-700" 
        : "bg-white/90 border-slate-100"
    }`}>
      <div className="grid grid-cols-5 items-center">
        {item("home", t("home", language), Home, active === "home")}
        {item("games", t("games", language), Gamepad2, active === "games")}
        {item("chat", t("chat", language), MessageCircle, active === "chat")}
        {item("earth", t("map", language), Globe, active === "earth")}
        {item("mine", t("mine", language), User, active === "mine")}
      </div>
    </div>
  );
}


/* =================== LOGIN PAGE =================== */
function LoginPage({ navigateTo, language = "en", darkMode = false }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`h-full flex flex-col transition-colors duration-500 ${
        darkMode 
          ? "bg-gradient-to-b from-slate-900 to-slate-800" 
          : "bg-gradient-to-b from-[#F8FAFF] to-[#F2F4FF]"
      }`}
    >
      <div className="flex-1 px-6 pt-16">
        <div className="w-full flex flex-col items-center gap-8">
          {/* App Logo */}
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col items-center gap-3"
          >
            <img 
              src="/icon.png" 
              alt="SEER Logo" 
              className="w-20 h-20 rounded-3xl shadow-lg object-cover"
            />
            <div className={`text-sm transition-colors ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
              {t("welcomeBack", language)}
            </div>
          </motion.div>

          {/* Login Form */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="w-full flex flex-col gap-4"
          >
            <label className="flex flex-col gap-2">
              <span className={`text-sm font-medium transition-colors ${darkMode ? "text-slate-300" : "text-slate-600"}`}>
                {t("emailOrUsername", language)}
              </span>
              <input 
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={t("enterEmailOrUsername", language)}
                autoComplete="off"
                className={`px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition-all ${
                  darkMode 
                    ? "bg-slate-700/50 border-slate-600 text-white placeholder-slate-400" 
                    : "bg-white/80 border-slate-200 text-slate-900 placeholder-slate-400"
                }`}
              />
            </label>
            
            <label className="flex flex-col gap-2">
              <span className={`text-sm font-medium transition-colors ${darkMode ? "text-slate-300" : "text-slate-600"}`}>
                {t("password", language)}
              </span>
              <input 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t("enterPassword", language)}
                autoComplete="new-password"
                className={`px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition-all ${
                  darkMode 
                    ? "bg-slate-700/50 border-slate-600 text-white placeholder-slate-400" 
                    : "bg-white/80 border-slate-200 text-slate-900 placeholder-slate-400"
                }`}
              />
            </label>
            
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={async () => {
                if (isSubmitting) return;
                setError("");
                setIsSubmitting(true);
                const res = await adminLogin(username.trim(), password);
                setIsSubmitting(false);
                if (res.ok) {
                  navigateTo(res.isAdmin ? 'admin-dashboard' : 'home');
                } else {
                  setError(res.message || '用户名或密码错误');
                }
              }}
              disabled={!username || !password || isSubmitting}
              className={`mt-4 w-full py-3.5 rounded-xl text-white font-semibold shadow-lg transition-all ${(!username || !password || isSubmitting) ? 'bg-slate-300 cursor-not-allowed' : 'bg-gradient-to-r from-indigo-600 to-indigo-500 hover:shadow-xl'}`}
            >
              {isSubmitting ? '登录中…' : t("login", language)}
            </motion.button>
            
            <button 
              onClick={() => navigateTo('forgot-password')}
              className="text-indigo-600 text-sm self-center hover:text-indigo-700 transition-colors"
            >
              {t("forgotPassword", language)}
            </button>
            {error && (
              <div className={`text-sm mt-2 text-center ${darkMode ? 'text-rose-400' : 'text-rose-600'}`}>{error}</div>
            )}
          </motion.div>
        </div>
      </div>

      <div className={`px-6 pb-8 text-center text-sm transition-colors ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
        {t("noAccount", language)}{" "}
        <button 
          onClick={() => navigateTo('register')}
          className={`font-medium transition-colors ${
            darkMode ? "text-indigo-400 hover:text-indigo-300" : "text-indigo-600 hover:text-indigo-700"
          }`}
        >
          {t("signUp", language)}
        </button>
      </div>
    </motion.div>
  );
}

/* =================== ADMIN DASHBOARD PAGE =================== */
function AdminDashboardPage({ navigateTo, language = 'en', darkMode = false }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [reports, setReports] = useState([]);
  const [logs, setLogs] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [authChecked, setAuthChecked] = useState(false);
  const [authorized, setAuthorized] = useState(false);

  const readLocal = (key, fallback) => {
    if (typeof window === 'undefined') return fallback;
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (_) {
      return fallback;
    }
  };

  const writeLocal = (key, value) => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (_) {}
  };

  const appendLog = (message) => {
    const entry = { id: Date.now().toString(), time: new Date().toISOString(), message };
    const next = [entry, ...logs].slice(0, 200);
    setLogs(next);
    writeLocal('seer_admin_actions_log', next);
  };

  const getDefaultUsers = () => ([
    { id: 'u001', name: 'Alice', avatar: '/Alice.png', status: 'active', mutedUntil: null },
    { id: 'u002', name: 'Bob', avatar: '/Bob.png', status: 'active', mutedUntil: null },
    { id: 'u003', name: 'Charlie', avatar: '/Charlie.png', status: 'active', mutedUntil: null },
    { id: 'u004', name: 'Emma', avatar: '/Emma.png', status: 'active', mutedUntil: null },
    { id: 'u005', name: 'Dana', avatar: '/Dana.png', status: 'active', mutedUntil: null },
  ]);

  const getDefaultPosts = () => ([
    { id: 'p1', authorId: 'u001', authorName: 'Alice', authorAvatar: '/Alice.png', content: 'Exploring campus today! #XJTLU', time: '2h ago', banned: false },
    { id: 'p2', authorId: 'u002', authorName: 'Bob', authorAvatar: '/Bob.png', content: 'Group study at library, join us!', time: '3h ago', banned: false },
    { id: 'p3', authorId: 'u003', authorName: 'Charlie', authorAvatar: '/Charlie.png', content: 'Selling used textbooks, DM me.', time: '5h ago', banned: false },
    { id: 'p4', authorId: 'u004', authorName: 'Emma', authorAvatar: '/Emma.png', content: 'New club event this Friday!', time: '1d ago', banned: false },
    { id: 'p5', authorId: 'u005', authorName: 'Dana', authorAvatar: '/Dana.png', content: 'Beautiful sunset over the quad 🌇', time: '2d ago', banned: false },
  ]);

  const getDefaultReports = () => ([
    { id: 'r1', type: 'post', targetId: 'p3', targetName: 'Post p3', reporter: 'Alice', reason: '广告/Spam', time: '1h ago', status: 'pending' },
    { id: 'r2', type: 'user', targetId: 'u002', targetName: 'Bob', reporter: 'Charlie', reason: '不当言论', time: '4h ago', status: 'pending' },
    { id: 'r3', type: 'post', targetId: 'p2', targetName: 'Post p2', reporter: 'Emma', reason: '骚扰', time: '1d ago', status: 'resolved' },
  ]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const ok = await adminMe();
      if (cancelled) return;
      if (!ok) {
        navigateTo('login');
        return;
      }
      setAuthorized(true);
      const initUsers = readLocal('seer_admin_users', getDefaultUsers());
      const initPosts = readLocal('seer_admin_posts', getDefaultPosts());
      const initReports = readLocal('seer_admin_reports', getDefaultReports());
      const initLogs = readLocal('seer_admin_actions_log', []);
      setUsers(initUsers);
      setPosts(initPosts);
      setReports(initReports);
      setLogs(initLogs);
      setAuthChecked(true);
    })();
    return () => { cancelled = true; };
  }, []);

  const persistAll = (nextUsers, nextPosts, nextReports) => {
    writeLocal('seer_admin_users', nextUsers);
    writeLocal('seer_admin_posts', nextPosts);
    writeLocal('seer_admin_reports', nextReports);
  };

  const handleLogout = async () => {
    await adminLogout();
    navigateTo('login');
  };

  const togglePostBan = (postId) => {
    const post = posts.find(p => p.id === postId);
    const newBanned = !post?.banned;
    const next = posts.map(p => p.id === postId ? { ...p, banned: newBanned } : p);
    setPosts(next);
    persistAll(users, next, reports);
    appendLog(`${post?.authorName || ''} 的帖子(${postId}) ${newBanned ? '已封禁' : '已解禁'}`);
  };

  const deletePost = (postId) => {
    if (typeof window !== 'undefined' && !window.confirm('确认删除该帖子？')) return;
    const next = posts.filter(p => p.id !== postId);
    setPosts(next);
    persistAll(users, next, reports);
    appendLog(`删除帖子 ${postId}`);
  };

  const muteUserDays = (userId, days = 7) => {
    const until = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();
    const next = users.map(u => u.id === userId ? { ...u, status: 'muted', mutedUntil: until } : u);
    setUsers(next);
    persistAll(next, posts, reports);
    const u = users.find(x => x.id === userId);
    appendLog(`禁言用户 ${u?.name || userId} ${days} 天`);
  };

  const unmuteUser = (userId) => {
    const next = users.map(u => u.id === userId ? { ...u, status: 'active', mutedUntil: null } : u);
    setUsers(next);
    persistAll(next, posts, reports);
    const u = users.find(x => x.id === userId);
    appendLog(`解除禁言 ${u?.name || userId}`);
  };

  const toggleUserBan = (userId) => {
    const u = users.find(x => x.id === userId);
    const newStatus = u?.status === 'banned' ? 'active' : 'banned';
    const next = users.map(x => x.id === userId ? { ...x, status: newStatus } : x);
    setUsers(next);
    persistAll(next, posts, reports);
    appendLog(`${u?.name || userId} ${newStatus === 'banned' ? '已封禁' : '已解封'}`);
  };

  const resolveReport = (reportId) => {
    const next = reports.map(r => r.id === reportId ? { ...r, status: 'resolved' } : r);
    setReports(next);
    persistAll(users, posts, next);
    appendLog(`处理举报 ${reportId}`);
  };

  const resetData = () => {
    const initUsers = getDefaultUsers();
    const initPosts = getDefaultPosts();
    const initReports = getDefaultReports();
    setUsers(initUsers);
    setPosts(initPosts);
    setReports(initReports);
    persistAll(initUsers, initPosts, initReports);
    appendLog('重置后台数据');
  };

  const exportLogs = () => {
    const blob = new Blob([JSON.stringify(logs, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'seer-admin-logs.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredPosts = posts.filter(p => {
    if (!searchText.trim()) return true;
    const q = searchText.toLowerCase();
    return p.content.toLowerCase().includes(q) || p.authorName.toLowerCase().includes(q) || p.id.toLowerCase().includes(q);
  });

  const filteredUsers = users.filter(u => {
    if (!searchText.trim()) return true;
    const q = searchText.toLowerCase();
    return u.name.toLowerCase().includes(q) || u.id.toLowerCase().includes(q);
  });

  const pendingReports = reports.filter(r => r.status === 'pending');

  if (!authChecked || !authorized) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`h-full flex items-center justify-center ${darkMode ? 'bg-slate-900' : 'bg-slate-50'}`}>
        <div className={`${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>正在校验权限…</div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`h-full flex flex-col ${darkMode ? 'bg-slate-900' : 'bg-slate-50'}`}
    >
      {/* Header */}
      <div className={`px-4 py-3 border-b flex items-center justify-between ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigateTo('home')}
            className={`p-2 rounded-lg ${darkMode ? 'hover:bg-slate-700' : 'hover:bg-slate-100'}`}
          >
            <ChevronLeft className={`w-5 h-5 ${darkMode ? 'text-slate-300' : 'text-slate-600'}`} />
          </button>
          <div className={`text-lg font-bold ${darkMode ? 'text-slate-100' : 'text-slate-800'}`}>后台监控</div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleLogout}
            className={`px-3 py-2 rounded-lg text-sm font-medium ${darkMode ? 'bg-slate-700 text-slate-200 hover:bg-slate-600' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
          >
            退出登录
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4 pt-3">
        <div className={`inline-flex rounded-xl p-1 ${darkMode ? 'bg-slate-800' : 'bg-white'} border ${darkMode ? 'border-slate-700' : 'border-slate-200'}`}>
          {[
            { id: 'overview', label: '首页' },
            { id: 'posts', label: '帖子管理' },
            { id: 'users', label: '用户管理' },
            { id: 'reports', label: '举报处理' },
            { id: 'settings', label: '系统设置' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-2 rounded-lg text-sm font-medium ${activeTab === tab.id ? 'bg-indigo-600 text-white' : (darkMode ? 'text-slate-300 hover:bg-slate-700' : 'text-slate-600 hover:bg-slate-100')}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {activeTab === 'overview' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className={`rounded-2xl p-4 shadow ${darkMode ? 'bg-slate-800' : 'bg-white'}`}>
                <div className="text-sm text-slate-500">用户</div>
                <div className="text-2xl font-bold mt-1">{users.length}</div>
                <div className="text-xs text-slate-400 mt-1 flex items-center gap-2"><Users className="w-4 h-4" /> 总数</div>
              </div>
              <div className={`rounded-2xl p-4 shadow ${darkMode ? 'bg-slate-800' : 'bg-white'}`}>
                <div className="text-sm text-slate-500">被禁言</div>
                <div className="text-2xl font-bold mt-1">{users.filter(u => u.status === 'muted').length}</div>
                <div className="text-xs text-slate-400 mt-1">当前禁言中的用户</div>
              </div>
              <div className={`rounded-2xl p-4 shadow ${darkMode ? 'bg-slate-800' : 'bg-white'}`}>
                <div className="text-sm text-slate-500">帖子</div>
                <div className="text-2xl font-bold mt-1">{posts.length}</div>
                <div className="text-xs text-slate-400 mt-1">总帖子数</div>
              </div>
              <div className={`rounded-2xl p-4 shadow ${darkMode ? 'bg-slate-800' : 'bg-white'}`}>
                <div className="text-sm text-slate-500">被封禁的帖子</div>
                <div className="text-2xl font-bold mt-1">{posts.filter(p => p.banned).length}</div>
                <div className="text-xs text-slate-400 mt-1">违规处理数量</div>
              </div>
            </div>

            <div className={`rounded-2xl p-4 shadow ${darkMode ? 'bg-slate-800' : 'bg-white'}`}>
              <div className="flex items-center justify-between mb-2">
                <div className="text-base font-semibold">待处理举报</div>
                <div className="text-sm text-slate-500">{pendingReports.length} 条</div>
              </div>
              <div className="space-y-2">
                {pendingReports.slice(0, 5).map(r => (
                  <div key={r.id} className={`flex items-center justify-between p-3 rounded-xl ${darkMode ? 'bg-slate-900/40' : 'bg-slate-50'}`}>
                    <div className="text-sm">
                      <span className="font-medium">{r.reporter}</span> 举报 {r.type === 'post' ? '帖子' : '用户'} <span className="font-medium">{r.targetName}</span> ・ {r.reason}
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => resolveReport(r.id)} className={`px-3 py-1 rounded-lg text-xs font-medium ${darkMode ? 'bg-indigo-600 text-white' : 'bg-indigo-600 text-white'}`}>标记为已处理</button>
                    </div>
                  </div>
                ))}
                {pendingReports.length === 0 && (
                  <div className={`p-3 rounded-xl text-sm ${darkMode ? 'bg-slate-900/40 text-slate-400' : 'bg-slate-50 text-slate-500'}`}>暂无待处理举报</div>
                )}
              </div>
            </div>

            <div className={`rounded-2xl p-4 shadow ${darkMode ? 'bg-slate-800' : 'bg-white'}`}>
              <div className="text-base font-semibold mb-2">操作日志</div>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {logs.map(l => (
                  <div key={l.id} className={`text-sm p-2 rounded-lg ${darkMode ? 'bg-slate-900/40' : 'bg-slate-50'}`}>
                    <span className="text-slate-400">[{new Date(l.time).toLocaleString()}]</span> {l.message}
                  </div>
                ))}
                {logs.length === 0 && <div className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>暂无日志</div>}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'posts' && (
          <div className="space-y-3">
            <div className="flex gap-2">
              <input
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="搜索帖子/作者/ID…"
                className={`flex-1 px-4 py-2 rounded-lg border ${darkMode ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500' : 'bg-white border-slate-200'}`}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredPosts.map(p => (
                <div key={p.id} className={`rounded-2xl p-4 shadow ${darkMode ? 'bg-slate-800' : 'bg-white'}`}>
                  <div className="flex items-center gap-3">
                    <img src={p.authorAvatar} alt={p.authorName} className="w-10 h-10 rounded-full object-cover" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold">{p.authorName} <span className="text-slate-400 font-normal">· {p.time}</span></div>
                      <div className={`text-sm mt-1 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>{p.content}</div>
                    </div>
                    <div>
                      <span className={`px-2 py-1 rounded text-xs ${p.banned ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-700'}`}>{p.banned ? '已封禁' : '正常'}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-3">
                    <button onClick={() => togglePostBan(p.id)} className={`px-3 py-2 rounded-lg text-sm font-medium ${p.banned ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'}`}>{p.banned ? '解禁' : '封禁'}</button>
                    <button onClick={() => deletePost(p.id)} className={`px-3 py-2 rounded-lg text-sm font-medium ${darkMode ? 'bg-slate-700 text-slate-100' : 'bg-slate-100 text-slate-700'}`}>删除</button>
                    <button onClick={() => navigateTo('post-detail', { postId: p.id })} className={`px-3 py-2 rounded-lg text-sm font-medium ${darkMode ? 'bg-indigo-600 text-white' : 'bg-indigo-600 text-white'}`}>查看详情</button>
                  </div>
                </div>
              ))}
            </div>
            {filteredPosts.length === 0 && (
              <div className={`p-4 rounded-xl text-sm ${darkMode ? 'bg-slate-800 text-slate-400' : 'bg-white text-slate-500'}`}>没有匹配的帖子</div>
            )}
          </div>
        )}

        {activeTab === 'users' && (
          <div className="space-y-3">
            <div className="flex gap-2">
              <input
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="搜索用户/ID…"
                className={`flex-1 px-4 py-2 rounded-lg border ${darkMode ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500' : 'bg-white border-slate-200'}`}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredUsers.map(u => (
                <div key={u.id} className={`rounded-2xl p-4 shadow ${darkMode ? 'bg-slate-800' : 'bg-white'}`}>
                  <div className="flex items-center gap-3">
                    <img src={u.avatar} alt={u.name} className="w-10 h-10 rounded-full object-cover" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold">{u.name} <span className="text-slate-400 font-normal">· {u.id}</span></div>
                      <div className="text-xs text-slate-500">{u.status === 'muted' && u.mutedUntil ? `禁言至 ${new Date(u.mutedUntil).toLocaleString()}` : u.status === 'banned' ? '已封禁' : '正常'}</div>
                    </div>
                    <div>
                      <span className={`px-2 py-1 rounded text-xs ${u.status === 'banned' ? 'bg-rose-100 text-rose-600' : u.status === 'muted' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>{u.status === 'banned' ? '封禁' : u.status === 'muted' ? '禁言' : '正常'}</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 mt-3">
                    {u.status !== 'muted' && <button onClick={() => muteUserDays(u.id, 7)} className={`px-3 py-2 rounded-lg text-sm font-medium ${darkMode ? 'bg-amber-500 text-white' : 'bg-amber-500 text-white'}`}>禁言7天</button>}
                    {u.status === 'muted' && <button onClick={() => unmuteUser(u.id)} className={`px-3 py-2 rounded-lg text-sm font-medium ${darkMode ? 'bg-emerald-600 text-white' : 'bg-emerald-600 text-white'}`}>解除禁言</button>}
                    <button onClick={() => toggleUserBan(u.id)} className={`px-3 py-2 rounded-lg text-sm font-medium ${u.status === 'banned' ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'}`}>{u.status === 'banned' ? '解封' : '封禁'}</button>
                    <button onClick={() => navigateTo('user-profile', { userId: u.id })} className={`px-3 py-2 rounded-lg text-sm font-medium ${darkMode ? 'bg-indigo-600 text-white' : 'bg-indigo-600 text-white'}`}>查看资料</button>
                  </div>
                </div>
              ))}
            </div>
            {filteredUsers.length === 0 && (
              <div className={`p-4 rounded-xl text-sm ${darkMode ? 'bg-slate-800 text-slate-400' : 'bg-white text-slate-500'}`}>没有匹配的用户</div>
            )}
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="space-y-3">
            {reports.map(r => (
              <div key={r.id} className={`rounded-2xl p-4 shadow ${darkMode ? 'bg-slate-800' : 'bg-white'}`}>
                <div className="flex items-center justify-between">
                  <div className="min-w-0">
                    <div className="text-sm font-semibold">{r.type === 'post' ? '帖子' : '用户'} · {r.targetName}</div>
                    <div className={`text-xs mt-1 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>举报人：{r.reporter} ・ 原因：{r.reason} ・ 时间：{r.time}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded text-xs ${r.status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>{r.status === 'pending' ? '待处理' : '已处理'}</span>
                    {r.status === 'pending' && (<button onClick={() => resolveReport(r.id)} className={`px-3 py-2 rounded-lg text-sm font-medium ${darkMode ? 'bg-indigo-600 text-white' : 'bg-indigo-600 text-white'}`}>标记为已处理</button>)}
                    {r.type === 'post' && <button onClick={() => togglePostBan(r.targetId)} className={`px-3 py-2 rounded-lg text-sm font-medium ${darkMode ? 'bg-rose-600 text-white' : 'bg-rose-600 text-white'}`}>封禁帖子</button>}
                    {r.type === 'user' && <button onClick={() => toggleUserBan(r.targetId)} className={`px-3 py-2 rounded-lg text-sm font-medium ${darkMode ? 'bg-rose-600 text-white' : 'bg-rose-600 text-white'}`}>封禁用户</button>}
                  </div>
                </div>
              </div>
            ))}
            {reports.length === 0 && (
              <div className={`p-4 rounded-xl text-sm ${darkMode ? 'bg-slate-800 text-slate-400' : 'bg-white text-slate-500'}`}>暂无举报记录</div>
            )}
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-4">
            <div className={`rounded-2xl p-4 shadow ${darkMode ? 'bg-slate-800' : 'bg-white'}`}>
              <div className="text-base font-semibold mb-2">管理员信息</div>
              <div className={`text-sm ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>账号：{(typeof window !== 'undefined' && localStorage.getItem('seer_admin_name')) || 'Admin'}</div>
            </div>

            <div className={`rounded-2xl p-4 shadow ${darkMode ? 'bg-slate-800' : 'bg-white'}`}>
              <div className="text-base font-semibold mb-2">数据维护</div>
              <div className="flex flex-wrap gap-2">
                <button onClick={resetData} className={`px-3 py-2 rounded-lg text-sm font-medium ${darkMode ? 'bg-slate-700 text-slate-100 hover:bg-slate-600' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>重置演示数据</button>
                <button onClick={exportLogs} className={`px-3 py-2 rounded-lg text-sm font-medium ${darkMode ? 'bg-indigo-600 text-white' : 'bg-indigo-600 text-white'}`}>导出操作日志</button>
                <button onClick={() => { setLogs([]); writeLocal('seer_admin_actions_log', []); }} className={`px-3 py-2 rounded-lg text-sm font-medium ${darkMode ? 'bg-rose-600 text-white' : 'bg-rose-600 text-white'}`}>清空日志</button>
              </div>
            </div>

            <div className={`rounded-2xl p-4 shadow ${darkMode ? 'bg-slate-800' : 'bg-white'}`}>
              <div className="text-base font-semibold mb-2">会话</div>
              <button onClick={handleLogout} className={`px-3 py-2 rounded-lg text-sm font-medium ${darkMode ? 'bg-slate-700 text-slate-100 hover:bg-slate-600' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>退出登录</button>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

/* =================== DIAMOND RECHARGE PAGE =================== */
function DiamondRechargePage({ navigateTo, language = 'en', darkMode = false }) {
  const diamondPackages = [
    { diamonds: 70, price: 1 },
    { diamonds: 800, price: 10 },
    { diamonds: 10000, price: 100 },
  ];

  const [isPaying, setIsPaying] = useState(false);

  const handleBuy = (pkg) => {
    if (typeof window === 'undefined') return;
    setIsPaying(true);
    setTimeout(() => {
      const current = parseInt(localStorage.getItem('seer_diamonds') || '0', 10);
      const next = current + pkg.diamonds;
      localStorage.setItem('seer_diamonds', next.toString());
      setIsPaying(false);
      navigateTo('member-center');
    }, 1000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`h-full flex flex-col ${darkMode ? 'bg-slate-900' : 'bg-slate-50'}`}
    >
      {/* Header */}
      <div className={`px-4 py-3 border-b flex items-center justify-between ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
        <button
          onClick={() => navigateTo('member-center')}
          className={`p-2 rounded-full ${darkMode ? 'hover:bg-slate-700' : 'hover:bg-slate-100'}`}
        >
          <ChevronLeft className={`w-5 h-5 ${darkMode ? 'text-slate-300' : 'text-slate-600'}`} />
        </button>
        <div className={`text-lg font-bold ${darkMode ? 'text-slate-100' : 'text-slate-800'}`}>
          {t('diamondRecharge', language)}
        </div>
        <div className="w-9" />
      </div>

      <div className="flex-1 overflow-y-auto px-4 pt-4 space-y-4">
        {/* Intro Card */}
        <div className={`rounded-2xl p-5 shadow-lg ${darkMode ? 'bg-slate-800' : 'bg-white'}`}>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-fuchsia-500 to-pink-500 flex items-center justify-center">
              <Gem className="w-5 h-5 text-white" />
            </div>
            <div className={`text-base font-semibold ${darkMode ? 'text-slate-100' : 'text-slate-800'}`}>{t('diamonds', language)}</div>
          </div>
          <div className={`${darkMode ? 'text-slate-300' : 'text-slate-600'} text-sm`}>{t('diamondsDesc', language)}</div>
        </div>

        {/* Pricing Card */}
        <div className={`rounded-2xl p-5 shadow-lg ${darkMode ? 'bg-slate-800' : 'bg-white'}`}>
          <div className={`text-base font-semibold mb-3 ${darkMode ? 'text-slate-100' : 'text-slate-800'}`}>{t('diamondsPricing', language)}</div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {diamondPackages.map((pkg) => (
              <div key={pkg.price} className={`rounded-xl p-4 border ${darkMode ? 'bg-slate-900/40 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Gem className="w-4 h-4 text-pink-500" />
                    <div className={`text-sm font-semibold ${darkMode ? 'text-slate-100' : 'text-slate-800'}`}>{pkg.diamonds} {t('diamonds', language)}</div>
                  </div>
                  <div className={`text-sm ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>${pkg.price}</div>
                </div>
                <button
                  onClick={() => handleBuy(pkg)}
                  disabled={isPaying}
                  className={`w-full py-2 rounded-lg text-sm font-semibold ${isPaying ? (darkMode ? 'bg-slate-700 text-slate-500' : 'bg-slate-200 text-slate-400') : 'bg-gradient-to-r from-pink-500 to-rose-500 text-white'}`}
                >
                  {isPaying ? 'Processing…' : t('buyDiamonds', language)}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Usage Tips */}
        <div className={`rounded-2xl p-5 shadow-lg ${darkMode ? 'bg-slate-800' : 'bg-white'}`}>
          <div className={`text-base font-semibold mb-2 ${darkMode ? 'text-slate-100' : 'text-slate-800'}`}>{t('useDiamondsFor', language)}</div>
          <div className={`${darkMode ? 'text-slate-300' : 'text-slate-600'} text-sm`}>{t('useDiamondsItems', language)}</div>
        </div>
      </div>
    </motion.div>
  );
}

/* =================== REGISTRATION PAGE =================== */
function RegistrationPage({ navigateTo, language = "en", darkMode = false }) {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`h-full flex flex-col transition-colors duration-500 ${darkMode ? "bg-slate-900" : "bg-white"}`}
    >
      <div className={`flex items-center justify-between px-4 py-3 border-b transition-colors ${
        darkMode ? "border-slate-700 bg-slate-800" : "border-slate-100 bg-white"
      }`}>
        <button 
          onClick={() => navigateTo('login')}
          className={`p-2 -ml-2 rounded-lg transition-colors ${
            darkMode ? "hover:bg-slate-700" : "hover:bg-slate-50"
          }`}
        >
          <ChevronLeft className={`w-6 h-6 transition-colors ${darkMode ? "text-slate-300" : "text-slate-600"}`} />
        </button>
        <div className={`text-xl font-bold tracking-wide transition-colors ${
          darkMode ? "text-indigo-400" : "text-indigo-600"
        }`}>
          {t("createAccount", language)}
        </div>
        <div className="w-10"></div>
      </div>
      
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex flex-col gap-4"
        >
          <label className="flex flex-col gap-2">
            <span className={`text-sm font-medium transition-colors ${darkMode ? "text-slate-300" : "text-slate-600"}`}>
              {t("username", language)}
            </span>
            <input 
              type="text"
              value={formData.username}
              onChange={(e) => handleInputChange('username', e.target.value)}
              placeholder={t("chooseUsername", language)}
              className={`px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition-all ${
                darkMode 
                  ? "bg-slate-800 border-slate-700 text-white placeholder-slate-500" 
                  : "bg-white border-slate-200 text-slate-900 placeholder-slate-400"
              }`}
            />
            <span className={`text-xs transition-colors ${darkMode ? "text-slate-500" : "text-slate-400"}`}>
              {t("minCharacters", language)}
            </span>
          </label>
          
          <label className="flex flex-col gap-2">
            <span className={`text-sm font-medium transition-colors ${darkMode ? "text-slate-300" : "text-slate-600"}`}>
              {t("email", language)}
            </span>
            <input 
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder={t("enterEmail", language)}
              className={`px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition-all ${
                darkMode 
                  ? "bg-slate-800 border-slate-700 text-white placeholder-slate-500" 
                  : "bg-white border-slate-200 text-slate-900 placeholder-slate-400"
              }`}
            />
          </label>
          
          <label className="flex flex-col gap-2">
            <span className={`text-sm font-medium transition-colors ${darkMode ? "text-slate-300" : "text-slate-600"}`}>
              {t("password", language)}
            </span>
            <input 
              type="password"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              placeholder={t("createPassword", language)}
              className={`px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition-all ${
                darkMode 
                  ? "bg-slate-800 border-slate-700 text-white placeholder-slate-500" 
                  : "bg-white border-slate-200 text-slate-900 placeholder-slate-400"
              }`}
            />
            <span className={`text-xs transition-colors ${darkMode ? "text-slate-500" : "text-slate-400"}`}>
              {t("passwordStrength", language)}
            </span>
          </label>
          
          <label className="flex flex-col gap-2">
            <span className={`text-sm font-medium transition-colors ${darkMode ? "text-slate-300" : "text-slate-600"}`}>
              {t("confirmPassword", language)}
            </span>
            <input 
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              placeholder={t("confirmYourPassword", language)}
              className={`px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition-all ${
                darkMode 
                  ? "bg-slate-800 border-slate-700 text-white placeholder-slate-500" 
                  : "bg-white border-slate-200 text-slate-900 placeholder-slate-400"
              }`}
            />
          </label>
          
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigateTo('home')}
            className="mt-6 w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 text-white font-semibold shadow-lg hover:shadow-xl transition-all"
          >
            {t("signUp", language)}
          </motion.button>
          
          <div className={`text-center text-sm mt-4 transition-colors ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
            {t("alreadyHaveAccount", language)}{" "}
            <button 
              onClick={() => navigateTo('login')}
              className={`font-medium transition-colors ${
                darkMode ? "text-indigo-400 hover:text-indigo-300" : "text-indigo-600 hover:text-indigo-700"
              }`}
            >
              {t("login", language)}
            </button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

/* =================== POST CARD =================== */
function PostCard({ id, type, content, username, avatar, likes, comments, thumbnail, videoSrc, darkMode = false, major = '', time = '2h ago', isPro = false, userId = 'u001', navigateTo, language = "en" }) {
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [showReportMenu, setShowReportMenu] = useState(false);
  const [frameRect, setFrameRect] = useState(null);
  const videoRef = React.useRef(null);

  const handlePlayVideo = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Sync overlay to device frame position/size so the backdrop fully covers the phone frame
  React.useEffect(() => {
    const updateFrameRect = () => {
      const el = document.getElementById('seer-device-frame');
      if (!el) return;
      const rect = el.getBoundingClientRect();
      setFrameRect({ top: rect.top, left: rect.left, width: rect.width, height: rect.height });
    };
    if (showShareMenu || showReportMenu) {
      updateFrameRect();
      window.addEventListener('resize', updateFrameRect);
      window.addEventListener('scroll', updateFrameRect, true);
      return () => {
        window.removeEventListener('resize', updateFrameRect);
        window.removeEventListener('scroll', updateFrameRect, true);
      };
    }
  }, [showShareMenu, showReportMenu]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl shadow-sm border overflow-hidden transition-colors ${
        darkMode 
          ? "bg-slate-800 border-slate-700" 
          : "bg-white border-slate-100"
      }`}
    >
      {/* User Header */}
      <div className="flex items-center gap-3 px-4 py-3">
        {avatar ? (
          <img 
            src={avatar} 
            alt={username}
            className="w-10 h-10 rounded-full object-cover shadow" 
          />
        ) : (
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-400 shadow" />
        )}
        <div 
          className="flex-1 cursor-pointer"
          onClick={() => navigateTo && navigateTo('user-profile', { userId })}
        >
          <div className="flex items-center gap-1.5">
            <div className={`text-sm font-semibold transition-colors ${darkMode ? "text-slate-200 hover:text-indigo-400" : "text-slate-800 hover:text-indigo-600"}`}>
              {username}
            </div>
            {isPro && (
              <div onClick={(e) => e.stopPropagation()}>
                <ProBadge size="xs" clickable onClick={() => navigateTo && navigateTo('member-center')} />
              </div>
            )}
          </div>
          <div className={`text-xs transition-colors ${darkMode ? "text-slate-500" : "text-slate-400"}`}>
            {major && <span>{major} · </span>}
            {time}
          </div>
        </div>
        <button 
          onClick={() => navigateTo && navigateTo('user-profile', { userId })}
          className={`transition-colors ${darkMode ? "text-slate-600 hover:text-slate-400" : "text-slate-300 hover:text-slate-500"}`}
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
      
      {/* Content */}
      {type === "text" ? (
        <div className={`px-4 pb-4 leading-relaxed transition-colors ${darkMode ? "text-slate-300" : "text-slate-700"}`}>
          {content}
        </div>
      ) : (
        <div className="aspect-video w-full bg-black flex items-center justify-center relative">
          <video
            ref={videoRef}
            src={videoSrc || "/example.mp4"}
            className="w-full h-full object-contain"
            onClick={handlePlayVideo}
            onEnded={() => setIsPlaying(false)}
            playsInline
          />
          <AnimatePresence>
            {!isPlaying && (
          <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
                onClick={handlePlayVideo}
                className="absolute w-16 h-16 rounded-full bg-black/50 backdrop-blur flex items-center justify-center text-white shadow-lg"
          >
            <Play className="w-6 h-6 ml-1" fill="currentColor" />
          </motion.button>
            )}
          </AnimatePresence>
        </div>
      )}
      
      {/* Engagement */}
      <div className={`flex items-center gap-6 px-4 py-3 border-t transition-colors ${
        darkMode ? "border-slate-700" : "border-slate-100"
      }`}>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsLiked(!isLiked)}
          className={`flex items-center gap-2 text-sm transition-colors ${
            isLiked 
              ? "text-rose-500" 
              : darkMode 
                ? "text-slate-400 hover:text-rose-500" 
                : "text-slate-500 hover:text-rose-500"
          }`}
        >
          <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
          <span>{likes + (isLiked ? 1 : 0)}</span>
        </motion.button>
        
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigateTo && navigateTo('post-detail', { postId: id })}
          className={`flex items-center gap-2 text-sm transition-colors ${
            darkMode 
              ? "text-slate-400 hover:text-indigo-400" 
              : "text-slate-500 hover:text-indigo-600"
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>{comments}</span>
        </motion.button>
        
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowShareMenu(true)}
          className={`flex items-center gap-2 text-sm transition-colors ${
            darkMode 
              ? "text-slate-400 hover:text-indigo-400" 
              : "text-slate-500 hover:text-indigo-600"
          }`}
        >
          <Share className="w-4 h-4" />
        </motion.button>
        
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsSaved(!isSaved)}
          className={`flex items-center gap-2 text-sm transition-colors ml-auto ${
            isSaved 
              ? "text-amber-500" 
              : darkMode 
                ? "text-slate-400 hover:text-amber-500" 
                : "text-slate-500 hover:text-amber-500"
          }`}
        >
          <Bookmark className={`w-4 h-4 ${isSaved ? "fill-current" : ""}`} />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowReportMenu(true)}
          className={`flex items-center gap-2 text-sm transition-colors ${
            darkMode 
              ? "text-slate-400 hover:text-rose-400" 
              : "text-slate-500 hover:text-rose-600"
          }`}
        >
          <UserX className="w-4 h-4" />
        </motion.button>
      </div>

      {/* Share Menu Modal */}
      <AnimatePresence>
        {showShareMenu && frameRect && (
          <div 
            className="fixed z-[9999] flex items-end justify-center"
            style={{ 
              position: 'fixed',
              top: `${frameRect.top}px`,
              left: `${frameRect.left}px`,
              width: `${frameRect.width}px`,
              height: `${frameRect.height}px`,
              pointerEvents: 'auto'
            }}
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowShareMenu(false)}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              style={{ borderRadius: '2.2rem' }}
            />
            
            {/* Share Menu */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className={`relative w-full rounded-t-3xl rounded-b-[2.2rem] max-h-[70%] overflow-hidden ${
                darkMode ? "bg-slate-800" : "bg-white"
              }`}
              style={{ zIndex: 10, boxShadow: "0 -16px 32px rgba(0,0,0,0.25)", borderBottomLeftRadius: "2.2rem", borderBottomRightRadius: "2.2rem" }}
            >
              {/* Handle */}
              <div className="flex justify-center pt-3 pb-2">
                <div className={`w-12 h-1 rounded-full ${
                  darkMode ? "bg-slate-600" : "bg-slate-300"
                }`} />
              </div>

              {/* Header */}
              <div className={`px-6 py-4 border-b ${
                darkMode ? "border-slate-700" : "border-slate-100"
              }`}>
                <div className="flex items-center justify-between">
                  <div className={`text-lg font-bold ${
                    darkMode ? "text-slate-200" : "text-slate-800"
                  }`}>
                    {language === "zh" ? "转发给" : "Share to"}
                  </div>
                  <button
                    onClick={() => setShowShareMenu(false)}
                    className={`p-2 rounded-full transition-colors ${
                      darkMode ? "hover:bg-slate-700" : "hover:bg-slate-100"
                    }`}
                  >
                    <X className={`w-5 h-5 ${darkMode ? "text-slate-400" : "text-slate-600"}`} />
                  </button>
                </div>
              </div>

              {/* Friends List */}
              <div className="overflow-y-auto max-h-[calc(70vh-120px)] px-4 py-3">
                {/* Search */}
                <div className={`mb-4 flex items-center gap-3 border rounded-xl px-4 py-2.5 shadow-sm ${
                  darkMode 
                    ? "bg-slate-700 border-slate-600" 
                    : "bg-slate-50 border-slate-200"
                }`}>
                  <Search className={`w-5 h-5 ${darkMode ? "text-slate-400" : "text-slate-500"}`} />
                  <input 
                    placeholder={language === "zh" ? "搜索好友" : "Search friends"}
                    className={`flex-1 text-sm outline-none ${
                      darkMode 
                        ? "bg-slate-700 text-slate-200 placeholder-slate-500" 
                        : "bg-slate-50 text-slate-700 placeholder-slate-400"
                    }`}
                  />
                </div>

                {/* Friend List */}
                <div className="space-y-1">
                  {[
                    { id: "u001", name: "Alice", avatar: "/Alice.png", major: "Computer Science" },
                    { id: "u002", name: "Bob", avatar: "/Bob.png", major: "Business Administration", isPro: true },
                    { id: "u003", name: "Charlie", avatar: "/Charlie.png", major: "Data Science" },
                    { id: "u004", name: "Emma", avatar: "/Emma.png", major: "International Relations" },
                    { id: "u005", name: "Dana", avatar: "/Dana.png", major: "Computer Science", isPro: true },
                  ].map((friend, index) => (
                    <motion.div
                      key={friend.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${
                        darkMode 
                          ? "hover:bg-slate-700" 
                          : "hover:bg-slate-50"
                      }`}
                    >
                      <img 
                        src={friend.avatar} 
                        alt={friend.name}
                        className="w-12 h-12 rounded-full object-cover shadow" 
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className={`font-semibold ${
                            darkMode ? "text-slate-200" : "text-slate-800"
                          }`}>
                            {friend.name}
                          </span>
                          {friend.isPro && <ProBadge size="xs" />}
                        </div>
                        <div className={`text-sm ${
                          darkMode ? "text-slate-400" : "text-slate-500"
                        }`}>
                          {friend.major}
                        </div>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowShareMenu(false);
                        }}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                          darkMode
                            ? "bg-indigo-600 text-white hover:bg-indigo-700"
                            : "bg-indigo-600 text-white hover:bg-indigo-700"
                        }`}
                      >
                        {language === "zh" ? "发送" : "Send"}
                      </motion.button>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Report Menu Modal */}
      <AnimatePresence>
        {showReportMenu && frameRect && (
          <div 
            className="fixed z-[9999] flex items-end justify-center"
            style={{ 
              position: 'fixed',
              top: `${frameRect.top}px`,
              left: `${frameRect.left}px`,
              width: `${frameRect.width}px`,
              height: `${frameRect.height}px`,
              pointerEvents: 'auto'
            }}
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowReportMenu(false)}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              style={{ borderRadius: '2.2rem' }}
            />
            
            {/* Report Menu */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className={`relative w-full rounded-t-3xl rounded-b-[2.2rem] ${
                darkMode ? "bg-slate-800" : "bg-white"
              }`}
              style={{ zIndex: 10, boxShadow: "0 -16px 32px rgba(0,0,0,0.25)", borderBottomLeftRadius: "2.2rem", borderBottomRightRadius: "2.2rem" }}
            >
              {/* Handle */}
              <div className="flex justify-center pt-3 pb-2">
                <div className={`w-12 h-1 rounded-full ${
                  darkMode ? "bg-slate-600" : "bg-slate-300"
                }`} />
              </div>

              {/* Header */}
              <div className={`px-6 py-4 border-b ${
                darkMode ? "border-slate-700" : "border-slate-100"
              }`}>
                <div className="flex items-center justify-between">
                  <div className={`text-lg font-bold ${
                    darkMode ? "text-slate-200" : "text-slate-800"
                  }`}>
                    {language === "zh" ? "举报选项" : "Report Options"}
                  </div>
                  <button
                    onClick={() => setShowReportMenu(false)}
                    className={`p-2 rounded-full transition-colors ${
                      darkMode ? "hover:bg-slate-700" : "hover:bg-slate-100"
                    }`}
                  >
                    <X className={`w-5 h-5 ${darkMode ? "text-slate-400" : "text-slate-600"}`} />
                  </button>
                </div>
              </div>

              {/* Report Options */}
              <div className="px-4 py-3 space-y-2">
                {[
                  { 
                    id: "notInterested", 
                    label: language === "zh" ? "不感兴趣" : "Not Interested",
                    icon: Eye,
                    color: "slate"
                  },
                  { 
                    id: "spam", 
                    label: language === "zh" ? "垃圾信息" : "Spam",
                    icon: UserX,
                    color: "amber"
                  },
                  { 
                    id: "inappropriate", 
                    label: language === "zh" ? "不当内容" : "Inappropriate Content",
                    icon: UserX,
                    color: "orange"
                  },
                  { 
                    id: "blockAuthor", 
                    label: language === "zh" ? "屏蔽作者" : "Block Author",
                    icon: UserX,
                    color: "rose"
                  }
                ].map((option, index) => (
                  <motion.button
                    key={option.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => {
                      setShowReportMenu(false);
                      // Handle report action
                    }}
                    className={`w-full flex items-center gap-3 p-4 rounded-xl transition-all ${
                      darkMode 
                        ? "hover:bg-slate-700 border border-slate-700" 
                        : "hover:bg-slate-50 border border-slate-200"
                    }`}
                  >
                    <div className={`p-2 rounded-lg ${
                      option.color === "slate" 
                        ? darkMode ? "bg-slate-700" : "bg-slate-100"
                        : option.color === "amber"
                        ? "bg-amber-500/10"
                        : option.color === "orange"
                        ? "bg-orange-500/10"
                        : "bg-rose-500/10"
                    }`}>
                      <option.icon className={`w-5 h-5 ${
                        option.color === "slate"
                          ? darkMode ? "text-slate-400" : "text-slate-600"
                          : option.color === "amber"
                          ? "text-amber-600"
                          : option.color === "orange"
                          ? "text-orange-600"
                          : "text-rose-600"
                      }`} />
                    </div>
                    <span className={`font-medium ${
                      darkMode ? "text-slate-200" : "text-slate-800"
                    }`}>
                      {option.label}
                    </span>
                  </motion.button>
                ))}
              </div>

              {/* Cancel Button */}
              <div className="px-4 pb-4 pt-2">
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => setShowReportMenu(false)}
                  className={`w-full py-3 rounded-xl font-medium transition-all ${
                    darkMode
                      ? "bg-slate-700 text-slate-300 hover:bg-slate-600"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {language === "zh" ? "取消" : "Cancel"}
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* =================== HOMEPAGE =================== */
function HomePage({ navigateTo, language = "en", darkMode = false }) {
  const [activeTab, setActiveTab] = useState(t("forYou", language));

  const samplePosts = [
    {
      id: "p123",
      type: "text",
      username: "Alice",
      avatar: "/Alice.png",
      userId: "u001",
      major: "Computer Science",
      content: "Exploring the beautiful campus today! 🌿 The autumn colors are absolutely stunning.",
      likes: 42,
      comments: 5,
      time: "2h ago"
    },
    {
      id: "v456",
      type: "video",
      username: "Bob",
      avatar: "/Bob.png",
      userId: "u002",
      major: "Business Administration",
      isPro: true,
      videoSrc: "/example.mp4",
      likes: 150,
      comments: 23,
      time: "4h ago"
    },
    {
      id: "p789",
      type: "text",
      username: "Charlie",
      avatar: "/Charlie.png",
      userId: "u003",
      major: "Data Science",
      content: "Just finished my midterm exam! 📚 Time to relax with some gaming. Anyone up for a chess match?",
      likes: 28,
      comments: 12,
      time: "6h ago"
    },
    {
      id: "p101",
      type: "text",
      username: "Emma",
      avatar: "/Emma.png",
      userId: "u004",
      major: "International Relations",
      content: "Coffee study session at the library ☕️📖 Nothing beats that productive atmosphere!",
      likes: 67,
      comments: 8,
      time: "8h ago"
    },
    {
      id: "p102",
      type: "text",
      username: "Dana",
      avatar: "/Dana.png",
      userId: "u005",
      major: "Computer Science",
      isPro: true,
      content: "Working on my new AI project! Machine learning is fascinating 🤖💻 Can't wait to share the results with you all!",
      likes: 156,
      comments: 34,
      time: "12h ago"
    },
    {
      id: "p103",
      type: "text",
      username: "Alice",
      avatar: "/Alice.png",
      userId: "u001",
      major: "Computer Science",
      content: "Just discovered this amazing café near campus! ☕️✨ Perfect spot for coding sessions. Highly recommend!",
      likes: 89,
      comments: 15,
      time: "1d ago"
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`h-full relative flex flex-col transition-colors duration-500 ${darkMode ? "bg-slate-900" : "bg-slate-50"}`}
    >
      <div className={`flex items-center justify-between px-4 py-3 border-b transition-colors ${
        darkMode ? "border-slate-700 bg-slate-800" : "border-slate-100 bg-white"
      }`}>
        <div className={`text-xl font-bold tracking-wide transition-colors ${
          darkMode ? "text-indigo-400" : "text-indigo-600"
        }`}>
          SEER
        </div>
        <div className="flex items-center gap-3">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigateTo('create-post')}
            className={`flex items-center gap-1 transition-colors ${
              darkMode ? "text-indigo-400 hover:text-indigo-300" : "text-indigo-600 hover:text-indigo-700"
            }`}
          >
            <PlusCircle className="w-5 h-5" />
            <span className="text-sm font-medium">{t("new", language)}</span>
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigateTo('search')}
            className={`p-2 rounded-full transition-colors ${
              darkMode ? "text-indigo-400 hover:bg-slate-700" : "text-indigo-600 hover:bg-slate-100"
            }`}
          >
            <Search className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
      
      {/* Tab Selector */}
      <div className="px-3 pt-3 pb-2">
        <div className={`flex items-center gap-1 p-1 rounded-full w-fit mx-auto transition-colors ${
          darkMode ? "bg-slate-800" : "bg-slate-100"
        }`}>
          {[t("forYou", language), t("following", language)].map((tab) => (
            <motion.button
              key={tab}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeTab === tab 
                  ? darkMode 
                    ? "bg-slate-700 shadow text-white" 
                    : "bg-white shadow text-slate-700"
                  : darkMode
                    ? "text-slate-400 hover:text-slate-300"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {tab}
            </motion.button>
          ))}
        </div>
      </div>
      
      {/* Content Feed */}
      <div className="flex-1 overflow-y-auto p-3 pb-28 space-y-4">
        <AnimatePresence mode="wait">
          {samplePosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <PostCard 
                {...post} 
                darkMode={darkMode}
                major={post.major}
                time={post.time}
                isPro={post.isPro}
                userId={post.userId}
                navigateTo={navigateTo}
                language={language}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      
      <BottomNav active="home" navigateTo={navigateTo} language={language} darkMode={darkMode} />
    </motion.div>
  );
}

/* =================== GAMES LOBBY =================== */
function GamesPage({ navigateTo, language = "en", darkMode = false }) {
  const featuredGames = [
    { id: "gomoku", title: "五子棋 Gomoku", subtitle: "Strategy • Classical", color: "from-amber-700 to-red-800", image: "/gomokuimage.png" },
    { id: "chess", title: "中国象棋 Chinese Chess", subtitle: "Strategy • Classical", color: "from-red-600 to-orange-700", image: "/chessimage.png" },
    { id: "g1", title: "Campus Conquest", subtitle: "Strategy • 124 players", color: "from-indigo-500 to-purple-600" },
    { id: "g2", title: "Library Rush", subtitle: "Puzzle • 89 players", color: "from-emerald-500 to-teal-600" },
  ];

  const gameCategories = [
    {
      name: "Strategy",
      items: [
        { id: "gomoku", name: "五子棋", desc: "Classic board game of five in a row.", players: 156, icon: "⚫" },
        { id: "chess", name: "中国象棋", desc: "Traditional Chinese chess strategy game.", players: 189, icon: "/chinese-chess-icon.png", isImage: true },
        { id: "g1", name: "Campus Conquest", desc: "A tactical territory game.", players: 124, icon: "🎯" },
        { id: "g3", name: "Debate Club", desc: "Argue your way to victory.", players: 56, icon: "💬" },
      ],
    },
    { 
      name: "Puzzle", 
      items: [
        { id: "g4", name: "Code Breaker", desc: "Challenging logic puzzles.", players: 88, icon: "🧩" }
      ] 
    },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`h-full relative transition-colors duration-500 ${darkMode ? "bg-slate-900" : "bg-slate-50"}`}
    >
      <div className={`flex items-center justify-between px-4 py-3 border-b transition-colors ${
        darkMode ? "border-slate-700 bg-slate-800" : "border-slate-100 bg-white"
      }`}>
        <div className={`text-xl font-bold tracking-wide transition-colors ${
          darkMode ? "text-indigo-400" : "text-indigo-600"
        }`}>
          {t("gameLobby", language)}
        </div>
      </div>
      
      {/* Featured Games Carousel */}
      <div className="px-4 py-4">
        <div className={`text-sm font-medium mb-3 transition-colors ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
          {t("featuredGames", language)}
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {featuredGames.map((game, index) => (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                if (game.id === "gomoku") navigateTo("gomoku-loading");
                else if (game.id === "chess") navigateTo("chess-loading");
              }}
              className={`min-w-[260px] h-36 rounded-2xl overflow-hidden shadow-lg text-white p-4 flex flex-col justify-between cursor-pointer relative ${!game.image ? `bg-gradient-to-br ${game.color}` : ''}`}
              style={game.image ? {
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.5)), url(${game.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              } : {}}
            >
              <div>
                <div className="text-lg font-bold drop-shadow-lg">{game.title}</div>
                <div className="text-sm opacity-90 drop-shadow">{game.subtitle}</div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm opacity-90 drop-shadow">{t("playNow", language)}</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Game Categories */}
      <div className="px-4 pb-28 space-y-5">
        {gameCategories.map((category, catIndex) => (
          <motion.div
            key={category.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + catIndex * 0.1 }}
          >
            <div className={`text-sm font-medium mb-3 transition-colors ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
              {category.name}
            </div>
            <div className="space-y-2">
              {category.items.map((game) => (
                <motion.div
                  key={game.id}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => {
                    if (game.id === "gomoku") navigateTo("gomoku-loading");
                    else if (game.id === "chess") navigateTo("chess-loading");
                  }}
                  className={`flex items-center gap-3 p-4 rounded-2xl border shadow-sm hover:shadow-md transition-all cursor-pointer ${
                    darkMode 
                      ? "bg-slate-800 border-slate-700" 
                      : "bg-white border-slate-100"
                  }`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl transition-colors ${
                    darkMode ? "bg-slate-700" : "bg-slate-100"
                  }`}>
                    {game.isImage ? (
                      <img src={game.icon} alt={game.name} className="w-8 h-8 object-contain" />
                    ) : (
                      game.icon
                    )}
                  </div>
                  <div className="flex-1">
                    <div className={`text-sm font-semibold transition-colors ${darkMode ? "text-slate-200" : "text-slate-800"}`}>
                      {game.name}
                  </div>
                    <div className={`text-xs transition-colors ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                      {game.desc}
                    </div>
                  </div>
                  <div className={`text-xs mr-2 transition-colors ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                    {game.players} {t("online", language)}
                  </div>
                  <ChevronRight className={`w-4 h-4 transition-colors ${darkMode ? "text-slate-600" : "text-slate-300"}`} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
      
      <BottomNav active="games" navigateTo={navigateTo} language={language} darkMode={darkMode} />
    </motion.div>
  );
}

/* =================== CHAT LIST =================== */
function ChatPage({ navigateTo, language = "en", darkMode = false }) {
  const [activeTab, setActiveTab] = useState("messages");
  
  const conversations = [
    { 
      id: "c001", 
      name: "Charlie", 
      message: "See you at the library!", 
      time: "10:42 AM", 
      unread: 2,
      avatar: "/Charlie.png"
    },
    { 
      id: "g001", 
      name: "Project Group", 
      message: "David: Don't forget the deadline.", 
      time: "9:15 AM", 
      unread: 0,
      avatar: "from-emerald-500 to-emerald-400"
    },
    { 
      id: "c002", 
      name: "Emma", 
      message: "Thanks for the notes! 📚", 
      time: "Yesterday", 
      unread: 0,
      avatar: "/Emma.png"
    },
  ];

  const notifications = [
    {
      id: "n001",
      type: "like",
      user: "Alice",
      avatar: "/Alice.png",
      content: t("likeNotification", language),
      time: "5m ago",
      read: false
    },
    {
      id: "n002",
      type: "comment",
      user: "Bob",
      avatar: "/Bob.png",
      content: t("commentNotification", language),
      commentText: "Great post! Really inspiring.",
      time: "1h ago",
      read: false
    },
    {
      id: "n003",
      type: "follow",
      user: "Dana",
      avatar: "/Dana.png",
      content: t("followNotification", language),
      time: "3h ago",
      read: true
    },
    {
      id: "n004",
      type: "system",
      content: t("systemNotification", language),
      message: "Your account security has been enhanced with two-factor authentication.",
      time: "1d ago",
      read: true
    },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`h-full relative transition-colors duration-500 ${darkMode ? "bg-slate-900" : "bg-slate-50"}`}
    >
      <div className={`flex items-center justify-between px-4 py-3 border-b transition-colors ${
        darkMode ? "border-slate-700 bg-slate-800" : "border-slate-100 bg-white"
      }`}>
        <div className={`text-xl font-bold tracking-wide transition-colors ${
          darkMode ? "text-indigo-400" : "text-indigo-600"
        }`}>
          {t(activeTab === "messages" ? "messages" : "notifications", language)}
        </div>
        {activeTab === "messages" && (
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigateTo('friend-groups')}
            className={`flex items-center gap-1 transition-colors ${
              darkMode ? "text-indigo-400 hover:text-indigo-300" : "text-indigo-600 hover:text-indigo-700"
            }`}
          >
            <Users className="w-5 h-5" />
            <span className="text-sm font-medium">{t("addressBook", language)}</span>
          </motion.button>
        )}
        {activeTab === "notifications" && (
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`text-sm font-medium transition-colors ${
              darkMode ? "text-indigo-400 hover:text-indigo-300" : "text-indigo-600 hover:text-indigo-700"
            }`}
          >
            {t("markAllRead", language)}
          </motion.button>
        )}
      </div>
      
      {/* Tab Selector */}
      <div className="px-3 pt-3 pb-2">
        <div className={`flex items-center gap-1 p-1 rounded-full w-fit mx-auto transition-colors ${
          darkMode ? "bg-slate-800" : "bg-slate-100"
        }`}>
          {[
            { id: "messages", label: t("messages", language), icon: MessageCircle },
            { id: "notifications", label: t("notifications", language), icon: Heart }
          ].map((tab) => (
            <motion.button
              key={tab.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeTab === tab.id 
                  ? darkMode 
                    ? "bg-slate-700 shadow text-white" 
                    : "bg-white shadow text-slate-700"
                  : darkMode
                    ? "text-slate-400 hover:text-slate-300"
                    : "text-slate-500 hover:text-slate-700"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </motion.button>
          ))}
        </div>
      </div>
      
      {activeTab === "messages" ? (
        <>
          {/* Search Bar */}
          <div className="px-4 pt-2 pb-2">
            <div className={`flex items-center gap-3 border rounded-xl px-4 py-3 shadow-sm transition-colors ${
              darkMode 
                ? "bg-slate-800 border-slate-700" 
                : "bg-white border-slate-200"
            }`}>
              <Search className={`w-5 h-5 transition-colors ${darkMode ? "text-slate-500" : "text-slate-400"}`} />
              <input 
                placeholder={t("searchConversations", language)}
                className={`flex-1 text-sm outline-none transition-colors ${
                  darkMode 
                    ? "bg-slate-800 text-slate-200 placeholder-slate-500" 
                    : "bg-white text-slate-700 placeholder-slate-400"
                }`}
              />
            </div>
          </div>
          
          {/* Chat List */}
          <div className="px-2 pb-28">
            {/* Pinned AI entry (looks like a normal chat row) */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => navigateTo('ai-loading')}
              className={`flex items-center gap-3 p-3 m-2 rounded-2xl border shadow-sm cursor-pointer ${
                darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-100"
              }`}
            >
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 shadow flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className={`font-semibold truncate ${darkMode ? 'text-slate-100' : 'text-slate-800'}`}>
                  <span className="bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500 bg-clip-text text-transparent">{language === 'zh' ? '君谋AI' : 'Junmou AI'}</span>
                </div>
                <div className={`text-sm truncate ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  {language === 'zh' ? '点击开始 · 聊天 / 图片 / 音乐 / 视频' : 'Tap to start · Chat / Images / Music / Video'}
                </div>
              </div>
              <div className={`text-xs ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>置顶</div>
            </motion.div>
            {conversations.map((chat, index) => (
              <motion.div
                key={chat.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => navigateTo(`chat-detail-${chat.id}`)}
                className={`flex items-center gap-3 p-3 m-2 rounded-2xl border shadow-sm hover:shadow-md transition-all cursor-pointer ${
                  darkMode 
                    ? "bg-slate-800 border-slate-700" 
                    : "bg-white border-slate-100"
                }`}
              >
                <div className="relative">
                  {chat.avatar.startsWith('/') ? (
                    <img 
                      src={chat.avatar} 
                      alt={chat.name}
                      className="w-12 h-12 rounded-full object-cover shadow" 
                    />
                  ) : (
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${chat.avatar} shadow`} />
                  )}
                  {chat.unread > 0 && (
                    <div className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] px-2 py-0.5 rounded-full shadow min-w-[18px] text-center">
                      {chat.unread}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className={`text-sm font-semibold truncate transition-colors ${
                      darkMode ? "text-slate-200" : "text-slate-800"
                    }`}>
                      {chat.name}
                  </div>
                    <div className={`text-xs ml-2 transition-colors ${
                      darkMode ? "text-slate-500" : "text-slate-400"
                    }`}>
                      {chat.time}
                    </div>
                  </div>
                  <div className={`text-xs truncate mt-0.5 transition-colors ${
                    darkMode ? "text-slate-400" : "text-slate-500"
                  }`}>
                    {chat.message}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </>
      ) : (
        /* Notification List */
        <div className="px-2 pb-28 pt-2">
          {notifications.length === 0 ? (
            <div className={`text-center py-16 transition-colors ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
              <Heart className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <div className="text-lg font-semibold mb-2">{t("noNotifications", language)}</div>
            </div>
          ) : (
            notifications.map((notification, index) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`flex items-start gap-3 p-3 m-2 rounded-2xl border shadow-sm transition-all ${
                  darkMode 
                    ? notification.read ? "bg-slate-800 border-slate-700" : "bg-slate-800/70 border-indigo-700" 
                    : notification.read ? "bg-white border-slate-100" : "bg-indigo-50 border-indigo-200"
                }`}
              >
                {notification.type !== "system" ? (
                  <img 
                    src={notification.avatar} 
                    alt={notification.user}
                    className="w-12 h-12 rounded-full object-cover shadow" 
                  />
                ) : (
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    darkMode ? "bg-indigo-600" : "bg-indigo-500"
                  }`}>
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className={`text-sm transition-colors ${
                    darkMode ? "text-slate-200" : "text-slate-800"
                  }`}>
                    {notification.type !== "system" && (
                      <span className="font-semibold">{notification.user} </span>
                    )}
                    <span>{notification.content}</span>
                  </div>
                  {notification.commentText && (
                    <div className={`text-xs mt-1 p-2 rounded-lg transition-colors ${
                      darkMode ? "bg-slate-700 text-slate-300" : "bg-slate-100 text-slate-600"
                    }`}>
                      "{notification.commentText}"
                    </div>
                  )}
                  {notification.message && (
                    <div className={`text-xs mt-1 transition-colors ${
                      darkMode ? "text-slate-400" : "text-slate-600"
                    }`}>
                      {notification.message}
                    </div>
                  )}
                  <div className={`text-xs mt-1 transition-colors ${
                    darkMode ? "text-slate-500" : "text-slate-400"
                  }`}>
                    {notification.time}
                  </div>
                </div>
                {!notification.read && (
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    darkMode ? "bg-indigo-400" : "bg-indigo-600"
                  }`} />
                )}
              </motion.div>
            ))
          )}
        </div>
      )}
      
      <BottomNav active="chat" navigateTo={navigateTo} language={language} darkMode={darkMode} />
    </motion.div>
  );
}

/* =================== CREATE POST PAGE =================== */
function CreatePostPage({ navigateTo, language = "en", darkMode = false }) {
  const [postContent, setPostContent] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const fileInputRef = React.useRef(null);
  const videoInputRef = React.useRef(null);

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
        setSelectedVideo(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVideoSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setSelectedVideo(url);
      setSelectedImage(null);
    }
  };

  const handlePost = () => {
    // Simulate posting
    navigateTo('home');
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`h-full flex flex-col transition-colors duration-500 ${
        darkMode ? "bg-slate-900" : "bg-white"
      }`}
    >
      <div className={`flex items-center justify-between px-4 py-3 border-b transition-colors ${
        darkMode ? "border-slate-700 bg-slate-800" : "border-slate-100 bg-white"
      }`}>
        <button 
          onClick={() => navigateTo('home')}
          className={`p-2 -ml-2 rounded-lg transition-colors ${
            darkMode ? "hover:bg-slate-700" : "hover:bg-slate-50"
          }`}
        >
          <ChevronLeft className={`w-6 h-6 transition-colors ${darkMode ? "text-slate-300" : "text-slate-600"}`} />
        </button>
        <div className={`text-xl font-bold tracking-wide transition-colors ${
          darkMode ? "text-indigo-400" : "text-indigo-600"
        }`}>
          {t("createPost", language)}
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handlePost}
          disabled={!postContent && !selectedImage && !selectedVideo}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            postContent || selectedImage || selectedVideo
              ? darkMode
                ? "bg-indigo-600 text-white hover:bg-indigo-700"
                : "bg-indigo-600 text-white hover:bg-indigo-700"
              : "bg-slate-200 text-slate-400 cursor-not-allowed"
          }`}
        >
          {t("post", language)}
        </motion.button>
      </div>
      
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {/* Text Input */}
        <textarea
          value={postContent}
          onChange={(e) => setPostContent(e.target.value)}
          placeholder={t("whatsOnYourMind", language)}
          className={`w-full h-32 px-4 py-3 rounded-xl border resize-none focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition-all ${
            darkMode 
              ? "bg-slate-800 border-slate-700 text-white placeholder-slate-500" 
              : "bg-white border-slate-200 text-slate-900 placeholder-slate-400"
          }`}
        />

        {/* Media Preview */}
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-4 relative"
          >
            <img src={selectedImage} alt="Selected" className="w-full rounded-xl" />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-2 right-2 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}

        {selectedVideo && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-4 relative"
          >
            <video src={selectedVideo} controls className="w-full rounded-xl" />
            <button
              onClick={() => setSelectedVideo(null)}
              className="absolute top-2 right-2 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}

        {/* Media Buttons */}
        <div className="mt-6 flex gap-3">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            className="hidden"
          />
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => fileInputRef.current?.click()}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border transition-all ${
              darkMode
                ? "bg-slate-800 border-slate-700 text-emerald-400 hover:bg-slate-700"
                : "bg-emerald-50 border-emerald-200 text-emerald-600 hover:bg-emerald-100"
            }`}
          >
            <PlusCircle className="w-5 h-5" />
            <span className="font-medium">{t("addPhoto", language)}</span>
          </motion.button>

          <input
            ref={videoInputRef}
            type="file"
            accept="video/*"
            onChange={handleVideoSelect}
            className="hidden"
          />
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => videoInputRef.current?.click()}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border transition-all ${
              darkMode
                ? "bg-slate-800 border-slate-700 text-blue-400 hover:bg-slate-700"
                : "bg-blue-50 border-blue-200 text-blue-600 hover:bg-blue-100"
            }`}
          >
            <Play className="w-5 h-5" />
            <span className="font-medium">{t("addVideo", language)}</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

/* =================== POST DETAIL PAGE WITH COMMENTS =================== */
function PostDetailPage({ navigateTo, language = "en", darkMode = false, postId = "p123" }) {
  const [commentInput, setCommentInput] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [comments, setComments] = useState([
    {
      id: "c1",
      username: "Bob",
      avatar: "/Bob.png",
      userId: "u002",
      isPro: true,
      content: "Great post! Really inspiring. 🔥",
      likes: 23,
      replies: 2,
      time: "1h ago",
      isLiked: false,
      replyList: [
        {
          id: "r1",
          username: "Alice",
          avatar: "/Alice.png",
          userId: "u001",
          content: "@Bob Thank you so much! 😊",
          likes: 5,
          time: "45m ago",
          isLiked: false
        },
        {
          id: "r2",
          username: "Charlie",
          avatar: "/Charlie.png",
          userId: "u003",
          content: "@Bob I agree! Very motivational.",
          likes: 3,
          time: "30m ago",
          isLiked: false
        }
      ]
    },
    {
      id: "c2",
      username: "Emma",
      avatar: "/Emma.png",
      userId: "u004",
      content: "Love this! Can't wait to see more content like this.",
      likes: 15,
      replies: 0,
      time: "2h ago",
      isLiked: false,
      replyList: []
    },
    {
      id: "c3",
      username: "Dana",
      avatar: "/Dana.png",
      userId: "u005",
      isPro: true,
      content: "This is exactly what I needed today! Thanks for sharing 💯",
      likes: 42,
      replies: 1,
      time: "3h ago",
      isLiked: false,
      replyList: [
        {
          id: "r3",
          username: "Alice",
          avatar: "/Alice.png",
          userId: "u001",
          content: "@Dana Glad it helped! 💜",
          likes: 8,
          time: "2h ago",
          isLiked: false
        }
      ]
    }
  ]);

  // Sample post data
  const post = {
    id: postId,
    type: "text",
    username: "Alice",
    avatar: "/Alice.png",
    userId: "u001",
    major: "Computer Science",
    content: "Exploring the beautiful campus today! 🌿 The autumn colors are absolutely stunning. #CampusLife #XJTLU",
    likes: 42,
    comments: comments.length,
    time: "2h ago"
  };

  const handleCommentLike = (commentId, isReply = false, parentId = null) => {
    setComments(prevComments => {
      return prevComments.map(comment => {
        if (!isReply && comment.id === commentId) {
          return {
            ...comment,
            isLiked: !comment.isLiked,
            likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1
          };
        }
        if (isReply && comment.id === parentId) {
          return {
            ...comment,
            replyList: comment.replyList.map(reply => {
              if (reply.id === commentId) {
                return {
                  ...reply,
                  isLiked: !reply.isLiked,
                  likes: reply.isLiked ? reply.likes - 1 : reply.likes + 1
                };
              }
              return reply;
            })
          };
        }
        return comment;
      });
    });
  };

  const handleSendComment = () => {
    if (!commentInput.trim()) return;
    
    if (replyingTo) {
      // Add reply to comment
      setComments(prevComments => {
        return prevComments.map(comment => {
          if (comment.id === replyingTo.id) {
            return {
              ...comment,
              replies: comment.replies + 1,
              replyList: [
                ...comment.replyList,
                {
                  id: `r${Date.now()}`,
                  username: "You",
                  avatar: "/Dana.png",
                  userId: "u000",
                  content: `@${replyingTo.username} ${commentInput}`,
                  likes: 0,
                  time: "Just now",
                  isLiked: false
                }
              ]
            };
          }
          return comment;
        });
      });
      setReplyingTo(null);
    } else {
      // Add new comment
      const newComment = {
        id: `c${Date.now()}`,
        username: "You",
        avatar: "/Dana.png",
        userId: "u000",
        content: commentInput,
        likes: 0,
        replies: 0,
        time: "Just now",
        isLiked: false,
        replyList: []
      };
      setComments([newComment, ...comments]);
    }
    setCommentInput("");
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`h-full flex flex-col transition-colors duration-500 ${
        darkMode ? "bg-slate-900" : "bg-slate-50"
      }`}
    >
      {/* Header */}
      <div className={`flex items-center gap-3 px-4 py-3 border-b transition-colors ${
        darkMode ? "border-slate-700 bg-slate-800" : "border-slate-100 bg-white"
      }`}>
        <button 
          onClick={() => navigateTo('home')}
          className={`p-2 -ml-2 rounded-lg transition-colors ${
            darkMode ? "hover:bg-slate-700" : "hover:bg-slate-50"
          }`}
        >
          <ChevronLeft className={`w-6 h-6 transition-colors ${darkMode ? "text-slate-300" : "text-slate-600"}`} />
        </button>
        <div className={`text-xl font-bold tracking-wide transition-colors ${
          darkMode ? "text-indigo-400" : "text-indigo-600"
        }`}>
          {t("post", language)}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Post */}
        <div className="p-4">
          <PostCard {...post} darkMode={darkMode} navigateTo={navigateTo} language={language} />
        </div>

        {/* Comments Section */}
        <div className={`px-4 py-3 border-t transition-colors ${
          darkMode ? "border-slate-700" : "border-slate-100"
        }`}>
          <div className={`text-sm font-semibold mb-3 transition-colors ${
            darkMode ? "text-slate-300" : "text-slate-700"
          }`}>
            {comments.length} {t("comments", language)}
          </div>

          {/* Comments List */}
          <div className="space-y-4">
            {comments.map((comment, index) => (
              <motion.div
                key={comment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="space-y-3"
              >
                {/* Main Comment */}
                <div className="flex gap-3">
                  <img 
                    src={comment.avatar} 
                    alt={comment.username}
                    className="w-10 h-10 rounded-full object-cover shadow cursor-pointer flex-shrink-0" 
                    onClick={() => navigateTo('user-profile', { userId: comment.userId })}
                  />
                  <div className="flex-1 min-w-0">
                    <div className={`p-3 rounded-2xl transition-colors ${
                      darkMode ? "bg-slate-800" : "bg-slate-100"
                    }`}>
                      <div className="flex items-center gap-2 mb-1">
                        <span 
                          onClick={() => navigateTo('user-profile', { userId: comment.userId })}
                          className={`text-sm font-semibold cursor-pointer transition-colors ${
                            darkMode ? "text-slate-200 hover:text-indigo-400" : "text-slate-800 hover:text-indigo-600"
                          }`}
                        >
                          {comment.username}
                        </span>
                        {comment.isPro && <ProBadge size="xs" />}
                      </div>
                      <div className={`text-sm transition-colors ${
                        darkMode ? "text-slate-300" : "text-slate-700"
                      }`}>
                        {comment.content}
                      </div>
                    </div>
                    
                    {/* Comment Actions */}
                    <div className="flex items-center gap-4 mt-2 px-3">
                      <span className={`text-xs transition-colors ${
                        darkMode ? "text-slate-500" : "text-slate-400"
                      }`}>
                        {comment.time}
                      </span>
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleCommentLike(comment.id)}
                        className={`text-xs font-medium transition-colors ${
                          comment.isLiked 
                            ? "text-rose-500" 
                            : darkMode 
                              ? "text-slate-400 hover:text-rose-500" 
                              : "text-slate-500 hover:text-rose-500"
                        }`}
                      >
                        <Heart className={`w-3.5 h-3.5 inline mr-1 ${comment.isLiked ? "fill-current" : ""}`} />
                        {comment.likes}
                      </motion.button>
                      <button 
                        onClick={() => setReplyingTo(comment)}
                        className={`text-xs font-medium transition-colors ${
                          darkMode ? "text-slate-400 hover:text-indigo-400" : "text-slate-500 hover:text-indigo-600"
                        }`}
                      >
                        {t("reply", language)}
                      </button>
                    </div>

                    {/* Replies */}
                    {comment.replyList.length > 0 && (
                      <div className="mt-3 space-y-3 pl-4 border-l-2 transition-colors ${darkMode ? 'border-slate-700' : 'border-slate-200'}">
                        {comment.replyList.map((reply) => (
                          <div key={reply.id} className="flex gap-2">
                            <img 
                              src={reply.avatar} 
                              alt={reply.username}
                              className="w-8 h-8 rounded-full object-cover shadow cursor-pointer flex-shrink-0" 
                              onClick={() => navigateTo('user-profile', { userId: reply.userId })}
                            />
                            <div className="flex-1 min-w-0">
                              <div className={`p-2.5 rounded-xl transition-colors ${
                                darkMode ? "bg-slate-800/50" : "bg-slate-50"
                              }`}>
                                <div 
                                  onClick={() => navigateTo('user-profile', { userId: reply.userId })}
                                  className={`text-xs font-semibold mb-1 cursor-pointer transition-colors ${
                                    darkMode ? "text-slate-200 hover:text-indigo-400" : "text-slate-800 hover:text-indigo-600"
                                  }`}
                                >
                                  {reply.username}
                                </div>
                                <div className={`text-xs transition-colors ${
                                  darkMode ? "text-slate-300" : "text-slate-700"
                                }`}>
                                  {reply.content}
                                </div>
                              </div>
                              <div className="flex items-center gap-3 mt-1.5 px-2">
                                <span className={`text-xs transition-colors ${
                                  darkMode ? "text-slate-500" : "text-slate-400"
                                }`}>
                                  {reply.time}
                                </span>
                                <motion.button
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => handleCommentLike(reply.id, true, comment.id)}
                                  className={`text-xs font-medium transition-colors ${
                                    reply.isLiked 
                                      ? "text-rose-500" 
                                      : darkMode 
                                        ? "text-slate-400 hover:text-rose-500" 
                                        : "text-slate-500 hover:text-rose-500"
                                  }`}
                                >
                                  <Heart className={`w-3 h-3 inline mr-1 ${reply.isLiked ? "fill-current" : ""}`} />
                                  {reply.likes}
                                </motion.button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}

            {comments.length === 0 && (
              <div className={`text-center py-12 transition-colors ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                <MessageSquare className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <div className="text-lg font-semibold mb-2">
                  {language === "zh" ? "暂无评论" : "No comments yet"}
                </div>
                <div className="text-sm">
                  {language === "zh" ? "来发表第一条评论吧！" : "Be the first to comment!"}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Comment Input */}
      <div className={`border-t transition-colors ${
        darkMode ? "border-slate-700 bg-slate-800" : "border-slate-100 bg-white"
      }`}>
        {replyingTo && (
          <div className={`px-4 py-2 border-b flex items-center justify-between transition-colors ${
            darkMode ? "border-slate-700 bg-slate-800/50" : "border-slate-100 bg-slate-50"
          }`}>
            <div className={`text-sm transition-colors ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
              {t("replyTo", language)} <span className="font-semibold">{replyingTo.username}</span>
            </div>
            <button 
              onClick={() => setReplyingTo(null)}
              className={`p-1 rounded transition-colors ${
                darkMode ? "hover:bg-slate-700" : "hover:bg-slate-200"
              }`}
            >
              <X className={`w-4 h-4 transition-colors ${darkMode ? "text-slate-500" : "text-slate-400"}`} />
            </button>
          </div>
        )}
        
        <div className="px-3 py-3 flex items-center gap-2">
          <img 
            src="/Dana.png" 
            alt="You"
            className="w-8 h-8 rounded-full object-cover shadow flex-shrink-0" 
          />
          <div className="flex-1 flex items-center gap-2">
            <input
              type="text"
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendComment()}
              placeholder={t("writeComment", language)}
              className={`flex-1 px-3 py-2 rounded-full border text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-all ${
                darkMode 
                  ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400" 
                  : "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400"
              }`}
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`p-1.5 rounded-full transition-colors ${
                darkMode ? "hover:bg-slate-700" : "hover:bg-slate-100"
              }`}
            >
              <Smile className={`w-5 h-5 transition-colors ${
                darkMode ? "text-slate-400" : "text-slate-600"
              }`} />
            </motion.button>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSendComment}
            disabled={!commentInput.trim()}
            className={`p-2 rounded-full transition-all ${
              commentInput.trim()
                ? darkMode
                  ? "bg-indigo-600 text-white hover:bg-indigo-700"
                  : "bg-indigo-600 text-white hover:bg-indigo-700"
                : "bg-slate-200 text-slate-400 cursor-not-allowed"
            }`}
          >
            <Send className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

/* =================== SEARCH PAGE =================== */
function SearchPage({ navigateTo, language = "en", darkMode = false }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const trendingSearches = [
    { id: "t1", keyword: "XJTLU Library", count: "12.5k", trend: "up" },
    { id: "t2", keyword: "Campus Events", count: "8.3k", trend: "up" },
    { id: "t3", keyword: "Study Groups", count: "6.7k", trend: "hot" },
    { id: "t4", keyword: "Computer Science", count: "5.4k", trend: "up" },
    { id: "t5", keyword: "Cafe Recommendations", count: "4.2k", trend: "new" },
    { id: "t6", keyword: "Midterm Tips", count: "3.8k", trend: "hot" },
  ];

  const hotTopics = [
    { 
      id: "h1", 
      tag: "#CampusLife", 
      posts: "2.3k",
      description: "Daily moments at XJTLU",
      image: "/icon.png",
      trending: true
    },
    { 
      id: "h2", 
      tag: "#StudyTips", 
      posts: "1.8k",
      description: "Share your study methods",
      trending: true
    },
    { 
      id: "h3", 
      tag: "#FoodieXJTLU", 
      posts: "1.5k",
      description: "Best food spots around campus"
    },
    { 
      id: "h4", 
      tag: "#TechTalk", 
      posts: "1.2k",
      description: "Technology and innovation"
    },
    { 
      id: "h5", 
      tag: "#FitnessGoals", 
      posts: "950",
      description: "Health and wellness journey"
    },
  ];

  const suggestedUsers = [
    { 
      id: "u001", 
      username: "Alice", 
      major: "Computer Science",
      avatar: "/Alice.png",
      followers: "1.2k",
      isFollowing: false
    },
    { 
      id: "u002", 
      username: "Bob", 
      major: "Business Administration",
      avatar: "/Bob.png",
      followers: "890",
      isPro: true,
      isFollowing: true
    },
    { 
      id: "u005", 
      username: "Dana", 
      major: "Computer Science",
      avatar: "/Dana.png",
      followers: "2.1k",
      isPro: true,
      isFollowing: false
    },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`h-full flex flex-col transition-colors duration-500 ${
        darkMode ? "bg-slate-900" : "bg-slate-50"
      }`}
    >
      {/* Header */}
      <div className={`px-4 py-3 border-b transition-colors ${
        darkMode ? "border-slate-700 bg-slate-800" : "border-slate-100 bg-white"
      }`}>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigateTo('home')}
            className={`p-2 -ml-2 rounded-lg transition-colors ${
              darkMode ? "hover:bg-slate-700" : "hover:bg-slate-50"
            }`}
          >
            <ChevronLeft className={`w-6 h-6 transition-colors ${darkMode ? "text-slate-300" : "text-slate-600"}`} />
          </button>
          <div className="flex-1 flex items-center gap-3">
            <div className={`flex-1 flex items-center gap-3 border rounded-xl px-4 py-2.5 shadow-sm transition-colors ${
              darkMode 
                ? "bg-slate-700 border-slate-600" 
                : "bg-slate-50 border-slate-200"
            }`}>
              <Search className={`w-5 h-5 transition-colors ${darkMode ? "text-slate-400" : "text-slate-500"}`} />
              <input 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t("search", language)}
                autoFocus
                className={`flex-1 text-sm outline-none transition-colors ${
                  darkMode 
                    ? "bg-slate-700 text-slate-200 placeholder-slate-500" 
                    : "bg-slate-50 text-slate-700 placeholder-slate-400"
                }`}
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")}>
                  <X className={`w-4 h-4 transition-colors ${darkMode ? "text-slate-500" : "text-slate-400"}`} />
                </button>
              )}
            </div>
          </div>
        </div>
        
        {/* Tab Selector */}
        <div className="mt-3 flex gap-1 overflow-x-auto">
          {[
            { id: "all", label: language === "zh" ? "全部" : "All" },
            { id: "users", label: t("searchUsers", language) },
            { id: "posts", label: t("searchPosts", language) },
            { id: "topics", label: t("searchTopics", language) }
          ].map((tab) => (
            <motion.button
              key={tab.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                activeTab === tab.id 
                  ? darkMode 
                    ? "bg-indigo-600 text-white" 
                    : "bg-indigo-600 text-white"
                  : darkMode
                    ? "text-slate-400 hover:text-slate-300"
                    : "text-slate-600 hover:text-slate-700"
              }`}
            >
              {tab.label}
            </motion.button>
          ))}
        </div>
      </div>
      
      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 pb-24">
        {!searchQuery ? (
          <>
            {/* Trending Searches */}
            <div className="mb-6">
              <div className={`flex items-center justify-between mb-3 transition-colors ${
                darkMode ? "text-slate-300" : "text-slate-700"
              }`}>
                <div className="font-semibold flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  {t("trendingSearches", language)}
                </div>
              </div>
              <div className="space-y-2">
                {trendingSearches.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => setSearchQuery(item.keyword)}
                    className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                      darkMode 
                        ? "bg-slate-800 border-slate-700 hover:border-indigo-700" 
                        : "bg-white border-slate-100 hover:border-indigo-300 hover:shadow-sm"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`text-sm font-medium transition-colors ${
                        darkMode ? "text-slate-400" : "text-slate-500"
                      }`}>
                        {index + 1}
                      </div>
                      <div>
                        <div className={`font-medium transition-colors ${
                          darkMode ? "text-slate-200" : "text-slate-800"
                        }`}>
                          {item.keyword}
                        </div>
                        <div className={`text-xs transition-colors ${
                          darkMode ? "text-slate-500" : "text-slate-400"
                        }`}>
                          {item.count} {language === "zh" ? "搜索" : "searches"}
                        </div>
                      </div>
                    </div>
                    {item.trend === "hot" && (
                      <Flame className="w-5 h-5 text-rose-500" />
                    )}
                    {item.trend === "up" && (
                      <TrendingUp className="w-5 h-5 text-emerald-500" />
                    )}
                    {item.trend === "new" && (
                      <Sparkles className="w-5 h-5 text-amber-500" />
                    )}
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Hot Topics */}
            <div className="mb-6">
              <div className={`flex items-center justify-between mb-3 transition-colors ${
                darkMode ? "text-slate-300" : "text-slate-700"
              }`}>
                <div className="font-semibold flex items-center gap-2">
                  <Flame className="w-5 h-5 text-rose-500" />
                  {t("hotTopics", language)}
                </div>
              </div>
              <div className="space-y-2">
                {hotTopics.map((topic, index) => (
                  <motion.div
                    key={topic.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => navigateTo('topic-page', { topic: topic.tag })}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      darkMode 
                        ? "bg-slate-800 border-slate-700 hover:border-indigo-700" 
                        : "bg-white border-slate-100 hover:border-indigo-300 hover:shadow-sm"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <div className={`font-bold transition-colors ${
                            darkMode ? "text-indigo-400" : "text-indigo-600"
                          }`}>
                            {topic.tag}
                          </div>
                          {topic.trending && (
                            <Flame className="w-4 h-4 text-rose-500" />
                          )}
                        </div>
                        <div className={`text-sm mb-2 transition-colors ${
                          darkMode ? "text-slate-400" : "text-slate-600"
                        }`}>
                          {topic.description}
                        </div>
                        <div className={`text-xs transition-colors ${
                          darkMode ? "text-slate-500" : "text-slate-400"
                        }`}>
                          {topic.posts} {t("postsCount", language)}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Suggested Users */}
            {(activeTab === "all" || activeTab === "users") && (
              <div>
                <div className={`flex items-center justify-between mb-3 transition-colors ${
                  darkMode ? "text-slate-300" : "text-slate-700"
                }`}>
                  <div className="font-semibold flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    {language === "zh" ? "推荐用户" : "Suggested Users"}
                  </div>
                </div>
                <div className="space-y-2">
                  {suggestedUsers.map((user, index) => (
                    <motion.div
                      key={user.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                        darkMode 
                          ? "bg-slate-800 border-slate-700" 
                          : "bg-white border-slate-100"
                      }`}
                    >
                      <img 
                        src={user.avatar} 
                        alt={user.username}
                        className="w-12 h-12 rounded-full object-cover shadow cursor-pointer" 
                        onClick={() => navigateTo('user-profile', { userId: user.id })}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <div 
                            onClick={() => navigateTo('user-profile', { userId: user.id })}
                            className={`font-semibold cursor-pointer transition-colors ${
                              darkMode ? "text-slate-200" : "text-slate-800"
                            }`}
                          >
                            {user.username}
                          </div>
                          {user.isPro && <ProBadge size="xs" />}
                        </div>
                        <div className={`text-xs transition-colors ${
                          darkMode ? "text-slate-400" : "text-slate-500"
                        }`}>
                          {user.major} • {user.followers} {t("followers", language)}
                        </div>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                          user.isFollowing
                            ? darkMode
                              ? "bg-slate-700 text-slate-300 border border-slate-600"
                              : "bg-slate-100 text-slate-700 border border-slate-200"
                            : darkMode
                              ? "bg-indigo-600 text-white hover:bg-indigo-700"
                              : "bg-indigo-600 text-white hover:bg-indigo-700"
                        }`}
                      >
                        {user.isFollowing ? t("following_verb", language) : t("follow", language)}
                      </motion.button>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          /* Search Results */
          <div className={`text-center py-16 transition-colors ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
            <Search className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <div className="text-lg font-semibold mb-2">
              {language === "zh" ? "搜索结果" : "Search Results"}
            </div>
            <div className="text-sm">
              {language === "zh" ? `搜索 "${searchQuery}"` : `Searching for "${searchQuery}"`}
            </div>
          </div>
        )}
      </div>
      
      <BottomNav active="home" navigateTo={navigateTo} language={language} darkMode={darkMode} />
    </motion.div>
  );
}

/* =================== CHAT DETAIL PAGE =================== */
function ChatDetailPage({ navigateTo, language = "en", darkMode = false }) {
  const [messageInput, setMessageInput] = useState("");
  const [showMediaMenu, setShowMediaMenu] = useState(false);
  const [showMessageActions, setShowMessageActions] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [replyTo, setReplyTo] = useState(null);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "Charlie",
      content: "Hey! How are you doing?",
      time: "10:30 AM",
      isMine: false,
      type: "text"
    },
    {
      id: 2,
      sender: "Me",
      content: "I'm good! Just working on my project. How about you?",
      time: "10:32 AM",
      isMine: true,
      type: "text"
    },
    {
      id: 3,
      sender: "Charlie",
      content: "Same here! Want to meet at the library later?",
      time: "10:35 AM",
      isMine: false,
      type: "text"
    },
    {
      id: 4,
      sender: "Me",
      content: "/example.mp4",
      time: "10:40 AM",
      isMine: true,
      type: "video"
    },
    {
      id: 5,
      sender: "Charlie",
      content: "Nice video! See you at 3pm then? 📚",
      time: "10:42 AM",
      isMine: false,
      type: "text"
    },
    {
      id: 6,
      sender: "Me",
      content: "Perfect! See you there! 👍",
      time: "10:43 AM",
      isMine: true,
      type: "text"
    },
  ]);

  const handleSend = () => {
    if (messageInput.trim()) {
      setMessages([...messages, {
        id: messages.length + 1,
        sender: "Me",
        content: messageInput,
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        isMine: true,
        type: "text"
      }]);
      setMessageInput("");
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`h-full flex flex-col transition-colors duration-500 ${
        darkMode ? "bg-slate-900" : "bg-slate-50"
      }`}
    >
      {/* Header */}
      <div className={`flex items-center gap-3 px-4 py-3 border-b transition-colors ${
        darkMode ? "border-slate-700 bg-slate-800" : "border-slate-100 bg-white"
      }`}>
        <button 
          onClick={() => navigateTo('chat')}
          className={`p-2 -ml-2 rounded-lg transition-colors ${
            darkMode ? "hover:bg-slate-700" : "hover:bg-slate-50"
          }`}
        >
          <ChevronLeft className={`w-6 h-6 transition-colors ${darkMode ? "text-slate-300" : "text-slate-600"}`} />
        </button>
        <img 
          src="/Charlie.png" 
          alt="Charlie"
          className="w-10 h-10 rounded-full object-cover shadow" 
        />
        <div className="flex-1">
          <div className={`font-semibold transition-colors ${darkMode ? "text-slate-200" : "text-slate-800"}`}>
            Charlie
          </div>
          <div className={`text-xs transition-colors ${darkMode ? "text-slate-500" : "text-slate-400"}`}>
            Online
          </div>
        </div>
        {/* Voice Call Button */}
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigateTo('voice-call', { username: 'Charlie', avatar: '/Charlie.png', userId: 'u003' })}
          className={`p-2 rounded-lg transition-colors ${
            darkMode ? "hover:bg-slate-700 text-slate-300" : "hover:bg-slate-100 text-slate-600"
          }`}
        >
          <Phone className="w-5 h-5" />
        </motion.button>
        {/* Video Call Button */}
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigateTo('video-call', { username: 'Charlie', avatar: '/Charlie.png', userId: 'u003' })}
          className={`p-2 rounded-lg transition-colors ${
            darkMode ? "hover:bg-slate-700 text-slate-300" : "hover:bg-slate-100 text-slate-600"
          }`}
        >
          <Video className="w-5 h-5" />
        </motion.button>
        <button 
          onClick={() => navigateTo('chat-settings-c001')}
          className={`p-2 rounded-lg transition-colors ${
            darkMode ? "hover:bg-slate-700" : "hover:bg-slate-50"
          }`}
        >
          <MoreVertical className={`w-5 h-5 transition-colors ${darkMode ? "text-slate-400" : "text-slate-600"}`} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`flex ${message.isMine ? "justify-end" : "justify-start"} group`}
          >
            <div className={`max-w-[75%] ${message.isMine ? "items-end" : "items-start"} flex flex-col gap-1`}>
              {replyTo?.id === message.id && (
                <div className={`text-xs px-3 py-1 rounded-lg mb-1 ${
                  darkMode ? "bg-indigo-900/50 text-indigo-300" : "bg-indigo-100 text-indigo-700"
                }`}>
                  <Reply className="w-3 h-3 inline mr-1" />
                  {language === "zh" ? "回复中..." : "Replying..."}
                </div>
              )}
              {message.type === "text" ? (
                <div 
                  onClick={() => {
                    setSelectedMessage(message);
                    setShowMessageActions(true);
                  }}
                  className={`px-4 py-2 rounded-2xl cursor-pointer relative ${
                    message.isMine
                      ? darkMode
                        ? "bg-indigo-600 text-white"
                        : "bg-indigo-600 text-white"
                      : darkMode
                        ? "bg-slate-800 text-slate-200 border border-slate-700"
                        : "bg-white text-slate-800 border border-slate-200"
                  }`}>
                  {message.content}
                  {message.reactions && (
                    <div className="absolute -bottom-2 right-2 flex gap-1">
                      {Object.entries(message.reactions || {}).map(([emoji, count]) => (
                        <span key={emoji} className="bg-white dark:bg-slate-700 px-1.5 py-0.5 rounded-full text-xs shadow-sm border">
                          {emoji} {count}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ) : message.type === "video" ? (
                <video 
                  src={message.content} 
                  controls 
                  className="rounded-xl max-w-full"
                  style={{ maxHeight: '200px' }}
                />
              ) : message.type === "image" ? (
                <img 
                  src={message.content} 
                  alt="Image"
                  className="rounded-xl max-w-full cursor-pointer"
                  style={{ maxHeight: '300px' }}
                  onClick={() => window.open(message.content, '_blank')}
                />
              ) : message.type === "voice" ? (
                <div className={`flex items-center gap-2 px-3 py-2 rounded-2xl ${
                  message.isMine
                    ? darkMode ? "bg-indigo-600" : "bg-indigo-600"
                    : darkMode ? "bg-slate-800 border border-slate-700" : "bg-white border border-slate-200"
                }`}>
                  <button className="p-2 rounded-full bg-white/10 hover:bg-white/20">
                    <Play className="w-4 h-4 text-white" />
                  </button>
                  <div className="flex-1 h-6 bg-white/10 rounded-full relative overflow-hidden">
                    <div className="h-full bg-white/30 rounded-full" style={{ width: '45%' }}></div>
                  </div>
                  <span className="text-xs opacity-80">0:15</span>
                </div>
              ) : null}
              <div className={`text-xs px-2 transition-colors flex items-center gap-1 ${darkMode ? "text-slate-500" : "text-slate-400"}`}>
                <span>{message.time}</span>
                {message.isMine && (
                  <CheckCheck className={`w-3 h-3 ${message.isRead ? "text-blue-500" : ""}`} />
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Input */}
      <div className={`border-t transition-colors ${
        darkMode ? "border-slate-700 bg-slate-800" : "border-slate-100 bg-white"
      }`}>
        {/* Media Selection Menu */}
        <AnimatePresence>
          {showMediaMenu && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className={`px-4 py-3 border-b transition-colors ${
                darkMode ? "border-slate-700" : "border-slate-100"
              }`}
            >
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-xl transition-colors ${
                    darkMode ? "bg-slate-700 hover:bg-slate-600" : "bg-slate-50 hover:bg-slate-100"
                  }`}
                >
                  <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center">
                    <Image className="w-6 h-6 text-white" />
                  </div>
                  <span className={`text-xs font-medium transition-colors ${
                    darkMode ? "text-slate-300" : "text-slate-700"
                  }`}>
                    {language === "zh" ? "图片" : "Image"}
                  </span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-xl transition-colors ${
                    darkMode ? "bg-slate-700 hover:bg-slate-600" : "bg-slate-50 hover:bg-slate-100"
                  }`}
                >
                  <div className="w-12 h-12 rounded-full bg-purple-500 flex items-center justify-center">
                    <Video className="w-6 h-6 text-white" />
                  </div>
                  <span className={`text-xs font-medium transition-colors ${
                    darkMode ? "text-slate-300" : "text-slate-700"
                  }`}>
                    {language === "zh" ? "视频" : "Video"}
                  </span>
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Input Bar */}
        <div className="px-3 py-3 flex items-center gap-1.5">
          {/* Voice Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`p-2 rounded-full flex-shrink-0 transition-colors ${
              darkMode ? "hover:bg-slate-700" : "hover:bg-slate-100"
            }`}
          >
            <Mic className={`w-5 h-5 transition-colors ${
              darkMode ? "text-slate-400" : "text-slate-600"
            }`} />
          </motion.button>

          {/* Input Area Container */}
          <div className="flex-1 flex items-center gap-1 min-w-0">
            <input
              type="text"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder={t("typeMessage", language)}
              className={`flex-1 px-3 py-2 rounded-full border text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-all ${
                darkMode 
                  ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400" 
                  : "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400"
              }`}
            />
            {/* Emoji Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`p-1.5 rounded-full flex-shrink-0 transition-colors ${
                darkMode ? "hover:bg-slate-700" : "hover:bg-slate-100"
              }`}
            >
              <Smile className={`w-4 h-4 transition-colors ${
                darkMode ? "text-slate-400" : "text-slate-600"
              }`} />
            </motion.button>
          </div>

          {/* Plus Button for Media */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowMediaMenu(!showMediaMenu)}
            className={`p-2 rounded-full flex-shrink-0 transition-all ${
              showMediaMenu
                ? "bg-indigo-600 text-white"
                : darkMode
                  ? "hover:bg-slate-700 text-slate-400"
                  : "hover:bg-slate-100 text-slate-600"
            }`}
          >
            <Plus className={`w-5 h-5 transition-transform ${
              showMediaMenu ? "rotate-45" : ""
            }`} />
          </motion.button>

          {/* Send Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSend}
            disabled={!messageInput.trim()}
            className={`p-2 rounded-full flex-shrink-0 transition-all ${
              messageInput.trim()
                ? darkMode
                  ? "bg-indigo-600 text-white hover:bg-indigo-700"
                  : "bg-indigo-600 text-white hover:bg-indigo-700"
                : "bg-slate-200 text-slate-400 cursor-not-allowed"
            }`}
          >
            <Send className="w-5 h-5" />
          </motion.button>
        </div>
      </div>

      {/* Message Actions Modal */}
      <AnimatePresence>
        {showMessageActions && selectedMessage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-end z-50"
            onClick={() => {
              setShowMessageActions(false);
              setSelectedMessage(null);
            }}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className={`w-full rounded-t-3xl p-6 ${
                darkMode ? "bg-slate-800" : "bg-white"
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="space-y-2">
                <button
                  onClick={() => {
                    setReplyTo(selectedMessage);
                    setShowMessageActions(false);
                    setSelectedMessage(null);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                    darkMode ? "hover:bg-slate-700" : "hover:bg-slate-50"
                  }`}
                >
                  <Reply className="w-5 h-5 text-indigo-500" />
                  <span className={darkMode ? "text-slate-200" : "text-slate-900"}>
                    {language === "zh" ? "回复" : "Reply"}
                  </span>
                </button>

                <button
                  onClick={() => {
                    setMessages(prev => prev.map(m => 
                      m.id === selectedMessage.id 
                        ? { ...m, reactions: { ...m.reactions, '👍': (m.reactions?.['👍'] || 0) + 1 } }
                        : m
                    ));
                    setShowMessageActions(false);
                    setSelectedMessage(null);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                    darkMode ? "hover:bg-slate-700" : "hover:bg-slate-50"
                  }`}
                >
                  <Heart className="w-5 h-5 text-red-500" />
                  <span className={darkMode ? "text-slate-200" : "text-slate-900"}>
                    {language === "zh" ? "点赞" : "Like"}
                  </span>
                </button>

                <button
                  onClick={() => {
                    navigator.clipboard.writeText(selectedMessage.content);
                    setShowMessageActions(false);
                    setSelectedMessage(null);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                    darkMode ? "hover:bg-slate-700" : "hover:bg-slate-50"
                  }`}
                >
                  <Copy className="w-5 h-5 text-blue-500" />
                  <span className={darkMode ? "text-slate-200" : "text-slate-900"}>
                    {language === "zh" ? "复制" : "Copy"}
                  </span>
                </button>

                {selectedMessage.isMine && (
                  <>
                    <button
                      onClick={() => {
                        setMessageInput(selectedMessage.content);
                        setShowMessageActions(false);
                        setSelectedMessage(null);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                        darkMode ? "hover:bg-slate-700" : "hover:bg-slate-50"
                      }`}
                    >
                      <Edit3 className="w-5 h-5 text-amber-500" />
                      <span className={darkMode ? "text-slate-200" : "text-slate-900"}>
                        {language === "zh" ? "编辑" : "Edit"}
                      </span>
                    </button>

                    <button
                      onClick={() => {
                        setMessages(prev => prev.filter(m => m.id !== selectedMessage.id));
                        setShowMessageActions(false);
                        setSelectedMessage(null);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 transition-colors ${
                        darkMode ? "hover:bg-slate-700" : "hover:bg-slate-50"
                      }`}
                    >
                      <Trash2 className="w-5 h-5" />
                      <span>{language === "zh" ? "撤回" : "Delete"}</span>
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* =================== CHAT SETTINGS PAGE =================== */
function ChatSettingsPage({ navigateTo, language = "en", darkMode = false }) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`h-full flex flex-col transition-colors duration-500 ${
        darkMode ? "bg-slate-900" : "bg-slate-50"
      }`}
    >
      {/* Header */}
      <div className={`flex items-center gap-3 px-4 py-3 border-b transition-colors ${
        darkMode ? "border-slate-700 bg-slate-800" : "border-slate-100 bg-white"
      }`}>
        <button 
          onClick={() => navigateTo('chat-detail-c001')}
          className={`p-2 -ml-2 rounded-lg transition-colors ${
            darkMode ? "hover:bg-slate-700" : "hover:bg-slate-50"
          }`}
        >
          <ChevronLeft className={`w-6 h-6 transition-colors ${darkMode ? "text-slate-300" : "text-slate-600"}`} />
        </button>
        <div className={`text-lg font-semibold flex-1 text-center transition-colors ${
          darkMode ? "text-slate-200" : "text-slate-800"
        }`}>
          {language === "zh" ? "聊天信息" : "Chat Info"}
        </div>
        <div className="w-10" />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        <style>{`.overflow-y-auto::-webkit-scrollbar { display: none; }`}</style>
        
        {/* User Info */}
        <div className={`flex flex-col items-center py-8 px-4 border-b ${
          darkMode ? "border-slate-700" : "border-slate-100"
        }`}>
          <img 
            src="/Charlie.png" 
            alt="Charlie"
            className="w-20 h-20 rounded-full object-cover shadow-lg mb-3" 
          />
          <div className={`text-xl font-bold mb-1 transition-colors ${
            darkMode ? "text-slate-200" : "text-slate-800"
          }`}>
            Charlie
          </div>
          <div className={`text-sm transition-colors ${
            darkMode ? "text-slate-400" : "text-slate-500"
          }`}>
            {language === "zh" ? "在线" : "Online"}
          </div>
        </div>

        {/* Actions */}
        <div className={`px-4 py-3 border-b ${
          darkMode ? "border-slate-700" : "border-slate-100"
        }`}>
          <button 
            className={`w-full flex items-center justify-between p-4 rounded-xl transition-colors ${
              darkMode ? "bg-slate-800 hover:bg-slate-700" : "bg-white hover:bg-slate-50"
            }`}
          >
            <div className="flex items-center gap-3">
              <Search className={`w-5 h-5 ${darkMode ? "text-indigo-400" : "text-indigo-600"}`} />
              <span className={darkMode ? "text-slate-200" : "text-slate-900"}>
                {language === "zh" ? "搜索聊天内容" : "Search in Chat"}
              </span>
            </div>
            <ChevronRight className={`w-5 h-5 ${darkMode ? "text-slate-500" : "text-slate-400"}`} />
          </button>
        </div>

        {/* Media & Files */}
        <div className={`px-4 py-3 border-b ${
          darkMode ? "border-slate-700" : "border-slate-100"
        }`}>
          <button 
            className={`w-full flex items-center justify-between p-4 rounded-xl mb-2 transition-colors ${
              darkMode ? "bg-slate-800 hover:bg-slate-700" : "bg-white hover:bg-slate-50"
            }`}
          >
            <div className="flex items-center gap-3">
              <Image className={`w-5 h-5 ${darkMode ? "text-blue-400" : "text-blue-600"}`} />
              <span className={darkMode ? "text-slate-200" : "text-slate-900"}>
                {language === "zh" ? "图片与视频" : "Photos & Videos"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                {language === "zh" ? "全部" : "All"}
              </span>
              <ChevronRight className={`w-5 h-5 ${darkMode ? "text-slate-500" : "text-slate-400"}`} />
            </div>
          </button>

          <button 
            className={`w-full flex items-center justify-between p-4 rounded-xl transition-colors ${
              darkMode ? "bg-slate-800 hover:bg-slate-700" : "bg-white hover:bg-slate-50"
            }`}
          >
            <div className="flex items-center gap-3">
              <File className={`w-5 h-5 ${darkMode ? "text-green-400" : "text-green-600"}`} />
              <span className={darkMode ? "text-slate-200" : "text-slate-900"}>
                {language === "zh" ? "文件" : "Files"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                {language === "zh" ? "全部" : "All"}
              </span>
              <ChevronRight className={`w-5 h-5 ${darkMode ? "text-slate-500" : "text-slate-400"}`} />
            </div>
          </button>
        </div>

        {/* Settings */}
        <div className={`px-4 py-3 border-b ${
          darkMode ? "border-slate-700" : "border-slate-100"
        }`}>
          <button 
            className={`w-full flex items-center justify-between p-4 rounded-xl mb-2 transition-colors ${
              darkMode ? "bg-slate-800 hover:bg-slate-700" : "bg-white hover:bg-slate-50"
            }`}
          >
            <div className="flex items-center gap-3">
              <Bell className={`w-5 h-5 ${darkMode ? "text-amber-400" : "text-amber-600"}`} />
              <span className={darkMode ? "text-slate-200" : "text-slate-900"}>
                {language === "zh" ? "消息免打扰" : "Mute Notifications"}
              </span>
            </div>
            <div className={`w-11 h-6 rounded-full transition-colors ${
              darkMode ? "bg-slate-700" : "bg-slate-200"
            }`}>
              <div className={`w-5 h-5 bg-white rounded-full m-0.5 shadow transition-transform`} />
            </div>
          </button>

          <button 
            className={`w-full flex items-center justify-between p-4 rounded-xl transition-colors ${
              darkMode ? "bg-slate-800 hover:bg-slate-700" : "bg-white hover:bg-slate-50"
            }`}
          >
            <div className="flex items-center gap-3">
              <Pin className={`w-5 h-5 ${darkMode ? "text-purple-400" : "text-purple-600"}`} />
              <span className={darkMode ? "text-slate-200" : "text-slate-900"}>
                {language === "zh" ? "置顶聊天" : "Pin Chat"}
              </span>
            </div>
            <div className={`w-11 h-6 rounded-full transition-colors ${
              darkMode ? "bg-slate-700" : "bg-slate-200"
            }`}>
              <div className={`w-5 h-5 bg-white rounded-full m-0.5 shadow transition-transform`} />
            </div>
          </button>
        </div>

        {/* Danger Zone */}
        <div className="px-4 py-3">
          <button 
            className={`w-full flex items-center justify-between p-4 rounded-xl mb-2 transition-colors ${
              darkMode ? "bg-slate-800 hover:bg-slate-700" : "bg-white hover:bg-slate-50"
            }`}
          >
            <div className="flex items-center gap-3">
              <Trash2 className={`w-5 h-5 ${darkMode ? "text-slate-400" : "text-slate-500"}`} />
              <span className={darkMode ? "text-slate-200" : "text-slate-900"}>
                {language === "zh" ? "清空聊天记录" : "Clear Chat History"}
              </span>
            </div>
            <ChevronRight className={`w-5 h-5 ${darkMode ? "text-slate-500" : "text-slate-400"}`} />
          </button>

          <button 
            className={`w-full flex items-center justify-between p-4 rounded-xl transition-colors ${
              darkMode ? "bg-slate-800 hover:bg-slate-700" : "bg-white hover:bg-slate-50"
            }`}
          >
            <div className="flex items-center gap-3">
              <UserX className="w-5 h-5 text-red-500" />
              <span className="text-red-500">
                {language === "zh" ? "屏蔽此人" : "Block User"}
              </span>
            </div>
            <ChevronRight className={`w-5 h-5 ${darkMode ? "text-slate-500" : "text-slate-400"}`} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

/* =================== PROJECT GROUP CHAT DETAIL PAGE =================== */
function ProjectGroupChatDetail({ navigateTo, language = "en", darkMode = false }) {
  const [messageInput, setMessageInput] = useState("");
  const [showMediaMenu, setShowMediaMenu] = useState(false);
  const [showMessageActions, setShowMessageActions] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  
  // 群成员信息
  const groupMembers = {
    "David": { name: "David", avatar: "/Bob.png", isPro: false },
    "Sarah": { name: "Sarah", avatar: "/Alice.png", isPro: true },
    "Emily": { name: "Emily", avatar: "/Emma.png", isPro: true },
  };
  
  const [messages, setMessages] = useState([
    {
      id: 1,
      senderId: "David",
      sender: "David",
      content: "Hey team! Let's discuss our project progress.",
      time: "9:00 AM",
      isMine: false,
      type: "text"
    },
    {
      id: 2,
      senderId: "Sarah",
      sender: "Sarah",
      content: "I've finished the frontend design. Check it out!",
      time: "9:05 AM",
      isMine: false,
      type: "text"
    },
    {
      id: 3,
      sender: "Me",
      content: "Great work Sarah! I'm working on the backend API.",
      time: "9:08 AM",
      isMine: true,
      type: "text"
    },
    {
      id: 4,
      senderId: "David",
      sender: "David",
      content: "Don't forget the deadline is this Friday!",
      time: "9:15 AM",
      isMine: false,
      type: "text"
    },
    {
      id: 5,
      sender: "Me",
      content: "Got it! I'll have my part ready by Wednesday.",
      time: "9:17 AM",
      isMine: true,
      type: "text"
    },
    {
      id: 6,
      senderId: "Emily",
      sender: "Emily",
      content: "I can help with the testing phase! 🚀",
      time: "9:18 AM",
      isMine: false,
      type: "text"
    },
    {
      id: 7,
      senderId: "Sarah",
      sender: "Sarah",
      content: "Perfect! Let's have a meeting tomorrow to sync up. 📅",
      time: "9:20 AM",
      isMine: false,
      type: "text"
    },
  ]);

  const handleSend = () => {
    if (messageInput.trim()) {
      setMessages([...messages, {
        id: messages.length + 1,
        sender: "Me",
        content: messageInput,
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        isMine: true,
        type: "text"
      }]);
      setMessageInput("");
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`h-full flex flex-col transition-colors duration-500 ${
        darkMode ? "bg-slate-900" : "bg-slate-50"
      }`}
    >
      {/* Header */}
      <div className={`flex items-center gap-3 px-4 py-3 border-b transition-colors ${
        darkMode ? "border-slate-700 bg-slate-800" : "border-slate-100 bg-white"
      }`}>
        <button 
          onClick={() => navigateTo('chat')}
          className={`p-2 -ml-2 rounded-lg transition-colors ${
            darkMode ? "hover:bg-slate-700" : "hover:bg-slate-50"
          }`}
        >
          <ChevronLeft className={`w-6 h-6 transition-colors ${darkMode ? "text-slate-300" : "text-slate-600"}`} />
        </button>
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-400 shadow" />
        <div className="flex-1">
          <div className={`font-semibold transition-colors ${darkMode ? "text-slate-200" : "text-slate-800"}`}>
            Project Group
          </div>
          <div className={`text-xs transition-colors ${darkMode ? "text-slate-500" : "text-slate-400"}`}>
            3 members
          </div>
        </div>
        <button 
          onClick={() => navigateTo('group-settings-g001')}
          className={`p-2 rounded-lg transition-colors ${
            darkMode ? "hover:bg-slate-700" : "hover:bg-slate-50"
          }`}
        >
          <MoreVertical className={`w-5 h-5 transition-colors ${darkMode ? "text-slate-400" : "text-slate-600"}`} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((message, index) => {
          const memberInfo = message.senderId ? groupMembers[message.senderId] : null;
          const isPro = memberInfo?.isPro || false;
          
          return (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`flex ${message.isMine ? "justify-end" : "justify-start items-start gap-2"}`}
            >
              {/* 头像 - 只在非本人消息时显示 */}
              {!message.isMine && memberInfo && (
                <img 
                  src={memberInfo.avatar} 
                  alt={memberInfo.name}
                  className="w-8 h-8 rounded-full object-cover mt-1 flex-shrink-0" 
                />
              )}
              
              <div className={`max-w-[70%] ${message.isMine ? "items-end" : "items-start"} flex flex-col gap-1`}>
                {/* 发送者名字 - 只在非本人消息时显示 */}
                {!message.isMine && (
                  <div className="flex items-center gap-1 px-2">
                    <span className={`text-xs font-medium ${
                      isPro 
                        ? "bg-gradient-to-r from-amber-500 via-pink-500 to-purple-500 bg-clip-text text-transparent"
                        : darkMode ? "text-slate-400" : "text-slate-500"
                    }`}>
                      {message.sender}
                    </span>
                    {isPro && (
                      <Crown className="w-3 h-3 text-amber-500" />
                    )}
                  </div>
                )}
                
                {/* 消息气泡 */}
                <div 
                  onClick={() => {
                    setSelectedMessage(message);
                    setShowMessageActions(true);
                  }}
                  className={`px-4 py-2 rounded-2xl cursor-pointer ${
                    message.isMine
                      ? darkMode
                        ? "bg-indigo-600 text-white"
                        : "bg-indigo-600 text-white"
                      : darkMode
                        ? "bg-slate-800 text-slate-200 border border-slate-700"
                        : "bg-white text-slate-800 border border-slate-200"
                  }`}
                >
                  {message.content}
                </div>
                
                {/* 时间 */}
                <div className={`text-xs px-2 transition-colors ${darkMode ? "text-slate-500" : "text-slate-400"}`}>
                  {message.time}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Input */}
      <div className={`border-t transition-colors ${
        darkMode ? "border-slate-700 bg-slate-800" : "border-slate-100 bg-white"
      }`}>
        {/* Media Selection Menu */}
        <AnimatePresence>
          {showMediaMenu && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className={`px-4 py-3 border-b transition-colors ${
                darkMode ? "border-slate-700" : "border-slate-100"
              }`}
            >
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-xl transition-colors ${
                    darkMode ? "bg-slate-700 hover:bg-slate-600" : "bg-slate-50 hover:bg-slate-100"
                  }`}
                >
                  <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center">
                    <Image className="w-6 h-6 text-white" />
                  </div>
                  <span className={`text-xs font-medium transition-colors ${
                    darkMode ? "text-slate-300" : "text-slate-700"
                  }`}>
                    {language === "zh" ? "图片" : "Image"}
                  </span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-xl transition-colors ${
                    darkMode ? "bg-slate-700 hover:bg-slate-600" : "bg-slate-50 hover:bg-slate-100"
                  }`}
                >
                  <div className="w-12 h-12 rounded-full bg-purple-500 flex items-center justify-center">
                    <Video className="w-6 h-6 text-white" />
                  </div>
                  <span className={`text-xs font-medium transition-colors ${
                    darkMode ? "text-slate-300" : "text-slate-700"
                  }`}>
                    {language === "zh" ? "视频" : "Video"}
                  </span>
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Input Bar */}
        <div className="px-3 py-3 flex items-center gap-1.5">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`p-2 rounded-full flex-shrink-0 transition-colors ${
              darkMode ? "hover:bg-slate-700" : "hover:bg-slate-100"
            }`}
          >
            <Mic className={`w-5 h-5 transition-colors ${
              darkMode ? "text-slate-400" : "text-slate-600"
            }`} />
          </motion.button>

          <div className="flex-1 flex items-center gap-1 min-w-0">
            <input
              type="text"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder={t("typeMessage", language)}
              className={`flex-1 px-3 py-2 rounded-full border text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-all ${
                darkMode 
                  ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400" 
                  : "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400"
              }`}
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`p-1.5 rounded-full flex-shrink-0 transition-colors ${
                darkMode ? "hover:bg-slate-700" : "hover:bg-slate-100"
              }`}
            >
              <Smile className={`w-4 h-4 transition-colors ${
                darkMode ? "text-slate-400" : "text-slate-600"
              }`} />
            </motion.button>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowMediaMenu(!showMediaMenu)}
            className={`p-2 rounded-full flex-shrink-0 transition-all ${
              showMediaMenu
                ? "bg-indigo-600 text-white"
                : darkMode
                  ? "hover:bg-slate-700 text-slate-400"
                  : "hover:bg-slate-100 text-slate-600"
            }`}
          >
            <Plus className={`w-5 h-5 transition-transform ${
              showMediaMenu ? "rotate-45" : ""
            }`} />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSend}
            disabled={!messageInput.trim()}
            className={`p-2 rounded-full flex-shrink-0 transition-all ${
              messageInput.trim()
                ? darkMode
                  ? "bg-indigo-600 text-white hover:bg-indigo-700"
                  : "bg-indigo-600 text-white hover:bg-indigo-700"
                : "bg-slate-200 text-slate-400 cursor-not-allowed"
            }`}
          >
            <Send className="w-5 h-5" />
          </motion.button>
        </div>
      </div>

      {/* Message Actions Modal */}
      <AnimatePresence>
        {showMessageActions && selectedMessage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-end z-50"
            onClick={() => {
              setShowMessageActions(false);
              setSelectedMessage(null);
            }}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className={`w-full rounded-t-3xl p-6 ${
                darkMode ? "bg-slate-800" : "bg-white"
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="space-y-2">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(selectedMessage.content);
                    setShowMessageActions(false);
                    setSelectedMessage(null);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                    darkMode ? "hover:bg-slate-700" : "hover:bg-slate-50"
                  }`}
                >
                  <Copy className="w-5 h-5 text-blue-500" />
                  <span className={darkMode ? "text-slate-200" : "text-slate-900"}>
                    {language === "zh" ? "复制" : "Copy"}
                  </span>
                </button>

                {selectedMessage.isMine && (
                  <button
                    onClick={() => {
                      setMessages(prev => prev.filter(m => m.id !== selectedMessage.id));
                      setShowMessageActions(false);
                      setSelectedMessage(null);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 transition-colors ${
                      darkMode ? "hover:bg-slate-700" : "hover:bg-slate-50"
                    }`}
                  >
                    <Trash2 className="w-5 h-5" />
                    <span>{language === "zh" ? "撤回" : "Delete"}</span>
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* =================== GROUP CHAT SETTINGS PAGE =================== */
function GroupChatSettingsPage({ navigateTo, language = "en", darkMode = false }) {
  const groupMembers = [
    { id: 1, name: "David", avatar: "/Bob.png", role: "member", isPro: false },
    { id: 2, name: "Sarah", avatar: "/Alice.png", role: "admin", isPro: true },
    { id: 3, name: "Emily", avatar: "/Emma.png", role: "member", isPro: true },
    { id: 4, name: "Me", avatar: "/Dana.png", role: "owner", isPro: false },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`h-full flex flex-col transition-colors duration-500 ${
        darkMode ? "bg-slate-900" : "bg-slate-50"
      }`}
    >
      {/* Header */}
      <div className={`flex items-center gap-3 px-4 py-3 border-b transition-colors ${
        darkMode ? "border-slate-700 bg-slate-800" : "border-slate-100 bg-white"
      }`}>
        <button 
          onClick={() => navigateTo('chat-detail-g001')}
          className={`p-2 -ml-2 rounded-lg transition-colors ${
            darkMode ? "hover:bg-slate-700" : "hover:bg-slate-50"
          }`}
        >
          <ChevronLeft className={`w-6 h-6 transition-colors ${darkMode ? "text-slate-300" : "text-slate-600"}`} />
        </button>
        <div className={`text-lg font-semibold flex-1 text-center transition-colors ${
          darkMode ? "text-slate-200" : "text-slate-800"
        }`}>
          {language === "zh" ? "群聊信息" : "Group Info"}
        </div>
        <div className="w-10" />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        <style>{`.overflow-y-auto::-webkit-scrollbar { display: none; }`}</style>
        
        {/* Group Info */}
        <div className={`flex flex-col items-center py-8 px-4 border-b ${
          darkMode ? "border-slate-700" : "border-slate-100"
        }`}>
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-400 shadow-lg mb-3 flex items-center justify-center">
            <Users className="w-10 h-10 text-white" />
          </div>
          <div className={`text-xl font-bold mb-1 transition-colors ${
            darkMode ? "text-slate-200" : "text-slate-800"
          }`}>
            Project Group
          </div>
          <div className={`text-sm transition-colors ${
            darkMode ? "text-slate-400" : "text-slate-500"
          }`}>
            {groupMembers.length} {language === "zh" ? "名成员" : "members"}
          </div>
        </div>

        {/* Group Members */}
        <div className={`px-4 py-3 border-b ${
          darkMode ? "border-slate-700" : "border-slate-100"
        }`}>
          <div className="flex items-center justify-between mb-3">
            <span className={`font-medium ${darkMode ? "text-slate-300" : "text-slate-700"}`}>
              {language === "zh" ? "群成员" : "Group Members"}
            </span>
            <span className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
              {groupMembers.length}/100
            </span>
          </div>
          
          <div className="grid grid-cols-5 gap-3 mb-3">
            {groupMembers.map((member) => (
              <div key={member.id} className="flex flex-col items-center">
                <div className="relative">
                  <img 
                    src={member.avatar} 
                    alt={member.name}
                    className="w-12 h-12 rounded-full object-cover mb-1" 
                  />
                  {member.role === 'owner' && (
                    <Crown className="w-3 h-3 text-amber-500 absolute -top-1 -right-1" />
                  )}
                  {member.role === 'admin' && (
                    <Star className="w-3 h-3 text-blue-500 absolute -top-1 -right-1" />
                  )}
                </div>
                <span className={`text-xs truncate w-full text-center ${
                  member.isPro 
                    ? "bg-gradient-to-r from-amber-500 via-pink-500 to-purple-500 bg-clip-text text-transparent font-semibold"
                    : darkMode ? "text-slate-400" : "text-slate-600"
                }`}>
                  {member.name}
                </span>
              </div>
            ))}
            <button className="flex flex-col items-center">
              <div className={`w-12 h-12 rounded-full border-2 border-dashed flex items-center justify-center mb-1 ${
                darkMode ? "border-slate-600" : "border-slate-300"
              }`}>
                <Plus className={`w-5 h-5 ${darkMode ? "text-slate-500" : "text-slate-400"}`} />
              </div>
              <span className={`text-xs ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
                {language === "zh" ? "邀请" : "Invite"}
              </span>
            </button>
          </div>
          
          <button className={`w-full py-2 rounded-lg text-sm transition-colors ${
            darkMode ? "bg-slate-800 text-slate-300 hover:bg-slate-700" : "bg-slate-50 text-slate-700 hover:bg-slate-100"
          }`}>
            {language === "zh" ? "查看全部成员" : "View All Members"} <ChevronRight className="w-4 h-4 inline" />
          </button>
        </div>

        {/* Search */}
        <div className={`px-4 py-3 border-b ${
          darkMode ? "border-slate-700" : "border-slate-100"
        }`}>
          <button 
            className={`w-full flex items-center justify-between p-4 rounded-xl transition-colors ${
              darkMode ? "bg-slate-800 hover:bg-slate-700" : "bg-white hover:bg-slate-50"
            }`}
          >
            <div className="flex items-center gap-3">
              <Search className={`w-5 h-5 ${darkMode ? "text-indigo-400" : "text-indigo-600"}`} />
              <span className={darkMode ? "text-slate-200" : "text-slate-900"}>
                {language === "zh" ? "搜索聊天内容" : "Search in Chat"}
              </span>
            </div>
            <ChevronRight className={`w-5 h-5 ${darkMode ? "text-slate-500" : "text-slate-400"}`} />
          </button>
        </div>

        {/* Group Announcement */}
        <div className={`px-4 py-3 border-b ${
          darkMode ? "border-slate-700" : "border-slate-100"
        }`}>
          <button 
            className={`w-full flex items-center justify-between p-4 rounded-xl transition-colors ${
              darkMode ? "bg-slate-800 hover:bg-slate-700" : "bg-white hover:bg-slate-50"
            }`}
          >
            <div className="flex items-center gap-3">
              <Bell className={`w-5 h-5 ${darkMode ? "text-amber-400" : "text-amber-600"}`} />
              <div className="flex-1 text-left">
                <div className={darkMode ? "text-slate-200" : "text-slate-900"}>
                  {language === "zh" ? "群公告" : "Group Announcement"}
                </div>
                <div className={`text-xs mt-0.5 ${darkMode ? "text-slate-500" : "text-slate-400"}`}>
                  {language === "zh" ? "未填写" : "Not set"}
                </div>
              </div>
            </div>
            <ChevronRight className={`w-5 h-5 ${darkMode ? "text-slate-500" : "text-slate-400"}`} />
          </button>
        </div>

        {/* Media & Files */}
        <div className={`px-4 py-3 border-b ${
          darkMode ? "border-slate-700" : "border-slate-100"
        }`}>
          <button 
            className={`w-full flex items-center justify-between p-4 rounded-xl mb-2 transition-colors ${
              darkMode ? "bg-slate-800 hover:bg-slate-700" : "bg-white hover:bg-slate-50"
            }`}
          >
            <div className="flex items-center gap-3">
              <Image className={`w-5 h-5 ${darkMode ? "text-blue-400" : "text-blue-600"}`} />
              <span className={darkMode ? "text-slate-200" : "text-slate-900"}>
                {language === "zh" ? "群相册" : "Group Album"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                {language === "zh" ? "全部" : "All"}
              </span>
              <ChevronRight className={`w-5 h-5 ${darkMode ? "text-slate-500" : "text-slate-400"}`} />
            </div>
          </button>

          <button 
            className={`w-full flex items-center justify-between p-4 rounded-xl transition-colors ${
              darkMode ? "bg-slate-800 hover:bg-slate-700" : "bg-white hover:bg-slate-50"
            }`}
          >
            <div className="flex items-center gap-3">
              <File className={`w-5 h-5 ${darkMode ? "text-green-400" : "text-green-600"}`} />
              <span className={darkMode ? "text-slate-200" : "text-slate-900"}>
                {language === "zh" ? "文件" : "Files"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                {language === "zh" ? "全部" : "All"}
              </span>
              <ChevronRight className={`w-5 h-5 ${darkMode ? "text-slate-500" : "text-slate-400"}`} />
            </div>
          </button>
        </div>

        {/* Settings */}
        <div className={`px-4 py-3 border-b ${
          darkMode ? "border-slate-700" : "border-slate-100"
        }`}>
          <button 
            className={`w-full flex items-center justify-between p-4 rounded-xl mb-2 transition-colors ${
              darkMode ? "bg-slate-800 hover:bg-slate-700" : "bg-white hover:bg-slate-50"
            }`}
          >
            <div className="flex items-center gap-3">
              <Bell className={`w-5 h-5 ${darkMode ? "text-amber-400" : "text-amber-600"}`} />
              <span className={darkMode ? "text-slate-200" : "text-slate-900"}>
                {language === "zh" ? "消息免打扰" : "Mute Notifications"}
              </span>
            </div>
            <div className={`w-11 h-6 rounded-full transition-colors ${
              darkMode ? "bg-slate-700" : "bg-slate-200"
            }`}>
              <div className={`w-5 h-5 bg-white rounded-full m-0.5 shadow transition-transform`} />
            </div>
          </button>

          <button 
            className={`w-full flex items-center justify-between p-4 rounded-xl transition-colors ${
              darkMode ? "bg-slate-800 hover:bg-slate-700" : "bg-white hover:bg-slate-50"
            }`}
          >
            <div className="flex items-center gap-3">
              <Pin className={`w-5 h-5 ${darkMode ? "text-purple-400" : "text-purple-600"}`} />
              <span className={darkMode ? "text-slate-200" : "text-slate-900"}>
                {language === "zh" ? "置顶聊天" : "Pin Chat"}
              </span>
            </div>
            <div className={`w-11 h-6 rounded-full transition-colors ${
              darkMode ? "bg-slate-700" : "bg-slate-200"
            }`}>
              <div className={`w-5 h-5 bg-white rounded-full m-0.5 shadow transition-transform`} />
            </div>
          </button>
        </div>

        {/* Group Management */}
        <div className="px-4 py-3">
          <button 
            className={`w-full flex items-center justify-between p-4 rounded-xl mb-2 transition-colors ${
              darkMode ? "bg-slate-800 hover:bg-slate-700" : "bg-white hover:bg-slate-50"
            }`}
          >
            <div className="flex items-center gap-3">
              <Trash2 className={`w-5 h-5 ${darkMode ? "text-slate-400" : "text-slate-500"}`} />
              <span className={darkMode ? "text-slate-200" : "text-slate-900"}>
                {language === "zh" ? "清空聊天记录" : "Clear Chat History"}
              </span>
            </div>
            <ChevronRight className={`w-5 h-5 ${darkMode ? "text-slate-500" : "text-slate-400"}`} />
          </button>

          <button 
            className={`w-full flex items-center justify-between p-4 rounded-xl transition-colors ${
              darkMode ? "bg-slate-800 hover:bg-slate-700" : "bg-white hover:bg-slate-50"
            }`}
          >
            <div className="flex items-center gap-3">
              <LogIn className="w-5 h-5 text-red-500 rotate-180" />
              <span className="text-red-500">
                {language === "zh" ? "退出群聊" : "Leave Group"}
              </span>
            </div>
            <ChevronRight className={`w-5 h-5 ${darkMode ? "text-slate-500" : "text-slate-400"}`} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

/* =================== EMMA CHAT DETAIL PAGE =================== */
function EmmaChatDetail({ navigateTo, language = "en", darkMode = false }) {
  const [messageInput, setMessageInput] = useState("");
  const [showMediaMenu, setShowMediaMenu] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "Emma",
      content: "Hey! Did you finish the lecture notes?",
      time: "Yesterday 3:20 PM",
      isMine: false,
      type: "text"
    },
    {
      id: 2,
      sender: "Me",
      content: "Yes! I just sent them to you via email.",
      time: "Yesterday 3:25 PM",
      isMine: true,
      type: "text"
    },
    {
      id: 3,
      sender: "Emma",
      content: "Thanks for the notes! 📚",
      time: "Yesterday 3:28 PM",
      isMine: false,
      type: "text"
    },
    {
      id: 4,
      sender: "Emma",
      content: "You're a lifesaver! I missed that class.",
      time: "Yesterday 3:29 PM",
      isMine: false,
      type: "text"
    },
    {
      id: 5,
      sender: "Me",
      content: "No problem! Happy to help 😊",
      time: "Yesterday 3:30 PM",
      isMine: true,
      type: "text"
    },
    {
      id: 6,
      sender: "Emma",
      content: "Want to study together for the exam next week?",
      time: "Yesterday 3:32 PM",
      isMine: false,
      type: "text"
    },
  ]);

  const handleSend = () => {
    if (messageInput.trim()) {
      setMessages([...messages, {
        id: messages.length + 1,
        sender: "Me",
        content: messageInput,
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        isMine: true,
        type: "text"
      }]);
      setMessageInput("");
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`h-full flex flex-col transition-colors duration-500 ${
        darkMode ? "bg-slate-900" : "bg-slate-50"
      }`}
    >
      {/* Header */}
      <div className={`flex items-center gap-3 px-4 py-3 border-b transition-colors ${
        darkMode ? "border-slate-700 bg-slate-800" : "border-slate-100 bg-white"
      }`}>
        <button 
          onClick={() => navigateTo('chat')}
          className={`p-2 -ml-2 rounded-lg transition-colors ${
            darkMode ? "hover:bg-slate-700" : "hover:bg-slate-50"
          }`}
        >
          <ChevronLeft className={`w-6 h-6 transition-colors ${darkMode ? "text-slate-300" : "text-slate-600"}`} />
        </button>
        <img 
          src="/Emma.png" 
          alt="Emma"
          className="w-10 h-10 rounded-full object-cover shadow" 
        />
        <div className="flex-1">
          <div className={`font-semibold transition-colors ${darkMode ? "text-slate-200" : "text-slate-800"}`}>
            Emma
          </div>
          <div className={`text-xs transition-colors ${darkMode ? "text-slate-500" : "text-slate-400"}`}>
            Online
          </div>
        </div>
        {/* Voice Call Button */}
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigateTo('voice-call', { username: 'Emma', avatar: '/Emma.png', userId: 'u004' })}
          className={`p-2 rounded-lg transition-colors ${
            darkMode ? "hover:bg-slate-700 text-slate-300" : "hover:bg-slate-100 text-slate-600"
          }`}
        >
          <Phone className="w-5 h-5" />
        </motion.button>
        {/* Video Call Button */}
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigateTo('video-call', { username: 'Emma', avatar: '/Emma.png', userId: 'u004' })}
          className={`p-2 rounded-lg transition-colors ${
            darkMode ? "hover:bg-slate-700 text-slate-300" : "hover:bg-slate-100 text-slate-600"
          }`}
        >
          <Video className="w-5 h-5" />
        </motion.button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`flex ${message.isMine ? "justify-end" : "justify-start"}`}
          >
            <div className={`max-w-[75%] ${message.isMine ? "items-end" : "items-start"} flex flex-col gap-1`}>
              <div className={`px-4 py-2 rounded-2xl ${
                message.isMine
                  ? darkMode
                    ? "bg-indigo-600 text-white"
                    : "bg-indigo-600 text-white"
                  : darkMode
                    ? "bg-slate-800 text-slate-200 border border-slate-700"
                    : "bg-white text-slate-800 border border-slate-200"
              }`}>
                {message.content}
              </div>
              <div className={`text-xs px-2 transition-colors ${darkMode ? "text-slate-500" : "text-slate-400"}`}>
                {message.time}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Input */}
      <div className={`border-t transition-colors ${
        darkMode ? "border-slate-700 bg-slate-800" : "border-slate-100 bg-white"
      }`}>
        {/* Media Selection Menu */}
        <AnimatePresence>
          {showMediaMenu && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className={`px-4 py-3 border-b transition-colors ${
                darkMode ? "border-slate-700" : "border-slate-100"
              }`}
            >
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-xl transition-colors ${
                    darkMode ? "bg-slate-700 hover:bg-slate-600" : "bg-slate-50 hover:bg-slate-100"
                  }`}
                >
                  <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center">
                    <Image className="w-6 h-6 text-white" />
                  </div>
                  <span className={`text-xs font-medium transition-colors ${
                    darkMode ? "text-slate-300" : "text-slate-700"
                  }`}>
                    {language === "zh" ? "图片" : "Image"}
                  </span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-xl transition-colors ${
                    darkMode ? "bg-slate-700 hover:bg-slate-600" : "bg-slate-50 hover:bg-slate-100"
                  }`}
                >
                  <div className="w-12 h-12 rounded-full bg-purple-500 flex items-center justify-center">
                    <Video className="w-6 h-6 text-white" />
                  </div>
                  <span className={`text-xs font-medium transition-colors ${
                    darkMode ? "text-slate-300" : "text-slate-700"
                  }`}>
                    {language === "zh" ? "视频" : "Video"}
                  </span>
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Input Bar */}
        <div className="px-3 py-3 flex items-center gap-1.5">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`p-2 rounded-full flex-shrink-0 transition-colors ${
              darkMode ? "hover:bg-slate-700" : "hover:bg-slate-100"
            }`}
          >
            <Mic className={`w-5 h-5 transition-colors ${
              darkMode ? "text-slate-400" : "text-slate-600"
            }`} />
          </motion.button>

          <div className="flex-1 flex items-center gap-1 min-w-0">
            <input
              type="text"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder={t("typeMessage", language)}
              className={`flex-1 px-3 py-2 rounded-full border text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-all ${
                darkMode 
                  ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400" 
                  : "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400"
              }`}
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`p-1.5 rounded-full flex-shrink-0 transition-colors ${
                darkMode ? "hover:bg-slate-700" : "hover:bg-slate-100"
              }`}
            >
              <Smile className={`w-4 h-4 transition-colors ${
                darkMode ? "text-slate-400" : "text-slate-600"
              }`} />
            </motion.button>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowMediaMenu(!showMediaMenu)}
            className={`p-2 rounded-full flex-shrink-0 transition-all ${
              showMediaMenu
                ? "bg-indigo-600 text-white"
                : darkMode
                  ? "hover:bg-slate-700 text-slate-400"
                  : "hover:bg-slate-100 text-slate-600"
            }`}
          >
            <Plus className={`w-5 h-5 transition-transform ${
              showMediaMenu ? "rotate-45" : ""
            }`} />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSend}
            disabled={!messageInput.trim()}
            className={`p-2 rounded-full flex-shrink-0 transition-all ${
              messageInput.trim()
                ? darkMode
                  ? "bg-indigo-600 text-white hover:bg-indigo-700"
                  : "bg-indigo-600 text-white hover:bg-indigo-700"
                : "bg-slate-200 text-slate-400 cursor-not-allowed"
            }`}
          >
            <Send className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

/* =================== ADD FRIEND PAGE =================== */
function AddFriendPage({ navigateTo, language = "en", darkMode = false }) {
  const [userId, setUserId] = useState("");
  const [searchResult, setSearchResult] = useState(null);

  const handleSearch = () => {
    if (userId.trim()) {
      // Simulate search result
      setSearchResult({
        username: "Alex Chen",
        userId: "ID: " + userId,
        bio: "Computer Science Major",
        avatar: "from-emerald-500 to-emerald-400"
      });
    }
  };

  const handleScanQR = () => {
    // Simulate QR scan - navigate to a scan page or show camera
    alert(language === "zh" ? "扫码功能演示" : "QR Scan Demo");
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`h-full flex flex-col transition-colors duration-500 ${
        darkMode ? "bg-slate-900" : "bg-white"
      }`}
    >
      {/* Header */}
      <div className={`flex items-center justify-between px-4 py-3 border-b transition-colors ${
        darkMode ? "border-slate-700 bg-slate-800" : "border-slate-100 bg-white"
      }`}>
        <button 
          onClick={() => navigateTo('chat')}
          className={`p-2 -ml-2 rounded-lg transition-colors ${
            darkMode ? "hover:bg-slate-700" : "hover:bg-slate-50"
          }`}
        >
          <ChevronLeft className={`w-6 h-6 transition-colors ${darkMode ? "text-slate-300" : "text-slate-600"}`} />
        </button>
        <div className={`text-xl font-bold tracking-wide transition-colors ${
          darkMode ? "text-indigo-400" : "text-indigo-600"
        }`}>
          {t("addFriend", language)}
        </div>
        <div className="w-10"></div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6">
        {/* Search by ID */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-2xl border p-5 mb-4 transition-colors ${
            darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
          }`}
        >
          <div className="flex items-center gap-2 mb-3">
            <Search className={`w-5 h-5 transition-colors ${darkMode ? "text-indigo-400" : "text-indigo-600"}`} />
            <div className={`font-semibold transition-colors ${darkMode ? "text-slate-200" : "text-slate-800"}`}>
              {t("searchById", language)}
            </div>
          </div>
          
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              placeholder={t("enterUserId", language)}
              className={`flex-1 px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-all ${
                darkMode 
                  ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400" 
                  : "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400"
              }`}
            />
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSearch}
              className="px-6 py-3 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors"
            >
              <Search className="w-5 h-5" />
            </motion.button>
          </div>

          {/* Search Result */}
          {searchResult && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`mt-4 p-4 rounded-xl border transition-colors ${
                darkMode ? "bg-slate-700 border-slate-600" : "bg-slate-50 border-slate-200"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${searchResult.avatar} shadow`} />
                <div className="flex-1">
                  <div className={`font-semibold transition-colors ${darkMode ? "text-slate-200" : "text-slate-800"}`}>
                    {searchResult.username}
                  </div>
                  <div className={`text-xs font-mono transition-colors ${darkMode ? "text-slate-500" : "text-slate-400"}`}>
                    {searchResult.userId}
                  </div>
                  <div className={`text-xs mt-1 transition-colors ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                    {searchResult.bio}
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors"
                >
                  {language === "zh" ? "添加" : "Add"}
                </motion.button>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Scan QR Code */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={handleScanQR}
            className={`w-full rounded-2xl border p-6 flex items-center gap-4 transition-all ${
              darkMode 
                ? "bg-slate-800 border-slate-700 hover:bg-slate-700" 
                : "bg-white border-slate-200 hover:bg-slate-50"
            }`}
          >
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center transition-colors ${
              darkMode ? "bg-indigo-600" : "bg-indigo-100"
            }`}>
              <Scan className={`w-7 h-7 transition-colors ${darkMode ? "text-white" : "text-indigo-600"}`} />
            </div>
            <div className="flex-1 text-left">
              <div className={`font-semibold mb-1 transition-colors ${darkMode ? "text-slate-200" : "text-slate-800"}`}>
                {t("scanQRCode", language)}
              </div>
              <div className={`text-sm transition-colors ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                {t("scanToAddFriend", language)}
              </div>
            </div>
            <ChevronRight className={`w-5 h-5 transition-colors ${darkMode ? "text-slate-500" : "text-slate-400"}`} />
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
}

/* =================== LIVE STREAM SETUP PAGE =================== */
function LiveStreamSetupPage({ navigateTo, language = "en", darkMode = false }) {
  const [liveTitle, setLiveTitle] = useState('');
  const [category, setCategory] = useState('chatting');
  const [quality, setQuality] = useState('high');
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);

  const categories = [
    { id: 'gaming', label: t('gaming', language), icon: <Gamepad2 className="w-5 h-5" /> },
    { id: 'chatting', label: t('chatting', language), icon: <MessageCircle className="w-5 h-5" /> },
    { id: 'studying', label: t('studying', language), icon: <Library className="w-5 h-5" /> },
    { id: 'music', label: t('music', language), icon: <Radio className="w-5 h-5" /> },
    { id: 'sports', label: t('sports', language), icon: <Dumbbell className="w-5 h-5" /> },
    { id: 'other', label: t('other', language), icon: <MoreVertical className="w-5 h-5" /> },
  ];

  const selectedCategory = categories.find(c => c.id === category) || categories[1];

  const handleStartStream = () => {
    if (!liveTitle.trim()) {
      alert(language === 'zh' ? '请输入直播标题' : 'Please enter a live title');
      return;
    }
    navigateTo('live-stream-broadcasting', { liveTitle, category, quality });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`h-full relative flex flex-col transition-colors duration-500 ${
        darkMode ? "bg-slate-900" : "bg-slate-50"
      }`}
    >
      {/* Header */}
      <div className={`flex items-center justify-between px-4 py-3 border-b transition-colors ${
        darkMode ? "border-slate-700 bg-slate-800" : "border-slate-100 bg-white"
      }`}>
        <button onClick={() => navigateTo('mine')} className="p-2">
          <ChevronLeft className={`w-6 h-6 ${darkMode ? "text-slate-300" : "text-slate-600"}`} />
        </button>
        <div className={`text-xl font-bold ${darkMode ? "text-indigo-400" : "text-indigo-600"}`}>
          {t("liveSettings", language)}
        </div>
        <div className="w-10" />
      </div>

      <div className="flex-1 overflow-y-auto px-6 pt-6 pb-28">
        {/* Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-2xl overflow-hidden mb-6 aspect-video relative ${
            darkMode ? "bg-slate-800" : "bg-slate-200"
          }`}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <Camera className={`w-16 h-16 ${darkMode ? "text-slate-600" : "text-slate-400"}`} />
          </div>
          <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-sm">
            <span className="text-white text-sm font-medium">{t("preview", language) || "Preview"}</span>
          </div>
        </motion.div>

        {/* Live Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <label className={`block mb-2 text-sm font-medium ${
            darkMode ? "text-slate-300" : "text-slate-700"
          }`}>
            {t("liveTitle", language)}
          </label>
          <input
            type="text"
            value={liveTitle}
            onChange={(e) => setLiveTitle(e.target.value)}
            placeholder={t("enterLiveTitle", language)}
            className={`w-full px-4 py-3 rounded-xl border transition-all ${
              darkMode 
                ? "bg-slate-800 border-slate-700 text-slate-200 placeholder-slate-500" 
                : "bg-white border-slate-200 text-slate-800 placeholder-slate-400"
            } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
          />
        </motion.div>

        {/* Category */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-6"
        >
          <label className={`block mb-2 text-sm font-medium ${
            darkMode ? "text-slate-300" : "text-slate-700"
          }`}>
            {t("liveCategory", language)}
          </label>
          <div className="relative">
            <button
              onClick={() => setShowCategoryMenu(!showCategoryMenu)}
              className={`w-full px-4 py-3 rounded-xl border flex items-center justify-between transition-all ${
                darkMode 
                  ? "bg-slate-800 border-slate-700 text-slate-200" 
                  : "bg-white border-slate-200 text-slate-800"
              }`}
            >
              <div className="flex items-center gap-2">
                {selectedCategory.icon}
                <span>{selectedCategory.label}</span>
              </div>
              <ChevronRight className={`w-5 h-5 transition-transform ${showCategoryMenu ? 'rotate-90' : ''}`} />
            </button>
            
            <AnimatePresence>
              {showCategoryMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`absolute top-full left-0 right-0 mt-2 rounded-xl border shadow-lg overflow-hidden z-10 ${
                    darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
                  }`}
                >
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setCategory(cat.id);
                        setShowCategoryMenu(false);
                      }}
                      className={`w-full px-4 py-3 flex items-center gap-2 transition-colors ${
                        category === cat.id
                          ? darkMode ? "bg-indigo-600 text-white" : "bg-indigo-50 text-indigo-600"
                          : darkMode ? "text-slate-300 hover:bg-slate-700" : "text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      {cat.icon}
                      <span>{cat.label}</span>
                      {category === cat.id && <Check className="w-4 h-4 ml-auto" />}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Quality */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <label className={`block mb-2 text-sm font-medium ${
            darkMode ? "text-slate-300" : "text-slate-700"
          }`}>
            {t("streamQuality", language)}
          </label>
          <div className="grid grid-cols-3 gap-3">
            {['high', 'medium', 'low'].map((q) => (
              <button
                key={q}
                onClick={() => setQuality(q)}
                className={`py-3 rounded-xl font-medium transition-all ${
                  quality === q
                    ? "bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-lg"
                    : darkMode 
                      ? "bg-slate-800 text-slate-300 border border-slate-700" 
                      : "bg-white text-slate-700 border border-slate-200"
                }`}
              >
                {t(q, language)}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Start Button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleStartStream}
          className="w-full py-4 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold text-lg shadow-lg"
        >
          {t("goLive", language)}
        </motion.button>
      </div>
    </motion.div>
  );
}

/* =================== LIVE STREAM BROADCASTING PAGE =================== */
function LiveStreamBroadcastingPage({ navigateTo, language = "en", darkMode = false, liveTitle = "My Live Stream", category = "chatting" }) {
  const [viewers, setViewers] = useState(0);
  const [likes, setLikes] = useState(0);
  const [duration, setDuration] = useState(0);
  const [comments, setComments] = useState([
    { id: 1, username: "Alice", message: "Hello! 👋", avatar: "/Alice.png" },
    { id: 2, username: "Bob", message: "Great stream!", avatar: "/Bob.png" },
  ]);

  React.useEffect(() => {
    // Simulate viewer count changes
    const viewerInterval = setInterval(() => {
      setViewers(prev => Math.max(0, prev + Math.floor(Math.random() * 3) - 1));
    }, 3000);

    // Update duration
    const durationInterval = setInterval(() => {
      setDuration(prev => prev + 1);
    }, 1000);

    // Simulate new comments
    const commentInterval = setInterval(() => {
      const messages = [
        "Nice!", "Cool!", "Amazing!", "Love it! ❤️", "Keep going!", 
        language === 'zh' ? "太棒了！" : "Awesome!",
        language === 'zh' ? "支持支持" : "Support!",
      ];
      const newComment = {
        id: Date.now(),
        username: `User${Math.floor(Math.random() * 100)}`,
        message: messages[Math.floor(Math.random() * messages.length)],
        avatar: `/Dana.png`,
      };
      setComments(prev => [...prev.slice(-10), newComment]);
    }, 5000);

    return () => {
      clearInterval(viewerInterval);
      clearInterval(durationInterval);
      clearInterval(commentInterval);
    };
  }, [language]);

  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEndStream = () => {
    if (window.confirm(language === 'zh' ? '确定要结束直播吗？' : 'Are you sure you want to end the stream?')) {
      navigateTo('mine');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-full relative bg-black"
    >
      {/* Video Preview */}
      <div className="h-full flex items-center justify-center">
        <Camera className="w-24 h-24 text-slate-600" />
      </div>

      {/* Top Overlay */}
      <div className="absolute top-0 left-0 right-0 p-4">
        <div className="flex items-center justify-between">
          {/* LIVE Badge */}
          <motion.div
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="px-3 py-1.5 rounded-full bg-gradient-to-r from-red-500 to-rose-500 shadow-lg"
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
              <span className="text-white font-bold text-sm">{t("liveNow", language)}</span>
            </div>
          </motion.div>

          {/* Stats */}
          <div className="flex items-center gap-2">
            <div className="px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-sm">
              <div className="flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-white" />
                <span className="text-white font-medium text-sm">{viewers}</span>
              </div>
            </div>
            <div className="px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-sm">
              <span className="text-white font-medium text-sm">{formatDuration(duration)}</span>
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="mt-3 px-3 py-2 rounded-xl bg-black/50 backdrop-blur-sm max-w-md">
          <div className="text-white font-medium">{liveTitle}</div>
        </div>
      </div>

      {/* Bottom Overlay - Comments */}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <div className="mb-4 space-y-2">
          {comments.slice(-3).map((comment) => (
            <motion.div
              key={comment.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="px-3 py-2 rounded-xl bg-black/50 backdrop-blur-sm max-w-xs"
            >
              <div className="flex items-center gap-2 mb-1">
                <div className="text-amber-400 font-semibold text-sm">{comment.username}</div>
              </div>
              <div className="text-white text-sm">{comment.message}</div>
            </motion.div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setLikes(prev => prev + 1)}
            className="flex-1 py-3 rounded-xl bg-white/10 backdrop-blur-sm text-white font-medium flex items-center justify-center gap-2"
          >
            <Heart className="w-5 h-5" />
            <span>{likes}</span>
          </button>
          <button
            onClick={handleEndStream}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-red-500 to-rose-500 text-white font-bold"
          >
            {t("endLiveStream", language)}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

/* =================== VOICE CALL PAGE =================== */
function VoiceCallPage({ navigateTo, language = "en", darkMode = false, username = "Charlie", avatar = "/Charlie.png" }) {
  const [callStatus, setCallStatus] = useState('connecting'); // connecting, connected, ended
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(false);

  React.useEffect(() => {
    // Simulate connecting
    const connectTimer = setTimeout(() => {
      setCallStatus('connected');
    }, 2000);

    return () => clearTimeout(connectTimer);
  }, []);

  React.useEffect(() => {
    if (callStatus === 'connected') {
      const durationTimer = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);

      return () => clearInterval(durationTimer);
    }
  }, [callStatus]);

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEndCall = () => {
    setCallStatus('ended');
    setTimeout(() => {
      navigateTo('chat-detail-c001');
    }, 1000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-full relative bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }} />
      </div>

      {/* Content */}
      <div className="relative h-full flex flex-col items-center justify-between p-8">
        {/* Top: Status */}
        <div className="text-center">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-white/90 text-lg mb-2"
          >
            {callStatus === 'connecting' ? (
              <span>{language === 'zh' ? '连接中...' : 'Connecting...'}</span>
            ) : callStatus === 'connected' ? (
              <span>{formatDuration(duration)}</span>
            ) : (
              <span>{language === 'zh' ? '通话已结束' : 'Call Ended'}</span>
            )}
          </motion.div>
        </div>

        {/* Middle: Avatar */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col items-center"
        >
          <div className="relative">
            <motion.div
              animate={callStatus === 'connecting' ? { scale: [1, 1.1, 1] } : {}}
              transition={{ duration: 2, repeat: Infinity }}
              className="relative"
            >
              <img
                src={avatar}
                alt={username}
                className="w-32 h-32 rounded-full object-cover shadow-2xl ring-4 ring-white/20"
              />
              {callStatus === 'connecting' && (
                <div className="absolute inset-0 rounded-full border-4 border-white/30 animate-ping" />
              )}
            </motion.div>
          </div>
          <div className="mt-6 text-white text-2xl font-semibold">{username}</div>
          <div className="mt-2 text-white/70 text-sm">
            {callStatus === 'connecting' 
              ? (language === 'zh' ? '正在呼叫...' : 'Calling...') 
              : (language === 'zh' ? '通话中' : 'On Call')}
          </div>
        </motion.div>

        {/* Bottom: Controls */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="w-full max-w-sm"
        >
          <div className="flex justify-center items-center gap-6">
            {/* Mute Button */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsMuted(!isMuted)}
              className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${
                isMuted 
                  ? 'bg-white/90 text-red-600' 
                  : 'bg-white/20 backdrop-blur-sm text-white'
              }`}
            >
              {isMuted ? <Mic className="w-6 h-6 line-through" /> : <Mic className="w-6 h-6" />}
            </motion.button>

            {/* End Call Button */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleEndCall}
              className="w-20 h-20 rounded-full bg-red-500 flex items-center justify-center shadow-2xl"
            >
              <Phone className="w-8 h-8 text-white rotate-135" />
            </motion.button>

            {/* Speaker Button */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsSpeakerOn(!isSpeakerOn)}
              className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${
                isSpeakerOn 
                  ? 'bg-white/90 text-indigo-600' 
                  : 'bg-white/20 backdrop-blur-sm text-white'
              }`}
            >
              <Volume2 className="w-6 h-6" />
            </motion.button>
          </div>

          <div className="mt-6 flex justify-center gap-4 text-white/60 text-xs">
            <span>{isMuted ? (language === 'zh' ? '已静音' : 'Muted') : (language === 'zh' ? '麦克风开启' : 'Mic On')}</span>
            <span>•</span>
            <span>{isSpeakerOn ? (language === 'zh' ? '扬声器开启' : 'Speaker On') : (language === 'zh' ? '听筒模式' : 'Earpiece')}</span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

/* =================== VIDEO CALL PAGE =================== */
function VideoCallPage({ navigateTo, language = "en", darkMode = false, username = "Charlie", avatar = "/Charlie.png" }) {
  const [callStatus, setCallStatus] = useState('connecting'); // connecting, connected, ended
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [isFrontCamera, setIsFrontCamera] = useState(true);

  React.useEffect(() => {
    // Simulate connecting
    const connectTimer = setTimeout(() => {
      setCallStatus('connected');
    }, 2000);

    return () => clearTimeout(connectTimer);
  }, []);

  React.useEffect(() => {
    if (callStatus === 'connected') {
      const durationTimer = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);

      return () => clearInterval(durationTimer);
    }
  }, [callStatus]);

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEndCall = () => {
    setCallStatus('ended');
    setTimeout(() => {
      navigateTo('chat-detail-c001');
    }, 1000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-full relative bg-black"
    >
      {/* Main Video (Peer) */}
      <div className="h-full relative flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900">
        {callStatus === 'connecting' ? (
          <div className="flex flex-col items-center">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <img
                src={avatar}
                alt={username}
                className="w-32 h-32 rounded-full object-cover shadow-2xl"
              />
            </motion.div>
            <div className="mt-6 text-white text-xl font-semibold">{username}</div>
            <div className="mt-2 text-white/70">{language === 'zh' ? '正在呼叫...' : 'Calling...'}</div>
          </div>
        ) : (
          <Camera className="w-24 h-24 text-slate-600" />
        )}
      </div>

      {/* Self Video (PiP) */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="absolute top-4 right-4 w-28 h-40 rounded-2xl overflow-hidden bg-slate-800 shadow-2xl"
      >
        {isCameraOff ? (
          <div className="h-full flex items-center justify-center bg-slate-700">
            <Camera className="w-8 h-8 text-slate-500" />
          </div>
        ) : (
          <div className="h-full flex items-center justify-center bg-gradient-to-br from-indigo-600 to-purple-600">
            <User className="w-12 h-12 text-white/50" />
          </div>
        )}
      </motion.div>

      {/* Top Bar */}
      <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/60 to-transparent">
        <div className="flex items-center justify-between">
          <div className="text-white font-semibold">{username}</div>
          <div className="px-3 py-1 rounded-full bg-black/50 backdrop-blur-sm">
            <span className="text-white text-sm">
              {callStatus === 'connected' ? formatDuration(duration) : (language === 'zh' ? '连接中...' : 'Connecting...')}
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
        <div className="flex justify-center items-center gap-6">
          {/* Mute Button */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsMuted(!isMuted)}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
              isMuted 
                ? 'bg-white text-red-600' 
                : 'bg-white/20 backdrop-blur-sm text-white'
            }`}
          >
            {isMuted ? <Mic className="w-5 h-5 line-through" /> : <Mic className="w-5 h-5" />}
          </motion.button>

          {/* Camera Off Button */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsCameraOff(!isCameraOff)}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
              isCameraOff 
                ? 'bg-white text-red-600' 
                : 'bg-white/20 backdrop-blur-sm text-white'
            }`}
          >
            {isCameraOff ? <Camera className="w-5 h-5 line-through" /> : <Camera className="w-5 h-5" />}
          </motion.button>

          {/* End Call Button */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleEndCall}
            className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center shadow-2xl"
          >
            <Phone className="w-6 h-6 text-white rotate-135" />
          </motion.button>

          {/* Flip Camera Button */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsFrontCamera(!isFrontCamera)}
            className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm text-white flex items-center justify-center"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

/* =================== WATCH LIVE STREAM PAGE =================== */
function WatchLiveStreamPage({ navigateTo, language = "en", darkMode = false, streamId = "stream_001", username = "Alice", title = "Study Session" }) {
  const [viewers, setViewers] = useState(156);
  const [likes, setLikes] = useState(342);
  const [comments, setComments] = useState([
    { id: 1, username: "Bob", message: "Great content! 👍", avatar: "/Bob.png" },
    { id: 2, username: "Charlie", message: "Keep it up!", avatar: "/Charlie.png" },
  ]);
  const [showGiftPanel, setShowGiftPanel] = useState(false);
  const [message, setMessage] = useState('');

  const gifts = [
    { id: 'rose', name: t('rose', language) || 'Rose', icon: '🌹', cost: 10 },
    { id: 'heart', name: t('heart', language) || 'Heart', icon: '❤️', cost: 50 },
    { id: 'star', name: t('star', language) || 'Star', icon: '⭐', cost: 100 },
    { id: 'diamond', name: t('diamond', language) || 'Diamond', icon: '💎', cost: 500 },
    { id: 'crown', name: t('crown', language) || 'Crown', icon: '👑', cost: 1000 },
    { id: 'rocket', name: t('rocket', language) || 'Rocket', icon: '🚀', cost: 5000 },
  ];

  React.useEffect(() => {
    // Simulate viewer count changes
    const viewerInterval = setInterval(() => {
      setViewers(prev => Math.max(0, prev + Math.floor(Math.random() * 5) - 2));
    }, 3000);

    // Simulate new comments
    const commentInterval = setInterval(() => {
      const messages = [
        "Nice!", "Cool!", "Amazing!", "Love it! ❤️", 
        language === 'zh' ? "太棒了！" : "Awesome!",
        language === 'zh' ? "支持" : "Support!",
      ];
      const newComment = {
        id: Date.now(),
        username: `User${Math.floor(Math.random() * 100)}`,
        message: messages[Math.floor(Math.random() * messages.length)],
        avatar: `/Dana.png`,
      };
      setComments(prev => [...prev.slice(-15), newComment]);
    }, 4000);

    return () => {
      clearInterval(viewerInterval);
      clearInterval(commentInterval);
    };
  }, [language]);

  const handleSendMessage = () => {
    if (message.trim()) {
      const newComment = {
        id: Date.now(),
        username: "Dana",
        message: message,
        avatar: "/Dana.png",
      };
      setComments(prev => [...prev, newComment]);
      setMessage('');
    }
  };

  const handleSendGift = (gift) => {
    // Check diamonds
    const diamonds = parseInt(localStorage.getItem('seer_diamonds') || '0');
    if (diamonds < gift.cost) {
      alert(language === 'zh' ? '钻石不足' : 'Not enough diamonds');
      return;
    }
    
    // Deduct diamonds
    localStorage.setItem('seer_diamonds', (diamonds - gift.cost).toString());
    
    // Add gift animation to comments
    const giftComment = {
      id: Date.now(),
      username: "Dana",
      message: `${language === 'zh' ? '送出了' : 'sent'} ${gift.icon} ${gift.name}`,
      avatar: "/Dana.png",
      isGift: true,
    };
    setComments(prev => [...prev, giftComment]);
    setShowGiftPanel(false);
    
    alert(`${language === 'zh' ? '礼物已送出！' : 'Gift sent!'}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-full relative bg-black"
    >
      {/* Video Player */}
      <div className="h-full flex items-center justify-center">
        <Camera className="w-24 h-24 text-slate-700" />
      </div>

      {/* Top Bar */}
      <div className="absolute top-0 left-0 right-0 p-4">
        <div className="flex items-center justify-between">
          <button 
            onClick={() => navigateTo('home')} 
            className="p-2 rounded-full bg-black/50 backdrop-blur-sm"
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>

          {/* Streamer Info */}
          <div className="flex-1 mx-3 px-4 py-2 rounded-full bg-black/50 backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <img src="/Alice.png" alt={username} className="w-8 h-8 rounded-full" />
              <div className="flex-1">
                <div className="text-white font-semibold text-sm">{username}</div>
                <div className="text-white/70 text-xs">{title}</div>
              </div>
              <motion.div
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="px-2 py-1 rounded-full bg-red-500"
              >
                <span className="text-white text-xs font-bold">{t("liveNow", language)}</span>
              </motion.div>
            </div>
          </div>

          {/* Viewer Count */}
          <div className="px-3 py-2 rounded-full bg-black/50 backdrop-blur-sm">
            <div className="flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-white" />
              <span className="text-white font-medium text-sm">{viewers}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Comments Section */}
      <div className="absolute left-0 right-0 bottom-24 p-4 pointer-events-none">
        <div className="space-y-2">
          {comments.slice(-4).map((comment) => (
            <motion.div
              key={comment.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`px-3 py-2 rounded-xl max-w-xs ${
                comment.isGift 
                  ? 'bg-gradient-to-r from-amber-500/80 to-rose-500/80 backdrop-blur-sm' 
                  : 'bg-black/50 backdrop-blur-sm'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <div className={`font-semibold text-sm ${
                  comment.isGift ? 'text-white' : 'text-amber-400'
                }`}>
                  {comment.username}
                </div>
              </div>
              <div className="text-white text-sm">{comment.message}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
        <div className="flex items-center gap-3">
          {/* Message Input */}
          <div className="flex-1 flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder={t("typeMessage", language)}
              className="flex-1 bg-transparent text-white placeholder-white/50 outline-none text-sm"
            />
            <button onClick={handleSendMessage}>
              <Send className="w-5 h-5 text-white/70" />
            </button>
          </div>

          {/* Like Button */}
          <button
            onClick={() => setLikes(prev => prev + 1)}
            className="p-3 rounded-full bg-white/10 backdrop-blur-sm"
          >
            <Heart className="w-6 h-6 text-rose-500 fill-rose-500" />
          </button>

          {/* Gift Button */}
          <button
            onClick={() => setShowGiftPanel(!showGiftPanel)}
            className="p-3 rounded-full bg-gradient-to-r from-amber-500 to-rose-500"
          >
            <Gift className="w-6 h-6 text-white" />
          </button>
        </div>
      </div>

      {/* Gift Panel */}
      <AnimatePresence>
        {showGiftPanel && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30 }}
            className="absolute bottom-0 left-0 right-0 bg-slate-900 rounded-t-3xl p-6 max-h-[60vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="text-white font-bold text-lg">{t("gifts", language)}</div>
              <button onClick={() => setShowGiftPanel(false)}>
                <X className="w-6 h-6 text-slate-400" />
              </button>
            </div>
            
            {/* Diamond Balance */}
            <div className="mb-4 px-4 py-3 rounded-xl bg-slate-800 flex items-center justify-between">
              <span className="text-slate-300">{t("diamonds", language)}</span>
              <div className="flex items-center gap-2">
                <Gem className="w-5 h-5 text-blue-400" />
                <span className="text-white font-bold">
                  {localStorage.getItem('seer_diamonds') || '0'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {gifts.map((gift) => (
                <motion.button
                  key={gift.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSendGift(gift)}
                  className="p-4 rounded-xl bg-slate-800 hover:bg-slate-700 transition-colors"
                >
                  <div className="text-4xl mb-2">{gift.icon}</div>
                  <div className="text-white text-sm font-medium mb-1">{gift.name}</div>
                  <div className="flex items-center justify-center gap-1">
                    <Gem className="w-3 h-3 text-blue-400" />
                    <span className="text-slate-400 text-xs">{gift.cost}</span>
                  </div>
                </motion.button>
              ))}
            </div>
            
            <button
              onClick={() => navigateTo('diamond-recharge')}
              className="mt-4 w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold"
            >
              {t("buyDiamonds", language)}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* =================== ACTIVITIES LIST PAGE =================== */
function ActivitiesListPage({ navigateTo, language = "en", darkMode = false }) {
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { id: 'all', label: language === 'zh' ? '全部' : 'All', icon: <Globe className="w-4 h-4" /> },
    { id: 'lecture', label: language === 'zh' ? '讲座' : 'Lecture', icon: <Library className="w-4 h-4" /> },
    { id: 'party', label: language === 'zh' ? '聚会' : 'Party', icon: <Users className="w-4 h-4" /> },
    { id: 'sports', label: language === 'zh' ? '运动' : 'Sports', icon: <Dumbbell className="w-4 h-4" /> },
    { id: 'study', label: language === 'zh' ? '学习' : 'Study', icon: <Library className="w-4 h-4" /> },
  ];

  const activities = [
    {
      id: 'act001',
      title: language === 'zh' ? 'AI技术分享讲座' : 'AI Technology Seminar',
      category: 'lecture',
      date: '2025-11-05',
      time: '14:00',
      location: language === 'zh' ? '图书馆报告厅' : 'Library Hall',
      participants: 45,
      maxParticipants: 100,
      organizer: 'Alice',
      avatar: '/Alice.png',
      description: language === 'zh' ? '探讨人工智能最新发展趋势' : 'Discuss latest AI trends',
      isJoined: false,
    },
    {
      id: 'act002',
      title: language === 'zh' ? '周末篮球赛' : 'Weekend Basketball Match',
      category: 'sports',
      date: '2025-11-06',
      time: '16:00',
      location: language === 'zh' ? '体育中心' : 'Sports Center',
      participants: 12,
      maxParticipants: 20,
      organizer: 'Bob',
      avatar: '/Bob.png',
      description: language === 'zh' ? '友谊篮球赛，欢迎参加' : 'Friendly basketball match, all welcome',
      isJoined: true,
    },
    {
      id: 'act003',
      title: language === 'zh' ? '编程马拉松' : 'Hackathon 2025',
      category: 'study',
      date: '2025-11-10',
      time: '09:00',
      location: language === 'zh' ? '创新实验室' : 'Innovation Lab',
      participants: 28,
      maxParticipants: 50,
      organizer: 'Charlie',
      avatar: '/Charlie.png',
      description: language === 'zh' ? '24小时编程挑战赛' : '24-hour coding challenge',
      isJoined: false,
    },
  ];

  const filteredActivities = activeCategory === 'all' 
    ? activities 
    : activities.filter(act => act.category === activeCategory);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`h-full relative flex flex-col transition-colors duration-500 ${
        darkMode ? "bg-slate-900" : "bg-slate-50"
      }`}
    >
      {/* Header */}
      <div className={`flex items-center justify-between px-4 py-3 border-b transition-colors ${
        darkMode ? "border-slate-700 bg-slate-800" : "border-slate-100 bg-white"
      }`}>
        <div className={`text-xl font-bold ${darkMode ? "text-indigo-400" : "text-indigo-600"}`}>
          {language === 'zh' ? '校园活动' : 'Campus Activities'}
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigateTo('create-activity')}
          className="p-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
        >
          <Plus className="w-5 h-5" />
        </motion.button>
      </div>

      {/* Category Tabs */}
      <div className="px-4 py-3 overflow-x-auto">
        <div className="flex gap-2">
          {categories.map((cat) => (
            <motion.button
              key={cat.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                activeCategory === cat.id
                  ? darkMode
                    ? "bg-indigo-600 text-white"
                    : "bg-indigo-600 text-white"
                  : darkMode
                  ? "bg-slate-800 text-slate-300"
                  : "bg-white text-slate-700 border border-slate-200"
              }`}
            >
              {cat.icon}
              <span>{cat.label}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Activities List */}
      <div className="flex-1 overflow-y-auto px-4 py-2 pb-28 space-y-3">
        {filteredActivities.map((activity, index) => (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            onClick={() => navigateTo('activity-detail', { activityId: activity.id })}
            className={`rounded-2xl p-4 cursor-pointer transition-all ${
              darkMode ? "bg-slate-800" : "bg-white shadow-sm"
            }`}
          >
            <div className="flex items-start gap-3">
              <img
                src={activity.avatar}
                alt={activity.organizer}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className={`font-bold text-lg ${darkMode ? "text-slate-100" : "text-slate-800"}`}>
                      {activity.title}
                    </h3>
                    <div className={`text-xs ${darkMode ? "text-slate-500" : "text-slate-500"}`}>
                      {language === 'zh' ? '组织者：' : 'Organizer: '}{activity.organizer}
                    </div>
                  </div>
                  {activity.isJoined && (
                    <div className="px-3 py-1 rounded-full bg-green-500/20 text-green-600 text-xs font-medium">
                      {language === 'zh' ? '已报名' : 'Joined'}
                    </div>
                  )}
                </div>
                
                <div className={`text-sm mb-2 ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
                  {activity.description}
                </div>

                <div className="flex flex-wrap gap-3">
                  <div className={`flex items-center gap-1 text-xs ${darkMode ? "text-slate-500" : "text-slate-500"}`}>
                    <Calendar className="w-4 h-4" />
                    <span>{activity.date} {activity.time}</span>
                  </div>
                  <div className={`flex items-center gap-1 text-xs ${darkMode ? "text-slate-500" : "text-slate-500"}`}>
                    <Globe className="w-4 h-4" />
                    <span>{activity.location}</span>
                  </div>
                  <div className={`flex items-center gap-1 text-xs ${darkMode ? "text-slate-500" : "text-slate-500"}`}>
                    <Users className="w-4 h-4" />
                    <span>{activity.participants}/{activity.maxParticipants}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <BottomNav active="discover" navigateTo={navigateTo} language={language} darkMode={darkMode} />
    </motion.div>
  );
}

/* =================== CREATE ACTIVITY PAGE =================== */
function CreateActivityPage({ navigateTo, language = "en", darkMode = false }) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('lecture');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [maxParticipants, setMaxParticipants] = useState('50');
  const [description, setDescription] = useState('');

  const categories = [
    { id: 'lecture', label: language === 'zh' ? '讲座' : 'Lecture' },
    { id: 'party', label: language === 'zh' ? '聚会' : 'Party' },
    { id: 'sports', label: language === 'zh' ? '运动' : 'Sports' },
    { id: 'study', label: language === 'zh' ? '学习' : 'Study' },
  ];

  const handleCreate = () => {
    if (!title || !date || !time || !location) {
      alert(language === 'zh' ? '请填写所有必填项' : 'Please fill all required fields');
      return;
    }
    alert(language === 'zh' ? '活动创建成功！' : 'Activity created successfully!');
    navigateTo('activities-list');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`h-full relative flex flex-col transition-colors duration-500 ${
        darkMode ? "bg-slate-900" : "bg-slate-50"
      }`}
    >
      {/* Header */}
      <div className={`flex items-center justify-between px-4 py-3 border-b transition-colors ${
        darkMode ? "border-slate-700 bg-slate-800" : "border-slate-100 bg-white"
      }`}>
        <button onClick={() => navigateTo('activities-list')} className="p-2">
          <ChevronLeft className={`w-6 h-6 ${darkMode ? "text-slate-300" : "text-slate-600"}`} />
        </button>
        <div className={`text-xl font-bold ${darkMode ? "text-indigo-400" : "text-indigo-600"}`}>
          {language === 'zh' ? '创建活动' : 'Create Activity'}
        </div>
        <div className="w-10" />
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {/* Title */}
        <div>
          <label className={`block mb-2 text-sm font-medium ${darkMode ? "text-slate-300" : "text-slate-700"}`}>
            {language === 'zh' ? '活动标题 *' : 'Title *'}
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={language === 'zh' ? '输入活动标题' : 'Enter activity title'}
            className={`w-full px-4 py-3 rounded-xl border transition-all ${
              darkMode 
                ? "bg-slate-800 border-slate-700 text-slate-200" 
                : "bg-white border-slate-200 text-slate-800"
            } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
          />
        </div>

        {/* Category */}
        <div>
          <label className={`block mb-2 text-sm font-medium ${darkMode ? "text-slate-300" : "text-slate-700"}`}>
            {language === 'zh' ? '活动类别' : 'Category'}
          </label>
          <div className="grid grid-cols-2 gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                className={`py-3 rounded-xl font-medium transition-all ${
                  category === cat.id
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
                    : darkMode
                    ? "bg-slate-800 text-slate-300 border border-slate-700"
                    : "bg-white text-slate-700 border border-slate-200"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Date and Time */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={`block mb-2 text-sm font-medium ${darkMode ? "text-slate-300" : "text-slate-700"}`}>
              {language === 'zh' ? '日期 *' : 'Date *'}
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={`w-full px-4 py-3 rounded-xl border transition-all ${
                darkMode 
                  ? "bg-slate-800 border-slate-700 text-slate-200" 
                  : "bg-white border-slate-200 text-slate-800"
              } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
            />
          </div>
          <div>
            <label className={`block mb-2 text-sm font-medium ${darkMode ? "text-slate-300" : "text-slate-700"}`}>
              {language === 'zh' ? '时间 *' : 'Time *'}
            </label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className={`w-full px-4 py-3 rounded-xl border transition-all ${
                darkMode 
                  ? "bg-slate-800 border-slate-700 text-slate-200" 
                  : "bg-white border-slate-200 text-slate-800"
              } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
            />
          </div>
        </div>

        {/* Location */}
        <div>
          <label className={`block mb-2 text-sm font-medium ${darkMode ? "text-slate-300" : "text-slate-700"}`}>
            {language === 'zh' ? '地点 *' : 'Location *'}
          </label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder={language === 'zh' ? '输入活动地点' : 'Enter location'}
            className={`w-full px-4 py-3 rounded-xl border transition-all ${
              darkMode 
                ? "bg-slate-800 border-slate-700 text-slate-200" 
                : "bg-white border-slate-200 text-slate-800"
            } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
          />
        </div>

        {/* Max Participants */}
        <div>
          <label className={`block mb-2 text-sm font-medium ${darkMode ? "text-slate-300" : "text-slate-700"}`}>
            {language === 'zh' ? '最大参与人数' : 'Max Participants'}
          </label>
          <input
            type="number"
            value={maxParticipants}
            onChange={(e) => setMaxParticipants(e.target.value)}
            className={`w-full px-4 py-3 rounded-xl border transition-all ${
              darkMode 
                ? "bg-slate-800 border-slate-700 text-slate-200" 
                : "bg-white border-slate-200 text-slate-800"
            } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
          />
        </div>

        {/* Description */}
        <div>
          <label className={`block mb-2 text-sm font-medium ${darkMode ? "text-slate-300" : "text-slate-700"}`}>
            {language === 'zh' ? '活动描述' : 'Description'}
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={language === 'zh' ? '描述一下你的活动...' : 'Describe your activity...'}
            rows={4}
            className={`w-full px-4 py-3 rounded-xl border transition-all resize-none ${
              darkMode 
                ? "bg-slate-800 border-slate-700 text-slate-200" 
                : "bg-white border-slate-200 text-slate-800"
            } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
          />
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleCreate}
          className="w-full py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-lg shadow-lg"
        >
          {language === 'zh' ? '创建活动' : 'Create Activity'}
        </motion.button>
      </div>
    </motion.div>
  );
}

/* =================== ACTIVITY DETAIL PAGE =================== */
function ActivityDetailPage({ navigateTo, language = "en", darkMode = false, activityId = "act001" }) {
  const [isJoined, setIsJoined] = useState(false);

  const activity = {
    id: 'act001',
    title: language === 'zh' ? 'AI技术分享讲座' : 'AI Technology Seminar',
    category: 'lecture',
    date: '2025-11-05',
    time: '14:00',
    location: language === 'zh' ? '图书馆报告厅' : 'Library Hall',
    participants: 45,
    maxParticipants: 100,
    organizer: 'Alice',
    organizerId: 'u001',
    avatar: '/Alice.png',
    description: language === 'zh' 
      ? '本次讲座将深入探讨人工智能的最新发展趋势，包括大语言模型、计算机视觉和强化学习等前沿技术。我们邀请了业界专家分享实践经验，并设有互动问答环节。适合对AI感兴趣的学生和研究者参加。'
      : 'This seminar will explore the latest trends in AI, including large language models, computer vision, and reinforcement learning. Industry experts will share practical experiences with Q&A sessions. Suitable for students and researchers interested in AI.',
    participantsList: [
      { id: 'u002', username: 'Bob', avatar: '/Bob.png' },
      { id: 'u003', username: 'Charlie', avatar: '/Charlie.png' },
      { id: 'u004', username: 'Emma', avatar: '/Emma.png' },
    ],
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`h-full relative flex flex-col transition-colors duration-500 ${
        darkMode ? "bg-slate-900" : "bg-slate-50"
      }`}
    >
      {/* Header */}
      <div className={`flex items-center justify-between px-4 py-3 border-b transition-colors ${
        darkMode ? "border-slate-700 bg-slate-800" : "border-slate-100 bg-white"
      }`}>
        <button onClick={() => navigateTo('activities-list')} className="p-2">
          <ChevronLeft className={`w-6 h-6 ${darkMode ? "text-slate-300" : "text-slate-600"}`} />
        </button>
        <div className={`text-lg font-bold ${darkMode ? "text-indigo-400" : "text-indigo-600"}`}>
          {language === 'zh' ? '活动详情' : 'Activity Detail'}
        </div>
        <button className="p-2">
          <Share className={`w-5 h-5 ${darkMode ? "text-slate-400" : "text-slate-600"}`} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pb-28">
        {/* Activity Info */}
        <div className="p-6">
          <h1 className={`text-2xl font-bold mb-4 ${darkMode ? "text-slate-100" : "text-slate-800"}`}>
            {activity.title}
          </h1>

          <div className="space-y-4 mb-6">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                darkMode ? "bg-indigo-600/20" : "bg-indigo-100"
              }`}>
                <Calendar className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <div className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                  {language === 'zh' ? '时间' : 'Date & Time'}
                </div>
                <div className={`font-semibold ${darkMode ? "text-slate-200" : "text-slate-800"}`}>
                  {activity.date} {activity.time}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                darkMode ? "bg-emerald-600/20" : "bg-emerald-100"
              }`}>
                <Globe className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <div className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                  {language === 'zh' ? '地点' : 'Location'}
                </div>
                <div className={`font-semibold ${darkMode ? "text-slate-200" : "text-slate-800"}`}>
                  {activity.location}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                darkMode ? "bg-purple-600/20" : "bg-purple-100"
              }`}>
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <div className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                  {language === 'zh' ? '参与人数' : 'Participants'}
                </div>
                <div className={`font-semibold ${darkMode ? "text-slate-200" : "text-slate-800"}`}>
                  {activity.participants}/{activity.maxParticipants}
                </div>
              </div>
            </div>
          </div>

          {/* Organizer */}
          <div className={`p-4 rounded-2xl mb-6 ${darkMode ? "bg-slate-800" : "bg-white"}`}>
            <div className="flex items-center gap-3">
              <img
                src={activity.avatar}
                alt={activity.organizer}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="flex-1">
                <div className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                  {language === 'zh' ? '组织者' : 'Organizer'}
                </div>
                <div className={`font-semibold ${darkMode ? "text-slate-200" : "text-slate-800"}`}>
                  {activity.organizer}
                </div>
              </div>
              <button
                onClick={() => navigateTo('user-profile', { userId: activity.organizerId })}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  darkMode ? "bg-slate-700 text-slate-300" : "bg-slate-100 text-slate-700"
                }`}
              >
                {language === 'zh' ? '查看' : 'View'}
              </button>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className={`text-lg font-bold mb-3 ${darkMode ? "text-slate-200" : "text-slate-800"}`}>
              {language === 'zh' ? '活动介绍' : 'About'}
            </h3>
            <p className={`text-sm leading-relaxed ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
              {activity.description}
            </p>
          </div>

          {/* Participants */}
          <div className="mt-6">
            <h3 className={`text-lg font-bold mb-3 ${darkMode ? "text-slate-200" : "text-slate-800"}`}>
              {language === 'zh' ? '参与者' : 'Participants'}
            </h3>
            <div className="flex -space-x-2">
              {activity.participantsList.map((p) => (
                <img
                  key={p.id}
                  src={p.avatar}
                  alt={p.username}
                  className="w-10 h-10 rounded-full border-2 border-white object-cover"
                />
              ))}
              {activity.participants > 3 && (
                <div className={`w-10 h-10 rounded-full border-2 border-white flex items-center justify-center text-xs font-semibold ${
                  darkMode ? "bg-slate-700 text-slate-300" : "bg-slate-200 text-slate-600"
                }`}>
                  +{activity.participants - 3}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Join Button */}
      <div className={`absolute bottom-0 left-0 right-0 p-4 border-t ${
        darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-100"
      }`}>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsJoined(!isJoined)}
          className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all ${
            isJoined
              ? "bg-slate-500 text-white"
              : "bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
          }`}
        >
          {isJoined 
            ? (language === 'zh' ? '取消报名' : 'Cancel Registration')
            : (language === 'zh' ? '立即报名' : 'Join Now')}
        </motion.button>
      </div>
    </motion.div>
  );
}

/* =================== PROFILE (MINE) =================== */
function ProfilePage({ navigateTo, language = "en", darkMode = false }) {
  const [showQRCode, setShowQRCode] = useState(false);
  const [activeTab, setActiveTab] = useState('posts'); // 'posts', 'liked', 'saved'
  
  const [isPro, setIsPro] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('seer_isPro') === 'true';
    }
    return false;
  });
  
  const user = { 
    username: "Dana", 
    userId: "ID: 724835",
    bio: "CS student. Coffee enthusiast. Gamer. Always exploring new technologies and gaming strategies.", 
    posts: 34, 
    followers: 256, 
    following: 128 
  };

  const [birthday, setBirthday] = useState('');
  const [gender, setGender] = useState('');
  const [major, setMajor] = useState('');
  const [bio, setBio] = useState(user.bio);

  // Load profile data
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      setBirthday(localStorage.getItem('seer_birthday') || '');
      setGender(localStorage.getItem('seer_gender') || '');
      setMajor(localStorage.getItem('seer_major') || '');
      setBio(localStorage.getItem('seer_bio') || user.bio);
    }
  }, [user.bio]);

  // Calculate age
  const calculateAge = (birthday) => {
    if (!birthday) return null;
    const today = new Date();
    const birthDate = new Date(birthday);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const age = calculateAge(birthday);

  // Calculate Pro subscription days
  const calculateProDays = () => {
    if (typeof window === 'undefined') return 0;
    const proStartDate = localStorage.getItem('seer_proStartDate');
    if (!proStartDate) return 0;
    const today = new Date();
    const startDate = new Date(proStartDate);
    const diffTime = Math.abs(today - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const menuItems = [
    { label: t("editProfile", language), icon: <Edit className="w-5 h-5" />, color: darkMode ? "text-indigo-400" : "text-indigo-600", action: 'edit-profile' },
    { label: t("achievements", language), icon: <Award className="w-5 h-5" />, color: darkMode ? "text-amber-400" : "text-amber-600", action: null },
    { label: t("settings", language), icon: <Settings className="w-5 h-5" />, color: darkMode ? "text-slate-400" : "text-slate-600", action: 'settings' },
    { label: t("logOut", language), icon: <LogIn className="w-5 h-5 rotate-180" />, color: darkMode ? "text-rose-400" : "text-rose-600", action: 'login' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`h-full relative flex flex-col transition-colors duration-500 ${darkMode ? "bg-slate-900" : "bg-slate-50"}`}
    >
      <div className={`flex items-center justify-between px-4 py-3 border-b transition-colors ${
        darkMode ? "border-slate-700 bg-slate-800" : "border-slate-100 bg-white"
      }`}>
        <div className={`text-xl font-bold tracking-wide transition-colors ${
          darkMode ? "text-indigo-400" : "text-indigo-600"
        }`}>
          {t("profile", language)}
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowQRCode(true)}
          className={`p-2 rounded-lg transition-colors ${
            darkMode ? "hover:bg-slate-700" : "hover:bg-slate-100"
          }`}
        >
          <QrCode className={`w-6 h-6 transition-colors ${darkMode ? "text-slate-300" : "text-slate-600"}`} />
        </motion.button>
      </div>
      
      <div className="flex-1 overflow-y-auto px-6 pt-6 pb-28">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start gap-4 mb-6"
        >
          <img 
            src="/Dana.png" 
            alt="Dana"
            className="w-20 h-20 rounded-full object-cover shadow-lg" 
          />
          <div className="flex-1">
            <div className={`flex items-center gap-2 mb-1`}>
              <div className={`text-xl font-bold transition-colors ${darkMode ? "text-slate-100" : "text-slate-800"}`}>
                {user.username}
              </div>
              {isPro && <ProBadge size="sm" clickable onClick={() => navigateTo('member-center')} />}
            </div>
            <div className={`text-xs mb-2 font-mono transition-colors ${darkMode ? "text-slate-500" : "text-slate-400"}`}>
              {user.userId}
            </div>
            {/* Age, Gender, Major */}
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              {age && (
                <div className={`flex items-center gap-1 text-xs transition-colors ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
                  <Calendar className="w-3 h-3" />
                  <span>{age} {t("yearsOld", language)}</span>
                </div>
              )}
              {gender && (
                <div className={`flex items-center gap-1 text-xs transition-colors ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
                  <Users className="w-3 h-3" />
                  <span>{t(gender, language)}</span>
                </div>
              )}
              {major && (
                <div className={`flex items-center gap-1 text-xs transition-colors ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
                  <Briefcase className="w-3 h-3" />
                  <span>{major}</span>
                </div>
              )}
            </div>
            <div className={`text-sm leading-relaxed transition-colors ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
              {bio}
            </div>
          </div>
        </motion.div>
        
        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-3 gap-3 mb-6"
        >
          {[
            { label: t("posts", language), value: user.posts, color: "from-indigo-500 to-indigo-400" },
            { label: t("followers", language), value: user.followers, color: "from-emerald-500 to-emerald-400" },
            { label: t("following_noun", language), value: user.following, color: "from-purple-500 to-purple-400" },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + index * 0.05 }}
              className={`rounded-2xl border p-4 text-center shadow-sm transition-colors ${
                darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-100"
              }`}
            >
              <div className={`text-lg font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                {stat.value}
              </div>
              <div className={`text-xs mt-1 transition-colors ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Pro Banner - Shows for both Pro and non-Pro users */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigateTo('pro-upgrade')}
          className={`rounded-2xl p-4 mb-6 cursor-pointer shadow-lg relative overflow-hidden ${
            darkMode ? "bg-slate-800" : "bg-white"
          }`}
          style={{
            background: darkMode 
              ? 'linear-gradient(135deg, #1e293b 0%, #334155 100%)'
              : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          }}
        >
          <div className="relative z-10 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Crown className="w-6 h-6 text-amber-300" />
            </div>
            <div className="flex-1">
              <div className="text-white font-bold mb-1">
                {isPro ? t("proPlan", language) : t("upgradeToPro", language)}
              </div>
              {isPro ? (
                (() => {
                  const expiryDate = typeof window !== 'undefined' ? localStorage.getItem('seer_proExpiry') : null;
                  const proDays = calculateProDays();
                  return (
                    <div className="text-white/80 text-sm">
                      {expiryDate && <div>{t("expiresOn", language)}: {expiryDate}</div>}
                      {proDays > 0 && (
                        <div>{t("proMemberFor", language)} {proDays} {t("days", language)}</div>
                      )}
                    </div>
                  );
                })()
              ) : (
                <div className="text-white/80 text-sm">
                  {t("unlockPremium", language)}
                </div>
              )}
            </div>
            {isPro ? (
              <ProBadge size="md" />
            ) : (
              <ChevronRight className="w-5 h-5 text-white/80" />
            )}
          </div>
          
          {/* Decorative sparkles */}
          <motion.div
            className="absolute top-2 right-2"
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          >
            <Sparkles className="w-5 h-5 text-amber-300" />
          </motion.div>
        </motion.div>

        {/* Live Streaming Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.28 }}
          className="mb-6"
        >
          {isPro ? (
            // Pro User: Can access live streaming
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigateTo('live-stream-setup')}
              className={`rounded-2xl p-4 cursor-pointer shadow-lg relative overflow-hidden ${
                darkMode ? "bg-gradient-to-br from-pink-900/50 to-purple-900/50 border border-pink-700/30" : "bg-gradient-to-br from-pink-50 to-purple-50 border border-pink-200"
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  darkMode ? "bg-pink-500/20" : "bg-pink-500/10"
                }`}>
                  <Radio className="w-6 h-6 text-pink-500" />
                </div>
                <div className="flex-1">
                  <div className={`font-bold mb-1 flex items-center gap-2 ${
                    darkMode ? "text-pink-300" : "text-pink-700"
                  }`}>
                    <span>{t("myLiveStream", language)}</span>
                    <ProBadge size="xs" />
                  </div>
                  <div className={`text-sm ${
                    darkMode ? "text-pink-400/70" : "text-pink-600/70"
                  }`}>
                    {t("startLiveStream", language)}
                  </div>
                </div>
                <ChevronRight className={`w-5 h-5 ${
                  darkMode ? "text-pink-400" : "text-pink-500"
                }`} />
              </div>
            </motion.div>
          ) : (
            // Non-Pro User: Locked live streaming
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigateTo('pro-upgrade')}
              className={`rounded-2xl p-4 cursor-pointer shadow-lg relative overflow-hidden ${
                darkMode ? "bg-slate-800 border border-slate-700" : "bg-slate-100 border border-slate-200"
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center relative ${
                  darkMode ? "bg-slate-700" : "bg-slate-200"
                }`}>
                  <Radio className={`w-6 h-6 ${darkMode ? "text-slate-500" : "text-slate-400"}`} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Lock className={`w-5 h-5 ${darkMode ? "text-slate-400" : "text-slate-500"}`} />
                  </div>
                </div>
                <div className="flex-1">
                  <div className={`font-bold mb-1 flex items-center gap-2 ${
                    darkMode ? "text-slate-400" : "text-slate-600"
                  }`}>
                    <span>{t("liveBlocked", language)}</span>
                  </div>
                  <div className={`text-sm ${
                    darkMode ? "text-slate-500" : "text-slate-500"
                  }`}>
                    {t("liveBlockedDesc", language)}
                  </div>
                </div>
                <Crown className={`w-5 h-5 ${darkMode ? "text-amber-500/50" : "text-amber-500/70"}`} />
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-6"
        >
          <div className={`flex gap-2 p-1 rounded-xl transition-colors ${
            darkMode ? "bg-slate-800" : "bg-slate-200"
          }`}>
            {[
              { id: 'posts', label: t("myPosts", language), icon: <Library className="w-4 h-4" /> },
              { id: 'liked', label: t("likedPosts", language), icon: <Heart className="w-4 h-4" /> },
              { id: 'saved', label: t("savedPosts", language), icon: <Bookmark className="w-4 h-4" /> },
            ].map((tab) => (
              <motion.button
                key={tab.id}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? darkMode
                      ? "bg-indigo-600 text-white shadow-lg"
                      : "bg-white text-indigo-600 shadow"
                    : darkMode
                    ? "text-slate-400 hover:text-slate-300"
                    : "text-slate-600 hover:text-slate-800"
                }`}
              >
                {tab.icon}
                <span className="hidden sm:inline">{tab.label}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 min-h-[200px]"
        >
          {activeTab === 'posts' && (
            <div className={`text-center py-12 rounded-2xl transition-colors ${
              darkMode ? "bg-slate-800/50" : "bg-slate-100/50"
            }`}>
              <Library className={`w-12 h-12 mx-auto mb-3 transition-colors ${
                darkMode ? "text-slate-600" : "text-slate-400"
              }`} />
              <div className={`text-sm transition-colors ${
                darkMode ? "text-slate-500" : "text-slate-500"
              }`}>
                {t("noPosts", language)}
              </div>
            </div>
          )}
          {activeTab === 'liked' && (
            <div className={`text-center py-12 rounded-2xl transition-colors ${
              darkMode ? "bg-slate-800/50" : "bg-slate-100/50"
            }`}>
              <Heart className={`w-12 h-12 mx-auto mb-3 transition-colors ${
                darkMode ? "text-slate-600" : "text-slate-400"
              }`} />
              <div className={`text-sm transition-colors ${
                darkMode ? "text-slate-500" : "text-slate-500"
              }`}>
                {t("noLikedPosts", language)}
              </div>
            </div>
          )}
          {activeTab === 'saved' && (
            <div className={`text-center py-12 rounded-2xl transition-colors ${
              darkMode ? "bg-slate-800/50" : "bg-slate-100/50"
            }`}>
              <Bookmark className={`w-12 h-12 mx-auto mb-3 transition-colors ${
                darkMode ? "text-slate-600" : "text-slate-400"
              }`} />
              <div className={`text-sm transition-colors ${
                darkMode ? "text-slate-500" : "text-slate-500"
              }`}>
                {t("noSavedPosts", language)}
              </div>
            </div>
          )}
        </motion.div>
        
        {/* Menu */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className={`rounded-2xl border shadow-sm divide-y transition-colors ${
            darkMode ? "bg-slate-800 border-slate-700 divide-slate-700" : "bg-white border-slate-100 divide-slate-100"
          }`}
        >
          {menuItems.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + index * 0.05 }}
              whileHover={{ backgroundColor: darkMode ? "rgba(51, 65, 85, 0.8)" : "rgba(248, 250, 252, 0.8)" }}
              whileTap={{ scale: 0.99 }}
              onClick={() => item.action ? navigateTo(item.action) : null}
              className="flex items-center justify-between px-4 py-4 cursor-pointer transition-all"
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                  darkMode ? "bg-slate-700" : "bg-slate-50"
                } ${item.color}`}>
                  {item.icon}
                </div>
                <span className={`text-sm font-medium transition-colors ${darkMode ? "text-slate-200" : "text-slate-700"}`}>
                  {item.label}
                </span>
              </div>
              <ChevronRight className={`w-4 h-4 transition-colors ${darkMode ? "text-slate-600" : "text-slate-300"}`} />
            </motion.div>
          ))}
        </motion.div>
      </div>
      
      <BottomNav active="mine" navigateTo={navigateTo} language={language} darkMode={darkMode} />
      
      {/* QR Code Modal */}
      <AnimatePresence>
        {showQRCode && (
          <QRCodeModal 
            userId={user.userId}
            username={user.username}
            onClose={() => setShowQRCode(false)}
            language={language}
            darkMode={darkMode}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* =================== USER PROFILE PAGE (View Others) =================== */
function UserProfilePage({ navigateTo, language = "en", darkMode = false, userId = "u001" }) {
  const [followStatus, setFollowStatus] = useState('none'); // 'none', 'following', 'special'
  const [showFollowMenu, setShowFollowMenu] = useState(false);

  const handleFollow = () => {
    if (followStatus === 'none') {
      setFollowStatus('following');
    } else {
      setShowFollowMenu(!showFollowMenu);
    }
  };

  const handleSpecialFollow = () => {
    setFollowStatus('special');
    setShowFollowMenu(false);
  };

  const handleUnfollow = () => {
    setFollowStatus('none');
    setShowFollowMenu(false);
  };

  // Sample user data
  const users = {
    u001: {
      username: "Alice",
      userId: "ID: 628194",
      avatar: "/Alice.png",
      bio: "CS major, passionate about AI and machine learning. Love coding and coffee!",
      birthday: "2003-05-15",
      gender: "female",
      major: "Computer Science",
      posts: 28,
      followers: 189,
      following: 156,
      isPro: false,
      recentPosts: [
        {
          id: "ap1",
          content: "Exploring the beautiful campus today! 🌿 The autumn colors are absolutely stunning.",
          likes: 42,
          comments: 5,
          time: "2h ago"
        },
        {
          id: "ap2",
          content: "Just discovered this amazing café near campus! ☕️✨ Perfect spot for coding sessions. Highly recommend!",
          likes: 89,
          comments: 15,
          time: "1d ago"
        }
      ]
    },
    u002: {
      username: "Bob",
      userId: "ID: 513827",
      avatar: "/Bob.png",
      bio: "Business student with a passion for entrepreneurship. Always looking for the next big opportunity!",
      birthday: "2002-11-22",
      gender: "male",
      major: "Business Administration",
      posts: 45,
      followers: 234,
      following: 198,
      isPro: true,
      recentPosts: [
        {
          id: "bp1",
          content: "Startup weekend was incredible! Met so many amazing entrepreneurs and learned a lot. 🚀",
          likes: 150,
          comments: 23,
          time: "4h ago"
        },
        {
          id: "bp2",
          content: "Looking for team members for a new project! If you're interested in fintech, DM me!",
          likes: 67,
          comments: 12,
          time: "2d ago"
        },
        {
          id: "bp3",
          content: "Just launched my first e-commerce platform! Check it out and let me know what you think! 💼",
          likes: 98,
          comments: 18,
          time: "3d ago"
        }
      ]
    },
    u003: {
      username: "Charlie",
      userId: "ID: 392847",
      avatar: "/Charlie.png",
      bio: "Data Science enthusiast. Love chess, coding, and solving complex problems. Always learning!",
      birthday: "2003-08-10",
      gender: "male",
      major: "Data Science",
      posts: 32,
      followers: 167,
      following: 142,
      isPro: false,
      recentPosts: [
        {
          id: "cp1",
          content: "Just finished my midterm exam! 📚 Time to relax with some gaming. Anyone up for a chess match?",
          likes: 28,
          comments: 12,
          time: "6h ago"
        },
        {
          id: "cp2",
          content: "Working on a machine learning project for predicting stock prices. The results are fascinating! 📊",
          likes: 54,
          comments: 9,
          time: "1d ago"
        },
        {
          id: "cp3",
          content: "Chess tournament this weekend! Excited to compete against some top players! ♟️",
          likes: 41,
          comments: 15,
          time: "2d ago"
        }
      ]
    },
    u004: {
      username: "Emma",
      userId: "ID: 671259",
      avatar: "/Emma.png",
      bio: "International Relations major. Coffee addict ☕️ Passionate about global affairs and cultural exchange.",
      birthday: "2002-03-25",
      gender: "female",
      major: "International Relations",
      posts: 51,
      followers: 312,
      following: 203,
      isPro: false,
      recentPosts: [
        {
          id: "ep1",
          content: "Coffee study session at the library ☕️📖 Nothing beats that productive atmosphere!",
          likes: 67,
          comments: 8,
          time: "8h ago"
        },
        {
          id: "ep2",
          content: "Attended an amazing lecture on international diplomacy today. So inspiring! 🌍",
          likes: 89,
          comments: 14,
          time: "1d ago"
        },
        {
          id: "ep3",
          content: "Planning my semester abroad! So excited to study in Europe next year! ✈️",
          likes: 123,
          comments: 27,
          time: "3d ago"
        }
      ]
    }
  };

  const user = users[userId] || users.u001;

  const calculateAge = (birthday) => {
    if (!birthday) return null;
    const today = new Date();
    const birthDate = new Date(birthday);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const age = calculateAge(user.birthday);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`h-full relative flex flex-col transition-colors duration-500 ${darkMode ? "bg-slate-900" : "bg-slate-50"}`}
    >
      <div className={`flex items-center justify-between px-4 py-3 border-b transition-colors ${
        darkMode ? "border-slate-700 bg-slate-800" : "border-slate-100 bg-white"
      }`}>
        <button 
          onClick={() => navigateTo('home')}
          className={`p-2 -ml-2 rounded-lg transition-colors ${
            darkMode ? "hover:bg-slate-700" : "hover:bg-slate-50"
          }`}
        >
          <ChevronLeft className={`w-6 h-6 transition-colors ${darkMode ? "text-slate-300" : "text-slate-600"}`} />
        </button>
        <div className={`text-xl font-bold tracking-wide transition-colors ${
          darkMode ? "text-indigo-400" : "text-indigo-600"
        }`}>
          {t("profile", language)}
        </div>
        <div className="w-10" />
      </div>
      
      <div className="flex-1 overflow-y-auto px-6 pt-6 pb-28">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative mb-6"
        >
          <div className="flex items-start gap-4">
            <img 
              src={user.avatar} 
              alt={user.username}
              className="w-20 h-20 rounded-full object-cover shadow-lg" 
            />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <div className={`text-xl font-bold transition-colors ${darkMode ? "text-slate-100" : "text-slate-800"}`}>
                  {user.username}
                </div>
                {user.isPro && <ProBadge size="sm" />}
              </div>
            <div className={`text-xs mb-2 font-mono transition-colors ${darkMode ? "text-slate-500" : "text-slate-400"}`}>
              {user.userId}
            </div>
            {/* Age, Gender, Major */}
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              {age && (
                <div className={`flex items-center gap-1 text-xs transition-colors ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
                  <Calendar className="w-3 h-3" />
                  <span>{age} {t("yearsOld", language)}</span>
                </div>
              )}
              {user.gender && (
                <div className={`flex items-center gap-1 text-xs transition-colors ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
                  <Users className="w-3 h-3" />
                  <span>{t(user.gender, language)}</span>
                </div>
              )}
              {user.major && (
                <div className={`flex items-center gap-1 text-xs transition-colors ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
                  <Briefcase className="w-3 h-3" />
                  <span>{user.major}</span>
                </div>
              )}
            </div>
              <div className={`text-sm leading-relaxed transition-colors ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
                {user.bio}
              </div>
            </div>
            
            {/* Follow Button - Frosted Glass Style */}
            <div className="absolute top-0 right-0">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleFollow}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium text-sm backdrop-blur-md border shadow-lg transition-all ${
                followStatus === 'none'
                  ? "bg-indigo-600/70 border-indigo-400/80 text-white hover:bg-indigo-600/80"
                  : followStatus === 'special'
                  ? "bg-amber-500/70 border-amber-400/80 text-white hover:bg-amber-500/80"
                  : "bg-slate-600/70 border-slate-400/80 text-white hover:bg-slate-600/80"
              }`}
            >
              {followStatus === 'none' ? (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>{t("follow", language)}</span>
                </>
              ) : followStatus === 'special' ? (
                <>
                  <Star className="w-4 h-4 fill-current" />
                  <span>{t("specialFollow", language)}</span>
                </>
              ) : (
                <>
                  <UserCheck className="w-4 h-4" />
                  <span>{t("following_verb", language)}</span>
                </>
              )}
            </motion.button>

            {/* Follow Menu - Frosted Glass */}
            <AnimatePresence>
              {showFollowMenu && followStatus !== 'none' && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  className={`absolute right-0 top-full mt-2 w-40 rounded-xl backdrop-blur-md border shadow-xl overflow-hidden z-50 ${
                    darkMode 
                      ? "bg-slate-800/80 border-slate-600/50" 
                      : "bg-white/80 border-slate-200/50"
                  }`}
                >
                  {followStatus === 'following' && (
                    <button
                      onClick={handleSpecialFollow}
                      className={`w-full flex items-center gap-2 px-4 py-3 text-sm transition-colors ${
                        darkMode
                          ? "text-slate-200 hover:bg-slate-700/50"
                          : "text-slate-700 hover:bg-slate-100/50"
                      }`}
                    >
                      <Star className="w-4 h-4" />
                      <span>{t("setSpecialFollow", language)}</span>
                    </button>
                  )}
                  {followStatus === 'special' && (
                    <button
                      onClick={() => setFollowStatus('following')}
                      className={`w-full flex items-center gap-2 px-4 py-3 text-sm transition-colors ${
                        darkMode
                          ? "text-slate-200 hover:bg-slate-700/50"
                          : "text-slate-700 hover:bg-slate-100/50"
                      }`}
                    >
                      <UserCheck className="w-4 h-4" />
                      <span>{t("unfollowSpecial", language)}</span>
                    </button>
                  )}
                  <button
                    onClick={handleUnfollow}
                    className={`w-full flex items-center gap-2 px-4 py-3 text-sm transition-colors border-t ${
                      darkMode
                        ? "text-rose-400 hover:bg-slate-700/50 border-slate-600/50"
                        : "text-rose-600 hover:bg-rose-50/50 border-slate-200/50"
                    }`}
                  >
                    <UserMinus className="w-4 h-4" />
                    <span>{t("unfollow", language)}</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
            </div>
          </div>
        </motion.div>
        
        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-3 gap-3 mb-6"
        >
          {[
            { label: t("posts", language), value: user.posts, color: "from-indigo-500 to-indigo-400" },
            { label: t("followers", language), value: user.followers, color: "from-emerald-500 to-emerald-400" },
            { label: t("following_noun", language), value: user.following, color: "from-purple-500 to-purple-400" },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + index * 0.05 }}
              className={`rounded-2xl border p-4 text-center shadow-sm transition-colors ${
                darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-100"
              }`}
            >
              <div className={`text-lg font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                {stat.value}
              </div>
              <div className={`text-xs mt-1 transition-colors ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Recent Posts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className={`text-sm font-medium mb-3 transition-colors ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
            Recent Posts
          </div>
          <div className="space-y-3">
            {user.recentPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className={`rounded-2xl p-4 border transition-colors ${
                  darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-100"
                }`}
              >
                <div className={`text-sm mb-3 leading-relaxed transition-colors ${
                  darkMode ? "text-slate-300" : "text-slate-700"
                }`}>
                  {post.content}
                </div>
                <div className="flex items-center gap-4">
                  <div className={`flex items-center gap-1.5 text-xs transition-colors ${
                    darkMode ? "text-slate-400" : "text-slate-500"
                  }`}>
                    <Heart className="w-3.5 h-3.5" />
                    <span>{post.likes}</span>
                  </div>
                  <div className={`flex items-center gap-1.5 text-xs transition-colors ${
                    darkMode ? "text-slate-400" : "text-slate-500"
                  }`}>
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>{post.comments}</span>
                  </div>
                  <div className={`ml-auto text-xs transition-colors ${
                    darkMode ? "text-slate-500" : "text-slate-400"
                  }`}>
                    {post.time}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
      
      <BottomNav active="home" navigateTo={navigateTo} language={language} darkMode={darkMode} />
    </motion.div>
  );
}

/* =================== QR CODE MODAL =================== */
function QRCodeModal({ userId, username, onClose, language, darkMode }) {
  const [copied, setCopied] = useState(false);
  
  const handleCopyId = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className={`mx-4 rounded-3xl shadow-2xl p-6 max-w-sm w-full transition-colors ${
          darkMode ? "bg-slate-800" : "bg-white"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className={`text-lg font-bold transition-colors ${darkMode ? "text-slate-100" : "text-slate-800"}`}>
            {t("myQRCode", language)}
          </div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className={`p-2 rounded-full transition-colors ${
              darkMode ? "hover:bg-slate-700" : "hover:bg-slate-100"
            }`}
          >
            <X className={`w-5 h-5 transition-colors ${darkMode ? "text-slate-400" : "text-slate-500"}`} />
          </motion.button>
        </div>

        {/* QR Code Placeholder */}
        <div className={`mb-6 rounded-2xl p-8 flex items-center justify-center border-2 border-dashed transition-colors ${
          darkMode ? "bg-slate-700 border-slate-600" : "bg-slate-50 border-slate-200"
        }`}>
          <div className={`text-center transition-colors ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
            <QrCode className="w-40 h-40 mx-auto mb-3" />
            <div className="text-sm font-medium">{username}</div>
            <div className="text-xs mt-1">{userId}</div>
          </div>
        </div>

        {/* User ID with Copy */}
        <div className={`mb-4 p-4 rounded-xl border transition-colors ${
          darkMode ? "bg-slate-700 border-slate-600" : "bg-slate-50 border-slate-200"
        }`}>
          <div className={`text-xs mb-1 transition-colors ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
            {t("userId", language)}
          </div>
          <div className="flex items-center justify-between">
            <div className={`font-mono font-medium transition-colors ${darkMode ? "text-slate-200" : "text-slate-700"}`}>
              {userId}
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCopyId}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                copied
                  ? "bg-emerald-500 text-white"
                  : darkMode
                    ? "bg-indigo-600 text-white hover:bg-indigo-700"
                    : "bg-indigo-600 text-white hover:bg-indigo-700"
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3" />
                  <span>{t("idCopied", language)}</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>{t("copyId", language)}</span>
                </>
              )}
            </motion.button>
          </div>
        </div>

        {/* Description */}
        <div className={`text-center text-sm transition-colors ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
          {t("scanToAddFriend", language)}
        </div>
      </motion.div>
    </motion.div>
  );
}

/* =================== EARTH (MAP) =================== */
function EarthMapPage({ navigateTo, language = "en", darkMode = false }) {
  const [buildingUserCounts, setBuildingUserCounts] = useState({});
  const [mapScale, setMapScale] = useState(1);
  const [mapPosition, setMapPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const mapRef = React.useRef(null);

  useEffect(() => {
    // 获取所有建筑的用户数量
    const counts = BuildingChatService.getAllBuildingsUserCount();
    setBuildingUserCounts(counts);
    
    // 每10秒更新一次
    const interval = setInterval(() => {
      const newCounts = BuildingChatService.getAllBuildingsUserCount();
      setBuildingUserCounts(newCounts);
    }, 10000);
    
    return () => clearInterval(interval);
  }, []);

  // 西浦太仓校园主要建筑（根据实际地图位置精确定位）
  const landmarks = [
    // A区 - 左上角
    { id: "building_a", name: language === 'zh' ? "A栋 - CHIPS" : "Building A - CHIPS", icon: <Library className="w-4 h-4" />, position: { x: 35, y: 18 }, color: "from-purple-500 to-purple-400" },
    
    // B区 - 中间偏左上
    { id: "building_b", name: language === 'zh' ? "B栋 - 学者空间" : "Building B - Scholar Space", icon: <Library className="w-4 h-4" />, position: { x: 45, y: 40 }, color: "from-blue-500 to-blue-400" },
    
    // C区 - 左上偏中
    { id: "building_c", name: language === 'zh' ? "C栋 - 创新工坊" : "Building C - Innovation Factory", icon: <Sparkles className="w-4 h-4" />, position: { x: 50, y: 25 }, color: "from-indigo-500 to-indigo-400" },
    
    // D区 - 中心位置
    { id: "building_d", name: language === 'zh' ? "D栋 - 图书馆" : "Building D - Library", icon: <Library className="w-4 h-4" />, position: { x: 60, y: 45 }, color: "from-teal-500 to-teal-400" },
    
    // E区 - 右侧
    { id: "building_e", name: language === 'zh' ? "E栋 - 产融创学院" : "Building E - IFB", icon: <Briefcase className="w-4 h-4" />, position: { x: 72, y: 50 }, color: "from-green-500 to-green-400" },
    
    // F区 - 中下方
    { id: "building_f", name: language === 'zh' ? "F栋 - 中西餐厅" : "Building F - Restaurant", icon: <Dumbbell className="w-4 h-4" />, position: { x: 53, y: 62 }, color: "from-red-500 to-red-400" },
    
    // G区 - 右下方
    { id: "building_g", name: language === 'zh' ? "G栋 - 影视学院" : "Building G - AFCT", icon: <Tv className="w-4 h-4" />, position: { x: 75, y: 62 }, color: "from-yellow-500 to-yellow-400" },
    
    // S栋 - 体育场（底部偏左）
    { id: "building_s", name: language === 'zh' ? "S栋 - 体育场" : "Building S - Sports Ground", icon: <Dumbbell className="w-4 h-4" />, position: { x: 48, y: 68 }, color: "from-emerald-500 to-emerald-400" },
    
    // M栋 - 体育馆（底部中间）
    { id: "building_m", name: language === 'zh' ? "M栋 - 体育馆" : "Building M - Stadium", icon: <Dumbbell className="w-4 h-4" />, position: { x: 52, y: 72 }, color: "from-lime-500 to-lime-400" },
  ];

  const handleEnterBuilding = (buildingId) => {
    navigateTo('building-chat', { buildingId });
  };

  const handleZoomIn = () => {
    setMapScale(prev => Math.min(prev + 0.2, 3));
  };

  const handleZoomOut = () => {
    setMapScale(prev => Math.max(prev - 0.2, 0.5));
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - mapPosition.x, y: e.clientY - mapPosition.y });
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      setMapPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    setIsDragging(true);
    setDragStart({ x: touch.clientX - mapPosition.x, y: touch.clientY - mapPosition.y });
  };

  const handleTouchMove = (e) => {
    if (isDragging && e.touches.length === 1) {
      const touch = e.touches[0];
      setMapPosition({
        x: touch.clientX - dragStart.x,
        y: touch.clientY - dragStart.y
      });
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 1.1 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`h-full relative ${darkMode ? 'bg-slate-900' : 'bg-slate-100'}`}
    >
      {/* Zoom Controls */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleZoomIn}
          className={`p-3 rounded-lg shadow-lg transition-colors ${
            darkMode ? 'bg-slate-800 text-slate-200' : 'bg-white text-slate-700'
          }`}
        >
          <Plus className="w-5 h-5" />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleZoomOut}
          className={`p-3 rounded-lg shadow-lg transition-colors ${
            darkMode ? 'bg-slate-800 text-slate-200' : 'bg-white text-slate-700'
          }`}
        >
          <Minus className="w-5 h-5" />
        </motion.button>
        <div className={`px-3 py-2 rounded-lg shadow-lg text-xs font-semibold ${
          darkMode ? 'bg-slate-800 text-slate-200' : 'bg-white text-slate-700'
        }`}>
          {Math.round(mapScale * 100)}%
        </div>
      </div>

      {/* Map Title */}
      <div className="absolute top-4 left-4 z-10">
        <div className={`px-4 py-2 rounded-xl shadow-lg ${
          darkMode ? 'bg-slate-800/90 border border-slate-700' : 'bg-white/90 border border-slate-200'
        }`}>
          <div className={`text-sm font-bold ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>
            {language === 'zh' ? 'XJTLU 太仓校园地图' : 'XJTLU Taicang Campus Map'}
          </div>
          <div className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            {language === 'zh' ? '点击建筑进入聊天室' : 'Click buildings to enter'}
          </div>
        </div>
      </div>
      
      {/* Map Container */}
      <div 
        ref={mapRef}
        className="h-full w-full relative overflow-hidden cursor-grab active:cursor-grabbing select-none"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div 
          className="absolute inset-0 transition-transform duration-200"
          style={{
            transform: `translate(${mapPosition.x}px, ${mapPosition.y}px) scale(${mapScale})`,
            transformOrigin: 'center center'
          }}
        >
          {/* Campus Map Background - Stylized View */}
          <div className={`absolute inset-0 ${
            darkMode 
              ? 'bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900' 
              : 'bg-gradient-to-br from-emerald-100 via-indigo-100 to-sky-100'
          }`}>
            {/* Grid Pattern */}
            <div 
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: `
                  linear-gradient(${darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'} 1px, transparent 1px),
                  linear-gradient(90deg, ${darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'} 1px, transparent 1px)
                `,
                backgroundSize: '40px 40px'
              }}
            />
            {/* Central Circle */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80">
              <div className={`w-full h-full rounded-full border-8 ${
                darkMode ? 'border-slate-600/50' : 'border-slate-300/50'
              }`} />
            </div>
          </div>
          
          {/* Landmarks with Info Popups */}
          {landmarks.map((landmark, index) => {
            const userCount = buildingUserCounts[landmark.id] || 0;
            return (
              <motion.div
                key={landmark.id}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 + index * 0.05 }}
                className="absolute"
                style={{
                  left: `${landmark.position.x}%`,
                  top: `${landmark.position.y}%`,
                  transform: 'translate(-50%, -50%)'
                }}
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className={`flex items-center gap-2 p-2 rounded-xl backdrop-blur shadow-lg border cursor-pointer ${
                    darkMode 
                      ? 'bg-slate-800/95 border-slate-700' 
                      : 'bg-white/95 border-slate-200'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${landmark.color} flex items-center justify-center text-white shadow relative`}>
                    {landmark.icon}
                    {userCount > 0 && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[8px] flex items-center justify-center font-bold">
                        {userCount}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className={`text-xs font-semibold whitespace-nowrap ${
                      darkMode ? 'text-slate-200' : 'text-slate-800'
                    }`}>
                      {landmark.name}
                    </span>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEnterBuilding(landmark.id);
                      }}
                      className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-600 text-white shadow hover:bg-indigo-700 transition-colors mt-1"
                    >
                      {t("enter", language)} {userCount > 0 && `(${userCount})`}
                    </motion.button>
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
      
      <BottomNav active="earth" navigateTo={navigateTo} language={language} darkMode={darkMode} />
    </motion.div>
  );
}

/* =================== BUILDING CHAT ROOM =================== */
function BuildingChatRoom({ navigateTo, language = "en", darkMode = false, buildingId = "lib01" }) {
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [showGameMenu, setShowGameMenu] = useState(false);
  const messagesEndRef = React.useRef(null);

  const currentUser = {
    userId: localStorage.getItem('seer_user_id') || 'demo_user',
    username: localStorage.getItem('seer_username') || '访客',
    avatar: localStorage.getItem('seer_avatar') || '/Alice.png'
  };

  const buildingNames = {
    // 主要建筑 A-G + S + M
    building_a: { zh: 'A栋 - CHIPS', en: 'Building A - CHIPS' },
    building_b: { zh: 'B栋 - 学者空间', en: 'Building B - Scholar Space' },
    building_c: { zh: 'C栋 - 创新工坊', en: 'Building C - Innovation Factory' },
    building_d: { zh: 'D栋 - 图书馆', en: 'Building D - Library' },
    building_e: { zh: 'E栋 - 产融创学院', en: 'Building E - IFB' },
    building_f: { zh: 'F栋 - 中西餐厅', en: 'Building F - Restaurant' },
    building_g: { zh: 'G栋 - 影视学院', en: 'Building G - AFCT' },
    building_s: { zh: 'S栋 - 体育场', en: 'Building S - Sports Ground' },
    building_m: { zh: 'M栋 - 体育馆', en: 'Building M - Stadium' },
  };

  const buildingName = buildingNames[buildingId]?.[language] || buildingId;

  useEffect(() => {
    // 进入建筑
    BuildingChatService.enterBuilding(
      buildingId,
      currentUser.userId,
      currentUser.username,
      currentUser.avatar
    );

    // 加载消息和用户
    loadMessages();
    loadUsers();

    // 定期更新
    const interval = setInterval(() => {
      loadMessages();
      loadUsers();
    }, 3000);

    return () => {
      clearInterval(interval);
      // 离开建筑
      BuildingChatService.leaveBuilding(buildingId, currentUser.userId, currentUser.username);
    };
  }, [buildingId]);

  useEffect(() => {
    // 自动滚动到底部
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadMessages = () => {
    const msgs = BuildingChatService.getMessages(buildingId);
    setMessages(msgs);
  };

  const loadUsers = () => {
    const usrs = BuildingChatService.getBuildingUsers(buildingId);
    setUsers(usrs);
  };

  const handleSendMessage = () => {
    if (!messageInput.trim()) return;
    
    BuildingChatService.sendMessage(
      buildingId,
      currentUser.userId,
      currentUser.username,
      currentUser.avatar,
      messageInput,
      'text'
    );
    
    setMessageInput('');
    loadMessages();
  };

  const handleSendGameInvite = (gameName, gameType) => {
    const roomCode = `${gameType}_${Date.now()}`;
    BuildingChatService.sendGameInvite(
      buildingId,
      currentUser.userId,
      currentUser.username,
      currentUser.avatar,
      gameName,
      gameType,
      roomCode
    );
    setShowGameMenu(false);
    loadMessages();
  };

  const handleJoinGame = (gameType, roomCode) => {
    // 导航到游戏页面
    if (gameType === 'gomoku') {
      navigateTo('gomoku-loading', { mode: 'matchmaking' });
    } else if (gameType === 'chess') {
      navigateTo('chess-loading', { mode: 'matchmaking' });
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString(language === 'zh' ? 'zh-CN' : 'en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`h-full flex flex-col transition-colors duration-500 ${
        darkMode ? 'bg-slate-900' : 'bg-slate-50'
      }`}
    >
      {/* Header */}
      <div className={`flex items-center gap-3 px-4 py-3 border-b transition-colors ${
        darkMode ? 'border-slate-700 bg-slate-800' : 'border-slate-100 bg-white'
      }`}>
        <button
          onClick={() => navigateTo('earth')}
          className={`p-2 -ml-2 rounded-lg transition-colors ${
            darkMode ? 'hover:bg-slate-700' : 'hover:bg-slate-50'
          }`}
        >
          <ChevronLeft className={`w-6 h-6 transition-colors ${darkMode ? 'text-slate-300' : 'text-slate-600'}`} />
        </button>
        <div className="flex-1">
          <div className={`text-lg font-bold transition-colors ${
            darkMode ? 'text-indigo-400' : 'text-indigo-600'
          }`}>
            {buildingName}
          </div>
          <div className={`text-xs transition-colors ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            <Users className="w-3 h-3 inline" /> {users.length} {language === 'zh' ? '人在线' : 'online'}
          </div>
        </div>
        <button
          onClick={() => setShowGameMenu(!showGameMenu)}
          className={`p-2 rounded-lg transition-colors ${
            darkMode ? 'hover:bg-slate-700 text-slate-300' : 'hover:bg-slate-50 text-slate-600'
          }`}
        >
          <Gamepad2 className="w-5 h-5" />
        </button>
      </div>

      {/* Game Menu */}
      <AnimatePresence>
        {showGameMenu && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className={`overflow-hidden border-b ${darkMode ? 'border-slate-700 bg-slate-800' : 'border-slate-100 bg-white'}`}
          >
            <div className="p-4 space-y-2">
              <div className={`text-sm font-semibold mb-2 ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}>
                {language === 'zh' ? '发送游戏邀请' : 'Send Game Invite'}
              </div>
              <button
                onClick={() => handleSendGameInvite('五子棋', 'gomoku')}
                className={`w-full p-3 rounded-xl flex items-center gap-3 transition-colors ${
                  darkMode ? 'bg-slate-700 hover:bg-slate-600' : 'bg-slate-50 hover:bg-slate-100'
                }`}
              >
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white">
                  🎯
                </div>
                <div className="text-left flex-1">
                  <div className={`font-semibold ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                    {language === 'zh' ? '五子棋' : 'Gomoku'}
                  </div>
                  <div className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    {language === 'zh' ? '邀请大家一起玩' : 'Invite others to play'}
                  </div>
                </div>
              </button>
              <button
                onClick={() => handleSendGameInvite('中国象棋', 'chess')}
                className={`w-full p-3 rounded-xl flex items-center gap-3 transition-colors ${
                  darkMode ? 'bg-slate-700 hover:bg-slate-600' : 'bg-slate-50 hover:bg-slate-100'
                }`}
              >
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-white">
                  ♟️
                </div>
                <div className="text-left flex-1">
                  <div className={`font-semibold ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                    {language === 'zh' ? '中国象棋' : 'Chinese Chess'}
                  </div>
                  <div className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    {language === 'zh' ? '邀请大家一起玩' : 'Invite others to play'}
                  </div>
                </div>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Online Users */}
      {users.length > 0 && (
        <div className={`px-4 py-2 border-b ${darkMode ? 'border-slate-700 bg-slate-800' : 'border-slate-100 bg-white'}`}>
          <div className="flex items-center gap-2 overflow-x-auto">
            {users.map((user) => (
              <div key={user.userId} className="flex flex-col items-center gap-1 flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-400 flex items-center justify-center text-white text-xs relative overflow-hidden">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.username} className="w-full h-full object-cover" />
                  ) : (
                    user.username.charAt(0).toUpperCase()
                  )}
                  <div className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-white" />
                </div>
                <span className={`text-[10px] max-w-[60px] truncate ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  {user.username}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg) => {
          const isMine = msg.userId === currentUser.userId;
          const isSystem = msg.userId === 'system';

          if (isSystem) {
            return (
              <div key={msg.id} className="flex justify-center">
                <div className={`text-xs px-3 py-1 rounded-full ${
                  darkMode ? 'bg-slate-700 text-slate-400' : 'bg-slate-200 text-slate-600'
                }`}>
                  {msg.content}
                </div>
              </div>
            );
          }

          if (msg.type === 'game_invite') {
            return (
              <div key={msg.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] ${isMine ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                  {!isMine && (
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-400 flex items-center justify-center text-white text-[10px] overflow-hidden">
                        {msg.avatar ? (
                          <img src={msg.avatar} alt={msg.username} className="w-full h-full object-cover" />
                        ) : (
                          msg.username.charAt(0).toUpperCase()
                        )}
                      </div>
                      <span className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                        {msg.username}
                      </span>
                    </div>
                  )}
                  <div className={`p-3 rounded-xl ${
                    isMine
                      ? darkMode ? 'bg-indigo-700 text-white' : 'bg-indigo-600 text-white'
                      : darkMode ? 'bg-slate-700 text-slate-100' : 'bg-white text-slate-800 border border-slate-200'
                  }`}>
                    <div className="flex items-center gap-2 mb-2">
                      <Gamepad2 className="w-4 h-4" />
                      <span className="font-semibold">{msg.metadata.gameName}</span>
                    </div>
                    <div className="text-sm mb-2">{msg.content}</div>
                    {!isMine && (
                      <button
                        onClick={() => handleJoinGame(msg.metadata.gameType, msg.metadata.roomCode)}
                        className={`w-full px-3 py-1.5 rounded-lg text-sm font-semibold ${
                          darkMode ? 'bg-indigo-600 hover:bg-indigo-500' : 'bg-indigo-600 hover:bg-indigo-700'
                        } text-white`}
                      >
                        {language === 'zh' ? '加入游戏' : 'Join Game'}
                      </button>
                    )}
                  </div>
                  <span className={`text-[10px] ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                    {formatTime(msg.timestamp)}
                  </span>
                </div>
              </div>
            );
          }

          return (
            <div key={msg.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] ${isMine ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                {!isMine && (
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-400 flex items-center justify-center text-white text-[10px] overflow-hidden">
                      {msg.avatar ? (
                        <img src={msg.avatar} alt={msg.username} className="w-full h-full object-cover" />
                      ) : (
                        msg.username.charAt(0).toUpperCase()
                      )}
                    </div>
                    <span className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                      {msg.username}
                    </span>
                  </div>
                )}
                <div className={`px-4 py-2 rounded-2xl ${
                  isMine
                    ? darkMode ? 'bg-indigo-700 text-white' : 'bg-indigo-600 text-white'
                    : darkMode ? 'bg-slate-700 text-slate-100' : 'bg-white text-slate-800 border border-slate-200'
                }`}>
                  {msg.content}
                </div>
                <span className={`text-[10px] ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                  {formatTime(msg.timestamp)}
                </span>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <div className={`p-4 border-t transition-colors ${
        darkMode ? 'border-slate-700 bg-slate-800' : 'border-slate-100 bg-white'
      }`}>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder={language === 'zh' ? '输入消息...' : 'Type a message...'}
            className={`flex-1 px-4 py-2 rounded-full outline-none transition-colors ${
              darkMode
                ? 'bg-slate-700 text-slate-100 placeholder-slate-400'
                : 'bg-slate-100 text-slate-800 placeholder-slate-400'
            }`}
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSendMessage}
            className="p-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
          >
            <Send className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

/* =================== FRIEND GROUPS PAGE =================== */
function FriendGroupsPage({ navigateTo, language = "en", darkMode = false }) {
  const friendGroups = [
    {
      id: "all",
      name: t("allContacts", language),
      count: 156,
      icon: Users
    },
    {
      id: "classmates",
      name: t("classmates", language),
      count: 48,
      icon: Users
    },
    {
      id: "colleagues",
      name: t("colleagues", language),
      count: 23,
      icon: Briefcase
    },
    {
      id: "family",
      name: t("family", language),
      count: 12,
      icon: Heart
    },
  ];

  const recentContacts = [
    { id: "u001", username: "Alice", avatar: "/Alice.png", major: "Computer Science" },
    { id: "u003", username: "Charlie", avatar: "/Charlie.png", major: "Data Science" },
    { id: "u004", username: "Emma", avatar: "/Emma.png", major: "International Relations" },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`h-full flex flex-col transition-colors duration-500 ${
        darkMode ? "bg-slate-900" : "bg-slate-50"
      }`}
    >
      <div className={`flex items-center gap-3 px-4 py-3 border-b transition-colors ${
        darkMode ? "border-slate-700 bg-slate-800" : "border-slate-100 bg-white"
      }`}>
        <button 
          onClick={() => navigateTo('chat')}
          className={`p-2 -ml-2 rounded-lg transition-colors ${
            darkMode ? "hover:bg-slate-700" : "hover:bg-slate-50"
          }`}
        >
          <ChevronLeft className={`w-6 h-6 transition-colors ${darkMode ? "text-slate-300" : "text-slate-600"}`} />
        </button>
        <div className={`text-xl font-bold tracking-wide transition-colors ${
          darkMode ? "text-indigo-400" : "text-indigo-600"
        }`}>
          {t("addressBook", language)}
        </div>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigateTo('add-friend')}
          className={`ml-auto transition-colors ${
            darkMode ? "text-indigo-400 hover:text-indigo-300" : "text-indigo-600 hover:text-indigo-700"
          }`}
        >
          <UserPlus className="w-5 h-5" />
        </motion.button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Groups */}
        <div>
          <div className={`text-sm font-semibold mb-3 transition-colors ${
            darkMode ? "text-slate-400" : "text-slate-600"
          }`}>
            {t("friendGroups", language)}
          </div>
          <div className="grid grid-cols-2 gap-3">
            {friendGroups.map((group) => (
              <motion.div
                key={group.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  darkMode 
                    ? "bg-slate-800 border-slate-700 hover:border-indigo-700" 
                    : "bg-white border-slate-100 hover:border-indigo-300 hover:shadow-sm"
                }`}
              >
                <group.icon className={`w-8 h-8 mb-2 transition-colors ${
                  darkMode ? "text-indigo-400" : "text-indigo-600"
                }`} />
                <div className={`font-medium mb-1 transition-colors ${
                  darkMode ? "text-slate-200" : "text-slate-800"
                }`}>
                  {group.name}
                </div>
                <div className={`text-sm transition-colors ${
                  darkMode ? "text-slate-500" : "text-slate-400"
                }`}>
                  {group.count} {language === "zh" ? "人" : "contacts"}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Recent Contacts */}
        <div>
          <div className={`text-sm font-semibold mb-3 transition-colors ${
            darkMode ? "text-slate-400" : "text-slate-600"
          }`}>
            {language === "zh" ? "最近联系" : "Recent Contacts"}
          </div>
          <div className="space-y-2">
            {recentContacts.map((contact) => (
              <motion.div
                key={contact.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => navigateTo(`chat-detail-${contact.id.substring(1)}`)}
                className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                  darkMode 
                    ? "bg-slate-800 border-slate-700 hover:border-indigo-700" 
                    : "bg-white border-slate-100 hover:border-indigo-300 hover:shadow-sm"
                }`}
              >
                <img 
                  src={contact.avatar} 
                  alt={contact.username}
                  className="w-12 h-12 rounded-full object-cover shadow" 
                />
                <div className="flex-1">
                  <div className={`font-semibold transition-colors ${
                    darkMode ? "text-slate-200" : "text-slate-800"
                  }`}>
                    {contact.username}
                  </div>
                  <div className={`text-sm transition-colors ${
                    darkMode ? "text-slate-400" : "text-slate-500"
                  }`}>
                    {contact.major}
                  </div>
                </div>
                <ChevronRight className={`w-5 h-5 transition-colors ${
                  darkMode ? "text-slate-600" : "text-slate-300"
                }`} />
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <BottomNav active="chat" navigateTo={navigateTo} language={language} darkMode={darkMode} />
    </motion.div>
  );
}

/* =================== FRIENDS LIST PAGE =================== */
function FriendsListPage({ navigateTo, language = "en", darkMode = false }) {
  const friends = [
    { id: "u001", username: "Alice", avatar: "/Alice.png", major: "Computer Science", mutualFriends: 12 },
    { id: "u003", username: "Charlie", avatar: "/Charlie.png", major: "Data Science", mutualFriends: 8 },
    { id: "u004", username: "Emma", avatar: "/Emma.png", major: "International Relations", mutualFriends: 5 },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`h-full flex flex-col transition-colors duration-500 ${
        darkMode ? "bg-slate-900" : "bg-slate-50"
      }`}
    >
      <div className={`flex items-center gap-3 px-4 py-3 border-b transition-colors ${
        darkMode ? "border-slate-700 bg-slate-800" : "border-slate-100 bg-white"
      }`}>
        <button 
          onClick={() => navigateTo('mine')}
          className={`p-2 -ml-2 rounded-lg transition-colors ${
            darkMode ? "hover:bg-slate-700" : "hover:bg-slate-50"
          }`}
        >
          <ChevronLeft className={`w-6 h-6 transition-colors ${darkMode ? "text-slate-300" : "text-slate-600"}`} />
        </button>
        <div className={`text-xl font-bold tracking-wide transition-colors ${
          darkMode ? "text-indigo-400" : "text-indigo-600"
        }`}>
          {t("friendsList", language)}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {friends.map((friend, index) => (
          <motion.div
            key={friend.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
              darkMode 
                ? "bg-slate-800 border-slate-700" 
                : "bg-white border-slate-100"
            }`}
          >
            <img 
              src={friend.avatar} 
              alt={friend.username}
              className="w-12 h-12 rounded-full object-cover shadow cursor-pointer" 
              onClick={() => navigateTo('user-profile', { userId: friend.id })}
            />
            <div className="flex-1">
              <div 
                onClick={() => navigateTo('user-profile', { userId: friend.id })}
                className={`font-semibold cursor-pointer transition-colors ${
                  darkMode ? "text-slate-200 hover:text-indigo-400" : "text-slate-800 hover:text-indigo-600"
                }`}
              >
                {friend.username}
              </div>
              <div className={`text-sm transition-colors ${
                darkMode ? "text-slate-400" : "text-slate-500"
              }`}>
                {friend.major}
              </div>
              <div className={`text-xs transition-colors ${
                darkMode ? "text-slate-500" : "text-slate-400"
              }`}>
                {friend.mutualFriends} {t("mutualFriends", language)}
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigateTo(`chat-detail-${friend.id.substring(1)}`)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                darkMode
                  ? "bg-indigo-600 text-white hover:bg-indigo-700"
                  : "bg-indigo-600 text-white hover:bg-indigo-700"
              }`}
            >
              {t("messages", language)}
            </motion.button>
          </motion.div>
        ))}
      </div>

      <BottomNav active="mine" navigateTo={navigateTo} language={language} darkMode={darkMode} />
    </motion.div>
  );
}

/* =================== FANS LIST PAGE =================== */
function FansListPage({ navigateTo, language = "en", darkMode = false }) {
  const fans = [
    { id: "u002", username: "Bob", avatar: "/Bob.png", major: "Business Administration", isPro: true, following: true },
    { id: "u005", username: "Dana", avatar: "/Dana.png", major: "Computer Science", isPro: true, following: false },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`h-full flex flex-col transition-colors duration-500 ${
        darkMode ? "bg-slate-900" : "bg-slate-50"
      }`}
    >
      <div className={`flex items-center gap-3 px-4 py-3 border-b transition-colors ${
        darkMode ? "border-slate-700 bg-slate-800" : "border-slate-100 bg-white"
      }`}>
        <button 
          onClick={() => navigateTo('mine')}
          className={`p-2 -ml-2 rounded-lg transition-colors ${
            darkMode ? "hover:bg-slate-700" : "hover:bg-slate-50"
          }`}
        >
          <ChevronLeft className={`w-6 h-6 transition-colors ${darkMode ? "text-slate-300" : "text-slate-600"}`} />
        </button>
        <div className={`text-xl font-bold tracking-wide transition-colors ${
          darkMode ? "text-indigo-400" : "text-indigo-600"
        }`}>
          {t("fansList", language)}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {fans.map((fan, index) => (
          <motion.div
            key={fan.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
              darkMode 
                ? "bg-slate-800 border-slate-700" 
                : "bg-white border-slate-100"
            }`}
          >
            <img 
              src={fan.avatar} 
              alt={fan.username}
              className="w-12 h-12 rounded-full object-cover shadow cursor-pointer" 
              onClick={() => navigateTo('user-profile', { userId: fan.id })}
            />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <div 
                  onClick={() => navigateTo('user-profile', { userId: fan.id })}
                  className={`font-semibold cursor-pointer transition-colors ${
                    darkMode ? "text-slate-200 hover:text-indigo-400" : "text-slate-800 hover:text-indigo-600"
                  }`}
                >
                  {fan.username}
                </div>
                {fan.isPro && <ProBadge size="xs" />}
              </div>
              <div className={`text-sm transition-colors ${
                darkMode ? "text-slate-400" : "text-slate-500"
              }`}>
                {fan.major}
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                fan.following
                  ? darkMode
                    ? "bg-slate-700 text-slate-300 border border-slate-600"
                    : "bg-slate-100 text-slate-700 border border-slate-200"
                  : darkMode
                    ? "bg-indigo-600 text-white hover:bg-indigo-700"
                    : "bg-indigo-600 text-white hover:bg-indigo-700"
              }`}
            >
              {fan.following ? t("following_verb", language) : t("follow", language)}
            </motion.button>
          </motion.div>
        ))}
      </div>

      <BottomNav active="mine" navigateTo={navigateTo} language={language} darkMode={darkMode} />
    </motion.div>
  );
}

/* =================== FOLLOWING LIST PAGE =================== */
function FollowingListPage({ navigateTo, language = "en", darkMode = false }) {
  const following = [
    { id: "u002", username: "Bob", avatar: "/Bob.png", major: "Business Administration", isPro: true },
    { id: "u005", username: "Dana", avatar: "/Dana.png", major: "Computer Science", isPro: true },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`h-full flex flex-col transition-colors duration-500 ${
        darkMode ? "bg-slate-900" : "bg-slate-50"
      }`}
    >
      <div className={`flex items-center gap-3 px-4 py-3 border-b transition-colors ${
        darkMode ? "border-slate-700 bg-slate-800" : "border-slate-100 bg-white"
      }`}>
        <button 
          onClick={() => navigateTo('mine')}
          className={`p-2 -ml-2 rounded-lg transition-colors ${
            darkMode ? "hover:bg-slate-700" : "hover:bg-slate-50"
          }`}
        >
          <ChevronLeft className={`w-6 h-6 transition-colors ${darkMode ? "text-slate-300" : "text-slate-600"}`} />
        </button>
        <div className={`text-xl font-bold tracking-wide transition-colors ${
          darkMode ? "text-indigo-400" : "text-indigo-600"
        }`}>
          {t("followingList", language)}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {following.map((user, index) => (
          <motion.div
            key={user.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
              darkMode 
                ? "bg-slate-800 border-slate-700" 
                : "bg-white border-slate-100"
            }`}
          >
            <img 
              src={user.avatar} 
              alt={user.username}
              className="w-12 h-12 rounded-full object-cover shadow cursor-pointer" 
              onClick={() => navigateTo('user-profile', { userId: user.id })}
            />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <div 
                  onClick={() => navigateTo('user-profile', { userId: user.id })}
                  className={`font-semibold cursor-pointer transition-colors ${
                    darkMode ? "text-slate-200 hover:text-indigo-400" : "text-slate-800 hover:text-indigo-600"
                  }`}
                >
                  {user.username}
                </div>
                {user.isPro && <ProBadge size="xs" />}
              </div>
              <div className={`text-sm transition-colors ${
                darkMode ? "text-slate-400" : "text-slate-500"
              }`}>
                {user.major}
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                darkMode
                  ? "bg-slate-700 text-slate-300 border border-slate-600"
                  : "bg-slate-100 text-slate-700 border border-slate-200"
              }`}
            >
              {t("following_verb", language)}
            </motion.button>
          </motion.div>
        ))}
      </div>

      <BottomNav active="mine" navigateTo={navigateTo} language={language} darkMode={darkMode} />
    </motion.div>
  );
}

/* =================== TOPIC PAGE =================== */
function TopicPage({ navigateTo, language = "en", darkMode = false, topic = "#CampusLife" }) {
  const topicPosts = [
    {
      id: "p1",
      type: "text",
      username: "Alice",
      avatar: "/Alice.png",
      userId: "u001",
      major: "Computer Science",
      content: "Beautiful sunset at XJTLU campus today! 🌅 #CampusLife #XJTLU",
      likes: 89,
      comments: 12,
      time: "3h ago"
    },
    {
      id: "p2",
      type: "text",
      username: "Charlie",
      avatar: "/Charlie.png",
      userId: "u003",
      major: "Data Science",
      content: "Study session at the library! So productive 📚 #CampusLife #StudyMode",
      likes: 56,
      comments: 8,
      time: "5h ago"
    },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`h-full flex flex-col transition-colors duration-500 ${
        darkMode ? "bg-slate-900" : "bg-slate-50"
      }`}
    >
      <div className={`px-4 py-3 border-b transition-colors ${
        darkMode ? "border-slate-700 bg-slate-800" : "border-slate-100 bg-white"
      }`}>
        <div className="flex items-center gap-3 mb-3">
          <button 
            onClick={() => navigateTo('search')}
            className={`p-2 -ml-2 rounded-lg transition-colors ${
              darkMode ? "hover:bg-slate-700" : "hover:bg-slate-50"
            }`}
          >
            <ChevronLeft className={`w-6 h-6 transition-colors ${darkMode ? "text-slate-300" : "text-slate-600"}`} />
          </button>
          <div className={`text-xl font-bold tracking-wide transition-colors ${
            darkMode ? "text-indigo-400" : "text-indigo-600"
          }`}>
            {topic}
          </div>
        </div>
        <div className={`text-sm transition-colors ${
          darkMode ? "text-slate-400" : "text-slate-600"
        }`}>
          2.3k {t("postsCount", language)} • {language === "zh" ? "热门话题" : "Trending Topic"}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {topicPosts.map((post, index) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <PostCard {...post} darkMode={darkMode} navigateTo={navigateTo} language={language} />
          </motion.div>
        ))}
      </div>

      <BottomNav active="home" navigateTo={navigateTo} language={language} darkMode={darkMode} />
    </motion.div>
  );
}

/* =================== SETTINGS PAGE =================== */
function SettingsPage({ navigateTo, language = "en", darkMode = false, onLanguageChange, onDarkModeChange }) {

  const settingsItems = [
    { 
      label: t("changePassword", language),
      icon: <Lock className="w-5 h-5" />, 
      color: "text-indigo-600",
      action: "change-password"
    },
    { 
      label: t("bindEmail", language),
      icon: <Mail className="w-5 h-5" />, 
      color: "text-emerald-600",
      action: "bind-email"
    },
    { 
      label: t("bindPhone", language),
      icon: <Phone className="w-5 h-5" />, 
      color: "text-blue-600",
      action: "bind-phone"
    },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`h-full relative flex flex-col transition-colors duration-500 ${darkMode ? "bg-slate-900" : "bg-slate-50"}`}
    >
      <div className={`flex items-center justify-between px-4 py-3 border-b transition-colors ${
        darkMode ? "border-slate-700 bg-slate-800" : "border-slate-100 bg-white"
      }`}>
        <button 
          onClick={() => navigateTo('mine')}
          className={`p-2 -ml-2 rounded-lg transition-colors ${
            darkMode ? "hover:bg-slate-700" : "hover:bg-slate-50"
          }`}
        >
          <ChevronLeft className={`w-6 h-6 transition-colors ${darkMode ? "text-slate-300" : "text-slate-600"}`} />
        </button>
        <div className={`text-xl font-bold tracking-wide transition-colors ${
          darkMode ? "text-indigo-400" : "text-indigo-600"
        }`}>
          {t("settings", language)}
        </div>
        <div className="w-10" />
      </div>
      
      <div className="flex-1 overflow-y-auto px-4 pt-6 pb-6" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        <style>{`.overflow-y-auto::-webkit-scrollbar { display: none; }`}</style>
        {/* Appearance Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className={`text-sm font-medium mb-3 transition-colors ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
            {t("appearance", language)}
          </div>
          <div className={`rounded-2xl border shadow-sm transition-colors ${
            darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-100"
          }`}>
            <div className="flex items-center justify-between px-4 py-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                  darkMode ? "bg-slate-700 text-slate-300" : "bg-slate-50 text-amber-500"
                }`}>
                  {darkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                </div>
                <span className={`text-sm font-medium transition-colors ${darkMode ? "text-slate-200" : "text-slate-700"}`}>
                  {t("darkMode", language)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onDarkModeChange && onDarkModeChange(false)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    !darkMode 
                      ? "bg-indigo-600 text-white shadow" 
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {t("lightMode", language)}
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onDarkModeChange && onDarkModeChange(true)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    darkMode 
                      ? "bg-indigo-600 text-white shadow" 
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {t("nightMode", language)}
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Language Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <div className={`text-sm font-medium mb-3 transition-colors ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
            {t("language", language)}
          </div>
          <div className={`rounded-2xl border shadow-sm transition-colors ${
            darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-100"
          }`}>
            <div className="flex items-center justify-between px-4 py-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                  darkMode ? "bg-slate-700 text-purple-400" : "bg-slate-50 text-purple-600"
                }`}>
                  <Languages className="w-5 h-5" />
                </div>
                <span className={`text-sm font-medium transition-colors ${darkMode ? "text-slate-200" : "text-slate-700"}`}>
                  {t("language", language)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onLanguageChange && onLanguageChange("en")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    language === "en" 
                      ? "bg-indigo-600 text-white shadow" 
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  English
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onLanguageChange && onLanguageChange("zh")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    language === "zh" 
                      ? "bg-indigo-600 text-white shadow" 
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  中文
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Account Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className={`text-sm font-medium mb-3 transition-colors ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
            {t("accountSecurity", language)}
          </div>
          <div className={`rounded-2xl border shadow-sm divide-y transition-colors ${
            darkMode ? "bg-slate-800 border-slate-700 divide-slate-700" : "bg-white border-slate-100 divide-slate-100"
          }`}>
            {settingsItems.map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.05 }}
                whileHover={{ backgroundColor: darkMode ? "rgba(51, 65, 85, 0.8)" : "rgba(248, 250, 252, 0.8)" }}
                whileTap={{ scale: 0.99 }}
                onClick={() => navigateTo(item.action)}
                className="flex items-center justify-between px-4 py-4 cursor-pointer transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                    darkMode ? "bg-slate-700" : "bg-slate-50"
                  } ${item.color}`}>
                    {item.icon}
                  </div>
                  <span className={`text-sm font-medium transition-colors ${darkMode ? "text-slate-200" : "text-slate-700"}`}>
                    {item.label}
                  </span>
                </div>
                <ChevronRight className={`w-4 h-4 transition-colors ${darkMode ? "text-slate-600" : "text-slate-300"}`} />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Privacy & Security */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6"
        >
          <div className={`text-sm font-medium mb-3 transition-colors ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
            {t("privacySecurity", language)}
          </div>
          <div className={`rounded-2xl border shadow-sm transition-colors ${
            darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-100"
          }`}>
            <div className="p-4 space-y-4">
              <div>
                <div className={`text-sm font-medium mb-2 transition-colors ${darkMode ? "text-slate-200" : "text-slate-700"}`}>
                  {t("postPrivacy", language)}
                </div>
                <div className={`text-xs mb-2 transition-colors ${darkMode ? "text-slate-500" : "text-slate-400"}`}>
                  {language === "zh" ? "设置谁可以看到你的帖子" : "Control who can see your posts"}
                </div>
                <div className="flex gap-2">
                  {[
                    { id: "public", label: t("publicPost", language) },
                    { id: "friends", label: t("friendsOnly", language) },
                    { id: "private", label: t("privatePost", language) }
                  ].map((option) => (
                    <button
                      key={option.id}
                      className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                        darkMode
                          ? "bg-slate-700 text-slate-300 hover:bg-slate-600"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4 transition-colors ${darkMode ? 'border-slate-700' : 'border-slate-100'}">
                <div className={`text-sm font-medium mb-2 transition-colors ${darkMode ? "text-slate-200" : "text-slate-700"}`}>
                  {t("whoCanComment", language)}
                </div>
                <div className="flex gap-2">
                  {[
                    { id: "everyone", label: t("everyone", language) },
                    { id: "friends", label: t("friendsCanComment", language) },
                    { id: "nobody", label: t("nobodyCanComment", language) }
                  ].map((option) => (
                    <button
                      key={option.id}
                      className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                        darkMode
                          ? "bg-slate-700 text-slate-300 hover:bg-slate-600"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4 transition-colors ${darkMode ? 'border-slate-700' : 'border-slate-100'}">
                <button 
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    darkMode
                      ? "hover:bg-slate-700 text-slate-300"
                      : "hover:bg-slate-100 text-slate-700"
                  }`}
                >
                  <span>{t("blockedUsers", language)}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="border-t pt-4 transition-colors ${darkMode ? 'border-slate-700' : 'border-slate-100'}">
                <button 
                  className={`w-full text-sm font-medium transition-colors ${
                    darkMode ? "text-rose-400 hover:text-rose-300" : "text-rose-600 hover:text-rose-700"
                  }`}
                >
                  {t("deleteAccount", language)}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      
      <BottomNav active="mine" navigateTo={navigateTo} language={language} darkMode={darkMode} />
    </motion.div>
  );
}

/* =================== EDIT PROFILE PAGE =================== */
function EditProfilePage({ navigateTo, language = "en", darkMode = false }) {
  const [formData, setFormData] = useState(() => {
    if (typeof window !== 'undefined') {
      return {
        birthday: localStorage.getItem('seer_birthday') || '',
        gender: localStorage.getItem('seer_gender') || 'preferNotToSay',
        major: localStorage.getItem('seer_major') || '',
        bio: localStorage.getItem('seer_bio') || 'CS student. Coffee enthusiast. Gamer. Always exploring new technologies and gaming strategies.',
      };
    }
    return {
      birthday: '',
      gender: 'preferNotToSay',
      major: '',
      bio: 'CS student. Coffee enthusiast. Gamer. Always exploring new technologies and gaming strategies.',
    };
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('seer_birthday', formData.birthday);
      localStorage.setItem('seer_gender', formData.gender);
      localStorage.setItem('seer_major', formData.major);
      localStorage.setItem('seer_bio', formData.bio);
    }
    navigateTo('mine');
  };

  const majors = [
    'Computer Science',
    'Software Engineering',
    'Data Science',
    'Artificial Intelligence',
    'Business Administration',
    'Economics',
    'International Relations',
    'Electrical Engineering',
    'Mechanical Engineering',
    'Architecture',
    'Mathematics',
    'Physics',
    'Chemistry',
    'Biology',
    'Psychology',
    'English Literature',
    'Media & Communication',
    'Other'
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`h-full flex flex-col transition-colors duration-500 ${
        darkMode ? "bg-slate-900" : "bg-slate-50"
      }`}
    >
      <div className={`flex items-center justify-between px-4 py-3 border-b transition-colors ${
        darkMode ? "border-slate-700 bg-slate-800" : "border-slate-100 bg-white"
      }`}>
        <button 
          onClick={() => navigateTo('mine')}
          className={`p-2 -ml-2 rounded-lg transition-colors ${
            darkMode ? "hover:bg-slate-700" : "hover:bg-slate-50"
          }`}
        >
          <ChevronLeft className={`w-6 h-6 transition-colors ${darkMode ? "text-slate-300" : "text-slate-600"}`} />
        </button>
        <div className={`text-xl font-bold tracking-wide transition-colors ${
          darkMode ? "text-indigo-400" : "text-indigo-600"
        }`}>
          {t("editProfile", language)}
        </div>
        <div className="w-10" />
      </div>
      
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex flex-col gap-5"
        >
          {/* Birthday */}
          <label className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Calendar className={`w-4 h-4 ${darkMode ? "text-slate-400" : "text-slate-600"}`} />
              <span className={`text-sm font-medium transition-colors ${darkMode ? "text-slate-300" : "text-slate-600"}`}>
                {t("birthday", language)}
              </span>
            </div>
            <input 
              type="date"
              value={formData.birthday}
              onChange={(e) => handleInputChange('birthday', e.target.value)}
              className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition-all ${
                darkMode 
                  ? "bg-slate-800 border-slate-700 text-slate-200" 
                  : "bg-white border-slate-200 text-slate-800"
              }`}
            />
          </label>
          
          {/* Gender */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Users className={`w-4 h-4 ${darkMode ? "text-slate-400" : "text-slate-600"}`} />
              <span className={`text-sm font-medium transition-colors ${darkMode ? "text-slate-300" : "text-slate-600"}`}>
                {t("gender", language)}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {['male', 'female', 'preferNotToSay'].map((option) => (
                <motion.button
                  key={option}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleInputChange('gender', option)}
                  className={`py-2.5 px-3 rounded-xl text-sm font-medium transition-all ${
                    formData.gender === option
                      ? "bg-indigo-600 text-white shadow-lg"
                      : darkMode
                      ? "bg-slate-800 border-2 border-slate-700 text-slate-300 hover:bg-slate-700"
                      : "bg-white border-2 border-slate-200 text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {t(option, language)}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Major */}
          <label className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Briefcase className={`w-4 h-4 ${darkMode ? "text-slate-400" : "text-slate-600"}`} />
              <span className={`text-sm font-medium transition-colors ${darkMode ? "text-slate-300" : "text-slate-600"}`}>
                {t("major", language)}
              </span>
            </div>
            <select
              value={formData.major}
              onChange={(e) => handleInputChange('major', e.target.value)}
              className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition-all ${
                darkMode 
                  ? "bg-slate-800 border-slate-700 text-slate-200" 
                  : "bg-white border-slate-200 text-slate-800"
              }`}
            >
              <option value="">{t("selectMajor", language)}</option>
              {majors.map((major) => (
                <option key={major} value={major}>{major}</option>
              ))}
            </select>
          </label>

          {/* Bio */}
          <label className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Edit className={`w-4 h-4 ${darkMode ? "text-slate-400" : "text-slate-600"}`} />
              <span className={`text-sm font-medium transition-colors ${darkMode ? "text-slate-300" : "text-slate-600"}`}>
                {t("bio", language)}
              </span>
            </div>
            <textarea
              value={formData.bio}
              onChange={(e) => handleInputChange('bio', e.target.value)}
              placeholder={t("editBio", language)}
              rows={4}
              className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition-all resize-none ${
                darkMode 
                  ? "bg-slate-800 border-slate-700 text-slate-200 placeholder-slate-500" 
                  : "bg-white border-slate-200 text-slate-800 placeholder-slate-400"
              }`}
            />
          </label>
          
          {/* Save Button */}
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSave}
            className="mt-4 w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 text-white font-semibold shadow-lg hover:shadow-xl transition-all"
          >
            {t("saveChanges", language)}
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
}

/* =================== CHANGE PASSWORD PAGE =================== */
function ChangePasswordPage({ navigateTo, language = "en", darkMode = false }) {
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-full flex flex-col bg-white"
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
        <button 
          onClick={() => navigateTo('settings')}
          className="p-2 -ml-2 hover:bg-slate-50 rounded-lg transition-colors"
        >
          <ChevronLeft className="w-6 h-6 text-slate-600" />
        </button>
        <div className="text-xl font-bold tracking-wide" style={{ color: palette.primary }}>
          {t("changePassword", language)}
        </div>
        <div className="w-10" />
      </div>
      
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex flex-col gap-4"
        >
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-slate-600">{t("currentPassword", language)}</span>
            <div className="relative">
              <input 
                type={showOld ? "text" : "password"}
                value={formData.oldPassword}
                onChange={(e) => handleInputChange('oldPassword', e.target.value)}
                placeholder={t("enterCurrentPassword", language)}
                className="w-full px-4 py-3 pr-12 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition-all" 
              />
              <button
                type="button"
                onClick={() => setShowOld(!showOld)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showOld ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </label>
          
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-slate-600">{t("newPassword", language)}</span>
            <div className="relative">
              <input 
                type={showNew ? "text" : "password"}
                value={formData.newPassword}
                onChange={(e) => handleInputChange('newPassword', e.target.value)}
                placeholder={t("enterNewPassword", language)}
                className="w-full px-4 py-3 pr-12 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition-all" 
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showNew ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            <span className="text-xs text-slate-400">{t("passwordStrength", language)}</span>
          </label>
          
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-slate-600">{t("confirmNewPassword", language)}</span>
            <div className="relative">
              <input 
                type={showConfirm ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                placeholder={t("confirmYourNewPassword", language)}
                className="w-full px-4 py-3 pr-12 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition-all" 
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </label>
          
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigateTo('settings')}
            className="mt-6 w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 text-white font-semibold shadow-lg hover:shadow-xl transition-all"
          >
            {t("updatePassword", language)}
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
}

/* =================== BIND EMAIL PAGE =================== */
function BindEmailPage({ navigateTo, language = "en", darkMode = false }) {
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [codeSent, setCodeSent] = useState(false);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-full flex flex-col bg-white"
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
        <button 
          onClick={() => navigateTo('settings')}
          className="p-2 -ml-2 hover:bg-slate-50 rounded-lg transition-colors"
        >
          <ChevronLeft className="w-6 h-6 text-slate-600" />
        </button>
        <div className="text-xl font-bold tracking-wide" style={{ color: palette.primary }}>
          {t("bindEmail", language)}
        </div>
        <div className="w-10" />
      </div>
      
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex flex-col gap-4"
        >
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-slate-600">{t("emailAddress", language)}</span>
            <input 
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("enterEmailAddress", language)}
              className="px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition-all" 
            />
          </label>
          
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-slate-600">{t("verificationCode", language)}</span>
            <div className="flex gap-2">
              <input 
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder={t("enterCode", language)}
                className="flex-1 px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition-all" 
              />
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setCodeSent(true)}
                disabled={codeSent}
                className={`px-4 py-3 rounded-xl font-medium transition-all ${
                  codeSent 
                    ? "bg-slate-100 text-slate-400 cursor-not-allowed" 
                    : "bg-indigo-600 text-white hover:bg-indigo-700"
                }`}
              >
                {codeSent ? t("sent", language) : t("send", language)}
              </motion.button>
            </div>
            {codeSent && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-2 text-xs text-emerald-600"
              >
                <Check className="w-4 h-4" />
                <span>{t("codeSentEmail", language)}</span>
              </motion.div>
            )}
          </label>
          
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigateTo('settings')}
            className="mt-6 w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 text-white font-semibold shadow-lg hover:shadow-xl transition-all"
          >
            {t("bindEmail", language)}
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
}

/* =================== BIND PHONE PAGE =================== */
function BindPhonePage({ navigateTo, language = "en", darkMode = false }) {
  const [phone, setPhone] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [codeSent, setCodeSent] = useState(false);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-full flex flex-col bg-white"
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
        <button 
          onClick={() => navigateTo('settings')}
          className="p-2 -ml-2 hover:bg-slate-50 rounded-lg transition-colors"
        >
          <ChevronLeft className="w-6 h-6 text-slate-600" />
        </button>
        <div className="text-xl font-bold tracking-wide" style={{ color: palette.primary }}>
          {t("bindPhone", language)}
        </div>
        <div className="w-10" />
      </div>
      
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex flex-col gap-4"
        >
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-slate-600">{t("phoneNumber", language)}</span>
            <input 
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder={t("enterPhoneNumber", language)}
              className="px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition-all" 
            />
          </label>
          
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-slate-600">{t("verificationCode", language)}</span>
            <div className="flex gap-2">
              <input 
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder={t("enterCode", language)}
                className="flex-1 px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition-all" 
              />
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setCodeSent(true)}
                disabled={codeSent}
                className={`px-4 py-3 rounded-xl font-medium transition-all ${
                  codeSent 
                    ? "bg-slate-100 text-slate-400 cursor-not-allowed" 
                    : "bg-indigo-600 text-white hover:bg-indigo-700"
                }`}
              >
                {codeSent ? t("sent", language) : t("send", language)}
              </motion.button>
            </div>
            {codeSent && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-2 text-xs text-emerald-600"
              >
                <Check className="w-4 h-4" />
                <span>{t("codeSentPhone", language)}</span>
              </motion.div>
            )}
          </label>
          
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigateTo('settings')}
            className="mt-6 w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 text-white font-semibold shadow-lg hover:shadow-xl transition-all"
          >
            {t("bindPhone", language)}
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
}

/* =================== FORGOT PASSWORD PAGE =================== */
function ForgotPasswordPage({ navigateTo, language = "en", darkMode = false }) {
  const [selectedMethod, setSelectedMethod] = useState(null);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-full flex flex-col bg-white"
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
        <button 
          onClick={() => navigateTo('login')}
          className="p-2 -ml-2 hover:bg-slate-50 rounded-lg transition-colors"
        >
          <ChevronLeft className="w-6 h-6 text-slate-600" />
        </button>
        <div className="text-xl font-bold tracking-wide" style={{ color: palette.primary }}>
          {t("resetPassword", language)}
        </div>
        <div className="w-10" />
      </div>
      
      <div className="flex-1 overflow-y-auto px-6 py-8">
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex flex-col gap-6"
        >
          <div className="text-center mb-4">
            <div className="text-sm text-slate-600">{t("selectVerification", language)}</div>
          </div>

          {/* Email Verification Option */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigateTo('forgot-password-email')}
            className="p-6 rounded-2xl bg-white border-2 border-slate-200 hover:border-indigo-400 transition-all shadow-sm hover:shadow-md"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-400 flex items-center justify-center text-white shadow-lg">
                <Mail className="w-7 h-7" />
              </div>
              <div className="flex-1 text-left">
                <div className="text-lg font-semibold text-slate-800 mb-1">{t("verifyByEmail", language)}</div>
                <div className="text-sm text-slate-500">{t("emailVerification", language)}</div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-300" />
            </div>
          </motion.button>

          {/* Phone Verification Option */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigateTo('forgot-password-phone')}
            className="p-6 rounded-2xl bg-white border-2 border-slate-200 hover:border-indigo-400 transition-all shadow-sm hover:shadow-md"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-blue-400 flex items-center justify-center text-white shadow-lg">
                <Phone className="w-7 h-7" />
              </div>
              <div className="flex-1 text-left">
                <div className="text-lg font-semibold text-slate-800 mb-1">{t("verifyByPhone", language)}</div>
                <div className="text-sm text-slate-500">{t("phoneVerification", language)}</div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-300" />
            </div>
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
}

/* =================== FORGOT PASSWORD - EMAIL VERIFICATION =================== */
function ForgotPasswordEmailPage({ navigateTo, language = "en", darkMode = false }) {
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [verified, setVerified] = useState(false);

  const handleVerify = () => {
    setVerified(true);
    setTimeout(() => navigateTo('reset-password'), 1000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-full flex flex-col bg-white"
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
        <button 
          onClick={() => navigateTo('forgot-password')}
          className="p-2 -ml-2 hover:bg-slate-50 rounded-lg transition-colors"
        >
          <ChevronLeft className="w-6 h-6 text-slate-600" />
        </button>
        <div className="text-xl font-bold tracking-wide" style={{ color: palette.primary }}>
          {t("emailVerification", language)}
        </div>
        <div className="w-10" />
      </div>
      
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex flex-col gap-4"
        >
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-slate-600">{t("emailAddress", language)}</span>
            <input 
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("enterEmailAddress", language)}
              className="px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition-all" 
            />
          </label>
          
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-slate-600">{t("verificationCode", language)}</span>
            <div className="flex gap-2">
              <input 
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder={t("enterCode", language)}
                className="flex-1 px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition-all" 
              />
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setCodeSent(true)}
                disabled={codeSent}
                className={`px-4 py-3 rounded-xl font-medium transition-all ${
                  codeSent 
                    ? "bg-slate-100 text-slate-400 cursor-not-allowed" 
                    : "bg-indigo-600 text-white hover:bg-indigo-700"
                }`}
              >
                {codeSent ? t("sent", language) : t("send", language)}
              </motion.button>
            </div>
            {codeSent && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-2 text-xs text-emerald-600"
              >
                <Check className="w-4 h-4" />
                <span>{t("codeSentEmail", language)}</span>
              </motion.div>
            )}
          </label>
          
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleVerify}
            className="mt-6 w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 text-white font-semibold shadow-lg hover:shadow-xl transition-all"
          >
            {t("verify", language)}
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
}

/* =================== FORGOT PASSWORD - PHONE VERIFICATION =================== */
function ForgotPasswordPhonePage({ navigateTo, language = "en", darkMode = false }) {
  const [phone, setPhone] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [verified, setVerified] = useState(false);

  const handleVerify = () => {
    setVerified(true);
    setTimeout(() => navigateTo('reset-password'), 1000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-full flex flex-col bg-white"
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
        <button 
          onClick={() => navigateTo('forgot-password')}
          className="p-2 -ml-2 hover:bg-slate-50 rounded-lg transition-colors"
        >
          <ChevronLeft className="w-6 h-6 text-slate-600" />
        </button>
        <div className="text-xl font-bold tracking-wide" style={{ color: palette.primary }}>
          {t("phoneVerification", language)}
        </div>
        <div className="w-10" />
      </div>
      
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex flex-col gap-4"
        >
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-slate-600">{t("phoneNumber", language)}</span>
            <input 
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder={t("enterPhoneNumber", language)}
              className="px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition-all" 
            />
          </label>
          
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-slate-600">{t("verificationCode", language)}</span>
            <div className="flex gap-2">
              <input 
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder={t("enterCode", language)}
                className="flex-1 px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition-all" 
              />
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setCodeSent(true)}
                disabled={codeSent}
                className={`px-4 py-3 rounded-xl font-medium transition-all ${
                  codeSent 
                    ? "bg-slate-100 text-slate-400 cursor-not-allowed" 
                    : "bg-indigo-600 text-white hover:bg-indigo-700"
                }`}
              >
                {codeSent ? t("sent", language) : t("send", language)}
              </motion.button>
            </div>
            {codeSent && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-2 text-xs text-emerald-600"
              >
                <Check className="w-4 h-4" />
                <span>{t("codeSentPhone", language)}</span>
              </motion.div>
            )}
          </label>
          
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleVerify}
            className="mt-6 w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 text-white font-semibold shadow-lg hover:shadow-xl transition-all"
          >
            {t("verify", language)}
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
}

/* =================== RESET PASSWORD PAGE (After Verification) =================== */
function ResetPasswordPage({ navigateTo, language = "en", darkMode = false }) {
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: ""
  });
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-full flex flex-col bg-white"
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
        <button 
          onClick={() => navigateTo('login')}
          className="p-2 -ml-2 hover:bg-slate-50 rounded-lg transition-colors"
        >
          <ChevronLeft className="w-6 h-6 text-slate-600" />
        </button>
        <div className="text-xl font-bold tracking-wide" style={{ color: palette.primary }}>
          {t("resetYourPassword", language)}
        </div>
        <div className="w-10" />
      </div>
      
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex flex-col gap-4"
        >
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-slate-600">{t("newPassword", language)}</span>
            <div className="relative">
              <input 
                type={showNew ? "text" : "password"}
                value={formData.newPassword}
                onChange={(e) => handleInputChange('newPassword', e.target.value)}
                placeholder={t("enterNewPassword", language)}
                className="w-full px-4 py-3 pr-12 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition-all" 
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showNew ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            <span className="text-xs text-slate-400">{t("passwordStrength", language)}</span>
          </label>
          
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-slate-600">{t("confirmNewPassword", language)}</span>
            <div className="relative">
              <input 
                type={showConfirm ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                placeholder={t("confirmYourNewPassword", language)}
                className="w-full px-4 py-3 pr-12 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition-all" 
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </label>
          
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigateTo('login')}
            className="mt-6 w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 text-white font-semibold shadow-lg hover:shadow-xl transition-all"
          >
            {t("resetPassword", language)}
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
}

/* =================== PRO UPGRADE PAGE =================== */
function ProUpgradePage({ navigateTo, language = "en", darkMode = false }) {
  const [isPro, setIsPro] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('seer_isPro') === 'true';
    }
    return false;
  });

  const [expiryDate, setExpiryDate] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedDate = localStorage.getItem('seer_proExpiry');
      return savedDate || null;
    }
    return null;
  });

  const [showPlans, setShowPlans] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(1); // Default: 1 month

  const plans = [
    { months: 1, price: 6, totalDays: 30, save: 0, coinReward: 60 },
    { months: 3, price: 15, totalDays: 90, save: 17, coinReward: 199 },
    { months: 6, price: 29, totalDays: 180, save: 19, coinReward: 420 },
    { months: 12, price: 55, totalDays: 365, save: 24, coinReward: 899 },
  ];

  const handleSubscribe = (planMonths = 1) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('seer_isPro', 'true');
      
      const plan = plans.find(p => p.months === planMonths) || plans[0];
      
      // Set expiry date based on selected plan
      const expiry = new Date();
      expiry.setDate(expiry.getDate() + plan.totalDays);
      const expiryString = expiry.toISOString().split('T')[0];
      localStorage.setItem('seer_proExpiry', expiryString);
      
      // Set start date if not already set (first time subscription)
      if (!localStorage.getItem('seer_proStartDate')) {
        const startDate = new Date().toISOString().split('T')[0];
        localStorage.setItem('seer_proStartDate', startDate);
      }
      
      // Add coin reward
      const currentCoins = parseInt(localStorage.getItem('seer_coins') || '100', 10);
      const newCoins = currentCoins + plan.coinReward;
      localStorage.setItem('seer_coins', newCoins.toString());
      
      setIsPro(true);
      setExpiryDate(expiryString);
      setShowPlans(false);
    }
    // Simulate payment success
    setTimeout(() => {
      navigateTo('member-center');
    }, 1500);
  };

  const handleRenewClick = () => {
    setShowPlans(true);
  };

  const proFeatures = [
    {
      icon: <Download className="w-6 h-6" />,
      title: t("downloadVideos", language),
      desc: t("downloadVideosDesc", language),
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: <Radio className="w-6 h-6" />,
      title: t("liveStreaming", language),
      desc: t("liveStreamingDesc", language),
      color: "from-red-500 to-pink-500",
    },
    {
      icon: <UserX className="w-6 h-6" />,
      title: t("anonymousMode", language),
      desc: t("anonymousModeDesc", language),
      color: "from-purple-500 to-indigo-500",
    },
    {
      icon: <Pin className="w-6 h-6" />,
      title: t("pinPosts", language),
      desc: t("pinPostsDesc", language),
      color: "from-amber-500 to-orange-500",
    },
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: t("proSupport", language),
      desc: t("proSupportDesc", language),
      color: "from-emerald-500 to-teal-500",
    },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`h-full relative overflow-auto transition-colors duration-500 ${
        darkMode ? "bg-slate-900" : "bg-slate-50"
      }`}
    >
      {/* Header */}
      <div className={`flex items-center justify-between px-4 py-3 border-b backdrop-blur-sm sticky top-0 z-10 transition-colors ${
        darkMode ? "border-slate-700 bg-slate-800/90" : "border-slate-100 bg-white/90"
      }`}>
        <button 
          onClick={() => navigateTo('mine')}
          className={`p-2 -ml-2 rounded-lg transition-colors ${
            darkMode ? "hover:bg-slate-700" : "hover:bg-slate-100"
          }`}
        >
          <ChevronLeft className={`w-6 h-6 transition-colors ${darkMode ? "text-slate-300" : "text-slate-600"}`} />
        </button>
        <div className={`text-xl font-bold tracking-wide transition-colors ${
          darkMode ? "text-amber-400" : "text-indigo-600"
        }`}>
          {t("proSubscription", language)}
        </div>
        <div className="w-10" />
      </div>
      
      <div className="px-6 py-6 pb-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-3xl p-8 mb-6 relative overflow-hidden ${
            darkMode ? "bg-slate-800" : "bg-white"
          }`}
          style={{
            background: darkMode 
              ? 'linear-gradient(135deg, #1e293b 0%, #334155 100%)'
              : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          }}
        >
          {/* Animated background */}
          <div className="absolute inset-0 opacity-20">
            <motion.div
              className="absolute top-0 right-0 w-64 h-64 rounded-full"
              style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.4) 0%, transparent 70%)' }}
              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 4, repeat: Infinity }}
            />
          </div>

          <div className="relative z-10 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="inline-block mb-4"
            >
              <Crown className="w-16 h-16 text-amber-300" />
            </motion.div>
            
            <h2 className="text-3xl font-bold text-white mb-2">
              {t("unlockPremium", language)}
            </h2>
            <p className="text-white/80 text-sm">
              {t("proFeatures", language)}
            </p>

            {/* Price */}
            <div className="mt-6 flex items-center justify-center gap-1">
              <span className="text-5xl font-bold text-white">$3</span>
              <span className="text-xl text-white/80">{t("perMonth", language)}</span>
            </div>
          </div>
        </motion.div>

        {/* Current Plan Status */}
        {isPro ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`rounded-2xl p-4 mb-6 border-2 ${
              darkMode 
                ? "bg-slate-800 border-amber-500/50" 
                : "bg-amber-50 border-amber-300"
            }`}
          >
            <div className="flex items-center gap-3 mb-3">
              <Check className="w-6 h-6 text-amber-600" />
              <div className="flex-1">
                <div className={`font-bold ${darkMode ? "text-slate-100" : "text-slate-800"}`}>
                  {t("subscriptionActive", language)}
                </div>
              </div>
              <ProBadge size="md" />
            </div>
            {expiryDate && (
              <div className={`text-sm flex items-center justify-between ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
                <span>{t("expiresOn", language)}: {expiryDate}</span>
              </div>
            )}
          </motion.div>
        ) : null}

        {/* Features List */}
        <div className="space-y-3 mb-6">
          {proFeatures.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`rounded-2xl p-4 border transition-colors ${
                darkMode 
                  ? "bg-slate-800 border-slate-700" 
                  : "bg-white border-slate-100"
              } shadow-sm`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-white flex-shrink-0`}>
                  {feature.icon}
                </div>
                <div className="flex-1">
                  <div className={`font-bold mb-1 transition-colors ${
                    darkMode ? "text-slate-100" : "text-slate-800"
                  }`}>
                    {feature.title}
                  </div>
                  <div className={`text-sm transition-colors ${
                    darkMode ? "text-slate-400" : "text-slate-600"
                  }`}>
                    {feature.desc}
                  </div>
                </div>
                <Check className="w-5 h-5 text-emerald-500 flex-shrink-0" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Plan Selection */}
        {showPlans ? (
          <div className="space-y-4">
            <div className={`text-center font-bold text-lg mb-4 transition-colors ${
              darkMode ? "text-slate-100" : "text-slate-800"
            }`}>
              {t("selectPlan", language)}
            </div>
            
            {plans.map((plan) => (
              <motion.div
                key={plan.months}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedPlan(plan.months)}
                className={`rounded-2xl p-4 cursor-pointer transition-all border-2 ${
                  selectedPlan === plan.months
                    ? darkMode
                      ? "border-amber-500 bg-amber-500/10"
                      : "border-amber-500 bg-amber-50"
                    : darkMode
                    ? "border-slate-700 bg-slate-800 hover:border-slate-600"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className={`font-bold text-lg transition-colors ${
                        darkMode ? "text-slate-100" : "text-slate-800"
                      }`}>
                        {plan.months} {plan.months === 1 ? t("month", language) : t("months", language)}
                      </div>
                      <div className={`text-sm transition-colors ${
                        darkMode ? "text-slate-400" : "text-slate-600"
                      }`}>
                        ${(plan.price / plan.months).toFixed(2)} {t("perMonth", language).replace("/", "")}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-2xl font-bold transition-colors ${
                        darkMode ? "text-amber-400" : "text-amber-600"
                      }`}>
                        ${plan.price}
                      </div>
                      {plan.save > 0 && (
                        <div className="text-xs font-semibold text-emerald-500">
                          {t("savePercent", language)} {plan.save}%
                        </div>
                      )}
                    </div>
                  </div>
                  {/* Coin Reward Badge */}
                  <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg ${
                    darkMode ? "bg-amber-500/20" : "bg-amber-100"
                  }`}>
                    <Coins className="w-4 h-4 text-amber-500" />
                    <span className={`text-xs font-semibold ${
                      darkMode ? "text-amber-300" : "text-amber-700"
                    }`}>
                      +{plan.coinReward} {t("coins", language)}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSubscribe(selectedPlan)}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-400 via-orange-500 to-pink-500 text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
            >
              <Crown className="w-6 h-6" />
              {t("confirm", language)}
            </motion.button>
            
            <button
              onClick={() => setShowPlans(false)}
              className={`w-full py-3 rounded-xl font-medium transition-colors ${
                darkMode
                  ? "text-slate-400 hover:text-slate-300"
                  : "text-slate-600 hover:text-slate-800"
              }`}
            >
              {t("cancel", language)}
            </button>
          </div>
        ) : (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowPlans(true)}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-400 via-orange-500 to-pink-500 text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
          >
            <Crown className="w-6 h-6" />
            {isPro ? t("renewNow", language) : t("subscribePro", language)}
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}

/* =================== MEMBER CENTER PAGE =================== */
function MemberCenterPage({ navigateTo, language = "en", darkMode = false }) {
  // Initialize states from localStorage
  const [coins, setCoins] = useState(() => {
    if (typeof window !== 'undefined') {
      return parseInt(localStorage.getItem('seer_coins') || '100', 10);
    }
    return 100;
  });

  const [diamonds, setDiamonds] = useState(() => {
    if (typeof window !== 'undefined') {
      return parseInt(localStorage.getItem('seer_diamonds') || '0', 10);
    }
    return 0;
  });

  const [proLevel, setProLevel] = useState(() => {
    if (typeof window !== 'undefined') {
      return parseInt(localStorage.getItem('seer_proLevel') || '1', 10);
    }
    return 1;
  });

  const [exp, setExp] = useState(() => {
    if (typeof window !== 'undefined') {
      return parseInt(localStorage.getItem('seer_exp') || '0', 10);
    }
    return 0;
  });

  const [lastCheckIn, setLastCheckIn] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('seer_lastCheckIn') || '';
    }
    return '';
  });

  const [consecutiveDays, setConsecutiveDays] = useState(() => {
    if (typeof window !== 'undefined') {
      return parseInt(localStorage.getItem('seer_consecutiveDays') || '0', 10);
    }
    return 0;
  });

  const [ownedItems, setOwnedItems] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('seer_ownedItems');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  const [equippedItems, setEquippedItems] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('seer_equippedItems');
      return saved ? JSON.parse(saved) : {};
    }
    return {};
  });

  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'shop', 'items'
  const [selectedCategory, setSelectedCategory] = useState('frames'); // 'frames', 'outfits', 'accessories', 'effects'

  // Pro Level Configuration
  const proLevels = [
    { level: 1, name: 'Pro 1', expRequired: 0, color: 'from-blue-400 to-blue-600', benefits: ['Basic Pro Features', 'Download Videos', '5 Pin Posts/month'] },
    { level: 2, name: 'Pro 2', expRequired: 1000, color: 'from-purple-400 to-purple-600', benefits: ['All Pro 1 Benefits', 'Live Streaming', '10 Pin Posts/month', '10% Coin Bonus'] },
    { level: 3, name: 'Pro 3', expRequired: 3000, color: 'from-pink-400 to-pink-600', benefits: ['All Pro 2 Benefits', 'Anonymous Mode', '15 Pin Posts/month', '20% Coin Bonus'] },
    { level: 4, name: 'Pro 4', expRequired: 7000, color: 'from-amber-400 to-amber-600', benefits: ['All Pro 3 Benefits', 'Priority Support', '25 Pin Posts/month', '30% Coin Bonus', 'Exclusive Badge'] },
    { level: 5, name: 'Pro 5', expRequired: 15000, color: 'from-gradient-to-r from-yellow-400 via-red-500 to-pink-500', benefits: ['All Pro 4 Benefits', 'VIP Customer Service', 'Unlimited Pin Posts', '50% Coin Bonus', 'Exclusive Effects', 'Custom Badge'] },
  ];

  const currentLevelData = proLevels[proLevel - 1];
  const nextLevelData = proLevel < 5 ? proLevels[proLevel] : null;
  const expToNext = nextLevelData ? nextLevelData.expRequired - exp : 0;
  const expProgress = nextLevelData ? ((exp - currentLevelData.expRequired) / (nextLevelData.expRequired - currentLevelData.expRequired)) * 100 : 100;

  // Shop Items
  const shopItems = {
    frames: [
      { id: 'f1', name: 'Golden Frame', price: 500, image: '🟡', rarity: 'legendary' },
      { id: 'f2', name: 'Diamond Frame', price: 1000, image: '💎', rarity: 'legendary' },
      { id: 'f3', name: 'Rainbow Frame', price: 800, image: '🌈', rarity: 'epic' },
      { id: 'f4', name: 'Fire Frame', price: 600, image: '🔥', rarity: 'epic' },
      { id: 'f5', name: 'Ice Frame', price: 400, image: '❄️', rarity: 'rare' },
      { id: 'f6', name: 'Star Frame', price: 300, image: '⭐', rarity: 'rare' },
    ],
    outfits: [
      { id: 'o1', name: 'Cyber Suit', price: 1200, image: '🤖', rarity: 'legendary' },
      { id: 'o2', name: 'Wizard Robe', price: 900, image: '🧙', rarity: 'epic' },
      { id: 'o3', name: 'Knight Armor', price: 800, image: '⚔️', rarity: 'epic' },
      { id: 'o4', name: 'Ninja Outfit', price: 700, image: '🥷', rarity: 'rare' },
      { id: 'o5', name: 'Casual Wear', price: 300, image: '👕', rarity: 'common' },
      { id: 'o6', name: 'Formal Suit', price: 500, image: '🤵', rarity: 'rare' },
    ],
    accessories: [
      { id: 'a1', name: 'Crown', price: 1500, image: '👑', rarity: 'legendary' },
      { id: 'a2', name: 'Sunglasses', price: 200, image: '🕶️', rarity: 'common' },
      { id: 'a3', name: 'Top Hat', price: 400, image: '🎩', rarity: 'rare' },
      { id: 'a4', name: 'Headphones', price: 350, image: '🎧', rarity: 'rare' },
      { id: 'a5', name: 'Party Hat', price: 250, image: '🎉', rarity: 'common' },
      { id: 'a6', name: 'Halo', price: 1000, image: '😇', rarity: 'epic' },
    ],
    effects: [
      { id: 'e1', name: 'Sparkle Effect', price: 2000, image: '✨', rarity: 'legendary' },
      { id: 'e2', name: 'Fire Aura', price: 1500, image: '🔥', rarity: 'legendary' },
      { id: 'e3', name: 'Lightning Effect', price: 1200, image: '⚡', rarity: 'epic' },
      { id: 'e4', name: 'Glow Effect', price: 800, image: '💫', rarity: 'epic' },
      { id: 'e5', name: 'Bubble Effect', price: 500, image: '🫧', rarity: 'rare' },
      { id: 'e6', name: 'Heart Effect', price: 400, image: '💖', rarity: 'rare' },
    ],
  };

  const rarityColors = {
    common: 'from-gray-400 to-gray-600',
    rare: 'from-blue-400 to-blue-600',
    epic: 'from-purple-400 to-purple-600',
    legendary: 'from-amber-400 to-amber-600',
  };

  // Check-in function
  const handleCheckIn = () => {
    const today = new Date().toDateString();
    if (lastCheckIn === today) return; // Already checked in today

    const yesterday = new Date(Date.now() - 86400000).toDateString();
    const newConsecutiveDays = lastCheckIn === yesterday ? consecutiveDays + 1 : 1;
    const baseReward = 10;
    const bonusReward = Math.min(newConsecutiveDays - 1, 6) * 5; // Max 30 bonus coins for 7 days
    const totalReward = baseReward + bonusReward;

    const newCoins = coins + totalReward;
    const newExp = exp + 10;

    setCoins(newCoins);
    setExp(newExp);
    setLastCheckIn(today);
    setConsecutiveDays(newConsecutiveDays);

    localStorage.setItem('seer_coins', newCoins.toString());
    localStorage.setItem('seer_exp', newExp.toString());
    localStorage.setItem('seer_lastCheckIn', today);
    localStorage.setItem('seer_consecutiveDays', newConsecutiveDays.toString());

    // Check for level up
    checkLevelUp(newExp);
  };

  const checkLevelUp = (currentExp) => {
    if (proLevel < 5 && currentExp >= proLevels[proLevel].expRequired) {
      const newLevel = proLevel + 1;
      setProLevel(newLevel);
      localStorage.setItem('seer_proLevel', newLevel.toString());
    }
  };

  const isCheckedInToday = lastCheckIn === new Date().toDateString();

  // Purchase item
  const handlePurchase = (item) => {
    // Allow purchase by coins (legacy) OR diamonds (preferred for premium)
    if (!ownedItems.includes(item.id)) {
      if (coins >= item.price) {
        const newCoins = coins - item.price;
        const newOwnedItems = [...ownedItems, item.id];
        const newExp = exp + Math.floor(item.price / 10);
        setCoins(newCoins);
        setOwnedItems(newOwnedItems);
        setExp(newExp);
        localStorage.setItem('seer_coins', newCoins.toString());
        localStorage.setItem('seer_ownedItems', JSON.stringify(newOwnedItems));
        localStorage.setItem('seer_exp', newExp.toString());
        checkLevelUp(newExp);
        return;
      }
      // Try diamonds if coins insufficient (1 diamond assumed equals 1 coin price unit for items)
      if (diamonds >= item.price) {
        const newDiamonds = diamonds - item.price;
        const newOwnedItems = [...ownedItems, item.id];
        const newExp = exp + Math.floor(item.price / 10);
        setDiamonds(newDiamonds);
        setOwnedItems(newOwnedItems);
        setExp(newExp);
        localStorage.setItem('seer_diamonds', newDiamonds.toString());
        localStorage.setItem('seer_ownedItems', JSON.stringify(newOwnedItems));
        localStorage.setItem('seer_exp', newExp.toString());
        checkLevelUp(newExp);
      }
    }
  };

  // Equip item
  const handleEquip = (item, category) => {
    const newEquippedItems = { ...equippedItems, [category]: item.id };
    setEquippedItems(newEquippedItems);
    localStorage.setItem('seer_equippedItems', JSON.stringify(newEquippedItems));
  };

  // Unequip item
  const handleUnequip = (category) => {
    const newEquippedItems = { ...equippedItems };
    delete newEquippedItems[category];
    setEquippedItems(newEquippedItems);
    localStorage.setItem('seer_equippedItems', JSON.stringify(newEquippedItems));
  };

  // Coin packages
  const coinPackages = [
    { coins: 500, price: 0.99, bonus: 0 },
    { coins: 1200, price: 1.99, bonus: 200 },
    { coins: 3000, price: 4.99, bonus: 600 },
    { coins: 6500, price: 9.99, bonus: 1500 },
    { coins: 15000, price: 19.99, bonus: 5000 },
  ];

  // Diamonds packages (fixed pricing)
  const diamondPackages = [
    { diamonds: 70, price: 1 },
    { diamonds: 800, price: 10 },
    { diamonds: 10000, price: 100 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`h-screen flex flex-col transition-colors ${
        darkMode ? "bg-slate-900" : "bg-slate-50"
      }`}
    >
      {/* Header */}
      <div className={`px-4 py-3 border-b flex items-center justify-between ${
        darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
      }`}>
        <button
          onClick={() => navigateTo("mine")}
          className={`p-2 rounded-full transition-colors ${
            darkMode ? "hover:bg-slate-700" : "hover:bg-slate-100"
          }`}
        >
          <ChevronLeft className={`w-5 h-5 ${darkMode ? "text-slate-300" : "text-slate-600"}`} />
        </button>
        <div className={`text-lg font-bold ${darkMode ? "text-slate-100" : "text-slate-800"}`}>
          {t("memberCenter", language)}
        </div>
        <div className="w-9" /> {/* Spacer */}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-6">
        {activeTab === 'overview' && (
          <div className="px-4 pt-4 space-y-4">
            {/* Level Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`rounded-2xl p-6 shadow-lg bg-gradient-to-br ${currentLevelData.color} relative`}
            >
              {/* Small frosted glass Recharge button in the top-right corner */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigateTo('pro-upgrade')}
                className="absolute top-4 right-16 px-3 py-1.5 rounded-full text-xs font-semibold text-white shadow-lg border border-white/20 bg-blue-500/20 backdrop-blur-md hover:bg-blue-400/25"
              >
                {t("recharge", language)}
              </motion.button>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-white text-2xl font-bold mb-1">{currentLevelData.name}</div>
                  <div className="text-white/80 text-sm">{t("currentLevel", language)}</div>
                </div>
                <div className="text-white text-4xl">
                  <Crown className="w-12 h-12" />
                </div>
              </div>
              
              {nextLevelData && (
                <>
                  <div className="bg-white/20 rounded-full h-3 mb-2 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${expProgress}%` }}
                      className="bg-white h-full rounded-full"
                      transition={{ duration: 1, ease: "easeOut" }}
                    />
                  </div>
                  <div className="flex justify-between text-white/90 text-xs">
                    <span>{exp} EXP</span>
                    <span>{expToNext} {t("expToNextLevel", language)}</span>
                    <span>{nextLevelData.name}</span>
                  </div>
                </>
              )}
              {!nextLevelData && (
                <div className="text-white/90 text-sm text-center">
                  🎉 {t("pro5", language)} - Maximum Level! 🎉
                </div>
              )}
            </motion.div>

              {/* Coins, Diamonds & Check-in Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className={`rounded-2xl p-6 shadow-lg ${
                darkMode ? "bg-slate-800" : "bg-white"
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
                      <Coins className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className={`text-2xl font-bold ${darkMode ? "text-slate-100" : "text-slate-800"}`}>
                        {coins}
                      </div>
                      <div className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                        {t("coins", language)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-fuchsia-500 to-pink-500 flex items-center justify-center">
                      <Gem className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className={`text-2xl font-bold ${darkMode ? "text-slate-100" : "text-slate-800"}`}>
                        {diamonds}
                      </div>
                      <div className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                        {t("diamonds", language)}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigateTo('diamond-recharge')}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold text-sm shadow-lg"
                  >
                    {t("buyDiamonds", language)}
                  </motion.button>
                </div>
              </div>

              {/* Check-in Section */}
              <div className={`border-t pt-4 ${darkMode ? "border-slate-700" : "border-slate-200"}`}>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className={`font-semibold mb-1 ${darkMode ? "text-slate-200" : "text-slate-700"}`}>
                      {t("dailyCheckIn", language)}
                    </div>
                    <div className={`text-xs ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                      {t("consecutiveDays", language)}: {consecutiveDays} 🔥
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: isCheckedInToday ? 1 : 1.05 }}
                    whileTap={{ scale: isCheckedInToday ? 1 : 0.95 }}
                    onClick={handleCheckIn}
                    disabled={isCheckedInToday}
                    className={`px-6 py-2 rounded-xl font-semibold text-sm shadow-lg transition-all ${
                      isCheckedInToday
                        ? darkMode
                          ? "bg-slate-700 text-slate-500 cursor-not-allowed"
                          : "bg-slate-200 text-slate-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-green-400 to-emerald-500 text-white"
                    }`}
                  >
                    {isCheckedInToday ? (
                      <span className="flex items-center gap-1">
                        <CheckCircle className="w-4 h-4" />
                        {t("checkedIn", language)}
                      </span>
                    ) : (
                      t("checkIn", language)
                    )}
                  </motion.button>
                </div>
              </div>
            </motion.div>

            {/* Level Benefits */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className={`rounded-2xl p-6 shadow-lg ${
                darkMode ? "bg-slate-800" : "bg-white"
              }`}
            >
              <div className={`text-lg font-bold mb-4 flex items-center gap-2 ${darkMode ? "text-slate-100" : "text-slate-800"}`}>
                <Sparkles className="w-5 h-5 text-amber-500" />
                {t("levelPrivileges", language)}
              </div>
              <div className="space-y-2">
                {currentLevelData.benefits.map((benefit, index) => (
                  <div
                    key={index}
                    className={`flex items-center gap-2 text-sm ${darkMode ? "text-slate-300" : "text-slate-600"}`}
                  >
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-4">
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab('shop')}
                className={`rounded-2xl p-6 shadow-lg flex flex-col items-center gap-3 ${
                  darkMode ? "bg-slate-800" : "bg-white"
                }`}
              >
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-400 to-rose-600 flex items-center justify-center">
                  <ShoppingBag className="w-8 h-8 text-white" />
                </div>
                <div className={`font-semibold ${darkMode ? "text-slate-200" : "text-slate-700"}`}>
                  {t("coinShop", language)}
                </div>
              </motion.button>

              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.35 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab('items')}
                className={`rounded-2xl p-6 shadow-lg flex flex-col items-center gap-3 ${
                  darkMode ? "bg-slate-800" : "bg-white"
                }`}
              >
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center">
                  <Gift className="w-8 h-8 text-white" />
                </div>
                <div className={`font-semibold ${darkMode ? "text-slate-200" : "text-slate-700"}`}>
                  {t("myItems", language)}
                </div>
              </motion.button>
            </div>
          </div>
        )}

        {activeTab === 'shop' && (
          <div className="px-4 pt-4 space-y-4">
            {/* Back Button */}
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex items-center gap-2 text-sm font-semibold ${
                darkMode ? "text-indigo-400" : "text-indigo-600"
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              {t("back", language)}
            </button>

            {/* Category Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {['frames', 'outfits', 'accessories', 'effects'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl font-semibold text-sm whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg"
                      : darkMode
                      ? "bg-slate-800 text-slate-300"
                      : "bg-white text-slate-600"
                  }`}
                >
                  {t(cat === 'frames' ? 'avatarFrames' : cat, language)}
                </button>
              ))}
            </div>

            {/* Shop Items Grid */}
            <div className="grid grid-cols-2 gap-4">
              {shopItems[selectedCategory].map((item) => {
                const isOwned = ownedItems.includes(item.id);
                const isEquipped = equippedItems[selectedCategory] === item.id;

                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`rounded-2xl p-4 shadow-lg ${
                      darkMode ? "bg-slate-800" : "bg-white"
                    }`}
                  >
                    <div className={`w-full aspect-square rounded-xl bg-gradient-to-br ${rarityColors[item.rarity]} flex items-center justify-center text-6xl mb-3`}>
                      {item.image}
                    </div>
                    <div className={`font-semibold text-sm mb-1 ${darkMode ? "text-slate-200" : "text-slate-700"}`}>
                      {item.name}
                    </div>
                    <div className="flex items-center gap-1 mb-3">
                      <Coins className="w-4 h-4 text-amber-500" />
                      <span className={`text-sm font-bold ${darkMode ? "text-slate-300" : "text-slate-600"}`}>
                        {item.price}
                      </span>
                    </div>
                    {isOwned ? (
                      isEquipped ? (
                        <button
                          onClick={() => handleUnequip(selectedCategory)}
                          className="w-full py-2 rounded-lg bg-gradient-to-r from-green-400 to-emerald-500 text-white text-xs font-semibold"
                        >
                          {t("equipped", language)}
                        </button>
                      ) : (
                        <button
                          onClick={() => handleEquip(item, selectedCategory)}
                          className={`w-full py-2 rounded-lg text-xs font-semibold ${
                            darkMode
                              ? "bg-slate-700 text-slate-200"
                              : "bg-slate-200 text-slate-700"
                          }`}
                        >
                          {t("equip", language)}
                        </button>
                      )
                    ) : (
                      <button
                        onClick={() => handlePurchase(item)}
                        disabled={coins < item.price && diamonds < item.price}
                        className={`w-full py-2 rounded-lg text-xs font-semibold ${
                          coins >= item.price || diamonds >= item.price
                            ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white"
                            : darkMode
                            ? "bg-slate-700 text-slate-500 cursor-not-allowed"
                            : "bg-slate-200 text-slate-400 cursor-not-allowed"
                        }`}
                      >
                        {t("purchase", language)}
                      </button>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'items' && (
          <div className="px-4 pt-4 space-y-4">
            {/* Back Button */}
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex items-center gap-2 text-sm font-semibold ${
                darkMode ? "text-indigo-400" : "text-indigo-600"
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              {t("back", language)}
            </button>

            {ownedItems.length === 0 ? (
              <div className={`text-center py-12 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                <Gift className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <div className="text-lg font-semibold mb-2">No items yet</div>
                <div className="text-sm">Visit the shop to purchase items!</div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(shopItems).flatMap(([category, items]) =>
                  items
                    .filter((item) => ownedItems.includes(item.id))
                    .map((item) => {
                      const isEquipped = equippedItems[category] === item.id;

                      return (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className={`rounded-2xl p-4 shadow-lg ${
                            darkMode ? "bg-slate-800" : "bg-white"
                          }`}
                        >
                          <div className={`w-full aspect-square rounded-xl bg-gradient-to-br ${rarityColors[item.rarity]} flex items-center justify-center text-6xl mb-3`}>
                            {item.image}
                          </div>
                          <div className={`font-semibold text-sm mb-3 ${darkMode ? "text-slate-200" : "text-slate-700"}`}>
                            {item.name}
                          </div>
                          {isEquipped ? (
                            <button
                              onClick={() => handleUnequip(category)}
                              className="w-full py-2 rounded-lg bg-gradient-to-r from-green-400 to-emerald-500 text-white text-xs font-semibold"
                            >
                              {t("equipped", language)}
                            </button>
                          ) : (
                            <button
                              onClick={() => handleEquip(item, category)}
                              className={`w-full py-2 rounded-lg text-xs font-semibold ${
                                darkMode
                                  ? "bg-slate-700 text-slate-200"
                                  : "bg-slate-200 text-slate-700"
                              }`}
                            >
                              {t("equip", language)}
                            </button>
                          )}
                        </motion.div>
                      );
                    })
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}

/* =================== SPLASH SCREEN / LOADING PAGE =================== */
function SplashScreen({ onComplete }) {
  React.useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="h-full flex flex-col items-center justify-center"
      style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}
    >
      {/* Logo */}
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6, type: "spring" }}
        className="flex flex-col items-center gap-6"
      >
        <img 
          src="/icon.png" 
          alt="SEER Logo" 
          className="w-32 h-32 rounded-3xl shadow-2xl object-cover"
        />
        <div className="text-white text-4xl font-bold tracking-wider">SEER</div>
        <div className="text-white/80 text-sm">Social • Engage • Explore • Relax</div>
      </motion.div>

      {/* Loading Animation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-16 flex flex-col items-center gap-4"
      >
        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ 
                y: [0, -15, 0],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{ 
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2
              }}
              className="w-3 h-3 rounded-full bg-white"
            />
          ))}
        </div>
        <div className="text-white/60 text-sm">Loading...</div>
      </motion.div>
    </motion.div>
  );
}

/* =================== ROOT (Preview Switcher) =================== */
const pagesList = [
  { id: "splash", label: "Splash Screen" },
  { id: "login", label: "Login" },
  { id: "register", label: "Registration" },
  { id: "home", label: "Homepage" },
  { id: "games", label: "Games" },
  { id: "gomoku-lobby", label: "Gomoku Lobby" },
  { id: "gomoku-game", label: "Gomoku Game" },
  { id: "ai-loading", label: "AI Loading" },
  { id: "ai-hub", label: "AI Hub" },
  { id: "ai-chat", label: "AI Chat" },
  { id: "ai-image", label: "AI Images" },
  { id: "ai-music", label: "AI Music" },
  { id: "ai-video", label: "AI Video" },
  { id: "chat", label: "Chat" },
  { id: "chat-detail-c001", label: "Chat - Charlie" },
  { id: "chat-detail-g001", label: "Chat - Project Group" },
  { id: "chat-detail-c002", label: "Chat - Emma" },
  { id: "add-friend", label: "Add Friend" },
  { id: "create-post", label: "Create Post" },
  { id: "earth", label: "Map" },
  { id: "building-chat", label: "Building Chat" },
  { id: "mine", label: "Mine" },
  { id: "settings", label: "Settings" },
  { id: "change-password", label: "Change Password" },
  { id: "bind-email", label: "Bind Email" },
  { id: "bind-phone", label: "Bind Phone" },
  { id: "forgot-password", label: "Forgot Password" },
  { id: "forgot-password-email", label: "FP - Email" },
  { id: "forgot-password-phone", label: "FP - Phone" },
  { id: "reset-password", label: "Reset Password" },
  { id: "diamond-recharge", label: "Diamond Recharge" },
  { id: "live-stream-setup", label: "Live Setup" },
  { id: "live-stream-broadcasting", label: "Live Broadcasting" },
  { id: "watch-live-stream", label: "Watch Live" },
  { id: "voice-call", label: "Voice Call" },
  { id: "video-call", label: "Video Call" },
  { id: "activities-list", label: "Activities" },
  { id: "create-activity", label: "Create Activity" },
  { id: "activity-detail", label: "Activity Detail" },
  { id: "admin-dashboard", label: "Admin" },
];

export default function SEERMockups() {
  const [activePage, setActivePage] = useState("splash");
  const [showSplash, setShowSplash] = useState(true);
  const [gameOptions, setGameOptions] = useState({});
  
  // Load settings from localStorage with defaults (Light mode - English)
  const [language, setLanguage] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('seer_language') || 'en';
    }
    return 'en';
  });
  
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('seer_darkMode') === 'true';
    }
    return false;
  });

  const navigateTo = (pageId, options = {}) => {
    setActivePage(pageId);
    setGameOptions(options);
  };

  const handleSplashComplete = () => {
    setShowSplash(false);
    setActivePage("login");
  };

  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage);
    if (typeof window !== 'undefined') {
      localStorage.setItem('seer_language', newLanguage);
    }
  };

  const handleDarkModeChange = (newDarkMode) => {
    setDarkMode(newDarkMode);
    if (typeof window !== 'undefined') {
      localStorage.setItem('seer_darkMode', newDarkMode.toString());
    }
  };

  const renderPage = () => {
    if (activePage === "splash") {
      return <SplashScreen onComplete={handleSplashComplete} />;
    }
    
    switch(activePage) {
      case "login":
        return <LoginPage navigateTo={navigateTo} language={language} darkMode={darkMode} />;
      case "register":
        return <RegistrationPage navigateTo={navigateTo} language={language} darkMode={darkMode} />;
      case "home":
        return <HomePage navigateTo={navigateTo} language={language} darkMode={darkMode} />;
      case "games":
        return <GamesPage navigateTo={navigateTo} language={language} darkMode={darkMode} />;
      case "gomoku-loading":
        return <GomokuLoadingScreen navigateTo={navigateTo} language={language} darkMode={darkMode} />;
      case "gomoku-lobby":
        return <GomokuLobby navigateTo={navigateTo} language={language} darkMode={darkMode} />;
      case "gomoku-game":
        return <GomokuGameScreen navigateTo={navigateTo} language={language} darkMode={darkMode} {...gameOptions} />;
      case "chess-loading":
        return <ChessLoadingScreen navigateTo={navigateTo} language={language} darkMode={darkMode} />;
      case "chess-lobby":
        return <ChessLobby navigateTo={navigateTo} language={language} darkMode={darkMode} />;
      case "chess-game":
        return <ChessGameScreen navigateTo={navigateTo} language={language} darkMode={darkMode} {...gameOptions} />;
      case "ai-loading":
        return <AILoadingScreen navigateTo={navigateTo} language={language} darkMode={darkMode} />;
      case "ai-hub":
        return <AIHub navigateTo={navigateTo} language={language} darkMode={darkMode} />;
      case "ai-chat":
        return <AIChatScreen navigateTo={navigateTo} language={language} darkMode={darkMode} {...gameOptions} />;
      case "ai-image":
        return <AIImageScreen navigateTo={navigateTo} language={language} darkMode={darkMode} />;
      case "ai-music":
        return <AIMusicScreen navigateTo={navigateTo} language={language} darkMode={darkMode} />;
      case "ai-video":
        return <AIVideoScreen navigateTo={navigateTo} language={language} darkMode={darkMode} />;
      case "admin-dashboard":
        return <AdminDashboardPage navigateTo={navigateTo} language={language} darkMode={darkMode} />;
      case "chat":
        return <ChatPage navigateTo={navigateTo} language={language} darkMode={darkMode} />;
      case "chat-detail-c001":
        return <ChatDetailPage navigateTo={navigateTo} language={language} darkMode={darkMode} />;
      case "chat-settings-c001":
        return <ChatSettingsPage navigateTo={navigateTo} language={language} darkMode={darkMode} />;
      case "chat-detail-g001":
        return <ProjectGroupChatDetail navigateTo={navigateTo} language={language} darkMode={darkMode} />;
      case "group-settings-g001":
        return <GroupChatSettingsPage navigateTo={navigateTo} language={language} darkMode={darkMode} />;
      case "chat-detail-c002":
        return <EmmaChatDetail navigateTo={navigateTo} language={language} darkMode={darkMode} />;
      case "add-friend":
        return <AddFriendPage navigateTo={navigateTo} language={language} darkMode={darkMode} />;
      case "create-post":
        return <CreatePostPage navigateTo={navigateTo} language={language} darkMode={darkMode} />;
      case "post-detail":
        return <PostDetailPage navigateTo={navigateTo} language={language} darkMode={darkMode} postId={gameOptions.postId} />;
      case "search":
        return <SearchPage navigateTo={navigateTo} language={language} darkMode={darkMode} />;
      case "earth":
        return <EarthMapPage navigateTo={navigateTo} language={language} darkMode={darkMode} />;
      case "building-chat":
        return <BuildingChatRoom navigateTo={navigateTo} language={language} darkMode={darkMode} buildingId={gameOptions.buildingId || 'lib01'} />;
      case "mine":
        return <ProfilePage navigateTo={navigateTo} language={language} darkMode={darkMode} />;
      case "settings":
        return <SettingsPage navigateTo={navigateTo} language={language} darkMode={darkMode} onLanguageChange={handleLanguageChange} onDarkModeChange={handleDarkModeChange} />;
      case "change-password":
        return <ChangePasswordPage navigateTo={navigateTo} language={language} darkMode={darkMode} />;
      case "bind-email":
        return <BindEmailPage navigateTo={navigateTo} language={language} darkMode={darkMode} />;
      case "bind-phone":
        return <BindPhonePage navigateTo={navigateTo} language={language} darkMode={darkMode} />;
      case "forgot-password":
        return <ForgotPasswordPage navigateTo={navigateTo} language={language} darkMode={darkMode} />;
      case "forgot-password-email":
        return <ForgotPasswordEmailPage navigateTo={navigateTo} language={language} darkMode={darkMode} />;
      case "forgot-password-phone":
        return <ForgotPasswordPhonePage navigateTo={navigateTo} language={language} darkMode={darkMode} />;
      case "reset-password":
        return <ResetPasswordPage navigateTo={navigateTo} language={language} darkMode={darkMode} />;
      case "pro-upgrade":
        return <ProUpgradePage navigateTo={navigateTo} language={language} darkMode={darkMode} />;
      case "diamond-recharge":
        return <DiamondRechargePage navigateTo={navigateTo} language={language} darkMode={darkMode} />;
      case "member-center":
        return <MemberCenterPage navigateTo={navigateTo} language={language} darkMode={darkMode} />;
      case "live-stream-setup":
        return <LiveStreamSetupPage navigateTo={navigateTo} language={language} darkMode={darkMode} />;
      case "live-stream-broadcasting":
        return <LiveStreamBroadcastingPage navigateTo={navigateTo} language={language} darkMode={darkMode} {...gameOptions} />;
      case "watch-live-stream":
        return <WatchLiveStreamPage navigateTo={navigateTo} language={language} darkMode={darkMode} {...gameOptions} />;
      case "voice-call":
        return <VoiceCallPage navigateTo={navigateTo} language={language} darkMode={darkMode} {...gameOptions} />;
      case "video-call":
        return <VideoCallPage navigateTo={navigateTo} language={language} darkMode={darkMode} {...gameOptions} />;
      case "activities-list":
        return <ActivitiesListPage navigateTo={navigateTo} language={language} darkMode={darkMode} />;
      case "create-activity":
        return <CreateActivityPage navigateTo={navigateTo} language={language} darkMode={darkMode} />;
      case "activity-detail":
        return <ActivityDetailPage navigateTo={navigateTo} language={language} darkMode={darkMode} {...gameOptions} />;
      case "edit-profile":
        return <EditProfilePage navigateTo={navigateTo} language={language} darkMode={darkMode} />;
      case "user-profile":
        return <UserProfilePage navigateTo={navigateTo} language={language} darkMode={darkMode} userId={gameOptions.userId} />;
      case "friend-groups":
        return <FriendGroupsPage navigateTo={navigateTo} language={language} darkMode={darkMode} />;
      case "friends-list":
        return <FriendsListPage navigateTo={navigateTo} language={language} darkMode={darkMode} />;
      case "fans-list":
        return <FansListPage navigateTo={navigateTo} language={language} darkMode={darkMode} />;
      case "following-list":
        return <FollowingListPage navigateTo={navigateTo} language={language} darkMode={darkMode} />;
      case "topic-page":
        return <TopicPage navigateTo={navigateTo} language={language} darkMode={darkMode} topic={gameOptions.topic} />;
      default:
        return <LoginPage navigateTo={navigateTo} language={language} darkMode={darkMode} />;
    }
  };

  return (
    <div className={`min-h-screen ${palette.bg} text-slate-800 px-4 py-6`}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-6"
        >
          <div className="flex items-center gap-3">
            <img 
              src="/icon.png" 
              alt="SEER Logo" 
              className="w-10 h-10 rounded-2xl shadow-lg object-cover"
            />
            <div className="text-2xl font-bold text-slate-800">SEER - XJTLU Social App</div>
          </div>
          
          {/* Page Navigation */}
          <div className="flex gap-2 overflow-x-auto">
            {pagesList.map((page, index) => (
              <motion.button
                key={page.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => navigateTo(page.id)}
                className={`px-3 py-2 rounded-lg text-sm font-medium border transition-all whitespace-nowrap ${
                  activePage === page.id 
                    ? "bg-indigo-600 text-white border-indigo-600 shadow-lg" 
                    : "bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm text-slate-700"
                }`}
              >
                {page.label}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Device Frame with Active Page */}
        <motion.div
          key={activePage}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <DeviceFrame title={pagesList.find((p) => p.id === activePage)?.label || ""}>
            {renderPage()}
          </DeviceFrame>
        </motion.div>

      </div>
    </div>
  );
}
