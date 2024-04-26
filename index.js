const express = require("express");
var cors = require("cors");
//let adminControllers = require('./controllers/adminControllers');
//const sms = require('./successfull-add-sms');
const bodyParser = require("body-parser");
//const cron =require('node-cron');
const connection = require("./config/database");

const adminRoute = require("./routes/admin");
const memberRoute = require("./routes/create-member");

const fetchNamesWithRigId = require("./routes/fetch-names-with-rig-ids")
const findPhoneByLastThreeDigitRigId = require("./routes/find-phone-last-three-digit-rig-id")

const fetchFranchiseLastThreeMonthsTarget = require("./routes/fetch-franchise-last-three-months-target")
const fetchMemberLastThreeMonthsTarget = require("./routes/fetch-member-last-three-months-target")
const upgradeFranchiseToBMM = require("./routes/upgrde-franchise-to-bmm")
const downgradeBmm = require("./routes/downgrade-bmm.js")
const downgradeFranchise = require("./routes/downgrade-franchise.js")

const fetchAllVerifedAndUnverifiedBank = require("./routes/fetch-all-verified-and-unverified-bank")
const fliterPayoutTotalAndMonthlyWise =  require("./routes/fliter-payout-total-and-monthlywise")
const miningpartnerRoute = require("./routes/create-mining-partner");
const verifyBank = require("./routes/verify-bank")
const createMultipleRig = require("./routes/create-multiple-rig")
const fetchPartnerAndMultipleRig = require("./routes/fetch-partner-and-multiple-rig")

const queryResolve = require('./routes/queryResolve')
const fetchBond = require('./routes/fetchBond')
const memberLoginRoute = require("./routes/member-login");
const memberPortalProfileDetailsRoute = require("./routes/fetch-member");
const miningPartnerLoginRoute = require("./routes/mining-partner-login");
const miningPortalProfileDetailsRoute = require("./routes/fetch-mining-partner-details");

const fetchBmmLastThreeMonthsTarget = require('./routes/fetch-bmm-last-three-months-target')
const addPartnerBankDetails = require("./routes/partner_bank_details");
const fetchPartnerBankDetails = require("./routes/fetch-partner-bank-details");

const memberBankDetailsRoute = require("./routes/member-bank-details");
const editMemberBankDetails = require("./routes/member/edit-member-bank-details")
const fetchMemberBankDetails = require("./routes/fetch-member-bank-details");

const updateMemberData = require("./routes/member-data-update");
const updateMemberBankData = require("./routes/member-bank-data-update");

const updatePartnerData = require("./routes/partner-data-update");

const fetchMemberRefferalid = require("./routes/member-refferali-id");
const fetchPartnerRefferalid = require("./routes/partner-refferal-id");

const fetchMemberMyteam = require("./routes/member-myteam");
const fetchPartnerMyteam = require("./routes/partner-myteam");

const fetchPartnerWallet = require("./routes/partner-wallet");
const fetchMemebrMyteamFromPartner = require("./routes/fetch-member-myteam-details-from-partner");

//const updatePartnerWallet = require('./routes/update-partner-wallet');
const upgradeMemberToFranchise = require("./routes/upgrade-member-to-franchise.js")
const fetchMiningPartnerWallet = require("./routes/fetch-mining-partner-wallet");

const fetchPartnerWalletDailyHistory = require("./routes/fetch-partner-wallet-daily-history");
const fetchAllPartnerTotalWalletAmountFromAdmin = require("./routes/fetch-All-partner-wallet-total-amount-from-admin");

const fetchSumOfAllPartnerLiquidity = require("./routes/fetch-sum-of-all-partner-liquidity");

const fetchAllActivePartnerOnly = require("./routes/fetch-all-active-partner-only");

const FetchPartnerWithdrawalRequestToAdmin = require("./routes/partner-withdrawal-request-to-admin");
const approvePartnerWithdrawalRequest = require("./routes/approve-partner-withdrawal-request");

