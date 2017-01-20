# More documentation about how to customize your build
# can be found here:
# https://docs.fastlane.tools
fastlane_version "1.109.0"

default_platform :ios

# Fastfile actions accept additional configuration, but
# don't worry, fastlane will prompt you for required
# info which you can add here later
# Is not used, there is some bug
lane :beta do
  # upload to Testflight
  pilot(username: "maistho@gmail.com", ipa: "../iFiske Fiskekort.ipa")
end
