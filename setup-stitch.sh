#!/bin/bash

# Configuration
STITCH_PACKAGE="@google/stitch-mcp"
CONFIG_DIR="$HOME/Library/Application Support/Claude"
CONFIG_FILE="$CONFIG_DIR/claude_desktop_config.json"

echo "🛠️  Starting Stitch MCP Setup..."

# 1. Check for gcloud
if ! command -v gcloud &> /dev/null; then
    echo "❌ Error: gcloud CLI is not installed or not in your PATH."
    echo "👉 Please install Google Cloud SDK: https://cloud.google.com/sdk/docs/install"
    echo "   Then run: gcloud auth login"
    exit 1
fi

echo "✅ gcloud CLI found."

# 2. Check Authentication
if ! gcloud auth print-access-token &> /dev/null; then
    echo "⚠️  You are not logged in to gcloud."
    echo "👉 Running 'gcloud auth login'..."
    gcloud auth login
fi

# 3. Get Project ID
CURRENT_PROJECT=$(gcloud config get-value project 2>/dev/null)
if [ -z "$CURRENT_PROJECT" ] || [ "$CURRENT_PROJECT" == "(unset)" ]; then
    echo "⚠️  No default Google Cloud project set."
    echo -n "👉 Please enter your Stitch Google Cloud Project ID: "
    read PROJECT_ID
else
    echo "ℹ️  Current project: $CURRENT_PROJECT"
    echo -n "👉 Use this project for Stitch? (Y/n): "
    read USE_CURRENT
    if [[ "$USE_CURRENT" =~ ^[Nn] ]]; then
         echo -n "👉 Enter Stitch Google Cloud Project ID: "
         read PROJECT_ID
    else
        PROJECT_ID="$CURRENT_PROJECT"
    fi
fi

if [ -z "$PROJECT_ID" ]; then
    echo "❌ Error: Project ID cannot be empty."
    exit 1
fi

# 4. Install/Update Package
echo "📦 Installing/Updating stitch-mcp..."
npm install -g stitch-mcp

# 5. Configure MCP
# Check if config exists, create if not
if [ ! -d "$CONFIG_DIR" ]; then
    mkdir -p "$CONFIG_DIR"
fi

if [ ! -f "$CONFIG_FILE" ]; then
    echo "{}" > "$CONFIG_FILE"
fi

# We will use a temporary node script to update the JSON safely
node -e "
const fs = require('fs');
const configFile = '$CONFIG_FILE';
const projectId = '$PROJECT_ID';
try {
    const config = JSON.parse(fs.readFileSync(configFile, 'utf8'));
    config.mcpServers = config.mcpServers || {};
    config.mcpServers['stitch'] = {
        command: 'npx',
        args: ['-y', 'stitch-mcp'],
        env: {
            GOOGLE_CLOUD_PROJECT: projectId
        }
    };
    fs.writeFileSync(configFile, JSON.stringify(config, null, 2));
    console.log('✅ Added stitch to mcpServers in ' + configFile);
} catch (e) {
    console.error('❌ Error updating config:', e);
    process.exit(1);
}
"

echo ""
echo "🎉 Setup Complete!"
echo "👉 Please restart Claude Desktop to load the new MCP server."