const fecthPartnerApproveWithdrawalHistory = require("./routes/fetch-partner-approve-withdrawal-history");
const fecthPartnerApproveWithdrawalHistoryForPartner = require("./routes/fetch-partner-approve-withdrawal-history-for-partner");

const fetchSumOfPartnerAllWithdrawal = require("./routes/fetch-sum-of-partner-all-withdrawal");

const fetchMemberWalletDailyHistory = require("./routes/fetch-member-wallet-daily-history");
const fetchSumOfMemberWalletForMonth = require("./routes/fetch-sum-of-member-wallet");
const fetchSumOfMemberWalletOfMonthForAdmin = require("./routes/fetch-sum-of-member-wallet-amount-for-admin");
const fetchSumOfMemberWalletOfMonth = require("./routes/fetch-sum-of-member-wallet-of-one-month");
const memberWithdrawalRequestToAdmin = require("./routes/member-withdrawal-request-to-admin");
const approveMemberWithdrawalRequest = require("./routes/approve-member-withdrawal-request");
const fetchMemberApproveWithdrawalHistoryForMember = require("./routes/fetch-member-approve_withdrawal-history-for-member");
const fetchMemberApproveWithdrawalHistoryForAdmin = require("./routes/fetch-member-approve-withdrawal-history-for-admin");
const fetchSumOfMemberTotalWithdrawal = require("./routes/fetch-sum-of-member-total-withdrawal");
const fetchPartnerWithdrawalRequestForPartner = require("./routes/fetch-partner-withdrawal-request-for-partner");
const fetchMemberWithdrawalRequest = require("./routes/fetch-member-withdrawal-request");
const fetchMemberProfileDetailsFromAdmin = require("./routes/fetch-member-profile-details-from-admin");
const updateMemberProfileDetailsFromAdmin = require("./routes/update-member-profile-details-from-admin");
const fetchMiningPartnerProfileDetailsFromAdmin = require("./routes/fetch-mining-partner-profile-details-from-admin");
const updateMiningPartnerProfileDetailsFromAdmin = require("./routes/update-mining-partner-profile-details-from-admin");
const memberSignup = require("./routes/member-signup");
const partnerSignup = require("./routes/partner-signup");
const perdayPartnerWalletAmount = require("./routes/perday-partner-wallet-amount");
const fetchAllPendingPartnerOnly = require("./routes/fetch-All-Pending-Partner-Only");

const forgetPasswordMember = require("./routes/forget-password-member");
const verifyOtp = require("./routes/veryfiy-otp-member");
const memberRegeneratePassword = require("./routes/member-regenerate-password");

