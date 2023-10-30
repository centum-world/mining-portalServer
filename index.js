const express = require("express");
var cors = require("cors");
//let adminControllers = require('./controllers/adminControllers');
//const sms = require('./successfull-add-sms');
const bodyParser = require("body-parser");
//const cron =require('node-cron');
const connection = require("./config/database");
const adminRoute = require("./routes/admin");
const memberRoute = require("./routes/create-member");
const miningpartnerRoute = require("./routes/create-mining-partner");

const memberLoginRoute = require("./routes/member-login");
const memberPortalProfileDetailsRoute = require("./routes/fetch-member");
const miningPartnerLoginRoute = require("./routes/mining-partner-login");
const miningPortalProfileDetailsRoute = require("./routes/fetch-mining-partner-details");

const addPartnerBankDetails = require("./routes/partner_bank_details");
const fetchPartnerBankDetails = require("./routes/fetch-partner-bank-details");

const memberBankDetailsRoute = require("./routes/member-bank-details");
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
const adminVerifyMember = require('./routes/admin-verify-member');
const adminBlockMember = require('./routes/admin-block-member');
const adminFetchAllMiningPartner = require('./routes/admin-fetch-all-mining-partner');
const adminVerifyPartner = require('./routes/admin-verify-partner');
const adminBlockUnblockPartner = require('./routes/admin-block-unblock-partner');
const approvePaymentRequestOfSho = require('./routes/state/approve-payment-request-of-sho');
const fetchParticularMemberWithdrawalRequest = require('./routes/fetch-particular-member-withdrawal-request');
 
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
// -------------------State ----------------------------------///
const fetchOwnBankDetails = require('./routes/state/fetch-own-bank-details')
const updateSho = require('./routes/update-sho')
const createPaymentRequest = require('./routes/state/create-sho-payment-request')
const makePrimaryBank = require('./routes/state/make-primary-bank')
const fetchPrimaryBank = require('./routes/state/fetch-primary-bank')

// ------------------------------------------------------------//

// ------------------------------franchise------------------------//
const franchiseAddBankDetails = require('./routes/frenchise/franchise-add-bank-details');
const fetchFranchiseBankDetails = require('./routes/frenchise/fetch-bank-details');
const createFranchisePaymentRequest = require('./routes/frenchise/create-franchise-payment-request')
const allBdDetailsReferredByFranchise = require('./routes/frenchise/all-bd-details-referred-by-franchise')
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

const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
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


// --------------------------admin-------------------//

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

app.use('/admin', uplaodAdharCardFrontSideFranchise)
app.use('/admin', uploadAdharCardBackSideFranchise)
app.use('/admin', uploadPanCardFranchise)
app.use('/admin', uplaodAdharCardFrontSideSho)
app.use('/admin', uploadAdharCardBackSideSho)
app.use('/admin', uploadPanCardSho)
app.use('/admin', uplaodAdharCardFrontSidePartner)
app.use('/admin', uplaodAdharCardBackSidePartner)
app.use('/admin', uploadPanCardPartner )

// --------------------state------------------------///
app.use('/state',fetchOwnBankDetails);
app.use('/state', updateSho)
app.use('/state', createPaymentRequest)
app.use('/state', makePrimaryBank)
app.use('/state', fetchPrimaryBank)

// ---------------------------------------------------//

// ----------------------franchise--------------------//
app.use('/franchise',franchiseAddBankDetails);
app.use('/franchise',fetchFranchiseBankDetails);

app.use('/franchise', updateFranchise)
app.use('/franchise', createFranchisePaymentRequest)
app.use('/franchise', allBdDetailsReferredByFranchise)
app.use('/franchise',fetchTotalWithdrawal);
app.use('/franchise',fetchPartnerMyTeam);

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


module.exports = app;
