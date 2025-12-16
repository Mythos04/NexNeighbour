# Repository Privacy Settings

## Setting the Repository to Private

To change the NexNeighbour repository from public to private, follow these steps:

### Via GitHub Web Interface

1. **Navigate to Repository Settings**
   - Go to https://github.com/Mythos04/NexNeighbour
   - Click on the "Settings" tab (requires admin access)

2. **Change Repository Visibility**
   - Scroll down to the "Danger Zone" section at the bottom of the Settings page
   - Click on "Change visibility"
   - Select "Make private"
   - Confirm the action by typing the repository name when prompted

### Important Notes

- Only repository administrators can change visibility settings
- Making a repository private will:
  - Restrict access to only invited collaborators
  - Remove the repository from public search results
  - Disable public forks (existing forks remain but become detached)
  - Make all issues, pull requests, and discussions private

### Alternative: Using GitHub CLI

If you have the GitHub CLI (`gh`) installed and authenticated:

```bash
gh repo edit Mythos04/NexNeighbour --visibility private
```

## Current Status

As of this commit, the repository visibility must be changed manually through the GitHub web interface as it requires administrative access and cannot be modified through code changes alone.