const partnerForgetPassword = require("./routes/partner-forget-password");
const verifyOtpPartner = require("./routes/verify-otp-partner");
const partnerRegeneratePassword = require("./routes/partner-Regenerate-Password");
const isPartnerActiveManualFromAdmin = require("./routes/ispartner-active-manual-from-admin");
const doActivatePartnerManualFromAdmin = require("./routes/doactivate-partner-manual-from-admin");
const perdayAmountTransferToPartnerManual = require("./routes/perday-amount-transfer-to-partner-manaul");
const particularPerdayPartnerWithdrawalRequestFromAdmin = require("./routes/particular-partner-withdrawal-request-from-admin");
const particularPartnerApprovedWithdrawalHistoryFromAdmin = require("./routes/particular-partner-approved-withdrawal-history-from-admin");
const fetchLastPaymentDate = require("./routes/fetch-last-payment-date");
const partnerRefferalPerDayWalletHistory = require("./routes/partner-refferal-perday-wallet-history");
const isPartnerActiveFromPartner = require("./routes/isPartner-active-from-partner");
const approveRefferPartnerWithdrawalRequest = require("./routes/approve-reffer-partner-withdrawal-request");
const fetchPartnerRefferalWithdrawalRequest = require("./routes/fetch-partner-refferal-withdrawal-request");
const fetchPartnerRefferalApproveWithdrawal = require("./routes/fetch-partner-refferal-approve-withdrawal");
const fetchPartnerRefferalWithdrawalHistoryFromPartner = require("./routes/fetch-partner-refferal-withdrawal-history-from-partner");
const fetchMemberRefferWithdrawalRequestFromAdmin = require("./routes/fetch-member-reffer-withdrawal-request-from-admin");
const approveMemberRefferWithdrawalRequest = require("./routes/approve-member-reffer-withdrawal-request");
const fetchMemberRefferApproveWithdrawalHostoryFromAdmin = require("./routes/fetch-member-reffer-approve-withdrawal-history-from-admin");
const fetchRefferalPartnerDetailsFromMember = require("./routes/fetch-refferal-partner-details-from-member");
const fetchMemberLastPayout = require("./routes/fetch-member-last-payout");
const fetchRefferPartnerWithdrawalRequest = require("./routes/fetch-reffer-partner-withdrawal-request");
const fetchRefferPartnerWithdrawalSuccessHistory = require("./routes/fetch-reffer-partner-withdrawal-success-history");
const uploadPartnershipBond = require("./routes/upload-partnership-bond");
const helpAndSupport = require("./routes/help-and-support");
const fetchHelpAndSupportQuery = require("./routes/fetch-help-and-support-query");
const fetchParticularHelpAndSupportQuery = require("./routes/fetch-particular-help-And-support-query");
const accountsPaidWithdrawal = require("./routes/accounts-paid-withdrawal-admin");
const fetchLiquidityForMemberSummary = require("./routes/fetch-Liquidity-for-member-summary");
const createSHO = require("./routes/create-sho");
const createFranchise = require("./routes/create-franchise");
const loginSHO = require("./routes/login-sho");
const loginFranchise = require("./routes/login-franchise");
const fetchParticularSHO = require("./routes/fetch-particular-sho");
const fetchParticularFranchise = require("./routes/fetch-particular-franchise");
const fetchAllStateOfSHO = require("./routes/fetch-all-state-of-sho");

const fetchAllFranchise = require("./routes/fetch-all-franchise");

const fetchAllOwnFranchiseInState = require("./routes/fetch-all-own-franchise-in-state");
const verifyFranchise = require("./routes/verify-franchise");
const CreateBankDetailsForSho = require("./routes/create-bank-details-for-sho");
const fetchBankDetails = require("./routes/fetch-bank-details");

const fetchAllSho = require('./routes/fetch-all-sho')
const blockAndUnblockSho = require('./routes/block-and-unblock-sho')
const verifySho = require('./routes/verify-sho')
const updateMember = require('./routes/update-member') 
const fetchPartnerByReferralIdOfPartner = require('./routes/fetchPartnerByReferralIdOfPartner')

// -----------------------admin-----------------------------//
const verifyMultipleRigPartner = require('./routes/verify-multiple-rig-partner')
const adminVerifyMember = require('./routes/admin-verify-member');
const adminBlockMember = require('./routes/admin-block-member');
const adminFetchAllMiningPartner = require('./routes/admin-fetch-all-mining-partner');
const adminVerifyPartner = require('./routes/admin-verify-partner');
const adminBlockUnblockPartner = require('./routes/admin-block-unblock-partner');
const approvePaymentRequestOfSho = require('./routes/state/approve-payment-request-of-sho');
const fetchParticularMemberWithdrawalRequest = require('./routes/fetch-particular-member-withdrawal-request'); 
const fetchPartnerReferWithdrawl = require('./routes/fetch-partner-refer-withdrawl')
 
