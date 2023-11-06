import { Switch } from "react-native-gesture-handler"
import { Chat } from "../Screens/ScreensIndex"

export default {
    Welcome_to_BharatBit: 'Welcome to BharatBit',
    create_Password: "Create Password",
    change_Password: "Update Password",

    log_in: "Login",
    forgot_Password: "Forgot Password",
    Enter_your_email_send_email: "Enter your email, we will send you an email with link to recover your account",
    enterTitle: 'Enter title',
    enterDiscription: 'Enter discription',
    enterMessage: 'Enter message',

    otp_verification: 'OTP Verification',
    enter_Six_Diagit_code: 'Enter six digit code sent on your mobile number',
    signUp_Subtitle: "You're good to go! Buy/sell crypto, set up recurring \n buys for your investments.",
    alreadyHaveAccount: "Already have an account?",
    dont_recive_otp: "Didn’t receive otp?",
    dont_have_account: `Don’t have an account?`,
    by_registering_you_are_agreeing: "By registering, you are agreeing with our",
    terms_of_use: "Terms of Use",
    and: "and",
    privacy_policy: "Privacy Policy",
    crete_an_offer_to_sell_your_crypto_easily: "Create an offer to sell your crypto easily",
    want_to_sell_your_cripto: "Want to Sell your crypto",
    i_want_to_buy: "I want to buy",
    sort: "Sort",
    country: "Country",
    enterOtp: 'Enter OTP',
    sell_crypto: 'Sell Crypto',
    Modify_Offer: 'Modify Offer',
    on_the_most_secure: 'On the most secure system',
    what_you_want_to_sell: 'What you want to sell?',
    Bitcoin: 'Bitcoin',
    Ethereum: 'Ethereum',
    USDT: 'USDT',
    Bitcoin_Amount: 'Bitcoin Amount',
    Amount: 'Amount',
    Enter_Manually: 'Enter Manually',
    Available_Amount: "Available Amount:",
    Amount_From_Wallet: 'Amount From Wallet',
    PayMent_Methods: 'Payment Methods',

    Sell_at: 'Sell at',
    Market_price:'Market price',
    Fixed_Price:'Fixed price',
    Sell_at_customisedPrice:'Sell at customized market price',
    Do_you_want_to_sell_partially:'Do you want to sell partially',
    Min_Ammount:'Min Amount',
    Max_Ammmount:'Max Amount',

    Bitcoin_Amount: 'Bitcoin Amount',
    member_Since: 'Member Since',
    Location: 'Location',
    Payment_Method: 'Payment Method',
    UPI: 'UPI',
    Bank_transfer: 'Bank Transfer',
    IMPS: 'IMPS',
    RTGS: 'RTGS',
    PayPal: 'PayPal',
    PhonePe: 'PhonePe',
    Title: 'Title',
    Description: 'Description',
    Wallet: 'Wallet',
    Trades: 'Trades',
    Deal_Details: "Deal Details",
    Deal_History: "Deal History",

    Order_placed_on: "Order placed on ",
    Actions: 'Actions',
    online: "Online",
    Recieved: "Recieved",
    Release: "Release",

    Paid: "Paid",
    Pending: "Pending",
    Cancel_Deal:'Cancel Deal',
    Not_Recieved: "Not Recieved",
    Raise_Dispute: "Raise a Dispute",
    orderPlacedOn: 'Order placed on',
    below_Market_Price: 'below market price',
    above_Market_Price: 'above market price',
    same_As_Market_Price: 'Same as market price',
    unread: 'Unread',
    chat: 'Chat',
    // MARK :-  Place holders
    email: 'Email',
    phoneNumb: 'Phone Number',
    firstName: "First Name",
    lasName: "Last Name",
    firstName: "First Name",
    emailAddress: "Email Address",
    searchTrade: "Search Trade",
    mobileNumber: "Mobile number",
    password: "Password",
    oldPassword: "Old Password",
    newPassword: "New Password",
    confirmNewpassword: "Confirm new Password",
    confrmPassword: "Confirm Password",
    loading: 'loading',
    // Error message
    Network_Failed: 'Oops! Something went wrong! ',
    User_Alreay_Exist: 'User Already Exist!',
    Button_Ok: 'OK',
    My_Offers: 'My Offers',
    Total: "Total",
    Wallet: 'Wallet',
    Offer_Details:'Offer Details',
    Transactions:'Transactions',
    Trade_History:'Trade History',
    Offer_History:'Offer History',

    Transactions_Filters:'Transactions Filters',
    Trade_Filters:'Trade Filters',


    Transaction_Id:'Transaction ID',
    Time:'Time',
    Filter:'Filter',
    Transaction_Detail:'Transaction Detail',
    No_File_Chossen:'No file choosen',
    Attatch_Media_ : 'Attach Media(pdf,png,jpg)',
    Whats_Problm_can_we_help:'What problem can we help you with?',
    Price:'Price',
    SortedBy:'Sorted By',
    Dispute_Type:'Select dispute type',
    Support_Type:'Support type',
    Support:'Support',
    OnlyOneItemSentAtTime:'Only one file sent at time',
    tradeId : 'Trade Id',
    offerId : 'Offer Id',

    Partial_order:'Partial Order',

    Partial_order_available:'Partial order available'
}

export const defaultMessage =(offerDetail,userDetail)=>{
    console.log('offerDetail offerDetail : --',offerDetail)
    console.log('userDetail userDetail : --',userDetail)
    const ofrDtl = offerDetail//?.offerDetail
    // const userDetail = offerDetail?.userDetail
return(
    `1.${userDetail?.username || ''} is selling you ${ofrDtl?.quantity || '0'} ${ofrDtl?.coin || 'coin'}.\n2. You must pay ${ofrDtl?.selling_price ||''} CA via ${(ofrDtl?.payment || '')}.\n3. You will share your transaction details below.\n4. When you have sent the money, please mark the trade as 'paid'.\n5. (It really helps if you upload a screenshot or PDF as a receipt of payment too.)\n6. Then wait for ${userDetail?.username || ''} to confirm they have received payment.\n7. When they do they will release your ${(ofrDtl?.symbol || '').toUpperCase()} and the trade will be completed.`
)
}
export const disputeMessage =()=>{
return(
"Issue has been raised on this deal.kindly check your registered email for further communication with moderator."
)
}