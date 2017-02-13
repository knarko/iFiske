## How to install CI for iOS
1. Get a MacOS machine that you can have running 24/7.
2. Set up auto login on that machine for a user account (for some reason MacOS demands that the user logs in for gitlab-multi-runner to run.). Run the rest of these commands as that user.
3. Install gitlab-multi-runner with the tag ios. I chose the shell executor, but docker should also do fine.
4. Install a recent version of node and npm, preferably using homebrew.
5. Add the gem folder to your PATH, by adding `export PATH="$(ruby -e 'puts Gem.user_dir')/bin:$PATH" to your `~/.bash_profile`.
6. Also add the GEM_HOME environment variable by adding `export GEM_HOME=$HOME/.gem` to your `~/.bash_profile`
7. Install fastlane by running `gem install fastlane`. You might also need to add `--user-install` to make it install correctly.
8. Create a fastlane session by running `fastlane spaceauth -u <your_email>`. Put the session token in gitlabs web interface.
9. Add a user to your ionic app, preferably with a good random password. Add the users email in `IONIC_EMAIL` and the users password in `IONIC_PASSWORD` in gitlabs web interface.
10. Push code to gitlab, watch the magic happen!

## Troubleshooting
- Make sure that rubygems is the latest version by running `sudo gem update --system`