const fetchPaymentRequestForAll = require('./routes/fetch-payment-request-for-all')
const fetchParticularPaymentApprove = require('./routes/fetch-particular-payment-approve')
const createBd = require('./routes/create-bd')
const fetchAllBd = require('./routes/fetch-all-bd')
const fetchParticularMemberApprovedWithdrawalHistory = require('./routes/fetch-particular-member-approved-withdrawal-history');
const fetchParticularPartner = require('./routes/fetch-particular-partner')
const approvePaymentRequestOfFranchise = require('./routes/approve-payment-request-of-franchise')
const approvePaymentRequestOfBd = require('./routes/approve-payment-request-of-bd')
const uploadAdharCardFrontSideMember = require('./routes/uplaod-adhar-card-front-side-member')
const uploadAdharCardBackSideMember = require('./routes/upload-adhar-card-back-side-member')
const uploadPanCardMember = require('./routes/upload-pan-card-member')
const uploadAdharCardFrontSideBd = require('./routes/uplaod-adhar-card-front-side-bd')
const uploadAdharCardBackSideBd = require('./routes/upload-adhar-card-back-side-bd')
const uploadPanCardBd = require('./routes/upload-pan-card-bd')
const uplaodAdharCardFrontSideFranchise = require('./routes/uplaod-adhar-card-front-side-franchise')
const uploadAdharCardBackSideFranchise = require('./routes/upload-adhar-card-back-side-franchise')
const uploadPanCardFranchise = require('./routes/upload-pan-card-franchise')
const uplaodAdharCardFrontSideSho = require('./routes/uplaod-adhar-card-front-side-sho')
const uploadAdharCardBackSideSho = require('./routes/upload-adhar-card-back-side-sho')
const uploadPanCardSho = require('./routes/upload-pan-card-sho')
const uplaodAdharCardFrontSidePartner = require('./routes/uplaod-adhar-card-front-side-partner')
const uplaodAdharCardBackSidePartner = require('./routes/uplaod-adhar-card-back-side-partner')
const uploadPanCardPartner = require('./routes/upload-pan-card-partner')
const fetchPartnerReferWithdrawlHistory = require('./routes/fetchPartnerReferWithdrawlHistory') 
const uploadBond = require('./routes/upload_bond')
const fetchQuery = require("./routes/fetchQuery")
const memberReferralPayoutHistory = require('./routes/member-referral-payout-history');
const fetchUnVerifiedMember = require('./routes/fetch-unVerified-member');
const fetchUnVerifiedFranchise = require('./routes/fetch-unVerified-franchise');
const fetchUnVerifiedBmm = require('./routes/fetch-unVerified-Bmm');
const fetchVerifiedMember = require('./routes/fetch-verified-member');
const fetchVerifiedBmm = require('./routes/fetch-verified-bmm');
const fetchVerifiedFranchise = require('./routes/fetch-verified-franchise');
const fetchUpgradeDowngradeFranchise = require('./routes/fetch-upgrade-downgrade-franchise');
const fetchUpgradeDowngradeBmm = require('./routes/fetch-upgrade-downgrade-bmm');
const createPartnerPayout = require('./routes/create-partner-payout')
const fetchPartnerByRigId = require('./routes/fetch-partner-by-rig-id')
const fetchPartnerPayouts = require('./routes/fetch-partner-payouts')
const fetchTotalReferralCountAndTodayReferralCount  = require('./routes/fetch-total-referral-count-and-today-referral-count')
const fetchTransactionHistory = require('./routes/fetch-transaction-history');
const createPartnerPayoutForMonthly = require('./routes/create-partner-payout-for-monthly')
const fetchReferralPayoutHistoryAdmin = require('./routes/fetch-referral-payout-history-admin');
const fetchAllPartnerPayoutCount = require('./routes/fetch-All-partner-payout-count');

// -------------------State ----------------------------------///
const totalcountFranchiseMemberPartner = require('./routes/state/total-count-franchise-member-partner')
const fetchOwnBankDetails = require('./routes/state/fetch-own-bank-details')
const updateSho = require('./routes/update-sho')
const createPaymentRequest = require('./routes/state/create-sho-payment-request')
const makePrimaryBank = require('./routes/state/make-primary-bank')
const fetchPrimaryBank = require('./routes/state/fetch-primary-bank')
const transferPartnerWithdrawlToWithdrawlHistory = require('./routes/transfer-Partner-Withdrawl-To-Withdrawl-History')
const statePartnerMyTeam = require('./routes/state/my-partner-team');  
const fetchPartnerByReferralId = require('./routes/state/fetchPartnerByReferralId')
const fetchReferralMyTeam = require('./routes/state/fetch-referral-my-team');

