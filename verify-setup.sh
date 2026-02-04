#!/bin/bash
# Ovi English School - Setup Verification Script
# Run this to check everything is configured correctly

echo "═══════════════════════════════════════════════════════"
echo "🎓 OVI ENGLISH SCHOOL - Setup Verification"
echo "═══════════════════════════════════════════════════════"
echo ""

PASS=0
FAIL=0

check() {
    if [ $1 -eq 0 ]; then
        echo "✅ $2"
        ((PASS++))
    else
        echo "❌ $2"
        ((FAIL++))
    fi
}

# 1. Project files
echo "📁 Checking project files..."
[ -f "src/orchestrator.js" ]; check $? "orchestrator.js exists"
[ -f "src/news-fetcher.js" ]; check $? "news-fetcher.js exists"
[ -f "src/content-adapter.js" ]; check $? "content-adapter.js exists"
[ -f "src/audio-generator.py" ]; check $? "audio-generator.py exists"
[ -f "src/video-converter.py" ]; check $? "video-converter.py exists"
[ -f "src/youtube-uploader.js" ]; check $? "youtube-uploader.js exists"
[ -f "src/rss-generator.js" ]; check $? "rss-generator.js exists"
[ -f "src/metadata-generator.js" ]; check $? "metadata-generator.js exists"
echo ""

# 2. Configuration
echo "⚙️  Checking configuration..."
[ -f ".env" ]; check $? ".env file exists"
[ -f "package.json" ]; check $? "package.json exists"
[ -d "node_modules" ]; check $? "node_modules installed"
echo ""

# 3. YouTube auth
echo "🎬 Checking YouTube setup..."
[ -f "client_secret.json" ]; check $? "client_secret.json exists"
[ -f "youtube_token.json" ]; check $? "youtube_token.json exists (authenticated)"
echo ""

# 4. Qwen3-TTS
echo "🎙️  Checking Qwen3-TTS..."
[ -d "$HOME/qwen3-tts" ]; check $? "qwen3-tts directory exists"
[ -f "$HOME/qwen3-tts/.venv/bin/python" ]; check $? "Python venv exists"
command -v ffmpeg &> /dev/null; check $? "FFmpeg installed"
echo ""

# 5. API Key
echo "🔑 Checking API keys..."
if [ -f ".env" ]; then
    grep -q "GEMINI_API_KEY=AIza" .env 2>/dev/null
    check $? "Gemini API key configured"
else
    echo "❌ Gemini API key not configured"
    ((FAIL++))
fi
echo ""

# 6. Output directory
echo "📂 Checking output..."
[ -d "output" ]; check $? "output directory exists"
EPISODES=$(find output -name "*.mp3" 2>/dev/null | wc -l | tr -d ' ')
echo "   📊 Episodes generated: $EPISODES"
echo ""

# Summary
echo "═══════════════════════════════════════════════════════"
echo "📋 SUMMARY: $PASS passed, $FAIL failed"
echo "═══════════════════════════════════════════════════════"

if [ $FAIL -eq 0 ]; then
    echo ""
    echo "🎉 All checks passed! Your setup is complete."
    echo ""
    echo "Quick commands:"
    echo "  npm start              # Generate new episode"
    echo "  npm run publish        # Publish to YouTube + RSS"
    echo ""
else
    echo ""
    echo "⚠️  Some checks failed. Please fix the issues above."
fi
