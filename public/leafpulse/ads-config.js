// Website ad settings for the Pest Patrol mini game (Google AdSense, H5 game ad breaks).
// Ads stay OFF until `client` holds your AdSense publisher ID (looks like ca-pub-1234567890123456).
// The ID is public (it appears in every page that shows ads), so it is fine to keep it here.
window.LP_ADS = {
  client: '',          // ca-pub-…  (empty = no ads, the game just continues)
  test: false,         // true = Google test ads (no earnings); use while the account is being reviewed
  frequency: '90s'     // at most one between-round ad every 90 seconds
};