// ------------------------------------------------------------//

// ------------------------------franchise------------------------//
const franchiseAddBankDetails = require('./routes/frenchise/franchise-add-bank-details');
const fetchFranchiseBankDetails = require('./routes/frenchise/fetch-bank-details');
const createFranchisePaymentRequest = require('./routes/frenchise/create-franchise-payment-request')
const allBdDetailsReferredByFranchise = require('./routes/frenchise/all-bd-details-referred-by-franchise')
const totalCountMemberPartner = require('./routes/frenchise/total-count-member-partner')
const franchiseFetchPartnerMyTeam = require('./routes/frenchise/franchise-fetch-partner-my-team');
// ------------------------------------------------------------------//

const blockAndUnblockFranchise = require("./routes/block-and-unblock-franchise")
const updateFranchise = require('./routes/update-franchise')
const fetchTotalWithdrawal = require('./routes/frenchise/fetch-total-withdrawal');
const fetchPartnerMyTeam = require('./routes/frenchise/fetch-partner-my-team');

//========================bd======================================

const loginBd = require('./routes/bd/login-bd') 
const fetchParticularBd = require('./routes/bd/fetch-particular-bd')
const blockAndUnblockBd = require('./routes/bd/block-and-unblock-bd')
const verifyBd = require('./routes/bd/verify-bd')
const updateBd = require('./routes/bd/update-bd') 
const bdAddBankDetails = require('./routes/bd/bd-add-bank-details')
const createBdPaymentRequest = require('./routes/bd/create-bd-payment-request')
const fetchMembersReferredByBd = require('./routes/bd/fetch-members-referred-by-bd')
const fetchWithdrawalRequestHistroy = require('./routes/bd/fetch-withdrawal-request');
const fetchWithdrawalSuccessHistory = require('./routes/bd/fetch-withdrawal-sucess-history');
const businessDevTotalWithdrawal = require('./routes/bd/business-dev-total-withdrawal');
const businessDevFetchPartnerTeam = require('./routes/bd/businessDev-fetch-partner-team');

// --------------------------member------------------------//
const memberWithdrawalRequest = require('./routes/member/member-withdrawal-request');
const fetchUpgradedMember = require('./routes/member/fetch-upgraded-member');
const fetchMemberWallet = require('./routes/member/fetch-member-wallet')

const totalCountPartner = require('./routes/member/total-count-partner')
const fetchMemberTodaysAndTotolPayout = require ('./routes/member/fetch-member-todays-and-total-payout');


// ----------------------- portfolio-------------------------//
const fetchAllBmmFromPortfolio = require('./routes/portfolio/fetch-all-bmm');
const filterBmmByState = require('./routes/portfolio/filter-bmm-by-state');
const fetchAllFranchiseFromPortfolio = require('./routes/portfolio/fetch-all-franchise');
const filterFranchiseByState = require('./routes/portfolio/filter-franchise-by-state');

// --------------------------Partner-----------------------------------------//
const partnerFetchTransactionHistory = require('./routes/partner/fetch-transaction-history')
const fetchReferralPayoutForPartner = require ('./routes/partner/fetch-referral-payout-for-partner');
const fetchReferralPayoutTransactionTotal = require ('./routes/partner/fetch-referral-payout-transaction-total');
const myPayoutCount = require('./routes/partner/my-payout-count');

const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/admin", downgradeBmm)
app.use("/admin", fetchAllVerifedAndUnverifiedBank)
app.use("/admin", fetchBond)
app.use("/admin", uploadBond)
app.use("/admin", adminRoute);
app.use("/admin", memberRoute);
app.use("/admin", miningpartnerRoute);
app.use("/member", memberLoginRoute);
app.use("/member", memberPortalProfileDetailsRoute);
app.use("/mining", miningPartnerLoginRoute);
app.use("/mining", miningPortalProfileDetailsRoute);
app.use("/mining", addPartnerBankDetails);
app.use("/mining", fetchPartnerBankDetails);
app.use("/member", memberBankDetailsRoute);
app.use("/member", editMemberBankDetails)
app.use("/member", fetchMemberBankDetails);
app.use("/member", updateMemberData);
app.use("/member", updateMemberBankData);
app.use("/mining", updatePartnerData);
app.use("/member", fetchMemberRefferalid);
app.use("/mining", fetchPartnerRefferalid);
app.use("/member", fetchMemberMyteam);
app.use("/mining", fetchPartnerMyteam);
app.use("/mining", fetchPartnerWallet);
app.use("/member", fetchMemebrMyteamFromPartner);
//app.use('/mining',updatePartnerWallet);
app.use("/mining", fetchMiningPartnerWallet);
app.use("/mining", fetchPartnerWalletDailyHistory);
app.use("/admin", fetchAllPartnerTotalWalletAmountFromAdmin);
app.use("/admin", fetchSumOfAllPartnerLiquidity);
app.use("/admin", fetchAllActivePartnerOnly);
app.use("/admin", FetchPartnerWithdrawalRequestToAdmin);
app.use("/admin", approvePartnerWithdrawalRequest);
app.use("/admin", fecthPartnerApproveWithdrawalHistory);
app.use("/mining", fecthPartnerApproveWithdrawalHistoryForPartner);
app.use("/mining", fetchSumOfPartnerAllWithdrawal);
app.use("/member", fetchMemberWalletDailyHistory);
app.use("/member", fetchSumOfMemberWalletForMonth);
app.use("/admin", fetchSumOfMemberWalletOfMonthForAdmin);
app.use("/member", fetchSumOfMemberWalletOfMonth);
app.use("/admin", memberWithdrawalRequestToAdmin);
app.use("/admin", approveMemberWithdrawalRequest);
app.use("/member", fetchMemberApproveWithdrawalHistoryForMember);
app.use("/admin", fetchMemberApproveWithdrawalHistoryForAdmin);
app.use("/member", fetchSumOfMemberTotalWithdrawal);
app.use("/mining", fetchPartnerWithdrawalRequestForPartner);
app.use("/member", fetchMemberWithdrawalRequest);
app.use("/admin", fetchMemberProfileDetailsFromAdmin);
app.use("/admin", updateMemberProfileDetailsFromAdmin);
app.use("/admin", fetchMiningPartnerProfileDetailsFromAdmin);
app.use("/admin", updateMiningPartnerProfileDetailsFromAdmin);
app.use("/signup", memberSignup);
app.use("/signup", partnerSignup);
app.use("/signup", createMultipleRig)
app.use("/mining", perdayPartnerWalletAmount);
app.use("/admin", fetchAllPendingPartnerOnly);
app.use("/member", forgetPasswordMember);
app.use("/member", verifyOtp);
app.use("/member", memberRegeneratePassword);
app.use("/mining", partnerForgetPassword);
app.use("/mining", verifyOtpPartner);
app.use("/mining", partnerRegeneratePassword);
app.use("/admin", isPartnerActiveManualFromAdmin);
app.use("/admin", doActivatePartnerManualFromAdmin);
app.use("/admin", perdayAmountTransferToPartnerManual);
app.use("/admin", particularPerdayPartnerWithdrawalRequestFromAdmin);
app.use("/admin", particularPartnerApprovedWithdrawalHistoryFromAdmin);
app.use("/admin", fetchLastPaymentDate);
app.use("/mining", partnerRefferalPerDayWalletHistory);
app.use("/mining", isPartnerActiveFromPartner);
app.use("/admin", approveRefferPartnerWithdrawalRequest);
app.use("/admin", fetchPartnerRefferalWithdrawalRequest);
app.use("/admin", fetchPartnerRefferalApproveWithdrawal);
app.use("/mining", fetchPartnerRefferalWithdrawalHistoryFromPartner);
app.use("/admin", fetchMemberRefferWithdrawalRequestFromAdmin);
app.use("/admin", approveMemberRefferWithdrawalRequest);
app.use("/admin", fetchMemberRefferApproveWithdrawalHostoryFromAdmin);
app.use("/member", fetchRefferalPartnerDetailsFromMember);
app.use("/member", fetchMemberLastPayout);
app.use("/mining", fetchRefferPartnerWithdrawalRequest);
app.use("/mining", fetchRefferPartnerWithdrawalSuccessHistory);
app.use("/admin", uploadPartnershipBond);
app.use("/mining", helpAndSupport);
app.use("/admin", fetchHelpAndSupportQuery);
app.use("/admin", fetchParticularHelpAndSupportQuery);
app.use("/admin", accountsPaidWithdrawal);
app.use("/member", fetchLiquidityForMemberSummary);
app.use("/admin", createSHO);
app.use("/admin", createFranchise);
app.use("/admin", createBd)
app.use("/state", loginSHO);
app.use("/franchise", loginFranchise);
app.use("/state", fetchParticularSHO);
app.use("/franchise", fetchParticularFranchise);
app.use("/state", fetchAllStateOfSHO);
app.use("/admin", fetchAllFranchise);
app.use("/state", fetchAllOwnFranchiseInState);
app.use("/franchise", verifyFranchise);
app.use("/state", CreateBankDetailsForSho);
app.use("/admin", fetchBankDetails);
app.use('/admin', blockAndUnblockFranchise)
app.use('/admin', fetchAllSho)
app.use("/admin", blockAndUnblockSho)
app.use("/state", verifySho)
app.use("/member", updateMember)
app.use("/mining", fetchParticularPartner)
app.use("/mining", fetchPartnerByReferralIdOfPartner)

app.use('/mining', fetchPartnerReferWithdrawl)
app.use('/admin', transferPartnerWithdrawlToWithdrawlHistory)
app.use('/admin', fetchPartnerReferWithdrawlHistory)

app.use("/mining", fetchPartnerAndMultipleRig)

// --------------------------admin-------------------//4
app.use("/admin", upgradeMemberToFranchise)
app.use("/admin", fetchMemberLastThreeMonthsTarget)
app.use("/admin", upgradeFranchiseToBMM)
app.use("/admin", downgradeFranchise)
app.use('/admin', verifyBank)
app.use('/admin', fliterPayoutTotalAndMonthlyWise)
app.use('/admin', verifyMultipleRigPartner)
app.use("/admin", fetchQuery)
app.use('/admin', queryResolve)
app.use('/admin', transferPartnerWithdrawlToWithdrawlHistory)
app.use('/admin',adminVerifyMember);
app.use('/admin',adminBlockMember);
app.use('/admin',adminFetchAllMiningPartner);
app.use('/admin',adminVerifyPartner);
app.use('/admin',adminBlockUnblockPartner);
app.use('/admin', approvePaymentRequestOfSho)
app.use('/admin', fetchPaymentRequestForAll)
app.use('/admin', fetchParticularPaymentApprove)
app.use('/admin', fetchAllBd)
app.use('/admin',fetchParticularMemberWithdrawalRequest);
app.use('/admin',fetchParticularMemberApprovedWithdrawalHistory);
app.use('/admin', approvePaymentRequestOfFranchise)
app.use('/admin', approvePaymentRequestOfBd)
app.use('/admin', uploadAdharCardFrontSideMember)
app.use('/admin', uploadAdharCardBackSideMember)
app.use('/admin', uploadPanCardMember)
app.use('/admin', uploadAdharCardFrontSideBd)
app.use('/admin', uploadAdharCardBackSideBd)
app.use('/admin', uploadPanCardBd)
app.use('/admin',fetchVerifiedBmm)

app.use('/admin', fetchBmmLastThreeMonthsTarget)
app.use('/admin', fetchFranchiseLastThreeMonthsTarget)

app.use('/admin', uplaodAdharCardFrontSideFranchise)
app.use('/admin', uploadAdharCardBackSideFranchise)
app.use('/admin', uploadPanCardFranchise)
app.use('/admin', uplaodAdharCardFrontSideSho)
app.use('/admin', uploadAdharCardBackSideSho)
app.use('/admin', uploadPanCardSho)
app.use('/admin', uplaodAdharCardFrontSidePartner)
app.use('/admin', uplaodAdharCardBackSidePartner)
app.use('/admin', uploadPanCardPartner )
app.use('/admin',memberReferralPayoutHistory);
app.use('/admin',fetchUnVerifiedMember);
app.use('/admin',fetchUnVerifiedFranchise);
app.use('/admin',fetchUnVerifiedBmm);
app.use('/admin',fetchVerifiedMember);
app.use('/admin',fetchVerifiedFranchise);
app.use('/admin',fetchUpgradeDowngradeFranchise);
app.use('/admin',fetchUpgradeDowngradeBmm);
app.use('/admin', createPartnerPayout)
app.use('/admin', fetchPartnerByRigId)
app.use('/admin', fetchPartnerPayouts)
app.use('/admin', fetchTotalReferralCountAndTodayReferralCount)
app.use('/admin',fetchTransactionHistory);
app.use('/admin', createPartnerPayoutForMonthly)
app.use('/admin',fetchReferralPayoutHistoryAdmin);
app.use('/admin', findPhoneByLastThreeDigitRigId)
app.use('/admin', fetchNamesWithRigId)
app.use('/admin',fetchAllPartnerPayoutCount);



// --------------------state------------------------///
app.use('/state',fetchOwnBankDetails);
app.use('/state', updateSho)
app.use('/state', createPaymentRequest)
app.use('/state', makePrimaryBank)
app.use('/state', fetchPrimaryBank)
app.use('/state',statePartnerMyTeam);
app.use('/state', fetchPartnerByReferralId)
app.use('/state', totalcountFranchiseMemberPartner)
app.use('/state',fetchReferralMyTeam);

// ---------------------------------------------------//

// ----------------------franchise--------------------//
app.use('/franchise',franchiseAddBankDetails);
app.use('/franchise',fetchFranchiseBankDetails);

app.use('/franchise', updateFranchise)
app.use('/franchise', createFranchisePaymentRequest)
app.use('/franchise', allBdDetailsReferredByFranchise)
app.use('/franchise',fetchTotalWithdrawal);
app.use('/franchise',fetchPartnerMyTeam);
app.use('/franchise',franchiseFetchPartnerMyTeam)

//==========================Business Dev=============================//
app.use('/bd', loginBd)
app.use('/bd', fetchParticularBd)
app.use('/bd', blockAndUnblockBd)
app.use('/bd', verifyBd)
app.use('/bd', updateBd)
app.use('/bd', bdAddBankDetails)
app.use('/bd', createBdPaymentRequest)
app.use('/bd', fetchMembersReferredByBd)
app.use('/bd',fetchWithdrawalRequestHistroy);
app.use('/bd',fetchWithdrawalSuccessHistory);
app.use('/bd',businessDevTotalWithdrawal);
app.use('/bd',businessDevFetchPartnerTeam);


// --------------------------member--------------------//
app.use('/member',memberWithdrawalRequest);
app.use('/member',fetchUpgradedMember);
app.use('/member', fetchMemberWallet)
app.use('/franchise', totalCountMemberPartner)
app.use('/member', totalCountPartner)
app.use('/member',fetchMemberTodaysAndTotolPayout);


// -----------------------portfolio-------------------//
app.use('/portfolio',fetchAllBmmFromPortfolio);
app.use('/portfolio',filterBmmByState);
app.use('/portfolio',fetchAllFranchiseFromPortfolio);
app.use('/portfolio',filterFranchiseByState);

// ------------------------Partner-------------------------//
app.use('/mining',partnerFetchTransactionHistory);
app.use('/mining',fetchReferralPayoutForPartner);
app.use('/mining',fetchReferralPayoutTransactionTotal);
app.use('/mining',myPayoutCount);


module.exports = app;
